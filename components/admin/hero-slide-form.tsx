'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';
import ImageUpload from './image-upload';

interface HeroSlideFormData {
    title: { id: string; en: string };
    subtitle: { id: string; en: string };
    image: string;
    video?: string; // Optional video URL (MP4)
    ctaText: { id: string; en: string };
    ctaLink: string;
    page: string;
    order: number;
    isActive: boolean;
}

interface Props {
    initialData?: HeroSlideFormData & { _id?: string };
    isEdit?: boolean;
    pageName: string;
    pageLabel: string;
    backUrl?: string;
}

export default function HeroSlideForm({ initialData, isEdit = false, pageName, pageLabel, backUrl = '/admin/hero-slides' }: Props) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'id' | 'en'>('id');
    const [formData, setFormData] = useState<HeroSlideFormData>(
        initialData || {
            title: { id: '', en: '' },
            subtitle: { id: '', en: '' },
            image: '',
            video: '',
            ctaText: { id: 'Mulai Jelajah', en: 'Start Exploring' },
            ctaLink: '#',
            page: pageName,
            order: 0,
            isActive: true,
        }
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Always include the page name in the data
            const data = { ...formData, page: pageName };

            if (isEdit && initialData?._id) {
                // Update existing
                const res = await fetch(`/api/hero-slides/${initialData._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
                if (!res.ok) throw new Error('Failed to update');
            } else {
                // Create new
                const res = await fetch('/api/hero-slides', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
                if (!res.ok) throw new Error('Failed to create');
            }

            router.push(backUrl);
            router.refresh();
        } catch (error) {
            console.error('Error saving:', error);
            alert('Failed to save hero slide');
        } finally {
            setIsLoading(false);
        }
    };

    const labelClass = 'block text-sm font-medium text-neutral-700 mb-1.5';
    const inputClass = 'w-full px-4 py-2.5 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600 outline-none transition';

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href={backUrl}
                        className="p-2 hover:bg-neutral-100 rounded-lg transition"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="font-heading font-bold text-2xl text-indigo-900">
                            Hero — {pageLabel}
                        </h1>
                        <p className="text-neutral-500 text-sm">
                            {isEdit ? 'Edit hero slide for this page' : 'Set up hero slide for this page'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href={backUrl}
                        className="px-4 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-100 rounded-lg transition"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 disabled:opacity-50"
                    >
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        Save
                    </button>
                </div>
            </div>

            {/* Language Tabs */}
            <div className="flex gap-1 bg-neutral-100 p-1 rounded-lg w-fit">
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

            {/* Hero Image & Video */}
            <div className="bg-white rounded-xl border border-neutral-100 p-6">
                <h2 className="font-semibold text-lg text-indigo-900 mb-6">Hero Background</h2>

                {/* Image Upload */}
                <div className="mb-6">
                    <ImageUpload
                        value={formData.image}
                        onChange={(url) => setFormData({ ...formData, image: url })}
                        label="Background Image"
                        description="High resolution recommended (1920×1080). Required if no video."
                        required={!formData.video}
                    />
                </div>

                {/* Video URL Input */}
                <div>
                    <label className={labelClass}>
                        Video Background (Optional)
                    </label>
                    <input
                        type="url"
                        value={formData.video || ''}
                        onChange={(e) => setFormData({ ...formData, video: e.target.value })}
                        className={inputClass}
                        placeholder="https://example.com/video.mp4"
                    />
                    <p className="text-xs text-neutral-400 mt-1">
                        Enter MP4 video URL. If provided, this will be shown instead of the image. Use for engaging backgrounds.
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl border border-neutral-100 p-6">
                <h2 className="font-semibold text-lg text-indigo-900 mb-6">Content</h2>
                <div className="space-y-5">
                    <div>
                        <label className={labelClass}>
                            Title ({activeTab === 'id' ? 'Indonesian' : 'English'})
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.title[activeTab]}
                            onChange={(e) => setFormData({ ...formData, title: { ...formData.title, [activeTab]: e.target.value } })}
                            className={inputClass}
                            placeholder={activeTab === 'id' ? 'Judul hero...' : 'Hero title...'}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>
                            Subtitle ({activeTab === 'id' ? 'Indonesian' : 'English'})
                        </label>
                        <textarea
                            required
                            rows={3}
                            value={formData.subtitle[activeTab]}
                            onChange={(e) => setFormData({ ...formData, subtitle: { ...formData.subtitle, [activeTab]: e.target.value } })}
                            className={`${inputClass} resize-none`}
                            placeholder={activeTab === 'id' ? 'Deskripsi singkat...' : 'Short description...'}
                        />
                    </div>
                </div>
            </div>

            {/* Call to Action */}
            <div className="bg-white rounded-xl border border-neutral-100 p-6">
                <h2 className="font-semibold text-lg text-indigo-900 mb-6">Call to Action (Button)</h2>
                <div className="space-y-5">
                    <div>
                        <label className={labelClass}>
                            Button Text ({activeTab === 'id' ? 'Indonesian' : 'English'})
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.ctaText[activeTab]}
                            onChange={(e) => setFormData({ ...formData, ctaText: { ...formData.ctaText, [activeTab]: e.target.value } })}
                            className={inputClass}
                            placeholder={activeTab === 'id' ? 'Mulai Jelajah' : 'Start Exploring'}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Link URL</label>
                        <input
                            type="text"
                            required
                            value={formData.ctaLink}
                            onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                            className={inputClass}
                            placeholder="/destinations or https://..."
                        />
                    </div>
                </div>
            </div>

            {/* Settings */}
            <div className="bg-white rounded-xl border border-neutral-100 p-6">
                <h2 className="font-semibold text-lg text-indigo-900 mb-6">Settings</h2>
                <div className="space-y-5">
                    <div>
                        <label className={labelClass}>Display Order</label>
                        <input
                            type="number"
                            value={formData.order}
                            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                            className={inputClass}
                        />
                        <p className="text-xs text-neutral-400 mt-1">For homepage hero: lower numbers appear first in carousel.</p>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                        <div>
                            <span className="text-sm font-medium text-neutral-700">Active Status</span>
                            <p className="text-xs text-neutral-400">Inactive slides won&apos;t be shown on the website</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                            className={`w-11 h-6 rounded-full transition-colors relative ${formData.isActive ? 'bg-green-500' : 'bg-neutral-200'}`}
                        >
                            <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${formData.isActive ? 'translate-x-5' : ''}`} />
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}
