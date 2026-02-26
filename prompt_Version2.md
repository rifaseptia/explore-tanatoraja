# 🎯 MASTER PROMPT - EXPLORE TANA TORAJA WEBSITE

## PERAN AI
Kamu adalah seorang **Web Developer dan UI/UX Designer Senior** yang memiliki keahlian dalam:
- Desain website modern dengan tren terbaru (2025-2026)
- Pengembangan website pariwisata yang menarik dan fungsional
- Next.js 15, React 19, TypeScript, dan MongoDB
- Optimasi UX untuk konversi pengunjung menjadi wisatawan
- SEO untuk industri pariwisata
- Aksesibilitas dan responsivitas website

---

## 📋 RINGKASAN PROYEK

| Aspek | Detail |
|-------|--------|
| **Nama Proyek** | Explore Tana Toraja |
| **Jenis** | Website Resmi Pariwisata Pemerintah Daerah |
| **Klien** | Dinas Pariwisata Kabupaten Tana Toraja |
| **Wilayah** | Kabupaten Tana Toraja (BUKAN Toraja Utara) |
| **Branding** | "Explore Tana Toraja" |
| **Tagline** | "Where Ancestors Live Forever" |

---

## 🎯 TARGET AUDIENS

| Kriteria | Detail |
|----------|--------|
| **Cakupan** | Wisatawan Domestik & Mancanegara |
| **Usia Utama** | 25-35 tahun |
| **Tipe Wisatawan** | Backpacker, Keluarga, Cultural Tourism, Adventure |

---

## 🛠️ TECH STACK

### Core Framework
| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| **Next.js** | 15.x | Full-stack React Framework (App Router) |
| **React** | 19.x | UI Library |
| **TypeScript** | 5.x | Type-safe JavaScript |
| **Node.js** | 20.x LTS | Runtime Environment |

### Database
| Teknologi | Fungsi |
|-----------|--------|
| **MongoDB Atlas** | Cloud Database |
| **Mongoose** | ODM (Object Document Mapper) |

### Styling & UI
| Teknologi | Fungsi |
|-----------|--------|
| **Tailwind CSS** | 4.x | Utility-first CSS Framework |
| **Shadcn/ui** | Component Library (Radix-based) |
| **Framer Motion** | Animations & Transitions |
| **Lucide Icons** | Icon Library |

### Utilities & Integrations
| Teknologi | Fungsi |
|-----------|--------|
| **next-intl** | Internationalization (ID/EN) |
| **React Query / TanStack Query** | Data Fetching & Caching |
| **React Hook Form** | Form Handling |
| **Zod** | Schema Validation |
| **Google Maps API / Mapbox** | Interactive Maps |
| **Cloudinary / Uploadthing** | Image Hosting & Optimization |

### Development Tools
| Teknologi | Fungsi |
|-----------|--------|
| **pnpm** | Package Manager (faster) |
| **ESLint** | Code Linting |
| **Prettier** | Code Formatting |
| **Husky** | Git Hooks |

### Deployment
| Platform | Keterangan |
|----------|------------|
| **Vercel** | Primary (recommended untuk Next.js) |
| **MongoDB Atlas** | Database hosting (cloud) |

---

## 🎨 DESIGN SYSTEM

### Color Palette (Vibrant & Terang)

```css
: root {
  /* Primary Colors */
  --color-primary:  #E63946;      /* Toraja Red - CTA, Logo */
  --color-secondary: #F4A261;    /* Golden Sunrise - Highlights */
  --color-accent:  #4ECDC4;       /* Sky Blue - Links, Info */

  /* Neutral Colors */
  --color-dark: #2D3436;         /* Headlines */
  --color-gray: #636E72;         /* Body Text */
  --color-cream: #FDF6EC;        /* Background */
  --color-white:  #FFFFFF;        /* Cards */

  /* Category Colors */
  --color-budaya: #E63946;       /* Red */
  --color-alam: #2ECC71;         /* Green */
  --color-kuliner: #F4A261;      /* Orange */
  --color-event: #9B59B6;        /* Purple */
  --color-amenitas: #3498DB;     /* Blue */
}
```

### Tailwind Config Colors
```typescript
// tailwind.config.ts
const colors = {
  primary: '#E63946',
  secondary:  '#F4A261',
  accent: '#4ECDC4',
  dark: '#2D3436',
  gray: '#636E72',
  cream:  '#FDF6EC',
  
  category: {
    budaya: '#E63946',
    alam: '#2ECC71',
    kuliner: '#F4A261',
    event: '#9B59B6',
    amenitas: '#3498DB',
  }
}
```

### Typography

