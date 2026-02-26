'use client';

import { useEffect, useRef } from 'react';
import { MapPin, Loader2 } from 'lucide-react';

interface EventMapProps {
    coordinates: [number, number]; // [lng, lat]
    locationName: string;
}

export default function EventMap({ coordinates, locationName }: EventMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);

    useEffect(() => {
        if (typeof window === 'undefined' || !mapRef.current) return;

        const initMap = async () => {
            const L = (await import('leaflet')).default;

            // Import CSS
            if (!document.querySelector('link[href*="leaflet.css"]')) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                document.head.appendChild(link);
            }

            // Fix default marker icons
            delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            });

            // Initialize map
            if (!mapInstanceRef.current && mapRef.current) {
                mapInstanceRef.current = L.map(mapRef.current).setView([coordinates[1], coordinates[0]], 15);

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                }).addTo(mapInstanceRef.current);

                // Add marker
                L.marker([coordinates[1], coordinates[0]])
                    .addTo(mapInstanceRef.current)
                    .bindPopup(locationName)
                    .openPopup();
            }
        };

        initMap();

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [coordinates, locationName]);

    return (
        <div className="relative w-full h-[250px] rounded-2xl overflow-hidden bg-gray-50 border border-gray-200">
            <div ref={mapRef} className="h-full w-full" />
        </div>
    );
}
