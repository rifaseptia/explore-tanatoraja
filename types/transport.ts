export interface TransportItem {
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
    category: 'flight' | 'bus' | 'rental' | 'local';
    image: string;
    duration?: string;
    priceRange?: string;
    tips?: {
        id: string;
        en: string;
    }[];
    routes?: {
        id: string;
        en: string;
    }[];
    isFeatured: boolean;
    isPublished: boolean;
    createdAt?: string;
    updatedAt?: string;
}
