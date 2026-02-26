import mongoose, { Schema, Document, Model } from 'mongoose';

// Localized string interface
interface LocalizedString {
    id: string;
    en: string;
}

// Destination interface
export interface IDestination extends Document {
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
    faqs?: Array<{
        question: LocalizedString;
        answer: LocalizedString;
    }>;
    instagramLinks?: string[];
    tips?: LocalizedString & { id: string[]; en: string[] };
    rating: number;
    reviewCount: number;
    isFeatured: boolean;
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const LocalizedStringSchema = new Schema<LocalizedString>(
    {
        id: { type: String, required: true },
        en: { type: String, required: true },
    },
    { _id: false }
);

const DestinationSchema = new Schema<IDestination>(
    {
        title: { type: LocalizedStringSchema, required: true },
        slug: { type: String, required: true, unique: true },
        description: { type: LocalizedStringSchema, required: true },
        excerpt: { type: LocalizedStringSchema },
        featuredImage: { type: String, required: true },
        gallery: [{ type: String }],
        category: {
            type: String,
            enum: ['cultural', 'nature', 'culinary', 'adventure'],
            required: true,
        },
        tags: [{ type: String }],
        location: {
            coordinates: {
                type: [Number],
                required: true,
            },
            address: { type: LocalizedStringSchema, required: true },
        },
        openingHours: { type: LocalizedStringSchema },
        entranceFee: {
            local: { type: Number },
            foreign: { type: Number },
            note: { type: LocalizedStringSchema },
        },
        facilities: [
            {
                icon: { type: String },
                name: { type: LocalizedStringSchema },
            },
        ],
        faqs: [
            {
                question: { type: LocalizedStringSchema },
                answer: { type: LocalizedStringSchema },
            },
        ],
        instagramLinks: [{ type: String }], // Array of Instagram post URLs
        rating: { type: Number, default: 0 },
        reviewCount: { type: Number, default: 0 },
        isFeatured: { type: Boolean, default: false },
        isPublished: { type: Boolean, default: true },
    },
    {
        timestamps: true,
    }
);

// Create indexes
// DestinationSchema.index({ slug: 1 }); // Removed duplicate index
DestinationSchema.index({ category: 1 });
DestinationSchema.index({ isFeatured: 1 });
DestinationSchema.index({ 'location.coordinates': '2dsphere' });

const Destination: Model<IDestination> =
    mongoose.models.Destination || mongoose.model<IDestination>('Destination', DestinationSchema);

export default Destination;
