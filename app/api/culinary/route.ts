import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Culinary from '@/models/Culinary';

// GET /api/culinary - Get all culinary items
export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const search = searchParams.get('q');
        const limit = searchParams.get('limit');
        const page = searchParams.get('page');
        const featured = searchParams.get('featured');

        const query: Record<string, unknown> = { isPublished: true };

        if (category && category !== 'all') {
            query.category = category;
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
            ];
        }

        const pageNum = page ? parseInt(page) : 1;
        const limitNum = limit ? parseInt(limit) : 50;
        const skip = (pageNum - 1) * limitNum;

        const [items, total] = await Promise.all([
            Culinary.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNum)
                .lean(),
            Culinary.countDocuments(query),
        ]);

        return NextResponse.json({
            success: true,
            data: items,
            count: items.length,
            total,
            totalPages: Math.ceil(total / limitNum),
        });
    } catch (error) {
        console.error('Error fetching culinary items:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch culinary items' },
            { status: 500 }
        );
    }
}

// POST /api/culinary - Create new culinary item
export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        const body = await request.json();
        const item = await Culinary.create(body);

        return NextResponse.json({
            success: true,
            data: item,
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating culinary item:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create culinary item' },
            { status: 500 }
        );
    }
}
