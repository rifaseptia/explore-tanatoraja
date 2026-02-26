# 🏔️ Explore Tana Toraja - Official Tourism Website

Website pariwisata resmi untuk **Kabupaten Tana Toraja**, Sulawesi Selatan, Indonesia.

## 🌟 Tentang Proyek

**Explore Tana Toraja** adalah website pariwisata resmi yang dikelola oleh Dinas Pariwisata Kabupaten Tana Toraja. Website ini dirancang untuk mempromosikan keindahan budaya, alam, dan kuliner Tana Toraja kepada wisatawan domestik dan mancanegara.

### 🎯 Fitur Utama

- **Multi-bahasa** - Dukungan penuh untuk Bahasa Indonesia dan Inggris
- **Destinasi Wisata** - Jelajahi situs budaya, alam, dan desa wisata
- **Events & Festivals** - Kalender event dan upacara adat
- **Culinary Guide** - Panduan kuliner tradisional Toraja
- **Transportasi** - Informasi cara menuju Tana Toraja
- **Penginapan** - Daftar hotel, homestay, dan resort
- **Peta Interaktif** - Peta dengan marker lokasi wisata
- **Admin Dashboard** - Sistem manajemen konten lengkap

## 🛠️ Tech Stack

### Core Framework
- **Next.js 16.1.1** - React framework dengan App Router
- **React 19.2.3** - UI Library
- **TypeScript** - Type-safe JavaScript
- **Node.js 20.x LTS** - Runtime Environment

### Database
- **MongoDB** - Database NoSQL
- **Mongoose 9.1.1** - ODM (Object Document Mapper)

### Styling & UI
- **Tailwind CSS v4** - Utility-first CSS Framework
- **Framer Motion 12.23.26** - Animations & Transitions
- **Lucide Icons** - Icon Library

### Utilities & Integrations
- **next-intl 4.7.0** - Internationalization (ID/EN)
- **React Leaflet** - Interactive Maps
- **next/image** - Image Optimization

### Development Tools
- **pnpm** - Package Manager
- **ESLint** - Code Linting

## 🚀 Getting Started

### Prerequisites
- Node.js 20.x LTS atau lebih baru
- pnpm (recommended) atau npm/yarn
- MongoDB (local atau MongoDB Atlas)

### Installation

1. **Clone repository**
```bash
git clone <repository-url>
cd exploretanatorajaweb
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Setup environment variables**
Buat file `.env.local` di root directory:
```env
MONGODB_URI=mongodb://localhost:27017/exploretoraja
NEXT_PUBLIC_SITE_URL=https://exploretanatoraja.com
NEXT_PUBLIC_GOOGLE_VERIFICATION=your-google-verification-code
```

4. **Run development server**
```bash
pnpm dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## 📁 Project Structure

```
exploretanatorajaweb/
├── app/                      # Next.js App Router
│   ├── [locale]/             # Dynamic locale (id/en)
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Homepage
│   │   ├── destinations/      # Destinations pages
│   │   ├── culinary/          # Culinary pages
│   │   ├── events/           # Events pages
│   │   ├── stay/             # Accommodations pages
│   │   └── transport/        # Transport pages
│   ├── admin/                # Admin dashboard
│   ├── api/                  # API routes
│   ├── sitemap.ts            # Dynamic sitemap
│   └── robots.ts             # Robots.txt
├── components/               # React components
│   ├── admin/                # Admin components
│   ├── home/                 # Homepage sections
│   ├── layout/               # Layout components
│   └── shared/               # Shared components
├── lib/                     # Utilities
│   ├── mongodb.ts            # MongoDB connection
│   └── seo.ts               # SEO utilities
├── models/                  # Mongoose schemas
├── messages/                # i18n translations
├── public/                  # Static assets
│   └── manifest.json         # PWA manifest
└── types/                   # TypeScript types
```

## 🔍 SEO Features

Website ini dilengkapi dengan fitur SEO lengkap:

### ✅ Sitemap Dinamis
- [`app/sitemap.ts`](app/sitemap.ts) - Sitemap.xml otomatis untuk semua halaman
- Termasuk halaman statis dan dinamis (destinations, events, culinary, dll)
- Update otomatis berdasarkan perubahan konten

### ✅ Robots.txt
- [`app/robots.ts`](app/robots.ts) - Konfigurasi robots.txt
- Blokir admin dan API routes dari crawling
- Referensi ke sitemap.xml

### ✅ Meta Tags Lengkap
- Title, description, dan keywords untuk setiap halaman
- Open Graph tags untuk social media sharing (Facebook, LinkedIn)
- Twitter Card tags untuk Twitter sharing
- Canonical URLs untuk mencegah duplicate content

### ✅ JSON-LD Structured Data
- [`lib/seo.ts`](lib/seo.ts) - Utility functions untuk JSON-LD
- Organization schema
- WebSite schema
- TouristAttraction schema untuk destinasi
- Event schema untuk events
- BreadcrumbList schema untuk navigasi
- FAQPage schema untuk FAQ

### ✅ PWA Support
- [`public/manifest.json`](public/manifest.json) - Web App Manifest
- Favicon variations untuk berbagai ukuran
- Theme color dan background color
- App shortcuts untuk akses cepat

### ✅ Performance
- Image optimization dengan next/image
- Lazy loading untuk gambar
- Server-side rendering untuk SEO
- Static generation untuk halaman statis

## 🎨 Design System

### Color Palette
```css
--color-primary: #E63946;      /* Toraja Red */
--color-secondary: #F4A261;    /* Golden Sunrise */
--color-accent: #4ECDC4;       /* Sky Blue */
--color-dark: #2D3436;         /* Dark Slate */
--color-gray: #636E72;         /* Warm Gray */
--color-cream: #FDF6EC;        /* Light Cream */
```

### Typography
- **Headings**: Sora (Google Fonts)
- **Body**: Work Sans (Google Fonts)

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|-----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `NEXT_PUBLIC_SITE_URL` | Website URL for SEO | Yes |
| `NEXT_PUBLIC_GOOGLE_VERIFICATION` | Google Search Console verification | Optional |

## 🗄️ Database Seeding

Untuk mengisi database dengan data dummy:

```bash
# Seed destinations
node scripts/seed-destinations.js

# Seed events
node scripts/seed-events.js

# Seed accommodations
node scripts/seed-accommodations.js

# Seed transport
node scripts/seed-transport.js

# Seed hero slides
node scripts/seed-hero-slides.js
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push code ke GitHub
2. Import project di Vercel
3. Setup environment variables
4. Deploy

### Environment Variables for Production
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/exploretoraja
NEXT_PUBLIC_SITE_URL=https://exploretanatoraja.com
NEXT_PUBLIC_GOOGLE_VERIFICATION=your-verification-code
```

## 📚 Documentation

- [`dokumentasi-proyek_Version2.md`](dokumentasi-proyek_Version2.md) - Dokumentasi lengkap proyek
- [`prompt_Version2.md`](prompt_Version2.md) - Master prompt untuk AI developer

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

Copyright © 2026 Dinas Pariwisata Kabupaten Tana Toraja. All rights reserved.

## 📞 Contact

- **Email**: pariwisata@tanatorajakab.go.id
- **Website**: https://exploretanatoraja.com
- **Address**: Makale, Tana Toraja, Sulawesi Selatan, Indonesia

---

**Where Ancestors Live Forever** 🏔️
