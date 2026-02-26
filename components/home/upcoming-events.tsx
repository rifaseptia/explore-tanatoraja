'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeader from '@/components/shared/section-header';
import { Event } from '@/types/event';

interface UpcomingEventsProps {
    events: Event[];
}

export default function UpcomingEvents({ events }: UpcomingEventsProps) {
    const t = useTranslations('events');
    const locale = useLocale() as 'id' | 'en';
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-advance every 5 seconds with infinite loop
    useEffect(() => {
        if (events.length === 0) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % events.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [events.length]);

    const getLocalizedHref = (href: string) => {
        return locale === 'id' ? href : `/${locale}${href}`;
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    if (events.length === 0) {
        return null; // Don't render section if no events
    }

    return (
        <section className="py-10 bg-white">
            <div className="max-w-7xl mx-auto px-[38px]">
                <SectionHeader
                    title={t('title')}
                    subtitle={t('subtitle')}
                    align="left"
                    viewMoreHref={locale === 'id' ? '/events' : '/en/events'}
                    viewMoreText={{ id: 'Lihat Lainnya', en: 'View More' }}
                    mobileViewMore={false}
                    variant="button"
                />

                {/* Carousel Container */}
                <div className="relative overflow-hidden rounded-2xl">
                    {/* Images */}
                    <div className="relative h-[300px] md:h-[400px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ x: '100%', opacity: 1 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: '-100%', opacity: 1 }}
                                transition={{ duration: 0.6, ease: 'easeInOut' }}
                                className="absolute inset-0"
                            >
                                <Link href={getLocalizedHref(`/events/${events[currentIndex].slug}`)}>
                                    <Image
                                        src={events[currentIndex].image}
                                        alt={events[currentIndex].title[locale] || events[currentIndex].title.en}
                                        fill
                                        className="object-cover"
                                    />
                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                                    {/* Event Info */}
                                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                                        <p className="text-white/80 text-sm md:text-base mb-2">
                                            {formatDate(events[currentIndex].startDate)}
                                            {events[currentIndex].endDate && ` - ${formatDate(events[currentIndex].endDate)}`}
                                        </p>
                                        <h3 className="font-heading font-bold text-2xl md:text-4xl text-white">
                                            {events[currentIndex].title[locale] || events[currentIndex].title.en}
                                        </h3>
                                    </div>
                                </Link>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Navigation Dots */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
                        {events.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === currentIndex
                                    ? 'bg-white w-8'
                                    : 'bg-white/50 hover:bg-white/80'
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Mobile: View More Button below carousel */}
                {events.length > 0 && (
                    <div className="mt-8 md:hidden text-center">
                        <Link
                            href={locale === 'id' ? '/events' : '/en/events'}
                            className="inline-flex items-center gap-2 px-8 py-4 bg-[#A78BFA] hover:bg-[#8B5CF6] text-white font-medium rounded-full transition-colors shadow-lg"
                        >
                            {locale === 'id' ? 'Lihat Lainnya' : 'View More'}
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}
