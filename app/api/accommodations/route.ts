import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Accommodation from '@/models/Accommodation';

// GET /api/accommodations - Get all accommodations
export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const featured = searchParams.get('featured');
        const limit = searchParams.get('limit');
        const search = searchParams.get('q');
        const page = searchParams.get('page');

        // Build query
        const query: Record<string, unknown> = { isPublished: true };

        if (category && category !== 'all') {
            query.category = category; // 'hotel', 'homestay', 'resort', 'guesthouse'
        }

        if (featured === 'true') {
            query.isFeatured = true;
        }

        if (search) {
            query.$or = [
                { 'title.id': { $regex: search, $options: 'i' } },
                { 'title.en': { $regex: search, $options: 'i' } },
                { 'description.id': { $regex: search, $options: 'i' } },
                { 'description.en': { $regex: search, $options: 'i' } },
                { address: { $regex: search, $options: 'i' } },
            ];
        }

        // Execute query
        const pageNum = page ? parseInt(page) : 1;
        const limitNum = limit ? parseInt(limit) : 50;
        const skip = (pageNum - 1) * limitNum;

        const [accommodations, total] = await Promise.all([
            Accommodation.find(query)
                .sort({ isFeatured: -1, createdAt: -1 }) // Featured first, then newest
                .skip(skip)
                .limit(limitNum)
                .lean(),
            Accommodation.countDocuments(query),
        ]);

        return NextResponse.json({
            success: true,
            data: accommodations,
            count: accommodations.length,
            total,
            totalPages: Math.ceil(total / limitNum),
        });
    } catch (error) {
        console.error('Error fetching accommodations:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch accommodations' },
            { status: 500 }
        );
    }
}

// POST /api/accommodations - Create new accommodation
export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        const body = await request.json();
        const accommodation = await Accommodation.create(body);

        return NextResponse.json({
            success: true,
            data: accommodation,
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating accommodation:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create accommodation' },
            { status: 500 }
        );
    }
}
