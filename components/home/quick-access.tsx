'use client';

import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';

const categories = [
    { id: 'destinations', icon: '/icons/location-pin-navigation-destination-maps-svgrepo-com.svg', href: '/destinations' },
    { id: 'events', icon: '/icons/wish-list-events-svgrepo-com.svg', href: '/events' },
    { id: 'culinary', icon: '/icons/food-dinner-dish-plate-fork-svgrepo-com.svg', href: '/culinary' },
    { id: 'accommodation', icon: '/icons/hotel-svgrepo-com.svg', href: '/stay' },
    { id: 'articles', icon: '/icons/suitcase-svgrepo-com.svg', href: '/articles' },
];

export default function QuickAccess() {
    const locale = useLocale();
    const t = useTranslations('quickAccess');

    const getLocalizedHref = (href: string) => {
        return locale === 'id' ? href : `/${locale}${href}`;
    };

    return (
        <section className="relative z-10 bg-[#EDE9FE]">
            {/* Desktop */}
            <div className="hidden md:block max-w-6xl mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-heading font-bold text-[#2D2456] mb-3">
                        {t('title')}
                    </h2>
                    <p className="text-[#4C4670] max-w-2xl mx-auto opacity-80">
                        {t('subtitle')}
                    </p>
                </div>
                <div className="grid grid-cols-5 gap-8">
                    {categories.map((cat, index) => (
                        <motion.div
                            key={cat.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.08, duration: 0.4 }}
                        >
                            <Link
                                href={getLocalizedHref(cat.href)}
                                className="flex flex-col items-center gap-4 group cursor-pointer"
                            >
                                <div className="w-[88px] h-[88px] rounded-2xl bg-white border border-[#C4B5FD] flex items-center justify-center transition-all duration-300 group-hover:border-[#A78BFA] group-hover:scale-110">
                                    <Image
                                        src={cat.icon}
                                        alt={t(cat.id)}
                                        width={48}
                                        height={48}
                                        className="transition-transform duration-300 group-hover:scale-110"
                                    />
                                </div>
                                <span className="text-sm font-semibold text-[#4C4670] transition-colors text-center leading-tight">
                                    {t(cat.id)}
                                </span>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Mobile */}
            <div className="md:hidden px-6 py-12">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-heading font-bold text-[#2D2456] mb-2">
                        {t('title')}
                    </h2>
                    <p className="text-sm text-[#4C4670] opacity-80">
                        {t('subtitle')}
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-8 justify-items-center">
                    {categories.map((cat, index) => (
                        <motion.div
                            key={cat.id}
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.06, duration: 0.35 }}
                        >
                            <Link
                                href={getLocalizedHref(cat.href)}
                                className="flex flex-col items-center gap-3"
                            >
                                <div className="w-[88px] h-[88px] rounded-2xl bg-white border border-[#C4B5FD] flex items-center justify-center active:border-[#A78BFA] transition-colors shadow-sm">
                                    <Image
                                        src={cat.icon}
                                        alt={t(cat.id)}
                                        width={48}
                                        height={48}
                                    />
                                </div>
                                <span className="text-sm font-semibold text-[#4C4670] text-center leading-tight">
                                    {t(cat.id)}
                                </span>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
