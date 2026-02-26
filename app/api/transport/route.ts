import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Transport from '@/models/Transport';

// GET /api/transport - Get all transport options
export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const search = searchParams.get('q');
        const limit = searchParams.get('limit');
        const page = searchParams.get('page');

        const query: Record<string, unknown> = { isPublished: true };

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

        const pageNum = page ? parseInt(page) : 1;
        const limitNum = limit ? parseInt(limit) : 50;
        const skip = (pageNum - 1) * limitNum;

        const [items, total] = await Promise.all([
            Transport.find(query)
                .sort({ isFeatured: -1, createdAt: -1 })
                .skip(skip)
                .limit(limitNum)
                .lean(),
            Transport.countDocuments(query),
        ]);

        return NextResponse.json({
            success: true,
            data: items,
            count: items.length,
            total,
            totalPages: Math.ceil(total / limitNum),
        });
    } catch (error) {
        console.error('Error fetching transport:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch transport' },
            { status: 500 }
        );
    }
}

// POST /api/transport - Create new transport option
export async function POST(request: NextRequest) {
    try {
        await dbConnect();
        const body = await request.json();
        const transport = await Transport.create(body);

        return NextResponse.json({
            success: true,
            data: transport,
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating transport:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create transport' },
            { status: 500 }
        );
    }
}
