/* =========================================================
   DATA BAGIAN 4 — BAB 3 「てんてん と すうじ」 Suara Baru & Angka
   Hari 23–34 · musim hujan (つゆ)
   - Dakuten ゛ & handakuten ゜ (hiragana diajarkan di video; katakana ikut, aturannya sama)
   - Angka & 14 kanji pertama (一〜十, 百, 円, 千, 万)
   Cerita Bab 3 (kafe Hana, pantai, Pasar Pagi) ada di src/story/scenes3.ts
   Lihat design/03-BAB3-SUARA-BARU-DAN-ANGKA.md
   ========================================================= */

// Jenis huruf: 'hira' | 'kata' | 'kanji'
const IS_KANJI = c => c >= '一' && c <= '鿿';
const SCRIPT_OF = c => IS_KANJI(c) ? 'kanji' : IS_KATA(c) ? 'kata' : 'hira';

/* ---------- Dakuten & handakuten ---------- */
const DAKU_RO = {
  'が': 'ga', 'ぎ': 'gi', 'ぐ': 'gu', 'げ': 'ge', 'ご': 'go',
  'ざ': 'za', 'じ': 'ji', 'ず': 'zu', 'ぜ': 'ze', 'ぞ': 'zo',
  'だ': 'da', 'ぢ': 'ji', 'づ': 'zu', 'で': 'de', 'ど': 'do',
  'ば': 'ba', 'び': 'bi', 'ぶ': 'bu', 'べ': 'be', 'ぼ': 'bo',
  'ぱ': 'pa', 'ぴ': 'pi', 'ぷ': 'pu', 'ぺ': 'pe', 'ぽ': 'po',
};
const DAKU_TIP_EXTRA = {
  'じ': ' Dibaca "ji" seperti "jalan".', 'ず': ' Dibaca "zu" (z mendengung).',
  'ぢ': ' Jarang dipakai; bunyinya sama dengan じ.', 'づ': ' Jarang dipakai; bunyinya sama dengan ず.',
  'で': ' Juga partikel "di/dengan" (Bab 4).',
};
(function addDakuten() {
  Object.entries(DAKU_RO).forEach(([h, ro]) => {
    const handa = /^p/.test(ro);
    const base = String.fromCharCode(h.charCodeAt(0) - (handa ? 2 : 1));
    const mark = handa ? 'maru ゜ (lingkaran kecil)' : 'tenten ゛ (dua titik)';
    const why = handa ? `bunyinya berubah dari "${KANA[base].ro}" menjadi "${ro}" (bibir mengatup)` : `bunyinya jadi lebih berat: "${KANA[base].ro}" → "${ro}"`;
    KANA[h] = { ro, tip: `${base} + ${mark} = ${h}. Tanda di kanan atas membuat ${why}.${DAKU_TIP_EXTRA[h] || ''}` };
    const k = String.fromCharCode(h.charCodeAt(0) + 0x60), kb = String.fromCharCode(base.charCodeAt(0) + 0x60);
    KANA[k] = { ro, tip: `${kb} + ${mark} = ${k}. Aturannya sama persis dengan hiragana ${h}.` };
  });
})();
const DAKU_GRID = [
  ['が','ぎ','ぐ','げ','ご'], ['ざ','じ','ず','ぜ','ぞ'], ['だ','ぢ','づ','で','ど'], ['ば','び','ぶ','べ','ぼ'], ['ぱ','ぴ','ぷ','ぺ','ぽ'],
  ['ガ','ギ','グ','ゲ','ゴ'], ['ザ','ジ','ズ','ゼ','ゾ'], ['ダ','ヂ','ヅ','デ','ド'], ['バ','ビ','ブ','ベ','ボ'], ['パ','ピ','プ','ペ','ポ'],
];

/* ---------- Kanji angka (kanji pertamamu!) ---------- */
Object.assign(KANA, {
  '一': { ro: 'ichi',  tip: 'Satu garis mendatar = satu. Bacaan lain: ひと(つ).' },
  '二': { ro: 'ni',    tip: 'Dua garis = dua. Garis bawah lebih panjang dari garis atas.' },
  '三': { ro: 'san',   tip: 'Tiga garis = tiga. Garis tengah paling pendek, garis bawah paling panjang.' },
  '四': { ro: 'yon',   tip: 'Kotak seperti jendela dengan dua kaki di dalamnya. Dibaca よん atau し.' },
  '五': { ro: 'go',    tip: 'Seperti angka 5 yang kotak: garis atas, tiang miring, lalu alas panjang.' },
  '六': { ro: 'roku',  tip: 'Topi di atas dan dua kaki terbuka, seperti orang menari rock: "ROKU"!' },
  '七': { ro: 'nana',  tip: 'Seperti angka 7 terbalik yang dipotong garis. Dibaca なな atau しち.' },
  '八': { ro: 'hachi', tip: 'Dua garis terbuka ke bawah seperti kaki gunung. Angka 8 dianggap membawa keberuntungan.' },
  '九': { ro: 'kyuu',  tip: 'Seperti orang berlutut sambil mengulurkan tangan. Dibaca きゅう atau く.' },
  '十': { ro: 'juu',   tip: 'Tanda tambah = sepuluh. Seperti dua jari yang disilangkan.' },
  '百': { ro: 'hyaku', tip: 'Satu (一) di atas kotak putih (白): seratus. Hati-hati: 300 = さんびゃく, 600 = ろっぴゃく, 800 = はっぴゃく.' },
  '円': { ro: 'en',    tip: 'Yen, mata uang Jepang. Bentuknya seperti jendela bundar. 百円 = seratus yen.' },
  '千': { ro: 'sen',   tip: 'Sepuluh (十) dengan topi miring di atas: seribu. 3000 = さんぜん, 8000 = はっせん.' },
  '万': { ro: 'man',   tip: 'Sepuluh ribu. Di Jepang angka besar dihitung per 万: 10.000 = いちまん.' },
});
const KANJI_GRID = [['一','二','三','四','五'], ['六','七','八','九','十'], ['百','千','万','円','']];

