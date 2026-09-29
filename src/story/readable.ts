/* =========================================================
   ATURAN "JELAS vs KABUR" (design/12 §A.3)
   - Kana jelas bila hurufnya sudah dipelajari (Save.d.kana).
   - Kanji: jelas bila kanjinya dipelajari (Save.d.kanji); jika belum,
     ditampilkan bacaan kana-nya (mode furigana).
   - Huruf Latin, angka, tanda baca selalu jelas.
   - Kata lunak (~) mengabaikan huruf kecil ゃゅょっ & ー.
   ========================================================= */

export interface Tok {
  raw: string;          // teks asli token
  show: string;         // yang ditampilkan (kanji atau kana)
  ruby?: string;        // furigana (bila kanji ditampilkan)
  clear: boolean;
  missing: string[];    // huruf yang belum dipelajari
  fb?: boolean;         // ada kanji yang ditampilkan sebagai kana (belum dipelajari)
}

const SMALL = new Set([...'ゃゅょっャュョッァィゥェォぁぃぅぇぉ']);
const isKana = (c: string) => /[ぁ-ゖァ-ヺ]/.test(c);
const isKanji = (c: string) => /[一-鿿]/.test(c);

export interface Know { kana: Set<string>; kanji: Set<string>; kataAny: boolean; }

export function knowledge(): Know {
  const d = Save.d;
  const kana = new Set<string>(d.kana || []);
  const kanji = new Set<string>([...(d.kanji || []), ...(d.kana || []).filter((c: string) => /[\u4e00-\u9fff]/.test(c))]);
  return { kana, kanji, kataAny: [...kana].some(c => /[ァ-ヺ]/.test(c)) };
}

function charOk(c: string, k: Know, soft: boolean): boolean {
  if (c === 'ー') return soft || k.kataAny;
  if (SMALL.has(c)) return soft || k.kana.has(c);
  if (isKana(c)) return k.kana.has(c);
  if (isKanji(c)) return k.kanji.has(c);
  return true; // latin, angka, tanda baca, simbol
}

/** Ubah satu baris menjadi token. Kata dipisah spasi. */
export function tokenize(line: string, k: Know): Tok[] {
  const out: Tok[] = [];
  for (const part of line.split(/(\s+)/)) {
    if (!part) continue;
    if (/^\s+$/.test(part)) { out.push({ raw: part, show: ' ', clear: true, missing: [] }); continue; }
    let soft = false, t = part;
    if (t.startsWith('~')) { soft = true; t = t.slice(1); }
    // kanji: [漢字|かな]
    let show = '', ruby = '', missing: string[] = [], anyKanjiShown = false, fb = false;
    const re = /\[([^|\]]+)\|([^\]]+)\]|([^[]+)/g;
    let m: RegExpExecArray | null;
    let rubyParts: string[] = [];
    while ((m = re.exec(t))) {
      if (m[1]) {
        const kj = m[1], kn = m[2];
        const knowAll = [...kj].every(c => k.kanji.has(c));
        if (knowAll) { show += kj; rubyParts.push(kn); anyKanjiShown = true; }
        else { show += kn; fb = true; for (const c of kn) if (!charOk(c, k, soft)) missing.push(c); }
      } else {
        show += m[3];
        for (const c of m[3]) if (!charOk(c, k, soft)) missing.push(c);
      }
    }
    if (anyKanjiShown) ruby = rubyParts.join('');
    out.push({ raw: part, show, ruby: ruby || undefined, clear: missing.length === 0, missing: [...new Set(missing)], fb });
  }
  return out;
}

/** Persentase kata yang jelas (0..1) untuk sekumpulan baris. */
export function clarity(lines: string[], k = knowledge()): number {
  let all = 0, ok = 0;
  for (const l of lines) for (const t of tokenize(l, k)) { if (t.show === ' ') continue; all++; if (t.clear) ok++; }
  return all ? ok / all : 1;
}

/** Keterangan kapan huruf dipelajari (untuk tooltip kata kabur). */
export function whenLearned(c: string): string {
  if (c === 'ー') return 'Garis panjang ー: dipelajari bersama katakana (Bab 2).';
  if (SMALL.has(c)) return `Huruf kecil ${c}: dipelajari di Bab 4 (Musim Panas).`;
  if (/[がぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポヴ]/.test(c)) return `${c} memakai tanda ゛/゜ (dakuten): dipelajari di Bab 3.`;
  if (/[ァ-ヺ]/.test(c)) return `Katakana ${c}: dipelajari di Bab 2.`;
  if (isKana(c)) return `Hiragana ${c}: dipelajari di Bab 1.`;
  if (isKanji(c)) return `Kanji ${c}: dipelajari di Bab 3–6.`;
  return '';
}
