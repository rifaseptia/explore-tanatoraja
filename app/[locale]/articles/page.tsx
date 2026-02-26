import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import dbConnect from '@/lib/mongodb';
import { getPageHero } from '@/lib/get-page-hero';
import Article from '@/models/Article';
import { Article as ArticleType } from '@/types/article';
import ArticleCard from '@/components/articles/article-card';
import Pagination from '@/components/ui/pagination';
import Link from 'next/link';
import SearchInput from '@/components/ui/search-input';
import MobileFilterSheet from '@/components/ui/mobile-filter-sheet';
import { Suspense } from 'react';
import { Metadata } from 'next';
import { generatePageMetadata, generateBreadcrumbJsonLd } from '@/lib/seo';

type Props = {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export const dynamic = 'force-dynamic';

async function getArticles(category?: string, search?: string, page: number = 1, limit: number = 9) {
    await dbConnect();
    const query: any = { isPublished: true };

    if (category && category !== 'all') {
        query.category = category;
    }

    if (search) {
        const searchRegex = { $regex: search, $options: 'i' };
        query.$or = [
            { 'title.id': searchRegex },
            { 'title.en': searchRegex },
            { 'content.id': searchRegex },
            { 'content.en': searchRegex }
        ];
    }

    const skip = (page - 1) * limit;

    const [articles, total] = await Promise.all([
        Article.find(query)
            .sort({ publishedAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        Article.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / limit);

    const mappedArticles = JSON.parse(JSON.stringify(articles)) as ArticleType[];

    return { articles: mappedArticles, totalPages, total };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;

    const title = locale === 'id'
        ? 'Artikel & Tips Wisata - Explore Tana Toraja'
        : 'Travel Articles & Tips - Explore Tana Toraja';

    const description = locale === 'id'
        ? 'Baca cerita menarik, tips perjalanan, dan berita terbaru seputar pariwisata dan budaya Tana Toraja.'
        : 'Read interesting stories, travel tips, and latest news about Tana Toraja tourism and culture.';

    return generatePageMetadata({
        title,
        description,
        path: '/articles',
        keywords: [
            'Toraja blog',
            'Toraja travel tips',
            'wisata Toraja',
            'Toraja culture',
            'South Sulawesi tourism blog',
        ],
        locale,
    });
}

export default async function ArticlesPage({ params, searchParams }: Props) {
    const { locale } = await params;
    const { category, page, q } = await searchParams;

    setRequestLocale(locale);

    const activeCategory = typeof category === 'string' ? category : 'all';
    const searchQuery = typeof q === 'string' ? q : '';
    const currentPage = typeof page === 'string' ? parseInt(page) : 1;
    const limit = 9;

    const { articles, totalPages } = await getArticles(activeCategory, searchQuery, currentPage, limit);

    const t = await getTranslations('articles');

    const hero = await getPageHero('articles'); // Note: 'articles' page key needs to be supported in HeroSlide
    // We assumed 'articles' is not in the HeroSlide enum yet (it was 'home' | 'destinations' | 'culinary' | 'events' | 'stay' | 'transport'). 
    // It will fallback to undefined and use default image.

    const heroImage = hero?.image || 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1920&q=80';
    const heroTitle = hero ? hero.title[locale as 'id' | 'en'] : t('title');
    const heroSubtitle = hero ? hero.subtitle[locale as 'id' | 'en'] : t('subtitle');

    const categories = [
        { id: 'all', label: locale === 'id' ? 'Semua' : 'All' },
        { id: 'culture', label: locale === 'id' ? 'Budaya' : 'Culture' },
        { id: 'tips', label: locale === 'id' ? 'Tips' : 'Tips' },
        { id: 'news', label: locale === 'id' ? 'Berita' : 'News' },
        { id: 'culinary', label: locale === 'id' ? 'Kuliner' : 'Culinary' },
        { id: 'adventure', label: locale === 'id' ? 'Petualangan' : 'Adventure' },
    ];

    // Generate JSON-LD structured data
    const breadcrumbJsonLd = generateBreadcrumbJsonLd({
        items: [
            { name: locale === 'id' ? 'Beranda' : 'Home', url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://exploretanatoraja.com'}/${locale}` },
            { name: locale === 'id' ? 'Artikel' : 'Articles', url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://exploretanatoraja.com'}/${locale}/articles` },
        ],
    });

    return (
        <div className="min-h-screen bg-white pb-16">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />

            {/* HERO SECTION - Matching Events Page Structure */}
            <div className="relative h-[650px] flex items-center justify-center overflow-hidden">
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `url('${heroImage}')`
                    }}
                >
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                </div>

                {/* Content - Added pt-32 for better vertical positioning */}
                <div className="relative z-20 text-center px-4 max-w-5xl mx-auto pt-32">
                    <h1 className="text-5xl md:text-7xl font-heading font-bold text-white mb-6 leading-tight drop-shadow-2xl">
                        {heroTitle}
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto font-body leading-relaxed drop-shadow-2xl">
                        {heroSubtitle}
                    </p>
                </div>
            </div>

            {/* MAIN CONTENT CONTAINER */}
            <div className="max-w-7xl mx-auto px-[38px] relative z-20">

                {/* Filter & Search Bar */}
                <div className="py-12 md:py-16 space-y-5">
                    {/* Search + mobile filter button */}
                    <div className="flex items-center justify-center gap-3">
                        <Suspense fallback={<div className="h-10 w-full max-w-md bg-gray-100 rounded-full animate-pulse" />}>
                            <SearchInput placeholder={locale === 'id' ? 'Cari artikel...' : 'Search articles...'} />
                        </Suspense>

                        <MobileFilterSheet
                            categories={categories}
                            activeCategory={activeCategory}
                            searchQuery={searchQuery}
                            hasCategory={!!category}
                            baseUrl="/articles"
                            locale={locale}
                        />
                    </div>

                    {/* Desktop pills — hidden on mobile */}
                    <div className="hidden md:flex justify-center gap-2">
                        {categories.map((cat) => (
                            <Link
                                key={cat.id}
                                href={cat.id === 'all'
                                    ? `/articles${searchQuery ? `?q=${searchQuery}` : ''}`
                                    : `/articles?category=${cat.id}${searchQuery ? `&q=${searchQuery}` : ''}`}
                                scroll={false}
                                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border ${(activeCategory === cat.id || (activeCategory === 'all' && cat.id === 'all' && !category))
                                    ? 'bg-[#A78BFA] text-white border-[#A78BFA] shadow-lg shadow-violet-200/50'
                                    : 'bg-white text-gray-500 border-gray-200 hover:border-[#A78BFA] hover:text-[#A78BFA]'
                                    }`}
                            >
                                {cat.label}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                {articles.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {articles.map((article) => (
                                <ArticleCard key={article._id} article={article} />
                            ))}
                        </div>

                        <Pagination
                            totalPages={totalPages}
                            currentPage={currentPage}
                            baseUrl="/articles"
                        />
                    </>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                        </div>
                        <p className="text-gray-500 text-lg">
                            {locale === 'id'
                                ? 'Tidak ada artikel yang ditemukan yang sesuai dengan kriteria pencarian Anda.'
                                : 'No articles found matching your search criteria.'}
                        </p>
                        <Link
                            href="/articles"
                            className="inline-block mt-4 text-[#A78BFA] font-bold hover:underline"
                        >
                            {locale === 'id' ? 'Hapus Filter' : 'Clear Filters'}
                        </Link>
                    </div>
                )}

            </div>
        </div>
    );
}
