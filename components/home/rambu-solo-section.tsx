'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, MapPin, Clock, Loader2 } from 'lucide-react';
import SectionHeader from '@/components/shared/section-header';

interface RambuSoloEvent {
    _id: string;
    title: { id: string; en: string };
    slug: string;
    description: { id: string; en: string };
    excerpt?: { id: string; en: string };
    image: string;
    category: string;
    startDate: string;
    endDate?: string;
    location: { id: string; en: string };
    isRambuSolo: boolean;
    schedule?: { id: string; en: string };
    duration?: { id: string; en: string };
}

export default function RambuSoloSection() {
    const locale = useLocale() as 'id' | 'en';
    const [mobileIndex, setMobileIndex] = useState(0);
    const [flippedCard, setFlippedCard] = useState<string | null>(null);
    const [events, setEvents] = useState<RambuSoloEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchRambuSoloEvents = useCallback(async () => {
        try {
            const response = await fetch('/api/events?rambuSolo=true');
            const data = await response.json();
            if (data.success) {
                setEvents(data.data);
            }
        } catch (error) {
            console.error('Error fetching Rambu Solo events:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRambuSoloEvents();
    }, [fetchRambuSoloEvents]);

    const nextSlide = () => {
        setMobileIndex((prev) => (prev + 1) % events.length);
    };

    const prevSlide = () => {
        setMobileIndex((prev) => (prev - 1 + events.length) % events.length);
    };

    // Format date for display
    const formatDate = (dateStr: string): string => {
        const date = new Date(dateStr);
        return date.toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', {
            month: 'short',
            day: 'numeric',
        });
    };

    // Loading skeleton
    if (isLoading) {
        return (
            <section className="py-10 bg-white">
                <div className="max-w-7xl mx-auto px-[38px]">
                    <div className="text-center mb-12">
                        <div className="h-10 bg-white/20 rounded w-64 mx-auto mb-4 animate-pulse"></div>
                        <div className="h-6 bg-white/10 rounded w-96 mx-auto animate-pulse"></div>
                    </div>
                    <div className="hidden md:grid grid-cols-3 lg:grid-cols-5 gap-6">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-[320px] rounded-xl bg-white/10 animate-pulse"></div>
                        ))}
                    </div>
                    <div className="md:hidden flex justify-center">
                        <div className="h-[350px] w-full max-w-sm rounded-xl bg-white/10 animate-pulse"></div>
                    </div>
                </div>
            </section>
        );
    }

    // No events found
    if (events.length === 0) {
        return null;
    }

    return (
        <section className="py-10 bg-white">
            <div className="max-w-7xl mx-auto px-[38px]">
                <SectionHeader
                    title="Rambu Solo'"
                    subtitle={locale === 'id'
                        ? 'Upacara pemakaman megah yang menjadi warisan budaya Toraja'
                        : "The grand funeral ceremony that is Toraja's cultural heritage"}
                    align="left"
                    light={false}
                />

                {/* Desktop: Flip Cards Grid */}
                <div className="hidden md:grid grid-cols-3 lg:grid-cols-5 gap-6">
                    {events.map((event, index) => (
                        <motion.div
                            key={event._id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                            className="cursor-pointer"
                        >
                            <Link href={`/${locale}/events/${event.slug}`}>
                                <div className="rounded-xl overflow-hidden border border-gray-300 bg-gray-100 transition-all duration-300">
                                    <div className="relative h-[320px] w-full">
                                        <Image
                                            src={event.image}
                                            alt={event.title[locale]}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="p-4 bg-gray-100">
                                        <h3 className="font-heading font-bold text-lg text-dark mb-2">
                                            {event.title[locale]}
                                        </h3>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Calendar className="w-5 h-5" />
                                            <span className="font-medium">
                                                {formatDate(event.startDate)}
                                                {event.endDate && ` - ${formatDate(event.endDate)}`}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Mobile: Carousel with Navigation */}
                <div className="md:hidden relative">
                    <div className="overflow-hidden">
                        <motion.div
                            animate={{ x: `-${mobileIndex * 100}%` }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="flex"
                        >
                            {events.map((event) => (
                                <div key={event._id} className="w-full flex-shrink-0 px-2">
                                    <Link href={`/${locale}/events/${event.slug}`}>
                                        <div className="rounded-xl overflow-hidden border border-gray-300 bg-gray-100">
                                            <div className="relative h-[350px] w-full">
                                                <Image
                                                    src={event.image}
                                                    alt={event.title[locale]}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="p-4 bg-gray-100">
                                                <div className="flex items-center gap-2 text-sm text-gray mb-2">
                                                    <Calendar className="w-5 h-5" />
                                                    <span>{formatDate(event.startDate)}</span>
                                                    {event.endDate && <span>- {formatDate(event.endDate)}</span>}
                                                </div>
                                                <h3 className="font-heading font-semibold text-xl text-dark mb-3">
                                                    {event.title[locale]}
                                                </h3>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Navigation Arrows */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg z-10"
                        aria-label="Previous"
                    >
                        <ChevronLeft className="w-5 h-5 text-dark" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg z-10"
                        aria-label="Next"
                    >
                        <ChevronRight className="w-5 h-5 text-dark" />
                    </button>

                    {/* Dots Indicator */}
                    <div className="flex justify-center gap-2 mt-6">
                        {events.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setMobileIndex(index)}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${index === mobileIndex
                                    ? 'bg-white w-6'
                                    : 'bg-white/40'
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
