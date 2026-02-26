export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { Plus, Pencil, Search, Filter, Plane } from 'lucide-react';
import dbConnect from '@/lib/mongodb';
import Transport from '@/models/Transport';
import DeleteTransportButton from '@/components/admin/delete-transport-button';

async function getTransportOptions() {
    await dbConnect();
    return Transport.find().sort({ createdAt: -1 }).lean();
}

export default async function TransportAdminPage() {
    const transportOptions = await getTransportOptions();

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-heading font-bold text-2xl text-indigo-900">Transport</h1>
                    <p className="text-neutral-500 mt-1">
                        Manage transportation methods and routes ({transportOptions.length} total)
                    </p>
                </div>
                <Link
                    href="/admin/transport/new"
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg transition text-sm font-medium"
                >
                    <Plus className="w-4 h-4" />
                    Add Transport
                </Link>
            </div>

            {/* Filters Bar */}
            <div className="bg-white rounded-xl border border-neutral-100 p-4 mb-6 flex items-center gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                        type="text"
                        placeholder="Search transport..."
                        className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border-0 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600 outline-none"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 border border-neutral-200 rounded-lg text-sm text-neutral-600 hover:bg-neutral-50 transition">
                    <Filter className="w-4 h-4" />
                    Filter
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-neutral-100 overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-neutral-100">
                            <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                                Transport
                            </th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                                Category
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
                        {transportOptions.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-16 text-center">
                                    <div className="max-w-sm mx-auto">
                                        <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
                                            <Plane className="w-8 h-8 text-neutral-300" />
                                        </div>
                                        <h3 className="font-medium text-indigo-900 mb-1">No transport options yet</h3>
                                        <p className="text-neutral-500 text-sm mb-4">
                                            Add your first transport option to get started.
                                        </p>
                                        <Link
                                            href="/admin/transport/new"
                                            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Add Transport
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            transportOptions.map((item) => (
                                <tr key={item._id.toString()} className="hover:bg-neutral-50 transition">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={item.image}
                                                alt={item.title.en}
                                                className="w-14 h-14 rounded-lg object-cover"
                                            />
                                            <div>
                                                <p className="font-medium text-indigo-900">{item.title.en || item.title.id}</p>
                                                <p className="text-sm text-neutral-400">{item.slug}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex px-2.5 py-1 bg-neutral-100 text-neutral-600 rounded-full text-xs font-medium capitalize">
                                            {item.category}
                                        </span>
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
                                                href={`/admin/transport/${item.slug}/edit`}
                                                className="p-2 text-neutral-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Link>
                                            <DeleteTransportButton slug={item.slug} title={item.title.en} />
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
