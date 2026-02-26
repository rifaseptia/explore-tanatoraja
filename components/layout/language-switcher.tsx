'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
    isScrolled?: boolean;
}

export default function LanguageSwitcher({ isScrolled = false }: LanguageSwitcherProps) {
    const locale = useLocale();
    const pathname = usePathname();
    const router = useRouter();

    const switchLocale = () => {
        const newLocale = locale === 'id' ? 'en' : 'id';
        // Use next-intl navigation to switch locale while keeping the same path
        router.push(pathname, { locale: newLocale });
    };

    return (
        <button
            onClick={switchLocale}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-medium text-sm transition-all ${isScrolled
                ? 'bg-cream hover:bg-secondary/20 text-dark'
                : 'bg-white/20 hover:bg-white/30 text-white'
                }`}
        >
            <Globe className="w-4 h-4" />
            <span className="uppercase">{locale}</span>
        </button>
    );
}
