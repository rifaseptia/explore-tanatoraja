'use client';

import { Destination } from '@/types/destination';
import Link from 'next/link';
import { MapPin, Landmark, Trees, UtensilsCrossed, Mountain, Star } from 'lucide-react';
import { useLocale } from 'next-intl';

interface Props {
    destination: Destination;
}

const categoryColors: Record<string, string> = {
    cultural: 'bg-amber-500/80',
    nature: 'bg-emerald-500/80',
    culinary: 'bg-orange-500/80',
    adventure: 'bg-blue-500/80',
};

const categoryLabels: Record<string, Record<string, string>> = {
    cultural: { id: 'Budaya', en: 'Cultural' },
    nature: { id: 'Alam', en: 'Nature' },
    culinary: { id: 'Kuliner', en: 'Culinary' },
    adventure: { id: 'Petualangan', en: 'Adventure' },
};

const categoryIcons: Record<string, React.ReactNode> = {
    cultural: <Landmark size={12} />,
    nature: <Trees size={12} />,
    culinary: <UtensilsCrossed size={12} />,
    adventure: <Mountain size={12} />,
};

export default function DestinationCard({ destination }: Props) {
    const locale = useLocale();
    const lang = locale as 'id' | 'en';
    const title = destination.title?.[lang];
    const desc = destination.excerpt?.[lang] || destination.description?.[lang]?.substring(0, 100) + '...';
    const address = destination.location?.address?.[lang];

    const getImageSrc = (src: string | undefined) => {
        if (!src) return '';
        if (src.startsWith('/uploads/')) return `/api${src}`;
        return src;
    };

    return (
        <Link href={`/destinations/${destination.slug}`} className="group block h-full">
            <div className="relative h-full bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-gray-300 transition-all duration-300 flex flex-col">

                {/* Image */}
                <div className="relative h-56 overflow-hidden bg-gray-100">
                    {destination.featuredImage ? (
                        <img
                            src={getImageSrc(destination.featuredImage)}
                            alt={title || 'Destination'}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gradient-to-br from-violet-100 to-violet-50">
                            <MapPin size={32} />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4 z-10">
                        <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider text-white ${categoryColors[destination.category] || 'bg-gray-500/80'} backdrop-blur-md border border-white/20 rounded-full shadow-lg flex items-center gap-1.5`}>
                            {categoryIcons[destination.category]}
                            {categoryLabels[destination.category]?.[lang] || destination.category}
                        </span>
                    </div>

                    {/* Featured Star */}
                    {destination.isFeatured && (
                        <div className="absolute bottom-4 right-4 z-10">
                            <span className="w-8 h-8 rounded-full bg-yellow-400/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                                <Star size={14} className="text-white fill-white" />
                            </span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-lg font-heading font-bold text-[#2D2A4A] mb-2 line-clamp-1 group-hover:text-[#A78BFA] transition-colors">
                        {title}
                    </h3>

                    {address && (
                        <div className="flex items-center gap-1.5 text-gray-400 text-sm mb-3">
                            <MapPin size={13} className="flex-shrink-0 text-[#A78BFA]" />
                            <span className="truncate font-medium">{address}</span>
                        </div>
                    )}

                    <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-grow leading-relaxed">
                        {desc}
                    </p>

                    {/* Tags */}
                    {destination.tags && destination.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                            {destination.tags.slice(0, 3).map((tag, idx) => (
                                <span key={idx} className="text-[10px] font-medium text-[#A78BFA] bg-violet-50 px-2 py-0.5 rounded-full">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}
