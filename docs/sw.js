/* Mode offline: file game disimpan di HP setelah dibuka sekali. */
const CACHE = 'nihongo-gakkou-v16';
const ASSETS = [
  './', 'index.html', 'css/style.css', 'manifest.webmanifest', 'icon.svg',
  'js/data.js', 'js/data2.js', 'js/data3.js', 'js/strokes.js', 'js/strokes3.js', 'js/data4.js', 'js/portrait.js', 'js/pixel.js', 'js/maps.js',
  'js/save.js', 'js/audio.js', 'js/music.js', 'js/ui.js', 'js/lesson.js', 'js/games.js', 'js/video.js', 'js/extras.js', 'js/relax.js', 'js/online.js', 'js/places.js', 'js/places2.js', 'js/konbini.js',
  'js/world.js', 'js/game.js', 'js/main.js',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// File game: ambil versi terbaru dari internet dulu (offline → pakai simpanan).
// Hasil build (assets/, nama berisi hash) & font: pakai simpanan dulu (hemat kuota).
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const font = /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if (url.origin !== location.origin && !font) return;
  const heavy = font || url.pathname.includes('/assets/');
  e.respondWith(caches.open(CACHE).then(async cache => {
    const cached = await cache.match(req);
    const net = fetch(req).then(res => {
      if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
      return res;
    });
    if (heavy && cached) return cached;
    try { return await net; } catch (err) { return cached || Response.error(); }
  }));
});
