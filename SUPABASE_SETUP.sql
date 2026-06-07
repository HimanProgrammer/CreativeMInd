-- ============================================================
-- CreativeMind IT Solutions — Supabase Database Setup
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- ── 1. PORTFOLIO ITEMS ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS portfolio_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  category TEXT DEFAULT 'General',
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  file_name TEXT,
  file_size BIGINT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read portfolio" ON portfolio_items FOR SELECT USING (true);
CREATE POLICY "Admin insert portfolio" ON portfolio_items FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin update portfolio" ON portfolio_items FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete portfolio" ON portfolio_items FOR DELETE USING (auth.role() = 'authenticated');

-- Storage Buckets (create in Supabase Dashboard → Storage):
--   portfolio-images      (Public: ON)
--   portfolio-thumbnails  (Public: ON)


-- ── 2. CONTACT MESSAGES ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insert message" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read messages" ON messages FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin update messages" ON messages FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete messages" ON messages FOR DELETE USING (auth.role() = 'authenticated');


-- ── 3. TEAM MEMBERS ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  photo_url TEXT,
  linkedin_url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read team" ON team_members FOR SELECT USING (true);
CREATE POLICY "Admin insert team" ON team_members FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin update team" ON team_members FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete team" ON team_members FOR DELETE USING (auth.role() = 'authenticated');


-- ── 4. SERVICES ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT '💻',
  color TEXT DEFAULT '#6c63ff',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read services" ON services FOR SELECT USING (true);
CREATE POLICY "Admin insert services" ON services FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin update services" ON services FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete services" ON services FOR DELETE USING (auth.role() = 'authenticated');


-- ── 5. BLOG POSTS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  content TEXT,
  excerpt TEXT,
  category TEXT DEFAULT 'General',
  status TEXT DEFAULT 'draft',   -- 'draft' | 'published'
  cover_url TEXT,
  author TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read published posts" ON blog_posts FOR SELECT USING (status = 'published' OR auth.role() = 'authenticated');
CREATE POLICY "Admin insert posts" ON blog_posts FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin update posts" ON blog_posts FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete posts" ON blog_posts FOR DELETE USING (auth.role() = 'authenticated');


-- ── 6. SITE SETTINGS ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Admin upsert settings" ON site_settings FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin update settings" ON site_settings FOR UPDATE USING (auth.role() = 'authenticated');

-- Seed default settings
INSERT INTO site_settings (key, value) VALUES
  ('site_name', 'CreativeMind IT Solutions'),
  ('site_tagline', 'We Build Brands & Digital Futures'),
  ('contact_email', 'hello@creativemind.com'),
  ('meta_description', 'CreativeMind IT Solutions — Web Dev, Mobile Apps, UI/UX Design, Branding & Digital Marketing.')
ON CONFLICT (key) DO NOTHING;
