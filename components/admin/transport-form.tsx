'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Loader2, Plus, X } from 'lucide-react';
import Link from 'next/link';
import ImageUpload from './image-upload';

interface TransportFormData {
    title: { id: string; en: string };
    slug: string;
    description: { id: string; en: string };
    story: { id: string; en: string };
    category: 'flight' | 'bus' | 'rental' | 'local';
    image: string;
    duration: string;
    priceRange: string;
    routes: { id: string; en: string }[];
    tips: { id: string; en: string }[];
    isFeatured: boolean;
    isPublished: boolean;
}

interface Props {
    initialData?: TransportFormData;
    isEdit?: boolean;
}

export default function TransportForm({ initialData, isEdit = false }: Props) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'id' | 'en'>('en');
    const [formData, setFormData] = useState<TransportFormData>(
        initialData || {
            title: { id: '', en: '' },
            slug: '',
            description: { id: '', en: '' },
            story: { id: '', en: '' },
            category: 'rental',
            image: '',
            duration: '',
            priceRange: '',
            routes: [],
            tips: [],
            isFeatured: false,
            isPublished: true,
        }
    );

    const [newRoute, setNewRoute] = useState('');
    const [newTip, setNewTip] = useState('');

    const handleTitleChange = (lang: 'id' | 'en', value: string) => {
        setFormData((prev) => {
            const newData = {
                ...prev,
                title: { ...prev.title, [lang]: value },
            };
            if (!isEdit && lang === 'en') {
                newData.slug = value
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)+/g, '');
            }
            return newData;
        });
    };

    const handleAddRoute = () => {
        if (newRoute.trim()) {
            const route = { id: '', en: '' };
            route[activeTab] = newRoute;
            setFormData((prev) => ({
                ...prev,
                routes: [...prev.routes, route]
            }));
            setNewRoute('');
        }
    };

    const handleRemoveRoute = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            routes: prev.routes.filter((_, i) => i !== index)
        }));
    };

    const handleUpdateRoute = (index: number, value: string) => {
        setFormData((prev) => ({
            ...prev,
            routes: prev.routes.map((r, i) => i === index ? { ...r, [activeTab]: value } : r)
        }));
    };

    const handleAddTip = () => {
        if (newTip.trim()) {
            const tip = { id: '', en: '' };
            tip[activeTab] = newTip;
            setFormData((prev) => ({
                ...prev,
                tips: [...prev.tips, tip]
            }));
            setNewTip('');
        }
    };

    const handleRemoveTip = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            tips: prev.tips.filter((_, i) => i !== index)
        }));
    };

    const handleUpdateTip = (index: number, value: string) => {
        setFormData((prev) => ({
            ...prev,
            tips: prev.tips.map((t, i) => i === index ? { ...t, [activeTab]: value } : t)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const url = isEdit
                ? `/api/transport/${formData.slug}`
                : '/api/transport';
            const method = isEdit ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error('Failed to save');

            router.push('/admin/transport');
            router.refresh();
        } catch (error) {
            console.error('Error saving:', error);
            alert('Failed to save transport');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-heading font-bold text-2xl text-indigo-900">
                        {isEdit ? 'Edit Transport' : 'New Transport'}
                    </h1>
                    <p className="text-neutral-500 mt-1">
                        {isEdit ? 'Update transport details' : 'Add a new transport option'}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/transport"
                        className="flex items-center gap-2 px-4 py-2.5 border border-neutral-200 rounded-lg text-neutral-600 hover:bg-neutral-50 transition"
                    >
                        <X className="w-4 h-4" />
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg transition disabled:opacity-50 shadow-sm shadow-indigo-200"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {isLoading ? 'Saving...' : 'Save'}
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
                {/* Basic Info */}
                <div className="bg-white rounded-xl border border-neutral-100 p-6">
                    <h2 className="font-semibold text-indigo-900 mb-4">Basic Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-indigo-900 mb-2">
                                Name ({activeTab === 'id' ? 'Indonesian' : 'English'}) *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.title[activeTab]}
                                onChange={(e) => handleTitleChange(activeTab, e.target.value)}
                                className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none"
                                placeholder="Transport name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-indigo-900 mb-2">Slug *</label>
                            <input
                                type="text"
                                required
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none bg-neutral-50"
                                placeholder="transport-slug"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div>
                            <label className="block text-sm font-medium text-indigo-900 mb-2">Category *</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                                className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none"
                            >
                                <option value="flight">Flight (Penerbangan)</option>
                                <option value="bus">Bus / Travel</option>
                                <option value="rental">Rental / Tour</option>
                                <option value="local">Local Transport</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-indigo-900 mb-2">Duration</label>
                            <input
                                type="text"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none"
                                placeholder="e.g. 2-3 hours"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-indigo-900 mb-2">Price Range</label>
                            <input
                                type="text"
                                value={formData.priceRange}
                                onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })}
                                className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none"
                                placeholder="e.g. Rp 100k - 200k"
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-indigo-900 mb-2">
                            Description ({activeTab === 'id' ? 'Indonesian' : 'English'}) *
                        </label>
                        <textarea
                            required
                            rows={3}
                            value={formData.description[activeTab]}
                            onChange={(e) => setFormData({ ...formData, description: { ...formData.description, [activeTab]: e.target.value } })}
                            className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none resize-none"
                            placeholder="Short description"
                        />
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-indigo-900 mb-2">
                            Full Story ({activeTab === 'id' ? 'Indonesian' : 'English'})
                        </label>
                        <textarea
                            rows={5}
                            value={formData.story[activeTab]}
                            onChange={(e) => setFormData({ ...formData, story: { ...formData.story, [activeTab]: e.target.value } })}
                            className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none resize-none"
                            placeholder="Full content or story"
                        />
                    </div>
                </div>

                {/* Photos */}
                <div className="bg-white rounded-xl border border-neutral-100 p-6">
                    <h2 className="font-semibold text-indigo-900 mb-6">Photos</h2>
                    <ImageUpload
                        value={formData.image}
                        onChange={(url) => setFormData({ ...formData, image: url })}
                        label="Cover Image (Main Photo)"
                        description="Main image for the transport listing. Drag & drop or click to upload. Auto-compressed to ~800KB."
                        required
                        isThumbnail
                    />
                </div>

                {/* Routes */}
                <div className="bg-white rounded-xl border border-neutral-100 p-6">
                    <h2 className="font-semibold text-indigo-900 mb-1">Routes / Schedules</h2>
                    <p className="text-xs text-neutral-400 mb-4">Switch tab 🇮🇩/🇬🇧 to input each language</p>
                    <div className="flex gap-2 mb-4">
                        <input
                            placeholder={`Add route (${activeTab === 'id' ? 'Indonesian' : 'English'})...`}
                            className="flex-1 px-4 py-2.5 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600 outline-none"
                            value={newRoute}
                            onChange={(e) => setNewRoute(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddRoute(); } }}
                        />
                        <button
                            type="button"
                            onClick={handleAddRoute}
                            className="px-3 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="space-y-2">
                        {formData.routes.map((route, idx) => (
                            <div key={idx} className="flex items-center gap-2 p-3 bg-neutral-50 rounded-lg border border-neutral-100">
                                <span className="text-xs font-medium text-neutral-400 uppercase w-6">{activeTab}</span>
                                <input
                                    type="text"
                                    value={route[activeTab]}
                                    onChange={(e) => handleUpdateRoute(idx, e.target.value)}
                                    placeholder={`Enter ${activeTab === 'id' ? 'Indonesian' : 'English'} translation...`}
                                    className={`flex-1 px-3 py-1.5 border rounded-md text-sm outline-none focus:ring-2 focus:ring-indigo-600 ${!route[activeTab] ? 'border-amber-300 bg-amber-50' : 'border-neutral-200 bg-white'}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveRoute(idx)}
                                    className="text-neutral-400 hover:text-red-500 transition"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                        {formData.routes.length === 0 && (
                            <p className="text-sm text-neutral-400 text-center py-4">No routes added yet</p>
                        )}
                    </div>
                </div>

                {/* Travel Tips */}
                <div className="bg-white rounded-xl border border-neutral-100 p-6">
                    <h2 className="font-semibold text-indigo-900 mb-1">Travel Tips</h2>
                    <p className="text-xs text-neutral-400 mb-4">Switch tab 🇮🇩/🇬🇧 to input each language</p>
                    <div className="flex gap-2 mb-4">
                        <input
                            placeholder={`Add tip (${activeTab === 'id' ? 'Indonesian' : 'English'})...`}
                            className="flex-1 px-4 py-2.5 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600 outline-none"
                            value={newTip}
                            onChange={(e) => setNewTip(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTip(); } }}
                        />
                        <button
                            type="button"
                            onClick={handleAddTip}
                            className="px-3 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="space-y-2">
                        {formData.tips.map((tip, idx) => (
                            <div key={idx} className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg border border-amber-100">
                                <span className="text-xs font-medium text-neutral-400 uppercase w-6">{activeTab}</span>
                                <input
                                    type="text"
                                    value={tip[activeTab]}
                                    onChange={(e) => handleUpdateTip(idx, e.target.value)}
                                    placeholder={`Enter ${activeTab === 'id' ? 'Indonesian' : 'English'} translation...`}
                                    className={`flex-1 px-3 py-1.5 border rounded-md text-sm outline-none focus:ring-2 focus:ring-indigo-600 ${!tip[activeTab] ? 'border-amber-300 bg-amber-50' : 'border-neutral-200 bg-white'}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveTip(idx)}
                                    className="text-neutral-400 hover:text-red-500 transition"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                        {formData.tips.length === 0 && (
                            <p className="text-sm text-neutral-400 text-center py-4">No tips added yet</p>
                        )}
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
                                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                                className="w-5 h-5 rounded border-neutral-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            <span className="text-sm text-indigo-900">Featured</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.isPublished}
                                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                                className="w-5 h-5 rounded border-neutral-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            <span className="text-sm text-indigo-900">Published</span>
                        </label>
                    </div>
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200">
                    <Link
                        href="/admin/transport"
                        className="flex items-center gap-2 px-6 py-3 border border-neutral-200 rounded-lg text-neutral-600 hover:bg-neutral-50 transition"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg transition disabled:opacity-50 font-medium shadow-sm shadow-indigo-200"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {isLoading ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>
        </form>
    );
}
