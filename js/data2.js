/* =========================================================
   DATA BAGIAN 2
   - Bab 2: Katakana (11 hari)
   - Kehidupan sehari-hari: sarapan, makan siang, klub, makan malam
   - Misi sampingan, event persahabatan, toko aksesori
   ========================================================= */

/* ---------- Katakana ---------- */
Object.assign(KANA, {
  'ア': { ro: 'a',   tip: 'Seperti kapak (axe) yang miring: "A".' },
  'イ': { ro: 'i',   tip: 'Seperti orang bersandar ke tiang: "I".' },
  'ウ': { ro: 'u',   tip: 'Mirip う versi bersudut, dengan titik di atas: "U".' },
  'エ': { ro: 'e',   tip: 'Seperti balok besi (I-beam) untuk bangunan: "E".' },
  'オ': { ro: 'o',   tip: 'Seperti orang berolahraga dengan tangan terbuka: "O".' },
  'カ': { ro: 'ka',  tip: 'Mirip か hiragana tanpa titik: "KA".' },
  'キ': { ro: 'ki',  tip: 'Mirip き versi lurus, seperti anak kunci: "KI".' },
  'ク': { ro: 'ku',  tip: 'Seperti paruh burung dilihat dari samping: "KU".' },
  'ケ': { ro: 'ke',  tip: 'Seperti huruf "K" yang miring: "KE".' },
  'コ': { ro: 'ko',  tip: 'Seperti sudut kotak yang terbuka: "KO".' },
  'サ': { ro: 'sa',  tip: 'Seperti rak dengan dua tiang, mirip さ: "SA".' },
  'シ': { ro: 'shi', tip: 'Dua titik di kiri, goresan panjang NAIK dari bawah: "SHI". Beda dengan ツ!' },
  'ス': { ro: 'su',  tip: 'Seperti orang berseluncur dengan kaki terbuka: "SU".' },
  'セ': { ro: 'se',  tip: 'Mirip せ hiragana: "SE".' },
  'ソ': { ro: 'so',  tip: 'Dua goresan, yang panjang TURUN dari atas: "SO". Beda dengan ン!' },
  'タ': { ro: 'ta',  tip: 'Seperti ク dengan garis tambahan di tengah: "TA".' },
  'チ': { ro: 'chi', tip: 'Mirip angka 千 (seribu) versi miring: "CHI".' },
  'ツ': { ro: 'tsu', tip: 'Dua titik di atas, goresan panjang TURUN dari atas: "TSU". Beda dengan シ!' },
  'テ': { ro: 'te',  tip: 'Seperti tiang telepon dengan kabel: "TE".' },
  'ト': { ro: 'to',  tip: 'Seperti tongkat dengan cabang kecil: "TO".' },
  'ナ': { ro: 'na',  tip: 'Seperti tanda tambah yang miring: "NA".' },
  'ニ': { ro: 'ni',  tip: 'Dua garis, sama seperti angka 二 (dua = "ni")!' },
  'ヌ': { ro: 'nu',  tip: 'Seperti sumpit yang menjepit mi (noodle): "NU".' },
  'ネ': { ro: 'ne',  tip: 'Seperti nenek berdiri dengan tongkat: "NE".' },
  'ノ': { ro: 'no',  tip: 'Satu goresan miring, seperti menulis "NO" terburu-buru.' },
  'ハ': { ro: 'ha',  tip: 'Dua garis seperti atap terbuka, orang tertawa "HAha": "HA".' },
  'ヒ': { ro: 'hi',  tip: 'Seperti orang duduk bersandar sambil terkekeh "HIhi".' },
  'フ': { ro: 'fu',  tip: 'Seperti bendera kecil yang tertiup angin "FUuu".' },
  'ヘ': { ro: 'he',  tip: 'Sama persis dengan へ hiragana: "HE".' },
  'ホ': { ro: 'ho',  tip: 'Seperti salib dengan dua kaki kecil, mirip ほ: "HO".' },
  'マ': { ro: 'ma',  tip: 'Seperti kepala maskot dengan dagu runcing: "MA".' },
  'ミ': { ro: 'mi',  tip: 'Tiga garis miring, seperti angka 3 (mittsu): "MI".' },
  'ム': { ro: 'mu',  tip: 'Seperti lengan berotot (muscle): "MU".' },
  'メ': { ro: 'me',  tip: 'Seperti tanda silang ✕, tutup mata (me): "ME".' },
  'モ': { ro: 'mo',  tip: 'Mirip も hiragana tanpa lengkungan: "MO".' },
  'ヤ': { ro: 'ya',  tip: 'Mirip や hiragana: "YA".' },
  'ユ': { ro: 'yu',  tip: 'Seperti kursi atau gagang pintu: "YU".' },
  'ヨ': { ro: 'yo',  tip: 'Seperti huruf E yang dibalik: "YO".' },
  'ラ': { ro: 'ra',  tip: 'Garis pendek di atas + フ: "RA".' },
  'リ': { ro: 'ri',  tip: 'Mirip り hiragana versi lurus: "RI".' },
  'ル': { ro: 'ru',  tip: 'Seperti dua kaki, satu menendang ke kanan: "RU".' },
  'レ': { ro: 're',  tip: 'Seperti huruf "L" yang miring: "RE".' },
  'ロ': { ro: 'ro',  tip: 'Kotak seperti mulut. Jangan tertukar dengan ろ hiragana: "RO".' },
  'ワ': { ro: 'wa',  tip: 'Seperti ウ tanpa titik di atas: "WA".' },
  'ヲ': { ro: 'wo',  tip: 'Seperti ワ dengan garis tambahan. Jarang sekali dipakai: "WO".' },
  'ン': { ro: 'n',   tip: 'Dua goresan, yang panjang NAIK dari bawah: "N". Beda dengan ソ!' },
});

const KATAKANA_GRID = [
  ['ア','イ','ウ','エ','オ'], ['カ','キ','ク','ケ','コ'], ['サ','シ','ス','セ','ソ'], ['タ','チ','ツ','テ','ト'],
  ['ナ','ニ','ヌ','ネ','ノ'], ['ハ','ヒ','フ','ヘ','ホ'], ['マ','ミ','ム','メ','モ'], ['ヤ','','ユ','','ヨ'],
  ['ラ','リ','ル','レ','ロ'], ['ワ','','','','ヲ'], ['ン','','','',''],
];
const IS_KATA = c => c >= '゠' && c <= 'ヿ' && c !== 'ー';
// Tanda "ー" (bunyi panjang) selalu dianggap sudah dikenal
const knownChar = (c, set) => c === 'ー' || c === ' ' || set.has(c);

