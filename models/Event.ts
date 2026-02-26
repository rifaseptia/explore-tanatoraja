import mongoose, { Schema, Document, Model } from 'mongoose';

interface LocalizedString {
    id: string;
    en: string;
}

export interface IEvent extends Document {
    title: LocalizedString;
    slug: string;
    description: LocalizedString;
    excerpt?: LocalizedString;
    image: string;
    category: string;
    startDate: Date;
    endDate?: Date;
    location: LocalizedString;
    coordinates?: [number, number]; // [lng, lat] - untuk peta
    isRambuSolo: boolean;
    schedule?: LocalizedString;
    duration?: LocalizedString;
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

const EventSchema = new Schema<IEvent>(
    {
        title: { type: LocalizedStringSchema, required: true },
        slug: { type: String, required: true, unique: true },
        description: { type: LocalizedStringSchema, required: true },
        excerpt: { type: LocalizedStringSchema },
        image: { type: String, required: true },
        category: { type: String, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date },
        location: { type: LocalizedStringSchema, required: true },
        coordinates: { type: [Number] }, // [lng, lat] - untuk peta
        isRambuSolo: { type: Boolean, default: false },
        schedule: { type: LocalizedStringSchema },
        duration: { type: LocalizedStringSchema },
        isFeatured: { type: Boolean, default: false },
        isPublished: { type: Boolean, default: true },
    },
    {
        timestamps: true,
    }
);

// EventSchema.index({ slug: 1 }); // Removed duplicate index
EventSchema.index({ startDate: 1 });
EventSchema.index({ isRambuSolo: 1 });

const Event: Model<IEvent> =
    mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);

export default Event;
