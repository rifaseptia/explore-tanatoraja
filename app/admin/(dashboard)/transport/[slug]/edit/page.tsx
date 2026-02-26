import { notFound } from 'next/navigation';
import dbConnect from '@/lib/mongodb';
import Transport from '@/models/Transport';
import TransportForm from '@/components/admin/transport-form';

async function getTransport(slug: string) {
    await dbConnect();
    const transport = await Transport.findOne({ slug }).lean();
    if (!transport) return null;

    return {
        ...transport,
        _id: transport._id.toString(),
        createdAt: transport.createdAt?.toISOString(),
        updatedAt: transport.updatedAt?.toISOString(),
        // Ensure arrays and optional fields exist
        routes: transport.routes || [],
        tips: transport.tips || [],
        story: transport.story || { id: '', en: '' },
        duration: transport.duration || '',
        priceRange: transport.priceRange || '',
        image: transport.image || '',
    };
}

export default async function EditTransportPage({
    params
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params;
    const transport = await getTransport(slug);

    if (!transport) {
        notFound();
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-2">
                    <span>Admin</span>
                    <span>/</span>
                    <span>Transport</span>
                    <span>/</span>
                    <span className="text-primary font-medium">Edit</span>
                </nav>
            </div>

            <TransportForm initialData={transport} isEdit />
        </div>
    );
}
