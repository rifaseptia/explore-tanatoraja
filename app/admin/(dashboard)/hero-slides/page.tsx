export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { Pencil, Image, CheckCircle, AlertCircle, Plus, Layers } from 'lucide-react';
import dbConnect from '@/lib/mongodb';
import HeroSlide from '@/models/HeroSlide';

const PAGES = [
    { id: 'home', label: 'Homepage', description: 'Slideshow — multiple slides', multi: true },
    { id: 'destinations', label: 'Destinations', description: 'Single hero image', multi: false },
    { id: 'culinary', label: 'Culinary', description: 'Single hero image', multi: false },
    { id: 'events', label: 'Events', description: 'Single hero image', multi: false },
    { id: 'stay', label: 'Accommodation', description: 'Single hero image', multi: false },
    { id: 'transport', label: 'Transport', description: 'Single hero image', multi: false },
];

async function getHeroSlides() {
    await dbConnect();
    return HeroSlide.find().sort({ page: 1, order: 1 }).lean();
}

export default async function HeroSlidesAdminPage() {
    const slides = await getHeroSlides();

    // Group slides by page
    const slidesByPage: Record<string, typeof slides> = {};
    for (const slide of slides) {
        const page = slide.page || 'home';
        if (!slidesByPage[page]) slidesByPage[page] = [];
        slidesByPage[page].push(slide);
    }

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="font-heading font-bold text-2xl text-indigo-900">Hero Slides</h1>
                <p className="text-neutral-500 mt-1">
                    Manage hero images and text for each page
                </p>
            </div>

            {/* List */}
            <div className="bg-white rounded-xl border border-neutral-100 overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-neutral-100">
                            <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Page</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Preview</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Title</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Status</th>
                            <th className="text-right px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-50">
                        {PAGES.map((page) => {
                            const pageSlides = slidesByPage[page.id] || [];
                            const hasSlide = pageSlides.length > 0;
                            const firstSlide = pageSlides[0];

                            return (
                                <tr key={page.id} className="hover:bg-neutral-50 transition">
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-medium text-indigo-900">{page.label}</p>
                                            <p className="text-xs text-neutral-400">{page.description}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {hasSlide && firstSlide.image ? (
                                            <div className="relative">
                                                <img
                                                    src={firstSlide.image}
                                                    alt={page.label}
                                                    className="w-24 h-14 rounded-lg object-cover"
                                                />
                                                {page.multi && pageSlides.length > 1 && (
                                                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                                        {pageSlides.length}
                                                    </span>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="w-24 h-14 rounded-lg bg-neutral-100 flex items-center justify-center">
                                                <Image className="w-5 h-5 text-neutral-300" />
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {hasSlide && firstSlide.title ? (
                                            <div>
                                                <p className="text-sm text-neutral-600 line-clamp-1">
                                                    {firstSlide.title.en || firstSlide.title.id || '—'}
                                                </p>
                                                {page.multi && pageSlides.length > 1 && (
                                                    <p className="text-xs text-neutral-400 mt-0.5">
                                                        +{pageSlides.length - 1} more slide{pageSlides.length > 2 ? 's' : ''}
                                                    </p>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-neutral-300 italic">Not set</p>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {hasSlide ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-600 rounded-full text-xs font-medium">
                                                <CheckCircle className="w-3 h-3" />
                                                {page.multi ? `${pageSlides.length} slide${pageSlides.length > 1 ? 's' : ''}` : 'Configured'}
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-medium">
                                                <AlertCircle className="w-3 h-3" />
                                                Not Set
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {page.multi ? (
                                            <Link
                                                href="/admin/hero-slides/home/manage"
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                                            >
                                                <Layers className="w-3.5 h-3.5" />
                                                Manage
                                            </Link>
                                        ) : (
                                            <Link
                                                href={`/admin/hero-slides/${page.id}/edit`}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                                            >
                                                <Pencil className="w-3.5 h-3.5" />
                                                Edit
                                            </Link>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
