'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, X, Loader2, Plus } from 'lucide-react';
import Link from 'next/link';
import ImageUpload from './image-upload';

interface AccommodationFormData {
    title: { id: string; en: string };
    slug: string;
    description: { id: string; en: string };
    story: { id: string; en: string };
    category: 'hotel' | 'homestay' | 'resort' | 'guesthouse';
    image: string;
    priceRange: string;
    rating: number;
    amenities: string[];
    address: string;
    phone: string;
    mapUrl: string;
    isFeatured: boolean;
    isPublished: boolean;
}

interface AccommodationFormProps {
    initialData?: Partial<AccommodationFormData>;
    isEditing?: boolean;
}

const defaultData: AccommodationFormData = {
    title: { id: '', en: '' },
    slug: '',
    description: { id: '', en: '' },
    story: { id: '', en: '' },
    category: 'hotel',
    image: '',
    priceRange: '',
    rating: 3,
    amenities: [],
    address: '',
    phone: '',
    mapUrl: '',
    isFeatured: false,
    isPublished: true,
};

const commonAmenities = [
    'WiFi', 'Pool', 'Breakfast', 'AC', 'Restaurant', 'Parking',
    'Spa', 'Gym', 'Bar', 'Laundry', 'Room Service', 'Garden',
    'Mountain View', 'Balcony', 'Hot Water', 'Airport Transfer'
];

