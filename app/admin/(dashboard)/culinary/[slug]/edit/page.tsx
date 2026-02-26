import dbConnect from '@/lib/mongodb';
import Culinary from '@/models/Culinary';
import CulinaryForm from '@/components/admin/culinary-form';
import { notFound } from 'next/navigation';

interface Props {
    params: Promise<{ slug: string }>;
}

export default async function EditCulinaryPage({ params }: Props) {
    const { slug } = await params;

    await dbConnect();
    const rawItem = await Culinary.findOne({ slug }).lean();

    if (!rawItem) {
        notFound();
    }

    const item = JSON.parse(JSON.stringify(rawItem));

    return (
        <div className="max-w-7xl mx-auto">
            <CulinaryForm initialData={item} isEdit />
        </div>
    );
}
