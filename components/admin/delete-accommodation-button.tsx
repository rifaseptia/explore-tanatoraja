'use client';

import { useState } from 'react';
import { Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface DeleteAccommodationButtonProps {
    slug: string;
    title: string;
}

export default function DeleteAccommodationButton({ slug, title }: DeleteAccommodationButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const res = await fetch(`/api/accommodations/${slug}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                throw new Error('Failed to delete accommodation');
            }

            // Close modal
            setShowConfirm(false);
            // Refresh the page data
            router.refresh();
        } catch (error) {
            console.error('Error deleting accommodation:', error);
            alert('Failed to delete accommodation');
            setIsDeleting(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setShowConfirm(true)}
                className="p-2 text-neutral-400 hover:text-red-600 hover:bg-neutral-100 rounded-lg transition"
                title="Delete Accommodation"
            >
                <Trash2 className="w-4 h-4" />
            </button>

            {/* Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center gap-4 mb-4 text-amber-500">
                            <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-neutral-900">Delete Accommodation</h3>
                                <p className="text-sm text-neutral-500">This action cannot be undone.</p>
                            </div>
                        </div>

                        <p className="text-neutral-600 mb-6">
                            Are you sure you want to delete <span className="font-semibold text-neutral-900">&quot;{title}&quot;</span>?
                        </p>

                        <div className="flex items-center justify-end gap-3">
                            <button
                                onClick={() => setShowConfirm(false)}
                                disabled={isDeleting}
                                className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition font-medium text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-medium text-sm disabled:opacity-50"
                            >
                                {isDeleting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
