# 📚 DOKUMENTASI PROYEK - EXPLORE TANA TORAJA

## Riwayat Diskusi & Keputusan Desain

Dokumen ini berisi ringkasan lengkap hasil diskusi perencanaan website pariwisata resmi Kabupaten Tana Toraja. 

---

## 📅 Informasi Proyek

| Field | Value |
|-------|-------|
| **Nama Proyek** | Website Pariwisata Explore Tana Toraja |
| **Tanggal Mulai** | 3 Januari 2026 |
| **Status** | Fase Development |
| **PIC** | Dinas Pariwisata Kab. Tana Toraja |

---

## 1️⃣ IDENTITAS PROYEK

### 1.1 Tentang Website
Website resmi pariwisata untuk **Kabupaten Tana Toraja** (bukan Toraja Utara) yang dikelola oleh Pemerintah Daerah melalui Dinas Pariwisata. 

### 1.2 Branding
- **Nama**:  Explore Tana Toraja
- **Tagline**: "Where Ancestors Live Forever"
- **Tone**: Inspiratif, informatif, mengundang

### 1.3 Tujuan Website
1. Mempromosikan destinasi wisata unggulan Tana Toraja
2. Menampilkan atraksi wisata (budaya, alam, kuliner)
3. Menyediakan informasi amenitas (hotel, restoran, transportasi)
4. Memberikan informasi sarana pendukung (peta, kontak darurat, tips perjalanan)
5. Meningkatkan kunjungan wisatawan domestik dan mancanegara

---

## 2️⃣ TARGET AUDIENS

### 2.1 Demografi
| Aspek | Detail |
|-------|--------|
| **Cakupan** | Wisatawan Domestik & Mancanegara |
| **Usia Utama** | 25-35 tahun (Young Adults & Young Professionals) |
| **Tipe** | Backpacker, Keluarga, Cultural Tourism, Adventure |

### 2.2 Persona Pengguna

#### 🎒 Backpacker (Budget Traveler)
- **Kebutuhan**: Info budget accommodation, transportasi umum, rute murah
- **Fitur yang dibutuhkan**:  Estimasi biaya, tips hemat, hostel/homestay list
- **Behavior**: Mobile-first, suka explore sendiri

#### 👨‍👩‍👧‍👦 Family Traveler
- **Kebutuhan**: Family-friendly spots, keamanan, fasilitas anak
- **Fitur yang dibutuhkan**: Filter "cocok untuk anak", paket keluarga
- **Behavior**:  Planning matang, butuh info lengkap

#### 🏛️ Cultural Tourist
- **Kebutuhan**:  Upacara adat, sejarah, makna filosofi
- **Fitur yang dibutuhkan**: Kalender upacara, artikel budaya mendalam
- **Behavior**:  Mencari pengalaman autentik

#### ⛰️ Adventure Seeker
- **Kebutuhan**: Trekking, outdoor activities, hidden gems
- **Fitur yang dibutuhkan**: Difficulty level, peta jalur, info cuaca
- **Behavior**:  Suka tantangan, off-the-beaten-path

#### 🌏 International Tourist
- **Kebutuhan**:  English content, visa info, cultural etiquette
- **Behavior**: Perlu konteks budaya yang jelas

---

## 3️⃣ KEPUTUSAN TEKNIS

### 3.1 Platform & Tech Stack

| Komponen | Keputusan | Alasan |
|----------|-----------|--------|
| **CMS** | WordPress 6.x | Mudah dikelola tim non-teknis Pemda |
| **Theme** | Custom Theme | Fleksibilitas desain sesuai branding |
| **CSS Framework** | Tailwind CSS | Modern, utility-first, responsive |
| **JavaScript** | Vanilla JS / Alpine.js | Ringan, tidak perlu framework berat |
| **Multilingual** | WPML atau Polylang | Support mature untuk ID/EN |
| **SEO** | Yoast SEO | Plugin SEO terlengkap |
| **Caching** | WP Rocket | Performa optimal |
| **Forms** | Contact Form 7 / Gravity Forms | Untuk contact & newsletter |
| **Maps** | Google Maps API / Leaflet | Interactive map dengan markers |

### 3.2 Bahasa
- **Primary**:  Bahasa Indonesia
- **Secondary**: English
- **Switcher**: Toggle di navbar (ID | EN)

