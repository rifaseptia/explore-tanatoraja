'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useTransition } from 'react';
import { useDebounce } from '@/hooks/use-debounce';

interface Props {
    placeholder: string;
    label?: string; // Kept for API compatibility, but might be less visible in expanded state
}

export default function SearchToggle({ placeholder, label }: Props) {
    const [isExpanded, setIsExpanded] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [query, setQuery] = useState(searchParams.get('q') || '');
    const [debouncedQuery] = useDebounce(query, 500);
    const [isPending, startTransition] = useTransition();

    // Sync query with URL logic (Debounce)
    useEffect(() => {
        const params = new URLSearchParams(searchParams);

        if (debouncedQuery) {
            params.set('q', debouncedQuery);
            params.set('page', '1');
            setIsExpanded(true); // Keep expanded if there is a query
        } else {
            params.delete('q');
        }

        if (params.toString() !== searchParams.toString()) {
            startTransition(() => {
                router.replace(`${pathname}?${params.toString()}`, { scroll: false });
            });
        }
    }, [debouncedQuery, pathname, router, searchParams]);

    // Handle click outside to collapse
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                // Only collapse if query is empty
                if (!query) {
                    setIsExpanded(false);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [query]);

    const handleToggle = () => {
        setIsExpanded(true);
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    const handleClear = () => {
        setQuery('');
        inputRef.current?.focus();
    };

    return (
        <div
            ref={containerRef}
            className={`relative flex items-center transition-all duration-500 ease-in-out ${isExpanded ? 'w-64 sm:w-80' : 'w-auto'
                }`}
        >
            <div className={`relative flex items-center w-full h-11 rounded-full border transition-all duration-300 ${isExpanded || query
                    ? 'bg-white border-[#A78BFA] shadow-lg shadow-violet-200/50 ring-2 ring-violet-100'
                    : 'bg-white border-gray-200 hover:border-[#A78BFA]'
                }`}>

                {/* Icon Trigger */}
                <button
                    onClick={handleToggle}
                    className={`flex items-center justify-center h-full px-4 rounded-full transition-colors ${isExpanded ? 'text-[#A78BFA]' : 'text-gray-500 hover:text-[#A78BFA]'
                        }`}
                >
                    <Search size={18} />
                    {!isExpanded && label && (
                        <span className="ml-2 text-sm font-bold whitespace-nowrap">{label}</span>
                    )}
                </button>

                {/* Expanding Input */}
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={placeholder}
                    className={`bg-transparent border-none outline-none text-sm text-gray-700 placeholder:text-gray-400 h-full transition-all duration-300 ${isExpanded ? 'w-full pr-10 opacity-100 ml-1' : 'w-0 opacity-0 p-0 overflow-hidden'
                        }`}
                />

                {/* Close/Clear Button */}
                {isExpanded && (
                    <div className="absolute right-3 flex items-center">
                        {/* Loading State or Clear Button */}
                        {isPending ? (
                            <div className="w-4 h-4 border-2 border-violet-200 border-t-[#A78BFA] rounded-full animate-spin" />
                        ) : query ? (
                            <button onClick={handleClear} className="text-gray-400 hover:text-gray-600">
                                <X size={16} />
                            </button>
                        ) : null}
                    </div>
                )}
            </div>
        </div>
    );
}
