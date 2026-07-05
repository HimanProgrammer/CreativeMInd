import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// GET /api/youtube/status — check if YouTube is connected
export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    const { data } = await supabase
      .from('admin_settings').select('value').eq('key', 'youtube_refresh_token').single();
    return NextResponse.json({ connected: !!(data?.value) });
  } catch {
    return NextResponse.json({ connected: false });
  }
}
