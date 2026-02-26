import dbConnect from '@/lib/mongodb';
import Culinary from '@/models/Culinary';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, MapPin, ChefHat, Coffee, Leaf, ShoppingBag, Clock, Phone, Flame, UtensilsCrossed, ExternalLink } from 'lucide-react';
import { setRequestLocale } from 'next-intl/server';

interface Props {
    params: Promise<{
        locale: string;
        slug: string;
    }>;
}

export async function generateStaticParams() {
    await dbConnect();
    const items = await Culinary.find({ isPublished: true }).select('slug').lean();
    return items.map((item) => ({
        slug: item.slug,
    }));
}

export async function generateMetadata({ params }: Props) {
    const { slug, locale } = await params;
    await dbConnect();
    const item = await Culinary.findOne({ slug }).lean();
    if (!item) return { title: 'Dish Not Found' };

    const lang = locale as 'id' | 'en';
    return {
        title: `${item.title[lang]} - Culinary Guide`,
        description: item.description[lang],
    };
}

const categoryColors: Record<string, string> = {
    'main-course': 'bg-orange-500 text-white',
    'snack': 'bg-emerald-500 text-white',
    'drink': 'bg-amber-600 text-white',
    'souvenir': 'bg-violet-500 text-white',
};

const categoryLabels: Record<string, Record<string, string>> = {
    'main-course': { id: 'Makanan Berat', en: 'Main Course' },
    'snack': { id: 'Kue & Snack', en: 'Snacks' },
    'drink': { id: 'Kopi & Minuman', en: 'Coffee & Drinks' },
    'souvenir': { id: 'Oleh-oleh', en: 'Souvenirs' },
};

const categoryIcons: Record<string, React.ReactNode> = {
    'main-course': <ChefHat size={16} />,
    'snack': <Leaf size={16} />,
    'drink': <Coffee size={16} />,
    'souvenir': <ShoppingBag size={16} />,
};

