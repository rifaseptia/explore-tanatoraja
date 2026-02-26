'use client';

import { Image as ImageIcon } from 'lucide-react';

export default function PromoSection() {
    return (
        <section className="relative h-[400px] flex items-center justify-center overflow-hidden bg-gray-100">
            {/* Background Placeholder */}
            <div className="absolute inset-0 w-full h-full bg-neutral-200 flex flex-col items-center justify-center text-neutral-400">
                <ImageIcon className="w-16 h-16 mb-4 opacity-50" />
                <p className="font-medium text-lg">Promo Banner Area</p>
                <p className="text-sm">(Image configurable via CMS)</p>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-[38px] w-full text-center">
                {/* Content area is empty as requested */}
            </div>
        </section>
    );
}
