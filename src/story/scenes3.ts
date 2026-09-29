/* =========================================================
   ADEGAN CERITA BAB 3 「てんてん と すうじ」 (design/03)
   Kafe Hanamizuki & kerja paruh waktu, pantai うみ, Kakek Mori di kafe,
   rapat warga, おはぎ Nenek, Pasar Pagi, Surat #5–#6.
   ========================================================= */
import type { Scene } from './types';

const ok = (jp: string, ro: string) => ({ jp, ro, ok: true });
const no = (jp: string, ro: string, why: string) => ({ jp, ro, why });

export const SCENES3: Scene[] = [
  { id: 'c3_d23_journal', from: 23, slot: 'night', requires: ['attic_opened'], lines: [
    { n: 'Hujan mengetuk atap. Kamu menempelkan foto sepia, kunci, dan peta harta di papan gabus kecil di kamarmu.' },
    { n: 'Ada terlalu banyak pertanyaan. Siapa orang ketiga di foto? Kenapa Eyang dan Nenek berhenti berkirim surat?' },
    { act: { flag: 'journal_unlocked' } },
    { act: { flag: 'ch3_start' } },
    { act: { toast: '🔎 Jurnal Misteri terbuka! (Menu → Surat → Jurnal)' } },
  ] },
  { id: 'c3_d24_offer', from: 24, slot: 'talk:mama', map: 'kafe', cast: ['mama'], lines: [
    { n: 'Kafe sepi seperti biasa. Ibu Hana menghampirimu dengan ragu.' },
    { w: 'mama', e: 'normal', jp: 'あの… すこし てつだって くれる？', ro: 'ano… sukoshi tetsudatte kureru?', id: 'Anu… bisa bantu sedikit?' },
    { w: 'mama', t: 'Hana malu melayani tamu. Kalau kamu mau jadi kasir sepulang sekolah, ada uang saku.' },
    { q: 'Jawab Ibu Hana!', o: [ok('はい、よろこんで！', 'hai, yorokonde!'), ok('がんばります！', 'ganbarimasu!')] },
    { w: 'mama', e: 'happy', jp: 'たすかる わ。ありがとう。', ro: 'tasukaru wa. arigatou.', id: 'Sangat membantu. Terima kasih.' },
    { act: { flag: 'baito_cafe' } },
    { act: { toast: '🧾 Kerja paruh waktu terbuka: bicara dengan Ibu Hana di kafe (sore hari).' } },
  ] },
  { id: 'c3_d25_map', from: 25, slot: 'night', requires: ['treasure_map'], lines: [
    { n: 'Kamu membuka peta harta lagi. Kata yang kemarin kabur kini terbaca: 「メロンソーダ の みせ」.' },
    { n: 'Toko melon soda… Foto di dinding kafe Hana! Tiga remaja minum soda!' },
    { act: { flag: 'map_spot4_read' } },
  ] },
  { id: 'c3_d26_frame', from: 26, slot: 'talk:mama', map: 'kafe', requires: ['baito_cafe'], cast: ['mama', 'hana'], lines: [
    { n: 'Ibu Hana sedang menurunkan bingkai menu tua yang berdebu dari dinding.' },
    { choose: 'Tawarkan bantuan?', opts: ['てつだいます！ (Aku bantu!)'] },
    { n: 'Saat bingkai diangkat, selembar kertas terlipat jatuh dari baliknya.' },
    { w: 'hana', e: 'surprised', jp: 'これ… なに？', ro: 'kore… nani?', id: 'Ini… apa?' },
    { act: { page: 4 } },
    { w: 'mama', e: 'surprised', t: 'Bingkai itu tidak pernah dipindah sejak zaman nenek Hana…' },
    { w: 'hana', t: 'Nenekku sering bercerita tentang "tiga anak yang selalu memesan melon soda". Katanya salah satunya dari luar negeri.' },
    { act: { flag: 'page4' } },
    { act: { town: 3 } },
  ] },
  { id: 'c3_d28_letter5', from: 28, slot: 'night', requires: ['attic_opened'], cast: ['obaa'], lines: [
    { act: { flag: 'letter5_open' } },
    { n: 'Surat kelima. Setelah belajar tenten, hampir semua katanya bisa kamu baca.' },
    { act: { letter: 'L05', read: true } },
    { w: 'obaa', e: 'happy', t: '(tertawa pelan dari balik pintu) Kamu membaca surat soal melon soda, ya?' },
    { w: 'obaa', e: 'happy', jp: 'わたし、ほんとう に せんせい に なった の よ。', ro: 'watashi, hontou ni sensei ni natta no yo.', id: 'Aku benar-benar jadi guru, lho.' },
    { act: { flag: 'letter5_read' } },
  ] },
  { id: 'c3_d29_umi', from: 29, until: 33, slot: 'after', cast: ['obaa', 'emma'], lines: [
    { act: { card: ['うみ', 'Akhir pekan ke pantai'] } },
    { act: { trip: 'umi' } },
    { n: 'Kereta sore membawa kalian ke pantai. Nenek Sato memandangi laut lama sekali.' },
    { n: 'Di tebing ujung pantai berdiri kuil kecil (ほこら) — persis seperti yang ditunjuk peta harta.' },
    { w: 'obaa', e: 'sad', jp: 'ここ… おぼえて いる。', ro: 'koko… oboete iru.', id: 'Tempat ini… aku ingat.' },
    { n: 'Di balik ほこら ada kaleng teh tua berkarat. Di dalamnya, selembar halaman buku bergambar.' },
    { act: { page: 3 } },
    { w: 'emma', e: 'happy', jp: 'あ！こんにちは！また あいました ね！', ro: 'a! konnichiwa! mata aimashita ne!', id: 'Ah! Halo! Kita bertemu lagi!' },
    { w: 'emma', t: 'Aku Emma, dari Prancis. Aku keliling Jepang setahun sambil belajar. Masih ingat? Kamu dulu menunjukkan jalan ke stasiun!' },
    { q: 'Balas Emma!', o: [ok('げんき でした か？', 'genki deshita ka?'), ok('うれしい です！', 'ureshii desu!')] },
    { w: 'emma', e: 'happy', t: 'Ayo saling tes angka! ご + ろく は？' },
    { q: 'Emma: "5 + 6 = ?"', o: [ok('じゅういち', 'juuichi'), no('じゅうに', 'juuni', '5 + 6 = 11 = じゅういち (十一).')] },
    { w: 'emma', e: 'happy', jp: 'せいかい！', ro: 'seikai!', id: 'Benar!' },
    { n: 'Kamu memotret Nenek Sato di tempat yang sama dengan foto sepia. 50 tahun kemudian.' },
    { act: { trip: 'home' } },
    { act: { flag: 'page3' } },
    { act: { flag: 'emma_arc_2' } },
  ] },
  { id: 'c3_d30_mori', from: 30, until: 33, slot: 'talk:ojii', map: 'kafe', cast: ['ojii'],
    spawn: { id: 'ojii', x: 6, y: 4, dir: 'up', steps: ['after', 'evening'] },
    lines: [
      { n: 'Kakek Mori duduk di meja pojok kafe — pertama kalinya dalam puluhan tahun — memesan melon soda.' },
      { n: 'Ia menatap foto hitam-putih di dinding.' },
      { w: 'ojii', e: 'sad', jp: '…かわらない な、この みせ は。', ro: '…kawaranai na, kono mise wa.', id: '…Kafe ini tidak berubah, ya.' },
      { choose: 'Tanyakan sesuatu?', opts: ['Kakek ada di foto itu?', 'Diam saja'] },
      { w: 'ojii', e: 'normal', t: '(bangkit, meletakkan uang di meja) …Sodanya terlalu manis.' },
      { n: 'Kakek Mori pergi tanpa menoleh. Di mejanya: 四百円, pas.' },
      { act: { flag: 'mori_cafe' } },
    ] },
  { id: 'c3_d32_meeting', from: 32, until: 33, slot: 'after', cast: ['taisho', 'hana'], lines: [
    { n: 'Di papan pengumuman taman ada tulisan: 「かいぎ　きょう 五じ」 (rapat, hari ini jam 5). Warga berkumpul.' },
    { w: 'taisho', e: 'happy', jp: 'みんな で いちば を やろう！', ro: 'minna de ichiba o yarou!', id: 'Ayo kita adakan pasar bersama-sama!' },
    { w: 'taisho', t: 'Jalan belanja makin sepi. Hari Minggu, kita buka Pasar Pagi di taman!' },
    { w: 'hana', e: 'normal', jp: 'カフェ も… だします！', ro: 'kafe mo… dashimasu!', id: 'Kafe juga… ikut buka lapak!' },
    { n: 'Semua orang menoleh ke Hana. Ia merah padam — lalu tersenyum.' },
    { act: { flag: 'market_plan' } },
    { act: { town: 5 } },
    { act: { toast: '🏮 Meter Kota terbuka! Bantu warga agar Sakura-machi ramai lagi.' } },
  ] },
  { id: 'c3_d33_ohagi', from: 33, until: 34, slot: 'dinner', cast: ['obaa'], lines: [
    { n: 'Nenek Sato menyiapkan beras ketan dan pasta kacang merah.' },
    { w: 'obaa', e: 'happy', t: 'Besok Nenek juga ikut jualan おはぎ di lapak kafe. Bantu, ya.' },
    { q: 'Langkah pertama membuat おはぎ?', o: [ok('まぜる (aduk)', 'mazeru'), no('つつむ (bungkus)', 'tsutsumu', 'Bungkus di akhir. Pertama: まぜる (aduk nasinya).')] },
    { q: 'Lalu…', o: [ok('まるめる (bulatkan)', 'marumeru'), no('たべる (makan)', 'taberu', 'Belum boleh dimakan! Bulatkan dulu: まるめる.')] },
    { q: 'Terakhir…', o: [ok('つつむ (bungkus)', 'tsutsumu')] },
    { w: 'obaa', e: 'happy', jp: 'じょうず ね！', ro: 'jouzu ne!', id: 'Pintar, ya!' },
    { act: { flag: 'ohagi_made' } },
  ] },
  { id: 'c3_d34_market', from: 34, slot: 'after', cast: ['mama', 'hana', 'ojii'], lines: [
    { n: 'Ryo membuka Pasar Pagi dengan lagunya. Antrean mulai terbentuk di depan lapak kafe!' },
    { act: { kasir: { level: 5, rounds: 6, title: 'Pasar Pagi — Kasir' } } },
    { n: 'Di tengah keramaian, Kakek Mori membeli sebungkus おはぎ buatan Nenek Sato. Tanpa menyapa. Ia memakannya di bangku sambil menunduk.' },
    { w: 'mama', e: 'happy', jp: 'ほんとう に ありがとう。', ro: 'hontou ni arigatou.', id: 'Terima kasih banyak, sungguh.' },
    { w: 'hana', e: 'happy', jp: 'わたし… カフェ を つづけたい！', ro: 'watashi… kafe o tsuzuketai!', id: 'Aku… ingin kafe ini terus ada!' },
    { act: { town: 20 } },
    { act: { stamp: ['asaichi', 'Pasar Pagi Sakura-machi'] } },
    { act: { flag: 'market_done' } },
  ] },
  { id: 'c3_d34_letter6', from: 34, slot: 'night', requires: ['attic_opened'], cast: ['obaa'], lines: [
    { act: { flag: 'letter6_open' } },
    { act: { letter: 'L06', read: true } },
    { w: 'obaa', e: 'sad', jp: 'みなと…', ro: 'minato…', id: 'Pelabuhan…' },
    { w: 'obaa', e: 'sad', t: 'Dari sanalah Dewi pulang. Aku… tidak bisa mengantarnya. Aku sakit hari itu.' },
    { n: '"M" di inisial S・D・M… Mori?' },
    { n: 'Tanda × pegunungan di peta harta kini terbaca: 「やま の じぞうさん」.' },
    { act: { flag: 'letter6_read' } },
    { act: { flag: 'ch3_done' } },
    { act: { stamp: ['ch3story', 'Rahasia Pelabuhan'] } },
  ] },
];