export default async function CulinaryDetailPage({ params }: Props) {
    const { slug, locale } = await params;
    setRequestLocale(locale);

    await dbConnect();
    const rawItem = await Culinary.findOne({ slug, isPublished: true }).lean();
    const lang = locale as 'id' | 'en';

    if (!rawItem) {
        notFound();
    }

    // Serialize for safe rendering
    const item = JSON.parse(JSON.stringify(rawItem));

    const l = {
        back: lang === 'id' ? 'Kembali ke Daftar Menu' : 'Back to Menu List',
        story: lang === 'id' ? 'Cerita & Asal Usul' : 'The Story & Origin',
        ingredients: lang === 'id' ? 'Bahan Utama' : 'Key Ingredients',
        whereToEat: lang === 'id' ? 'Rekomendasi Tempat Makan' : 'Where to Eat',
        address: lang === 'id' ? 'Alamat' : 'Address',
        hours: lang === 'id' ? 'Jam Buka' : 'Hours',
        spice: lang === 'id' ? 'Tingkat Pedas' : 'Spice Level',
        halal: 'Halal',
        notHalal: lang === 'id' ? 'Non-Halal' : 'Non-Halal',
        viewMap: lang === 'id' ? 'Lihat Peta' : 'View Map',
    };

    const spiceLabels: Record<number, string> = {
        1: lang === 'id' ? 'Tidak Pedas' : 'Not Spicy',
        2: lang === 'id' ? 'Pedas Sedang' : 'Medium Spicy',
        3: lang === 'id' ? 'Sangat Pedas' : 'Very Hot',
    };

    return (
        <article className="min-h-screen bg-white pb-20 pt-24 md:pt-32">

            {/* 1. Header Section (Clean White — matching events/transport) */}
            <div className="max-w-4xl mx-auto px-[38px] text-center mb-12">
                {/* Breadcrumbs */}
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-4 font-medium uppercase tracking-wider">
                    <Link href="/culinary" className="hover:text-[#A78BFA] transition-colors">Culinary</Link>
                    <span>/</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${categoryColors[item.category] || 'bg-gray-500 text-white'}`}>
                        {categoryIcons[item.category]}
                        {categoryLabels[item.category]?.[lang] || item.category}
                    </span>
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-4 leading-tight">
                    {item.title[lang]}
                </h1>

                {/* Meta badges */}
                <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-gray-400 border-t border-b border-gray-100 py-3 mx-auto max-w-lg">
                    {item.spiceLevel && (
                        <div className="flex items-center gap-1.5">
                            <Flame size={14} className="text-orange-400" />
                            <span>{spiceLabels[item.spiceLevel]}</span>
                        </div>
                    )}
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${item.isHalal ? 'bg-emerald-500' : 'bg-red-400'}`} />
                        <span>{item.isHalal ? l.halal : l.notHalal}</span>
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

                    {/* Spice Badge Overlay */}
                    {item.spiceLevel && item.spiceLevel > 1 && (
                        <div className="absolute top-6 right-6 bg-white/90 backdrop-blur text-orange-600 px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2">
                            <Flame size={16} />
                            {item.spiceLevel === 2 ? 'Spicy' : '🔥 Hot'}
                        </div>
                    )}

                    {/* Halal Badge */}
                    {item.isHalal && (
                        <div className="absolute bottom-6 left-6 bg-emerald-500/90 backdrop-blur text-white px-4 py-2 rounded-full font-bold shadow-lg text-sm">
                            ✓ Halal
                        </div>
                    )}
                </div>
            </div>

            {/* 3. Main Content (Article Style) */}
            <div className="max-w-3xl mx-auto px-[38px] space-y-16">

                {/* Story Section */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <UtensilsCrossed size={22} className="text-[#A78BFA]" />
                        {l.story}
                    </h2>
                    <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed font-body text-justify">
                        <p>{item.story ? item.story[lang] : item.description[lang]}</p>
                    </div>
                </section>

                {/* Ingredients — info card style */}
                {item.ingredients && (
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <ChefHat size={22} className="text-[#A78BFA]" />
                            {l.ingredients}
                        </h2>
                        <div className="space-y-3">
                            {item.ingredients[lang].map((ingredient: string, idx: number) => (
                                <div key={idx} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-violet-200 hover:bg-violet-50/50 transition-colors">
                                    <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0 font-bold text-sm">
                                        {idx + 1}
                                    </span>
                                    <span className="text-gray-700 font-medium pt-0.5">{ingredient}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Tags */}
                {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {item.tags.map((tag: string, idx: number) => (
                            <span key={idx} className="text-[#A78BFA] bg-violet-50 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-violet-100 transition-colors cursor-pointer">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Where to Eat — recommendation cards */}
                {item.recommendations && item.recommendations.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <MapPin size={22} className="text-[#A78BFA]" />
                            {l.whereToEat}
                        </h2>

                        <div className="space-y-6">
                            {item.recommendations.map((rec: { name: string; description?: { id: string; en: string }; address: string; hours: string; phone?: string; mapUrl: string; image?: string }, idx: number) => (
                                <div key={idx} className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden hover:border-violet-200 transition-colors">
                                    {/* Optional Image */}
                                    {rec.image && (
                                        <div className="h-48 overflow-hidden">
                                            <img src={rec.image} alt={rec.name} className="w-full h-full object-cover" />
                                        </div>
                                    )}

                                    <div className="p-6">
                                        {/* Spot Name */}
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                                <span className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                                                    {idx + 1}
                                                </span>
                                                {rec.name}
                                            </h3>
                                            <a
                                                href={rec.mapUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[#A78BFA] text-sm font-bold hover:underline flex items-center gap-1"
                                            >
                                                {l.viewMap}
                                                <ExternalLink size={12} />
                                            </a>
                                        </div>

                                        {/* Description */}
                                        {rec.description && (
                                            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                                                {rec.description[lang]}
                                            </p>
                                        )}

                                        {/* Info Row */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div className="flex items-center gap-3 text-sm text-gray-500">
                                                <MapPin size={14} className="text-[#A78BFA] flex-shrink-0" />
                                                <span>{rec.address}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-gray-500">
                                                <Clock size={14} className="text-[#A78BFA] flex-shrink-0" />
                                                <span>{rec.hours}</span>
                                            </div>
                                            {rec.phone && (
                                                <div className="flex items-center gap-3 text-sm text-gray-500">
                                                    <Phone size={14} className="text-[#A78BFA] flex-shrink-0" />
                                                    <span>{rec.phone}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Back Link */}
                <div className="pt-12 border-t border-gray-100 text-center">
                    <Link href="/culinary" className="inline-flex items-center gap-2 text-[#A78BFA] font-bold hover:underline">
                        <ArrowLeft size={16} />
                        {l.back}
                    </Link>
                </div>

            </div>
        </article>
    );
}
