import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Event from '@/models/Event';

// GET /api/events - Get all events
export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const rambuSolo = searchParams.get('rambuSolo');
        const upcoming = searchParams.get('upcoming');
        const limit = searchParams.get('limit');
        const category = searchParams.get('category');
        const search = searchParams.get('q');
        const page = searchParams.get('page');

        // Build query
        const query: Record<string, unknown> = { isPublished: true };

        if (rambuSolo === 'true') {
            query.isRambuSolo = true;
            // For Rambu Solo section: only show future events, sorted by date ASC, limit 5
            query.startDate = { $gte: new Date() };
        } else if (rambuSolo === 'false') {
            query.isRambuSolo = false;
        }

        if (upcoming === 'true') {
            query.startDate = { $gte: new Date() };
        }

        if (category && category !== 'all') {
            query.category = category;
        }

        if (search) {
            query.$or = [
                { 'title.id': { $regex: search, $options: 'i' } },
                { 'title.en': { $regex: search, $options: 'i' } },
                { 'description.id': { $regex: search, $options: 'i' } },
                { 'description.en': { $regex: search, $options: 'i' } },
            ];
        }

        // Execute query
        const pageNum = page ? parseInt(page) : 1;
        let limitNum = limit ? parseInt(limit) : 50;

        // For Rambu Solo section, default limit is 5
        if (rambuSolo === 'true' && !limit) {
            limitNum = 5;
        }

        // For regular events (non-Rambu Solo), also default limit to 5
        if (!rambuSolo && !limit) {
            limitNum = 5;
        }

        const skip = (pageNum - 1) * limitNum;

        const [events, total] = await Promise.all([
            Event.find(query)
                .sort({ startDate: 1 })
                .skip(skip)
                .limit(limitNum)
                .lean(),
            Event.countDocuments(query),
        ]);

        return NextResponse.json({
            success: true,
            data: events,
            count: events.length,
            total,
            totalPages: Math.ceil(total / limitNum),
        });
    } catch (error) {
        console.error('Error fetching events:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch events' },
            { status: 500 }
        );
    }
}

// POST /api/events - Create new event
export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        const body = await request.json();
        const event = await Event.create(body);

        return NextResponse.json({
            success: true,
            data: event,
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating event:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create event' },
            { status: 500 }
        );
    }
}
