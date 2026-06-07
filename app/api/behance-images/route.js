import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const TIMEOUT_MS = 15000;

export async function POST(request) {
  const { username: rawInput, apiKey, folder } = await request.json().catch(() => ({}));

  // Set up a streaming response so the client gets live log lines
  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  const log = async (msg) => {
    await writer.write(encoder.encode(JSON.stringify({ type: 'log', msg }) + '\n'));
  };

  const done = async (payload) => {
    await writer.write(encoder.encode(JSON.stringify({ type: 'done', ...payload }) + '\n'));
    await writer.close();
  };

  const fail = async (error) => {
    await writer.write(encoder.encode(JSON.stringify({ type: 'error', error }) + '\n'));
    await writer.close();
  };

  // Run async in background so we can return the stream immediately
  (async () => {
    try {
      if (!rawInput) { await fail('Behance URL or username is required'); return; }

      await log(`Starting Behance extraction for: ${rawInput}`);

      const saveFolder = folder || Date.now().toString();
      const saveDir = path.join(process.cwd(), 'public', 'scraped', saveFolder);
      if (!existsSync(saveDir)) await mkdir(saveDir, { recursive: true });
      const publicFolder = `/scraped/${saveFolder}`;

      let rawImages = [];
      let label = rawInput;

      // Detect editor URL (requires login) and warn
      if (/behance\.net\/portfolio\/editor/i.test(rawInput)) {
        await log('⚠️  Editor URL detected — this page requires Behance login.');
        await log('Trying to access the public gallery version instead...');
      }

      const projectId = extractProjectId(rawInput);

      if (projectId) {
        label = `project-${projectId}`;
        await log(`Detected project ID: ${projectId}`);
        if (apiKey) {
          await log('Using Behance API (with key)...');
          rawImages = await fetchProjectViaAPI(projectId, apiKey, log);
        } else {
          await log('No API key — trying public gallery page...');
          rawImages = await scrapeProjectPage(projectId, log);
          // If gallery scrape failed, try profile embed
          if (rawImages.length === 0) {
            await log('Gallery page returned nothing — trying embed endpoint...');
            rawImages = await scrapeProjectEmbed(projectId, log);
          }
        }
      } else {
        // Check if it's a full gallery URL like behance.net/gallery/12345/title
        const galleryMatch = rawInput.match(/behance\.net\/gallery\/(\d+)/i);
        if (galleryMatch) {
          const gid = galleryMatch[1];
          label = `gallery-${gid}`;
          await log(`Detected gallery URL, ID: ${gid}`);
          rawImages = await scrapeProjectPage(gid, log);
        } else {
          const username = rawInput.replace(/https?:\/\/(www\.)?behance\.net\//i, '').split('/')[0].trim();
          label = username;
          await log(`Detected profile: @${username}`);
          if (apiKey) {
            await log('Using Behance API (with key)...');
            rawImages = await fetchProfileViaAPI(username, apiKey, log);
          } else {
            await log('No API key — scraping public profile page...');
            rawImages = await scrapePublicProfile(username, log);
          }
        }
      }

      await log(`Found ${rawImages.length} image URL(s) to download`);

      if (rawImages.length === 0) {
        const isEditorUrl = /behance\.net\/portfolio\/editor/i.test(rawInput);
        if (isEditorUrl) {
          await fail(
            `No images found.\n\n` +
            `⚠️ You used an EDITOR URL which requires Behance login.\n\n` +
            `To fix: open your Behance project and copy the PUBLIC URL from the browser.\n` +
            `It looks like: https://www.behance.net/gallery/217395233/Your-Project-Title\n\n` +
            `Paste that URL here instead.`
          );
        } else {
          await fail(
            `No images found. ${projectId
              ? `Project ${projectId} may be private, require login, or Behance blocked the request.`
              : 'Try adding a Behance API key or use a direct gallery URL.'
            }\n\nTIP: Public gallery URLs work best: behance.net/gallery/ID/title`
          );
        }
        return;
      }

      // Download each image
      const results = [];
      const toDownload = rawImages.slice(0, 60);
      for (let i = 0; i < toDownload.length; i++) {
        const img = toDownload[i];
        await log(`[${i + 1}/${toDownload.length}] Downloading: ${img.url.split('/').pop().slice(0, 50)}`);
        try {
          const result = await downloadImage(img.url, img.title, saveDir, publicFolder);
          if (result) {
            results.push(result);
            await log(`  ✓ Saved ${result.filename} (${result.size} KB)`);
          } else {
            await log(`  ✗ Skipped (too small, not an image, or failed)`);
          }
        } catch (e) {
          await log(`  ✗ Error: ${e.message}`);
        }
      }

      await log(`Done! ${results.length} image(s) saved to ${publicFolder}`);
      await done({ total: results.length, folder: publicFolder, images: results, label });

    } catch (err) {
      console.error('Behance fetch error:', err);
      await fail(err.message || 'Failed to fetch Behance images');
    }
  })();

  return new Response(stream.readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

// ── Project ID extraction ─────────────────────────────────────────────────────

function extractProjectId(input) {
  const qsMatch = input.match(/[?&]project_id=(\d+)/i);
  if (qsMatch) return qsMatch[1];
  const galleryMatch = input.match(/\/gallery\/(\d+)/i);
  if (galleryMatch) return galleryMatch[1];
  if (/^\d{6,}$/.test(input.trim())) return input.trim();
  return null;
}

// ── Behance API: single project ───────────────────────────────────────────────

async function fetchProjectViaAPI(projectId, apiKey, log) {
  const images = [];
  await log(`Calling Behance API: /v2/projects/${projectId}`);
  const data = await fetchJSON(`https://api.behance.net/v2/projects/${projectId}?api_key=${apiKey}`);
  if (!data?.project) { await log('API returned no project data'); return images; }

  const project = data.project;
  const title = project.name || `project-${projectId}`;
  await log(`Project: "${title}" — ${(project.modules || []).length} module(s)`);

  const covers = project.covers || {};
  const cover = covers['1400'] || covers['808'] || covers['404'];
  if (cover) images.push({ url: cover, title });

  for (const mod of project.modules || []) {
    if (mod.type === 'image' && mod.sizes?.original) images.push({ url: mod.sizes.original, title });
    if (mod.type === 'media_collection') {
      for (const comp of mod.components || []) {
        const url = comp.sizes?.original || comp.url;
        if (url) images.push({ url, title });
      }
    }
  }

  await log(`Extracted ${images.length} image URL(s) from API`);
  return dedup(images);
}

// ── Scrape project page — tries multiple URL formats ─────────────────────────

async function scrapeProjectPage(projectId, log) {
  const urls = [
    `https://www.behance.net/gallery/${projectId}/a`,
    `https://www.behance.net/gallery/${projectId}`,
  ];
  for (const pageUrl of urls) {
    await log(`Fetching: ${pageUrl}`);
    const html = await fetchHtml(pageUrl);
    if (!html) { await log('  ✗ No response'); continue; }
    await log(`  Page fetched (${Math.round(html.length / 1024)} KB) — parsing...`);
    const images = extractImagesFromHtml(html, `project-${projectId}`);
    if (images.length > 0) {
      await log(`  ✓ Found ${images.length} image(s)`);
      return images;
    }
    await log('  No images found on this URL, trying next...');
  }
  return [];
}

// ── Embed / oEmbed fallback ───────────────────────────────────────────────────

async function scrapeProjectEmbed(projectId, log) {
  // Try Behance's internal project JSON endpoints that sometimes return public data
  const endpoints = [
    `https://www.behance.net/gallery/${projectId}/`,
    `https://www.behance.net/v2/projects/${projectId}`,   // no auth = limited but sometimes works
  ];
  for (const url of endpoints) {
    await log(`Trying endpoint: ${url}`);
    const html = await fetchHtml(url);
    if (!html) continue;
    // Look for JSON-embedded image data
    const jsonBlockRe = /\{[^{}]*"modules"[^{}]*\[[\s\S]*?\]\s*\}/g;
    const cdnRe = /https:\/\/mir-s3-cdn-cf\.behance\.net\/[^"'\s\\]+\.(?:jpg|jpeg|png|webp)/gi;
    const found = [];
    let m;
    // CDN URLs in any form
    const fullText = html;
    while ((m = cdnRe.exec(fullText)) !== null) {
      found.push({ url: m[0].replace(/\\u002F/g, '/').replace(/\\\//g, '/'), title: `project-${projectId}` });
    }
    // Also try mir-cdn variant
    const cdn2Re = /https:\/\/mir-cdn\.behance\.net\/[^"'\s\\]+\.(?:jpg|jpeg|png|webp)/gi;
    while ((m = cdn2Re.exec(fullText)) !== null) {
      found.push({ url: m[0], title: `project-${projectId}` });
    }
    if (found.length > 0) {
      await log(`  ✓ Found ${found.length} CDN URL(s) via embed`);
      return dedup(found);
    }
  }
  await log('  Embed endpoints returned no images — project may require login');
  await log('  TIP: Use a public project URL like: behance.net/gallery/217395233/Project-Title');
  return [];
}

// ── Behance API: profile ──────────────────────────────────────────────────────

async function fetchProfileViaAPI(username, apiKey, log) {
  const images = [];
  await log(`Calling Behance API: /v2/users/${username}/projects`);
  const res = await fetchJSON(`https://api.behance.net/v2/users/${encodeURIComponent(username)}/projects?api_key=${apiKey}&per_page=24`);
  if (!res?.projects?.length) { await log('No projects returned by API'); return images; }
  await log(`Found ${res.projects.length} project(s)`);

  for (const project of res.projects) {
    const title = project.name || `project-${project.id}`;
    const covers = project.covers || {};
    const cover = covers['1400'] || covers['808'] || covers['404'] || covers['202'];
    if (cover) images.push({ url: cover, title });

    if (images.length < 40) {
      await log(`  Fetching modules for "${title}"...`);
      const detail = await fetchJSON(`https://api.behance.net/v2/projects/${project.id}?api_key=${apiKey}`);
      for (const mod of detail?.project?.modules || []) {
        if (mod.type === 'image' && mod.sizes?.original) images.push({ url: mod.sizes.original, title });
        if (mod.type === 'media_collection') {
          for (const comp of mod.components || []) {
            if (comp.sizes?.original) images.push({ url: comp.sizes.original, title });
          }
        }
      }
    }
  }
  return dedup(images);
}

// ── Scrape public profile ─────────────────────────────────────────────────────

async function scrapePublicProfile(username, log) {
  const pageUrl = `https://www.behance.net/${username}`;
  await log(`Fetching: ${pageUrl}`);
  const html = await fetchHtml(pageUrl);
  if (!html) { await log('Failed to fetch profile page'); return []; }
  await log(`Page fetched (${Math.round(html.length / 1024)} KB) — parsing images...`);
  const images = extractImagesFromHtml(html, 'behance-project');
  await log(`Found ${images.length} image(s) in page HTML`);
  return images;
}

// ── HTML image extractor ──────────────────────────────────────────────────────

function extractImagesFromHtml(html, defaultTitle) {
  const images = [];

  // 1. Scan <script> blocks for CDN URLs
  const scriptRe = /<script[^>]*>([\s\S]*?)<\/script>/gi;
  let sm;
  while ((sm = scriptRe.exec(html)) !== null) {
    const block = sm[1];
    if (!block.includes('mir-s3') && !block.includes('mir-cdn') && !block.includes('behance')) continue;
    const urlRe = /https:\/\/(?:mir-s3-cdn-cf|mir-cdn|mir\.s3)\.behance\.net[^"'\s\\)>]+\.(?:jpg|jpeg|png|webp)/gi;
    let m;
    while ((m = urlRe.exec(block)) !== null) {
      images.push({ url: m[0].split('\\u')[0].split('\\')[0], title: defaultTitle });
    }
    const cdn2Re = /https:\/\/[^"'\s]+behance[^"'\s]*\.(?:jpg|jpeg|png|webp)/gi;
    while ((m = cdn2Re.exec(block)) !== null) {
      const clean = m[0].split('\\u')[0].split('\\')[0];
      if (!clean.includes('avatar') && !clean.includes('/profile/')) images.push({ url: clean, title: defaultTitle });
    }
  }

  // 2. og:image / twitter:image
  const ogRe = /<meta[^>]+(?:property=["']og:image["']|name=["']twitter:image["'])[^>]+content=["']([^"']+)["']/gi;
  let m;
  while ((m = ogRe.exec(html)) !== null) images.push({ url: m[1].split('?')[0], title: defaultTitle });

  // 3. data-src lazy images
  const dataSrcRe = /data-src=["'](https:\/\/[^"']+\.(?:jpg|jpeg|png|webp))["']/gi;
  while ((m = dataSrcRe.exec(html)) !== null) images.push({ url: m[1].split('?')[0], title: defaultTitle });

  // 4. img src
  const imgRe = /<img[^>]+src=["'](https:\/\/[^"']+\.(?:jpg|jpeg|png|webp))["']/gi;
  while ((m = imgRe.exec(html)) !== null) {
    if (!m[1].includes('avatar') && !m[1].includes('/profile/')) images.push({ url: m[1].split('?')[0], title: defaultTitle });
  }

  return dedup(images);
}

// ── Utilities ─────────────────────────────────────────────────────────────────

function dedup(images) {
  const seen = new Set();
  return images.filter(img => { if (seen.has(img.url)) return false; seen.add(img.url); return true; });
}

async function fetchHtml(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
      },
    });
    clearTimeout(timer);
    return res.ok ? res.text() : null;
  } catch { clearTimeout(timer); return null; }
}

async function fetchJSON(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal, headers: { 'User-Agent': 'Mozilla/5.0 (compatible; CreativeMind/1.0)' } });
    clearTimeout(timer);
    return res.ok ? res.json() : null;
  } catch { clearTimeout(timer); return null; }
}

async function downloadImage(imgUrl, title, saveDir, publicFolder) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(imgUrl, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'Referer': 'https://www.behance.net/' },
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.startsWith('image/')) return null;
    const buffer = await res.arrayBuffer();
    const bytes = buffer.byteLength;
    if (bytes < 2048 || bytes > 30 * 1024 * 1024) return null;
    let rawName = decodeURIComponent(new URL(imgUrl).pathname.split('/').pop()) || 'image';
    rawName = rawName.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 80);
    if (!path.extname(rawName)) rawName += `.${contentType.split('/')[1]?.split(';')[0] || 'jpg'}`;
    let saveName = rawName;
    let counter = 1;
    while (existsSync(path.join(saveDir, saveName))) {
      const ext = path.extname(rawName);
      saveName = `${path.basename(rawName, ext)}_${counter++}${ext}`;
    }
    await writeFile(path.join(saveDir, saveName), Buffer.from(buffer));
    return { filename: saveName, url: `${publicFolder}/${saveName}`, sourceUrl: imgUrl, size: Math.round(bytes / 1024), title };
  } catch { clearTimeout(timer); return null; }
}
