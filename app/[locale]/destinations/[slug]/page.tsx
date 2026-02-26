import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { MapPin, ArrowLeft, ChevronDown, Clock, Ticket, Landmark, Trees, UtensilsCrossed, Mountain, Star, Camera, Instagram } from 'lucide-react';
import Link from 'next/link';
import ShareButton from '@/components/shared/share-button';
import MapWrapper from '@/components/shared/map-wrapper';

import dbConnect from '@/lib/mongodb';
import DestinationModel from '@/models/Destination';
import { Destination } from '@/types/destination';

// JSON-LD for SEO
function generateJsonLd(destination: Destination, locale: string) {
    const title = locale === 'id' ? destination.title.id : destination.title.en;
    const description = locale === 'id' ? destination.description.id : destination.description.en;
    return {
        '@context': 'https://schema.org',
        '@type': 'TouristAttraction',
        name: title,
        description: description,
        image: destination.featuredImage,
    };
}

// Removed serializeDocument import to be self-contained
export const revalidate = 0;

async function getDestination(slug: string): Promise<Destination | null> {
    await dbConnect();
    const destination = await DestinationModel.findOne({ slug, isPublished: true }).lean();
    if (!destination) return null;

    // Manual serialization to be absolutely safe
    // Doing JSON parse/stringify locally to ensure it works
    const serialized = JSON.parse(JSON.stringify(destination)) as Destination;

    // Ensure all _id fields are strings (especially in arrays)
    if (serialized && serialized.faqs) {
        serialized.faqs = serialized.faqs.map((faq: any) => ({
            ...faq,
            _id: faq._id ? String(faq._id) : undefined,
            question: { ...faq.question, _id: undefined },
            answer: { ...faq.answer, _id: undefined }
        }));
    }

    return serialized;
}

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props) {
    const { locale, slug } = await params;
    const destination = await getDestination(slug);
    if (!destination) return {};
    const title = locale === 'id' ? destination.title.id : destination.title.en;
    return {
        title: `${title} | Explore Tana Toraja`,
        openGraph: { images: [destination.featuredImage] },
    };
}

const categoryColors: Record<string, string> = {
    cultural: 'bg-amber-500 text-white',
    nature: 'bg-emerald-500 text-white',
    culinary: 'bg-orange-500 text-white',
    adventure: 'bg-blue-500 text-white',
};

const categoryLabels: Record<string, Record<string, string>> = {
    cultural: { id: 'Budaya', en: 'Cultural' },
    nature: { id: 'Alam', en: 'Nature' },
    culinary: { id: 'Kuliner', en: 'Culinary' },
    adventure: { id: 'Petualangan', en: 'Adventure' },
};

const categoryIcons: Record<string, React.ReactNode> = {
    cultural: <Landmark size={14} />,
    nature: <Trees size={14} />,
    culinary: <UtensilsCrossed size={14} />,
    adventure: <Mountain size={14} />,
};