/* ---------- Kolam soal (kuis & karuta) ---------- */
const POOL_FILTER = {
  hira: k => SCRIPT_OF(k) === 'hira' && !DAKU_RO[k],
  kata: k => SCRIPT_OF(k) === 'kata' && !DAKU_RO[String.fromCharCode(k.charCodeAt(0) - 0x60)],
  daku: k => !!(DAKU_RO[k] || DAKU_RO[String.fromCharCode(k.charCodeAt(0) - 0x60)]),
  num: k => IS_KANJI(k),
  ch3: k => !!(DAKU_RO[k] || DAKU_RO[String.fromCharCode(k.charCodeAt(0) - 0x60)]) || IS_KANJI(k),
};

/* ---------- Kosakata baru ---------- */
WORDS.push(
  { jp: 'めがね', ro: 'megane', id: 'kacamata' },
  { jp: 'かぎ', ro: 'kagi', id: 'kunci' },
  { jp: 'ごはん', ro: 'gohan', id: 'nasi / makan' },
  { jp: 'ゲーム', ro: 'geemu', id: 'gim' },
  { jp: 'ギター', ro: 'gitaa', id: 'gitar' },
  { jp: 'ちず', ro: 'chizu', id: 'peta' },
  { jp: 'かぜ', ro: 'kaze', id: 'angin' },
  { jp: 'ぞう', ro: 'zou', id: 'gajah' },
  { jp: 'あじさい', ro: 'ajisai', id: 'bunga ajisai' },
  { jp: 'チーズ', ro: 'chiizu', id: 'keju' },
  { jp: 'まど', ro: 'mado', id: 'jendela' },
  { jp: 'そで', ro: 'sode', id: 'lengan baju' },
  { jp: 'でんわ', ro: 'denwa', id: 'telepon' },
  { jp: 'デパート', ro: 'depaato', id: 'department store' },
  { jp: 'ドア', ro: 'doa', id: 'pintu' },
  { jp: 'かばん', ro: 'kaban', id: 'tas' },
  { jp: 'えんぴつ', ro: 'enpitsu', id: 'pensil' },
  { jp: 'ぶた', ro: 'buta', id: 'babi' },
  { jp: 'パン', ro: 'pan', id: 'roti' },
  { jp: 'ペン', ro: 'pen', id: 'pena' },
  { jp: 'ボール', ro: 'booru', id: 'bola' },
  { jp: 'ピアノ', ro: 'piano', id: 'piano' },
  { jp: 'いちば', ro: 'ichiba', id: 'pasar' },
  { jp: 'かたつむり', ro: 'katatsumuri', id: 'siput' },
  { jp: 'メロンソーダ', ro: 'meron sooda', id: 'melon soda' },
  { jp: '一つ', ro: 'hitotsu', id: 'satu (buah)' },
  { jp: '二つ', ro: 'futatsu', id: 'dua (buah)' },
  { jp: '三つ', ro: 'mittsu', id: 'tiga (buah)' },
  { jp: '十', ro: 'juu', id: 'sepuluh' },
  { jp: '百円', ro: 'hyaku en', id: 'seratus yen' },
  { jp: '千円', ro: 'sen en', id: 'seribu yen' },
  { jp: '一万円', ro: 'ichiman en', id: 'sepuluh ribu yen' },
);

CHAPTERS.push({ n: 3, title: 'Suara Baru & Angka', from: 23, to: 34, grid: 'daku', jp: 'てんてん と すうじ' });
CHAPTERS[0].jp = 'ひらがな'; CHAPTERS[1].jp = 'カタカナ';

/* ---------- Cuaca musim hujan ---------- */
{
  const baseWeather = weatherFor;
  // eslint-disable-next-line no-global-assign
  weatherFor = n => n >= 23 && n <= 34 ? ([23, 24, 26, 28, 31, 33].includes(n) ? 'rain' : [25, 29, 32].includes(n) ? 'cloud' : 'sun') : baseWeather(n);
}

