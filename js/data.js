/* =========================================================
   DATA GAME: tokoh, huruf, kosakata, dan jadwal hari sekolah.
   Untuk menambah materi baru, cukup edit file ini.
   ========================================================= */

// Tokoh yang bisa berbicara (warna papan nama di dialog)
const CHARACTERS = {
  sensei: { name: 'Tanaka-sensei', color: '#52648a' },
  yuki:   { name: 'Yuki',          color: '#c8455d' },
  kenta:  { name: 'Kenta',         color: '#c98a1e' },
  obaa:   { name: 'Nenek Sato',    color: '#7a5a90' },
  hana:   { name: 'Hana',          color: '#3b8a78' },
  mochi:  { name: 'Mochi',         color: '#c97a35' },
  tenin:  { name: 'Pak Kasir',     color: '#3f8059' },
  kid:    { name: 'Sora',          color: '#bf6428' },
  ojii:   { name: 'Kakek Mori',    color: '#546e50' },
};

// Hiragana dasar + cara membaca + cara mengingat (bahasa Indonesia)
const KANA = {
  'あ': { ro: 'a',   tip: 'Tanda salib dan lingkaran besar, seperti orang berguling sambil teriak "Aaa!"' },
  'い': { ro: 'i',   tip: 'Dua garis berdiri berdampingan, seperti dua huruf "i": "ii".' },
  'う': { ro: 'u',   tip: 'Titik di atas lalu lengkungan, seperti orang membungkuk mengeluh "Uuh…"' },
  'え': { ro: 'e',   tip: 'Seperti orang menari dengan kaki melangkah: "Eh, eh!"' },
  'お': { ro: 'o',   tip: 'Mirip あ tapi ada titik kecil di kanan atas: "Oh! Ada titik!"' },
  'か': { ro: 'ka',  tip: 'Seperti orang karate yang menebas: "KA-rate!"' },
  'き': { ro: 'ki',  tip: 'Bentuknya mirip anak kunci (key): "KI".' },
  'く': { ro: 'ku',  tip: 'Seperti paruh burung terbuka yang berkicau: "KUkuruyuk!"' },
  'け': { ro: 'ke',  tip: 'Seperti pagar dengan satu tiang. Ketuk pagarnya: "KEtuk!"' },
  'こ': { ro: 'ko',  tip: 'Dua garis sejajar seperti dua koin bertumpuk: "KOin".' },
  'さ': { ro: 'sa',  tip: 'Mirip き tapi garis mendatarnya hanya SAtu: "SA".' },
  'し': { ro: 'shi', tip: 'Seperti kail pancing. Dibaca "shi" (mirip "si").' },
  'す': { ro: 'su',  tip: 'Garis dengan simpul berputar, seperti peselancar (SUrfing) berputar di ombak.' },
  'せ': { ro: 'se',  tip: 'Seperti mulut tersenyum lebar dengan gigi: "SEnyum!"' },
  'そ': { ro: 'so',  tip: 'Zig-zag seperti jalan berkelok-kelok: "SO jauh!"' },
  'た': { ro: 'ta',  tip: 'Terlihat seperti huruf "t" dan "a" digabung: "TA".' },
  'ち': { ro: 'chi', tip: 'Mirip angka 5 yang dibalik. Dibaca "chi" (seperti "ci").' },
  'つ': { ro: 'tsu', tip: 'Satu lengkungan seperti ombak TSUnami.' },
  'て': { ro: 'te',  tip: 'Seperti tangan yang terulur. "Te" dalam bahasa Jepang memang berarti tangan!' },
  'と': { ro: 'to',  tip: 'Seperti duri yang menancap di jari kaki: "TOlong!"' },
  'な': { ro: 'na',  tip: 'Salib dan simpul: bayangkan NAsi dibungkus lalu diikat.' },
  'に': { ro: 'ni',  tip: 'Satu tiang dan DUA garis. Angka 2 dalam bahasa Jepang adalah "ni"!' },
  'ぬ': { ro: 'nu',  tip: 'Seperti mi (NUdle) keriting dengan simpul di ujungnya.' },
  'ね': { ro: 'ne',  tip: 'Seperti kucing (NEko) dengan ekor melingkar.' },
  'の': { ro: 'no',  tip: 'Seperti tanda larangan: "NO!"' },
  'は': { ro: 'ha',  tip: 'Tiang dan wajah tertawa: "HAhaha!" (Sebagai partikel dibaca "wa".)' },
  'ひ': { ro: 'hi',  tip: 'Seperti senyum lebar: "HIhihi!"' },
  'ふ': { ro: 'fu',  tip: 'Seperti orang meniup lilin: "FUuu!" (bunyinya antara "fu" dan "hu").' },
  'へ': { ro: 'he',  tip: 'Seperti bukit kecil: "HEi, ada bukit!"' },
  'ほ': { ro: 'ho',  tip: 'Mirip は tapi ada garis tambahan di atas: "HOho!"' },
  'ま': { ro: 'ma',  tip: 'Tiang dengan dua palang dan simpul di bawah, seperti MAma mengikat tali.' },
  'み': { ro: 'mi',  tip: 'Seperti angka 21 yang ditulis bersambung: "MI".' },
  'む': { ro: 'mu',  tip: 'Seperti sapi bertanduk yang melenguh: "MUuu!"' },
  'め': { ro: 'me',  tip: 'Seperti mata. "Me" dalam bahasa Jepang memang berarti mata!' },
  'も': { ro: 'mo',  tip: 'Kail pancing dengan dua umpan: "MOga dapat ikan!"' },
  'や': { ro: 'ya',  tip: 'Seperti yak (hewan) dengan tanduk: "YA!"' },
  'ゆ': { ro: 'yu',  tip: 'Seperti ikan dilihat dari samping: "YUk makan ikan!"' },
  'よ': { ro: 'yo',  tip: 'Seperti orang main YOyo.' },
  'ら': { ro: 'ra',  tip: 'Seperti orang berjongkok dengan titik di kepala: "RA".' },
  'り': { ro: 'ri',  tip: 'Dua garis seperti aliran sungai (RIver): "RI".' },
  'る': { ro: 'ru',  tip: 'Seperti angka 3 dengan lingkaran kecil di bawah: "RU".' },
  'れ': { ro: 're',  tip: 'Seperti ね tapi ekornya lurus ke kanan: "RE".' },
  'ろ': { ro: 'ro',  tip: 'Seperti る tanpa lingkaran: "RO".' },
  'わ': { ro: 'wa',  tip: 'Seperti ね tanpa ekor melingkar: "WAh!"' },
  'を': { ro: 'wo',  tip: 'Seperti orang kaget: "WOah!" Dibaca "o", hanya dipakai sebagai partikel.' },
  'ん': { ro: 'n',   tip: 'Seperti huruf "n" kecil yang ditulis miring: "N".' },
};

