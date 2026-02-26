'use client';

import { Event } from '@/types/event';
import Link from 'next/link';
import { MapPin, Calendar } from 'lucide-react';
import { useLocale } from 'next-intl';

interface Props {
    event: Event;
}

const categoryColors: Record<string, string> = {
    ceremony: 'bg-amber-500/80',
    festival: 'bg-rose-500/80',
    music: 'bg-blue-500/80',
    religion: 'bg-emerald-500/80',
};

const categoryLabels: Record<string, Record<string, string>> = {
    ceremony: { id: 'Upacara', en: 'Ceremony' },
    festival: { id: 'Festival', en: 'Festival' },
    music: { id: 'Musik', en: 'Music' },
    religion: { id: 'Keagamaan', en: 'Religion' },
};

export default function EventCard({ event }: Props) {
    const locale = useLocale();
    const lang = locale as 'id' | 'en';
    const title = event.title?.[lang];
    const desc = event.excerpt?.[lang] || event.description?.[lang]?.substring(0, 100) + '...';
    const location = event.location?.[lang];

    const getImageSrc = (src: string | undefined) => {
        if (!src) return '';
        if (src.startsWith('/uploads/')) return `/api${src}`;
        return src;
    };

    const startDate = new Date(event.startDate);
    const month = startDate.toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', { month: 'short' }).toUpperCase();
    const day = startDate.getDate();

    return (
        <Link href={`/events/${event.slug}`} className="group block h-full">
            <div className="relative h-full bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-gray-300 transition-all duration-300 flex flex-col">

                {/* Image */}
                <div className="relative h-56 overflow-hidden bg-gray-100">
                    <img
                        src={getImageSrc(event.image)}
                        alt={title || 'Event'}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4 z-10">
                        <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider text-white ${categoryColors[event.category] || 'bg-gray-500/80'} backdrop-blur-md border border-white/20 rounded-full shadow-lg`}>
                            {categoryLabels[event.category]?.[lang] || event.category}
                        </span>
                    </div>

                    {/* Date Badge — contextual for events */}
                    <div className="absolute top-4 right-4 z-10 flex flex-col items-center bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg min-w-[52px]">
                        <span className="text-[10px] font-bold text-[#A78BFA] uppercase tracking-wider leading-none">{month}</span>
                        <span className="text-xl font-bold text-gray-900 leading-tight">{day}</span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-lg font-heading font-bold text-[#2D2A4A] mb-2 line-clamp-1 group-hover:text-[#A78BFA] transition-colors">
                        {title}
                    </h3>

                    {/* Metadata */}
                    <div className="flex flex-col gap-1.5 text-sm mb-3">
                        {location && (
                            <div className="flex items-center gap-1.5 text-gray-400">
                                <MapPin size={13} className="flex-shrink-0 text-[#A78BFA]" />
                                <span className="truncate font-medium">{location}</span>
                            </div>
                        )}
                        {event.endDate && (
                            <div className="flex items-center gap-1.5 text-gray-400">
                                <Calendar size={13} className="flex-shrink-0 text-[#A78BFA]" />
                                <span className="font-medium text-xs">
                                    {new Intl.DateTimeFormat(lang === 'id' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'short' }).format(startDate)}
                                    {' — '}
                                    {new Intl.DateTimeFormat(lang === 'id' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(event.endDate))}
                                </span>
                            </div>
                        )}
                    </div>

                    <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-grow">
                        {desc}
                    </p>
                </div>
            </div>
        </Link>
    );
}
