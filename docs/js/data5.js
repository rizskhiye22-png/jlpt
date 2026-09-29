/* =========================================================
   DATA BAGIAN 5 — BAB 4 「なつやすみ」 Musim Panas & Rahasia Gunung
   Hari 35–46 · libur musim panas (Kelas Musim Panas tiap pagi)
   - Yōon: きゃ しゅ ちょ … (huruf besar + ゃゅょ kecil = satu ketukan)
   - っ kecil (jeda) & bunyi panjang (ー, おう, えい …)
   - Kanji posisi: 上 下 中 右 左
   Cerita Bab 4 (onsen やま, kilas balik, Tanabata, Natsu Matsuri) ada di src/story/scenes4.ts
   Lihat design/04-BAB4-MUSIM-PANAS.md
   ========================================================= */

/* ---------- Yōon ---------- */
const YOUON = {
  'き': 'ky', 'し': 'sh', 'ち': 'ch', 'に': 'ny', 'ひ': 'hy', 'み': 'my', 'り': 'ry',
  'ぎ': 'gy', 'じ': 'j', 'び': 'by', 'ぴ': 'py',
};
const SMALL_Y = { 'ゃ': 'a', 'ゅ': 'u', 'ょ': 'o' };
const YOUON_RO = {};

/* Susun goresan dua huruf menjadi satu kotak 109×109: huruf besar di kiri, huruf kecil di kanan bawah. */
function transformPath(d, s, tx, ty) {
  const tok = d.match(/[A-Za-z]|-?\d*\.?\d+(?:e-?\d+)?/g) || [];
  let out = '', cmd = '', idx = 0;
  for (const t of tok) {
    if (/[A-Za-z]/.test(t)) { cmd = t; idx = 0; out += t; continue; }
    const v = parseFloat(t), abs = cmd === cmd.toUpperCase();
    let r;
    if (cmd === 'H' || cmd === 'h') r = abs ? v * s + tx : v * s;
    else if (cmd === 'V' || cmd === 'v') r = abs ? v * s + ty : v * s;
    else r = abs ? v * s + (idx % 2 === 0 ? tx : ty) : v * s;
    out += (idx ? ',' : '') + (+r.toFixed(2));
    idx++;
  }
  return out;
}
function comboStrokes(big, small) {
  const a = STROKES[big], b = STROKES[small];
  if (!a || !b) return null;
  return [...a.map(d => transformPath(d, 0.62, -2, 20)), ...b.map(d => transformPath(d, 0.62, 44, 26))];
}

(function addYouon() {
  Object.entries(YOUON).forEach(([big, c]) => {
    Object.entries(SMALL_Y).forEach(([sm, v]) => {
      const h = big + sm, ro = c + v;
      YOUON_RO[h] = ro;
      const baseRo = KANA[big].ro;
      KANA[h] = { ro, tip: `${big} + ${sm} kecil = ${h}. Dua huruf, satu ketukan: "${ro}" — bukan "${baseRo}-y${v}".` };
      const kb = String.fromCharCode(big.charCodeAt(0) + 0x60), ks = String.fromCharCode(sm.charCodeAt(0) + 0x60), k = kb + ks;
      KANA[k] = { ro, tip: `${kb} + ${ks} kecil = ${k}. Aturannya sama dengan hiragana ${h}.` };
      const sh = comboStrokes(big, sm); if (sh) STROKES[h] = sh;
      const sk = comboStrokes(kb, ks); if (sk) STROKES[k] = sk;
    });
  });
})();
// Huruf pembantu: dipelajari, tapi tidak ditanyakan sendirian di kuis
Object.assign(KANA, {
  'ゃ': { ro: 'ya kecil', tip: 'や versi kecil. Menempel pada huruf -i (き, し, ち…) menjadi satu bunyi: きゃ = kya.', noQuiz: true },
  'ゅ': { ro: 'yu kecil', tip: 'ゆ versi kecil: しゅ = shu.', noQuiz: true },
  'ょ': { ro: 'yo kecil', tip: 'よ versi kecil: ちょ = cho.', noQuiz: true },
  'ャ': { ro: 'ya kecil', tip: 'ヤ versi kecil: キャ = kya.', noQuiz: true },
  'ュ': { ro: 'yu kecil', tip: 'ユ versi kecil: シュ = shu.', noQuiz: true },
  'ョ': { ro: 'yo kecil', tip: 'ヨ versi kecil: チョ = cho.', noQuiz: true },
  'っ': { ro: '(jeda)', tip: 'つ kecil. Tidak dibaca "tsu": artinya berhenti sejenak satu ketukan sebelum bunyi berikutnya. がっこう = gak-kou.', noQuiz: true },
  'ッ': { ro: '(jeda)', tip: 'ツ kecil untuk katakana: カップ = kap-pu (cangkir).', noQuiz: true },
  'ー': { ro: '(panjang)', tip: 'Garis panjang: bunyi sebelumnya dipanjangkan satu ketukan. コーヒー = ko-o-hi-i.', noQuiz: true },
  '上': { ro: 'ue',     tip: 'Garis pendek di atas garis dasar, seperti panah ke ATAS. Bacaan lain: じょう (上手 = pandai).' },
  '下': { ro: 'shita',  tip: 'Kebalikan 上: tiang turun ke BAWAH garis. Bacaan lain: か / げ.' },
  '中': { ro: 'naka',   tip: 'Kotak dengan garis menembus tepat di TENGAH. Bacaan lain: ちゅう.' },
  '右': { ro: 'migi',   tip: 'Tangan + 口 (mulut): tangan KANAN untuk makan. Goresan pertama miring ノ.' },
  '左': { ro: 'hidari', tip: 'Tangan + 工 (alat): tangan KIRI memegang alat. Goresan pertama mendatar 一.' },
});
const YOUON_GRID = [
  ['きゃ','きゅ','きょ'], ['しゃ','しゅ','しょ'], ['ちゃ','ちゅ','ちょ'], ['にゃ','にゅ','にょ'], ['ひゃ','ひゅ','ひょ'], ['みゃ','みゅ','みょ'],
  ['りゃ','りゅ','りょ'], ['ぎゃ','ぎゅ','ぎょ'], ['じゃ','じゅ','じょ'], ['びゃ','びゅ','びょ'], ['ぴゃ','ぴゅ','ぴょ'],
];
KANJI_GRID.push(['上','下','中','右','左']);

