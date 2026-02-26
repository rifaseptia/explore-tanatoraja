
import { setRequestLocale } from 'next-intl/server';

type Props = {
    params: Promise<{ locale: string }>;
};

export default async function GalleryPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <div className="min-h-screen bg-white pt-32 px-4 text-center">
            <h1 className="text-4xl font-bold text-dark mb-4">Gallery</h1>
            <p className="text-lg text-gray-600 mb-8">Capture the moments.</p>
            <p className="italic text-gray-400">Page under construction...</p>
        </div>
    );
}
