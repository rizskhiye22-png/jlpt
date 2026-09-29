/* =========================================================
   DATA BAGIAN 3 — VARIASI HARIAN
   Supaya setiap hari terasa berbeda:
   - Kejadian Harian (★) di kota, berbeda tiap hari
   - Cuaca (cerah / berawan / hujan)
   - Makan siang spesial yang berganti
   - Klub unggulan hari ini
   - Pilihan cara latihan setelah video (berbeda tiap hari)
   ========================================================= */

Object.assign(CHARACTERS, {
  mai:     { name: 'Mai',            color: '#e0608a' },
  emma:    { name: 'Emma (turis)',   color: '#3f6fb0' },
  omawari: { name: 'Pak Polisi',     color: '#2f4378' },
  ryo:     { name: 'Ryo (musisi)',   color: '#7a5a90' },
  imoya:   { name: 'Paman Ubi',      color: '#8a5a36' },
});

// Urutan cara latihan; setiap hari muncul 3 pilihan yang berbeda
const ACTIVITY_ROTATION = ['karuta', 'catch', 'builder', 'speed', 'kanahunt', 'wordmatch', 'dictation'];
function activitiesFor(n) {
  const L = ACTIVITY_ROTATION.length, out = [];
  for (const off of [0, 3, 5]) { const a = ACTIVITY_ROTATION[(n * 2 + off) % L]; if (!out.includes(a)) out.push(a); }
  return out;
}

// Cuaca per hari
function weatherFor(n) {
  if ([3, 8, 14, 19].includes(n)) return 'rain';
  if ([6, 11, 17, 21].includes(n)) return 'cloud';
  return 'sun';
}

// Klub unggulan (poin ganda) bergiliran
function featuredClub(n) { return ['shodo', 'karuta', 'ryouri', 'hoka'][n % 4]; }

