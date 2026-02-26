'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Loader2, Plus, X } from 'lucide-react';
import ImageUpload from './image-upload';

interface CulinaryFormProps {
    initialData?: {
        slug?: string;
        title?: { id: string; en: string };
        description?: { id: string; en: string };
        story?: { id: string; en: string };
        ingredients?: { id: string[]; en: string[] };
        recommendations?: {
            name: string;
            description?: { id: string; en: string };
            address: string;
            hours: string;
            phone?: string;
            mapUrl: string;
            image?: string;
        }[];
        tags?: string[];
        category?: string;
        image?: string;
        spiceLevel?: number;
        isHalal?: boolean;
        isPublished?: boolean;
        isFeatured?: boolean;
    };
    isEdit?: boolean;
}

export default function CulinaryForm({ initialData, isEdit }: CulinaryFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        slug: initialData?.slug || '',
        titleId: initialData?.title?.id || '',
        titleEn: initialData?.title?.en || '',
        descriptionId: initialData?.description?.id || '',
        descriptionEn: initialData?.description?.en || '',
        storyId: initialData?.story?.id || '',
        storyEn: initialData?.story?.en || '',
        ingredientsId: initialData?.ingredients?.id?.join('\n') || '',
        ingredientsEn: initialData?.ingredients?.en?.join('\n') || '',
        tags: initialData?.tags?.join(', ') || '',
        category: initialData?.category || 'main-course',
        image: initialData?.image || '',
        spiceLevel: initialData?.spiceLevel || 1,
        isHalal: initialData?.isHalal ?? true,
        isPublished: initialData?.isPublished ?? true,
        isFeatured: initialData?.isFeatured ?? false,
    });

    const [recommendations, setRecommendations] = useState(
        initialData?.recommendations || []
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        const body = {
            slug: form.slug,
            title: { id: form.titleId, en: form.titleEn },
            description: { id: form.descriptionId, en: form.descriptionEn },
            story: form.storyId || form.storyEn ? { id: form.storyId, en: form.storyEn } : undefined,
            ingredients: form.ingredientsId || form.ingredientsEn ? {
                id: form.ingredientsId.split('\n').filter(Boolean),
                en: form.ingredientsEn.split('\n').filter(Boolean),
            } : undefined,
            recommendations: recommendations.length > 0 ? recommendations : undefined,
            tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
            category: form.category,
            image: form.image,
            spiceLevel: form.spiceLevel,
            isHalal: form.isHalal,
            isPublished: form.isPublished,
            isFeatured: form.isFeatured,
        };

        try {
            const url = isEdit ? `/api/culinary/${initialData?.slug}` : '/api/culinary';
            const method = isEdit ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (!data.success) {
                throw new Error(data.error || 'Failed to save');
            }

            router.push('/admin/culinary');
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setIsSubmitting(false);
        }
    };

    const addRecommendation = () => {
        setRecommendations([
            ...recommendations,
            { name: '', address: '', hours: '', mapUrl: '#' },
        ]);
    };

    const removeRecommendation = (index: number) => {
        setRecommendations(recommendations.filter((_, i) => i !== index));
    };

    const updateRecommendation = (index: number, field: string, value: string) => {
        const updated = [...recommendations];
        if (field === 'descId' || field === 'descEn') {
            if (!updated[index].description) {
                updated[index].description = { id: '', en: '' };
            }
            if (field === 'descId') updated[index].description!.id = value;
            else updated[index].description!.en = value;
        } else {
            (updated[index] as Record<string, unknown>)[field] = value;
        }
        setRecommendations(updated);
    };

    const inputClass = "w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none";
    const labelClass = "block text-sm font-medium text-neutral-700 mb-1.5";

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
            <div className="flex items-center justify-between">
                <h1 className="font-heading font-bold text-2xl text-indigo-900">
                    {isEdit ? 'Edit Culinary Item' : 'Add Culinary Item'}
                </h1>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg transition text-sm font-medium disabled:opacity-50"
                >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {isSubmitting ? 'Saving...' : 'Save'}
                </button>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>
            )}

            {/* Basic Info */}
            <div className="bg-white rounded-xl border border-neutral-100 p-6 space-y-6">
                <h2 className="font-semibold text-lg text-indigo-900">Basic Information</h2>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>Title (ID)</label>
                        <input type="text" value={form.titleId} onChange={e => setForm({ ...form, titleId: e.target.value })} className={inputClass} required />
                    </div>
                    <div>
                        <label className={labelClass}>Title (EN)</label>
                        <input type="text" value={form.titleEn} onChange={e => setForm({ ...form, titleEn: e.target.value })} className={inputClass} required />
                    </div>
                </div>

                <div>
                    <label className={labelClass}>Slug</label>
                    <input type="text" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className={inputClass} required placeholder="e.g. papiong" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>Description (ID)</label>
                        <textarea value={form.descriptionId} onChange={e => setForm({ ...form, descriptionId: e.target.value })} className={inputClass} rows={3} required />
                    </div>
                    <div>
                        <label className={labelClass}>Description (EN)</label>
                        <textarea value={form.descriptionEn} onChange={e => setForm({ ...form, descriptionEn: e.target.value })} className={inputClass} rows={3} required />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className={labelClass}>Category</label>
                        <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className={inputClass}>
                            <option value="main-course">Main Course</option>
                            <option value="snack">Snack</option>
                            <option value="drink">Drink</option>
                            <option value="souvenir">Souvenir</option>
                        </select>
                    </div>
                    <div>
                        <label className={labelClass}>Spice Level</label>
                        <select value={form.spiceLevel} onChange={e => setForm({ ...form, spiceLevel: parseInt(e.target.value) })} className={inputClass}>
                            <option value={1}>1 - Not Spicy</option>
                            <option value={2}>2 - Medium</option>
                            <option value={3}>3 - Very Hot</option>
                        </select>
                    </div>
                    <div>
                        <label className={labelClass}>Tags (comma separated)</label>
                        <input type="text" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} className={inputClass} placeholder="#Papiong, #Traditional" />
                    </div>
                </div>

                <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={form.isHalal} onChange={e => setForm({ ...form, isHalal: e.target.checked })} className="w-4 h-4 text-indigo-600 rounded border-neutral-300" />
                        <span className="text-sm text-neutral-700">Halal</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={form.isPublished} onChange={e => setForm({ ...form, isPublished: e.target.checked })} className="w-4 h-4 text-indigo-600 rounded border-neutral-300" />
                        <span className="text-sm text-neutral-700">Published</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={form.isFeatured} onChange={e => setForm({ ...form, isFeatured: e.target.checked })} className="w-4 h-4 text-indigo-600 rounded border-neutral-300" />
                        <span className="text-sm text-neutral-700">Featured</span>
                    </label>
                </div>
            </div>

            {/* Photos */}
            <div className="bg-white rounded-xl border border-neutral-100 p-6">
                <h2 className="font-semibold text-lg text-indigo-900 mb-6">Photos</h2>
                <ImageUpload
                    value={form.image}
                    onChange={(url) => setForm({ ...form, image: url })}
                    label="Cover Image (Main Photo)"
                    description="Main image for the culinary listing. Drag & drop or click to upload. Auto-compressed to ~800KB."
                    required
                    isThumbnail
                />
            </div>

            {/* Story */}
            <div className="bg-white rounded-xl border border-neutral-100 p-6 space-y-6">
                <h2 className="font-semibold text-lg text-indigo-900">Story & Origin</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>Story (ID)</label>
                        <textarea value={form.storyId} onChange={e => setForm({ ...form, storyId: e.target.value })} className={inputClass} rows={5} />
                    </div>
                    <div>
                        <label className={labelClass}>Story (EN)</label>
                        <textarea value={form.storyEn} onChange={e => setForm({ ...form, storyEn: e.target.value })} className={inputClass} rows={5} />
                    </div>
                </div>
            </div>

            {/* Ingredients */}
            <div className="bg-white rounded-xl border border-neutral-100 p-6 space-y-6">
                <h2 className="font-semibold text-lg text-indigo-900">Ingredients (one per line)</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>Ingredients (ID)</label>
                        <textarea value={form.ingredientsId} onChange={e => setForm({ ...form, ingredientsId: e.target.value })} className={inputClass} rows={5} placeholder={"Daging Ayam\nDaun Mayana"} />
                    </div>
                    <div>
                        <label className={labelClass}>Ingredients (EN)</label>
                        <textarea value={form.ingredientsEn} onChange={e => setForm({ ...form, ingredientsEn: e.target.value })} className={inputClass} rows={5} placeholder={"Chicken\nMayana Leaves"} />
                    </div>
                </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-xl border border-neutral-100 p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-lg text-indigo-900">Recommendations (Where to Eat)</h2>
                    <button type="button" onClick={addRecommendation} className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                        <Plus className="w-4 h-4" /> Add Place
                    </button>
                </div>

                {recommendations.map((rec, idx) => (
                    <div key={idx} className="border border-neutral-200 rounded-lg p-4 space-y-4 relative">
                        <button type="button" onClick={() => removeRecommendation(idx)} className="absolute top-3 right-3 text-neutral-400 hover:text-red-500">
                            <X className="w-4 h-4" />
                        </button>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Name</label>
                                <input type="text" value={rec.name} onChange={e => updateRecommendation(idx, 'name', e.target.value)} className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Address</label>
                                <input type="text" value={rec.address} onChange={e => updateRecommendation(idx, 'address', e.target.value)} className={inputClass} />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className={labelClass}>Hours</label>
                                <input type="text" value={rec.hours} onChange={e => updateRecommendation(idx, 'hours', e.target.value)} className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Phone</label>
                                <input type="text" value={rec.phone || ''} onChange={e => updateRecommendation(idx, 'phone', e.target.value)} className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Map URL</label>
                                <input
                                    type="text"
                                    value={rec.mapUrl}
                                    onChange={e => {
                                        const url = e.target.value;

                                        // Check for short URL format - show message to user
                                        if (url.includes('maps.app.goo.gl') || url.includes('goo.gl/maps') || url.includes('goo.gl\\/maps')) {
                                            alert('Gunakan link Google Maps panjang (maps.google.com), bukan link pendek. Buka lokasi di browser, lalu salin URL dari address bar.');
                                            return;
                                        }

                                        updateRecommendation(idx, 'mapUrl', e.target.value)
                                    }}
                                    className={inputClass}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Description (ID)</label>
                                <input type="text" value={rec.description?.id || ''} onChange={e => updateRecommendation(idx, 'descId', e.target.value)} className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Description (EN)</label>
                                <input type="text" value={rec.description?.en || ''} onChange={e => updateRecommendation(idx, 'descEn', e.target.value)} className={inputClass} />
                            </div>
                        </div>
                        <div>
                            <ImageUpload
                                value={rec.image || ''}
                                onChange={(url) => updateRecommendation(idx, 'image', url)}
                                label={`Photo - ${rec.name || `Place ${idx + 1}`}`}
                                description="Photo of the restaurant/place. Drag & drop or click to upload."
                                isThumbnail
                            />
                        </div>
                    </div>
                ))}
            </div>
        </form>
    );
}
