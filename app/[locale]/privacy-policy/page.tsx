import { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { generatePageMetadata, generateBreadcrumbJsonLd } from '@/lib/seo';
import {
    ShieldCheck, Lock, Eye, Database, Share2, Cookie, Server,
    UserCheck, AlertCircle, RefreshCw, Mail, MapPin, Globe
} from 'lucide-react';

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;

    const title = locale === 'id'
        ? 'Kebijakan Privasi - Dinas Pariwisata Kabupaten Tana Toraja'
        : 'Privacy Policy - Tourism Office of Tana Toraja Regency';

    const description = locale === 'id'
        ? 'Baca kebijakan privasi website Explore Tana Toraja.'
        : 'Read the privacy policy of Explore Tana Toraja website.';

    return generatePageMetadata({
        title,
        description,
        path: '/privacy-policy',
        keywords: [
            'privacy policy', 'kebijakan privasi', 'data protection',
            'personal data', 'GDPR', 'Tana Toraja',
        ],
        locale,
    });
}

export default async function PrivacyPolicyPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    const isID = locale === 'id';
    const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://exploretanatoraja.com';

    const breadcrumbJsonLd = generateBreadcrumbJsonLd({
        items: [
            { name: isID ? 'Beranda' : 'Home', url: `${SITE}/${locale}` },
            { name: isID ? 'Kebijakan Privasi' : 'Privacy Policy', url: `${SITE}/${locale}/privacy-policy` },
        ],
    });

    const l = {
        lastUpdated: isID ? 'Terakhir diperbarui: Januari 2026' : 'Last updated: January 2026',
        intro: isID ? '1. Pendahuluan' : '1. Introduction',
        introText: isID
            ? 'Dinas Pariwisata Kabupaten Tana Toraja ("kami") berkomitmen untuk melindungi privasi dan keamanan data pribadi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi yang Anda berikan saat mengakses website Explore Tana Toraja.'
            : 'The Tourism Office of Tana Toraja Regency ("we") is committed to protecting your privacy and security of your personal data. This Privacy Policy explains how we collect, use, and protect information you provide when accessing the Explore Tana Toraja website.',
        infoCollect: isID ? '2. Informasi yang Kami Kumpulkan' : '2. Information We Collect',
        infoCollectText: isID ? 'Kami dapat mengumpulkan informasi berikut saat Anda mengakses Website:' : 'We may collect the following information when you access the Website:',
        technicalInfo: isID ? 'Informasi Teknis' : 'Technical Information',
        technicalInfoDesc: isID ? 'Alamat IP, tipe browser, sistem operasi, dan informasi perangkat.' : 'IP address, browser type, operating system, and device information.',
        usageInfo: isID ? 'Informasi Penggunaan' : 'Usage Information',
        usageInfoDesc: isID ? 'Halaman yang dikunjungi, waktu akses, dan durasi kunjungan.' : 'Pages visited, time of access, and duration of visits.',
        contactInfo: isID ? 'Informasi Kontak' : 'Contact Information',
        contactInfoDesc: isID ? 'Nama, email, dan pesan saat Anda menghubungi kami.' : 'Name, email, and message when you contact us.',
        newsletterInfo: isID ? 'Newsletter' : 'Newsletter',
        newsletterInfoDesc: isID ? 'Alamat email jika Anda berlangganan update wisata.' : 'Email address if you subscribe to tourism updates.',
        howWeUse: isID ? '3. Penggunaan Informasi' : '3. How We Use Information',
        useItems: [
            isID ? 'Menyediakan dan meningkatkan Website' : 'To provide and improve the Website',
            isID ? 'Memproses permintaan dan pertanyaan Anda' : 'To process your requests and inquiries',
            isID ? 'Mengirim newsletter dan update pariwisata' : 'To send newsletters and tourism updates',
            isID ? 'Menganalisis pola penggunaan' : 'To analyze usage patterns',
            isID ? 'Memastikan keamanan sistem' : 'To ensure system security',
        ],
        cookies: isID ? '4. Cookies dan Pelacakan' : '4. Cookies and Tracking',
        cookiesText: isID
            ? 'Website ini menggunakan cookies untuk meningkatkan pengalaman pengguna, menganalisis trafik, dan mengingat preferensi Anda.'
            : 'This Website uses cookies to enhance user experience, analyze traffic, and remember your preferences.',
        thirdParty: isID ? '5. Layanan Pihak Ketiga' : '5. Third-Party Services',
        thirdPartyText: isID ? 'Kami menggunakan layanan pihak ketiga yang mungkin mengumpulkan data:' : 'We use third-party services that may collect data:',
        thirdItems: [
            'Google Analytics (Traffic Analysis)',
            'Google Maps (Interactive Maps)',
            'Social Media Widgets',
        ],
        dataSecurity: isID ? '6. Keamanan Data' : '6. Data Security',
        dataSecurityText: isID
            ? 'Kami menerapkan langkah-langkah keamanan teknis dan organisasi yang wajar untuk melindungi data Anda dari akses tidak sah.'
            : 'We implement reasonable technical and organizational security measures to protect your data from unauthorized access.',
        yourRights: isID ? '7. Hak Anda' : '7. Your Rights',
        rightsItems: [
            isID ? 'Akses dan update data pribadi' : 'Access and update personal data',
            isID ? 'Minta penghapusan data' : 'Request data deletion',
            isID ? 'Tolak pengumpulan tertentu' : 'Opt-out of certain collection',
            isID ? 'Minta salinan data' : 'Request copy of data',
        ],
        children: isID ? '8. Privasi Anak-anak' : '8. Children Privacy',
        childrenText: isID
            ? 'Website ini tidak ditujukan untuk anak di bawah 13 tahun. Kami tidak sengaja mengumpulkan data dari anak-anak.'
            : 'This Website is not intended for children under 13 years. We do not knowingly collect data from children.',
        changes: isID ? '9. Perubahan Kebijakan' : '9. Policy Changes',
        changesText: isID
            ? 'Kami dapat memperbarui kebijakan ini sewaktu-waktu. Perubahan akan diinformasikan di halaman ini.'
            : 'We may update this policy from time to time. Changes will be posted on this page.',
        contact: isID ? '10. Kontak' : '10. Contact',
        contactText: isID ? 'Hubungi kami jika ada pertanyaan:' : 'Contact us if you have questions:',
    };

    return (
        <div className="min-h-screen bg-white pb-16">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

            {/* ───── HERO ───── */}
            <div className="relative h-[500px] flex items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555421689-491a97ff2040?w=1920&q=80')" }}
                >
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                </div>

                <div className="relative z-20 text-center px-4 max-w-5xl mx-auto pt-20">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
                        <Lock className="w-5 h-5 text-[#FDE68A]" />
                        <span className="text-white/90 font-medium text-sm tracking-wider uppercase">
                            {isID ? 'Keamanan Data' : 'Data Security'}
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6 leading-tight drop-shadow-2xl">
                        {isID ? 'Kebijakan Privasi' : 'Privacy Policy'}
                    </h1>
                    <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-body leading-relaxed drop-shadow-lg">
                        {l.lastUpdated}
                    </p>
                </div>
            </div>

            {/* ───── MAIN CONTENT ───── */}
            <div className="max-w-5xl mx-auto px-[38px] relative z-20 -mt-24">
                <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 space-y-12 border border-gray-100">

                    {/* 1. Intro */}
                    <section>
                        <h2 className="text-2xl font-heading font-bold text-[#2D3436] mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-[#E63946]/10 flex items-center justify-center text-[#E63946]">1</span>
                            {l.intro.split('. ')[1]}
                        </h2>
                        <p className="text-gray-600 leading-relaxed text-lg pl-11">
                            {l.introText}
                        </p>
                    </section>

                    {/* 2. Collected Info */}
                    <section>
                        <h2 className="text-2xl font-heading font-bold text-[#2D3436] mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-[#E63946]/10 flex items-center justify-center text-[#E63946]">2</span>
                            {l.infoCollect.split('. ')[1]}
                        </h2>
                        <div className="pl-11 grid md:grid-cols-2 gap-6">
                            <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 hover:shadow-md transition-shadow">
                                <Database className="w-8 h-8 text-blue-500 mb-4" />
                                <h3 className="font-bold text-blue-900 mb-2">{l.technicalInfo}</h3>
                                <p className="text-sm text-blue-800/70">{l.technicalInfoDesc}</p>
                            </div>
                            <div className="bg-green-50/50 p-6 rounded-2xl border border-green-100 hover:shadow-md transition-shadow">
                                <Eye className="w-8 h-8 text-green-500 mb-4" />
                                <h3 className="font-bold text-green-900 mb-2">{l.usageInfo}</h3>
                                <p className="text-sm text-green-800/70">{l.usageInfoDesc}</p>
                            </div>
                            <div className="bg-purple-50/50 p-6 rounded-2xl border border-purple-100 hover:shadow-md transition-shadow">
                                <Mail className="w-8 h-8 text-purple-500 mb-4" />
                                <h3 className="font-bold text-purple-900 mb-2">{l.contactInfo}</h3>
                                <p className="text-sm text-purple-800/70">{l.contactInfoDesc}</p>
                            </div>
                            <div className="bg-orange-50/50 p-6 rounded-2xl border border-orange-100 hover:shadow-md transition-shadow">
                                <ShieldCheck className="w-8 h-8 text-orange-500 mb-4" />
                                <h3 className="font-bold text-orange-900 mb-2">{l.newsletterInfo}</h3>
                                <p className="text-sm text-orange-800/70">{l.newsletterInfoDesc}</p>
                            </div>
                        </div>
                    </section>

                    {/* 3. Usage */}
                    <section>
                        <h2 className="text-2xl font-heading font-bold text-[#2D3436] mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-[#E63946]/10 flex items-center justify-center text-[#E63946]">3</span>
                            {l.howWeUse.split('. ')[1]}
                        </h2>
                        <div className="pl-11 space-y-3">
                            {l.useItems.map((item, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                    <div className="w-2 h-2 rounded-full bg-[#2A9D8F]" />
                                    <span className="text-gray-700">{item}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* 4. Cookies & 5. Third Party */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <section className="bg-amber-50/50 p-8 rounded-3xl border border-amber-100">
                            <h2 className="text-xl font-heading font-bold text-[#2D3436] mb-4 flex items-center gap-2">
                                <span className="w-6 h-6 rounded bg-[#F4A261] text-white flex items-center justify-center text-xs">4</span>
                                {l.cookies.split('. ')[1]}
                            </h2>
                            <Cookie className="w-8 h-8 text-[#F4A261] mb-4" />
                            <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                {l.cookiesText}
                            </p>
                        </section>

                        <section className="bg-cyan-50/50 p-8 rounded-3xl border border-cyan-100">
                            <h2 className="text-xl font-heading font-bold text-[#2D3436] mb-4 flex items-center gap-2">
                                <span className="w-6 h-6 rounded bg-[#2A9D8F] text-white flex items-center justify-center text-xs">5</span>
                                {l.thirdParty.split('. ')[1]}
                            </h2>
                            <Share2 className="w-8 h-8 text-[#2A9D8F] mb-4" />
                            <p className="text-gray-600 text-sm mb-4">{l.thirdPartyText}</p>
                            <ul className="text-sm text-gray-500 space-y-1 ml-4 list-disc">
                                {l.thirdItems.map((item, i) => (
                                    <li key={i}>{item}</li>
                                ))}
                            </ul>
                        </section>
                    </div>

                    {/* 6. Security & 7. Rights */}
                    <div className="space-y-8">
                        <section>
                            <h2 className="text-2xl font-heading font-bold text-[#2D3436] mb-4 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg bg-[#E63946]/10 flex items-center justify-center text-[#E63946]">6</span>
                                {l.dataSecurity.split('. ')[1]}
                            </h2>
                            <div className="pl-11 bg-red-50 p-6 rounded-2xl border border-red-100 flex gap-4">
                                <Server className="w-8 h-8 text-[#E63946] flex-shrink-0" />
                                <p className="text-red-900/80 leading-relaxed font-medium">
                                    {l.dataSecurityText}
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-heading font-bold text-[#2D3436] mb-4 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg bg-[#E63946]/10 flex items-center justify-center text-[#E63946]">7</span>
                                {l.yourRights.split('. ')[1]}
                            </h2>
                            <div className="pl-11 grid sm:grid-cols-2 gap-4">
                                {l.rightsItems.map((right, i) => (
                                    <div key={i} className="flex items-center gap-3 p-4 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors">
                                        <UserCheck className="w-5 h-5 text-indigo-500" />
                                        <span className="text-indigo-900 font-medium text-sm">{right}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* 8. Children & 9. Changes */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <section className="p-6 rounded-2xl border border-gray-100">
                            <h2 className="text-lg font-heading font-bold text-[#2D3436] mb-2 flex items-center gap-2">
                                <span className="text-[#E63946]">8.</span> {l.children.split('. ')[1]}
                            </h2>
                            <p className="text-gray-600 text-sm leading-relaxed">{l.childrenText}</p>
                        </section>
                        <section className="p-6 rounded-2xl border border-gray-100">
                            <h2 className="text-lg font-heading font-bold text-[#2D3436] mb-2 flex items-center gap-2">
                                <span className="text-[#E63946]">9.</span> {l.changes.split('. ')[1]}
                            </h2>
                            <p className="text-gray-600 text-sm leading-relaxed">{l.changesText}</p>
                        </section>
                    </div>

                    {/* 10. Contact */}
                    <section className="bg-[#2D3436] rounded-3xl p-8 md:p-10 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                        <div className="relative z-10">
                            <h2 className="text-2xl font-heading font-bold mb-6 flex items-center gap-3">
                                {l.contact.split('. ')[1]}
                            </h2>
                            <p className="text-white/70 mb-8 max-w-2xl">
                                {l.contactText}
                            </p>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-[#E63946] flex items-center justify-center flex-shrink-0">
                                        <Mail className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm text-white/90">Email</h3>
                                        <p className="text-white/70 text-sm">pariwisata@tanatorajakab.go.id</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-[#4C4670] flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm text-white/90">{isID ? 'Alamat' : 'Address'}</h3>
                                        <p className="text-white/70 text-sm">Makale, Tana Toraja, Sulawesi Selatan</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}
