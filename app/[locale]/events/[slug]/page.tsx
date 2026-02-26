import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { MapPin, ArrowLeft, Calendar, Clock, Info, Ticket } from 'lucide-react';
import Link from 'next/link';
import AddToCalendar from '@/components/events/add-to-calendar';
import ShareButton from '@/components/shared/share-button';
import MapWrapper from '@/components/shared/map-wrapper';

import dbConnect from '@/lib/mongodb';
import EventModel from '@/models/Event';
import { Event } from '@/types/event';

// JSON-LD for SEO
function generateJsonLd(event: Event, locale: string) {
    const title = locale === 'id' ? event.title.id : event.title.en;
    const description = locale === 'id' ? event.description.id : event.description.en;
    const locationName = locale === 'id' ? event.location.id : event.location.en;

    return {
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: title,
        description: description,
        startDate: event.startDate,
        endDate: event.endDate || event.startDate,
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        location: {
            '@type': 'Place',
            name: locationName,
            address: {
                '@type': 'PostalAddress',
                addressLocality: 'Tana Toraja',
                addressCountry: 'ID'
            }
        },
        image: [event.image],
    };
}

async function getEvent(slug: string) {
    await dbConnect();
    const event = await EventModel.findOne({ slug, isPublished: true }).lean();
    if (!event) return null;
    return {
        ...event,
        _id: event._id.toString(),
        startDate: event.startDate?.toISOString(),
        endDate: event.endDate?.toISOString(),
        createdAt: event.createdAt?.toISOString(),
        updatedAt: event.updatedAt?.toISOString(),
    } as Event;
}

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props) {
    const { locale, slug } = await params;
    const event = await getEvent(slug);
    if (!event) return {};
    const title = locale === 'id' ? event.title.id : event.title.en;
    return {
        title: `${title} | Explore Tana Toraja`,
        description: locale === 'id' ? event.description.id.substring(0, 160) : event.description.en.substring(0, 160),
        openGraph: { images: [event.image] },
    };
}

const categoryColors: Record<string, string> = {
    ceremony: 'bg-amber-500 text-white',
    festival: 'bg-rose-500 text-white',
    music: 'bg-blue-500 text-white',
    religion: 'bg-emerald-500 text-white',
};

const categoryLabels: Record<string, Record<string, string>> = {
    ceremony: { id: 'Upacara', en: 'Ceremony' },
    festival: { id: 'Festival', en: 'Festival' },
    music: { id: 'Musik', en: 'Music' },
    religion: { id: 'Keagamaan', en: 'Religion' },
};