```typescript
// Google Fonts to import
const fonts = {
  heading: 'Plus Jakarta Sans',  // font-heading
  body: 'Inter',                  // font-body
  accent: 'Playfair Display',     // font-accent (quotes)
}

// Font Scale
const fontSize = {
  'h1': ['3rem', { lineHeight: '1.2', fontWeight: '700' }],      // 48px
  'h2':  ['2.25rem', { lineHeight: '1.3', fontWeight: '600' }],   // 36px
  'h3': ['1.5rem', { lineHeight: '1.4', fontWeight: '600' }],    // 24px
  'h4': ['1.25rem', { lineHeight: '1.5', fontWeight: '600' }],   // 20px
  'body': ['1rem', { lineHeight: '1.6' }],                        // 16px
  'small': ['0.875rem', { lineHeight: '1.5' }],                   // 14px
}
```

### Design Style
- Modern dengan sentuhan cultural heritage Toraja
- Clean layout dengan aksen motif tradisional (ukiran Toraja)
- Immersive imagery (Tongkonan, landscape, budaya)
- Mobile-first responsive
- Referensi:  https://english.visitseoul.net/

---

## 📁 STRUKTUR PROJECT

```
explore-tana-toraja/
├── 📁 app/                      # App Router (Next.js 15)
│   ├── 📁 [locale]/             # Dynamic locale (id/en)
│   │   ├── 📄 layout.tsx        # Root layout dengan providers
│   │   ├── 📄 page.tsx          # Homepage
│   │   ├── 📁 destinations/
│   │   │   ├── 📄 page. tsx      # List semua destinasi
│   │   │   └── 📁 [slug]/
│   │   │       └── 📄 page.tsx  # Detail destinasi
│   │   ├── 📁 culture/
│   │   │   ├── 📄 page.tsx
│   │   │   └── 📁 [slug]/
│   │   ├── 📁 culinary/
│   │   ├── 📁 events/
│   │   ├── 📁 plan/
│   │   ├── 📁 gallery/
│   │   ├── 📁 info/
│   │   └── 📁 contact/
│   ├── 📁 api/                  # API Routes
│   │   ├── 📁 destinations/
│   │   │   └── 📄 route.ts
│   │   ├── 📁 events/
│   │   ├── 📁 contact/
│   │   └── 📁 newsletter/
│   ├── 📄 globals. css           # Global styles + Tailwind
│   └── 📄 favicon.ico
│
├── 📁 components/               # React Components
│   ├── 📁 ui/                   # Shadcn/ui components
│   │   ├── 📄 button.tsx
│   │   ├── 📄 card.tsx
│   │   ├── 📄 input.tsx
│   │   └── ... 
│   ├── 📁 layout/               # Layout components
│   │   ├── 📄 navbar.tsx
│   │   ├── 📄 footer.tsx
│   │   ├── 📄 mobile-menu.tsx
│   │   └── 📄 language-switcher.tsx
│   ├── 📁 home/                 # Homepage sections
│   │   ├── 📄 hero-section.tsx
│   │   ├── 📄 quick-access.tsx
│   │   ├── 📄 featured-destinations.tsx
│   │   ├── 📄 culture-highlight.tsx
│   │   ├── 📄 upcoming-events.tsx
│   │   ├── 📄 interactive-map.tsx
│   │   ├── 📄 weather-info.tsx
│   │   ├── 📄 instagram-feed.tsx
│   │   └── 📄 newsletter-signup.tsx
│   ├── 📁 destinations/
│   │   ├── 📄 destination-card.tsx
│   │   ├── 📄 destination-grid.tsx
│   │   └── 📄 destination-filter.tsx
│   └── 📁 shared/               # Shared/common components
│       ├── 📄 section-header.tsx
│       ├── 📄 loading-spinner.tsx
│       ├── 📄 image-lightbox.tsx
│       └── 📄 whatsapp-button.tsx
│
├── 📁 lib/                      # Utilities & Configurations
│   ├── 📄 db.ts                 # MongoDB connection
│   ├── 📄 utils.ts              # Helper functions (cn, etc)
│   └── 📄 validations.ts        # Zod schemas
│
├── 📁 models/                   # Mongoose Models
│   ├── 📄 Destination.ts
│   ├── 📄 Event.ts
│   ├── 📄 Culture.ts
│   ├── 📄 Accommodation.ts
│   ├── 📄 Restaurant.ts
│   ├── 📄 Article. ts
│   └── 📄 Subscriber.ts
│
├── 📁 messages/                 # i18n translations (next-intl)
│   ├── 📄 id. json               # Bahasa Indonesia
│   └── 📄 en.json               # English
│
├── 📁 hooks/                    # Custom React Hooks
│   ├── 📄 use-destinations.ts
│   ├── 📄 use-events. ts
│   └── 📄 use-weather.ts
│
├── 📁 types/                    # TypeScript Types
│   ├── 📄 destination.ts
│   ├── 📄 event.ts
│   └── 📄 index.ts
│
├── 📁 public/                   # Static assets
│   ├── 📁 images/
│   │   ├── 📁 destinations/
│   │   ├── 📁 culture/
│   │   └── 📁 heroes/
│   ├── 📁 icons/
│   └── 📄 logo.svg
│
├── 📁 data/                     # Dummy/Seed data (untuk development)
│   ├── 📄 destinations.json
│   ├── 📄 events.json
│   └── 📄 seed. ts
│
├── 📄 .env.local                # Environment variables
├── 📄 . env.example              # Environment template
├── 📄 next.config.ts            # Next.js configuration
├── 📄 tailwind.config.ts        # Tailwind configuration
├── 📄 tsconfig.json             # TypeScript configuration
├── 📄 middleware.ts             # Next.js middleware (i18n routing)
├── 📄 i18n.ts                   # i18n configuration
└── 📄 package.json
```

