import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Article from '@/models/Article';

// GET /api/articles - Get all articles
export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const featured = searchParams.get('featured');
        const limit = searchParams.get('limit');

        // Build query
        const query: Record<string, unknown> = { isPublished: true };

        if (category && category !== 'all') {
            query.category = category;
        }

        if (featured === 'true') {
            query.isFeatured = true;
        }

        // Execute query
        let articlesQuery = Article.find(query).sort({ publishedAt: -1 });

        if (limit) {
            articlesQuery = articlesQuery.limit(parseInt(limit));
        }

        const articles = await articlesQuery.lean();

        return NextResponse.json({
            success: true,
            data: articles,
            count: articles.length,
        });
    } catch (error) {
        console.error('Error fetching articles:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch articles' },
            { status: 500 }
        );
    }
}

// POST /api/articles - Create new article
export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        const body = await request.json();
        const article = await Article.create(body);

        return NextResponse.json({
            success: true,
            data: article,
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating article:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create article' },
            { status: 500 }
        );
    }
}
