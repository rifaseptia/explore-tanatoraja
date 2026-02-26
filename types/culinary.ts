export interface CulinaryItem {
    _id?: string;
    slug: string;
    title: {
        id: string;
        en: string;
    };
    description: {
        id: string;
        en: string;
    };
    story?: {
        id: string;
        en: string;
    };
    ingredients?: {
        id: string[];
        en: string[];
    };
    recommendations?: {
        name: string;
        description?: { id: string; en: string };
        address: string;
        hours: string;
        phone?: string;
        mapUrl: string;
        image?: string;
    }[];
    tags?: string[];
    category: 'main-course' | 'snack' | 'drink' | 'souvenir';
    image: string;
    spiceLevel?: number;
    isHalal: boolean;
    isPublished?: boolean;
    isFeatured?: boolean;
    createdAt?: string;
    updatedAt?: string;
}
