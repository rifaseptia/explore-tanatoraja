'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SlidersHorizontal, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface Category {
    id: string;
    label: string;
}

interface Props {
    categories: Category[];
    activeCategory: string;
    searchQuery: string;
    hasCategory: boolean;
    baseUrl: string;
    locale: string;
}

export default function MobileFilterSheet({
    categories,
    activeCategory,
    searchQuery,
    hasCategory,
    baseUrl,
    locale,
}: Props) {
    const [isOpen, setIsOpen] = useState(false);

    const activeLabel = categories.find(c => c.id === activeCategory)?.label
        || categories[0]?.label;

    return (
        <>
            {/* Filter Trigger Button — mobile only */}
            <button
                onClick={() => setIsOpen(true)}
                className="md:hidden flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 bg-white text-sm font-bold text-gray-600 hover:border-[#A78BFA] hover:text-[#A78BFA] transition-all shadow-sm active:scale-95"
            >
                <SlidersHorizontal size={16} />
                <span>{activeLabel}</span>
                {hasCategory && (
                    <span className="w-2 h-2 rounded-full bg-[#A78BFA] animate-pulse" />
                )}
            </button>

            {/* Bottom Sheet Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/40 z-[70] md:hidden"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Sheet */}
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="fixed bottom-0 left-0 right-0 z-[80] bg-white rounded-t-3xl shadow-2xl md:hidden"
                        >
                            {/* Handle */}
                            <div className="flex justify-center pt-3 pb-2">
                                <div className="w-10 h-1 rounded-full bg-gray-200" />
                            </div>

                            {/* Header */}
                            <div className="flex items-center justify-between px-6 pb-4 border-b border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900">
                                    {locale === 'id' ? 'Filter Kategori' : 'Filter Category'}
                                </h3>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Filter Options */}
                            <div className="p-6 space-y-2">
                                {categories.map((cat) => {
                                    const isActive = activeCategory === cat.id || (activeCategory === 'all' && cat.id === 'all' && !hasCategory);
                                    const href = cat.id === 'all'
                                        ? (searchQuery ? `${baseUrl}?q=${searchQuery}` : baseUrl)
                                        : `${baseUrl}?category=${cat.id}${searchQuery ? `&q=${searchQuery}` : ''}`;

                                    return (
                                        <Link
                                            key={cat.id}
                                            href={href}
                                            scroll={false}
                                            onClick={() => setIsOpen(false)}
                                            className={`block w-full px-5 py-3.5 rounded-xl text-left font-medium transition-all ${isActive
                                                ? 'bg-[#A78BFA] text-white shadow-lg shadow-violet-200/50'
                                                : 'bg-gray-50 text-gray-600 hover:bg-violet-50 hover:text-[#A78BFA]'
                                                }`}
                                        >
                                            {cat.label}
                                        </Link>
                                    );
                                })}
                            </div>

                            {/* Safe area padding for notched phones */}
                            <div className="h-8" />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
