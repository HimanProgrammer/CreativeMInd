'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { STATIC_POSTS } from '@/common/blogPosts';

const FALLBACK_IMGS = ['/assets/imgs/blog/1.jpg', '/assets/imgs/blog/2.jpg', '/assets/imgs/blog/3.jpg'];

// Fallback cards shown when blog_posts is empty — sourced from the SHARED static
// posts (which the details page also reads), so every card opens a real article.
const FALLBACK = STATIC_POSTS.map((p) => ({ date: p.date, tag: p.category, title: p.title, slug: p.slug }));

// Keywords that make a portfolio graphic a good visual match for a blog topic.
// Matched (case-insensitive) against the graphic's category + title.
const TOPIC_KEYWORDS = {
  'Web Development':   ['web', 'website', 'landing', 'ui', 'ux'],
  'Mobile Apps':      ['mobile', 'app', 'ui', 'ux'],
  'UI/UX Design':     ['ui', 'ux', 'design', 'web', 'app'],
  'Branding':         ['brand', 'logo', 'identity'],
  'Digital Marketing':['market', 'ad', 'social', 'poster', 'banner', 'promo'],
  'Social Media':     ['social', 'insta', 'post', 'reel', 'story', 'banner'],
};

// Pick the graphic whose category/title best matches the topic keywords.
function matchGraphic(topic, graphics, used) {
  const kws = TOPIC_KEYWORDS[topic] || [];
  const scored = graphics
    .filter((g) => !used.has(g.url))
    .map((g) => {
      const hay = `${g.category} ${g.title}`.toLowerCase();
      const score = kws.reduce((s, k) => s + (hay.includes(k) ? 1 : 0), 0);
      return { g, score };
    })
    .sort((a, b) => b.score - a.score);
  const best = scored.find((s) => s.score > 0) || scored[0];
  if (best) { used.add(best.g.url); return best.g.url; }
  return null;
}

function fmtDate(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' });
  } catch { return ''; }
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function Blogs() {
  const [posts, setPosts] = useState(null); // null = loading

  useEffect(() => {
    (async () => {
      // Pull the user's own graphics to use as blog cover images.
      let graphics = [];
      try {
        const { data: g } = await supabase
          .from('portfolio_items')
          .select('image_url,thumbnail_url,category,title')
          .limit(200);
        graphics = shuffle(
          (g || [])
            .map((r) => {
              const url = r.image_url && r.image_url.startsWith('http') ? r.image_url
                : r.thumbnail_url && r.thumbnail_url.startsWith('http') ? r.thumbnail_url : null;
              return url ? { url, category: r.category || '', title: r.title || '' } : null;
            })
            .filter(Boolean)
        );
      } catch { /* ignore */ }

      const used = new Set();
      // Topic-matched graphic first; fall back to any unused graphic, then placeholder.
      const pick = (topic, i) => {
        const m = matchGraphic(topic, graphics, used);
        if (m) return m;
        const rest = graphics.find((g) => !used.has(g.url));
        if (rest) { used.add(rest.url); return rest.url; }
        return FALLBACK_IMGS[i % 3];
      };

      // Real published posts (if any), else the fallback list.
      let list = [];
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('id,title,slug,category,cover_url,author,published_at,created_at,status')
          .eq('status', 'published')
          .order('published_at', { ascending: false });
        if (!error && data && data.length) {
          list = data.map((p, i) => ({
            img: p.cover_url && p.cover_url.startsWith('http') ? p.cover_url : pick(p.category || 'General', i),
            date: fmtDate(p.published_at || p.created_at),
            tag: p.category || 'General',
            title: p.title,
            slug: p.slug || null,
            author: p.author || 'CreativeMind',
          }));
        }
      } catch { /* ignore */ }

      if (!list.length) {
        list = FALLBACK.map((p, i) => ({ ...p, img: pick(p.tag, i), author: 'CreativeMind' }));
      }
      setPosts(list);
    })();
  }, []);

  const items = posts || FALLBACK.map((p, i) => ({ ...p, img: FALLBACK_IMGS[i % 3], author: 'CreativeMind' }));

  return (
    <section className="blog-main blog section-padding">
      <div className="container">
        <div className="row">
          {items.map((post, i) => {
            const href = post.slug ? `/blog-details?slug=${post.slug}` : '/blog-details';
            return (
              <div className="col-md-6 col-lg-4" key={post.slug || i}>
                <div className={`item${i < 3 ? ' mb-50' : ''}`}>
                  <div className="img fit-img">
                    <img
                      src={post.img}
                      alt={post.title}
                      onError={(e) => { e.target.src = FALLBACK_IMGS[i % 3]; }}
                    />
                  </div>
                  <div className="cont pt-40">
                    <div className="info sub-title p-color d-flex align-items-center mb-15">
                      <div>
                        <a href={href}>By : {post.author || 'CreativeMind'}</a>
                      </div>
                      <div className="ml-30">
                        <a href={href}>{post.date}</a>
                      </div>
                    </div>
                    <span className="main-color fz-12 fw-600 text-uppercase mb-10 d-block"
                      style={{ letterSpacing: '0.1em' }}>
                      {post.tag}
                    </span>
                    <h4 className="fz-24">{post.title}</h4>
                    <a href={href} className="butn-crev d-flex align-items-center mt-40">
                      <span className="hover-this">
                        <span className="circle hover-anim">
                          <i className="ti-arrow-top-right"></i>
                        </span>
                      </span>
                      <span className="text">Read more</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Blogs;