/* ---------- Kejadian harian baru (musim hujan) ---------- */
Object.assign(EVENTS, {
  ajisai: { title: 'Ajisai di tengah hujan', npc: 'hana', at: [10, 14], weather: 'rain', lines: [
    { n: 'Hana berjongkok memotret bunga ajisai biru yang basah.' },
    { w: 'hana', e: 'happy', jp: 'あじさい、きれい でしょう？', ro: 'ajisai, kirei deshou?', id: 'Ajisai indah, kan?' },
    { w: 'hana', t: 'Warna ajisai berubah tergantung tanahnya. Kadang あお (biru), kadang ピンク!' },
    { q: 'Setuju dengan Hana!', o: [
      { jp: 'ほんとう に きれい！', ro: 'hontou ni kirei!', ok: true },
      { jp: 'きたない。', ro: 'kitanai.', why: 'きたない = kotor. Kebalikannya: きれい (indah/bersih).' },
    ]},
    { n: 'あ-じ-さ-い: huruf じ memakai tenten, dibaca "ji".' },
  ]},
  kaeru: { title: 'Kodok di tas Mai', npc: 'mai', at: [8, 17], weather: 'rain', lines: [
    { n: 'Mai menjerit! Seekor kodok kecil melompat keluar dari tasnya.' },
    { w: 'mai', e: 'surprised', jp: 'かえる！かえる が いる！', ro: 'kaeru! kaeru ga iru!', id: 'Kodok! Ada kodok!' },
    { q: 'Tenangkan Mai!', o: [
      { jp: 'だいじょうぶ だよ。', ro: 'daijoubu da yo.', ok: true },
      { jp: 'こわい！', ro: 'kowai!', why: 'Kalau kamu juga bilang こわい (seram), Mai makin takut. Bilang: だいじょうぶ.' },
    ]},
    { w: 'mai', e: 'happy', jp: 'かえる、かわいい かも…', ro: 'kaeru, kawaii kamo…', id: 'Kodoknya… mungkin lucu juga…' },
    { n: 'かえる = kodok. (Kata yang sama juga berarti "pulang" — ditulis dengan kanji berbeda.)' },
  ]},
  teru: { title: 'Boneka てるてるぼうず', npc: 'kid', at: [10, 22], weather: 'rain', lines: [
    { n: 'Sora menggantung boneka kain putih di pagar.' },
    { w: 'kid', e: 'happy', jp: 'てるてるぼうず！あした は はれ に なれ！', ro: 'teru teru bouzu! ashita wa hare ni nare!', id: 'Teru teru bouzu! Besok cerahlah!' },
    { w: 'kid', t: 'Kalau digantung, besok tidak hujan. Katanya, sih!' },
    { q: 'Doakan bersama Sora!', o: [
      { jp: 'はれ に なります ように！', ro: 'hare ni narimasu you ni!', ok: true },
      { jp: 'あめ が すき！', ro: 'ame ga suki!', why: 'Sora ingin cerah (はれ), bukan hujan (あめ)!' },
    ]},
    { n: 'ぼ = ほ + tenten. "bo".' },
  ]},
});
EVENT_BY_DAY.length = 23;
EVENT_BY_DAY.push('kasa', 'ajisai', 'music', 'kaeru', 'food', 'study', null, 'wallet', 'teru', 'imo', 'photo', null);

