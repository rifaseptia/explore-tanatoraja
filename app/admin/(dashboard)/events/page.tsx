import Link from 'next/link';
import { Plus, Pencil, MoreHorizontal, Search, Filter, Calendar } from 'lucide-react';
import dbConnect from '@/lib/mongodb';
import Event from '@/models/Event';
import DeleteEventButton from '@/components/admin/delete-event-button';

async function getEvents() {
    await dbConnect();
    return Event.find().sort({ startDate: -1 }).lean();
}

function formatDate(date: Date | string) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

export default async function AdminEventsPage() {
    const events = await getEvents();

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-heading font-bold text-2xl text-indigo-900">Events</h1>
                    <p className="text-neutral-500 mt-1">
                        Manage events and ceremonies ({events.length} total)
                    </p>
                </div>
                <Link
                    href="/admin/events/new"
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg transition text-sm font-medium"
                >
                    <Plus className="w-4 h-4" />
                    Add Event
                </Link>
            </div>

            {/* Filters Bar */}
            <div className="bg-white rounded-xl border border-neutral-100 p-4 mb-6 flex items-center gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                        type="text"
                        placeholder="Search events..."
                        className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border-0 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600 outline-none"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 border border-neutral-200 rounded-lg text-sm text-neutral-600 hover:bg-neutral-50 transition">
                    <Filter className="w-4 h-4" />
                    Filter
                </button>
            </div>

            {/* Events Table */}
            <div className="bg-white rounded-xl border border-neutral-100 overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-neutral-100">
                            <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                                Event
                            </th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                                Date
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
                        {events.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-16 text-center">
                                    <div className="max-w-sm mx-auto">
                                        <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
                                            <Calendar className="w-8 h-8 text-neutral-300" />
                                        </div>
                                        <h3 className="font-medium text-indigo-900 mb-1">No events yet</h3>
                                        <p className="text-neutral-500 text-sm mb-4">
                                            Create your first event to get started.
                                        </p>
                                        <Link
                                            href="/admin/events/new"
                                            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Add Event
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            events.map((event) => (
                                <tr key={event.slug} className="hover:bg-neutral-50 transition">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={event.image}
                                                alt={event.title.en || event.title.id}
                                                className="w-14 h-14 rounded-lg object-cover"
                                            />
                                            <div>
                                                <p className="font-medium text-indigo-900">{event.title.en || event.title.id}</p>
                                                <p className="text-sm text-neutral-400">{event.slug}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm">
                                            <p className="text-indigo-900">{formatDate(event.startDate)}</p>
                                            {event.endDate && (
                                                <p className="text-neutral-400">to {formatDate(event.endDate)}</p>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            <span className="inline-flex px-2.5 py-1 bg-neutral-100 text-neutral-600 rounded-full text-xs font-medium capitalize">
                                                {event.category}
                                            </span>
                                            {event.isRambuSolo && (
                                                <span className="inline-flex px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                                                    Rambu Solo&apos;
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {event.isPublished ? (
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
                                                href={`/admin/events/${event.slug}/edit`}
                                                className="p-2 text-neutral-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Link>
                                            <DeleteEventButton slug={event.slug} title={event.title.en || event.title.id} />
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
