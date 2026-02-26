import { notFound } from 'next/navigation';
import dbConnect from '@/lib/mongodb';
import AccommodationModel from '@/models/Accommodation';
import AccommodationForm from '@/components/admin/accommodation-form';

interface Props {
    params: Promise<{ slug: string }>;
}

export default async function EditAccommodationPage({ params }: Props) {
    const { slug } = await params;
    await dbConnect();

    const accommodation = await AccommodationModel.findOne({ slug }).lean();

    if (!accommodation) {
        notFound();
    }

    const simpleAccommodation = {
        ...accommodation,
        _id: accommodation._id.toString(),
        createdAt: accommodation.createdAt?.toISOString(),
        updatedAt: accommodation.updatedAt?.toISOString(),
    };

    return (
        <AccommodationForm
            initialData={simpleAccommodation}
            isEditing
        />
    );
}