// Susunan tabel hiragana (untuk Buku Catatan)
const HIRAGANA_GRID = [
  ['あ','い','う','え','お'],
  ['か','き','く','け','こ'],
  ['さ','し','す','せ','そ'],
  ['た','ち','つ','て','と'],
  ['な','に','ぬ','ね','の'],
  ['は','ひ','ふ','へ','ほ'],
  ['ま','み','む','め','も'],
  ['や','','ゆ','','よ'],
  ['ら','り','る','れ','ろ'],
  ['わ','','','','を'],
  ['ん','','','',''],
];

// Kosakata. Kata muncul di latihan setelah semua hurufnya dipelajari.
const WORDS = [
  { jp: 'あい', ro: 'ai', id: 'cinta' },
  { jp: 'あお', ro: 'ao', id: 'biru' },
  { jp: 'いえ', ro: 'ie', id: 'rumah' },
  { jp: 'うえ', ro: 'ue', id: 'atas' },
  { jp: 'かお', ro: 'kao', id: 'wajah' },
  { jp: 'いけ', ro: 'ike', id: 'kolam' },
  { jp: 'こえ', ro: 'koe', id: 'suara' },
  { jp: 'えき', ro: 'eki', id: 'stasiun' },
  { jp: 'あかい', ro: 'akai', id: 'merah' },
  { jp: 'ここ', ro: 'koko', id: 'di sini' },
  { jp: 'すし', ro: 'sushi', id: 'sushi' },
  { jp: 'かさ', ro: 'kasa', id: 'payung' },
  { jp: 'あし', ro: 'ashi', id: 'kaki' },
  { jp: 'いす', ro: 'isu', id: 'kursi' },
  { jp: 'せかい', ro: 'sekai', id: 'dunia' },
  { jp: 'あさ', ro: 'asa', id: 'pagi' },
  { jp: 'たこ', ro: 'tako', id: 'gurita' },
  { jp: 'くつ', ro: 'kutsu', id: 'sepatu' },
  { jp: 'て', ro: 'te', id: 'tangan' },
  { jp: 'そと', ro: 'soto', id: 'luar' },
  { jp: 'した', ro: 'shita', id: 'bawah' },
  { jp: 'つくえ', ro: 'tsukue', id: 'meja' },
  { jp: 'ちかてつ', ro: 'chikatetsu', id: 'kereta bawah tanah' },
  { jp: 'ねこ', ro: 'neko', id: 'kucing' },
  { jp: 'いぬ', ro: 'inu', id: 'anjing' },
  { jp: 'なつ', ro: 'natsu', id: 'musim panas' },
  { jp: 'おかね', ro: 'okane', id: 'uang' },
  { jp: 'にく', ro: 'niku', id: 'daging' },
  { jp: 'あなた', ro: 'anata', id: 'kamu' },
  { jp: 'はな', ro: 'hana', id: 'bunga' },
  { jp: 'ひと', ro: 'hito', id: 'orang' },
  { jp: 'ふね', ro: 'fune', id: 'kapal' },
  { jp: 'ほし', ro: 'hoshi', id: 'bintang' },
  { jp: 'へそ', ro: 'heso', id: 'pusar' },
  { jp: 'ひこうき', ro: 'hikouki', id: 'pesawat' },
  { jp: 'みみ', ro: 'mimi', id: 'telinga' },
  { jp: 'め', ro: 'me', id: 'mata' },
  { jp: 'むし', ro: 'mushi', id: 'serangga' },
  { jp: 'もも', ro: 'momo', id: 'buah persik' },
  { jp: 'まち', ro: 'machi', id: 'kota' },
  { jp: 'さかな', ro: 'sakana', id: 'ikan' },
  { jp: 'あたま', ro: 'atama', id: 'kepala' },
  { jp: 'やま', ro: 'yama', id: 'gunung' },
  { jp: 'ゆき', ro: 'yuki', id: 'salju' },
  { jp: 'よる', ro: 'yoru', id: 'malam' },
  { jp: 'さくら', ro: 'sakura', id: 'bunga sakura' },
  { jp: 'そら', ro: 'sora', id: 'langit' },
  { jp: 'くるま', ro: 'kuruma', id: 'mobil' },
  { jp: 'とり', ro: 'tori', id: 'burung' },
  { jp: 'わたし', ro: 'watashi', id: 'saya' },
  { jp: 'ほん', ro: 'hon', id: 'buku' },
  { jp: 'みかん', ro: 'mikan', id: 'jeruk' },
  { jp: 'にほん', ro: 'nihon', id: 'Jepang' },
  { jp: 'かわ', ro: 'kawa', id: 'sungai' },
  { jp: 'てんき', ro: 'tenki', id: 'cuaca' },
];

