'use client';

import { Article } from '@/types/article';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Calendar, BookOpen } from 'lucide-react';

interface Props {
    article: Article;
}

const formatDate = (date: string, locale: string) => {
    return new Date(date).toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const categoryColors: Record<string, string> = {
    culture: 'bg-amber-500/80',
    tips: 'bg-emerald-500/80',
    news: 'bg-blue-500/80',
    culinary: 'bg-orange-500/80',
};

const categoryLabels: Record<string, Record<string, string>> = {
    culture: { id: 'Budaya', en: 'Culture' },
    tips: { id: 'Tips', en: 'Tips' },
    news: { id: 'Berita', en: 'News' },
    culinary: { id: 'Kuliner', en: 'Culinary' },
    adventure: { id: 'Petualangan', en: 'Adventure' },
};

export default function ArticleCard({ article }: Props) {
    const locale = useLocale();
    const lang = locale as 'id' | 'en';
    const title = article.title?.[lang];
    const excerpt = article.excerpt?.[lang] || article.content?.[lang]?.substring(0, 100) + '...';

    // Ensure we handle potentially missing properties safely
    const category = article.category || 'news';
    const categoryColor = categoryColors[category] || 'bg-gray-500/80';
    const categoryLabel = categoryLabels[category]?.[lang] || category;

    const getImageSrc = (src: string | undefined) => {
        if (!src) return '';
        if (src.startsWith('/uploads/')) return `/api${src}`;
        return src;
    };

    return (
        <Link href={`/articles/${article.slug}`} className="group block h-full">
            <div className="h-full bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-gray-300 transition-all duration-300">
                <div className="flex flex-col md:flex-row h-full">
                    {/* Image - Left Side */}
                    <div className="relative w-full md:w-2/5 h-48 md:min-h-[180px] bg-gray-100 flex-shrink-0">
                        {article.featuredImage ? (
                            <img
                                src={getImageSrc(article.featuredImage)}
                                alt={title || 'Article'}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gradient-to-br from-violet-100 to-violet-50">
                                <BookOpen size={32} />
                            </div>
                        )}
                    </div>

                    {/* Content - Right Side */}
                    <div className="flex-1 p-5 flex flex-col justify-center">
                        {/* Title */}
                        <h3 className="text-lg font-heading font-bold text-dark mb-3 line-clamp-2 group-hover:text-[#A78BFA] transition-colors">
                            {title}
                        </h3>

                        {/* Date */}
                        <div className="flex items-center gap-2 text-sm text-gray mb-3">
                            <Calendar size={14} />
                            <span>{formatDate(article.publishedAt, locale)}</span>
                        </div>

                        {/* Category Badge */}
                        <div>
                            <span className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider text-white ${categoryColor} rounded-full`}>
                                {categoryLabel}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
