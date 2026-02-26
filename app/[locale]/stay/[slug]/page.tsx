import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, MapPin, Star, Phone, Clock, Wifi, Coffee, Car, Waves, Utensils, TreePine, Mountain, Sparkles, Info } from 'lucide-react';
import { setRequestLocale } from 'next-intl/server';
import dbConnect from '@/lib/mongodb';
import AccommodationModel from '@/models/Accommodation';
import { Accommodation } from '@/types/accommodation';

interface Props {
    params: Promise<{
        locale: string;
        slug: string;
    }>;
}

const amenityIcons: Record<string, any> = {
    'WiFi': Wifi,
    'Pool': Waves,
    'Breakfast': Coffee,
    'Restaurant': Utensils,
    'Parking': Car,
    'Garden': TreePine,
    'Mountain View': Mountain,
    'Spa': Sparkles,
};

async function getAccommodation(slug: string) {
    await dbConnect();
    const item = await AccommodationModel.findOne({ slug, isPublished: true }).lean();
    if (!item) return null;
    return {
        ...item,
        _id: item._id.toString(),
        createdAt: item.createdAt?.toISOString(),
        updatedAt: item.updatedAt?.toISOString(),
    } as Accommodation;
}

export async function generateMetadata({ params }: Props) {
    const { slug, locale } = await params;
    const item = await getAccommodation(slug);
    if (!item) return { title: 'Accommodation Not Found' };

    return {
        title: `${item.title[locale as 'id' | 'en']} | Explore Tana Toraja`,
        description: item.description[locale as 'id' | 'en'],
    };
}

export default async function StayDetailPage({ params }: Props) {
    const { slug, locale } = await params;
    setRequestLocale(locale);

    const item = await getAccommodation(slug);
    const lang = locale as 'id' | 'en';

    if (!item) {
        notFound();
    }

    const categoryLabel = item.category.charAt(0).toUpperCase() + item.category.slice(1);

    return (
        <article className="min-h-screen bg-white pb-20 pt-24 md:pt-32">
            {/* 1. Header Section (Clean White) */}
            <div className="max-w-4xl mx-auto px-[38px] text-center mb-12">
                {/* Breadcrumbs */}
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-4 font-medium uppercase tracking-wider">
                    <Link href="/stay" className="hover:text-primary transition-colors">
                        {lang === 'id' ? 'Penginapan' : 'Stay'}
                    </Link>
                    <span>/</span>
                    <span className="text-primary">{categoryLabel}</span>
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-4 leading-tight">
                    {item.title[lang]}
                </h1>

                {/* Rating & Info Bar */}
                <div className="flex items-center justify-center gap-6 text-sm text-gray-400 border-t border-b border-gray-100 py-3 mx-auto max-w-lg">
                    {/* Rating Stars */}
                    {item.rating && (
                        <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={14}
                                    className={i < item.rating! ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}
                                />
                            ))}
                        </div>
                    )}
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    <span className="font-bold text-primary text-base">{item.priceRange}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    <div className="flex items-center gap-1 text-gray-500">
                        <MapPin size={14} />
                        <span>{item.address.split(',').pop()?.trim()}</span>
                    </div>
                </div>
            </div>

            {/* 2. Hero Image */}
            <div className="max-w-5xl mx-auto px-[38px] mb-16">
                <div className="rounded-3xl overflow-hidden shadow-2xl bg-gray-100 aspect-[16/9] relative">
                    <img
                        src={item.image}
                        alt={item.title[lang]}
                        className="w-full h-full object-cover"
                    />
                    {/* Category Badge */}
                    <div className="absolute top-6 left-6 px-4 py-2 bg-white/90 backdrop-blur text-gray-800 rounded-full font-bold shadow-lg text-sm uppercase tracking-wider">
                        {categoryLabel}
                    </div>
                </div>
            </div>

            {/* 3. Main Content */}
            <div className="max-w-3xl mx-auto px-[38px] space-y-16">

                {/* Description / Story */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        {lang === 'id' ? 'Tentang Penginapan Ini' : 'About This Accommodation'}
                    </h2>
                    <div className="prose prose-lg text-gray-600 leading-relaxed font-body text-justify">
                        <p>{item.story ? item.story[lang] : item.description[lang]}</p>
                    </div>
                </section>

                {/* Amenities Grid */}
                {item.amenities && item.amenities.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            {lang === 'id' ? 'Fasilitas' : 'Amenities'}
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {item.amenities.map((amenity) => {
                                const IconComp = amenityIcons[amenity] || Info;
                                return (
                                    <div
                                        key={amenity}
                                        className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-violet-200 hover:bg-violet-50/50 transition-colors"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center flex-shrink-0">
                                            <IconComp size={18} />
                                        </div>
                                        <span className="font-medium text-gray-700">{amenity}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* Contact & Location Info Box */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        {lang === 'id' ? 'Informasi & Kontak' : 'Info & Contact'}
                    </h2>
                    <div className="bg-gray-50 rounded-xl p-8 border border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Address */}
                            <div className="flex gap-4">
                                <div className="w-6 flex-shrink-0 text-gray-400 mt-1">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <span className="block text-sm font-bold text-gray-900 uppercase mb-1">
                                        {lang === 'id' ? 'Alamat' : 'Address'}
                                    </span>
                                    <span className="text-gray-600">{item.address}</span>
                                    {item.mapUrl && (
                                        <a href={item.mapUrl} className="text-primary text-sm font-bold mt-1 inline-block hover:underline">
                                            View Map &rarr;
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Price */}
                            <div className="flex gap-4">
                                <div className="w-6 flex-shrink-0 text-gray-400 mt-1">
                                    <Info size={20} />
                                </div>
                                <div>
                                    <span className="block text-sm font-bold text-gray-900 uppercase mb-1">
                                        {lang === 'id' ? 'Kisaran Harga / Malam' : 'Price Range / Night'}
                                    </span>
                                    <span className="text-gray-600 font-semibold">{item.priceRange}</span>
                                </div>
                            </div>

                            {/* Phone */}
                            {item.phone && (
                                <div className="flex gap-4">
                                    <div className="w-6 flex-shrink-0 text-gray-400 mt-1">
                                        <Phone size={20} />
                                    </div>
                                    <div>
                                        <span className="block text-sm font-bold text-gray-900 uppercase mb-1">Tel</span>
                                        <span className="text-gray-600">{item.phone}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Back Link */}
                <div className="pt-12 border-t border-gray-100 text-center">
                    <Link href="/stay" className="inline-flex items-center gap-2 text-primary font-bold hover:underline">
                        <ArrowLeft size={16} />
                        {lang === 'id' ? 'Kembali ke Daftar Penginapan' : 'Back to Accommodations'}
                    </Link>
                </div>

            </div>
        </article>
    );
}
