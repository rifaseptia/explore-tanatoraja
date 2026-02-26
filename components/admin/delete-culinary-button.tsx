'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

interface Props {
    slug: string;
    title: string;
}

export default function DeleteCulinaryButton({ slug, title }: Props) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

        setIsDeleting(true);
        try {
            const res = await fetch(`/api/culinary/${slug}`, { method: 'DELETE' });
            const data = await res.json();

            if (data.success) {
                router.refresh();
            } else {
                alert('Failed to delete: ' + (data.error || 'Unknown error'));
            }
        } catch {
            alert('Failed to delete culinary item');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
            title={`Delete ${title}`}
        >
            <Trash2 className="w-4 h-4" />
        </button>
    );
}
