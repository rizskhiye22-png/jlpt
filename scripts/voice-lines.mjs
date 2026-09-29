/* =========================================================
   SUARA ASLI: alat bantu rekaman
   npm run voice:export    → voice/voice-lines.csv  (daftar semua kalimat Jepang + nama file)
   npm run voice:manifest  → public/audio/manifest.json (daftar rekaman yang sudah ada)
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
  const files = readdirSync('public/js').filter(f => f.endsWith('.js'));
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
    const src = readFileSync('public/js/' + f, 'utf8');
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
}

if (mode === 'manifest') {
  const dir = 'public/audio/ja';
  const list = existsSync(dir) ? readdirSync(dir).filter(f => f.endsWith('.mp3')).map(f => f.replace(/\.mp3$/, '')) : [];
  writeFileSync('public/audio/manifest.json', JSON.stringify({ files: list.sort() }, null, 0) + '\n');
  console.log(`${list.length} rekaman terdaftar di public/audio/manifest.json`);
}
