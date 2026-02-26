import { notFound } from 'next/navigation';
import dbConnect from '@/lib/mongodb';
import Article from '@/models/Article';
import ArticleForm from '@/components/admin/article-form';

interface Props {
    params: Promise<{ id: string }>;
}

export default async function EditArticlePage({ params }: Props) {
    const { id } = await params;
    await dbConnect();

    const article = await Article.findById(id).lean();

    if (!article) {
        notFound();
    }

    // Convert _id and dates to strings
    const serializedArticle = JSON.parse(JSON.stringify(article));

    return <ArticleForm initialData={serializedArticle} isEditing />;
}
