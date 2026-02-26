import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import InstagramPost from '@/models/InstagramPost';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await dbConnect();

        const post = await InstagramPost.findById(id);

        if (!post) {
            return NextResponse.json(
                { error: 'Instagram post not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(post);
    } catch (error) {
        console.error('Error fetching Instagram post:', error);
        return NextResponse.json(
            { error: 'Failed to fetch Instagram post' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await dbConnect();

        const body = await request.json();

        const post = await InstagramPost.findByIdAndUpdate(
            id,
            {
                postUrl: body.postUrl,
                image: body.image,
                authorName: body.authorName,
                order: body.order,
                isActive: body.isActive,
            },
            { new: true }
        );

        if (!post) {
            return NextResponse.json(
                { error: 'Instagram post not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(post);
    } catch (error) {
        console.error('Error updating Instagram post:', error);
        return NextResponse.json(
            { error: 'Failed to update Instagram post' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await dbConnect();

        const post = await InstagramPost.findByIdAndDelete(id);

        if (!post) {
            return NextResponse.json(
                { error: 'Instagram post not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: 'Instagram post deleted successfully' });
    } catch (error) {
        console.error('Error deleting Instagram post:', error);
        return NextResponse.json(
            { error: 'Failed to delete Instagram post' },
            { status: 500 }
        );
    }
}
