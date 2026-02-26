import mongoose, { Schema, Document, Model } from 'mongoose';

interface LocalizedString {
    id: string;
    en: string;
}

export interface IAccommodation extends Document {
    title: LocalizedString;
    slug: string;
    description: LocalizedString;
    story?: LocalizedString;
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

const AccommodationSchema = new Schema<IAccommodation>(
    {
        title: { type: LocalizedStringSchema, required: true },
        slug: { type: String, required: true, unique: true },
        description: { type: LocalizedStringSchema, required: true },
        story: { type: LocalizedStringSchema },
        category: {
            type: String,
            required: true,
            enum: ['hotel', 'homestay', 'resort', 'guesthouse'],
        },
        image: { type: String, required: true },
        priceRange: { type: String, required: true },
        rating: { type: Number, min: 1, max: 5 },
        amenities: [{ type: String }],
        address: { type: String, required: true },
        phone: { type: String },
        mapUrl: { type: String },
        isFeatured: { type: Boolean, default: false },
        isPublished: { type: Boolean, default: true },
    },
    {
        timestamps: true,
    }
);

AccommodationSchema.index({ category: 1 });
AccommodationSchema.index({ isFeatured: 1 });
AccommodationSchema.index({ priceRange: 1 });

const Accommodation: Model<IAccommodation> =
    mongoose.models.Accommodation || mongoose.model<IAccommodation>('Accommodation', AccommodationSchema);

export default Accommodation;
