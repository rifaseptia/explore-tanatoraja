import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { Suspense } from 'react';
import SearchInput from '@/components/ui/search-input';
import MobileFilterSheet from '@/components/ui/mobile-filter-sheet';
import CulinaryCard from '@/components/culinary/culinary-card';
import Pagination from '@/components/ui/pagination';
import dbConnect from '@/lib/mongodb';
import { getPageHero } from '@/lib/get-page-hero';
import Culinary from '@/models/Culinary';
import { CulinaryItem } from '@/types/culinary';

export const metadata = {
    title: 'Culinary Delights - Explore Tana Toraja',
    description: 'A gastronomic guide to the unique flavors of Toraja, from bamboo cooking to world-class coffee.',
};

interface Props {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CulinaryPage({ params, searchParams }: Props) {
    const { locale } = await params;
    const { category, q, page } = await searchParams;
    setRequestLocale(locale);

    const activeCategory = typeof category === 'string' ? category : 'all';
    const searchQuery = typeof q === 'string' ? q.toLowerCase() : '';
    const currentPage = typeof page === 'string' ? parseInt(page) : 1;
    const limit = 8;

    // Build MongoDB query
    await dbConnect();

    const query: Record<string, unknown> = { isPublished: true };

    if (activeCategory !== 'all') {
        query.category = activeCategory;
    }

    if (searchQuery) {
        query.$or = [
            { [`title.${locale}`]: { $regex: searchQuery, $options: 'i' } },
            { [`description.${locale}`]: { $regex: searchQuery, $options: 'i' } },
        ];
    }

    const total = await Culinary.countDocuments(query);
    const totalPages = Math.ceil(total / limit);
    const skip = (currentPage - 1) * limit;

    const items = await Culinary.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

    // Serialize for client components
    const paginatedItems = JSON.parse(JSON.stringify(items));

    const categories = [
        { id: 'all', label: locale === 'id' ? 'Semua' : 'All' },
        { id: 'main-course', label: locale === 'id' ? 'Makanan Berat' : 'Main Course' },
        { id: 'snack', label: locale === 'id' ? 'Kue & Snack' : 'Snacks' },
        { id: 'drink', label: locale === 'id' ? 'Kopi & Minuman' : 'Coffee & Drinks' },
        { id: 'souvenir', label: locale === 'id' ? 'Oleh-oleh' : 'Souvenirs' },
    ];

    const hero = await getPageHero('culinary');
    const heroImage = hero?.image || 'https://images.unsplash.com/photo-1541614160401-1e663a6a1d4f?q=80&w=2070';
    const heroTitle = hero ? hero.title[locale as 'id' | 'en'] : (locale === 'id' ? 'Wisata Kuliner' : 'Culinary Delights');
    const heroSubtitle = hero ? hero.subtitle[locale as 'id' | 'en'] : (locale === 'id'
        ? 'Jelajahi cita rasa otentik dari dataran tinggi, mulai dari Pa\'piong hingga Kopi Toraja.'
        : 'Explore authentic flavors from the highlands, from bamboo cooking to world-class coffee.');

    return (
        <main className="min-h-screen bg-white pb-20">
            {/* HERO SECTION */}
            <div className="relative h-[650px] flex items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `url('${heroImage}')`
                    }}
                >
                    <div className="absolute inset-0 bg-black/40" />
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

            {/* LISTING CONTENT */}
            <div className="max-w-7xl mx-auto px-[38px] relative z-20">

                {/* Filter & Search Bar */}
                <div className="py-12 md:py-16 space-y-5">
                    {/* Search + mobile filter button */}
                    <div className="flex items-center justify-center gap-3">
                        <Suspense fallback={<div className="h-10 w-full max-w-md bg-gray-100 rounded-full animate-pulse" />}>
                            <SearchInput placeholder={locale === 'id' ? 'Cari makanan...' : 'Search food...'} />
                        </Suspense>

                        {/* Mobile filter trigger — bottom sheet */}
                        <MobileFilterSheet
                            categories={categories}
                            activeCategory={activeCategory}
                            searchQuery={searchQuery}
                            hasCategory={!!category}
                            baseUrl="/culinary"
                            locale={locale}
                        />
                    </div>

                    {/* Desktop pills — hidden on mobile */}
                    <div className="hidden md:flex justify-center gap-2">
                        {categories.map((cat) => (
                            <Link
                                key={cat.id}
                                href={cat.id === 'all'
                                    ? (searchQuery ? `/culinary?q=${searchQuery}` : '/culinary')
                                    : `/culinary?category=${cat.id}${searchQuery ? `&q=${searchQuery}` : ''}`
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
                            {paginatedItems.map((item: CulinaryItem) => (
                                <CulinaryCard key={item._id || item.slug} item={item} />
                            ))}
                        </div>

                        {/* Pagination */}
                        <Pagination
                            totalPages={totalPages}
                            currentPage={currentPage}
                            baseUrl="/culinary"
                        />
                    </>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                        <p className="text-gray-500 text-lg">
                            {locale === 'id' ? 'Masakan tidak ditemukan.' : 'No dishes found.'}
                        </p>
                        <Link href="/culinary" className="text-orange-500 font-bold hover:underline mt-2 inline-block">
                            {locale === 'id' ? 'Reset Pencarian' : 'Reset Search'}
                        </Link>
                    </div>
                )}

            </div>
        </main>
    );
}
