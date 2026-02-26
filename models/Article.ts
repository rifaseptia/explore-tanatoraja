import mongoose, { Schema, Document, Model } from 'mongoose';

interface LocalizedString {
    id: string;
    en: string;
}

export interface IArticle extends Document {
    title: LocalizedString;
    slug: string;
    content: LocalizedString;
    excerpt: LocalizedString;
    featuredImage: string;
    category: 'tips' | 'news' | 'culture' | 'culinary' | 'adventure';
    author?: string;
    publishedAt: Date;
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

const ArticleSchema = new Schema<IArticle>(
    {
        title: { type: LocalizedStringSchema, required: true },
        slug: { type: String, required: true, unique: true },
        content: { type: LocalizedStringSchema, required: true },
        excerpt: { type: LocalizedStringSchema, required: true },
        featuredImage: { type: String, required: true },
        category: {
            type: String,
            enum: ['tips', 'news', 'culture', 'culinary', 'adventure'],
            required: true,
        },
        author: { type: String },
        publishedAt: { type: Date, default: Date.now },
        isFeatured: { type: Boolean, default: false },
        isPublished: { type: Boolean, default: true },
    },
    {
        timestamps: true,
    }
);

// ArticleSchema.index({ slug: 1 }); // Removed duplicate index
ArticleSchema.index({ category: 1 });
ArticleSchema.index({ publishedAt: -1 });
ArticleSchema.index({ isFeatured: 1 });

const Article: Model<IArticle> =
    mongoose.models.Article || mongoose.model<IArticle>('Article', ArticleSchema);

export default Article;
