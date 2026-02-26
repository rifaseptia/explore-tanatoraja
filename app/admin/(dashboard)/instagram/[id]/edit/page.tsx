'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2, Instagram } from 'lucide-react';
import Link from 'next/link';

interface InstagramPost {
    _id: string;
    postUrl: string;
    image: string;
    authorName: string;
    order: number;
    isActive: boolean;
}

export default function EditInstagramPostPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        postUrl: '',
        order: 0,
        isActive: true,
    });

    useEffect(() => {
        async function fetchPost() {
            const { id } = await params;
            try {
                const res = await fetch(`/api/instagram-posts/${id}`);
                if (!res.ok) throw new Error('Failed to fetch');
                const data: InstagramPost = await res.json();
                setFormData({
                    postUrl: data.postUrl || '',
                    order: data.order || 0,
                    isActive: data.isActive ?? true,
                });
            } catch (err) {
                console.error('Error fetching Instagram post:', err);
                setError('Failed to load Instagram post');
            } finally {
                setIsLoading(false);
            }
        }
        fetchPost();
    }, [params]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.postUrl) {
            setError('Please enter an Instagram post URL');
            return;
        }

        // Validate Instagram URL
        const instagramPattern = /instagram\.com\/(p|reel|tv)\/[a-zA-Z0-9_-]+/;
        if (!instagramPattern.test(formData.postUrl)) {
            setError('Please enter a valid Instagram post URL');
            return;
        }

        setIsSaving(true);
        setError('');

        try {
            const { id } = await params;
            const res = await fetch(`/api/instagram-posts/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                throw new Error('Failed to update Instagram post');
            }

            router.push('/admin/instagram');
            router.refresh();
        } catch (err) {
            console.error('Error updating Instagram post:', err);
            setError('Failed to update Instagram post');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/admin/instagram"
                    className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-neutral-600" />
                </Link>
                <div>
                    <h1 className="font-heading font-bold text-2xl text-indigo-900">Edit Instagram Post</h1>
                    <p className="text-neutral-500 mt-1">
                        Update the Instagram post URL
                    </p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-neutral-100 p-6">
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg">
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}

                {/* Instagram Post URL */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-indigo-900 mb-2">
                        Instagram Post URL <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="url"
                        value={formData.postUrl}
                        onChange={(e) => setFormData({ ...formData, postUrl: e.target.value })}
                        placeholder="https://www.instagram.com/p/xxxxxxxxx/"
                        className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <p className="text-xs text-neutral-400 mt-1">
                        Example: https://www.instagram.com/p/ABC123/
                    </p>
                </div>

                {/* Order */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-indigo-900 mb-2">
                        Display Order
                    </label>
                    <input
                        type="number"
                        value={formData.order}
                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                        min="0"
                        className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <p className="text-xs text-neutral-400 mt-1">
                        Lower numbers appear first (0, 1, 2, ...)
                    </p>
                </div>

                {/* Active Toggle */}
                <div className="mb-8">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.isActive}
                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                            className="w-5 h-5 rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm font-medium text-indigo-900">Show on website</span>
                    </label>
                </div>

                {/* Submit */}
                <div className="flex justify-end gap-3">
                    <Link
                        href="/admin/instagram"
                        className="px-5 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