### 3.3 Integrasi yang Dibutuhkan
| Integrasi | Status | Keterangan |
|-----------|--------|------------|
| Google Maps | ✅ Fase 1 | Peta interaktif dengan markers |
| WhatsApp Business | ✅ Fase 1 | Floating button untuk inquiry |
| Social Media | ✅ Fase 1 | Instagram, Facebook, YouTube, Twitter |
| Kalender Event | ✅ Fase 1 | Display upcoming events |
| Weather Widget | ✅ Fase 1 | Cuaca real-time Tana Toraja |
| Live Chat | ✅ Fase 1 | Tawk.to atau sejenisnya |
| Payment Gateway | ❌ Tidak | Tidak ada sistem booking |
| AI Chatbot | 🔄 Fase 2 | Akan dikembangkan nanti |

### 3.4 Hosting Requirements
- Server Indonesia (untuk kecepatan akses lokal)
- SSL Certificate (HTTPS)
- Minimal 10GB storage
- Support PHP 8.x
- MySQL/MariaDB database

---

## 4️⃣ DESIGN SYSTEM

### 4.1 Referensi Visual
- **Website Referensi**: https://english.visitseoul.net/
- **Style**:  Modern, clean, vibrant, immersive imagery
- **Kesan yang ingin ditampilkan**: Profesional namun hangat, mengundang untuk berkunjung

### 4.2 Color Palette

#### Primary Colors (Vibrant & Terang)
| Nama | Hex Code | Penggunaan |
|------|----------|------------|
| Toraja Red | `#E63946` | Primary, CTA buttons, logo accent |
| Golden Sunrise | `#F4A261` | Secondary, highlights, hover states |
| Sky Blue | `#4ECDC4` | Accent, links, info elements |

#### Neutral Colors
| Nama | Hex Code | Penggunaan |
|------|----------|------------|
| Dark Slate | `#2D3436` | Headlines, dark text |
| Warm Gray | `#636E72` | Body text, secondary text |
| Light Cream | `#FDF6EC` | Page background |
| White Snow | `#FFFFFF` | Cards, containers |

#### Category Colors (untuk badges/tags)
| Kategori | Hex Code |
|----------|----------|
| 🏛️ Budaya | `#E63946` |
| ⛰️ Alam | `#2ECC71` |
| 🍽️ Kuliner | `#F4A261` |
| 🎭 Event | `#9B59B6` |
| 🏨 Amenitas | `#3498DB` |

### 4.3 Typography

| Tipe | Font Family | Weight |
|------|-------------|--------|
| Headings | Plus Jakarta Sans | 600, 700 |
| Body | Inter | 400, 500 |
| Accent/Quotes | Playfair Display | 400 italic |

#### Font Scale
```
H1: 48-64px (mobile:  32-40px)
H2: 36-48px (mobile: 28-32px)
H3: 24-32px (mobile: 20-24px)
H4: 20-24px (mobile: 18-20px)
Body: 16-18px
Small: 14px
Caption: 12px
```

### 4.4 Design Elements
- **Border Radius**: 8px (cards), 4px (buttons), 50% (avatars)
- **Shadows**: Subtle shadows untuk depth
- **Spacing**: 8px grid system (8, 16, 24, 32, 48, 64, 96)
- **Motif Accent**: Ukiran Toraja sebagai decorative elements (subtle)

---

## 5️⃣ ARSITEKTUR INFORMASI

### 5.1 Sitemap Lengkap

```
🏠 HOMEPAGE (/)
│
├── 📍 DESTINASI (/destinations)
│   ├── /destinations/cultural → Situs Budaya
│   │   ├── /destinations/cultural/kete-kesu
│   │   ├── /destinations/cultural/lemo
│   │   ├── /destinations/cultural/londa
│   │   ├── /destinations/cultural/bori-kalimbuang
│   │   └── /destinations/cultural/[slug]
│   ├── /destinations/nature → Wisata Alam
│   │   ├── /destinations/nature/batutumonga
│   │   ├── /destinations/nature/tilanga
│   │   ├── /destinations/nature/gunung-sesean
│   │   └── /destinations/nature/[slug]
│   └── /destinations/villages → Desa Wisata
│
├── 🎭 BUDAYA & TRADISI (/culture)
│   ├── /culture/ceremonies → Upacara Adat
│   │   ├── /culture/ceremonies/rambu-solo
│   │   ├── /culture/ceremonies/rambu-tuka
│   │   └── /culture/ceremonies/manene
│   ├── /culture/architecture → Tongkonan
│   ├── /culture/arts → Kesenian & Tarian
│   └── /culture/crafts → Kerajinan
│
├── 🍽️ KULINER (/culinary)
│   ├── /culinary/traditional-food
│   ├── /culinary/coffee
│   └── /culinary/restaurants
│
├── 📅 EVENT (/events)
│   ├── /events/calendar
│   ├── /events/lovely-december
│   └── /events/[event-slug]
│
├── 🏨 PLAN YOUR TRIP (/plan)
│   ├── /plan/getting-there
│   ├── /plan/accommodation
│   ├── /plan/tour-guides
│   ├── /plan/itineraries
│   └── /plan/travel-tips
│
├── 🗺️ PETA INTERAKTIF (/map)
│
├── 📰 ARTIKEL/BLOG (/articles)
│   └── /articles/[slug]
│
├── 📸 GALERI (/gallery)
│   ├── /gallery/photos
│   └── /gallery/videos
│
├── ℹ️ INFORMASI (/info)
│   ├── /info/about-toraja
│   ├── /info/about-us
│   ├── /info/etiquette
│   ├── /info/emergency
│   └── /info/faq
│
├── 📞 KONTAK (/contact)
│
├── 🔍 PENCARIAN (/search)
│
└── ⚖️ LEGAL
    ├── /privacy-policy
    └── /terms
```

