import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Destination from '@/models/Destination';

type Props = {
    params: Promise<{ slug: string }>;
};

// GET /api/destinations/[slug] - Get single destination
export async function GET(request: NextRequest, { params }: Props) {
    try {
        await dbConnect();
        const { slug } = await params;

        const destination = await Destination.findOne({
            slug,
            isPublished: true
        }).lean();

        if (!destination) {
            return NextResponse.json(
                { success: false, error: 'Destination not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: destination,
        });
    } catch (error) {
        console.error('Error fetching destination:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch destination' },
            { status: 500 }
        );
    }
}

// PUT /api/destinations/[slug] - Update destination (protected)
export async function PUT(request: NextRequest, { params }: Props) {
    try {
        await dbConnect();
        const { slug } = await params;
        const body = await request.json();

        const destination = await Destination.findOneAndUpdate(
            { slug },
            body,
            { new: true, runValidators: true }
        );

        if (!destination) {
            return NextResponse.json(
                { success: false, error: 'Destination not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: destination,
        });
    } catch (error) {
        console.error('Error updating destination:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update destination' },
            { status: 500 }
        );
    }
}

// DELETE /api/destinations/[slug] - Delete destination (protected)
export async function DELETE(request: NextRequest, { params }: Props) {
    try {
        await dbConnect();
        const { slug } = await params;

        const destination = await Destination.findOneAndDelete({ slug });

        if (!destination) {
            return NextResponse.json(
                { success: false, error: 'Destination not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Destination deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting destination:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete destination' },
            { status: 500 }
        );
    }
}
