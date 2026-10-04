/* =========================================================
   KARIER 15 HARI (simulasi kerja nyata dengan cerita panjang)
   Setiap bidang kerja punya 15 hari berurutan dengan busur cerita
   yang sama: orientasi → rutinitas → kesalahan pertama → slip gaji →
   tugas baru → cuaca → hari sibuk → ヒヤリハット → hari libur di asrama
   → inspeksi → masalah besar → mengajari Nguyen-san → ujian →
   evaluasi akhir & kelulusan. Rancangan: design/16-KARIER-15-HARI.md
   Format hari:
     { title, time, end, at, story:[langkah], tasks:[kunci LIB | langkah],
       outro:[langkah], learn, vocab:[[kanji, kana, romaji, arti]], next }
   ========================================================= */
(() => {
  /* ---------- tokoh tetap ---------- */
  Object.assign(CHARACTERS, {
    siti:   { name: 'Bu Siti (senpai)',  color: '#3b8a78' },
    nguyen: { name: 'Nguyen-san (baru)', color: '#c98a1e' },
  });
  Object.assign(Pix.PAL, {
    siti:   { h: '#5a8fb0', H: '#3a6a8a', e: '#2a2238', E: '#3a2a2a', I: '#7a6050', o: '#f2a7bf', O: '#d77a9a', a: '#f6d44a', A: '#c9a526', p: '#3a3f55', b: '#2a2a2a', c: '#f7f3ea' },
    nguyen: { h: '#1f1a26', H: '#0f0d14', e: '#2a2238', E: '#3a2a2a', I: '#7a6050', o: '#f29b38', O: '#c97a1e', a: '#f7f3ea', A: '#d3c7b3', p: '#3a3f55', b: '#2a2a2a', c: '#f7f3ea' },
  });
  Object.assign(Pix.STYLE, { siti: { hair: 'long', uniform: 'tee' }, nguyen: { hair: 'short', uniform: 'tee' } });

  /* ---------- pembantu penulisan ---------- */
  const L = (w, jp, ro, id, e) => ({ t: 'say', w, jp, ro, id, e });          // kalimat Jepang
  const T = (w, n, e) => ({ t: 'say', w, n, e });                              // penjelasan (Indonesia)
  const N = n => ({ t: 'say', n });                                            // narasi
  const C = (time, title, at) => ({ t: 'clock', time, title, at });           // jam & pindah pos
  const opt = o => (Array.isArray(o) ? { jp: o[0], ro: o[1] || '' } : { label: o });
  const Q = (w, q, opts, why, x = {}) => ({ t: 'quiz', w, q, opts: opts.map(opt), why, ...x });
  const O = (title, items, x = {}) => ({ t: 'order', title, items: items.map(([jp, id]) => ({ jp, id })), ...x });
  const P = (title, items, x = {}) => ({ t: 'pick', title, items: items.map(([jp, ro, id, ok, why]) => ({ jp, ro, id, ok, why })), ...x });
  const SP = (title, okLabel, ngLabel, items, x = {}) => ({ t: 'spot', title, okLabel, ngLabel, count: x.count || items.length, limit: x.limit || 9000, items: items.map(([e, d, ok, why, b]) => ({ e, d, ok, why, b })), ...x });
  const V = (...rows) => rows;

  /* ---------- tugas dari shift bebas yang dipakai ulang: [indeks langkah, pos, pemeran] ---------- */
  const W1 = [{ k: 'w1', id: 'tenin', x: 4, y: 3, dir: 'down' }, { k: 'w2', id: 'emma', x: 8, y: 3, dir: 'down' }];
  const RES = (x, y, dir = 'left') => [{ k: 'r', id: 'riyosha', x, y, dir }];
  const GUEST_IN = [{ k: 'c1', id: 'emma', x: 1, y: 6, dir: 'right' }, { k: 'c2', id: 'ryo', x: 2, y: 6, dir: 'right' }, { k: 'c3', id: 'ojii', x: 0, y: 6, dir: 'right' }];
  const GUEST_SEAT = [{ k: 'c1', x: 3, y: 3, dir: 'up' }, { k: 'c2', x: 5, y: 3, dir: 'up' }, { k: 'c3', x: 4, y: 3, dir: 'up' }];
  const GUEST_REG = [{ k: 'c1', x: 3, y: 6, dir: 'right' }, { k: 'c2', x: 2, y: 6, dir: 'right' }, { k: 'c3', x: 5, y: 6, dir: 'left' }];
  const GUEST_GONE = [{ k: 'c1', gone: true }, { k: 'c2', gone: true }, { k: 'c3', gone: true }];
  const LIB = {
    food: { mida: [3, 'locker'], wash: [5, 'sink'], roller: [6, 'air'], health: [9, 'board'], belt: [12, 'line', W1], metal: [13, 'line'], thermo: [15, 'fryer'], s5: [17, 'clean'], osaki: [19, 'exit'] },
    kaigo: { curtain: [3, 'room', RES(5, 2)], temp: [4, 'room'], feedpick: [6, 'dining', RES(9, 3)], feed: [7, 'dining', RES(9, 3)], ippai: [8, 'dining'], transfer: [10, 'wheel', RES(6, 4)], bath: [12, 'bath', RES(11, 2)], fall: [13, 'hall', RES(10, 6)], report: [15, 'record'], bye: [17, 'room', RES(5, 2)] },
    genba: { goanzen: [2, 'plaza'], ppe: [3, 'ppe'], chin: [4, 'ppe'], ky: [7, 'ky'], kyq: [8, 'ky'], patrol: [10, 'scaffold'], shisa: [11, 'ladder'], neko: [13, 'material'], unclear: [14, 'material'], heat: [16, 'tent'], otsukare: [18, 'gate'] },
    gaishoku: { flow: [2, 'back'], irasshai: [4, 'door', GUEST_IN], nanmei: [5, 'door'], nama: [6, 't1', GUEST_SEAT], allergy: [7, 't1'], dishes: [9, 'kitchen'], spill: [10, 't2'], cash: [11, 'reg', GUEST_REG], thanks: [12, 'door', GUEST_GONE] },
    nogyo: { gear: [2, 'naya'], harvest: [4, 'tomato'], fallen: [5, 'tomato'], sort: [7, 'senka'], vent: [9, 'vent'], pesticide: [11, 'field'], cases: [13, 'truck'] },
    chikusan: { shodoku: [2, 'gate'], milking: [4, 'parlor'], clots: [5, 'parlor'], scale: [7, 'feed'], approach: [8, 'barn'], eggs: [10, 'coop'], eggsort: [11, 'coop'], health: [13, 'barn'], exitdis: [15, 'gate'] },
  };
  const HOME = { food: 'locker', kaigo: 'staff', genba: 'plaza', gaishoku: 'back', nogyo: 'naya', chikusan: 'office' };
  const EXIT = { food: 'exit', kaigo: 'staff', genba: 'gate', gaishoku: 'back', nogyo: 'naya', chikusan: 'gate' };
  const START = { food: '07:50', kaigo: '08:30', genba: '07:45', gaishoku: '16:30', nogyo: '07:00', chikusan: '05:30' };
  const END = { food: '17:00', kaigo: '17:30', genba: '17:00', gaishoku: '23:00', nogyo: '17:00', chikusan: '18:00' };
  const CAST0 = { kaigo: RES(5, 2) };

  /* ---------- asrama (hari 10, hari libur) ---------- */
  const DORM = {
    name: 'Asrama (りょう)', boss: 'siti', floor: ['#d9c99a', '#cfbe8c'], wall: '#efe2c8', wallTop: '#8a6a4a',
    st: {
      genkan:  { x: 1, y: 5, e: '🚪', jp: 'げんかん', id: 'pintu masuk asrama' },
      gomi:    { x: 3, y: 1, e: '🗑️', jp: 'ごみおきば', id: 'tempat sampah' },
      kitchen: { x: 6, y: 1, e: '🍳', jp: 'だいどころ', id: 'dapur bersama' },
      ima:     { x: 9, y: 2, e: '🍵', jp: 'いま', id: 'ruang santai' },
      phone:   { x: 11, y: 5, e: '📱', jp: 'でんわ', id: 'telepon keluarga' },
    },
    at: {}, cast: {}, block: [[8, 2, 10, 2]],
    start: { player: [2, 4], boss: [3, 4] },
    draw(c, t, { TS, yy }) {
      c.fillStyle = '#b08a5a'; c.fillRect(8 * TS, yy(2) + 10, TS * 3, TS - 12);
      c.strokeStyle = 'rgba(90,70,40,.25)'; for (let x = 0; x < 12; x++) { c.beginPath(); c.moveTo(x * TS, yy(1)); c.lineTo(x * TS, yy(7)); c.stroke(); }
    },
  };
  const NEXT10 = { food: 'Audit HACCP dari pelanggan: jawab auditor dengan sopan & jujur.', kaigo: 'Keluarga Nenek Kimura datang berkunjung.', genba: 'Patroli keselamatan dari kantor pusat.', gaishoku: 'Inspeksi dari dinas kesehatan (保健所).', nogyo: 'Pembeli dari supermarket berkunjung ke ladang.', chikusan: 'Dokter hewan datang memeriksa sapi.' };
  const JOBWORD = { food: 'pabrik', kaigo: 'panti', genba: 'genba', gaishoku: 'izakaya', nogyo: 'ladang', chikusan: 'peternakan' };
  const offDay = (id, extra) => ({
    title: 'Hari libur & hidup di Jepang', room: DORM, off: true,
    story: [
      L('siti', 'おはよう！きょう は やすみ だ ね。', 'ohayou! kyou wa yasumi da ne.', 'Pagi! Hari ini libur, ya.', 'happy'),
      T('siti', `Aku Siti, sudah 3 tahun kerja di Jepang. Hari libur juga penting: belajar buang sampah, belanja, dan istirahat. Minggu depan ${JOBWORD[id]} pasti sibuk lagi!`),
    ],
    tasks: [
      { ...Q('siti', 'Kotak susu kertas yang sudah dibilas, dibuang ke…', [['しげん ごみ (りサイクル)', 'shigen gomi'], ['もえる ごみ', 'moeru gomi'], ['そだい ごみ', 'sodai gomi']], 'Di Jepang sampah dipilah: もえる (bisa dibakar), もえない (tidak bisa dibakar), しげん (daur ulang: botol PET, kaleng, kertas), そだい (besar). Hari buangnya berbeda tiap daerah, cek kalender sampah asrama!'), at: 'gomi' },
      { ...Q('siti', 'Kamu ingin menelepon keluarga malam ini, tapi teman sekamar sudah tidur. Kamu…', ['Telepon di luar kamar / ruang santai dengan suara pelan', 'Telepon di kamar dengan speaker keras', 'Tidak usah telepon selamanya'], 'Asrama dipakai bersama. Jaga suara setelah jam 22:00 (しずか に). Rindu rumah itu wajar, cari waktu & tempat yang pas.'), at: 'phone' },
      { ...Q('siti', 'Di dapur bersama, setelah memasak kamu…', [['つかった もの を あらって、もと の ばしょ に もどします。', 'tsukatta mono wo aratte, moto no basho ni modoshimasu.'], ['あした あらいます。', 'ashita araimasu.'], ['だれか が あらう でしょう。', 'dareka ga arau deshou.']], 'Bersihkan dan kembalikan ke tempatnya. Masalah kebersihan di asrama adalah sumber konflik yang paling sering.'), at: 'kitchen' },
      ...(extra || []),
      { ...Q('siti', 'Gajimu masuk ke rekening. Yang paling aman untuk kirim uang ke keluarga di Indonesia…', ['Lewat bank / layanan transfer resmi berizin', 'Titip ke orang yang baru dikenal di media sosial', 'Simpan semua uang tunai di kamar'], 'Pakai layanan resmi (bank, layanan remitansi berizin). Hati-hati penipuan & pinjaman ilegal. Simpan slip gaji dan bukti transfer.'), at: 'ima' },
    ],
    outro: [L('siti', 'あした から また がんばろう ね！', 'ashita kara mata ganbarou ne!', 'Besok semangat lagi, ya!', 'happy')],
    learn: 'Hidup di Jepang: pilah sampah (もえる・もえない・しげん・そだい), jaga suara di asrama, bersihkan dapur bersama, kirim uang lewat layanan resmi.',
    vocab: V(['燃えるごみ', 'もえるごみ', 'moeru gomi', 'sampah bisa dibakar'], ['資源ごみ', 'しげんごみ', 'shigen gomi', 'sampah daur ulang'], ['寮', 'りょう', 'ryou', 'asrama'], ['休み', 'やすみ', 'yasumi', 'libur'], ['送金', 'そうきん', 'soukin', 'kirim uang']),
    next: NEXT10[id],
  });

  /* ---------- penyusun langkah harian ---------- */
  function build(job, d, n) {
    const id = job.id, lib = LIB[id], steps = [];
    const usesSiti = JSON.stringify(d).includes('"siti"'), usesNguyen = JSON.stringify(d).includes('"nguyen"');
    if (d.off) {
      steps.push({ t: 'say', n: `📅 Hari ${n} · ${d.title}`, at: 'ima' });
    } else {
      const sp = Kerja.ROOMS[id].start.player, cast = [...(d.cast || CAST0[id] || [])];
      if (usesSiti) cast.push({ k: 'siti', id: 'siti', x: sp[0] + 1, y: sp[1], dir: 'left' });
      if (usesNguyen) cast.push({ k: 'nguyen', id: 'nguyen', x: sp[0] + 2, y: sp[1], dir: 'left' });
      steps.push({ t: 'clock', time: d.time || START[id], title: `Hari ${n} · ${d.title}`, at: d.at || HOME[id], cast });
    }
    (d.story || []).forEach(l => steps.push(l));
    (d.tasks || []).forEach(x => {
      if (typeof x !== 'string') return steps.push(x);
      const e = lib[x]; if (!e) throw new Error(`Tugas ${x} tidak ada di ${id}`);
      const s = { ...job.steps[e[0]], at: e[1] }; if (e[2]) s.cast = e[2];
      steps.push(s);
    });
    (d.outro || []).forEach(l => steps.push(l));
    if (!d.off) steps.push({ t: 'clock', time: d.end || END[id], title: 'たいきん · Pulang', at: EXIT[id], end: d.end || END[id] });
    return steps;
  }

  const DAYS = {};

  /* =========================================================
     🍙 PABRIK MAKANAN · 15 hari
     ========================================================= */
  DAYS.food = [
    { title: 'Orientasi pabrik', story: [
        L('hancho', 'はじめまして。はんちょう の やまだ です。', 'hajimemashite. hanchou no yamada desu.', 'Senang bertemu. Saya Yamada, kepala regu (班長).', 'happy'),
        Q('hancho', 'Perkenalkan dirimu dengan sopan.', [['はじめまして。インドネシア から きました。よろしく おねがいします。', 'hajimemashite. indoneshia kara kimashita. yoroshiku onegaishimasu.'], ['おっす！よろしく！', 'ossu! yoroshiku!'], ['こんばんは。', 'konbanwa.']], 'Perkenalan standar di tempat kerja: はじめまして → asal → よろしく おねがいします, sambil membungkuk.'),
        L('siti', 'わたし は シティ です。こまったら きいて ね。', 'watashi wa shiti desu. komattara kiite ne.', 'Aku Siti. Kalau bingung, tanya aku ya.', 'happy'),
      ], tasks: ['mida', 'wash', 'roller'],
      learn: 'Hari pertama: perkenalan diri, aturan みだしなみ (tanpa aksesori), cuci tangan 30 detik, rol perekat sebelum masuk area produksi.',
      vocab: V(['班長', 'はんちょう', 'hanchou', 'kepala regu'], ['自己紹介', 'じこしょうかい', 'jikoshoukai', 'perkenalan diri'], ['身だしなみ', 'みだしなみ', 'midashinami', 'penampilan kerja']),
      next: 'Kamu akan berdiri di lini conveyor untuk pertama kalinya.' },
    { title: 'Lini onigiri pertama', story: [
        L('hancho', 'きょう から ライン に はいって もらいます。', 'kyou kara rain ni haitte moraimasu.', 'Mulai hari ini kamu masuk ke lini produksi.'),
        T('siti', 'Tips dariku: lihat produknya, bukan tanganmu. Kalau ragu NG atau bukan, lebih baik singkirkan lalu tanya.'),
      ], tasks: ['wash', 'health', 'belt', 'metal'],
      learn: 'Di lini: produk cacat = NG, produk bagus = ヨシ. Benda asing (rambut, plastik, logam) wajib dilaporkan segera.',
      vocab: V(['不良品', 'ふりょうひん', 'furyouhin', 'barang cacat'], ['異物', 'いぶつ', 'ibutsu', 'benda asing'], ['報告', 'ほうこく', 'houkoku', 'laporan']),
      next: 'Kamu belajar nama alat & menempel label tanggal.' },
    { title: 'Nama alat & label', story: [
        L('hancho', 'これ は はかり。あれ は ばんじゅう。おぼえて ね。', 'kore wa hakari. are wa banjuu. oboete ne.', 'Ini timbangan. Itu nampan wadah (ばんじゅう). Hafalkan, ya.'),
      ], tasks: ['wash',
        { ...Q('hancho', 'Pak Yamada bilang 「はかり を もって きて」. Yang kamu bawa…', ['⚖️ Timbangan', '🗑️ Tempat sampah', '🧤 Sarung tangan'], 'はかり = timbangan. Alat lain: ばんじゅう (nampan), ラベラー (alat label), しゃもじ (centong nasi).'), at: 'line' },
        { t: 'act', title: 'ラベル · Tempel label tanggal di kotak bento', at: 'line', target: '🍱', targetLabel: 'kotak bento', steps: [
          { tool: ['⚖️', 'はかり'], jp: 'おもさ を はかって。', id: 'timbang beratnya', how: 'tap', after: '⚖️ 350g' },
          { tool: ['🏷️', 'ラベル'], jp: 'ラベル を はって。', id: 'tempel label', how: 'swipe', after: '🏷️ ✓' },
          { tool: ['🔍', 'めで かくにん'], jp: 'きげん を かくにん して。', id: 'cek tanggal kedaluwarsa', how: 'hold', after: '📅 OK' },
          { tool: ['📦', 'ばんじゅう'], jp: 'ばんじゅう に いれて。', id: 'masukkan ke nampan', how: 'tap', after: '📦 ✓' },
        ], extras: [['🧹', 'ほうき'], ['📱', 'スマホ']], why: 'Label memuat tanggal kedaluwarsa (消費期限) & alergen. Label yang salah membuat produk harus ditarik (回収).' },
        'belt'],
      learn: 'これ・それ・あれ untuk menunjuk benda. Label tanggal & alergen wajib benar sebelum dikirim.',
      vocab: V(['秤', 'はかり', 'hakari', 'timbangan'], ['消費期限', 'しょうひきげん', 'shouhi kigen', 'batas aman konsumsi'], ['回収', 'かいしゅう', 'kaishuu', 'penarikan produk']),
      next: 'Hari yang menegangkan: ada kesalahan di lini.' },
    { title: 'Kesalahan pertama', story: [
        N('Saat bekerja, sarung tanganmu sobek dan potongan kecilnya hilang di lini…'),
      ], tasks: ['wash',
        { ...Q('hancho', 'Potongan sarung tangan biru hilang di lini. Apa yang kamu lakukan?', [['すみません！てぶくろ が やぶれて、かけら が ありません！', 'sumimasen! tebukuro ga yaburete, kakera ga arimasen!'], 'Diam saja, mungkin tidak masuk ke makanan', 'Ganti sarung tangan diam-diam'], 'Inilah alasan sarung tangan pabrik berwarna biru: supaya mudah terlihat. Lapor segera → lini dihentikan → produk dicek. Atasan jauh lebih menghargai kejujuran daripada kesempurnaan.'), at: 'line' },
        { ...SP('Cek ulang batch: cari potongan sarung tangan biru', 'ヨシ！', 'NG', [['🍙', 'Onigiri normal', true], ['🍙', 'Onigiri normal, label ada', true], ['🍙', 'Ada potongan biru kecil', false, 'Potongan sarung tangan ditemukan!', '🟦'], ['🍙', 'Bentuk rapi', true], ['🍙', 'Bentuk rapi, nori lengkap', true]], { count: 8, limit: 7000 }), at: 'line' },
        'metal'],
      outro: [L('hancho', 'ほうこく、ありがとう。たすかった よ。', 'houkoku, arigatou. tasukatta yo.', 'Terima kasih sudah lapor. Sangat membantu.', 'happy')],
      learn: 'ほうれんそう: kesalahan dilaporkan segera dan jujur. Sarung tangan & alat pabrik berwarna mencolok supaya mudah ditemukan.',
      vocab: V(['破れる', 'やぶれる', 'yabureru', 'sobek'], ['欠片', 'かけら', 'kakera', 'potongan kecil'], ['助かる', 'たすかる', 'tasukaru', 'terbantu']),
      next: 'Target produksi naik, dan kamu menerima slip gaji pertama.' },
    { title: 'Target naik & slip gaji', story: [
        L('hancho', 'きょう の もくひょう は 3500こ。がんばろう！', 'kyou no mokuhyou wa sanzen-gohyaku-ko. ganbarou!', 'Target hari ini 3.500 buah. Semangat!'),
      ], tasks: ['wash', 'roller', 'belt',
        { ...Q('hancho', 'Lini terlalu cepat, kamu tidak sempat memeriksa semua produk. Kamu…', [['すみません、すこし おそく して ください。', 'sumimasen, sukoshi osoku shite kudasai.'], 'Biarkan saja lewat tanpa dicek', 'Berhenti bekerja tanpa bilang'], 'Minta kecepatan diturunkan atau minta bantuan (そうだん). Produk yang tidak dicek lebih berbahaya daripada lini yang sedikit lambat.'), at: 'line' }],
      learn: 'Angka besar: せん (1.000), ごひゃく (500). Kalau tidak sanggup, そうだん (konsultasi), jangan dipaksakan.',
      vocab: V(['目標', 'もくひょう', 'mokuhyou', 'target'], ['給与明細', 'きゅうよめいさい', 'kyuuyo meisai', 'slip gaji'], ['相談', 'そうだん', 'soudan', 'konsultasi']),
      next: 'Kamu pindah ke pos penggorengan: suhu & catatan.' },
    { title: 'Pos penggorengan', story: [
        L('hancho', 'きょう は フライヤー を おしえる。あつい から ちゅうい！', 'kyou wa furaiyaa wo oshieru. atsui kara chuui!', 'Hari ini aku ajari penggorengan. Panas, hati-hati!'),
      ], tasks: ['wash',
        { t: 'act', title: 'フライヤー · Menggoreng karaage dengan aman', at: 'fryer', target: '🍗', targetLabel: 'karaage', steps: [
          { tool: ['🧤', 'たいねつ てぶくろ'], jp: 'たいねつ てぶくろ を して。', id: 'pakai sarung tangan tahan panas', how: 'tap', after: '🧤 ✓' },
          { tool: ['🥄', 'あみじゃくし'], jp: 'ゆっくり いれて。はねる から ね。', id: 'masukkan pelan dengan saringan', how: 'hold', after: '🔥 じゅわー' },
          { tool: ['⏱️', 'タイマー'], jp: 'タイマー を セット して。', id: 'pasang timer', how: 'tap', after: '⏱️ 4:00' },
          { tool: ['🥄', 'あみじゃくし'], jp: 'あげて、あぶら を きって。', id: 'angkat & tiriskan', how: 'swipe', after: '🍗 ✓' },
        ], extras: [['💧', 'みず'], ['📱', 'スマホ']], why: 'Jangan pernah memasukkan air ke minyak panas. Masukkan pelan supaya minyak tidak memercik.' },
        'thermo'],
      learn: 'Suhu tengah 75℃ selama 1 menit. Ukur di bagian paling tebal dan catat di 記録表. Hati-hati minyak panas.',
      vocab: V(['揚げる', 'あげる', 'ageru', 'menggoreng'], ['耐熱', 'たいねつ', 'tainetsu', 'tahan panas'], ['記録表', 'きろくひょう', 'kirokuhyou', 'lembar catatan']),
      next: 'Musim panas tiba: ruang produksi panas sekali.' },
    { title: 'Musim panas di pabrik', story: [
        N('Pagi ini AC ruang produksi rusak. Suhu ruangan 31℃.'),
        T('siti', 'Kalau pusing atau mual, langsung bilang ya. Jangan ditahan seperti aku dulu…'),
      ], tasks: ['wash', 'belt',
        { ...Q('hancho', 'Temanmu di lini tiba-tiba pucat dan berkeringat dingin. Kamu…', [['はんちょう！すずき さん の ぐあい が わるい です！', 'hanchou! suzuki-san no guai ga warui desu!'], 'Lanjut kerja, nanti dia sembuh sendiri', 'Tertawakan dia'], 'Tanda awal ねっちゅうしょう (heat stroke). Lapor, bawa ke tempat sejuk, beri minum. Di Jepang heat stroke di tempat kerja termasuk kecelakaan kerja yang serius.'), at: 'line' },
        { ...Q('hancho', 'Di pabrik makanan, kapan boleh minum air?', ['Saat istirahat, di ruang istirahat (tidak di area produksi)', 'Kapan saja di depan conveyor', 'Tidak boleh minum seharian'], 'Minum tidak boleh di area produksi (kebersihan), tapi istirahat minum disediakan lebih sering di hari panas. Manfaatkan!'), at: 'board' }],
      learn: 'ぐあい が わるい = kondisi badan tidak enak. Laporkan tanda heat stroke. Minum hanya di ruang istirahat.',
      vocab: V(['具合', 'ぐあい', 'guai', 'kondisi badan'], ['熱中症', 'ねっちゅうしょう', 'necchuushou', 'heat stroke'], ['休憩室', 'きゅうけいしつ', 'kyuukeishitsu', 'ruang istirahat']),
      next: 'Pesanan dadakan dari supermarket: hari sibuk!' },
    { title: 'Pesanan dadakan', story: [
        L('hancho', 'スーパー から ついか ちゅうもん！500こ ふえた。', 'suupaa kara tsuika chuumon! gohyakko fueta.', 'Pesanan tambahan dari supermarket! Bertambah 500.'),
        L('hancho', 'ざんぎょう、1じかん できる？', 'zangyou, ichi-jikan dekiru?', 'Bisa lembur 1 jam?'),
        Q('hancho', 'Kamu bisa lembur. Kamu jawab…', [['はい、だいじょうぶ です。', 'hai, daijoubu desu.'], ['むり！', 'muri!'], ['……（だまる）', '(diam)']], 'Kalau bisa: はい、だいじょうぶ です. Kalau tidak bisa, tolak dengan sopan: すみません、きょう は ちょっと…. Lembur harus dibayar (残業代).'),
      ], tasks: ['belt', 'belt', 'metal'],
      learn: 'ざんぎょう (lembur) wajib dibayar sesuai aturan. Menolak dengan sopan: すみません、きょう は ちょっと….',
      vocab: V(['追加', 'ついか', 'tsuika', 'tambahan'], ['注文', 'ちゅうもん', 'chuumon', 'pesanan'], ['残業', 'ざんぎょう', 'zangyou', 'lembur']),
      next: 'Hampir terjadi kecelakaan di dekat wastafel…' },
    { title: 'ヒヤリハット', story: [
        N('Saat membawa ばんじゅう, kakimu tergelincir di lantai basah dekat wastafel. Kamu tidak jatuh, tapi hampir.'),
      ], tasks: [
        { ...Q('hancho', 'Kamu hampir jatuh tapi tidak terluka. Kamu…', [['ヒヤリハット の ほうこく を します。', 'hiyari hatto no houkoku wo shimasu.'], 'Tidak perlu lapor karena tidak terluka', 'Salahkan orang yang mengepel'], 'ヒヤリハット = kejadian "hampir celaka". Dilaporkan supaya penyebabnya diperbaiki sebelum ada yang benar-benar terluka.'), at: 'sink' },
        { t: 'act', title: 'Amankan lantai basah', at: 'sink', target: '💧', targetLabel: 'lantai basah', steps: [
          { tool: ['⚠️', 'かんばん'], jp: 'ちゅうい の かんばん を おいて。', id: 'pasang papan peringatan', how: 'tap', after: '⚠️' },
          { tool: ['🧽', 'モップ'], jp: 'モップ で ふいて。', id: 'pel sampai kering', how: 'swipe', after: '✨ kering' },
          { tool: ['📝', 'ほうこくしょ'], jp: 'ほうこくしょ に かいて。', id: 'tulis laporan', how: 'hold', after: '📝 ✓' },
        ], extras: [['🧴', 'アルコール'], ['🍙', 'おにぎり']] },
        'wash', 'belt'],
      learn: 'ヒヤリハット dilaporkan walau tidak ada yang terluka. Lantai basah: papan peringatan, keringkan, laporkan.',
      vocab: V(['滑る', 'すべる', 'suberu', 'tergelincir'], ['看板', 'かんばん', 'kanban', 'papan tanda'], ['報告書', 'ほうこくしょ', 'houkokusho', 'formulir laporan']),
      next: 'Hari libur pertamamu di asrama bersama Bu Siti.' },
    offDay('food'),
    { title: 'Audit HACCP', story: [
        L('hancho', 'きょう は おきゃくさま の かんさ が ある。ていねい に ね。', 'kyou wa okyakusama no kansa ga aru. teinei ni ne.', 'Hari ini ada audit dari pelanggan. Bersikap sopan, ya.'),
        T('siti', 'Kalau auditor bertanya dan kamu tidak tahu, jawab jujur: 「わかりません。かくにん します。」'),
      ], tasks: ['wash',
        { ...Q('hancho', 'Auditor bertanya: 「てあらい は なんびょう ですか？」', [['30びょう いじょう です。', 'sanjuu-byou ijou desu.'], ['5びょう です。', 'go-byou desu.'], ['しりません。', 'shirimasen.']], 'Jawab dengan fakta prosedur. Kalau tidak tahu: わかりません。かくにん します (Saya tidak tahu, akan saya cek).'), at: 'sink' },
        { ...Q('hancho', 'Auditor bertanya: 「この きろく は だれ が かきましたか？」 (catatan suhu yang kamu tulis)', [['わたし が かきました。', 'watashi ga kakimashita.'], ['わかりません…（うそ）', 'wakarimasen (bohong)'], ['はんちょう です。（うそ）', 'hanchou desu (bohong)']], 'Catatan (記録) harus jujur dan bisa ditelusuri siapa penulisnya. Ini inti HACCP.'), at: 'fryer' },
        's5'],
      learn: 'Audit HACCP memeriksa prosedur & catatan. Jawab jujur dan sopan; kalau tidak tahu, katakan akan dicek.',
      vocab: V(['監査', 'かんさ', 'kansa', 'audit'], ['丁寧', 'ていねい', 'teinei', 'sopan, teliti'], ['確認', 'かくにん', 'kakunin', 'cek, konfirmasi']),
      next: 'Masalah besar: mesin pengisi nasi berhenti!' },
    { title: 'Mesin berhenti', story: [
        N('Bunyi alarm! Mesin pengisi nasi berhenti dan mengeluarkan bau terbakar.'),
      ], tasks: [
        { t: 'act', title: 'Tangani mesin yang berhenti', at: 'line', target: '⚙️', targetLabel: 'mesin pengisi nasi', steps: [
          { tool: ['🛑', 'ひじょう ていし'], jp: 'ひじょう ていし ボタン！', id: 'tekan tombol stop darurat', how: 'hold', after: '🛑 STOP' },
          { tool: ['📣', 'こえ'], jp: 'まわり に しらせて！', id: 'beri tahu orang di sekitar', how: 'taps:2', after: '📣 きけん！' },
          { tool: ['🙅', 'さわらない'], jp: 'て を いれない で！', id: 'jangan masukkan tangan ke mesin', how: 'tap', after: '🙅 ✓' },
          { tool: ['📞', 'はんちょう'], jp: 'はんちょう を よんで。', id: 'panggil kepala regu', how: 'tap', after: '📞 ✓' },
        ], extras: [['🔧', 'スパナ'], ['🧤', 'てぶくろ']], why: 'Jangan pernah memperbaiki atau memasukkan tangan ke mesin sendiri. Hentikan, amankan, laporkan. Banyak kecelakaan kerja di pabrik terjadi saat membersihkan mesin yang belum mati.' },
        { ...Q('hancho', 'Selama mesin diperbaiki, Pak Yamada bilang 「てで つめて」. Artinya…', ['Isi (nasi) dengan tangan secara manual', 'Pulang sekarang', 'Buang semua nasi'], 'つめる = mengisi/memadatkan. て で = dengan tangan. Produksi tetap jalan secara manual.'), at: 'line' },
        'belt'],
      learn: 'Mesin bermasalah: stop darurat → beri tahu sekitar → jangan sentuh → panggil atasan.',
      vocab: V(['非常停止', 'ひじょうていし', 'hijou teishi', 'stop darurat'], ['故障', 'こしょう', 'koshou', 'rusak'], ['詰める', 'つめる', 'tsumeru', 'mengisi']),
      next: 'Pekerja baru datang, dan kamu yang mengajarinya.' },
    { title: 'Mengajari Nguyen-san', story: [
        L('nguyen', 'はじめまして。グエン です。よろしく おねがいします。', 'hajimemashite. guen desu. yoroshiku onegaishimasu.', 'Senang berkenalan. Saya Nguyen. Mohon bimbingannya.', 'happy'),
        L('hancho', 'グエン さん に てあらい を おしえて あげて。', 'guen-san ni tearai wo oshiete agete.', 'Tolong ajari Nguyen-san cara cuci tangan.'),
      ], tasks: [
        { ...Q('hancho', 'Nguyen-san memakai cincin. Kamu bilang (sopan, mudah dimengerti)…', [['ゆびわ は ロッカー に いれて ください。', 'yubiwa wa rokkaa ni irete kudasai.'], ['ダメ！とって！', 'dame! totte!'], ['（だまって とる）', '(diam-diam melepasnya)']], 'Sebagai senpai: bicara pelan, kalimat pendek, 〜て ください, dan jelaskan alasannya (benda asing).'), at: 'locker' },
        'wash',
        { ...Q('hancho', 'Nguyen-san bilang 「すみません、わかりません」 saat kamu menjelaskan 5S. Kamu…', [['だいじょうぶ です。いっしょ に やりましょう。', 'daijoubu desu. issho ni yarimashou.'], ['なんで わからない の？', 'nande wakaranai no?'], ['じぶん で しらべて。', 'jibun de shirabete.']], 'Ingat hari pertamamu. Tunjukkan langsung (やって みせる), lalu biarkan dia mencoba.'), at: 'clean' },
        's5'],
      learn: 'Mengajar: kalimat pendek, 〜て ください, tunjukkan contoh, sabar. いっしょ に やりましょう = ayo kerjakan bersama.',
      vocab: V(['教える', 'おしえる', 'oshieru', 'mengajar'], ['一緒に', 'いっしょに', 'issho ni', 'bersama'], ['先輩', 'せんぱい', 'senpai', 'senior']),
      next: 'Besok ujian keterampilan. Siapkan dirimu!' },
    { title: 'Ujian keterampilan', story: [
        L('hancho', 'きょう は もぎ しけん だ。おちついて。', 'kyou wa mogi shiken da. ochitsuite.', 'Hari ini ujian latihan. Tenang saja.'),
      ], tasks: [
        { ...Q('hancho', 'Soal 1: HACCP adalah…', ['Cara mengelola titik kritis bahaya dalam produksi makanan', 'Nama mesin penggoreng', 'Jenis seragam pabrik'], 'HACCP = Hazard Analysis and Critical Control Point. Sejak 2021 wajib untuk usaha makanan di Jepang.'), at: 'board' },
        { ...Q('hancho', 'Soal 2: Urutan 5S yang benar…', ['せいり → せいとん → せいそう → せいけつ → しつけ', 'せいそう → せいり → しつけ → せいとん → せいけつ', 'しつけ → せいけつ → せいそう → せいとん → せいり'], 'Seiri (buang yang tidak perlu), seiton (tata), seisō (bersihkan), seiketsu (pertahankan), shitsuke (biasakan).') },
        { ...Q('hancho', 'Soal 3: Tujuh bahan alergen yang WAJIB dicantumkan di Jepang termasuk…', ['えび・かに・こむぎ・そば・たまご・にゅう・らっかせい (dan くるみ)', 'Hanya たまご', 'Tidak ada aturan'], 'Bahan alergen wajib (特定原材料): udang, kepiting, gandum, soba, telur, susu, kacang tanah, dan sejak 2025 juga kenari (くるみ).') },
        'belt', 'thermo'],
      learn: 'Materi ujian: HACCP, 5S, alergen wajib, suhu pemanasan, keselamatan kerja.',
      vocab: V(['模擬試験', 'もぎしけん', 'mogi shiken', 'ujian latihan'], ['特定原材料', 'とくていげんざいりょう', 'tokutei genzairyou', 'bahan alergen wajib'], ['落ち着く', 'おちつく', 'ochitsuku', 'tenang']),
      next: 'Hari terakhir: evaluasi akhir dan kelulusan!' },
    { title: 'Evaluasi akhir & kelulusan', story: [
        L('hancho', 'さいご の ひ だ。いつも どおり で いい。', 'saigo no hi da. itsumo doori de ii.', 'Hari terakhir. Bekerja seperti biasa saja.'),
      ], tasks: ['mida', 'wash', 'roller', 'belt', 'thermo', 'osaki'],
      outro: [
        L('hancho', '15にち、よく がんばった。りっぱ な しょくにん だ。', 'juugo-nichi, yoku ganbatta. rippa na shokunin da.', '15 hari, kamu bekerja keras. Kamu pekerja yang hebat.', 'happy'),
        Q('hancho', 'Salam perpisahan yang tepat untuk atasan…', [['いろいろ おせわ に なりました。ありがとう ございました。', 'iroiro osewa ni narimashita. arigatou gozaimashita.'], ['じゃあ ね！', 'jaa ne!'], ['おつかれ！', 'otsukare!']], 'おせわ に なりました = terima kasih atas segala bimbingannya. Diucapkan saat berpisah atau selesai kontrak.'),
      ],
      learn: 'Kamu menyelesaikan 15 hari di pabrik makanan: kebersihan, lini produksi, suhu, laporan, dan mengajari pekerja baru.',
      vocab: V(['職人', 'しょくにん', 'shokunin', 'pekerja ahli'], ['お世話になりました', 'おせわになりました', 'osewa ni narimashita', 'terima kasih atas bimbingannya'], ['修了', 'しゅうりょう', 'shuuryou', 'menyelesaikan program']) },
  ];

  /* =========================================================
     🧓 KAIGO · 15 hari
     ========================================================= */
  DAYS.kaigo = [
    { title: 'Orientasi panti', story: [
        L('leader', 'はじめまして。リーダー の すずき です。', 'hajimemashite. riidaa no suzuki desu.', 'Senang bertemu. Saya Suzuki, leader di sini.', 'happy'),
        T('leader', 'Di panti, kita tidak "mengurus pasien". Kita membantu kehidupan sehari-hari para penghuni (りようしゃ) sebagai orang yang kita hormati.'),
        L('riyosha', 'あら、あたらしい かた？よろしく ね。', 'ara, atarashii kata? yoroshiku ne.', 'Oh, orang baru? Salam kenal, ya.', 'happy'),
      ], tasks: ['curtain', 'temp',
        { ...Q('leader', 'Memanggil penghuni yang benar…', [['きむら さん', 'kimura-san'], ['おばあちゃん！', 'obaachan!'], ['ねえ、あなた', 'nee, anata']], 'Panggil dengan nama + さん. Memanggil "obaachan" bisa terasa merendahkan bagi sebagian lansia.'), at: 'room' }],
      learn: 'Panggil penghuni dengan nama + さん. こえかけ sebelum setiap tindakan. Laporkan perubahan kondisi (demam).',
      vocab: V(['利用者', 'りようしゃ', 'riyousha', 'penghuni / pengguna layanan'], ['声かけ', 'こえかけ', 'koekake', 'menyapa saat membantu'], ['体温', 'たいおん', 'taion', 'suhu badan']),
      next: 'Kamu belajar membantu makan siang.' },
    { title: 'Bantu makan', story: [
        L('leader', 'きょう は しょくじ かいじょ を れんしゅう しましょう。', 'kyou wa shokuji kaijo wo renshuu shimashou.', 'Hari ini kita latihan membantu makan.'),
      ], tasks: ['curtain', 'feedpick', 'feed', 'ippai'],
      learn: 'Posisi duduk tegak & dagu sedikit menunduk, suapan kecil, tunggu ごっくん. Catat persentase makan.',
      vocab: V(['食事介助', 'しょくじかいじょ', 'shokuji kaijo', 'bantu makan'], ['誤嚥', 'ごえん', 'goen', 'tersedak'], ['飲み込む', 'のみこむ', 'nomikomu', 'menelan']),
      next: 'Kursi roda & alat bantu: belajar memindahkan penghuni.' },
    { title: 'Alat bantu & kursi roda', story: [
        L('leader', 'これ は くるまいす。ここ が ブレーキ。', 'kore wa kurumaisu. koko ga bureeki.', 'Ini kursi roda. Ini remnya.'),
      ], tasks: ['curtain', 'transfer',
        { ...Q('leader', 'Bu Suzuki bilang 「てすり に つかまって ください」. Kamu minta penghuni…', ['Berpegangan pada pegangan tangan (てすり)', 'Duduk di lantai', 'Mengangkat tangan'], 'てすり = pegangan/railing. つかまる = berpegangan. Kalimat ini sering dipakai saat membantu berdiri & berjalan.'), at: 'hall' }],
      learn: 'Kunci rem sebelum memindahkan. てすり = pegangan tangan. Jelaskan setiap langkah ke penghuni.',
      vocab: V(['車いす', 'くるまいす', 'kurumaisu', 'kursi roda'], ['手すり', 'てすり', 'tesuri', 'pegangan tangan'], ['移乗', 'いじょう', 'ijou', 'pindah tempat duduk']),
      next: 'Hari yang membuatmu belajar: lupa mengunci rem…' },
    { title: 'Kesalahan pertama', story: [
        N('Saat memindahkan Kakek ke kursi roda, kursinya bergeser sedikit. Kamu lupa mengunci rem satu sisi. Untung beliau tidak jatuh.'),
      ], tasks: [
        { ...Q('leader', 'Kamu harus melapor ke Bu Suzuki. Laporan yang baik…', [['すみません。ブレーキ を かけわすれて、くるまいす が うごきました。けが は ありません。', 'sumimasen. bureeki wo kakewasurete, kurumaisu ga ugokimashita. kega wa arimasen.'], ['なにも ありません でした。', 'nanimo arimasen deshita.'], ['くるまいす が わるい です。', 'kurumaisu ga warui desu.']], 'Laporan jujur: apa yang terjadi + akibatnya (tidak ada luka). Ini bukan untuk dihukum, tapi untuk mencegah terulang.'), at: 'staff' },
        'transfer',
        { t: 'act', title: 'Cek kursi roda sebelum dipakai', at: 'wheel', target: '♿', targetLabel: 'kursi roda', steps: [
          { tool: ['🛑', 'ブレーキ'], jp: 'りょうほう の ブレーキ を かけて。', id: 'kunci rem kiri & kanan', how: 'taps:2', after: '🛑🛑 ✓' },
          { tool: ['🛞', 'タイヤ'], jp: 'タイヤ の くうき を みて。', id: 'cek angin ban', how: 'hold', after: '🛞 OK' },
          { tool: ['🦶', 'フットサポート'], jp: 'フットサポート を あげて。', id: 'angkat pijakan kaki sebelum duduk', how: 'swipe', after: '🦶 ⬆' },
        ], extras: [['🍵', 'おちゃ'], ['📺', 'テレビ']] }],
      learn: 'Kesalahan dilaporkan dengan jujur: apa, akibat, kondisi sekarang. Cek kursi roda sebelum dipakai.',
      vocab: V(['かけ忘れる', 'かけわすれる', 'kakewasureru', 'lupa memasang'], ['怪我', 'けが', 'kega', 'luka'], ['点検', 'てんけん', 'tenken', 'pemeriksaan']),
      next: 'Pagi sibuk dan slip gaji pertama.' },
    { title: 'Pagi sibuk & slip gaji', story: [
        L('leader', 'けさ は ひと が すくない から、てきぱき ね。', 'kesa wa hito ga sukunai kara, tekipaki ne.', 'Pagi ini staf sedikit, jadi kerja yang cekatan, ya.'),
      ], tasks: ['curtain', 'temp', 'feed', 'report'],
      learn: 'てきぱき = cekatan. Tetap こえかけ walau sibuk. Laporan: いつ・どこで・なにが.',
      vocab: V(['てきぱき', 'てきぱき', 'tekipaki', 'cekatan'], ['報告', 'ほうこく', 'houkoku', 'laporan'], ['記録', 'きろく', 'kiroku', 'catatan']),
      next: 'Kamu belajar membantu mandi.' },
    { title: 'Membantu mandi', story: [
        L('leader', 'にゅうよく は つかれる から、たいちょう を よく みて ね。', 'nyuuyoku wa tsukareru kara, taichou wo yoku mite ne.', 'Mandi itu melelahkan, jadi perhatikan kondisi badan mereka.'),
      ], tasks: ['temp', 'bath',
        { t: 'act', title: 'にゅうよく · Membantu mandi', at: 'bath', target: '🛁', targetLabel: 'Nenek Kimura di kursi mandi', steps: [
          { tool: ['🗣️', 'こえかけ'], jp: 'いまから おゆ を かけます ね。', id: 'beri tahu dulu', how: 'tap', after: '😊' },
          { tool: ['🚿', 'シャワー'], jp: 'あし から ゆっくり かけて。', id: 'siram dari kaki (jauh dari jantung)', how: 'swipe', after: '💧' },
          { tool: ['🧽', 'タオル'], jp: 'やさしく あらって。', id: 'gosok lembut', how: 'swipe', after: '🫧' },
          { tool: ['🧺', 'バスタオル'], jp: 'すぐ ふいて、からだ を ひやさない。', id: 'segera keringkan', how: 'hold', after: '🧺 ✓' },
        ], extras: [['🧊', 'こおり'], ['📱', 'スマホ']], why: 'Air disiram dari kaki dulu supaya tubuh terbiasa (mengurangi beban jantung). Setelah mandi segera keringkan dan beri minum.' }],
      learn: 'Mandi: suhu 38–41℃, siram dari kaki, gosok lembut, segera keringkan, beri minum setelahnya.',
      vocab: V(['入浴', 'にゅうよく', 'nyuuyoku', 'mandi'], ['お湯', 'おゆ', 'oyu', 'air panas'], ['冷やす', 'ひやす', 'hiyasu', 'mendinginkan']),
      next: 'Hari hujan: rekreasi di dalam ruangan.' },
    { title: 'Hari hujan & rekreasi', story: [
        N('Hujan deras sejak pagi. Jalan-jalan di taman dibatalkan.'),
        L('leader', 'きょう は レクリエーション で うた を うたいましょう。', 'kyou wa rekuriëeshon de uta wo utaimashou.', 'Hari ini kita rekreasi menyanyi bersama.'),
      ], tasks: ['curtain',
        { ...Q('leader', 'Nenek Kimura tidak mau ikut rekreasi. Kamu…', [['むり しなくて いい ですよ。みてる だけ でも どうぞ。', 'muri shinakute ii desu yo. miteru dake demo douzo.'], ['みんな やる から やって！', 'minna yaru kara yatte!'], ['（ほうって おく）', '(dibiarkan saja)']], 'Hormati pilihan penghuni (じこけってい). Tawarkan pilihan lain, jangan memaksa.'), at: 'dining' },
        { t: 'act', title: 'Senam kursi (いすたいそう) bersama', at: 'dining', target: '🪑', targetLabel: 'para penghuni', steps: [
          { tool: ['🙆', 'うで'], jp: 'うで を ゆっくり あげて〜。', id: 'angkat tangan pelan', how: 'hold', after: '🙆' },
          { tool: ['🦶', 'あし'], jp: 'あし を ふみましょう、いち、に！', id: 'hentak kaki bergantian', how: 'taps:4', after: '🦶🦶' },
          { tool: ['😮‍💨', 'しんこきゅう'], jp: 'しんこきゅう〜。', id: 'tarik napas dalam', how: 'hold', after: '😌' },
        ], extras: [['🏃', 'ダッシュ']] },
        'feed'],
      learn: 'Hormati keputusan penghuni (自己決定). Rekreasi & senam kursi menjaga kesehatan dan semangat.',
      vocab: V(['自己決定', 'じこけってい', 'jiko kettei', 'keputusan sendiri'], ['無理しない', 'むりしない', 'muri shinai', 'tidak memaksakan'], ['深呼吸', 'しんこきゅう', 'shinkokyuu', 'napas dalam']),
      next: 'Nada panggil berbunyi bersamaan: belajar prioritas.' },
    { title: 'Nada panggil bersamaan', story: [
        N('🔔 ナースコール berbunyi dari tiga kamar sekaligus!'),
      ], tasks: [
        { ...Q('leader', 'Kamar 1: "ingin minum". Kamar 2: "ada yang jatuh!". Kamar 3: "ingin ke toilet". Mana yang pertama?', ['Kamar 2 (jatuh)', 'Kamar 1 (minum)', 'Kamar 3 (toilet)'], 'Prioritas: keselamatan nyawa dulu (jatuh), lalu kebutuhan mendesak (toilet), lalu yang bisa menunggu sebentar. Bilang ke yang lain: 「すぐ いきます ね」.'), at: 'hall' },
        'fall',
        { ...Q('leader', 'Kamu belum bisa ke kamar 1 sekarang. Kamu bilang lewat interkom…', [['すみません、すこし まって ください。すぐ いきます。', 'sumimasen, sukoshi matte kudasai. sugu ikimasu.'], ['あとで！', 'ato de!'], ['（むし する）', '(abaikan)']], 'Tetap merespons supaya penghuni tahu panggilannya didengar.'), at: 'hall' },
        'report'],
      learn: 'Prioritas panggilan: jatuh/keselamatan > toilet > minum. Selalu jawab 「すぐ いきます」.',
      vocab: V(['ナースコール', 'ナースコール', 'naasu kooru', 'bel panggil'], ['優先', 'ゆうせん', 'yuusen', 'prioritas'], ['転倒', 'てんとう', 'tentou', 'jatuh']),
      next: 'Hampir terjadi kecelakaan di kamar mandi.' },
    { title: 'ヒヤリハット di kamar mandi', story: [
        N('Lantai kamar mandi masih licin bekas sabun. Nenek Kimura hampir terpeleset, tapi kamu sempat menahannya.'),
      ], tasks: [
        { ...Q('leader', 'Tidak ada yang terluka. Yang harus kamu lakukan…', [['ヒヤリハット ほうこくしょ を かきます。', 'hiyari hatto houkokusho wo kakimasu.'], 'Tidak usah lapor, tidak ada yang terluka', 'Marahi Nenek Kimura'], 'Laporan ヒヤリハット dibahas di rapat supaya penyebabnya (lantai licin) diperbaiki, misal memasang alas anti-selip.'), at: 'bath' },
        { t: 'act', title: 'Amankan kamar mandi', at: 'bath', target: '🛁', targetLabel: 'kamar mandi', steps: [
          { tool: ['🚿', 'シャワー'], jp: 'せっけん を ながして。', id: 'bilas sisa sabun di lantai', how: 'swipe', after: '💧' },
          { tool: ['🟫', 'すべりどめ マット'], jp: 'マット を しいて。', id: 'pasang alas anti-selip', how: 'tap', after: '🟫 ✓' },
          { tool: ['👋', 'てすり'], jp: 'てすり を さして あんない して。', id: 'arahkan berpegangan', how: 'tap', after: '👋 ✓' },
        ], extras: [['🧴', 'シャンプー']] },
        'bath'],
      learn: 'ヒヤリハット: laporkan meski tidak ada korban. Lantai licin → bilas sabun, alas anti-selip, pegangan tangan.',
      vocab: V(['ヒヤリハット', 'ヒヤリハット', 'hiyari hatto', 'nyaris celaka'], ['滑り止め', 'すべりどめ', 'suberidome', 'anti-selip'], ['報告書', 'ほうこくしょ', 'houkokusho', 'formulir laporan']),
      next: 'Hari libur di asrama bersama Bu Siti.' },
    offDay('kaigo', [{ ...Q('siti', 'Kamu sedih karena teringat nenekmu di Indonesia. Bu Siti bilang 「むり しないで ね」. Artinya…', ['Jangan memaksakan diri, ya', 'Ayo lembur', 'Jangan sedih, itu dilarang'], 'むり しないで = jangan terlalu memaksakan diri. Kalau stres atau rindu rumah berkepanjangan, ceritakan ke senpai, pendamping (支援機関), atau layanan konsultasi.'), at: 'ima' }]),
    { title: 'Kunjungan keluarga', story: [
        N('Putri Nenek Kimura datang berkunjung dan ingin tahu kondisi ibunya.'),
      ], tasks: [
        { ...Q('leader', 'Putrinya bertanya 「はは は げんき ですか？」. Kamu menjawab dengan sopan…', [['はい、おげんき です。きょう も しょくじ を ぜんぶ めしあがりました。', 'hai, ogenki desu. kyou mo shokuji wo zenbu meshiagarimashita.'], ['うん、げんき だよ。', 'un, genki da yo.'], ['しらない。', 'shiranai.']], 'Kepada keluarga pakai keigo: お元気です, 召し上がりました (makan, sopan). Sampaikan fakta yang konkret.'), at: 'room' },
        { ...Q('leader', 'Putrinya bertanya soal obat ibunya, dan kamu tidak yakin jawabannya. Kamu…', [['もうしわけ ありません。かんごし に かくにん します。', 'moushiwake arimasen. kangoshi ni kakunin shimasu.'], 'Menebak saja supaya terlihat tahu', 'Bilang obatnya tidak penting'], 'Hal medis (obat, diagnosis) dijawab oleh perawat/dokter. Pekerja kaigo menyampaikan dan menghubungkan.'), at: 'staff' },
        'feed', 'report'],
      learn: 'Bicara ke keluarga dengan keigo & fakta konkret. Hal medis diserahkan ke perawat.',
      vocab: V(['家族', 'かぞく', 'kazoku', 'keluarga'], ['召し上がる', 'めしあがる', 'meshiagaru', 'makan (sopan)'], ['看護師', 'かんごし', 'kangoshi', 'perawat']),
      next: 'Penyakit menular mengancam panti…' },
    { title: 'Penyakit menular', story: [
        N('Kakek Tanaka demam 38,2℃ dan batuk-batuk. Bisa jadi influenza.'),
        L('leader', 'かんせんしょう の たいおう を します。おちついて。', 'kansenshou no taiou wo shimasu. ochitsuite.', 'Kita tangani sebagai penyakit menular. Tenang.'),
      ], tasks: [
        { t: 'act', title: 'Tangani dugaan influenza', at: 'room', target: '🤒', targetLabel: 'Kakek Tanaka', steps: [
          { tool: ['😷', 'マスク'], jp: 'マスク と てぶくろ を して。', id: 'pakai masker & sarung tangan', how: 'tap', after: '😷 ✓' },
          { tool: ['🌡️', 'たいおんけい'], jp: 'たいおん を はかって、きろく して。', id: 'ukur & catat suhu', how: 'hold', after: '38.2℃' },
          { tool: ['🚪', 'こしつ'], jp: 'こしつ に うつって もらいます。', id: 'pindahkan ke kamar sendiri (isolasi)', how: 'tap', after: '🚪 ✓' },
          { tool: ['🧴', 'しょうどく'], jp: 'て を しょうどく して。', id: 'desinfeksi tangan', how: 'swipe', after: '✨' },
          { tool: ['📞', 'かんごし'], jp: 'かんごし に れんらく。', id: 'hubungi perawat', how: 'tap', after: '📞 ✓' },
        ], extras: [['🍬', 'あめ'], ['📺', 'テレビ']], why: 'Lansia mudah tertular dan sakit parah. Masker, isolasi, desinfeksi tangan sebelum & sesudah kontak (1ケア1手洗い), dan lapor cepat ke perawat.' },
        'temp', 'report'],
      learn: 'Penyakit menular: APD (masker, sarung tangan), isolasi, cuci tangan setiap tindakan, catat & lapor.',
      vocab: V(['感染症', 'かんせんしょう', 'kansenshou', 'penyakit menular'], ['個室', 'こしつ', 'koshitsu', 'kamar sendiri'], ['消毒', 'しょうどく', 'shoudoku', 'desinfeksi']),
      next: 'Pekerja baru datang: kamu jadi senpai.' },
    { title: 'Mengajari Nguyen-san', story: [
        L('nguyen', 'グエン です。かいご は はじめて です。', 'guen desu. kaigo wa hajimete desu.', 'Saya Nguyen. Baru pertama kali di kaigo.', 'happy'),
        L('leader', 'こえかけ の しかた を おしえて あげて。', 'koekake no shikata wo oshiete agete.', 'Tolong ajari cara こえかけ.'),
      ], tasks: [
        { ...Q('leader', 'Nguyen-san hendak membuka tirai kamar tanpa bicara. Kamu ajari…', [['さきに 「カーテン を あけても いい ですか」 と きいて ください。', 'saki ni "kaaten wo aketemo ii desu ka" to kiite kudasai.'], ['いそいで あけて！', 'isoide akete!'], ['（なにも いわない）', '(diam saja)']], 'Ajarkan alasan dan kalimat contohnya. Pekerja baru belajar paling cepat dari contoh langsung.'), at: 'room' },
        'feedpick', 'feed'],
      learn: 'Mengajar こえかけ: beri contoh kalimat, jelaskan alasannya, biarkan mencoba, puji yang sudah benar.',
      vocab: V(['仕方', 'しかた', 'shikata', 'cara'], ['手本', 'てほん', 'tehon', 'contoh'], ['褒める', 'ほめる', 'homeru', 'memuji']),
      next: 'Ujian keterampilan kaigo besok.' },
    { title: 'Ujian keterampilan', story: [L('leader', 'もぎ しけん です。がんばって。', 'mogi shiken desu. ganbatte.', 'Ujian latihan. Semangat.')], tasks: [
        { ...Q('leader', 'Soal 1: Saat membantu berjalan penghuni dengan satu sisi lumpuh (まひ), kamu berdiri di…', ['Sisi yang lumpuh (sedikit di belakang)', 'Sisi yang sehat', 'Di depan, menarik tangannya'], 'Berdiri di sisi yang lumpuh (患側) untuk menopang kalau oleng. Saat naik ke kursi roda, kursi diletakkan di sisi yang sehat (健側).'), at: 'hall' },
        { ...Q('leader', 'Soal 2: 「はいせつ」 artinya…', ['Buang air (BAB/BAK)', 'Makan', 'Mandi'], 'Kosakata ujian: 排泄 (buang air), 食事 (makan), 入浴 (mandi), 移乗 (pindah), 更衣 (ganti baju).') },
        { ...Q('leader', 'Soal 3: Prinsip penting dalam kaigo…', ['Menghormati martabat (そんげん) & kemandirian (じりつ) penghuni', 'Membantu semuanya supaya cepat', 'Mengikuti keinginan staf'], 'Bantu hanya bagian yang perlu dibantu, supaya kemampuan penghuni tetap terjaga (自立支援).') },
        'transfer', 'bath'],
      learn: 'Materi ujian: posisi berdiri saat membantu (sisi lumpuh), kosakata kaigo, martabat & kemandirian.',
      vocab: V(['麻痺', 'まひ', 'mahi', 'lumpuh'], ['尊厳', 'そんげん', 'songen', 'martabat'], ['自立支援', 'じりつしえん', 'jiritsu shien', 'mendukung kemandirian']),
      next: 'Hari terakhir di panti.' },
    { title: 'Evaluasi akhir & kelulusan', story: [L('leader', 'さいご の ひ です ね。いつも どおり で。', 'saigo no hi desu ne. itsumo doori de.', 'Hari terakhir, ya. Seperti biasa saja.')], tasks: ['curtain', 'temp', 'feed', 'transfer', 'bath', 'report', 'bye'],
      outro: [
        L('riyosha', 'これ、おてがみ。あなた の こと、わすれない わ。', 'kore, otegami. anata no koto, wasurenai wa.', 'Ini surat untukmu. Nenek tidak akan melupakanmu.', 'happy'),
        Q('leader', 'Salam perpisahan untuk Bu Suzuki…', [['いろいろ おせわ に なりました。', 'iroiro osewa ni narimashita.'], ['バイバイ！', 'baibai!'], ['つかれた〜。', 'tsukareta.']], 'おせわ に なりました = terima kasih atas segala bimbingannya.'),
      ],
      learn: 'Kamu menyelesaikan 15 hari di panti: こえかけ, makan, kursi roda, mandi, darurat, penyakit menular, dan mengajari pekerja baru.',
      vocab: V(['手紙', 'てがみ', 'tegami', 'surat'], ['忘れない', 'わすれない', 'wasurenai', 'tidak lupa'], ['お世話になりました', 'おせわになりました', 'osewa ni narimashita', 'terima kasih atas bimbingannya']) },
  ];

  /* =========================================================
     🏗 KONSTRUKSI · 15 hari
     ========================================================= */
  const KY_HUNT = (title, items) => ({ t: 'hunt', title, at: 'ky', items });
  DAYS.genba = [
    { title: 'Orientasi genba', story: [
        L('oyakata', 'しょくちょう の こんどう だ。ここ では あんぜん が いちばん。', 'shokuchou no kondou da. koko de wa anzen ga ichiban.', 'Aku Kondo, mandor. Di sini keselamatan nomor satu.'),
        L('siti', 'わたし は となり の げんば。ヘルメット、わすれない で ね！', 'watashi wa tonari no genba. herumetto, wasurenai de ne!', 'Aku kerja di genba sebelah. Jangan lupa helm, ya!', 'happy'),
      ], tasks: ['goanzen', 'ppe', 'chin',
        { ...Q('oyakata', 'Merokok di genba…', ['Hanya di tempat merokok yang ditentukan (きつえんじょ)', 'Boleh di mana saja', 'Boleh di dekat bahan bakar'], 'Merokok hanya di 喫煙所. Banyak genba sekarang melarang total. Api dekat material/bensin sangat berbahaya.'), at: 'tent' }],
      learn: 'ご安全に!, APD lengkap (helm + tali dagu, sepatu safety, harness, sarung tangan), aturan merokok.',
      vocab: V(['職長', 'しょくちょう', 'shokuchou', 'mandor'], ['安全', 'あんぜん', 'anzen', 'keselamatan'], ['喫煙所', 'きつえんじょ', 'kitsuenjo', 'tempat merokok']),
      next: 'KY活動 pertamamu di apel pagi.' },
    { title: 'KY pertama', story: [L('oyakata', 'きょう の さぎょう の きけん を みんな で かんがえる。', 'kyou no sagyou no kiken wo minna de kangaeru.', 'Kita pikirkan bersama bahaya pekerjaan hari ini.')],
      tasks: ['goanzen', KY_HUNT('KY: temukan bahaya di area kerja hari ini', [
        { e: '🕳️', x: 60, y: 110, d: 'Lubang tanpa penutup', ok: false, why: 'Pasang penutup & pagar' }, { e: '🔌', x: 150, y: 120, d: 'Kabel melintang', ok: false, why: 'Rapikan kabel' }, { e: '🪜', x: 240, y: 70, d: 'Tangga di tanah miring', ok: false, why: 'Tempatkan di tanah datar' },
        { e: '⛑️', x: 100, y: 40, d: 'Pekerja pakai helm', ok: true }, { e: '🚧', x: 200, y: 40, d: 'Pagar pengaman terpasang', ok: true }, { e: '🧱', x: 280, y: 120, d: 'Material ditumpuk rapi', ok: true }]), 'kyq', 'patrol'],
      learn: 'KY: cari bahaya → tentukan yang utama → cara mencegah → target tim 「〜ヨシ！」.',
      vocab: V(['危険予知', 'きけんよち', 'kiken yochi', 'prediksi bahaya'], ['作業', 'さぎょう', 'sagyou', 'pekerjaan'], ['対策', 'たいさく', 'taisaku', 'tindakan pencegahan']),
      next: 'Belajar nama alat-alat lapangan.' },
    { title: 'Nama alat lapangan', story: [L('oyakata', 'どうぐ の なまえ を おぼえろ。いそがしい とき は すぐ いう から な。', 'dougu no namae wo oboero. isogashii toki wa sugu iu kara na.', 'Hafalkan nama alat. Saat sibuk aku menyebutnya cepat.')],
      tasks: ['goanzen', 'neko',
        { ...Q('oyakata', '「バール とって！」 Yang kamu ambil…', ['🔩 Linggis (batang besi pencongkel)', '🪣 Ember', '📏 Meteran'], 'バール = linggis. Alat lain: スコップ (sekop), メジャー (meteran), インパクト (bor obeng listrik), ハンマー (palu).'), at: 'material' },
        { t: 'act', title: 'Siapkan alat sesuai perintah mandor', at: 'material', target: '🧰', targetLabel: 'kotak alat', steps: [
          { tool: ['📏', 'メジャー'], jp: 'メジャー で 2メートル はかって。', id: 'ukur 2 meter', how: 'swipe', after: '📏 2m' },
          { tool: ['🔨', 'ハンマー'], jp: 'くい を うって。', id: 'pukul patok', how: 'taps:3', after: '🔨 トントン' },
          { tool: ['🪛', 'インパクト'], jp: 'ビス を しめて。', id: 'kencangkan sekrup', how: 'hold', after: '🪛 ✓' },
        ], extras: [['🧹', 'ほうき'], ['🪣', 'バケツ']] },
        'unclear'],
      learn: 'Nama alat: バール, スコップ, メジャー, インパクト, ハンマー, ねこ. Kalau tidak dengar jelas, minta diulang.',
      vocab: V(['道具', 'どうぐ', 'dougu', 'alat'], ['バール', 'バール', 'baaru', 'linggis'], ['測る', 'はかる', 'hakaru', 'mengukur']),
      next: 'Ditegur karena lupa sesuatu yang penting…' },
    { title: 'Kesalahan pertama', story: [N('Pak Kondo memanggilmu dengan suara keras. Tali dagu helmmu tidak terkunci.')],
      tasks: [
        { ...Q('oyakata', 'Kamu ditegur. Jawaban yang tepat…', [['すみません！すぐ なおします。', 'sumimasen! sugu naoshimasu.'], ['だいじょうぶ です、あつい から。', 'daijoubu desu, atsui kara.'], ['（だまって むし する）', '(diam & abaikan)']], 'Di genba teguran keselamatan bukan marah pribadi. Minta maaf, perbaiki segera, dan jangan ulangi.'), at: 'ppe' },
        'chin', 'shisa'],
      learn: 'Ditegur → すみません！すぐ なおします. Tali dagu selalu terkunci, juga saat panas.',
      vocab: V(['直す', 'なおす', 'naosu', 'memperbaiki'], ['顎紐', 'あごひも', 'agohimo', 'tali dagu'], ['注意', 'ちゅうい', 'chuui', 'peringatan']),
      next: 'Hari membawa material dan slip gaji pertama.' },
    { title: 'Bawa material & slip gaji', story: [L('oyakata', 'きょう は しざい の はこび だ。こし を いためる な よ。', 'kyou wa shizai no hakobi da. koshi wo itameru na yo.', 'Hari ini angkut material. Jangan sampai pinggangmu cedera.')],
      tasks: ['goanzen',
        { t: 'act', title: 'Angkat material dengan benar', at: 'material', target: '🧱', targetLabel: 'karung semen 25 kg', steps: [
          { tool: ['🦵', 'ひざ'], jp: 'ひざ を まげて、こし を おとして。', id: 'tekuk lutut, turunkan pinggang', how: 'hold', after: '🦵' },
          { tool: ['🤲', 'りょうて'], jp: 'からだ に ちかづけて もって。', id: 'pegang dekat badan', how: 'tap', after: '🤲' },
          { tool: ['⬆️', 'たつ'], jp: 'あし の ちから で たって。', id: 'berdiri dengan kekuatan kaki', how: 'hold', after: '⬆️ ✓' },
          { tool: ['🛒', 'ねこ'], jp: 'ねこ に のせて はこんで。', id: 'pindahkan pakai gerobak', how: 'swipe', after: '🛒 →' },
        ], extras: [['🙇', 'こし だけ'], ['🏃', 'はしる']], why: 'Membungkuk dengan punggung lurus (pakai kaki) mencegah sakit pinggang (腰痛), cedera kerja paling umum.' },
        'neko', 'patrol'],
      learn: 'Angkat beban: tekuk lutut, pegang dekat badan, angkat dengan kaki. Barang berat → ねこ / berdua.',
      vocab: V(['資材', 'しざい', 'shizai', 'material'], ['腰痛', 'ようつう', 'youtsuu', 'sakit pinggang'], ['運ぶ', 'はこぶ', 'hakobu', 'mengangkut']),
      next: 'Bekerja di tangga & 指差呼称.' },
    { title: 'Tangga & tunjuk-seru', story: [L('oyakata', 'きゃたつ の うえ では りょうて を あけろ。', 'kyatatsu no ue de wa ryoute wo akero.', 'Di atas tangga, kedua tangan harus bebas.')],
      tasks: ['goanzen', 'shisa',
        { ...Q('oyakata', 'Bekerja di tangga lipat, yang DILARANG…', ['Berdiri di anak tangga paling atas (てんばん)', 'Membuka tangga sampai terkunci', 'Memakai helm'], 'Dilarang berdiri di pijakan paling atas, dan jangan bekerja di tangga sambil membawa barang di kedua tangan.'), at: 'ladder' },
        'patrol'],
      learn: 'Tangga lipat: tanah datar, kunci terbuka penuh, tidak berdiri di pijakan teratas, 指差呼称 sebelum naik.',
      vocab: V(['脚立', 'きゃたつ', 'kyatatsu', 'tangga lipat'], ['天板', 'てんばん', 'tenban', 'pijakan teratas'], ['両手', 'りょうて', 'ryoute', 'kedua tangan']),
      next: 'Musim panas 35℃ di genba.' },
    { title: 'Panas 35℃', story: [N('Indeks panas (WBGT) hari ini 31: level "berbahaya". Istirahat diperbanyak.')],
      tasks: ['goanzen', 'heat',
        { t: 'act', title: 'Cegah heat stroke', at: 'tent', target: '🥵', targetLabel: 'tubuhmu', steps: [
          { tool: ['💧', 'みず・しお'], jp: 'みず と しお を とって。', id: 'minum air & tablet garam', how: 'taps:2', after: '💧🧂' },
          { tool: ['🌀', 'ファン つき ふく'], jp: 'くうちょう ふく の スイッチ オン。', id: 'nyalakan baju berkipas', how: 'tap', after: '🌀 ON' },
          { tool: ['⛺', 'ひかげ'], jp: 'ひかげ で 15ふん やすんで。', id: 'istirahat di tempat teduh', how: 'hold', after: '😌' },
        ], extras: [['☕', 'コーヒー'], ['🏃', 'はしる']] },
        'unclear'],
      learn: 'Heat stroke: minum air & garam berkala, istirahat di tempat teduh, baju berkipas (空調服). WBGT ≥ 31 = bahaya.',
      vocab: V(['暑さ指数', 'あつさしすう', 'atsusa shisuu', 'indeks panas (WBGT)'], ['日陰', 'ひかげ', 'hikage', 'tempat teduh'], ['塩分', 'えんぶん', 'enbun', 'garam']),
      next: 'Hari pengecoran beton: semua harus cepat.' },
    { title: 'Hari pengecoran', story: [L('oyakata', 'きょう は コンクリート うち だ。まって くれない ぞ！', 'kyou wa konkuriito uchi da. matte kurenai zo!', 'Hari ini cor beton. Betonnya tidak bisa menunggu!')],
      tasks: ['goanzen', 'ky',
        { ...Q('oyakata', 'Mandor berteriak 「ストップ！」 saat truk mundur. Kamu…', ['Langsung berhenti & menjauh dari jalur truk', 'Lanjut bekerja', 'Lari ke belakang truk'], 'Perintah singkat di genba harus langsung diikuti: ストップ (berhenti), オーライ (oke/maju), バック (mundur). Jangan berdiri di jalur kendaraan.'), at: 'gate' },
        { t: 'act', title: 'Ratakan beton', at: 'scaffold', target: '⬜', targetLabel: 'beton basah', steps: [
          { tool: ['🧹', 'トンボ'], jp: 'トンボ で ならして。', id: 'ratakan dengan perata (トンボ)', how: 'swipe', after: '⬜ rata' },
          { tool: ['📳', 'バイブレーター'], jp: 'バイブ を かけて、くうき を ぬいて。', id: 'getarkan untuk keluarkan udara', how: 'hold', after: '📳 ✓' },
          { tool: ['🧽', 'こて'], jp: 'こて で しあげ。', id: 'haluskan dengan kape (こて)', how: 'swipe', after: '✨' },
        ], extras: [['🔨', 'ハンマー']] }],
      learn: 'Perintah genba singkat: ストップ, オーライ, バック. Jauhi jalur kendaraan. Pengecoran harus kompak & cepat.',
      vocab: V(['打設', 'だせつ', 'dasetsu', 'pengecoran'], ['均す', 'ならす', 'narasu', 'meratakan'], ['オーライ', 'オーライ', 'oorai', 'oke (aba-aba)']),
      next: 'Benda jatuh dari perancah…' },
    { title: 'ヒヤリハット: benda jatuh', story: [N('Sebuah kunci pas jatuh dari perancah lantai 2 dan mendarat 1 meter di sampingmu.')],
      tasks: [
        { ...Q('oyakata', 'Yang harus dilakukan…', [['ヒヤリハット を ほうこく します。', 'hiyari hatto wo houkoku shimasu.'], 'Diam saja karena tidak kena', 'Lempar balik ke atas'], 'Benda jatuh adalah salah satu penyebab kematian di genba. Laporkan supaya dipasang jaring/papan kaki & tali pengikat alat.'), at: 'scaffold' },
        { t: 'act', title: 'Cegah benda jatuh', at: 'scaffold', target: '🏗️', targetLabel: 'perancah', steps: [
          { tool: ['🪢', 'おちどめ ロープ'], jp: 'どうぐ に ひも を つけて。', id: 'ikat alat dengan tali', how: 'tap', after: '🪢 ✓' },
          { tool: ['🟫', 'はばき'], jp: 'はばき を つけて。', id: 'pasang papan kaki (幅木)', how: 'swipe', after: '🟫 ✓' },
          { tool: ['🚧', 'たちいりきんし'], jp: 'した に たちいり きんし の テープ。', id: 'pasang pita dilarang masuk di bawah', how: 'swipe', after: '🚧 ✓' },
        ], extras: [['📱', 'スマホ']] },
        'patrol'],
      learn: 'Cegah benda jatuh: tali pengikat alat, papan kaki (幅木), area bawah dilarang masuk. ヒヤリハット selalu dilaporkan.',
      vocab: V(['落下', 'らっか', 'rakka', 'jatuh (benda)'], ['幅木', 'はばき', 'habaki', 'papan kaki perancah'], ['立入禁止', 'たちいりきんし', 'tachiiri kinshi', 'dilarang masuk']),
      next: 'Hari libur di asrama bersama Bu Siti.' },
    offDay('genba'),
    { title: 'Patroli keselamatan', story: [L('oyakata', 'きょう は ほんしゃ の あんぜん パトロール が くる。せいとん しろ！', 'kyou wa honsha no anzen patorooru ga kuru. seiton shiro!', 'Hari ini patroli keselamatan dari kantor pusat. Rapikan!')],
      tasks: ['goanzen',
        { t: 'act', title: 'Rapikan genba sebelum patroli', at: 'material', target: '🏗️', targetLabel: 'area kerja', steps: [
          { tool: ['🗑️', 'ごみ'], jp: 'ごみ を ぶんべつ して すてて。', id: 'buang sampah terpilah', how: 'swipe', after: '🗑️ ✓' },
          { tool: ['🧱', 'しざい'], jp: 'しざい を そろえて。', id: 'rapikan material', how: 'taps:3', after: '🧱 rapi' },
          { tool: ['🔌', 'コード'], jp: 'コード を まとめて。', id: 'gulung kabel', how: 'swipe', after: '🔌 ✓' },
        ], extras: [['🍙', 'おにぎり']] },
        { ...Q('oyakata', 'Petugas patroli bertanya 「この さぎょう の きけん は なん ですか？」. Kamu jawab…', [['きゃたつ から の てんらく です。', 'kyatatsu kara no tenraku desu.'], ['わかりません、しりません。', 'wakarimasen, shirimasen.'], ['ない です。', 'nai desu.']], 'Tunjukkan bahwa kamu paham bahaya pekerjaanmu (hasil KY pagi ini). Jawab singkat & jelas.'), at: 'ky' },
        'patrol'],
      learn: 'Saat patroli: genba rapi (5S), jawab pertanyaan bahaya pekerjaanmu dengan jelas.',
      vocab: V(['本社', 'ほんしゃ', 'honsha', 'kantor pusat'], ['分別', 'ぶんべつ', 'bunbetsu', 'memilah (sampah)'], ['転落', 'てんらく', 'tenraku', 'jatuh dari ketinggian']),
      next: 'Peringatan topan…' },
    { title: 'Topan mendekat', story: [N('📢 Peringatan topan (台風) untuk sore ini. Angin diperkirakan 20 m/detik.')],
      tasks: [
        { t: 'act', title: 'Amankan genba sebelum topan', at: 'scaffold', target: '🌀', targetLabel: 'genba', steps: [
          { tool: ['🪢', 'ロープ'], jp: 'しざい を ロープ で しばって。', id: 'ikat material dengan tali', how: 'taps:2', after: '🪢 ✓' },
          { tool: ['🟦', 'シート'], jp: 'あしば の シート を たたんで。', id: 'gulung terpal perancah (supaya tidak terhempas)', how: 'swipe', after: '🟦 ✓' },
          { tool: ['🔒', 'ゲート'], jp: 'ゲート を しめて。', id: 'tutup & kunci gerbang', how: 'tap', after: '🔒 ✓' },
        ], extras: [['☂️', 'かさ']] },
        { ...Q('oyakata', 'Angin sudah kencang (風速10m以上). Bekerja di perancah tinggi…', ['Dihentikan sesuai aturan, turun ke tempat aman', 'Lanjut asal hati-hati', 'Pakai payung'], 'Aturan keselamatan Jepang: kerja di ketinggian dihentikan saat angin kencang (rata-rata 10 m/s ke atas), hujan lebat, atau salju lebat.'), at: 'gate' }],
      learn: 'Topan: ikat material, gulung terpal perancah, tutup gerbang, hentikan kerja di ketinggian.',
      vocab: V(['台風', 'たいふう', 'taifuu', 'topan'], ['中止', 'ちゅうし', 'chuushi', 'dihentikan'], ['縛る', 'しばる', 'shibaru', 'mengikat']),
      next: 'Pekerja baru datang: kamu mengajarinya.' },
    { title: 'Mengajari Nguyen-san', story: [L('nguyen', 'グエン です。げんば は はじめて です。', 'guen desu. genba wa hajimete desu.', 'Saya Nguyen. Baru pertama di genba.', 'happy')],
      tasks: [
        { ...Q('oyakata', 'Nguyen-san memakai helm tapi tali dagunya longgar. Kamu bilang…', [['あごひも を しっかり しめて ください。あぶない です。', 'agohimo wo shikkari shimete kudasai. abunai desu.'], ['まあ いい か。', 'maa ii ka.'], ['ヘルメット いらない よ。', 'herumetto iranai yo.']], 'Senpai yang baik menegur keselamatan dengan jelas & alasan.'), at: 'ppe' },
        'ppe', 'ky', 'shisa'],
      learn: 'Mengajar keselamatan: tegas, singkat, beri alasan (あぶない です), dan beri contoh.',
      vocab: V(['締める', 'しめる', 'shimeru', 'mengencangkan'], ['危ない', 'あぶない', 'abunai', 'berbahaya'], ['しっかり', 'しっかり', 'shikkari', 'dengan kuat']),
      next: 'Ujian keterampilan konstruksi.' },
    { title: 'Ujian keterampilan', story: [L('oyakata', 'もぎ しけん だ。あわてる な。', 'mogi shiken da. awateru na.', 'Ujian latihan. Jangan panik.')],
      tasks: [
        { ...Q('oyakata', 'Soal 1: Ketinggian kerja yang wajib memakai harness (フルハーネス) di Jepang…', ['Pada prinsipnya 6,75 m ke atas (dan 2 m ke atas bila tidak ada pagar/alas kerja)', '50 cm', 'Tidak pernah wajib'], 'Aturan Jepang sejak 2019: harness tipe full-body pada prinsipnya wajib ≥6,75 m; di atas 2 m tanpa pagar/alas kerja juga harus pakai alat pencegah jatuh.'), at: 'ky' },
        { ...Q('oyakata', 'Soal 2: Tanda 「立入禁止」 artinya…', ['Dilarang masuk', 'Pintu keluar', 'Tempat istirahat'], 'Tanda penting: 立入禁止 (dilarang masuk), 頭上注意 (awas atas kepala), 足元注意 (awas langkah), 火気厳禁 (dilarang api).') },
        { ...Q('oyakata', 'Soal 3: 「頭上注意」 artinya…', ['Awas benda di atas kepala', 'Awas lantai licin', 'Dilarang merokok'], 'ずじょう ちゅうい = waspada di atas kepala.') },
        'patrol', 'shisa'],
      learn: 'Materi ujian: aturan harness, tanda keselamatan (立入禁止・頭上注意・足元注意・火気厳禁), alat, KY.',
      vocab: V(['頭上注意', 'ずじょうちゅうい', 'zujou chuui', 'awas atas kepala'], ['足元注意', 'あしもとちゅうい', 'ashimoto chuui', 'awas langkah'], ['火気厳禁', 'かきげんきん', 'kaki genkin', 'dilarang api']),
      next: 'Hari terakhir di genba.' },
    { title: 'Evaluasi akhir & kelulusan', story: [L('oyakata', 'さいご だ。ぶじ に おわらせよう。', 'saigo da. buji ni owaraseyou.', 'Hari terakhir. Mari selesaikan dengan selamat.')],
      tasks: ['goanzen', 'ppe', 'chin', 'ky', 'patrol', 'shisa', 'heat', 'otsukare'],
      outro: [L('oyakata', '15にち、むじこ だった。たいした もん だ！', 'juugo-nichi, mujiko datta. taishita mon da!', '15 hari tanpa kecelakaan. Hebat!', 'happy'),
        Q('oyakata', 'Salam perpisahan untuk Pak Kondo…', [['いろいろ おせわ に なりました。ありがとう ございました。', 'iroiro osewa ni narimashita. arigatou gozaimashita.'], ['じゃ！', 'ja!'], ['もう こない。', 'mou konai.']], 'おせわ に なりました = terima kasih atas bimbingannya.')],
      learn: 'Kamu menyelesaikan 15 hari di genba tanpa kecelakaan: APD, KY, alat, tangga, panas, topan, dan mengajari pekerja baru.',
      vocab: V(['無事故', 'むじこ', 'mujiko', 'tanpa kecelakaan'], ['無事', 'ぶじ', 'buji', 'selamat'], ['お世話になりました', 'おせわになりました', 'osewa ni narimashita', 'terima kasih atas bimbingannya']) },
  ];

  /* =========================================================
     🍶 IZAKAYA · 15 hari
     ========================================================= */
  DAYS.gaishoku = [
    { title: 'Orientasi izakaya', story: [
        L('tencho', 'てんちょう の いしい です。げんき な こえ で いこう！', 'tenchou no ishii desu. genki na koe de ikou!', 'Saya Ishii, manajer. Ayo pakai suara yang semangat!', 'happy'),
        T('siti', 'Aku dulu juga kerja paruh waktu di izakaya. Salam pelayanan (接客用語) itu kuncinya!'),
      ], tasks: ['flow',
        { t: 'act', title: 'せっきゃく ようご · Latihan salam pelayanan', at: 'door', target: '🙇', targetLabel: 'latihan di depan cermin', steps: [
          { tool: ['🙇', 'おじぎ'], jp: 'いらっしゃいませ！', id: 'membungkuk 30°, salam datang', how: 'hold', after: '🙇' },
          { tool: ['🙂', 'えがお'], jp: 'かしこまりました。', id: '"baik, saya mengerti" (sopan)', how: 'tap', after: '🙂' },
          { tool: ['⏳', 'まつ'], jp: 'しょうしょう おまち ください。', id: '"mohon tunggu sebentar"', how: 'hold', after: '⏳' },
          { tool: ['🙏', 'おれい'], jp: 'ありがとう ございました！', id: 'terima kasih saat tamu pulang', how: 'taps:2', after: '🙏' },
        ], extras: [['😐', 'むひょうじょう']] },
        'irasshai'],
      learn: '接客用語 dasar: いらっしゃいませ, かしこまりました, しょうしょう おまち ください, ありがとう ございました.',
      vocab: V(['接客用語', 'せっきゃくようご', 'sekkyaku yougo', 'frasa pelayanan'], ['畏まりました', 'かしこまりました', 'kashikomarimashita', 'baik, saya mengerti (sopan)'], ['笑顔', 'えがお', 'egao', 'senyum']),
      next: 'Menyambut tamu & mengantar ke meja.' },
    { title: 'Menyambut tamu', story: [L('tencho', 'きょう は あんない を やって みよう。', 'kyou wa annai wo yatte miyou.', 'Hari ini coba antar tamu ke meja.')],
      tasks: ['irasshai', 'nanmei',
        { t: 'act', title: 'Antar tamu & siapkan meja', at: 't1', target: '🍶', targetLabel: 'meja 1 (3 orang)', steps: [
          { tool: ['👋', 'あんない'], jp: 'こちら へ どうぞ。', id: 'antar ke meja', how: 'tap', after: '👋' },
          { tool: ['🧻', 'おしぼり'], jp: 'おしぼり を どうぞ。', id: 'berikan handuk basah', how: 'taps:3', after: '🧻×3' },
          { tool: ['🥛', 'おひや'], jp: 'おひや を おもち しました。', id: 'berikan air dingin', how: 'taps:3', after: '🥛×3' },
          { tool: ['📋', 'メニュー'], jp: 'メニュー で ございます。', id: 'berikan menu', how: 'tap', after: '📋' },
        ], extras: [['🍺', 'ビール']], cast: GUEST_SEAT },
        'nama'],
      learn: 'Alur menyambut: いらっしゃいませ → 〜名様 → こちら へ どうぞ → おしぼり & おひや → menu.',
      vocab: V(['案内', 'あんない', 'annai', 'mengantar'], ['お冷', 'おひや', 'ohiya', 'air dingin'], ['おしぼり', 'おしぼり', 'oshibori', 'handuk basah']),
      next: 'Belajar menu & alat-alat restoran.' },
    { title: 'Menu & alat restoran', story: [L('tencho', 'これ が ハンディ。ちゅうもん を いれる きかい だ。', 'kore ga handi. chuumon wo ireru kikai da.', 'Ini ハンディ, alat untuk memasukkan pesanan.')],
      tasks: [
        { ...Q('tencho', '「とりざら を みっつ おねがい」. Yang kamu bawa…', ['🍽️ Tiga piring kecil untuk berbagi', '🍢 Tiga tusuk yakitori', '🥢 Tiga pasang sumpit'], 'とりざら = piring kecil untuk mengambil makanan bersama. みっつ = tiga.'), at: 'kitchen' },
        { t: 'act', title: 'Masukkan pesanan ke ハンディ', at: 't1', target: '📟', targetLabel: 'ハンディ (alat pesan)', steps: [
          { tool: ['🍺', 'なま'], jp: 'なま ふたつ', id: 'tekan bir draft 2×', how: 'taps:2', after: '🍺×2' },
          { tool: ['🫛', 'えだまめ'], jp: 'えだまめ ひとつ', id: 'tekan edamame 1×', how: 'tap', after: '🫛×1' },
          { tool: ['🍢', 'やきとり'], jp: 'やきとり みっつ', id: 'tekan yakitori 3×', how: 'taps:3', after: '🍢×3' },
          { tool: ['📤', 'そうしん'], jp: 'ちゅうもん を そうしん！', id: 'kirim pesanan ke dapur', how: 'hold', after: '📤 ✓' },
        ], extras: [['🍣', 'すし'], ['🍜', 'ラーメン']], cast: GUEST_SEAT },
        'nama', 'dishes'],
      learn: 'Alat: ハンディ, 伝票 (bon), とりざら, おしぼり. Angka hitungan: ひとつ・ふたつ・みっつ.',
      vocab: V(['取り皿', 'とりざら', 'torizara', 'piring kecil'], ['伝票', 'でんぴょう', 'denpyou', 'bon pesanan'], ['送信', 'そうしん', 'soushin', 'kirim (data)']),
      next: 'Hari yang sulit: salah mengantar pesanan…' },
    { title: 'Kesalahan pertama', story: [N('Kamu mengantar yakitori ke meja 2, padahal itu pesanan meja 1. Tamu meja 1 sudah menunggu 20 menit.')],
      tasks: [
        { ...Q('tencho', 'Ke tamu meja 1 yang menunggu, kamu bilang…', [['たいへん もうしわけ ございません。すぐ おもち します。', 'taihen moushiwake gozaimasen. sugu omochi shimasu.'], ['ごめん、まちがえた。', 'gomen, machigaeta.'], ['（だまって おく）', '(diam saja)']], 'Ke tamu: もうしわけ ございません (sangat sopan). Lalu lapor ke tenchō supaya dapur memprioritaskan.'), at: 't1' },
        { ...Q('tencho', 'Lapor ke tenchō…', [['てんちょう、1ばん と 2ばん を まちがえて はこびました。', 'tenchou, ichiban to niban wo machigaete hakobimashita.'], ['なんでも ありません。', 'nan demo arimasen.'], ['キッチン が わるい です。', 'kicchin ga warui desu.']], 'Lapor fakta: meja mana tertukar. Tenchō bisa memutuskan kompensasi (misal minuman gratis).'), at: 'kitchen' },
        'dishes', 'spill'],
      learn: 'Ke tamu pakai もうしわけ ございません. Lapor kesalahan dengan fakta (meja nomor berapa).',
      vocab: V(['申し訳ございません', 'もうしわけございません', 'moushiwake gozaimasen', 'mohon maaf (sangat sopan)'], ['間違える', 'まちがえる', 'machigaeru', 'salah'], ['番', 'ばん', 'ban', 'nomor (meja)']),
      next: 'Tugas kasir dan slip gaji pertama.' },
    { title: 'Kasir & slip gaji', story: [L('tencho', 'きょう は レジ を まかせる。おかね は かならず かくにん。', 'kyou wa reji wo makaseru. okane wa kanarazu kakunin.', 'Hari ini kasir kuserahkan padamu. Uang wajib dicek ulang.')],
      tasks: ['irasshai', 'cash', 'cash', 'thanks'],
      learn: 'Kasir: sebutkan total, terima uang (〜えん おあずかり します), hitung kembalian di depan tamu.',
      vocab: V(['お会計', 'おかいけい', 'okaikei', 'pembayaran'], ['お預かりします', 'おあずかりします', 'oazukari shimasu', 'saya terima (uangnya)'], ['お釣り', 'おつり', 'otsuri', 'kembalian']),
      next: 'Tamu dengan alergi makanan.' },
    { title: 'Alergi makanan', story: [L('tencho', 'アレルギー は いのち に かかわる。ぜったい に すいそく しない。', 'arerugii wa inochi ni kakawaru. zettai ni suisoku shinai.', 'Alergi menyangkut nyawa. Jangan pernah menebak.')],
      tasks: ['allergy',
        { t: 'act', title: 'Cek alergen di tabel menu', at: 'kitchen', target: '📖', targetLabel: 'tabel alergen (アレルゲン ひょう)', steps: [
          { tool: ['🔍', 'メニュー'], jp: 'サラダ の らん を さがして。', id: 'cari baris menu salad', how: 'swipe', after: '🔍' },
          { tool: ['🦐', 'えび'], jp: 'えび の らん を かくにん。', id: 'cek kolom udang', how: 'hold', after: '🦐 ✗ ada!' },
          { tool: ['🗣️', 'てんちょう'], jp: 'てんちょう に つたえる。', id: 'sampaikan ke tenchō', how: 'tap', after: '🗣️ ✓' },
          { tool: ['🥗', 'べつ の サラダ'], jp: 'えび なし の サラダ を ていあん。', id: 'tawarkan salad tanpa udang', how: 'tap', after: '🥗 ✓' },
        ], extras: [['🎲', 'カン']] },
        'dishes'],
      learn: 'Alergi: jangan menebak. Cek tabel alergen, konsultasi tenchō/dapur, tawarkan alternatif yang aman.',
      vocab: V(['アレルギー', 'アレルギー', 'arerugii', 'alergi'], ['推測', 'すいそく', 'suisoku', 'menebak'], ['提案', 'ていあん', 'teian', 'menawarkan']),
      next: 'Hari hujan: tamu sedikit, bersih-bersih besar.' },
    { title: 'Hari hujan & bersih-bersih', story: [N('Hujan deras, tamu sepi.'), L('tencho', 'ひま な ひ こそ そうじ だ！', 'hima na hi koso souji da!', 'Justru saat sepi, waktunya bersih-bersih!')],
      tasks: [
        { t: 'act', title: 'Bersih-bersih besar dapur', at: 'kitchen', target: '🍳', targetLabel: 'dapur', steps: [
          { tool: ['🧼', 'せんざい'], jp: 'かんきせん の あぶら を おとして。', id: 'bersihkan minyak di kipas penghisap', how: 'swipe', after: '✨' },
          { tool: ['🧊', 'れいぞうこ'], jp: 'れいぞうこ の おんど を かくにん。', id: 'cek suhu kulkas (10℃ ke bawah)', how: 'hold', after: '🧊 4℃' },
          { tool: ['🗓️', 'きげん'], jp: 'きげん ぎれ の もの を すてて。', id: 'buang yang kedaluwarsa', how: 'taps:2', after: '🗑️' },
          { tool: ['🧽', 'ゆか'], jp: 'ゆか を みがいて。', id: 'gosok lantai', how: 'swipe', after: '✨' },
        ], extras: [['🎮', 'ゲーム']] },
        { ...Q('tencho', 'Bahan di kulkas: label tertulis 「先入れ先出し」. Artinya…', ['Yang masuk duluan dipakai duluan (FIFO)', 'Yang baru dipakai duluan', 'Semua dibuang'], 'さきいれ さきだし (FIFO): bahan lama di depan, dipakai dulu, supaya tidak kedaluwarsa.'), at: 'kitchen' },
        'spill'],
      learn: 'Kebersihan dapur: minyak kipas, suhu kulkas, buang yang kedaluwarsa, 先入れ先出し (FIFO).',
      vocab: V(['先入れ先出し', 'さきいれさきだし', 'sakiire sakidashi', 'FIFO'], ['冷蔵庫', 'れいぞうこ', 'reizouko', 'kulkas'], ['期限切れ', 'きげんぎれ', 'kigengire', 'kedaluwarsa']),
      next: 'Jumat malam: rombongan 10 orang!' },
    { title: 'Rombongan Jumat malam', story: [L('tencho', 'きょう は 10めい の えんかい の よやく だ。', 'kyou wa juumei no enkai no yoyaku da.', 'Malam ini ada reservasi pesta 10 orang.')],
      tasks: ['irasshai',
        { ...Q('tencho', 'Tamu rombongan: 「のみほうだい で！」. Artinya…', ['Minum sepuasnya dengan harga tetap (biasanya batas waktu)', 'Tidak minum alkohol', 'Minta tagihan dipisah'], 'のみほうだい = all-you-can-drink. Biasanya 90–120 menit, ada "last order" untuk minuman.'), at: 't2' },
        'nama', 'dishes', 'cash', 'thanks'],
      learn: '宴会 (pesta) & 飲み放題: kerja cepat, catat pesanan dengan teliti, informasikan ラストオーダー.',
      vocab: V(['宴会', 'えんかい', 'enkai', 'pesta'], ['予約', 'よやく', 'yoyaku', 'reservasi'], ['飲み放題', 'のみほうだい', 'nomihoudai', 'minum sepuasnya']),
      next: 'Kejadian berbahaya di dapur…' },
    { title: 'ヒヤリハット di dapur', story: [N('Pegangan wajan menjorok keluar kompor. Rekanmu hampir menyenggolnya dan minyak panas hampir tumpah.')],
      tasks: [
        { ...Q('tencho', 'Tidak ada yang terluka. Kamu…', [['ヒヤリハット を ほうこく します。', 'hiyari hatto wo houkoku shimasu.'], 'Diam saja', 'Tertawa'], 'Laporkan supaya ada aturan: pegangan wajan menghadap ke dalam, jalur di dapur tidak terhalang.'), at: 'kitchen' },
        { t: 'act', title: 'Dapur yang aman', at: 'kitchen', target: '🔥', targetLabel: 'kompor', steps: [
          { tool: ['🍳', 'とって'], jp: 'とって を うちがわ に むけて。', id: 'putar pegangan wajan ke dalam', how: 'swipe', after: '🍳 ✓' },
          { tool: ['📣', 'こえかけ'], jp: 'うしろ とおります！', id: '"lewat di belakang!"', how: 'tap', after: '📣' },
          { tool: ['🧯', 'しょうかき'], jp: 'しょうかき の ばしょ を かくにん。', id: 'cek letak pemadam api', how: 'hold', after: '🧯 ✓' },
        ], extras: [['💧', 'みず (あぶら に)']] },
        'dishes'],
      learn: 'Dapur aman: pegangan wajan ke dalam, beri suara saat lewat (うしろ とおります), tahu letak pemadam. Jangan siram minyak terbakar dengan air.',
      vocab: V(['取っ手', 'とって', 'totte', 'pegangan'], ['後ろ通ります', 'うしろとおります', 'ushiro toorimasu', 'lewat di belakang'], ['消火器', 'しょうかき', 'shoukaki', 'pemadam api']),
      next: 'Hari libur di asrama.' },
    offDay('gaishoku', [{ ...Q('siti', 'Kamu makan di restoran lain di hari libur. Saat masuk, pelayan bertanya 「なんめいさま ですか？」. Kamu jawab…', [['ひとり です。', 'hitori desu.'], ['ひとりさま です。', 'hitori-sama desu.'], ['いち です。', 'ichi desu.']], 'Sebagai tamu jawab biasa: ひとり です / ふたり です. 〜さま hanya dipakai pelayan untuk menghormati tamu.'), at: 'ima' }]),
    { title: 'Inspeksi kesehatan', story: [L('tencho', 'ほけんじょ の たちいり けんさ だ。ふだん どおり で いい。', 'hokenjo no tachiiri kensa da. fudan doori de ii.', 'Ada inspeksi dari dinas kesehatan. Seperti biasa saja.')],
      tasks: [
        { ...Q('tencho', 'Petugas bertanya suhu kulkas. Standar umum kulkas…', ['10℃ ke bawah (freezer −15℃ ke bawah)', '20℃', 'Tidak ada aturan'], 'Standar umum: kulkas ≤10℃, freezer ≤−15℃. Suhu dicatat setiap hari di lembar catatan.'), at: 'kitchen' },
        'dishes',
        { ...Q('tencho', 'Petugas melihat kamu memegang uang lalu langsung menyentuh makanan. Yang benar…', ['Cuci tangan setelah memegang uang sebelum menyentuh makanan', 'Tidak masalah', 'Cukup dilap ke celemek'], 'Uang sangat kotor. Cuci tangan setiap berpindah dari kasir ke makanan, atau pisahkan petugas kasir & dapur.'), at: 'reg' }],
      learn: 'Inspeksi 保健所: suhu kulkas ≤10℃, freezer ≤−15℃, catatan suhu, cuci tangan setelah memegang uang.',
      vocab: V(['保健所', 'ほけんじょ', 'hokenjo', 'dinas kesehatan'], ['検査', 'けんさ', 'kensa', 'pemeriksaan'], ['普段通り', 'ふだんどおり', 'fudan doori', 'seperti biasa']),
      next: 'Tamu mabuk & komplain…' },
    { title: 'Tamu mabuk & komplain', story: [N('Seorang tamu mabuk berteriak karena makanannya lama.')],
      tasks: [
        { ...Q('tencho', 'Tamu marah. Kamu…', [['もうしわけ ございません。すぐ かくにん します。', 'moushiwake gozaimasen. sugu kakunin shimasu.'], ['うるさい！', 'urusai!'], ['（にげる）', '(kabur)']], 'Tetap tenang, minta maaf atas ketidaknyamanan, lalu cek ke dapur. Jangan berdebat.'), at: 't2' },
        { ...Q('tencho', 'Tamu mulai kasar dan memegang lenganmu. Kamu…', ['Lepaskan diri dengan tenang & panggil tenchō segera', 'Pukul balik', 'Diam & tahan saja'], 'Keselamatanmu penting. Masalah serius ditangani tenchō, bukan pekerja sendirian. Kekerasan/pelecehan tamu boleh dilaporkan.'), at: 't2' },
        'dishes', 'cash'],
      learn: 'Komplain: minta maaf, cek, laporkan. Tamu kasar/berbahaya: jangan dihadapi sendirian, panggil tenchō.',
      vocab: V(['苦情', 'くじょう', 'kujou', 'komplain'], ['酔っ払い', 'よっぱらい', 'yopparai', 'orang mabuk'], ['呼ぶ', 'よぶ', 'yobu', 'memanggil']),
      next: 'Pekerja baru datang: kamu mengajarinya.' },
    { title: 'Mengajari Nguyen-san', story: [L('nguyen', 'グエン です。せっきゃく は はじめて です。', 'guen desu. sekkyaku wa hajimete desu.', 'Saya Nguyen. Baru pertama kali melayani tamu.', 'happy')],
      tasks: [
        { ...Q('tencho', 'Nguyen-san membawa nampan dengan satu tangan & gelas penuh hampir tumpah. Kamu ajari…', [['トレー は りょうて で、ゆっくり はこんで ください。', 'toree wa ryoute de, yukkuri hakonde kudasai.'], ['はやく はしって！', 'hayaku hashitte!'], ['わたし が ぜんぶ やる。', 'watashi ga zenbu yaru.']], 'Ajarkan dengan contoh: nampan di depan badan, kedua tangan saat penuh, jalan pelan.'), at: 'kitchen' },
        'flow', 'irasshai', 'nama'],
      learn: 'Mengajar: tunjukkan contoh, kalimat 〜て ください, jangan mengambil alih semua pekerjaannya.',
      vocab: V(['トレー', 'トレー', 'toree', 'nampan'], ['ゆっくり', 'ゆっくり', 'yukkuri', 'pelan-pelan'], ['運ぶ', 'はこぶ', 'hakobu', 'membawa']),
      next: 'Ujian keterampilan restoran.' },
    { title: 'Ujian keterampilan', story: [L('tencho', 'もぎ しけん だ。おちついて いこう。', 'mogi shiken da. ochitsuite ikou.', 'Ujian latihan. Tenang saja.')],
      tasks: [
        { ...Q('tencho', 'Soal 1: Bakteri keracunan makanan paling cepat berkembang di suhu…', ['Sekitar 20–50℃ (zona bahaya)', 'Di bawah 0℃', 'Di atas 100℃'], 'Prinsip mencegah keracunan: つけない (jangan tempelkan), ふやさない (jangan biarkan berkembang), やっつける (matikan dengan panas).') },
        { ...Q('tencho', 'Soal 2: Tiga prinsip mencegah keracunan makanan…', ['つけない・ふやさない・やっつける', 'たべる・のむ・ねる', 'はやく・やすく・おおく'], 'Tiga prinsip: jangan menempelkan bakteri, jangan biarkan berkembang, matikan.') },
        { ...Q('tencho', 'Soal 3: Ungkapan sopan untuk "mohon tunggu sebentar"…', [['しょうしょう おまち ください。', 'shoushou omachi kudasai.'], ['ちょっと まって。', 'chotto matte.'], ['まて！', 'mate!']], 'Ke tamu selalu pakai bentuk sopan.') },
        'allergy', 'cash'],
      learn: 'Materi ujian: zona suhu bahaya, 3 prinsip anti keracunan (つけない・ふやさない・やっつける), keigo pelayanan, alergen.',
      vocab: V(['食中毒', 'しょくちゅうどく', 'shokuchuudoku', 'keracunan makanan'], ['増やさない', 'ふやさない', 'fuyasanai', 'tidak memperbanyak'], ['少々', 'しょうしょう', 'shoushou', 'sebentar (sopan)']),
      next: 'Hari terakhir: malam tersibuk.' },
    { title: 'Evaluasi akhir & kelulusan', story: [L('tencho', 'きょう は きんよう の よる。さいご に いちばん いそがしい ぞ！', 'kyou wa kinyou no yoru. saigo ni ichiban isogashii zo!', 'Jumat malam. Hari terakhir yang paling sibuk!')],
      tasks: ['irasshai', 'nanmei', 'nama', 'allergy', 'dishes', 'spill', 'cash', 'thanks'],
      outro: [L('tencho', 'きみ が いて たすかった。また いつでも おいで。', 'kimi ga ite tasukatta. mata itsudemo oide.', 'Kamu sangat membantu. Datanglah lagi kapan saja.', 'happy'),
        Q('tencho', 'Salam perpisahan untuk Pak Ishii…', [['いろいろ おせわ に なりました。', 'iroiro osewa ni narimashita.'], ['じゃあ ね〜。', 'jaa ne.'], ['おつかれ。', 'otsukare.']], 'おせわ に なりました = terima kasih atas bimbingannya.')],
      learn: 'Kamu menyelesaikan 15 hari di izakaya: salam pelayanan, pesanan, kasir, alergi, kebersihan, komplain, dan mengajari pekerja baru.',
      vocab: V(['金曜日', 'きんようび', 'kinyoubi', 'Jumat'], ['助かる', 'たすかる', 'tasukaru', 'terbantu'], ['お世話になりました', 'おせわになりました', 'osewa ni narimashita', 'terima kasih atas bimbingannya']) },
  ];

  /* =========================================================
     🌱 PERTANIAN · 15 hari
     ========================================================= */
  const ICHIGO = { t: 'harvest', title: 'いちご の しゅうかく · Panen stroberi', at: 'ichigo', crop: 'ichigo', mix: ['ripe', 'ripe', 'half', 'green', 'ripe'], why: 'Stroberi sangat lembut: pegang tangkainya, putar & petik, jangan menekan buahnya. Letakkan pelan, jangan ditumpuk tinggi.' };
  DAYS.nogyo = [
    { title: 'Orientasi ladang', story: [
        L('ogawa', 'のうじょうちょう の おがわ だ。よろしく な。', 'noujouchou no ogawa da. yoroshiku na.', 'Aku Ogawa, kepala pertanian. Salam kenal.', 'happy'),
        T('ogawa', 'Di sini kita menanam tomat dan stroberi di rumah kaca (ビニールハウス), dan sayuran di ladang. Pekerjaan mengikuti cuaca dan musim.'),
        L('siti', 'つち は おもい から、こし に ちゅうい ね！', 'tsuchi wa omoi kara, koshi ni chuui ne!', 'Tanah itu berat, jaga pinggangmu ya!', 'happy'),
      ], tasks: ['gear',
        { t: 'act', title: 'Masuk rumah kaca dengan bersih', at: 'tomato', target: '🏠', targetLabel: 'pintu rumah kaca', steps: [
          { tool: ['👢', 'ながぐつ'], jp: 'くつ を しょうどく マット で ふいて。', id: 'injak keset desinfeksi', how: 'swipe', after: '👢 ✓' },
          { tool: ['🧼', 'てあらい'], jp: 'て を あらって。', id: 'cuci tangan', how: 'swipe', after: '🫧' },
          { tool: ['🚪', 'ドア'], jp: 'むし が はいらない よう に、すぐ しめて。', id: 'tutup pintu cepat supaya hama tidak masuk', how: 'tap', after: '🚪 ✓' },
        ], extras: [['🐶', 'いぬ']] },
        'harvest'],
      learn: 'Perkenalan, perlengkapan kerja (topi, sepatu bot, sarung tangan, botol minum), masuk rumah kaca dengan bersih & tutup pintu cepat.',
      vocab: V(['農場長', 'のうじょうちょう', 'noujouchou', 'kepala pertanian'], ['長靴', 'ながぐつ', 'nagagutsu', 'sepatu bot'], ['虫', 'むし', 'mushi', 'serangga'], ['土', 'つち', 'tsuchi', 'tanah']),
      next: 'Panen tomat pertamamu.' },
    { title: 'Panen tomat', story: [L('ogawa', 'あかい トマト だけ、はさみ で きって。', 'akai tomato dake, hasami de kitte.', 'Gunting tomat yang merah saja.')],
      tasks: ['harvest', 'fallen', 'harvest'],
      learn: 'Panen hanya buah matang. Gunting tangkai pendek. Buah jatuh dipisahkan.',
      vocab: V(['収穫', 'しゅうかく', 'shuukaku', 'panen'], ['はさみ', 'はさみ', 'hasami', 'gunting'], ['赤い', 'あかい', 'akai', 'merah'], ['青い (未熟)', 'あおい', 'aoi', 'hijau / mentah']),
      next: 'Nama alat & mencabut gulma.' },
    { title: 'Alat & gulma', story: [L('ogawa', 'どうぐ の なまえ を おぼえて。かま は あぶない ぞ。', 'dougu no namae wo oboete. kama wa abunai zo.', 'Hafalkan nama alat. Sabit itu berbahaya.')],
      tasks: [
        { ...Q('ogawa', '「くわ を もって きて」. Yang kamu bawa…', ['⛏️ Cangkul', '🪣 Ember', '✂️ Gunting'], 'くわ = cangkul. かま = sabit, スコップ = sekop, じょうろ = gembor, いちりんしゃ / ねこ = gerobak satu roda.'), at: 'naya' },
        { t: 'act', title: 'Cabut gulma di bedengan', at: 'field', target: '🌱', targetLabel: 'bedengan sayur', steps: [
          { tool: ['🧤', 'てぶくろ'], jp: 'てぶくろ を して。', id: 'pakai sarung tangan', how: 'tap', after: '🧤' },
          { tool: ['🌿', 'ざっそう'], jp: 'ざっそう だけ ぬいて。なえ は ぬかない！', id: 'cabut gulma (bukan bibit!)', how: 'taps:4', after: '🌿→🗑️' },
          { tool: ['⛏️', 'くわ'], jp: 'つち を ならして。', id: 'ratakan tanah dengan cangkul', how: 'swipe', after: '🟫' },
        ], extras: [['🌱', 'なえ (bibit)'], ['💧', 'みず']], why: 'Bedakan gulma dan bibit (なえ). Kalau ragu, tanya dulu: 「これ は ざっそう ですか？」' },
        'vent'],
      learn: 'Alat: くわ, かま, スコップ, じょうろ, はさみ, いちりんしゃ. Cabut gulma, jangan bibit; kalau ragu tanya.',
      vocab: V(['鍬', 'くわ', 'kuwa', 'cangkul'], ['鎌', 'かま', 'kama', 'sabit'], ['雑草', 'ざっそう', 'zassou', 'gulma'], ['苗', 'なえ', 'nae', 'bibit']),
      next: 'Kesalahan saat panen…' },
    { title: 'Kesalahan pertama', story: [N('Kamu tidak sengaja memetik satu kontainer tomat yang masih oranye-hijau karena terburu-buru.')],
      tasks: [
        { ...Q('ogawa', 'Kamu sadar tomatnya belum matang. Kamu…', [['すみません。まだ あおい トマト を とって しまいました。', 'sumimasen. mada aoi tomato wo totte shimaimashita.'], 'Campurkan diam-diam ke kontainer kirim', 'Buang tanpa bilang'], 'Lapor jujur. Ogawa-san bisa memutuskan: dijual ke pembeli yang mau tomat setengah matang, atau dipakai sendiri. 〜て しまいました = tidak sengaja ~.'), at: 'tomato' },
        'harvest',
        { ...Q('ogawa', 'Ogawa-san menjelaskan: 「へた の まわり まで あかく なったら OK」. Artinya…', ['Panen kalau warna merah sudah sampai sekitar tangkai', 'Panen saat masih hijau', 'Panen kalau buahnya jatuh sendiri'], 'へた = kelopak/tangkai buah. Tanda matang: merah merata sampai dekat へた (tergantung pesanan pembeli).'), at: 'tomato' }],
      learn: '〜て しまいました untuk mengakui kesalahan tak sengaja. Tanda tomat matang: merah sampai dekat へた.',
      vocab: V(['蔕', 'へた', 'heta', 'kelopak tangkai buah'], ['熟す', 'じゅくす', 'jukusu', 'matang'], ['急ぐ', 'いそぐ', 'isogu', 'terburu-buru']),
      next: 'Sortir & kemas, dan slip gaji pertama.' },
    { title: 'Sortir & slip gaji', story: [L('ogawa', 'きょう は せんか を やって もらう。きかく が だいじ だ。', 'kyou wa senka wo yatte morau. kikaku ga daiji da.', 'Hari ini kamu sortir. Standar ukuran itu penting.')],
      tasks: ['harvest', 'sort', 'sort', 'cases'],
      learn: 'Sortir sesuai 規格 (S/M/L) dan pisahkan yang rusak. Jumlah kontainer dicatat untuk pengiriman.',
      vocab: V(['選果', 'せんか', 'senka', 'sortir buah'], ['規格', 'きかく', 'kikaku', 'standar'], ['箱詰め', 'はこづめ', 'hakozume', 'mengemas ke kotak']),
      next: 'Panen stroberi yang sangat lembut.' },
    { title: 'Panen stroberi', story: [L('ogawa', 'いちご は やさしく な。おす と すぐ いたむ。', 'ichigo wa yasashiku na. osu to sugu itamu.', 'Stroberi harus lembut. Kalau ditekan langsung rusak.')],
      tasks: [ICHIGO,
        { t: 'act', title: 'Kemas stroberi ke paket', at: 'senka', target: '📦', targetLabel: 'paket stroberi (パック)', steps: [
          { tool: ['🍓', 'いちご'], jp: 'へた を うえ に して ならべて。', id: 'susun dengan tangkai di atas', how: 'taps:4', after: '🍓🍓🍓🍓' },
          { tool: ['⚖️', 'はかり'], jp: '300グラム に して。', id: 'timbang jadi 300 gram', how: 'hold', after: '⚖️ 300g' },
          { tool: ['🎞️', 'フィルム'], jp: 'フィルム を かけて。', id: 'tutup plastik', how: 'swipe', after: '🎞️ ✓' },
        ], extras: [['🍅', 'トマト']] },
        ICHIGO],
      learn: 'Stroberi: pegang tangkai, jangan ditekan, susun rapi. やさしく = lembut. いたむ = rusak/memar.',
      vocab: V(['苺', 'いちご', 'ichigo', 'stroberi'], ['優しく', 'やさしく', 'yasashiku', 'dengan lembut'], ['傷む', 'いたむ', 'itamu', 'rusak / memar']),
      next: 'Hari terpanas: suhu rumah kaca naik drastis.' },
    { title: 'Hari panas di rumah kaca', story: [N('Pukul 11 suhu luar 34℃. Di dalam rumah kaca bisa lebih dari 40℃!')],
      tasks: ['vent',
        { ...Q('ogawa', 'Rekanmu di rumah kaca berhenti berkeringat dan bicaranya tidak jelas. Kamu…', ['Bawa ke tempat teduh, dinginkan, beri minum jika sadar, lapor & panggil ambulans (119) jika parah', 'Suruh lanjut panen', 'Biarkan istirahat sendiri di rumah kaca'], 'Itu tanda heat stroke berat. Kerja di rumah kaca saat siang terik sebaiknya dihindari; panen di pagi hari.'), at: 'vent' },
        'harvest'],
      learn: 'Rumah kaca panas: buka ventilasi, kerja di pagi hari, minum sering, kenali tanda heat stroke berat.',
      vocab: V(['換気', 'かんき', 'kanki', 'ventilasi'], ['窓', 'まど', 'mado', 'jendela'], ['救急車', 'きゅうきゅうしゃ', 'kyuukyuusha', 'ambulans']),
      next: 'Hari pengiriman besar ke koperasi.' },
    { title: 'Kirim ke koperasi (JA)', story: [L('ogawa', 'きょう は JA に 40ケース しゅっか する。', 'kyou wa jeiee ni yonjukkeesu shukka suru.', 'Hari ini kirim 40 kotak ke koperasi JA.')],
      tasks: ['harvest', 'sort',
        { t: 'act', title: 'Muat kotak ke truk', at: 'truck', target: '🚚', targetLabel: 'bak truk', steps: [
          { tool: ['📦', 'ケース'], jp: 'おもい ケース は した に。', id: 'kotak berat di bawah', how: 'taps:3', after: '📦📦📦' },
          { tool: ['🪢', 'ロープ'], jp: 'にもつ を ロープ で とめて。', id: 'ikat muatan', how: 'swipe', after: '🪢 ✓' },
          { tool: ['📝', 'しゅっか でんぴょう'], jp: 'でんぴょう に かず を かいて。', id: 'tulis jumlah di surat jalan', how: 'hold', after: '📝 40' },
        ], extras: [['🍓', 'いちご (ばら)']] },
        'cases'],
      learn: 'Pengiriman: kotak berat di bawah, ikat muatan, tulis jumlah di 出荷伝票 dengan benar.',
      vocab: V(['出荷', 'しゅっか', 'shukka', 'pengiriman'], ['農協 (JA)', 'のうきょう', 'noukyou', 'koperasi pertanian'], ['伝票', 'でんぴょう', 'denpyou', 'surat jalan']),
      next: 'Hampir masuk area yang baru disemprot pestisida…' },
    { title: 'ヒヤリハット: pestisida', story: [N('Kamu hampir masuk rumah kaca 2 tanpa masker. Ternyata pagi tadi baru disemprot pestisida, dan papan peringatannya terjatuh.')],
      tasks: ['pesticide',
        { ...Q('ogawa', 'Kamu melihat papan 「のうやく さんぷ ちゅう・たちいり きんし」 terjatuh. Kamu…', [['かんばん を たてて、のうじょうちょう に ほうこく します。', 'kanban wo tatete, noujouchou ni houkoku shimasu.'], 'Biarkan saja', 'Masuk sebentar saja'], 'Pasang lagi papannya & laporkan. Orang lain bisa masuk tanpa tahu bahayanya.'), at: 'field' },
        { t: 'act', title: 'Setelah membantu penyemprotan', at: 'naya', target: '🧑‍🌾', targetLabel: 'dirimu', steps: [
          { tool: ['😷', 'マスク'], jp: 'マスク と てぶくろ を はずして すてる。', id: 'lepas masker & sarung tangan sekali pakai', how: 'tap', after: '🗑️' },
          { tool: ['🧼', 'せっけん'], jp: 'て と かお を よく あらって。', id: 'cuci tangan & wajah', how: 'swipe', after: '🫧' },
          { tool: ['👕', 'きがえ'], jp: 'さぎょうぎ を きがえて。', id: 'ganti baju kerja', how: 'hold', after: '👕 ✓' },
          { tool: ['📝', 'きろく'], jp: 'さんぷ の きろく を かく。', id: 'catat penyemprotan', how: 'tap', after: '📝 ✓' },
        ], extras: [['🍙', 'おにぎり (たべる)']], why: 'Jangan makan/minum/merokok sebelum cuci tangan setelah memegang pestisida. Catatan penyemprotan wajib (jenis, tanggal, jumlah) untuk keamanan pangan.' }],
      learn: 'Pestisida: patuhi papan larangan masuk, APD, cuci tangan & ganti baju setelahnya, catat penyemprotan.',
      vocab: V(['農薬', 'のうやく', 'nouyaku', 'pestisida'], ['散布', 'さんぷ', 'sanpu', 'penyemprotan'], ['着替え', 'きがえ', 'kigae', 'ganti baju']),
      next: 'Hari libur di asrama desa.' },
    offDay('nogyo', [{ ...Q('siti', 'Ada festival desa (むら の まつり) dan tetangga mengajakmu ikut. Kamu jawab…', [['ありがとう ございます。ぜひ いきたい です。', 'arigatou gozaimasu. zehi ikitai desu.'], ['いや。', 'iya.'], ['（むし する）', '(abaikan)']], 'Hubungan dengan warga desa penting saat tinggal di daerah pertanian. ぜひ = dengan senang hati.'), at: 'genkan' }]),
    { title: 'Pembeli berkunjung', story: [N('Pembeli dari supermarket datang melihat rumah kaca.'), L('ogawa', 'おきゃくさま だ。ていねい に あいさつ して な。', 'okyakusama da. teinei ni aisatsu shite na.', 'Itu pembeli. Beri salam dengan sopan, ya.')],
      tasks: [
        { ...Q('ogawa', 'Pembeli bertanya 「この トマト は いつ とりましたか？」', [['けさ しゅうかく しました。', 'kesa shuukaku shimashita.'], ['しらない。', 'shiranai.'], ['いつか です。', 'itsuka desu.']], 'けさ = pagi ini. Jawab dengan fakta yang kamu tahu; kalau tidak tahu, tanya Ogawa-san.'), at: 'tomato' },
        'harvest', 'sort'],
      learn: 'Berbicara dengan pembeli: keigo, fakta (kapan panen), kalau tidak tahu tanya atasan.',
      vocab: V(['今朝', 'けさ', 'kesa', 'pagi ini'], ['挨拶', 'あいさつ', 'aisatsu', 'salam'], ['お客様', 'おきゃくさま', 'okyakusama', 'pembeli/tamu']),
      next: 'Hama & penyakit ditemukan di daun…' },
    { title: 'Hama & penyakit tanaman', story: [N('Kamu menemukan daun tomat berbintik coklat dan banyak kutu putih kecil.')],
      tasks: [
        { ...SP('Periksa daun: sehat atau perlu dilaporkan?', 'げんき', 'ほうこく', [['🍃', 'Daun hijau segar', true], ['🍃', 'Daun hijau, ada embun pagi', true], ['🍂', 'Daun berbintik coklat', false, 'Kemungkinan penyakit (びょうき)', '🟤'], ['🍃', 'Banyak serangga putih kecil di balik daun', false, 'Hama kutu kebul (コナジラミ)', '🐛'], ['🍃', 'Daun menggulung & menguning', false, 'Gejala virus / penyakit', '🟡']], { count: 8 }), at: 'tomato' },
        { ...Q('ogawa', 'Kamu menemukan tanaman berpenyakit. Kamu…', [['のうじょうちょう、この は が びょうき みたい です。', 'noujouchou, kono ha ga byouki mitai desu.'], 'Cabut sendiri semua tanaman', 'Semprot pestisida apa saja'], 'Lapor dan tunjukkan. Ogawa-san yang memutuskan penanganan (memotong daun, memisahkan, pestisida yang tepat). Cuci tangan & alat supaya penyakit tidak menyebar.'), at: 'tomato' },
        'harvest'],
      learn: 'Kenali tanda hama & penyakit, laporkan dengan menunjukkan bagian tanamannya, jangan bertindak sendiri.',
      vocab: V(['害虫', 'がいちゅう', 'gaichuu', 'hama'], ['病気', 'びょうき', 'byouki', 'penyakit'], ['葉', 'は', 'ha', 'daun']),
      next: 'Pekerja baru datang: kamu mengajarinya.' },
    { title: 'Mengajari Nguyen-san', story: [L('nguyen', 'グエン です。のうぎょう は はじめて です。', 'guen desu. nougyou wa hajimete desu.', 'Saya Nguyen. Baru pertama kali bertani.', 'happy')],
      tasks: [
        { ...Q('ogawa', 'Nguyen-san memetik tomat oranye. Kamu ajari…', [['あかい の だけ とって ください。オレンジ は あした です。', 'akai no dake totte kudasai. orenji wa ashita desu.'], ['ぜんぶ とって！', 'zenbu totte!'], ['（だまって みる）', '(diam saja)']], 'Ajarkan dengan aturan sederhana & contoh nyata di tanaman.'), at: 'tomato' },
        'harvest', 'sort'],
      learn: 'Mengajar panen: aturan sederhana (merah saja), tunjukkan contoh, biarkan mencoba.',
      vocab: V(['今日中', 'きょうじゅう', 'kyoujuu', 'hari ini juga'], ['明日', 'あした', 'ashita', 'besok'], ['だけ', 'だけ', 'dake', 'hanya']),
      next: 'Ujian keterampilan pertanian.' },
    { title: 'Ujian keterampilan', story: [L('ogawa', 'もぎ しけん だ。いつも の しごと を おもいだせ。', 'mogi shiken da. itsumo no shigoto wo omoidase.', 'Ujian latihan. Ingat pekerjaanmu sehari-hari.')],
      tasks: [
        { ...Q('ogawa', 'Soal 1: Tujuan memakai rumah kaca (ビニールハウス)…', ['Mengatur suhu & melindungi tanaman dari hujan/angin/hama', 'Tempat tidur pekerja', 'Gudang pestisida'], 'Rumah kaca memungkinkan panen di luar musim dan melindungi tanaman.') },
        { ...Q('ogawa', 'Soal 2: Sebelum panen, pestisida yang dipakai harus mengikuti…', ['Batas hari sebelum panen (収穫前日数) di label', 'Selera pekerja', 'Tidak ada aturan'], 'Setiap pestisida punya aturan jumlah pemakaian dan berapa hari sebelum panen boleh dipakai.') },
        { ...Q('ogawa', 'Soal 3: 「ひりょう」 artinya…', ['Pupuk', 'Pestisida', 'Air'], 'ひりょう (肥料) = pupuk. のうやく = pestisida, みず = air.') },
        'harvest', 'vent'],
      learn: 'Materi ujian: fungsi rumah kaca, aturan pestisida (batas hari sebelum panen), pupuk, alat & kosakata.',
      vocab: V(['肥料', 'ひりょう', 'hiryou', 'pupuk'], ['収穫前日数', 'しゅうかくまえにっすう', 'shuukaku mae nissuu', 'batas hari sebelum panen'], ['温室', 'おんしつ', 'onshitsu', 'rumah kaca']),
      next: 'Hari terakhir: panen besar!' },
    { title: 'Evaluasi akhir & kelulusan', story: [L('ogawa', 'さいご の ひ は だいしゅうかく だ！', 'saigo no hi wa daishuukaku da!', 'Hari terakhir adalah panen besar!')],
      tasks: ['gear', 'harvest', ICHIGO, 'sort', 'vent', 'cases'],
      outro: [L('ogawa', 'いい て を してる。また はたけ に こい よ。', 'ii te wo shiteru. mata hatake ni koi yo.', 'Tanganmu terampil. Datang lagi ke ladang, ya.', 'happy'),
        Q('ogawa', 'Salam perpisahan untuk Ogawa-san…', [['いろいろ おせわ に なりました。', 'iroiro osewa ni narimashita.'], ['バイバイ。', 'baibai.'], ['つかれた。', 'tsukareta.']], 'おせわ に なりました = terima kasih atas bimbingannya.')],
      learn: 'Kamu menyelesaikan 15 hari di pertanian: panen, sortir, suhu rumah kaca, pestisida, hama, pengiriman, dan mengajari pekerja baru.',
      vocab: V(['大収穫', 'だいしゅうかく', 'daishuukaku', 'panen besar'], ['畑', 'はたけ', 'hatake', 'ladang'], ['お世話になりました', 'おせわになりました', 'osewa ni narimashita', 'terima kasih atas bimbingannya']) },
  ];

  /* =========================================================
     🐄 PETERNAKAN · 15 hari
     ========================================================= */
  DAYS.chikusan = [
    { title: 'Orientasi peternakan', story: [
        L('hayashi', 'ぼくじょうちょう の はやし です。どうぶつ は いきもの。だいじ に ね。', 'bokujouchou no hayashi desu. doubutsu wa ikimono. daiji ni ne.', 'Saya Hayashi, kepala peternakan. Hewan itu makhluk hidup. Jaga baik-baik, ya.', 'happy'),
        T('siti', 'Bau kandang nanti terbiasa kok. Yang penting desinfeksi, jangan pernah dilewati!'),
      ], tasks: ['shodoku', 'approach', 'exitdis'],
      learn: 'Biosekuriti: ganti sepatu bot, celup di bak desinfeksi, cuci tangan, baju kandang. Dekati sapi dari depan/samping.',
      vocab: V(['牧場長', 'ぼくじょうちょう', 'bokujouchou', 'kepala peternakan'], ['消毒槽', 'しょうどくそう', 'shoudokusou', 'bak desinfeksi'], ['生き物', 'いきもの', 'ikimono', 'makhluk hidup']),
      next: 'Memberi pakan sapi: takarannya berbeda-beda.' },
    { title: 'Memberi pakan', story: [L('hayashi', 'うし に よって えさ の りょう が ちがう の。', 'ushi ni yotte esa no ryou ga chigau no.', 'Jumlah pakan berbeda tiap sapi.')],
      tasks: ['shodoku', 'scale',
        { ...Q('hayashi', 'Sapi ハナ sedang hamil tua (にんしん). Pakannya ditentukan oleh…', ['Bu Hayashi / dokter hewan sesuai kondisi', 'Kamu sendiri, kira-kira saja', 'Diberi sebanyak mungkin'], 'Takaran pakan khusus (hamil, menyusui, sakit) ditentukan atasan/dokter hewan dan tertulis di papan pakan.'), at: 'feed' },
        'scale'],
      learn: 'Pakan ditimbang sesuai papan takaran tiap sapi. Angka: はち キロ, ろく てん ご キロ.',
      vocab: V(['餌', 'えさ', 'esa', 'pakan'], ['量', 'りょう', 'ryou', 'jumlah'], ['妊娠', 'にんしん', 'ninshin', 'hamil']),
      next: 'Nama alat & membersihkan kandang.' },
    { title: 'Alat & bersihkan kandang', story: [L('hayashi', 'きょう は じょふん。ぎゅうしゃ を きれい に ね。', 'kyou wa jofun. gyuusha wo kirei ni ne.', 'Hari ini membersihkan kotoran. Buat kandang bersih, ya.')],
      tasks: ['shodoku',
        { ...Q('hayashi', '「ほしくさ を はこんで」. Yang kamu bawa…', ['🌾 Jerami kering', '🥛 Susu', '🧴 Desinfektan'], 'ほしくさ = jerami kering (pakan). Alat: スコップ, フォーク (garpu jerami), いちりんしゃ, ミルカー, ブラシ.'), at: 'feed' },
        { t: 'act', title: 'じょふん · Bersihkan kandang sapi', at: 'barn', target: '🐄', targetLabel: 'lantai kandang', steps: [
          { tool: ['🗣️', 'こえかけ'], jp: 'うし に こえ を かけて から はいる。', id: 'beri suara ke sapi sebelum masuk', how: 'tap', after: '🐄 👀' },
          { tool: ['🧹', 'スクレーパー'], jp: 'ふん を あつめて。', id: 'kumpulkan kotoran', how: 'swipe', after: '💩→' },
          { tool: ['🛒', 'いちりんしゃ'], jp: 'たいひば へ はこんで。', id: 'angkut ke tempat kompos', how: 'hold', after: '🛒 →' },
          { tool: ['🌾', 'しきわら'], jp: 'あたらしい わら を しいて。', id: 'tebar alas jerami baru', how: 'swipe', after: '🌾 ✓' },
        ], extras: [['🥛', 'ミルカー']], why: 'Kandang bersih mencegah penyakit kuku & mastitis. Kotoran diolah jadi kompos (たいひ) untuk ladang.' }],
      learn: 'Alat kandang: スコップ, フォーク, いちりんしゃ, ブラシ, ミルカー. Kotoran → kompos (たいひ).',
      vocab: V(['干し草', 'ほしくさ', 'hoshikusa', 'jerami kering'], ['除ふん', 'じょふん', 'jofun', 'membersihkan kotoran'], ['堆肥', 'たいひ', 'taihi', 'kompos']),
      next: 'Hari yang menegangkan di kandang…' },
    { title: 'Kesalahan pertama', story: [N('Kamu berdiri tepat di belakang sapi クロ untuk mengambil ember. Sapi itu menendang. Tidak kena, tapi hampir.')],
      tasks: [
        { ...Q('hayashi', 'Kamu melapor ke Bu Hayashi…', [['すみません。うし の うしろ に たって、けられそう に なりました。', 'sumimasen. ushi no ushiro ni tatte, keraresou ni narimashita.'], 'Tidak usah lapor', 'Pukul sapinya'], 'Lapor supaya bisa dibahas: sapi クロ mudah kaget? Perlu tanda peringatan? Jangan pernah memukul hewan.'), at: 'barn' },
        'approach', 'scale'],
      learn: 'Jangan berdiri tepat di belakang sapi. Beri suara sebelum mendekat. Jangan pernah memukul hewan (動物福祉).',
      vocab: V(['後ろ', 'うしろ', 'ushiro', 'belakang'], ['蹴る', 'ける', 'keru', 'menendang'], ['動物福祉', 'どうぶつふくし', 'doubutsu fukushi', 'kesejahteraan hewan']),
      next: 'Mengambil telur & slip gaji pertama.' },
    { title: 'Ambil telur & slip gaji', story: [L('hayashi', 'けいしゃ で しゅうらん を して もらう よ。', 'keisha de shuuran wo shite morau yo.', 'Kamu akan mengambil telur di kandang ayam.')],
      tasks: ['shodoku',
        { t: 'act', title: 'しゅうらん · Ambil telur dari sarang', at: 'coop', target: '🐔', targetLabel: 'sarang ayam', steps: [
          { tool: ['🧺', 'たまご トレー'], jp: 'トレー を もって。', id: 'bawa nampan telur', how: 'tap', after: '🧺' },
          { tool: ['🥚', 'たまご'], jp: 'たまご を やさしく とって。', id: 'ambil telur pelan-pelan', how: 'taps:5', after: '🥚×5' },
          { tool: ['👀', 'かくにん'], jp: 'しんだ とり が いない か みて。', id: 'cek apakah ada ayam mati', how: 'hold', after: '👀 OK' },
        ], extras: [['🔨', 'ハンマー']] },
        'eggs', 'eggsort'],
      learn: 'Ambil telur pelan, pisahkan yang retak/kotor, sortir berat (MS/M/L), dan cek kondisi ayam.',
      vocab: V(['集卵', 'しゅうらん', 'shuuran', 'mengambil telur'], ['鶏舎', 'けいしゃ', 'keisha', 'kandang ayam'], ['ひび', 'ひび', 'hibi', 'retak']),
      next: 'Belajar memerah susu.' },
    { title: 'Memerah susu', story: [L('hayashi', 'さくにゅう は じゅんばん が だいじ。ちちぶさ を きれい に ね。', 'sakunyuu wa junban ga daiji. chichibusa wo kirei ni ne.', 'Saat memerah, urutan itu penting. Ambing harus bersih.')],
      tasks: ['shodoku',
        { t: 'act', title: 'さくにゅう · Memerah susu sapi ハナ', at: 'parlor', target: '🐄', targetLabel: 'ambing sapi ハナ', steps: [
          { tool: ['🧻', 'タオル'], jp: 'ちくび を ふいて。', id: 'lap puting sampai bersih', how: 'swipe', after: '✨' },
          { tool: ['🥛', 'まえしぼり'], jp: 'まえしぼり、さんかい。', id: 'perah awal 3 pancaran (cek gumpalan)', how: 'taps:3', after: '🥛 OK' },
          { tool: ['🔧', 'ミルカー'], jp: 'ミルカー を つけて。', id: 'pasang mesin perah', how: 'hold', after: '🔧 ぶーん' },
          { tool: ['✋', 'はずす'], jp: 'おわったら はずして。', id: 'lepas setelah selesai', how: 'tap', after: '✋' },
          { tool: ['🧴', 'ディッピング'], jp: 'ディッピング して。', id: 'celup puting antiseptik', how: 'taps:4', after: '🧴×4' },
        ], extras: [['🪣', 'バケツ (みず)'], ['🧹', 'ほうき']], why: 'Urutan kebersihan memerah mencegah 乳房炎 (mastitis) dan menjaga kualitas susu.' },
        'clots'],
      learn: 'Memerah: lap → perah awal (cek gumpalan) → pasang ミルカー → lepas → celup antiseptik.',
      vocab: V(['搾乳', 'さくにゅう', 'sakunyuu', 'memerah susu'], ['乳房', 'ちちぶさ / にゅうぼう', 'nyuubou', 'ambing'], ['前搾り', 'まえしぼり', 'maeshibori', 'perah awal']),
      next: 'Musim panas: sapi kepanasan.' },
    { title: 'Musim panas: heat stress', story: [N('Suhu 33℃. Sapi perah sangat tidak tahan panas: nafsu makan & produksi susu turun.')],
      tasks: [
        { t: 'act', title: 'Lindungi sapi dari panas', at: 'barn', target: '🥵', targetLabel: 'sapi kepanasan', steps: [
          { tool: ['🌀', 'ファン'], jp: 'ファン を つけて。', id: 'nyalakan kipas besar', how: 'tap', after: '🌀 ON' },
          { tool: ['💦', 'ミスト'], jp: 'ミスト を だして。', id: 'semprot kabut air', how: 'hold', after: '💦' },
          { tool: ['💧', 'みずのみば'], jp: 'みずのみば を チェック。', id: 'cek tempat minum penuh & bersih', how: 'taps:2', after: '💧 ✓' },
        ], extras: [['🔥', 'ヒーター']] },
        { ...Q('hayashi', 'Tanda sapi kepanasan…', ['Napas cepat dengan mulut terbuka, banyak berdiri, kurang makan', 'Tidur nyenyak', 'Makan lebih banyak'], 'Heat stress: napas terengah, liur banyak, nafsu makan turun. Laporkan sapi yang terlihat sangat lemah.'), at: 'barn' },
        'scale'],
      learn: 'Heat stress sapi: kipas, kabut air, air minum cukup & bersih, laporkan sapi yang lemah.',
      vocab: V(['暑熱', 'しょねつ', 'shonetsu', 'panas (heat stress)'], ['水飲み場', 'みずのみば', 'mizunomiba', 'tempat minum'], ['扇風機/ファン', 'ファン', 'fan', 'kipas']),
      next: 'Anak sapi lahir!' },
    { title: 'Anak sapi lahir', story: [N('Pagi ini sapi モモ melahirkan anak sapi betina!'), L('hayashi', 'しょにゅう を はやく のませて あげて。', 'shonyuu wo hayaku nomasete agete.', 'Segera beri kolostrum (susu pertama).', 'happy')],
      tasks: [
        { t: 'act', title: 'Merawat anak sapi baru lahir', at: 'barn', target: '🐮', targetLabel: 'anak sapi (こうし)', steps: [
          { tool: ['🧺', 'タオル'], jp: 'からだ を ふいて あたためて。', id: 'keringkan & hangatkan badan', how: 'swipe', after: '🐮 ✨' },
          { tool: ['🍼', 'しょにゅう'], jp: 'しょにゅう を のませて。', id: 'beri kolostrum', how: 'hold', after: '🍼 ごくごく' },
          { tool: ['📝', 'きろく'], jp: 'うまれた じかん と たいじゅう を きろく。', id: 'catat jam lahir & berat', how: 'tap', after: '📝 6:20 / 40kg' },
        ], extras: [['🌾', 'ほしくさ']], why: 'Kolostrum (初乳) berisi antibodi dan harus diminum dalam beberapa jam pertama setelah lahir.' },
        'milking', 'eggs'],
      learn: 'Anak sapi baru lahir: keringkan & hangatkan, kolostrum (初乳) secepatnya, catat jam lahir & berat.',
      vocab: V(['子牛', 'こうし', 'koushi', 'anak sapi'], ['初乳', 'しょにゅう', 'shonyuu', 'kolostrum'], ['体重', 'たいじゅう', 'taijuu', 'berat badan']),
      next: 'Pintu kandang ayam tidak terkunci…' },
    { title: 'ヒヤリハット: pintu kandang', story: [N('Pagi ini pintu kandang ayam ternyata tidak terkunci semalaman. Untung tidak ada hewan liar yang masuk.')],
      tasks: [
        { ...Q('hayashi', 'Kenapa pintu kandang ayam harus selalu tertutup rapat?', ['Mencegah hewan liar & burung liar membawa penyakit (flu burung) dan memangsa ayam', 'Supaya ayam tidak kedinginan saja', 'Tidak penting'], 'Burung liar, tikus, dan musang bisa membawa penyakit seperti flu burung. Ini bagian dari biosekuriti.'), at: 'coop' },
        { t: 'act', title: 'Cek keamanan kandang sebelum pulang', at: 'coop', target: '🐔', targetLabel: 'kandang ayam', steps: [
          { tool: ['🔒', 'かぎ'], jp: 'ドア の かぎ を しめて。', id: 'kunci pintu', how: 'tap', after: '🔒' },
          { tool: ['🕸️', 'ネット'], jp: 'ネット に あな が ない か みて。', id: 'cek jaring tidak berlubang', how: 'hold', after: '🕸️ OK' },
          { tool: ['✅', 'チェックひょう'], jp: 'チェックひょう に サイン。', id: 'tanda tangan daftar periksa', how: 'tap', after: '✅' },
        ], extras: [['🍞', 'パン']] },
        'exitdis'],
      learn: 'Biosekuriti kandang ayam: pintu terkunci, jaring utuh, daftar periksa. Laporkan ヒヤリハット.',
      vocab: V(['鍵', 'かぎ', 'kagi', 'kunci'], ['野鳥', 'やちょう', 'yachou', 'burung liar'], ['点検表', 'てんけんひょう', 'tenkenhyou', 'daftar periksa']),
      next: 'Hari libur di asrama.' },
    offDay('chikusan'),
    { title: 'Pemeriksaan dokter hewan', story: [N('Dokter hewan (じゅうい) datang untuk pemeriksaan rutin.')],
      tasks: [
        { ...Q('hayashi', 'Dokter hewan bertanya 「この うし、さいきん しょくよく は どう？」. Kamu tahu sapi ユキ makan sedikit sejak kemarin. Kamu jawab…', [['きのう から あまり たべて いません。', 'kinou kara amari tabete imasen.'], ['げんき です。', 'genki desu.'], ['しりません。', 'shirimasen.']], 'Sampaikan perubahan yang kamu amati dengan jelas: sejak kapan + apa yang berubah. Informasi dari pekerja harian sangat berharga bagi dokter hewan.'), at: 'barn' },
        'health',
        { t: 'act', title: 'Bantu dokter hewan memeriksa', at: 'barn', target: '🐄', targetLabel: 'sapi ユキ', steps: [
          { tool: ['🪢', 'ロープ'], jp: 'あたま を しっかり おさえて。', id: 'pegang kepala sapi dengan tali', how: 'hold', after: '🪢' },
          { tool: ['🌡️', 'たいおんけい'], jp: 'たいおん を はかります。', id: 'ukur suhu (normal ±38,5℃)', how: 'tap', after: '39.6℃ ⚠' },
          { tool: ['📝', 'カルテ'], jp: 'カルテ に かいて。', id: 'catat di kartu kesehatan', how: 'tap', after: '📝 ✓' },
        ], extras: [['🍎', 'りんご']] }],
      learn: 'Laporkan perubahan hewan: sejak kapan + apa. Suhu normal sapi ±38,5℃. Catat di カルテ.',
      vocab: V(['獣医', 'じゅうい', 'juui', 'dokter hewan'], ['食欲', 'しょくよく', 'shokuyoku', 'nafsu makan'], ['カルテ', 'カルテ', 'karute', 'kartu catatan kesehatan']),
      next: 'Banyak ayam mati mendadak…' },
    { title: 'Ayam mati mendadak', story: [N('Pagi ini kamu menemukan 8 ayam mati di satu bagian kandang, padahal kemarin sehat.')],
      tasks: [
        { ...Q('hayashi', 'Apa yang PERTAMA kamu lakukan?', [['さわらずに、すぐ ぼくじょうちょう に れんらく します。', 'sawarazu ni, sugu bokujouchou ni renraku shimasu.'], 'Buang bangkainya sendiri ke tempat sampah', 'Tunggu sampai sore'], 'Kematian mendadak dalam jumlah banyak bisa tanda flu burung (鳥インフルエンザ). Di Jepang peternak wajib segera melapor ke dinas peternakan (家畜保健衛生所). Jangan disentuh atau dipindahkan.'), at: 'coop' },
        { t: 'act', title: 'Cegah penyebaran penyakit', at: 'gate', target: '🚫', targetLabel: 'gerbang peternakan', steps: [
          { tool: ['🚪', 'ゲート'], jp: 'ひと と くるま の でいり を とめて。', id: 'hentikan keluar-masuk orang & kendaraan', how: 'tap', after: '🚫' },
          { tool: ['🧴', 'しょうどく'], jp: 'くつ と て を しょうどく。', id: 'desinfeksi sepatu & tangan', how: 'swipe', after: '✨' },
          { tool: ['👕', 'きがえ'], jp: 'ふく を きがえて、ほか の けいしゃ に いかない。', id: 'ganti baju, jangan masuk kandang lain', how: 'hold', after: '👕 ✓' },
        ], extras: [['🐔', 'とり を はこぶ']] },
        'exitdis'],
      learn: 'Kematian unggas mendadak: jangan sentuh, lapor segera, hentikan lalu lintas, desinfeksi, jangan berpindah kandang.',
      vocab: V(['鳥インフルエンザ', 'とりインフルエンザ', 'tori infuruenza', 'flu burung'], ['連絡', 'れんらく', 'renraku', 'menghubungi'], ['出入り', 'でいり', 'deiri', 'keluar-masuk']),
      next: 'Pekerja baru datang: kamu mengajarinya.' },
    { title: 'Mengajari Nguyen-san', story: [L('nguyen', 'グエン です。うし は ちょっと こわい です…', 'guen desu. ushi wa chotto kowai desu…', 'Saya Nguyen. Sapi agak menakutkan…', 'happy')],
      tasks: [
        { ...Q('hayashi', 'Nguyen-san masuk kandang tanpa melewati bak desinfeksi. Kamu bilang…', [['まって ください。さきに しょうどくそう に はいって ください。', 'matte kudasai. saki ni shoudokusou ni haitte kudasai.'], ['まあ いい よ。', 'maa ii yo.'], ['（だまって みる）', '(diam saja)']], 'Biosekuriti tidak boleh dilewati, sekalipun sekali. Jelaskan alasannya (penyakit).'), at: 'gate' },
        { ...Q('hayashi', 'Nguyen-san takut mendekati sapi. Kamu…', [['だいじょうぶ。まえ から、こえ を かけて、ゆっくり。', 'daijoubu. mae kara, koe wo kakete, yukkuri.'], ['はやく いけ！', 'hayaku ike!'], ['わたし が ぜんぶ やる。', 'watashi ga zenbu yaru.']], 'Tenangkan, beri cara yang jelas, dan temani di awal.'), at: 'barn' },
        'shodoku', 'scale'],
      learn: 'Mengajar: biosekuriti tanpa kompromi, cara mendekati sapi, menenangkan pekerja baru.',
      vocab: V(['怖い', 'こわい', 'kowai', 'takut'], ['先に', 'さきに', 'saki ni', 'terlebih dahulu'], ['ゆっくり', 'ゆっくり', 'yukkuri', 'pelan-pelan']),
      next: 'Ujian keterampilan peternakan.' },
    { title: 'Ujian keterampilan', story: [L('hayashi', 'もぎ しけん よ。おちついて。', 'mogi shiken yo. ochitsuite.', 'Ujian latihan. Tenang, ya.')],
      tasks: [
        { ...Q('hayashi', 'Soal 1: Suhu badan normal sapi dewasa sekitar…', ['38–39℃', '35℃', '42℃'], 'Sapi dewasa normal ±38,5℃. Di atas ±39,5℃ dicurigai demam.') },
        { ...Q('hayashi', 'Soal 2: 「乳房炎」 adalah…', ['Radang ambing (mastitis)', 'Penyakit kuku', 'Flu burung'], 'Tanda mastitis: gumpalan di susu, ambing panas/bengkak. Susunya tidak boleh dicampur ke tangki.') },
        { ...Q('hayashi', 'Soal 3: Tujuan bak desinfeksi di pintu kandang…', ['Mencegah penyakit masuk & keluar peternakan', 'Membersihkan sepatu dari lumpur saja', 'Hiasan'], 'Desinfeksi adalah dasar biosekuriti (飼養衛生管理基準).') },
        'milking', 'eggsort'],
      learn: 'Materi ujian: suhu normal sapi, mastitis, biosekuriti, memerah, telur.',
      vocab: V(['飼養衛生管理基準', 'しようえいせいかんりきじゅん', 'shiyou eisei kanri kijun', 'standar kebersihan peternakan'], ['平熱', 'へいねつ', 'heinetsu', 'suhu normal'], ['腫れ', 'はれ', 'hare', 'bengkak']),
      next: 'Hari terakhir di peternakan.' },
    { title: 'Evaluasi akhir & kelulusan', story: [L('hayashi', 'さいご の ひ ね。どうぶつ たち に も あいさつ して。', 'saigo no hi ne. doubutsu-tachi ni mo aisatsu shite.', 'Hari terakhir, ya. Pamitlah juga ke hewan-hewan.')],
      tasks: ['shodoku', 'milking', 'scale', 'eggs', 'eggsort', 'health', 'exitdis'],
      outro: [L('hayashi', 'うし たち も さびしがる わ。ほんとう に ありがとう。', 'ushi-tachi mo sabishigaru wa. hontou ni arigatou.', 'Sapi-sapi juga akan merindukanmu. Terima kasih banyak.', 'happy'),
        Q('hayashi', 'Salam perpisahan untuk Bu Hayashi…', [['いろいろ おせわ に なりました。', 'iroiro osewa ni narimashita.'], ['じゃあ ね。', 'jaa ne.'], ['くさかった。', 'kusakatta.']], 'おせわ に なりました = terima kasih atas bimbingannya.')],
      learn: 'Kamu menyelesaikan 15 hari di peternakan: biosekuriti, pakan, memerah, telur, kesehatan hewan, darurat penyakit, dan mengajari pekerja baru.',
      vocab: V(['寂しい', 'さびしい', 'sabishii', 'kesepian / rindu'], ['動物', 'どうぶつ', 'doubutsu', 'hewan'], ['お世話になりました', 'おせわになりました', 'osewa ni narimashita', 'terima kasih atas bimbingannya']) },
  ];

  /* ---------- daftarkan ---------- */
  Object.assign(Kerja.DAYS, DAYS);
  Kerja.setDayBuilder(build);
  Kerja._build = build;
})();
