'use client';

import { useEffect, useRef, useState } from 'react';

interface DestinationMapProps {
    coordinates: [number, number];
    title: string;
}

export default function DestinationMap({ coordinates, title }: DestinationMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isClient || !mapRef.current) return;

        // Leaflet requires window, so import dynamically inside useEffect
        const initMap = async () => {
            const L = (await import('leaflet')).default;

            // Import CSS dynamically
            if (typeof document !== 'undefined' && !document.querySelector('link[href*="leaflet.css"]')) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                document.head.appendChild(link);
            }

            // Fix Key not found for markers
            delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            });

            // Initialize map
            if (!mapInstanceRef.current && mapRef.current) {
                mapInstanceRef.current = L.map(mapRef.current).setView(coordinates, 13);

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                }).addTo(mapInstanceRef.current);

                const marker = L.marker(coordinates).addTo(mapInstanceRef.current);
                marker.bindPopup(`<b style="font-size: 14px;">${title}</b>`).openPopup();
            } else if (mapInstanceRef.current) {
                mapInstanceRef.current.setView(coordinates, 13);
            }
        };

        initMap();

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [coordinates, title, isClient]);

    if (!isClient) {
        return (
            <div className="relative w-full h-[350px] rounded-2xl overflow-hidden shadow-lg border border-gray-100 z-0 bg-gray-100 animate-pulse" />
        );
    }

    return (
        <div className="relative w-full h-[350px] rounded-2xl overflow-hidden shadow-lg border border-gray-100 z-0">
            <div ref={mapRef} className="w-full h-full" />
        </div>
    );
}
