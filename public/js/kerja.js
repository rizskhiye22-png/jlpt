/* =========================================================
   SIMULASI KERJA (しごと たいけん)
   Gambaran kerja nyata di Jepang untuk bidang yang banyak diisi
   pekerja Indonesia (Tokutei Ginou / magang):
   - 🍙 Pabrik makanan (しょくひん せいぞう)
   - 🧓 Kaigo / panti wreda (かいご)
   - 🏗 Genba / proyek konstruksi (けんせつ げんば)
   - 🍶 Restoran / izakaya (がいしょく)
   Atasan di tiap tempat kerja memandu satu shift penuh seperti "bot":
   memberi instruksi dalam bahasa Jepang, bertanya, lalu menjelaskan
   kenapa jawabanmu benar/salah. Isi disusun dari materi resmi
   (OTAFF, JAC, pedoman HACCP & KY活動, panduan 声かけ kaigo).
   Jenis langkah: say · clock · quiz · order · pick · spot
   Simulasi aktif: ruangan kerja bergambar, atasan berjalan ke pos kerja,
   memberi instruksi lewat balon kata, panah menunjuk tujuan, pemain
   berjalan ke pos itu lalu mengerjakan tugasnya. Tempat kerja juga ada
   sebagai bangunan di kawasan しごとまち (naik kereta dari Stasiun Sakura).
   ========================================================= */
