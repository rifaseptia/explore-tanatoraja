import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import dbConnect from '@/lib/mongodb';
import { getPageHero } from '@/lib/get-page-hero';
import EventModel from '@/models/Event';
import { Event } from '@/types/event';
import EventCard from '@/components/events/event-card';
import Pagination from '@/components/ui/pagination';
import { Suspense } from 'react';
import SearchInput from '@/components/ui/search-input';
import MobileFilterSheet from '@/components/ui/mobile-filter-sheet';
import Link from 'next/link';

type Props = {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export const dynamic = 'force-dynamic';

async function getEvents(category?: string, page: number = 1, limit: number = 8, search?: string) {
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
                { 'description.en': searchRegex }
            ];
        }

        const skip = (page - 1) * limit;

        const [events, total] = await Promise.all([
            EventModel.find(query)
                .sort({ startDate: 1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            EventModel.countDocuments(query)
        ]);

        const totalPages = Math.ceil(total / limit);

        if (events.length > 0) {
            const mappedEvents = events.map(doc => ({
                ...doc,
                _id: doc._id.toString(),
                startDate: doc.startDate?.toISOString(),
                endDate: doc.endDate?.toISOString(),
                createdAt: doc.createdAt?.toISOString(),
                updatedAt: doc.updatedAt?.toISOString(),
            })) as Event[];

            return { events: mappedEvents, totalPages, total };
        }
        return { events: [], totalPages: 0, total: 0 };
    } catch (e) {
        console.error('Database connection error:', e);
        return { events: [], totalPages: 0, total: 0 };
    }
}

export async function generateMetadata({ params }: Props) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'eventsPage' });

    return {
        title: `${t('title')} | Explore Tana Toraja`,
        description: t('description'),
    };
}

export default async function EventsPage({ params, searchParams }: Props) {
    const { locale } = await params;
    const { category, page, q } = await searchParams;

    // Enable static rendering
    setRequestLocale(locale);

    const activeCategory = typeof category === 'string' ? category : 'all';
    const currentPage = typeof page === 'string' ? parseInt(page) : 1;
    const limit = 8;
    const searchQuery = typeof q === 'string' ? q : '';

    const { events, totalPages } = await getEvents(activeCategory, currentPage, limit, searchQuery);

    const t = await getTranslations('eventsPage');

    const hero = await getPageHero('events');
    const heroImage = hero?.image || 'https://images.unsplash.com/photo-1544259367-e9fa635543c7?w=1920&q=80';
    const heroTitle = hero ? hero.title[locale as 'id' | 'en'] : t('title');
    const heroSubtitle = hero ? hero.subtitle[locale as 'id' | 'en'] : t('description');

    const categories = [
        { id: 'all', label: t('categories.all') },
        { id: 'ceremony', label: t('categories.ceremony') },
        { id: 'festival', label: t('categories.festival') },
        { id: 'music', label: t('categories.music') },
        { id: 'religion', label: t('categories.religion') },
    ];

    return (
        <div className="min-h-screen bg-white pb-16">

            {/* HERO SECTION - Matching Destinations Page Structure */}
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
                            <SearchInput placeholder={locale === 'id' ? 'Cari event' : 'Search event'} />
                        </Suspense>

                        <MobileFilterSheet
                            categories={categories}
                            activeCategory={activeCategory}
                            searchQuery={searchQuery}
                            hasCategory={!!category}
                            baseUrl="/events"
                            locale={locale}
                        />
                    </div>

                    {/* Desktop pills — hidden on mobile */}
                    <div className="hidden md:flex justify-center gap-2">
                        {categories.map((cat) => (
                            <Link
                                key={cat.id}
                                href={cat.id === 'all'
                                    ? `/events${searchQuery ? `?q=${searchQuery}` : ''}`
                                    : `/events?category=${cat.id}${searchQuery ? `&q=${searchQuery}` : ''}`}
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
                {events.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {events.map((event) => (
                                <EventCard key={event._id} event={event} />
                            ))}
                        </div>

                        {/* Pagination */}
                        <Pagination
                            totalPages={totalPages}
                            currentPage={currentPage}
                            baseUrl="/events"
                        />
                    </>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        </div>
                        <p className="text-gray-500 text-lg">
                            {locale === 'id'
                                ? 'Tidak ada event yang ditemukan yang sesuai dengan kriteria pencarian Anda.'
                                : 'No events found matching your search criteria.'}
                        </p>
                        <Link
                            href="/events"
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
