import { NextResponse } from 'next/server';
import { SITE } from '@/lib/siteConfig';

// GET /api/reels — every video/short on the CreativeMind YouTube channel.
//
// With YOUTUBE_API_KEY set (Vercel env), it walks the channel's whole uploads
// playlist. Without it, it falls back to the public RSS feed, which needs no
// key but only lists the newest 15 uploads. Either way the result is cached
// for an hour, so new uploads appear on the site within an hour.

export const revalidate = 3600;

const CHANNEL_ID = SITE.youtubeChannelId;

function shape({ id, title, published, description }) {
  return {
    id,
    title: title || 'CreativeMind Reel',
    published: published || null,
    description: (description || '').slice(0, 300),
    url: `https://www.youtube.com/shorts/${id}`,
    watchUrl: `https://www.youtube.com/watch?v=${id}`,
    embedUrl: `https://www.youtube.com/embed/${id}`,
    thumb: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
  };
}

async function fromApi(key) {
  const uploads = 'UU' + CHANNEL_ID.slice(2);
  const out = [];
  let pageToken = '';
  for (let page = 0; page < 10; page++) {
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

async function fromRss() {
  const res = await fetch(
    `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`,
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
    if (key) {
      try { reels = await fromApi(key); source = 'api'; }
      catch { reels = await fromRss(); }
    } else {
      reels = await fromRss();
    }
  } catch (err) {
    return NextResponse.json({ reels: [], source, error: err.message, channel: SITE.social.youtube });
  }
  reels.sort((a, b) => (b.published || '').localeCompare(a.published || ''));
  return NextResponse.json({ reels, source, channel: SITE.social.youtube });
}