const Kerja = (() => {
  /* ---------- tokoh tempat kerja ---------- */
  Object.assign(CHARACTERS, {
    hancho:  { name: 'Pak Yamada (Hanchō)',  color: '#4f7fb0' },
    leader:  { name: 'Bu Suzuki (Leader)',   color: '#d77a9a' },
    riyosha: { name: 'Nenek Kimura',         color: '#8a6aa0' },
    oyakata: { name: 'Pak Kondo (Mandor)',   color: '#d9822b' },
    tencho:  { name: 'Pak Ishii (Tenchō)',   color: '#b0363f' },
  });
  Object.assign(Pix.PAL, {
    hancho:  { h: '#2d2b3b', H: '#16151d', e: '#2b2b44', E: '#4f5690', I: '#8d95d8', o: '#f4f6fa', O: '#c9d0dc', a: '#f4f6fa', A: '#c9d0dc', p: '#e8ecf2', b: '#f4f6fa', c: '#f4f6fa' },
    leader:  { h: '#4a3020', H: '#2a1a10', e: '#2a2238', E: '#6b4430', I: '#b08060', o: '#f2a7bf', O: '#d77a9a', a: '#f6d44a', A: '#c9a526', p: '#3a3f55', b: '#f4f1ea', c: '#f7f3ea' },
    riyosha: { h: '#d8d4dc', H: '#a8a2b0', e: '#2a2238', E: '#6a5a7a', I: '#a898b8', o: '#9a7ab8', O: '#6a4a88', a: '#f6d44a', A: '#c9a526', p: '#5a4a6a', b: '#4a3a3a', c: '#f7f3ea' },
    oyakata: { h: '#1d1c26', H: '#0f0e14', e: '#2a2a3a', E: '#4a4a3a', I: '#8a8a6a', o: '#5a6b8a', O: '#3d4a63', a: '#f6c90e', A: '#c9a20b', p: '#4a4a55', b: '#2a2a2a', c: '#f7f3ea' },
    tencho:  { h: '#2f2c40', H: '#191824', e: '#2a2a3a', E: '#5a4a3a', I: '#9a8a7a', o: '#2b2b38', O: '#181820', a: '#f7f3ea', A: '#d3c7b3', p: '#2b2b38', b: '#2a2a2a', c: '#f7f3ea' },
  });
  Object.assign(Pix.STYLE, {
    hancho:  { hair: 'short', uniform: 'apron', cap: true },
    leader:  { hair: 'bob', uniform: 'tee' },
    riyosha: { hair: 'bun', old: true, uniform: 'cardigan' },
    oyakata: { hair: 'short', uniform: 'tee', cap: true },
    tencho:  { hair: 'short', uniform: 'apron', headband: true },
  });

  /* ---------- isi simulasi ---------- */
  // quiz: q = situasi (bahasa Indonesia), opts[0] = jawaban benar (diacak saat main)
  const JOBS = [
    {
      id: 'food', icon: '🍙', jp: 'しょくひん せいぞう', k: '食品製造', name: 'Pabrik Makanan', place: 'Pabrik bento & onigiri',
      desc: 'Lini produksi onigiri: kebersihan, cek barang NG, suhu, dan 5S.',
      info: {
        tugas: ['Bekerja di lini produksi: menata nasi & lauk, mengemas, menempel label', 'Cek visual: menyingkirkan produk cacat atau berbenda asing (いぶつ)', 'Cuci tangan, sanitasi alat, dan bersih-bersih area kerja', 'Mencatat suhu pemanasan & suhu ruang dingin'],
        jadwal: ['07:50 Ganti seragam, cuci tangan, rol perekat, air shower', '08:00 Chōrei (apel pagi) & cek kesehatan', '08:15 Kerja di lini (istirahat ±10 menit tiap 2 jam)', '12:00 Istirahat makan siang', '16:30 Bersih-bersih & 5S', '17:00 Shūrei (apel sore), pulang'],
        kondisi: 'Banyak berdiri. Ruang produk dingin bisa sekitar 10℃. Pabrik besar biasanya punya shift pagi, siang, dan malam.',
        visa: 'Tokutei Ginou「飲食料品製造業」: ujian keterampilan dari OTAFF + bahasa Jepang (JFT-Basic atau JLPT N4).',
        tips: 'Kebersihan nomor satu. Kalau ragu atau melihat masalah, langsung lapor (ほうれんそう). Diare atau demam juga WAJIB dilaporkan sebelum masuk.',
      },
      vocab: [
        ['朝礼', 'ちょうれい', 'chourei', 'apel pagi'], ['手洗い', 'てあらい', 'tearai', 'cuci tangan'], ['帽子', 'ぼうし', 'boushi', 'topi / penutup rambut'],
        ['手袋', 'てぶくろ', 'tebukuro', 'sarung tangan'], ['異物', 'いぶつ', 'ibutsu', 'benda asing'], ['異物混入', 'いぶつこんにゅう', 'ibutsu konnyuu', 'benda asing tercampur di makanan'],
        ['加熱', 'かねつ', 'kanetsu', 'pemanasan / memasak'], ['温度', 'おんど', 'ondo', 'suhu'], ['不良品', 'ふりょうひん', 'furyouhin', 'barang cacat (NG)'],
        ['報連相', 'ほうれんそう', 'hourensou', 'lapor · kabari · konsultasi'], ['体調', 'たいちょう', 'taichou', 'kondisi badan'], ['5S', 'ごエス', 'go esu', 'seiri, seiton, seisō, seiketsu, shitsuke'],
      ],
      steps: [
        { t: 'clock', time: '07:50', title: 'Ganti seragam & persiapan' },
        { t: 'say', w: 'hancho', e: 'happy', jp: 'おはよう ございます！きょう から よろしく ね。', ro: 'ohayou gozaimasu! kyou kara yoroshiku ne.', id: 'Selamat pagi! Mulai hari ini mohon kerja samanya, ya.' },
        { t: 'say', w: 'hancho', jp: 'まず、みだしなみ を チェック します。', ro: 'mazu, midashinami wo chekku shimasu.', id: 'Pertama, kita cek penampilan (みだしなみ) dulu. Di pabrik makanan, benda kecil pun bisa jatuh ke produk.' },
        { t: 'pick', title: 'みだしなみ · Pilih yang BOLEH dibawa/dipakai ke area produksi', items: [
          { jp: 'ぼうし', ro: 'boushi', id: 'penutup rambut', ok: true },
          { jp: 'マスク', ro: 'masuku', id: 'masker', ok: true },
          { jp: 'てぶくろ', ro: 'tebukuro', id: 'sarung tangan', ok: true },
          { jp: 'ながぐつ', ro: 'nagagutsu', id: 'sepatu bot pabrik', ok: true },
          { jp: 'ゆびわ', ro: 'yubiwa', id: 'cincin', ok: false, why: 'Aksesori bisa jatuh ke makanan (いぶつこんにゅう).' },
          { jp: 'うでどけい', ro: 'udedokei', id: 'jam tangan', ok: false, why: 'Jam tangan menyimpan kotoran & bisa jatuh.' },
          { jp: 'スマホ', ro: 'sumaho', id: 'HP', ok: false, why: 'HP ditinggal di loker.' },
          { jp: 'ヘアピン', ro: 'heapin', id: 'jepit rambut', ok: false, why: 'Jepit rambut termasuk benda asing yang sering ditemukan.' },
        ] },
        { t: 'say', w: 'hancho', jp: 'つぎ は てあらい。せっけん で 30びょう いじょう あらって ね。', ro: 'tsugi wa tearai. sekken de sanjuu-byou ijou aratte ne.', id: 'Berikutnya cuci tangan. Pakai sabun, minimal 30 detik.' },
        { t: 'wash', title: 'てあらい · Cuci tangan seperti di pabrik' },
        { t: 'roller', title: 'ローラー · Gulirkan rol perekat ke seluruh baju', why: 'Rambut & debu di baju (termasuk punggung dan lengan) harus diambil semua sebelum masuk. Biasanya teman saling bantu menggulirkan rol di punggung, lalu masuk air shower.' },
        { t: 'clock', time: '08:00', title: 'ちょうれい · Apel pagi' },
        { t: 'say', w: 'hancho', jp: 'きょう の もくひょう は おにぎり 3000こ です。', ro: 'kyou no mokuhyou wa onigiri sanzen-ko desu.', id: 'Target hari ini 3.000 onigiri. Sekarang cek kesehatan.' },
        { t: 'quiz', w: 'hancho', jp: 'たいちょう は どう？', ro: 'taichou wa dou?', id: 'Bagaimana kondisi badanmu?', q: 'Pagi ini kamu diare. Apa yang kamu katakan?', opts: [
          { jp: 'すみません、おなか の ちょうし が わるい です。', ro: 'sumimasen, onaka no choushi ga warui desu.' },
          { jp: 'だいじょうぶ です！', ro: 'daijoubu desu!' },
          { jp: 'くすり を のんだ から、だいじょうぶ。', ro: 'kusuri wo nonda kara, daijoubu.' },
        ], why: 'Diare/muntah bisa jadi tanda norovirus yang menular lewat makanan. Wajib lapor; kamu akan dipindah ke tugas lain atau disuruh istirahat. Jujur itu justru dihargai.' },
        { t: 'clock', time: '08:15', title: 'ライン · Kerja di lini produksi' },
        { t: 'say', w: 'hancho', jp: 'ふりょうひん は NG、いい もの は ヨシ！ で ながして ね。', ro: 'furyouhin wa NG, ii mono wa yoshi! de nagashite ne.', id: 'Barang cacat = NG (singkirkan). Barang bagus = ヨシ! (loloskan).' },
        { t: 'belt', title: 'ライン · Singkirkan onigiri NG di conveyor', count: 12, items: [
          { e: '🍙', d: 'Onigiri rapi, nori menempel, label ada', ok: true },
          { e: '🍙', d: 'Bentuk segitiga sempurna, kemasan rapat', ok: true },
          { e: '🍙', d: 'Label tanggal tercetak jelas', ok: true },
          { e: '🍙', b: '〰️', d: 'Ada benda hitam tipis panjang di nasi', ok: false, why: 'かみのけ (rambut) = いぶつ' },
          { e: '🍙', b: '🧩', d: 'Ada serpihan plastik bening', ok: false, why: 'ビニール の かけら (serpihan plastik)' },
          { e: '🍙', b: '🏷️', d: 'Labelnya tidak ada', ok: false, why: 'ラベル なし: tanggal & alergen tidak terbaca' },
          { e: '🍙', b: '💥', d: 'Kemasan sobek, nasi keluar', ok: false, why: 'ほうそう が やぶれて いる (kemasan rusak)' },
          { e: '🍙', b: '🔩', d: 'Ada potongan logam kecil', ok: false, why: 'きんぞく (logam) → lapor segera!' },
        ] },
        { t: 'quiz', w: 'hancho', q: 'Kamu menemukan potongan logam di onigiri. Apa yang kamu katakan ke hanchō?', opts: [
          { jp: 'はんちょう！いぶつ が ありました！', ro: 'hanchou! ibutsu ga arimashita!' },
          { jp: '（だまって すてる）', ro: '(diam-diam dibuang)' },
          { jp: 'あとで いいます。', ro: 'ato de iimasu.' },
        ], why: 'Logam bisa berarti ada bagian mesin yang patah, jadi produk lain mungkin ikut tercemar. Ini ほうれんそう: ほうこく (lapor), れんらく (kabari), そうだん (konsultasi). Lapor SEGERA, jangan dibuang diam-diam.' },
        { t: 'say', w: 'hancho', jp: 'からあげ の ちゅうしん おんど を はかって。', ro: 'karaage no chuushin ondo wo hakatte.', id: 'Ukur suhu bagian tengah karaage. Standarnya 75℃ selama 1 menit atau lebih.' },
        { t: 'thermo', title: 'おんど チェック · Ukur suhu tengah karaage', why: 'Di Jepang standar umum pemanasan adalah suhu tengah 75℃ selama 1 menit atau lebih, supaya bakteri mati. Ukur di bagian paling tebal, catat angkanya, dan panaskan ulang kalau kurang.' },
        { t: 'clock', time: '16:30', title: 'せいそう · Bersih-bersih & 5S' },
        { t: 'act', title: '5S · Rapikan area kerja (せいり・せいとん・せいそう)', target: '🧰', targetLabel: 'meja kerja & papan alat', steps: [
          { tool: ['🗑️', 'いらない もの'], jp: 'いらない もの を すてて。（せいり）', id: 'buang barang yang tidak perlu', how: 'swipe', after: '🗑️ ✓' },
          { tool: ['🔧', 'どうぐ'], jp: 'どうぐ を かげ の ばしょ に もどして。（せいとん）', id: 'kembalikan alat ke bayangannya di papan', how: 'taps:3', after: '🔧🔧🔧 rapi' },
          { tool: ['🧽', 'ぞうきん'], jp: 'つくえ と ゆか を ふいて。（せいそう）', id: 'lap meja & lantai', how: 'swipe', after: '✨' },
          { tool: ['✅', 'チェックひょう'], jp: 'チェックひょう に きにゅう。（せいけつ）', id: 'isi daftar periksa kebersihan', how: 'tap', after: '✅' },
          { tool: ['🙇', 'あいさつ'], jp: 'まいにち つづけよう！（しつけ）', id: 'jadikan kebiasaan', how: 'hold', after: '🙇' },
        ], extras: [['📱', 'スマホ'], ['🍙', 'おにぎり']], why: '5S: せいり (buang yang tidak perlu), せいとん (tata, alat punya tempat/bayangan), せいそう (bersihkan), せいけつ (pertahankan), しつけ (biasakan).' },
        { t: 'clock', time: '17:00', title: 'しゅうれい · Apel sore & pulang' },
        { t: 'quiz', w: 'hancho', q: 'Kamu pulang lebih dulu, teman lain masih bekerja. Kamu bilang…', opts: [
          { jp: 'おさきに しつれいします。', ro: 'osaki ni shitsurei shimasu.' },
          { jp: 'じゃあね！', ro: 'jaa ne!' },
          { jp: 'いただきます。', ro: 'itadakimasu.' },
        ], why: 'おさきに しつれいします = "Saya pamit duluan". Teman biasanya menjawab おつかれさまでした (terima kasih atas kerja kerasnya).' },
        { t: 'say', w: 'hancho', e: 'happy', jp: 'おつかれさま でした！また あした。', ro: 'otsukaresama deshita! mata ashita.', id: 'Terima kasih kerja kerasnya! Sampai besok.' },
      ],
    },
    {
      id: 'kaigo', icon: '🧓', jp: 'かいご', k: '介護', name: 'Kaigo (Panti Wreda)', place: 'Panti wreda (とくべつ ようご ろうじん ホーム)',
      desc: 'Serah terima, 声かけ, bantu makan, pindah ke kursi roda, mandi, lapor.',
      info: {
        tugas: ['Membantu makan (しょくじ かいじょ), mandi (にゅうよく), toilet (はいせつ)', 'Memindahkan dari kasur ke kursi roda (いじょう)', 'Cek suhu badan & kondisi, rekreasi bersama lansia', 'Menulis catatan (きろく) & serah terima shift (もうしおくり)'],
        jadwal: ['08:30 Serah terima dari shift malam (もうしおくり)', '09:00 Cek suhu badan, ganti popok/toilet', '12:00 Bantu makan siang, sikat gigi', '14:00 Mandi / rekreasi', '15:00 Waktu camilan (おやつ)', '17:00 Catatan & serah terima ke shift malam'],
        kondisi: 'Ada shift pagi, siang, dan malam (やきん). Fisik cukup berat (mengangkat & memindahkan), tapi hubungan dengan lansia sangat hangat.',
        visa: 'Tokutei Ginou「介護」: ujian 介護技能評価試験 + 介護日本語評価試験 + bahasa Jepang (JFT-Basic atau JLPT N4).',
        tips: 'Kunci kaigo adalah こえかけ: selalu bicara sebelum menyentuh atau memindahkan ("いまから 〜しますね"). Pakai bahasa sopan, jangan terburu-buru.',
      },
      vocab: [
        ['介護', 'かいご', 'kaigo', 'perawatan lansia'], ['利用者', 'りようしゃ', 'riyousha', 'penghuni / pengguna layanan'], ['声かけ', 'こえかけ', 'koekake', 'menyapa/menjelaskan saat membantu'],
        ['申し送り', 'もうしおくり', 'moushiokuri', 'serah terima shift'], ['食事介助', 'しょくじかいじょ', 'shokuji kaijo', 'bantu makan'], ['誤嚥', 'ごえん', 'goen', 'tersedak (makanan masuk ke paru)'],
        ['移乗', 'いじょう', 'ijou', 'pindah (kasur → kursi roda)'], ['車いす', 'くるまいす', 'kurumaisu', 'kursi roda'], ['入浴', 'にゅうよく', 'nyuuyoku', 'mandi'],
        ['排泄', 'はいせつ', 'haisetsu', 'buang air (toilet)'], ['転倒', 'てんとう', 'tentou', 'terjatuh'], ['記録', 'きろく', 'kiroku', 'catatan'],
      ],
      steps: [
        { t: 'clock', time: '08:30', title: 'もうしおくり · Serah terima shift' },
        { t: 'say', w: 'leader', e: 'happy', jp: 'おはよう ございます。きょう は いっしょ に がんばりましょう。', ro: 'ohayou gozaimasu. kyou wa issho ni ganbarimashou.', id: 'Selamat pagi. Hari ini kita semangat bersama, ya.' },
        { t: 'say', w: 'leader', jp: 'きむら さん は ゆうべ あまり ねむれません でした。', ro: 'kimura-san wa yuube amari nemuremasen deshita.', id: 'Info shift malam: Nenek Kimura semalam kurang tidur. Perhatikan kondisinya, ya.' },
        { t: 'quiz', w: 'leader', q: 'Kamu masuk kamar Nenek Kimura pagi hari. Sebelum membuka tirai, kamu bilang…', opts: [
          { jp: 'きむら さん、おはよう ございます。カーテン を あけて も いい ですか？', ro: 'kimura-san, ohayou gozaimasu. kaaten wo akete mo ii desu ka?' },
          { jp: '（だまって カーテン を あける）', ro: '(diam-diam buka tirai)' },
          { jp: 'おきて！あさ だ よ！', ro: 'okite! asa da yo!' },
        ], why: 'こえかけ: sapa dengan nama, jelaskan, lalu minta izin. Lansia adalah "tuan rumah" di kamarnya sendiri. Bahasa kasar seperti "おきて！" tidak sopan.' },
        { t: 'quiz', w: 'leader', jp: 'たいおん を はかって ください。', ro: 'taion wo hakatte kudasai.', id: 'Tolong ukur suhu badannya.', q: 'Termometer: 37,8℃. Apa yang kamu lakukan?', opts: [
          { jp: 'リーダー、きむら さん の ねつ が 37ど8ぶ です。', ro: 'riidaa, kimura-san no netsu ga sanjuu-nana-do hachi-bu desu.' },
          { jp: '（あとで きろく に かく だけ）', ro: '(cuma dicatat nanti)' },
          { jp: 'ふつう です。', ro: 'futsuu desu.' },
        ], why: 'Di banyak panti, 37,5℃ ke atas sudah dianggap demam. Laporkan angkanya dengan jelas ke leader atau perawat (かんごし) SEGERA, baru dicatat.' },
        { t: 'clock', time: '12:00', title: 'しょくじ かいじょ · Bantu makan siang' },
        { t: 'pick', title: 'Pilih cara bantu makan yang BENAR', items: [
          { jp: 'からだ を おこして すわる', ro: 'karada wo okoshite suwaru', id: 'duduk tegak', ok: true },
          { jp: 'あご を すこし ひく', ro: 'ago wo sukoshi hiku', id: 'dagu sedikit menunduk', ok: true },
          { jp: 'ひとくち は すこし', ro: 'hitokuchi wa sukoshi', id: 'suapan kecil', ok: true },
          { jp: 'のみこんだ か かくにん', ro: 'nomikonda ka kakunin', id: 'cek sudah ditelan', ok: true },
          { jp: 'たった まま たべさせる', ro: 'tatta mama tabesaseru', id: 'menyuapi sambil berdiri', ok: false, why: 'Kalau kamu berdiri, lansia mendongak → mudah tersedak. Duduklah sejajar mata.' },
          { jp: 'いそいで たべさせる', ro: 'isoide tabesaseru', id: 'menyuapi cepat-cepat', ok: false, why: 'Terburu-buru = risiko ごえん (tersedak).' },
          { jp: 'ねた まま たべさせる', ro: 'neta mama tabesaseru', id: 'makan sambil berbaring', ok: false, why: 'Berbaring membuat makanan mudah masuk ke saluran napas.' },
        ] },
        { t: 'feed', title: 'しょくじ かいじょ · Suapi Nenek Kimura', why: 'ごえん (tersedak sampai makanan masuk ke paru) bisa menyebabkan radang paru, salah satu penyebab sakit serius pada lansia di Jepang. Karena itu: posisi duduk tegak, suapan kecil, dan selalu tunggu sampai menelan.' },
        { t: 'quiz', w: 'riyosha', e: 'happy', jp: 'もう おなか いっぱい だ わ。', ro: 'mou onaka ippai da wa.', id: '', q: 'Nenek Kimura berkata begitu. Artinya…', opts: [
          { label: 'Sudah kenyang' }, { label: 'Masih lapar, minta tambah' }, { label: 'Perutnya sakit' },
        ], why: 'おなか いっぱい = perut penuh/kenyang. Jangan dipaksa makan; catat berapa banyak yang dimakan (misal 8わり = 80%).' },
        { t: 'clock', time: '14:00', title: 'いじょう · Pindah ke kursi roda' },
        { t: 'act', title: 'いじょう · Pindahkan Nenek Kimura ke kursi roda', target: '👵', targetLabel: 'Nenek Kimura di tepi kasur', steps: [
          { tool: ['🗣️', 'こえかけ'], jp: 'くるまいす に うつりましょう ね。', id: 'jelaskan dulu ke nenek', how: 'tap', after: '👵 うん' },
          { tool: ['♿', 'くるまいす'], jp: 'くるまいす を ななめ に おいて。', id: 'taruh kursi roda miring ±30° di sisi yang sehat', how: 'swipe', after: '♿ ↗' },
          { tool: ['🛑', 'ブレーキ'], jp: 'ブレーキ を かけて。', id: 'kunci rem kiri & kanan', how: 'taps:2', after: '🛑🛑' },
          { tool: ['🦶', 'あし'], jp: 'あし を ゆか に つけて もらって。', id: 'kaki menapak lantai', how: 'tap', after: '🦶' },
          { tool: ['🤝', 'ささえる'], jp: 'いち、に の さん で たちましょう。', id: 'topang & berdiri bersama, lalu berputar', how: 'hold', after: '🧍' },
          { tool: ['🪑', 'すわる'], jp: 'ふかく すわって ください。', id: 'dudukkan dalam, kaki di pijakan', how: 'hold', after: '♿👵 ✓' },
        ], extras: [['🍵', 'おちゃ'], ['📺', 'テレビ']], why: 'Kursi roda di sisi yang sehat, rem terkunci, kaki menapak, berdiri bersama dengan aba-aba, lalu duduk dalam. Setiap langkah dijelaskan (こえかけ).' },
        { t: 'clock', time: '15:00', title: 'にゅうよく · Membantu mandi' },
        { t: 'dial', title: 'にゅうよく · Atur suhu air mandi', why: 'Umumnya 38–41℃. Cek dulu dengan tanganmu sendiri, lalu tanya: 「おゆ の かげん は どう ですか？」 Kulit lansia sensitif dan mudah melepuh.' },
        { t: 'quiz', w: 'leader', q: 'Nenek Kimura terjatuh (てんとう) di lorong. Apa yang pertama kamu lakukan?', opts: [
          { jp: 'だれか きて ください！きむら さん が ころびました！', ro: 'dareka kite kudasai! kimura-san ga korobimashita!' },
          { jp: '（ひとり で すぐ だきあげる）', ro: '(langsung diangkat sendirian)' },
          { jp: '（みなかった こと に する）', ro: '(pura-pura tidak lihat)' },
        ], why: 'Jangan langsung diangkat: bisa ada patah tulang atau benturan kepala. Panggil bantuan & perawat, ajak bicara supaya tetap sadar, lalu tunggu pemeriksaan.' },
        { t: 'clock', time: '17:00', title: 'きろく · Catatan & laporan' },
        { t: 'quiz', w: 'leader', jp: 'ほうこく して ください。', ro: 'houkoku shite kudasai.', id: 'Tolong laporkan.', q: 'Laporan mana yang paling baik?', opts: [
          { jp: '15じ に ろうか で ころびました。あたま は うって いません。', ro: 'juugo-ji ni rouka de korobimashita. atama wa utte imasen.' },
          { jp: 'なんか ころんだ みたい です。', ro: 'nanka koronda mitai desu.' },
          { jp: 'だいじょうぶ でした、たぶん。', ro: 'daijoubu deshita, tabun.' },
        ], why: 'Laporan yang baik: fakta yang jelas, yaitu いつ (kapan), どこで (di mana), なにが (apa yang terjadi), dan kondisinya sekarang. Hindari "たぶん" (mungkin).' },
        { t: 'say', w: 'riyosha', e: 'happy', jp: 'きょう も ありがとう ね。あなた が きて くれて うれしい わ。', ro: 'kyou mo arigatou ne. anata ga kite kurete ureshii wa.', id: 'Terima kasih untuk hari ini juga. Nenek senang kamu datang.' },
        { t: 'quiz', w: 'riyosha', q: 'Kamu pamit ke Nenek Kimura. Kamu bilang…', opts: [
          { jp: 'また あした きます ね。ゆっくり やすんで ください。', ro: 'mata ashita kimasu ne. yukkuri yasunde kudasai.' },
          { jp: 'バイバイ！', ro: 'baibai!' },
          { jp: 'はやく ねて！', ro: 'hayaku nete!' },
        ], why: 'Ucapan lembut dan sopan membuat lansia merasa tenang dan dihormati.' },
        { t: 'say', w: 'leader', e: 'happy', jp: 'おつかれさま でした。こえかけ が じょうず でした よ。', ro: 'otsukaresama deshita. koekake ga jouzu deshita yo.', id: 'Terima kasih kerja kerasnya. Cara menyapamu (こえかけ) bagus sekali!' },
      ],
    },
    {
      id: 'genba', icon: '🏗', jp: 'けんせつ げんば', k: '建設現場', name: 'Genba (Konstruksi)', place: 'Proyek pembangunan gedung',
      desc: 'ご安全に!, APD, KY活動, temukan bahaya, 指差呼称, bahasa lapangan.',
      info: {
        tugas: ['Bekisting, besi tulangan, pengecoran, perancah (あしば), interior, alat berat', 'Membawa & merapikan material', 'Ikut apel pagi (ちょうれい), senam radio, dan KY活動 tiap pagi', 'Bersih-bersih lokasi di akhir hari'],
        jadwal: ['07:45 Senam radio (ラジオたいそう)', '08:00 Apel pagi: "ごあんぜん に！", KY活動', '10:00 Istirahat singkat (いっぷく)', '12:00 Makan siang', '15:00 Istirahat singkat (いっぷく)', '17:00 Beres-beres, apel sore, pulang'],
        kondisi: 'Kerja di luar ruangan: panas di musim panas (waspada ねっちゅうしょう/heat stroke), dingin di musim dingin. Disiplin keselamatan sangat ketat.',
        visa: 'Tokutei Ginou「建設」: ujian keterampilan bidang konstruksi (diselenggarakan JAC) + bahasa Jepang (JFT-Basic atau JLPT N4).',
        tips: 'Jangan pernah pura-pura paham instruksi, minta diulang. Biasakan menunjuk sambil berseru "〇〇 ヨシ！" (しさこしょう).',
      },
      vocab: [
        ['現場', 'げんば', 'genba', 'lokasi kerja / proyek'], ['ご安全に', 'ごあんぜんに', 'go-anzen ni', 'salam: semoga selamat'], ['朝礼', 'ちょうれい', 'chourei', 'apel pagi'],
        ['危険予知', 'きけんよち (KY)', 'kiken yochi', 'memprediksi bahaya'], ['指差呼称', 'しさこしょう', 'shisa koshou', 'tunjuk & seru'], ['保護具', 'ほごぐ', 'hogogu', 'alat pelindung diri'],
        ['安全帯', 'あんぜんたい', 'anzentai', 'sabuk pengaman / harness'], ['足場', 'あしば', 'ashiba', 'perancah'], ['脚立', 'きゃたつ', 'kyatatsu', 'tangga lipat'],
        ['熱中症', 'ねっちゅうしょう', 'necchuushou', 'heat stroke'], ['一服', 'いっぷく', 'ippuku', 'istirahat singkat'], ['猫車', 'ねこ', 'neko', 'gerobak dorong (bahasa lapangan)'],
      ],
      steps: [
        { t: 'clock', time: '07:45', title: 'ラジオたいそう · Senam radio' },
        { t: 'say', w: 'oyakata', jp: 'ごあんぜん に！', ro: 'go-anzen ni!', id: 'Salam khas genba: "Semoga selamat!" Dipakai pagi-pagi menggantikan "ohayou".' },
        { t: 'quiz', w: 'oyakata', q: 'Pak Kondo menyapa "ごあんぜん に！". Kamu jawab…', opts: [
          { jp: 'ごあんぜん に！', ro: 'go-anzen ni!' }, { jp: 'こんばんは。', ro: 'konbanwa.' }, { jp: 'いただきます！', ro: 'itadakimasu!' },
        ], why: 'Jawab dengan salam yang sama, suara keras dan semangat. Di genba, suara keras = tanda kamu siap & waspada.' },
        { t: 'pick', title: 'ほごぐ · Pilih yang WAJIB dipakai di genba', items: [
          { jp: 'ヘルメット', ro: 'herumetto', id: 'helm', ok: true },
          { jp: 'あんぜんぐつ', ro: 'anzengutsu', id: 'sepatu safety', ok: true },
          { jp: 'フルハーネス', ro: 'furu haanesu', id: 'harness (sabuk pengaman)', ok: true },
          { jp: 'てぶくろ', ro: 'tebukuro', id: 'sarung tangan kerja', ok: true },
          { jp: 'サンダル', ro: 'sandaru', id: 'sandal', ok: false, why: 'Kaki harus terlindung dari paku & benda jatuh.' },
          { jp: 'イヤホン', ro: 'iyahon', id: 'earphone', ok: false, why: 'Kamu harus bisa dengar peringatan & aba-aba.' },
          { jp: 'はんそで・はんズボン', ro: 'hansode, han zubon', id: 'lengan & celana pendek', ok: false, why: 'Kulit harus tertutup (lengan & celana panjang).' },
        ] },
        { t: 'quiz', w: 'oyakata', jp: 'あごひも、しっかり！', ro: 'agohimo, shikkari!', id: 'Tali dagu, yang kencang!', q: 'Tali dagu helm (あごひも) harus…', opts: [
          { label: 'Diikat kencang di bawah dagu' }, { label: 'Dibiarkan menggantung supaya tidak gerah' }, { label: 'Diikat di belakang helm' },
        ], why: 'Helm tanpa tali dagu bisa lepas saat jatuh atau tertimpa, lalu tidak melindungi kepala sama sekali.' },
        { t: 'clock', time: '08:00', title: 'ちょうれい & KY活動' },
        { t: 'say', w: 'oyakata', jp: 'KY を やろう。きょう の きけん は なに か？', ro: 'KY wo yarou. kyou no kiken wa nani ka?', id: 'Ayo lakukan KY (prediksi bahaya). Apa bahaya hari ini?' },
        { t: 'hunt', title: 'KY · Temukan bahaya di area kerja hari ini', items: [
          { e: '🕳️', x: 60, y: 120, d: 'Lubang tanpa penutup', ok: false, why: 'Pasang penutup & pagar' }, { e: '🔌', x: 150, y: 130, d: 'Kabel melintang di jalan', ok: false, why: 'Rapikan kabel' },
          { e: '🪜', x: 250, y: 80, d: 'Tangga di tanah miring', ok: false, why: 'Tempatkan di tanah datar' }, { e: '🏗️', x: 290, y: 40, d: 'Beban crane di atas jalur orang', ok: false, why: 'Dilarang lewat di bawah beban' },
          { e: '⛑️', x: 100, y: 50, d: 'Pekerja memakai helm', ok: true }, { e: '🚧', x: 200, y: 45, d: 'Pagar pengaman terpasang', ok: true }, { e: '🧱', x: 200, y: 125, d: 'Material ditumpuk rapi', ok: true },
        ] },
        { t: 'quiz', w: 'oyakata', q: 'KY: dari bahaya tadi, mana yang PALING berbahaya (bisa fatal)?', opts: [{ label: 'Lubang tanpa penutup (jatuh) / beban crane' }, { label: 'Material ditumpuk rapi' }, { label: 'Pagar pengaman' }], why: 'KY 4 ronde: ① cari bahaya ② tentukan yang paling berbahaya ③ buat pencegahan ④ target tim, diserukan bersama: 「かいこうぶ ふた よし！」' },
        { t: 'say', w: 'oyakata', jp: 'じゃあ、げんば を まわって きけん を みつけて！', ro: 'jaa, genba wo mawatte kiken wo mitsukete!', id: 'Sekarang keliling genba dan temukan bahaya!' },
        { t: 'spot', title: 'Patroli: aman atau berbahaya?', okLabel: 'ヨシ！', ngLabel: 'あぶない！', count: 9, limit: 8000, items: [
          { e: '⛑️', d: 'Pekerja memakai helm, tali dagu terkunci', ok: true },
          { e: '🧱', d: 'Material ditumpuk rapi & diikat', ok: true },
          { e: '🚧', d: 'Pagar pengaman terpasang di tepi lantai', ok: true },
          { e: '💧', d: 'Minum air tiap 30 menit di hari panas', ok: true },
          { e: '🔌', d: 'Kabel melintang di jalan lewat', ok: false, why: 'つまずき (tersandung) → rapikan kabel' },
          { e: '🕳️', d: 'Lubang di lantai tanpa penutup', ok: false, why: 'てんらく (jatuh) → pasang penutup & tanda' },
          { e: '🪜', d: 'Tangga lipat berdiri di tanah miring', ok: false, why: 'きゃたつ harus di tempat datar & terkunci' },
          { e: '🧗', d: 'Kerja di ketinggian 3 m tanpa harness', ok: false, why: 'Ketinggian 2 m ke atas wajib harness' },
          { e: '🏗️', d: 'Orang lewat di bawah beban crane', ok: false, why: 'つりに の した に はいるな! Dilarang di bawah beban' },
        ] },
        { t: 'shisa', title: 'しさこしょう · Tunjuk & seru sebelum naik tangga', why: 'しさこしょう (tunjuk & seru): mata melihat, jari menunjuk, mulut berseru 「〇〇 ヨシ！」. Cara ini terbukti mengurangi kesalahan, dipakai juga oleh masinis kereta Jepang.' },
        { t: 'clock', time: '09:30', title: 'さぎょう · Bekerja' },
        { t: 'quiz', w: 'oyakata', jp: 'おい、ねこ もって きて！', ro: 'oi, neko motte kite!', id: '', q: 'Pak Kondo minta "ねこ". Apa yang kamu bawa?', opts: [
          { label: '🛒 Gerobak dorong satu roda' }, { label: '🐱 Kucing' }, { label: '🔨 Palu' },
        ], why: 'Bahasa lapangan: gerobak dorong satu roda disebut ねこ (ねこぐるま). Lucu, tapi sering dipakai!' },
        { t: 'quiz', w: 'oyakata', jp: 'あそこ の ばんせん、ばらして おいて。', ro: 'asoko no bansen, barashite oite.', id: '', q: 'Kamu tidak paham instruksi itu. Apa yang kamu lakukan?', opts: [
          { jp: 'すみません、もう いちど おねがいします。', ro: 'sumimasen, mou ichido onegaishimasu.' },
          { jp: '（わかった ふり を する）', ro: '(pura-pura paham)' },
          { jp: '（なにも しない）', ro: '(diam saja)' },
        ], why: 'Pura-pura paham adalah penyebab kecelakaan nomor satu pada pekerja asing. Minta diulang, minta ditunjukkan, atau ulangi instruksinya: "〜を 〜する ん です ね？"' },
        { t: 'clock', time: '10:00', title: 'いっぷく · Istirahat singkat' },
        { t: 'quiz', w: 'oyakata', q: 'Hari panas 34℃. Temanmu pusing dan berhenti berkeringat. Apa yang kamu lakukan?', opts: [
          { label: 'Bawa ke tempat teduh, beri minum & dinginkan, lapor mandor' },
          { label: 'Suruh lanjut kerja, sebentar lagi istirahat' },
          { label: 'Biarkan saja, nanti juga sembuh' },
        ], why: 'Itu tanda ねっちゅうしょう (heat stroke) yang bisa fatal. Segera dinginkan (leher, ketiak), beri minum, dan lapor. Kalau tidak sadar → panggil ambulans (119).' },
        { t: 'clock', time: '17:00', title: 'かたづけ · Beres-beres & pulang' },
        { t: 'quiz', w: 'oyakata', q: 'Pamit ke Pak Kondo (atasan) di akhir hari. Mana yang tepat?', opts: [
          { jp: 'おつかれさま でした！', ro: 'otsukaresama deshita!' }, { jp: 'ごくろうさま でした！', ro: 'gokurousama deshita!' }, { jp: 'おやすみ！', ro: 'oyasumi!' },
        ], why: 'ごくろうさま dipakai atasan kepada bawahan. Kepada atasan, pakai おつかれさま でした.' },
        { t: 'say', w: 'oyakata', e: 'happy', jp: 'きょう も ぶじ に おわった。ごくろうさん！', ro: 'kyou mo buji ni owatta. gokurousan!', id: 'Hari ini juga selesai tanpa kecelakaan. Kerja bagus!' },
      ],
    },
    {
      id: 'gaishoku', icon: '🍶', jp: 'がいしょく', k: '外食', name: 'Restoran / Izakaya', place: 'Izakaya di depan stasiun',
      desc: 'Bahasa pelayanan, menerima pesanan, alergi, kasir, dan urutan melayani.',
      info: {
        tugas: ['Hall: menyambut tamu, mengantar ke meja, menerima pesanan, menyajikan', 'Dapur: persiapan bahan, memasak, menata', 'Cuci piring & bersih-bersih', 'Kasir (おかいけい)'],
        jadwal: ['16:30 Masuk, ganti seragam, salam "おはようございます"', '17:00 Restoran buka', '18:00–21:00 Jam sibuk', '22:00 Pesanan terakhir (ラストオーダー)', '23:00 Bersih-bersih & pulang'],
        kondisi: 'Izakaya sibuk di sore–malam, restoran lain bisa shift pagi–siang. Cepat dan banyak bicara dengan tamu, jadi bahasa sopan sangat penting.',
        visa: 'Tokutei Ginou「外食業」: ujian keterampilan dari OTAFF + bahasa Jepang (JFT-Basic atau JLPT N4).',
        tips: 'Hafalkan 接客用語 (frasa pelayanan). Alergi tamu = urusan serius: jangan menebak, selalu cek ke tenchō atau dapur.',
      },
      vocab: [
        ['外食', 'がいしょく', 'gaishoku', 'industri restoran'], ['店長', 'てんちょう', 'tenchou', 'manajer toko'], ['接客', 'せっきゃく', 'sekkyaku', 'melayani tamu'],
        ['何名様', 'なんめいさま', 'nanmei-sama', 'berapa orang (sopan)'], ['注文', 'ちゅうもん', 'chuumon', 'pesanan'], ['お冷', 'おひや', 'ohiya', 'air dingin untuk tamu'],
        ['おしぼり', 'おしぼり', 'oshibori', 'handuk basah'], ['アレルギー', 'アレルギー', 'arerugii', 'alergi'], ['お会計', 'おかいけい', 'okaikei', 'pembayaran / bon'],
        ['お釣り', 'おつり', 'otsuri', 'uang kembalian'], ['少々', 'しょうしょう', 'shoushou', 'sebentar (sopan)'], ['ラストオーダー', 'ラストオーダー', 'rasuto oodaa', 'pesanan terakhir'],
      ],
      steps: [
        { t: 'clock', time: '16:30', title: 'しゅっきん · Masuk kerja' },
        { t: 'say', w: 'tencho', e: 'happy', jp: 'おはよう ございます！', ro: 'ohayou gozaimasu!', id: 'Di restoran, salam saat mulai shift tetap "ohayou gozaimasu", walau sudah sore!' },
        { t: 'act', title: 'せっきゃく · Layani tamu dari datang sampai pulang', target: '🧑‍🤝‍🧑', targetLabel: 'tamu (2 orang)', steps: [
          { tool: ['🙇', 'おじぎ'], jp: 'いらっしゃいませ！', id: 'sambut & membungkuk', how: 'hold', after: '🙇' },
          { tool: ['👋', 'あんない'], jp: 'にめいさま、こちら へ どうぞ。', id: 'antar ke meja', how: 'tap', after: '🪑' },
          { tool: ['🧻', 'おしぼり'], jp: 'おしぼり と おひや を どうぞ。', id: 'beri handuk basah & air', how: 'taps:2', after: '🧻🥛' },
          { tool: ['📟', 'ハンディ'], jp: 'ごちゅうもん を おうかがい します。', id: 'catat pesanan di ハンディ', how: 'taps:3', after: '📟 ✓' },
          { tool: ['🍽️', 'トレー'], jp: 'おまたせ しました。', id: 'sajikan pesanan', how: 'hold', after: '🍢🍺' },
          { tool: ['💴', 'レジ'], jp: 'おかいけい は 3,200えん です。', id: 'proses pembayaran', how: 'tap', after: '💴 ✓' },
        ], extras: [['📱', 'スマホ'], ['🧹', 'ほうき']], why: 'Alur pelayanan: sambut → antar → おしぼり & おひや → pesanan → sajikan → kasir → antar pulang.' },
        { t: 'clock', time: '17:00', title: 'かいてん · Restoran buka' },
        { t: 'quiz', w: 'tencho', q: 'Tamu masuk ke restoran. Kamu bilang…', opts: [
          { jp: 'いらっしゃいませ！', ro: 'irasshaimase!' }, { jp: 'ただいま！', ro: 'tadaima!' }, { jp: 'おかえり！', ro: 'okaeri!' },
        ], why: 'いらっしゃいませ = selamat datang. Biasanya semua staf ikut berseru bersama.' },
        { t: 'quiz', w: 'tencho', jp: 'なんめいさま ですか？', ro: 'nanmei-sama desu ka?', id: 'Untuk berapa orang?', q: 'Tamu menunjukkan 3 jari. Kamu jawab…', opts: [
          { jp: 'さんめいさま ですね。こちら へ どうぞ。', ro: 'sanmei-sama desu ne. kochira e douzo.' },
          { jp: 'さんこ ですね。', ro: 'sanko desu ne.' },
          { jp: 'みっつ？', ro: 'mittsu?' },
        ], why: 'Untuk menghitung tamu dengan sopan pakai 〜めいさま (〜名様). 〜こ dan みっつ untuk menghitung benda.' },
        { t: 'quiz', w: 'tencho', jp: 'とりあえず なま ふたつ！', ro: 'toriaezu nama futatsu!', id: '', q: 'Tamu bilang begitu. Apa pesanannya?', opts: [
          { label: '🍺🍺 Dua bir draft (なまビール) dulu' }, { label: '🥩 Dua daging mentah' }, { label: '🍣 Dua sushi' },
        ], why: 'なま = なまビール (bir draft). "とりあえず" = "untuk sekarang dulu". Ini pesanan pertama paling klasik di izakaya!' },
        { t: 'quiz', w: 'tencho', q: 'Tamu bilang: 「えび アレルギー なんです。この サラダ は だいじょうぶ？」', opts: [
          { jp: 'しょうしょう おまち ください。かくにん して まいります。', ro: 'shoushou omachi kudasai. kakunin shite mairimasu.' },
          { jp: 'たぶん だいじょうぶ です！', ro: 'tabun daijoubu desu!' },
          { jp: 'わかりません。', ro: 'wakarimasen.' },
        ], why: 'Alergi bisa mengancam nyawa. JANGAN menebak. Bilang "mohon tunggu sebentar, saya cek dulu", lalu tanya tenchō/dapur atau lihat daftar alergen.' },
        { t: 'clock', time: '19:00', title: 'ピーク · Jam sibuk' },
        { t: 'spot', title: 'Cek piring sebelum diantar', okLabel: 'ヨシ！', ngLabel: 'NG', count: 8, limit: 5500, items: [
          { e: '🍢', d: 'Yakitori meja 3, sesuai pesanan', ok: true },
          { e: '🥗', d: 'Salad tanpa udang untuk tamu alergi, sudah dicek', ok: true },
          { e: '🍜', d: 'Ramen panas, mangkuk bersih', ok: true },
          { e: '🍣', b: '〰️', d: 'Ada rambut di pinggir piring', ok: false, why: 'かみのけ → buat ulang' },
          { e: '🍛', b: '💔', d: 'Piringnya retak', ok: false, why: 'さら が われて いる → ganti piring' },
          { e: '🍤', b: '❓', d: 'Tempura udang untuk meja yang alergi udang', ok: false, why: 'Pesanan salah & berbahaya untuk tamu alergi!' },
          { e: '🍺', b: '🫗', d: 'Gelas bir kotor bekas bibir', ok: false, why: 'Ganti gelas bersih' },
        ] },
        { t: 'quiz', w: 'tencho', q: 'Kamu tidak sengaja menumpahkan air di dekat tamu. Kamu bilang…', opts: [
          { jp: 'たいへん しつれい しました！すぐ ふきます。', ro: 'taihen shitsurei shimashita! sugu fukimasu.' },
          { jp: 'あ、ごめん。', ro: 'a, gomen.' },
          { jp: '（だまって いく）', ro: '(pergi diam-diam)' },
        ], why: 'Kepada tamu pakai bahasa sopan: たいへん しつれい しました / もうしわけ ございません. "ごめん" hanya untuk teman.' },
        { t: 'cash', title: 'レジ · Kembalian', why: 'おかえし (お返し) = kembalian, cara sopan di kasir. Hitung kembalian di depan tamu, uang kertas dulu baru koin.' },
        { t: 'quiz', w: 'tencho', q: 'Tamu pulang. Kamu bilang…', opts: [
          { jp: 'ありがとう ございました！また おこし くださいませ。', ro: 'arigatou gozaimashita! mata okoshi kudasaimase.' },
          { jp: 'いってらっしゃい！', ro: 'itterasshai!' },
          { jp: 'じゃあ ね！', ro: 'jaa ne!' },
        ], why: 'また おこし くださいませ = "Silakan datang kembali". Frasa standar pelayanan di Jepang.' },
        { t: 'clock', time: '23:00', title: 'しめ · Tutup & pulang' },
        { t: 'say', w: 'tencho', e: 'happy', jp: 'おつかれ！せっきゃく、いい かんじ だった よ。', ro: 'otsukare! sekkyaku, ii kanji datta yo.', id: 'Kerja bagus! Caramu melayani tamu sudah oke.' },
      ],
    },
  ];
  const BY = new Proxy({}, { get: (o, id) => JOBS.find(j => j.id === id) });
  const DAYS = {};             // isi karier 15 hari per bidang (kerja-hari.js)
  let dayBuilder = null;       // (job, day, n) → langkah-langkah shift
  const TASK_CAT = {};         // kategori evaluasi untuk tugas tambahan
  const GLOSS = {};            // kamus kerja per bidang (kerja-kotoba.js)
  const BOSS = { food: 'hancho', kaigo: 'leader', genba: 'oyakata', gaishoku: 'tencho' };
  Object.assign(CHARACTERS, { rina: { name: 'Bu Rina (Pembimbing Kerja)', color: '#3b8a78' } });
  Object.assign(Pix.PAL, { rina: { h: '#2a2238', H: '#16121e', e: '#2a2238', E: '#3b5a6a', I: '#7ab0c0', o: '#3b8a78', O: '#2a6458', a: '#f6d44a', A: '#c9a526', p: '#3a3f55', b: '#2a2a2a', c: '#f7f3ea' } });
  Object.assign(Pix.STYLE, { rina: { hair: 'long', uniform: 'blazer' } });

  /* ---------- ruangan kerja (12 × 7 ubin) ----------
     pos: [x, y] benda, berdiri di bawahnya (atau stand). */
  const GW = 12, GH = 7, TS = 32;
  const ROOMS = {
    food: {
      name: 'Pabrik bento', floor: ['#e6ebef', '#d9e0e6'], wall: '#9fb3c8', wallTop: '#6f86a0',
      st: {
        locker: { x: 1, y: 1, e: '🧥', jp: 'ロッカー', id: 'loker ganti baju' },
        sink:   { x: 3, y: 1, e: '🚰', jp: 'てあらいば', id: 'tempat cuci tangan' },
        air:    { x: 5, y: 1, e: '🌀', jp: 'エアシャワー', id: 'rol perekat & air shower' },
        board:  { x: 8, y: 1, e: '📋', jp: 'ちょうれい', id: 'papan apel pagi' },
        fryer:  { x: 10, y: 2, e: '🍗', jp: 'フライヤー', id: 'penggorengan' },
        line:   { x: 6, y: 4, e: '🍙', jp: 'ライン', id: 'lini conveyor', stand: [6, 5], noIcon: true },
        clean:  { x: 10, y: 5, e: '🧹', jp: 'そうじ', id: 'alat bersih-bersih' },
        exit:   { x: 1, y: 5, e: '🚪', jp: 'でぐち', id: 'pintu keluar' },
      },
      at: { 0: 'locker', 4: 'sink', 6: 'air', 7: 'board', 10: 'line', 14: 'fryer', 16: 'clean', 18: 'exit' },
      cast: { 10: [{ k: 'w1', id: 'tenin', x: 4, y: 3, dir: 'down' }, { k: 'w2', id: 'emma', x: 8, y: 3, dir: 'down' }], 16: [{ k: 'w1', x: 9, y: 5 }, { k: 'w2', x: 2, y: 3 }] },
      block: [[2, 4, 9, 4]],
      start: { player: [2, 3], boss: [1, 2] },
    },
    kaigo: {
      name: 'Panti wreda', floor: ['#ead8bc', '#e0cba9'], wall: '#f2c9d6', wallTop: '#d77a9a',
      st: {
        staff:  { x: 1, y: 1, e: '📋', jp: 'ステーション', id: 'ruang staf' },
        room:   { x: 4, y: 1, e: '🛏️', jp: 'きょしつ', id: 'kamar Nenek Kimura' },
        dining: { x: 8, y: 2, e: '🍱', jp: 'しょくどう', id: 'ruang makan' },
        bath:   { x: 10, y: 1, e: '🛁', jp: 'よくしつ', id: 'kamar mandi' },
        wheel:  { x: 5, y: 4, e: '♿', jp: 'くるまいす', id: 'kursi roda' },
        hall:   { x: 9, y: 5, e: '🚶', jp: 'ろうか', id: 'lorong' },
        record: { x: 2, y: 5, e: '📝', jp: 'きろく', id: 'meja catatan' },
      },
      at: { 0: 'staff', 3: 'room', 5: 'dining', 9: 'wheel', 11: 'bath', 13: 'hall', 14: 'record', 16: 'room', 18: 'staff' },
      cast: { 0: [{ k: 'r', id: 'riyosha', x: 5, y: 2, dir: 'left' }], 5: [{ k: 'r', x: 9, y: 3, dir: 'left' }], 9: [{ k: 'r', x: 6, y: 4, dir: 'left' }], 11: [{ k: 'r', x: 11, y: 2, dir: 'left' }], 13: [{ k: 'r', x: 10, y: 6, dir: 'left' }], 16: [{ k: 'r', x: 5, y: 2, dir: 'left' }] },
      block: [[5, 1], [8, 2, 9, 2], [11, 1]],
      start: { player: [2, 3], boss: [1, 2] },
    },
    genba: {
      name: 'Genba konstruksi', floor: ['#d8c79a', '#cbb886'], wall: '#8a9aa8', wallTop: '#f6c90e', outdoor: true,
      st: {
        plaza:    { x: 1, y: 1, e: '📻', jp: 'ひろば', id: 'lapangan senam & apel' },
        ppe:      { x: 3, y: 1, e: '⛑️', jp: 'ほごぐ', id: 'rak alat pelindung' },
        ky:       { x: 5, y: 1, e: '📋', jp: 'KYボード', id: 'papan KY' },
        scaffold: { x: 8, y: 2, e: '🧱', jp: 'あしば', id: 'perancah' },
        ladder:   { x: 10, y: 2, e: '🪜', jp: 'きゃたつ', id: 'tangga lipat' },
        material: { x: 2, y: 5, e: '🛒', jp: 'しざい', id: 'tempat material' },
        tent:     { x: 6, y: 5, e: '⛺', jp: 'きゅうけいじょ', id: 'tenda istirahat' },
        gate:     { x: 10, y: 5, e: '🚧', jp: 'ゲート', id: 'gerbang proyek' },
      },
      at: { 0: 'plaza', 3: 'ppe', 5: 'ky', 9: 'scaffold', 11: 'ladder', 12: 'material', 15: 'tent', 17: 'gate' },
      cast: { 0: [{ k: 'w1', id: 'ryo', x: 2, y: 3, dir: 'up' }, { k: 'w2', id: 'kenta', x: 3, y: 3, dir: 'up' }], 9: [{ k: 'w1', x: 8, y: 3, dir: 'up' }, { k: 'w2', x: 9, y: 4, dir: 'left' }], 15: [{ k: 'w1', x: 7, y: 6, dir: 'left' }] },
      block: [[7, 1, 9, 1], [9, 2]],
      start: { player: [2, 4], boss: [1, 2] },
    },
    gaishoku: {
      name: 'Izakaya', floor: ['#7a5536', '#6d4a2e'], wall: '#3a2a22', wallTop: '#b0363f',
      st: {
        back:    { x: 10, y: 1, e: '👕', jp: 'きゅうけいしつ', id: 'ruang staf' },
        door:    { x: 1, y: 5, e: '🚪', jp: 'いりぐち', id: 'pintu masuk' },
        t1:      { x: 4, y: 2, e: '🍶', jp: 'テーブル1', id: 'meja 1' },
        t2:      { x: 7, y: 2, e: '🍺', jp: 'テーブル2', id: 'meja 2' },
        kitchen: { x: 10, y: 4, e: '🍳', jp: 'キッチン', id: 'dapur' },
        reg:     { x: 4, y: 5, e: '💴', jp: 'レジ', id: 'kasir' },
      },
      at: { 0: 'back', 3: 'door', 6: 't1', 8: 'kitchen', 10: 't2', 11: 'reg', 12: 'door', 13: 'back' },
      cast: {
        4: [{ k: 'c1', id: 'emma', x: 1, y: 6, dir: 'right' }, { k: 'c2', id: 'ryo', x: 2, y: 6, dir: 'right' }, { k: 'c3', id: 'ojii', x: 0, y: 6, dir: 'right' }],
        6: [{ k: 'c1', x: 3, y: 3, dir: 'up' }, { k: 'c2', x: 5, y: 3, dir: 'up' }, { k: 'c3', x: 4, y: 3, dir: 'up' }],
        8: [{ k: 'c4', id: 'mai', x: 7, y: 3, dir: 'up' }, { k: 'c5', id: 'hana', x: 8, y: 3, dir: 'up' }],
        11: [{ k: 'c1', x: 3, y: 6, dir: 'right' }, { k: 'c2', x: 2, y: 6, dir: 'right' }, { k: 'c3', x: 5, y: 6, dir: 'left' }],
        13: [{ k: 'c1', gone: true }, { k: 'c2', gone: true }, { k: 'c3', gone: true }, { k: 'c4', gone: true }, { k: 'c5', gone: true }],
      },
      block: [[3, 2, 5, 2], [7, 2, 9, 2], [9, 3, 11, 3]],
      start: { player: [9, 2], boss: [11, 2] },
    },
  };
  const standOf = s => s.stand || [s.x, Math.min(GH - 1, s.y + 1)];

  /* ---------- pembantu ---------- */
  const S = () => Save.d;
  const H = () => Game.h;
  const say = l => UI.say(l);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const shuffle = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [b[i], b[j]] = [b[j], b[i]]; } return b; };
  const ro = (jp, r) => r && UI.showRo(jp) ? `<small class="kj-ro">${esc(r)}</small>` : '';
  const rec = () => (S().kerja = S().kerja || {});
  const RANKS = [[90, 'S'], [75, 'A'], [55, 'B'], [0, 'C']];
  const rankOf = pct => RANKS.find(([m]) => pct >= m)[1];
  const speak = jp => { if (jp && S().settings.voice !== false) Sound.speak(jp.replace(/（.*?）|\(.*?\)/g, '')); };
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  /* =========================================================
     MESIN SIMULASI: ruangan + aktor + balon kata + kotak tugas
     ========================================================= */
  const TSY = 42;   // ubin dibuat lebih tinggi supaya ruangan terlihat lebih besar di HP
  // seragam kerja: dipakai setelah ganti baju di pos pertama
  const UNIFORM = {
    food: { at: 'locker', after: 3, look: { uniform: 'blazer', uniformColor: '#f4f6fa', accessory: 'cap', accColor: '#f4f6fa' }, say: 'Seragam putih, penutup rambut, dan sepatu bot sudah dipakai.' },
    kaigo: { at: 'staff', look: { uniform: 'blazer', uniformColor: '#f2a7bf', accessory: 'none' }, say: 'Kaus polo kerja & papan nama sudah dipakai.' },
    genba: { at: 'ppe', after: 3, look: { uniform: 'blazer', uniformColor: '#f29b38', accessory: 'cap', accColor: '#f6c90e' }, say: 'Helm kuning & rompi sudah dipakai.' },
    gaishoku: { at: 'back', look: { uniform: 'blazer', uniformColor: '#2b2b38', accessory: 'headband', accColor: '#f7f3ea' }, say: 'Seragam izakaya & ikat kepala sudah dipakai.' },
  };

  function stage(job, room) {
    const R = room || ROOMS[job.id], boss = R.boss || BOSS[job.id];
    const p = UI.panel(`<div class="ws">
      <div class="ws-hud"><span class="ws-clock">🕒 --:--</span><b class="ws-title">${job.icon} ${esc(R.name)}</b><span class="ws-score">⭐ 0</span></div>
      <div class="ws-stage"><canvas width="${GW * TS}" height="${GH * TSY}"></canvas><div class="ws-bubble" hidden></div><div class="ws-banner" hidden></div></div>
      <div class="ws-obj"></div>
      <div class="ws-box"></div>
      <details class="ws-list"><summary>📋 Tugas shift <small class="muted">(MENU)</small></summary><ol></ol></details>
      <p class="ws-help muted small">Ketuk ruangan atau pakai D-pad untuk berjalan · A = lanjut / periksa pos</p>
    </div>`, 'gamep');
    const cv = p.querySelector('canvas'), ctx = cv.getContext('2d');
    if (window.Emo) Emo.preload([...Object.values(R.st).map(x => x.e), '🍙', '🐄', '🐓', '👍', '💦', '⭕', '❌', '✨', '♪', '👕', '❗', '💭']);
    const bub = p.querySelector('.ws-bubble'), banner = p.querySelector('.ws-banner'), obj = p.querySelector('.ws-obj'), box = p.querySelector('.ws-box');
    const listEl = p.querySelector('.ws-list'), list = listEl.querySelector('ol'), clockEl = p.querySelector('.ws-clock'), scoreEl = p.querySelector('.ws-score');
    const actors = new Map();
    const add = (k, id, x, y, dir = 'down') => actors.set(k, { k, id, x, y, dir, path: [], frame: 0, walkT: 0, emo: null, emoT: 0 });
    add('you', 'player', ...R.start.player); add('boss', boss, ...R.start.boss);
    let goal = null, onTap = null, light = 0, bubbleOf = null, hot = null;

    /* ---------- tabrakan & jalur (perabot tidak bisa ditembus) ---------- */
    const blocked = new Set();
    for (let x = 0; x < GW; x++) blocked.add(x + ',0');
    Object.values(R.st).forEach(s => { if (!s.noIcon) blocked.add(s.x + ',' + s.y); });
    (R.block || []).forEach(([x0, y0, x1 = x0, y1 = y0]) => { for (let x = x0; x <= x1; x++) for (let y = y0; y <= y1; y++) blocked.add(x + ',' + y); });
    const free = (x, y) => x >= 0 && y >= 0 && x < GW && y < GH && !blocked.has(x + ',' + y);
    function route(sx, sy, tx, ty) {
      if (sx === tx && sy === ty) return [];
      const key = (x, y) => x + ',' + y, prev = new Map([[key(sx, sy), null]]), q = [[sx, sy]];
      while (q.length) {
        const [x, y] = q.shift();
        if (x === tx && y === ty) break;
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const nx = x + dx, ny = y + dy, k = key(nx, ny);
          if (prev.has(k) || !(free(nx, ny) || (nx === tx && ny === ty))) continue;
          prev.set(k, [x, y]); q.push([nx, ny]);
        }
      }
      if (!prev.has(key(tx, ty))) return [[tx, ty]];
      const out = []; let c = [tx, ty];
      while (c && !(c[0] === sx && c[1] === sy)) { out.unshift(c); c = prev.get(key(...c)); }
      return out;
    }
    function walk(k, tx, ty) {
      const a = actors.get(k); if (!a) return Promise.resolve();
      a.path = route(Math.round(a.x), Math.round(a.y), tx, ty);
      return new Promise(res => { if (a.done) a.done(); a.done = res; if (!a.path.length) { a.done = null; res(); } });
    }
    function face(k, x, y) { const a = actors.get(k); if (!a) return; const dx = x - a.x, dy = y - a.y; if (!dx && !dy) return; a.dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'); }
    function emote(k, e, ms = 1400) { const a = actors.get(k); if (a) { a.emo = e; a.emoT = ms; } }

    /* ---------- menggambar ---------- */
    function draw(t) {
      const W = GW * TS, Hh = GH * TSY;
      for (let y = 0; y < GH; y++) for (let x = 0; x < GW; x++) {
        ctx.fillStyle = R.floor[(x + y) % 2]; ctx.fillRect(x * TS, y * TSY, TS, TSY);
        if (R.outdoor && (x * 7 + y * 13) % 5 === 0) { ctx.fillStyle = 'rgba(0,0,0,.08)'; ctx.fillRect(x * TS + 8, y * TSY + 14, 4, 3); }
      }
      ctx.fillStyle = R.wall; ctx.fillRect(0, 0, W, TSY * .9);
      ctx.fillStyle = R.wallTop; ctx.fillRect(0, 0, W, 6);
      if (job.id === 'genba' && !room) { for (let x = 0; x < W; x += 24) { ctx.fillStyle = (x / 24) % 2 ? '#f6c90e' : '#2a2a2a'; ctx.fillRect(x, TSY * .9 - 6, 24, 6); } }
      extra(t);
      for (const [key, s] of Object.entries(R.st)) {
        const X = s.x * TS, Y = s.y * TSY + (TSY - TS);
        if (!s.noIcon) {
          ctx.fillStyle = 'rgba(0,0,0,.12)'; ctx.beginPath(); ctx.ellipse(X + TS / 2, Y + TS - 3, 12, 4, 0, 0, 7); ctx.fill();
          ctx.fillStyle = key === hot ? '#ffe9a8' : '#fbf7ef'; ctx.strokeStyle = '#2a1f2d'; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.roundRect ? ctx.roundRect(X + 3, Y + 3, TS - 6, TS - 6, 6) : ctx.rect(X + 3, Y + 3, TS - 6, TS - 6); ctx.fill(); ctx.stroke();
          ctx.fillStyle = '#2a1f2d';
          ctx.font = '22px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          Emo.draw(ctx, s.e, X + TS / 2, Y + TS / 2 + 1, 22);
        }
      }
      // tujuan: cincin & panah
      if (goal) {
        const s = R.st[goal], [gx, gy] = standOf(s), r = 12 + Math.sin(t / 180) * 3;
        ctx.strokeStyle = '#ffd24a'; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(gx * TS + TS / 2, gy * TSY + TSY - 6, r + 4, r / 2.2, 0, 0, 7); ctx.stroke();
      }
      // aktor (urut dari atas ke bawah)
      ctx.imageSmoothingEnabled = false;
      [...actors.values()].filter(a => !a.gone).sort((a, b) => a.y - b.y).forEach(a => {
        const X = a.x * TS, Y = a.y * TSY + (TSY - TS), moving = a.path.length > 0;
        const bob = moving ? 0 : (a.k === bubbleOf ? Math.abs(Math.sin(t / 120)) * 2 : Math.sin(t / 600 + a.x) * .8);
        ctx.fillStyle = 'rgba(0,0,0,.18)'; ctx.beginPath(); ctx.ellipse(X + TS / 2, Y + TS - 3, 10, 4, 0, 0, 7); ctx.fill();
        ctx.drawImage(Pix.sprite(a.id, a.dir, moving ? (a.frame % 2 ? 1 : 2) : 0), X, Y - 6 - bob, TS, TS);
        if (a.k === 'you') { ctx.fillStyle = '#ffd24a'; ctx.beginPath(); ctx.moveTo(X + TS / 2 - 4, Y - 12); ctx.lineTo(X + TS / 2 + 4, Y - 12); ctx.lineTo(X + TS / 2, Y - 7); ctx.fill(); }
        if (a.emo && a.emoT > 0) { Emo.draw(ctx, a.emo, X + TS / 2, Y - 18 - Math.sin(t / 100) * 2, 18); }
      });
      ctx.imageSmoothingEnabled = true;
      // label pos digambar paling atas supaya tidak tertutup apa pun di kanvas
      for (const [key, s] of Object.entries(R.st)) {
        const X = s.x * TS, Y = s.y * TSY + (TSY - TS);
        ctx.font = '700 11px "Zen Maru Gothic","Noto Sans JP",sans-serif';
        const tw = ctx.measureText(s.jp).width + 8, lx = Math.max(2, Math.min(W - tw - 2, X + TS / 2 - tw / 2)), ly = s.noIcon ? Y - 14 : Y - 10;
        ctx.fillStyle = key === hot || key === goal ? '#ffd24a' : 'rgba(255,255,255,.88)'; ctx.fillRect(lx, ly, tw, 14);
        ctx.fillStyle = '#2a1f2d'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(s.jp, lx + 4, ly + 7.5);
      }
      if (goal) {
        const s = R.st[goal], ay = s.y * TSY + (TSY - TS) - 22 + Math.sin(t / 150) * 4, ax = s.x * TS + TS / 2;
        ctx.fillStyle = '#ffd24a'; ctx.strokeStyle = '#2a1f2d'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(ax - 8, ay - 8); ctx.lineTo(ax + 8, ay - 8); ctx.lineTo(ax, ay + 2); ctx.closePath(); ctx.fill(); ctx.stroke();
      }
      if (light) { ctx.fillStyle = `rgba(40,30,80,${light})`; ctx.fillRect(0, 0, W, Hh); }
    }
    const yy = y => y * TSY + (TSY - TS);   // posisi y (piksel) untuk benda setinggi 1 ubin
    function extra(t) {
      if (R.draw) R.draw(ctx, t, { TS, TSY, yy, GW, GH });
      if (job.id === 'food') {
        const y = yy(4) + 6, x0 = 2 * TS, x1 = 10 * TS, stop = R._stop;
        ctx.fillStyle = '#4a4f5a'; ctx.fillRect(x0, y, x1 - x0, 20); ctx.fillStyle = '#2f333b';
        const tt = stop ? 0 : t;
        for (let x = x0 + ((tt / 20) % 16); x < x1; x += 16) ctx.fillRect(x, y + 2, 3, 16);
        ctx.font = '16px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        for (let i = 0; i < 6; i++) { const x = x0 + ((tt / 20 + i * 44) % (x1 - x0)); Emo.draw(ctx, '🍙', x, y + 10, 16); }
        // keran: air mengalir saat sedang cuci tangan
        if (R._water) { ctx.fillStyle = 'rgba(120,180,255,.8)'; for (let i = 0; i < 4; i++) ctx.fillRect(3 * TS + 14 + (i % 2), yy(1) + 26 + ((t / 8 + i * 6) % 14), 3, 5); }
      }
      if (job.id === 'kaigo') {
        ctx.fillStyle = '#fbf7ef'; ctx.fillRect(4 * TS + 2, yy(1) + 4, TS * 1.8, TS - 8); ctx.fillStyle = '#9fc4e8'; ctx.fillRect(4 * TS + TS * .7, yy(1) + 6, TS * 1.1, TS - 12);
        ctx.fillStyle = '#c9a070'; ctx.fillRect(8 * TS - 6, yy(2) + 22, TS * 2 + 12, 8);
        ctx.fillStyle = R._water ? '#9fd0f2' : '#cfe6f2'; ctx.fillRect(10 * TS - 4, yy(1) + 2, TS + 30, TS - 4);
        if (R._call) { ctx.fillStyle = Math.floor(t / 300) % 2 ? '#e0475f' : '#ffd24a'; ctx.beginPath(); ctx.arc(9 * TS + 16, yy(5) - 4, 6, 0, 7); ctx.fill(); }
      }
      if (job.id === 'genba') {
        ctx.strokeStyle = '#7a7f88'; ctx.lineWidth = 3;
        for (let x = 7; x <= 9; x++) { ctx.beginPath(); ctx.moveTo(x * TS + 4, TSY); ctx.lineTo(x * TS + 4, 3 * TSY); ctx.stroke(); }
        for (let y = 1.3; y < 3; y += .6) { ctx.beginPath(); ctx.moveTo(7 * TS, y * TSY); ctx.lineTo(10 * TS, y * TSY); ctx.stroke(); }
        const sw = Math.sin(t / 900) * 18;
        ctx.strokeStyle = '#2a2a2a'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(11 * TS + 10, 0); ctx.lineTo(11 * TS + 10 + sw, 3 * TSY); ctx.stroke();
        ctx.fillStyle = '#c9752b'; ctx.fillRect(11 * TS + sw, 3 * TSY, 20, 12);
      }
      if (job.id === 'gaishoku') {
        ctx.fillStyle = '#c99a62'; [[3, 2], [7, 2]].forEach(([x, y]) => ctx.fillRect(x * TS, yy(y) + 8, TS * 3, TS - 8));
        ctx.fillStyle = '#d9c4a0'; ctx.fillRect(9 * TS, yy(3) + 12, TS * 3, 10);
        ctx.fillStyle = '#e0475f'; for (let i = 0; i < 4; i++) { const x = 1 * TS + i * 2.6 * TS, sw = Math.sin(t / 700 + i) * 2; ctx.beginPath(); ctx.ellipse(x + 16 + sw, 14, 7, 9, 0, 0, 7); ctx.fill(); }
        ctx.fillStyle = 'rgba(255,255,255,.5)'; for (let i = 0; i < 3; i++) { const q = (t / 30 + i * 12) % 30; ctx.fillRect(10 * TS + 12 + i * 6, yy(4) - q, 3, 3); }
      }
    }

    /* ---------- loop ---------- */
    let last = 0, raf = 0;
    function loop(t) {
      if (!cv.isConnected) { held = null; return; }
      const dt = Math.min(50, t - (last || t)); last = t;
      for (const a of actors.values()) {
        if (a.emoT > 0) a.emoT -= dt;
        if (!a.path.length) continue;
        const [nx, ny] = a.path[0], sp = dt / 1000 * 4.2;
        const dx = nx - a.x, dy = ny - a.y, d = Math.hypot(dx, dy);
        a.dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : dy < 0 ? 'up' : a.dir);
        a.walkT += dt; if (a.walkT > 140) { a.walkT = 0; a.frame = (a.frame + 1) % 4; }
        if (d <= sp) { a.x = nx; a.y = ny; a.path.shift(); if (!a.path.length && a.done) { const f = a.done; a.done = null; f(); } }
        else { a.x += dx / d * sp; a.y += dy / d * sp; }
      }
      draw(t); place();
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    // balon kata: tidak menutupi pos tujuan, pindah ke bawah kalau tokoh di dekat dinding atas
    function place() {
      if (bub.hidden || !bubbleOf) return;
      const a = actors.get(bubbleOf); if (!a) return;
      const below = a.y < 3;
      const g = goal && R.st[goal];
      let side = 'mid';
      if (g && Math.abs(g.y - a.y) <= 2) side = g.x <= a.x ? 'right' : 'left';
      const cx = (a.x + .5) / GW * 100;
      bub.style.left = cx + '%';
      bub.style.top = (below ? (a.y + 1.05) * TSY / (GH * TSY) * 100 : (a.y * TSY + (TSY - TS) - 8) / (GH * TSY) * 100) + '%';
      bub.className = `ws-bubble ${below ? 'down' : ''} s-${side}${cx < 30 ? ' edge-l' : cx > 70 ? ' edge-r' : ''}`;
    }
    function bubble(k, html) {
      if (!html) { bub.hidden = true; bubbleOf = null; return; }
      bubbleOf = k; bub.innerHTML = html; bub.hidden = false; place();
    }

    const stationAt = (x, y) => Object.entries(R.st).find(([, s]) => { const [sx, sy] = standOf(s); return (s.x === x && s.y === y) || (sx === x && sy === y); });
    cv.addEventListener('click', e => {
      const r = cv.getBoundingClientRect();
      const x = Math.floor((e.clientX - r.left) / r.width * GW), y = Math.floor((e.clientY - r.top) / r.height * GH);
      const hit = stationAt(x, y);
      if (onTap) onTap(hit ? hit[0] : null, x, y);
      else if (free(x, y)) walk('you', x, y);
    });

    /* ---------- D-pad di dalam ruangan ---------- */
    const DIR = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
    let held = null, holdT = 0;
    function step(dir) {
      const a = actors.get('you'); if (!a || a.path.length) return;
      const [dx, dy] = DIR[dir], nx = Math.round(a.x) + dx, ny = Math.round(a.y) + dy;
      a.dir = dir;
      if (!free(nx, ny)) {
        const hit = stationAt(nx, ny);
        if (hit && onTap && hit[0] === goal) onTap(hit[0], nx, ny);   // menabrak pos tujuan = memeriksa
        else if (Sound.bump) Sound.bump();
        return;
      }
      a.path = [[nx, ny]];
      if (goal && onTap) { const [gx, gy] = standOf(R.st[goal]); if (nx === gx && ny === gy) setTimeout(() => onTap && onTap(goal, gx, gy), 260); }
    }
    function keys(btn) {
      if (!cv.isConnected) return false;
      if (DIR[btn]) {
        step(btn); held = btn; clearInterval(holdT);
        holdT = setInterval(() => { if (held && cv.isConnected) step(held); else clearInterval(holdT); }, 240);
        return true;
      }
      if (btn === 'a') {
        const nb = box.querySelector('.ws-next, [data-a=check], .kj-next');
        if (nb) { nb.click(); return true; }
        if (goal && onTap) {
          const a = actors.get('you'), ax = Math.round(a.x), ay = Math.round(a.y), [dx, dy] = DIR[a.dir] || [0, -1];
          const hit = stationAt(ax, ay) || stationAt(ax + dx, ay + dy);
          if (hit) { onTap(hit[0], ax, ay); return true; }
        }
        return true;
      }
      if (btn === 'menu') { listEl.open = !listEl.open; return true; }
      return false;   // B → tombol keluar (konfirmasi)
    }
    function release(btn) { if (btn === held) { held = null; clearInterval(holdT); } }

    /* ---------- aksi untuk naskah ---------- */
    const api = {
      p, box, actors, R, keys, release,
      walk, face, emote, bubble,
      cast(list) {
        (list || []).forEach(c => {
          const a = actors.get(c.k);
          if (c.gone) { if (a) a.gone = true; return; }
          if (!a) { add(c.k, c.id, c.x, c.y, c.dir || 'down'); return; }
          a.gone = false; walk(c.k, c.x, c.y).then(() => { if (c.dir) a.dir = c.dir; });
        });
      },
      clock(time, title) {
        clockEl.textContent = '🕒 ' + time;
        const hh = parseInt(time, 10); light = hh >= 19 ? .28 : hh >= 17 ? .14 : 0;
        banner.innerHTML = `<b>${esc(time)}</b><span>${esc(title)}</span>`; banner.hidden = false;
        Sound.star();
        list.insertAdjacentHTML('beforeend', `<li class="sec">${esc(time)} · ${esc(title)}</li>`);
        return sleep(1400).then(() => { banner.hidden = true; });
      },
      score(n) { scoreEl.textContent = '⭐ ' + n; },
      setDay(n, title) { p.querySelector('.ws-title').textContent = `${job.icon} Hari ${n}/15${title ? ' · ' + title : ''}`; },
      todo(text) { list.insertAdjacentHTML('beforeend', `<li>${esc(text)}</li>`); return list.lastElementChild; },
      objective(text) { obj.innerHTML = text || ''; obj.classList.toggle('on', !!text); },
      // ganti seragam kerja
      wear() {
        const U = UNIFORM[job.id], key = 'kj_' + job.id;
        Pix.registerLook(key, Object.assign({}, S().look, U.look));
        const a = actors.get('you'); a.id = key; emote('you', '👕', 1600); Sound.star();
        return api.line({ n: `👕 ${U.say}` });
      },
      // kartu absen: masuk (しゅっきん) / pulang (たいきん)
      timecard(kind, time) {
        const inn = kind === 'in';
        box.innerHTML = `<div class="ws-tc"><div class="tc-card"><div class="tc-h">タイムカード</div><div class="tc-name">${esc(S().name || 'Kamu')}</div>
          <div class="tc-row"><span>しゅっきん (masuk)</span><b class="tc-in">${inn ? '--:--' : esc(api._in || '--:--')}</b></div>
          <div class="tc-row"><span>たいきん (pulang)</span><b class="tc-out">--:--</b></div></div>
          <button class="btn block ws-next" type="button">${inn ? '🪪 Tap kartu: しゅっきん' : '🪪 Tap kartu: たいきん'}</button></div>`;
        return UI.wait(done => {
          box.querySelector('.ws-next').onclick = () => {
            Sound.ok(); box.querySelector(inn ? '.tc-in' : '.tc-out').textContent = time;
            if (inn) api._in = time;
            const b = box.querySelector('.ws-next'); b.className = 'btn block kj-next'; b.textContent = 'ピッ！ Lanjut ▶';
            b.onclick = () => { Sound.blip(); done(); };
          };
        });
      },
      // kalimat tokoh: balon kata di ruangan + teks lengkap di kotak bawah
      line(l, btn = 'Lanjut ▶') {
        const who = l.w ? (l.w === boss ? 'boss' : [...actors.values()].find(a => a.id === l.w)?.k) : null;
        const txt = l.t || l.n || '';
        const short = l.jp ? `<b class="jp">${esc(l.jp)}</b>` : `<span>${esc(txt.slice(0, 50))}${txt.length > 50 ? '…' : ''}</span>`;
        if (who) { bubble(who, short); if (l.e === 'happy') emote(who, '♪', 1200); }
        else bubble(null);
        const name = l.w && CHARACTERS[l.w] ? `<div class="ws-name" style="--c:${CHARACTERS[l.w].color}">${esc(CHARACTERS[l.w].name)}</div>` : '';
        box.innerHTML = `<div class="ws-cap">${name}
          ${l.jp ? `<div class="ws-jp"><span class="jp">${esc(l.jp)}</span><button class="voice" type="button" aria-label="Dengarkan">♪</button></div>${ro(l.jp, l.ro)}` : ''}
          ${l.id ? `<div class="ws-id">${esc(l.id)}</div>` : ''}${l.t ? `<div class="ws-t">${esc(l.t)}</div>` : ''}${l.n ? `<div class="ws-n">${esc(l.n)}</div>` : ''}</div>
          <button class="btn block ws-next" type="button">${btn}</button>`;
        const v = box.querySelector('.voice'); if (v) v.onclick = () => Sound.speak(l.jp);
        speak(l.jp);
        return UI.wait(done => { box.querySelector('.ws-next').onclick = () => { Sound.blip(); done(); }; });
      },
      // atasan memimpin ke pos, pemain harus ke sana (ketuk atau D-pad)
      async lead(key) {
        const s = R.st[key], [sx, sy] = standOf(s), you = actors.get('you');
        if (Math.round(you.x) === sx && Math.round(you.y) === sy && !you.path.length) return;
        const cand = [[sx + 1, sy], [sx - 1, sy], [sx, sy + 1], [sx + 1, sy + 1], [sx - 1, sy + 1]].find(([x, y]) => free(x, y)) || [sx, sy];
        const go = [`${s.jp} へ いこう！`, `つぎ は ${s.jp} です。`, `${s.jp} に きて ください。`][Object.keys(R.st).indexOf(key) % 3];
        bubble('boss', `<b class="jp">${esc(go)}</b>`); speak(go);
        hot = key;
        await walk('boss', cand[0], cand[1]); face('boss', s.x, s.y);
        goal = key;
        api.objective(`➡ Pergi ke <b>${s.e} ${esc(s.jp)}</b> <small>(${esc(s.id)})</small> · ketuk atau pakai D-pad`);
        box.innerHTML = `<div class="ws-cap"><div class="ws-name" style="--c:${CHARACTERS[boss].color}">${esc(CHARACTERS[boss].name)}</div><div class="ws-jp"><span class="jp">${esc(go)}</span></div><div class="ws-id">Ayo ke ${esc(s.id)} (${esc(s.jp)}). Ikuti panah kuning.</div></div>`;
        const idle = setTimeout(() => { bubble('boss', `<b class="jp">こっち、こっち！</b> 👋`); emote('boss', '❗'); }, 6000);
        await UI.wait(done => {
          onTap = (hit, x, y) => {
            if (hit === key) { onTap = null; clearTimeout(idle); done(); return; }
            if (hit) { Sound.bump && Sound.bump(); bubble('boss', `<b class="jp">そこ じゃ なくて、${esc(s.jp)}！</b>`); emote('boss', '💦'); }
            if (free(x, y)) walk('you', x, y);
          };
        });
        goal = null; api.objective('');
        await walk('you', sx, sy); face('you', s.x, s.y); face('boss', s.x, s.y);
        hot = null;
        if (UNIFORM[job.id].at === key && UNIFORM[job.id].after == null && !api._worn) { api._worn = true; await api.wear(); }
      },
      has: k => actors.has(k),
      react(ok) {
        if (ok) { emote('boss', '👍'); bubble('boss', `<b class="jp">${esc(shuffle(['いいね！', 'そう そう！', 'じょうず！', 'ばっちり！'])[0])}</b>`); emote('you', '⭕'); }
        else { emote('boss', '💦'); bubble('boss', `<b class="jp">${esc(shuffle(['ちがう よ…', 'おしい！', 'ちょっと まって！'])[0])}</b>`); emote('you', '❌'); }
      },
      // atasan memberi petunjuk kalau pemain diam terlalu lama
      watch(hint) {
        let n = 0;
        const tick = () => { n++; const h = n === 1 ? (hint || 'ゆっくり で いい よ。よく かんがえて。') : 'がんばって！'; bubble('boss', `<b class="jp">${esc(h)}</b>`); emote('boss', '💭'); };
        const id = setInterval(tick, 9000);
        return () => clearInterval(id);
      },
      close() { cancelAnimationFrame(raf); held = null; clearInterval(holdT); UI.closePanel(); },
    };
    return api;
  }

  /* ---------- tugas di kotak bawah ---------- */
  function taskQuiz(W, st) {
    const opts = shuffle(st.opts), right = st.opts[0];
    W.box.innerHTML = `<div class="ws-q">${esc(st.q)}</div><div class="ws-opts">${opts.map((o, i) => `<button class="ws-o" data-i="${i}" type="button">${o.label ? esc(o.label) : `<span class="jp">${esc(o.jp)}</span>${ro(o.jp, o.ro)}`}</button>`).join('')}</div>`;
    const stop = W.watch(st.hint);
    return UI.wait(done => {
      W.box.querySelectorAll('.ws-o').forEach(b => b.onclick = () => {
        stop();
        const o = opts[+b.dataset.i], ok = o === right;
        W.box.querySelectorAll('.ws-o').forEach((x, i) => { x.disabled = true; if (opts[i] === right) x.classList.add('right'); });
        if (!ok) b.classList.add('wrong');
        (ok ? Sound.ok : Sound.bad)(); W.react(ok);
        if (o.jp && ok) speak(o.jp);
        done(ok ? 1 : 0);
      });
    });
  }

  function taskOrder(W, st) {
    const items = st.items.map((x, i) => ({ ...x, i }));
    W.box.innerHTML = `<div class="ws-q">${esc(st.title)}</div><p class="muted small">Ketuk sesuai urutan yang benar.</p><ol class="kj-seq"></ol><div class="kj-opts"></div><p class="kj-msg small"></p>`;
    const seq = W.box.querySelector('.kj-seq'), opts = W.box.querySelector('.kj-opts'), msg = W.box.querySelector('.kj-msg');
    const stop = W.watch(st.hint || 'さいしょ は なに かな？');
    return UI.wait(done => {
      let next = 0, miss = 0;
      opts.innerHTML = shuffle(items).map(x => `<button class="kj-o" data-i="${x.i}" type="button"><span class="jp">${esc(x.jp)}</span><small>${esc(x.id)}</small></button>`).join('');
      opts.querySelectorAll('.kj-o').forEach(b => b.onclick = () => {
        const x = items[+b.dataset.i];
        if (x.i === next) {
          Sound.ok(); b.remove(); next++; W.emote('you', '✨', 700);
          seq.insertAdjacentHTML('beforeend', `<li><b class="jp">${esc(x.jp)}</b> <small>${esc(x.id)}</small></li>`);
          W.bubble('boss', `<b class="jp">${esc(x.jp)}</b>`); msg.textContent = '';
          if (next >= items.length) { stop(); W.react(miss <= 1); done(miss <= 1 ? 1 : miss <= 3 ? .5 : 0); }
        } else {
          miss++; Sound.bad(); b.classList.add('bad'); setTimeout(() => b.classList.remove('bad'), 400);
          W.bubble('boss', `<b class="jp">ちがう！ つぎ は…</b>`); W.emote('boss', '💦');
          msg.textContent = `Belum. Langkah ke-${next + 1}: ${items[next].id.split(':')[0]}…?`;
        }
      });
    });
  }

  function taskPick(W, st) {
    const items = shuffle(st.items);
    W.box.innerHTML = `<div class="ws-q">${esc(st.title)}</div>
      <div class="kj-grid">${items.map((x, i) => `<button class="kj-t" data-i="${i}" type="button"><span class="jp">${esc(x.jp)}</span>${ro(x.jp, x.ro)}<small>${esc(x.id)}</small></button>`).join('')}</div>
      <p class="kj-msg small"></p><button class="btn block" data-a="check" type="button">Cek ✓</button>`;
    const tiles = [...W.box.querySelectorAll('.kj-t')], msg = W.box.querySelector('.kj-msg'), btn = W.box.querySelector('[data-a=check]');
    tiles.forEach(t => t.onclick = () => { if (btn.dataset.done) return; Sound.blip(); t.classList.toggle('sel'); });
    const stop = W.watch(st.hint);
    return UI.wait(done => {
      btn.onclick = () => {
        if (btn.dataset.done) { Sound.blip(); return done(btn.dataset.score === '1' ? 1 : 0); }
        stop();
        let wrong = 0; const notes = [];
        tiles.forEach((t, i) => {
          const x = items[i], sel = t.classList.contains('sel'), good = sel === x.ok;
          t.classList.add(good ? 'right' : 'wrong');
          if (!good) { wrong++; notes.push(x.ok ? `${x.jp}: wajib dipakai.` : `${x.jp}: ${x.why || 'tidak boleh.'}`); }
          else if (!x.ok && x.why) notes.push(`✓ ${x.jp}: ${x.why}`);
        });
        (wrong ? Sound.bad : Sound.ok)(); W.react(!wrong);
        msg.innerHTML = (wrong ? `❌ Ada ${wrong} yang kurang tepat.<br>` : '⭕ Semua benar!<br>') + notes.map(esc).join('<br>');
        btn.dataset.done = '1'; btn.dataset.score = wrong ? '0' : '1'; btn.textContent = 'Lanjut ▶';
      };
    });
  }

  function taskSpot(W, st) {
    const relax = !!S().settings.relax, pool = [];
    while (pool.length < st.count) pool.push(...shuffle(st.items));
    const list = pool.slice(0, st.count);
    W.box.innerHTML = `<div class="ws-q">${esc(st.title)}</div><div class="arb-timer"><i></i></div>
      <div class="kj-card"><div class="kj-emo"></div><div class="kj-d"></div></div>
      <div class="kj-yn"><button class="btn kj-ok" type="button">${esc(st.okLabel)}</button><button class="btn danger kj-ng" type="button">${esc(st.ngLabel)}</button></div>
      <p class="kj-msg small"></p><p class="muted small kj-cnt"></p>`;
    const B = W.box, emo = B.querySelector('.kj-emo'), desc = B.querySelector('.kj-d'), msg = B.querySelector('.kj-msg'), cnt = B.querySelector('.kj-cnt'), bar = B.querySelector('.arb-timer i');
    return UI.wait(done => {
      let n = -1, ok = 0, t0 = 0, raf = 0, lock = false;
      const show = () => {
        n++;
        if (n >= list.length) { cancelAnimationFrame(raf); W.react(ok >= list.length * .7); return done(ok / list.length); }
        const x = list[n];
        emo.innerHTML = `${x.e}${x.b ? `<span class="kj-b">${x.b}</span>` : ''}`;
        desc.textContent = x.d; cnt.textContent = `${n + 1}/${list.length} · benar ${ok}`;
        t0 = performance.now(); lock = false;
      };
      const answer = said => {
        if (lock || n >= list.length) return;
        lock = true;
        const x = list[n], good = said === x.ok;
        if (good) { ok++; Sound.ok(); W.emote('you', '⭕', 600); msg.innerHTML = `⭕ ${x.ok ? esc(st.okLabel) : esc(st.ngLabel + ' — ' + (x.why || ''))}`; W.bubble('boss', `<b class="jp">${esc(x.ok ? st.okLabel : 'NG、ナイス！')}</b>`); }
        else { Sound.bad(); W.emote('boss', '💦'); msg.innerHTML = `❌ ${x.ok ? 'Ini aman/bagus, seharusnya ' + esc(st.okLabel) : esc(st.ngLabel + '! ' + (x.why || ''))}`; W.bubble('boss', `<b class="jp">${esc(x.ok ? 'それ は だいじょうぶ！' : 'まって！それ は ' + st.ngLabel + '！')}</b>`); }
        setTimeout(show, good ? 450 : 1400);
      };
      B.querySelector('.kj-ok').onclick = () => answer(true);
      B.querySelector('.kj-ng').onclick = () => answer(false);
      const limit = relax ? 1e9 : st.limit;
      const loop = t => {
        if (!B.isConnected || !bar.isConnected) return;
        if (!lock && n < list.length) {
          const left = Math.max(0, 1 - (t - t0) / limit); bar.style.width = (left * 100) + '%';
          if (left <= 0) { lock = true; Sound.bad(); const x = list[n]; msg.innerHTML = `⏰ Terlambat! ${x.ok ? 'Seharusnya ' + esc(st.okLabel) : esc(st.ngLabel + ': ' + (x.why || ''))}`; W.bubble('boss', '<b class="jp">はやく！</b>'); setTimeout(show, 1300); }
        }
        raf = requestAnimationFrame(loop);
      };
      show(); raf = requestAnimationFrame(loop);
    });
  }

  /* ---------- tugas fisik (lakukan, jangan pilih) ---------- */
  // Kanvas kecil di kotak tugas dengan koordinat piksel logis
  function pad(W, w, h, cls = '') {
    const c = document.createElement('canvas'); c.width = w; c.height = h; c.className = 'kj-pad ' + cls;
    const pos = e => { const r = c.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * w, (e.clientY - r.top) / r.height * h]; };
    return { c, ctx: c.getContext('2d'), pos };
  }
  const done1 = (W, label = 'Lanjut ▶') => new Promise(res => {
    const b = document.createElement('button'); b.className = 'btn block kj-next'; b.type = 'button'; b.textContent = label;
    b.onclick = () => { Sound.blip(); res(); }; W.box.appendChild(b);
  });

  // 🧼 Cuci tangan: urutan alat + gosok semua bagian tangan sampai bersih
  function taskWash(W, st) {
    const SEQ = [['water', '💧', 'みず', 'basahi'], ['soap', '🧴', 'せっけん', 'sabun'], ['rub', '🫧', 'こする', 'gosok'], ['rinse', '🚿', 'ながす', 'bilas'], ['dry', '🧻', 'ふく', 'lap'], ['alc', '✨', 'アルコール', 'disinfeksi']];
    const ZONES = [['てのひら', 'telapak', 40, 40, 80, 60], ['てのこう', 'punggung tangan', 180, 40, 80, 60], ['ゆび の あいだ', 'sela jari', 30, 4, 100, 34], ['つめ', 'kuku', 170, 4, 100, 34], ['てくび', 'pergelangan', 100, 104, 100, 30]];
    W.box.innerHTML = `<div class="ws-q">${esc(st.title)}</div><p class="muted small">Ketuk alat sesuai urutan. Saat menggosok, usap jari di setiap bagian tangan sampai bersih (30 detik).</p>
      <div class="kj-tools">${shuffle(SEQ).map(([k, e, jp, id]) => `<button class="kj-tool" data-k="${k}" type="button"><b>${e}</b><span class="jp">${jp}</span><small>${id}</small></button>`).join('')}</div>
      <div class="kj-timer">⏱ <b>0</b> / 30 びょう</div><p class="kj-msg small"></p>`;
    const P = pad(W, 300, 140); W.box.insertBefore(P.c, W.box.querySelector('.kj-tools'));
    const clean = ZONES.map(() => 0), msg = W.box.querySelector('.kj-msg'), tEl = W.box.querySelector('.kj-timer b');
    P.c.dataset.zones = JSON.stringify(ZONES.map(z => z.slice(2)));
    let stepI = 0, miss = 0, rubT = 0, rubStart = 0, lastP = null;
    const stop = W.watch('せっけん で 30びょう、ゆび の あいだ も！');
    const draw = () => {
      const c = P.ctx; c.clearRect(0, 0, 300, 140);
      ZONES.forEach(([jp, , x, y, w, h], i) => {
        const v = clean[i] / 100;
        c.fillStyle = stepI >= 3 ? `rgba(${Math.round(150 - 60 * v)},${Math.round(110 + 100 * v)},${Math.round(80 + 120 * v)},.9)` : '#e8c9a8';
        c.beginPath(); c.roundRect ? c.roundRect(x, y, w, h, 10) : c.rect(x, y, w, h); c.fill();
        c.strokeStyle = '#2a1f2d'; c.lineWidth = 2; c.stroke();
        c.fillStyle = '#2a1f2d'; c.font = '700 11px "Zen Maru Gothic",sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(jp, x + w / 2, y + h / 2 - 6);
        c.font = '10px sans-serif'; c.fillText(Math.round(clean[i]) + '%', x + w / 2, y + h / 2 + 8);
        if (stepI === 3 && v < 1) { c.fillStyle = 'rgba(120,90,60,.5)'; for (let k = 0; k < 6 * (1 - v); k++) c.fillRect(x + 8 + (k * 23) % (w - 16), y + 6 + (k * 17) % (h - 12), 4, 4); }
        if (stepI === 3) { c.fillStyle = 'rgba(255,255,255,.7)'; c.beginPath(); c.arc(x + w - 10, y + 10, 5, 0, 7); c.fill(); }
      });
    };
    draw();
    const elapsed = () => Math.min(30, Math.floor(rubT * 2.5 / 1000));   // dipercepat 2,5×
    return UI.wait(done => {
      const rub = e => {
        if (stepI !== 3) return;
        const [x, y] = P.pos(e);
        if (lastP) { const d = Math.hypot(x - lastP[0], y - lastP[1]); ZONES.forEach(([, , zx, zy, zw, zh], i) => { if (x >= zx && x <= zx + zw && y >= zy && y <= zy + zh) clean[i] = Math.min(100, clean[i] + d * .9); }); }
        lastP = [x, y];
        if (!rubStart) rubStart = performance.now();
        rubT = performance.now() - rubStart; tEl.textContent = elapsed();
        draw();
      };
      P.c.addEventListener('pointermove', e => { if (e.buttons || e.pointerType === 'touch') rub(e); });
      P.c.addEventListener('pointerdown', e => { lastP = null; rub(e); });
      P.c.addEventListener('pointerup', () => { lastP = null; });
      W.box.querySelectorAll('.kj-tool').forEach(b => b.onclick = () => {
        const k = b.dataset.k, want = SEQ[stepI][0];
        if (k !== want) { Sound.bad(); miss++; b.classList.add('bad'); setTimeout(() => b.classList.remove('bad'), 400); W.bubble('boss', '<b class="jp">ちがう！ つぎ は…？</b>'); W.emote('boss', '💦'); msg.textContent = `Bukan itu. Langkah ke-${stepI + 1}?`; return; }
        if (k === 'rinse' && (clean.some(v => v < 100) || elapsed() < 30)) {
          Sound.bad(); miss++; W.bubble('boss', '<b class="jp">まだ！ 30びょう こすって。</b>'); W.emote('boss', '💦');
          msg.textContent = `Belum bersih: ${ZONES.filter((z, i) => clean[i] < 100).map(z => z[1]).join(', ') || 'belum 30 detik'}.`; return;
        }
        Sound.ok(); b.classList.add('done'); b.disabled = true; stepI++;
        W.R._water = stepI >= 1 && stepI <= 4;
        msg.textContent = k === 'rub' ? 'Usap setiap bagian tangan di gambar sampai 100%, minimal 30 detik.' : '';
        if (k === 'rub') W.bubble('boss', '<b class="jp">ゆび の あいだ、つめ、てくび も！</b>');
        draw();
        if (stepI >= SEQ.length) { stop(); W.R._water = false; const sc = Math.max(0, 1 - miss * .2); W.react(sc >= .8); done(sc); }
      });
    });
  }

  // 🧲 Rol perekat: gulirkan rol ke seluruh badan (depan & belakang)
  function taskRoller(W, st) {
    W.box.innerHTML = `<div class="ws-q">${esc(st.title || 'ローラー · Bersihkan baju dengan rol perekat')}</div><p class="muted small">Usap jari di badan (depan & belakang) untuk mengambil rambut & debu. Jangan lupa lengan dan punggung!</p><div class="kj-timer">🧹 <b>0</b>%</div>`;
    const P = pad(W, 300, 160); W.box.insertBefore(P.c, W.box.querySelector('.kj-timer'));
    const body = (c, ox) => { c.fillStyle = '#f4f6fa'; c.strokeStyle = '#2a1f2d'; c.lineWidth = 2; c.beginPath(); c.arc(ox + 50, 22, 16, 0, 7); c.fill(); c.stroke(); c.beginPath(); c.roundRect ? c.roundRect(ox + 24, 40, 52, 70, 8) : c.rect(ox + 24, 40, 52, 70); c.fill(); c.stroke(); c.fillRect(ox + 6, 44, 16, 52); c.strokeRect(ox + 6, 44, 16, 52); c.fillRect(ox + 78, 44, 16, 52); c.strokeRect(ox + 78, 44, 16, 52); c.fillRect(ox + 28, 110, 18, 44); c.strokeRect(ox + 28, 110, 18, 44); c.fillRect(ox + 54, 110, 18, 44); c.strokeRect(ox + 54, 110, 18, 44); };
    const specks = [];
    [40, 180].forEach(ox => { for (let i = 0; i < 18; i++) { const zone = [[ox + 26, 42, 48, 66], [ox + 8, 46, 12, 48], [ox + 80, 46, 12, 48], [ox + 30, 112, 14, 40], [ox + 56, 112, 14, 40]][i % 5]; specks.push({ x: zone[0] + Math.random() * zone[2], y: zone[1] + Math.random() * zone[3], hair: Math.random() < .5, on: true }); } });
    const el = W.box.querySelector('.kj-timer b');
    P.c.dataset.specks = JSON.stringify(specks.map(s => [Math.round(s.x), Math.round(s.y)]));
    let roller = null;
    const draw = () => {
      const c = P.ctx; c.clearRect(0, 0, 300, 160); body(c, 40); body(c, 180);
      c.fillStyle = '#2a1f2d'; c.font = '10px sans-serif'; c.textAlign = 'center'; c.fillText('まえ (depan)', 90, 158); c.fillText('うしろ (belakang)', 230, 158);
      specks.forEach(s => { if (!s.on) return; c.strokeStyle = s.hair ? '#2a1f2d' : '#9a8a7a'; c.lineWidth = 1.2; c.beginPath(); if (s.hair) { c.moveTo(s.x - 4, s.y); c.quadraticCurveTo(s.x, s.y - 4, s.x + 4, s.y + 1); } else c.arc(s.x, s.y, 1.6, 0, 7); c.stroke(); });
      if (roller) { c.fillStyle = 'rgba(246,212,74,.6)'; c.fillRect(roller[0] - 14, roller[1] - 6, 28, 12); c.strokeStyle = '#2a1f2d'; c.strokeRect(roller[0] - 14, roller[1] - 6, 28, 12); }
    };
    draw();
    const stop = W.watch('せなか も わすれないで！');
    return UI.wait(done => {
      let finished = false;
      const roll = e => {
        if (finished) return;
        roller = P.pos(e);
        specks.forEach(s => { if (s.on && Math.abs(s.x - roller[0]) < 16 && Math.abs(s.y - roller[1]) < 10) s.on = false; });
        const pct = Math.round(specks.filter(s => !s.on).length / specks.length * 100); el.textContent = pct;
        draw();
        if (pct >= 100) { finished = true; stop(); Sound.ok(); W.react(true); done(1); }
      };
      P.c.addEventListener('pointermove', e => { if (e.buttons || e.pointerType === 'touch') roll(e); });
      P.c.addEventListener('pointerdown', roll);
      const b = document.createElement('button'); b.className = 'btn block ghost'; b.type = 'button'; b.textContent = 'Sudah bersih ✓';
      b.onclick = () => { if (finished) return; finished = true; stop(); const pct = specks.filter(s => !s.on).length / specks.length; (pct >= .9 ? Sound.ok : Sound.bad)(); W.react(pct >= .9); if (pct < .9) W.bubble('boss', '<b class="jp">まだ ついてる よ！</b>'); done(pct >= .9 ? 1 : pct); };
      W.box.appendChild(b);
    });
  }

  // 🍙 Conveyor real-time: ketuk produk NG sebelum keluar layar
  function taskBelt(W, st) {
    const relax = !!S().settings.relax, N = st.count || 12;
    const items = []; while (items.length < N) items.push(...shuffle(st.items)); items.length = N;
    W.box.innerHTML = `<div class="ws-q">${esc(st.title)}</div><p class="muted small">Produk berjalan di conveyor. <b>Ketuk produk NG</b> untuk menyingkirkannya. Produk bagus biarkan lewat (ヨシ！).</p><div class="kj-timer">✅ <b class="ok">0</b> · ❌ <b class="ng">0</b> · <span class="left">${N}</span> lagi</div><p class="kj-msg small"></p>`;
    const P = pad(W, 320, 90, 'belt'); W.box.insertBefore(P.c, W.box.querySelector('.kj-timer'));
    const msg = W.box.querySelector('.kj-msg'), okEl = W.box.querySelector('.ok'), ngEl = W.box.querySelector('.ng'), leftEl = W.box.querySelector('.left');
    const speed = relax ? 34 : 58, gap = relax ? 2000 : 1250;
    return UI.wait(done => {
      const live = []; let spawned = 0, t0 = performance.now(), lastSpawn = -1e9, ok = 0, ng = 0, raf = 0, prev = t0;
      const finish = () => { cancelAnimationFrame(raf); const sc = ok / N; W.react(sc >= .8); done(sc); };
      const judge = (it, removed) => {
        it.gone = true;
        const good = removed ? !it.ok : it.ok;
        if (good) { ok++; Sound.ok(); if (removed) { W.emote('you', '⭕', 500); W.bubble('boss', '<b class="jp">NG、ナイス！</b>'); } }
        else { ng++; Sound.bad(); W.emote('boss', '💦'); W.bubble('boss', `<b class="jp">${removed ? 'それ は ヨシ！' : 'NG が ながれた！'}</b>`); msg.textContent = removed ? `Itu produk bagus: ${it.d}` : `NG lolos: ${it.why || it.d}`; }
        okEl.textContent = ok; ngEl.textContent = ng; leftEl.textContent = N - ok - ng;
        if (ok + ng >= N) setTimeout(finish, 400);
      };
      P.c.addEventListener('pointerdown', e => {
        const [x, y] = P.pos(e);
        const it = live.find(o => !o.gone && Math.abs(o.x - x) < 22 && Math.abs(45 - y) < 34);
        if (it) judge(it, true);
      });
      const loop = t => {
        if (!P.c.isConnected) return;
        const dt = Math.min(50, t - prev); prev = t;
        if (spawned < N && t - lastSpawn > gap) { live.push({ ...items[spawned], x: -20 }); spawned++; lastSpawn = t; }
        const c = P.ctx; c.clearRect(0, 0, 320, 90);
        c.fillStyle = '#4a4f5a'; c.fillRect(0, 26, 320, 40); c.fillStyle = '#2f333b'; for (let x = (t / 12) % 20; x < 320; x += 20) c.fillRect(x, 28, 3, 36);
        c.fillStyle = '#e0475f'; c.fillRect(300, 20, 4, 52);
        live.forEach(o => {
          if (o.gone) return;
          o.x += speed * dt / 1000;
          Emo.draw(c, o.e, o.x, 46, 30);
          if (o.b) Emo.draw(c, o.b, o.x + 12, 58, 16);
          if (o.x > 300) judge(o, false);
        });
        raf = requestAnimationFrame(loop);
      };
      P.c.dataset.live = '1';
      W.box._belt = live;
      raf = requestAnimationFrame(loop);
    });
  }

  // 🌡 Termometer: tusuk di bagian paling tebal, tahan sampai stabil, catat, lalu putuskan
  async function taskThermo(W, st) {
    let score = 0;
    for (const round of [{ temp: 68, ok: false }, { temp: 78, ok: true }]) {
      W.box.innerHTML = `<div class="ws-q">${round.ok ? 'Setelah dipanaskan ulang: ukur lagi' : esc(st.title || 'Ukur suhu tengah karaage')}</div>
        <p class="muted small">1) Ketuk <b>bagian paling tebal</b> untuk menusuk termometer · 2) <b>Tahan</b> tombol sampai angkanya stabil · 3) Tulis di 記録表 · 4) Putuskan.</p>
        <div class="kj-thermo"><div class="kj-meat" role="img" aria-label="karaage">
          <button class="kj-zone edge" data-z="edge" type="button" aria-label="pinggir">pinggir</button><button class="kj-zone mid" data-z="mid" type="button" aria-label="tengah">tengah (tebal)</button></div>
          <div class="kj-read"><b>--.-</b>℃</div></div>
        <button class="btn block kj-hold" type="button" disabled>⏱ Tahan 2 detik</button>
        <div class="kj-log" hidden><div class="tc-h">きろくひょう (catatan suhu)</div><div class="kj-num"><input type="text" inputmode="numeric" maxlength="3" placeholder="℃"><span>℃</span></div>
          <div class="kj-keys">${[1, 2, 3, 4, 5, 6, 7, 8, 9, '⌫', 0, '✓'].map(k => `<button type="button" data-n="${k}">${k}</button>`).join('')}</div></div>
        <div class="kj-yn" hidden><button class="btn kj-pass" type="button">✅ OK (75℃ ke atas)</button><button class="btn danger kj-re" type="button">🔁 さいかねつ (panaskan ulang)</button></div>
        <p class="kj-msg small"></p>`;
      const B = W.box, rd = B.querySelector('.kj-read b'), hold = B.querySelector('.kj-hold'), log = B.querySelector('.kj-log'), yn = B.querySelector('.kj-yn'), msg = B.querySelector('.kj-msg'), inp = B.querySelector('.kj-num input');
      let pts = 0;
      // 1) tempat menusuk
      const z = await UI.wait(d => B.querySelectorAll('.kj-zone').forEach(b => b.onclick = () => d(b.dataset.z)));
      if (z === 'edge') { Sound.bad(); W.bubble('boss', '<b class="jp">はし じゃ なくて、いちばん あつい ところ！</b>'); msg.textContent = 'Pinggir lebih cepat panas, jadi angkanya menipu. Ukur di tengah yang paling tebal.'; await UI.wait(d => B.querySelector('.kj-zone.mid').onclick = () => d()); }
      else pts += 1;
      B.querySelector('.kj-zone.mid').classList.add('in'); Sound.blip(); hold.disabled = false;
      // 2) tahan sampai stabil
      await UI.wait(d => {
        let t0 = 0, raf = 0;
        const tick = t => { if (!t0) t0 = t; const k = Math.min(1, (t - t0) / 2000); rd.textContent = (20 + (round.temp - 20) * k + (k < 1 ? Math.random() * 2 : 0)).toFixed(1); if (k >= 1) { Sound.ok(); hold.textContent = '✓ Stabil'; hold.disabled = true; d(); return; } raf = requestAnimationFrame(tick); };
        const start = e => { e.preventDefault(); t0 = 0; raf = requestAnimationFrame(tick); };
        const end = () => { if (!hold.disabled) { cancelAnimationFrame(raf); rd.textContent = '--.-'; msg.textContent = 'Tahan terus sampai angkanya berhenti berubah.'; } };
        hold.addEventListener('pointerdown', start); ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => hold.addEventListener(ev, end));
        hold._auto = () => { rd.textContent = round.temp.toFixed(1); hold.disabled = true; d(); };
      });
      // 3) tulis di catatan
      log.hidden = false; msg.textContent = 'Tulis angkanya di catatan suhu.';
      const val = await UI.wait(d => {
        B.querySelectorAll('.kj-keys button').forEach(b => b.onclick = () => { const n = b.dataset.n; Sound.blip(); if (n === '⌫') inp.value = inp.value.slice(0, -1); else if (n === '✓') d(inp.value); else if (inp.value.length < 3) inp.value += n; });
        inp.onkeydown = e => { if (e.key === 'Enter') d(inp.value); };
      });
      if (+val === round.temp) { pts += 1; Sound.ok(); } else { Sound.bad(); msg.textContent = `Catatan salah: termometer menunjukkan ${round.temp}℃, bukan ${val || '(kosong)'}.`; W.bubble('boss', '<b class="jp">きろく は ただしく！</b>'); }
      // 4) putuskan
      yn.hidden = false;
      const pass = await UI.wait(d => { B.querySelector('.kj-pass').onclick = () => d(true); B.querySelector('.kj-re').onclick = () => d(false); });
      if (pass === round.ok) { pts += 1; Sound.ok(); W.react(true); } else { Sound.bad(); W.react(false); msg.textContent = round.ok ? `${round.temp}℃ sudah lewat 75℃, boleh diloloskan.` : `${round.temp}℃ di bawah 75℃: wajib panaskan ulang!`; await sleep(1600); }
      score += pts / 3;
      if (!round.ok && pass) break;   // kalau diloloskan padahal kurang, tidak ada ronde kedua
    }
    return Math.min(1, score / 2);
  }

  // 🛁 Dial suhu (air mandi, rumah kaca, kandang…): geser ke rentang aman, cek, lalu tanya/ucapkan
  async function taskDial(W, st) {
    const min = st.min || 30, max = st.max || 50, [lo, hi] = st.target || [38, 41], unit = st.unit || '℃';
    W.box.innerHTML = `<div class="ws-q">${esc(st.title || 'Atur suhu air mandi')}</div><p class="muted small">${esc(st.hint || 'Geser dial ke suhu yang aman, cek, lalu lanjutkan.')}</p>
      <div class="kj-dial"><div class="kj-water"><b>${st.start || 44}</b>${unit}</div><input type="range" min="${min}" max="${max}" step="1" value="${st.start || 44}"></div>
      <div class="row"><button class="btn ghost kj-hand" type="button">${esc(st.check || '✋ Cek dengan tangan')}</button></div><p class="kj-msg small"></p>`;
    const B = W.box, rng = B.querySelector('input'), val = B.querySelector('.kj-water b'), wat = B.querySelector('.kj-water'), msg = B.querySelector('.kj-msg');
    const paint = () => { const v = +rng.value, k = (v - min) / (max - min); val.textContent = v; wat.style.background = `hsl(${210 - k * 200},70%,${70 - k * 20}%)`; };
    paint(); rng.oninput = paint; W.R._water = true; B.dataset.target = Math.round((lo + hi) / 2);
    let checked = false;
    const stop = W.watch(`${lo}〜${hi}${unit === '℃' ? 'ど' : unit} ぐらい が いい よ。`);
    await UI.wait(d => { B.querySelector('.kj-hand').onclick = () => { checked = true; const v = +rng.value; Sound.blip(); msg.textContent = v > hi ? '🔥 ' + (st.hot || 'あつい！ Terlalu panas untuk kulit lansia.') : v < lo ? '🥶 ' + (st.cold || 'つめたい… Terlalu dingin.') : '😊 ' + (st.good || 'ちょうど いい！ Suhunya pas.'); if (v >= lo && v <= hi) d(); }; });
    stop();
    const ok = +rng.value >= lo && +rng.value <= hi && checked;
    const ask = st.ask === false ? null : st.ask || { q: 'Sebelum nenek masuk, kamu bertanya…', opts: [{ jp: 'おゆ の かげん は どう ですか？', ro: 'oyu no kagen wa dou desu ka?' }, { jp: 'はやく はいって！', ro: 'hayaku haitte!' }, { jp: 'あつい けど、がまん して。', ro: 'atsui kedo, gaman shite.' }] };
    W.R._water = false;
    if (!ask) return ok ? 1 : 0;
    const q = await taskQuiz(W, ask);
    return (ok ? .5 : 0) + q * .5;
  }

  // 🥄 Menyuapi: tunggu tanda menelan sebelum suapan berikutnya
  function taskFeed(W, st) {
    W.box.innerHTML = `<div class="ws-q">${esc(st.title || 'しょくじ かいじょ · Suapi Nenek Kimura')}</div>
      <p class="muted small">Ucapkan salam makan dulu. Suapkan, lalu <b>tunggu sampai muncul 「ごっくん」</b> (sudah menelan) sebelum suapan berikutnya. Terlalu cepat = tersedak (むせ)!</p>
      <div class="kj-feed"><div class="kj-face">👵</div><div class="kj-cue">…</div><div class="kj-bowl">🍚 <b>0</b>/6</div></div>
      <div class="row"><button class="btn ghost kj-say" type="button">🗣 「いただきましょう」</button><button class="btn kj-spoon" type="button" disabled>🥄 Suapkan</button></div><p class="kj-msg small"></p>`;
    const B = W.box, face = B.querySelector('.kj-face'), cue = B.querySelector('.kj-cue'), cnt = B.querySelector('.kj-bowl b'), spoon = B.querySelector('.kj-spoon'), msg = B.querySelector('.kj-msg');
    const stop = W.watch('ゆっくり で いい よ。のみこんだ か みて ね。');
    return UI.wait(done => {
      let n = 0, miss = 0, ready = true, saidFirst = false, timer = 0;
      B.querySelector('.kj-say').onclick = () => { saidFirst = true; Sound.ok(); speak('いただきましょう'); spoon.disabled = false; face.textContent = '😊'; cue.textContent = 'はい、いただきます。'; B.querySelector('.kj-say').disabled = true; };
      spoon.onclick = () => {
        if (!saidFirst) return;
        if (!ready) { miss++; Sound.bad(); face.textContent = '😣'; cue.textContent = 'ゴホッ ゴホッ！ (むせ)'; W.bubble('boss', '<b class="jp">ストップ！ はやすぎる！</b>'); W.emote('boss', '💦'); msg.textContent = 'Nenek tersedak karena belum menelan. Tunggu tanda ごっくん.'; clearTimeout(timer); timer = setTimeout(() => { ready = true; face.textContent = '😌'; cue.textContent = 'ふう…'; }, 2200); return; }
        ready = false; n++; cnt.textContent = n; face.textContent = '😋'; cue.textContent = 'もぐ もぐ…'; Sound.blip();
        timer = setTimeout(() => { ready = true; face.textContent = '😊'; cue.textContent = 'ごっくん ✓'; if (n >= 6) { stop(); const sc = Math.max(0, 1 - miss * .25); W.react(sc >= .75); done(sc); } }, 1300 + Math.random() * 1300);
      };
      B._feed = () => ({ ready, saidFirst, n });
    });
  }

  // 💴 Laci kasir: ambil uang kembalian yang tepat
  async function taskCash(W, st) {
    const total = shuffle([2380, 3500, 1760, 4120, 2950])[0], paid = total < 3000 ? (total < 2000 ? 2000 : 3000) : 5000, change = paid - total;
    const yen = n => n.toLocaleString('ja-JP');
    W.box.innerHTML = `<div class="ws-q">レジ · Total ${yen(total)}えん, tamu membayar ${yen(paid)}えん</div>
      <p class="muted small">Ambil uang kembalian dari laci kasir, lalu serahkan.</p>
      <div class="kj-tray">Kembalian: <b>0</b> えん</div>
      <div class="kj-drawer">${[1000, 500, 100, 50, 10].map(v => `<button class="kj-coin ${v >= 1000 ? 'bill' : ''}" data-v="${v}" type="button">${yen(v)}</button>`).join('')}</div>
      <div class="row"><button class="btn ghost kj-clear" type="button">↺ Ulang</button><button class="btn kj-give" type="button">Serahkan ▶</button></div><p class="kj-msg small"></p>`;
    const B = W.box, tray = B.querySelector('.kj-tray b'), msg = B.querySelector('.kj-msg');
    let sum = 0;
    B.querySelectorAll('.kj-coin').forEach(b => b.onclick = () => { sum += +b.dataset.v; tray.textContent = yen(sum); Sound.blip(); });
    B.querySelector('.kj-clear').onclick = () => { sum = 0; tray.textContent = 0; };
    const stop = W.watch(`${yen(paid)} − ${yen(total)} は…？`);
    await UI.wait(d => { B.querySelector('.kj-give').onclick = () => d(); });
    stop();
    const ok = sum === change;
    (ok ? Sound.ok : Sound.bad)(); W.react(ok);
    if (!ok) { msg.textContent = `Kembalian yang benar: ${yen(paid)} − ${yen(total)} = ${yen(change)}えん.`; await sleep(1800); }
    const q = await taskQuiz(W, { q: `Saat menyerahkan ${yen(change)}えん, kamu bilang…`, opts: [{ jp: `${yen(change)}えん の おかえし です。`, ro: 'no okaeshi desu.' }, { jp: 'はい、おつり。', ro: 'hai, otsuri.' }, { jp: 'ありがとう ね！', ro: 'arigatou ne!' }] });
    return (ok ? .6 : 0) + q * .4;
  }

  // 👉 指差呼称: tunjuk titik yang diperiksa, lalu tahan untuk berseru
  async function taskShisa(W, st) {
    const PTS = shuffle([['あしもと', 'pijakan kaki', '🦶'], ['きゃたつ の ロック', 'kunci tangga', '🔒'], ['あごひも', 'tali dagu helm', '⛑️']]);
    W.box.innerHTML = `<div class="ws-q">${esc(st.title || 'しさこしょう · Tunjuk & seru sebelum naik tangga')}</div>
      <p class="muted small">Untuk setiap titik: ketuk (tunjuk) titiknya, lalu <b>tahan</b> tombol 「ヨシ！」 sampai penuh.</p>
      <div class="kj-points">${PTS.map(([jp, id, e], i) => `<button class="kj-pt" data-i="${i}" type="button"><b>${e}</b><span class="jp">${jp}</span><small>${id}</small></button>`).join('')}</div>
      <button class="btn block kj-yoshi" type="button" disabled><span class="fill"></span>👉 ヨシ！ (tahan)</button><p class="kj-msg small"></p>`;
    const B = W.box, btn = B.querySelector('.kj-yoshi'), fill = btn.querySelector('.fill'), msg = B.querySelector('.kj-msg');
    let doneN = 0, cur = -1, miss = 0;
    await UI.wait(d => {
      B.querySelectorAll('.kj-pt').forEach(b => b.onclick = () => { if (b.classList.contains('done')) return; cur = +b.dataset.i; B.querySelectorAll('.kj-pt').forEach(x => x.classList.toggle('sel', x === b)); btn.disabled = false; Sound.blip(); });
      let t0 = 0, raf = 0;
      const tick = t => { if (!t0) t0 = t; const k = Math.min(1, (t - t0) / 800); fill.style.width = (k * 100) + '%'; if (k >= 1) { const [jp] = PTS[cur]; speak(jp + '、よし！'); Sound.ok(); W.bubble('boss', `<b class="jp">${esc(jp)}、ヨシ！</b>`); B.querySelector(`.kj-pt[data-i="${cur}"]`).classList.add('done'); doneN++; cur = -1; btn.disabled = true; fill.style.width = 0; if (doneN >= PTS.length) d(); return; } raf = requestAnimationFrame(tick); };
      btn.addEventListener('pointerdown', e => { e.preventDefault(); if (cur < 0) { miss++; msg.textContent = 'Tunjuk dulu titiknya!'; return; } t0 = 0; raf = requestAnimationFrame(tick); });
      ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => btn.addEventListener(ev, () => { cancelAnimationFrame(raf); if (cur >= 0 && fill.style.width !== '0px' && parseFloat(fill.style.width) < 100) { fill.style.width = 0; msg.textContent = 'Tahan sampai penuh sambil berseru!'; } }));
    });
    W.react(miss === 0);
    return Math.max(0, 1 - miss * .2);
  }

  // 🛠 Aksi nyata: dengar perintah (Jepang) → pilih alat yang benar → lakukan di sasaran
  const HOW = { tap: ['👆', 'Ketuk sasaran'], hold: ['✋', 'Tahan sasaran'], swipe: ['↔️', 'Usap sasaran'] };
  async function taskAct(W, st) {
    const seen = new Set(), tools = shuffle([...st.steps.map(x => x.tool), ...(st.extras || [])].filter(([e, n]) => { const k = e + n; if (seen.has(k)) return false; seen.add(k); return true; }));
    W.box.innerHTML = `<div class="ws-q">${esc(st.title)}</div>
      <div class="kj-act"><div class="kj-target" role="button" tabindex="0"><b>${st.target}</b><span class="kj-tl">${esc(st.targetLabel || '')}</span><span class="kj-state"></span><div class="kj-prog"><i></i></div><span class="kj-how"></span></div>
        <div class="kj-order"><div class="kj-cmd"></div><button class="kj-hint" type="button">💡 Petunjuk</button><small class="kj-hid" hidden></small></div></div>
      <div class="kj-toolbox">${tools.map(([e, n]) => `<button class="kj-tool2" type="button" data-n="${esc(n)}"><b>${e}</b><span class="jp">${esc(n)}</span></button>`).join('')}</div>
      <p class="kj-msg small"></p><p class="muted small kj-cnt"></p>`;
    const B = W.box, tg = B.querySelector('.kj-target'), state = B.querySelector('.kj-state'), how = B.querySelector('.kj-how'), bar = B.querySelector('.kj-prog i'), cmd = B.querySelector('.kj-cmd'), hid = B.querySelector('.kj-hid'), msg = B.querySelector('.kj-msg'), cnt = B.querySelector('.kj-cnt');
    let miss = 0;
    const stop = W.watch('どうぐ を よく みて。');
    for (let i = 0; i < st.steps.length; i++) {
      const s = st.steps[i], [need, needN] = s.tool;
      const m = /^taps:(\d+)$/.exec(s.how || 'tap'), kind = m ? 'taps' : (s.how || 'tap'), times = m ? +m[1] : 1;
      cmd.innerHTML = `<b class="jp">「${esc(s.jp)}」</b>`; hid.hidden = S().settings.kjTrans === false; hid.textContent = s.id || '';
      cnt.textContent = `Langkah ${i + 1}/${st.steps.length}`; how.textContent = ''; bar.style.width = 0; tg.classList.remove('ready');
      W.bubble('boss', `<b class="jp">${esc(s.jp)}</b>`); speak(s.jp);
      B.dataset.tool = needN; B.dataset.how = kind; B.dataset.times = times;
      B.querySelector('.kj-hint').onclick = () => { hid.hidden = false; Sound.blip(); };
      // 1) pilih alat
      await UI.wait(d => B.querySelectorAll('.kj-tool2').forEach(b => b.onclick = () => {
        B.querySelectorAll('.kj-tool2').forEach(x => x.classList.remove('sel'));
        if (b.dataset.n === needN) { b.classList.add('sel'); Sound.blip(); d(); }
        else { miss++; Sound.bad(); b.classList.add('bad'); setTimeout(() => b.classList.remove('bad'), 400); W.bubble('boss', `<b class="jp">ちがう！ それ は ${esc(b.dataset.n)}。</b>`); W.emote('boss', '💦'); msg.textContent = `Bukan itu. Dengarkan lagi: 「${s.jp}」`; hid.hidden = false; }
      }));
      // 2) lakukan aksinya di sasaran
      const [ic, label] = kind === 'taps' ? ['👆', `Ketuk sasaran ${times}×`] : HOW[kind] || HOW.tap;
      how.textContent = `${ic} ${label}`; tg.classList.add('ready'); msg.textContent = '';
      await UI.wait(d => {
        let n = 0, dist = 0, last = null, t0 = 0, raf = 0, down = false;
        const fin = () => { tg.onpointerdown = tg.onpointermove = tg.onpointerup = tg.onpointerleave = null; cancelAnimationFrame(raf); d(); };
        const tick = t => { if (!t0) t0 = t; const k = Math.min(1, (t - t0) / 900); bar.style.width = k * 100 + '%'; if (k >= 1) return fin(); raf = requestAnimationFrame(tick); };
        tg.onpointerdown = e => {
          e.preventDefault(); down = true; last = [e.clientX, e.clientY];
          if (kind === 'tap') return fin();
          if (kind === 'taps') { n++; bar.style.width = n / times * 100 + '%'; tg.classList.add('hit'); setTimeout(() => tg.classList.remove('hit'), 120); Sound.blip(); if (n >= times) fin(); return; }
          if (kind === 'hold') { t0 = 0; raf = requestAnimationFrame(tick); }
        };
        tg.onpointermove = e => {
          if (kind !== 'swipe' || !down || !last) return;
          dist += Math.hypot(e.clientX - last[0], e.clientY - last[1]); last = [e.clientX, e.clientY];
          bar.style.width = Math.min(100, dist / 1.6) + '%'; if (dist >= 160) fin();
        };
        tg.onpointerup = tg.onpointerleave = () => { down = false; last = null; if (kind === 'hold') { cancelAnimationFrame(raf); if (parseFloat(bar.style.width) < 100) { bar.style.width = 0; how.textContent = '✋ Tahan lebih lama!'; } } };
      });
      Sound.ok(); tg.classList.remove('ready'); W.emote('you', '✨', 600);
      state.textContent = s.after || '✓'; how.textContent = '✅';
      B.querySelectorAll('.kj-tool2').forEach(x => x.classList.remove('sel'));
      await sleep(450);
    }
    stop();
    const sc = Math.max(0, 1 - miss * .2); W.react(sc >= .8);
    return sc;
  }

  // 🔎 Cari bahaya: ketuk semua bahaya di gambar lokasi kerja
  function taskHunt(W, st) {
    const relax = !!S().settings.relax, limit = relax ? 1e9 : (st.limit || 30000);
    const items = st.items, haz = items.filter(x => !x.ok).length;
    W.box.innerHTML = `<div class="ws-q">${esc(st.title)}</div><p class="muted small">Ketuk semua <b>bahaya</b> di gambar. Hal yang aman jangan diketuk.</p><div class="arb-timer"><i></i></div><div class="kj-timer">⚠️ <b class="ok">0</b>/${haz} · ❌ <b class="ng">0</b></div><p class="kj-msg small"></p>`;
    const P = pad(W, 320, 160, 'hunt'); W.box.insertBefore(P.c, W.box.querySelector('.kj-timer'));
    P.c.dataset.items = JSON.stringify(items.map(x => [x.x, x.y, x.ok ? 0 : 1]));
    const okEl = W.box.querySelector('.ok'), ngEl = W.box.querySelector('.ng'), msg = W.box.querySelector('.kj-msg'), bar = W.box.querySelector('.arb-timer i');
    const draw = () => {
      const c = P.ctx; c.fillStyle = '#d8c79a'; c.fillRect(0, 0, 320, 160); c.fillStyle = '#9fc4e8'; c.fillRect(0, 0, 320, 26);
      c.strokeStyle = '#7a7f88'; c.lineWidth = 2; for (let x = 20; x < 320; x += 60) { c.beginPath(); c.moveTo(x, 26); c.lineTo(x, 70); c.stroke(); }
      items.forEach(it => { Emo.draw(c, it.e, it.x, it.y, 28); if (it.found) { c.strokeStyle = it.ok ? '#3b8a78' : '#e0475f'; c.lineWidth = 3; c.beginPath(); c.arc(it.x, it.y, 20, 0, 7); c.stroke(); } });
    };
    draw();
    const stop = W.watch('あし もと、あたま の うえ、まわり を よく みて。');
    return UI.wait(done => {
      let ok = 0, ng = 0, t0 = performance.now(), raf = 0, end = false;
      const finish = () => { if (end) return; end = true; cancelAnimationFrame(raf); stop(); const sc = Math.max(0, Math.min(1, (ok - ng * .5) / haz)); W.react(sc >= .8); done(sc); };
      P.c.addEventListener('pointerdown', e => {
        if (end) return;
        const [x, y] = P.pos(e), it = items.find(o => !o.found && Math.hypot(o.x - x, o.y - y) < 22);
        if (!it) return;
        it.found = true;
        if (!it.ok) { ok++; Sound.ok(); msg.textContent = `⚠️ ${it.d} → ${it.why || 'bahaya!'}`; W.bubble('boss', '<b class="jp">そう、あぶない！</b>'); if (ok >= haz) setTimeout(finish, 500); }
        else { ng++; Sound.bad(); msg.textContent = `Itu aman: ${it.d}.`; W.bubble('boss', '<b class="jp">それ は だいじょうぶ。</b>'); }
        okEl.textContent = ok; ngEl.textContent = ng; draw();
      });
      const btn = document.createElement('button'); btn.className = 'btn block ghost'; btn.type = 'button'; btn.textContent = 'Sudah semua ✓'; btn.onclick = finish; W.box.appendChild(btn);
      const loop = t => { if (!P.c.isConnected || end) return; const left = Math.max(0, 1 - (t - t0) / limit); bar.style.width = left * 100 + '%'; if (left <= 0) { msg.textContent = '⏰ Waktu habis!'; finish(); return; } raf = requestAnimationFrame(loop); };
      raf = requestAnimationFrame(loop);
    });
  }

  /* ---------- menjalankan satu shift ---------- */
  const HEAVY = ['spot', 'belt', 'wash', 'thermo', 'harvest', 'sort', 'act', 'hunt'];   // tugas fisik: bobot nilai 2×
  const TASKS = { quiz: taskQuiz, order: taskOrder, pick: taskPick, spot: taskSpot, wash: taskWash, roller: taskRoller, belt: taskBelt, thermo: taskThermo, dial: taskDial, feed: taskFeed, cash: taskCash, shisa: taskShisa, act: taskAct, hunt: taskHunt };
  const TASK_START = { spot: 'はじめ！', belt: 'ライン スタート！', order: 'じゅんばん に やって みて。', pick: 'えらんで ください。', wash: 'てあらい スタート！', roller: 'ローラー を かけて。', thermo: 'おんど を はかって。', dial: 'おゆ の おんど を みて。', feed: 'ゆっくり ね。', cash: 'おつり を おねがい。', shisa: 'しさこしょう！', act: 'いっしょ に やって みよう。', hunt: 'きけん を さがして！' };
  // Kategori 評価シート
  const CATS = [['anzen', '安全', 'Keselamatan'], ['eisei', '衛生', 'Kebersihan'], ['horenso', '報連相', 'Komunikasi'], ['seikaku', '正確さ', 'Ketepatan'], ['speed', 'スピード', 'Kecepatan'], ['kotoba', '言葉づかい', 'Bahasa & sopan santun']];
  const COMMENT = {
    anzen: ['Keselamatanmu sangat baik. ご安全に！', 'Hati-hati dengan keselamatan. Ingat: keselamatan nomor satu.'],
    eisei: ['Kebersihanmu rapi sekali, cocok untuk pekerjaan yang menuntut higiene tinggi.', 'Kebersihan masih kurang. Cuci tangan, desinfeksi & cek produk lebih teliti, ya.'],
    horenso: ['Laporanmu cepat & jelas. ほうれんそう bagus!', 'Kalau ada masalah, langsung lapor. Jangan disimpan sendiri.'],
    seikaku: ['Kerjamu teliti dan tepat.', 'Masih ada yang terlewat. Ikuti urutan kerja pelan-pelan.'],
    speed: ['Kerjamu cepat tanpa mengorbankan ketelitian.', 'Coba sedikit lebih cepat. Nanti terbiasa sendiri, kok.'],
    kotoba: ['Bahasa & sopan santunmu bagus sekali.', 'Perhatikan bahasa sopan ke atasan dan tamu (です・ます, keigo).'],
  };
  function catOf(job, st) {
    if (st.cat) return st.cat;
    if (TASK_CAT[st.t]) return TASK_CAT[st.t];
    const t = st.t, txt = `${st.q || ''} ${st.why || ''} ${st.title || ''}`;
    if (['wash', 'roller', 'belt'].includes(t)) return 'eisei';
    if (['dial', 'feed', 'shisa'].includes(t)) return 'anzen';
    if (t === 'thermo') return 'eisei';
    if (t === 'cash' || t === 'order' || t === 'act') return 'seikaku';
    if (t === 'hunt') return 'anzen';
    if (t === 'pick') return job.id === 'food' ? 'eisei' : 'anzen';
    if (t === 'spot') return job.id === 'genba' ? 'anzen' : 'eisei';
    if (/lapor|ほうこく|ほうれんそう|もう いちど|paham|laporan/i.test(txt)) return 'horenso';
    if (/bahaya|jatuh|helm|heat|ねっちゅう|tersedak|alergi|logam|てんとう|あぶない|demam|ねつ/i.test(txt)) return 'anzen';
    if (/diare|bersih|rol|おなか/i.test(txt)) return 'eisei';
    if (/bilang|ucap|jawab|salam|sopan|pamit|sapa/i.test(txt)) return 'kotoba';
    return 'seikaku';
  }

  async function run(job, opts = {}) {
    const R = opts.room || ROOMS[job.id], steps = opts.steps || job.steps, dayMode = !!opts.day, bossId = R.boss || BOSS[job.id];
    Music.play && Music.play('home');
    const W = stage(job, opts.room);
    Kerja._keys = W.keys; Kerja._release = W.release; Kerja._room = R;
    if (dayMode) W.setDay(opts.day, opts.dayInfo && opts.dayInfo.title);
    const tally = Object.fromEntries(CATS.map(([k]) => [k, []]));
    let got = 0, max = 0;
    const firstClock = steps.find(s => s.t === 'clock'), lastClock = [...steps].reverse().find(s => s.t === 'clock');
    try {
      for (let i = 0; i < steps.length; i++) {
        const st = steps[i];
        const cast = st.cast || (dayMode ? null : R.cast[i]); if (cast) W.cast(cast);
        if (st.t === 'clock') { W.bubble(null); W.box.innerHTML = ''; await W.clock(st.time, st.title); }
        const at = st.at || (dayMode ? null : R.at[i]); if (at) await W.lead(at);
        if (st === firstClock) { await W.timecard('in', st.time); if (dayMode && !W._worn) { W._worn = true; await W.wear(); } }
        if (st.t === 'clock') continue;
        if (st.t === 'say') { await W.line(st); continue; }
        if (st.t === 'quiz' && (st.jp || st.id)) await W.line({ w: st.w, e: st.e, jp: st.jp, ro: st.ro, id: st.id }, 'Kerjakan ▶');
        const li = W.todo((st.q || st.title || '').slice(0, 70));
        W.bubble('boss', `<b class="jp">${esc(TASK_START[st.t] || 'どう する？')}</b>`);
        const t0 = performance.now();
        const r = await TASKS[st.t](W, st);
        const secs = (performance.now() - t0) / 1000, wgt = HEAVY.includes(st.t) ? 2 : 1;
        got += r * wgt; max += wgt; W.score(Math.round(got * 10));
        tally[catOf(job, st)].push(r);
        tally.speed.push(r <= 0 ? 0 : Math.max(.2, Math.min(1, (st.t === 'quiz' ? 14 : 45) / Math.max(secs, 1))));
        li.classList.add(r >= .99 ? 'ok' : r > 0 ? 'mid' : 'ng');
        if (st.why) await W.line({ w: bossId, e: r >= .5 ? 'happy' : 'normal', t: `${r >= .99 ? '⭕' : r > 0 ? '🟡' : '❌'}${st.t === 'quiz' && r < 1 ? ` Yang tepat: 「${st.opts[0].label || st.opts[0].jp}」.` : ''} ${st.why}` });
        else if (st.t !== 'quiz') await W.line({ w: bossId, t: r >= .99 ? '⭕ Bagus, rapi sekali!' : r > 0 ? '🟡 Lumayan. Masih ada yang bisa diperbaiki.' : '❌ Masih banyak yang salah. Ulangi lagi lain kali, ya.' });
        if (!dayMode && UNIFORM[job.id].after === i) await W.wear();
      }
      if (lastClock) await W.timecard('out', lastClock.end || lastClock.time);
    } finally {
      Kerja._keys = null; Kerja._release = null;
    }
    W.close();
    const pct = max ? Math.round(got / max * 100) : 100, rank = rankOf(pct);
    const stars = Object.fromEntries(CATS.map(([k]) => { const a = tally[k]; return [k, a.length ? Math.max(1, Math.round(1 + 4 * a.reduce((x, y) => x + y, 0) / a.length)) : null]; }));
    if (opts.practice) {   // latihan aksi: tidak mengubah rekor karier
      await result(job, pct, rank, false, stars, opts);
      const pp = Math.round(pct / 20); if (pp) H().addPoints(pp, 'latihan aksi');
      return;
    }
    const Rr = rec(), r0 = Object.assign({ best: null, plays: 0, last: 0, day: 1, days: {} }, Rr[job.id] || {});
    r0.days = r0.days || {}; r0.day = r0.day || 1;
    const firstToday = r0.last !== S().day;
    const better = !r0.best || 'SABC'.indexOf(rank) < 'SABC'.indexOf(r0.best);
    let firstClear = false;
    if (dayMode) {
      const prev = r0.days[opts.day];
      if (!prev || 'SABC'.indexOf(rank) < 'SABC'.indexOf(prev)) r0.days[opts.day] = rank;
      if (opts.day >= r0.day) { r0.day = opts.day + 1; firstClear = true; }
    }
    Rr[job.id] = Object.assign(r0, { best: better ? rank : r0.best, plays: r0.plays + 1, last: S().day, stars });
    Save.write();
    await result(job, pct, rank, better && r0.best && !dayMode, stars, opts);
    if (dayMode && [5, 10, 15].includes(opts.day)) await paySlip(job, opts.day);
    if (dayMode && opts.day === 15 && firstClear) await certificate(job);
    else if (dayMode && opts.day === 15) await certificate(job, true);
    const pts = Math.round(pct / 100 * (dayMode ? (firstClear ? 30 : 8) : firstToday ? 30 : 10));
    if (pts) H().addPoints(pts, `gaji ${job.name}`);
    if (rank === 'S' || rank === 'A') H().addStamp('kerja_' + job.id, `${job.icon} Pekerja teladan: ${job.name}`);
    if (JOBS.every(j => Rr[j.id])) H().addStamp('kerja_all', '💼 Sudah mencoba semua simulasi kerja');
  }

  // Mulai hari ke-n dari karier 15 hari
  async function runDay(job, n) {
    const d = (DAYS[job.id] || [])[n - 1];
    if (!d || !dayBuilder) return run(job);
    return run(job, { steps: dayBuilder(job, d, n), day: n, dayInfo: d, room: d.room });
  }
  const careerDay = id => Math.min(16, (rec()[id] && rec()[id].day) || 1);

  function result(job, pct, rank, improved, stars, opts = {}) {
    const msg = { S: 'すばらしい！ Siap kerja di Jepang!', A: 'よく できました！ Tinggal sedikit lagi.', B: 'まあまあ。 Ulangi untuk hafal alurnya.', C: 'がんばろう！ Baca Info Kerja, lalu coba lagi.' }[rank];
    const rated = CATS.filter(([k]) => stars[k]);
    const best = rated.slice().sort((a, b) => stars[b[0]] - stars[a[0]])[0], worst = rated.slice().sort((a, b) => stars[a[0]] - stars[b[0]])[0];
    const boss = BOSS[job.id];
    const comment = best && worst && stars[worst[0]] < 4 ? `${COMMENT[best[0]][0]} Tapi: ${COMMENT[worst[0]][1]}` : best ? COMMENT[best[0]][0] + ' Pertahankan!' : '';
    const p = UI.panel(`<div class="win kj">
      <div class="w-title">ひょうか シート · Lembar evaluasi</div>
      ${opts.day ? dayHead(job, opts.day, opts.dayInfo) : ''}
      <div class="kj-res"><div class="kj-rank r${rank}">${rank}</div><div><b>${job.icon} ${esc(job.name)}</b><br>Skor ${pct}%${improved ? ' · <b>Rekor baru!</b>' : ''}<br><span class="muted small">${msg}</span></div></div>
      <table class="kj-eval">${CATS.map(([k, jp, id]) => `<tr><td><b class="jp">${jp}</b><small>${id}</small></td><td class="st">${stars[k] ? '★'.repeat(stars[k]) + '☆'.repeat(5 - stars[k]) : '<span class="muted">—</span>'}</td></tr>`).join('')}</table>
      ${comment ? `<div class="kj-comment"><canvas width="32" height="32"></canvas><div><b>${esc(CHARACTERS[boss].name)}</b><p>${esc(comment)}</p></div></div>` : ''}
      ${opts.dayInfo && opts.dayInfo.learn ? `<div class="kj-learn"><b>📘 Pelajaran hari ini</b><p>${esc(opts.dayInfo.learn)}</p></div>` : ''}
      <div class="sec-h">Kosakata kerja hari ini</div>
      <div class="kj-voc">${vocabRows(job, opts.dayInfo && opts.dayInfo.vocab)}</div>
      ${opts.dayInfo && opts.dayInfo.next && opts.day < 15 ? `<div class="kj-next-day"><b>Besok · Hari ${opts.day + 1}</b><p>${esc(opts.dayInfo.next)}</p></div>` : ''}
      <button class="btn block" data-a="close" type="button">Selesai</button></div>`, 'scroll');
    const fc = p.querySelector('.kj-comment canvas'); if (fc) Pix.drawPortrait(fc, boss, 'happy');
    bindVocab(p);
    return UI.wait(done => { p.querySelector('[data-a=close]').onclick = () => { Sound.blip(); UI.closePanel(); done(); }; });
  }

  // Garis kemajuan 15 hari
  function dayHead(job, n, d) {
    const r = rec()[job.id] || {}, days = r.days || {};
    return `<div class="kj-dayhead"><div><b>📅 Hari ${n}/15</b> · ${esc((d && d.title) || '')}</div>
      <div class="kj-dots">${Array.from({ length: 15 }, (_, i) => `<i class="${days[i + 1] ? 'r' + days[i + 1] : ''} ${i + 1 === n ? 'now' : ''}" title="Hari ${i + 1}">${i + 1}</i>`).join('')}</div></div>`;
  }
  // 給与明細: contoh slip gaji per minggu
  function paySlip(job, n) {
    const week = n / 5, wage = 1100, hours = 40, gross = wage * hours, tax = 1000, ins = 6600, dorm = 7500, net = gross - tax - ins - dorm;
    const yen = v => '¥' + v.toLocaleString('ja-JP');
    const p = UI.panel(`<div class="win kj"><div class="w-title">きゅうよ めいさい · Slip gaji minggu ${week}</div>
      <div class="kj-slip"><div class="tc-h">給与明細 (きゅうよめいさい) · ${esc(job.name)}</div><div class="tc-name">${esc(S().name || 'Kamu')} 様</div>
        <table>
          <tr><td>時給 <small>じきゅう · upah per jam</small></td><td>${yen(wage)}</td></tr>
          <tr><td>労働時間 <small>ろうどうじかん · jam kerja</small></td><td>${hours} jam (8 × 5 hari)</td></tr>
          <tr class="sum"><td>総支給額 <small>そうしきゅうがく · bruto</small></td><td>${yen(gross)}</td></tr>
          <tr class="minus"><td>所得税 <small>しょとくぜい · pajak</small></td><td>− ${yen(tax)}</td></tr>
          <tr class="minus"><td>社会保険 <small>しゃかいほけん · asuransi</small></td><td>− ${yen(ins)}</td></tr>
          <tr class="minus"><td>寮費 <small>りょうひ · asrama</small></td><td>− ${yen(dorm)}</td></tr>
          <tr class="net"><td>差引支給額 <small>さしひき · diterima</small></td><td>${yen(net)}</td></tr>
        </table>
        <p class="muted small">Total diterima ${week} minggu: <b>${yen(net * week)}</b> (≈ Rp${Math.round(net * week * 105 / 1000) * 1000 > 0 ? (Math.round(net * week * 105 / 1000) * 1000).toLocaleString('id-ID') : '-'} kurs contoh ¥1 = Rp105)</p></div>
      <p class="muted small">⚠ Angka hanya CONTOH. Upah, potongan, dan biaya asrama tergantung kontrak, daerah, dan aturan terbaru. Selalu minta & simpan slip gajimu, dan tanyakan ke perusahaan/pendamping kalau ada potongan yang tidak jelas.</p>
      <button class="btn block" data-a="close" type="button">Simpan slip</button></div>`, 'scroll');
    Sound.star();
    return UI.wait(done => { p.querySelector('[data-a=close]').onclick = () => { Sound.blip(); UI.closePanel(); done(); }; });
  }
  // 修了証: sertifikat setelah hari 15
  function certificate(job, again) {
    const r = rec()[job.id] || {}, ranks = Object.values(r.days || {});
    const avg = ranks.length ? ranks.reduce((a, x) => a + 'SABC'.indexOf(x), 0) / ranks.length : 3;
    const final = 'SABC'[Math.round(avg)];
    const date = new Date().toLocaleDateString('ja-JP');
    const p = UI.panel(`<div class="win kj"><div class="kj-cert">
      <div class="c-h">修 了 証</div><div class="c-sub">しゅうりょうしょう · Sertifikat</div>
      <div class="c-name">${esc(S().name || 'Kamu')} 殿</div>
      <p>Telah menyelesaikan <b>simulasi kerja 15 hari</b> bidang<br><b>${job.icon} ${esc(job.name)} (${esc(job.k)})</b></p>
      <div class="c-rank">Nilai akhir <b class="r${final}">${final}</b></div>
      <div class="c-foot"><span>${date}</span><span class="c-stamp">${esc((CHARACTERS[BOSS[job.id]].name.match(/\(([^)]+)\)/) || ['', '印'])[1])}<br>印</span></div>
      </div>
      <p class="muted small">Sertifikat ini bagian dari game (bukan dokumen resmi). Untuk kerja sungguhan, siapkan ujian Tokutei Ginou & bahasa Jepang (JLPT N4 / JFT-Basic).</p>
      <button class="btn block" data-a="close" type="button">${again ? 'Tutup' : 'おせわ に なりました！'}</button></div>`, 'scroll');
    Sound.star();
    if (!again) { H().addStamp('kerja15_' + job.id, `🎓 Lulus 15 hari: ${job.name}`); H().addPoints(100, 'kelulusan kerja'); }
    return UI.wait(done => { p.querySelector('[data-a=close]').onclick = () => { Sound.blip(); UI.closePanel(); done(); }; });
  }

  const vocabRows = (job, list) => (list && list.length ? list : job.vocab).map(([k, kana, r, id]) => `<button class="kj-v" type="button" data-say="${esc(kana.replace(/\s*\(.*\)/, ''))}"><b class="jp">${esc(k)}</b><span class="jp">${esc(kana)}</span><small>${esc(r)} · ${esc(id)}</small><i>♪</i></button>`).join('');
  const bindVocab = p => p.querySelectorAll('.kj-v').forEach(b => b.onclick = () => Sound.speak(b.dataset.say));

  /* ---------- info kerja (gambaran nyata) ---------- */
  function info(job) {
    const I = job.info, li = a => `<ul class="kj-ul">${a.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`;
    const p = UI.panel(`<div class="win kj">
      <div class="w-title">${job.icon} ${esc(job.name)} <span class="jp muted">${esc(job.k)}</span></div>
      <div class="sec-h">Tugas sehari-hari</div>${li(I.tugas)}
      <div class="sec-h">Contoh jadwal satu hari</div>${li(I.jadwal)}
      <div class="sec-h">Kondisi kerja</div><p class="small">${esc(I.kondisi)}</p>
      <div class="sec-h">Jalur visa & ujian</div><p class="small">${esc(I.visa)}</p>
      <div class="sec-h">Tips dari senpai</div><p class="small">${esc(I.tips)}</p>
      <div class="sec-h">Kosakata penting</div><div class="kj-voc">${vocabRows(job)}</div>
      <p class="muted small">Info umum untuk gambaran. Aturan visa & ujian bisa berubah, cek situs resmi ssw.go.jp sebelum mendaftar.</p>
      <div class="row"><button class="btn ghost" data-a="close" type="button">Tutup</button><button class="btn" data-a="go" type="button">Mulai shift ▶</button></div></div>`, 'scroll');
    bindVocab(p);
    return UI.wait(done => {
      p.querySelector('[data-a=close]').onclick = () => { Sound.blip(); UI.closePanel(); done(false); };
      p.querySelector('[data-a=go]').onclick = () => { Sound.blip(); UI.closePanel(); done(true); };
    });
  }

  /* ---------- pilih tempat kerja (Menu → Kerja) ---------- */
  function dayList(job) {
    const r = rec()[job.id] || {}, days = r.days || {}, upto = careerDay(job.id);
    const p = UI.panel(`<div class="win kj"><div class="w-title">📅 ${job.icon} ${esc(job.name)} · 15 hari</div>
      <p class="small muted">Semua hari terbuka. Sudah berpengalaman? Langsung pilih hari yang kamu mau. Hari berikutnya yang disarankan: <b>Hari ${Math.min(15, upto)}</b>.</p>
      <div class="kj-days">${(DAYS[job.id] || []).map((d, i) => { const n = i + 1, open = true; return `<button class="kj-dayb ${open ? '' : 'lock'}" data-n="${n}" type="button" ${open ? '' : 'disabled'}><b>Hari ${n}</b><span>${esc(d.title)}</span><i>${days[n] ? `<em class="r${days[n]}">${days[n]}</em>` : open ? '▶' : '🔒'}</i></button>`; }).join('')}</div>
      <button class="btn block ghost" data-a="close" type="button">Tutup</button></div>`, 'scroll');
    return UI.wait(done => {
      p.querySelectorAll('.kj-dayb:not([disabled])').forEach(b => b.onclick = () => { Sound.blip(); UI.closePanel(); done(+b.dataset.n); });
      p.querySelector('[data-a=close]').onclick = () => { Sound.blip(); UI.closePanel(); done(0); };
    });
  }

  /* ---------- 📚 kamus kerja & latihan kosakata ---------- */
  const KCAT = [['all', '📚 Semua'], ['alat', '🧰 Alat & benda'], ['tempat', '📍 Tempat'], ['tindakan', '🙌 Tindakan'], ['aman', '⚠️ Keselamatan'], ['ungkapan', '💬 Ungkapan']];
  function seenWords(job) {
    const r = rec()[job.id] || {}, set = new Set();
    Object.keys(r.days || {}).forEach(n => ((DAYS[job.id] || [])[n - 1]?.vocab || []).forEach(v => set.add(v[1])));
    (r.plays ? job.vocab : []).forEach(v => set.add(v[1]));
    return set;
  }
  async function kotoba(job) {
    const words = GLOSS[job.id] || job.vocab.map(v => [...v, 'alat']);
    let cat = 'all';
    for (;;) {
      const seen = seenWords(job), list = words.filter(w => cat === 'all' || w[4] === cat);
      const p = UI.panel(`<div class="win kj"><div class="w-title">📚 ${job.icon} Kosakata ${esc(job.name)}</div>
        <p class="small muted">${words.length} kata kerja nyata · ⭐ ${words.filter(w => seen.has(w[1])).length} sudah kamu temui di karier. Ketuk kata untuk mendengar.</p>
        <div class="kj-kcat">${KCAT.map(([k, l]) => `<button type="button" class="${k === cat ? 'on' : ''}" data-cat="${k}">${l}</button>`).join('')}</div>
        <div class="kj-voc">${list.map(([k, kana, r, id]) => `<button class="kj-v ${seen.has(kana) ? 'seen' : ''}" type="button" data-say="${esc(kana.replace(/〜/g, ''))}"><b class="jp">${esc(k)}</b><span class="jp">${esc(kana)}</span><small>${esc(r)} · ${esc(id)}</small><i>${seen.has(kana) ? '⭐' : '♪'}</i></button>`).join('')}</div>
        <div class="row"><button class="btn ghost" data-a="close" type="button">Tutup</button><button class="btn" data-a="quiz" type="button">🎯 Latihan 10 soal</button></div></div>`, 'scroll');
      p.querySelectorAll('.kj-v').forEach(b => b.onclick = () => Sound.speak(b.dataset.say));
      const a = await UI.wait(d => {
        p.querySelectorAll('[data-cat]').forEach(b => b.onclick = () => { Sound.blip(); d({ cat: b.dataset.cat }); });
        p.querySelector('[data-a=close]').onclick = () => { Sound.blip(); d(null); };
        p.querySelector('[data-a=quiz]').onclick = () => { Sound.blip(); d({ quiz: true }); };
      });
      UI.closePanel();
      if (!a) return;
      if (a.cat) cat = a.cat;
      if (a.quiz) await vocabQuiz(job, words);
    }
  }
  async function vocabQuiz(job, words) {
    const qs = shuffle(words).slice(0, 10);
    let ok = 0;
    for (let i = 0; i < qs.length; i++) {
      const w = qs[i], toJp = i % 2 === 1;   // selang-seling: Jepang → arti, arti → Jepang
      const others = shuffle(words.filter(x => x !== w && x[3] !== w[3])).slice(0, 3);
      const opts = shuffle([w, ...others]);
      const p = UI.panel(`<div class="win kj"><div class="w-title">🎯 Latihan kosakata · ${i + 1}/${qs.length}</div>
        <div class="kj-vq">${toJp ? `<b>${esc(w[3])}</b><small>Pilih kata Jepangnya</small>` : `<b class="jp">${esc(w[0])}</b><span class="jp">${esc(w[1])}</span>`}</div>
        <div class="ws-opts">${opts.map((o, j) => `<button class="ws-o" data-i="${j}" type="button">${toJp ? `<span class="jp">${esc(o[0])}</span><small class="kj-ro">${esc(o[1])}</small>` : esc(o[3])}</button>`).join('')}</div>
        <p class="kj-msg small"></p><button class="btn block ghost" data-a="close" type="button">Berhenti</button></div>`, 'scroll');
      if (!toJp) Sound.speak(w[1].replace(/〜/g, ''));
      const r = await UI.wait(d => {
        p.querySelectorAll('.ws-o').forEach(b => b.onclick = async () => {
          const good = opts[+b.dataset.i] === w;
          p.querySelectorAll('.ws-o').forEach((x, j) => { x.disabled = true; if (opts[j] === w) x.classList.add('right'); });
          if (!good) b.classList.add('wrong');
          (good ? Sound.ok : Sound.bad)();
          p.querySelector('.kj-msg').innerHTML = `${good ? '⭕' : '❌'} <b class="jp">${esc(w[0])}</b> (${esc(w[1])}, ${esc(w[2])}) = ${esc(w[3])}`;
          if (toJp) Sound.speak(w[1].replace(/〜/g, ''));
          await sleep(good ? 900 : 1700); d(good ? 1 : 0);
        });
        p.querySelector('[data-a=close]').onclick = () => d(-1);
      });
      UI.closePanel();
      if (r < 0) return;
      ok += r;
    }
    const p = UI.panel(`<div class="win kj"><div class="w-title">🎯 Hasil latihan</div><div class="kj-res"><div class="kj-rank r${rankOf(ok * 10)}">${ok}</div><div><b>${ok}/10 benar</b><br><span class="muted small">${ok >= 8 ? 'すごい！ Kosakatamu siap untuk kerja nyata.' : 'Ulangi lagi, ya. Dengarkan suaranya dan ucapkan keras-keras.'}</span></div></div><button class="btn block" data-a="close" type="button">Selesai</button></div>`, 'scroll');
    if (ok) H().addPoints(ok, 'latihan kosakata');
    await UI.wait(d => { p.querySelector('[data-a=close]').onclick = () => { Sound.blip(); UI.closePanel(); d(); }; });
  }

  /* ---------- 🎮 Latihan aksi: pilih satu aksi nyata dan mainkan langsung ---------- */
  const ACTS = {};             // aksi tambahan per bidang (diisi kerja-hari.js / kerja-aksi.js)
  const NOT_ACT = ['say', 'clock', 'quiz', 'order', 'pick'];
  const ACT_ICON = { act: '🛠', hunt: '🔎', spot: '👀', belt: '🍙', wash: '🧼', roller: '🌀', thermo: '🌡️', dial: '🎛', feed: '🥄', cash: '💴', shisa: '👉', harvest: '🍅', scale: '⚖️', sort: '📦', vital: '🩺', talk: '💬', dress: '👕', skin: '🛏', meds: '💊', crane: '🏗', harness: '🪝', yudo: '🚚', bins: '🗑', rebar: '🔩' };
  function actsFor(job) {
    const seen = new Set(), out = [];
    const add = st => { if (!st || NOT_ACT.includes(st.t) || !TASKS[st.t]) return; const key = st.t + '|' + (st.title || st.q || ''); if (seen.has(key)) return; seen.add(key); out.push(st); };
    (ACTS[job.id] || []).forEach(add);
    (DAYS[job.id] || []).forEach(d => (d.tasks || []).forEach(x => add(typeof x === 'string' ? null : x)));
    job.steps.forEach((st, i) => add(st.at || ROOMS[job.id].at[i] ? { ...st, at: st.at || ROOMS[job.id].at[i] } : st));
    return out;
  }
  const actName = st => st.title || ({ wash: 'Cuci tangan', roller: 'Rol perekat', belt: 'Lini produksi', thermo: 'Ukur suhu', dial: 'Atur suhu', feed: 'Suapi makan', cash: 'Kasir', shisa: 'Tunjuk & seru', vital: 'Tanda vital', meds: 'Bagikan obat', dress: 'Ganti baju', skin: 'Ubah posisi tidur', crane: 'Aba-aba crane', harness: 'Harness 2 kait', yudo: 'Pandu truk', rebar: 'Ikat besi' }[st.t] || st.t);
  async function practice(job) {
    for (;;) {
      const list = actsFor(job);
      const p = UI.panel(`<div class="win kj">
        <div class="w-title">🎮 ${job.icon} Latihan aksi · ${esc(job.name)}</div>
        <p class="small muted">${list.length} aksi kerja nyata. Pilih satu untuk dimainkan langsung, tanpa menjalani satu hari penuh.</p>
        <div class="kj-acts">${list.map((st, i) => `<button class="kj-actb" type="button" data-i="${i}"><b>${ACT_ICON[st.t] || '🛠'}</b><span>${esc(actName(st))}</span></button>`).join('')}</div>
        <button class="btn block ghost" data-a="close" type="button">Kembali</button></div>`, 'scroll');
      const i = await UI.wait(done => {
        p.querySelectorAll('[data-i]').forEach(b => b.onclick = () => { Sound.blip(); done(+b.dataset.i); });
        p.querySelector('[data-a=close]').onclick = () => { Sound.blip(); done(-1); };
      });
      UI.closePanel();
      if (i < 0) return;
      const st = list[i], R = ROOMS[job.id], home = Object.keys(R.st)[0];
      await run(job, { practice: true, steps: [
        { t: 'clock', time: '10:00', title: `🎮 ${actName(st)}`, at: st.at || home, cast: st.cast || (R.cast && R.cast[0]) || [] },
        st,
        { t: 'clock', time: '10:30', title: 'Selesai', at: st.at || home, end: '10:30' },
      ] });
    }
  }

  async function open() {
    for (;;) {
      const R = rec();
      const p = UI.panel(`<div class="win kj">
        <div class="w-title">💼 しごと たいけん · Simulasi Kerja</div>
        <p class="small muted">Jalani <b>karier 15 hari</b> di tempat kerja Jepang: cerita, rekan kerja, kejadian, slip gaji, sampai kelulusan. Tempat kerjanya juga ada di <b>しごとまち</b> (naik kereta dari stasiun).</p>
        <div class="kj-jobs">${JOBS.map(j => { const d = careerDay(j.id), has = DAYS[j.id]; return `<div class="kj-job">
          <div class="kj-ic">${j.icon}</div>
          <div class="kj-jt"><b>${esc(j.name)}</b> <span class="jp muted small">${esc(j.k)}</span><br><small>${esc(j.desc)}</small>
            ${has ? `<div class="kj-prog"><i style="width:${Math.min(15, d - 1) / 15 * 100}%"></i></div><small class="kj-best">${d > 15 ? '🎓 Lulus 15 hari' : `📅 Hari ${d}/15 · ${esc(DAYS[j.id][d - 1].title)}`}${R[j.id] && R[j.id].best ? ` · terbaik <b class="r${R[j.id].best}">${R[j.id].best}</b>` : ''}</small>` : ''}</div>
          <div class="kj-jb">${has ? `<button class="btn small" data-day="${j.id}" type="button">${d > 15 ? '📅 Pilih hari' : `▶ Hari ${d}`}</button>` : ''}<button class="btn ghost small" data-act="${j.id}" type="button">🎮 Aksi</button><button class="btn ghost small" data-go="${j.id}" type="button">🔁 Latihan</button><button class="btn ghost small" data-info="${j.id}" type="button">ℹ Info</button><button class="btn ghost small" data-kotoba="${j.id}" type="button">📚 Kata</button>${has && d <= 15 ? `<button class="btn ghost small" data-list="${j.id}" type="button">📅 Pilih hari</button>` : ''}</div>
        </div>`; }).join('')}</div>
        <button class="btn block ghost" data-a="close" type="button">Tutup</button></div>`, 'scroll');
      const a = await UI.wait(done => {
        p.querySelectorAll('[data-day]').forEach(b => b.onclick = () => { Sound.blip(); done({ day: b.dataset.day }); });
        p.querySelectorAll('[data-list]').forEach(b => b.onclick = () => { Sound.blip(); done({ list: b.dataset.list }); });
        p.querySelectorAll('[data-go]').forEach(b => b.onclick = () => { Sound.blip(); done({ go: b.dataset.go }); });
        p.querySelectorAll('[data-act]').forEach(b => b.onclick = () => { Sound.blip(); done({ act: b.dataset.act }); });
        p.querySelectorAll('[data-info]').forEach(b => b.onclick = () => { Sound.blip(); done({ info: b.dataset.info }); });
        p.querySelectorAll('[data-kotoba]').forEach(b => b.onclick = () => { Sound.blip(); done({ kotoba: b.dataset.kotoba }); });
        p.querySelector('[data-a=close]').onclick = () => { Sound.blip(); done(null); };
      });
      UI.closePanel();
      if (!a) return;
      if (a.kotoba) { await kotoba(BY[a.kotoba]); continue; }
      if (a.info) { if (await info(BY[a.info])) await run(BY[a.info]); continue; }
      if (a.go) { await run(BY[a.go]); continue; }
      if (a.act) { await practice(BY[a.act]); continue; }
      const id = a.day || a.list, job = BY[id];
      let n = careerDay(id);
      if (a.list || n > 15) { n = await dayList(job); if (!n) continue; }
      await runDay(job, n);
    }
  }

  /* =========================================================
     KAWASAN KERJA しごとまち (peta kota, naik kereta)
     ========================================================= */
  MAPS.shigoto = {
    name: 'Kawasan Kerja (しごとまち)', outdoor: true,
    rows: [
      'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
      'T............................T',
      'T............................T',
      'T............................T',
      'T............................T',
      'T============================T',
      'T============================T',
      'T..f.......=...........f.....T',
      'T..........=..........b.....fT',
      'T..........=.................T',
      'T..........=.................T',
      'T..........=.V...............T',
      'T..........=.................T',
      'T============================T',
      'T============================T',
      'T....f....L.........f....L...T',
      'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
    ],
    buildings: [
      { type: 'station', x: 2, y: 1, w: 6, h: 4, doors: [[5, 4]] },
      { type: 'kojo', x: 10, y: 1, w: 6, h: 4, doors: [[13, 4]] },
      { type: 'kaigo', x: 18, y: 1, w: 6, h: 4, doors: [[21, 4]] },
      { type: 'bokujo', x: 25, y: 1, w: 4, h: 4, doors: [[26, 4]] },
      { type: 'genba', x: 3, y: 9, w: 6, h: 4, doors: [[6, 12]] },
      { type: 'izakaya', x: 15, y: 9, w: 5, h: 4, doors: [[17, 12]] },
      { type: 'nojo', x: 21, y: 9, w: 6, h: 4, doors: [[23, 12]] },
    ],
    signs: [
      { x: 9, y: 7, text: 'しごとまち', note: 'Kawasan kerja' },
      { x: 16, y: 4, text: 'こうじょう', note: 'Pabrik makanan (bento & onigiri)' },
      { x: 24, y: 4, text: 'かいご', note: 'Panti wreda (perawatan lansia)' },
      { x: 2, y: 12, text: 'けんせつ', note: 'Proyek konstruksi (genba)' },
      { x: 20, y: 12, text: 'いざかや', note: 'Restoran izakaya' },
      { x: 27, y: 12, text: 'のうじょう', note: 'Pertanian: rumah kaca tomat & stroberi' },
    ],
    warps: [{ x: 5, y: 4, to: 'eki', tx: 7, ty: 3, dir: 'down' }],
    closedDoors: [
      { x: 13, y: 4, kind: 'scene', id: 'kerja_food' },
      { x: 21, y: 4, kind: 'scene', id: 'kerja_kaigo' },
      { x: 26, y: 4, kind: 'scene', id: 'kerja_chikusan' },
      { x: 6, y: 12, kind: 'scene', id: 'kerja_genba' },
      { x: 17, y: 12, kind: 'scene', id: 'kerja_gaishoku' },
      { x: 23, y: 12, kind: 'scene', id: 'kerja_nogyo' },
    ],
    spots: { arrive: [5, 5], rina: [12, 8] },
  };
  Object.assign(Maps.SHOPS, {
    kojo:    { wall: '#e9eef2', awning: '#4f7fb0', sign: 'こうじょう', door: '#3a4f86', board: '#fbf7ef', ink: '#3a4f86' },
    kaigo:   { wall: '#fbeef2', awning: '#d77a9a', sign: 'かいご ホーム', door: '#6a4228' },
    genba:   { wall: '#efe2b0', awning: '#f6c90e', sign: 'けんせつ', door: '#3a3f55', board: '#2a1f2d', ink: '#f6c90e' },
    izakaya: { wall: '#e9dcc4', awning: '#b0363f', sign: 'いざかや', door: '#6a4228', board: '#2a1f2d', ink: '#fbf7ef' },
    nojo:    { wall: '#eef5e4', awning: '#5a9a3a', sign: 'のうじょう', door: '#6a4228', board: '#fbf7ef', ink: '#3f6b28' },
    bokujo:  { wall: '#f4ecdc', awning: '#8a5a36', sign: 'ぼくじょう', door: '#5a3a22', board: '#fbf7ef', ink: '#5a3a22' },
  });

  // Masuk bangunan kerja: atasan menyambut di pintu
  const GREET = {
    food: { jp: 'こうじょう へ ようこそ！きょう は いっしょ に はたらこう。', ro: 'koujou e youkoso! kyou wa issho ni hatarakou.', id: 'Selamat datang di pabrik! Hari ini kita bekerja bersama.' },
    kaigo: { jp: 'かいご ホーム へ ようこそ。りようしゃ さん が まって います よ。', ro: 'kaigo hoomu e youkoso. riyousha-san ga matte imasu yo.', id: 'Selamat datang di panti wreda. Para penghuni sudah menunggu.' },
    genba: { jp: 'ごあんぜん に！ヘルメット は ある か？', ro: 'go-anzen ni! herumetto wa aru ka?', id: 'Semoga selamat! Sudah bawa helm?' },
    gaishoku: { jp: 'いらっしゃい…あ、きょう から の アルバイト だね！', ro: 'irasshai… a, kyou kara no arubaito da ne!', id: 'Selamat datang… oh, kamu pekerja paruh waktu yang mulai hari ini, ya!' },
  };
  async function enter(id) {
    const job = BY[id]; if (!job) return;
    await say({ w: BOSS[id], e: 'happy', ...GREET[id] });
    const d = careerDay(id), has = DAYS[id];
    const opts = [has ? (d > 15 ? '📅 Ulangi salah satu hari (sudah lulus 🎓)' : `▶ Karier: Hari ${d}/15 · ${DAYS[id][d - 1].title}`) : null, has && d <= 15 ? '📅 Pilih hari lain (lewati yang sudah bisa)' : null, '🔁 Latihan shift bebas', '📚 Kosakata kerja', 'ℹ Info kerja (gambaran nyata)', 'Tidak jadi'].filter(Boolean);
    const a = await H().menuChoice(`${job.icon} ${job.name}`, opts);
    UI.hideDialog();
    const pick = opts[a];
    if (pick === 'Tidak jadi') return;
    if (pick.startsWith('ℹ')) { if (await info(job)) await run(job); return; }
    if (pick.startsWith('🔁')) return run(job);
    if (pick.startsWith('📚')) return kotoba(job);
    let n = d; if (n > 15 || pick.startsWith('📅 Pilih')) { n = await dayList(job); if (!n) return; }
    await runDay(job, n);
  }

  // Bu Rina: pembimbing kerja di depan stasiun
  async function rina() {
    await say({ w: 'rina', e: 'happy', jp: 'しごとまち へ ようこそ！', ro: 'shigotomachi e youkoso!', id: 'Selamat datang di kawasan kerja!' });
    await say({ w: 'rina', t: 'Di sini ada 6 tempat kerja: 🍙 pabrik makanan, 🧓 panti wreda (kaigo), 🐄 peternakan, 🏗 proyek konstruksi, 🍶 izakaya, dan 🌱 pertanian. Masuk lewat pintunya. Di tiap tempat kamu bisa menjalani karier 15 hari: ceritanya berlanjut setiap hari, sampai kelulusan.' });
    const R = rec(), done = JOBS.filter(j => R[j.id]).length;
    await say({ w: 'rina', t: done ? `Kamu sudah mencoba ${done} dari ${JOBS.length} tempat kerja. がんばって！` : 'Belum pernah mencoba? Mulai dari pabrik (こうじょう) di sebelah kanan stasiun!' });
  }

  /* ---------- sambungkan ke Places ---------- */
  const P0 = Object.assign({}, Places);
  Places.npcs = (m, c) => [...P0.npcs(m, c), ...(m === 'shigoto' ? [{ id: 'rina', x: 12, y: 8, dir: 'down', idle: true }] : [])];
  Places.talks = npc => (World.map === 'shigoto' && npc.id === 'rina') || P0.talks(npc);
  Places.talk = npc => (World.map === 'shigoto' && npc.id === 'rina' ? rina() : P0.talk(npc));
  Places.song = m => (m === 'shigoto' ? 'school' : P0.song(m));
  Places.interact = t => (t.type === 'door' && /^kerja_/.test(t.door.id) ? enter(t.door.id.slice(6)) : P0.interact(t));

  // Menambah bidang kerja baru (kerja-tani.js)
  function register(job, room, o) {
    if (!BY[job.id]) JOBS.push(job);
    ROOMS[job.id] = room; BOSS[job.id] = o.boss; UNIFORM[job.id] = o.uniform; GREET[job.id] = o.greet;
  }
  return {
    open, enter, register, runDay, kotoba, practice, JOBS, ROOMS, BOSS, DAYS, TASKS, TASK_START, TASK_CAT, GLOSS, HEAVY, ACTS,
    run: (id, o) => run(BY[id], o), day: (id, n) => runDay(BY[id], n),
    setDayBuilder: f => { dayBuilder = f; },
    kit: { pad, sleep, speak, esc, shuffle, ro, taskQuiz, done1 },
    _keys: null, _release: null,
  };
})();
