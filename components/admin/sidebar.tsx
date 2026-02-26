'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    MapPin,
    Calendar,
    FileText,
    Image,
    Users,
    LogOut,
    ChevronLeft,
    ChevronRight,
    UtensilsCrossed,
    Home,
    Plane,
    Instagram
} from 'lucide-react';
import { useState } from 'react';

interface AdminSidebarProps {
    admin: {
        name: string;
        email: string;
        role: string;
    };
}

const menuItems = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/destinations', icon: MapPin, label: 'Destinations' },
    { href: '/admin/accommodations', icon: Home, label: 'Accommodations' },
    { href: '/admin/culinary', icon: UtensilsCrossed, label: 'Culinary' },
    { href: '/admin/events', icon: Calendar, label: 'Events' },
    { href: '/admin/transport', icon: Plane, label: 'Transport' },
    { href: '/admin/hero-slides', icon: Image, label: 'Hero Slides' },
    { href: '/admin/instagram', icon: Instagram, label: 'Instagram Feed' },
    { href: '/admin/users', icon: Users, label: 'Users' },
];

export default function AdminSidebar({ admin }: AdminSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [collapsed, setCollapsed] = useState(false);

    const handleLogout = async () => {
        await fetch('/api/admin/auth/logout', { method: 'POST' });
        router.push('/admin/login');
        router.refresh();
    };

    const isActive = (href: string) => {
        if (href === '/admin') {
            return pathname === '/admin';
        }
        return pathname.startsWith(href);
    };

    return (
        <aside
            className={`sticky top-0 h-screen bg-white border-r border-neutral-100 flex flex-col transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'
                }`}
        >
            {/* Logo */}
            <div className={`p-6 border-b border-neutral-100 ${collapsed ? 'px-4' : ''}`}>
                {collapsed ? (
                    <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">T</span>
                    </div>
                ) : (
                    <>
                        <h1 className="font-heading font-bold text-lg text-indigo-900">
                            Tana Toraja
                        </h1>
                        <p className="text-neutral-400 text-xs mt-0.5">Content Management</p>
                    </>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {menuItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${isActive(item.href)
                            ? 'bg-indigo-600 text-white'
                            : 'text-neutral-600 hover:bg-neutral-50 hover:text-indigo-900'
                            } ${collapsed ? 'justify-center' : ''}`}
                        title={collapsed ? item.label : undefined}
                    >
                        <item.icon className={`w-5 h-5 flex-shrink-0`} />
                        {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                    </Link>
                ))}
            </nav>

            {/* Collapse Toggle */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="mx-4 mb-2 p-2 rounded-lg text-neutral-400 hover:bg-neutral-50 hover:text-indigo-900 transition flex items-center justify-center"
            >
                {collapsed ? (
                    <ChevronRight className="w-5 h-5" />
                ) : (
                    <ChevronLeft className="w-5 h-5" />
                )}
            </button>

            {/* User info & Logout */}
            <div className={`p-4 border-t border-neutral-100 ${collapsed ? 'px-2' : ''}`}>
                {!collapsed && (
                    <div className="mb-3 px-2">
                        <p className="text-indigo-900 font-medium text-sm truncate">{admin.name}</p>
                        <p className="text-neutral-400 text-xs truncate">{admin.email}</p>
                    </div>
                )}
                <button
                    onClick={handleLogout}
                    className={`flex items-center gap-2 w-full px-3 py-2.5 text-neutral-500 hover:text-indigo-900 hover:bg-neutral-50 rounded-lg transition text-sm ${collapsed ? 'justify-center' : ''
                        }`}
                    title={collapsed ? 'Logout' : undefined}
                >
                    <LogOut className="w-5 h-5" />
                    {!collapsed && <span>Logout</span>}
                </button>
            </div>
        </aside>
    );
}
