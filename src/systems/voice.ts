/* =========================================================
   SUARA MANUSIA (design/01 §14)
   Urutan: rekaman manusia → rekaman AI (pra-render) → TTS perangkat.
   - Klip bernama (mis. sen_h_a_02) dicari di audio/manifest.json → "clips".
   - File: audio/<dir>/<id>.mp3 (dir default "sensei").
   - Tanpa rekaman: teks dibacakan TTS bahasa Indonesia (Sound.speakLang).
   ========================================================= */
import VO from '../data/voice/sensei-vo.json';

interface ClipInfo { dir?: string; src?: 'human' | 'ai'; file?: string; dur?: number }
type KanaVO = { intro: string; read: string; strokes: string; tip: string; pair?: string; similar?: string; sim?: string; word?: string; w?: string; wx?: { jp: string; ro: string; id: string }; air: string };

let clips: Record<string, ClipInfo> = {};
let seq = 0;

function init() {
  try {
    fetch('audio/manifest.json', { cache: 'no-cache' })
      .then(r => (r.ok ? r.json() : null))
      .then(j => { if (j && j.clips && typeof j.clips === 'object') clips = j.clips; })
      .catch(() => {});
  } catch { /* offline / file:// */ }
}

const has = (id?: string) => !!(id && clips[id]);
const text = (id: string): string => (VO.clips as Record<string, string>)[id] || '';
const kana = (k: string): KanaVO | null => ((VO.kana as Record<string, KanaVO>)[k]) || null;
const day = (n: number): { intro: string; outro: string } | null => ((VO.days as Record<string, { intro: string; outro: string }>)[String(n)]) || null;

function stop() { seq++; Sound.stopMedia(); }

// Memakai satu elemen <audio> bersama milik Sound (iOS menolak Audio() baru di luar ketukan pengguna)
function playFile(id: string): Promise<void> {
  const info = clips[id] || {};
  const rate = Math.max(0.75, Math.min(1.1, (Save.d.settings.rate || 0.85) / 0.85));
  return Sound.playMedia(`audio/${info.dir || 'sensei'}/${info.file || id + '.mp3'}`, rate, 20000);
}

/** Teks untuk TTS Indonesia: buang huruf Jepang (diucapkan terpisah oleh suara Jepang) & eja romaji agar terbaca benar. */
function ttsText(t: string): string {
  return t.replace(/[\u3040-\u30ff\u4e00-\u9fff、。！？「」]+/g, ' ')
    .replace(/"([a-z]+)"/g, (_, r: string) => '"' + r.replace(/sh/g, 'sy').replace(/ch/g, 'c') + '"')
    .replace(/\s+([.,!?])/g, '$1').replace(/\.\s*\./g, '.').replace(/\s+/g, ' ').replace(/[:,]\s*$/, '.').trim();
}

/**
 * Bacakan narasi. Mengembalikan 'file' bila rekaman diputar (kata Jepang sudah
 * diucapkan di dalam rekaman), 'tts' bila memakai suara perangkat, 'none' bila tak bersuara.
 */
async function narrate(id: string | undefined, fallback: string): Promise<'file' | 'tts' | 'none'> {
  const my = ++seq;
  if (id && has(id)) { Sound.stop(); await playFile(id); return my === seq ? 'file' : 'none'; }
  const ok = await Sound.speakLang(ttsText(fallback), 'id-ID');
  return ok ? 'tts' : 'none';
}

export const Voice = { init, ttsText, has, text, kana, day, narrate, stop, get count() { return Object.keys(clips).length; } };
