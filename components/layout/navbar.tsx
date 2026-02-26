'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, ChevronDown } from 'lucide-react';
import LanguageSwitcher from './language-switcher';

type NavLink = {
    key: string;
    href?: string;
    children?: { key: string; href: string; prefetch?: boolean }[];
    prefetch?: boolean;
};

const navLinks: NavLink[] = [
    {
        key: 'destinations',
        href: '/destinations',
        children: [
            { key: 'destinations', href: '/destinations' }
        ]
    },
    {
        key: 'experiences',
        children: [
            { key: 'culinary', href: '/culinary' },
            { key: 'events', href: '/events' },
        ]
    },
    {
        key: 'plan',
        children: [
            { key: 'stay', href: '/stay' },
            { key: 'transport', href: '/transport' },
        ]
    },
    {
        key: 'gallery',
        href: '/gallery',
        children: [
            { key: 'gallery', href: '/gallery' },
            { key: 'articles', href: '/articles' }
        ]
    },
];

export default function Navbar() {
    const t = useTranslations('nav');
    const locale = useLocale();
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    // Check if we're on a detail page
    const isDetailPage = pathname.includes('/destinations/') || pathname.includes('/events/') || pathname.includes('/culinary/') || pathname.includes('/stay/') || pathname.includes('/transport/') || pathname.includes('/articles/');

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const getLocalizedHref = (href: string) => {
        return locale === 'id' ? href : `/${locale}${href}`;
    };

    return (
        <>


            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-20`}
                onMouseLeave={() => setActiveDropdown(null)}
            >
                {/* Navbar Content (Background + Links) */}
                <div
                    className={`relative z-50 h-full w-full transition-all duration-300 ${(isScrolled || isDetailPage || activeDropdown)
                        ? 'bg-white/95 backdrop-blur-md shadow-sm'
                        : 'bg-transparent'
                        }`}
                >
                    <div className="max-w-7xl mx-auto px-[38px] h-full">
                        <div className="flex items-center justify-between h-full">
                            {/* Logo */}
                            <Link href={getLocalizedHref('/')} className="flex items-center gap-2">
                                <div className={`font-heading font-bold text-xl md:text-2xl transition-colors ${(isScrolled || isDetailPage || activeDropdown) ? 'text-primary' : 'text-white'
                                    }`}>
                                    <span className="text-primary">EXPLORE</span>{' '}
                                    <span className={(isScrolled || isDetailPage || activeDropdown) ? 'text-dark' : 'text-white'}>TANA TORAJA</span>
                                </div>
                            </Link>

                            {/* Desktop Navigation */}
                            <div className="hidden lg:flex items-center gap-8 h-full">
                                {navLinks.map((link) => (
                                    <div
                                        key={link.key}
                                        className="relative h-full flex items-center px-4 cursor-pointer"
                                        onMouseEnter={() => link.children && setActiveDropdown(link.key)}
                                        onClick={() => !link.children && setActiveDropdown(null)}
                                    >
                                        <Link
                                            href={getLocalizedHref(link.href || '#')}
                                            prefetch={link.prefetch} // Support disabling prefetch
                                            className={`flex items-center gap-1 font-medium text-sm tracking-wide transition-colors py-2 border-b-2 border-transparent ${(isScrolled || isDetailPage || activeDropdown) ? 'text-dark hover:text-primary hover:border-primary' : 'text-white hover:text-white/80'
                                                } ${activeDropdown === link.key ? '!text-primary !border-primary' : ''}`}
                                            onClick={(e) => {
                                                if (link.children) e.preventDefault();
                                            }}
                                        >
                                            {t(link.key)}
                                        </Link>
                                    </div>
                                ))}
                            </div>

                            {/* Right Side */}
                            <div className="flex items-center gap-4">
                                {/* Search Button */}
                                <button
                                    onClick={() => setIsSearchOpen(true)}
                                    className={`p-2 rounded-full transition-colors ${(isScrolled || isDetailPage || activeDropdown)
                                        ? 'hover:bg-cream text-dark'
                                        : 'hover:bg-white/20 text-white'
                                        }`}
                                    aria-label="Search"
                                >
                                    <Search className="w-5 h-5" />
                                </button>

                                {/* Language Switcher */}
                                <LanguageSwitcher isScrolled={isScrolled || isDetailPage || activeDropdown !== null} />

                                {/* Mobile Menu Button */}
                                <button
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                    className={`lg:hidden p-2 rounded-full transition-colors relative z-50 ${(isScrolled || isDetailPage || isMobileMenuOpen || activeDropdown)
                                        ? 'text-dark hover:bg-cream'
                                        : 'text-white hover:bg-white/20'
                                        }`}
                                    aria-label="Menu"
                                >
                                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mega Menu Overlay - Visit Seoul Style */}
                <AnimatePresence>
                    {activeDropdown && (
                        <motion.div
                            key="mega-menu-dropdown"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-sm z-40 overflow-hidden hidden lg:block"
                            style={{ minHeight: '50vh' }}
                            onMouseEnter={() => {/* keep open */ }}
                            onMouseLeave={() => setActiveDropdown(null)}
                        >
                            <div className="max-w-7xl mx-auto px-[38px] py-12">
                                <div className="flex items-start gap-24">
                                    {/* Left: Category Title */}
                                    <div className="w-1/4 shrink-0">
                                        <h3 className="text-3xl font-heading font-medium text-dark">
                                            {t(activeDropdown)}
                                        </h3>
                                        <div className="mt-4 w-12 h-1 bg-primary rounded-full"></div>
                                    </div>

                                    {/* Right: Menu Links List */}
                                    <div className="flex-1">
                                        <div className="flex flex-col flex-wrap max-h-[300px] gap-x-16 gap-y-4 content-start">
                                            {navLinks.find(l => l.key === activeDropdown)?.children?.map((child) => (
                                                <Link
                                                    key={child.key}
                                                    href={getLocalizedHref(child.href!)}
                                                    onClick={() => setActiveDropdown(null)}
                                                    className="group text-lg text-gray-600 hover:text-primary transition-colors py-1 font-medium"
                                                >
                                                    {t(child.key)}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: 'tween', duration: 0.3 }}
                        className="fixed inset-0 z-[60] lg:hidden bg-white"
                    >
                        {/* Mobile Menu Header */}
                        <div className="flex items-center justify-between px-6 h-20 border-b border-gray-100">
                            <span className="font-heading font-bold text-xl text-primary">MENU</span>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-2 -mr-2 text-gray-500 hover:text-dark"
                            >
                                <X className="w-8 h-8" />
                            </button>
                        </div>

                        {/* Mobile Menu Content */}
                        <div className="h-[calc(100vh-80px)] overflow-y-auto">
                            <div className="px-6 py-6 space-y-6">
                                {/* Utilities (Language) */}
                                <div className="flex items-center justify-end">
                                    <LanguageSwitcher isScrolled={true} />
                                </div>

                                {/* Navigation Links - Accordion Style */}
                                <div className="flex flex-col">
                                    {navLinks.map((link) => (
                                        <div key={link.key} className="border-b border-gray-100 last:border-0">
                                            <button
                                                onClick={() => setActiveDropdown(activeDropdown === link.key ? null : link.key)}
                                                className="w-full flex items-center justify-between py-5 text-left group"
                                            >
                                                <span className={`text-xl font-bold font-heading transition-colors ${activeDropdown === link.key ? 'text-primary' : 'text-dark'}`}>
                                                    {t(link.key)}
                                                </span>
                                                <ChevronDown
                                                    className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${activeDropdown === link.key ? 'rotate-180 text-primary' : ''}`}
                                                />
                                            </button>

                                            {/* Mobile Submenu Accordion */}
                                            <AnimatePresence>
                                                {activeDropdown === link.key && link.children && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="pb-6 flex flex-col pl-4">
                                                            {link.children.map((child) => (
                                                                <Link
                                                                    key={child.key}
                                                                    href={getLocalizedHref(child.href!)}
                                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                                    className="py-3 text-base text-gray-600 hover:text-primary border-b border-gray-50 last:border-0 flex items-center justify-between"
                                                                >
                                                                    <span>{t(child.key)}</span>
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Search Overlay */}
            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/80 flex items-start justify-center pt-32"
                        onClick={() => setIsSearchOpen(false)}
                    >
                        <motion.div
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -50, opacity: 0 }}
                            className="w-full max-w-2xl mx-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder={t('search')}
                                    className="w-full px-6 py-4 text-lg rounded-full bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    autoFocus
                                />
                                <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-gray w-6 h-6" />
                            </div>
                            <button
                                onClick={() => setIsSearchOpen(false)}
                                className="mt-4 text-white/80 hover:text-white text-center w-full"
                            >
                                Press ESC or click to close
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
