/* =========================================================
   NASKAH SUARA SENSEI (naskah tetap untuk video pelajaran)
   npm run voice:sensei → src/data/voice/sensei-vo.json
   Dibuat dari data pelajaran di public/js (KANA, STROKES, WORDS, DAYS, SIMILAR di video.js).
   ID klip TETAP selama hurufnya sama, jadi rekaman lama tidak perlu diulang.
   ========================================================= */
import { readFileSync, writeFileSync } from 'node:fs';
import vm from 'node:vm';

const ctx = { window: {}, console };
vm.createContext(ctx);
for (const f of ['data.js', 'data2.js', 'data3.js', 'strokes.js', 'strokes3.js', 'data4.js'])
  vm.runInContext(readFileSync('public/js/' + f, 'utf8'), ctx, { filename: f });
const G = k => vm.runInContext(k, ctx);
const KANA = G('KANA'), STROKES = G('STROKES'), WORDS = G('WORDS'), DAYS = G('DAYS');
const SIM = Object.fromEntries([...readFileSync('public/js/video.js', 'utf8').match(/const SIMILAR = \{([\s\S]*?)\};/)[1].matchAll(/'(.)': '(.)'/g)].map(m => [m[1], m[2]]));
const isKanji = c => c >= '一' && c <= '鿿';
const isKata = c => c >= '゠' && c <= 'ヿ' && c !== 'ー';

