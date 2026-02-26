import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import dbConnect from '@/lib/mongodb';
import { getPageHero } from '@/lib/get-page-hero';
import DestinationModel from '@/models/Destination';
import { Destination } from '@/types/destination';
import DestinationCard from '@/components/destinations/destination-card';
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

async function getDestinations(category?: string, search?: string, page: number = 1, limit: number = 9) {
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
            { 'description.id': searchRegex },
            { 'description.en': searchRegex }
        ];
    }

    const skip = (page - 1) * limit;

    const [destinations, total] = await Promise.all([
        DestinationModel.find(query)
            .sort({ isFeatured: -1, createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        DestinationModel.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / limit);

    const mappedDestinations = JSON.parse(JSON.stringify(destinations)) as Destination[];

    return { destinations: mappedDestinations, totalPages, total };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'destinations' });

    const title = locale === 'id'
        ? 'Destinasi Wisata Tana Toraja - Jelajahi Keindahan Budaya dan Alam'
        : 'Tana Toraja Tourist Destinations - Explore Cultural and Natural Beauty';

    const description = locale === 'id'
        ? 'Temukan destinasi wisata terbaik di Tana Toraja. Jelajahi situs budaya seperti Kete Kesu, Londa, dan keindahan alam Batutumonga.'
        : 'Discover the best tourist destinations in Tana Toraja. Explore cultural sites like Kete Kesu, Londa, and natural beauty of Batutumonga.';

    return generatePageMetadata({
        title,
        description,
        path: '/destinations',
        keywords: [
            'Tana Toraja destinations',
            'wisata Toraja',
            'Toraja tourist spots',
            'Kete Kesu',
            'Londa',
            'Batutumonga',
            'Tongkonan',
            'Toraja culture',
            'South Sulawesi tourism',
        ],
        locale,
    });
}

export default async function DestinationsPage({ params, searchParams }: Props) {
    const { locale } = await params;
    const { category, page, q } = await searchParams;

    // Enable static rendering
    setRequestLocale(locale);

    const activeCategory = typeof category === 'string' ? category : 'all';
    const searchQuery = typeof q === 'string' ? q : '';
    const currentPage = typeof page === 'string' ? parseInt(page) : 1;
    const limit = 9; // 3 columns * 3 rows = 9 items per page

    const { destinations, totalPages } = await getDestinations(activeCategory, searchQuery, currentPage, limit);

    const t = await getTranslations('destinations');

    const hero = await getPageHero('destinations');
    const heroImage = hero?.image || 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1920&q=80';
    const heroTitle = hero ? hero.title[locale as 'id' | 'en'] : t('title');
    const heroSubtitle = hero ? hero.subtitle[locale as 'id' | 'en'] : t('description');

    // Category list for filter
    const categories = [
        { id: 'all', label: locale === 'id' ? 'Semua' : 'All' },
        { id: 'cultural', label: locale === 'id' ? 'Budaya' : 'Cultural' },
        { id: 'nature', label: locale === 'id' ? 'Alam' : 'Nature' },
        { id: 'culinary', label: locale === 'id' ? 'Kuliner' : 'Culinary' },
        { id: 'adventure', label: locale === 'id' ? 'Petualangan' : 'Adventure' },
    ];

    // Generate JSON-LD structured data
    const breadcrumbJsonLd = generateBreadcrumbJsonLd({
        items: [
            { name: locale === 'id' ? 'Beranda' : 'Home', url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://exploretanatoraja.com'}/${locale}` },
            { name: locale === 'id' ? 'Destinasi' : 'Destinations', url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://exploretanatoraja.com'}/${locale}/destinations` },
        ],
    });

    return (
        <div className="min-h-screen bg-white pb-16">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />

            {/* HERO SECTION */}
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
                            <SearchInput placeholder={locale === 'id' ? 'Cari destinasi' : 'Search destination'} />
                        </Suspense>

                        <MobileFilterSheet
                            categories={categories}
                            activeCategory={activeCategory}
                            searchQuery={searchQuery}
                            hasCategory={!!category}
                            baseUrl="/destinations"
                            locale={locale}
                        />
                    </div>

                    {/* Desktop pills — hidden on mobile */}
                    <div className="hidden md:flex justify-center gap-2">
                        {categories.map((cat) => (
                            <Link
                                key={cat.id}
                                href={cat.id === 'all'
                                    ? (searchQuery ? `/destinations?q=${searchQuery}` : '/destinations')
                                    : `/destinations?category=${cat.id}${searchQuery ? `&q=${searchQuery}` : ''}`
                                }
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
                {destinations.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {destinations.map((destination) => (
                                <DestinationCard key={destination._id} destination={destination} />
                            ))}
                        </div>

                        {/* Pagination */}
                        <Pagination
                            totalPages={totalPages}
                            currentPage={currentPage}
                            baseUrl="/destinations"
                        />
                    </>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                        <p className="text-gray-500 text-lg">
                            {locale === 'id'
                                ? 'Tidak ada destinasi yang ditemukan untuk pencarian atau kategori ini.'
                                : 'No destinations found for this search or category.'}
                        </p>
                        <Link
                            href="/destinations"
                            className="inline-block mt-4 text-[#A78BFA] font-bold hover:underline"
                        >
                            {locale === 'id' ? 'Lihat Semua Destinasi' : 'View All Destinations'}
                        </Link>
                    </div>
                )}

            </div>
        </div>
    );
}
