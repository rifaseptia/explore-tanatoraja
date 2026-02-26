import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get('url');

    if (!url) {
        return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    try {
        // Use Instagram's official oEmbed endpoint
        const oEmbedUrl = `https://api.instagram.com/oembed/?url=${encodeURIComponent(url)}`;

        const response = await fetch(oEmbedUrl);

        if (!response.ok) {
            throw new Error(`Instagram oEmbed failed: ${response.statusText}`);
        }

        const data = await response.json();

        // Return full oEmbed data including HTML
        return NextResponse.json({
            html: data.html || '',
            thumbnail_url: data.thumbnail_url,
            title: data.title,
            author_name: data.author_name,
            author_url: data.author_url,
        });
    } catch (error) {
        console.error('Error fetching Instagram oEmbed:', error);
        return NextResponse.json(
            { error: 'Failed to fetch Instagram data' },
            { status: 500 }
        );
    }
}
