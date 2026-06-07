import { NextResponse } from 'next/server';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const MAX_IMAGES      = 60;
const MAX_SIZE_MB     = 10;
const TIMEOUT_MS      = 8000;
const SKIP_EXTENSIONS = ['.svg', '.ico', '.gif'];
const IMAGE_EXTS      = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.tiff', '.bmp'];
const BUCKET          = 'portfolio-images';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return createClient(url, key);
}

export async function POST(request) {
  try {
    const { url, folder } = await request.json();
    if (!url) return NextResponse.json({ error: 'URL is required' }, { status: 400 });

    const targetUrl  = url.startsWith('http') ? url : `https://${url}`;
    const origin     = new URL(targetUrl).origin;

    // 1. Fetch page HTML
    const html = await fetchWithTimeout(targetUrl, TIMEOUT_MS);
    if (!html) return NextResponse.json({ error: 'Could not fetch the page' }, { status: 400 });

    // 2. Extract image URLs from HTML
    const rawUrls    = extractImageUrls(html, targetUrl, origin);
    const supabase   = getSupabase();
    const folderName = folder || Date.now().toString();
    const results    = [];
    const seen       = new Set();

    // 3. Download each image into memory → upload to Supabase Storage
    for (const imgUrl of rawUrls.slice(0, MAX_IMAGES)) {
      if (seen.has(imgUrl)) continue;
      seen.add(imgUrl);
      try {
        const result = await downloadAndUpload(imgUrl, supabase, folderName);
        if (result) results.push(result);
      } catch { /* skip silently */ }
    }

    return NextResponse.json({ success: true, total: results.length, folder: folderName, images: results });

  } catch (err) {
    console.error('Scrape error:', err);
    return NextResponse.json({ error: err.message || 'Scrape failed' }, { status: 500 });
  }
}

// Download image into memory buffer → upload directly to Supabase Storage
async function downloadAndUpload(imgUrl, supabase, folderName) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  let res;
  try {
    res = await fetch(imgUrl, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ImageScraper/1.0)' },
    });
  } finally { clearTimeout(timer); }

  if (!res.ok) return null;
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.startsWith('image/')) return null;

  const buffer = await res.arrayBuffer();
  const bytes  = buffer.byteLength;
  if (bytes < 2048 || bytes > MAX_SIZE_MB * 1024 * 1024) return null;

  // Build filename from URL
  let rawName = decodeURIComponent(new URL(imgUrl).pathname.split('/').pop()) || 'image';
  rawName = rawName.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 80);
  if (!path.extname(rawName)) {
    const ext = contentType.split('/')[1]?.split(';')[0] || 'jpg';
    rawName += `.${ext}`;
  }

  // Unique storage path: scraped/<folder>/<timestamp>_<name>
  const storagePath = `scraped/${folderName}/${Date.now()}_${rawName}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, Buffer.from(buffer), { contentType, upsert: false });

  if (error) { console.warn(`Upload failed for ${imgUrl}:`, error.message); return null; }

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);

  return { filename: rawName, url: urlData.publicUrl, sourceUrl: imgUrl, size: Math.round(bytes / 1024), width: null };
}

// ── Helpers ─────────────────────────────────────────────────

async function fetchWithTimeout(url, ms) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ImageScraper/1.0)' },
    });
    clearTimeout(timer);
    return res.ok ? res.text() : null;
  } catch {
    clearTimeout(timer);
    return null;
  }
}

function extractImageUrls(html, pageUrl, origin) {
  const urls = new Set();
  const base = new URL(pageUrl);

  // <img src="...">
  const imgSrcRe = /<img[^>]+src=["']([^"'>\s]+)["']/gi;
  let m;
  while ((m = imgSrcRe.exec(html)) !== null) addResolved(urls, m[1], origin, base);

  // <img srcset="...">
  const srcsetRe = /<img[^>]+srcset=["']([^"']+)["']/gi;
  while ((m = srcsetRe.exec(html)) !== null) {
    m[1].split(',').forEach((part) => {
      const src = part.trim().split(/\s+/)[0];
      if (src) addResolved(urls, src, origin, base);
    });
  }

  // data-src (lazy loading)
  const dataSrcRe = /data-src=["']([^"'>\s]+)["']/gi;
  while ((m = dataSrcRe.exec(html)) !== null) addResolved(urls, m[1], origin, base);

  // background-image: url(...)
  const bgRe = /url\(['"]?([^'")>\s]+\.(jpg|jpeg|png|webp|avif))['"]?\)/gi;
  while ((m = bgRe.exec(html)) !== null) addResolved(urls, m[1], origin, base);

  // <source srcset="..."> (picture element)
  const srcRe = /<source[^>]+srcset=["']([^"']+)["']/gi;
  while ((m = srcRe.exec(html)) !== null) {
    m[1].split(',').forEach((part) => {
      const src = part.trim().split(/\s+/)[0];
      if (src) addResolved(urls, src, origin, base);
    });
  }

  // Filter to valid image URLs only
  return [...urls].filter((u) => {
    const ext = getExt(u);
    if (SKIP_EXTENSIONS.includes(ext)) return false;
    const hasExt = IMAGE_EXTS.includes(ext);
    const looksLikeImage = /\.(jpg|jpeg|png|webp|avif)/i.test(u);
    return hasExt || looksLikeImage;
  });
}

function addResolved(set, src, origin, base) {
  if (!src || src.startsWith('data:')) return;
  try {
    const resolved = src.startsWith('http')
      ? src
      : src.startsWith('//')
      ? `https:${src}`
      : src.startsWith('/')
      ? `${origin}${src}`
      : new URL(src, base).href;
    // Strip query strings for dedup
    const clean = resolved.split('?')[0];
    set.add(clean);
  } catch {
    // invalid URL, skip
  }
}

function getExt(url) {
  try {
    const p = new URL(url).pathname;
    return path.extname(p).toLowerCase();
  } catch {
    return path.extname(url.split('?')[0]).toLowerCase();
  }
}

