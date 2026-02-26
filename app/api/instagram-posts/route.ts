import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import InstagramPost from '@/models/InstagramPost';

export async function GET() {
    try {
        await dbConnect();
        const posts = await InstagramPost.find({ isActive: true })
            .sort({ order: 1 })
            .limit(6);
        return NextResponse.json(posts);
    } catch (error) {
        console.error('Error fetching Instagram posts:', error);
        return NextResponse.json(
            { error: 'Failed to fetch Instagram posts' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        await dbConnect();
        const body = await request.json();

        if (!body.postUrl) {
            return NextResponse.json(
                { error: 'Instagram post URL is required' },
                { status: 400 }
            );
        }

        // Validate URL format
        const urlPattern = /instagram\.com\/(p|reel|tv)\/[a-zA-Z0-9_-]+/;
        if (!urlPattern.test(body.postUrl)) {
            return NextResponse.json(
                { error: 'Invalid Instagram URL. Please use a post URL like https://www.instagram.com/p/xxxxx/' },
                { status: 400 }
            );
        }

        const post = new InstagramPost({
            postUrl: body.postUrl,
            image: '', // Not needed anymore - using embed
            authorName: 'exploretanatoraja',
            order: body.order || 0,
            isActive: body.isActive ?? true,
        });

        await post.save();
        return NextResponse.json(post, { status: 201 });
    } catch (error) {
        console.error('Error creating Instagram post:', error);
        return NextResponse.json(
            { error: 'Failed to create Instagram post: ' + (error as Error).message },
            { status: 500 }
        );
    }
}