/* ---------- 12 HARI BAB 3 ---------- */
DAYS.push(
  { // HARI 23
    title: 'Tenten!', sub: 'が ぎ ぐ げ ご', type: 'lesson', chapter: 3,
    kana: ['が','ぎ','ぐ','げ','ご'], also: ['ガ','ギ','グ','ゲ','ゴ'],
    intro: [
      'Selamat datang di Bab 3! Hari ini kita belajar tanda kecil yang sangat penting: tenten, dua titik di kanan atas.',
      'Tenten membuat bunyi menjadi lebih berat. か menjadi が, k menjadi g.',
      'Aturannya sama untuk katakana: カ menjadi ガ. Jadi hari ini kamu dapat sepuluh huruf sekaligus!',
    ],
    morning: { npc: 'yuki', at: 'gate', lines: [
      { n: 'Hujan pertama musim hujan. Yuki datang basah kuyup, tapi tertawa.' },
      { w: 'yuki', e: 'happy', jp: 'つゆ が はじまった ね！', ro: 'tsuyu ga hajimatta ne!', id: 'Musim hujan sudah mulai, ya!' },
      { w: 'yuki', t: 'Di Jepang, awal musim panas hujan terus sebulan. Namanya つゆ.' },
      { q: 'Yuki kehujanan. Tawarkan payung!', o: [
        { jp: 'かさ、どうぞ。', ro: 'kasa, douzo.', ok: true },
        { jp: 'かさ、ください。', ro: 'kasa, kudasai.', why: 'ください = minta. Kamu yang memberi: どうぞ (silakan).' },
      ]},
      { w: 'yuki', e: 'happy', jp: 'ありがとう！やさしい ね。', ro: 'arigatou! yasashii ne.', id: 'Makasih! Kamu baik, ya.' },
    ]},
    cls: [
      { w: 'sensei', e: 'happy', t: 'Bab 3 dimulai! Ingat surat-surat lama? Banyak kata di sana memakai tanda kecil ini.' },
      { w: 'sensei', jp: 'てんてん', ro: 'tenten', id: 'Tanda dua titik ゛' },
      { w: 'sensei', t: 'Hari ini: が ぎ ぐ げ ご. Katakananya ikut: ガ ギ グ ゲ ゴ.' },
    ],
    brk: { npc: 'kenta', at: 'river', lines: [
      { n: 'Kenta berteduh di bawah jembatan sambil main gim di ponsel.' },
      { w: 'kenta', e: 'happy', jp: 'みて！あたらしい ゲーム！', ro: 'mite! atarashii geemu!', id: 'Lihat! Gim baru!' },
      { q: 'Tulisan di layar dibaca "geemu". Yang mana?', o: [
        { jp: 'ゲーム', ro: 'geemu', ok: true },
        { jp: 'ケーム', ro: 'keemu', why: 'ケ tanpa tenten = ke. ケ + tenten = ゲ (ge). Jadi "geemu" = ゲーム.' },
      ]},
      { w: 'kenta', e: 'happy', t: 'Tepat! Kalau tanpa tenten jadi "keemu". Aneh, kan?' },
    ]},
    phrases: [
      { jp: 'つゆ', ro: 'tsuyu', id: 'Musim hujan' },
      { jp: 'かさ、どうぞ', ro: 'kasa, douzo', id: 'Ini payungnya, silakan' },
      { jp: 'めがね', ro: 'megane', id: 'Kacamata' },
      { jp: 'ゲーム', ro: 'geemu', id: 'Gim' },
    ],
  },
  { // HARI 24
    title: 'Baris ZA', sub: 'ざ じ ず ぜ ぞ', type: 'lesson', chapter: 3,
    kana: ['ざ','じ','ず','ぜ','ぞ'], also: ['ザ','ジ','ズ','ゼ','ゾ'],
    morning: { npc: 'kid', at: 'home_front', lines: [
      { n: 'Sora menunggumu di depan rumah sambil memegang buku.' },
      { w: 'kid', jp: 'せんぱい、この「じ」って なに？', ro: 'senpai, kono "ji" tte nani?', id: 'Senpai, "ji" ini apa?' },
      { q: 'Ajari Sora!', o: [
        { jp: 'し に てんてん で「じ」だよ。', ro: 'shi ni tenten de "ji" da yo.', ok: true },
        { jp: 'わからない。', ro: 'wakaranai.', why: 'Kamu tahu, kok! し + tenten = じ (ji).' },
      ]},
      { w: 'kid', e: 'happy', jp: 'すごい！せんぱい は せんせい みたい！', ro: 'sugoi! senpai wa sensei mitai!', id: 'Hebat! Senpai seperti guru!' },
    ]},
    cls: [
      { w: 'sensei', t: 'Baris さ dengan tenten menjadi ざ じ ず ぜ ぞ.' },
      { w: 'sensei', t: 'Kata ちず artinya peta. Peta harta karunmu juga ちず, lho.' },
    ],
    brk: { npc: 'hana', at: 'park', lines: [
      { n: 'Hana duduk di bangku taman, wajahnya murung.' },
      { w: 'hana', e: 'sad', jp: 'カフェ、きょう も おきゃくさん が すくない の。', ro: 'kafe, kyou mo okyakusan ga sukunai no.', id: 'Kafe hari ini juga sepi pengunjung.' },
      { w: 'hana', t: 'Ibu bilang, kalau begini terus… Ah, maaf, jadi curhat.' },
      { q: 'Hibur Hana!', o: [
        { jp: 'わたし に できる こと ある？', ro: 'watashi ni dekiru koto aru?', ok: true },
        { jp: 'しかたない ね。', ro: 'shikata nai ne.', why: 'しかたない = apa boleh buat. Hana butuh dukungan! Tanyakan apa yang bisa kamu bantu.' },
      ]},
      { w: 'hana', e: 'happy', t: 'Sungguh? Ibu memang sedang mencari orang untuk membantu di kafe sore hari… Mampir, ya!' },
    ]},
    phrases: [
      { jp: 'ちず', ro: 'chizu', id: 'Peta' },
      { jp: 'かぜ', ro: 'kaze', id: 'Angin' },
      { jp: 'ぞう', ro: 'zou', id: 'Gajah' },
      { jp: 'わたし に できる こと ある？', ro: 'watashi ni dekiru koto aru?', id: 'Ada yang bisa kubantu?' },
    ],
  },
  { // HARI 25
    title: 'Baris DA', sub: 'だ ぢ づ で ど', type: 'lesson', chapter: 3,
    kana: ['だ','ぢ','づ','で','ど'], also: ['ダ','ヂ','ヅ','デ','ド'],
    morning: { npc: 'kenta', at: 'gate', lines: [
      { n: 'Kenta membuka payung bergambar tokoh manga buatannya sendiri.' },
      { w: 'kenta', e: 'happy', jp: 'みて！デザイン したんだ！', ro: 'mite! dezain shita n da!', id: 'Lihat! Aku yang mendesain!' },
      { q: 'Puji payung Kenta!', o: [
        { jp: 'かっこいい！', ro: 'kakkoii!', ok: true },
        { jp: 'ださい。', ro: 'dasai.', why: 'ださい = norak. Kenta bangga dengan karyanya! Puji: かっこいい (keren).' },
      ]},
    ]},
    cls: [
      { w: 'sensei', e: 'happy', t: 'Kabar gembira: です yang kalian ucapkan sejak hari pertama… sekarang bisa ditulis!' },
      { w: 'sensei', t: 'ぢ dan づ jarang dipakai. Bunyinya sama dengan じ dan ず.' },
    ],
    brk: { npc: 'yuki', at: 'konbini', lines: [
      { n: 'Yuki berdiri di depan etalase kue konbini.' },
      { w: 'yuki', jp: 'デザート、どれ に しよう…', ro: 'dezaato, dore ni shiyou…', id: 'Makanan penutup, pilih yang mana ya…' },
      { q: 'Rekomendasikan sesuatu!', o: [
        { jp: 'プリン が いい よ！', ro: 'purin ga ii yo!', ok: true },
        { jp: 'ドア が いい よ！', ro: 'doa ga ii yo!', why: 'ドア = pintu! Pintu tidak bisa dimakan, hehe.' },
      ]},
      { w: 'yuki', e: 'happy', jp: 'プリン！さんせい！', ro: 'purin! sansei!', id: 'Puding! Setuju!' },
    ]},
    phrases: [
      { jp: 'まど', ro: 'mado', id: 'Jendela' },
      { jp: 'デパート', ro: 'depaato', id: 'Department store' },
      { jp: 'ドア', ro: 'doa', id: 'Pintu' },
      { jp: 'かっこいい', ro: 'kakkoii', id: 'Keren' },
    ],
  },
  { // HARI 26
    title: 'Baris BA & PA', sub: 'ば び ぶ べ ぼ · ぱ ぴ ぷ ぺ ぽ', type: 'lesson', chapter: 3,
    kana: ['ば','び','ぶ','べ','ぼ','ぱ','ぴ','ぷ','ぺ','ぽ'], also: ['バ','ビ','ブ','ベ','ボ','パ','ピ','プ','ペ','ポ'],
    intro: [
      'Baris は istimewa: satu-satunya baris dengan tiga bunyi.',
      'Dengan tenten, は menjadi ば. Dengan lingkaran kecil maru, は menjadi ぱ.',
    ],
    morning: { npc: 'hana', at: 'gate', lines: [
      { n: 'Hujan deras. Di sepanjang jalan, bunga ajisai biru bermekaran.' },
      { w: 'hana', e: 'happy', jp: 'あじさい、きれい…', ro: 'ajisai, kirei…', id: 'Ajisai, indah…' },
      { w: 'hana', t: 'Kemarin aku melihatmu di kafe. Terima kasih sudah mampir.' },
    ]},
    cls: [
      { w: 'sensei', t: 'Hari ini sepuluh huruf: ば び ぶ べ ぼ dan ぱ ぴ ぷ ぺ ぽ.' },
      { w: 'sensei', e: 'happy', t: 'Latihan telinga: は, ば, ぱ. Dengarkan bedanya baik-baik!' },
    ],
    brk: { npc: 'kenta', at: 'park', lines: [
      { n: 'Kenta mengeluarkan roti dari kantong plastik.' },
      { w: 'kenta', e: 'happy', jp: 'パン、はんぶん こ しよう！', ro: 'pan, hanbunko shiyou!', id: 'Rotinya kita bagi dua, yuk!' },
      { q: 'Terima dengan sopan!', o: [
        { jp: 'いただきます！', ro: 'itadakimasu!', ok: true },
        { jp: 'ごちそうさま！', ro: 'gochisousama!', why: 'ごちそうさま diucapkan SETELAH makan. Sebelum makan: いただきます.' },
      ]},
      { n: 'パン = roti. Kata ini berasal dari bahasa Portugis "pão", sama seperti "pan" di beberapa daerah!' },
    ]},
    phrases: [
      { jp: 'かばん', ro: 'kaban', id: 'Tas' },
      { jp: 'えんぴつ', ro: 'enpitsu', id: 'Pensil' },
      { jp: 'パン', ro: 'pan', id: 'Roti' },
      { jp: 'はんぶん こ', ro: 'hanbunko', id: 'Dibagi dua' },
    ],
  },
  { // HARI 27
    title: 'Kanji Pertama', sub: '一 二 三 四 五', type: 'lesson', chapter: 3,
    kana: ['一','二','三','四','五'],
    intro: [
      'Selamat! Hari ini kamu belajar kanji untuk pertama kalinya.',
      'Kanji adalah huruf bergambar dari Tiongkok. Satu kanji punya arti dan bisa punya beberapa cara baca.',
      'Kita mulai dari angka: 一 itu satu garis, 二 dua garis, 三 tiga garis. Gampang, kan?',
    ],
    morning: { npc: 'yuki', at: 'gate', lines: [
      { n: 'Yuki menghitung genangan air di halaman sekolah.' },
      { w: 'yuki', e: 'happy', jp: 'いち、に、さん… みずたまり だらけ！', ro: 'ichi, ni, san… mizutamari darake!', id: 'Satu, dua, tiga… genangan di mana-mana!' },
      { q: 'Lanjutkan hitungan Yuki: いち、に、さん、…', o: [
        { jp: 'し/よん', ro: 'shi / yon', ok: true },
        { jp: 'ご', ro: 'go', why: 'Setelah さん (3) adalah し atau よん (4). ご itu 5.' },
      ]},
    ]},
    cls: [
      { w: 'sensei', e: 'happy', jp: 'きょう は かんじ です！', ro: 'kyou wa kanji desu!', id: 'Hari ini kanji!' },
      { w: 'sensei', t: 'Angka 4 dan 9 punya dua bacaan. し dan く sering dihindari karena bunyinya mirip kata "mati" dan "sakit".' },
    ],
    brk: { npc: 'mai', at: 'park', lines: [
      { n: 'Mai berjongkok di pagar taman, menghitung sesuatu.' },
      { w: 'mai', e: 'happy', jp: 'いち、に、さん… かたつむり！', ro: 'ichi, ni, san… katatsumuri!', id: 'Satu, dua, tiga… siput!' },
      { q: 'Ada tiga siput. Tulis angkanya dengan kanji!', o: [
        { jp: '三', ro: 'san', ok: true },
        { jp: '二', ro: 'ni', why: '二 = dua (dua garis). Tiga garis = 三.' },
      ]},
      { w: 'mai', e: 'happy', jp: 'せんぱい、すごーい！', ro: 'senpai, sugooi!', id: 'Senpai hebaaat!' },
    ]},
    phrases: [
      { jp: 'いち・に・さん・し・ご', ro: 'ichi, ni, san, shi, go', id: '1, 2, 3, 4, 5' },
      { jp: 'かんじ', ro: 'kanji', id: 'Huruf kanji' },
      { jp: 'かたつむり', ro: 'katatsumuri', id: 'Siput' },
      { jp: 'なんばん？', ro: 'nanban?', id: 'Nomor berapa?' },
    ],
  },
  { // HARI 28
    title: 'Ulangan 3', sub: 'Tenten & maru', type: 'test', count: 15, chapter: 3, pool: 'daku',
    morning: { npc: 'yuki', at: 'gate', lines: [
      { w: 'yuki', e: 'sad', jp: 'が と か、まちがえ そう…', ro: 'ga to ka, machigae sou…', id: 'Aku takut tertukar が dan か…' },
      { q: 'Beri Yuki tips!', o: [
        { jp: 'てんてん を よく みて！', ro: 'tenten o yoku mite!', ok: true },
        { jp: 'しらない。', ro: 'shiranai.', why: 'Bantu Yuki: perhatikan tentennya! てんてん を よく みて.' },
      ]},
      { w: 'yuki', e: 'happy', jp: 'よし、がんばる！', ro: 'yoshi, ganbaru!', id: 'Oke, aku akan berjuang!' },
    ]},
    cls: [
      { w: 'sensei', jp: 'きょう は テスト です。', ro: 'kyou wa tesuto desu.', id: 'Hari ini ulangan.' },
      { w: 'sensei', t: 'Tenang saja. Perhatikan tanda kecil di kanan atas setiap huruf.' },
    ],
    brk: { npc: 'kenta', with: 'yuki', at: 'gate', lines: [
      { w: 'kenta', e: 'happy', jp: 'おわった ー！', ro: 'owatta-!', id: 'Selesaaai!' },
      { w: 'yuki', e: 'happy', t: 'Aku tidak tertukar sekali pun! Tips darimu berhasil!' },
    ]},
    phrases: [
      { jp: 'テスト', ro: 'tesuto', id: 'Ulangan / tes' },
      { jp: 'まちがえる', ro: 'machigaeru', id: 'Salah / tertukar' },
      { jp: 'よく みて', ro: 'yoku mite', id: 'Lihat baik-baik' },
    ],
  },
  { // HARI 29
    title: 'Angka 6–10', sub: '六 七 八 九 十', type: 'lesson', chapter: 3,
    kana: ['六','七','八','九','十'],
    morning: { npc: 'hana', at: 'home_front', lines: [
      { n: 'Akhir pekan. Hana mampir membawa kue dari kafe.' },
      { w: 'hana', e: 'happy', jp: 'きょう は うみ に いく の？いい な！', ro: 'kyou wa umi ni iku no? ii na!', id: 'Hari ini ke pantai? Asyik!' },
      { w: 'hana', t: 'Nenek Sato bilang kalian akan naik kereta sore nanti. Hati-hati, ya!' },
    ]},
    cls: [
      { w: 'sensei', t: 'Kelas akhir pekan singkat saja. Angka 6 sampai 10!' },
      { w: 'sensei', t: '七 dibaca なな atau しち. 九 dibaca きゅう atau く. 十 = sepuluh, bentuknya tanda tambah.' },
    ],
    brk: { npc: 'yuki', at: 'park', lines: [
      { w: 'yuki', e: 'happy', jp: 'じゅう まで かぞえられる？', ro: 'juu made kazoerareru?', id: 'Bisa menghitung sampai sepuluh?' },
      { q: 'Angka 8 dalam bahasa Jepang…', o: [
        { jp: 'はち', ro: 'hachi', ok: true },
        { jp: 'なな', ro: 'nana', why: 'なな = 7. Delapan = はち (八).' },
      ]},
      { w: 'yuki', e: 'happy', t: 'Sempurna! Selamat jalan-jalan ke pantai!' },
    ]},
    phrases: [
      { jp: 'ろく・なな・はち・きゅう・じゅう', ro: 'roku, nana, hachi, kyuu, juu', id: '6, 7, 8, 9, 10' },
      { jp: 'うみ', ro: 'umi', id: 'Laut / pantai' },
      { jp: 'かぞえる', ro: 'kazoeru', id: 'Menghitung' },
    ],
  },
  { // HARI 30
    title: 'Seratus Yen', sub: '百 円', type: 'lesson', chapter: 3,
    kana: ['百','円'],
    intro: ['Hari ini kita belajar uang! 百 artinya seratus, 円 artinya yen.', 'Bunyi berubah di tiga angka: さんびゃく (300), ろっぴゃく (600), はっぴゃく (800).'],
    morning: { npc: 'kenta', at: 'gate', lines: [
      { w: 'kenta', e: 'happy', jp: 'うみ、どう だった？', ro: 'umi, dou datta?', id: 'Pantainya bagaimana?' },
      { q: 'Jawab Kenta!', o: [
        { jp: 'たのしかった！', ro: 'tanoshikatta!', ok: true },
        { jp: 'いただきます！', ro: 'itadakimasu!', why: 'Itu ucapan sebelum makan. Pantainya menyenangkan: たのしかった!' },
      ]},
    ]},
    cls: [
      { w: 'sensei', jp: 'これ は いくら です か？', ro: 'kore wa ikura desu ka?', id: 'Ini berapa harganya?' },
      { w: 'sensei', t: 'Di toko Jepang, harga ditulis dengan angka atau kanji: 百円 = 100 yen.' },
    ],
    brk: { npc: 'tenin', at: 'konbini', lines: [
      { w: 'tenin', e: 'happy', jp: 'いらっしゃいませ！', ro: 'irasshaimase!', id: 'Selamat datang!' },
      { q: 'Tanyakan harga onigiri!', o: [
        { jp: 'これ は いくら です か？', ro: 'kore wa ikura desu ka?', ok: true },
        { jp: 'これ は なん です か？', ro: 'kore wa nan desu ka?', why: 'なん = apa. Untuk harga: いくら (berapa).' },
      ]},
      { w: 'tenin', jp: 'ひゃくにじゅう えん です。', ro: 'hyaku nijuu en desu.', id: '120 yen.' },
      { n: 'Label harga: 百二十円. 百 (100) + 二十 (20) = 120.' },
    ]},
    phrases: [
      { jp: 'いくら です か', ro: 'ikura desu ka', id: 'Berapa harganya?' },
      { jp: '百円', ro: 'hyaku en', id: '100 yen' },
      { jp: 'これ を ください', ro: 'kore o kudasai', id: 'Saya minta ini' },
    ],
  },
  { // HARI 31
    title: 'Seribu & Sepuluh Ribu', sub: '千 万', type: 'lesson', chapter: 3,
    kana: ['千','万'],
    intro: ['Angka besar! 千 = seribu, 万 = sepuluh ribu.', 'Di Jepang, angka besar dihitung per sepuluh ribu. 10.000 dibaca いちまん, bukan "sepuluh seribu".'],
    morning: { npc: 'yuki', at: 'gate', lines: [
      { n: 'Hujan lagi. Yuki memandangi langit kelabu.' },
      { w: 'yuki', e: 'sad', jp: 'あめ、ずっと ふって いる ね…', ro: 'ame, zutto futte iru ne…', id: 'Hujannya turun terus, ya…' },
      { q: 'Semangati Yuki!', o: [
        { jp: 'でも、あじさい が きれい だよ。', ro: 'demo, ajisai ga kirei da yo.', ok: true },
        { jp: 'つまらない ね。', ro: 'tsumaranai ne.', why: 'つまらない = membosankan. Coba lihat sisi indahnya: ajisai!' },
      ]},
    ]},
    cls: [
      { w: 'sensei', t: '千 dengan bunyi berubah: さんぜん (3000), はっせん (8000).' },
      { w: 'sensei', e: 'happy', t: 'Uang kertas Jepang: 千円, 五千円, 一万円. Kalian sekarang bisa membaca semuanya!' },
    ],
    brk: { npc: 'kid', at: 'park', lines: [
      { w: 'kid', jp: 'せんぱい、この まんが、いくら？', ro: 'senpai, kono manga, ikura?', id: 'Senpai, komik ini berapa?' },
      { n: 'Label harga di komik Sora: 五百円.' },
      { q: 'Bacakan harganya untuk Sora!', o: [
        { jp: 'ごひゃく えん', ro: 'gohyaku en', ok: true },
        { jp: 'ごせん えん', ro: 'gosen en', why: '百 = ratus (ひゃく). 千 = ribu (せん). 五百円 = ごひゃく えん (500).' },
      ]},
      { w: 'kid', e: 'happy', t: 'Uang jajanku cukup! Makasih, senpai!' },
    ]},
    phrases: [
      { jp: '千円', ro: 'sen en', id: '1000 yen' },
      { jp: '一万円', ro: 'ichiman en', id: '10.000 yen' },
      { jp: 'たかい / やすい', ro: 'takai / yasui', id: 'Mahal / murah' },
    ],
  },
  { // HARI 32
    title: 'Kuis Harga', sub: 'Angka & kanji', type: 'test', count: 12, chapter: 3, pool: 'num',
    morning: { npc: 'hana', at: 'gate', lines: [
      { w: 'hana', e: 'happy', t: 'Kamu dengar? Warga mau mengadakan Pasar Pagi hari Minggu nanti!' },
      { w: 'hana', jp: 'カフェ も おみせ を だす かも！', ro: 'kafe mo omise o dasu kamo!', id: 'Kafe mungkin ikut buka lapak!' },
    ]},
    cls: [
      { w: 'sensei', t: 'Kuis singkat: angka dan kanji. Bayangkan kalian sedang berbelanja!' },
    ],
    brk: { npc: 'hana', with: 'kenta', at: 'park', lines: [
      { w: 'kenta', e: 'happy', t: 'Aku akan menggambar poster Pasar Pagi!' },
      { w: 'hana', e: 'happy', jp: 'わたし は ケーキ を やきます！', ro: 'watashi wa keeki o yakimasu!', id: 'Aku akan memanggang kue!' },
      { q: 'Apa yang akan kamu lakukan?', o: [
        { jp: 'レジ を てつだう よ！', ro: 'reji o tetsudau yo!', ok: true },
        { jp: 'ねる。', ro: 'neru.', why: 'Tidur? Ayo ikut membantu! レジ = kasir.' },
      ]},
    ]},
    phrases: [
      { jp: 'いちば', ro: 'ichiba', id: 'Pasar' },
      { jp: 'レジ', ro: 'reji', id: 'Kasir' },
      { jp: 'おつり', ro: 'otsuri', id: 'Uang kembalian' },
    ],
  },
  { // HARI 33
    title: 'Persiapan Pasar', sub: 'Ulasan besar Bab 3', type: 'test', count: 15, chapter: 3, pool: 'ch3',
    morning: { npc: 'kenta', at: 'home_front', lines: [
      { n: 'Kenta berlari sambil membawa gulungan poster.' },
      { w: 'kenta', e: 'happy', jp: 'ポスター、どう？', ro: 'posutaa, dou?', id: 'Posternya bagaimana?' },
      { q: 'Beri komentar!', o: [
        { jp: 'すごく いい！', ro: 'sugoku ii!', ok: true },
        { jp: 'ふつう。', ro: 'futsuu.', why: 'ふつう = biasa saja. Kenta sudah berusaha keras! Puji dia: すごく いい!' },
      ]},
      { n: 'Poster: 「さくらまち あさいち　にちようび　あさ 七じ から」' },
    ]},
    cls: [
      { w: 'sensei', e: 'happy', t: 'Ulasan besar sebelum ujian. Tenten, maru, dan angka semuanya keluar!' },
    ],
    brk: { npc: 'yuki', at: 'konbini', lines: [
      { w: 'yuki', e: 'happy', t: 'Ayo bagikan selebaran! Aku di sebelah kiri, kamu di kanan.' },
      { w: 'yuki', jp: 'いちば に きて ください！', ro: 'ichiba ni kite kudasai!', id: 'Silakan datang ke pasar!' },
      { q: 'Bagikan selebaran ke pejalan kaki!', o: [
        { jp: 'どうぞ！あさいち です！', ro: 'douzo! asaichi desu!', ok: true },
        { jp: 'いりません。', ro: 'irimasen.', why: 'いりません = tidak perlu. Kamu yang menawarkan: どうぞ!' },
      ]},
    ]},
    phrases: [
      { jp: 'あさいち', ro: 'asaichi', id: 'Pasar pagi' },
      { jp: 'ポスター', ro: 'posutaa', id: 'Poster' },
      { jp: 'きて ください', ro: 'kite kudasai', id: 'Silakan datang' },
    ],
  },
  { // HARI 34
    title: 'Pasar Pagi', sub: 'Ujian Bab 3 & あさいち', type: 'test', count: 20, chapter: 3, pool: 'ch3',
    morning: { npc: 'hana', with: 'yuki', at: 'gate', lines: [
      { w: 'hana', e: 'happy', jp: 'きょう は あさいち！でも その まえ に しけん…', ro: 'kyou wa asaichi! demo sono mae ni shiken…', id: 'Hari ini pasar pagi! Tapi sebelumnya ujian…' },
      { w: 'yuki', e: 'happy', t: 'Setelah ujian, langsung ke taman, ya!' },
      { q: 'Semangati mereka!', o: [
        { jp: 'よし、がんばろう！', ro: 'yoshi, ganbarou!', ok: true },
        { jp: 'いいえ。', ro: 'iie.', why: 'いいえ = tidak. Ayo semangat bersama!' },
      ]},
    ]},
    cls: [
      { w: 'sensei', jp: 'だい さん しょう の しけん です。', ro: 'dai san shou no shiken desu.', id: 'Ujian Bab 3.' },
      { w: 'sensei', e: 'happy', t: 'Setelah ini, sensei juga mau belanja di pasar pagi!' },
    ],
    brk: { npc: 'mama', with: 'hana', at: 'park', lines: [
      { n: 'Taman penuh lapak! Ada sayur Pak Petani, ubi bakar, dan lapak Kafe Hanamizuki dengan papan menu baru.' },
      { w: 'mama', e: 'happy', jp: 'いらっしゃいませ！カフェ ハナミズキ です！', ro: 'irasshaimase! kafe hanamizuki desu!', id: 'Selamat datang! Kafe Hanamizuki!' },
      { w: 'hana', e: 'happy', t: 'Kamu jaga kasir, ya! Aku melayani pesanan.' },
    ]},
    phrases: [
      { jp: 'しけん', ro: 'shiken', id: 'Ujian' },
      { jp: 'おつり は 〜えん です', ro: 'otsuri wa ~en desu', id: 'Kembaliannya ... yen' },
      { jp: 'ありがとう ございました', ro: 'arigatou gozaimashita', id: 'Terima kasih banyak (setelah transaksi)' },
    ],
  },
);