const IS_YOUON = k => !!(YOUON_RO[k] || YOUON_RO[[...k].map(c => String.fromCharCode(c.charCodeAt(0) - 0x60)).join('')]);
Object.assign(POOL_FILTER, {
  youon: k => IS_YOUON(k),
  pos: k => '上下中右左'.includes(k),
  ch4: k => IS_YOUON(k) || '上下中右左'.includes(k),
});
const NO_QUIZ = k => !!(KANA[k] && KANA[k].noQuiz);

/* ---------- Kosakata ---------- */
(function addWords() {
  const have = new Set(WORDS.map(w => w.jp));
  [
    { jp: 'きょう', ro: 'kyou', id: 'hari ini' }, { jp: 'しゃしん', ro: 'shashin', id: 'foto' },
    { jp: 'おちゃ', ro: 'ocha', id: 'teh hijau' }, { jp: 'ちゃわん', ro: 'chawan', id: 'mangkuk nasi' },
    { jp: 'りょこう', ro: 'ryokou', id: 'perjalanan wisata' }, { jp: 'ぎゅうにゅう', ro: 'gyuunyuu', id: 'susu' },
    { jp: 'びょういん', ro: 'byouin', id: 'rumah sakit' }, { jp: 'じゃんけん', ro: 'janken', id: 'suit (gunting-batu-kertas)' },
    { jp: 'にゃあ', ro: 'nyaa', id: 'meong' }, { jp: 'おきゃくさん', ro: 'okyakusan', id: 'tamu / pelanggan' },
    { jp: 'がっこう', ro: 'gakkou', id: 'sekolah' }, { jp: 'きって', ro: 'kitte', id: 'perangko' },
    { jp: 'ざっし', ro: 'zasshi', id: 'majalah' }, { jp: 'カップ', ro: 'kappu', id: 'cangkir' },
    { jp: 'ベッド', ro: 'beddo', id: 'ranjang' }, { jp: 'おかあさん', ro: 'okaasan', id: 'ibu' },
    { jp: 'おとうさん', ro: 'otousan', id: 'ayah' }, { jp: 'おにいさん', ro: 'oniisan', id: 'kakak laki-laki' },
    { jp: 'おねえさん', ro: 'oneesan', id: 'kakak perempuan' }, { jp: 'おばあさん', ro: 'obaasan', id: 'nenek' },
    { jp: 'おじいさん', ro: 'ojiisan', id: 'kakek' }, { jp: 'せんせい', ro: 'sensei', id: 'guru' },
    { jp: 'すいか', ro: 'suika', id: 'semangka' }, { jp: 'はなび', ro: 'hanabi', id: 'kembang api' },
    { jp: 'まつり', ro: 'matsuri', id: 'festival' }, { jp: 'ゆかた', ro: 'yukata', id: 'kimono musim panas' },
    { jp: 'たなばた', ro: 'tanabata', id: 'festival bintang' }, { jp: 'ほたる', ro: 'hotaru', id: 'kunang-kunang' },
    { jp: 'おんせん', ro: 'onsen', id: 'pemandian air panas' }, { jp: 'きんぎょ', ro: 'kingyo', id: 'ikan mas koki' },
    { jp: '上', ro: 'ue', id: 'atas' }, { jp: '下', ro: 'shita', id: 'bawah' }, { jp: '中', ro: 'naka', id: 'dalam / tengah' },
    { jp: '右', ro: 'migi', id: 'kanan' }, { jp: '左', ro: 'hidari', id: 'kiri' }, { jp: '上手', ro: 'jouzu', id: 'pandai' },
  ].forEach(w => { if (!have.has(w.jp)) WORDS.push(w); });
})();

