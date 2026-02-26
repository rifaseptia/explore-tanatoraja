'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

// Wrapper component for InteractiveMap to handle SSR issues in Next.js 16
// Leaflet requires window object which doesn't exist on server

export default function InteractiveMapWrapper() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return (
            <div className="h-[500px] w-full rounded-2xl bg-gray/5 animate-pulse flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-violet border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray text-sm">Loading map...</p>
                </div>
            </div>
        );
    }

    const InteractiveMap = dynamic(
        () => import('@/components/home/interactive-map'),
        {
            ssr: false,
            loading: () => (
                <div className="h-[500px] w-full rounded-2xl bg-gray/5 animate-pulse flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-12 h-12 border-4 border-violet border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-gray text-sm">Loading map...</p>
                    </div>
                </div>
            )
        }
    );

    return <InteractiveMap />;
}
