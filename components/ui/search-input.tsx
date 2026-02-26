'use client';

import { Search } from 'lucide-react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useTransition, useEffect, useState } from 'react';
import { useDebounce } from '@/hooks/use-debounce';

export default function SearchInput({ placeholder }: { placeholder: string }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(searchParams.get('q') || '');
    const [debouncedQuery] = useDebounce(query, 500);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        const params = new URLSearchParams(searchParams);

        if (debouncedQuery) {
            params.set('q', debouncedQuery);
            params.set('page', '1'); // Reset to page 1 on new search
        } else {
            params.delete('q');
        }

        // Only update if the query string actually changed
        if (params.toString() !== searchParams.toString()) {
            startTransition(() => {
                router.replace(`${pathname}?${params.toString()}`, { scroll: false });
            });
        }
    }, [debouncedQuery, pathname, router, searchParams]);

    return (
        <div className="relative w-64">
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={placeholder}
                    className="w-full px-6 py-2.5 rounded-full border border-gray-200 focus:border-[#A78BFA] outline-none transition-all text-gray-600 placeholder:text-gray-400 text-center text-sm font-medium"
                />
                {isPending && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <div className="w-4 h-4 border-2 border-violet-200 border-t-[#A78BFA] rounded-full animate-spin" />
                    </div>
                )}
            </div>
        </div>
    );
}
