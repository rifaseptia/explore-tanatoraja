import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Destination from '@/models/Destination';

export async function GET() {
    try {
        await dbConnect();
        const destinations = await Destination.find({});
        const updates = [];

        for (const dest of destinations) {
            const originalSlug = dest.slug;

            // Create clean slug from English title (fallback to ID title if EN missing)
            const titleSource = dest.title.en || dest.title.id || 'untitled';
            const cleanSlug = titleSource
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
                .replace(/\s+/g, '-')         // Replace spaces with dash
                .replace(/-+/g, '-')          // Remove duplicate dashes
                .trim();

            if (originalSlug !== cleanSlug) {
                // Check uniqueness
                let finalSlug = cleanSlug;
                let counter = 1;
                while (await Destination.findOne({ slug: finalSlug, _id: { $ne: dest._id } })) {
                    finalSlug = `${cleanSlug}-${counter}`;
                    counter++;
                }

                updates.push({
                    original: originalSlug,
                    new: finalSlug,
                    title: dest.title.en
                });

                // Update directly
                await Destination.updateOne({ _id: dest._id }, { $set: { slug: finalSlug } });
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Slugs sanitized successfully',
            updates
        });
    } catch (error) {
        console.error('Slug fix error:', error);
        return NextResponse.json({ error: 'Failed to fix slugs' }, { status: 500 });
    }
}
