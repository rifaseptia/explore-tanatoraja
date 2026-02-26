import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import AdminSidebar from '@/components/admin/sidebar';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production';

async function getAdmin() {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token) {
        return null;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as {
            id: string;
            email: string;
            role: string;
            name: string;
        };
        return decoded;
    } catch {
        return null;
    }
}

export default async function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const admin = await getAdmin();

    if (!admin) {
        redirect('/admin/login');
    }

    return (
        <div className="min-h-screen bg-neutral-50 flex">
            <AdminSidebar admin={admin} />
            <main className="flex-1 overflow-auto">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