WORDS.push(
  { jp: 'アイス', ro: 'aisu', id: 'es krim' },
  { jp: 'ケーキ', ro: 'keeki', id: 'kue' },
  { jp: 'ココア', ro: 'kokoa', id: 'cokelat panas' },
  { jp: 'カメラ', ro: 'kamera', id: 'kamera' },
  { jp: 'スキー', ro: 'sukii', id: 'ski' },
  { jp: 'セーター', ro: 'seetaa', id: 'sweter' },
  { jp: 'スカート', ro: 'sukaato', id: 'rok' },
  { jp: 'コート', ro: 'kooto', id: 'mantel' },
  { jp: 'テニス', ro: 'tenisu', id: 'tenis' },
  { jp: 'トイレ', ro: 'toire', id: 'toilet' },
  { jp: 'タクシー', ro: 'takushii', id: 'taksi' },
  { jp: 'チキン', ro: 'chikin', id: 'ayam goreng' },
  { jp: 'ノート', ro: 'nooto', id: 'buku tulis' },
  { jp: 'ネクタイ', ro: 'nekutai', id: 'dasi' },
  { jp: 'ナイフ', ro: 'naifu', id: 'pisau' },
  { jp: 'ホテル', ro: 'hoteru', id: 'hotel' },
  { jp: 'ハム', ro: 'hamu', id: 'daging ham' },
  { jp: 'ヒーロー', ro: 'hiiroo', id: 'pahlawan' },
  { jp: 'ハンカチ', ro: 'hankachi', id: 'saputangan' },
  { jp: 'メロン', ro: 'meron', id: 'melon' },
  { jp: 'ミルク', ro: 'miruku', id: 'susu' },
  { jp: 'メモ', ro: 'memo', id: 'catatan' },
  { jp: 'アニメ', ro: 'anime', id: 'anime' },
  { jp: 'マスク', ro: 'masuku', id: 'masker' },
  { jp: 'ラーメン', ro: 'raamen', id: 'ramen' },
  { jp: 'レモン', ro: 'remon', id: 'lemon' },
  { jp: 'ヨーヨー', ro: 'yooyoo', id: 'yoyo' },
  { jp: 'カレー', ro: 'karee', id: 'kari' },
  { jp: 'コーラ', ro: 'koora', id: 'cola' },
  { jp: 'レストラン', ro: 'resutoran', id: 'restoran' },
  { jp: 'アメリカ', ro: 'amerika', id: 'Amerika' },
  { jp: 'ワイン', ro: 'wain', id: 'anggur (minuman)' },
  { jp: 'ナース', ro: 'naasu', id: 'perawat' },
);

/* ---------- Bab ---------- */
const CHAPTERS = [
  { n: 1, title: 'Hiragana', from: 1, to: 11, grid: 'hira' },
  { n: 2, title: 'Katakana', from: 12, to: 22, grid: 'kata' },
];

