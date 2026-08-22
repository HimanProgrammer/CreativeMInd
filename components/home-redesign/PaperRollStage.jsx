'use client';
import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
// Real CreativeMind graphics, pulled from the Supabase portfolio and committed
// under public/ so the roll prints our own work even when the deployment can't
// reach Supabase. Regenerate with: npm run sync-roll
import LOCAL_WORKS from '@/data/portfolios/roll.json';

/* ============================================================
   THE PRINTING ROLL — CreativeMind edition
   A heavy paper roll wanders the floor and prints our portfolio
   behind it. One texture atlas (8 cards), one ribbon mesh,
   fixed vertex budget, zero per-frame allocations.

   Ported from the standalone VX demo and adapted:
   - the atlas cards carry real portfolio images from Supabase
   - the canvas is container-sized, not fullscreen
   - it only animates while the stage is on screen

   This file is just the stage (canvas + HUD). It is used both by
   the full-width PaperRoll section and by the hero slider.
   ============================================================ */

const THREE_SRC = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
const ATLAS_N = 8; // cards in the atlas — also one full revolution of the roll
export const ORANGE = '#f05a28';

// three r128 is loaded from a CDN once, shared by every mount.
let threePromise = null;
function loadThree() {
  if (window.THREE) return Promise.resolve(window.THREE);
  if (!threePromise) {
    threePromise = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = THREE_SRC;
      s.async = true;
      s.onload = () => resolve(window.THREE);
      s.onerror = () => { threePromise = null; reject(new Error('three.js failed to load')); };
      document.head.appendChild(s);
    });
  }
  return threePromise;
}

function pickSrc(item) {
  if (item.image_url && item.image_url.startsWith('http')) return item.image_url;
  if (item.thumbnail_url && item.thumbnail_url.startsWith('http')) return item.thumbnail_url;
  const m = (item.video_url || '').match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([a-zA-Z0-9_-]{11})/);
  return m ? `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg` : null;
}

// Cross-origin images must be CORS-clean or the atlas canvas is tainted and
// WebGL refuses to upload it. A failed load just leaves that card typographic.
function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

/**
 * @param {boolean} compact  smaller HUD type, for the hero slider
 * @param {boolean} active   false parks the loop (a slider slide that is off screen)
 */
