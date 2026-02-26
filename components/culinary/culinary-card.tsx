'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { ChefHat, Leaf, Coffee, ShoppingBag, Flame } from 'lucide-react';
import { CulinaryItem } from '@/types/culinary';

interface Props {
    item: CulinaryItem;
}

const categoryColors: Record<string, string> = {
    'main-course': 'bg-orange-500/80',
    'snack': 'bg-emerald-500/80',
    'drink': 'bg-amber-600/80',
    'souvenir': 'bg-violet-500/80',
};

const categoryLabels: Record<string, Record<string, string>> = {
    'main-course': { id: 'Makanan Berat', en: 'Main Course' },
    'snack': { id: 'Kue & Snack', en: 'Snacks' },
    'drink': { id: 'Kopi & Minuman', en: 'Coffee & Drinks' },
    'souvenir': { id: 'Oleh-oleh', en: 'Souvenirs' },
};

const categoryIcons: Record<string, React.ReactNode> = {
    'main-course': <ChefHat size={12} />,
    'snack': <Leaf size={12} />,
    'drink': <Coffee size={12} />,
    'souvenir': <ShoppingBag size={12} />,
};

export default function CulinaryCard({ item }: Props) {
    const locale = useLocale() as 'id' | 'en';

    return (
        <Link href={`/culinary/${item.slug}`} className="group block h-full">
            <div className="relative h-full bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-gray-300 transition-all duration-300 flex flex-col">

                {/* Image */}
                <div className="relative h-56 overflow-hidden bg-gray-100">
                    <img
                        src={item.image}
                        alt={item.title[locale]}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4 z-10">
                        <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider text-white ${categoryColors[item.category] || 'bg-gray-500/80'} backdrop-blur-md border border-white/20 rounded-full shadow-lg flex items-center gap-1.5`}>
                            {categoryIcons[item.category]}
                            {categoryLabels[item.category]?.[locale] || item.category}
                        </span>
                    </div>

                    {/* Spice Level Badge */}
                    {item.spiceLevel && item.spiceLevel > 1 && (
                        <div className="absolute top-4 right-4 z-10">
                            <span className="px-3 py-1 text-xs font-bold text-white bg-red-500/80 backdrop-blur-md border border-white/20 rounded-full shadow-lg flex items-center gap-1">
                                <Flame size={12} />
                                {item.spiceLevel === 2 ? 'Spicy' : 'Hot'}
                            </span>
                        </div>
                    )}

                    {/* Halal Badge at bottom-left of image */}
                    {item.isHalal && (
                        <div className="absolute bottom-4 left-4 z-10">
                            <span className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-500/80 backdrop-blur-md rounded-full border border-white/20 shadow-lg">
                                ✓ Halal
                            </span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-lg font-heading font-bold text-[#2D2A4A] mb-2 line-clamp-1 group-hover:text-[#A78BFA] transition-colors">
                        {item.title[locale]}
                    </h3>

                    <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-grow leading-relaxed">
                        {item.description[locale]}
                    </p>

                    {/* Tags */}
                    {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                            {item.tags.slice(0, 3).map((tag, idx) => (
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