CHAPTERS.push({ n: 4, title: 'Musim Panas & Rahasia Gunung', from: 35, to: 46, grid: 'youon', jp: 'なつやすみ' });

/* ---------- Cuaca musim panas ---------- */
{
  const prevWeather = weatherFor;
  // eslint-disable-next-line no-global-assign
  weatherFor = n => n >= 35 && n <= 46 ? ([39].includes(n) ? 'rain' : [43].includes(n) ? 'cloud' : 'sun') : prevWeather(n);
}

/* ---------- Kejadian harian musim panas ---------- */
Object.assign(EVENTS, {
  semi: { title: 'Jangkrik musim panas', npc: 'kid', at: [10, 22], lines: [
    { n: 'みーん みーん… Suara jangkrik memenuhi udara. Sora mengintip pohon sambil membawa jaring.' },
    { w: 'kid', e: 'happy', jp: 'せみ、つかまえた！', ro: 'semi, tsukamaeta!', id: 'Jangkriknya tertangkap!' },
    { q: 'Bilang apa?', o: [
      { jp: 'すごい！', ro: 'sugoi!', ok: true },
      { jp: 'きもちわるい！', ro: 'kimochi warui!', why: 'Itu artinya "menjijikkan". Sora bangga! Bilang すごい.' },
    ]},
    { n: 'せみ = tonggeret/jangkrik musim panas. Bunyinya "miin-miin" = suara khas musim panas Jepang.' },
  ]},
  suika: { title: 'Semangka pecah', npc: 'kenta', at: [9, 17], lines: [
    { n: 'Kenta membawa semangka besar ke taman. すいかわり — memecah semangka dengan mata tertutup!' },
    { w: 'kenta', e: 'happy', t: 'Tutup matamu! Aku yang memberi arah.' },
    { w: 'kenta', jp: 'みぎ！… ひだり！… まっすぐ！', ro: 'migi!… hidari!… massugu!', id: 'Kanan!… Kiri!… Lurus!' },
    { q: 'Kenta berteriak 「ひだり！」. Ke mana kamu melangkah?', o: [
      { jp: 'ひだり', ro: 'hidari (kiri)', ok: true },
      { jp: 'みぎ', ro: 'migi (kanan)', why: 'ひだり = kiri, みぎ = kanan.' },
    ]},
    { n: 'Pok! Semangka terbelah. Kalian makan bersama. おいしい！' },
  ]},
  yuudachi: { title: 'Hujan sore mendadak', npc: 'obaa', at: [6, 11], weather: 'rain', lines: [
    { n: 'Hujan deras tiba-tiba turun (ゆうだち). Kamu dan Nenek Sato berteduh di toko permen tua.' },
    { w: 'obaa', e: 'happy', t: 'Dulu Nenek sering ke sini waktu kecil. Semua permennya sepuluh yen!' },
    { w: 'obaa', jp: 'これ、じゅう えん。', ro: 'kore, juu en.', id: 'Ini sepuluh yen.' },
    { q: 'Tulis "sepuluh yen" dengan kanji!', o: [
      { jp: '十円', ro: 'juu en', ok: true },
      { jp: '千円', ro: 'sen en', why: '千円 = seribu yen. Sepuluh = 十.' },
    ]},
  ]},
  kingyo: { title: 'Ikan mas Kakek Mori', npc: 'ojii', at: [17, 20], lines: [
    { n: 'Kakek Mori memberi makan ikan mas koki di ember kecil.' },
    { w: 'ojii', jp: 'きんぎょ だ。', ro: 'kingyo da.', id: 'Ikan mas koki.' },
    { w: 'ojii', e: 'sad', t: '…Keturunan ikan dari festival lama. Sudah lima puluh tahun, turun-temurun.' },
    { n: 'き-ん-ぎょ: ぎょ adalah yōon. Satu ketukan: "gyo".' },
  ]},
});
EVENT_BY_DAY.length = 35;
EVENT_BY_DAY.push('semi', 'photo', 'suika', 'music', 'yuudachi', null, null, null, 'race', null, 'kingyo', null);