/* ---------- Jurnal Misteri: petunjuk yang muncul saat flag diset ---------- */
export interface Clue { id: string; flag: string; icon: string; title: string; text: string }
export const CLUES: Clue[] = [
  { id: 'sepia', flag: 'attic_opened', icon: '🖼️', title: 'Foto sepia', text: 'Tiga remaja di pantai. Gadis berbatik = Dewi? Siapa dua lainnya?' },
  { id: 'dewi', flag: 'letter1_read', icon: '✉️', title: 'Tanda tangan "Dewi"', text: 'Surat pertama ditandatangani Dewi — nama Eyang.' },
  { id: 'mori1', flag: 'mori_met', icon: '👴', title: 'Kakek Mori', text: '"…Dari Indonesia, ya. Sudah lama sekali…" Kenapa ia menghindari Nenek Sato?' },
  { id: 'map', flag: 'treasure_map', icon: '🗺️', title: 'Peta Harta 1976', text: 'Inisial S・D・M. S = Sato, D = Dewi. M = ?' },
  { id: 'cafe', flag: 'cafe_photo_seen', icon: '☕', title: 'Foto di kafe', text: 'Tiga remaja yang sama minum melon soda di Kafe Hanamizuki.' },
  { id: 'friend', flag: 'sato_knows', icon: '🤝', title: 'Pengakuan Nenek', text: '"Dewi adalah sahabatku." Setelah Dewi pulang, suratnya tak pernah dibalas… katanya.' },
  { id: 'mori2', flag: 'mori_cafe', icon: '🥤', title: 'Kakek Mori di kafe', text: '"Kafe ini tidak berubah." Ia memesan melon soda — seperti trio di foto.' },
  { id: 'port', flag: 'letter6_read', icon: '⚓', title: 'Pelabuhan みなと', text: 'Dewi pulang dengan kapal dari みなと. "Mori-kun" mengajaknya ke sana. M = Mori!' },
];

export const QUESTIONS: Array<{ q: string; answered: string; a: string }> = [
  { q: 'Siapa "Dewi" di surat pertama?', answered: 'sato_knows', a: 'Eyang Dewi — sahabat Nenek Sato 50 tahun lalu.' },
  { q: 'Kenapa ada foto Nenek Sato & Dewi di pantai?', answered: 'page3', a: 'Pantai うみ adalah tempat rahasia mereka. Ada halaman buku di ほこら.' },
  { q: 'Kenapa Kakek Mori menghindari Nenek Sato?', answered: 'mori_confessed', a: '(terungkap nanti)' },
  { q: 'Apa isi buku bergambar yang halamannya tersebar?', answered: 'book_complete', a: '(kumpulkan semua halaman)' },
  { q: 'Kenapa surat-surat mereka tidak pernah sampai?', answered: 'letter11_found', a: '(terungkap nanti)' },
  { q: 'Apa arti ukiran di pohon sakura tua?', answered: 'carving_read', a: '(terungkap nanti)' },
];
