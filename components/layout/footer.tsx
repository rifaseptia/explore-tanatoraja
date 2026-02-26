'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail } from 'lucide-react';

const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com/exploretanatoraja', label: 'Facebook', color: 'hover:bg-[#1877F2]' },
    { icon: Instagram, href: 'https://instagram.com/exploretanatoraja', label: 'Instagram', color: 'hover:bg-[#E1306C]' },
    { icon: Twitter, href: 'https://twitter.com/exploretoraja', label: 'Twitter', color: 'hover:bg-[#1DA1F2]' },
    { icon: Youtube, href: 'https://youtube.com/@exploretanatoraja', label: 'YouTube', color: 'hover:bg-[#FF0000]' },
];

export default function Footer() {
    const t = useTranslations('footer');
    const locale = useLocale();

    const getLocalizedHref = (href: string) => {
        return `/${locale}${href}`;
    };

    return (
        <footer className="bg-[#4C4670] text-white">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-[38px] py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
                    {/* Brand Column */}
                    <div className="lg:col-span-2">
                        <div className="font-heading font-bold text-2xl mb-4">
                            <span className="text-[#FDE68A]">EXPLORE</span> TANA TORAJA
                        </div>
                        <p className="text-white/70 mb-6 max-w-sm">
                            {t('description')}
                        </p>
                        {/* Social Links */}
                        <div className="flex gap-3">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`w-10 h-10 rounded-full bg-white/10 flex items-center justify-center ${social.color} transition-colors`}
                                    aria-label={social.label}
                                >
                                    <social.icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Explore Column */}
                    <div>
                        <h3 className="font-heading font-semibold text-lg mb-4">{t('explore.title')}</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href={getLocalizedHref('/destinations')} className="text-gray hover:text-white transition-colors">
                                    {t('explore.destinations')}
                                </Link>
                            </li>
                            <li>
                                <Link href={getLocalizedHref('/events')} className="text-gray hover:text-white transition-colors">
                                    {t('explore.events')}
                                </Link>
                            </li>
                            <li>
                                <Link href={getLocalizedHref('/culinary')} className="text-gray hover:text-white transition-colors">
                                    {t('explore.culinary')}
                                </Link>
                            </li>
                            <li>
                                <Link href={getLocalizedHref('/gallery')} className="text-gray hover:text-white transition-colors">
                                    {t('explore.gallery')}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Plan Column */}
                    <div>
                        <h3 className="font-heading font-semibold text-lg mb-4">{t('plan.title')}</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href={getLocalizedHref('/transport')} className="text-gray hover:text-white transition-colors">
                                    {t('plan.gettingThere')}
                                </Link>
                            </li>
                            <li>
                                <Link href={getLocalizedHref('/stay')} className="text-gray hover:text-white transition-colors">
                                    {t('plan.accommodation')}
                                </Link>
                            </li>
                            <li>
                                <Link href={getLocalizedHref('/about-us')} className="text-gray hover:text-white transition-colors">
                                    {t('plan.aboutUs')}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div>
                        <h3 className="font-heading font-semibold text-lg mb-4">{t('contact.title')}</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                <span className="text-gray text-sm">{t('contact.address')}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                                <span className="text-gray text-sm">{t('contact.phone')}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                                <span className="text-gray text-sm">{t('contact.email')}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10">
                <div className="max-w-7xl mx-auto px-[38px] py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-gray text-sm text-center md:text-left">
                            {t('copyright')}
                        </p>
                        <div className="flex flex-wrap gap-6">
                            <Link href={getLocalizedHref('/privacy-policy')} className="text-gray text-sm hover:text-white transition-colors">
                                Privacy Policy
                            </Link>
                            <Link href={getLocalizedHref('/terms')} className="text-gray text-sm hover:text-white transition-colors">
                                Terms of Use
                            </Link>
                            <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="text-gray text-sm hover:text-white transition-colors">
                                Sitemap
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
