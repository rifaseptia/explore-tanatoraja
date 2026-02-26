import mongoose, { Schema, Document, Model } from 'mongoose';

// Localized string interface
interface LocalizedString {
    id: string;
    en: string;
}

export interface IHeroSlide extends Document {
    title: LocalizedString;
    subtitle: LocalizedString;
    image: string;
    video?: string; // Optional video URL (MP4)
    ctaText: LocalizedString;
    ctaLink: string;
    page: 'home' | 'destinations' | 'culinary' | 'events' | 'stay' | 'transport';
    order: number;
    isActive: boolean;
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

const HeroSlideSchema = new Schema<IHeroSlide>(
    {
        title: { type: LocalizedStringSchema, required: true },
        subtitle: { type: LocalizedStringSchema, required: true },
        image: { type: String, required: true },
        video: { type: String }, // Optional video URL (MP4)
        ctaText: { type: LocalizedStringSchema, required: true },
        ctaLink: { type: String, required: true },
        page: {
            type: String,
            required: true,
            enum: ['home', 'destinations', 'culinary', 'events', 'stay', 'transport'],
            default: 'home',
        },
        order: { type: Number, default: 0 },
        isActive: { type: Boolean, default: true },
    },
    {
        timestamps: true,
    }
);

// Indexes
HeroSlideSchema.index({ order: 1 });
HeroSlideSchema.index({ isActive: 1 });
HeroSlideSchema.index({ page: 1, isActive: 1 });

const HeroSlide: Model<IHeroSlide> =
    mongoose.models.HeroSlide || mongoose.model<IHeroSlide>('HeroSlide', HeroSlideSchema);

export default HeroSlide;
