import { Metadata } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://exploretanatoraja.com'
const SITE_NAME = 'Explore Tana Toraja'
const TAGLINE = 'Where Ancestors Live Forever'

// Default SEO metadata
export const defaultMetadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: `${SITE_NAME} - ${TAGLINE}`,
        template: `%s | ${SITE_NAME}`,
    },
    description: `Discover the beauty of Tana Toraja, Indonesia. Explore traditional Tongkonan houses, ancient burial sites, cultural ceremonies, and stunning natural landscapes. Plan your perfect trip to the land where ancestors live forever.`,
    keywords: [
        'Tana Toraja',
        'Toraja',
        'Indonesia tourism',
        'Sulawesi travel',
        'Tongkonan',
        'Rambu Solo',
        'Indonesian culture',
        'traditional houses',
        'cultural tourism',
        'Indonesia travel guide',
        'South Sulawesi',
        'Toraja culture',
        'Indonesian heritage',
        'Toraja funeral ceremony',
        'Kete Kesu',
        'Londa',
        'Batutumonga',
    ],
    authors: [{ name: 'Dinas Pariwisata Kabupaten Tana Toraja' }],
    creator: 'Dinas Pariwisata Kabupaten Tana Toraja',
    publisher: 'Dinas Pariwisata Kabupaten Tana Toraja',
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    openGraph: {
        type: 'website',
        siteName: SITE_NAME,
        title: `${SITE_NAME} - ${TAGLINE}`,
        description: `Discover the beauty of Tana Toraja, Indonesia. Explore traditional Tongkonan houses, ancient burial sites, cultural ceremonies, and stunning natural landscapes.`,
        url: SITE_URL,
        locale: 'id_ID',
        alternateLocale: ['en_US'],
        images: [
            {
                url: `${SITE_URL}/og-image.jpg`,
                width: 1200,
                height: 630,
                alt: `${SITE_NAME} - ${TAGLINE}`,
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: `${SITE_NAME} - ${TAGLINE}`,
        description: `Discover the beauty of Tana Toraja, Indonesia. Explore traditional Tongkonan houses, ancient burial sites, cultural ceremonies, and stunning natural landscapes.`,
        images: [`${SITE_URL}/og-image.jpg`],
        creator: '@exploretanatoraja',
    },
    verification: {
        google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    },
}

// Generate metadata for specific pages
export function generatePageMetadata(params: {
    title: string
    description: string
    path: string
    image?: string
    keywords?: string[]
    locale?: string
}): Metadata {
    const { title, description, path, image, keywords, locale = 'id' } = params
    const url = `${SITE_URL}/${locale}${path}`
    const ogImage = image || `${SITE_URL}/og-image.jpg`

    return {
        title,
        description,
        keywords: keywords || defaultMetadata.keywords,
        alternates: {
            canonical: url,
            languages: {
                id: `${SITE_URL}/id${path}`,
                en: `${SITE_URL}/en${path}`,
            },
        },
        openGraph: {
            ...defaultMetadata.openGraph,
            title,
            description,
            url,
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
            locale: locale === 'id' ? 'id_ID' : 'en_US',
        },
        twitter: {
            ...defaultMetadata.twitter,
            title,
            description,
            images: [ogImage],
        },
    }
}

// Generate JSON-LD structured data for Organization
export function generateOrganizationJsonLd() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/logo.png`,
        description: 'Official tourism website of Tana Toraja Regency, South Sulawesi, Indonesia',
        address: {
            '@type': 'PostalAddress',
            addressLocality: 'Makale',
            addressRegion: 'South Sulawesi',
            addressCountry: 'ID',
        },
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+62-xxx-xxxx-xxxx',
            contactType: 'customer service',
        },
        sameAs: [
            'https://www.facebook.com/exploretanatoraja',
            'https://www.instagram.com/exploretanatoraja',
            'https://www.youtube.com/exploretanatoraja',
        ],
    }
}

// Generate JSON-LD structured data for WebSite
export function generateWebSiteJsonLd() {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SITE_NAME,
        url: SITE_URL,
        description: `Official tourism website of Tana Toraja Regency - ${TAGLINE}`,
        potentialAction: {
            '@type': 'SearchAction',
            target: `${SITE_URL}/search?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
        },
    }
}

// Generate JSON-LD structured data for Place/TouristDestination
export function generatePlaceJsonLd(params: {
    name: string
    description: string
    image: string
    url: string
    address?: string
    coordinates?: { lat: number; lng: number }
    priceRange?: string
    openingHours?: string
}) {
    const { name, description, image, url, address, coordinates, priceRange, openingHours } = params

    const place: any = {
        '@context': 'https://schema.org',
        '@type': 'TouristAttraction',
        name,
        description,
        image,
        url,
        touristType: 'Cultural Tourism',
    }

    if (address) {
        place.address = {
            '@type': 'PostalAddress',
            addressLocality: 'Tana Toraja',
            addressRegion: 'South Sulawesi',
            addressCountry: 'ID',
            streetAddress: address,
        }
    }

    if (coordinates) {
        place.geo = {
            '@type': 'GeoCoordinates',
            latitude: coordinates.lat,
            longitude: coordinates.lng,
        }
    }

    if (priceRange) {
        place.priceRange = priceRange
    }

    if (openingHours) {
        place.openingHoursSpecification = {
            '@type': 'OpeningHoursSpecification',
            openingHours,
        }
    }

    return place
}

// Generate JSON-LD structured data for Event
export function generateEventJsonLd(params: {
    name: string
    description: string
    image: string
    url: string
    startDate: string
    endDate?: string
    location?: string
    address?: string
}) {
    const { name, description, image, url, startDate, endDate, location, address } = params

    const event: any = {
        '@context': 'https://schema.org',
        '@type': 'Event',
        name,
        description,
        image,
        url,
        startDate: new Date(startDate).toISOString(),
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    }

    if (endDate) {
        event.endDate = new Date(endDate).toISOString()
    }

    if (location || address) {
        event.location = {
            '@type': 'Place',
            name: location || 'Tana Toraja',
            address: {
                '@type': 'PostalAddress',
                addressLocality: 'Tana Toraja',
                addressRegion: 'South Sulawesi',
                address: address || 'Tana Toraja, South Sulawesi, Indonesia',
            },
        }
    }

    return event
}

// Generate JSON-LD structured data for BreadcrumbList
export function generateBreadcrumbJsonLd(params: {
    items: Array<{ name: string; url: string }>
}) {
    const { items } = params

    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    }
}

// Generate JSON-LD structured data for FAQPage
export function generateFAQJsonLd(params: {
    questions: Array<{ question: string; answer: string }>
}) {
    const { questions } = params

    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: questions.map((q) => ({
            '@type': 'Question',
            name: q.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: q.answer,
            },
        })),
    }
}
