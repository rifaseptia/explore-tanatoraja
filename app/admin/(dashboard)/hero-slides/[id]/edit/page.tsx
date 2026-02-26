import dbConnect from '@/lib/mongodb';
import HeroSlide from '@/models/HeroSlide';
import HeroSlideForm from '@/components/admin/hero-slide-form';
import mongoose from 'mongoose';

const PAGE_LABELS: Record<string, string> = {
    home: 'Homepage',
    destinations: 'Destinations',
    culinary: 'Culinary',
    events: 'Events',
    stay: 'Accommodation',
    transport: 'Transport',
};

async function getSlideById(id: string) {
    await dbConnect();
    const slide = await HeroSlide.findById(id).lean();
    if (!slide) return null;
    return {
        ...slide,
        _id: slide._id.toString(),
        createdAt: slide.createdAt?.toISOString(),
        updatedAt: slide.updatedAt?.toISOString(),
    };
}

async function getOrCreateByPage(page: string) {
    await dbConnect();
    const slide = await HeroSlide.findOne({ page }).lean();

    if (!slide) {
        return {
            _id: undefined,
            title: { id: '', en: '' },
            subtitle: { id: '', en: '' },
            image: '',
            ctaText: { id: 'Mulai Jelajah', en: 'Start Exploring' },
            ctaLink: '#',
            page,
            order: 0,
            isActive: true,
        };
    }

    return {
        ...slide,
        _id: slide._id.toString(),
        createdAt: slide.createdAt?.toISOString(),
        updatedAt: slide.updatedAt?.toISOString(),
    };
}

export default async function EditHeroSlidePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    // Determine if this is a MongoDB ObjectId or a page name
    const isObjectId = mongoose.Types.ObjectId.isValid(id) && id.length === 24;

    let pageName: string;
    let pageLabel: string;
    let isEdit: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let slide: any;

    if (isObjectId) {
        // Editing a specific slide by ObjectId (homepage slides)
        const found = await getSlideById(id);
        if (!found) {
            const { notFound } = await import('next/navigation');
            notFound();
        }
        pageName = found!.page || 'home';
        pageLabel = PAGE_LABELS[pageName] || pageName;
        slide = found;
        isEdit = true;
    } else {
        // Editing/creating by page name (single-hero pages)
        pageName = id;
        pageLabel = PAGE_LABELS[pageName] || pageName;
        slide = await getOrCreateByPage(pageName);
        isEdit = !!slide._id;
    }

    const backUrl = pageName === 'home' ? '/admin/hero-slides/home/manage' : '/admin/hero-slides';

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-2">
                    <span>Admin</span>
                    <span>/</span>
                    <span>Hero Slides</span>
                    <span>/</span>
                    <span className="text-indigo-600 font-medium">{pageLabel}</span>
                </nav>
            </div>

            <HeroSlideForm
                initialData={slide as any}
                isEdit={isEdit}
                pageName={pageName}
                pageLabel={pageLabel}
                backUrl={backUrl}
            />
        </div>
    );
}
