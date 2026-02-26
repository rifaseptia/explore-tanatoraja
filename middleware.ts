import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default createMiddleware({
    // A list of all locales that are supported
    locales: ['id', 'en'],

    // Used when no locale matches
    defaultLocale: 'id',

    // Don't prefix the default locale
    localePrefix: 'always'
});

export const config = {
    // Match only internationalized pathnames
    matcher: ['/((?!api|admin|_next|_vercel|.*\\..*).*)']
};
