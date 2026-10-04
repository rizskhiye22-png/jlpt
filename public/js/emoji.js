/* =========================================================
   EMOJI SVG (Twemoji)
   Emoji tampil berbeda-beda di tiap HP (bahkan kosong di HP lama).
   Semua emoji yang dipakai game diganti gambar SVG Twemoji yang sama
   di semua perangkat. Sumber: https://github.com/jdecked/twemoji
   (grafis CC-BY 4.0). Daftar file: emoji-list.js (scripts/emoji-aset.mjs).
   - Emo.parse(el)  : ganti emoji di teks HTML dengan <img class="emo">
   - Emo.draw(ctx…) : gambar emoji di kanvas (cadangan: teks biasa)
   Teks baru di layar otomatis diproses lewat MutationObserver.
   ========================================================= */
const Emo = (() => {
  const HAVE = new Set(typeof EMOJI_HAVE !== 'undefined' ? EMOJI_HAVE : []);
  const RE = /(?:\p{Extended_Pictographic}|[\u{1F1E6}-\u{1F1FF}]{2})(?:️|⃣|[\u{1F3FB}-\u{1F3FF}]|‍\p{Extended_Pictographic}️?)*/gu;
  const hex = e => [...e].map(c => c.codePointAt(0).toString(16));
  function file(e) {
    const h = hex(e), a = (h.includes('200d') ? h : h.filter(c => c !== 'fe0f')).join('-'), b = h.filter(c => c !== 'fe0f').join('-');
    return HAVE.has(a) ? a : HAVE.has(b) ? b : null;
  }
  const src = n => `assets/emoji/${n}.svg`;
  const STYLE = 'height:1.15em;width:1.15em;margin:0 .05em;vertical-align:-0.2em;display:inline-block';
  const img = e => { const n = file(e); return n ? `<img class="emo" src="${src(n)}" alt="${e}" draggable="false" style="${STYLE}">` : e; };

  /* ---------- HTML ---------- */
  const SKIP = /^(SCRIPT|STYLE|TEXTAREA|INPUT|SELECT|OPTION|CANVAS|IMG|svg)$/;
  function parse(root) {
    if (!root || !HAVE.size) return;
    if (root.nodeType === 3) { swap(root); return; }
    if (root.nodeType !== 1 || SKIP.test(root.nodeName) || root.closest?.('.no-emo')) return;
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: n => (n.parentNode && !SKIP.test(n.parentNode.nodeName) && !n.parentNode.closest('.no-emo') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT) });
    const list = []; let n; while ((n = w.nextNode())) list.push(n);
    list.forEach(swap);
  }
  function swap(t) {
    const s = t.nodeValue; if (!s || !RE.test(s)) return; RE.lastIndex = 0;
    const frag = document.createDocumentFragment(); let last = 0, hit = false;
    for (const m of s.matchAll(RE)) {
      const n = file(m[0]); if (!n) continue;
      hit = true;
      if (m.index > last) frag.appendChild(document.createTextNode(s.slice(last, m.index)));
      const im = document.createElement('img'); im.className = 'emo'; im.src = src(n); im.alt = m[0]; im.draggable = false; im.setAttribute('style', STYLE);
      frag.appendChild(im); last = m.index + m[0].length;
    }
    if (!hit) return;
    if (last < s.length) frag.appendChild(document.createTextNode(s.slice(last)));
    t.parentNode && t.parentNode.replaceChild(frag, t);
  }

  /* ---------- kanvas ---------- */
  const cache = new Map();
  function image(e) {
    const n = file(e); if (!n) return null;
    if (!cache.has(n)) { const im = new Image(); im.src = src(n); cache.set(n, im); }
    const im = cache.get(n);
    return im.complete && im.naturalWidth ? im : null;
  }
  // Gambar satu emoji berpusat di (x, y) dengan ukuran size (px)
  function draw(ctx, e, x, y, size) {
    const im = image(e);
    if (im) { const sm = ctx.imageSmoothingEnabled; ctx.imageSmoothingEnabled = true; ctx.drawImage(im, x - size / 2, y - size / 2, size, size); ctx.imageSmoothingEnabled = sm; return; }
    ctx.save(); ctx.font = `${Math.round(size * .9)}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(e, x, y); ctx.restore();
  }
  // Muat dulu sekumpulan emoji (misal sebelum ruangan kerja digambar)
  const preload = list => list.forEach(e => image(e));

  /* ---------- otomatis untuk teks baru ---------- */
  let queued = new Set(), timer = 0;
  const flush = () => { timer = 0; const q = queued; queued = new Set(); q.forEach(n => n.isConnected && parse(n)); };
  function start() {
    if (!HAVE.size || typeof MutationObserver === 'undefined') return;
    parse(document.body);
    new MutationObserver(ms => {
      for (const m of ms) {
        if (m.type === 'characterData') queued.add(m.target);
        else m.addedNodes.forEach(n => { if (n.nodeType === 3 || (n.nodeType === 1 && n.nodeName !== 'IMG')) queued.add(n); });
      }
      if (queued.size && !timer) timer = requestAnimationFrame(flush);
    }).observe(document.body, { childList: true, subtree: true, characterData: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();

  return { parse, draw, img, preload, file, has: e => !!file(e) };
})();