/* ---------- Bab 2: Katakana ---------- */
DAYS.push(
  { // HARI 12
    title: 'Dunia Katakana', sub: 'ア イ ウ エ オ', type: 'lesson', chapter: 2,
    kana: ['ア','イ','ウ','エ','オ'],
    morning: { npc: 'hana', at: 'gate', lines: [
      { n: 'Semester baru! Di gerbang, seorang siswi berkuncir menunggu sambil membawa papan catatan.' },
      { w: 'hana', e: 'happy', jp: 'はじめまして！はな です。クラスの いいんちょう です。', ro: 'hajimemashite! Hana desu. kurasu no iinchou desu.', id: 'Senang berkenalan! Aku Hana, ketua kelas.' },
      { w: 'hana', t: 'Mulai hari ini kelas kita belajar katakana. Aku ditugasi membantumu!' },
      { q: 'Balas perkenalan Hana dengan sopan!', o: [
        { jp: 'はじめまして。よろしく おねがいします。', ro: 'hajimemashite. yoroshiku onegaishimasu.', ok: true },
        { jp: 'おやすみなさい。', ro: 'oyasuminasai.', why: 'おやすみなさい = selamat tidur. Ini pertemuan pertama kalian: はじめまして!' },
      ]},
      { w: 'hana', e: 'happy', jp: 'こちらこそ！', ro: 'kochira koso!', id: 'Sama-sama, mohon bantuannya juga!' },
    ]},
    cls: [
      { w: 'sensei', e: 'happy', t: 'Selamat datang di Bab 2! Katakana dipakai untuk kata serapan, nama negara, dan nama merek.' },
      { w: 'sensei', t: 'Contohnya アイス (aisu) = es krim, dari kata "ice". Garis ー artinya bunyi sebelumnya dipanjangkan.' },
      { w: 'sensei', t: 'Hari ini: ア イ ウ エ オ. Bentuk katakana lebih tegas dan bersudut dibanding hiragana.' },
    ],
    brk: { npc: 'tenin', at: 'konbini', lines: [
      { n: 'Konbini akhirnya buka lagi! Pak Kasir melambai dari pintu.' },
      { w: 'tenin', e: 'happy', jp: 'いらっしゃいませ！きょう から オープン です！', ro: 'irasshaimase! kyou kara oopun desu!', id: 'Selamat datang! Mulai hari ini kami buka!' },
      { w: 'tenin', t: 'オープン (oopun) dari kata "open". Lihat? Katakana ada di mana-mana!' },
      { n: 'Kamu membeli sebuah es krim.' },
      { w: 'tenin', jp: 'ふくろ は いりますか？', ro: 'fukuro wa irimasu ka?', id: 'Perlu kantong plastik?' },
      { q: 'Jawab Pak Kasir!', o: [
        { jp: 'いいえ、だいじょうぶ です。', ro: 'iie, daijoubu desu.', ok: true },
        { jp: 'はい、おねがいします。', ro: 'hai, onegaishimasu.', ok: true },
      ]},
      { w: 'tenin', e: 'happy', jp: 'ありがとう ございました！', ro: 'arigatou gozaimashita!', id: 'Terima kasih banyak!' },
    ]},
    phrases: [
      { jp: 'カタカナ', ro: 'katakana', id: 'Huruf untuk kata serapan' },
      { jp: 'アイス', ro: 'aisu', id: 'Es krim' },
      { jp: 'ふくろ は いりますか', ro: 'fukuro wa irimasu ka', id: 'Perlu kantong?' },
      { jp: 'こちらこそ', ro: 'kochira koso', id: 'Sama-sama / saya juga' },
    ],
  },
  { // HARI 13
    title: 'Baris KA', sub: 'カ キ ク ケ コ', type: 'lesson', chapter: 2,
    kana: ['カ','キ','ク','ケ','コ'],
    morning: { npc: 'kenta', at: 'home_front', lines: [
      { w: 'kenta', e: 'happy', jp: 'おはよう！しゅうまつ、なに する？', ro: 'ohayou! shuumatsu, nani suru?', id: 'Pagi! Akhir pekan mau ngapain?' },
      { q: 'Ceritakan rencanamu!', o: [
        { jp: 'テニス を する！', ro: 'tenisu o suru!', ok: true },
        { jp: 'カラオケ に いく！', ro: 'karaoke ni iku!', ok: true },
        { jp: 'いえ で ねる…', ro: 'ie de neru…', ok: true },
      ]},
      { w: 'kenta', e: 'happy', t: 'Seru juga! Eh, テニス dan カラオケ itu katakana juga, lho.' },
    ]},
    cls: [
      { w: 'sensei', t: 'Baris KA: カ キ ク ケ コ. カ mirip か tanpa titik, キ mirip き.' },
      { w: 'sensei', t: 'Kata hari ini: ケーキ (kue) dan ココア (cokelat panas).' },
    ],
    brk: { npc: 'hana', at: 'park', lines: [
      { w: 'hana', e: 'happy', jp: 'ケーキ、たべる？わたし が つくったの。', ro: 'keeki, taberu? watashi ga tsukutta no.', id: 'Mau kue? Aku yang buat.' },
      { q: 'Jawab tawaran Hana!', o: [
        { jp: 'たべたい！', ro: 'tabetai!', ok: true },
        { jp: 'いりません。', ro: 'irimasen.', why: 'いりません = tidak perlu. Hana sudah repot-repot membuatnya!' },
      ]},
      { n: 'Kamu mencicipi kue buatan Hana.' },
      { q: 'Bagaimana rasanya?', o: [
        { jp: 'あまくて おいしい！', ro: 'amakute oishii!', ok: true },
        { jp: 'からい！', ro: 'karai!', why: 'からい = pedas. Kue kan manis: あまい (amai)!' },
      ]},
      { w: 'hana', e: 'happy', jp: 'よかった！', ro: 'yokatta!', id: 'Syukurlah!' },
    ]},
    phrases: [
      { jp: 'しゅうまつ', ro: 'shuumatsu', id: 'Akhir pekan' },
      { jp: '〜を する', ro: '~o suru', id: 'Melakukan …' },
      { jp: '〜たい', ro: '~tai', id: 'Ingin … (tabetai = ingin makan)' },
      { jp: 'あまい / からい', ro: 'amai / karai', id: 'Manis / pedas' },
    ],
  },
  { // HARI 14
    title: 'Baris SA', sub: 'サ シ ス セ ソ', type: 'lesson', chapter: 2,
    kana: ['サ','シ','ス','セ','ソ'],
    morning: { npc: 'yuki', at: 'gate', lines: [
      { w: 'yuki', e: 'happy', jp: 'みて！あたらしい セーター！', ro: 'mite! atarashii seetaa!', id: 'Lihat! Sweter baru!' },
      { q: 'Puji sweter Yuki!', o: [
        { jp: 'かわいい！', ro: 'kawaii!', ok: true },
        { jp: 'ふるい ね。', ro: 'furui ne.', why: 'ふるい = tua / usang. Yuki bilang sweternya あたらしい (baru)!' },
      ]},
      { w: 'yuki', e: 'happy', jp: 'えへへ、ありがとう！', ro: 'ehehe, arigatou!', id: 'Hehe, makasih!' },
    ]},
    cls: [
      { w: 'sensei', t: 'Baris SA: サ シ ス セ ソ. Hati-hati, シ (shi) dan ツ (tsu) sering tertukar!' },
      { w: 'sensei', t: 'シ: goresan panjang NAIK dari bawah. ツ: goresan panjang TURUN dari atas.' },
    ],
    brk: { npc: 'kenta', at: 'river', lines: [
      { w: 'kenta', jp: 'スポーツ は なに が すき？', ro: 'supootsu wa nani ga suki?', id: 'Olahraga apa yang kamu suka?' },
      { q: 'Pilih olahraga favoritmu!', o: [
        { jp: 'サッカー！', ro: 'sakkaa!', ok: true },
        { jp: 'スキー！', ro: 'sukii!', ok: true },
        { jp: 'バドミントン！', ro: 'badominton!', ok: true },
      ]},
      { w: 'kenta', e: 'happy', jp: 'いいね！こんど いっしょに やろう！', ro: 'ii ne! kondo issho ni yarou!', id: 'Asyik! Lain kali main bareng, yuk!' },
    ]},
    phrases: [
      { jp: 'あたらしい / ふるい', ro: 'atarashii / furui', id: 'Baru / lama' },
      { jp: 'かわいい', ro: 'kawaii', id: 'Lucu / imut' },
      { jp: 'スポーツ', ro: 'supootsu', id: 'Olahraga' },
      { jp: 'こんど', ro: 'kondo', id: 'Lain kali' },
    ],
  },
  { // HARI 15
    title: 'Baris TA', sub: 'タ チ ツ テ ト', type: 'lesson', chapter: 2,
    kana: ['タ','チ','ツ','テ','ト'],
    morning: { npc: 'hana', at: 'home_front', lines: [
      { w: 'hana', jp: 'あした は テスト だよ。べんきょう した？', ro: 'ashita wa tesuto da yo. benkyou shita?', id: 'Besok ulangan, lho. Sudah belajar?' },
      { q: 'Jawab jujur!', o: [
        { jp: 'うん、した！', ro: 'un, shita!', ok: true },
        { jp: 'まだ…', ro: 'mada…', ok: true },
      ]},
      { w: 'hana', e: 'happy', t: 'Kalau begitu, nanti belajar bareng di perpustakaan saat makan siang, ya!' },
    ]},
    cls: [
      { w: 'sensei', t: 'Baris TA: タ チ ツ テ ト.' },
      { w: 'sensei', t: 'Kata hari ini: テニス, トイレ, タクシー. Semuanya kata serapan!' },
    ],
    brk: { npc: 'yuki', with: 'tenin', at: 'konbini', lines: [
      { w: 'yuki', t: 'Kalimat paling penting saat bepergian: menanyakan letak toilet! Coba tanyakan ke Pak Kasir.' },
      { q: 'Tanyakan letak toilet dengan sopan!', o: [
        { jp: 'すみません、トイレ は どこ ですか？', ro: 'sumimasen, toire wa doko desu ka?', ok: true },
        { jp: 'トイレ、ください。', ro: 'toire, kudasai.', why: 'ください = minta (barang). Untuk bertanya tempat, pakai 〜は どこ ですか.' },
      ]},
      { w: 'tenin', e: 'happy', jp: 'あちら です。', ro: 'achira desu.', id: 'Di sebelah sana.' },
      { w: 'yuki', e: 'happy', t: 'Sempurna! Sekarang kamu tidak akan tersesat.' },
    ]},
    phrases: [
      { jp: '〜は どこ ですか', ro: '~wa doko desu ka', id: '… ada di mana?' },
      { jp: 'トイレ', ro: 'toire', id: 'Toilet' },
      { jp: 'あちら', ro: 'achira', id: 'Sebelah sana (sopan)' },
      { jp: 'まだ', ro: 'mada', id: 'Belum' },
    ],
  },
  { // HARI 16 — ULANGAN
    title: 'Ulangan 2', sub: 'ア 〜 ト', type: 'test', count: 15, chapter: 2, pool: 'kata',
    morning: { npc: 'yuki', with: 'hana', at: 'gate', lines: [
      { w: 'yuki', e: 'sad', jp: 'きょう は カタカナ の テスト…', ro: 'kyou wa katakana no tesuto…', id: 'Hari ini ulangan katakana…' },
      { w: 'hana', e: 'happy', jp: 'だいじょうぶ。いっしょに べんきょう した でしょう？', ro: 'daijoubu. issho ni benkyou shita deshou?', id: 'Tenang. Kita kan sudah belajar bareng?' },
      { q: 'Bagaimana perasaanmu?', o: [
        { jp: 'うん！がんばろう！', ro: 'un! ganbarou!', ok: true },
        { jp: 'ちょっと こわい…', ro: 'chotto kowai…', ok: true },
      ]},
    ]},
    cls: [
      { w: 'sensei', jp: 'では、はじめ！', ro: 'dewa, hajime!', id: 'Baiklah, mulai!' },
      { w: 'sensei', t: 'Soalnya berisi katakana yang sudah kamu pelajari. Tenang saja!' },
    ],
    brk: { npc: 'kenta', at: 'park', lines: [
      { w: 'kenta', e: 'happy', jp: 'テスト おわった！アイス を たべに いこう！', ro: 'tesuto owatta! aisu o tabe ni ikou!', id: 'Ulangan selesai! Ayo makan es krim!' },
      { q: 'Terima ajakan Kenta?', o: [
        { jp: 'いこう！', ro: 'ikou!', ok: true },
        { jp: 'また こんど ね。', ro: 'mata kondo ne.', ok: true },
      ]},
      { w: 'kenta', e: 'happy', t: 'Oke! Kamu hebat hari ini!' },
    ]},
    phrases: [
      { jp: 'おわった', ro: 'owatta', id: 'Sudah selesai' },
      { jp: '〜に いこう', ro: '~ni ikou', id: 'Ayo pergi …' },
      { jp: 'こわい', ro: 'kowai', id: 'Takut' },
    ],
  },
  { // HARI 17
    title: 'Baris NA', sub: 'ナ ニ ヌ ネ ノ', type: 'lesson', chapter: 2,
    kana: ['ナ','ニ','ヌ','ネ','ノ'],
    morning: { npc: 'kenta', at: 'gate', lines: [
      { w: 'kenta', e: 'sad', jp: 'ノート を わすれた…', ro: 'nooto o wasureta…', id: 'Aku lupa bawa buku tulis…' },
      { q: 'Tawarkan bantuan!', o: [
        { jp: 'わたし の ノート、つかって！', ro: 'watashi no nooto, tsukatte!', ok: true },
        { jp: 'しらない。', ro: 'shiranai.', why: 'しらない = tidak tahu. Kurang ramah! Tawarkan buku tulismu.' },
      ]},
      { w: 'kenta', e: 'happy', jp: 'たすかった！ありがとう！', ro: 'tasukatta! arigatou!', id: 'Kamu penyelamatku! Makasih!' },
    ]},
    cls: [
      { w: 'sensei', t: 'Baris NA: ナ ニ ヌ ネ ノ. ニ sama seperti angka 二 (dua)!' },
      { w: 'sensei', t: 'Kata hari ini: ノート (buku tulis), ネクタイ (dasi), ナイフ (pisau).' },
    ],
    brk: { npc: 'hana', at: 'shrine', lines: [
      { n: 'Hana berdiri di depan kuil kecil di ujung kota.' },
      { w: 'hana', jp: 'ここ は じんじゃ。おねがい を する ところ。', ro: 'koko wa jinja. onegai o suru tokoro.', id: 'Ini kuil. Tempat untuk membuat permohonan.' },
      { w: 'hana', t: 'Caranya: lempar koin, membungkuk dua kali, tepuk tangan dua kali, lalu membungkuk sekali lagi.' },
      { q: 'Apa permohonanmu?', o: [
        { jp: 'にほんご が じょうず に なりたい。', ro: 'nihongo ga jouzu ni naritai.', ok: true },
        { jp: 'ともだち と ずっと いっしょ に いたい。', ro: 'tomodachi to zutto issho ni itai.', ok: true },
      ]},
      { w: 'hana', e: 'happy', jp: 'きっと かなう よ！', ro: 'kitto kanau yo!', id: 'Pasti terkabul!' },
    ]},
    phrases: [
      { jp: 'わすれた', ro: 'wasureta', id: 'Lupa (membawa)' },
      { jp: 'つかって', ro: 'tsukatte', id: 'Pakailah' },
      { jp: 'じんじゃ', ro: 'jinja', id: 'Kuil Shinto' },
      { jp: '〜に なりたい', ro: '~ni naritai', id: 'Ingin menjadi …' },
    ],
  },
  { // HARI 18
    title: 'Baris HA', sub: 'ハ ヒ フ ヘ ホ', type: 'lesson', chapter: 2,
    kana: ['ハ','ヒ','フ','ヘ','ホ'],
    morning: { npc: 'yuki', at: 'home_front', lines: [
      { w: 'yuki', e: 'happy', jp: 'きょう の ひるごはん、ハンバーガー に しない？', ro: 'kyou no hirugohan, hanbaagaa ni shinai?', id: 'Makan siang hari ini hamburger, yuk?' },
      { q: 'Jawab ajakan Yuki!', o: [
        { jp: 'いいね！', ro: 'ii ne!', ok: true },
        { jp: 'おべんとう が ある から…', ro: 'obentou ga aru kara…', ok: true },
      ]},
      { w: 'yuki', t: 'Oke! ハンバーガー dari "hamburger". Hampir semua makanan Barat ditulis katakana.' },
    ]},
    cls: [
      { w: 'sensei', t: 'Baris HA: ハ ヒ フ ヘ ホ. ヘ hampir sama persis dengan へ hiragana!' },
      { w: 'sensei', t: 'Kata hari ini: ホテル (hotel), ハム (ham), ヒーロー (pahlawan).' },
    ],
    brk: { npc: 'kenta', with: 'tenin', at: 'konbini', lines: [
      { n: 'Kenta ingin membeli roti, tapi malu bertanya harganya.' },
      { q: 'Bantu Kenta: tanyakan harganya!', o: [
        { jp: 'これ は いくら ですか？', ro: 'kore wa ikura desu ka?', ok: true },
        { jp: 'これ は なん ですか？', ro: 'kore wa nan desu ka?', why: 'なん ですか = apa ini. Untuk menanyakan harga: いくら ですか.' },
      ]},
      { w: 'tenin', jp: 'ひゃく ごじゅう えん です。', ro: 'hyaku gojuu en desu.', id: '150 yen.' },
      { w: 'kenta', e: 'happy', t: 'Makasih! Sekarang aku juga tahu cara menanyakan harga.' },
    ]},
    phrases: [
      { jp: 'いくら ですか', ro: 'ikura desu ka', id: 'Berapa harganya?' },
      { jp: '〜えん', ro: '~en', id: '… yen' },
      { jp: 'ひゃく / ごじゅう', ro: 'hyaku / gojuu', id: '100 / 50' },
      { jp: 'ひるごはん', ro: 'hirugohan', id: 'Makan siang' },
    ],
  },
  { // HARI 19
    title: 'Baris MA', sub: 'マ ミ ム メ モ', type: 'lesson', chapter: 2,
    kana: ['マ','ミ','ム','メ','モ'],
    morning: { npc: 'hana', at: 'gate', lines: [
      { w: 'hana', e: 'happy', jp: 'ぶんかさい で、クラス の カフェ を します！', ro: 'bunkasai de, kurasu no kafe o shimasu!', id: 'Di festival sekolah, kelas kita buka kafe!' },
      { w: 'hana', t: 'Kita perlu membuat menu dalam katakana. Kamu mau bantu?' },
      { q: 'Jawab Hana!', o: [
        { jp: 'もちろん！', ro: 'mochiron!', ok: true },
        { jp: 'ちょっと…', ro: 'chotto…', why: 'ちょっと… adalah cara halus untuk menolak. Tapi Hana butuh bantuanmu!' },
      ]},
      { w: 'hana', e: 'happy', t: 'Terima kasih! Kamu memang bisa diandalkan.' },
    ]},
    cls: [
      { w: 'sensei', t: 'Baris MA: マ ミ ム メ モ. メ seperti tanda silang ✕.' },
      { w: 'sensei', t: 'Kata hari ini: メロン, ミルク, メモ.' },
    ],
    brk: { npc: 'yuki', at: 'park', lines: [
      { w: 'yuki', jp: 'カフェ の メニュー、なに が いい？', ro: 'kafe no menyuu, nani ga ii?', id: 'Menu kafenya apa yang bagus?' },
      { q: 'Usulkan menu!', o: [
        { jp: 'メロン ソーダ！', ro: 'meron sooda!', ok: true },
        { jp: 'ケーキ と ミルク！', ro: 'keeki to miruku!', ok: true },
        { jp: 'カレー ライス！', ro: 'karee raisu!', ok: true },
      ]},
      { w: 'yuki', e: 'happy', jp: 'それ、いい アイデア！', ro: 'sore, ii aidea!', id: 'Itu ide bagus!' },
    ]},
    phrases: [
      { jp: 'ぶんかさい', ro: 'bunkasai', id: 'Festival sekolah' },
      { jp: 'もちろん', ro: 'mochiron', id: 'Tentu saja' },
      { jp: 'ちょっと…', ro: 'chotto…', id: 'Agak… (cara halus menolak)' },
      { jp: 'アイデア', ro: 'aidea', id: 'Ide' },
    ],
  },
  { // HARI 20
    title: 'Baris YA & RA', sub: 'ヤ ユ ヨ ラ リ ル レ ロ', type: 'lesson', chapter: 2,
    kana: ['ヤ','ユ','ヨ','ラ','リ','ル','レ','ロ'],
    morning: { npc: 'kenta', at: 'home_front', lines: [
      { w: 'kenta', e: 'happy', jp: 'きのう、ラーメン や に いった！', ro: 'kinou, raamen ya ni itta!', id: 'Kemarin aku ke kedai ramen!' },
      { q: 'Tanyakan: "Enak tidak?"', o: [
        { jp: 'おいしかった？', ro: 'oishikatta?', ok: true },
        { jp: 'おいしい です。', ro: 'oishii desu.', why: 'Itu bentuk sekarang. Untuk kejadian kemarin, pakai bentuk lampau: おいしかった？' },
      ]},
      { w: 'kenta', e: 'happy', jp: 'すごく おいしかった！', ro: 'sugoku oishikatta!', id: 'Enak banget!' },
    ]},
    cls: [
      { w: 'sensei', t: 'Dua baris: ヤ ユ ヨ dan ラ リ ル レ ロ.' },
      { w: 'sensei', t: 'ロ berbentuk kotak. Jangan tertukar dengan ろ hiragana! Kata: ラーメン, レモン, ヨーヨー.' },
    ],
    brk: { npc: 'hana', at: 'river', lines: [
      { w: 'hana', jp: 'しょうらい の ゆめ は なに？', ro: 'shourai no yume wa nani?', id: 'Apa cita-citamu di masa depan?' },
      { q: 'Ceritakan cita-citamu!', o: [
        { jp: 'せんせい！', ro: 'sensei!', ok: true },
        { jp: 'パイロット！', ro: 'pairotto!', ok: true },
        { jp: 'まんがか！', ro: 'mangaka!', ok: true },
      ]},
      { w: 'hana', e: 'happy', jp: 'すてき！わたし は パティシエ に なりたい。', ro: 'suteki! watashi wa patishie ni naritai.', id: 'Keren! Aku ingin jadi pembuat kue.' },
    ]},
    phrases: [
      { jp: 'きのう', ro: 'kinou', id: 'Kemarin' },
      { jp: '〜かった', ro: '~katta', id: 'Bentuk lampau kata sifat (oishikatta)' },
      { jp: 'ゆめ', ro: 'yume', id: 'Mimpi / cita-cita' },
      { jp: 'すてき', ro: 'suteki', id: 'Indah / keren' },
    ],
  },
  { // HARI 21
    title: 'Katakana Terakhir', sub: 'ワ ヲ ン', type: 'lesson', chapter: 2,
    kana: ['ワ','ヲ','ン'],
    morning: { npc: 'yuki', at: 'gate', lines: [
      { w: 'yuki', e: 'happy', jp: 'ぶんかさい まで あと いちにち！', ro: 'bunkasai made ato ichinichi!', id: 'Festival tinggal satu hari lagi!' },
      { q: 'Bagaimana perasaanmu?', o: [
        { jp: 'ワクワク する！', ro: 'wakuwaku suru!', ok: true },
        { jp: 'ねむい…', ro: 'nemui…', why: 'Ayo semangat! ワクワク (wakuwaku) = berdebar-debar senang.' },
      ]},
    ]},
    cls: [
      { w: 'sensei', t: 'Huruf terakhir: ワ ヲ ン. ヲ hampir tidak pernah dipakai.' },
      { w: 'sensei', e: 'happy', t: 'Setelah ini kamu bisa membaca SEMUA hiragana dan katakana dasar. Hebat!' },
    ],
    brk: { npc: 'kenta', with: 'hana', at: 'park', lines: [
      { w: 'kenta', e: 'happy', jp: 'カフェ の かんばん、かいて！', ro: 'kafe no kanban, kaite!', id: 'Tolong tulis papan nama kafenya!' },
      { w: 'hana', t: 'Kamu yang paling rajin latihan menulis. Silakan!' },
      { q: 'Tulis nama kafe dengan huruf yang benar!', o: [
        { jp: 'カフェ さくら', ro: 'kafe sakura', ok: true },
        { jp: 'かふぇ さくら', ro: 'kafe sakura', why: 'Kata serapan seperti "café" ditulis dengan KATAKANA, bukan hiragana!' },
      ]},
      { w: 'kenta', e: 'happy', jp: 'かっこいい！', ro: 'kakkoii!', id: 'Keren!' },
    ]},
    phrases: [
      { jp: 'あと 〜', ro: 'ato ~', id: 'Tinggal … lagi' },
      { jp: 'ワクワク', ro: 'wakuwaku', id: 'Berdebar senang' },
      { jp: 'かんばん', ro: 'kanban', id: 'Papan nama' },
      { jp: 'かっこいい', ro: 'kakkoii', id: 'Keren' },
    ],
  },
  { // HARI 22 — UJIAN + FESTIVAL
    title: 'Festival Sekolah', sub: 'Ujian katakana & bunkasai', type: 'test', count: 20, chapter: 2, pool: 'kata',
    morning: { npc: 'hana', with: 'yuki', at: 'gate', lines: [
      { w: 'hana', jp: 'いよいよ ぶんかさい！でも その まえ に しけん…', ro: 'iyoiyo bunkasai! demo sono mae ni shiken…', id: 'Akhirnya festival! Tapi sebelumnya ujian…' },
      { w: 'yuki', e: 'happy', jp: 'しけん が おわったら、カフェ だよ！', ro: 'shiken ga owattara, kafe da yo!', id: 'Setelah ujian, waktunya kafe!' },
      { q: 'Semangati mereka!', o: [
        { jp: 'よし、がんばろう！', ro: 'yoshi, ganbarou!', ok: true },
        { jp: 'いいえ。', ro: 'iie.', why: 'いいえ = tidak. Ayo semangat bersama!' },
      ]},
    ]},
    cls: [
      { w: 'sensei', jp: 'カタカナ の しけん です。がんばって。', ro: 'katakana no shiken desu. ganbatte.', id: 'Ujian katakana. Berjuanglah.' },
    ],
    brk: { npc: 'yuki', with: 'kenta', at: 'gate', lines: [
      { n: 'Festival sekolah dimulai! Kafe kelas kalian ramai pengunjung.' },
      { q: 'Seorang tamu datang. Sambut dia!', o: [
        { jp: 'いらっしゃいませ！', ro: 'irasshaimase!', ok: true },
        { jp: 'いただきます！', ro: 'itadakimasu!', why: 'Itu diucapkan sebelum makan. Untuk menyambut tamu: いらっしゃいませ!' },
      ]},
      { n: 'Tamu itu memesan メロン ソーダ dan ケーキ.' },
      { q: 'Ulangi pesanannya!', o: [
        { jp: 'メロン ソーダ と ケーキ です ね。', ro: 'meron sooda to keeki desu ne.', ok: true },
        { jp: 'ラーメン と コーラ です ね。', ro: 'raamen to koora desu ne.', why: 'Dengarkan baik-baik: メロン ソーダ と ケーキ.' },
      ]},
      { w: 'kenta', e: 'happy', t: 'Kafe kita sukses besar! Semua berkat kamu!' },
      { w: 'yuki', e: 'happy', jp: 'ありがとう、{name}！だいすき な ともだち だよ！', ro: 'arigatou, {name}! daisuki na tomodachi da yo!', id: 'Terima kasih, {name}! Kamu sahabat terbaikku!' },
    ]},
    phrases: [
      { jp: 'しけん', ro: 'shiken', id: 'Ujian' },
      { jp: 'いらっしゃいませ', ro: 'irasshaimase', id: 'Selamat datang (toko)' },
      { jp: '〜と〜です ね', ro: '~to~desu ne', id: '… dan …, ya (mengulang pesanan)' },
      { jp: 'ともだち', ro: 'tomodachi', id: 'Teman' },
    ],
  },
);
DAYS.forEach((d, i) => { d.chapter = d.chapter || (i < 11 ? 1 : 2); });

