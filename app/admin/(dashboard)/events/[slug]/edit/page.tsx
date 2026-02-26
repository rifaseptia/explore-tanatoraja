import { notFound } from 'next/navigation';
import dbConnect from '@/lib/mongodb';
import Event from '@/models/Event';
import EventForm from '@/components/admin/event-form';

type Props = {
    params: Promise<{ slug: string }>;
};

async function getEvent(slug: string) {
    await dbConnect();
    const event = await Event.findOne({ slug }).lean();
    return event;
}

export default async function EditEventPage({ params }: Props) {
    const { slug } = await params;
    const event = await getEvent(slug);

    if (!event) {
        notFound();
    }

    // Convert MongoDB document to plain object with proper date formatting
    const initialData = {
        title: event.title,
        slug: event.slug,
        description: event.description,
        excerpt: event.excerpt || { id: '', en: '' },
        image: event.image,
        category: event.category,
        startDate: event.startDate ? new Date(event.startDate).toISOString().split('T')[0] : '',
        endDate: event.endDate ? new Date(event.endDate).toISOString().split('T')[0] : '',
        location: event.location || { id: '', en: '' },
        isRambuSolo: event.isRambuSolo || false,
        schedule: event.schedule || { id: '', en: '' },
        duration: event.duration || { id: '', en: '' },
        isFeatured: event.isFeatured || false,
        isPublished: event.isPublished || false,
    };

    return (
        <div className="max-w-7xl mx-auto">
            <EventForm initialData={initialData} isEditing />
        </div>
    );
}
