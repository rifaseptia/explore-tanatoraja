import mongoose, { Schema, Document, Model } from 'mongoose';

interface LocalizedString {
    id: string;
    en: string;
}

interface LocalizedStringArray {
    id: string[];
    en: string[];
}

interface Recommendation {
    name: string;
    description?: LocalizedString;
    address: string;
    hours: string;
    phone?: string;
    mapUrl: string;
    image?: string;
}

export interface ICulinary extends Document {
    title: LocalizedString;
    slug: string;
    description: LocalizedString;
    story?: LocalizedString;
    ingredients?: LocalizedStringArray;
    recommendations?: Recommendation[];
    tags?: string[];
    category: 'main-course' | 'snack' | 'drink' | 'souvenir';
    image: string;
    spiceLevel?: number;
    isHalal: boolean;
    isPublished: boolean;
    isFeatured: boolean;
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

const LocalizedStringArraySchema = new Schema<LocalizedStringArray>(
    {
        id: [{ type: String }],
        en: [{ type: String }],
    },
    { _id: false }
);

const RecommendationSchema = new Schema<Recommendation>(
    {
        name: { type: String, required: true },
        description: { type: LocalizedStringSchema },
        address: { type: String, required: true },
        hours: { type: String, required: true },
        phone: { type: String },
        mapUrl: { type: String, default: '#' },
        image: { type: String },
    },
    { _id: false }
);

const CulinarySchema = new Schema<ICulinary>(
    {
        title: { type: LocalizedStringSchema, required: true },
        slug: { type: String, required: true, unique: true },
        description: { type: LocalizedStringSchema, required: true },
        story: { type: LocalizedStringSchema },
        ingredients: { type: LocalizedStringArraySchema },
        recommendations: [{ type: RecommendationSchema }],
        tags: [{ type: String }],
        category: {
            type: String,
            enum: ['main-course', 'snack', 'drink', 'souvenir'],
            required: true,
        },
        image: { type: String, required: true },
        spiceLevel: { type: Number, min: 1, max: 3 },
        isHalal: { type: Boolean, default: true },
        isPublished: { type: Boolean, default: true },
        isFeatured: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

CulinarySchema.index({ category: 1 });
CulinarySchema.index({ isFeatured: 1 });

const Culinary: Model<ICulinary> =
    mongoose.models.Culinary || mongoose.model<ICulinary>('Culinary', CulinarySchema);

export default Culinary;
