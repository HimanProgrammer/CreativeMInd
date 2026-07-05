import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { createClient } from '@supabase/supabase-js';

// GET /api/youtube/callback?code=... — exchanges code for tokens and saves refresh token
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return new Response('<h2>❌ No code received</h2>', { headers: { 'Content-Type': 'text/html' } });
  }

  try {
    const oauth2 = new google.auth.OAuth2(
      process.env.YOUTUBE_CLIENT_ID,
      process.env.YOUTUBE_CLIENT_SECRET,
      process.env.YOUTUBE_REDIRECT_URI || 'http://localhost:3000/api/youtube/callback'
    );
    const { tokens } = await oauth2.getToken(code);

    // Save refresh token to Supabase settings table
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    await supabase.from('admin_settings').upsert({ key: 'youtube_refresh_token', value: tokens.refresh_token });
    await supabase.from('admin_settings').upsert({ key: 'youtube_access_token',  value: tokens.access_token });

    return new Response(`
      <html><body style="background:#0a0a18;color:#4ade80;font-family:sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0">
        <div style="text-align:center">
          <div style="font-size:64px;margin-bottom:16px">✅</div>
          <h2 style="font-size:24px;margin:0 0 8px">YouTube Connected!</h2>
          <p style="color:#888">You can close this tab and go back to the admin panel.</p>
          <script>setTimeout(()=>window.close(),2000)</script>
        </div>
      </body></html>
    `, { headers: { 'Content-Type': 'text/html' } });
  } catch (err) {
    return new Response(`<h2>❌ Error: ${err.message}</h2>`, { headers: { 'Content-Type': 'text/html' } });
  }
}
