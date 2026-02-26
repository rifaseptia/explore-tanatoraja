'use client';

import { TransportItem } from '@/types/transport';
import Link from 'next/link';
import { Clock, Banknote } from 'lucide-react';
import { useLocale } from 'next-intl';

interface Props {
    item: TransportItem;
}

export default function TransportCard({ item }: Props) {
    const locale = useLocale();
    const lang = locale as 'id' | 'en';
    const title = item.title[lang];
    const description = item.description[lang];

    const href = `/transport/${item.slug}`;

    const categoryColors: Record<string, string> = {
        flight: 'bg-sky-500/80',
        bus: 'bg-emerald-500/80',
        rental: 'bg-amber-500/80',
        local: 'bg-rose-500/80',
    };

    const categoryLabels: Record<string, Record<string, string>> = {
        flight: { id: 'Penerbangan', en: 'Flight' },
        bus: { id: 'Bus / Travel', en: 'Bus / Travel' },
        rental: { id: 'Sewa / Tur', en: 'Rental / Tour' },
        local: { id: 'Lokal', en: 'Local' },
    };

    return (
        <Link href={href} className="group block h-full">
            <div className="relative h-full bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-gray-300 transition-all duration-300 flex flex-col">
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    <img
                        src={item.image}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4 z-10">
                        <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider text-white ${categoryColors[item.category] || 'bg-gray-500/80'} backdrop-blur-md border border-white/20 rounded-full shadow-lg`}>
                            {categoryLabels[item.category]?.[lang] || item.category}
                        </span>
                    </div>

                    {/* Duration Badge */}
                    {item.duration && (
                        <div className="absolute bottom-4 left-4 z-10">
                            <span className="px-3 py-1.5 text-sm font-bold text-white bg-black/60 backdrop-blur-md rounded-full flex items-center gap-1.5">
                                <Clock size={13} />
                                {item.duration}
                            </span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-xl font-heading font-bold text-[#2D2A4A] mb-2 line-clamp-1 group-hover:text-[#A78BFA] transition-colors">
                        {title}
                    </h3>

                    {/* Price */}
                    {item.priceRange && (
                        <div className="flex items-center gap-1.5 text-sm text-gray-400 mb-3">
                            <Banknote size={14} className="flex-shrink-0 text-[#A78BFA]" />
                            <span className="font-medium">{item.priceRange}</span>
                        </div>
                    )}

                    <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-grow">
                        {description}
                    </p>

                    {/* Routes Preview */}
                    {item.routes && item.routes.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                            {item.routes.slice(0, 2).map((route, idx) => (
                                <span
                                    key={idx}
                                    className="px-2 py-0.5 text-xs font-medium bg-gray-50 text-gray-500 rounded-full border border-gray-100 truncate max-w-[200px]"
                                >
                                    {route[lang]}
                                </span>
                            ))}
                            {item.routes.length > 2 && (
                                <span className="px-2 py-0.5 text-xs font-medium bg-violet-50 text-violet-500 rounded-full">
                                    +{item.routes.length - 2}
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}
