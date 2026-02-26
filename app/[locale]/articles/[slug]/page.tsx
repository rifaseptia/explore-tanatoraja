import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { Calendar, User, ArrowLeft, Tag, Clock } from 'lucide-react';
import Link from 'next/link';
import ShareButton from '@/components/shared/share-button';
import dbConnect from '@/lib/mongodb';
import Article from '@/models/Article';
import { Article as ArticleType } from '@/types/article';
import { Metadata } from 'next';

// JSON-LD for SEO
function generateJsonLd(article: ArticleType, locale: string) {
    const title = locale === 'id' ? article.title.id : article.title.en;
    const description = locale === 'id' ? article.excerpt.id : article.excerpt.en;
    const datePublished = article.publishedAt;
    const authorName = article.author || 'Explore Tana Toraja Team';

    return {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: title,
        description: description,
        image: article.featuredImage ? [article.featuredImage] : [],
        datePublished: datePublished,
        author: {
            '@type': 'Person',
            name: authorName
        },
        publisher: {
            '@type': 'Organization',
            name: 'Explore Tana Toraja',
            logo: {
                '@type': 'ImageObject',
                url: 'https://exploretanatoraja.com/logo.png'
            }
        }
    };
}

export const revalidate = 60;

async function getArticle(slug: string): Promise<ArticleType | null> {
    await dbConnect();
    const article = await Article.findOne({ slug, isPublished: true }).lean();
    if (!article) return null;
    return JSON.parse(JSON.stringify(article)) as ArticleType;
}

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, slug } = await params;
    const article = await getArticle(slug);

    if (!article) return {};

    const title = locale === 'id' ? article.title.id : article.title.en;
    const description = locale === 'id' ? article.excerpt.id : article.excerpt.en;

    return {
        title: `${title} | Explore Tana Toraja`,
        description: description,
        openGraph: {
            title: title,
            description: description,
            images: article.featuredImage ? [article.featuredImage] : [],
            type: 'article',
            publishedTime: article.publishedAt,
            authors: [article.author || 'Explore Tana Toraja'],
        },
    };
}

const categoryColors: Record<string, string> = {
    culture: 'bg-amber-500 text-white',
    tips: 'bg-blue-500 text-white',
    news: 'bg-emerald-500 text-white',
    culinary: 'bg-rose-500 text-white',
    adventure: 'bg-purple-500 text-white',
};

const categoryLabels: Record<string, Record<string, string>> = {
    culture: { id: 'Budaya', en: 'Culture' },
    tips: { id: 'Tips', en: 'Tips' },
    news: { id: 'Berita', en: 'News' },
    culinary: { id: 'Kuliner', en: 'Culinary' },
    adventure: { id: 'Petualangan', en: 'Adventure' },
};

