export interface LocalizedString {
    id: string;
    en: string;
}

export interface Event {
    _id: string;
    title: LocalizedString;
    slug: string;
    description: LocalizedString;
    excerpt?: LocalizedString;
    image: string;
    category: string;
    startDate: string; // ISO String
    endDate?: string; // ISO String
    location: LocalizedString;
    coordinates?: [number, number]; // [lng, lat] - untuk peta
    isRambuSolo: boolean;
    schedule?: LocalizedString;
    duration?: LocalizedString;
    isFeatured: boolean;
    createdAt?: string;
    updatedAt?: string;
}
