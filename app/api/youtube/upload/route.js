import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { createClient } from '@supabase/supabase-js';
import { Readable } from 'stream';

export const maxDuration = 300; // 5 min for large video uploads

async function getYouTubeClient() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const { data: rtRow } = await supabase
    .from('admin_settings').select('value').eq('key', 'youtube_refresh_token').single();
  const { data: atRow } = await supabase
    .from('admin_settings').select('value').eq('key', 'youtube_access_token').single();

  if (!rtRow?.value) throw new Error('YouTube not connected. Go to Admin → Settings and connect YouTube first.');

  const oauth2 = new google.auth.OAuth2(
    process.env.YOUTUBE_CLIENT_ID,
    process.env.YOUTUBE_CLIENT_SECRET,
    process.env.YOUTUBE_REDIRECT_URI || 'http://localhost:3000/api/youtube/callback'
  );
  oauth2.setCredentials({ refresh_token: rtRow.value, access_token: atRow?.value });
  return google.youtube({ version: 'v3', auth: oauth2 });
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file     = formData.get('video');
    const title    = formData.get('title')    || 'CreativeMind Portfolio';
    const category = formData.get('category') || 'General';
    const portfolioId = formData.get('portfolioId'); // optional: existing DB row to update

    if (!file) return NextResponse.json({ error: 'No video file provided' }, { status: 400 });

    const youtube = await getYouTubeClient();

    // Convert File → Node Readable stream
    const buffer   = Buffer.from(await file.arrayBuffer());
    const stream   = Readable.from(buffer);

    const response = await youtube.videos.insert({
      part: ['snippet', 'status'],
      requestBody: {
        snippet: {
          title,
          description: `${title} — ${category} | CreativeMind IT Solutions`,
          tags: ['CreativeMind', category, 'portfolio'],
          categoryId: '22', // People & Blogs
        },
        status: {
          privacyStatus: 'unlisted', // unlisted so it's embeddable but not public
        },
      },
      media: {
        mimeType: file.type,
        body: stream,
      },
    });

    const videoId  = response.data.id;
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;

    // If portfolioId provided, update that row's video_url
    if (portfolioId) {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );
      await supabase.from('portfolio_items').update({ video_url: videoUrl }).eq('id', portfolioId);
    }

    return NextResponse.json({ success: true, videoId, videoUrl, embedUrl });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
