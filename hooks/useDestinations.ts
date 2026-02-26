'use client';

import { useState, useEffect, useCallback } from 'react';

// Destination type based on MongoDB model
interface LocalizedString {
    id: string;
    en: string;
}

interface Destination {
    _id: string;
    title: LocalizedString;
    slug: string;
    description: LocalizedString;
    excerpt?: LocalizedString;
    featuredImage: string;
    gallery: string[];
    category: 'cultural' | 'nature' | 'culinary' | 'adventure';
    tags: string[];
    location: {
        coordinates: [number, number]; // [lng, lat]
        address: LocalizedString;
    };
    openingHours?: LocalizedString;
    entranceFee?: {
        local: number;
        foreign: number;
        note?: LocalizedString;
    };
    facilities?: Array<{
        icon: string;
        name: LocalizedString;
    }>;
    rating: number;
    reviewCount: number;
    isFeatured: boolean;
    isPublished: boolean;
}

interface UseDestinationsReturn {
    destinations: Destination[];
    isLoading: boolean;
    isError: boolean;
    error: string | null;
    refetch: () => void;
}

/**
 * Custom hook to fetch destinations from API
 * Uses caching to prevent unnecessary refetches
 */
export function useDestinations(category?: string): UseDestinationsReturn {
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchDestinations = useCallback(async () => {
        setIsLoading(true);
        setIsError(false);
        setError(null);

        try {
            const url = category && category !== 'all'
                ? `/api/destinations?category=${category}`
                : '/api/destinations';

            const response = await fetch(url);
            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Failed to fetch destinations');
            }

            setDestinations(data.data || []);
        } catch (err) {
            setIsError(true);
            setError(err instanceof Error ? err.message : 'An error occurred');
            console.error('Error fetching destinations:', err);
        } finally {
            setIsLoading(false);
        }
    }, [category]);

    // Fetch on mount and when category changes
    useEffect(() => {
        fetchDestinations();
    }, [fetchDestinations]);

    return {
        destinations,
        isLoading,
        isError,
        error,
        refetch: fetchDestinations,
    };
}

export type { Destination, LocalizedString };
