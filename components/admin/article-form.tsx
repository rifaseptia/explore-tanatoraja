'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import ImageUpload from './image-upload';

interface ArticleFormData {
    title: { id: string; en: string };
    slug: string;
    content: { id: string; en: string };
    excerpt: { id: string; en: string };
    featuredImage: string;
    category: string;
    author: string;
    isFeatured: boolean;
    isPublished: boolean;
}

interface ArticleFormProps {
    initialData?: Partial<ArticleFormData>;
    isEditing?: boolean;
}

const defaultData: ArticleFormData = {
    title: { id: '', en: '' },
    slug: '',
    content: { id: '', en: '' },
    excerpt: { id: '', en: '' },
    featuredImage: '',
    category: 'culture',
    author: '',
    isFeatured: false,
    isPublished: false,
};

const articleCategories = [
    { value: 'culture', label: 'Culture & Heritage' },
    { value: 'tips', label: 'Travel Tips' },
    { value: 'news', label: 'News & Updates' },
    { value: 'culinary', label: 'Culinary' },
    { value: 'adventure', label: 'Adventure' },
];

export default function ArticleForm({ initialData, isEditing = false }: ArticleFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'id' | 'en'>('en');
    const [formData, setFormData] = useState<ArticleFormData>({
        ...defaultData,
        ...initialData,
    });

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    };

    const handleTitleChange = (lang: 'id' | 'en', value: string) => {
        setFormData((prev) => ({
            ...prev,
            title: { ...prev.title, [lang]: value },
            slug: lang === 'en' && !isEditing ? generateSlug(value) : prev.slug,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const dataToSubmit: Record<string, unknown> = { ...formData };

            // Fill empty translations fallback
            const fillTranslation = (obj: { id: string; en: string }) => {
                if (!obj.id && obj.en) obj.id = obj.en;
                if (!obj.en && obj.id) obj.en = obj.id;
            };

            fillTranslation(dataToSubmit.title as { id: string; en: string });
            fillTranslation(dataToSubmit.content as { id: string; en: string });
            fillTranslation(dataToSubmit.excerpt as { id: string; en: string });

            const url = isEditing
                ? `/api/articles/${initialData?.slug}` // Assuming slug or ID, but route uses ID. Let's verify. Route uses [id].
                // Wait, event-form uses `initialData?.slug` in the URL? 
                // `const url = isEditing ? /api/events/${initialData?.slug} : /api/events;`
                // My API route is `[id]`. Check if `initialData` has `_id`.
                // Usually `initialData` has `_id`. The route I created expects `id`.
                // I should probably use `_id` if available.
                // Let's assume the passed `initialData` has `_id`.
                : '/api/articles';

            // Correction: The API route I created expects `[id]` which is usually the MongoDB `_id`. 
            // However, `slug` is also unique. 
            // Let's check `Article.ts` model. `slug` is unique.
            // But my API route implementation: `const article = await Article.findById(id);`.
            // It expects `_id`. 
            // So the URL should be `/api/articles/${(initialData as any)._id}`.

            const targetId = (initialData as any)._id;
            const endpoint = isEditing ? `/api/articles/${targetId}` : '/api/articles';
            const method = isEditing ? 'PUT' : 'POST';

            const res = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSubmit),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to save article');
            }

            router.push('/admin/articles');
            router.refresh();
        } catch (error: any) {
            console.error('Error saving article:', error);
            alert(`Failed to save article: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-heading font-bold text-2xl text-indigo-900">
                        {isEditing ? 'Edit Article' : 'Write New Article'}
                    </h1>
                    <p className="text-neutral-500 mt-1">
                        {isEditing ? 'Update article content' : 'Share a new story or tip'}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/articles"
                        className="flex items-center gap-2 px-4 py-2.5 border border-neutral-200 rounded-lg text-neutral-600 hover:bg-neutral-50 transition"
                    >
                        <X className="w-4 h-4" />
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg transition disabled:opacity-50"
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        {loading ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>

            {/* Language Tabs */}
            <div className="flex gap-1 mb-6 bg-neutral-100 p-1 rounded-lg w-fit">
                <button
                    type="button"
                    onClick={() => setActiveTab('id')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'id'
                        ? 'bg-white text-indigo-900 shadow-sm'
                        : 'text-neutral-500 hover:text-indigo-900'
                        }`}
                >
                    🇮🇩 Indonesian
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('en')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'en'
                        ? 'bg-white text-indigo-900 shadow-sm'
                        : 'text-neutral-500 hover:text-indigo-900'
                        }`}
                >
                    🇬🇧 English
                </button>
            </div>

            <div className="space-y-6">
                {/* Basic Info */}
                <div className="bg-white rounded-xl border border-neutral-100 p-6">
                    <h2 className="font-semibold text-indigo-900 mb-4">Basic Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-indigo-900 mb-2">
                                Title ({activeTab === 'id' ? 'Indonesian' : 'English'}) *
                            </label>
                            <input
                                type="text"
                                value={formData.title[activeTab]}
                                onChange={(e) => handleTitleChange(activeTab, e.target.value)}
                                className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none"
                                placeholder="Article title"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-indigo-900 mb-2">
                                Slug *
                            </label>
                            <input
                                type="text"
                                value={formData.slug}
                                onChange={(e) => {
                                    const value = e.target.value
                                        .toLowerCase()
                                        .replace(/[^a-z0-9-]/g, '-')
                                        .replace(/-+/g, '-');
                                    setFormData((prev) => ({ ...prev, slug: value }));
                                }}
                                className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none bg-neutral-50"
                                placeholder="article-slug"
                                required
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-indigo-900 mb-2">
                            Excerpt ({activeTab === 'id' ? 'Indonesian' : 'English'}) *
                        </label>
                        <p className="text-xs text-neutral-400 mb-2">Short summary for cards and SEO (1-2 sentences).</p>
                        <input
                            type="text"
                            value={formData.excerpt[activeTab]}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    excerpt: { ...prev.excerpt, [activeTab]: e.target.value },
                                }))
                            }
                            className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none"
                            placeholder="Brief summary..."
                            required
                        />
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-indigo-900 mb-2">
                            Content ({activeTab === 'id' ? 'Indonesian' : 'English'}) *
                        </label>
                        <textarea
                            value={formData.content[activeTab]}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    content: { ...prev.content, [activeTab]: e.target.value },
                                }))
                            }
                            rows={15}
                            className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none resize-y"
                            placeholder="Write your article here..."
                            required
                        />
                    </div>
                </div>

                {/* Meta & Image */}
                <div className="bg-white rounded-xl border border-neutral-100 p-6">
                    <h2 className="font-semibold text-indigo-900 mb-4">Metadata & Image</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-indigo-900 mb-2">
                                Category *
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, category: e.target.value }))
                                }
                                className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none"
                            >
                                {articleCategories.map((cat) => (
                                    <option key={cat.value} value={cat.value}>
                                        {cat.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-indigo-900 mb-2">
                                Author
                            </label>
                            <input
                                type="text"
                                value={formData.author}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, author: e.target.value }))
                                }
                                className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none"
                                placeholder="Author name"
                            />
                        </div>
                    </div>

                    <div className="mt-6">
                        <ImageUpload
                            value={formData.featuredImage}
                            onChange={(url) => setFormData((prev) => ({ ...prev, featuredImage: url }))}
                            label="Cover Image"
                            description="Main image for the article (auto-compressed)"
                            required
                            isThumbnail
                        />
                    </div>
                </div>

                {/* Publish Settings */}
                <div className="bg-white rounded-xl border border-neutral-100 p-6">
                    <h2 className="font-semibold text-indigo-900 mb-4">Publish Settings</h2>
                    <div className="flex items-center gap-6">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.isFeatured}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, isFeatured: e.target.checked }))
                                }
                                className="w-5 h-5 rounded border-neutral-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            <span className="text-sm text-indigo-900">Featured Article</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.isPublished}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, isPublished: e.target.checked }))
                                }
                                className="w-5 h-5 rounded border-neutral-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            <span className="text-sm text-indigo-900">Published</span>
                        </label>
                    </div>
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200">
                    <Link
                        href="/admin/articles"
                        className="flex items-center gap-2 px-6 py-3 border border-neutral-200 rounded-lg text-neutral-600 hover:bg-neutral-50 transition"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg transition disabled:opacity-50 font-medium shadow-sm shadow-indigo-200"
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        {loading ? 'Saving...' : 'Save Article'}
                    </button>
                </div>
            </div>
        </form>
    );
}
