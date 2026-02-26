'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, ChevronDown } from 'lucide-react';
import Link from 'next/link';

interface HeroSlide {
    image: string;
    video?: string; // Optional video URL (MP4)
    title: { id: string; en: string };
    subtitle: { id: string; en: string };
    ctaText: { id: string; en: string };
    ctaLink: string;
}

interface Props {
    slides?: HeroSlide[];
    locale?: string;
}

const defaultImages = [
    'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=1920&q=80',
    'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1920&q=80',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&q=80',
];

export default function HeroSection({ slides = [], locale = 'en' }: Props) {
    const t = useTranslations('hero');
    const [currentIndex, setCurrentIndex] = useState(0);

    // Use DB slides if available, otherwise use default images
    const hasSlides = slides.length > 0;
    const itemsCount = hasSlides ? slides.length : defaultImages.length;

    // Auto-advance slideshow: 8s zoom out + 1s pause = 9s total
    useEffect(() => {
        if (itemsCount <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % itemsCount);
        }, 9000);
        return () => clearInterval(interval);
    }, [itemsCount]);

    const currentImage = hasSlides ? slides[currentIndex].image : defaultImages[currentIndex];
    const currentVideo = hasSlides ? slides[currentIndex].video : undefined;

    // For text content: usage generic t() for default, or specific slide data
    const title = hasSlides
        ? (slides[currentIndex].title[locale as keyof typeof slides[0]['title']] || slides[currentIndex].title.en)
        : t('tagline');

    const subtitle = hasSlides
        ? (slides[currentIndex].subtitle[locale as keyof typeof slides[0]['subtitle']] || slides[currentIndex].subtitle.en)
        : t('subtitle');

    const ctaText = hasSlides
        ? (slides[currentIndex].ctaText[locale as keyof typeof slides[0]['ctaText']] || slides[currentIndex].ctaText.en)
        : t('exploreButton');

    const ctaLink = hasSlides ? slides[currentIndex].ctaLink : '#destinations';

    return (
        <section className="relative h-[500px] md:h-[700px] w-full flex items-center justify-center overflow-hidden">
            {/* Background - Video or Image Carousel */}
            <AnimatePresence>
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                        opacity: { duration: 1.2, ease: 'easeInOut' }
                    }}
                    className="absolute inset-0"
                >
                    {/* Video Background */}
                    {currentVideo ? (
                        <>
                            <video
                                key={currentVideo}
                                autoPlay
                                muted
                                loop
                                playsInline
                                className="w-full h-full object-cover"
                            >
                                <source src={currentVideo} type="video/mp4" />
                            </video>
                            {/* Gradient Overlay for Video */}
                            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
                        </>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, scale: [1.1, 1] }}
                            exit={{ opacity: 0 }}
                            transition={{
                                opacity: { duration: 1.2, ease: 'easeInOut' },
                                scale: { duration: 8, ease: 'linear' }
                            }}
                            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                            style={{
                                backgroundImage: `url('${currentImage}')`
                            }}
                        >
                            {/* Gradient Overlay for Image */}
                            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
                        </motion.div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Slide Indicators */}
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
                {Array.from({ length: itemsCount }).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex
                            ? 'bg-white w-8'
                            : 'bg-white/50 hover:bg-white/80'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-5xl mx-auto px-[38px] text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    {/* Tagline */}
                    <h1 className="font-heading font-bold text-4xl md:text-6xl lg:text-7xl text-white mb-6 drop-shadow-lg">
                        {title}
                    </h1>

                    {/* Subtitle */}
                    <p className="font-body text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto drop-shadow-md">
                        {subtitle}
                    </p>

                    {/* Explore Button */}
                    <Link
                        href={ctaLink}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-dark font-medium rounded-full hover:bg-primary hover:text-white transition-colors"
                    >
                        {ctaText}
                        <ArrowDown className="w-4 h-4" />
                    </Link>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            {/* <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/80 z-20"
            >
                <span className="text-sm font-medium">{t('scrollDown')}</span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                >
                    <ChevronDown className="w-6 h-6" />
                </motion.div>
            </motion.div>
            */}

            {/* Decorative Pattern */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/50 to-transparent z-10" />
        </section>
    );
}
