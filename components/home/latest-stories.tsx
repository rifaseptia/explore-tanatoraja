'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar } from 'lucide-react';
import SectionHeader from '@/components/shared/section-header';

// Mock articles data
const articles = [
    {
        id: 1,
        slug: 'tips-berkunjung-rambu-solo',
        title: {
            id: 'Tips Berkunjung ke Upacara Rambu Solo\'',
            en: 'Tips for Visiting Rambu Solo\' Ceremony'
        },
        excerpt: {
            id: 'Panduan lengkap tata cara dan etika menghadiri upacara pemakaman tradisional Toraja',
            en: 'Complete guide to etiquette and customs when attending traditional Torajan funeral ceremonies'
        },
        image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&q=80',
        category: { id: 'Tips', en: 'Tips' },
        date: '2026-01-02',
        isFeatured: true,
    },
    {
        id: 2,
        slug: 'lovely-december-2026',
        title: {
            id: 'Lovely December 2026 Segera Digelar',
            en: 'Lovely December 2026 Coming Soon'
        },
        excerpt: {
            id: 'Festival tahunan yang menampilkan keindahan budaya dan alam Tana Toraja',
            en: 'Annual festival showcasing the beauty of Tana Toraja culture and nature'
        },
        image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80',
        category: { id: 'Berita', en: 'News' },
        date: '2026-01-01',
        isFeatured: false,
    },
    {
        id: 3,
        slug: 'kuliner-wajib-coba',
        title: {
            id: '7 Kuliner Wajib Coba di Toraja',
            en: '7 Must-Try Foods in Toraja'
        },
        excerpt: {
            id: 'Dari Pa\'piong hingga Kopi Toraja, jelajahi cita rasa khas daerah ini',
            en: 'From Pa\'piong to Toraja Coffee, explore the unique flavors of this region'
        },
        image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
        category: { id: 'Kuliner', en: 'Culinary' },
        date: '2025-12-28',
        isFeatured: false,
    },
    {
        id: 4,
        slug: 'trekking-batutumonga',
        title: {
            id: 'Panduan Trekking di Batutumonga',
            en: 'Trekking Guide to Batutumonga'
        },
        excerpt: {
            id: 'Rute dan tips untuk menikmati pemandangan sunrise terbaik di Toraja',
            en: 'Routes and tips to enjoy the best sunrise views in Toraja'
        },
        image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80',
        category: { id: 'Petualangan', en: 'Adventure' },
        date: '2025-12-25',
        isFeatured: false,
    },
    {
        id: 5,
        slug: 'sejarah-tongkonan',
        title: {
            id: 'Filosofi di Balik Tongkonan',
            en: 'Philosophy Behind Tongkonan'
        },
        excerpt: {
            id: 'Mengenal lebih dalam makna arsitektur rumah adat Toraja',
            en: 'Understanding the deeper meaning of Torajan traditional house architecture'
        },
        image: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=800&q=80',
        category: { id: 'Budaya', en: 'Culture' },
        date: '2025-12-20',
        isFeatured: false,
    },
];

export default function LatestStories() {
    const t = useTranslations('stories');
    const locale = useLocale() as 'id' | 'en';

    const featuredArticle = articles.find(a => a.isFeatured);
    const otherArticles = articles.filter(a => !a.isFeatured).slice(0, 4);

    const getLocalizedHref = (href: string) => {
        return locale === 'id' ? href : `/${locale}${href}`;
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <section className="py-10 bg-light">
            <div className="max-w-7xl mx-auto px-[38px]">
                <SectionHeader
                    title={locale === 'id' ? 'Berita & Artikel' : 'News & Articles'}
                    subtitle={locale === 'id' ? 'Cerita terbaru seputar Tana Toraja' : 'Latest stories about Tana Toraja'}
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Featured Article */}
                    {featuredArticle && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="lg:row-span-2"
                        >
                            <Link href={getLocalizedHref(`/blog/${featuredArticle.slug}`)}>
                                <div className="relative h-full min-h-[400px] lg:min-h-[500px] rounded-2xl overflow-hidden group">
                                    <Image
                                        src={featuredArticle.image}
                                        alt={featuredArticle.title[locale]}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                                    <div className="absolute top-6 left-6">
                                        <span className="px-3 py-1.5 rounded-full bg-primary text-white text-sm font-medium">
                                            {featuredArticle.category[locale]}
                                        </span>
                                    </div>

                                    <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                                        <div className="flex items-center gap-2 text-white/70 text-sm mb-3">
                                            <Calendar className="w-4 h-4" />
                                            <span>{formatDate(featuredArticle.date)}</span>
                                        </div>
                                        <h3 className="font-heading font-bold text-2xl lg:text-3xl text-white mb-3 group-hover:text-primary transition-colors">
                                            {featuredArticle.title[locale]}
                                        </h3>
                                        <p className="text-white/80 line-clamp-2">
                                            {featuredArticle.excerpt[locale]}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    )}

                    {/* Other Articles Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {otherArticles.map((article, index) => (
                            <motion.div
                                key={article.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.6 }}
                            >
                                <Link href={getLocalizedHref(`/blog/${article.slug}`)}>
                                    <div className="bg-white rounded-xl overflow-hidden group border border-gray-200 hover:border-gray-300 transition-all">
                                        <div className="relative h-40 overflow-hidden">
                                            <Image
                                                src={article.image}
                                                alt={article.title[locale]}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute top-3 left-3">
                                                <span className="px-2 py-1 rounded-full bg-white/90 text-dark text-xs font-medium">
                                                    {article.category[locale]}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <div className="flex items-center gap-1 text-gray text-xs mb-2">
                                                <Calendar className="w-3 h-3" />
                                                <span>{formatDate(article.date)}</span>
                                            </div>
                                            <h3 className="font-heading font-semibold text-dark line-clamp-2 group-hover:text-primary transition-colors">
                                                {article.title[locale]}
                                            </h3>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* View All Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mt-10"
                >
                    <Link
                        href={getLocalizedHref('/blog')}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-dark hover:bg-primary text-white font-medium rounded-full transition-colors"
                    >
                        {locale === 'id' ? 'Lihat Semua Artikel' : 'View All Articles'}
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
