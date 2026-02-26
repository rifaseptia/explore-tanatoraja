import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Culinary from '@/models/Culinary';

interface Params {
    params: Promise<{ slug: string }>;
}

// GET /api/culinary/[slug]
export async function GET(request: NextRequest, { params }: Params) {
    try {
        await dbConnect();
        const { slug } = await params;

        const item = await Culinary.findOne({ slug }).lean();

        if (!item) {
            return NextResponse.json(
                { success: false, error: 'Culinary item not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: item });
    } catch (error) {
        console.error('Error fetching culinary item:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch culinary item' },
            { status: 500 }
        );
    }
}

// PUT /api/culinary/[slug]
export async function PUT(request: NextRequest, { params }: Params) {
    try {
        await dbConnect();
        const { slug } = await params;
        const body = await request.json();

        const item = await Culinary.findOneAndUpdate(
            { slug },
            { ...body },
            { new: true, runValidators: true }
        );

        if (!item) {
            return NextResponse.json(
                { success: false, error: 'Culinary item not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: item });
    } catch (error) {
        console.error('Error updating culinary item:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update culinary item' },
            { status: 500 }
        );
    }
}

// DELETE /api/culinary/[slug]
export async function DELETE(request: NextRequest, { params }: Params) {
    try {
        await dbConnect();
        const { slug } = await params;

        const item = await Culinary.findOneAndDelete({ slug });

        if (!item) {
            return NextResponse.json(
                { success: false, error: 'Culinary item not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, message: 'Culinary item deleted' });
    } catch (error) {
        console.error('Error deleting culinary item:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete culinary item' },
            { status: 500 }
        );
    }
}
