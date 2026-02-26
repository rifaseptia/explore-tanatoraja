import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Accommodation from '@/models/Accommodation';

// GET /api/accommodations/[slug] - Get single accommodation
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await dbConnect();
        const { slug } = await params;

        const accommodation = await Accommodation.findOne({ slug });

        if (!accommodation) {
            return NextResponse.json(
                { success: false, error: 'Accommodation not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: accommodation,
        });
    } catch (error) {
        console.error('Error fetching accommodation:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch accommodation' },
            { status: 500 }
        );
    }
}

// PUT /api/accommodations/[slug] - Update accommodation
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await dbConnect();
        const { slug } = await params;
        const body = await request.json();

        const accommodation = await Accommodation.findOneAndUpdate(
            { slug },
            body,
            { new: true, runValidators: true }
        );

        if (!accommodation) {
            return NextResponse.json(
                { success: false, error: 'Accommodation not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: accommodation,
        });
    } catch (error) {
        console.error('Error updating accommodation:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update accommodation' },
            { status: 500 }
        );
    }
}

// DELETE /api/accommodations/[slug] - Delete accommodation
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await dbConnect();
        const { slug } = await params;

        const accommodation = await Accommodation.findOneAndDelete({ slug });

        if (!accommodation) {
            return NextResponse.json(
                { success: false, error: 'Accommodation not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: {}
        });
    } catch (error) {
        console.error('Error deleting accommodation:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete accommodation' },
            { status: 500 }
        );
    }
}
