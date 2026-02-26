import { MapPin, Calendar, FileText, Image, TrendingUp, Eye } from 'lucide-react';
import Link from 'next/link';
import dbConnect from '@/lib/mongodb';
import Destination from '@/models/Destination';
import Event from '@/models/Event';
import Article from '@/models/Article';
import HeroSlide from '@/models/HeroSlide';
import ActivityLog from '@/models/ActivityLog';
import ContentStatsChart from '@/components/admin/content-stats-chart';
import ActivityLogList from '@/components/admin/activity-log-list';

async function getStats() {
    await dbConnect();

    const [destinations, events, articles, heroSlides, recentActivities] = await Promise.all([
        Destination.countDocuments(),
        Event.countDocuments(),
        Article.countDocuments(),
        HeroSlide.countDocuments(),
        ActivityLog.find().sort({ createdAt: -1 }).limit(10).lean(),
    ]);

    return { destinations, events, articles, heroSlides, recentActivities };
}

// Mock chart data - in production this would come from aggregated database queries
function getChartData() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, i) => ({
        month,
        destinations: Math.floor(Math.random() * 5) + i,
        events: Math.floor(Math.random() * 3) + i,
        articles: Math.floor(Math.random() * 8) + i * 2,
    }));
}

export default async function AdminDashboardPage() {
    const stats = await getStats();
    const chartData = getChartData();

    const statCards = [
        {
            label: 'Total Destinations',
            value: stats.destinations,
            icon: MapPin,
            href: '/admin/destinations',
            change: '+12%'
        },
        {
            label: 'Active Events',
            value: stats.events,
            icon: Calendar,
            href: '/admin/events',
            change: '+5%'
        },
        {
            label: 'Published Articles',
            value: stats.articles,
            icon: FileText,
            href: '/admin/articles',
            change: '+8%'
        },
        {
            label: 'Hero Slides',
            value: stats.heroSlides,
            icon: Image,
            href: '/admin/hero-slides',
            change: '0%'
        },
    ];

    // Format activities for component with default values for missing fields
    const formattedActivities = stats.recentActivities.map((a: { _id: unknown; createdAt: unknown; action?: string; entity?: string; entityTitle?: string; adminName?: string }) => ({
        _id: String(a._id),
        action: (a.action || 'create') as 'create' | 'update' | 'delete' | 'publish' | 'unpublish',
        entity: (a.entity || 'destination') as 'destination' | 'event' | 'article' | 'hero_slide' | 'user',
        entityTitle: a.entityTitle || 'Unknown',
        adminName: a.adminName || 'Admin',
        createdAt: String(a.createdAt),
    }));

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="font-heading font-bold text-2xl text-indigo-900">Dashboard</h1>
                <p className="text-neutral-500 mt-1">
                    Welcome back! Here&apos;s an overview of your content.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat) => (
                    <Link
                        key={stat.label}
                        href={stat.href}
                        className="bg-white rounded-xl p-6 border border-neutral-100 hover:border-indigo-200 hover:shadow-sm transition group"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-2.5 rounded-lg bg-neutral-50 group-hover:bg-indigo-600 group-hover:text-white transition">
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <div className="flex items-center gap-1 text-xs text-green-600">
                                <TrendingUp className="w-3 h-3" />
                                {stat.change}
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-indigo-900">{stat.value}</p>
                        <p className="text-neutral-500 text-sm mt-1">{stat.label}</p>
                    </Link>
                ))}
            </div>

            {/* Chart & Activity Log Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Content Growth Chart */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-neutral-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="font-heading font-semibold text-lg text-indigo-900">
                                Content Growth
                            </h2>
                            <p className="text-neutral-400 text-sm mt-0.5">
                                Content growth in the last 6 months
                            </p>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-indigo-500" />
                                <span className="text-neutral-500">Destinations</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-green-500" />
                                <span className="text-neutral-500">Events</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-amber-500" />
                                <span className="text-neutral-500">Articles</span>
                            </div>
                        </div>
                    </div>
                    <ContentStatsChart data={chartData} />
                </div>

                {/* Activity Log */}
                <div className="bg-white rounded-xl border border-neutral-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-heading font-semibold text-lg text-indigo-900">
                            Recent Activity
                        </h2>
                        <Link href="/admin/activity" className="text-sm text-indigo-600 hover:text-indigo-700 transition">
                            View all
                        </Link>
                    </div>
                    <ActivityLogList activities={formattedActivities} />
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-neutral-100 p-6">
                    <h2 className="font-heading font-semibold text-lg text-indigo-900 mb-4">
                        Quick Actions
                    </h2>
                    <div className="grid grid-cols-2 gap-3">
                        <Link
                            href="/admin/destinations/new"
                            className="flex items-center gap-3 p-4 rounded-lg border border-neutral-100 hover:border-indigo-600 hover:bg-indigo-50 transition"
                        >
                            <MapPin className="w-5 h-5 text-neutral-400" />
                            <span className="text-sm font-medium text-indigo-900">Add Destination</span>
                        </Link>
                        <Link
                            href="/admin/events/new"
                            className="flex items-center gap-3 p-4 rounded-lg border border-neutral-100 hover:border-indigo-600 hover:bg-indigo-50 transition"
                        >
                            <Calendar className="w-5 h-5 text-neutral-400" />
                            <span className="text-sm font-medium text-indigo-900">Add Event</span>
                        </Link>
                        <Link
                            href="/admin/articles/new"
                            className="flex items-center gap-3 p-4 rounded-lg border border-neutral-100 hover:border-indigo-600 hover:bg-indigo-50 transition"
                        >
                            <FileText className="w-5 h-5 text-neutral-400" />
                            <span className="text-sm font-medium text-indigo-900">Add Article</span>
                        </Link>
                        <Link
                            href="/admin/hero-slides/new"
                            className="flex items-center gap-3 p-4 rounded-lg border border-neutral-100 hover:border-indigo-600 hover:bg-indigo-50 transition"
                        >
                            <Image className="w-5 h-5 text-neutral-400" />
                            <span className="text-sm font-medium text-indigo-900">Add Hero Slide</span>
                        </Link>
                    </div>
                </div>

                {/* View Website Link */}
                <div className="bg-indigo-600 rounded-xl p-6 flex items-center justify-between">
                    <div>
                        <h3 className="text-white font-semibold text-lg">Preview Website</h3>
                        <p className="text-white/70 text-sm mt-1">
                            See how your changes look on the live website
                        </p>
                    </div>
                    <a
                        href="/"
                        target="_blank"
                        className="flex items-center gap-2 bg-white text-indigo-900 px-4 py-2.5 rounded-lg font-medium text-sm hover:bg-neutral-100 transition"
                    >
                        <Eye className="w-4 h-4" />
                        View Website
                    </a>
                </div>
            </div>
        </div>
    );
}
