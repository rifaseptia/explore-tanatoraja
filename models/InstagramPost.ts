import mongoose, { Schema, Document } from 'mongoose';

export interface IInstagramPost extends Document {
    postUrl: string;  // Instagram post URL (optional - for linking)
    image: string;     // Uploaded image (for display)
    authorName: string;
    order: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const InstagramPostSchema = new Schema<IInstagramPost>({
    postUrl: {
        type: String,
        default: 'https://instagram.com/exploretanatoraja',
    },
    image: {
        type: String,
        default: '',
    },
    authorName: {
        type: String,
        default: 'exploretanatoraja',
    },
    order: {
        type: Number,
        default: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});

export default mongoose.models.InstagramPost || mongoose.model<IInstagramPost>('InstagramPost', InstagramPostSchema);
