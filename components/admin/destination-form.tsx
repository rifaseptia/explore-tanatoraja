'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, X, Loader2, Plus } from 'lucide-react';
import Link from 'next/link';
import ImageUpload, { GalleryUpload } from './image-upload';

interface DestinationFormData {
    title: { id: string; en: string };
    slug: string;
    description: { id: string; en: string };
    excerpt: { id: string; en: string };
    featuredImage: string;
    gallery: string[];
    category: 'cultural' | 'nature' | 'culinary' | 'adventure';
    tags: string[];
    location: {
        coordinates: [number, number];
        address: { id: string; en: string };
    };
    openingHours: { id: string; en: string };
    entranceFee: { local: number; foreign: number };
    instagramLinks: string[];
    rating: number;
    isFeatured: boolean;
    isPublished: boolean;
    faqs: { question: { id: string; en: string }; answer: { id: string; en: string } }[];
}

interface DestinationFormProps {
    initialData?: Partial<DestinationFormData>;
    isEditing?: boolean;
}

const defaultData: DestinationFormData = {
    title: { id: '', en: '' },
    slug: '',
    description: { id: '', en: '' },
    excerpt: { id: '', en: '' },
    featuredImage: '',
    gallery: [],
    category: 'cultural',
    tags: [],
    location: {
        coordinates: [119.8654, -3.0747],
        address: { id: '', en: '' },
    },
    openingHours: { id: '', en: '' },
    entranceFee: { local: 0, foreign: 0 },
    instagramLinks: [],
    rating: 0,
    isFeatured: false,
    isPublished: false,
    faqs: [],
};

