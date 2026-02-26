export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { ArrowLeft, Plus, Pencil, Image } from 'lucide-react';
import dbConnect from '@/lib/mongodb';
import HeroSlide from '@/models/HeroSlide';
import DeleteHeroSlideButton from '@/components/admin/delete-hero-slide-button';

async function getHomeSlides() {
    await dbConnect();
    const slides = await HeroSlide.find({ $or: [{ page: 'home' }, { page: { $exists: false } }] })
        .sort({ order: 1, createdAt: -1 })
        .lean();

    return slides.map(s => ({
        ...s,
        _id: s._id.toString(),
        createdAt: s.createdAt?.toISOString(),
        updatedAt: s.updatedAt?.toISOString(),
    }));
}

export default async function ManageHomeSlidesPage() {
    const slides = await getHomeSlides();

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/hero-slides"
                        className="p-2 hover:bg-neutral-100 rounded-lg transition"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="font-heading font-bold text-2xl text-indigo-900">
                            Homepage Slides
                        </h1>
                        <p className="text-neutral-500 text-sm">
                            Manage slideshow images for the homepage hero
                        </p>
                    </div>
                </div>
                <Link
                    href="/admin/hero-slides/home/new"
                    className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
                >
                    <Plus className="w-4 h-4" />
                    Add Slide
                </Link>
            </div>

            {/* Slides List */}
            <div className="bg-white rounded-xl border border-neutral-100 overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-neutral-100">
                            <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider w-16">
                                Order
                            </th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                                Slide
                            </th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="text-right px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-50">
                        {slides.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-16 text-center">
                                    <div className="max-w-sm mx-auto">
                                        <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
                                            <Image className="w-8 h-8 text-neutral-300" />
                                        </div>
                                        <h3 className="font-medium text-indigo-900 mb-1">No homepage slides yet</h3>
                                        <p className="text-neutral-500 text-sm mb-4">
                                            Add your first slide to the homepage hero.
                                        </p>
                                        <Link
                                            href="/admin/hero-slides/home/new"
                                            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Add Slide
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            slides.map((slide) => (
                                <tr key={slide._id} className="hover:bg-neutral-50 transition">
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 text-indigo-700 text-sm font-bold">
                                            {slide.order}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            {slide.image ? (
                                                <img
                                                    src={slide.image}
                                                    alt={slide.title?.en || 'Slide'}
                                                    className="w-24 h-14 rounded-lg object-cover"
                                                />
                                            ) : (
                                                <div className="w-24 h-14 rounded-lg bg-neutral-100 flex items-center justify-center">
                                                    <Image className="w-5 h-5 text-neutral-300" />
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-medium text-indigo-900 line-clamp-1">
                                                    {slide.title?.en || slide.title?.id || 'Untitled'}
                                                </p>
                                                <p className="text-sm text-neutral-400 line-clamp-1">
                                                    {slide.subtitle?.en || slide.subtitle?.id || ''}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {slide.isActive ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-600 rounded-full text-xs font-medium">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                                Active
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-100 text-neutral-500 rounded-full text-xs font-medium">
                                                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                                                Inactive
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-1">
                                            <Link
                                                href={`/admin/hero-slides/${slide._id}/edit`}
                                                className="p-2 text-neutral-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Link>
                                            <DeleteHeroSlideButton id={slide._id} title={slide.title?.en || 'Slide'} />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