/* ---------- Kehidupan sehari-hari ---------- */
// Sarapan bersama Nenek (satu adegan per hari, bergiliran)
const BREAKFAST = [
  [{ w: 'obaa', e: 'happy', jp: 'おはよう。よく ねた？', ro: 'ohayou. yoku neta?', id: 'Pagi. Tidurmu nyenyak?' },
   { q: 'Jawab Nenek!', o: [{ jp: 'はい、よく ねました。', ro: 'hai, yoku nemashita.', ok: true }, { jp: 'いただきます。', ro: 'itadakimasu.', why: 'Nenek bertanya soal tidurmu. "Yoku nemashita" = aku tidur nyenyak.' }] }],
  [{ w: 'obaa', e: 'happy', jp: 'あさごはん、できた よ。', ro: 'asagohan, dekita yo.', id: 'Sarapan sudah siap.' },
   { q: 'Sebelum makan, ucapkan…', o: [{ jp: 'いただきます！', ro: 'itadakimasu!', ok: true }, { jp: 'ごちそうさま！', ro: 'gochisousama!', why: 'ごちそうさま diucapkan SETELAH makan.' }] }],
  [{ w: 'obaa', jp: 'きょう は なに を べんきょう する の？', ro: 'kyou wa nani o benkyou suru no?', id: 'Hari ini belajar apa?' },
   { q: 'Jawab Nenek!', o: [{ jp: 'もじ を べんきょう します！', ro: 'moji o benkyou shimasu!', ok: true }, { jp: 'わかりません。', ro: 'wakarimasen.', ok: true }] },
   { w: 'obaa', e: 'happy', t: 'もじ (moji) artinya huruf. Belajar yang rajin, ya.' }],
  [{ w: 'obaa', jp: 'みそしる、どうぞ。', ro: 'misoshiru, douzo.', id: 'Silakan, sup miso.' },
   { q: 'Kamu mencicipi sup miso. Rasanya…', o: [{ jp: 'おいしい です！', ro: 'oishii desu!', ok: true }, { jp: 'まずい…', ro: 'mazui…', why: 'まずい = tidak enak. Nenek bisa sedih! Enak = おいしい.' }] }],
  [{ w: 'obaa', jp: 'かさ を もって いきなさい。あめ が ふる よ。', ro: 'kasa o motte ikinasai. ame ga furu yo.', id: 'Bawalah payung. Nanti hujan.' },
   { q: 'Jawab Nenek!', o: [{ jp: 'はい、わかりました。', ro: 'hai, wakarimashita.', ok: true }, { jp: 'いいえ、けっこう です。', ro: 'iie, kekkou desu.', ok: true }] },
   { w: 'obaa', t: 'かさ (kasa) = payung, あめ (ame) = hujan.' }],
  [{ w: 'obaa', e: 'happy', jp: 'たまご、いくつ たべる？', ro: 'tamago, ikutsu taberu?', id: 'Mau makan berapa telur?' },
   { q: 'Pilih jumlahnya!', o: [{ jp: 'ひとつ！', ro: 'hitotsu!', ok: true }, { jp: 'ふたつ！', ro: 'futatsu!', ok: true }, { jp: 'みっつ！', ro: 'mittsu!', ok: true }] },
   { w: 'obaa', t: 'ひとつ, ふたつ, みっつ = satu, dua, tiga (untuk menghitung benda).' }],
  [{ w: 'obaa', jp: 'トースト と ごはん、どっち が いい？', ro: 'toosuto to gohan, docchi ga ii?', id: 'Roti panggang atau nasi, mau yang mana?' },
   { q: 'Pilih sarapanmu!', o: [{ jp: 'トースト！', ro: 'toosuto!', ok: true }, { jp: 'ごはん！', ro: 'gohan!', ok: true }] },
   { w: 'obaa', t: 'トースト ditulis katakana karena kata serapan dari "toast".' }],
];
const LEAVE_HOME = [
  { w: 'obaa', e: 'happy', jp: 'いってらっしゃい！', ro: 'itterasshai!', id: 'Hati-hati di jalan!' },
  { q: 'Saat berangkat dari rumah, ucapkan…', o: [{ jp: 'いってきます！', ro: 'ittekimasu!', ok: true }, { jp: 'ただいま！', ro: 'tadaima!', why: 'ただいま diucapkan saat PULANG. Saat berangkat: いってきます!' }] },
];

