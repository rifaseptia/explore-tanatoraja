import { setRequestLocale } from 'next-intl/server';
import TransportCard from '@/components/transport/transport-card';
import Pagination from '@/components/ui/pagination';
import Link from 'next/link';
import SearchInput from '@/components/ui/search-input';
import MobileFilterSheet from '@/components/ui/mobile-filter-sheet';
import { Suspense } from 'react';
import dbConnect from '@/lib/mongodb';
import { getPageHero } from '@/lib/get-page-hero';
import Transport from '@/models/Transport';
import { TransportItem } from '@/types/transport';

type Props = {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export const dynamic = 'force-dynamic';

async function getTransportOptions(category?: string, page: number = 1, limit: number = 8, search?: string) {
    try {
        await dbConnect();
        const query: any = { isPublished: true };

        if (category && category !== 'all') {
            query.category = category;
        }

        if (search) {
            const searchRegex = new RegExp(search, 'i');
            query.$or = [
                { 'title.id': searchRegex },
                { 'title.en': searchRegex },
                { 'description.id': searchRegex },
                { 'description.en': searchRegex },
            ];
        }

        const skip = (page - 1) * limit;

        const [items, total] = await Promise.all([
            Transport.find(query)
                .sort({ isFeatured: -1, createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Transport.countDocuments(query)
        ]);

        const totalPages = Math.ceil(total / limit);

        if (items.length > 0) {
            const mappedItems = items.map(doc => ({
                ...doc,
                _id: doc._id.toString(),
                createdAt: doc.createdAt?.toISOString(),
                updatedAt: doc.updatedAt?.toISOString(),
            })) as TransportItem[];

            return { items: mappedItems, totalPages, total };
        }
        return { items: [], totalPages: 0, total: 0 };
    } catch (e) {
        console.error('Database connection error:', e);
        return { items: [], totalPages: 0, total: 0 };
    }
}

export async function generateMetadata({ params }: Props) {
    const { locale } = await params;
    return {
        title: locale === 'id'
            ? 'Transportasi | Explore Tana Toraja'
            : 'Getting There | Explore Tana Toraja',
        description: locale === 'id'
            ? 'Panduan lengkap transportasi menuju dan di sekitar Tana Toraja — pesawat, bus, rental mobil, dan angkutan lokal.'
            : 'Complete transportation guide to and around Tana Toraja — flights, buses, car rentals, and local transport.',
    };
}

export default async function TransportPage({ params, searchParams }: Props) {
    const { locale } = await params;
    const { category, page, q } = await searchParams;
    setRequestLocale(locale);

    const activeCategory = typeof category === 'string' ? category : 'all';
    const searchQuery = typeof q === 'string' ? q : '';
    const currentPage = typeof page === 'string' ? parseInt(page) : 1;
    const limit = 8;

    const { items: paginatedItems, totalPages } = await getTransportOptions(activeCategory, currentPage, limit, searchQuery);

    const categories = [
        { id: 'all', label: locale === 'id' ? 'Semua' : 'All' },
        { id: 'flight', label: locale === 'id' ? 'Penerbangan' : 'Flights' },
        { id: 'bus', label: 'Bus / Travel' },
        { id: 'rental', label: locale === 'id' ? 'Sewa / Tur' : 'Rental / Tour' },
        { id: 'local', label: locale === 'id' ? 'Lokal' : 'Local' },
    ];

    const hero = await getPageHero('transport');
    const heroImage = hero?.image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80';
    const heroTitle = hero ? hero.title[locale as 'id' | 'en'] : (locale === 'id' ? 'Cara Menuju Toraja' : 'Getting There');
    const heroSubtitle = hero ? hero.subtitle[locale as 'id' | 'en'] : (locale === 'id'
        ? 'Panduan lengkap transportasi menuju dan di sekitar Tana Toraja'
        : 'Your complete guide to reaching and getting around Tana Toraja');

    return (
        <div className="min-h-screen bg-white pb-16">

            {/* HERO SECTION */}
            <div className="relative h-[650px] flex items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `url('${heroImage}')`
                    }}
                >
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                </div>

                <div className="relative z-20 text-center px-4 max-w-5xl mx-auto pt-32">
                    <h1 className="text-5xl md:text-7xl font-heading font-bold text-white mb-6 leading-tight drop-shadow-2xl">
                        {heroTitle}
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto font-body leading-relaxed drop-shadow-2xl">
                        {heroSubtitle}
                    </p>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="max-w-7xl mx-auto px-[38px] relative z-20">

                {/* Filter & Search Bar */}
                <div className="py-12 md:py-16 space-y-5">
                    {/* Search + mobile filter button in one row */}
                    <div className="flex items-center justify-center gap-3">
                        <Suspense fallback={<div className="h-10 w-full max-w-md bg-gray-100 rounded-full animate-pulse" />}>
                            <SearchInput placeholder={locale === 'id' ? 'Cari transportasi' : 'Search transport'} />
                        </Suspense>

                        <MobileFilterSheet
                            categories={categories}
                            activeCategory={activeCategory}
                            searchQuery={searchQuery}
                            hasCategory={!!category}
                            baseUrl="/transport"
                            locale={locale}
                        />
                    </div>

                    {/* Desktop pills — hidden on mobile */}
                    <div className="hidden md:flex justify-center gap-2">
                        {categories.map((cat) => (
                            <Link
                                key={cat.id}
                                href={cat.id === 'all'
                                    ? (searchQuery ? `/transport?q=${searchQuery}` : '/transport')
                                    : `/transport?category=${cat.id}${searchQuery ? `&q=${searchQuery}` : ''}`
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
                {paginatedItems.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {paginatedItems.map((item) => (
                                <TransportCard key={item._id} item={item} />
                            ))}
                        </div>

                        <Pagination
                            totalPages={totalPages}
                            currentPage={currentPage}
                            baseUrl="/transport"
                        />
                    </>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                        <p className="text-gray-500 text-lg">
                            {locale === 'id'
                                ? 'Tidak ada transportasi yang ditemukan.'
                                : 'No transport options found for this search.'}
                        </p>
                        <Link
                            href="/transport"
                            className="inline-block mt-4 text-[#A78BFA] font-bold hover:underline"
                        >
                            {locale === 'id' ? 'Lihat Semua Opsi' : 'View All Options'}
                        </Link>
                    </div>
                )}

            </div>
        </div>
    );
}
