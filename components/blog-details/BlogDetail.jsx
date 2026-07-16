'use client';
import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { STATIC_POSTS, findStaticPost } from '@/common/blogPosts';
import { fetchGraphics, pickGraphicForTopic } from '@/common/portfolioGraphics';

const ORANGE = '#f05a28';
const INK = '#141414';
const MUTE = '#6b7280';

function fmtDate(iso) {
  if (!iso) return '';
  try { return new Date(iso).toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' }); }
  catch { return ''; }
}

function readingTime(text) {
  const words = (text || '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

// Render admin content: raw HTML if it looks like HTML, else simple markdown-ish paragraphs.
function ArticleBody({ content }) {
  if (!content) {
    return <p style={S.para}>This post has no content yet. Add it from the admin panel.</p>;
  }
  if (content.includes('<') && content.includes('>')) {
    return <div style={S.htmlBody} dangerouslySetInnerHTML={{ __html: content }} />;
  }
  const blocks = content.split(/\n{2,}/);
  return (
    <>
      {blocks.map((b, i) => {
        const t = b.trim();
        if (/^#{1,3}\s/.test(t)) {
          const level = t.match(/^#+/)[0].length;
          const text = t.replace(/^#+\s/, '');
          const size = level === 1 ? 30 : level === 2 ? 24 : 20;
          return <h2 key={i} style={{ ...S.h2, fontSize: size }}>{text}</h2>;
        }
        return <p key={i} style={S.para}>{t}</p>;
      })}
    </>
  );
}

function BlogDetailInner() {
  const params = useSearchParams();
  const slug = params.get('slug');
  const [post, setPost] = useState(undefined); // undefined=loading, null=not found
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    (async () => {
      const graphics = await fetchGraphics(supabase);
      const used = new Set();
      const cover = (topic, existing) =>
        (existing && existing.startsWith('http')) ? existing : (pickGraphicForTopic(topic, graphics, used) || null);

      let found = null;
      try {
        let q = supabase.from('blog_posts').select('*').eq('status', 'published');
        q = slug ? q.eq('slug', slug).limit(1) : q.order('published_at', { ascending: false }).limit(1);
        const { data } = await q;
        if (data && data.length) found = data[0];
      } catch { /* ignore */ }

      // Fall back to the shared static posts so every blog-grid card opens an article.
      if (!found) {
        found = slug ? findStaticPost(slug) : (STATIC_POSTS[0] || null);
      }
      // Give the article a topic-matched graphic when it has no cover of its own.
      if (found && !(found.cover_url && found.cover_url.startsWith('http'))) {
        found = { ...found, cover_url: cover(found.category, found.cover_url) };
      }
      setPost(found);

      let list = [];
      try {
        const { data: r } = await supabase
          .from('blog_posts').select('id,title,slug,category,cover_url,published_at')
          .eq('status', 'published').order('published_at', { ascending: false }).limit(4);
        list = (r && r.length) ? r : STATIC_POSTS.slice(0, 4).map((p) => ({ id: p.slug, ...p, cover_url: null }));
      } catch {
        list = STATIC_POSTS.slice(0, 4).map((p) => ({ id: p.slug, ...p, cover_url: null }));
      }
      setRecent(list.map((r) => ({ ...r, cover_url: cover(r.category, r.cover_url) })));
    })();
  }, [slug]);

  if (post === undefined) {
    return <div style={S.center}><div style={S.spinner} /></div>;
  }

  if (post === null) {
    return (
      <div style={S.center}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 14 }}>📝</div>
          <h2 style={{ ...S.h2, marginTop: 0 }}>Post not found</h2>
          <p style={S.para}>This article doesn&apos;t exist or hasn&apos;t been published yet.</p>
          <Link href="/blog-grid-3column" style={S.backBtn}>← Back to Blog</Link>
        </div>
      </div>
    );
  }

  const cover = post.cover_url && post.cover_url.startsWith('http') ? post.cover_url : '/assets/imgs/blog/b1.jpg';

  return (
    <article style={S.wrap}>
      <div style={S.inner}>
        <Link href="/blog-grid-3column" style={S.crumb}>← All Articles</Link>

        <span style={S.cat}>{post.category || 'General'}</span>
        <h1 style={S.title}>{post.title}</h1>

        <div style={S.metaRow}>
          <div style={S.avatar}>{(post.author || 'C')[0].toUpperCase()}</div>
          <div>
            <div style={S.author}>{post.author || 'CreativeMind'}</div>
            <div style={S.metaSub}>
              {(post.published_at || post.created_at) ? fmtDate(post.published_at || post.created_at) : post.date} · {readingTime(post.content)} min read
            </div>
          </div>
        </div>

        <div style={S.coverWrap}>
          <img src={cover} alt={post.title} style={S.cover}
            onError={(e) => { e.target.src = '/assets/imgs/blog/b1.jpg'; }} />
        </div>

        {post.excerpt && <p style={S.lead}>{post.excerpt}</p>}

        <div style={S.body}>
          <ArticleBody content={post.content} />
        </div>

        {/* CTA */}
        <div style={S.cta}>
          <div>
            <h3 style={S.ctaH}>Have a project in mind?</h3>
            <p style={S.ctaP}>Let&apos;s build something great together.</p>
          </div>
          <Link href="/page-contact" style={S.ctaBtn}>Start a Project →</Link>
        </div>

        {/* Recent posts */}
        {recent.filter((r) => r.slug !== post.slug).length > 0 && (
          <div style={S.moreWrap}>
            <h3 style={S.moreHead}>More Articles</h3>
            <div style={S.moreGrid} className="bd-more-grid">
              {recent.filter((r) => r.slug !== post.slug).slice(0, 3).map((r) => (
                <Link key={r.id} href={r.slug ? `/blog-details?slug=${r.slug}` : '/blog-details'} style={S.moreCard}>
                  <div style={S.moreImgWrap}>
                    <img src={r.cover_url && r.cover_url.startsWith('http') ? r.cover_url : '/assets/imgs/blog/1.jpg'}
                      alt={r.title} style={S.moreImg}
                      onError={(e) => { e.target.src = '/assets/imgs/blog/1.jpg'; }} />
                  </div>
                  <span style={S.moreCat}>{r.category || 'General'}</span>
                  <div style={S.moreTitle}>{r.title}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

export default function BlogDetail() {
  return (
    <>
      <style>{`@keyframes bd-spin { to { transform: rotate(360deg); } }
        @media (max-width: 640px){ .bd-more-grid { grid-template-columns: 1fr !important; } }`}</style>
      <Suspense fallback={<div style={S.center}><div style={S.spinner} /></div>}>
        <BlogDetailInner />
      </Suspense>
    </>
  );
}

const S = {
  wrap: { background: '#fff', color: INK, fontFamily: 'Inter, system-ui, sans-serif', padding: '120px 24px 80px' },
  inner: { maxWidth: 820, margin: '0 auto' },
  center: { minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '140px 24px', background: '#fff' },
  spinner: { width: 40, height: 40, border: `3px solid ${ORANGE}22`, borderTopColor: ORANGE, borderRadius: '50%', animation: 'bd-spin 0.8s linear infinite' },

  crumb: { display: 'inline-block', color: MUTE, textDecoration: 'none', fontSize: 14, fontWeight: 600, marginBottom: 24 },
  cat: { display: 'inline-block', padding: '6px 14px', background: `${ORANGE}15`, color: ORANGE, borderRadius: 30, fontSize: 12, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 18 },
  title: { fontSize: 'clamp(30px,4.5vw,52px)', fontWeight: 900, lineHeight: 1.12, letterSpacing: '-0.02em', margin: '0 0 26px', color: INK },

  metaRow: { display: 'flex', alignItems: 'center', gap: 14, marginBottom: 34 },
  avatar: { width: 46, height: 46, borderRadius: '50%', background: `linear-gradient(135deg,${ORANGE},#e040fb)`, color: '#fff', fontWeight: 800, fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  author: { fontWeight: 700, fontSize: 15, color: INK },
  metaSub: { fontSize: 13, color: MUTE, marginTop: 2 },

  coverWrap: { borderRadius: 20, overflow: 'hidden', marginBottom: 36, boxShadow: '0 30px 60px rgba(20,20,46,0.12)' },
  cover: { width: '100%', height: 'auto', display: 'block', maxHeight: 460, objectFit: 'cover' },

  lead: { fontSize: 20, lineHeight: 1.6, color: '#374151', fontWeight: 500, margin: '0 0 30px', paddingLeft: 20, borderLeft: `3px solid ${ORANGE}` },
  body: { fontSize: 17, lineHeight: 1.85, color: '#333' },
  para: { margin: '0 0 22px' },
  h2: { fontSize: 24, fontWeight: 800, color: INK, margin: '38px 0 16px', letterSpacing: '-0.01em' },
  htmlBody: { fontSize: 17, lineHeight: 1.85, color: '#333' },

  cta: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap', background: `linear-gradient(135deg,${ORANGE}12,#e040fb12)`, border: '1px solid #f0eaf5', borderRadius: 20, padding: '32px 34px', margin: '54px 0 20px' },
  ctaH: { fontSize: 22, fontWeight: 900, margin: '0 0 6px', color: INK },
  ctaP: { fontSize: 15, color: MUTE, margin: 0 },
  ctaBtn: { display: 'inline-flex', alignItems: 'center', padding: '14px 30px', background: ORANGE, color: '#fff', borderRadius: 12, textDecoration: 'none', fontSize: 14, fontWeight: 800, boxShadow: `0 10px 30px ${ORANGE}44`, whiteSpace: 'nowrap' },

  moreWrap: { marginTop: 60, borderTop: '1px solid #eee', paddingTop: 40 },
  moreHead: { fontSize: 24, fontWeight: 900, margin: '0 0 24px', color: INK },
  moreGrid: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 },
  moreCard: { textDecoration: 'none', display: 'block' },
  moreImgWrap: { borderRadius: 14, overflow: 'hidden', marginBottom: 12, aspectRatio: '16/10', background: '#f2f2f5' },
  moreImg: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  moreCat: { fontSize: 11, fontWeight: 800, color: ORANGE, textTransform: 'uppercase', letterSpacing: '0.06em' },
  moreTitle: { fontSize: 15, fontWeight: 700, color: INK, marginTop: 6, lineHeight: 1.4 },

  backBtn: { display: 'inline-block', marginTop: 18, padding: '12px 26px', background: ORANGE, color: '#fff', borderRadius: 12, textDecoration: 'none', fontWeight: 700, fontSize: 14 },
};