/* ---------- 12 HARI BAB 4 ---------- */
const kataOf = list => list.map(h => [...h].map(c => String.fromCharCode(c.charCodeAt(0) + 0x60)).join(''));
const Y1 = ['きゃ','きゅ','きょ','しゃ','しゅ','しょ'];
const Y2 = ['ちゃ','ちゅ','ちょ','にゃ','にゅ','にょ'];
const Y3 = ['ひゃ','ひゅ','ひょ','みゃ','みゅ','みょ','りゃ','りゅ','りょ'];
const Y3D = ['ぎゃ','ぎゅ','ぎょ','じゃ','じゅ','じょ','びゃ','びゅ','びょ','ぴゃ','ぴゅ','ぴょ'];

DAYS.push(
  { // HARI 35
    title: 'Libur Musim Panas!', sub: 'きゃ きゅ きょ しゃ しゅ しょ', type: 'lesson', chapter: 4,
    kana: Y1, also: [...kataOf(Y1), 'ゃ', 'ゅ', 'ょ', 'ャ', 'ュ', 'ョ'],
    intro: [
      'Selamat datang di Bab 4 dan Kelas Musim Panas!',
      'Hari ini: huruf kecil ゃ ゅ ょ. Kalau menempel pada huruf berakhiran -i, dua huruf dibaca menjadi satu bunyi.',
      'き + ゃ kecil = きゃ, dibaca "kya" dalam satu ketukan. Bukan "ki-ya"!',
    ],
    morning: { npc: 'kenta', at: 'home_front', lines: [
      { n: 'Jangkrik berbunyi みーん みーん. Kenta datang naik sepeda sambil menjilat es loli.' },
      { w: 'kenta', e: 'happy', jp: 'なつやすみ だ ー！', ro: 'natsuyasumi da-!', id: 'Libur musim panas!' },
      { w: 'kenta', t: 'Tapi Tanaka-sensei membuka Kelas Musim Panas tiap pagi. Ayo, jangan telat!' },
      { q: 'Jawab Kenta!', o: [
        { jp: 'いっしょに いこう！', ro: 'issho ni ikou!', ok: true },
        { jp: 'おやすみ！', ro: 'oyasumi!', why: 'おやすみ = selamat tidur. Ajak Kenta berangkat: いっしょに いこう!' },
      ]},
    ]},
    cls: [
      { w: 'sensei', e: 'happy', jp: 'なつ の とくべつ クラス へ ようこそ！', ro: 'natsu no tokubetsu kurasu e youkoso!', id: 'Selamat datang di Kelas Musim Panas!' },
      { w: 'sensei', t: 'Ingat じゅう dan ひゃく di Bab 3? Sekarang kalian tahu huruf kecil itu apa.' },
    ],
    brk: { npc: 'yuki', at: 'park', lines: [
      { n: 'Yuki memotret bunga matahari dengan kamera ponselnya.' },
      { w: 'yuki', e: 'happy', jp: 'しゃしん、とって あげる！', ro: 'shashin, totte ageru!', id: 'Aku fotokan, ya!' },
      { q: 'Kata untuk "foto" adalah…', o: [
        { jp: 'しゃしん', ro: 'shashin', ok: true },
        { jp: 'しやしん', ro: 'shiyashin', why: 'や-nya harus kecil: しゃ dibaca satu ketukan "sha". しゃしん = foto.' },
      ]},
      { w: 'yuki', e: 'happy', jp: 'はい、チーズ！', ro: 'hai, chiizu!', id: 'Ayo, cheese!' },
    ]},
    phrases: [
      { jp: 'なつやすみ', ro: 'natsuyasumi', id: 'Libur musim panas' },
      { jp: 'きょう', ro: 'kyou', id: 'Hari ini' },
      { jp: 'しゃしん', ro: 'shashin', id: 'Foto' },
      { jp: 'はい、チーズ', ro: 'hai, chiizu', id: 'Ayo, senyum! (saat difoto)' },
    ],
  },
  { // HARI 36
    title: 'Teh & Kucing', sub: 'ちゃ ちゅ ちょ にゃ にゅ にょ', type: 'lesson', chapter: 4,
    kana: Y2, also: kataOf(Y2),
    intro: ['Hari ini ちゃ ちゅ ちょ dan にゃ にゅ にょ.', 'Panggilan akrab 〜ちゃん juga memakai ゃ kecil: さとちゃん!'],
    morning: { npc: 'hana', at: 'gate', lines: [
      { n: 'Hana membawa termos kecil.' },
      { w: 'hana', e: 'happy', jp: 'おちゃ、のむ？', ro: 'ocha, nomu?', id: 'Mau minum teh?' },
      { q: 'Terima dengan sopan!', o: [
        { jp: 'ありがとう、いただきます！', ro: 'arigatou, itadakimasu!', ok: true },
        { jp: 'ごちそうさま！', ro: 'gochisousama!', why: 'Itu diucapkan SETELAH makan/minum.' },
      ]},
    ]},
    cls: [
      { w: 'sensei', t: 'Panggilan: 〜ちゃん untuk anak kecil atau teman dekat, 〜くん untuk anak laki-laki, 〜さん untuk semua orang dengan sopan.' },
    ],
    brk: { npc: 'kid', at: 'park', lines: [
      { n: 'Mochi tidur di bangku taman. Sora mengelusnya pelan.' },
      { w: 'mochi', jp: 'にゃあ。', ro: 'nyaa.', id: 'Meong.' },
      { w: 'kid', e: 'happy', t: 'Senpai, di Jepang kucing bilang にゃあ! Di Indonesia?' },
      { q: 'Kucing Jepang bilang…', o: [
        { jp: 'にゃあ', ro: 'nyaa', ok: true },
        { jp: 'わんわん', ro: 'wan wan', why: 'わんわん itu suara anjing! Kucing: にゃあ (di Indonesia: meong).' },
      ]},
    ]},
    phrases: [
      { jp: 'おちゃ', ro: 'ocha', id: 'Teh hijau' },
      { jp: '〜ちゃん / 〜くん / 〜さん', ro: '-chan / -kun / -san', id: 'Panggilan akrab / anak laki-laki / sopan' },
      { jp: 'ちょっと', ro: 'chotto', id: 'Sedikit / sebentar' },
    ],
  },
  { // HARI 37
    title: 'Yōon Lengkap', sub: 'ひゃ みゃ りゃ … ぎゃ じゃ びゃ ぴゃ', type: 'lesson', chapter: 4,
    kana: Y3, also: [...kataOf(Y3), ...Y3D, ...kataOf(Y3D)],
    intro: ['Hari ini sisa yōon: ひゃ, みゃ, りゃ, dan versi ber-tenten: ぎゃ, じゃ, びゃ, ぴゃ.', 'Hati-hati mendengar: びょういん (rumah sakit) dan びよういん (salon) berbeda!'],
    morning: { npc: 'yuki', at: 'gate', lines: [
      { w: 'yuki', e: 'happy', jp: 'じゃんけん ぽん！', ro: 'janken pon!', id: 'Batu-gunting-kertas!' },
      { q: 'Keluarkan pilihanmu!', o: [
        { jp: 'グー', ro: 'guu (batu)', ok: true }, { jp: 'チョキ', ro: 'choki (gunting)', ok: true }, { jp: 'パー', ro: 'paa (kertas)', ok: true },
      ]},
      { w: 'yuki', e: 'happy', t: 'Seri! じゃ, ちょ — semuanya yōon, lho!' },
    ]},
    cls: [
      { w: 'sensei', t: 'りょこう = perjalanan. ぎゅうにゅう = susu. Coba ucapkan pelan-pelan.' },
    ],
    brk: { npc: 'kenta', at: 'river', lines: [
      { n: 'Kenta duduk di tepi sungai, memeluk buku sketsanya yang ternoda oli.' },
      { w: 'kenta', e: 'sad', t: 'Nggak apa-apa… Nanti aku cerita.' },
    ]},
    phrases: [
      { jp: 'りょこう', ro: 'ryokou', id: 'Perjalanan wisata' },
      { jp: 'ぎゅうにゅう', ro: 'gyuunyuu', id: 'Susu' },
      { jp: 'びょういん / びよういん', ro: 'byouin / biyouin', id: 'Rumah sakit / salon' },
    ],
  },
  { // HARI 38
    title: 'Tsu Kecil', sub: 'っ ッ', type: 'lesson', chapter: 4, drill: 'sokuon',
    kana: ['っ'], also: ['ッ'],
    intro: ['Huruf っ kecil tidak dibaca "tsu". Artinya: berhenti sejenak satu ketukan.', 'Tepuk tangan bersama sensei: が・っ・こ・う — empat ketukan!'],
    morning: { npc: 'kenta', at: 'gate', lines: [
      { w: 'kenta', e: 'happy', jp: 'がっこう、なつ でも ある の？', ro: 'gakkou, natsu demo aru no?', id: 'Sekolah tetap ada meski musim panas?' },
      { n: 'が-っ-こ-う: ada jeda kecil sebelum こ. Coba rasakan!' },
    ]},
    cls: [
      { w: 'sensei', t: 'きて (datanglah) dan きって (perangko) hanya beda satu jeda. Latihan telinga hari ini sangat penting!' },
    ],
    brk: { npc: 'tenin', at: 'konbini', lines: [
      { w: 'tenin', e: 'happy', jp: 'いらっしゃいませ！', ro: 'irasshaimase!', id: 'Selamat datang!' },
      { n: 'い-ら-っ-しゃ-い-ま-せ: ada っ dan ゃ sekaligus!' },
      { q: 'Kamu ingin membeli majalah. Katakan…', o: [
        { jp: 'ざっし を ください。', ro: 'zasshi o kudasai.', ok: true },
        { jp: 'ざし を ください。', ro: 'zashi o kudasai.', why: 'Majalah = ざっし (za-s-shi), dengan jeda. ざし tidak ada artinya.' },
      ]},
    ]},
    phrases: [
      { jp: 'がっこう', ro: 'gakkou', id: 'Sekolah' },
      { jp: 'きって', ro: 'kitte', id: 'Perangko' },
      { jp: 'ちょっと まって', ro: 'chotto matte', id: 'Tunggu sebentar' },
    ],
  },
  { // HARI 39
    title: 'Bunyi Panjang', sub: 'ー ・ おう ・ えい', type: 'lesson', chapter: 4, drill: 'long',
    kana: ['ー'],
    intro: ['Bunyi panjang! Garis ー sudah sering kamu lihat sejak Bab 2 (ケーキ, スキー). Sekarang kita pelajari aturannya: di katakana cukup garis ー, seperti コーヒー.', 'Di hiragana ditulis dengan huruf vokal: おかあさん, おにいさん. おう dan えい juga dibaca panjang: ありがとう, せんせい.'],
    morning: { npc: 'yuki', at: 'gate', lines: [
      { n: 'Hujan sore kemarin membuat udara sejuk.' },
      { w: 'yuki', e: 'happy', jp: 'わたし の なまえ は「ゆき」。「ゆうき」じゃ ない よ！', ro: 'watashi no namae wa "yuki". "yuuki" ja nai yo!', id: 'Namaku "Yuki", bukan "yuuki"!' },
      { w: 'yuki', e: 'sad', t: 'ゆうき artinya keberanian. …Sebenarnya aku ingin punya keberanian juga.' },
    ]},
    cls: [
      { w: 'sensei', t: 'おばさん (bibi) dan おばあさん (nenek) — hati-hati, jangan sampai memanggil bibi "nenek"!' },
    ],
    brk: { npc: 'hana', at: 'park', lines: [
      { w: 'hana', e: 'happy', t: 'Besok kalian ke onsen, ya? Bawa おみやげ (oleh-oleh) untuk pemilik penginapan!' },
      { q: 'Oleh-oleh yang cocok…', o: [
        { jp: 'おかし', ro: 'okashi', ok: true },
        { jp: 'くつした', ro: 'kutsushita', why: 'Kaus kaki bukan oleh-oleh yang biasa, hehe. Kue (おかし) lebih cocok!' },
      ]},
    ]},
    phrases: [
      { jp: 'おかあさん / おとうさん', ro: 'okaasan / otousan', id: 'Ibu / ayah' },
      { jp: 'おみやげ', ro: 'omiyage', id: 'Oleh-oleh' },
      { jp: 'コーヒー', ro: 'koohii', id: 'Kopi' },
    ],
  },
  { // HARI 40
    title: 'Ke Onsen!', sub: 'Ulangan 4 · yōon', type: 'test', count: 15, chapter: 4, pool: 'youon',
    morning: { npc: 'hana', with: 'yuki', at: 'home_front', lines: [
      { n: 'Hana dan Yuki datang membawa tas besar.' },
      { w: 'yuki', e: 'happy', jp: 'りょこう だ ー！', ro: 'ryokou da-!', id: 'Jalan-jalan!' },
      { w: 'hana', t: 'Kelas pagi dulu, ya. Ada ulangan kecil. Kereta berangkat sore.' },
    ]},
    cls: [
      { w: 'sensei', jp: 'きょう は ようおん の テスト です。', ro: 'kyou wa youon no tesuto desu.', id: 'Hari ini ulangan yōon.' },
      { w: 'sensei', e: 'happy', t: 'Setelah itu, selamat berlibur! Kirim foto onsen ke sensei, ya!' },
    ],
    brk: { npc: 'obaa', at: 'home_front', lines: [
      { w: 'obaa', e: 'happy', jp: 'さあ、いきましょう。', ro: 'saa, ikimashou.', id: 'Ayo, kita berangkat.' },
      { n: 'Kalian naik kereta sore menuju desa gunung やま.' },
    ]},
    phrases: [
      { jp: 'りょこう', ro: 'ryokou', id: 'Perjalanan' },
      { jp: 'おんせん', ro: 'onsen', id: 'Pemandian air panas' },
      { jp: 'ひさしぶり', ro: 'hisashiburi', id: 'Lama tak jumpa' },
    ],
  },
  { // HARI 41
    title: 'Atas, Bawah, Tengah', sub: '上 下 中', type: 'lesson', chapter: 4,
    kana: ['上','下','中'],
    intro: ['Kelas pagi jarak jauh dari penginapan! Hari ini kanji posisi.', '上 menunjuk ke atas, 下 menunjuk ke bawah, 中 garis menembus tengah kotak.'],
    morning: { npc: 'kenta', at: 'gate', lines: [
      { n: 'Pagi di desa gunung. Kenta baru tiba dengan kereta pertama, membawa buku sketsa baru.' },
      { w: 'kenta', e: 'happy', jp: 'おはよう！まにあった！', ro: 'ohayou! maniatta!', id: 'Pagi! Aku sempat!' },
    ]},
    cls: [
      { w: 'sensei', t: '(lewat video call) つくえ の 上 = di atas meja. つくえ の 下 = di bawah meja. かばん の 中 = di dalam tas.' },
    ],
    brk: { npc: 'nouka', at: 'park', lines: [
      { n: 'Pak Petani mengajak kalian memetik tomat dan mentimun.' },
      { w: 'nouka', e: 'happy', jp: 'トマト は はたけ の 中 だよ。', ro: 'tomato wa hatake no naka da yo.', id: 'Tomatnya ada di dalam kebun.' },
    ]},
    phrases: [
      { jp: '〜の 上 / 下 / 中', ro: '~no ue / shita / naka', id: 'Di atas / bawah / dalam …' },
      { jp: '〜に あります', ro: '~ni arimasu', id: 'Ada di … (benda)' },
      { jp: 'まにあった', ro: 'maniatta', id: 'Sempat / tidak terlambat' },
    ],
  },
  { // HARI 42
    title: 'Kanan & Kiri', sub: '右 左', type: 'lesson', chapter: 4,
    kana: ['右','左'],
    intro: ['右 (kanan) dan 左 (kiri) sangat mirip!', 'Trik: 右 punya 口 (mulut) — tangan kanan untuk makan. 左 punya 工 (alat).'],
    morning: { npc: 'yuki', at: 'gate', lines: [
      { w: 'yuki', e: 'happy', t: 'Hari terakhir di gunung! Aku mau berendam lagi sebelum pulang.' },
    ]},
    cls: [
      { w: 'sensei', t: 'みぎ に まがって ください = belok kanan. ひだり = kiri. まっすぐ = lurus.' },
    ],
    brk: { npc: 'obaa', at: 'home_front', lines: [
      { w: 'obaa', e: 'sad', t: '…Ayo kita pulang.' },
    ]},
    phrases: [
      { jp: '右 / 左', ro: 'migi / hidari', id: 'Kanan / kiri' },
      { jp: 'まっすぐ', ro: 'massugu', id: 'Lurus' },
      { jp: 'まがって ください', ro: 'magatte kudasai', id: 'Silakan belok' },
    ],
  },
  { // HARI 43
    title: 'Pohon Sakura Tua', sub: 'Kuis posisi & arah', type: 'test', count: 10, chapter: 4, pool: 'pos',
    morning: { npc: 'kenta', at: 'gate', lines: [
      { w: 'kenta', e: 'happy', t: 'Pak Petani bilang pohon sakura sekolah butuh kompos. Ayo bantu sepulang kelas!' },
    ]},
    cls: [
      { w: 'sensei', t: 'Kuis kecil: kanji posisi. Setelah itu, sensei ikut merawat pohon sakura.' },
    ],
    brk: { npc: 'sensei', at: 'gate', lines: [
      { n: 'Tanaka-sensei sudah menunggu dengan sekop kecil.' },
      { w: 'sensei', e: 'happy', jp: 'がんばりましょう！', ro: 'ganbarimashou!', id: 'Mari berjuang!' },
    ]},
    phrases: [
      { jp: 'き', ro: 'ki', id: 'Pohon' },
      { jp: 'ね', ro: 'ne', id: 'Akar' },
      { jp: 'がんばりましょう', ro: 'ganbarimashou', id: 'Mari berjuang' },
    ],
  },
  { // HARI 44
    title: 'Tanabata', sub: 'Ulasan yōon & っ', type: 'test', count: 12, chapter: 4, pool: 'ch4',
    morning: { npc: 'hana', at: 'gate', lines: [
      { n: 'Tanggal 7 Juli. Di depan stasiun berdiri pohon bambu berhias kertas warna-warni.' },
      { w: 'hana', e: 'happy', jp: 'たなばた だね！ねがいごと、かこう！', ro: 'tanabata da ne! negaigoto, kakou!', id: 'Tanabata, ya! Ayo tulis permohonan!' },
    ]},
    cls: [
      { w: 'sensei', t: 'Legenda Tanabata: Orihime dan Hikoboshi hanya bisa bertemu setahun sekali, di malam ini.' },
    ],
    brk: { npc: 'yuki', at: 'konbini', lines: [
      { w: 'yuki', e: 'happy', t: 'Ayo ke pohon bambu! Aku sudah bawa spidol.' },
    ]},
    phrases: [
      { jp: 'たなばた', ro: 'tanabata', id: 'Festival bintang (7 Juli)' },
      { jp: 'ねがいごと', ro: 'negaigoto', id: 'Permohonan' },
      { jp: '〜ます ように', ro: '~masu you ni', id: 'Semoga …' },
    ],
  },
  { // HARI 45
    title: 'Persiapan Matsuri', sub: 'Ulasan besar Bab 4', type: 'test', count: 15, chapter: 4, pool: 'ch4',
    morning: { npc: 'kenta', at: 'home_front', lines: [
      { w: 'kenta', e: 'happy', t: 'Besok Natsu Matsuri pertama dalam sepuluh tahun! Aku bantu mengecat papan yatai.' },
    ]},
    cls: [
      { w: 'sensei', e: 'happy', t: 'Ulasan besar sebelum ujian. Setelah itu, sensei juga datang ke festival dengan yukata!' },
    ],
    brk: { npc: 'imoya', at: 'park', lines: [
      { w: 'imoya', e: 'happy', t: 'Musim panas ubi tidak laku… Tapi besok aku jualan jagung bakar di festival!' },
    ]},
    phrases: [
      { jp: 'なつまつり', ro: 'natsu matsuri', id: 'Festival musim panas' },
      { jp: 'ゆかた', ro: 'yukata', id: 'Kimono musim panas' },
      { jp: 'やたい', ro: 'yatai', id: 'Kios / warung festival' },
    ],
  },
  { // HARI 46
    title: 'Natsu Matsuri', sub: 'Ujian Bab 4 & festival', type: 'test', count: 20, chapter: 4, pool: 'ch4',
    morning: { npc: 'yuki', with: 'hana', at: 'gate', lines: [
      { w: 'yuki', e: 'happy', jp: 'こんばん、はなび を いっしょに みよう ね！やくそく！', ro: 'konban, hanabi o issho ni miyou ne! yakusoku!', id: 'Malam ini kita nonton kembang api bersama, ya! Janji!' },
      { q: 'Jawab Yuki!', o: [
        { jp: 'うん、やくそく！', ro: 'un, yakusoku!', ok: true },
        { jp: 'いやだ。', ro: 'iya da.', why: 'いやだ = tidak mau. Yuki sangat menanti! Jawab: うん、やくそく!' },
      ]},
    ]},
    cls: [
      { w: 'sensei', jp: 'だい よん しょう の しけん です。', ro: 'dai yon shou no shiken desu.', id: 'Ujian Bab 4.' },
    ],
    brk: { npc: 'ryo', at: 'park', lines: [
      { n: 'Senja. Lentera merah menyala di sepanjang taman. Bunyi taiko terdengar dari panggung.' },
      { w: 'ryo', e: 'happy', t: 'Kamu datang! Malam ini aku menyanyikan bait kedua lagu kota. Dengarkan, ya!' },
    ]},
    phrases: [
      { jp: 'はなび', ro: 'hanabi', id: 'Kembang api' },
      { jp: 'やくそく', ro: 'yakusoku', id: 'Janji' },
      { jp: 'ごめんね', ro: 'gomen ne', id: 'Maaf, ya' },
    ],
  },
);

