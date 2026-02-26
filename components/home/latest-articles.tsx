import { getLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';
import dbConnect from '@/lib/mongodb';
import Article from '@/models/Article';
import ArticleCard from '@/components/articles/article-card';
import { Article as ArticleType } from '@/types/article';

async function getLatestArticles() {
    await dbConnect();
    const articles = await Article.find({ isPublished: true })
        .sort({ publishedAt: -1 })
        .limit(4)
        .lean();

    // Serialize for client component
    return JSON.parse(JSON.stringify(articles)) as ArticleType[];
}

export default async function LatestArticles() {
    const locale = await getLocale();
    const t = await getTranslations('articles');
    const articles = await getLatestArticles();

    if (articles.length === 0) return null;

    return (
        <section className="py-10 bg-gray-50">
            <div className="max-w-7xl mx-auto px-[38px]">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <div className="flex items-center gap-2 text-[#A78BFA] font-medium mb-3">
                            <BookOpen size={20} />
                            <span className="uppercase tracking-widest text-sm">Blog</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-heading font-bold text-indigo-950 mb-4">
                            {t('title')}
                        </h2>
                        <p className="text-gray-600 text-lg max-w-2xl leading-relaxed">
                            {t('subtitle')}
                        </p>
                    </div>

                    <Link
                        href="/articles"
                        className="hidden md:flex items-center gap-2 px-6 py-3 border border-indigo-100 bg-white hover:border-[#A78BFA] hover:text-[#A78BFA] text-gray-600 rounded-full transition-all duration-300 shadow-sm hover:shadow-md group"
                    >
                        <span className="font-medium">{t('viewMore')}</span>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {articles.slice(0, 4).map((article) => (
                        <div key={article._id} className="h-full">
                            <ArticleCard article={article} />
                        </div>
                    ))}
                </div>

                <div className="mt-10 md:hidden flex justify-center">
                    <Link
                        href="/articles"
                        className="flex items-center gap-2 px-6 py-3 border border-indigo-100 bg-white hover:border-[#A78BFA] hover:text-[#A78BFA] text-gray-600 rounded-full transition-all duration-300 shadow-sm"
                    >
                        <span className="font-medium">{t('viewMore')}</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}
