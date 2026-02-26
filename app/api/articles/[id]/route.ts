import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Article from '@/models/Article';

type Props = {
    params: Promise<{ id: string }>;
}

// GET /api/articles/[id] - Get single article
export async function GET(request: NextRequest, { params }: Props) {
    try {
        await dbConnect();
        const { id } = await params;
        const article = await Article.findById(id);

        if (!article) {
            return NextResponse.json(
                { success: false, error: 'Article not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: article });
    } catch (error) {
        console.error('Error fetching article:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch article' },
            { status: 500 }
        );
    }
}

// PUT /api/articles/[id] - Update article
export async function PUT(request: NextRequest, { params }: Props) {
    try {
        await dbConnect();
        const { id } = await params;
        const body = await request.json();

        const article = await Article.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });

        if (!article) {
            return NextResponse.json(
                { success: false, error: 'Article not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: article });
    } catch (error) {
        console.error('Error updating article:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update article' },
            { status: 500 }
        );
    }
}

// DELETE /api/articles/[id] - Delete article
export async function DELETE(request: NextRequest, { params }: Props) {
    try {
        await dbConnect();
        const { id } = await params;
        const article = await Article.findByIdAndDelete(id);

        if (!article) {
            return NextResponse.json(
                { success: false, error: 'Article not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: {} });
    } catch (error) {
        console.error('Error deleting article:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete article' },
            { status: 500 }
        );
    }
}
