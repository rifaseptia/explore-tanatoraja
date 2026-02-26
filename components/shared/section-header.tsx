'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useLocale } from 'next-intl';

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    align?: 'left' | 'center';
    light?: boolean;
    viewMoreHref?: string;
    viewMoreText?: {
        id: string;
        en: string;
    };
    mobileViewMore?: boolean;
    variant?: 'link' | 'button';
}

export default function SectionHeader({
    title,
    subtitle,
    align = 'center',
    light = false,
    viewMoreHref,
    viewMoreText,
    mobileViewMore = true,
    variant = 'link'
}: SectionHeaderProps) {
    const locale = useLocale() as 'id' | 'en';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={`mb-12 ${align === 'center' ? 'text-center' : 'text-left'}`}
        >
            <div className={`flex items-end justify-between ${align === 'center' ? 'flex-col gap-4' : ''}`}>
                <div className={align === 'center' ? 'text-center' : ''}>
                    <h2 className={`font-heading font-bold text-3xl md:text-4xl mb-4 ${light ? 'text-white' : 'text-dark'
                        }`}>
                        {title}
                    </h2>
                    {subtitle && (
                        <p className={`text-lg max-w-2xl ${align === 'center' ? 'mx-auto' : ''
                            } ${light ? 'text-white/80' : 'text-gray'}`}>
                            {subtitle}
                        </p>
                    )}
                </div>
                {viewMoreHref && (
                    <Link
                        href={viewMoreHref}
                        className={
                            variant === 'button'
                                ? `hidden md:flex items-center gap-2 px-6 py-3 border border-indigo-100 bg-white hover:border-[#A78BFA] hover:text-[#A78BFA] text-gray-600 rounded-full transition-all duration-300 shadow-sm hover:shadow-md group ${align === 'center' ? 'mt-6' : ''}`
                                : `flex items-center gap-1 text-violet-600 hover:text-violet-800 font-medium transition-colors ${align === 'center' ? 'mt-4' : ''} ${mobileViewMore === false ? 'hidden md:flex' : ''}`
                        }
                    >
                        <span className={variant === 'button' ? "font-medium" : ""}>
                            {viewMoreText?.[locale] || (locale === 'id' ? 'Lihat Lainnya' : 'View More')}
                        </span>
                        {variant === 'button' ? null : (
                            <ChevronRight className="w-4 h-4" />
                        )}
                    </Link>
                )}
            </div>
        </motion.div>
    );
}
