import HeroSection from '@/components/home/hero-section';
import dbConnect from '@/lib/mongodb';
import DestinationModel from '@/models/Destination';
import EventModel from '@/models/Event';
import HeroSlide from '@/models/HeroSlide';
import { Destination } from '@/types/destination';
import { Event } from '@/types/event';
import QuickAccess from '@/components/home/quick-access';
import FeaturedDestinations from '@/components/home/featured-destinations';
import CultureHighlight from '@/components/home/culture-highlight';
import UpcomingEvents from '@/components/home/upcoming-events';
import RambuSoloSection from '@/components/home/rambu-solo-section';
import WeatherInfo from '@/components/home/weather-info';
import LatestArticles from '@/components/home/latest-articles';
import InstagramFeed from '@/components/home/instagram-feed';
import NewsletterSignup from '@/components/home/newsletter-signup';
import { setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import { generatePageMetadata, generateWebSiteJsonLd, generateOrganizationJsonLd } from '@/lib/seo';
import InteractiveMapWrapper from '@/components/home/interactive-map-wrapper';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const title = locale === 'id'
    ? 'Beranda - Jelajahi Keindahan Tana Toraja'
    : 'Home - Discover the Beauty of Tana Toraja';

  const description = locale === 'id'
    ? 'Selamat datang di website resmi pariwisata Kabupaten Tana Toraja. Jelajahi destinasi wisata budaya, alam, dan kuliner yang menakjubkan di tanah leluhur.'
    : 'Welcome to the official tourism website of Tana Toraja Regency. Explore amazing cultural, natural, and culinary destinations in the land of ancestors.';

  return generatePageMetadata({
    title,
    description,
    path: '/',
    keywords: [
      'Tana Toraja',
      'Toraja',
      'wisata Toraja',
      'Toraja tourism',
      'Tongkonan',
      'Rambu Solo',
      'South Sulawesi',
      'Indonesia tourism',
    ],
    locale,
  });
}

async function getFeaturedDestinations() {
  await dbConnect();
  const destinations = await DestinationModel.find({ isFeatured: true, isPublished: true })
    .sort({ createdAt: -1 })
    .limit(6)
    .lean();

  return JSON.parse(JSON.stringify(destinations)) as Destination[];
}

async function getUpcomingEvents() {
  await dbConnect();
  // Get start of today (midnight)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Show events that are:
  // 1. Still ongoing (endDate >= today), OR
  // 2. Starting in the future (startDate >= today AND no endDate)
  // 3. Single-day events starting today (startDate >= today)
  const events = await EventModel.find({
    isPublished: true,
    isRambuSolo: false,
    $or: [
      // Multi-day events: show if endDate hasn't passed
      { endDate: { $gte: today } },
      // Single-day events or events without endDate: show if startDate hasn't passed
      { endDate: null, startDate: { $gte: today } },
      { endDate: { $exists: false }, startDate: { $gte: today } }
    ]
  })
    .sort({ startDate: 1 })
    .limit(5)
    .lean();

  return JSON.parse(JSON.stringify(events)) as Event[];
}

async function getHeroSlides() {
  await dbConnect();
  const slides = await HeroSlide.find({ isActive: true, $or: [{ page: 'home' }, { page: { $exists: false } }] }).sort({ order: 1 }).lean();

  return JSON.parse(JSON.stringify(slides));
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const heroSlides = await getHeroSlides();
  const featuredDestinations = await getFeaturedDestinations();
  const upcomingEvents = await getUpcomingEvents();

  // Generate JSON-LD structured data
  const webSiteJsonLd = generateWebSiteJsonLd();
  const organizationJsonLd = generateOrganizationJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <HeroSection slides={heroSlides} locale={locale} />
      <QuickAccess />
      <FeaturedDestinations destinations={featuredDestinations} />
      <UpcomingEvents events={upcomingEvents} />
      <RambuSoloSection />
      <InteractiveMapWrapper />
      <LatestArticles />
      <InstagramFeed />
      <WeatherInfo />
      <NewsletterSignup />
    </>
  );
}