### 5.2 Navigasi Utama (Navbar)
```
[Logo] | Destinasi ▼ | Budaya ▼ | Kuliner | Event | Plan Your Trip ▼ | [Search] | [ID|EN]
```

### 5.3 Footer Navigation
```
EXPLORE          PLAN YOUR TRIP    ABOUT           CONNECT
- Destinations   - Getting There   - About Toraja  - Facebook
- Culture        - Accommodation   - About Us      - Instagram  
- Events         - Tour Guides     - Contact       - Twitter
- Culinary       - Travel Tips     - Privacy       - YouTube
- Gallery        - Itineraries     - FAQ           - WhatsApp
```

---

## 6️⃣ SPESIFIKASI HALAMAN HOMEPAGE

### 6.1 Section Breakdown

| No | Section | Deskripsi |
|----|---------|-----------|
| 1 | **Navbar** | Sticky navigation, logo, menu, language switcher, search |
| 2 | **Hero** | Full-width video/image slider, tagline overlay, search bar, scroll indicator |
| 3 | **Quick Access** | Horizontal scrollable icon menu (5-6 kategori) |
| 4 | **Featured Destinations** | Grid 3-4 cards destinasi unggulan dengan image, title, category tag |
| 5 | **Culture Highlight** | Full-width section dengan background image, quote, CTA button |
| 6 | **Upcoming Events** | Carousel/slider cards event dengan tanggal |
| 7 | **Interactive Map** | Google Maps embed dengan markers kategori |
| 8 | **Weather & Info** | Widget cuaca + quick travel info |
| 9 | **Instagram Feed** | Grid 6 foto dari hashtag |
| 10 | **Newsletter** | Signup form dengan email input |
| 11 | **Footer** | Multi-column links, contact, social, copyright |
| 12 | **Floating Elements** | WhatsApp button (bottom right), Back to top |

### 6.2 Hero Section Specs
- **Height**: 100vh (full viewport)
- **Background**: Video loop atau image slider (3-5 images)
- **Overlay**: Gradient dark overlay untuk text readability
- **Content**: 
  - Logo atau site title
  - Tagline:  "Where Ancestors Live Forever"
  - Search bar dengan placeholder "Search destinations, events..."
  - Scroll down indicator (animated)

### 6.3 Card Component Specs
```
┌─────────────────────┐
│ ┌─────────────────┐ │
│ │                 │ │
│ │     IMAGE       │ │  → Aspect ratio 4:3 atau 16:9
│ │                 │ │  → Lazy loading
│ │                 │ │
│ └─────────────────┘ │
│ [🏛️ Category Tag]   │  → Colored badge
│                     │
│ Destination Title   │  → H3, bold
│                     │
│ Short description   │  → 2 lines max, truncate
│ that explains...     │
│                     │
│ ⭐ 4.8  📍 Location │  → Rating + location
└─────────────────────┘
```

---

## 7️⃣ FITUR & FUNGSIONALITAS

### 7.1 Fitur Fase 1 (Must Have)

| Fitur | Priority | Status |
|-------|----------|--------|
| Multi-language (ID/EN) | 🔴 High | To Do |
| Responsive design | 🔴 High | To Do |
| Search & filter | 🔴 High | To Do |
| Interactive Maps | 🔴 High | To Do |
| Image Gallery + Lightbox | 🔴 High | To Do |
| Event Calendar | 🔴 High | To Do |
| Weather Widget | 🔴 High | To Do |
| WhatsApp Button | 🔴 High | To Do |
| Social Media Links | 🔴 High | To Do |
| Contact Form | 🔴 High | To Do |
| Newsletter Signup | 🔴 High | To Do |
| SEO Optimization | 🔴 High | To Do |
| Performance Optimization | 🔴 High | To Do |

