import { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { generatePageMetadata, generateBreadcrumbJsonLd, generateOrganizationJsonLd } from '@/lib/seo';
import {
  Eye, Target, Award, Users, Lightbulb, Leaf,
  MapPin, Phone, Mail, Clock, Globe, Megaphone, HeadphonesIcon,
  History, Briefcase, Calendar
} from 'lucide-react';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const title = locale === 'id'
    ? 'Tentang Kami - Dinas Pariwisata Kabupaten Tana Toraja'
    : 'About Us - Tourism Office of Tana Toraja Regency';

  const description = locale === 'id'
    ? 'Kenali Dinas Pariwisata Kabupaten Tana Toraja, sejarah, visi, misi, dan tim kami.'
    : 'Learn about the Tourism Office of Tana Toraja Regency, our history, vision, mission, and team.';

  return generatePageMetadata({
    title,
    description,
    path: '/about-us',
    keywords: [
      'about us', 'tentang kami', 'Dinas Pariwisata', 'Tourism Office',
      'Tana Toraja', 'visi', 'misi', 'tim', 'sejarah', 'struktur organisasi'
    ],
    locale,
  });
}

export default async function AboutUsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const isID = locale === 'id';
  const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://exploretanatoraja.com';

  const breadcrumbJsonLd = generateBreadcrumbJsonLd({
    items: [
      { name: isID ? 'Beranda' : 'Home', url: `${SITE}/${locale}` },
      { name: isID ? 'Tentang Kami' : 'About Us', url: `${SITE}/${locale}/about-us` },
    ],
  });
  const organizationJsonLd = generateOrganizationJsonLd();

  const l = {
    lastUpdated: isID ? 'Terakhir diperbarui: Januari 2026' : 'Last updated: January 2026',
    heroTitle: isID ? 'Tentang Kami' : 'About Us',
    heroSubtitle: isID
      ? 'Dinas Pariwisata Kabupaten Tana Toraja — Where Ancestors Live Forever'
      : 'Tourism Office of Tana Toraja Regency — Where Ancestors Live Forever',
    introText: isID
      ? 'Selamat datang di website resmi pariwisata Kabupaten Tana Toraja. Dinas Pariwisata Kabupaten Tana Toraja adalah instansi pemerintah yang bertanggung jawab atas pengembangan, promosi, dan pengelolaan pariwisata di wilayah Kabupaten Tana Toraja, Sulawesi Selatan, Indonesia.'
      : 'Welcome to the official tourism website of Tana Toraja Regency. The Tourism Office of Tana Toraja Regency is a government institution responsible for the development, promotion, and management of tourism in the Tana Toraja Regency, South Sulawesi, Indonesia.',
    sectionHistory: isID ? 'Sejarah Singkat' : 'Brief History',
    historyText: isID
      ? 'Pariwisata Tana Toraja telah dikenal dunia sejak awal tahun 1970-an, ketika kekayaan budaya Toraja mulai menarik perhatian antropolog dan wisatawan internasional. Seiring berjalannya waktu, pemerintah daerah membentuk Dinas Pariwisata untuk mengelola potensi wisata yang luar biasa ini secara profesional dan berkelanjutan. Kini, Tana Toraja menjadi salah satu destinasi wisata unggulan Indonesia, menawarkan perpaduan unik antara keindahan alam pegunungan dan tradisi leluhur yang masih hidup.'
      : 'Tana Toraja tourism has been known to the world since the early 1970s, when the richness of Toraja culture began to attract anthropologists and international tourists. Over time, the local government established the Tourism Office to manage this extraordinary tourism potential professionally and sustainably. Today, Tana Toraja is one of Indonesias leading tourism destinations, offering a unique blend of mountain natural beauty and living ancestral traditions.',
    sectionVision: isID ? 'Visi & Misi' : 'Vision & Mission',
    visionTitle: isID ? 'Visi' : 'Vision',
    visionText: isID
      ? 'Menjadikan Tana Toraja sebagai destinasi pariwisata budaya dan alam kelas dunia yang memadukan keunikan budaya, melestarikan warisan leluhur, dan memberikan pengalaman wisata yang tak terlupakan.'
      : 'To make Tana Toraja a world-class cultural and natural tourism destination that preserves unique cultural heritage, honors ancestral traditions, and provides unforgettable tourism experiences.',
    missionTitle: isID ? 'Misi' : 'Mission',
    missions: [
      isID ? 'Mengembangkan dan mempromosikan destinasi wisata Tana Toraja' : 'Develop and promote Tana Toraja tourism destinations',
      isID ? 'Melestarikan dan melindungi warisan budaya dan keunikan lokal' : 'Preserve and protect local cultural heritage and traditions',
      isID ? 'Meningkatkan kualitas layanan pariwisata dan fasilitas wisata' : 'Improve tourism service quality and tourism facilities',
      isID ? 'Membangun pertumbuhan ekonomi berkelanjutan melalui sektor pariwisata' : 'Build sustainable economic growth through the tourism sector',
      isID ? 'Bekerja sama dengan stakeholder pariwisata untuk pengembangan yang berkelanjutan' : 'Collaborate with tourism stakeholders for sustainable development',
    ],
    sectionValues: isID ? 'Nilai-Nilai Inti' : 'Core Values',
    values: [
      {
        icon: Award, title: isID ? 'Profesionalisme' : 'Professionalism',
        desc: isID ? 'Pelayanan pariwisata yang profesional dan berintegritas.' : 'Professional and integrity-driven tourism services.',
        color: 'text-[#E63946]', bg: 'bg-[#E63946]/10', border: 'border-[#E63946]/20'
      },
      {
        icon: Users, title: isID ? 'Kerja Sama' : 'Collaboration',
        desc: isID ? 'Kolaborasi dengan komunitas lokal dan mitra.' : 'Collaboration with local communities and partners.',
        color: 'text-[#4C4670]', bg: 'bg-[#4C4670]/10', border: 'border-[#4C4670]/20'
      },
      {
        icon: Lightbulb, title: isID ? 'Inovasi' : 'Innovation',
        desc: isID ? 'Inovasi dalam promosi dan pengelolaan.' : 'Innovation in promotion and management.',
        color: 'text-[#F4A261]', bg: 'bg-[#F4A261]/10', border: 'border-[#F4A261]/30'
      },
      {
        icon: Leaf, title: isID ? 'Keberlanjutan' : 'Sustainability',
        desc: isID ? 'Keberlanjutan lingkungan, budaya, dan ekonomi.' : 'Environmental, cultural, and economic sustainability.',
        color: 'text-[#2A9D8F]', bg: 'bg-[#2A9D8F]/10', border: 'border-[#2A9D8F]/20'
      },
    ],
    sectionTeam: isID ? 'Tim Kami' : 'Our Team',
    teamText: isID
      ? 'Dinas Pariwisata Kabupaten Tana Toraja dipimpin oleh tim profesional yang berdedikasi.'
      : 'The Tourism Office of Tana Toraja Regency is led by a dedicated professional team.',
    teams: [
      {
        icon: Users, title: isID ? 'Kepala Dinas' : 'Head of Office',
        desc: isID ? 'Memimpin seluruh kegiatan pariwisata' : 'Leads all tourism activities',
        gradient: 'from-[#4C4670] to-[#2D3436]'
      },
      {
        icon: Megaphone, title: isID ? 'Tim Promosi' : 'Promotion Team',
        desc: isID ? 'Strategi promosi dan pemasaran' : 'Promotion and marketing strategies',
        gradient: 'from-[#E63946] to-[#9b2c2c]'
      },
      {
        icon: HeadphonesIcon, title: isID ? 'Tim Layanan' : 'Service Team',
        desc: isID ? 'Layanan informasi wisatawan' : 'Tourist information services',
        gradient: 'from-[#2A9D8F] to-[#1a6b62]'
      },
    ],
    sectionContact: isID ? 'Hubungi Kami' : 'Contact Us',
    contacts: [
      { icon: MapPin, label: isID ? 'Alamat' : 'Address', value: isID ? 'Jl. Pongtiku No. 1, Makale, Tana Toraja' : 'Jl. Pongtiku No. 1, Makale, Tana Toraja', bg: 'bg-[#E63946]' },
      { icon: Phone, label: isID ? 'Telepon' : 'Phone', value: '+62 423 12345', bg: 'bg-[#4C4670]' },
      { icon: Mail, label: 'Email', value: 'pariwisata@tanatorajakab.go.id', bg: 'bg-[#F4A261]' },
      { icon: Clock, label: isID ? 'Jam Operasional' : 'Hours', value: isID ? 'Senin – Jumat: 08.00 – 16.00' : 'Mon – Fri: 08:00 – 16:00', bg: 'bg-[#2A9D8F]' },
    ]
  };

  return (
    <div className="min-h-screen bg-white pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />

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
            <Globe className="w-5 h-5 text-[#FDE68A]" />
            <span className="text-white/90 font-medium text-sm tracking-wider uppercase">
              {isID ? 'Profile' : 'Profile'}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6 leading-tight drop-shadow-2xl">
            {l.heroTitle}
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-body leading-relaxed drop-shadow-lg">
            {l.heroSubtitle}
          </p>
        </div>
      </div>

      {/* ───── MAIN CONTENT ───── */}
      <div className="max-w-5xl mx-auto px-[38px] relative z-20 -mt-24">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 space-y-16 border border-gray-100">

          {/* Intro */}
          <div className="text-center max-w-4xl mx-auto">
            <p className="text-gray-600 leading-relaxed text-lg md:text-xl">
              {l.introText}
            </p>
          </div>

          {/* History Section (NEW) */}
          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-[#E63946]/10 flex items-center justify-center text-[#E63946]">
                <History className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-heading font-bold text-[#2D3436]">
                {l.sectionHistory}
              </h2>
            </div>
            <div className="bg-orange-50/50 p-8 rounded-3xl border border-orange-100">
              <p className="text-gray-700 leading-relaxed text-lg">
                {l.historyText}
              </p>
            </div>
          </section>

          {/* Vision & Mission */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-[#4C4670]/10 flex items-center justify-center text-[#4C4670]">
                <Target className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-heading font-bold text-[#2D3436]">
                {l.sectionVision}
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-[#FDF6EC] to-white rounded-3xl p-8 border border-[#E63946]/20 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Eye className="w-24 h-24 text-[#E63946]" />
                </div>
                <h3 className="text-2xl font-bold text-[#2D3436] mb-4 relative z-10">{l.visionTitle}</h3>
                <p className="text-gray-700 leading-relaxed text-lg italic relative z-10">
                  &ldquo;{l.visionText}&rdquo;
                </p>
              </div>
              <div className="bg-gradient-to-br from-[#4C4670]/5 to-white rounded-3xl p-8 border border-[#4C4670]/15 shadow-sm">
                <h3 className="text-2xl font-bold text-[#2D3436] mb-4">{l.missionTitle}</h3>
                <div className="space-y-3">
                  {l.missions.map((m, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#E63946] text-white flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5 shadow-sm">
                        {i + 1}
                      </span>
                      <span className="text-gray-700 leading-relaxed">{m}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Core Values */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-[#2A9D8F]/10 flex items-center justify-center text-[#2A9D8F]">
                <Award className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-heading font-bold text-[#2D3436]">
                {l.sectionValues}
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {l.values.map((v, i) => (
                <div key={i} className={`${v.bg} rounded-2xl p-6 border ${v.border} hover:shadow-lg transition-all duration-300 group`}>
                  <v.icon className={`w-8 h-8 ${v.color} mb-4 group-hover:scale-110 transition-transform`} />
                  <h3 className={`text-xl font-bold ${v.color} mb-2`}>{v.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Team */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-[#F4A261]/10 flex items-center justify-center text-[#F4A261]">
                <Users className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-heading font-bold text-[#2D3436]">
                {l.sectionTeam}
              </h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-8 max-w-3xl">
              {l.teamText}
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {l.teams.map((t, i) => (
                <div key={i} className={`bg-gradient-to-br ${t.gradient} text-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                    <t.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-1">{t.title}</h3>
                  <p className="text-white/80 text-sm leading-relaxed">{t.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Contact */}
          <section className="bg-[#2D3436] rounded-3xl p-8 md:p-10 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              <h2 className="text-2xl font-heading font-bold mb-8 flex items-center gap-3">
                {l.sectionContact}
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {l.contacts.map((c, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
                    <div className={`w-10 h-10 rounded-full ${c.bg} flex items-center justify-center flex-shrink-0`}>
                      <c.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white/90">{c.label}</h3>
                      <p className="text-white/70 text-sm">{c.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
