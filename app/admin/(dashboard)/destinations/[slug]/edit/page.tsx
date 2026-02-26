import { notFound } from 'next/navigation';
import dbConnect from '@/lib/mongodb';
import Destination from '@/models/Destination';
import DestinationForm from '@/components/admin/destination-form';

type Props = {
    params: Promise<{ slug: string }>;
};

async function getDestination(slug: string) {
    await dbConnect();
    const destination = await Destination.findOne({ slug }).lean();
    return destination;
}

export const dynamic = 'force-dynamic';

export default async function EditDestinationPage({ params }: Props) {
    const { slug } = await params;
    const destination = await getDestination(slug);



    if (!destination) {
        notFound();
    }

    // Convert MongoDB document to plain object
    const initialData = {
        title: destination.title,
        slug: destination.slug,
        description: destination.description,
        excerpt: destination.excerpt || { id: '', en: '' },
        featuredImage: destination.featuredImage,
        gallery: destination.gallery || [],
        category: destination.category,
        tags: destination.tags || [],
        location: {
            coordinates: destination.location?.coordinates || [119.8654, -3.0747],
            address: destination.location?.address || { id: '', en: '' },
        },
        openingHours: destination.openingHours || { id: '', en: '' },
        entranceFee: destination.entranceFee || { local: 0, foreign: 0 },
        rating: destination.rating || 0,
        isFeatured: destination.isFeatured || false,
        isPublished: destination.isPublished || false,
        instagramLinks: destination.instagramLinks || [],
        faqs: destination.faqs || [],
    };

    return (
        <div className="max-w-7xl mx-auto">


            <DestinationForm initialData={initialData} isEditing />
        </div>
    );
}
