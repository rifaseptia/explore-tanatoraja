import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';

export const locales = ['id', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'id';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(locales, requested) ? requested : defaultLocale;

  // Use explicit imports instead of dynamic to avoid Turbopack issues
  const messages = locale === 'id'
    ? (await import('../messages/id.json')).default
    : (await import('../messages/en.json')).default;

  return {
    locale,
    messages
  };
});