/* ---------- Pencapaian Bab 4 ---------- */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof ACHIEVEMENTS === 'undefined') return;
  const flag = f => s => !!(s.story && s.story.flags && s.story.flags[f]);
  ACHIEVEMENTS.push(
    { id: 'youon', icon: 'ゃ', title: 'Satu Ketukan', desc: 'Pelajari 30 bunyi yōon.', pts: 40, test: s => s.kana.filter(k => IS_YOUON(k)).length >= 30 },
    { id: 'satochan', icon: '桜', title: 'さとちゃん', desc: 'Temukan nama panggilan lama Nenek Sato.', pts: 20, test: flag('chan_revealed') },
    { id: 'onsen', icon: '♨', title: 'Tamu Onsen', desc: 'Menginap tiga hari di desa gunung.', pts: 30, test: flag('sato_mori_argue') },
    { id: 'flash1', icon: '🎞', title: 'Musim Panas 1976', desc: 'Mengalami kilas balik pertama.', pts: 20, test: flag('flashback1') },
    { id: 'matsuri', icon: '🎆', title: 'Hanabi', desc: 'Menonton kembang api Natsu Matsuri bersama teman.', pts: 30, test: flag('matsuri_done') },
    { id: 'ch4', icon: '夏', title: 'Lulus Bab 4', desc: 'Selesaikan Bab Musim Panas.', pts: 60, test: s => s.day > 46 },
  );
});