### 7.2 Fitur Fase 1. 5 (Should Have)

| Fitur | Priority | Status |
|-------|----------|--------|
| Live Chat Widget | 🟡 Medium | Backlog |
| Blog/Articles | 🟡 Medium | Backlog |
| Testimonials | 🟡 Medium | Backlog |
| Itinerary Suggestions | 🟡 Medium | Backlog |
| Downloadable PDF Guide | 🟡 Medium | Backlog |

### 7.3 Fitur Fase 2 (Nice to Have)

| Fitur | Priority | Status |
|-------|----------|--------|
| AI Chatbot | 🟢 Low | Future |
| Virtual Tour 360° | 🟢 Low | Future |
| Itinerary Builder | 🟢 Low | Future |
| User Accounts | 🟢 Low | Future |

---

## 8️⃣ KONTEN YANG DIPERLUKAN

### 8.1 Status Konten
- **Foto/Video**:  Menggunakan dummy images dari Unsplash/Pexels
- **Teks**:  Dummy content dalam 2 bahasa
- **Logo**: Text placeholder "EXPLORE TANA TORAJA"

### 8.2 Dummy Image Keywords
Gunakan keyword berikut untuk mencari dummy images:
- "Toraja traditional house"
- "Tongkonan"
- "Sulawesi landscape"
- "Indonesian funeral ceremony"
- "Rice terrace Indonesia"
- "Traditional Indonesian culture"
- "Mountain village Indonesia"
- "Indonesian coffee"

### 8.3 Content Checklist (untuk production nanti)

#### Homepage
- [ ] Hero video/images (5-10 high-res)
- [ ] Tagline & description (ID/EN)
- [ ] 4-6 featured destinations dengan foto & deskripsi

#### Per Destinasi
- [ ] Nama tempat (ID/EN)
- [ ] Deskripsi 300-500 kata (ID/EN)
- [ ] 5-10 foto berkualitas
- [ ] Koordinat GPS
- [ ] Jam operasional
- [ ] Harga tiket
- [ ] Fasilitas
- [ ] Tips berkunjung

---

## 9️⃣ PRIORITAS DEVELOPMENT

| Urutan | Area | Deliverable |
|--------|------|-------------|
| 1 | 🎨 Desain UI/UX | Wireframe, mockup, design system |
| 2 | ⚙️ Fitur | Spesifikasi fitur, user flow |
| 3 | 📐 Struktur | Sitemap, arsitektur, database |
| 4 | 📝 Konten | Template konten, copywriting |
| 5 | 💻 Kode | Implementasi frontend & backend |

---

## 🔟 CATATAN PENTING

1. **Wilayah**:  Website ini khusus untuk **Kabupaten Tana Toraja**, BUKAN Kabupaten Toraja Utara.  Pastikan semua konten dan destinasi sesuai wilayah.

2. **Official Website**:  Ini adalah website resmi pemerintah, jadi harus profesional, akurat, dan dapat dipercaya.

3. **Multilingual**: Semua konten harus disiapkan dalam 2 bahasa (ID & EN) sejak awal development.

4. **Mobile-First**: Mayoritas target audiens usia 25-35 akan mengakses via mobile, jadi prioritaskan mobile experience.

5. **Performance**: Website harus cepat meskipun banyak gambar.  Implementasikan lazy loading, image optimization, dan caching.

6. **SEO**: Sebagai website pariwisata official, harus mudah ditemukan di search engine untuk keyword terkait Tana Toraja.

---

## 📎 LAMPIRAN

### A. Link Referensi
- Referensi desain:  https://english.visitseoul.net/

### B. Tools yang Direkomendasikan
- Design:  Figma
- Icons: Heroicons, Phosphor Icons
- Images: Unsplash, Pexels
- Maps: Google Maps API, Leaflet
- Fonts: Google Fonts

### C. Color Codes Quick Reference
```css
: root {
  --color-primary: #E63946;
  --color-secondary: #F4A261;
  --color-accent: #4ECDC4;
  --color-dark: #2D3436;
  --color-gray: #636E72;
  --color-cream: #FDF6EC;
  --color-white: #FFFFFF;
  
  --color-cat-budaya: #E63946;
  --color-cat-alam: #2ECC71;
  --color-cat-kuliner: #F4A261;
  --color-cat-event:  #9B59B6;
  --color-cat-amenitas: #3498DB;
}
```

---

**Dokumen ini akan diupdate seiring perkembangan proyek.**

*Last updated: 3 Januari 2026*