/* ---------- Kejadian Harian ---------- */
const EVENTS = {
  maigo: { title: 'Anak yang tersesat', npc: 'mai', at: [9, 15], lines: [
    { n: 'Seorang anak kecil menangis di dekat kolam.' },
    { w: 'mai', e: 'sad', jp: 'おかあさん… どこ…？', ro: 'okaasan… doko…?', id: 'Ibu… di mana…?' },
    { q: 'Hibur dia dengan lembut!', o: [
      { jp: 'だいじょうぶ？', ro: 'daijoubu?', ok: true },
      { jp: 'うるさい！', ro: 'urusai!', why: 'うるさい = berisik! Kasihan dia. Tanyakan: だいじょうぶ？ (kamu tidak apa-apa?)' },
    ]},
    { w: 'mai', e: 'sad', jp: 'おかあさん が いないの…', ro: 'okaasan ga inai no…', id: 'Ibuku tidak ada…' },
    { q: 'Tanyakan namanya!', o: [
      { jp: 'おなまえ は？', ro: 'onamae wa?', ok: true },
      { jp: 'いま なんじ？', ro: 'ima nanji?', why: 'なんじ = jam berapa. Untuk nama: おなまえ は？' },
    ]},
    { w: 'mai', jp: 'まい…', ro: 'Mai…', id: 'Mai…' },
    { n: 'Kamu mengantar Mai ke pos polisi (こうばん). Ibunya sudah menunggu di sana!' },
    { w: 'mai', e: 'happy', jp: 'ありがとう！', ro: 'arigatou!', id: 'Terima kasih!' },
  ]},
  tourist: { title: 'Turis bertanya jalan', npc: 'emma', at: [20, 20], lines: [
    { w: 'emma', jp: 'すみません… えき は どこ ですか？', ro: 'sumimasen… eki wa doko desu ka?', id: 'Permisi… stasiun di mana?' },
    { q: 'Stasiunnya ada di sebelah sana. Jawab!', o: [
      { jp: 'あそこ です！', ro: 'asoko desu!', ok: true },
      { jp: 'ここ です！', ro: 'koko desu!', why: 'ここ = di sini. Stasiunnya agak jauh: あそこ (di sana).' },
    ]},
    { w: 'emma', e: 'happy', jp: 'ありがとう！にほんご、じょうず ですね！', ro: 'arigatou! nihongo, jouzu desu ne!', id: 'Terima kasih! Bahasa Jepangmu pandai, ya!' },
    { q: 'Orang Jepang merendah saat dipuji. Jawab…', o: [
      { jp: 'いえいえ、まだ まだ です。', ro: 'ie ie, mada mada desu.', ok: true },
      { jp: 'はい、じょうず です！', ro: 'hai, jouzu desu!', why: 'Di Jepang, saat dipuji biasanya merendah: いえいえ、まだ まだ です (ah, masih belum apa-apa).' },
    ]},
    { w: 'emma', e: 'happy', t: 'Aku juga sedang belajar bahasa Jepang. Semangat kita berdua!' },
  ]},
  kasa: { title: 'Hujan tiba-tiba', npc: 'kenta', at: [12, 8], weather: 'rain', lines: [
    { n: 'Hujan turun deras! Kenta berdiri di dekat gerbang tanpa payung.' },
    { w: 'kenta', e: 'sad', jp: 'かさ を わすれた…', ro: 'kasa o wasureta…', id: 'Aku lupa bawa payung…' },
    { q: 'Tawarkan payungmu!', o: [
      { jp: 'いっしょに はいろう！', ro: 'issho ni hairou!', ok: true },
      { jp: 'がんばって！', ro: 'ganbatte!', why: 'Kenta bisa basah kuyup! Ajak dia berbagi payung: いっしょに はいろう (masuk bersama, yuk).' },
    ]},
    { w: 'kenta', e: 'happy', jp: 'たすかる！ありがとう！', ro: 'tasukaru! arigatou!', id: 'Tertolong! Makasih!' },
    { n: 'Kalian berjalan di bawah satu payung. あめ (ame) = hujan, かさ (kasa) = payung.' },
  ]},
  music: { title: 'Musisi jalanan', npc: 'ryo', at: [10, 18], lines: [
    { n: 'Seorang pemuda bermain gitar di taman. Lagunya indah sekali!' },
    { w: 'ryo', e: 'happy', jp: 'きいて くれて ありがとう！', ro: 'kiite kurete arigatou!', id: 'Terima kasih sudah mendengarkan!' },
    { q: 'Puji lagunya!', o: [
      { jp: 'すてき な うた！', ro: 'suteki na uta!', ok: true },
      { jp: 'じょうず ですね！', ro: 'jouzu desu ne!', ok: true },
      { jp: 'へた…', ro: 'heta…', why: 'へた = payah. Kasihan! Puji dia: すてき (indah) atau じょうず (pandai).' },
    ]},
    { w: 'ryo', jp: 'おんがく は すき？', ro: 'ongaku wa suki?', id: 'Kamu suka musik?' },
    { q: 'Jawab!', o: [{ jp: 'だいすき！', ro: 'daisuki!', ok: true }, { jp: 'すこし。', ro: 'sukoshi.', ok: true }] },
    { w: 'ryo', e: 'happy', t: 'うた (uta) = lagu, おんがく (ongaku) = musik. Sampai jumpa lagi!' },
  ]},
  police: { title: 'Pak Polisi berpatroli', npc: 'omawari', at: [9, 12], lines: [
    { w: 'omawari', jp: 'こんばんは。はやく かえりなさい ね。', ro: 'konbanwa. hayaku kaerinasai ne.', id: 'Selamat sore. Cepat pulang, ya.' },
    { q: 'Jawab dengan sopan!', o: [
      { jp: 'はい、ありがとう ございます！', ro: 'hai, arigatou gozaimasu!', ok: true },
      { jp: 'いやだ！', ro: 'iya da!', why: 'いやだ = tidak mau! Kurang sopan kepada polisi. Jawab: はい、ありがとう ございます.' },
    ]},
    { w: 'omawari', e: 'happy', t: 'Pos polisi kecil di Jepang disebut こうばん (kouban). Kalau tersesat, datang saja ke sana.' },
  ]},
  race: { title: 'Lomba lari', npc: 'kenta', at: [16, 11], game: 'speed', lines: [
    { w: 'kenta', e: 'happy', jp: 'きょうそう しよう！', ro: 'kyousou shiyou!', id: 'Ayo lomba!' },
    { w: 'kenta', t: 'Tapi lombanya "lomba membaca"! Jawab benar atau salah secepat kilat. よーい、どん！ (Siap, mulai!)' },
  ]},
  imo: { title: 'Penjual ubi bakar', npc: 'imoya', at: [7, 12], lines: [
    { n: 'Terdengar lagu dari truk kecil: 「いしやき いも〜 おいしい いも〜♪」' },
    { w: 'imoya', e: 'happy', jp: 'やきいも、どう？あつい よ！', ro: 'yakiimo, dou? atsui yo!', id: 'Ubi bakar, mau? Masih panas!' },
    { q: 'Pesan ubi bakar!', o: [
      { jp: 'ひとつ ください！', ro: 'hitotsu kudasai!', ok: true },
      { jp: 'ふたつ ください！', ro: 'futatsu kudasai!', ok: true },
    ]},
    { n: 'Hangat dan manis! Ubi bakar batu (いしやきいも) dijual dari truk kecil sambil memutar lagu khas.' },
    { w: 'imoya', e: 'happy', jp: 'まいど あり！', ro: 'maido ari!', id: 'Terima kasih sudah membeli!' },
  ]},
  hanabi: { title: 'Kembang api kecil', npc: 'yuki', at: [18, 22], lines: [
    { n: 'Yuki membawa kembang api kecil (せんこう はなび) ke tepi sungai.' },
    { w: 'yuki', e: 'happy', jp: 'いっしょに やろう！', ro: 'issho ni yarou!', id: 'Ayo main bersama!' },
    { q: 'Kembang apinya menyala! Katakan…', o: [
      { jp: 'きれい！', ro: 'kirei!', ok: true },
      { jp: 'きたない！', ro: 'kitanai!', why: 'きたない = kotor. Kembang apinya indah: きれい!' },
    ]},
    { w: 'yuki', e: 'happy', jp: 'すてき な おもいで だね。', ro: 'suteki na omoide da ne.', id: 'Kenangan yang indah, ya.' },
  ]},
  photo: { title: 'Foto bersama', npc: 'yuki', at: [21, 6], lines: [
    { w: 'yuki', e: 'happy', jp: 'しゃしん、とろう！', ro: 'shashin, torou!', id: 'Ayo foto!' },
    { w: 'yuki', t: 'Saat difoto, orang Jepang bilang "はい、チーズ！" atau berpose V sambil bilang "ピース！".' },
    { q: 'Pose!', o: [{ jp: 'ピース！', ro: 'piisu!', ok: true }, { jp: 'チーズ！', ro: 'chiizu!', ok: true }] },
    { n: 'Cekrek! しゃしん (shashin) = foto.' },
  ]},
  wallet: { title: 'Dompet yang terjatuh', npc: 'omawari', at: [12, 12], lines: [
    { n: 'Kamu menemukan sebuah dompet di jalan. Ada pos polisi di dekat sini.' },
    { q: 'Apa yang kamu lakukan?', o: [
      { jp: 'こうばん に とどける。', ro: 'kouban ni todokeru.', ok: true },
      { jp: 'ポケット に いれる。', ro: 'poketto ni ireru.', why: 'Di Jepang, barang temuan selalu diantar ke こうばん. Kejujuran itu penting!' },
    ]},
    { w: 'omawari', e: 'happy', jp: 'えらい ね！ありがとう。', ro: 'erai ne! arigatou.', id: 'Hebat! Terima kasih.' },
    { n: 'Di Jepang, banyak dompet yang hilang kembali ke pemiliknya berkat orang jujur sepertimu.' },
  ]},
  study: { title: 'Kuis dari Hana', npc: 'hana', at: [8, 20], game: 'kanahunt', lines: [
    { w: 'hana', e: 'happy', jp: 'もじ の クイズ、だす よ！', ro: 'moji no kuizu, dasu yo!', id: 'Aku kasih kuis huruf, ya!' },
    { w: 'hana', t: 'Cari huruf yang kusebut di antara huruf-huruf yang mirip. Teliti, ya!' },
  ]},
  gift: { title: 'Hadiah dari Mai', npc: 'mai', at: [5, 12], lines: [
    { w: 'mai', e: 'happy', jp: 'これ、あげる！', ro: 'kore, ageru!', id: 'Ini, untukmu!' },
    { n: 'Mai memberimu gambar buatannya: kamu dan Mai bergandengan tangan.' },
    { q: 'Terima hadiahnya!', o: [
      { jp: 'ありがとう！うれしい！', ro: 'arigatou! ureshii!', ok: true },
      { jp: 'いらない。', ro: 'iranai.', why: 'いらない = tidak perlu. Mai bisa sedih! Ucapkan: ありがとう！うれしい！' },
    ]},
    { w: 'mai', e: 'happy', t: 'あげる = memberi, もらう = menerima. Hehe!' },
  ]},
  food: { title: 'Rekomendasi makanan', npc: 'emma', at: [22, 12], lines: [
    { w: 'emma', jp: 'おすすめ の たべもの は？', ro: 'osusume no tabemono wa?', id: 'Makanan apa yang kamu rekomendasikan?' },
    { q: 'Rekomendasikan makanan!', o: [
      { jp: 'ラーメン！', ro: 'raamen!', ok: true }, { jp: 'たこやき！', ro: 'takoyaki!', ok: true }, { jp: 'おにぎり！', ro: 'onigiri!', ok: true },
    ]},
    { w: 'emma', e: 'happy', jp: 'たべて みます！', ro: 'tabete mimasu!', id: 'Akan kucoba!' },
  ]},
  sunset: { title: 'Senja di sungai', npc: 'ojii', at: [15, 22], lines: [
    { w: 'ojii', jp: 'ゆうひ が きれい だ ね。', ro: 'yuuhi ga kirei da ne.', id: 'Matahari terbenamnya indah, ya.' },
    { q: 'Setujui Kakek!', o: [{ jp: 'ほんとう に きれい！', ro: 'hontou ni kirei!', ok: true }, { jp: 'そう です ね。', ro: 'sou desu ne.', ok: true }] },
    { w: 'ojii', e: 'happy', t: 'ゆうひ (yuuhi) = matahari terbenam. Setiap hari itu berharga. Belajar yang rajin, ya.' },
  ]},
};
// Kejadian untuk setiap hari (1..22) — semuanya berbeda dari hari sebelumnya
const EVENT_BY_DAY = [null,
  'maigo', 'music', 'kasa', 'imo', 'race', 'police', 'photo', 'kasa', 'tourist', 'hanabi', 'sunset',
  'gift', 'food', 'kasa', 'study', 'race', 'wallet', 'music', 'kasa', 'photo', 'hanabi', null];

