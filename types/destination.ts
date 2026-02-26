// Localized string interface
export interface LocalizedString {
    id: string;
    en: string;
}

// Destination interface for client components
export interface Destination {
    _id: string;
    title: LocalizedString;
    slug: string;
    description: LocalizedString;
    excerpt?: LocalizedString;
    featuredImage: string;
    gallery?: string[];
    category: 'cultural' | 'nature' | 'culinary' | 'adventure';
    tags?: string[];
    location?: {
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
    faqs?: Array<{
        question: LocalizedString;
        answer: LocalizedString;
    }>;
    instagramLinks?: string[]; // Array of Instagram post URLs
    rating?: number;
    reviewCount?: number;
    isFeatured: boolean;
    isPublished: boolean;
    createdAt?: string;
    updatedAt?: string;
}