export default function AccommodationForm({ initialData, isEditing = false }: AccommodationFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'id' | 'en'>('en');
    const [formData, setFormData] = useState<AccommodationFormData>({
        ...defaultData,
        ...initialData,
    });
    const [newAmenity, setNewAmenity] = useState('');

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

    const handleAmenityToggle = (amenity: string) => {
        setFormData(prev => {
            const exists = prev.amenities.includes(amenity);
            if (exists) {
                return { ...prev, amenities: prev.amenities.filter(a => a !== amenity) };
            } else {
                return { ...prev, amenities: [...prev.amenities, amenity] };
            }
        });
    };

    const handleAddAmenity = () => {
        if (newAmenity && !formData.amenities.includes(newAmenity)) {
            setFormData(prev => ({ ...prev, amenities: [...prev.amenities, newAmenity] }));
            setNewAmenity('');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Fill empty translations
            const dataToSubmit = { ...formData };
            if (!dataToSubmit.title.id && dataToSubmit.title.en) dataToSubmit.title.id = dataToSubmit.title.en;
            if (!dataToSubmit.title.en && dataToSubmit.title.id) dataToSubmit.title.en = dataToSubmit.title.id;

            const url = isEditing
                ? `/api/accommodations/${initialData?.slug}`
                : '/api/accommodations';
            const method = isEditing ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSubmit),
            });

            if (!res.ok) {
                throw new Error('Failed to save accommodation');
            }

            router.push('/admin/accommodations');
            router.refresh();
        } catch (error) {
            console.error('Error saving accommodation:', error);
            alert('Failed to save accommodation');
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
                        {isEditing ? 'Edit Accommodation' : 'New Accommodation'}
                    </h1>
                    <p className="text-neutral-500 mt-1">
                        {isEditing ? 'Update property details' : 'Add a new place to stay'}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/accommodations"
                        className="flex items-center gap-2 px-4 py-2.5 border border-neutral-200 rounded-lg text-neutral-600 hover:bg-neutral-50 transition"
                    >
                        <X className="w-4 h-4" />
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg transition disabled:opacity-50 shadow-sm shadow-indigo-200"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {loading ? 'Saving...' : 'Save Property'}
                    </button>
                </div>
            </div>

            {/* Language Tabs */}
            <div className="flex gap-1 mb-6 bg-neutral-100 p-1 rounded-lg w-fit">
                <button
                    type="button"
                    onClick={() => setActiveTab('id')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'id' ? 'bg-white text-indigo-900 shadow-sm' : 'text-neutral-500 hover:text-indigo-900'}`}
                >
                    🇮🇩 Indonesian
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('en')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'en' ? 'bg-white text-indigo-900 shadow-sm' : 'text-neutral-500 hover:text-indigo-900'}`}
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
                                placeholder="Property name"
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
                                    setFormData(prev => ({ ...prev, slug: value }));
                                }}
                                className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none bg-neutral-50"
                                placeholder="property-slug"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                            <label className="block text-sm font-medium text-indigo-900 mb-2">Category *</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                                className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none"
                            >
                                <option value="hotel">Hotel</option>
                                <option value="homestay">Homestay</option>
                                <option value="resort">Resort</option>
                                <option value="guesthouse">Guesthouse</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-indigo-900 mb-2">Rating (1-5)</label>
                            <select
                                value={formData.rating}
                                onChange={(e) => setFormData(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                                className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none"
                            >
                                {[1, 2, 3, 4, 5].map(r => (
                                    <option key={r} value={r}>{r} Stars</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-indigo-900 mb-2">
                            Description ({activeTab === 'id' ? 'Indonesian' : 'English'}) *
                        </label>
                        <textarea
                            value={formData.description[activeTab]}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: { ...prev.description, [activeTab]: e.target.value } }))}
                            rows={3}
                            className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none resize-none"
                            placeholder="Short description of the property"
                            required
                        />
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-indigo-900 mb-2">
                            Story / Detail ({activeTab === 'id' ? 'Indonesian' : 'English'})
                        </label>
                        <textarea
                            value={formData.story[activeTab]}
                            onChange={(e) => setFormData(prev => ({ ...prev, story: { ...prev.story, [activeTab]: e.target.value } }))}
                            rows={5}
                            className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none resize-none"
                            placeholder="Full detail or story about the property"
                        />
                    </div>
                </div>

                {/* Photos Card — prominent like Destinations */}
                <div className="bg-white rounded-xl border border-neutral-100 p-6">
                    <h2 className="font-semibold text-indigo-900 mb-6">Photos</h2>
                    <ImageUpload
                        value={formData.image}
                        onChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
                        label="Cover Image (Main Photo)"
                        description="Main image for the property listing. Drag & drop or click to upload. Auto-compressed if > 5MB."
                        required
                        isThumbnail
                    />
                </div>

                {/* Amenities Card */}
                <div className="bg-white rounded-xl border border-neutral-100 p-6">
                    <h2 className="font-semibold text-indigo-900 mb-4">Amenities</h2>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {commonAmenities.map(amenity => (
                            <button
                                key={amenity}
                                type="button"
                                onClick={() => handleAmenityToggle(amenity)}
                                className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${formData.amenities.includes(amenity)
                                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-medium'
                                    : 'bg-white border-neutral-200 text-neutral-600 hover:border-indigo-200'
                                    }`}
                            >
                                {amenity}
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newAmenity}
                            onChange={(e) => setNewAmenity(e.target.value)}
                            placeholder="Add custom amenity..."
                            className="flex-1 px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none text-sm"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddAmenity();
                                }
                            }}
                        />
                        <button
                            type="button"
                            onClick={handleAddAmenity}
                            className="px-3 py-2.5 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Property Details Card */}
                <div className="bg-white rounded-xl border border-neutral-100 p-6">
                    <h2 className="font-semibold text-indigo-900 mb-4">Property Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-indigo-900 mb-2">Price Range *</label>
                            <input
                                type="text"
                                value={formData.priceRange}
                                onChange={(e) => setFormData(prev => ({ ...prev, priceRange: e.target.value }))}
                                placeholder="e.g. Rp 500.000 - 1.000.000"
                                className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-indigo-900 mb-2">Phone</label>
                            <input
                                type="text"
                                value={formData.phone}
                                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                placeholder="+62 xxx xxxx xxxx"
                                className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none"
                            />
                        </div>
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-indigo-900 mb-2">Address *</label>
                        <input
                            type="text"
                            value={formData.address}
                            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                            placeholder="Full address of the property"
                            className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none"
                            required
                        />
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-indigo-900 mb-2">Map URL</label>
                        <input
                            type="text"
                            value={formData.mapUrl}
                            onChange={(e) => {
                                const url = e.target.value;

                                // Check for short URL format - show message to user
                                if (url.includes('maps.app.goo.gl') || url.includes('goo.gl/maps') || url.includes('goo.gl\/maps')) {
                                    alert('Gunakan link Google Maps panjang (maps.google.com), bukan link pendek. Buka lokasi di browser, lalu salin URL dari address bar.');
                                    return;
                                }

                                setFormData(prev => ({ ...prev, mapUrl: e.target.value }))
                            }}
                            placeholder="https://maps.google.com/..."
                            className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none"
                        />
                    </div>
                </div>

                {/* Publish Settings Card */}
                <div className="bg-white rounded-xl border border-neutral-100 p-6">
                    <h2 className="font-semibold text-indigo-900 mb-4">Publish Settings</h2>
                    <div className="flex items-center gap-6">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.isFeatured}
                                onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                                className="w-5 h-5 rounded border-neutral-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            <span className="text-sm text-indigo-900">Featured Property</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.isPublished}
                                onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
                                className="w-5 h-5 rounded border-neutral-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            <span className="text-sm text-indigo-900">Published</span>
                        </label>
                    </div>
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200">
                    <Link
                        href="/admin/accommodations"
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
                        {loading ? 'Saving...' : 'Save Property'}
                    </button>
                </div>
            </div>
        </form>
    );
}
