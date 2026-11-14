import { SITE } from '@/lib/siteConfig';
import { supabase } from '@/lib/supabase';
import { STATIC_POSTS } from '@/common/blogPosts';

export const dynamic = 'force-dynamic';

// The canonical, publicly-linked pages (not the leftover template demos, not
// admin/api). priority/changeFrequency are hints Google may use.
const ROUTES = [
  { path: '',                        priority: 1.0, changeFrequency: 'weekly' },
  { path: 'page-about',              priority: 0.8, changeFrequency: 'monthly' },
  { path: 'page-services',           priority: 0.9, changeFrequency: 'monthly' },
  { path: 'service-web-development', priority: 0.8, changeFrequency: 'monthly' },
  { path: 'service-app-development', priority: 0.8, changeFrequency: 'monthly' },
  { path: 'service-seo',             priority: 0.8, changeFrequency: 'monthly' },
  { path: 'service-social-media',    priority: 0.8, changeFrequency: 'monthly' },
  { path: 'service-ui-ux-design',    priority: 0.8, changeFrequency: 'monthly' },
  { path: 'service-branding',        priority: 0.8, changeFrequency: 'monthly' },
  { path: 'portfolio-masonry',       priority: 0.9, changeFrequency: 'weekly' },
  { path: 'blog-grid-3column',       priority: 0.7, changeFrequency: 'weekly' },
  { path: 'page-team',               priority: 0.6, changeFrequency: 'monthly' },
  { path: 'page-contact',            priority: 0.7, changeFrequency: 'yearly' },
  { path: 'page-FAQ',                priority: 0.5, changeFrequency: 'yearly' },
  { path: 'privacy-policy',          priority: 0.3, changeFrequency: 'yearly' },
];

export default async function sitemap() {
  const base = SITE.website.replace(/\/$/, '');
  const now = new Date();

  const pages = ROUTES.map((r) => ({
    url: r.path ? `${base}/${r.path}` : `${base}/`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  // Individual blog articles. Prefer real published posts; fall back to the
  // shared static set so every "Read more" URL is discoverable.
  const slugs = new Map();
  try {
    const { data } = await supabase
      .from('blog_posts')
      .select('slug,published_at,status')
      .eq('status', 'published');
    (data || []).forEach((p) => { if (p.slug) slugs.set(p.slug, p.published_at); });
  } catch { /* fall back below */ }
  if (!slugs.size) STATIC_POSTS.forEach((p) => slugs.set(p.slug, null));

  const posts = [...slugs.entries()].map(([slug, date]) => ({
    url: `${base}/blog-details?slug=${slug}`,
    lastModified: date ? new Date(date) : now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...pages, ...posts];
}
