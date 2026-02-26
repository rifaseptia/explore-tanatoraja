'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function CultureHighlight() {
    const t = useTranslations('culture');
    const locale = useLocale();

    const getLocalizedHref = (href: string) => {
        return locale === 'id' ? href : `/${locale}${href}`;
    };

    return (
        <section className="relative py-10 overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-fixed"
                style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1920&q=80')`
                }}
            >
                <div className="absolute inset-0 bg-black/70" />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-4xl mx-auto px-[38px] text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    {/* Title */}
                    <h2 className="font-heading font-bold text-3xl md:text-5xl text-white mb-4">
                        {t('title')}
                    </h2>

                    {/* Subtitle */}
                    <p className="text-lg text-white/80 mb-10">
                        {t('subtitle')}
                    </p>

                    {/* Quote */}
                    <blockquote className="font-accent italic text-xl md:text-2xl text-white mb-12 leading-relaxed">
                        {t('quote')}
                    </blockquote>

                    {/* CTA Button */}
                    <Link
                        href={getLocalizedHref('/culture')}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 text-white font-semibold rounded-full transition-all hover:scale-105"
                    >
                        {t('exploreButton')}
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </motion.div>

                {/* Decorative Pattern */}
                <div className="absolute top-10 left-10 w-20 h-20 border-2 border-primary/30 rounded-full opacity-50" />
                <div className="absolute bottom-10 right-10 w-32 h-32 border-2 border-secondary/30 rounded-full opacity-50" />
            </div>
        </section>
    );
}