export default function PaperRollStage({ compact = false, active = true }) {
  const hostRef = useRef(null);
  const canvasRef = useRef(null);
  const counterRef = useRef(null);
  const meterRef = useRef(null);
  const activeRef = useRef(active);
  // When WebGL can't run (old phone, blocked context, three.js not reachable)
  // the stage falls back to a plain image wall instead of an empty grey box.
  const [fallback, setFallback] = useState(null);

  // The loop reads this every frame, so toggling slides never restarts WebGL.
  useEffect(() => { activeRef.current = active; }, [active]);

  useEffect(() => {
    let disposed = false;
    const cleanups = [];

    (async () => {
      // ---------- portfolio cards ----------
      // Build the FULL shuffled pool of works so the roll can cycle through the
      // entire portfolio over time instead of looping the same 8 cards. The
      // 8-card atlas stays (a 4096px texture is the mobile ceiling); we just
      // repaint it with the next batch each revolution — see advanceAtlas().
      let remote = [];
      try {
        const { data } = await supabase
          .from('portfolio_items')
          .select('id,title,category,image_url,thumbnail_url,video_url,website_url')
          .limit(300);
        if (data) {
          remote = data
            .filter((i) => !i.website_url)
            .map((i) => ({ title: i.title || '', category: i.category || '', src: pickSrc(i) }))
            .filter((i) => i.src);
          for (let i = remote.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [remote[i], remote[j]] = [remote[j], remote[i]];
          }
        }
      } catch { /* fall through to the bundled deck below */ }

      // Bundled deck ships with the repo — same-origin (CORS-safe) and used both
      // as the tail of the pool and as spares when a remote image fails to load.
      const local = LOCAL_WORKS
        .filter((w) => w && w.img)
        .map((w) => ({ title: w.title || '', category: w.category || '', src: w.img }));

      // The roll must never print blank plates, so always fold the bundled deck
      // in after the (shuffled) remote works.
      const fullPool = remote.concat(local);
      if (!fullPool.length) return; // nothing at all to print

      // Lazily load + cache images by pool index; a failed remote load falls
      // back to a bundled spare so a card is never blank.
      const imgCache = new Map();
      async function imgAt(idx) {
        const i = ((idx % fullPool.length) + fullPool.length) % fullPool.length;
        if (imgCache.has(i)) return imgCache.get(i);
        let im = await loadImage(fullPool[i].src);
        if (!im && local.length) im = await loadImage(local[i % local.length].src);
        imgCache.set(i, im);
        return im;
      }

      // Load one atlas-worth (ATLAS_N) of works starting at `start`, wrapping.
      async function loadBatch(start) {
        const w = [], im = [];
        for (let k = 0; k < ATLAS_N; k++) {
          const i = (start + k) % fullPool.length;
          w.push(fullPool[i]);
          im.push(await imgAt(i));
        }
        return { w, im };
      }

      // The ATLAS_N cards currently painted on the atlas, and where they came
      // from in the pool. advanceAtlas() moves the cursor forward each cycle.
      let cursor = 0;
      let repaintAtlas = null; // set by buildAtlas(); repaints the shared canvas
      let currentWorks = [];
      let currentImages = [];
      {
        const b = await loadBatch(0);
        if (disposed) return;
        currentWorks = b.w;
        currentImages = b.im;
      }

      const showFallback = () => {
        if (!disposed) setFallback(currentWorks.filter((w) => w && w.src).slice(0, 6));
      };

      let THREE;
      try {
        THREE = await loadThree();
      } catch {
        showFallback(); // CDN blocked or offline
        return;
      }
      if (disposed || !canvasRef.current) return;

      const host = hostRef.current;
      const canvas = canvasRef.current;

      // ---------- Constants ----------
      const RIBBON_W = 1.5;
      const ROLL_R = 1.75;
      const CARD_LEN = (2 * Math.PI * ROLL_R) / ATLAS_N;
      const INNER_R = ROLL_R * 0.52;
      const STEP = 0.12;
      const MAX_PTS = 760;
      const CURL_SEG = 16;
      const MAX_SEG = MAX_PTS + CURL_SEG + 2;
      const FLOOR_RGB = 'vec3(0.905, 0.905, 0.912)';

      // ---------- Renderer / scene ----------
      let W = host.clientWidth || 1;
      let H = host.clientHeight || 1;

      // Phone budget: no antialias, DPR capped at 1.5, no shadow pass, and a
      // smaller atlas. Shadow maps and a 4096px-wide texture are what push this
      // over the edge on mid-range mobile GPUs, where the context is either
      // refused outright or drops to single-digit frame rates.
      const small = window.innerWidth < 768;

      let renderer;
      try {
        renderer = new THREE.WebGLRenderer({
          canvas,
          antialias: !small,
          powerPreference: 'high-performance',
          failIfMajorPerformanceCaveat: false,
        });
        if (!renderer.getContext()) throw new Error('no webgl context');
      } catch {
        showFallback();
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2));
      renderer.setSize(W, H, false);
      renderer.shadowMap.enabled = !small;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.outputEncoding = THREE.sRGBEncoding;

      // A context lost on a backgrounded phone tab never comes back on its own.
      const onContextLost = (e) => { e.preventDefault(); showFallback(); };
      canvas.addEventListener('webglcontextlost', onContextLost, false);
      cleanups.push(() => canvas.removeEventListener('webglcontextlost', onContextLost));

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xeaeaec);
      scene.fog = new THREE.Fog(0xeaeaec, 24, 58);

      const camera = new THREE.PerspectiveCamera(28, W / H, 0.5, 200);

      // ---------- Lighting ----------
      scene.add(new THREE.HemisphereLight(0xffffff, 0xd6d6da, 0.95));

      const sun = new THREE.DirectionalLight(0xffffff, 0.85);
      sun.castShadow = !small;
      sun.shadow.mapSize.set(small ? 1024 : 2048, small ? 1024 : 2048);
      sun.shadow.camera.left = -9;
      sun.shadow.camera.right = 9;
      sun.shadow.camera.top = 9;
      sun.shadow.camera.bottom = -9;
      sun.shadow.camera.near = 1;
      sun.shadow.camera.far = 40;
      sun.shadow.bias = -0.0004;
      sun.shadow.normalBias = 0.02;
      scene.add(sun);
      scene.add(sun.target);

      const fillLight = new THREE.DirectionalLight(0xffffff, 0.22);
      fillLight.position.set(-6, 4, -8);
      scene.add(fillLight);

      // ---------- Floor ----------
      const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(400, 400),
        new THREE.MeshStandardMaterial({ color: 0xe7e7ea, roughness: 1, metalness: 0 })
      );
      floor.rotation.x = -Math.PI / 2;
      floor.receiveShadow = true;
      scene.add(floor);

      let seed = 7;
      function rand() {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
      }

      // ============================================================
      // Atlas — ATLAS_N portfolio cards on one strip
      // ============================================================
      function buildAtlas() {
        // 8 × 512 = 4096px, exactly the max texture size on a lot of phones —
        // one pixel over and the upload silently fails. 320 keeps mobile clear
        // of the ceiling at 2560px.
        const CELL = small ? 320 : 512;
        const K = CELL / 512; // every offset below was drawn for a 512px cell
        const cv = document.createElement('canvas');
        cv.width = CELL * ATLAS_N;
        cv.height = CELL;
        const g = cv.getContext('2d');
        const INK = '#161616';
        const PAPER = '#fbfaf7';

        const M = 30 * K;

        function cardFrame(cx) {
          const x = cx + M, y = M, w = CELL - M * 2, h = CELL - M * 2;
          g.save();
          g.shadowColor = 'rgba(30,30,30,0.10)';
          g.shadowBlur = 14;
          g.shadowOffsetY = 3;
          g.fillStyle = PAPER;
          g.fillRect(x, y, w, h);
          g.restore();
          g.strokeStyle = 'rgba(20,20,20,0.08)';
          g.lineWidth = 1;
          g.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
          return { x, y, w, h };
        }

        function label(x, y, txt, color, size, weight) {
          g.fillStyle = color || INK;
          g.font = (weight || 700) + ' ' + (size || 13) * K + 'px "Plus Jakarta Sans", -apple-system, "Segoe UI", Helvetica, Arial, sans-serif';
          g.fillText(txt, x, y);
        }
        function mono(x, y, txt, color, size) {
          g.fillStyle = color || '#8a8a86';
          g.font = '600 ' + (size || 11) * K + 'px "SF Mono", Menlo, Consolas, monospace';
          g.fillText(txt, x, y);
        }
        function clip(txt, max, size) {
          g.font = '700 ' + size * K + 'px "Plus Jakarta Sans", Helvetica, Arial, sans-serif';
          let s = txt;
          while (s.length > 3 && g.measureText(s).width > max) s = s.slice(0, -1);
          return s === txt ? s : s.trim() + '…';
        }

        // cover-fit: fill the plate, crop the overflow — never letterbox
        function cover(img, x, y, w, h) {
          const sc = Math.max(w / img.width, h / img.height);
          const dw = img.width * sc, dh = img.height * sc;
          g.save();
          g.beginPath();
          g.rect(x, y, w, h);
          g.clip();
          g.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
          g.restore();
        }

        function plate(f, img) {
          const px = f.x + 20 * K, py = f.y + 20 * K, pw = f.w - 40 * K, ph = f.h * 0.66;
          if (img) {
            cover(img, px, py, pw, ph);
          } else {
            const gr = g.createLinearGradient(px, py, px + pw, py + ph);
            gr.addColorStop(0, '#2c2c30');
            gr.addColorStop(1, '#141416');
            g.fillStyle = gr;
            g.fillRect(px, py, pw, ph);
            g.fillStyle = ORANGE;
            g.fillRect(px + 28 * K, py + ph - 46 * K, 70 * K, 8 * K);
          }
          g.strokeStyle = 'rgba(20,20,20,0.10)';
          g.lineWidth = 1;
          g.strokeRect(px + 0.5, py + 0.5, pw - 1, ph - 1);
          return py + ph;
        }

        function drawCard(cx, n) {
          const f = cardFrame(cx);
          const work = currentWorks[n] || null;
          const bottom = plate(f, currentImages[n]);

          // caption block
          const cat = (work && work.category ? work.category : 'Creative Work').toUpperCase();
          label(f.x + 22 * K, bottom + 42 * K, clip(work && work.title ? work.title : 'CreativeMind', f.w - 44 * K, 22), INK, 22);
          g.fillStyle = ORANGE;
          g.fillRect(f.x + 22 * K, bottom + 60 * K, 48 * K, 5 * K);
          mono(f.x + 22 * K, bottom + 92 * K, cat.slice(0, 28), '#7c7c80', 12);
          label(f.x + 22 * K, f.h + f.y - 24 * K, 'CREATIVEMIND', '#9a9994', 12, 800);
          mono(f.x + f.w - 96 * K, f.h + f.y - 24 * K, 'IT SOLUTIONS', '#b3b2ad', 11);

          // index tag down the right edge
          g.save();
          g.translate(f.x + f.w - 12 * K, f.y + f.h - 14 * K);
          g.rotate(-Math.PI / 2);
          mono(0, 0, '0' + (n + 1) + '/00' + ATLAS_N, '#9a9994', 11);
          g.restore();
        }

        // Paints all ATLAS_N cards onto the shared canvas. Re-run each cycle
        // (via repaintAtlas) to swap the whole atlas to the next batch of works.
        function paint() {
          seed = 7; // deterministic grain, so repaints never flicker the paper
          g.fillStyle = '#f6f5f1';
          g.fillRect(0, 0, cv.width, cv.height);
          // faint fibre grain, so the paper never reads as flat vector
          for (let i = 0; i < 2600; i++) {
            g.fillStyle = 'rgba(120,116,105,' + (0.015 + rand() * 0.03) + ')';
            g.fillRect(rand() * cv.width, rand() * cv.height, 1 + rand() * 2, 1);
          }
          for (let c = 0; c < ATLAS_N; c++) drawCard(c * CELL, c);
        }

        repaintAtlas = paint; // exposed so advanceAtlas() can recycle the atlas
        paint();

        const tex = new THREE.CanvasTexture(cv);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.ClampToEdgeWrapping;
        tex.encoding = THREE.sRGBEncoding;
        tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
        return tex;
      }

      // Spiral cap: hundreds of wound paper layers, drawn once
      function buildCapTexture() {
        const S = small ? 512 : 1024;
        const cv = document.createElement('canvas');
        cv.width = S; cv.height = S;
        const g = cv.getContext('2d');
        const cx = S / 2;
        const innerPx = (INNER_R / ROLL_R) * (S / 2);

        g.fillStyle = '#f2f1ec';
        g.fillRect(0, 0, S, S);
        for (let r = innerPx; r < S / 2 - 1; r += 2.1) {
          const a = 0.045 + rand() * 0.1 + (r % 29 < 2.2 ? 0.12 : 0);
          g.strokeStyle = 'rgba(112,110,102,' + a.toFixed(3) + ')';
          g.lineWidth = rand() < 0.12 ? 1.6 : 0.8;
          g.beginPath();
          g.arc(cx, cx, r, 0, Math.PI * 2);
          g.stroke();
        }
        g.strokeStyle = 'rgba(90,88,80,0.35)';
        g.lineWidth = 1.4;
        g.beginPath();
        for (let t = 0; t <= 1; t += 0.002) {
          const rr = innerPx + t * (S / 2 - innerPx - 2);
          const an = t * 26 * Math.PI * 2;
          const px = cx + Math.cos(an) * rr, py = cx + Math.sin(an) * rr;
          if (t === 0) g.moveTo(px, py); else g.lineTo(px, py);
        }
        g.stroke();
        const sh = g.createRadialGradient(cx, cx, innerPx, cx, cx, innerPx + 90);
        sh.addColorStop(0, 'rgba(60,58,52,0.32)');
        sh.addColorStop(1, 'rgba(60,58,52,0)');
        g.fillStyle = sh;
        g.beginPath(); g.arc(cx, cx, S / 2, 0, Math.PI * 2); g.fill();
        const rim = g.createRadialGradient(cx, cx, S / 2 - 26, cx, cx, S / 2);
        rim.addColorStop(0, 'rgba(60,58,52,0)');
        rim.addColorStop(1, 'rgba(60,58,52,0.22)');
        g.fillStyle = rim;
        g.beginPath(); g.arc(cx, cx, S / 2, 0, Math.PI * 2); g.fill();

        const tex = new THREE.CanvasTexture(cv);
        tex.encoding = THREE.sRGBEncoding;
        tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
        return tex;
      }

      function buildBlobTexture() {
        const S = 256;
        const cv = document.createElement('canvas');
        cv.width = S; cv.height = S;
        const g = cv.getContext('2d');
        const gr = g.createRadialGradient(S / 2, S / 2, 6, S / 2, S / 2, S / 2);
        gr.addColorStop(0, 'rgba(20,20,22,0.34)');
        gr.addColorStop(0.55, 'rgba(20,20,22,0.14)');
        gr.addColorStop(1, 'rgba(20,20,22,0)');
        g.fillStyle = gr;
        g.fillRect(0, 0, S, S);
        return new THREE.CanvasTexture(cv);
      }

      const atlasTex = buildAtlas();
      const capTex = buildCapTexture();
      const blobTex = buildBlobTexture();

      // ============================================================
      // The roll
      // ============================================================
      const rollGroup = new THREE.Group();
      const spinner = new THREE.Group();
      rollGroup.add(spinner);
      scene.add(rollGroup);

      // Circumference == atlas length, so the card on the barrel is exactly the
      // card the ribbon prints under it — the hand-off never drifts.
      const barrelTex = atlasTex.clone();
      barrelTex.needsUpdate = true;
      barrelTex.wrapS = THREE.RepeatWrapping;
      barrelTex.wrapT = THREE.ClampToEdgeWrapping;
      barrelTex.repeat.set(1, 1);
      barrelTex.offset.x = 0.25;
      const paperMat = new THREE.MeshStandardMaterial({ map: barrelTex, roughness: 0.92, metalness: 0 });

      const barrelGeo = new THREE.CylinderGeometry(ROLL_R, ROLL_R, RIBBON_W, 96, 1, true);
      barrelGeo.rotateZ(Math.PI / 2);
      const barrel = new THREE.Mesh(barrelGeo, paperMat);
      barrel.castShadow = true;
      spinner.add(barrel);

      const capMat = new THREE.MeshStandardMaterial({ map: capTex, roughness: 0.95, metalness: 0 });
      const capGeo = new THREE.RingGeometry(INNER_R, ROLL_R, 96, 1);
      const capR = new THREE.Mesh(capGeo, capMat);
      capR.rotation.y = Math.PI / 2;
      capR.position.x = RIBBON_W / 2 + 0.001;
      capR.castShadow = true;
      spinner.add(capR);
      const capL = new THREE.Mesh(capGeo, capMat);
      capL.rotation.y = -Math.PI / 2;
      capL.position.x = -RIBBON_W / 2 - 0.001;
      capL.castShadow = true;
      spinner.add(capL);

      const coreGeo = new THREE.CylinderGeometry(INNER_R, INNER_R, RIBBON_W * 1.002, 48, 1, true);
      coreGeo.rotateZ(Math.PI / 2);
      const coreMat = new THREE.MeshStandardMaterial({ color: 0xdad7cf, roughness: 1, metalness: 0, side: THREE.DoubleSide });
      spinner.add(new THREE.Mesh(coreGeo, coreMat));

      const blobGeo = new THREE.PlaneGeometry(ROLL_R * 3.4, RIBBON_W * 2.2);
      const blobMat = new THREE.MeshBasicMaterial({ map: blobTex, transparent: true, depthWrite: false });
      const blob = new THREE.Mesh(blobGeo, blobMat);
      blob.rotation.x = -Math.PI / 2;
      blob.renderOrder = 1;
      scene.add(blob);

      // ============================================================
      // Ribbon — one fixed-budget mesh, rebuilt in place each frame
      // ============================================================
      const VERTS = (MAX_SEG + 1) * 2;
      const posArr = new Float32Array(VERTS * 3);
      const nrmArr = new Float32Array(VERTS * 3);
      const uvArr = new Float32Array(VERTS * 2);
      const sArr = new Float32Array(VERTS);
      const idxArr = new Uint16Array(MAX_SEG * 6);
      for (let iq = 0; iq < MAX_SEG; iq++) {
        const v0 = iq * 2;
        idxArr[iq * 6 + 0] = v0;
        idxArr[iq * 6 + 1] = v0 + 1;
        idxArr[iq * 6 + 2] = v0 + 2;
        idxArr[iq * 6 + 3] = v0 + 1;
        idxArr[iq * 6 + 4] = v0 + 3;
        idxArr[iq * 6 + 5] = v0 + 2;
      }

      const ribbonGeo = new THREE.BufferGeometry();
      ribbonGeo.setAttribute('position', new THREE.BufferAttribute(posArr, 3).setUsage(THREE.DynamicDrawUsage));
      ribbonGeo.setAttribute('normal', new THREE.BufferAttribute(nrmArr, 3).setUsage(THREE.DynamicDrawUsage));
      ribbonGeo.setAttribute('uv', new THREE.BufferAttribute(uvArr, 2).setUsage(THREE.DynamicDrawUsage));
      ribbonGeo.setAttribute('aS', new THREE.BufferAttribute(sArr, 1).setUsage(THREE.DynamicDrawUsage));
      ribbonGeo.setIndex(new THREE.BufferAttribute(idxArr, 1));
      ribbonGeo.setDrawRange(0, 0);

      const uTailS = { value: 0 };
      const ribbonMat = new THREE.MeshStandardMaterial({ map: atlasTex, roughness: 0.9, metalness: 0, side: THREE.DoubleSide });
      ribbonMat.onBeforeCompile = function (shader) {
        shader.uniforms.uTailS = uTailS;
        shader.vertexShader = shader.vertexShader
          .replace('#include <common>', '#include <common>\nattribute float aS;\nvarying float vS;')
          .replace('#include <begin_vertex>', '#include <begin_vertex>\nvS = aS;');
        shader.fragmentShader = shader.fragmentShader
          .replace('#include <common>', '#include <common>\nvarying float vS;\nuniform float uTailS;')
          .replace(
            '#include <map_fragment>',
            '#include <map_fragment>\n' +
              // the tail dissolves into the floor before it is recycled
              'float tail = smoothstep(uTailS, uTailS + 3.0, vS);\n' +
              'diffuseColor.rgb = mix(' + FLOOR_RGB + ', diffuseColor.rgb, tail);'
          );
      };

      const ribbon = new THREE.Mesh(ribbonGeo, ribbonMat);
      ribbon.frustumCulled = false;
      ribbon.receiveShadow = true;
      scene.add(ribbon);

      // ============================================================
      // Motion solver — heavy spring-damper, real rolling
      // ============================================================
      const pos = new THREE.Vector2(0, 0);
      const vel = new THREE.Vector2(0, 0);
      const target = new THREE.Vector2(0, 0);
      let yaw = 0;
      let sTotal = 0;
      const REV = 2 * Math.PI * ROLL_R;
      const SPRING = 16.0, DAMP = 5.4, MAX_SPEED = 9.0;

      const hx = new Float32Array(MAX_PTS);
      const hz = new Float32Array(MAX_PTS);
      const hs = new Float32Array(MAX_PTS);
      let head = -1, count = 0;

      function pushPoint(x, z, s) {
        head = (head + 1) % MAX_PTS;
        hx[head] = x; hz[head] = z; hs[head] = s;
        if (count < MAX_PTS) count++;
      }
      function getPt(i, out) {
        const k = (head - (count - 1) + i + MAX_PTS * 2) % MAX_PTS;
        out.x = hx[k]; out.z = hz[k]; out.s = hs[k];
      }
      pushPoint(0, 0, 0);

      function angleLerp(a, b, t) {
        let d = b - a;
        while (d > Math.PI) d -= Math.PI * 2;
        while (d < -Math.PI) d += Math.PI * 2;
        return a + d * t;
      }

      const _acc = new THREE.Vector2();
      const _dp = new THREE.Vector2();

      function stepMotion(dt) {
        _acc.copy(target).sub(pos).multiplyScalar(SPRING);
        _acc.addScaledVector(vel, -DAMP);
        vel.addScaledVector(_acc, dt);
        const sp = vel.length();
        if (sp > MAX_SPEED) vel.multiplyScalar(MAX_SPEED / sp);
        _dp.copy(vel).multiplyScalar(dt);
        const ds = _dp.length();
        if (ds > 1e-6) {
          pos.add(_dp);
          sTotal += ds;
          if (sp > 0.06) yaw = angleLerp(yaw, Math.atan2(vel.x, vel.y), 1 - Math.exp(-7 * dt));
          // sample the path by distance, never by time
          const ddx = pos.x - hx[head], ddz = pos.y - hz[head];
          if (ddx * ddx + ddz * ddz >= STEP * STEP) pushPoint(pos.x, pos.y, sTotal);
        }
      }

      // ============================================================
      // Ribbon rebuild — zero allocations
      // ============================================================
      const _a = { x: 0, z: 0, s: 0 };
      const _b = { x: 0, z: 0, s: 0 };
      const _c = { x: 0, z: 0, s: 0 };
      const CURL_MAX = 0.85;

      function writeVert(vi, x, y, z, nx, ny, nz, u, vv, s) {
        const p3 = vi * 3, p2 = vi * 2;
        posArr[p3] = x; posArr[p3 + 1] = y; posArr[p3 + 2] = z;
        nrmArr[p3] = nx; nrmArr[p3 + 1] = ny; nrmArr[p3 + 2] = nz;
        uvArr[p2] = u; uvArr[p2 + 1] = vv;
        sArr[vi] = s;
      }

      function rebuildRibbon() {
        const n = count;
        if (n < 2) { ribbonGeo.setDrawRange(0, 0); return; }

        getPt(0, _a);
        const sTail = _a.s;
        const half = RIBBON_W / 2;
        let vi = 0;
        const uSpan = CARD_LEN * ATLAS_N;
        const uBase = Math.floor(sTail / uSpan) * uSpan;

        // smoothed forward from yaw — stable even when velocity crosses zero
        const fx = Math.sin(yaw), fz = Math.cos(yaw);
        const sxc = fz, szc = -fx;

        // ---- flat printed trail ----
        let ptx = 0, ptz = 0, hasPrev = false;
        for (let i = 0; i < n; i++) {
          getPt(i, _b);
          let tx, tz;
          if (i === n - 1) {
            tx = fx; tz = fz;
          } else {
            getPt(i > 0 ? i - 1 : 0, _a);
            getPt(i + 1, _c);
            tx = _c.x - _a.x;
            tz = _c.z - _a.z;
          }
          const tl = Math.sqrt(tx * tx + tz * tz);
          if (tl < 1e-4) {
            // degenerate delta at a reversal: reuse the previous tangent
            tx = hasPrev ? ptx : fx;
            tz = hasPrev ? ptz : fz;
          } else {
            tx /= tl; tz /= tl;
          }
          // continuity guard: never let the strip twist through a flip
          if (hasPrev && tx * ptx + tz * ptz < 0) { tx = ptx; tz = ptz; }
          ptx = tx; ptz = tz; hasPrev = true;
          const sx = tz, sz = -tx;

          // width taper at the tail so recycling is invisible
          let w = half;
          const fromTail = _b.s - sTail;
          if (fromTail < 3.0) w *= fromTail / 3.0;

          // newer paper lies on top; the head gets an extra ramp so fresh paper
          // laid over a just-reversed spot never z-fights with itself
          let y = 0.012 + (_b.s - sTail) * 0.0008;
          const headBlend = 1 - (sTotal - _b.s) / 1.5;
          if (headBlend > 0) y += 0.0035 * headBlend;
          const u = (_b.s - uBase) / uSpan;
          writeVert(vi++, _b.x + sx * w, y, _b.z + sz * w, 0, 1, 0, u, 0, _b.s - uBase);
          writeVert(vi++, _b.x - sx * w, y, _b.z - sz * w, 0, 1, 0, u, 1, _b.s - uBase);
        }

        // ---- bridge to the live contact point ----
        const yTop = 0.012 + (sTotal - sTail) * 0.0008 + 0.0035;
        const uC = (sTotal - uBase) / uSpan;
        writeVert(vi++, pos.x + sxc * half, yTop, pos.y + szc * half, 0, 1, 0, uC, 0, sTotal - uBase);
        writeVert(vi++, pos.x - sxc * half, yTop, pos.y - szc * half, 0, 1, 0, uC, 1, sTotal - uBase);

        // ---- peel: unprinted paper coming down the front of the barrel ----
        for (let j = 1; j <= CURL_SEG; j++) {
          const th = (j / CURL_SEG) * CURL_MAX;
          const rr = ROLL_R + 0.012;
          const px = pos.x + fx * Math.sin(th) * rr;
          const pz = pos.y + fz * Math.sin(th) * rr;
          const py = yTop + rr * (1 - Math.cos(th));
          // paper-face normal, continuous with the flat trail at th = 0
          const nx = -fx * Math.sin(th), nyv = Math.cos(th), nz = -fz * Math.sin(th);
          const sHere = sTotal + th * ROLL_R;
          const uH = (sHere - uBase) / uSpan;
          writeVert(vi++, px + sxc * half, py, pz + szc * half, nx, nyv, nz, uH, 0, sHere - uBase);
          writeVert(vi++, px - sxc * half, py, pz - szc * half, nx, nyv, nz, uH, 1, sHere - uBase);
        }

        const segs = vi / 2 - 1;
        ribbonGeo.setDrawRange(0, segs * 6);
        ribbonGeo.attributes.position.needsUpdate = true;
        ribbonGeo.attributes.normal.needsUpdate = true;
        ribbonGeo.attributes.uv.needsUpdate = true;
        ribbonGeo.attributes.aS.needsUpdate = true;
        uTailS.value = sTail - uBase;
      }

      // ============================================================
      // Input — pointer on the floor plane, with idle autopilot
      // ============================================================
      const raycaster = new THREE.Raycaster();
      const ndc = new THREE.Vector2(0, 0);
      const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const hit = new THREE.Vector3();
      let pointerActive = false;
      let lastPointerT = -1e9;
      let autoAngle = Math.PI * 0.25;

      function onPointer(e) {
        let x = e.clientX, y = e.clientY;
        if (e.touches && e.touches.length) { x = e.touches[0].clientX; y = e.touches[0].clientY; }
        if (x === undefined) return;
        // coordinates are relative to the stage, not the window
        const r = canvas.getBoundingClientRect();
        if (x < r.left || x > r.right || y < r.top || y > r.bottom) return;
        ndc.x = ((x - r.left) / r.width) * 2 - 1;
        ndc.y = -((y - r.top) / r.height) * 2 + 1;
        pointerActive = true;
        lastPointerT = performance.now();
      }
      // Touch moves are not intercepted: the page must still scroll on mobile.
      host.addEventListener('pointermove', onPointer, { passive: true });
      host.addEventListener('pointerdown', onPointer, { passive: true });
      cleanups.push(() => {
        host.removeEventListener('pointermove', onPointer);
        host.removeEventListener('pointerdown', onPointer);
      });

      function updateTarget(t, dt) {
        const idle = performance.now() - lastPointerT > 3200;
        if (pointerActive && !idle) {
          raycaster.setFromCamera(ndc, camera);
          if (raycaster.ray.intersectPlane(floorPlane, hit)) target.set(hit.x, hit.z);
        } else {
          // wandering autopilot — always in motion, never a straight line
          autoAngle += dt * (0.34 + 0.5 * Math.sin(t * 0.31) + 0.3 * Math.sin(t * 0.113 + 2.1));
          target.set(pos.x + Math.sin(autoAngle) * 5.2, pos.y + Math.cos(autoAngle) * 5.2);
        }
      }

      // ---------- Camera ----------
      // a phone's tall, narrow frame crops the roll badly at the desktop
      // distance, so the camera pulls back on small screens
      const camOffset = new THREE.Vector3(7.6, 8.8, 10.8).multiplyScalar(small ? 1.32 : 1);
      const camPos = new THREE.Vector3();
      const lookAt = new THREE.Vector3(0, 0.6, 0);
      const _desired = new THREE.Vector3();
      let zoom = 1.5; // eased to 1 as the intro settles

      function updateCamera(dt) {
        zoom += (1 - zoom) * (1 - Math.exp(-1.2 * dt));
        _desired.set(pos.x, 0, pos.y).addScaledVector(camOffset, zoom);
        const k = 1 - Math.exp(-2.6 * dt);
        camPos.lerp(_desired, k);
        _desired.set(pos.x, 0.55, pos.y);
        lookAt.lerp(_desired, k);
        camera.position.copy(camPos);
        camera.lookAt(lookAt);
      }

      // ---------- HUD ----------
      let lastPrinted = -1;
      function updateHUD() {
        const printed = Math.floor(sTotal / CARD_LEN);
        if (printed !== lastPrinted) {
          lastPrinted = printed;
          if (counterRef.current) counterRef.current.textContent = String(printed).padStart(4, '0');
        }
        if (meterRef.current) {
          meterRef.current.style.width = (((sTotal % CARD_LEN) / CARD_LEN) * 100).toFixed(1) + '%';
        }
      }

      // ---------- Pre-roll: lay a trail before the first frame ----------
      (function preroll() {
        let t0 = 0;
        for (let i = 0; i < 560; i++) {
          t0 += 1 / 60;
          autoAngle += (1 / 60) * (0.34 + 0.5 * Math.sin(t0 * 0.31) + 0.3 * Math.sin(t0 * 0.113 + 2.1));
          target.set(pos.x + Math.sin(autoAngle) * 5.2, pos.y + Math.cos(autoAngle) * 5.2);
          stepMotion(1 / 60);
        }
        camPos.set(pos.x, 0, pos.y).addScaledVector(camOffset, zoom);
        lookAt.set(pos.x, 0.55, pos.y);
      })();

      // ---------- Resize to the stage, not the window ----------
      function resize() {
        const nw = host.clientWidth || 1;
        const nh = host.clientHeight || 1;
        if (nw === W && nh === H) return;
        W = nw; H = nh;
        camera.aspect = W / H;
        camera.updateProjectionMatrix();
        renderer.setSize(W, H, false);
      }
      const ro = new ResizeObserver(resize);
      ro.observe(host);
      cleanups.push(() => ro.disconnect());
      resize();

      // ---------- Only run while the stage is on screen ----------
      let visible = true;
      const io = new IntersectionObserver(
        (entries) => { visible = entries[0].isIntersecting; },
        { rootMargin: '120px' }
      );
      io.observe(host);
      cleanups.push(() => io.disconnect());

      // ---------- Atlas recycling: cycle through the whole portfolio ----------
      // One atlas == one full revolution of the roll. Each time the roll turns
      // over, repaint the atlas with the next ATLAS_N works so, given enough
      // rolling, every graphic in the portfolio gets printed — no fixed loop.
      const ATLAS_SPAN = CARD_LEN * ATLAS_N;
      let lastAtlasCycle = Math.floor(sTotal / ATLAS_SPAN); // start after preroll
      let atlasBusy = false;
      async function advanceAtlas() {
        // Nothing to cycle to if the pool is only one atlas deep.
        if (atlasBusy || fullPool.length <= ATLAS_N || !repaintAtlas) return;
        atlasBusy = true;
        try {
          cursor = (cursor + ATLAS_N) % fullPool.length;
          const b = await loadBatch(cursor);
          if (disposed) return;
          currentWorks = b.w;
          currentImages = b.im;
          repaintAtlas();
          atlasTex.needsUpdate = true;   // ribbon + barrel share this canvas
          barrelTex.needsUpdate = true;
        } catch { /* keep the current atlas on any failure */ }
        finally { atlasBusy = false; }
      }

      // ---------- Main loop ----------
      const clock = new THREE.Clock();
      let elapsed = 0;
      let raf = 0;

      function frame() {
        raf = requestAnimationFrame(frame);
        const dt = Math.min(clock.getDelta(), 1 / 30);
        // parked when scrolled away or when this slide is not the one on show
        if (!visible || !activeRef.current) return;
        elapsed += dt;

        updateTarget(elapsed, dt);
        stepMotion(dt);

        // Recycle the atlas to the next batch of works once per revolution.
        const atlasCycle = Math.floor(sTotal / ATLAS_SPAN);
        if (atlasCycle !== lastAtlasCycle) {
          lastAtlasCycle = atlasCycle;
          advanceAtlas();
        }

        rollGroup.position.set(pos.x, ROLL_R, pos.y);
        rollGroup.rotation.y = yaw;
        spinner.rotation.x = (sTotal % REV) / ROLL_R;

        rebuildRibbon();

        blob.position.set(pos.x, 0.006, pos.y);
        blob.rotation.z = yaw - Math.PI / 2;

        floor.position.set(pos.x, 0, pos.y);
        sun.position.set(pos.x + 5, 10, pos.y + 4);
        sun.target.position.set(pos.x, 0, pos.y);

        updateCamera(dt);
        updateHUD();
        renderer.render(scene, camera);
      }
      frame();
      cleanups.push(() => cancelAnimationFrame(raf));

      host.classList.add('pr-ready');

      cleanups.push(() => {
        ribbonGeo.dispose();
        barrelGeo.dispose();
        capGeo.dispose();
        coreGeo.dispose();
        blobGeo.dispose();
        ribbonMat.dispose();
        paperMat.dispose();
        capMat.dispose();
        coreMat.dispose();
        blobMat.dispose();
        atlasTex.dispose();
        barrelTex.dispose();
        capTex.dispose();
        blobTex.dispose();
        renderer.dispose();
      });
    })();

    return () => {
      disposed = true;
      cleanups.forEach((fn) => { try { fn(); } catch { /* already gone */ } });
    };
  }, []);

  return (
    <div className={'pr-stage' + (compact ? ' pr-compact' : '') + (fallback ? ' pr-fallback' : '')} ref={hostRef}>
      {fallback ? (
        <div className="pr-wall">
          {fallback.map((w, i) => (
            <figure key={i} className="pr-wall-card">
              <img src={w.src} alt={w.title || w.category || 'CreativeMind work'} loading="lazy" />
              {(w.title || w.category) && (
                <figcaption>{w.title || w.category}</figcaption>
              )}
            </figure>
          ))}
        </div>
      ) : null}
      <canvas ref={canvasRef} />
      <div className="pr-hud pr-brand">
        <span className="pr-mark">CreativeMind<sup>&reg;</sup></span>
        <span className="pr-sub">Press Division</span>
      </div>
      <div className="pr-hud pr-counter">
        <div className="pr-num" ref={counterRef}>0000</div>
        <div className="pr-lbl">Pages printed</div>
      </div>
      <div className="pr-hud pr-meter"><div className="pr-fill" ref={meterRef} /></div>

      <style>{`
        .pr-stage {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background: #eaeaec;
          border-radius: 18px;
        }
        .pr-stage canvas { display: block; width: 100%; height: 100%; }
        .pr-stage.pr-fallback canvas { display: none; }

        /* shown only when WebGL is unavailable */
        .pr-wall {
          position: absolute;
          inset: 0;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          padding: 10px;
          overflow: hidden;
        }
        .pr-wall-card {
          position: relative;
          margin: 0;
          overflow: hidden;
          border-radius: 10px;
          background: #f2f1ec;
          box-shadow: 0 6px 18px rgba(20,20,43,0.08);
        }
        .pr-wall-card img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .pr-wall-card figcaption {
          position: absolute;
          left: 0; right: 0; bottom: 0;
          padding: 16px 10px 8px;
          background: linear-gradient(to top, rgba(12,12,16,0.78), transparent);
          color: #fff;
          font-size: 10px; font-weight: 700; letter-spacing: 0.04em;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        @media (max-width: 767px) {
          .pr-wall { grid-template-columns: repeat(2, 1fr); }
        }
        .pr-stage .pr-hud {
          position: absolute;
          color: #141414;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.9s ease;
        }
        .pr-stage.pr-ready .pr-hud { opacity: 1; }

        .pr-stage .pr-brand {
          top: 26px; left: 30px;
          display: flex; align-items: baseline; gap: 12px;
        }
        .pr-stage .pr-mark {
          font-size: 22px; font-weight: 800; letter-spacing: -0.04em; font-style: italic;
        }
        .pr-stage .pr-mark sup { font-size: 9px; font-style: normal; vertical-align: super; }
        .pr-stage .pr-sub {
          font-size: 9px; font-weight: 600; letter-spacing: 0.32em;
          text-transform: uppercase; color: #6a6a6e;
        }

        .pr-stage .pr-counter { bottom: 28px; right: 30px; text-align: right; }
        .pr-stage .pr-num {
          font-size: 34px; font-weight: 800; letter-spacing: -0.03em;
          font-variant-numeric: tabular-nums; line-height: 1;
        }
        .pr-stage .pr-lbl {
          margin-top: 6px; font-size: 9px; font-weight: 600; letter-spacing: 0.32em;
          text-transform: uppercase; color: #6a6a6e;
        }

        .pr-stage .pr-meter {
          left: 30px; bottom: 34px; width: 150px; height: 3px;
          background: rgba(20,20,22,0.12); border-radius: 2px; overflow: hidden;
        }
        .pr-stage .pr-fill { height: 100%; width: 0%; background: ${ORANGE}; }

        /* compact = inside the hero slider, where the stage is much smaller */
        .pr-stage.pr-compact .pr-brand { top: 16px; left: 18px; gap: 8px; }
        .pr-stage.pr-compact .pr-mark { font-size: 15px; }
        .pr-stage.pr-compact .pr-sub { font-size: 7px; letter-spacing: 0.26em; }
        .pr-stage.pr-compact .pr-counter { bottom: 16px; right: 18px; }
        .pr-stage.pr-compact .pr-num { font-size: 22px; }
        .pr-stage.pr-compact .pr-lbl { font-size: 7px; letter-spacing: 0.26em; margin-top: 4px; }
        .pr-stage.pr-compact .pr-meter { left: 18px; bottom: 20px; width: 92px; }

        @media (max-width: 767px) {
          .pr-stage { border-radius: 12px; }
          .pr-stage .pr-num { font-size: 26px; }
          .pr-stage .pr-brand { top: 18px; left: 18px; }
          .pr-stage .pr-counter { bottom: 18px; right: 18px; }
          .pr-stage .pr-meter { left: 18px; bottom: 24px; width: 100px; }
        }
      `}</style>
    </div>
  );
}