// Makan malam (setelah pulang)
const WELCOME_HOME = [
  { w: 'obaa', e: 'happy', jp: 'おかえり！', ro: 'okaeri!', id: 'Selamat datang kembali!' },
  { q: 'Saat pulang ke rumah, ucapkan…', o: [{ jp: 'ただいま！', ro: 'tadaima!', ok: true }, { jp: 'いってきます！', ro: 'ittekimasu!', why: 'いってきます diucapkan saat BERANGKAT. Saat pulang: ただいま!' }] },
];
const DINNER = [
  [{ w: 'obaa', e: 'happy', jp: 'ばんごはん は カレー だよ。', ro: 'bangohan wa karee da yo.', id: 'Makan malam kari.' },
   { q: 'Kamu senang sekali! Katakan…', o: [{ jp: 'やった！いただきます！', ro: 'yatta! itadakimasu!', ok: true }, { jp: 'ごちそうさま。', ro: 'gochisousama.', why: 'Belum makan! Sebelum makan: いただきます.' }] }],
  [{ w: 'obaa', jp: 'きょう は どう だった？', ro: 'kyou wa dou datta?', id: 'Hari ini bagaimana?' },
   { q: 'Ceritakan harimu!', o: [{ jp: 'たのしかった です！', ro: 'tanoshikatta desu!', ok: true }, { jp: 'ちょっと つかれた…', ro: 'chotto tsukareta…', ok: true }] },
   { w: 'obaa', e: 'happy', t: 'たのしかった = tadi menyenangkan. つかれた = capek. Istirahat yang cukup, ya.' }],
  [{ w: 'obaa', jp: 'しゅくだい は？', ro: 'shukudai wa?', id: 'PR-nya?' },
   { q: 'Jawab Nenek!', o: [{ jp: 'もう おわりました！', ro: 'mou owarimashita!', ok: true }, { jp: 'これから します。', ro: 'korekara shimasu.', ok: true }] }],
  [{ w: 'obaa', jp: 'さかな と にく、どっち が すき？', ro: 'sakana to niku, docchi ga suki?', id: 'Ikan atau daging, suka yang mana?' },
   { q: 'Pilih!', o: [{ jp: 'さかな が すき！', ro: 'sakana ga suki!', ok: true }, { jp: 'にく が すき！', ro: 'niku ga suki!', ok: true }] }],
  [{ w: 'obaa', e: 'happy', jp: 'おふろ、わいた よ。', ro: 'ofuro, waita yo.', id: 'Air mandinya sudah hangat.' },
   { q: 'Jawab Nenek!', o: [{ jp: 'はい、はいります！', ro: 'hai, hairimasu!', ok: true }, { jp: 'おはよう！', ro: 'ohayou!', why: 'Sekarang malam hari! Jawab saja: はい (iya).' }] },
   { w: 'obaa', t: 'Orang Jepang biasa berendam di bak air hangat (ofuro) setiap malam.' }],
  [{ w: 'obaa', jp: 'ごはん、おかわり する？', ro: 'gohan, okawari suru?', id: 'Mau tambah nasi?' },
   { q: 'Jawab Nenek!', o: [{ jp: 'はい、おねがいします！', ro: 'hai, onegaishimasu!', ok: true }, { jp: 'もう おなか いっぱい です。', ro: 'mou onaka ippai desu.', ok: true }] },
   { w: 'obaa', t: 'おなか いっぱい = perut sudah kenyang.' }],
];
const GOOD_NIGHT = [{ w: 'obaa', e: 'happy', jp: 'おやすみ なさい。', ro: 'oyasumi nasai.', id: 'Selamat tidur.' }];