const PRON = { shi: 'Bacanya "shi", seperti "syi" yang lembut, bukan "si".', chi: 'Bacanya "chi", mirip "ci" dalam kata cinta.', tsu: 'Bacanya "tsu". Ujung lidah menempel sebentar, lalu "su". Pelan-pelan: ts, tsu.', fu: 'Bacanya "fu", tapi bibir tidak menyentuh gigi. Seperti meniup lilin pelan: fu.', n: 'Bacanya "n" saja, tanpa huruf hidup. Satu ketukan penuh, lho.', wo: 'Walaupun ditulis "wo", bacanya "o". Huruf ini hampir hanya dipakai sebagai partikel.', ha: 'Bacanya "ha". Tapi kalau jadi partikel, dibaca "wa". Nanti kita pelajari.', he: 'Bacanya "he". Kalau jadi partikel arah, dibaca "e".', ra: 'Bunyi R Jepang ada di antara R dan L. Lidah cukup mengetuk sekali: ra.', ri: 'Lidah mengetuk sekali, antara R dan L: ri.', ru: 'Lidah mengetuk sekali: ru.', re: 'Lidah mengetuk sekali: re.', ro: 'Lidah mengetuk sekali: ro.', u: 'Bacanya "u", bibir tidak terlalu dimonyongkan.', su: 'Bacanya "su". Huruf u di akhir sering terdengar samar, seperti "s" saja.', ji: 'Bacanya "ji", seperti "ji" dalam kata jika.', zu: 'Bacanya "zu", huruf z yang mendengung.' };
const OPEN = ['Huruf pertama kita hari ini:', 'Berikutnya, huruf ini:', 'Oke, lanjut ke huruf ini:', 'Sekarang, perhatikan huruf ini:', 'Nah, yang ini juga penting:', 'Terakhir untuk hari ini:'];
const OPEN_K = ['Kanji pertama hari ini:', 'Kanji berikutnya:', 'Lanjut, kanji ini:', 'Perhatikan kanji ini:', 'Yang ini juga penting:', 'Kanji terakhir hari ini:'];
const INTROS = ['Halo lagi! Hari ini kita belajar huruf: {}. Siap?', 'Selamat datang kembali! Hari ini giliran huruf: {}. Yuk!', 'Pagi yang cerah untuk belajar! Hari ini: {}. Kita mulai, ya.'];
const SPECIAL_INTRO = {
  1: 'Selamat datang di kelas video pertamamu! Hari ini kita belajar lima huruf pertama hiragana. Santai saja, ya.',
  12: 'Selamat datang di dunia katakana! Bunyinya sama dengan hiragana, hanya bentuknya lebih tegas dan bersudut.',
  23: 'Selamat datang di Bab 3! Hari ini ada tanda kecil yang ajaib: tenten. Dua titik kecil yang mengubah bunyi.',
  27: 'Hari yang istimewa! Hari ini kamu belajar kanji untuk pertama kalinya. Kita mulai dari angka, ya.',
};
const SHARED = [['sen_air_1', 'Sekarang tulis di udara dengan jarimu, ikuti kapur sensei. Pelan-pelan saja.', 'lembut'], ['sen_air_2', 'Yuk, tulis di udara bareng sensei. Satu, dua…', 'lembut'], ['sen_air_3', 'Coba gerakkan jarimu mengikuti kapurnya. Tidak apa-apa kalau belum rapi.', 'lembut'], ['sen_ok_1', 'すごい！ Tepat sekali!', 'bangga'], ['sen_ok_2', 'せいかい！ Benar!', 'ceria'], ['sen_ok_3', 'いい ね！ Kamu makin jago.', 'bangga'], ['sen_ok_4', 'よく できました！ Bagus sekali.', 'bangga'], ['sen_ok_5', 'Wah, cepat sekali. Sensei kalah, nih.', 'lucu'], ['sen_ng_1', 'おしい！ Hampir benar. Coba lihat lagi, ya.', 'lembut'], ['sen_ng_2', 'Tidak apa-apa. Salah itu bagian dari belajar.', 'lembut'], ['sen_ng_3', 'Hmm, yang ini sering tertukar. Perhatikan bentuknya baik-baik.', 'serius-lembut'], ['sen_ng_4', 'ドンマイ！ Jangan khawatir, kita coba sekali lagi.', 'ceria'], ['sen_star3', 'Tiga bintang! Sempurna! Sensei bangga sekali.', 'bangga'], ['sen_star1', 'Satu bintang juga kemajuan. Besok pasti lebih baik.', 'lembut'], ['sen_review', 'Ada beberapa huruf yang perlu diulas hari ini. Sebentar saja, yuk.', 'ceria'], ['sen_test_start', 'Ulangan dimulai. Tarik napas dulu… Kamu pasti bisa.', 'tenang'], ['sen_test_end', 'Ulangan selesai. Apa pun hasilnya, kamu sudah berusaha. おつかれさま！', 'bangga'], ['sen_hanko', 'Ini stempel dari sensei. はなまる！', 'ceria'], ['sen_welcome_back', 'Selamat datang kembali! Sensei sudah menunggumu.', 'ceria'], ['sen_goodbye', 'Sampai jumpa besok, ya. また あした！', 'lembut']];

