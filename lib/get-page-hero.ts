import dbConnect from '@/lib/mongodb';
import HeroSlide from '@/models/HeroSlide';

export interface PageHeroData {
    title: { id: string; en: string };
    subtitle: { id: string; en: string };
    image: string;
    ctaText?: { id: string; en: string };
    ctaLink?: string;
}

/**
 * Fetch the active hero slide for a specific page.
 * Returns the first active slide found, or null.
 */
export async function getPageHero(page: string): Promise<PageHeroData | null> {
    try {
        await dbConnect();
        const slide = await HeroSlide.findOne({ page, isActive: true })
            .sort({ order: 1 })
            .lean();

        if (!slide) return null;

        return {
            title: slide.title,
            subtitle: slide.subtitle,
            image: slide.image,
            ctaText: slide.ctaText,
            ctaLink: slide.ctaLink,
        };
    } catch (error) {
        console.error(`Error fetching hero for page "${page}":`, error);
        return null;
    }
}
