// Salin SVG Twemoji (https://github.com/jdecked/twemoji, grafis CC-BY 4.0) hanya untuk emoji yang dipakai game.
// Pakai: npm i --no-save @twemoji/svg && node scripts/emoji-aset.mjs [folder @twemoji/svg]
import fs from 'node:fs';
const SRC = (process.argv[2] || 'node_modules/@twemoji/svg').replace(/\/?$/, '/');
const OUT = 'public/assets/emoji/';
// simbol yang sengaja tetap teks (tombol kontrol, panah, tanda centang)
const KEEP_TEXT = new Set([...'▶◀⏸⏮⏭↺✕✓✔↔↗→⬆⬇™©®➕➖★☆♪↩↪⤴⤵']);
const RE = /(?:\p{Extended_Pictographic}|[\u{1F1E6}-\u{1F1FF}]{2})(?:️|⃣|[\u{1F3FB}-\u{1F3FF}]|‍\p{Extended_Pictographic}️?)*/gu;
const files = [...fs.readdirSync('public/js').map(f => 'public/js/' + f), 'index.html', ...fs.readdirSync('src', { recursive: true }).filter(f => /\.(ts|tsx)$/.test(f)).map(f => 'src/' + f)];
const hex = e => [...e].map(c => c.codePointAt(0).toString(16));
const nameOf = e => { const h = hex(e); return (h.includes('200d') ? h : h.filter(c => c !== 'fe0f')).join('-'); };
const have = new Set(), skip = [];
fs.mkdirSync(OUT, { recursive: true });
for (const f of files) {
  if (f.endsWith('emoji-list.js')) continue;
  for (const [e] of fs.readFileSync(f, 'utf8').matchAll(RE)) {
    if (KEEP_TEXT.has(e.replace(/️/g, ''))) continue;
    for (const n of [nameOf(e), hex(e).filter(c => c !== 'fe0f').join('-')]) {
      if (fs.existsSync(SRC + n + '.svg')) { fs.copyFileSync(SRC + n + '.svg', OUT + n + '.svg'); have.add(n); break; }
    }
    if (![nameOf(e), hex(e).filter(c => c !== 'fe0f').join('-')].some(n => have.has(n))) skip.push(e);
  }
}
fs.writeFileSync('public/js/emoji-list.js', `/* Dibuat otomatis oleh scripts/emoji-aset.mjs: emoji yang punya SVG Twemoji di assets/emoji/ */\nconst EMOJI_HAVE = ${JSON.stringify([...have].sort())};\n`);
console.log(`${have.size} SVG disalin ke ${OUT}${skip.length ? ` · tanpa SVG: ${[...new Set(skip)].join(' ')}` : ''}`);
