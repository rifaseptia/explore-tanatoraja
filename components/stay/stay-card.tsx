'use client';

import { Accommodation } from '@/types/accommodation';
import Link from 'next/link';
import { MapPin, Star } from 'lucide-react';
import { useLocale } from 'next-intl';

interface Props {
    item: Accommodation;
}

export default function StayCard({ item }: Props) {
    const locale = useLocale();
    const title = locale === 'id' ? item.title.id : item.title.en;
    const description = locale === 'id' ? item.description.id : item.description.en;

    const href = `/stay/${item.slug}`;

    const categoryColors: Record<string, string> = {
        hotel: 'bg-blue-500/80',
        homestay: 'bg-emerald-500/80',
        resort: 'bg-amber-500/80',
        guesthouse: 'bg-violet-500/80',
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
                            {item.category}
                        </span>
                    </div>

                    {/* Price Badge */}
                    <div className="absolute bottom-4 left-4 z-10">
                        <span className="px-3 py-1.5 text-sm font-bold text-white bg-black/60 backdrop-blur-md rounded-full">
                            {item.priceRange}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-xl font-heading font-bold text-[#2D2A4A] mb-2 line-clamp-1 group-hover:text-[#A78BFA] transition-colors">
                        {title}
                    </h3>

                    {/* Rating */}
                    {item.rating && (
                        <div className="flex items-center gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={14}
                                    className={i < item.rating! ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}
                                />
                            ))}
                        </div>
                    )}

                    {/* Address */}
                    <div className="flex items-center gap-1.5 text-gray-400 text-sm mb-3">
                        <MapPin size={14} className="flex-shrink-0 text-[#A78BFA]" />
                        <span className="truncate">{item.address}</span>
                    </div>

                    <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-grow">
                        {description}
                    </p>

                    {/* Amenities */}
                    {item.amenities && item.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                            {item.amenities.slice(0, 4).map((amenity) => (
                                <span
                                    key={amenity}
                                    className="px-2 py-0.5 text-xs font-medium bg-gray-50 text-gray-500 rounded-full border border-gray-100"
                                >
                                    {amenity}
                                </span>
                            ))}
                            {item.amenities.length > 4 && (
                                <span className="px-2 py-0.5 text-xs font-medium bg-violet-50 text-violet-500 rounded-full">
                                    +{item.amenities.length - 4}
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}
