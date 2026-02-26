import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Destination from '@/models/Destination';

// GET /api/destinations - Get all destinations
export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const featured = searchParams.get('featured');
        const limit = searchParams.get('limit');

        // Build query
        const query: Record<string, unknown> = { isPublished: true };

        if (category && category !== 'all') {
            query.category = category;
        }

        if (featured === 'true') {
            query.isFeatured = true;
        }

        // Execute query
        let destinationsQuery = Destination.find(query).sort({ rating: -1 });

        if (limit) {
            destinationsQuery = destinationsQuery.limit(parseInt(limit));
        }

        const destinations = await destinationsQuery.lean();

        return NextResponse.json({
            success: true,
            data: destinations,
            count: destinations.length,
        });
    } catch (error) {
        console.error('Error fetching destinations:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch destinations' },
            { status: 500 }
        );
    }
}

// POST /api/destinations - Create new destination (protected)
export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        const body = await request.json();
        const destination = await Destination.create(body);

        return NextResponse.json({
            success: true,
            data: destination,
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating destination:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create destination' },
            { status: 500 }
        );
    }
}
