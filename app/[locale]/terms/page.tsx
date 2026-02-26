import { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { generatePageMetadata, generateBreadcrumbJsonLd } from '@/lib/seo';
import {
    Scale, FileText, CheckCircle, Shield, AlertTriangle, Users,
    Globe, Lock, HelpCircle, Mail, MapPin, Phone
} from 'lucide-react';

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;

    const title = locale === 'id'
        ? 'Syarat & Ketentuan Penggunaan - Dinas Pariwisata Kabupaten Tana Toraja'
        : 'Terms of Use - Tourism Office of Tana Toraja Regency';

    const description = locale === 'id'
        ? 'Baca syarat dan ketentuan penggunaan website Explore Tana Toraja.'
        : 'Read the terms and conditions of use for Explore Tana Toraja website.';

    return generatePageMetadata({
        title,
        description,
        path: '/terms',
        keywords: [
            'terms of use', 'syarat penggunaan', 'ketentuan', 'legal',
            'privacy', 'Tana Toraja',
        ],
        locale,
    });
}

export default async function TermsPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    const isID = locale === 'id';
    const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://exploretanatoraja.com';

    const breadcrumbJsonLd = generateBreadcrumbJsonLd({
        items: [
            { name: isID ? 'Beranda' : 'Home', url: `${SITE}/${locale}` },
            { name: isID ? 'Syarat & Ketentuan' : 'Terms of Use', url: `${SITE}/${locale}/terms` },
        ],
    });

    const l = {
        lastUpdated: isID ? 'Terakhir diperbarui: Januari 2026' : 'Last updated: January 2026',
        intro: isID ? '1. Pendahuluan' : '1. Introduction',
        introText: isID
            ? 'Selamat datang di website Explore Tana Toraja ("Website"), website pariwisata resmi Kabupaten Tana Toraja yang dikelola oleh Dinas Pariwisata. Dengan mengakses dan menggunakan Website ini, Anda setuju untuk terikat dan mematuhi Syarat & Ketentuan Penggunaan ini.'
            : 'Welcome to Explore Tana Toraja website ("Website"), the official tourism website of Tana Toraja Regency managed by the Tourism Office. By accessing and using this Website, you agree to be bound by and comply with these Terms of Use.',
        acceptance: isID ? '2. Penerimaan Syarat & Ketentuan' : '2. Acceptance of Terms',
        acceptanceText: isID
            ? 'Dengan mengakses atau menggunakan Website ini, Anda menyatakan bahwa Anda telah membaca, memahami, dan setuju untuk terikat oleh Syarat & Ketentuan ini. Jika Anda tidak setuju dengan Syarat & Ketentuan ini, Anda tidak boleh mengakses atau menggunakan Website ini.'
            : 'By accessing or using this Website, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree to these Terms, you must not access or use this Website.',
        useOfWebsite: isID ? '3. Penggunaan Website' : '3. Use of Website',
        useOfWebsiteText: isID ? 'Website ini menyediakan informasi tentang pariwisata di Tana Toraja, termasuk:' : 'This Website provides information about tourism in Tana Toraja, including:',
        useItems: [
            isID ? 'Informasi destinasi wisata' : 'Tourist destination information',
            isID ? 'Kalender event dan festival' : 'Event and festival calendar',
            isID ? 'Panduan kuliner lokal' : 'Local culinary guides',
            isID ? 'Informasi akomodasi dan transportasi' : 'Accommodation and transportation information',
            isID ? 'Kontak dan informasi layanan' : 'Contact and service information',
        ],
        intellectualProperty: isID ? '4. Hak Kekayaan Intelektual' : '4. Intellectual Property',
        intellectualPropertyText: isID
            ? 'Semua konten di Website ini, termasuk teks, gambar, logo, dan desain, dilindungi oleh hak cipta dan hak kekayaan intelektual lainnya yang dimiliki oleh Dinas Pariwisata Kabupaten Tana Toraja atau pihak ketiga yang telah memberikan izin.'
            : 'All content on this Website, including text, images, logos, and designs, is protected by copyright and other intellectual property rights owned by the Tourism Office of Tana Toraja Regency or third parties who have granted permission.',
        intellectualPropertyAlert: isID
            ? 'Anda tidak boleh mereproduksi, memodifikasi, mendistribusikan, atau menampilkan konten dari Website ini tanpa izin tertulis dari kami.'
            : 'You may not reproduce, modify, distribute, or display content from this Website without our written permission.',
        userConduct: isID ? '5. Perilaku Pengguna' : '5. User Conduct',
        userConductText: isID ? 'Dengan menggunakan Website ini, Anda setuju untuk:' : 'By using this Website, you agree to:',
        conductItems: [
            isID ? 'Menghormati semua hukum dan peraturan yang berlaku' : 'Comply with all applicable laws and regulations',
            isID ? 'Tidak menggunakan Website untuk tujuan ilegal atau tidak sah' : 'Not use the Website for illegal or unauthorized purposes',
            isID ? 'Tidak mengirim atau mengunggah konten yang ofensif, kasar, atau melanggar hukum' : 'Not transmit or upload offensive, obscene, or unlawful content',
            isID ? 'Menghormati hak dan privasi pengguna lain' : 'Respect the rights and privacy of other users',
            isID ? 'Tidak mencoba mendapatkan akses tidak sah ke sistem atau data kami' : 'Not attempt to gain unauthorized access to our systems or data',
        ],
        disclaimer: isID ? '6. Penafian' : '6. Disclaimer',
        disclaimerText: isID
            ? 'Kami berusaha untuk memastikan akurasi dan keandalan informasi yang disediakan di Website ini. Namun, kami tidak memberikan jaminan, tersurat atau tersirat, mengenai:'
            : 'We strive to ensure the accuracy and reliability of information provided on this Website. However, we make no warranties, express or implied, regarding:',
        disclaimerItems: [
            isID ? 'Kelengkapan atau akurasi informasi' : 'The completeness or accuracy of information',
            isID ? 'Ketersediaan layanan atau produk' : 'The availability of services or products',
            isID ? 'Kualitas atau keandalan informasi' : 'The quality or reliability of information',
        ],
        disclaimerNote: isID
            ? 'Informasi di Website ini dapat berubah sewaktu-waktu tanpa pemberitahuan sebelumnya.'
            : 'Information on this Website may be changed from time to time without prior notice.',
        limitation: isID ? '7. Pembatasan Tanggung Jawab' : '7. Limitation of Liability',
        limitationText: isID
            ? 'Dalam batas hukum yang berlaku, Dinas Pariwisata Kabupaten Tana Toraja, pejabatnya, karyawan, dan afiliasinya tidak bertanggung jawab atas kerusakan langsung, tidak langsung, insidental, konsekuensial, atau hukuman yang timbul dari atau berkaitan dengan penggunaan Website ini.'
            : 'To the fullest extent permitted by law, the Tourism Office of Tana Toraja Regency, its officers, employees, and affiliates shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from or related to the use of this Website.',
        privacyPolicy: isID ? '8. Kebijakan Privasi' : '8. Privacy Policy',
        privacyPolicyText: isID
            ? 'Penggunaan Website ini juga tunduk pada Kebijakan Privasi kami. Silakan baca Kebijakan Privasi kami untuk memahami bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi Anda.'
            : 'Your use of this Website is also subject to our Privacy Policy. Please read our Privacy Policy to understand how we collect, use, and protect your personal data.',
        governingLaw: isID ? '9. Hukum yang Berlaku' : '9. Governing Law',
        governingLawText: isID
            ? 'Syarat & Ketentuan ini diatur oleh dan ditafsirkan sesuai dengan hukum Republik Indonesia. Setiap sengketa yang timbul dari atau berkaitan dengan Syarat & Ketentuan ini akan tunduk pada yurisdiksi eksklusif pengadilan Indonesia.'
            : 'These Terms shall be governed by and construed in accordance with the laws of the Republic of Indonesia. Any dispute arising from or related to these Terms shall be subject to the exclusive jurisdiction of Indonesian courts.',
        changes: isID ? '10. Perubahan Syarat & Ketentuan' : '10. Changes to Terms',
        changesText: isID
            ? 'Kami berhak untuk memperbarui Syarat & Ketentuan ini sewaktu-waktu. Perubahan akan diposting di halaman ini dan tanggal "Terakhir diperbarui" akan diperbarui. Penggunaan lanjutan Website setelah perubahan menandakan penerimaan Anda terhadap Syarat & Ketentuan yang diperbarui.'
            : 'We reserve the right to modify these Terms from time to time. Changes will be posted on this page and the "Last updated" date will be revised. Continued use of the Website after changes constitutes your acceptance of the revised Terms.',
        contact: isID ? '11. Informasi Kontak' : '11. Contact Information',
        contactText: isID ? 'Jika Anda memiliki pertanyaan tentang Syarat & Ketentuan ini, silakan hubungi kami:' : 'If you have any questions about these Terms, please contact us:',
    };

    return (
        <div className="min-h-screen bg-white pb-16">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

            {/* ───── HERO ───── */}
            <div className="relative h-[500px] flex items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1920&q=80')" }}
                >
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                </div>

                <div className="relative z-20 text-center px-4 max-w-5xl mx-auto pt-20">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
                        <Scale className="w-5 h-5 text-[#FDE68A]" />
                        <span className="text-white/90 font-medium text-sm tracking-wider uppercase">Legal</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6 leading-tight drop-shadow-2xl">
                        {isID ? 'Syarat & Ketentuan' : 'Terms of Use'}
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

                    {/* 2. Acceptance */}
                    <section className="bg-gradient-to-br from-[#FDF6EC] to-white p-8 rounded-2xl border border-[#E63946]/10">
                        <h2 className="text-2xl font-heading font-bold text-[#2D3436] mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-[#E63946]/10 flex items-center justify-center text-[#E63946]">2</span>
                            {l.acceptance.split('. ')[1]}
                        </h2>
                        <div className="flex gap-4 pl-2">
                            <CheckCircle className="w-6 h-6 text-[#E63946] flex-shrink-0 mt-1" />
                            <p className="text-gray-700 leading-relaxed text-lg font-medium">
                                {l.acceptanceText}
                            </p>
                        </div>
                    </section>

                    {/* 3. Use of Website */}
                    <section>
                        <h2 className="text-2xl font-heading font-bold text-[#2D3436] mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-[#E63946]/10 flex items-center justify-center text-[#E63946]">3</span>
                            {l.useOfWebsite.split('. ')[1]}
                        </h2>
                        <div className="pl-11">
                            <p className="text-gray-600 leading-relaxed mb-6">
                                {l.useOfWebsiteText}
                            </p>
                            <div className="grid md:grid-cols-2 gap-4">
                                {l.useItems.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                        <div className="w-2 h-2 rounded-full bg-[#4C4670]" />
                                        <span className="text-gray-700 font-medium">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* 4. Intellectual Property */}
                    <section>
                        <h2 className="text-2xl font-heading font-bold text-[#2D3436] mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-[#E63946]/10 flex items-center justify-center text-[#E63946]">4</span>
                            {l.intellectualProperty.split('. ')[1]}
                        </h2>
                        <div className="pl-11 space-y-6">
                            <p className="text-gray-600 leading-relaxed">
                                {l.intellectualPropertyText}
                            </p>
                            <div className="flex gap-4 p-5 bg-red-50 rounded-xl border border-red-100">
                                <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0" />
                                <p className="text-red-700 font-medium text-sm">
                                    {l.intellectualPropertyAlert}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* 5. User Conduct */}
                    <section>
                        <h2 className="text-2xl font-heading font-bold text-[#2D3436] mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-[#E63946]/10 flex items-center justify-center text-[#E63946]">5</span>
                            {l.userConduct.split('. ')[1]}
                        </h2>
                        <div className="pl-11">
                            <p className="text-gray-600 leading-relaxed mb-6">
                                {l.userConductText}
                            </p>
                            <div className="space-y-3">
                                {l.conductItems.map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-3">
                                        <Shield className="w-5 h-5 text-[#4C4670] mt-0.5" />
                                        <span className="text-gray-700">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* 6. Disclaimer & 7. Limitation */}
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Disclaimer */}
                        <section className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                            <h2 className="text-xl font-heading font-bold text-[#2D3436] mb-4 flex items-center gap-2">
                                <span className="w-6 h-6 rounded bg-[#F4A261] text-white flex items-center justify-center text-xs">6</span>
                                {l.disclaimer.split('. ')[1]}
                            </h2>
                            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                                {l.disclaimerText}
                            </p>
                            <ul className="space-y-2 mb-4">
                                {l.disclaimerItems.map((item, idx) => (
                                    <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                                        <span className="text-[#F4A261]">•</span> {item}
                                    </li>
                                ))}
                            </ul>
                            <p className="text-xs text-gray-500 italic border-t border-gray-200 pt-3">
                                {l.disclaimerNote}
                            </p>
                        </section>

                        {/* Limitation */}
                        <section className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                            <h2 className="text-xl font-heading font-bold text-[#2D3436] mb-4 flex items-center gap-2">
                                <span className="w-6 h-6 rounded bg-[#E63946] text-white flex items-center justify-center text-xs">7</span>
                                {l.limitation.split('. ')[1]}
                            </h2>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {l.limitationText}
                            </p>
                        </section>
                    </div>

                    {/* 8. Privacy & 9. Law */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <section className="p-6 rounded-2xl border border-blue-100 bg-blue-50/50">
                            <h2 className="text-xl font-heading font-bold text-blue-900 mb-2 flex items-center gap-2">
                                <Lock className="w-5 h-5" />
                                {l.privacyPolicy.split('. ')[1]}
                            </h2>
                            <p className="text-blue-800/80 text-sm leading-relaxed">
                                {l.privacyPolicyText}
                            </p>
                        </section>
                        <section className="p-6 rounded-2xl border border-indigo-100 bg-indigo-50/50">
                            <h2 className="text-xl font-heading font-bold text-indigo-900 mb-2 flex items-center gap-2">
                                <Globe className="w-5 h-5" />
                                {l.governingLaw.split('. ')[1]}
                            </h2>
                            <p className="text-indigo-800/80 text-sm leading-relaxed">
                                {l.governingLawText}
                            </p>
                        </section>
                    </div>

                    {/* 10. Changes */}
                    <section className="border-t border-gray-100 pt-8">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[#2A9D8F]/10 flex items-center justify-center flex-shrink-0">
                                <HelpCircle className="w-6 h-6 text-[#2A9D8F]" />
                            </div>
                            <div>
                                <h2 className="text-xl font-heading font-bold text-[#2D3436] mb-2">
                                    {l.changes.split('. ')[1]}
                                </h2>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {l.changesText}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* 11. Contact */}
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