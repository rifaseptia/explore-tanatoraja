'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';
import SectionHeader from '@/components/shared/section-header';
import { useEffect, useState } from 'react';

interface InstagramPost {
    _id: string;
    postUrl: string;
    order: number;
    isActive: boolean;
}

// Fallback sample URLs for demo
const fallbackUrls = [
    'https://www.instagram.com/p/sample1/',
    'https://www.instagram.com/p/sample2/',
    'https://www.instagram.com/p/sample3/',
    'https://www.instagram.com/p/sample4/',
    'https://www.instagram.com/p/sample5/',
];

export default function InstagramFeed() {
    const t = useTranslations('instagram');
    const [posts, setPosts] = useState<InstagramPost[]>([]);
    const [useFallback, setUseFallback] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchPosts() {
            try {
                const res = await fetch('/api/instagram-posts');
                if (res.ok) {
                    const data = await res.json();
                    const validPosts = data.filter((p: InstagramPost) => p.postUrl && p.postUrl.includes('instagram.com'));
                    if (validPosts.length > 0) {
                        setPosts(validPosts);
                    } else if (data.length > 0) {
                        setPosts(data);
                    } else {
                        setUseFallback(true);
                    }
                } else {
                    setUseFallback(true);
                }
            } catch (error) {
                console.error('Error fetching Instagram posts:', error);
                setUseFallback(true);
            } finally {
                setIsLoading(false);
            }
        }
        fetchPosts();
    }, []);

    // Get URLs to display (limit to 5)
    const displayUrls = (useFallback || posts.length === 0
        ? fallbackUrls
        : posts.map(p => p.postUrl)).slice(0, 5);

    return (
        <section className="py-10 bg-white">
            <div className="max-w-7xl mx-auto px-[38px]">
                <SectionHeader
                    title="#social"
                    subtitle={t('subtitle')}
                    align="left"
                />

                {/* Instagram Embed Grid - 5 columns */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {displayUrls.map((url: string, index: number) => {
                        const embedUrl = url.endsWith('/')
                            ? `${url}embed`
                            : `${url}/embed`;

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.03 }}
                                className="w-full rounded-lg overflow-hidden border border-gray-200 bg-white"
                                style={{ height: '280px' }}
                            >
                                <iframe
                                    src={embedUrl}
                                    className="w-full h-full"
                                    frameBorder="0"
                                    scrolling="no"
                                    title={`Instagram post ${index + 1}`}
                                />
                            </motion.div>
                        );
                    })}
                </div>

                {/* Follow Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mt-10"
                >
                    <a
                        href="https://instagram.com/exploretanatoraja"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-8 py-3.5 bg-dark hover:bg-primary text-white font-medium rounded-full transition-colors"
                    >
                        <Instagram className="w-5 h-5" />
                        {t('followUs')}
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
