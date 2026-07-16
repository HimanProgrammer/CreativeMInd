// Fetch the user's own portfolio graphics from Supabase and match them to a blog
// topic by category/title keywords. Shared by the blog grid and blog-details.

const TOPIC_KEYWORDS = {
  'Web Development':    ['web', 'website', 'landing', 'ui', 'ux'],
  'Mobile Apps':        ['mobile', 'app', 'ui', 'ux'],
  'UI/UX Design':       ['ui', 'ux', 'design', 'web', 'app'],
  'Branding':           ['brand', 'logo', 'identity'],
  'Digital Marketing':  ['market', 'ad', 'social', 'poster', 'banner', 'promo'],
  'Social Media':       ['social', 'insta', 'post', 'reel', 'story', 'banner'],
};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Returns a shuffled array of { url, category, title }.
export async function fetchGraphics(supabase) {
  try {
    const { data } = await supabase
      .from('portfolio_items')
      .select('image_url,thumbnail_url,category,title')
      .limit(200);
    return shuffle(
      (data || [])
        .map((r) => {
          const url = r.image_url && r.image_url.startsWith('http') ? r.image_url
            : r.thumbnail_url && r.thumbnail_url.startsWith('http') ? r.thumbnail_url : null;
          return url ? { url, category: r.category || '', title: r.title || '' } : null;
        })
        .filter(Boolean)
    );
  } catch {
    return [];
  }
}

// Pick the graphic whose category/title best matches the topic; each used once.
export function pickGraphicForTopic(topic, graphics, used) {
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
