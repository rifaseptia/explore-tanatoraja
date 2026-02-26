import Link from 'next/link';
import { Plus, Pencil, MoreHorizontal, Search, Filter, UtensilsCrossed } from 'lucide-react';
import dbConnect from '@/lib/mongodb';
import Culinary from '@/models/Culinary';
import DeleteCulinaryButton from '@/components/admin/delete-culinary-button';

async function getCulinaryItems() {
    await dbConnect();
    return Culinary.find().sort({ createdAt: -1 }).lean();
}

const categoryLabels: Record<string, string> = {
    'main-course': 'Main Course',
    'snack': 'Snack',
    'drink': 'Drink',
    'souvenir': 'Souvenir',
};

export default async function AdminCulinaryPage() {
    const items = await getCulinaryItems();

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-heading font-bold text-2xl text-indigo-900">Culinary</h1>
                    <p className="text-neutral-500 mt-1">
                        Manage culinary items ({items.length} total)
                    </p>
                </div>
                <Link
                    href="/admin/culinary/new"
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg transition text-sm font-medium"
                >
                    <Plus className="w-4 h-4" />
                    Add Culinary
                </Link>
            </div>

            {/* Filters Bar */}
            <div className="bg-white rounded-xl border border-neutral-100 p-4 mb-6 flex items-center gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                        type="text"
                        placeholder="Search culinary items..."
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
                                Dish
                            </th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                                Category
                            </th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                                Halal
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
                        {items.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-16 text-center">
                                    <div className="max-w-sm mx-auto">
                                        <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
                                            <UtensilsCrossed className="w-8 h-8 text-neutral-300" />
                                        </div>
                                        <h3 className="font-medium text-indigo-900 mb-1">No culinary items yet</h3>
                                        <p className="text-neutral-500 text-sm mb-4">
                                            Add your first culinary item to get started.
                                        </p>
                                        <Link
                                            href="/admin/culinary/new"
                                            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Add Culinary
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            items.map((item) => (
                                <tr key={item.slug} className="hover:bg-neutral-50 transition">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={item.image}
                                                alt={item.title.id}
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
                                            {categoryLabels[item.category] || item.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${item.isHalal
                                                ? 'bg-green-50 text-green-600'
                                                : 'bg-red-50 text-red-600'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${item.isHalal ? 'bg-green-500' : 'bg-red-500'}`} />
                                            {item.isHalal ? 'Halal' : 'Non-Halal'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
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
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-1">
                                            <Link
                                                href={`/admin/culinary/${item.slug}/edit`}
                                                className="p-2 text-neutral-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Link>
                                            <DeleteCulinaryButton slug={item.slug} title={item.title.en || item.title.id} />
                                            <button className="p-2 text-neutral-400 hover:text-indigo-600 hover:bg-neutral-100 rounded-lg transition">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </button>
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
