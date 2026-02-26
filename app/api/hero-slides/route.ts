import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import HeroSlide from '@/models/HeroSlide';

// GET /api/hero-slides - Get active slides (public) or all (admin)
export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const isAdmin = searchParams.get('admin') === 'true';
        const page = searchParams.get('page');

        const query: Record<string, unknown> = isAdmin ? {} : { isActive: true };
        if (page) query.page = page;

        const slides = await HeroSlide.find(query)
            .sort({ order: 1, createdAt: -1 })
            .lean();

        return NextResponse.json({
            success: true,
            data: slides,
            count: slides.length
        });
    } catch (error) {
        console.error('Error fetching hero slides:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch hero slides' },
            { status: 500 }
        );
    }
}

// POST /api/hero-slides - Create new slide
export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        const body = await request.json();
        const slide = await HeroSlide.create(body);

        return NextResponse.json({
            success: true,
            data: slide
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating hero slide:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create hero slide' },
            { status: 500 }
        );
    }
}