/* ---------------------------------------------------------
   JADWAL HARI SEKOLAH
   Setiap hari: pagi (sapa teman) → pelajaran di kelas →
   sepulang sekolah (ngobrol) → pulang & tidur.

   Format baris dialog:
   { n: 'narasi' }
   { w: 'yuki', e: 'happy', jp: '...', ro: '...', id: 'arti' }  // bicara bahasa Jepang
   { w: 'yuki', t: 'teks bahasa Indonesia' }                    // penjelasan
   { q: 'pertanyaan', o: [ { jp, ro, ok: true }, { jp, ro, why: 'penjelasan jika salah' } ] }
   {name} akan diganti dengan nama pemain.
   Lokasi (at): gate, home_front, park, konbini, river
   --------------------------------------------------------- */
const DAYS = [
  { // HARI 1
    title: 'Hari Pertama', sub: 'あ い う え お', type: 'lesson',
    kana: ['あ','い','う','え','お'],
    morning: { npc: 'yuki', at: 'gate', lines: [
      { w: 'yuki', e: 'happy', jp: 'おはよう！', ro: 'ohayou!', id: 'Selamat pagi!' },
      { w: 'yuki', t: 'Kamu murid baru, ya? Di Jepang, pagi-pagi kita saling menyapa "ohayou".' },
      { q: 'Balas sapaan Yuki!', o: [
        { jp: 'おはよう！', ro: 'ohayou!', ok: true },
        { jp: 'おやすみ！', ro: 'oyasumi!', why: 'おやすみ (oyasumi) artinya "selamat tidur", diucapkan malam hari sebelum tidur.' },
        { jp: 'ありがとう！', ro: 'arigatou!', why: 'ありがとう (arigatou) artinya "terima kasih". Yuki sedang menyapamu di pagi hari.' },
      ]},
      { w: 'yuki', e: 'happy', jp: 'わたしは ゆき。よろしくね！', ro: 'watashi wa Yuki. yoroshiku ne!', id: 'Aku Yuki. Salam kenal, ya!' },
      { w: 'yuki', t: 'Ayo masuk kelas! Tanaka-sensei sudah menunggu di dalam.' },
    ]},
    cls: [
      { w: 'sensei', e: 'happy', jp: 'みなさん、おはようございます。', ro: 'minasan, ohayou gozaimasu.', id: 'Selamat pagi, semuanya.' },
      { w: 'sensei', t: 'Oh, kamu murid pindahan dari Indonesia? Selamat datang di SMA Sakura!' },
      { w: 'sensei', t: 'Bahasa Jepang punya 3 jenis huruf: hiragana, katakana, dan kanji. Kita mulai dari hiragana.' },
      { w: 'sensei', t: 'Hari ini 5 huruf vokal: あ い う え お. Dengarkan, lalu coba tulis, ya!' },
    ],
    brk: { npc: 'kenta', at: 'park', lines: [
      { n: 'Sepulang sekolah, seorang anak laki-laki menghampirimu di taman.' },
      { w: 'kenta', e: 'happy', jp: 'はじめまして！けんた です。', ro: 'hajimemashite! Kenta desu.', id: 'Senang berkenalan! Saya Kenta.' },
      { w: 'kenta', t: '"Hajimemashite" diucapkan saat pertama kali bertemu. "…desu" artinya "adalah".' },
      { q: 'Perkenalkan dirimu!', o: [
        { jp: 'はじめまして。{name} です。', ro: 'hajimemashite. {name} desu.', ok: true },
        { jp: 'さようなら。', ro: 'sayounara.', why: 'さようなら (sayounara) artinya "selamat tinggal". Kalian kan baru bertemu!' },
        { jp: 'いただきます。', ro: 'itadakimasu.', why: 'いただきます (itadakimasu) diucapkan sebelum makan.' },
      ]},
      { w: 'kenta', e: 'happy', jp: 'よろしく おねがいします！', ro: 'yoroshiku onegaishimasu!', id: 'Mohon bantuannya! (salam kenal)' },
      { q: 'Balas dengan sopan!', o: [
        { jp: 'よろしく おねがいします。', ro: 'yoroshiku onegaishimasu.', ok: true },
        { jp: 'おはよう。', ro: 'ohayou.', why: 'Kenta berkata "yoroshiku onegaishimasu". Balas dengan kalimat yang sama, ya.' },
      ]},
      { w: 'kenta', t: 'Bahasa Jepangmu lumayan! Sampai besok di sekolah!' },
    ]},
    phrases: [
      { jp: 'おはよう', ro: 'ohayou', id: 'Selamat pagi (santai)' },
      { jp: 'おはようございます', ro: 'ohayou gozaimasu', id: 'Selamat pagi (sopan)' },
      { jp: 'はじめまして', ro: 'hajimemashite', id: 'Senang berkenalan' },
      { jp: '〜です', ro: '~desu', id: 'Adalah … (sopan)' },
      { jp: 'よろしく おねがいします', ro: 'yoroshiku onegaishimasu', id: 'Mohon bantuannya / salam kenal' },
    ],
  },
  { // HARI 2
    title: 'Baris KA', sub: 'か き く け こ', type: 'lesson',
    kana: ['か','き','く','け','こ'],
    morning: { npc: 'kenta', at: 'home_front', lines: [
      { w: 'kenta', e: 'happy', jp: 'おはよう！げんき？', ro: 'ohayou! genki?', id: 'Pagi! Apa kabar?' },
      { q: 'Jawab: kamu sehat dan semangat!', o: [
        { jp: 'げんき です！', ro: 'genki desu!', ok: true },
        { jp: 'はじめまして。', ro: 'hajimemashite.', why: '"Hajimemashite" hanya untuk pertemuan pertama. Kita kan sudah kenal kemarin!' },
      ]},
      { w: 'kenta', e: 'happy', t: 'Mantap! "Genki desu" artinya "aku baik-baik saja". Ayo berangkat bareng!' },
    ]},
    cls: [
      { w: 'sensei', t: 'Kemarin kita belajar あいうえお. Hari ini baris KA: か き く け こ.' },
      { w: 'sensei', t: 'Tinggal tambahkan bunyi "k" di depan vokal: ka, ki, ku, ke, ko. Mudah, kan?' },
    ],
    brk: { npc: 'yuki', at: 'konbini', lines: [
      { n: 'Yuki baru keluar dari konbini membawa sebungkus permen.' },
      { w: 'yuki', e: 'happy', jp: 'はい、どうぞ！', ro: 'hai, douzo!', id: 'Ini, silakan!' },
      { q: 'Kamu menerima permen. Ucapkan…', o: [
        { jp: 'ありがとう！', ro: 'arigatou!', ok: true },
        { jp: 'ごめんね。', ro: 'gomen ne.', why: 'ごめんね (gomen ne) artinya "maaf". Yuki kan sedang memberimu hadiah.' },
      ]},
      { w: 'yuki', e: 'happy', jp: 'どういたしまして！', ro: 'dou itashimashite!', id: 'Sama-sama!' },
      { w: 'yuki', t: 'Kalau mau lebih sopan, bilang "arigatou gozaimasu".' },
    ]},
    phrases: [
      { jp: 'げんき？', ro: 'genki?', id: 'Apa kabar?' },
      { jp: 'げんき です', ro: 'genki desu', id: 'Saya baik-baik saja' },
      { jp: 'はい、どうぞ', ro: 'hai, douzo', id: 'Ini, silakan' },
      { jp: 'ありがとう ございます', ro: 'arigatou gozaimasu', id: 'Terima kasih (sopan)' },
      { jp: 'どういたしまして', ro: 'dou itashimashite', id: 'Sama-sama' },
    ],
  },
  { // HARI 3
    title: 'Baris SA', sub: 'さ し す せ そ', type: 'lesson',
    kana: ['さ','し','す','せ','そ'],
    morning: { npc: 'yuki', at: 'gate', lines: [
      { w: 'yuki', e: 'happy', jp: 'おはよう、{name}さん！', ro: 'ohayou, {name}-san!', id: 'Selamat pagi, {name}!' },
      { w: 'yuki', t: 'Di Jepang, kita menambahkan "-san" setelah nama orang lain supaya sopan.' },
      { q: 'Balas sapaan Yuki dengan sopan!', o: [
        { jp: 'おはよう、ゆきさん！', ro: 'ohayou, Yuki-san!', ok: true },
        { jp: 'おはよう、{name}さん！', ro: 'ohayou, {name}-san!', why: 'Jangan pakai "-san" untuk namamu sendiri! "-san" hanya untuk orang lain.' },
      ]},
      { w: 'yuki', e: 'happy', t: 'Sempurna! Ayo masuk, pelajaran mau dimulai.' },
    ]},
    cls: [
      { w: 'sensei', t: 'Hari ini baris SA: さ し す せ そ.' },
      { w: 'sensei', t: 'Hati-hati: し dibaca "shi", mirip "si" dalam bahasa Indonesia.' },
    ],
    brk: { npc: 'kenta', at: 'river', lines: [
      { n: 'Kenta sedang melempar batu ke sungai.' },
      { w: 'kenta', jp: '{name}さんは どこから きましたか？', ro: '{name}-san wa doko kara kimashita ka?', id: '{name} datang dari mana?' },
      { q: 'Jawab asal negaramu!', o: [
        { jp: 'インドネシアから きました。', ro: 'indoneshia kara kimashita.', ok: true },
        { jp: 'にほんから きました。', ro: 'nihon kara kimashita.', why: 'にほん (nihon) artinya Jepang. Kamu kan dari Indonesia: インドネシア (indoneshia).' },
      ]},
      { w: 'kenta', e: 'surprised', jp: 'へえ、すごい！', ro: 'hee, sugoi!', id: 'Wah, keren!' },
      { w: 'kenta', e: 'happy', t: 'Aku ingin sekali ke Bali suatu hari nanti!' },
    ]},
    phrases: [
      { jp: '〜さん', ro: '~san', id: 'Sapaan sopan setelah nama orang lain' },
      { jp: 'どこから きましたか', ro: 'doko kara kimashita ka', id: 'Datang dari mana?' },
      { jp: '〜から きました', ro: '~kara kimashita', id: 'Saya datang dari …' },
      { jp: 'すごい', ro: 'sugoi', id: 'Keren / hebat' },
    ],
  },
  { // HARI 4
    title: 'Baris TA', sub: 'た ち つ て と', type: 'lesson',
    kana: ['た','ち','つ','て','と'],
    morning: { npc: 'kenta', at: 'gate', lines: [
      { n: 'Kamu berlari karena hampir terlambat… BRUK! Kamu menabrak Kenta.' },
      { w: 'kenta', e: 'surprised', jp: 'いたっ！', ro: 'ita!', id: 'Aduh!' },
      { q: 'Minta maaf!', o: [
        { jp: 'すみません！', ro: 'sumimasen!', ok: true },
        { jp: 'ありがとう！', ro: 'arigatou!', why: 'Kamu baru saja menabrak orang. Ucapkan すみません (sumimasen) = maaf / permisi.' },
      ]},
      { w: 'kenta', e: 'happy', jp: 'だいじょうぶ！', ro: 'daijoubu!', id: 'Tidak apa-apa!' },
    ]},
    cls: [
      { w: 'sensei', t: 'Hari ini baris TA: た ち つ て と.' },
      { w: 'sensei', t: 'Perhatikan: ち dibaca "chi" (seperti "ci") dan つ dibaca "tsu".' },
    ],
    brk: { npc: 'yuki', at: 'park', lines: [
      { n: 'Yuki duduk di taman sambil membuka bekal.' },
      { w: 'yuki', e: 'happy', jp: 'いっしょに たべよう！', ro: 'issho ni tabeyou!', id: 'Ayo makan bersama!' },
      { q: 'Terima ajakan Yuki!', o: [
        { jp: 'うん、たべよう！', ro: 'un, tabeyou!', ok: true },
        { jp: 'いいえ。', ro: 'iie.', why: 'いいえ (iie) artinya "tidak". Yuki jadi sedih… Coba lagi!' },
      ]},
      { w: 'yuki', e: 'happy', t: 'Asyik! "Un" adalah cara santai bilang "iya". Versi sopannya "hai".' },
    ]},
    phrases: [
      { jp: 'すみません', ro: 'sumimasen', id: 'Maaf / permisi' },
      { jp: 'だいじょうぶ', ro: 'daijoubu', id: 'Tidak apa-apa' },
      { jp: 'いっしょに たべよう', ro: 'issho ni tabeyou', id: 'Ayo makan bersama' },
      { jp: 'うん / はい', ro: 'un / hai', id: 'Iya (santai / sopan)' },
      { jp: 'いいえ', ro: 'iie', id: 'Tidak' },
    ],
  },
  { // HARI 5 — ULANGAN
    title: 'Ulangan 1', sub: 'あ 〜 と', type: 'test', count: 15,
    morning: { npc: 'kenta', at: 'home_front', lines: [
      { w: 'kenta', e: 'sad', jp: 'きょうは テスト だ…', ro: 'kyou wa tesuto da…', id: 'Hari ini ada ulangan…' },
      { w: 'kenta', e: 'sad', t: 'Aku gugup sekali!' },
      { q: 'Semangati Kenta!', o: [
        { jp: 'がんばって！', ro: 'ganbatte!', ok: true },
        { jp: 'おやすみ！', ro: 'oyasumi!', why: 'Jangan suruh Kenta tidur! Ucapkan がんばって (ganbatte) = semangat!' },
      ]},
      { w: 'kenta', e: 'happy', jp: 'ありがとう！がんばる！', ro: 'arigatou! ganbaru!', id: 'Makasih! Aku akan berjuang!' },
    ]},
    cls: [
      { w: 'sensei', jp: 'では、テストを はじめます。', ro: 'dewa, tesuto o hajimemasu.', id: 'Baiklah, ulangan dimulai.' },
      { w: 'sensei', t: 'Soalnya berisi semua huruf yang sudah kamu pelajari minggu ini. Tenang saja!' },
    ],
    brk: { npc: 'yuki', at: 'gate', lines: [
      { w: 'yuki', jp: 'テスト、どうだった？', ro: 'tesuto, dou datta?', id: 'Ulangannya bagaimana?' },
      { q: 'Ceritakan ulanganmu!', o: [
        { jp: 'かんたん だった！', ro: 'kantan datta!', ok: true },
        { jp: 'まあまあ かな。', ro: 'maamaa kana.', ok: true },
      ]},
      { w: 'yuki', e: 'happy', jp: 'よかった！また あした ね！', ro: 'yokatta! mata ashita ne!', id: 'Syukurlah! Sampai besok, ya!' },
      { q: 'Balas salam perpisahan Yuki!', o: [
        { jp: 'また あした！', ro: 'mata ashita!', ok: true },
        { jp: 'はじめまして！', ro: 'hajimemashite!', why: 'Itu untuk pertemuan pertama. Untuk berpisah: また あした (mata ashita) = sampai besok.' },
      ]},
    ]},
    phrases: [
      { jp: 'がんばって', ro: 'ganbatte', id: 'Semangat! / Berjuanglah!' },
      { jp: 'どうだった？', ro: 'dou datta?', id: 'Bagaimana tadi?' },
      { jp: 'かんたん', ro: 'kantan', id: 'Mudah' },
      { jp: 'まあまあ', ro: 'maamaa', id: 'Lumayan' },
      { jp: 'また あした', ro: 'mata ashita', id: 'Sampai besok' },
    ],
  },
  { // HARI 6
    title: 'Baris NA', sub: 'な に ぬ ね の', type: 'lesson',
    kana: ['な','に','ぬ','ね','の'],
    morning: { npc: 'yuki', at: 'home_front', lines: [
      { w: 'yuki', e: 'happy', jp: 'おはよう！きょうは あついね。', ro: 'ohayou! kyou wa atsui ne.', id: 'Pagi! Hari ini panas, ya.' },
      { q: 'Setujui Yuki!', o: [
        { jp: 'そうだね。', ro: 'sou da ne.', ok: true },
        { jp: 'さむいね。', ro: 'samui ne.', why: 'さむい (samui) artinya dingin. Yuki bilang あつい (atsui) = panas!' },
      ]},
      { w: 'yuki', t: '"Sou da ne" artinya "iya, ya". Sering dipakai untuk setuju.' },
    ]},
    cls: [
      { w: 'sensei', t: 'Hari ini baris NA: な に ぬ ね の.' },
      { w: 'sensei', t: 'Ingat: に mirip angka 二, dan "ni" memang artinya dua!' },
    ],
    brk: { npc: 'kenta', at: 'park', lines: [
      { n: 'Kenta membuka bekal makan siangnya di taman.' },
      { w: 'kenta', e: 'happy', jp: 'じゃあ、たべよう！', ro: 'jaa, tabeyou!', id: 'Nah, ayo makan!' },
      { q: 'Sebelum makan, orang Jepang mengucapkan…', o: [
        { jp: 'いただきます！', ro: 'itadakimasu!', ok: true },
        { jp: 'ごちそうさまでした！', ro: 'gochisousama deshita!', why: 'Itu diucapkan SETELAH selesai makan.' },
      ]},
      { n: 'Nyam nyam… Bekalnya habis!' },
      { q: 'Selesai makan, ucapkan…', o: [
        { jp: 'ごちそうさまでした！', ro: 'gochisousama deshita!', ok: true },
        { jp: 'いただきます！', ro: 'itadakimasu!', why: 'いただきます diucapkan SEBELUM makan. Sekarang kamu sudah selesai makan.' },
      ]},
      { w: 'kenta', e: 'happy', t: 'Kamu sudah seperti orang Jepang asli!' },
    ]},
    phrases: [
      { jp: 'あつい / さむい', ro: 'atsui / samui', id: 'Panas / dingin' },
      { jp: 'そうだね', ro: 'sou da ne', id: 'Iya, ya (setuju)' },
      { jp: 'いただきます', ro: 'itadakimasu', id: 'Diucapkan sebelum makan' },
      { jp: 'ごちそうさまでした', ro: 'gochisousama deshita', id: 'Diucapkan setelah makan' },
    ],
  },
  { // HARI 7
    title: 'Baris HA', sub: 'は ひ ふ へ ほ', type: 'lesson',
    kana: ['は','ひ','ふ','へ','ほ'],
    morning: { npc: 'kenta', at: 'gate', lines: [
      { n: 'Kenta sedang membaca sesuatu yang penuh gambar.' },
      { q: 'Tanyakan pada Kenta: "Itu apa?"', o: [
        { jp: 'それは なんですか？', ro: 'sore wa nan desu ka?', ok: true },
        { jp: 'これは ほん です。', ro: 'kore wa hon desu.', why: 'Itu pernyataan ("ini buku"), bukan pertanyaan. Kata tanya "apa" = なん (nan).' },
      ]},
      { w: 'kenta', e: 'happy', jp: 'これは まんが です！', ro: 'kore wa manga desu!', id: 'Ini manga!' },
      { w: 'kenta', t: 'Aku bilang これ (kore) karena bendanya dekat aku. Kamu bilang それ (sore) karena dekat lawan bicara.' },
    ]},
    cls: [
      { w: 'sensei', t: 'Hari ini baris HA: は ひ ふ へ ほ.' },
      { w: 'sensei', t: 'Catatan: saat jadi partikel, は dibaca "wa", seperti di "watashi wa".' },
    ],
    brk: { npc: 'yuki', at: 'konbini', lines: [
      { n: 'Yuki menunjuk camilan di tanganmu.' },
      { w: 'yuki', jp: 'それは なに？', ro: 'sore wa nani?', id: 'Itu apa?' },
      { q: 'Camilan itu ada di tanganmu. Jawab!', o: [
        { jp: 'これは おかし です。', ro: 'kore wa okashi desu.', ok: true },
        { jp: 'それは おかし です。', ro: 'sore wa okashi desu.', why: 'Bendanya dekat KAMU, jadi pakai これ (kore). それ (sore) untuk benda yang dekat lawan bicara.' },
      ]},
      { w: 'yuki', e: 'happy', jp: 'わあ、おいしそう！', ro: 'waa, oishisou!', id: 'Wah, kelihatannya enak!' },
    ]},
    phrases: [
      { jp: 'これ / それ / あれ', ro: 'kore / sore / are', id: 'Ini / itu (dekat lawan) / itu (jauh)' },
      { jp: 'なんですか', ro: 'nan desu ka', id: 'Apa? (sopan)' },
      { jp: 'おかし', ro: 'okashi', id: 'Camilan / permen' },
    ],
  },
  { // HARI 8
    title: 'Baris MA', sub: 'ま み む め も', type: 'lesson',
    kana: ['ま','み','む','め','も'],
    morning: { npc: 'yuki', at: 'gate', lines: [
      { w: 'yuki', jp: 'すきな たべものは？', ro: 'suki na tabemono wa?', id: 'Makanan favoritmu apa?' },
      { q: 'Jawab makanan favoritmu!', o: [
        { jp: 'ナシゴレンが すきです！', ro: 'nashigoren ga suki desu!', ok: true },
        { jp: 'きらい です。', ro: 'kirai desu.', why: 'きらい (kirai) artinya "tidak suka". Yuki bertanya makanan FAVORIT-mu.' },
      ]},
      { w: 'yuki', e: 'happy', jp: 'わたしは すしが すき！', ro: 'watashi wa sushi ga suki!', id: 'Aku suka sushi!' },
    ]},
    cls: [
      { w: 'sensei', t: 'Hari ini baris MA: ま み む め も.' },
      { w: 'sensei', t: 'Fakta menarik: め (me) artinya "mata". Bentuknya pun seperti mata, kan?' },
    ],
    brk: { npc: 'kenta', at: 'konbini', lines: [
      { n: 'Kenta memberimu kue berbentuk ikan: taiyaki.' },
      { w: 'kenta', jp: 'たべて みて！', ro: 'tabete mite!', id: 'Coba makan!' },
      { q: 'Rasanya enak sekali! Katakan…', o: [
        { jp: 'おいしい！', ro: 'oishii!', ok: true },
        { jp: 'まずい…', ro: 'mazui…', why: 'まずい (mazui) artinya "tidak enak". Kenta bisa sedih! Enak = おいしい (oishii).' },
      ]},
      { w: 'kenta', e: 'happy', jp: 'でしょう！', ro: 'deshou!', id: 'Benar, kan!' },
    ]},
    phrases: [
      { jp: 'すきな たべもの', ro: 'suki na tabemono', id: 'Makanan favorit' },
      { jp: '〜が すき', ro: '~ga suki', id: 'Suka …' },
      { jp: 'きらい', ro: 'kirai', id: 'Tidak suka' },
      { jp: 'おいしい / まずい', ro: 'oishii / mazui', id: 'Enak / tidak enak' },
    ],
  },
  { // HARI 9
    title: 'Baris YA & RA', sub: 'や ゆ よ ら り る れ ろ', type: 'lesson',
    kana: ['や','ゆ','よ','ら','り','る','れ','ろ'],
    morning: { npc: 'kenta', at: 'home_front', lines: [
      { w: 'kenta', e: 'sad', jp: 'ふわあ… ねむい…', ro: 'fuwaa… nemui…', id: 'Hoaam… ngantuk…' },
      { q: 'Tanya Kenta: "Sekarang jam berapa?"', o: [
        { jp: 'いま なんじ？', ro: 'ima nanji?', ok: true },
        { jp: 'いま どこ？', ro: 'ima doko?', why: 'どこ (doko) artinya "di mana". Jam berapa = なんじ (nanji).' },
      ]},
      { w: 'kenta', e: 'surprised', jp: 'はちじ！？ちこく だ！', ro: 'hachiji!? chikoku da!', id: 'Jam 8!? Kita terlambat!' },
    ]},
    cls: [
      { w: 'sensei', t: 'Hari ini dua baris: YA (や ゆ よ) dan RA (ら り る れ ろ).' },
      { w: 'sensei', t: 'Bunyi "r" bahasa Jepang itu lembut, di antara "r" dan "l".' },
    ],
    brk: { npc: 'yuki', at: 'gate', lines: [
      { w: 'yuki', e: 'happy', jp: 'きょう、いっしょに かえろう？', ro: 'kyou, issho ni kaerou?', id: 'Hari ini pulang bareng, yuk?' },
      { q: 'Terima ajakan Yuki!', o: [
        { jp: 'いいよ！', ro: 'ii yo!', ok: true },
        { jp: 'ごめん、ようじが ある。', ro: 'gomen, youji ga aru.', why: 'Artinya "maaf, aku ada urusan". Boleh saja, tapi Yuki berharap sekali… Coba terima ajakannya!' },
      ]},
      { w: 'yuki', e: 'happy', t: 'Asyik! "Ii yo" artinya "boleh / oke".' },
    ]},
    phrases: [
      { jp: 'ねむい', ro: 'nemui', id: 'Mengantuk' },
      { jp: 'いま なんじ？', ro: 'ima nanji?', id: 'Sekarang jam berapa?' },
      { jp: 'いいよ', ro: 'ii yo', id: 'Boleh / oke' },
      { jp: 'ごめん', ro: 'gomen', id: 'Maaf (santai)' },
    ],
  },
  { // HARI 10
    title: 'Huruf Terakhir', sub: 'わ を ん', type: 'lesson',
    kana: ['わ','を','ん'],
    morning: { npc: 'yuki', at: 'gate', lines: [
      { w: 'yuki', e: 'happy', jp: 'きょうで ひらがな ぜんぶ だね！', ro: 'kyou de hiragana zenbu da ne!', id: 'Hari ini hiragana-mu lengkap, ya!' },
      { q: 'Tunjukkan semangatmu!', o: [
        { jp: 'がんばる！', ro: 'ganbaru!', ok: true },
        { jp: 'つまらない。', ro: 'tsumaranai.', why: 'つまらない (tsumaranai) artinya "membosankan". Tunjukkan semangat: がんばる (ganbaru)!' },
      ]},
    ]},
    cls: [
      { w: 'sensei', t: 'Huruf terakhir: わ を ん.' },
      { w: 'sensei', t: 'を dibaca "o" dan hanya dipakai sebagai partikel. Contoh: ほんを よむ (membaca buku).' },
      { w: 'sensei', t: 'ん satu-satunya huruf yang hanya berupa konsonan: "n".' },
    ],
    brk: { npc: 'kenta', at: 'river', lines: [
      { w: 'kenta', jp: 'にほんの せいかつは どう？', ro: 'nihon no seikatsu wa dou?', id: 'Bagaimana hidup di Jepang?' },
      { q: 'Ungkapkan perasaanmu!', o: [
        { jp: 'たのしい です！', ro: 'tanoshii desu!', ok: true },
        { jp: 'わかりません。', ro: 'wakarimasen.', why: 'わかりません (wakarimasen) artinya "saya tidak mengerti". Coba bilang たのしい (tanoshii) = menyenangkan!' },
      ]},
      { w: 'kenta', e: 'happy', jp: 'よかった！', ro: 'yokatta!', id: 'Syukurlah!' },
    ]},
    phrases: [
      { jp: 'がんばる', ro: 'ganbaru', id: 'Aku akan berusaha' },
      { jp: 'たのしい', ro: 'tanoshii', id: 'Menyenangkan' },
      { jp: 'わかりません', ro: 'wakarimasen', id: 'Saya tidak mengerti' },
      { jp: '〜を', ro: '~o', id: 'Partikel penanda objek' },
    ],
  },
  { // HARI 11 — UJIAN AKHIR
    title: 'Ujian Akhir', sub: 'Semua hiragana', type: 'test', count: 20,
    morning: { npc: 'yuki', with: 'kenta', at: 'gate', lines: [
      { w: 'yuki', jp: 'いよいよ しけん だね。', ro: 'iyoiyo shiken da ne.', id: 'Akhirnya ujian, ya.' },
      { w: 'kenta', e: 'happy', jp: 'みんなで がんばろう！', ro: 'minna de ganbarou!', id: 'Ayo berjuang bersama!' },
      { q: 'Jawab ajakan mereka!', o: [
        { jp: 'うん、がんばろう！', ro: 'un, ganbarou!', ok: true },
        { jp: 'いいえ。', ro: 'iie.', why: 'いいえ artinya "tidak". Ayo semangat bersama teman-teman!' },
      ]},
    ]},
    cls: [
      { w: 'sensei', jp: 'しけんを はじめます。がんばって ください。', ro: 'shiken o hajimemasu. ganbatte kudasai.', id: 'Ujian dimulai. Berjuanglah.' },
    ],
    brk: { npc: 'yuki', with: 'kenta', at: 'park', lines: [
      { w: 'yuki', e: 'happy', jp: 'おめでとう！', ro: 'omedetou!', id: 'Selamat!' },
      { w: 'kenta', e: 'happy', t: 'Kamu sudah bisa membaca semua hiragana dalam 11 hari. Keren!' },
      { q: 'Balas ucapan selamat mereka!', o: [
        { jp: 'ありがとう！みんなの おかげ です。', ro: 'arigatou! minna no okage desu.', ok: true },
        { jp: 'すみません。', ro: 'sumimasen.', why: 'Tidak perlu minta maaf! Ucapkan terima kasih: ありがとう.' },
      ]},
      { w: 'yuki', e: 'happy', t: 'Berikutnya kita belajar katakana! Sampai jumpa di semester depan!' },
    ]},
    phrases: [
      { jp: 'しけん', ro: 'shiken', id: 'Ujian' },
      { jp: 'おめでとう', ro: 'omedetou', id: 'Selamat!' },
      { jp: 'みんなの おかげ', ro: 'minna no okage', id: 'Berkat kalian semua' },
      { jp: 'がんばろう', ro: 'ganbarou', id: 'Ayo berjuang!' },
    ],
  },
];

