'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

// Wrapper component for Leaflet maps to handle SSR issues in Next.js 16
// Leaflet requires window object which doesn't exist on server

interface MapWrapperProps {
    coordinates: [number, number];
    title: string;
    height?: string;
}

export default function MapWrapper({ coordinates, title, height = 'h-[350px]' }: MapWrapperProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return (
            <div className={`w-full ${height} rounded-2xl bg-gray-100 animate-pulse`} />
        );
    }

    const DestinationMap = dynamic(
        () => import('@/components/shared/destination-map'),
        {
            ssr: false,
            loading: () => (
                <div className={`w-full ${height} rounded-2xl bg-gray-100 animate-pulse`} />
            )
        }
    );

    return <DestinationMap coordinates={coordinates} title={title} />;
}
