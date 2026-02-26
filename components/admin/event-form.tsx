'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import ImageUpload from './image-upload';

interface EventFormData {
    title: { id: string; en: string };
    slug: string;
    description: { id: string; en: string };
    excerpt: { id: string; en: string };
    image: string;
    category: string;
    startDate: string;
    endDate: string;
    location: { id: string; en: string };
    coordinates: [number, number]; // [lng, lat] - untuk peta
    isRambuSolo: boolean;
    schedule: { id: string; en: string };
    duration: { id: string; en: string };
    isFeatured: boolean;
    isPublished: boolean;
}

interface EventFormProps {
    initialData?: Partial<EventFormData>;
    isEditing?: boolean;
}

const defaultData: EventFormData = {
    title: { id: '', en: '' },
    slug: '',
    description: { id: '', en: '' },
    excerpt: { id: '', en: '' },
    image: '',
    category: 'festival',
    startDate: '',
    endDate: '',
    location: { id: '', en: '' },
    coordinates: [119.8654, -3.0747], // Default: Tana Toraja
    isRambuSolo: false,
    schedule: { id: '', en: '' },
    duration: { id: '', en: '' },
    isFeatured: false,
    isPublished: false,
};

const eventCategories = [
    { value: 'festival', label: 'Festival' },
    { value: 'ceremony', label: 'Ceremony' },
    { value: 'cultural', label: 'Cultural Event' },
    { value: 'music', label: 'Music & Art' },
    { value: 'sports', label: 'Sports' },
    { value: 'exhibition', label: 'Exhibition' },
    { value: 'other', label: 'Other' },
];

