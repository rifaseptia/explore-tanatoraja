import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Event from '@/models/Event';

type Props = {
    params: Promise<{ slug: string }>;
};

// GET /api/events/[slug] - Get single event
export async function GET(request: NextRequest, { params }: Props) {
    try {
        await dbConnect();
        const { slug } = await params;

        const event = await Event.findOne({ slug }).lean();

        if (!event) {
            return NextResponse.json(
                { success: false, error: 'Event not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: event,
        });
    } catch (error) {
        console.error('Error fetching event:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch event' },
            { status: 500 }
        );
    }
}

// PUT /api/events/[slug] - Update event
export async function PUT(request: NextRequest, { params }: Props) {
    try {
        await dbConnect();
        const { slug } = await params;
        const body = await request.json();

        const event = await Event.findOneAndUpdate(
            { slug },
            body,
            { new: true, runValidators: true }
        );

        if (!event) {
            return NextResponse.json(
                { success: false, error: 'Event not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: event,
        });
    } catch (error) {
        console.error('Error updating event:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update event' },
            { status: 500 }
        );
    }
}

// DELETE /api/events/[slug] - Delete event
export async function DELETE(request: NextRequest, { params }: Props) {
    try {
        await dbConnect();
        const { slug } = await params;

        const event = await Event.findOneAndDelete({ slug });

        if (!event) {
            return NextResponse.json(
                { success: false, error: 'Event not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Event deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting event:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete event' },
            { status: 500 }
        );
    }
}