---

## 🏗️ STRUKTUR WEBSITE (SITEMAP)

```
🏠 HOMEPAGE (/)
├── 📍 DESTINASI (/destinations)
│   ├── /destinations? category=cultural
│   ├── /destinations?category=nature
│   ├── /destinations?category=village
│   └── /destinations/[slug]
├── 🎭 BUDAYA (/culture)
│   ├── /culture?type=ceremonies
│   ├── /culture?type=architecture
│   ├── /culture?type=arts
│   └── /culture/[slug]
├── 🍽️ KULINER (/culinary)
├── 📅 EVENT (/events)
│   └── /events/[slug]
├── 🏨 PLAN YOUR TRIP (/plan)
│   ├── /plan/getting-there
│   ├── /plan/accommodation
│   ├── /plan/tour-guides
│   └── /plan/travel-tips
├── 🗺️ PETA (/map)
├── 📰 ARTIKEL (/articles)
│   └── /articles/[slug]
├── 📸 GALERI (/gallery)
├── ℹ️ INFO (/info)
│   ├── /info/about-toraja
│   ├── /info/about-us
│   ├── /info/etiquette
│   ├── /info/emergency
│   └── /info/faq
└── 📞 KONTAK (/contact)
```

---

## 📱 KOMPONEN HOMEPAGE

Homepage harus memiliki section berikut (urutan dari atas ke bawah):

| No | Section | Component File | Deskripsi |
|----|---------|----------------|-----------|
| 1 | Navbar | `layout/navbar.tsx` | Sticky, logo, menu, language switcher, search |
| 2 | Hero | `home/hero-section.tsx` | Full-width video/image, tagline, search bar |
| 3 | Quick Access | `home/quick-access.tsx` | Horizontal icon menu (5-6 kategori) |
| 4 | Featured Destinations | `home/featured-destinations.tsx` | Grid 4 cards destinasi unggulan |
| 5 | Culture Highlight | `home/culture-highlight.tsx` | Full-width cultural section |
| 6 | Upcoming Events | `home/upcoming-events.tsx` | Carousel event cards |
| 7 | Interactive Map | `home/interactive-map.tsx` | Google Maps dengan markers |
| 8 | Weather & Info | `home/weather-info.tsx` | Widget cuaca + travel info |
| 9 | Instagram Feed | `home/instagram-feed.tsx` | Grid 6 foto Instagram |
| 10 | Newsletter | `home/newsletter-signup.tsx` | Email signup form |
| 11 | Footer | `layout/footer.tsx` | Links, contact, social media |
| 12 | Floating Elements | `shared/whatsapp-button.tsx` | WhatsApp button, back to top |

---

## 🗄️ MONGODB SCHEMAS

### Destination Schema
```typescript
// models/Destination.ts
import mongoose from 'mongoose';

const DestinationSchema = new mongoose. Schema({
  slug: { type: String, required: true, unique: true },
  
  title: {
    id: { type: String, required:  true },
    en: { type: String, required: true }
  },
  
  description: {
    id: { type: String, required: true },
    en: { type: String, required: true }
  },
  
  excerpt: {
    id: { type: String },
    en: { type: String }
  },
  
  category: {
    type: String,
    enum: ['cultural', 'nature', 'village'],
    required: true
  },
  
  tags: [String],
  
  featuredImage: { type: String, required: true },
  gallery: [String],
  
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number], // [longitude, latitude]
    address: {
      id: String,
      en: String
    }
  },
  
  openingHours: {
    id: String,
    en: String
  },
  
  entranceFee: {
    local: Number,
    foreign: Number,
    note: {
      id: String,
      en: String
    }
  },
  
  facilities: [{
    icon: String,
    name: {
      id: String,
      en: String
    }
  }],
  
  tips: {
    id: [String],
    en: [String]
  },
  
  meta: {
    title: { id: String, en: String },
    description: { id: String, en: String }
  },
  
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  
  isFeatured: { type: Boolean, default: false },
  isPublished: { type: Boolean, default: true },
  
}, { timestamps: true });

DestinationSchema.index({ location: '2dsphere' });

export default mongoose.models.Destination || 
  mongoose.model('Destination', DestinationSchema);
```