// Makan siang: pilih tempat & teman
const LUNCH = {
  yuki: [
    [{ w: 'yuki', e: 'happy', jp: 'おべんとう、おいしそう！', ro: 'obentou, oishisou!', id: 'Bekalmu kelihatan enak!' },
     { q: 'Tawarkan bekalmu!', o: [{ jp: 'ひとつ たべる？', ro: 'hitotsu taberu?', ok: true }, { jp: 'だめ！', ro: 'dame!', why: 'だめ = tidak boleh. Pelit sekali! Tawarkan: ひとつ たべる？' }] },
     { w: 'yuki', e: 'happy', jp: 'いい の？ありがとう！', ro: 'ii no? arigatou!', id: 'Boleh? Makasih!' }],
    [{ w: 'yuki', jp: 'そら が きれい だね。', ro: 'sora ga kirei da ne.', id: 'Langitnya indah, ya.' },
     { q: 'Setujui Yuki!', o: [{ jp: 'うん、きれい！', ro: 'un, kirei!', ok: true }, { jp: 'きたない。', ro: 'kitanai.', why: 'きたない = kotor. Langitnya cerah dan indah: きれい!' }] }],
    [{ w: 'yuki', jp: 'しゅみ は なに？', ro: 'shumi wa nani?', id: 'Hobimu apa?' },
     { q: 'Ceritakan hobimu!', o: [{ jp: 'おんがく を きく こと！', ro: 'ongaku o kiku koto!', ok: true }, { jp: 'え を かく こと！', ro: 'e o kaku koto!', ok: true }, { jp: 'りょうり！', ro: 'ryouri!', ok: true }] },
     { w: 'yuki', e: 'happy', t: 'Seru! Hobiku memotret dengan カメラ (kamera).' }],
    [{ w: 'yuki', jp: 'インドネシア の たべもの、なに が おいしい？', ro: 'indoneshia no tabemono, nani ga oishii?', id: 'Makanan Indonesia apa yang enak?' },
     { q: 'Rekomendasikan makanan!', o: [{ jp: 'サテ！', ro: 'sate!', ok: true }, { jp: 'ナシゴレン！', ro: 'nashigoren!', ok: true }, { jp: 'ルンダン！', ro: 'rundan!', ok: true }] },
     { w: 'yuki', e: 'happy', t: 'Kapan-kapan masakkan untukku, ya!' }],
    [{ w: 'yuki', e: 'sad', jp: 'しゅくだい、むずかしかった…', ro: 'shukudai, muzukashikatta…', id: 'PR-nya susah…' },
     { q: 'Hibur Yuki!', o: [{ jp: 'いっしょに やろう！', ro: 'issho ni yarou!', ok: true }, { jp: 'かんたん だよ。', ro: 'kantan da yo.', why: 'Bilang "gampang" malah membuat Yuki sedih. Ajak dia mengerjakan bersama!' }] }],
  ],
  kenta: [
    [{ w: 'kenta', jp: 'パン、はんぶん たべる？', ro: 'pan, hanbun taberu?', id: 'Mau setengah rotiku?' },
     { q: 'Jawab Kenta!', o: [{ jp: 'ありがとう！', ro: 'arigatou!', ok: true }, { jp: 'いらない。', ro: 'iranai.', ok: true }] }],
    [{ w: 'kenta', e: 'happy', jp: 'きのう の アニメ、みた？', ro: 'kinou no anime, mita?', id: 'Nonton anime kemarin?' },
     { q: 'Jawab Kenta!', o: [{ jp: 'みた！おもしろかった！', ro: 'mita! omoshirokatta!', ok: true }, { jp: 'みて ない…', ro: 'mite nai…', ok: true }] },
     { w: 'kenta', t: 'おもしろい = seru / lucu. Bentuk lampaunya おもしろかった.' }],
    [{ w: 'kenta', e: 'sad', jp: 'しゅくだい、みせて…', ro: 'shukudai, misete…', id: 'Lihat PR-mu dong…' },
     { q: 'Bagaimana jawabanmu?', o: [{ jp: 'じぶん で やって！', ro: 'jibun de yatte!', ok: true }, { jp: 'いっしょに かんがえよう。', ro: 'issho ni kangaeyou.', ok: true }] },
     { w: 'kenta', e: 'happy', t: 'Hehe, iya deh. Kamu benar.' }],
    [{ w: 'kenta', jp: 'ねむい… ひる やすみ、みじかい よ。', ro: 'nemui… hiru yasumi, mijikai yo.', id: 'Ngantuk… Istirahat siang terlalu pendek.' },
     { q: 'Semangati Kenta!', o: [{ jp: 'がんばって！', ro: 'ganbatte!', ok: true }, { jp: 'おやすみ！', ro: 'oyasumi!', why: 'Jangan suruh Kenta tidur di sekolah! Semangati dia: がんばって!' }] }],
    [{ w: 'kenta', e: 'happy', jp: 'みて！けんだま、できる よ！', ro: 'mite! kendama, dekiru yo!', id: 'Lihat! Aku bisa main kendama!' },
     { q: 'Puji Kenta!', o: [{ jp: 'じょうず！', ro: 'jouzu!', ok: true }, { jp: 'へた。', ro: 'heta.', why: 'へた = payah. Kenta berlatih keras! Puji dia: じょうず (pandai)!' }] }],
  ],
  hana: [
    [{ w: 'hana', jp: 'しずか に ね。ここ は としょかん だよ。', ro: 'shizuka ni ne. koko wa toshokan da yo.', id: 'Pelan-pelan ya. Ini perpustakaan.' },
     { q: 'Jawab Hana dengan pelan!', o: [{ jp: 'はい、すみません。', ro: 'hai, sumimasen.', ok: true }, { jp: 'やった！', ro: 'yatta!', why: 'Sst! Di perpustakaan harus tenang.' }] }],
    [{ w: 'hana', e: 'happy', jp: 'いっしょに べんきょう しよう。', ro: 'issho ni benkyou shiyou.', id: 'Ayo belajar bersama.' },
     { q: 'Jawab Hana!', o: [{ jp: 'うん、しよう！', ro: 'un, shiyou!', ok: true }, { jp: 'いや だ。', ro: 'iya da.', why: 'いや だ = tidak mau. Hana ingin membantumu!' }] }],
    [{ w: 'hana', jp: 'この ほん、おもしろい よ。', ro: 'kono hon, omoshiroi yo.', id: 'Buku ini seru, lho.' },
     { q: 'Jawab Hana!', o: [{ jp: 'よみたい！', ro: 'yomitai!', ok: true }, { jp: 'たべたい！', ro: 'tabetai!', why: 'Buku itu dibaca (よむ), bukan dimakan (たべる)! よみたい = ingin membaca.' }] }],
  ],
};