export default async function DestinationDetailPage({ params }: Props) {
    const { locale, slug } = await params;
    setRequestLocale(locale);
    const destination = await getDestination(slug);
    if (!destination) notFound();

    const jsonLd = generateJsonLd(destination, locale);
    const lang = locale as 'id' | 'en';
    const title = destination.title[lang];
    const description = destination.description[lang];
    const address = destination.location?.address?.[lang];

    const getImageSrc = (src: string | undefined) => {
        if (!src) return '';
        if (src.startsWith('/uploads/')) return `/api${src}`;
        return src;
    };

    const l = {
        back: lang === 'id' ? 'Kembali ke Destinations' : 'Back to Destinations',
        about: lang === 'id' ? 'Tentang Destinasi Ini' : 'About This Destination',
        info: lang === 'id' ? 'Informasi Praktis' : 'Practical Information',
        address: lang === 'id' ? 'Alamat' : 'Address',
        hours: lang === 'id' ? 'Jam Operasional' : 'Operating Hours',
        fee: lang === 'id' ? 'Harga Tiket' : 'Entrance Fee',
        feeLocal: lang === 'id' ? 'Wisatawan Lokal' : 'Domestic',
        feeForeign: lang === 'id' ? 'Wisatawan Asing' : 'International',
        free: lang === 'id' ? 'Gratis' : 'Free',
        contactMgmt: lang === 'id' ? 'Hubungi pengelola' : 'Contact management',
        gallery: lang === 'id' ? 'Galeri Foto' : 'Photo Gallery',
        instagram: lang === 'id' ? 'Lihat di Instagram' : 'See on Instagram',
        faq: lang === 'id' ? 'Pertanyaan Umum' : 'FAQ',
        locationMap: lang === 'id' ? 'Lokasi di Peta' : 'Location on Map',
        openMaps: lang === 'id' ? 'Buka di Google Maps' : 'Open in Google Maps',
        facilities: lang === 'id' ? 'Fasilitas' : 'Facilities',
    };

    // FAQ data
    // FAQ data - Dynamic with fallback to empty structure to prevent errors
    // If destination.faqs exists, map it. Otherwise empty array.
    const faqs = destination.faqs?.map(faq => ({
        q: faq.question[lang],
        a: faq.answer[lang]
    })) || [];

    return (
        <article className="min-h-screen bg-white pb-20 pt-24 md:pt-32">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            {/* 1. Header Section (Clean White) */}
            <div className="max-w-4xl mx-auto px-[38px] text-center mb-12">
                {/* Breadcrumbs */}
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-4 font-medium uppercase tracking-wider">
                    <Link href="/destinations" className="hover:text-[#A78BFA] transition-colors">Destinations</Link>
                    <span>/</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${categoryColors[destination.category] || 'bg-gray-500 text-white'}`}>
                        {categoryIcons[destination.category]}
                        {categoryLabels[destination.category]?.[lang] || destination.category}
                    </span>
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-4 leading-tight">
                    {title}
                </h1>

                {/* Meta */}
                <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-400 border-t border-b border-gray-100 py-3 mx-auto max-w-2xl">
                    {address && (
                        <div className="flex items-center gap-1.5">
                            <MapPin size={14} className="text-[#A78BFA]" />
                            <span>{address}</span>
                        </div>
                    )}
                    {destination.isFeatured && (
                        <>
                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                            <div className="flex items-center gap-1.5 text-yellow-500">
                                <Star size={14} className="fill-yellow-400" />
                                <span className="font-medium">{lang === 'id' ? 'Unggulan' : 'Featured'}</span>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* 2. Hero Image */}
            <div className="max-w-5xl mx-auto px-[38px] mb-16">
                <div className="rounded-3xl overflow-hidden shadow-2xl bg-gray-100 aspect-[16/9] relative">
                    {destination.featuredImage ? (
                        <img
                            src={getImageSrc(destination.featuredImage)}
                            alt={title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#A78BFA] to-[#8B5CF6]" />
                    )}

                    {/* Share Button */}
                    <div className="absolute top-6 right-6">
                        <ShareButton title={title} text={description?.substring(0, 100)} />
                    </div>
                </div>
            </div>

            {/* 3. Main Content (Article Style) */}
            <div className="max-w-3xl mx-auto px-[38px] space-y-16">

                {/* About */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        {categoryIcons[destination.category]}
                        {l.about}
                    </h2>
                    <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed font-body whitespace-pre-line text-justify">
                        {description}
                    </div>

                    {/* Tags */}
                    {destination.tags && destination.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-8">
                            {destination.tags.map((tag, idx) => (
                                <span key={idx} className="text-[#A78BFA] bg-violet-50 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-violet-100 transition-colors cursor-pointer">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </section>

                {/* Practical Info — info card style */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Ticket size={22} className="text-[#A78BFA]" />
                        {l.info}
                    </h2>

                    <div className="space-y-3">
                        {/* Address */}
                        {address && (
                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-violet-200 hover:bg-violet-50/50 transition-colors">
                                <div className="w-10 h-10 rounded-full bg-violet-100 text-[#A78BFA] flex items-center justify-center flex-shrink-0">
                                    <MapPin size={18} />
                                </div>
                                <div>
                                    <span className="block text-sm font-bold text-gray-900 mb-0.5">{l.address}</span>
                                    <span className="text-gray-600 font-medium">{address}</span>
                                </div>
                            </div>
                        )}

                        {/* Operating Hours */}
                        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-violet-200 hover:bg-violet-50/50 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-violet-100 text-[#A78BFA] flex items-center justify-center flex-shrink-0">
                                <Clock size={18} />
                            </div>
                            <div>
                                <span className="block text-sm font-bold text-gray-900 mb-0.5">{l.hours}</span>
                                <span className="text-gray-600 font-medium">
                                    {destination.openingHours
                                        ? destination.openingHours[lang]
                                        : l.contactMgmt}
                                </span>
                            </div>
                        </div>

                        {/* Entrance Fee */}
                        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-violet-200 hover:bg-violet-50/50 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                                <Ticket size={18} />
                            </div>
                            <div>
                                <span className="block text-sm font-bold text-gray-900 mb-1">{l.fee}</span>
                                {destination.entranceFee ? (
                                    <div className="space-y-1">
                                        <p className="text-gray-600 font-medium">
                                            {l.feeLocal}: <span className="text-[#A78BFA] font-bold">IDR {destination.entranceFee.local.toLocaleString()}</span>
                                        </p>
                                        <p className="text-gray-600 font-medium">
                                            {l.feeForeign}: <span className="text-[#A78BFA] font-bold">IDR {destination.entranceFee.foreign.toLocaleString()}</span>
                                        </p>
                                        {destination.entranceFee.note && (
                                            <p className="text-sm text-gray-400 italic">{destination.entranceFee.note[lang]}</p>
                                        )}
                                    </div>
                                ) : (
                                    <span className="text-emerald-600 font-bold">{l.free}</span>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Facilities */}
                {destination.facilities && destination.facilities.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Star size={22} className="text-[#A78BFA]" />
                            {l.facilities}
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {destination.facilities.map((facility, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-violet-200 hover:bg-violet-50/50 transition-colors">
                                    <span className="text-xl">{facility.icon}</span>
                                    <span className="text-sm font-medium text-gray-700">{facility.name[lang]}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Gallery */}
                {destination.gallery && destination.gallery.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Camera size={22} className="text-[#A78BFA]" />
                            {l.gallery}
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {destination.gallery.map((img, index) => (
                                <div
                                    key={index}
                                    className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer"
                                >
                                    <img
                                        src={getImageSrc(img)}
                                        alt={`${title} gallery ${index + 1}`}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Instagram */}
                {destination.instagramLinks && destination.instagramLinks.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Instagram size={22} className="text-[#A78BFA]" />
                            {l.instagram}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {destination.instagramLinks.map((url, index) => {
                                const embedUrl = url.endsWith('/')
                                    ? `${url}embed`
                                    : `${url}/embed`;
                                return (
                                    <div
                                        key={index}
                                        className="w-full rounded-2xl overflow-hidden shadow-lg border border-gray-100 bg-white"
                                        style={{ height: '350px' }}
                                    >
                                        <iframe
                                            src={embedUrl}
                                            className="w-full h-full"
                                            frameBorder="0"
                                            scrolling="no"
                                            title={`Instagram post ${index + 1}`}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* FAQ */}
                {faqs.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <ChevronDown size={22} className="text-[#A78BFA]" />
                            {l.faq}
                        </h2>
                        <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden">
                            {faqs.map((faq, idx) => (
                                <details key={idx} className="group">
                                    <summary className="flex justify-between items-center cursor-pointer list-none p-4 hover:bg-violet-50/50 transition-colors">
                                        <span className="font-medium text-gray-700 group-hover:text-[#A78BFA] transition-colors pr-4">
                                            {faq.q}
                                        </span>
                                        <ChevronDown size={18} className="text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0" />
                                    </summary>
                                    <p className="px-4 pb-4 text-gray-500 text-sm leading-relaxed">
                                        {faq.a}
                                    </p>
                                </details>
                            ))}
                        </div>
                    </section>
                )}

                {/* Location Map */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <MapPin size={22} className="text-[#A78BFA]" />
                        {l.locationMap}
                    </h2>
                    {destination.location?.coordinates ? (
                        <MapWrapper
                            coordinates={[destination.location.coordinates[1], destination.location.coordinates[0]]}
                            title={title}
                        />
                    ) : (
                        <div className="relative w-full h-[250px] rounded-2xl overflow-hidden bg-gray-50 border border-gray-200 flex flex-col items-center justify-center text-gray-400 gap-3">
                            <MapPin size={40} className="opacity-20" />
                            <p className="text-sm opacity-60">{address || 'Tana Toraja'}</p>
                        </div>
                    )}
                    <div className="mt-4 text-center">
                        <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((address || title) + ' Tana Toraja')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-50 hover:bg-violet-50 text-gray-700 hover:text-[#A78BFA] font-bold rounded-xl transition-colors border border-gray-200 hover:border-violet-200"
                        >
                            <MapPin size={16} />
                            {l.openMaps}
                        </a>
                    </div>
                </section>

                {/* Back Link */}
                <div className="pt-12 border-t border-gray-100 text-center">
                    <Link href="/destinations" className="inline-flex items-center gap-2 text-[#A78BFA] font-bold hover:underline">
                        <ArrowLeft size={16} />
                        {l.back}
                    </Link>
                </div>

            </div>
        </article>
    );
}