// Warga kota: kalimat berganti setiap hari (dipilih berdasarkan nomor hari)
const AMBIENT = {
  obaa: [
    [{ w: 'obaa', e: 'happy', jp: 'こんにちは。', ro: 'konnichiwa.', id: 'Selamat siang.' },
     { w: 'obaa', t: 'Kalau bertemu orang di siang hari, ucapkan "konnichiwa", Nak.' }],
    [{ w: 'obaa', e: 'happy', jp: 'いい てんき ですね。', ro: 'ii tenki desu ne.', id: 'Cuacanya bagus, ya.' },
     { w: 'obaa', t: 'Orang Jepang suka membuka obrolan dengan membicarakan cuaca.' }],
    [{ w: 'obaa', jp: 'きを つけて ね。', ro: 'ki o tsukete ne.', id: 'Hati-hati, ya.' },
     { w: 'obaa', t: 'Itu ucapan untuk orang yang akan pergi.' }],
  ],
  tenin: [
    [{ w: 'tenin', e: 'happy', jp: 'いらっしゃいませ！', ro: 'irasshaimase!', id: 'Selamat datang!' },
     { w: 'tenin', t: 'Maaf, toko sedang direnovasi. Buka lagi di Bab 2 (Katakana)!' }],
    [{ w: 'tenin', jp: 'また おこしください。', ro: 'mata okoshi kudasai.', id: 'Silakan datang lagi.' },
     { w: 'tenin', t: 'Papan toko ini ditulis dengan katakana. Nanti kamu juga bisa membacanya!' }],
  ],
  kid: [
    [{ w: 'kid', e: 'happy', jp: 'ねえねえ、あそぼう！', ro: 'nee nee, asobou!', id: 'Hei hei, ayo main!' },
     { w: 'kid', t: 'Hehe, aku Sora. Aku suka melihat ikan di sungai.' }],
    [{ w: 'kid', e: 'surprised', jp: 'かわに さかなが いるよ！', ro: 'kawa ni sakana ga iru yo!', id: 'Ada ikan di sungai!' },
     { w: 'kid', t: 'さかな (sakana) artinya ikan!' }],
  ],
  ojii: [
    [{ w: 'ojii', jp: 'でんしゃは まだ こないよ。', ro: 'densha wa mada konai yo.', id: 'Keretanya belum datang.' },
     { w: 'ojii', t: 'Stasiun akan dibuka di bab berikutnya. Belajar yang rajin, ya!' }],
    [{ w: 'ojii', e: 'happy', jp: 'がんばってる ね。', ro: 'ganbatteru ne.', id: 'Kamu rajin, ya.' },
     { w: 'ojii', t: 'Sedikit demi sedikit, lama-lama jadi bukit. Begitu juga belajar bahasa!' }],
  ],
};

// Kalimat penutup malam hari
const NIGHT_LINES = [
  'Hari yang melelahkan, tapi seru!',
  'Kamu membuka buku catatan dan mengulang huruf hari ini.',
  'Di luar jendela, bulan bersinar terang.',
  'Besok pasti lebih seru lagi!',
];