export default async function EventDetailPage({ params }: Props) {
    const { locale, slug } = await params;
    setRequestLocale(locale);
    const event = await getEvent(slug);
    if (!event) notFound();

    const jsonLd = generateJsonLd(event, locale);
    const lang = locale as 'id' | 'en';
    const title = event.title[lang];
    const description = event.description[lang];
    const location = event.location[lang];

    const startDate = new Date(event.startDate).toLocaleDateString(locale, {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    const endDate = event.endDate ? new Date(event.endDate).toLocaleDateString(locale, {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    }) : null;

    const getImageSrc = (src: string | undefined) => {
        if (!src) return '';
        if (src.startsWith('/uploads/')) return `/api${src}`;
        return src;
    };

    const l = {
        back: lang === 'id' ? 'Kembali ke Events' : 'Back to Events',
        about: lang === 'id' ? 'Tentang Event Ini' : 'About This Event',
        info: lang === 'id' ? 'Informasi Praktis' : 'Practical Information',
        date: lang === 'id' ? 'Tanggal' : 'Date',
        venue: lang === 'id' ? 'Lokasi / Venue' : 'Venue',
        ticket: lang === 'id' ? 'Tiket Masuk' : 'Admission',
        schedule: lang === 'id' ? 'Jadwal Acara' : 'Schedule',
        free: lang === 'id' ? 'Gratis' : 'Free Admission',
        openMaps: lang === 'id' ? 'Buka di Google Maps' : 'Open in Google Maps',
        location: lang === 'id' ? 'Lokasi Event' : 'Event Location',
    };

    return (
        <article className="min-h-screen bg-white pb-20 pt-24 md:pt-32">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            {/* 1. Header Section (Clean White — matching culinary/stay/transport) */}
            <div className="max-w-4xl mx-auto px-[38px] text-center mb-12">
                {/* Breadcrumbs */}
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-4 font-medium uppercase tracking-wider">
                    <Link href="/events" className="hover:text-[#A78BFA] transition-colors">Events</Link>
                    <span>/</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${categoryColors[event.category] || 'bg-gray-500 text-white'}`}>
                        {categoryLabels[event.category]?.[lang] || event.category}
                    </span>
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-4 leading-tight">
                    {title}
                </h1>

                {/* Date + Location Meta */}
                <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-400 border-t border-b border-gray-100 py-3 mx-auto max-w-2xl">
                    <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-[#A78BFA]" />
                        <span>{startDate}</span>
                    </div>
                    {endDate && (
                        <>
                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                            <div className="flex items-center gap-1.5">
                                <span>{lang === 'id' ? 'sampai' : 'to'} {endDate}</span>
                            </div>
                        </>
                    )}
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    <div className="flex items-center gap-1.5">
                        <MapPin size={14} className="text-[#A78BFA]" />
                        <span>{location}</span>
                    </div>
                </div>
            </div>

            {/* 2. Hero Image Section */}
            <div className="max-w-5xl mx-auto px-[38px] mb-16">
                <div className="rounded-3xl overflow-hidden shadow-2xl bg-gray-100 aspect-[16/9] relative">
                    {event.image ? (
                        <img
                            src={getImageSrc(event.image)}
                            alt={title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#A78BFA] to-[#8B5CF6]" />
                    )}

                    {/* Action Buttons Overlay */}
                    <div className="absolute top-6 right-6 flex items-center gap-3">
                        <ShareButton title={title} text={description?.substring(0, 100)} />
                    </div>

                    {/* Date Badge Overlay */}
                    <div className="absolute bottom-6 left-6 flex flex-col items-center bg-white/90 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg">
                        <span className="text-xs font-bold text-[#A78BFA] uppercase tracking-wider leading-none">
                            {new Date(event.startDate).toLocaleDateString(locale, { month: 'short' }).toUpperCase()}
                        </span>
                        <span className="text-3xl font-bold text-gray-900 leading-tight">
                            {new Date(event.startDate).getDate()}
                        </span>
                    </div>
                </div>
            </div>

            {/* 3. Main Content (Article Style — max-w-3xl centered) */}
            <div className="max-w-3xl mx-auto px-[38px] space-y-16">

                {/* About Section */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Info size={22} className="text-[#A78BFA]" />
                        {l.about}
                    </h2>
                    <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed font-body whitespace-pre-line text-justify">
                        {description}
                    </div>
                </section>

                {/* Practical Info Box */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Ticket size={22} className="text-[#A78BFA]" />
                            {l.info}
                        </h2>
                        <AddToCalendar
                            title={title}
                            description={description.substring(0, 300)}
                            location={location}
                            startDate={event.startDate}
                            endDate={event.endDate}
                        />
                    </div>

                    <div className="space-y-3">
                        {/* Date */}
                        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-violet-200 hover:bg-violet-50/50 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-violet-100 text-[#A78BFA] flex items-center justify-center flex-shrink-0">
                                <Calendar size={18} />
                            </div>
                            <div>
                                <span className="block text-sm font-bold text-gray-900 mb-0.5">{l.date}</span>
                                <span className="text-gray-600 font-medium">
                                    {startDate}
                                    {endDate && <><br />{lang === 'id' ? 'sampai' : 'to'} {endDate}</>}
                                </span>
                            </div>
                        </div>

                        {/* Venue */}
                        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-violet-200 hover:bg-violet-50/50 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-violet-100 text-[#A78BFA] flex items-center justify-center flex-shrink-0">
                                <MapPin size={18} />
                            </div>
                            <div>
                                <span className="block text-sm font-bold text-gray-900 mb-0.5">{l.venue}</span>
                                <span className="text-gray-600 font-medium">{location}</span>
                            </div>
                        </div>

                        {/* Schedule */}
                        {(event.schedule?.id || event.schedule?.en) && (
                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-violet-200 hover:bg-violet-50/50 transition-colors">
                                <div className="w-10 h-10 rounded-full bg-violet-100 text-[#A78BFA] flex items-center justify-center flex-shrink-0">
                                    <Clock size={18} />
                                </div>
                                <div>
                                    <span className="block text-sm font-bold text-gray-900 mb-0.5">{l.schedule}</span>
                                    <span className="text-gray-600 font-medium whitespace-pre-line">
                                        {event.schedule[lang]}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Admission */}
                        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-violet-200 hover:bg-violet-50/50 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                                <Ticket size={18} />
                            </div>
                            <div>
                                <span className="block text-sm font-bold text-gray-900 mb-0.5">{l.ticket}</span>
                                <span className="text-emerald-600 font-bold">{l.free}</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Location Map - hanya tampil jika ada koordinat */}
                {event.coordinates && event.coordinates.length === 2 ? (
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <MapPin size={22} className="text-[#A78BFA]" />
                            {l.location}
                        </h2>
                        <MapWrapper
                            coordinates={[event.coordinates[1], event.coordinates[0]]}
                            title={location}
                        />
                        <div className="mt-4 text-center">
                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location + ' Tana Toraja')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-50 hover:bg-violet-50 text-gray-700 hover:text-[#A78BFA] font-bold rounded-xl transition-colors border border-gray-200 hover:border-violet-200"
                            >
                                <MapPin size={16} />
                                {l.openMaps}
                            </a>
                        </div>
                    </section>
                ) : null}

                {/* Back Link */}
                <div className="pt-12 border-t border-gray-100 text-center">
                    <Link href="/events" className="inline-flex items-center gap-2 text-[#A78BFA] font-bold hover:underline">
                        <ArrowLeft size={16} />
                        {l.back}
                    </Link>
                </div>

            </div>
        </article>
    );
}
