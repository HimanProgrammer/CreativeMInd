import { NextResponse } from 'next/server';
import { SITE } from '@/lib/siteConfig';

// GET /api/reels — every YouTube Short on the CreativeMind channel.
//
// With YOUTUBE_API_KEY set (Vercel env), it walks the channel's whole
// Shorts playlist, so EVERY Short is listed. Without it, it falls back to the
// public RSS feed, which needs no key but only lists the newest 15. Either way the result is cached
// for an hour, so new uploads appear on the site within an hour.

export const revalidate = 3600;

const CHANNEL_ID = SITE.youtubeChannelId;

function shape({ id, title, published, description }) {
  return {
    id,
    title: title || 'CreativeMind Reel',
    published: published || null,
    description: description || '',
    url: `https://www.youtube.com/shorts/${id}`,
    watchUrl: `https://www.youtube.com/watch?v=${id}`,
    embedUrl: `https://www.youtube.com/embed/${id}`,
    thumb: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
  };
}

// UUSH… is YouTube's Shorts-only playlist for a channel; UU… is all uploads.
const SHORTS_PLAYLIST = 'UUSH' + CHANNEL_ID.slice(2);
const UPLOADS_PLAYLIST = 'UU' + CHANNEL_ID.slice(2);

async function fromApi(key, uploads) {
  const out = [];
  let pageToken = '';
  for (let page = 0; page < 40; page++) {
    const url = new URL('https://www.googleapis.com/youtube/v3/playlistItems');
    url.searchParams.set('part', 'snippet');
    url.searchParams.set('playlistId', uploads);
    url.searchParams.set('maxResults', '50');
    url.searchParams.set('key', key);
    if (pageToken) url.searchParams.set('pageToken', pageToken);
    const res = await fetch(url, { next: { revalidate } });
    if (!res.ok) throw new Error(`YouTube API ${res.status}`);
    const json = await res.json();
    for (const it of json.items || []) {
      const s = it.snippet || {};
      const id = s.resourceId?.videoId;
      if (!id || s.title === 'Private video' || s.title === 'Deleted video') continue;
      out.push(shape({ id, title: s.title, published: s.publishedAt, description: s.description }));
    }
    pageToken = json.nextPageToken;
    if (!pageToken) break;
  }
  return out;
}

function decode(s = '') {
  return s
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'");
}

async function fromRss(query) {
  const res = await fetch(
    `https://www.youtube.com/feeds/videos.xml?${query}`,
    { next: { revalidate } }
  );
  if (!res.ok) throw new Error(`RSS ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(([, e]) => {
    const pick = (re) => (e.match(re) || [])[1];
    return shape({
      id: pick(/<yt:videoId>([^<]+)<\/yt:videoId>/),
      title: decode(pick(/<title>([^<]*)<\/title>/)),
      published: pick(/<published>([^<]+)<\/published>/),
      description: decode(pick(/<media:description>([\s\S]*?)<\/media:description>/)),
    });
  }).filter((r) => r.id);
}

export async function GET() {
  let reels = [];
  let source = 'rss';
  try {
    const key = process.env.YOUTUBE_API_KEY;
    // 1) API key set: every Short on the channel (all pages).
    if (key) {
      try { reels = await fromApi(key, SHORTS_PLAYLIST); source = 'api-shorts'; } catch {}
      if (!reels.length) {
        try { reels = await fromApi(key, UPLOADS_PLAYLIST); source = 'api-uploads'; } catch {}
      }
    }
    // 2) No key: public feeds (YouTube caps these at the newest 15).
    if (!reels.length) {
      try { reels = await fromRss(`playlist_id=${SHORTS_PLAYLIST}`); source = 'rss-shorts'; } catch {}
    }
    if (!reels.length) {
      reels = await fromRss(`channel_id=${CHANNEL_ID}`); source = 'rss';
    }
  } catch (err) {
    return NextResponse.json({ reels: [], source, error: err.message, channel: SITE.social.youtube });
  }
  // The channel also carries personal uploads (devotional, coffee, WhatsApp
  // clips). Only show Creative Mind business Shorts on the website.
  const isBusiness = (r) => /creative\s*mind|creativemind/i.test(`${r.title} ${r.description}`);
  reels = reels.filter(isBusiness);
  reels.sort((a, b) => (b.published || '').localeCompare(a.published || ''));
  reels = reels.map((r) => ({ ...r, description: r.description.slice(0, 300) }));
  return NextResponse.json({ reels, source, channel: SITE.social.youtube });
}
