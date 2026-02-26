import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Transport from '@/models/Transport';

// GET /api/transport/[slug]
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await dbConnect();
        const { slug } = await params;
        const transport = await Transport.findOne({ slug });

        if (!transport) {
            return NextResponse.json(
                { success: false, error: 'Transport not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: transport,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to fetch transport' },
            { status: 500 }
        );
    }
}

// PUT /api/transport/[slug]
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await dbConnect();
        const { slug } = await params;
        const body = await request.json();

        const transport = await Transport.findOneAndUpdate(
            { slug },
            body,
            { new: true, runValidators: true }
        );

        if (!transport) {
            return NextResponse.json(
                { success: false, error: 'Transport not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: transport,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to update transport' },
            { status: 500 }
        );
    }
}

// DELETE /api/transport/[slug]
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await dbConnect();
        const { slug } = await params;
        const transport = await Transport.findOneAndDelete({ slug });

        if (!transport) {
            return NextResponse.json(
                { success: false, error: 'Transport not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: {}
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to delete transport' },
            { status: 500 }
        );
    }
}