export default async function ArticleDetailPage({ params }: Props) {
    const { locale, slug } = await params;
    setRequestLocale(locale);

    const article = await getArticle(slug);

    if (!article) notFound();

    const jsonLd = generateJsonLd(article, locale);
    const lang = locale as 'id' | 'en';
    const title = article.title[lang];
    const content = article.content[lang];
    const excerpt = article.excerpt[lang];

    const getImageSrc = (src: string | undefined) => {
        if (!src) return '';
        if (src.startsWith('/uploads/')) return `/api${src}`;
        return src;
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const l = {
        back: lang === 'id' ? 'Kembali ke Artikel' : 'Back to Articles',
        info: lang === 'id' ? 'Informasi Artikel' : 'Article Information',
        author: lang === 'id' ? 'Penulis' : 'Author',
        publishedOn: lang === 'id' ? 'Diterbitkan' : 'Published On',
        readingTime: lang === 'id' ? 'Waktu Baca' : 'Reading Time',
        category: lang === 'id' ? 'Kategori' : 'Category',
        minutes: lang === 'id' ? 'menit' : 'minutes',
    };

    // Calculate reading time (average 200 words per minute)
    const wordCount = content?.split(/\s+/).length || 0;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    return (
        <article className="min-h-screen bg-white pb-20 pt-24 md:pt-32">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            {/* 1. Header Section (Clean White — matching events) */}
            <div className="max-w-4xl mx-auto px-[38px] text-center mb-12">
                {/* Breadcrumbs */}
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-4 font-medium uppercase tracking-wider">
                    <Link href="/articles" className="hover:text-[#A78BFA] transition-colors">Articles</Link>
                    <span>/</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${categoryColors[article.category] || 'bg-gray-500 text-white'}`}>
                        {categoryLabels[article.category]?.[lang] || article.category}
                    </span>
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-4 leading-tight">
                    {title}
                </h1>

                {/* Date + Author Meta */}
                <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-400 border-t border-b border-gray-100 py-3 mx-auto max-w-2xl">
                    <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-[#A78BFA]" />
                        <span>{formatDate(article.publishedAt)}</span>
                    </div>
                    {article.author && (
                        <>
                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                            <div className="flex items-center gap-1.5">
                                <User size={14} className="text-[#A78BFA]" />
                                <span>{article.author}</span>
                            </div>
                        </>
                    )}
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    <div className="flex items-center gap-1.5">
                        <Clock size={14} className="text-[#A78BFA]" />
                        <span>{readingTime} {l.minutes}</span>
                    </div>
                </div>
            </div>

            {/* 2. Hero Image Section */}
            <div className="max-w-5xl mx-auto px-[38px] mb-16">
                <div className="rounded-3xl overflow-hidden shadow-2xl bg-gray-100 aspect-[16/9] relative">
                    {article.featuredImage ? (
                        <img
                            src={getImageSrc(article.featuredImage)}
                            alt={title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#A78BFA] to-[#8B5CF6]" />
                    )}

                    {/* Action Buttons Overlay */}
                    <div className="absolute top-6 right-6 flex items-center gap-3">
                        <ShareButton title={title} text={excerpt?.substring(0, 100)} />
                    </div>

                    {/* Category Badge Overlay */}
                    <div className="absolute bottom-6 left-6 flex flex-col items-center bg-white/90 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg">
                        <span className="text-xs font-bold text-[#A78BFA] uppercase tracking-wider leading-none">
                            {categoryLabels[article.category]?.[lang]?.toUpperCase() || article.category.toUpperCase()}
                        </span>
                    </div>
                </div>
            </div>

            {/* 3. Main Content (Article Style — max-w-3xl centered) */}
            <div className="max-w-3xl mx-auto px-[38px] space-y-16">

                {/* Article Content */}
                <section>
                    <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed font-body whitespace-pre-line text-justify">
                        {content}
                    </div>
                </section>

                {/* Article Info Box */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Tag size={22} className="text-[#A78BFA]" />
                        {l.info}
                    </h2>

                    <div className="space-y-3">
                        {/* Author */}
                        {article.author && (
                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-violet-200 hover:bg-violet-50/50 transition-colors">
                                <div className="w-10 h-10 rounded-full bg-violet-100 text-[#A78BFA] flex items-center justify-center flex-shrink-0">
                                    <User size={18} />
                                </div>
                                <div>
                                    <span className="block text-sm font-bold text-gray-900 mb-0.5">{l.author}</span>
                                    <span className="text-gray-600 font-medium">{article.author}</span>
                                </div>
                            </div>
                        )}

                        {/* Published Date */}
                        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-violet-200 hover:bg-violet-50/50 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-violet-100 text-[#A78BFA] flex items-center justify-center flex-shrink-0">
                                <Calendar size={18} />
                            </div>
                            <div>
                                <span className="block text-sm font-bold text-gray-900 mb-0.5">{l.publishedOn}</span>
                                <span className="text-gray-600 font-medium">{formatDate(article.publishedAt)}</span>
                            </div>
                        </div>

                        {/* Reading Time */}
                        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-violet-200 hover:bg-violet-50/50 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                                <Clock size={18} />
                            </div>
                            <div>
                                <span className="block text-sm font-bold text-gray-900 mb-0.5">{l.readingTime}</span>
                                <span className="text-emerald-600 font-bold">{readingTime} {l.minutes}</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Back Link */}
                <div className="pt-12 border-t border-gray-100 text-center">
                    <Link href="/articles" className="inline-flex items-center gap-2 text-[#A78BFA] font-bold hover:underline">
                        <ArrowLeft size={16} />
                        {l.back}
                    </Link>
                </div>

            </div>
        </article>
    );
}