/* ---------- Pencapaian Bab 3 (ACHIEVEMENTS dimuat setelah file ini) ---------- */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof ACHIEVEMENTS === 'undefined') return;
  const flag = f => s => !!(s.story && s.story.flags && s.story.flags[f]);
  ACHIEVEMENTS.push(
    { id: 'daku50', icon: '゛', title: 'Ahli Tenten', desc: 'Pelajari 50 huruf ber-tenten & maru.', pts: 40, test: s => s.kana.filter(POOL_FILTER.daku).length >= 50 },
    { id: 'kanji1', icon: '一', title: 'Kanji Pertama', desc: 'Pelajari kanji pertamamu.', pts: 20, test: s => s.kana.some(IS_KANJI) },
    { id: 'kanji14', icon: '万', title: 'Raja Angka', desc: 'Pelajari 14 kanji angka.', pts: 40, test: s => s.kana.filter(IS_KANJI).length >= 14 },
    { id: 'baito5', icon: '円', title: 'Kasir Andal', desc: 'Kerja paruh waktu di kafe 5 kali.', pts: 30, test: s => !!(s.story && s.story.baito && s.story.baito.cafe >= 5) },
    { id: 'asaichi', icon: '市', title: 'Pasar Pagi', desc: 'Sukseskan Pasar Pagi Sakura-machi.', pts: 30, test: flag('market_done') },
    { id: 'ch3', icon: '雨', title: 'Lulus Bab 3', desc: 'Selesaikan Bab Suara Baru & Angka.', pts: 60, test: s => s.day > 34 },
    { id: 'letter1', icon: '✉', title: 'Surat Pertama', desc: 'Baca surat pertama dari loteng.', pts: 20, test: flag('letter1_read') },
    { id: 'mapper', icon: '×', title: 'Pemburu Harta', desc: 'Temukan 4 halaman buku bergambar.', pts: 30, test: s => !!(s.story && s.story.pages && s.story.pages.length >= 4) },
  );
});
