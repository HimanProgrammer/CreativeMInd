import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SETUP_SQL = `
-- Create table
CREATE TABLE IF NOT EXISTS portfolio_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  category TEXT DEFAULT 'General',
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  file_name TEXT,
  file_size BIGINT,
  video_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add video_url if table already existed without it
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS video_url TEXT;

-- Enable RLS
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;

-- Policies (skip if already exist)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='portfolio_items' AND policyname='Public read portfolio') THEN
    CREATE POLICY "Public read portfolio" ON portfolio_items FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='portfolio_items' AND policyname='Admin insert portfolio') THEN
    CREATE POLICY "Admin insert portfolio" ON portfolio_items FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='portfolio_items' AND policyname='Admin update portfolio') THEN
    CREATE POLICY "Admin update portfolio" ON portfolio_items FOR UPDATE USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='portfolio_items' AND policyname='Admin delete portfolio') THEN
    CREATE POLICY "Admin delete portfolio" ON portfolio_items FOR DELETE USING (true);
  END IF;
END $$;

-- Storage buckets (run separately in Supabase dashboard if needed)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio-images', 'portfolio-images', true) ON CONFLICT DO NOTHING;
-- INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio-thumbnails', 'portfolio-thumbnails', true) ON CONFLICT DO NOTHING;
`;

export async function POST() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceKey) {
    // No service key — return the SQL for manual execution
    return NextResponse.json({
      status: 'no_service_key',
      message: 'Add SUPABASE_SERVICE_ROLE_KEY to .env.local for auto-setup, or run the SQL manually.',
      sql: SETUP_SQL.trim(),
    });
  }

  try {
    const admin = createClient(url, serviceKey, { auth: { persistSession: false } });
    const { error } = await admin.rpc('exec_sql', { sql: SETUP_SQL });
    if (error) {
      // Try direct query as fallback
      const { error: err2 } = await admin.from('portfolio_items').select('id').limit(1);
      if (err2 && (err2.code === '42P01' || err2.message?.includes('relation'))) {
        return NextResponse.json({ status: 'table_missing', sql: SETUP_SQL.trim() });
      }
      return NextResponse.json({ status: 'error', message: error.message, sql: SETUP_SQL.trim() });
    }
    return NextResponse.json({ status: 'ok', message: 'Database initialized successfully.' });
  } catch (e) {
    return NextResponse.json({ status: 'error', message: e.message, sql: SETUP_SQL.trim() });
  }
}

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  try {
    const client = createClient(url, anonKey);
    const { error } = await client.from('portfolio_items').select('id').limit(1);

    if (error) {
      if (error.code === '42P01' || error.message?.includes('relation') || error.message?.includes('schema cache')) {
        return NextResponse.json({ status: 'table_missing', sql: SETUP_SQL.trim() });
      }
      return NextResponse.json({ status: 'error', message: error.message, sql: SETUP_SQL.trim() });
    }
    return NextResponse.json({ status: 'ok', message: 'Table exists and is accessible.' });
  } catch (e) {
    return NextResponse.json({ status: 'error', message: e.message });
  }
}