### Event Schema
```typescript
// models/Event.ts
const EventSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  
  title: {
    id: { type: String, required: true },
    en: { type: String, required:  true }
  },
  
  description: {
    id:  { type: String, required: true },
    en: { type:  String, required: true }
  },
  
  featuredImage: String,
  gallery: [String],
  
  startDate: { type: Date, required: true },
  endDate: { type:  Date },
  
  location: {
    venue: { id: String, en: String },
    address: { id: String, en: String },
    coordinates: [Number]
  },
  
  category: {
    type: String,
    enum: ['festival', 'ceremony', 'exhibition', 'other']
  },
  
  isRecurring: { type: Boolean, default: false },
  recurringInfo: { id: String, en: String },
  
  isFeatured: { type: Boolean, default: false },
  isPublished: { type: Boolean, default: true },
  
}, { timestamps: true });
```

---

## ✨ FITUR YANG HARUS ADA

### Fase 1 (Must Have)
- [x] Next.js 15 App Router setup
- [ ] Multi-language (ID/EN) dengan next-intl
- [ ] Responsive design (mobile-first)
- [ ] Homepage dengan semua sections
- [ ] Search & filter destinasi
- [ ] Interactive Google Maps
- [ ] Gallery dengan lightbox
- [ ] Event calendar/list
- [ ] Weather widget
- [ ] WhatsApp floating button
- [ ] Social media links
- [ ] Contact form
- [ ] Newsletter subscription
- [ ] SEO optimization (metadata, sitemap, robots)
- [ ] Image optimization dengan next/image

### Fase 1. 5 (Should Have)
- [ ] Live chat widget
- [ ] Blog/articles
- [ ] Testimonials
- [ ] Itinerary suggestions
- [ ] Downloadable PDF guide

### Fase 2 (Nice to Have)
- [ ] AI Chatbot
- [ ] Virtual tour 360°
- [ ] Itinerary builder
- [ ] User accounts

---

## 🖼️ ASET & KONTEN

### Dummy Images
Gunakan gambar dari Unsplash dengan keyword: 
- "Toraja traditional house"
- "Tongkonan"
- "Sulawesi landscape"
- "Indonesian culture ceremony"
- "Rice terrace Indonesia"
- "Mountain village Indonesia"
- "Indonesian coffee plantation"

### Placeholder
- Logo:  Text "EXPLORE TANA TORAJA" atau SVG placeholder
- Content: Dummy text dalam 2 bahasa (ID/EN)

---

## 🔧 ENVIRONMENT VARIABLES

```env
# .env.local

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/explore-tana-toraja

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="Explore Tana Toraja"

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Weather API (OpenWeatherMap atau WeatherAPI)
WEATHER_API_KEY=your_weather_api_key

# Cloudinary (untuk image hosting)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER=6281234567890
```

---

## 🎯 INSTRUKSI UNTUK AI

Ketika mengembangkan website ini: 

1. **Gunakan Next.js 15 App Router** dengan Server Components sebagai default
2. **TypeScript strict mode** - selalu definisikan types
3. **Tailwind CSS** untuk semua styling, gunakan design system yang sudah ditentukan
4. **Mobile-first approach** - desain untuk mobile dulu
5. **Shadcn/ui** untuk komponen UI dasar
6. **Framer Motion** untuk animasi smooth
7. **next-intl** untuk multilingual (ID/EN)
8. **Mongoose** untuk interaksi dengan MongoDB
9. **Optimasi performa** - lazy loading, image optimization
10. **SEO** - metadata, generateMetadata, sitemap
11. **Kode yang clean** dan well-commented
12. **Konsisten dengan referensi** visitseoul.net

---

## 🚀 TASK PERTAMA

Buatkan **halaman Homepage** lengkap dengan:
1. Setup project Next.js 15 + TypeScript + Tailwind
2. Konfigurasi next-intl untuk multilingual
3. Semua components homepage sesuai spesifikasi
4. Styling sesuai design system
5. Responsive (mobile-first)
6. Dummy data untuk content

Output dalam format yang bisa langsung dijalankan di Antigravity IDE. 