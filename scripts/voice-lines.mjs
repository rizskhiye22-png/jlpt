/* =========================================================
   SUARA ASLI: alat bantu rekaman
   npm run voice:export    → voice/voice-lines.csv  (daftar semua kalimat Jepang + nama file)
   npm run voice:manifest  → public/audio/manifest.json (daftar rekaman yang sudah ada)
   v3: juga voice/sensei-lines.csv (naskah tetap sensei dari src/data/voice/sensei-vo.json)
       dan rekaman sensei di public/audio/sensei/<id>.mp3 (+ opsional <id>.ai.mp3 untuk suara AI)
   Nama file = hash FNV-1a kalimat (sama dengan Sound.voiceKey di public/js/audio.js).
   ========================================================= */
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'node:fs';

const clean = t => String(t).replace(/[〜~]/g, '').replace(/\s+/g, ' ').trim();
function voiceKey(t) {
  let h = 0x811c9dc5;
  for (const ch of t) { h ^= ch.codePointAt(0); h = Math.imul(h, 0x01000193) >>> 0; }
  return h.toString(16).padStart(8, '0');
}
const mode = process.argv[2] || 'export';

if (mode === 'export') {
  const files = [...readdirSync('public/js').filter(f => f.endsWith('.js')).map(f => 'public/js/' + f),
    ...readdirSync('src/story').filter(f => f.endsWith('.ts')).map(f => 'src/story/' + f)];
  const lines = new Map();
  const add = (jp, ro = '', id = '', from = '') => {
    const t = clean(jp);
    if (!t || t.includes('{name}') || t.includes('${') || !/[぀-ヿ]/.test(t)) return;
    const k = voiceKey(t);
    const cur = lines.get(k) || { file: k + '.mp3', jp: t, ro, id, from, n: 0 };
    cur.n++; if (!cur.ro && ro) cur.ro = ro; if (!cur.id && id) cur.id = id;
    lines.set(k, cur);
  };
  for (const f of files) {
    const src = readFileSync(f, 'utf8');
    // { jp: '...', ro: '...', id: '...' }
    for (const m of src.matchAll(/jp:\s*'((?:[^'\\]|\\.)*)'(?:,\s*ro:\s*'((?:[^'\\]|\\.)*)')?(?:,\s*(?:id|name):\s*'((?:[^'\\]|\\.)*)')?/g)) add(m[1], m[2], m[3], f);
    // huruf kana satuan: 'あ': { ro: 'a' ...
    for (const m of src.matchAll(/^\s*'([぀-ヿ])':\s*\{\s*ro:\s*'([^']*)'/gm)) add(m[1], m[2], '', f);
  }
  const rows = [...lines.values()].sort((a, b) => b.n - a.n || a.jp.localeCompare(b.jp, 'ja'));
  const esc = v => '"' + String(v || '').replace(/"/g, '""') + '"';
  mkdirSync('voice', { recursive: true });
  writeFileSync('voice/voice-lines.csv', '﻿' + ['file,jp,romaji,arti,muncul,sumber', ...rows.map(r => [r.file, r.jp, r.ro, r.id, r.n, r.from].map(esc).join(','))].join('\n'));
  console.log(`${rows.length} kalimat ditulis ke voice/voice-lines.csv`);
  // Naskah sensei (satu klip = satu baris, ID tetap)
  const vo = JSON.parse(readFileSync('src/data/voice/sensei-vo.json', 'utf8'));
  const srows = Object.entries(vo.clips).map(([id, text]) => [id + '.mp3', 'Tanaka-sensei (perempuan)', vo.emotion[id] || '', text]);
  writeFileSync('voice/sensei-lines.csv', '\ufeff' + ['file,pembicara,emosi,teks', ...srows.map(r => r.map(esc).join(','))].join('\n'));
  console.log(`${srows.length} klip sensei ditulis ke voice/sensei-lines.csv`);
}

if (mode === 'manifest') {
  const dir = 'public/audio/ja';
  const list = existsSync(dir) ? readdirSync(dir).filter(f => f.endsWith('.mp3')).map(f => f.replace(/\.mp3$/, '')) : [];
  // Klip bernama (sensei, cerita). Rekaman manusia (<id>.mp3) diutamakan daripada AI (<id>.ai.mp3).
  const clips = {};
  for (const dir of ['sensei', 'story']) {
    const p = 'public/audio/' + dir;
    if (!existsSync(p)) continue;
    for (const f of readdirSync(p)) {
      const m = f.match(/^(.+?)(\.ai)?\.mp3$/); if (!m) continue;
      const id = m[1], ai = !!m[2];
      if (clips[id] && clips[id].src === 'human') continue;
      clips[id] = ai ? { dir, src: 'ai', file: f } : { dir, src: 'human' };
    }
  }
  writeFileSync('public/audio/manifest.json', JSON.stringify({ files: list.sort(), clips }, null, 0) + '\n');
  const n = Object.keys(clips).length, h = Object.values(clips).filter(c => c.src === 'human').length;
  console.log(`${list.length} rekaman kalimat + ${n} klip (${h} manusia, ${n - h} AI) terdaftar di public/audio/manifest.json`);
}