export default function EventForm({ initialData, isEditing = false }: EventFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'id' | 'en'>('en');
    const [formData, setFormData] = useState<EventFormData>({
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
            // Fill empty translations
            const dataToSubmit: Record<string, unknown> = { ...formData };

            const fillTranslation = (obj: { id: string; en: string }) => {
                if (!obj.id && obj.en) obj.id = obj.en;
                if (!obj.en && obj.id) obj.en = obj.id;
            };

            fillTranslation(dataToSubmit.title as { id: string; en: string });
            fillTranslation(dataToSubmit.description as { id: string; en: string });
            fillTranslation(dataToSubmit.location as { id: string; en: string });

            // Clean optional LocalizedString fields — remove if both empty
            for (const key of ['excerpt', 'schedule', 'duration'] as const) {
                const val = dataToSubmit[key] as { id: string; en: string } | undefined;
                if (val) {
                    fillTranslation(val);
                    if (!val.id && !val.en) {
                        delete dataToSubmit[key];
                    }
                }
            }

            // Clean empty date fields — empty string can't be cast to Date
            if (!dataToSubmit.endDate) delete dataToSubmit.endDate;
            if (!dataToSubmit.startDate) delete dataToSubmit.startDate;

            const url = isEditing
                ? `/api/events/${initialData?.slug}`
                : '/api/events';
            const method = isEditing ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSubmit),
            });

            if (!res.ok) {
                throw new Error('Failed to save event');
            }

            router.push('/admin/events');
            router.refresh();
        } catch (error) {
            console.error('Error saving event:', error);
            alert('Failed to save event');
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
                        {isEditing ? 'Edit Event' : 'Add Event'}
                    </h1>
                    <p className="text-neutral-500 mt-1">
                        {isEditing ? 'Update event information' : 'Create a new event'}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/events"
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
                                placeholder="Event name"
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
                                placeholder="event-slug"
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
                            placeholder="Full event description"
                            required
                        />
                    </div>
                </div>

                {/* Category & Image */}
                <div className="bg-white rounded-xl border border-neutral-100 p-6">
                    <h2 className="font-semibold text-indigo-900 mb-4">Category & Image</h2>
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
                                {eventCategories.map((cat) => (
                                    <option key={cat.value} value={cat.value}>
                                        {cat.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isRambuSolo}
                                    onChange={(e) =>
                                        setFormData((prev) => ({ ...prev, isRambuSolo: e.target.checked }))
                                    }
                                    className="w-5 h-5 rounded border-neutral-300 text-indigo-600 focus:ring-indigo-600"
                                />
                                <span className="text-sm text-indigo-900">This is a Rambu Solo&apos; ceremony</span>
                            </label>
                        </div>
                    </div>

                    <div className="mt-6">
                        <ImageUpload
                            value={formData.image}
                            onChange={(url) => setFormData((prev) => ({ ...prev, image: url }))}
                            label="Event Image"
                            description="Main image for the event (auto-compressed)"
                            required
                            isThumbnail
                        />
                    </div>
                </div>

                {/* Date & Time */}
                <div className="bg-white rounded-xl border border-neutral-100 p-6">
                    <h2 className="font-semibold text-indigo-900 mb-4">Date & Time</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-indigo-900 mb-2">
                                Start Date *
                            </label>
                            <input
                                type="date"
                                value={formData.startDate}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, startDate: e.target.value }))
                                }
                                className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-indigo-900 mb-2">
                                End Date
                            </label>
                            <input
                                type="date"
                                value={formData.endDate}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, endDate: e.target.value }))
                                }
                                className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                            <label className="block text-sm font-medium text-indigo-900 mb-2">
                                Schedule ({activeTab === 'id' ? 'Indonesian' : 'English'})
                            </label>
                            <input
                                type="text"
                                value={formData.schedule[activeTab]}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        schedule: { ...prev.schedule, [activeTab]: e.target.value },
                                    }))
                                }
                                className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none"
                                placeholder="e.g. 09:00 - 17:00 WITA"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-indigo-900 mb-2">
                                Duration ({activeTab === 'id' ? 'Indonesian' : 'English'})
                            </label>
                            <input
                                type="text"
                                value={formData.duration[activeTab]}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        duration: { ...prev.duration, [activeTab]: e.target.value },
                                    }))
                                }
                                className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none"
                                placeholder="e.g. 3 days"
                            />
                        </div>
                    </div>
                </div>

                {/* Location */}
                <div className="bg-white rounded-xl border border-neutral-100 p-6">
                    <h2 className="font-semibold text-indigo-900 mb-4">Location</h2>

                    {/* Google Maps URL Paste */}
                    <div>
                        <label className="block text-sm font-medium text-indigo-900 mb-2">
                            Google Maps URL
                        </label>
                        <p className="text-xs text-neutral-400 mb-2">
                            Paste a Google Maps location link. The place name will be auto-extracted.
                        </p>
                        <input
                            type="text"
                            placeholder="https://maps.google.com/... or https://goo.gl/maps/..."
                            className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none"
                            onChange={(e) => {
                                const url = e.target.value;

                                // Check for short URL format - show message to user
                                if (url.includes('maps.app.goo.gl') || url.includes('goo.gl/maps') || url.includes('goo.gl\/maps')) {
                                    alert('Gunakan link Google Maps panjang (maps.google.com), bukan link pendek. Buka lokasi di browser, lalu salin URL dari address bar.');
                                    return;
                                }

                                // Try to extract coordinates from URL
                                // Format 1: @-3.0747,119.8654 (lat,lng)
                                // Format 2: !3d-3.0747!4d119.8654
                                let lat: number | null = null;
                                let lng: number | null = null;

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

                                // Try to extract place name from URL
                                // Format 1: /place/Place+Name/
                                // Format 2: q=Place+Name
                                let placeName = '';

                                // Try /place/ format
                                const placeMatch = url.match(/\/place\/([^\/\@]+)/);
                                if (placeMatch) {
                                    placeName = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
                                }

                                // Try q= format
                                if (!placeName) {
                                    const qMatch = url.match(/[?&]q=([^&@]+)/);
                                    if (qMatch) {
                                        placeName = decodeURIComponent(qMatch[1].replace(/\+/g, ' '));
                                    }
                                }

                                const updateData: Partial<EventFormData> = {};

                                if (placeName) {
                                    updateData.location = { id: placeName, en: placeName };
                                }

                                if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
                                    updateData.coordinates = [lng, lat]; // GeoJSON format: [lng, lat]
                                }

                                if (Object.keys(updateData).length > 0) {
                                    setFormData((prev) => ({
                                        ...prev,
                                        ...updateData,
                                    }));
                                }
                            }}
                        />

                        {/* Show extracted location */}
                        {formData.location.en && (
                            <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                                <p className="text-sm text-green-700">
                                    ✓ Location: <span className="font-medium">{formData.location.en}</span>
                                </p>
                            </div>
                        )}

                        {/* Show extracted coordinates */}
                        {formData.coordinates[0] !== 119.8654 && formData.coordinates[1] !== -3.0747 && (
                            <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <p className="text-sm text-blue-700">
                                    ✓ Coordinates: <span className="font-mono">{formData.coordinates[1]}, {formData.coordinates[0]}</span>
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Manual override */}
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-indigo-900 mb-2">
                            Location Name (editable)
                        </label>
                        <input
                            type="text"
                            value={formData.location.en}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    location: { id: e.target.value, en: e.target.value },
                                }))
                            }
                            className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none"
                            placeholder="Event venue or location"
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
                            <span className="text-sm text-indigo-900">Featured Event</span>
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
                        href="/admin/events"
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
                        {loading ? 'Saving...' : 'Save Event'}
                    </button>
                </div>
            </div>
        </form>
    );
}
