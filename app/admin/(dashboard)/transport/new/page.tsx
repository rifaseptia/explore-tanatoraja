'use client';

import TransportForm from '@/components/admin/transport-form';

export default function NewTransportPage() {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-2">
                    <span>Admin</span>
                    <span>/</span>
                    <span>Transport</span>
                    <span>/</span>
                    <span className="text-primary font-medium">New</span>
                </nav>
            </div>

            <TransportForm />
        </div>
    );
}
