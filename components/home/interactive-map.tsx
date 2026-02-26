'use client';

import { useEffect, useState, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import SectionHeader from '@/components/shared/section-header';
import { useDestinations } from '@/hooks/useDestinations';
import { MapPin, Loader2 } from 'lucide-react';

// Tana Toraja coordinates
const TORAJA_CENTER: [number, number] = [-3.0747, 119.8654];
const ZOOM_LEVEL = 13;

// Category filter options - Destination categories only
const categories = [
    { key: 'all', label: { id: 'Semua Destinasi', en: 'All Destinations' } },
    { key: 'cultural', label: { id: 'Budaya', en: 'Culture' } },
    { key: 'nature', label: { id: 'Alam', en: 'Nature' } },
    { key: 'adventure', label: { id: 'Petualangan', en: 'Adventure' } },
];

// Map skeleton loader
function MapSkeleton() {
    return (
        <div className="h-[500px] w-full rounded-2xl bg-gray/5 animate-pulse flex items-center justify-center">
            <div className="text-center">
                <Loader2 className="w-12 h-12 text-violet animate-spin mx-auto mb-4" />
                <p className="text-gray text-sm">Loading map...</p>
            </div>
        </div>
    );
}

export default function InteractiveMap() {
    const t = useTranslations('map');
    const locale = useLocale() as 'id' | 'en';
    const [activeCategory, setActiveCategory] = useState('all');
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const markersRef = useRef<L.Marker[]>([]);

    // Fetch destinations from API
    const { destinations, isLoading, isError } = useDestinations(activeCategory);

    // Filter destinations with valid coordinates
    const validDestinations = destinations.filter(d =>
        d.location?.coordinates?.length === 2 &&
        typeof d.location.coordinates[0] === 'number' &&
        typeof d.location.coordinates[1] === 'number'
    );

    // Initialize map on client side
    useEffect(() => {
        if (typeof window === 'undefined' || !mapRef.current || isLoading) return;

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

            // Initialize map if not already done
            if (!mapInstanceRef.current && mapRef.current) {
                mapInstanceRef.current = L.map(mapRef.current).setView(TORAJA_CENTER, ZOOM_LEVEL);

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                }).addTo(mapInstanceRef.current);
            }

            // Clear existing markers
            markersRef.current.forEach(marker => marker.remove());
            markersRef.current = [];

            // Add new markers
            validDestinations.forEach(destination => {
                const marker = L.marker([
                    destination.location.coordinates[1], // lat
                    destination.location.coordinates[0]  // lng
                ]).addTo(mapInstanceRef.current!);

                // Create popup content
                const popupContent = `
                    <div style="min-width: 180px; padding: 8px;">
                        <h3 style="font-weight: 600; font-size: 14px; margin-bottom: 4px;">
                            ${destination.title[locale]}
                        </h3>
                        <p style="color: #6b6b6b; font-size: 12px; margin-bottom: 8px;">
                            ${destination.excerpt?.[locale] || destination.description[locale].substring(0, 80)}...
                        </p>
                        <div style="display: flex; justify-content: space-between; font-size: 12px;">
                            <span style="color: #E63946; font-weight: 500; text-transform: capitalize;">
                                ${destination.category}
                            </span>
                            <span>⭐ ${destination.rating?.toFixed(1) || 'N/A'}</span>
                        </div>
                        <a href="/${locale}/destinations/${destination.slug}" 
                           style="display: block; margin-top: 8px; text-align: center; 
                                  background: #E63946; color: white; padding: 6px 12px; 
                                  border-radius: 6px; text-decoration: none; font-size: 12px;">
                            ${locale === 'id' ? 'Lihat Detail' : 'View Details'}
                        </a>
                    </div>
                `;

                marker.bindPopup(popupContent);
                markersRef.current.push(marker);
            });

            // Fit bounds with max zoom to prevent over-zooming
            if (validDestinations.length > 0 && mapInstanceRef.current) {
                const bounds = L.latLngBounds(
                    validDestinations.map(d => [
                        d.location.coordinates[1],
                        d.location.coordinates[0]
                    ])
                );
                // maxZoom prevents the map from zooming too close
                mapInstanceRef.current.fitBounds(bounds, {
                    padding: [50, 50],
                    maxZoom: 14  // Limit zoom level to prevent over-zooming
                });
            }
        };

        initMap();

        // Cleanup on unmount
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [validDestinations, locale, isLoading]);

    return (
        <section className="py-10 bg-white">
            <div className="max-w-7xl mx-auto px-[38px]">
                <SectionHeader
                    title={t('title')}
                    subtitle={t('subtitle')}
                    align="left"
                />

                {/* Category Filter */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-wrap justify-center md:justify-start gap-3 mb-8"
                >
                    {categories.map((cat) => (
                        <button
                            key={cat.key}
                            onClick={() => setActiveCategory(cat.key)}
                            className={`px-5 py-2.5 rounded-full font-medium text-sm transition-colors ${activeCategory === cat.key
                                ? 'bg-dark text-white'
                                : 'bg-light text-dark hover:bg-gray/20'
                                }`}
                        >
                            {cat.label[locale]}
                        </button>
                    ))}
                </motion.div>

                {/* Map Container */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative h-[500px] rounded-2xl overflow-hidden border-2 border-gray-300 z-10"
                >
                    {isLoading ? (
                        <MapSkeleton />
                    ) : isError ? (
                        <div className="h-full flex items-center justify-center bg-gray/5">
                            <div className="text-center">
                                <MapPin className="w-12 h-12 text-gray/40 mx-auto mb-4" />
                                <p className="text-gray">
                                    {locale === 'id'
                                        ? 'Gagal memuat peta. Silakan coba lagi.'
                                        : 'Failed to load map. Please try again.'}
                                </p>
                            </div>
                        </div>
                    ) : validDestinations.length === 0 ? (
                        <div className="h-full flex items-center justify-center bg-gray/5">
                            <div className="text-center">
                                <MapPin className="w-12 h-12 text-gray/40 mx-auto mb-4" />
                                <p className="text-gray">
                                    {locale === 'id'
                                        ? 'Tidak ada destinasi ditemukan.'
                                        : 'No destinations found.'}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div ref={mapRef} className="h-full w-full [&_.leaflet-pane]:z-10 [&_.leaflet-control]:z-10" />
                    )}
                </motion.div>

                {/* Legend */}
                {!isLoading && !isError && validDestinations.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="mt-6 text-center"
                    >
                        <p className="text-sm text-gray">
                            {locale === 'id'
                                ? `Menampilkan ${validDestinations.length} destinasi di peta`
                                : `Showing ${validDestinations.length} destinations on map`}
                        </p>
                        <p className="text-xs text-gray/60 mt-1">
                            {locale === 'id'
                                ? 'Klik marker untuk melihat detail destinasi'
                                : 'Click marker to view destination details'}
                        </p>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