// Klub sepulang sekolah
const CLUBS = [
  { id: 'shodo', name: 'Klub Kaligrafi', host: 'sensei', game: 'shodo', desc: 'Menulis huruf dengan kuas, lalu dinilai', intro: [{ w: 'sensei', e: 'happy', t: 'Selamat datang di klub kaligrafi (しょどう). Tulis hurufnya dengan tenang dan rapi.' }] },
  { id: 'karuta', name: 'Klub Karuta', host: 'kenta', game: 'karuta', desc: 'Permainan kartu Jepang: ambil kartu tercepat!', intro: [{ w: 'kenta', e: 'happy', t: 'Karuta! Dengarkan hurufnya, lalu ambil kartu yang benar secepat mungkin!' }] },
  { id: 'ryouri', name: 'Klub Memasak', host: 'yuki', game: 'builder', desc: 'Susun huruf menjadi kata', intro: [{ w: 'yuki', e: 'happy', t: 'Hari ini kita "memasak" kata! Susun hurufnya menjadi kata yang benar.' }] },
  { id: 'hoka', name: 'Klub Sains', host: 'hana', game: 'catch', desc: 'Tangkap huruf yang melayang', intro: [{ w: 'hana', t: 'Eksperimen hari ini: gelembung huruf! Tangkap gelembung yang cocok.' }] },
];

