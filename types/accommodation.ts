export interface Accommodation {
    _id: string;
    title: {
        id: string;
        en: string;
    };
    slug: string;
    description: {
        id: string;
        en: string;
    };
    story?: {
        id: string;
        en: string;
    };
    category: 'hotel' | 'homestay' | 'resort' | 'guesthouse';
    image: string;
    priceRange: string;
    rating?: number;
    amenities?: string[];
    address: string;
    phone?: string;
    mapUrl?: string;
    isFeatured: boolean;
    isPublished: boolean;
    createdAt?: string;
    updatedAt?: string;
}
