export interface Article {
    _id: string;
    title: { id: string; en: string };
    slug: string;
    content: { id: string; en: string };
    excerpt: { id: string; en: string };
    featuredImage: string;
    category: 'tips' | 'news' | 'culture' | 'culinary' | 'adventure';
    author?: string;
    publishedAt: string; // ISO String for client
    isFeatured: boolean;
    createdAt?: string;
    updatedAt?: string;
}
