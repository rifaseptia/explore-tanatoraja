import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import HeroSlide from '@/models/HeroSlide';

// GET /api/hero-slides/[id] - Get single slide
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;

        const slide = await HeroSlide.findById(id);

        if (!slide) {
            return NextResponse.json(
                { success: false, error: 'Slide not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: slide
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to fetch slide' },
            { status: 500 }
        );
    }
}

// PUT /api/hero-slides/[id] - Update slide
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;
        const body = await request.json();

        const slide = await HeroSlide.findByIdAndUpdate(
            id,
            body,
            { new: true, runValidators: true }
        );

        if (!slide) {
            return NextResponse.json(
                { success: false, error: 'Slide not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: slide
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to update slide' },
            { status: 500 }
        );
    }
}

// DELETE /api/hero-slides/[id] - Delete slide
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;

        const slide = await HeroSlide.findByIdAndDelete(id);

        if (!slide) {
            return NextResponse.json(
                { success: false, error: 'Slide not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Slide deleted successfully'
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to delete slide' },
            { status: 500 }
        );
    }
}
