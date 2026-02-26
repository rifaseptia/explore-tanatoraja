import { MetadataRoute } from 'next'
import dbConnect from '@/lib/mongodb'
import Destination from '@/models/Destination'
import Event from '@/models/Event'
import Culinary from '@/models/Culinary'
import Accommodation from '@/models/Accommodation'
import Transport from '@/models/Transport'
import Article from '@/models/Article'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://exploretanatoraja.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Static routes
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: SITE_URL,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${SITE_URL}/id`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${SITE_URL}/en`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${SITE_URL}/id/destinations`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${SITE_URL}/en/destinations`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${SITE_URL}/id/culinary`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${SITE_URL}/en/culinary`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${SITE_URL}/id/events`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${SITE_URL}/en/events`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${SITE_URL}/id/articles`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${SITE_URL}/en/articles`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${SITE_URL}/id/stay`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${SITE_URL}/en/stay`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${SITE_URL}/id/transport`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${SITE_URL}/en/transport`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${SITE_URL}/id/gallery`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${SITE_URL}/en/gallery`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${SITE_URL}/id/terms`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.5,
        },
        {
            url: `${SITE_URL}/en/terms`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.5,
        },
        {
            url: `${SITE_URL}/id/privacy-policy`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.5,
        },
        {
            url: `${SITE_URL}/en/privacy-policy`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.5,
        },
        {
            url: `${SITE_URL}/id/about-us`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${SITE_URL}/en/about-us`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
    ]

    try {
        // Connect to database
        await dbConnect()

        // Dynamic routes for destinations
        const destinations = await Destination.find({ isPublished: true }).select('slug updatedAt').lean()
        const destinationRoutes: MetadataRoute.Sitemap = destinations.flatMap((dest) => [
            {
                url: `${SITE_URL}/id/destinations/${dest.slug}`,
                lastModified: dest.updatedAt || new Date(),
                changeFrequency: 'weekly',
                priority: 0.85,
            },
            {
                url: `${SITE_URL}/en/destinations/${dest.slug}`,
                lastModified: dest.updatedAt || new Date(),
                changeFrequency: 'weekly',
                priority: 0.85,
            },
        ])

        // Dynamic routes for events
        const events = await Event.find({ isPublished: true }).select('slug updatedAt').lean()
        const eventRoutes: MetadataRoute.Sitemap = events.flatMap((event) => [
            {
                url: `${SITE_URL}/id/events/${event.slug}`,
                lastModified: event.updatedAt || new Date(),
                changeFrequency: 'daily',
                priority: 0.85,
            },
            {
                url: `${SITE_URL}/en/events/${event.slug}`,
                lastModified: event.updatedAt || new Date(),
                changeFrequency: 'daily',
                priority: 0.85,
            },
        ])

        // Dynamic routes for articles
        const articles = await Article.find({ isPublished: true }).select('slug updatedAt').lean()
        const articleRoutes: MetadataRoute.Sitemap = articles.flatMap((article) => [
            {
                url: `${SITE_URL}/id/articles/${article.slug}`,
                lastModified: article.updatedAt || new Date(),
                changeFrequency: 'weekly',
                priority: 0.75,
            },
            {
                url: `${SITE_URL}/en/articles/${article.slug}`,
                lastModified: article.updatedAt || new Date(),
                changeFrequency: 'weekly',
                priority: 0.75,
            },
        ])

        // Dynamic routes for culinary
        const culinary = await Culinary.find({ isPublished: true }).select('slug updatedAt').lean()
        const culinaryRoutes: MetadataRoute.Sitemap = culinary.flatMap((item) => [
            {
                url: `${SITE_URL}/id/culinary/${item.slug}`,
                lastModified: item.updatedAt || new Date(),
                changeFrequency: 'weekly',
                priority: 0.75,
            },
            {
                url: `${SITE_URL}/en/culinary/${item.slug}`,
                lastModified: item.updatedAt || new Date(),
                changeFrequency: 'weekly',
                priority: 0.75,
            },
        ])

        // Dynamic routes for accommodations
        const accommodations = await Accommodation.find({ isPublished: true }).select('slug updatedAt').lean()
        const accommodationRoutes: MetadataRoute.Sitemap = accommodations.flatMap((acc) => [
            {
                url: `${SITE_URL}/id/stay/${acc.slug}`,
                lastModified: acc.updatedAt || new Date(),
                changeFrequency: 'weekly',
                priority: 0.75,
            },
            {
                url: `${SITE_URL}/en/stay/${acc.slug}`,
                lastModified: acc.updatedAt || new Date(),
                changeFrequency: 'weekly',
                priority: 0.75,
            },
        ])

        // Dynamic routes for transport
        const transports = await Transport.find({ isPublished: true }).select('slug updatedAt').lean()
        const transportRoutes: MetadataRoute.Sitemap = transports.flatMap((trans) => [
            {
                url: `${SITE_URL}/id/transport/${trans.slug}`,
                lastModified: trans.updatedAt || new Date(),
                changeFrequency: 'monthly',
                priority: 0.7,
            },
            {
                url: `${SITE_URL}/en/transport/${trans.slug}`,
                lastModified: trans.updatedAt || new Date(),
                changeFrequency: 'monthly',
                priority: 0.7,
            },
        ])

        return [
            ...staticRoutes,
            ...destinationRoutes,
            ...eventRoutes,
            ...articleRoutes,
            ...culinaryRoutes,
            ...accommodationRoutes,
            ...transportRoutes,
        ]
    } catch (error) {
        console.error('Error generating sitemap:', error)
        return staticRoutes
    }
}
