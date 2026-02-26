import mongoose, { Schema, Document, Model } from 'mongoose';

interface LocalizedString {
    id: string;
    en: string;
}

export interface ITransport extends Document {
    title: LocalizedString;
    slug: string;
    description: LocalizedString;
    story?: LocalizedString;
    category: 'flight' | 'bus' | 'rental' | 'local';
    image: string;
    duration?: string;
    priceRange?: string;
    tips?: LocalizedString[];
    routes?: LocalizedString[];
    contact?: string;
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

const TransportSchema = new Schema<ITransport>(
    {
        title: { type: LocalizedStringSchema, required: true },
        slug: { type: String, required: true, unique: true },
        description: { type: LocalizedStringSchema, required: true },
        story: { type: LocalizedStringSchema },
        category: {
            type: String,
            required: true,
            enum: ['flight', 'bus', 'rental', 'local'],
        },
        image: { type: String, required: true },
        duration: { type: String },
        priceRange: { type: String },
        tips: [LocalizedStringSchema],
        routes: [LocalizedStringSchema],
        contact: { type: String },
        isFeatured: { type: Boolean, default: false },
        isPublished: { type: Boolean, default: true },
    },
    {
        timestamps: true,
    }
);

TransportSchema.index({ category: 1 });
TransportSchema.index({ isFeatured: 1 });

const Transport: Model<ITransport> =
    mongoose.models.Transport || mongoose.model<ITransport>('Transport', TransportSchema);

export default Transport;
