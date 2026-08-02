/**
 * Refresh the bundled portfolio deck from Supabase.
 *
 *   npm run sync-roll
 *
 * Downloads a spread of real CreativeMind graphics into
 * public/assets/imgs/roll/ and rewrites data/portfolios/roll.json. Those files
 * ship with the build, so the hero's printing roll and the Best Work grid show
 * our own work even when the deployment can't reach Supabase (keys not set,
 * RLS, network). Live Supabase data still wins whenever it is available.
 *
 * Re-run it after adding new pieces to the portfolio.
 */
const fs = require('fs');
const path = require('path');

const HOW_MANY = 12;
const OUT_DIR = path.join('public', 'assets', 'imgs', 'roll');
const MANIFEST = path.join('data', 'portfolios', 'roll.json');

function readEnv() {
  const file = '.env.local';
  if (!fs.existsSync(file)) throw new Error('.env.local not found — run this locally, not on CI.');
  return Object.fromEntries(
    fs
      .readFileSync(file, 'utf8')
      .split(/\r?\n/)
      .filter((l) => l.includes('=') && !l.startsWith('#'))
      .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()])
  );
}

// Upload filenames leak into titles (facebook ids, uuids). Anything that is
// mostly digits or hex gets a clean, human label instead.
const isJunk = (t) =>
  !t ||
  /[0-9a-f]{8,}/i.test(t) ||           // uuid / hash fragments
  /\d{6,}/.test(t) ||                  // facebook-style numeric ids
  /^\d/.test(t.trim()) ||              // "1ganpati"
  /^logo[\s_-]*options?\b/i.test(t) || // export series names
  t.replace(/[^a-z]/gi, '').length < 4;
const SOCIAL_TITLES = [
  'Festival Campaign', 'Brand Post', 'Product Launch', 'Awareness Post',
  'Seasonal Campaign', 'Promo Creative', 'Event Creative', 'Social Series',
];

(async () => {
  const env = readEnv();
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Supabase URL/key missing from .env.local');

  const rows = await (
    await fetch(
      url + '/rest/v1/portfolio_items?select=id,title,category,image_url,website_url&limit=300',
      { headers: { apikey: key, Authorization: 'Bearer ' + key } }
    )
  ).json();

  // Website entries are link cards, not artwork.
  const pool = rows.filter((i) => !i.website_url && i.image_url && i.image_url.startsWith('http'));
  if (!pool.length) throw new Error('no usable graphics returned');

  // Mix the categories so the roll is not eight of the same thing in a row.
  const byCat = {};
  pool.forEach((i) => { (byCat[i.category] || (byCat[i.category] = [])).push(i); });
  const cats = Object.keys(byCat);
  const pick = [];
  for (let n = 0; pick.length < Math.min(HOW_MANY, pool.length); n++) {
    const bucket = byCat[cats[n % cats.length]];
    const next = bucket && bucket.shift();
    if (next) pick.push(next);
    else if (cats.every((c) => !byCat[c].length)) break;
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.readdirSync(OUT_DIR).forEach((f) => fs.unlinkSync(path.join(OUT_DIR, f)));

  const manifest = [];
  let socialIdx = 0;
  for (const item of pick) {
    const res = await fetch(item.image_url);
    if (!res.ok) { console.warn('skipped', res.status, item.image_url); continue; }
    const buf = Buffer.from(await res.arrayBuffer());
    const ext = (item.image_url.split('.').pop().split('?')[0] || 'webp').toLowerCase();
    const file = 'cm-' + String(manifest.length + 1).padStart(2, '0') + '.' + ext;
    fs.writeFileSync(path.join(OUT_DIR, file), buf);

    const category = item.category || 'Creative Work';
    let title = (item.title || '').replace(/[_-]+/g, ' ').trim();
    if (isJunk(title)) {
      title = category === 'Logo' ? 'Logo Concept' : SOCIAL_TITLES[socialIdx++ % SOCIAL_TITLES.length];
    } else {
      title = title.replace(/\b\w/g, (c) => c.toUpperCase()).replace(/\s+\d+x\d+$/, '').trim();
    }

    manifest.push({ img: '/assets/imgs/roll/' + file, title, category });
    console.log(String(Math.round(buf.length / 1024)).padStart(4) + ' KB  ' + category.padEnd(14) + title);
  }

  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
  console.log('\n' + manifest.length + ' graphics written to ' + OUT_DIR + ' and ' + MANIFEST);
})().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