export default function DestinationForm({ initialData, isEditing = false }: DestinationFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'id' | 'en'>('en');
    const [formData, setFormData] = useState<DestinationFormData>({
        ...defaultData,
        ...initialData,
    });
    const [newTag, setNewTag] = useState('');
    const [newGalleryUrl, setNewGalleryUrl] = useState('');
    const [newInstagramUrl, setNewInstagramUrl] = useState('');

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

    const handleAddTag = () => {
        if (newTag && !formData.tags.includes(newTag)) {
            setFormData((prev) => ({
                ...prev,
                tags: [...prev.tags, newTag],
            }));
            setNewTag('');
        }
    };

    const handleRemoveTag = (tag: string) => {
        setFormData((prev) => ({
            ...prev,
            tags: prev.tags.filter((t) => t !== tag),
        }));
    };

    const handleAddGalleryImage = () => {
        if (newGalleryUrl && !formData.gallery.includes(newGalleryUrl) && formData.gallery.length < 5) {
            setFormData((prev) => ({
                ...prev,
                gallery: [...prev.gallery, newGalleryUrl],
            }));
            setNewGalleryUrl('');
        }
    };

    const handleRemoveGalleryImage = (url: string) => {
        setFormData((prev) => ({
            ...prev,
            gallery: prev.gallery.filter((g) => g !== url),
        }));
    };

    // Instagram Links Handlers
    const handleAddInstagramLink = () => {
        const url = newInstagramUrl.trim();
        if (url && url.includes('instagram.com') && !formData.instagramLinks.includes(url) && formData.instagramLinks.length < 6) {
            setFormData((prev) => ({
                ...prev,
                instagramLinks: [...prev.instagramLinks, url],
            }));
            setNewInstagramUrl('');
        }
    };

    const handleRemoveInstagramLink = (url: string) => {
        setFormData((prev) => ({
            ...prev,
            instagramLinks: prev.instagramLinks.filter((link) => link !== url),
        }));
    };

    // FAQ Handlers
    const handleAddFaq = () => {
        setFormData((prev) => ({
            ...prev,
            faqs: [...prev.faqs, { question: { id: '', en: '' }, answer: { id: '', en: '' } }],
        }));
    };

    const handleRemoveFaq = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            faqs: prev.faqs.filter((_, i) => i !== index),
        }));
    };

    const handleFaqChange = (index: number, field: 'question' | 'answer', lang: 'id' | 'en', value: string) => {
        setFormData((prev) => {
            const newFaqs = [...prev.faqs];
            newFaqs[index] = {
                ...newFaqs[index],
                [field]: { ...newFaqs[index][field], [lang]: value },
            };
            return { ...prev, faqs: newFaqs };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Prepared data with fallback for empty translations
            const dataToSubmit = { ...formData };

            // Helper to fill empty translations
            const fillTranslation = (field: keyof DestinationFormData, obj: any) => {
                if (typeof obj === 'object' && obj !== null && 'id' in obj && 'en' in obj) {
                    // If ID is empty, use EN. If EN is empty, use ID.
                    if (!obj.id && obj.en) obj.id = obj.en;
                    if (!obj.en && obj.id) obj.en = obj.id;
                }
            };

            // Apply fallback to all localized fields
            fillTranslation('title', dataToSubmit.title);
            fillTranslation('description', dataToSubmit.description);
            fillTranslation('excerpt', dataToSubmit.excerpt);
            fillTranslation('openingHours', dataToSubmit.openingHours);

            // Fill FAQ translations and strip _id
            const cleanFaqs = dataToSubmit.faqs.map((faq: any) => {
                const cleanFaq = {
                    question: { ...faq.question },
                    answer: { ...faq.answer }
                };

                // Ensure translations are filled
                fillTranslation('question' as any, cleanFaq.question);
                fillTranslation('answer' as any, cleanFaq.answer);

                return cleanFaq;
            });

            // Replace faqs with clean version
            dataToSubmit.faqs = cleanFaqs;

            // Handle location address fallback
            if (!dataToSubmit.location.address.id && dataToSubmit.location.address.en) {
                dataToSubmit.location.address.id = dataToSubmit.location.address.en;
            }
            if (!dataToSubmit.location.address.en && dataToSubmit.location.address.id) {
                dataToSubmit.location.address.en = dataToSubmit.location.address.id;
            }

            const url = isEditing
                ? `/api/destinations/${initialData?.slug}`
                : '/api/destinations';
            const method = isEditing ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSubmit),
            });

            if (!res.ok) {
                throw new Error('Failed to save destination');
            }

            router.push('/admin/destinations');
            router.refresh();
        } catch (error) {
            console.error('Error saving destination:', error);
            alert('Failed to save destination');
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
                        {isEditing ? 'Edit Destination' : 'Add Destination'}
                    </h1>
                    <p className="text-neutral-500 mt-1">
                        {isEditing ? 'Update destination information' : 'Create a new tourist destination'}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/destinations"
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
                {/* Basic Info Card */}
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
                                placeholder="Destination name"
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
                                    // Strict slug sanitization: lowercase, replace non-alphanumeric with dash, no duplicate dashes
                                    const value = e.target.value
                                        .toLowerCase()
                                        .replace(/[^a-z0-9-]/g, '-')
                                        .replace(/-+/g, '-');
                                    setFormData((prev) => ({ ...prev, slug: value }));
                                }}
                                className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none bg-neutral-50"
                                placeholder="destination-slug"
                                required
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-indigo-900 mb-2">
                            Excerpt ({activeTab === 'id' ? 'Indonesian' : 'English'})
                        </label>
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
                            placeholder="Short description"
                        />
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-indigo-900 mb-2">
                            Description ({activeTab === 'id' ? 'Indonesian' : 'English'}) *
                        </label>
                        <textarea
                            value={formData.description[activeTab]}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    description: { ...prev.description, [activeTab]: e.target.value },
                                }))
                            }
                            rows={5}
                            className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none resize-none"
                            placeholder="Full destination description"
                            required
                        />
                    </div>
                </div>

                {/* Category & Tags */}
                <div className="bg-white rounded-xl border border-neutral-100 p-6">
                    <h2 className="font-semibold text-indigo-900 mb-4">Category & Tags</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-indigo-900 mb-2">
                                Category *
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        category: e.target.value as DestinationFormData['category'],
                                    }))
                                }
                                className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none"
                            >
                                <option value="cultural">Cultural</option>
                                <option value="nature">Nature</option>
                                <option value="culinary">Culinary</option>
                                <option value="adventure">Adventure</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-indigo-900 mb-2">
                                Tags
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                                    className="flex-1 px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none"
                                    placeholder="Add tag"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddTag}
                                    className="px-3 py-2.5 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                            {formData.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {formData.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-sm"
                                        >
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveTag(tag)}
                                                className="hover:text-indigo-900"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Photos */}
                <div className="bg-white rounded-xl border border-neutral-100 p-6">
                    <h2 className="font-semibold text-indigo-900 mb-6">Photos</h2>

                    {/* Thumbnail */}
                    <ImageUpload
                        value={formData.featuredImage}
                        onChange={(url: string) => setFormData((prev) => ({ ...prev, featuredImage: url }))}
                        label="Thumbnail (Main Photo)"
                        description="Photo displayed in destination list (auto-compressed to 500KB)"
                        required
                        isThumbnail
                    />

                    {/* Gallery */}
                    <div className="mt-6">
                        <GalleryUpload
                            value={formData.gallery}
                            onChange={(urls) => setFormData((prev) => ({ ...prev, gallery: urls }))}
                            maxImages={5}
                            label="Gallery"
                            description="Additional photos for destination details"
                        />
                    </div>

                    {/* Instagram Links */}
                    <div className="mt-6">
                        <label className="block text-sm font-medium text-indigo-900 mb-2">
                            Instagram Posts
                        </label>
                        <p className="text-xs text-neutral-400 mb-3">
                            Add up to 6 Instagram post URLs to embed on the destination page
                        </p>
                        <div className="flex gap-2 mb-3">
                            <input
                                type="url"
                                value={newInstagramUrl}
                                onChange={(e) => setNewInstagramUrl(e.target.value)}
                                placeholder="https://www.instagram.com/p/ABC123..."
                                className="flex-1 px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none text-sm"
                            />
                            <button
                                type="button"
                                onClick={handleAddInstagramLink}
                                disabled={formData.instagramLinks.length >= 6}
                                className="px-4 py-2.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-medium hover:from-pink-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                            >
                                <Plus size={16} />
                                Add
                            </button>
                        </div>
                        {formData.instagramLinks.length > 0 && (
                            <div className="space-y-2">
                                {formData.instagramLinks.map((url, index) => (
                                    <div key={index} className="flex items-center gap-2 bg-gradient-to-r from-pink-50 to-purple-50 px-3 py-2 rounded-lg border border-pink-100">
                                        <span className="flex-1 text-sm text-gray-700 truncate">{url}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveInstagramLink(url)}
                                            className="p-1 text-red-500 hover:bg-red-50 rounded"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Location */}
                <div className="bg-white rounded-xl border border-neutral-100 p-6">
                    <h2 className="font-semibold text-indigo-900 mb-4">Location</h2>

                    {/* Google Maps URL */}
                    <div>
                        <label className="block text-sm font-medium text-indigo-900 mb-2">
                            Google Maps URL
                        </label>
                        <p className="text-xs text-neutral-400 mb-2">
                            Paste Google Maps location link (contoh: https://maps.google.com/...atau https://goo.gl/maps/...)
                        </p>
                        <input
                            type="text"
                            placeholder="Paste Google Maps URL here..."
                            className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none"
                            onChange={(e) => {
                                const url = e.target.value;
                                // Try to extract coordinates from various Google Maps URL formats
                                // Format 1: @-3.0747,119.8654 (lat,lng)
                                // Format 2: !3d-3.0747!4d119.8654
                                // Format 3: ll=-3.0747,119.8654
                                // Format 4: q=-3.0747,119.8654
                                // Format 5: maps.app.goo.gl/xxxxx (short link - need to show message)
                                let lat: number | null = null;
                                let lng: number | null = null;

                                // Check for short URL format - show message to user
                                if (url.includes('maps.app.goo.gl') || url.includes('goo.gl/maps') || url.includes('goo.gl\/maps')) {
                                    alert('Gunakan link Google Maps panjang (maps.google.com), bukan link pendek. Buka lokasi di browser, lalu salin URL dari address bar.');
                                    return;
                                }

                                // Try @lat,lng format
                                const atMatch = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
                                if (atMatch) {
                                    lat = parseFloat(atMatch[1]);
                                    lng = parseFloat(atMatch[2]);
                                }

                                // Try !3d and !4d format
                                if (!lat || !lng) {
                                    const dMatch = url.match(/!3d(-?\d+\.?\d*).*!4d(-?\d+\.?\d*)/);
                                    if (dMatch) {
                                        lat = parseFloat(dMatch[1]);
                                        lng = parseFloat(dMatch[2]);
                                    }
                                }

                                // Try q= or ll= format
                                if (!lat || !lng) {
                                    const qMatch = url.match(/[?&](q|ll)=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
                                    if (qMatch) {
                                        lat = parseFloat(qMatch[2]);
                                        lng = parseFloat(qMatch[3]);
                                    }
                                }

                                if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
                                    setFormData((prev) => ({
                                        ...prev,
                                        location: {
                                            ...prev.location,
                                            coordinates: [lng, lat], // GeoJSON format: [lng, lat]
                                        },
                                    }));
                                }
                            }}
                        />

                        {/* Show extracted coordinates */}
                        {formData.location.coordinates[0] !== 119.8654 && formData.location.coordinates[1] !== -3.0747 && (
                            <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                                <p className="text-sm text-green-700">
                                    ✓ Coordinates detected: <span className="font-mono">{formData.location.coordinates[1]}, {formData.location.coordinates[0]}</span>
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-indigo-900 mb-2">
                            Address ({activeTab === 'id' ? 'Indonesian' : 'English'})
                        </label>
                        <input
                            type="text"
                            value={formData.location.address[activeTab]}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    location: {
                                        ...prev.location,
                                        address: { ...prev.location.address, [activeTab]: e.target.value },
                                    },
                                }))
                            }
                            className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none"
                            placeholder="Street, village, district"
                        />
                    </div>
                </div>

                {/* Additional Info */}
                <div className="bg-white rounded-xl border border-neutral-100 p-6">
                    <h2 className="font-semibold text-indigo-900 mb-4">Additional Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-indigo-900 mb-2">
                                Opening Hours ({activeTab === 'id' ? 'Indonesian' : 'English'})
                            </label>
                            <input
                                type="text"
                                value={formData.openingHours[activeTab]}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        openingHours: { ...prev.openingHours, [activeTab]: e.target.value },
                                    }))
                                }
                                className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none"
                                placeholder="08:00 - 17:00"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                            <label className="block text-sm font-medium text-indigo-900 mb-2">
                                Entrance Fee (Local) - IDR
                            </label>
                            <input
                                type="number"
                                value={formData.entranceFee.local}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        entranceFee: { ...prev.entranceFee, local: parseInt(e.target.value) || 0 },
                                    }))
                                }
                                className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-indigo-900 mb-2">
                                Entrance Fee (Foreign) - IDR
                            </label>
                            <input
                                type="number"
                                value={formData.entranceFee.foreign}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        entranceFee: { ...prev.entranceFee, foreign: parseInt(e.target.value) || 0 },
                                    }))
                                }
                                className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="bg-white rounded-xl border border-neutral-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold text-indigo-900">Frequently Asked Questions</h2>
                        <button
                            type="button"
                            onClick={handleAddFaq}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition text-sm font-medium"
                        >
                            <Plus className="w-4 h-4" />
                            Add FAQ
                        </button>
                    </div>

                    {formData.faqs.length === 0 ? (
                        <div className="text-center py-8 bg-neutral-50 rounded-lg border border-dashed border-neutral-200">
                            <p className="text-neutral-500 text-sm">No FAQs added yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {formData.faqs.map((faq, index) => (
                                <div key={index} className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 relative group">
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveFaq(index)}
                                        className="absolute top-2 right-2 p-1.5 text-neutral-400 hover:text-red-500 bg-white rounded-md shadow-sm opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-semibold uppercase text-neutral-500 mb-1">
                                                Question ({activeTab === 'id' ? 'Indonesian' : 'English'})
                                            </label>
                                            <input
                                                type="text"
                                                value={faq.question[activeTab]}
                                                onChange={(e) => handleFaqChange(index, 'question', activeTab, e.target.value)}
                                                className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none text-sm"
                                                placeholder="e.g. Is there parking?"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold uppercase text-neutral-500 mb-1">
                                                Answer ({activeTab === 'id' ? 'Indonesian' : 'English'})
                                            </label>
                                            <textarea
                                                rows={2}
                                                value={faq.answer[activeTab]}
                                                onChange={(e) => handleFaqChange(index, 'answer', activeTab, e.target.value)}
                                                className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none text-sm resize-none"
                                                placeholder="e.g. Yes, ample parking available."
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
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
                            <span className="text-sm text-indigo-900">Featured Destination</span>
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
                        href="/admin/destinations"
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
                        {loading ? 'Saving...' : 'Save Destination'}
                    </button>
                </div>
            </div >
        </form >
    );
}
