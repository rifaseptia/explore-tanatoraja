'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';

export default function WelcomeSection() {
    const t = useTranslations('welcome');

    return (
        <section className="py-10 bg-gradient-to-b from-white to-violet-50/30">
            <div className="max-w-4xl mx-auto px-[38px] text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Heading */}
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4"
                    >
                        {t('heading')}
                    </motion.h2>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto leading-relaxed"
                    >
                        {t('description')}
                    </motion.p>
                </motion.div>
            </div>
        </section>
    );
}
