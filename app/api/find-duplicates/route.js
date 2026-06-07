import { NextResponse } from 'next/server';
import crypto from 'crypto';
import sharp from 'sharp';

// ── Perceptual dHash via sharp (supports WebP, JPEG, PNG, AVIF…) ──────────
// Resize to 9×8, grayscale → 64 difference bits
async function pHash(buffer) {
  try {
    const { data } = await sharp(buffer)
      .resize(9, 8, { fit: 'fill' })
      .greyscale()
      .raw()
      .toBuffer({ resolveWithObject: true });

    let bits = '';
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const left  = data[y * 9 + x];
        const right = data[y * 9 + x + 1];
        bits += left > right ? '1' : '0';
      }
    }
    return bits; // 64-char binary string
  } catch {
    return null;
  }
}

function hammingDistance(a, b) {
  if (!a || !b || a.length !== b.length) return 999;
  let d = 0;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) d++;
  return d;
}

export async function POST(request) {
  const { items } = await request.json().catch(() => ({}));
  if (!items?.length) return NextResponse.json({ error: 'No items' }, { status: 400 });

  const encoder = new TextEncoder();
  const stream  = new TransformStream();
  const writer  = stream.writable.getWriter();

  const send = async (obj) => {
    await writer.write(encoder.encode(JSON.stringify(obj) + '\n'));
  };

  (async () => {
    try {
      // ── Step 1: download + hash every image ──────────────────────────────
      const imageData = []; // { item, sha256, pHashBits }

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        await send({ type: 'log', msg: `🔍 Hashing ${i + 1}/${items.length}: ${item.title || item.id}` });

        try {
          const res = await fetch(item.image_url, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
            signal: AbortSignal.timeout(15000),
          });

          if (!res.ok) {
            imageData.push({ item, sha256: null, pHashBits: null });
            continue;
          }

          const buf = Buffer.from(await res.arrayBuffer());
          const sha = crypto.createHash('sha256').update(buf).digest('hex');
          const ph  = await pHash(buf);
          imageData.push({ item, sha256: sha, pHashBits: ph });

        } catch (err) {
          await send({ type: 'log', msg: `⚠️  Skipped ${item.title || item.id}: ${err.message}` });
          imageData.push({ item, sha256: null, pHashBits: null });
        }
      }

      // ── Step 2: group duplicates ──────────────────────────────────────────
      await send({ type: 'log', msg: '🗂 Grouping visual duplicates...' });

      const seenIds = new Set();
      const groups  = [];

      // Pass A — exact byte match (SHA-256)
      const byHash = {};
      for (const d of imageData) {
        if (!d.sha256) continue;
        (byHash[d.sha256] = byHash[d.sha256] || []).push(d);
      }
      for (const arr of Object.values(byHash)) {
        if (arr.length < 2) continue;
        const sorted = [...arr].sort((a, b) => new Date(b.item.created_at) - new Date(a.item.created_at));
        const keep   = sorted[0].item;
        const remove = sorted.slice(1).map(d => d.item).filter(i => !seenIds.has(i.id) && i.id !== keep.id);
        if (!remove.length) continue;
        remove.forEach(i => seenIds.add(i.id));
        groups.push({ keep, remove, matchedBy: 'Identical bytes (SHA-256)', count: remove.length });
      }

      // Pass B — perceptual hash (same graphic, different resolution/compression/format)
      // Hamming distance ≤ 12 out of 64 bits → same visual content
      const THRESHOLD = 12;
      const phGroups  = []; // [{ representative, members[] }]

      for (const d of imageData) {
        if (!d.pHashBits) continue;
        if (seenIds.has(d.item.id)) continue;

        let matched = false;
        for (const pg of phGroups) {
          if (hammingDistance(d.pHashBits, pg.representative) <= THRESHOLD) {
            pg.members.push(d);
            matched = true;
            break;
          }
        }
        if (!matched) phGroups.push({ representative: d.pHashBits, members: [d] });
      }

      for (const pg of phGroups) {
        if (pg.members.length < 2) continue;
        const sorted = [...pg.members].sort((a, b) => new Date(b.item.created_at) - new Date(a.item.created_at));
        const keep   = sorted[0].item;
        const remove = sorted.slice(1).map(d => d.item).filter(i => !seenIds.has(i.id) && i.id !== keep.id);
        if (!remove.length) continue;
        remove.forEach(i => seenIds.add(i.id));
        groups.push({ keep, remove, matchedBy: 'Same graphic (visual hash)', count: remove.length });
      }

      const totalDups = groups.reduce((s, g) => s + g.count, 0);
      await send({ type: 'log', msg: `✅ Done — ${totalDups} duplicate(s) found in ${groups.length} group(s)` });
      await send({ type: 'done', groups, totalDups });

    } catch (err) {
      await send({ type: 'error', error: err.message });
    } finally {
      await writer.close();
    }
  })();

  return new Response(stream.readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Transfer-Encoding': 'chunked' },
  });
}