/* ---------- Makan siang spesial (pilihan ke-4, berganti tiap hari) ---------- */
const LUNCH_SPECIAL = [
  { label: 'Kantin: beli yakisoba-pan', lines: [
    { n: 'Kantin sekolah penuh murid yang berebut roti!' },
    { q: 'Pesan roti di kantin!', o: [
      { jp: 'やきそばパン、ひとつ ください！', ro: 'yakisoba pan, hitotsu kudasai!', ok: true },
      { jp: 'ごちそうさま！', ro: 'gochisousama!', why: 'Itu diucapkan setelah makan. Untuk memesan: 〜を ひとつ ください.' },
    ]},
    { n: 'Yakisoba-pan: roti isi mi goreng. Makanan kantin paling populer di Jepang!' },
  ]},
  { label: 'Ruang musik: dengar Kenta bermain gitar', who: 'kenta', lines: [
    { w: 'kenta', e: 'happy', jp: 'きいて！あたらしい きょく！', ro: 'kiite! atarashii kyoku!', id: 'Dengar! Lagu baru!' },
    { q: 'Puji permainannya!', o: [{ jp: 'かっこいい！', ro: 'kakkoii!', ok: true }, { jp: 'うるさい。', ro: 'urusai.', why: 'うるさい = berisik. Kenta sudah berlatih keras! Bilang かっこいい (keren).' }] },
  ]},
  { label: 'Kebun sekolah: menyiram bunga', who: 'yuki', lines: [
    { w: 'yuki', jp: 'はな に みず を あげよう。', ro: 'hana ni mizu o ageyou.', id: 'Ayo beri air pada bunga.' },
    { q: 'Bunganya mekar indah. Katakan…', o: [{ jp: 'きれい な はな！', ro: 'kirei na hana!', ok: true }, { jp: 'おいしい はな！', ro: 'oishii hana!', why: 'Bunga itu tidak dimakan, hehe. Pakai きれい (indah).' }] },
    { w: 'yuki', e: 'happy', t: 'みず (mizu) = air, はな (hana) = bunga.' },
  ]},
  { label: 'Lapangan: main voli bersama', who: 'kenta', lines: [
    { w: 'kenta', e: 'happy', jp: 'いくよ！', ro: 'iku yo!', id: 'Aku oper, ya!' },
    { q: 'Bolanya datang! Serukan…', o: [{ jp: 'まかせて！', ro: 'makasete!', ok: true }, { jp: 'おやすみ！', ro: 'oyasumi!', why: 'Bukan waktunya tidur! まかせて = serahkan padaku!' }] },
    { w: 'kenta', e: 'happy', jp: 'ナイス！', ro: 'naisu!', id: 'Bagus! (dari "nice")' },
  ]},
  { label: 'Taman belakang: melihat kucing sekolah', lines: [
    { n: 'Di taman belakang ada kucing oranye yang tidur di bawah pohon.' },
    { q: 'Sapa kucingnya!', o: [{ jp: 'ねこ ちゃん、こんにちは！', ro: 'neko-chan, konnichiwa!', ok: true }, { jp: 'いぬ だ！', ro: 'inu da!', why: 'Itu kucing (ねこ), bukan anjing (いぬ)!' }] },
    { n: 'Kucing itu mengeong "にゃあ" lalu tidur lagi. Damai sekali.' },
  ]},
  { label: 'Ruang guru: bertanya pada sensei', who: 'sensei', lines: [
    { w: 'sensei', e: 'happy', jp: 'しつもん が ありますか？', ro: 'shitsumon ga arimasu ka?', id: 'Ada pertanyaan?' },
    { q: 'Tanyakan dengan sopan!', o: [{ jp: 'はい、おしえて ください！', ro: 'hai, oshiete kudasai!', ok: true }, { jp: 'べつに。', ro: 'betsuni.', why: 'べつに = tidak juga (kesannya cuek). Jawab sopan: おしえて ください (tolong ajari saya).' }] },
    { w: 'sensei', e: 'happy', t: 'Rahasia belajar: sedikit tapi setiap hari. Coba Ulasan Harian di menu, ya!' },
  ]},
  { label: 'Piknik di halaman bersama semua teman', lines: [
    { n: 'Semua teman sekelas makan bersama di halaman di bawah pohon sakura.' },
    { q: 'Sebelum makan bersama, ucapkan…', o: [{ jp: 'いただきます！', ro: 'itadakimasu!', ok: true }, { jp: 'いってきます！', ro: 'ittekimasu!', why: 'いってきます diucapkan saat berangkat. Sebelum makan: いただきます!' }] },
    { n: 'Makan bersama di bawah sakura disebut おはなみ (ohanami).' },
  ]},
];
