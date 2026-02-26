import Link from 'next/link';
import { Plus, Pencil, MoreHorizontal, Search, Filter, Home, MapPin, Building, Star } from 'lucide-react';
import dbConnect from '@/lib/mongodb';
import Accommodation from '@/models/Accommodation';
import DeleteAccommodationButton from '@/components/admin/delete-accommodation-button';

async function getAccommodations() {
    await dbConnect();
    return Accommodation.find().sort({ createdAt: -1 }).lean();
}

export default async function AdminAccommodationsPage() {
    const accommodations = await getAccommodations();

    const categoryIcons: Record<string, any> = {
        hotel: Building,
        homestay: Home,
        resort: Home,
        guesthouse: Home,
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-heading font-bold text-2xl text-indigo-900">Accommodations</h1>
                    <p className="text-neutral-500 mt-1">
                        Manage hotels, homestays, and guesthouses ({accommodations.length} total)
                    </p>
                </div>
                <Link
                    href="/admin/accommodations/new"
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg transition text-sm font-medium shadow-sm shadow-indigo-200"
                >
                    <Plus className="w-4 h-4" />
                    New Property
                </Link>
            </div>

            {/* Filters Bar (Visual only for now) */}
            <div className="bg-white rounded-xl border border-neutral-100 p-4 mb-6 flex items-center gap-4 shadow-sm">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                        type="text"
                        placeholder="Search accommodations..."
                        className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border-0 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 border border-neutral-200 rounded-lg text-sm text-neutral-600 hover:bg-neutral-50 transition">
                    <Filter className="w-4 h-4" />
                    Filter
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-neutral-100 overflow-hidden shadow-sm">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-neutral-100 bg-neutral-50/50">
                            <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Property</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Category</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Price & Rating</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Status</th>
                            <th className="text-right px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-50">
                        {accommodations.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-16 text-center">
                                    <div className="max-w-sm mx-auto">
                                        <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
                                            <Home className="w-8 h-8 text-neutral-300" />
                                        </div>
                                        <h3 className="font-medium text-indigo-900 mb-1">No accommodations yet</h3>
                                        <p className="text-neutral-500 text-sm mb-4">
                                            Add your first property to get started.
                                        </p>
                                        <Link
                                            href="/admin/accommodations/new"
                                            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Add Property
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            accommodations.map((item) => (
                                <tr key={item._id.toString()} className="hover:bg-neutral-50 transition">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-lg bg-neutral-100 overflow-hidden flex-shrink-0 border border-neutral-100">
                                                <img
                                                    src={item.image}
                                                    alt={item.title.en}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <p className="font-medium text-indigo-900 line-clamp-1">{item.title.en || item.title.id}</p>
                                                <div className="flex items-center gap-1 text-xs text-neutral-500 mt-1">
                                                    <MapPin className="w-3 h-3" />
                                                    <span className="truncate max-w-[150px]">{item.address}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium capitalize">
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm">
                                            <p className="text-indigo-900 font-medium">{item.priceRange}</p>
                                            {item.rating && (
                                                <div className="flex items-center gap-1 mt-0.5">
                                                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                                    <span className="text-xs text-neutral-500">{item.rating} Stars</span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1.5 items-start">
                                            {item.isPublished ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-600 rounded-full text-xs font-medium">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                                    Published
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-100 text-neutral-500 rounded-full text-xs font-medium">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                                                    Draft
                                                </span>
                                            )}
                                            {item.isFeatured && (
                                                <span className="inline-flex px-2 py-0.5 bg-amber-50 text-amber-600 rounded text-[10px] font-bold uppercase tracking-wide border border-amber-100">
                                                    Featured
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-1">
                                            <Link
                                                href={`/admin/accommodations/${item.slug}/edit`}
                                                className="p-2 text-neutral-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                                                title="Edit"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Link>
                                            <DeleteAccommodationButton slug={item.slug} title={item.title.en} />
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
