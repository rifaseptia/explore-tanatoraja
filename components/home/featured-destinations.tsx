'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Destination } from '@/types/destination';

interface FeaturedDestinationsProps {
    destinations: Destination[];
}

export default function FeaturedDestinations({ destinations }: FeaturedDestinationsProps) {
    const t = useTranslations('featured');
    const locale = useLocale() as 'id' | 'en';
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    const getLocalizedHref = (href: string) => {
        return locale === 'id' ? href : `/${locale}${href}`;
    };

    // Desktop: 4 items per page, Mobile: 1 item per page
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const itemsPerPage = isMobile ? 1 : 4;
    const totalItems = destinations.length;
    const totalSlides = Math.max(1, Math.ceil(totalItems / itemsPerPage));

    const [isTransitioning, setIsTransitioning] = useState(false);

    const nextSlide = useCallback(() => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentIndex((prev) => prev + 1);
    }, [isTransitioning]);

    const prevSlide = useCallback(() => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentIndex((prev) => prev - 1);
    }, [isTransitioning]);

    const goToSlide = (index: number) => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentIndex(index);
    };

    // Handle infinite loop transition
    useEffect(() => {
        if (!isTransitioning) return;

        const timeout = setTimeout(() => {
            if (currentIndex >= totalSlides) {
                setCurrentIndex(0);
            }
            else if (currentIndex < 0) {
                setCurrentIndex(totalSlides - 1);
            }
            setIsTransitioning(false);
        }, 500);

        return () => clearTimeout(timeout);
    }, [currentIndex, totalSlides, isTransitioning]);

    // Auto-play functionality - faster on mobile (3 seconds)
    useEffect(() => {
        if (!isAutoPlaying || totalItems <= itemsPerPage) return;

        const interval = setInterval(() => {
            nextSlide();
        }, isMobile ? 3000 : 4000);

        return () => clearInterval(interval);
    }, [isAutoPlaying, totalItems, nextSlide, isMobile, itemsPerPage]);

    const getVisibleDestinations = () => {
        let start = currentIndex * itemsPerPage;
        let visible: Destination[] = [];

        for (let i = 0; i < itemsPerPage; i++) {
            let index = (start + i) % totalItems;
            if (index < 0) index = totalItems + index;
            visible.push(destinations[index]);
        }

        return visible;
    };

    const hasMultipleSlides = totalItems > itemsPerPage;

    if (totalItems === 0) return null;

    return (
        <section id="destinations" className="py-10 bg-white">
            <div className="max-w-7xl mx-auto px-[38px]">
                {/* Section Header - Desktop only */}
                <div className="hidden md:block mb-12">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="font-heading font-bold text-3xl md:text-4xl text-dark mb-4">
                                {t('title')}
                            </h2>
                            <p className="text-lg text-gray">
                                {t('subtitle')}
                            </p>
                        </div>
                        <Link
                            href={getLocalizedHref('/destinations')}
                            className="hidden md:flex items-center gap-2 px-6 py-3 border border-indigo-100 bg-white hover:border-[#A78BFA] hover:text-[#A78BFA] text-gray-600 rounded-full transition-all duration-300 shadow-sm hover:shadow-md group"
                        >
                            {locale === 'id' ? 'Lihat Lainnya' : 'View More'}
                        </Link>
                    </div>
                </div>

                {/* Mobile Header */}
                <div className="md:hidden mb-8">
                    <h2 className="font-heading font-bold text-3xl text-dark mb-2">
                        {t('title')}
                    </h2>
                    <p className="text-lg text-gray">
                        {t('subtitle')}
                    </p>
                </div>

                {/* Carousel Container */}
                <div
                    className="relative"
                    onMouseEnter={() => setIsAutoPlaying(false)}
                    onMouseLeave={() => setIsAutoPlaying(true)}
                >
                    {/* Navigation Arrows - Show on all screens */}
                    {hasMultipleSlides && (
                        <>
                            <button
                                onClick={prevSlide}
                                className="absolute left-2 md:left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 md:-translate-x-6 z-20 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#A78BFA] hover:text-white transition-all duration-300"
                                aria-label="Previous slide"
                            >
                                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                            </button>

                            <button
                                onClick={nextSlide}
                                className="absolute right-2 md:right-0 top-1/2 -translate-y-1/2 translate-x-1/2 md:translate-x-6 z-20 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#A78BFA] hover:text-white transition-all duration-300"
                                aria-label="Next slide"
                            >
                                <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                            </button>
                        </>
                    )}

                    {/* Carousel Content */}
                    <div className="overflow-hidden px-2">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, x: 100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className={isMobile
                                    ? 'grid grid-cols-1 gap-4'
                                    : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6'
                                }
                            >
                                {getVisibleDestinations().map((destination) => (
                                    <Link
                                        key={destination.slug}
                                        href={getLocalizedHref(`/destinations/${destination.slug}`)}
                                    >
                                        <div className="rounded-2xl overflow-hidden group border border-gray-300 bg-gray-100 h-full flex flex-col transition-all duration-300">
                                            <div className="relative h-[280px] md:h-[320px] flex-shrink-0">
                                                <Image
                                                    src={destination.featuredImage}
                                                    alt={destination.title[locale]}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="p-4 md:p-5 bg-gray-50 flex-1">
                                                <h3 className="font-heading font-bold text-2xl md:text-lg text-dark mb-2 group-hover:text-[#A78BFA] transition-colors">
                                                    {destination.title[locale]}
                                                </h3>
                                                <p className="hidden md:block text-dark text-xs md:text-sm line-clamp-1">
                                                    {(destination.excerpt?.[locale] || destination.description[locale]).split(' ').slice(0, 5).join(' ')}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Dots Indicator */}
                    {hasMultipleSlides && (
                        <div className="flex justify-center gap-2 mt-6 md:mt-8">
                            {Array.from({ length: totalSlides }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={`h-2 rounded-full transition-all duration-300 ${currentIndex % totalSlides === index
                                        ? 'bg-[#A78BFA] w-6 md:w-8'
                                        : 'bg-gray-300 hover:bg-gray-400 w-2'
                                        }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Mobile: View More Button below carousel */}
                {isMobile && (
                    <div className="mt-8 text-center">
                        <Link
                            href={getLocalizedHref('/destinations')}
                            className="inline-flex items-center gap-2 px-8 py-4 bg-[#A78BFA] hover:bg-[#8B5CF6] text-white font-medium rounded-full transition-colors shadow-lg"
                        >
                            {locale === 'id' ? 'Lihat Lainnya' : 'View More'}
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}
