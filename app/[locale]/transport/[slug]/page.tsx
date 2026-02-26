
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock, Banknote, MapPin, Info, ArrowRight } from 'lucide-react';
import { setRequestLocale } from 'next-intl/server';
import dbConnect from '@/lib/mongodb';
import TransportModel from '@/models/Transport';
import { TransportItem } from '@/types/transport';
import { Suspense } from 'react';

interface Props {
    params: Promise<{
        locale: string;
        slug: string;
    }>;
}

async function getTransportOption(slug: string) {
    await dbConnect();
    const item = await TransportModel.findOne({ slug, isPublished: true }).lean();
    if (!item) return null;
    return {
        ...item,
        _id: item._id.toString(),
        createdAt: item.createdAt?.toISOString(),
        updatedAt: item.updatedAt?.toISOString(),
    } as TransportItem;
}

export async function generateMetadata({ params }: Props) {
    const { slug, locale } = await params;
    const item = await getTransportOption(slug);
    if (!item) return { title: 'Not Found' };

    return {
        title: `${item.title[locale as 'id' | 'en']} | Explore Tana Toraja`,
        description: item.description[locale as 'id' | 'en'],
    };
}

export default async function TransportDetailPage({ params }: Props) {
    const { slug, locale } = await params;
    setRequestLocale(locale);

    const item = await getTransportOption(slug);
    const lang = locale as 'id' | 'en';

    if (!item) {
        notFound();
    }

    const categoryLabels: Record<string, string> = {
        flight: lang === 'id' ? 'Penerbangan' : 'Flight',
        bus: 'Bus / Travel',
        rental: lang === 'id' ? 'Sewa / Tur' : 'Rental / Tour',
        local: lang === 'id' ? 'Transportasi Lokal' : 'Local Transport',
    };

    return (
        <article className="min-h-screen bg-white pb-20 pt-24 md:pt-32">
            {/* 1. Header Section */}
            <div className="max-w-4xl mx-auto px-[38px] text-center mb-12">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-4 font-medium uppercase tracking-wider">
                    <Link href="/transport" className="hover:text-primary transition-colors">
                        {lang === 'id' ? 'Transportasi' : 'Transport'}
                    </Link>
                    <span>/</span>
                    <span className="text-primary">{categoryLabels[item.category] || item.category}</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6 leading-tight">
                    {item.title[lang]}
                </h1>

                {/* Key Details Bar */}
                <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 border-t border-b border-gray-100 py-4 mx-auto max-w-2xl bg-gray-50/50 rounded-xl px-4">
                    {item.duration && (
                        <div className="flex items-center gap-2">
                            <Clock size={16} className="text-[#A78BFA]" />
                            <span className="font-medium">{item.duration}</span>
                        </div>
                    )}
                    {item.priceRange && (
                        <div className="flex items-center gap-2">
                            <Banknote size={16} className="text-[#A78BFA]" />
                            <span className="font-medium">{item.priceRange}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* 2. Hero Image */}
            <div className="max-w-5xl mx-auto px-[38px] mb-16">
                <div className="rounded-3xl overflow-hidden shadow-2xl bg-gray-100 aspect-[21/9] relative">
                    <img
                        src={item.image}
                        alt={item.title[lang]}
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            {/* 3. Main Content */}
            <div className="max-w-3xl mx-auto px-[38px] space-y-12">

                {/* Description / Story */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        {lang === 'id' ? 'Tentang Opsi Ini' : 'About This Option'}
                    </h2>
                    <div className="prose prose-lg text-gray-600 leading-relaxed font-body text-justify">
                        <p>{item.story ? item.story[lang] : item.description[lang]}</p>
                    </div>
                </section>

                {/* Routes */}
                {item.routes && item.routes.length > 0 && (
                    <section className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <MapPin className="text-[#A78BFA]" />
                            {lang === 'id' ? 'Rute & Jadwal' : 'Routes & Schedule'}
                        </h3>
                        <div className="grid gap-3">
                            {item.routes.map((route, idx) => (
                                <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                    <ArrowRight size={18} className="mt-1 text-gray-400 flex-shrink-0" />
                                    <span className="text-gray-700 font-medium">{route[lang]}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Tips */}
                {item.tips && item.tips.length > 0 && (
                    <section className="bg-indigo-50/50 rounded-2xl border border-indigo-100 p-6">
                        <h3 className="text-xl font-bold text-indigo-900 mb-4 flex items-center gap-2">
                            <Info className="text-indigo-600" />
                            {lang === 'id' ? 'Tips Perjalanan' : 'Travel Tips'}
                        </h3>
                        <ul className="space-y-3">
                            {item.tips.map((tip, idx) => (
                                <li key={idx} className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2.5 flex-shrink-0" />
                                    <span className="text-gray-700">{tip[lang]}</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* Back Link */}
                <div className="pt-12 border-t border-gray-100 text-center">
                    <Link href="/transport" className="inline-flex items-center gap-2 text-primary font-bold hover:underline">
                        <ArrowLeft size={16} />
                        {lang === 'id' ? 'Kembali ke Transportasi' : 'Back to Transport'}
                    </Link>
                </div>

            </div>
        </article>
    );
}
