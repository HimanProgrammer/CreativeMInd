import { SITE } from '@/lib/siteConfig';

// Served at /robots.txt — tells search engines what to crawl.
export default function robots() {
  const base = SITE.website.replace(/\/$/, '');
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Keep the admin panel and API endpoints out of the index.
        disallow: ['/admin', '/api'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