// Event persahabatan (muncul setelah tugas sore bila ♥ cukup)
const FRIEND_EVENTS = [
  { id: 'yuki1', who: 'yuki', need: 5, lines: [
    { n: 'Yuki mengajakmu duduk di bawah pohon sakura.' },
    { w: 'yuki', jp: 'わたし、いつか インドネシア に いきたい な。', ro: 'watashi, itsuka indoneshia ni ikitai na.', id: 'Suatu hari aku ingin ke Indonesia.' },
    { q: 'Jawab Yuki!', o: [{ jp: 'いっしょに いこう！', ro: 'issho ni ikou!', ok: true }, { jp: 'あんない する よ！', ro: 'annai suru yo!', ok: true }] },
    { w: 'yuki', e: 'happy', jp: 'やくそく だよ！', ro: 'yakusoku da yo!', id: 'Janji, ya!' },
  ]},
  { id: 'kenta1', who: 'kenta', need: 5, lines: [
    { n: 'Kenta menunjukkan buku gambar penuh sketsa.' },
    { w: 'kenta', jp: 'じつは… まんがか に なりたい んだ。', ro: 'jitsu wa… mangaka ni naritai n da.', id: 'Sebenarnya… aku ingin jadi komikus.' },
    { q: 'Dukung mimpi Kenta!', o: [{ jp: 'すごい！おうえん する よ！', ro: 'sugoi! ouen suru yo!', ok: true }, { jp: 'むり だよ。', ro: 'muri da yo.', why: 'むり = mustahil. Teman sejati selalu mendukung!' }] },
    { w: 'kenta', e: 'happy', jp: 'ありがとう！いちばん さいしょ の ファン だね！', ro: 'arigatou! ichiban saisho no fan da ne!', id: 'Makasih! Kamu penggemar pertamaku!' },
  ]},
  { id: 'hana1', who: 'hana', need: 3, lines: [
    { n: 'Hana memberimu kotak kecil berisi kue kering.' },
    { w: 'hana', jp: 'れんしゅう で つくった の。たべて みて。', ro: 'renshuu de tsukutta no. tabete mite.', id: 'Aku buat untuk latihan. Coba, ya.' },
    { q: 'Jawab Hana!', o: [{ jp: 'すごく おいしい！', ro: 'sugoku oishii!', ok: true }, { jp: 'プロ みたい！', ro: 'puro mitai!', ok: true }] },
    { w: 'hana', e: 'happy', jp: 'えへへ… うれしい。', ro: 'ehehe… ureshii.', id: 'Hehe… aku senang.' },
  ]},
  { id: 'yuki2', who: 'yuki', need: 10, lines: [
    { n: 'Yuki memberimu selembar foto: kalian bertiga tertawa di gerbang sekolah.' },
    { w: 'yuki', e: 'happy', jp: 'これ、プレゼント。ずっと ともだち で いてね。', ro: 'kore, purezento. zutto tomodachi de ite ne.', id: 'Ini hadiah. Tetap jadi temanku selamanya, ya.' },
    { q: 'Jawab Yuki!', o: [{ jp: 'もちろん！', ro: 'mochiron!', ok: true }] },
  ]},
];

// Misi sampingan (logika ada di game.js)
const QUESTS = {
  sora:   { title: 'Guru Kecil Sora', from: 3, giver: 'kid', reward: 30, desc: 'Baca papan いけ (dekat kolam) dan えき (dekat stasiun), lalu beri tahu Sora.' },
  mochi:  { title: 'Kucing Hilang', from: 6, giver: 'ojii', reward: 40, desc: 'Kucing Kakek Mori, Mochi, hilang. Cari di sekitar kota.' },
  letter: { title: 'Surat untuk Nenek', from: 8, giver: 'obaa', reward: 30, desc: 'Ambil surat di kotak pos dan pastikan nama penerimanya.' },
  list:   { title: 'Daftar Belanja Nenek', from: 13, giver: 'obaa', reward: 40, desc: 'Belikan barang di konbini sesuai daftar katakana.' },
  menu:   { title: 'Menu Kafe Hana', from: 19, giver: 'hana', reward: 40, desc: 'Bantu Hana memeriksa menu katakana untuk festival.' },
};

// Barang di lemari (dibeli dengan poin sakura)
const SHOP = [
  { kind: 'accessory', v: 'headband', price: 40 },
  { kind: 'accessory', v: 'flower', price: 50 },
  { kind: 'accessory', v: 'cap', price: 70 },
  { kind: 'hairColor', v: '#d9a45a', price: 30 },
  { kind: 'hairColor', v: '#8a4a78', price: 40 },
  { kind: 'hairColor', v: '#4f7fb0', price: 50 },
  { kind: 'uniformColor', v: '#6b3f5a', price: 30 },
  { kind: 'uniformColor', v: '#4a4a55', price: 30 },
];


// Warga kota tambahan
AMBIENT.tenin.push(
  [{ w: 'tenin', e: 'happy', jp: 'いらっしゃいませ！アイス は いかが ですか？', ro: 'irasshaimase! aisu wa ikaga desu ka?', id: 'Selamat datang! Mau es krim?' },
   { w: 'tenin', t: 'いかが ですか = bagaimana kalau …? (menawarkan dengan sopan)' }],
);
AMBIENT.hana = [
  [{ w: 'hana', e: 'happy', t: 'Kalau ada huruf yang sulit, tanya aku saja, ya!' }],
  [{ w: 'hana', jp: 'がんばってる ね！', ro: 'ganbatteru ne!', id: 'Kamu rajin, ya!' }],
];
AMBIENT.mochi = [[{ n: 'Mochi mengeong manja: "にゃあ〜" (nyaa~)' }]];
