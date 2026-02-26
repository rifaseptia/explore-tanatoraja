'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
    totalPages: number;
    currentPage: number;
    baseUrl: string;
}

export default function Pagination({ totalPages, currentPage, baseUrl }: Props) {
    const searchParams = useSearchParams();

    // Helper to create URL with existing search params + new page
    const createPageUrl = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', page.toString());
        return `${baseUrl}?${params.toString()}`;
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center items-center gap-2 mt-12">
            {/* Previous Button */}
            {currentPage > 1 ? (
                <Link
                    href={createPageUrl(currentPage - 1)}
                    scroll={false}
                    className="p-2 rounded-full border border-gray-200 text-gray-500 hover:border-[#A78BFA] hover:text-[#A78BFA] transition-colors"
                >
                    <ChevronLeft size={20} />
                </Link>
            ) : (
                <span className="p-2 rounded-full border border-gray-100 text-gray-300 cursor-not-allowed">
                    <ChevronLeft size={20} />
                </span>
            )}

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Simple pagination logic: show all for now, or improve if many pages needed
                    // For < 10 pages, showing all is fine.
                    const isActive = page === currentPage;
                    return (
                        <Link
                            key={page}
                            href={createPageUrl(page)}
                            scroll={false}
                            className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium transition-all duration-300 ${isActive
                                ? 'bg-[#A78BFA] text-white shadow-lg shadow-violet-200/50'
                                : 'bg-white text-gray-500 hover:bg-gray-50'
                                }`}
                        >
                            {page}
                        </Link>
                    );
                })}
            </div>

            {/* Next Button */}
            {currentPage < totalPages ? (
                <Link
                    href={createPageUrl(currentPage + 1)}
                    scroll={false}
                    className="p-2 rounded-full border border-gray-200 text-gray-500 hover:border-[#A78BFA] hover:text-[#A78BFA] transition-colors"
                >
                    <ChevronRight size={20} />
                </Link>
            ) : (
                <span className="p-2 rounded-full border border-gray-100 text-gray-300 cursor-not-allowed">
                    <ChevronRight size={20} />
                </span>
            )}
        </div>
    );
}
