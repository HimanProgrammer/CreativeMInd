import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const MAX_IMAGES = 60;
const MAX_SIZE_MB = 10;
const TIMEOUT_MS = 8000;
const SKIP_EXTENSIONS = ['.svg', '.ico', '.gif'];
const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.tiff', '.bmp'];

export async function POST(request) {
  try {
    const { url, folder } = await request.json();
    if (!url) return NextResponse.json({ error: 'URL is required' }, { status: 400 });

    // Normalise URL
    const targetUrl = url.startsWith('http') ? url : `https://${url}`;
    const origin = new URL(targetUrl).origin;

    // Fetch the page HTML
    const html = await fetchWithTimeout(targetUrl, TIMEOUT_MS);
    if (!html) return NextResponse.json({ error: 'Could not fetch the page' }, { status: 400 });

    // Extract all image URLs
    const rawUrls = extractImageUrls(html, targetUrl, origin);

    // Ensure save directory exists
    const saveDir = path.join(process.cwd(), 'public', 'scraped', folder || Date.now().toString());
    if (!existsSync(saveDir)) await mkdir(saveDir, { recursive: true });

    const publicFolder = saveDir.replace(path.join(process.cwd(), 'public'), '').replace(/\\/g, '/');

    // Download each image
    const results = [];
    const seen = new Set();

    for (const imgUrl of rawUrls.slice(0, MAX_IMAGES)) {
      if (seen.has(imgUrl)) continue;
      seen.add(imgUrl);

      try {
        const result = await downloadImage(imgUrl, saveDir, publicFolder);
        if (result) results.push(result);
      } catch {
        // skip failed images silently
      }
    }

    return NextResponse.json({
      success: true,
      total: results.length,
      folder: publicFolder,
      images: results,
    });

  } catch (err) {
    console.error('Scrape error:', err);
    return NextResponse.json({ error: err.message || 'Scrape failed' }, { status: 500 });
  }
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

async function downloadImage(imgUrl, saveDir, publicFolder) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  const res = await fetch(imgUrl, {
    signal: controller.signal,
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ImageScraper/1.0)' },
  });
  clearTimeout(timer);

  if (!res.ok) return null;

  const contentType = res.headers.get('content-type') || '';
  if (!contentType.startsWith('image/')) return null;

  const buffer = await res.arrayBuffer();
  const bytes = buffer.byteLength;

  // Skip tiny (tracking pixels <2KB) and huge images
  if (bytes < 2048 || bytes > MAX_SIZE_MB * 1024 * 1024) return null;

  // Build filename from URL
  let rawName = decodeURIComponent(new URL(imgUrl).pathname.split('/').pop()) || 'image';
  rawName = rawName.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 80);
  if (!path.extname(rawName)) {
    const ext = contentType.split('/')[1]?.split(';')[0] || 'jpg';
    rawName += `.${ext}`;
  }

  // Avoid collisions
  let saveName = rawName;
  let counter = 1;
  while (existsSync(path.join(saveDir, saveName))) {
    const ext = path.extname(rawName);
    saveName = `${path.basename(rawName, ext)}_${counter++}${ext}`;
  }

  await writeFile(path.join(saveDir, saveName), Buffer.from(buffer));

  const kbSize = Math.round(bytes / 1024);
  return {
    filename: saveName,
    url: `${publicFolder}/${saveName}`,
    sourceUrl: imgUrl,
    size: kbSize,
    width: null,
  };
}
