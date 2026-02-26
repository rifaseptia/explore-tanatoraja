'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Send, Check, Lock } from 'lucide-react';

export default function NewsletterSignup() {
    const t = useTranslations('newsletter');
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
        setIsSubmitted(true);
        setEmail('');
    };

    return (
        <section className="py-10 bg-dark">
            <div className="max-w-4xl mx-auto px-[38px] text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mb-4">
                        {t('title')}
                    </h2>
                    <p className="text-white/70 text-lg mb-8">
                        {t('subtitle')}
                    </p>

                    {isSubmitted ? (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white/10 backdrop-blur-sm rounded-full py-4 px-8 inline-flex items-center gap-3"
                        >
                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                                <Check className="w-5 h-5 text-dark" />
                            </div>
                            <span className="text-white font-medium">{t('success')}</span>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder={t('placeholder')}
                                        required
                                        className="w-full px-6 py-4 rounded-full bg-white text-dark placeholder:text-gray focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-8 py-4 bg-primary hover:bg-primary/90 text-white font-medium rounded-full transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            {t('button')}
                                            <Send className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Privacy Note */}
                            <div className="flex items-center justify-center gap-2 mt-4 text-white/50 text-sm">
                                <Lock className="w-4 h-4" />
                                <span>{t('privacy')}</span>
                            </div>
                        </form>
                    )}
                </motion.div>
            </div>
        </section>
    );
}