const clips = {}, emotion = {}, kana = {}, days = {}, rows = [];
const add = (id, text, e) => { clips[id] = text; emotion[id] = e; rows.push([id, text, e]); };
const idOf = k => isKanji(k) ? 'sen_kj_' + k.codePointAt(0).toString(16) : `sen_${isKata(k) ? 'k' : 'h'}_${KANA[k].ro}`;
const learned = new Set(), used = new Set();
let li = 0;
DAYS.forEach((d, i) => {
  const dn = i + 1;
  if (d.type !== 'lesson') return;
  const ks = d.kana;
  rows.push(['#', `Hari ${dn} — ${ks.join(' ')}`]);
  add(`sen_d${String(dn).padStart(2, '0')}_intro`, SPECIAL_INTRO[dn] || INTROS[li % 3].replace('{}', ks.join('、')), 'ceria');
  li++;
  ks.forEach((k, idx) => {
    learned.add(k); (d.also || []).forEach(a => learned.add(a));
    const { ro, tip } = KANA[k], n = (STROKES[k] || []).length, b = idOf(k), kj = isKanji(k), e = {};
    const op = (kj ? OPEN_K : OPEN)[idx === 0 ? 0 : idx === ks.length - 1 ? 5 : 1 + (idx % 4)];
    add(b + '_01', `${op} ${k}.`, 'semangat'); e.intro = b + '_01';
    const p = kj ? `Kanji ini dibaca "${ro}". ${k}.` : (PRON[ro] || (ro.endsWith('e') ? `Bacanya "${ro}". Huruf e-nya seperti pada kata "enak", bukan "emas".` : `Bacanya "${ro}", sama seperti bunyi "${ro}" dalam bahasa Indonesia.`)) + ` ${k}.`;
    add(b + '_02', p, 'tenang'); e.read = b + '_02';
    add(b + '_03', n === 1 ? 'Cara menulisnya cuma satu goresan. Perhatikan arahnya, ya.' : `Ada ${n} goresan. Perhatikan urutannya baik-baik.`, 'tenang'); e.strokes = b + '_03';
    add(b + '_04', tip, 'lucu'); e.tip = b + '_04';
    if (isKata(k)) { const tw = String.fromCharCode(k.charCodeAt(0) - 0x60); if (KANA[tw]) { add(b + '_05', `Pasangan hiragananya adalah ${tw}. Bunyinya sama persis: ${k}, ${tw}.`, 'tenang'); e.pair = b + '_05'; } }
    const sim = SIM[k];
    if (sim && KANA[sim]) { add(b + '_06', `Hati-hati, jangan tertukar dengan ${sim}. Yang kiri ${k}, dibaca "${ro}". Yang kanan ${sim}, dibaca "${KANA[sim].ro}".`, 'serius-lembut'); e.similar = b + '_06'; e.sim = sim; }
    if (k === 'を') { add(b + '_07', 'Contohnya: パン を たべます. Artinya "makan roti". を menunjukkan benda yang dimakan.', 'ceria'); e.word = b + '_07'; e.w = 'を'; }
    else if (k !== 'ヲ') {
      const cand = WORDS.filter(w => w.jp.includes(k) && !used.has(w.jp));
      const w = cand.find(w => [...w.jp].every(c => learned.has(c) || ' ー'.includes(c))) || cand[0];
      if (w) { used.add(w.jp); add(b + '_07', `Contoh katanya: ${w.jp}. Artinya "${w.id}". ${w.jp}.`, 'ceria'); e.word = b + '_07'; e.w = w.jp; }
    }
    e.air = `sen_air_${(idx % 3) + 1}`;
    kana[k] = e;
  });
  add(`sen_d${String(dn).padStart(2, '0')}_outro`, dn % 2 ? 'Hebat! Sekarang giliranmu menulis. Salah itu biasa, yang penting mencoba.' : 'Bagus sekali! Ayo praktik menulis. Sensei tunggu hasilmu, ya.', 'bangga');
  days[dn] = { intro: `sen_d${String(dn).padStart(2, '0')}_intro`, outro: `sen_d${String(dn).padStart(2, '0')}_outro` };
});
SHARED.forEach(([id, t, e]) => { clips[id] = t; emotion[id] = e; });
writeFileSync('src/data/voice/sensei-vo.json', JSON.stringify({ version: 2, speaker: 'sensei', clips, emotion, kana, days }, null, 0));
// tabel markdown untuk dokumen desain
const md = rows.map(r => r[0] === '#' ? `\n#### ${r[1]}\n\n| ID | Teks narasi sensei | Emosi |\n|---|---|---|` : `| \`${r[0]}\` | ${r[1]} | ${r[2]} |`).join('\n');
writeFileSync('voice/sensei-script.md', '# Naskah suara sensei (otomatis dari data game)\n' + md + '\n\n#### Klip bersama\n\n| ID | Teks | Emosi |\n|---|---|---|\n' + SHARED.map(([i, t, e]) => `| \`${i}\` | ${t} | ${e} |`).join('\n') + '\n');
console.log(`${Object.keys(clips).length} klip sensei → src/data/voice/sensei-vo.json & voice/sensei-script.md`);
