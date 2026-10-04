/* =========================================================
   SIMULASI KERJA: PERTANIAN & PETERNAKAN (農業)
   Bidang Tokutei Ginou 「農業」 punya dua jalur: 耕種 (tanaman) dan
   畜産 (ternak). Di sini:
   - 🌱 のうじょう : rumah kaca tomat & stroberi (panen, sortir, suhu,
     gulma, pestisida, pengiriman ke koperasi)
   - 🐄 ぼくじょう : sapi perah & ayam (desinfeksi, pakan, memerah,
     ambil telur, kesehatan hewan, kebersihan kandang)
   Tugas fisik baru: harvest (panen), scale (timbang pakan), sort (sortir).
   ========================================================= */
(() => {
  const K = Kerja.kit, esc = K.esc, shuffle = K.shuffle, sleep = K.sleep, speak = K.speak, ro = K.ro;
  const S = () => Save.d;

  /* ---------- tokoh ---------- */
  Object.assign(CHARACTERS, {
    ogawa:   { name: 'Pak Ogawa (Nōjōchō)',   color: '#5a9a3a' },
    hayashi: { name: 'Bu Hayashi (Bokujōchō)', color: '#8a5a36' },
  });
  Object.assign(Pix.PAL, {
    ogawa:   { h: '#3a3030', H: '#1f1a1a', e: '#2a2a3a', E: '#5a4a3a', I: '#9a8a7a', o: '#5a9a3a', O: '#3f7a28', a: '#e9d29a', A: '#c9a96a', p: '#4a3f35', b: '#2a2a2a', c: '#f7f3ea' },
    hayashi: { h: '#5a3a28', H: '#3a2418', e: '#2a2238', E: '#6b4430', I: '#b08060', o: '#3f6fb0', O: '#2a4f86', a: '#f4ecdc', A: '#d3c7b3', p: '#2a4f86', b: '#2a2a2a', c: '#f7f3ea' },
  });
  Object.assign(Pix.STYLE, {
    ogawa:   { hair: 'short', old: true, uniform: 'tee', cap: true },
    hayashi: { hair: 'bun', uniform: 'apron', headband: true },
  });

  /* ---------- tugas fisik baru ---------- */
  const COL = { ripe: '#e0473a', half: '#f29b38', green: '#7cbf4a' };
  // 🍅 Panen: ketuk hanya buah yang matang sebelum waktu habis
  function taskHarvest(W, st) {
    const crop = st.crop || 'tomato', relax = !!S().settings.relax, limit = relax ? 1e9 : (st.limit || 30000);
    W.box.innerHTML = `<div class="ws-q">${esc(st.title)}</div><p class="muted small">${crop === 'ichigo' ? 'Petik stroberi yang <b>merah penuh</b> saja. Pegang tangkainya, jangan ditekan.' : 'Gunting (はさみ) tomat yang <b>merah</b> saja. Yang oranye & hijau dibiarkan matang dulu.'}</p>
      <div class="arb-timer"><i></i></div><div class="kj-timer">🧺 <b class="ok">0</b> · ❌ <b class="ng">0</b></div><p class="kj-msg small"></p>`;
    const P = K.pad(W, 320, 150, 'farm'); W.box.insertBefore(P.c, W.box.querySelector('.kj-timer'));
    const fruits = [], states = st.mix || ['ripe', 'ripe', 'ripe', 'half', 'green', 'green'];
    for (let v = 0; v < 5; v++) for (let k = 0; k < 5; k++) fruits.push({ x: 34 + v * 63 + (k % 2 ? 14 : -10), y: 24 + k * 25, s: states[(v * 5 + k * 3 + Math.floor(Math.random() * 6)) % states.length], on: true });
    if (!fruits.some(f => f.s === 'ripe')) fruits[0].s = 'ripe';
    const ripeN = fruits.filter(f => f.s === 'ripe').length;
    P.c.dataset.fruits = JSON.stringify(fruits.map(f => [f.x, f.y, f.s === 'ripe' ? 1 : 0]));
    const okEl = W.box.querySelector('.ok'), ngEl = W.box.querySelector('.ng'), msg = W.box.querySelector('.kj-msg'), bar = W.box.querySelector('.arb-timer i');
    const draw = () => {
      const c = P.ctx; c.clearRect(0, 0, 320, 150);
      for (let v = 0; v < 5; v++) { const x = 34 + v * 63; c.strokeStyle = '#4f8a2e'; c.lineWidth = 4; c.beginPath(); c.moveTo(x, 4); c.lineTo(x, 146); c.stroke(); c.fillStyle = '#6fb04a'; for (let k = 0; k < 6; k++) { c.beginPath(); c.ellipse(x + (k % 2 ? 9 : -9), 14 + k * 24, 8, 4, k % 2 ? .5 : -.5, 0, 7); c.fill(); } }
      fruits.forEach(f => {
        if (!f.on) return;
        c.fillStyle = COL[f.s]; c.strokeStyle = '#2a1f2d'; c.lineWidth = 1.5; c.beginPath();
        if (crop === 'ichigo') { c.moveTo(f.x - 8, f.y - 5); c.quadraticCurveTo(f.x, f.y - 9, f.x + 8, f.y - 5); c.lineTo(f.x, f.y + 10); c.closePath(); }
        else c.arc(f.x, f.y, 9, 0, 7);
        c.fill(); c.stroke();
        c.fillStyle = '#3f7a28'; c.fillRect(f.x - 3, f.y - (crop === 'ichigo' ? 9 : 11), 6, 3);
        if (crop === 'ichigo') { c.fillStyle = '#ffe9a8'; [[-3, -2], [3, -2], [0, 3]].forEach(([dx, dy]) => c.fillRect(f.x + dx, f.y + dy, 1.5, 1.5)); }
      });
    };
    draw();
    const stop = W.watch(crop === 'ichigo' ? 'まっか な もの だけ ね。' : 'あかい の だけ！ みどり は まだ。');
    return UI.wait(done => {
      let ok = 0, ng = 0, t0 = performance.now(), raf = 0, end = false;
      const finish = () => { if (end) return; end = true; cancelAnimationFrame(raf); stop(); const sc = Math.max(0, Math.min(1, (ok - ng * .5) / ripeN)); W.react(sc >= .8); done(sc); };
      P.c.addEventListener('pointerdown', e => {
        if (end) return;
        const [x, y] = P.pos(e), f = fruits.find(o => o.on && Math.hypot(o.x - x, o.y - y) < 13);
        if (!f) return;
        if (f.s === 'ripe') { f.on = false; ok++; Sound.ok(); W.emote('you', '🧺', 500); if (ok >= ripeN) setTimeout(finish, 300); }
        else { ng++; f.on = false; Sound.bad(); W.emote('boss', '💦'); W.bubble('boss', `<b class="jp">${f.s === 'half' ? 'それ は まだ…あした！' : 'みどり は だめ！'}</b>`); msg.textContent = `${f.s === 'half' ? 'Oranye: belum matang penuh, petik besok.' : 'Hijau: masih mentah.'}`; }
        okEl.textContent = ok; ngEl.textContent = ng; draw();
      });
      const btn = document.createElement('button'); btn.className = 'btn block ghost'; btn.type = 'button'; btn.textContent = 'Selesai panen ✓'; btn.onclick = finish; W.box.appendChild(btn);
      const loop = t => { if (!P.c.isConnected || end) return; const left = Math.max(0, 1 - (t - t0) / limit); bar.style.width = left * 100 + '%'; if (left <= 0) { msg.textContent = '⏰ Waktu habis!'; finish(); return; } raf = requestAnimationFrame(loop); };
      raf = requestAnimationFrame(loop);
    });
  }

  // ⚖️ Timbang pakan: takaran tiap sapi berbeda, dibaca dalam bahasa Jepang
  const NUM = ['ぜろ', 'いち', 'に', 'さん', 'よん', 'ご', 'ろく', 'なな', 'はち', 'きゅう', 'じゅう', 'じゅういち', 'じゅうに'];
  const kgJP = v => `${NUM[Math.floor(v)]}${v % 1 ? ' てん ご' : ''} キロ`;
  async function taskScale(W, st) {
    const cows = st.cows || shuffle([['ハナ', 8], ['モモ', 6.5], ['ユキ', 9], ['サクラ', 7], ['クロ', 10.5]]).slice(0, 3);
    let right = 0;
    for (const [name, kg] of cows) {
      W.box.innerHTML = `<div class="ws-q">${esc(st.title || 'えさ · Timbang pakan tiap sapi')}</div>
        <div class="kj-cowcard"><b>🐄 ${esc(name)}</b><span class="jp">えさ：${esc(kgJP(kg))}</span>${ro(kgJP(kg), kgJP(kg).replace(/ぜろ|いち|に|さん|よん|ご|ろく|なな|はち|きゅう|じゅう/g, m => ({ ぜろ: 'zero', いち: 'ichi', に: 'ni', さん: 'san', よん: 'yon', ご: 'go', ろく: 'roku', なな: 'nana', はち: 'hachi', きゅう: 'kyuu', じゅう: 'juu' }[m])).replace('てん', 'ten').replace('キロ', 'kiro'))}</div>
        <div class="kj-scale"><b>0.0</b> kg</div>
        <div class="kj-keys kg"><button type="button" data-d="-0.5">−0.5</button><button type="button" data-d="0.5">+0.5</button><button type="button" data-d="1">+1</button><button type="button" data-d="5">+5</button><button type="button" data-d="0">0</button></div>
        <button class="btn block kj-feed-go" type="button">🌾 あたえる (berikan)</button><p class="kj-msg small"></p>`;
      const v = W.box.querySelector('.kj-scale b');
      let cur = 0;
      W.box.querySelectorAll('.kj-keys button').forEach(b => b.onclick = () => { const d = +b.dataset.d; cur = d === 0 ? 0 : Math.max(0, Math.min(20, cur + d)); v.textContent = cur.toFixed(1); Sound.blip(); });
      W.box.dataset.kg = kg;
      await UI.wait(d => { W.box.querySelector('.kj-feed-go').onclick = () => d(); });
      if (Math.abs(cur - kg) < .01) { right++; Sound.ok(); W.emote('you', '⭕', 600); W.bubble('boss', '<b class="jp">ぴったり！</b>'); }
      else { Sound.bad(); W.react(false); W.box.querySelector('.kj-msg').textContent = `${name} butuh ${kg} kg (${kgJP(kg)}), kamu memberi ${cur.toFixed(1)} kg. Kebanyakan/kurang pakan bisa membuat sapi sakit.`; await sleep(1800); }
    }
    return right / cows.length;
  }

  // 📦 Sortir: masukkan produk ke kotak ukuran yang benar (atau NG)
  async function taskSort(W, st) {
    const cats = st.cats, n = st.count || 8, items = [];
    for (let i = 0; i < n; i++) {
      const bad = st.defects && Math.random() < .2;
      const c = cats[Math.floor(Math.random() * cats.length)];
      items.push({ g: Math.round(c.min + Math.random() * (c.max - c.min - 1)), bad: bad ? shuffle(st.defects)[0] : null, ans: bad ? 'NG' : c.k });
    }
    W.box.innerHTML = `<div class="ws-q">${esc(st.title)}</div>
      <div class="kj-std"><b>きかく (standar)</b> ${cats.map(c => `<span><b>${c.k}</b> ${c.min}–${c.max}${st.unit || 'g'}</span>`).join('')}${st.defects ? '<span><b>NG</b> rusak</span>' : ''}</div>
      <div class="kj-card"><div class="kj-emo"></div><div class="kj-d"></div></div>
      <div class="kj-bins">${[...cats.map(c => c.k), ...(st.defects ? ['NG'] : [])].map(k => `<button class="btn ${k === 'NG' ? 'danger' : ''}" data-k="${k}" type="button">${k}</button>`).join('')}</div>
      <p class="kj-msg small"></p><p class="muted small kj-cnt"></p>`;
    const emo = W.box.querySelector('.kj-emo'), d = W.box.querySelector('.kj-d'), msg = W.box.querySelector('.kj-msg'), cnt = W.box.querySelector('.kj-cnt');
    let ok = 0;
    const stop = W.watch('はかり の すうじ を よく みて。');
    for (let i = 0; i < n; i++) {
      const it = items[i];
      emo.innerHTML = `${st.emoji || '🍅'}${it.bad ? `<span class="kj-b">${it.bad[0]}</span>` : ''}`;
      d.innerHTML = `⚖️ <b>${it.g}${st.unit || 'g'}</b>${it.bad ? ` · ${esc(it.bad[1])}` : ''}`; cnt.textContent = `${i + 1}/${n} · benar ${ok}`;
      W.box.dataset.ans = it.ans;
      const k = await UI.wait(r => W.box.querySelectorAll('.kj-bins button').forEach(b => b.onclick = () => r(b.dataset.k)));
      if (k === it.ans) { ok++; Sound.ok(); msg.textContent = '⭕'; }
      else { Sound.bad(); W.emote('boss', '💦'); msg.textContent = `❌ Yang benar: ${it.ans}${it.bad ? ' (produk rusak tidak dikirim)' : ''}.`; await sleep(900); }
    }
    stop(); W.react(ok / n >= .8);
    return ok / n;
  }

  Object.assign(Kerja.TASKS, { harvest: taskHarvest, scale: taskScale, sort: taskSort });
  Object.assign(Kerja.TASK_START, { harvest: 'しゅうかく スタート！', scale: 'えさ を はかって。', sort: 'きかく どおり に わけて。' });
  Object.assign(Kerja.TASK_CAT, { harvest: 'seikaku', scale: 'seikaku', sort: 'seikaku' });

  /* =========================================================
     🌱 PERTANIAN
     ========================================================= */
  const TOMATO_CATS = [{ k: 'S', min: 100, max: 150 }, { k: 'M', min: 150, max: 200 }, { k: 'L', min: 200, max: 250 }];
  const nogyo = {
    id: 'nogyo', icon: '🌱', jp: 'のうぎょう', k: '農業（耕種）', name: 'Pertanian', place: 'Rumah kaca tomat & stroberi',
    desc: 'Panen tomat & stroberi, sortir S/M/L, suhu rumah kaca, gulma, pestisida, kirim ke koperasi.',
    info: {
      tugas: ['Panen (しゅうかく) tomat, stroberi, dan sayuran sesuai tingkat kematangan', 'Sortir & kemas sesuai standar ukuran (きかく) lalu kirim (しゅっか) ke koperasi/JA', 'Merawat tanaman: menyiram, memupuk, mengikat batang, memangkas daun, mencabut gulma', 'Mengatur suhu & jendela rumah kaca (ビニールハウス), membantu penyemprotan pestisida sesuai aturan'],
      jadwal: ['07:00 Masuk, cek suhu & kondisi rumah kaca', '07:30 Panen pagi (saat udara masih sejuk)', '10:00 Istirahat singkat', '10:15 Sortir & kemas', '12:00 Makan siang', '13:00 Perawatan tanaman / gulma', '16:00 Kirim ke koperasi, bersih-bersih alat', '17:00 Pulang (musim panen bisa mulai lebih pagi)'],
      kondisi: 'Di dalam rumah kaca bisa sangat panas di musim panas. Banyak membungkuk dan berjalan. Jadwal mengikuti musim & cuaca. Biasanya di desa, sering tinggal di asrama dekat ladang.',
      visa: 'Tokutei Ginou「農業」(jalur 耕種農業全般): ujian 農業技能測定試験 (全国農業会議所) + bahasa Jepang (JFT-Basic atau JLPT N4).',
      tips: 'Kenali tanda buah matang, pakai alat dengan aman, dan patuhi aturan pestisida (jangan masuk area yang baru disemprot). Minum air sebelum haus.',
    },
    vocab: [
      ['収穫', 'しゅうかく', 'shuukaku', 'panen'], ['出荷', 'しゅっか', 'shukka', 'pengiriman hasil panen'], ['選果', 'せんか', 'senka', 'sortir buah'],
      ['規格', 'きかく', 'kikaku', 'standar ukuran'], ['ビニールハウス', 'ビニールハウス', 'biniiru hausu', 'rumah kaca plastik'], ['はさみ', 'はさみ', 'hasami', 'gunting'],
      ['農薬', 'のうやく', 'nouyaku', 'pestisida'], ['雑草', 'ざっそう', 'zassou', 'gulma'], ['肥料', 'ひりょう', 'hiryou', 'pupuk'],
      ['水やり', 'みずやり', 'mizuyari', 'menyiram'], ['害虫', 'がいちゅう', 'gaichuu', 'hama serangga'], ['完熟', 'かんじゅく', 'kanjuku', 'matang penuh'],
    ],
    steps: [
      { t: 'clock', time: '07:00', title: 'しゅっきん · Masuk & cek rumah kaca', at: 'naya' },
      { t: 'say', w: 'ogawa', e: 'happy', jp: 'おはよう！きょう は トマト の しゅうかく だ。', ro: 'ohayou! kyou wa tomato no shuukaku da.', id: 'Pagi! Hari ini panen tomat.' },
      { t: 'pick', title: 'Pilih perlengkapan kerja di rumah kaca', items: [
        { jp: 'ぼうし', ro: 'boushi', id: 'topi', ok: true }, { jp: 'ながぐつ', ro: 'nagagutsu', id: 'sepatu bot', ok: true }, { jp: 'てぶくろ', ro: 'tebukuro', id: 'sarung tangan', ok: true }, { jp: 'すいとう', ro: 'suitou', id: 'botol minum', ok: true },
        { jp: 'サンダル', ro: 'sandaru', id: 'sandal', ok: false, why: 'Kaki harus terlindung dari alat & serangga.' }, { jp: 'ゆびわ', ro: 'yubiwa', id: 'cincin', ok: false, why: 'Bisa melukai buah & tersangkut.' }] },
      { t: 'clock', time: '07:30', title: 'しゅうかく · Panen tomat', at: 'tomato' },
      { t: 'harvest', title: 'トマト の しゅうかく · Panen tomat merah', crop: 'tomato', why: 'Tomat dipanen saat merah (atau sesuai permintaan pembeli). Gunting tangkainya pendek supaya tidak menusuk buah lain di kontainer.' },
      { t: 'quiz', w: 'ogawa', q: 'Tomat yang jatuh ke tanah sebaiknya…', opts: [{ label: 'Dipisahkan, tidak dicampur dengan tomat untuk dikirim' }, { label: 'Dilap lalu dicampur saja' }, { label: 'Disembunyikan di bawah kontainer' }], why: 'Buah yang jatuh bisa kotor atau memar. Pisahkan (bisa untuk olahan atau dibuang sesuai aturan), jangan dicampur dengan barang kirim.' },
      { t: 'clock', time: '10:15', title: 'せんか · Sortir & kemas', at: 'senka' },
      { t: 'sort', title: 'せんか · Sortir tomat S / M / L', emoji: '🍅', cats: TOMATO_CATS, defects: [['💥', 'retak'], ['🐛', 'bekas ulat'], ['🟤', 'busuk']], count: 8 },
      { t: 'clock', time: '13:00', title: 'てんき · Suhu rumah kaca siang hari', at: 'vent' },
      { t: 'dial', title: 'ハウス の おんど · Atur suhu rumah kaca', min: 15, max: 45, target: [23, 28], start: 36, unit: '℃', hot: 'Terlalu panas: tanaman layu & kamu bisa kena heat stroke. Buka jendela samping!', cold: 'Terlalu dingin untuk tomat.', good: 'Suhu pas untuk tomat (sekitar 25℃).', ask: { q: 'Sambil bekerja di rumah kaca yang panas, kamu…', opts: [{ jp: 'こまめ に みず を のみます。', ro: 'komame ni mizu wo nomimasu.' }, { jp: 'のど が かわく まで がまん します。', ro: 'nodo ga kawaku made gaman shimasu.' }, { jp: 'ぼうし を とります。', ro: 'boushi wo torimasu.' }] }, why: 'Rumah kaca bisa lebih dari 40℃. Buka jendela/ventilasi, minum air sedikit-sedikit tapi sering (こまめ に), dan istirahat di tempat teduh.' },
      { t: 'clock', time: '14:00', title: 'ざっそう · Perawatan & gulma', at: 'field' },
      { t: 'quiz', w: 'ogawa', jp: 'その ふくろ、のうやく だ。ちゅうい して。', ro: 'sono fukuro, nouyaku da. chuui shite.', id: 'Kantong itu pestisida. Hati-hati.', q: 'Aturan yang benar tentang pestisida (のうやく)…', opts: [{ label: 'Pakai masker & sarung tangan, ikuti label, jangan masuk area yang baru disemprot' }, { label: 'Boleh disemprot tanpa masker kalau sebentar' }, { label: 'Sisa pestisida dibuang ke sungai' }], why: 'Pestisida berbahaya bagi tubuh & lingkungan. Ikuti label dan instruksi atasan. Ada batas waktu sebelum boleh masuk lagi ke area yang disemprot dan sebelum panen.' },
      { t: 'clock', time: '16:00', title: 'しゅっか · Kirim ke koperasi', at: 'truck' },
      { t: 'quiz', w: 'ogawa', q: 'Sopir koperasi bertanya 「なんケース ですか？」. Kamu sudah mengemas 12 kotak. Kamu jawab…', opts: [{ jp: 'じゅうに ケース です。', ro: 'juuni keesu desu.' }, { jp: 'じゅう ケース です。', ro: 'juu keesu desu.' }, { jp: 'にじゅう ケース です。', ro: 'nijuu keesu desu.' }], why: 'じゅうに = 12. Jumlah yang dikirim dicatat dan menentukan pembayaran, jadi harus tepat.' },
      { t: 'clock', time: '17:00', title: 'たいきん · Pulang', at: 'naya' },
      { t: 'say', w: 'ogawa', e: 'happy', jp: 'おつかれさん！いい トマト だった な。', ro: 'otsukaresan! ii tomato datta na.', id: 'Kerja bagus! Tomatnya bagus hari ini.' },
    ],
  };
  const ROOM_NOGYO = {
    name: 'Rumah kaca & ladang', floor: ['#9c7a52', '#8f6f48'], wall: '#cfe6d0', wallTop: '#5a9a3a', outdoor: true,
    st: {
      naya:   { x: 1, y: 1, e: '🧰', jp: 'なや', id: 'gudang alat' },
      tomato: { x: 4, y: 2, e: '🍅', jp: 'トマト ハウス', id: 'rumah kaca tomat' },
      ichigo: { x: 8, y: 2, e: '🍓', jp: 'いちご ハウス', id: 'rumah kaca stroberi' },
      vent:   { x: 11, y: 1, e: '🌡️', jp: 'おんど・まど', id: 'pengatur suhu & jendela' },
      field:  { x: 2, y: 5, e: '🌿', jp: 'はたけ', id: 'ladang (gulma)' },
      senka:  { x: 6, y: 5, e: '📦', jp: 'せんかば', id: 'tempat sortir' },
      truck:  { x: 10, y: 5, e: '🚚', jp: 'しゅっか', id: 'truk pengiriman' },
    },
    at: {}, cast: {},
    block: [[3, 2, 6, 2], [7, 2, 9, 2]],
    start: { player: [2, 3], boss: [1, 2] },
    draw(c, t, { TS, yy }) {
      // baris tanaman tomat & stroberi (bergoyang pelan)
      [[3, 6, '#e0473a'], [7, 9, '#e0473a']].forEach(([x0, x1, col], h) => {
        for (let x = x0; x <= x1; x++) {
          const X = x * TS + 16, Y = yy(2) + 4, sw = Math.sin(t / 900 + x) * 1.5;
          c.strokeStyle = '#4f8a2e'; c.lineWidth = 3; c.beginPath(); c.moveTo(X, Y + 26); c.lineTo(X + sw, Y - 4); c.stroke();
          c.fillStyle = '#6fb04a'; c.beginPath(); c.ellipse(X - 6 + sw, Y + 6, 6, 3, -.5, 0, 7); c.fill(); c.beginPath(); c.ellipse(X + 6 + sw, Y + 14, 6, 3, .5, 0, 7); c.fill();
          c.fillStyle = h ? '#e0473a' : (x % 2 ? '#e0473a' : '#f29b38'); c.beginPath(); c.arc(X + 5 + sw, Y + 2, h ? 3 : 4, 0, 7); c.fill();
        }
      });
      // atap plastik rumah kaca
      c.fillStyle = 'rgba(230,245,255,.35)'; c.fillRect(3 * TS - 4, yy(1) + 18, 7 * TS + 8, 18);
      // ladang bergaris
      c.fillStyle = 'rgba(60,40,20,.25)'; for (let i = 0; i < 4; i++) c.fillRect(1 * TS, yy(5) + 30 + i * 0, 3 * TS, 3);
    },
  };

  /* =========================================================
     🐄 PETERNAKAN
     ========================================================= */
  const EGG_CATS = [{ k: 'MS', min: 52, max: 58 }, { k: 'M', min: 58, max: 64 }, { k: 'L', min: 64, max: 70 }];
  const chikusan = {
    id: 'chikusan', icon: '🐄', jp: 'ちくさん', k: '農業（畜産）', name: 'Peternakan', place: 'Peternakan sapi perah & ayam',
    desc: 'Desinfeksi, timbang pakan, memerah susu, ambil & sortir telur, cek kesehatan hewan.',
    info: {
      tugas: ['Memberi pakan (きゅうじ) & air, membersihkan kandang (じょふん)', 'Memerah susu dengan mesin (ミルカー) sesuai urutan kebersihan', 'Mengambil & menyortir telur (しゅうらん), memeriksa kondisi ayam', 'Mengamati kesehatan hewan dan melapor perubahan, menjaga biosekuriti (しょうどく)'],
      jadwal: ['05:30 Masuk, desinfeksi, ganti sepatu bot', '06:00 Memerah susu pagi', '07:30 Memberi pakan, membersihkan kandang', '09:00 Sarapan / istirahat', '10:00 Ambil & sortir telur', '12:00 Istirahat siang (cukup panjang)', '15:00 Pakan sore', '16:30 Memerah susu sore', '18:00 Pulang (jam kerja dibagi pagi & sore)'],
      kondisi: 'Hewan butuh perawatan setiap hari, termasuk hari libur bergilir. Pagi sekali, bau, dan fisik berat, tapi dekat dengan hewan. Biosekuriti sangat ketat untuk mencegah penyakit.',
      visa: 'Tokutei Ginou「農業」(jalur 畜産農業全般): ujian 農業技能測定試験 bidang peternakan + bahasa Jepang (JFT-Basic atau JLPT N4).',
      tips: 'Dekati hewan dengan tenang dari depan/samping, jangan berdiri tepat di belakang sapi. Selalu desinfeksi saat masuk & keluar. Hewan mati mendadak = lapor segera, jangan disentuh.',
    },
    vocab: [
      ['牛舎', 'ぎゅうしゃ', 'gyuusha', 'kandang sapi'], ['鶏舎', 'けいしゃ', 'keisha', 'kandang ayam'], ['餌', 'えさ', 'esa', 'pakan'],
      ['給餌', 'きゅうじ', 'kyuuji', 'memberi pakan'], ['搾乳', 'さくにゅう', 'sakunyuu', 'memerah susu'], ['集卵', 'しゅうらん', 'shuuran', 'mengambil telur'],
      ['消毒', 'しょうどく', 'shoudoku', 'desinfeksi'], ['除ふん', 'じょふん', 'jofun', 'membersihkan kotoran'], ['子牛', 'こうし', 'koushi', 'anak sapi'],
      ['獣医', 'じゅうい', 'juui', 'dokter hewan'], ['乳房炎', 'にゅうぼうえん', 'nyuubouen', 'radang ambing (mastitis)'], ['鳥インフルエンザ', 'とりインフルエンザ', 'tori infuruenza', 'flu burung'],
    ],
    steps: [
      { t: 'clock', time: '05:30', title: 'しゅっきん · Masuk & desinfeksi', at: 'office' },
      { t: 'say', w: 'hayashi', e: 'happy', jp: 'おはよう！まず しょうどく から ね。', ro: 'ohayou! mazu shoudoku kara ne.', id: 'Pagi! Pertama, desinfeksi dulu ya.' },
      { t: 'act', title: 'しょうどく · Masuk area kandang dengan aman', at: 'gate', target: '🚪', targetLabel: 'pintu area kandang', steps: [
        { tool: ['👢', 'ながぐつ'], jp: 'せんよう の ながぐつ に はきかえて。', id: 'ganti ke sepatu bot khusus kandang', how: 'tap', after: '👢' },
        { tool: ['🧴', 'しょうどくそう'], jp: 'しょうどくそう に しっかり つけて。', id: 'celup sepatu di bak desinfeksi', how: 'hold', after: '👢✨' },
        { tool: ['🧼', 'てあらい'], jp: 'て を あらって しょうどく。', id: 'cuci & desinfeksi tangan', how: 'swipe', after: '🫧' },
        { tool: ['🥼', 'さぎょうぎ'], jp: 'さぎょうぎ を きて。', id: 'pakai baju kerja kandang', how: 'tap', after: '🥼 ✓' },
      ], extras: [['👟', 'じぶん の くつ'], ['🍞', 'パン']], why: 'Biosekuriti: penyakit hewan bisa terbawa lewat sepatu, tangan, dan baju. Lakukan setiap kali masuk & keluar.' },
      { t: 'clock', time: '06:00', title: 'さくにゅう · Memerah susu pagi', at: 'parlor' },
      { t: 'act', title: 'さくにゅう · Memerah susu', target: '🐄', targetLabel: 'ambing sapi', steps: [
        { tool: ['🧻', 'タオル'], jp: 'ちくび を ふいて。', id: 'lap puting sampai bersih', how: 'swipe', after: '✨' },
        { tool: ['🥛', 'まえしぼり'], jp: 'まえしぼり、さんかい。', id: 'perah awal 3× (cek gumpalan)', how: 'taps:3', after: '🥛 OK' },
        { tool: ['🔧', 'ミルカー'], jp: 'ミルカー を つけて。', id: 'pasang mesin perah', how: 'hold', after: '🔧 ぶーん' },
        { tool: ['✋', 'はずす'], jp: 'おわったら はずして。', id: 'lepas setelah selesai', how: 'tap', after: '✋' },
        { tool: ['🧴', 'ディッピング'], jp: 'ディッピング して。', id: 'celup puting antiseptik', how: 'taps:4', after: '🧴×4' },
      ], extras: [['🪣', 'バケツ (みず)'], ['🧹', 'ほうき']], why: 'Urutan kebersihan memerah mencegah 乳房炎 (mastitis) dan menjaga kualitas susu.' },
      { t: 'quiz', w: 'hayashi', q: 'Saat まえしぼり (susu awal), kamu melihat gumpalan putih di susu. Kamu…', opts: [{ jp: 'ぼくじょうちょう、ちち に かたまり が あります！', ro: 'bokujouchou, chichi ni katamari ga arimasu!' }, { label: 'Campur saja ke tangki susu' }, { label: 'Diam, nanti juga hilang' }], why: 'Gumpalan bisa tanda 乳房炎 (mastitis). Susu sapi itu tidak boleh masuk tangki. Lapor, tandai sapinya, ikuti instruksi dokter hewan.' },
      { t: 'clock', time: '07:30', title: 'きゅうじ · Memberi pakan', at: 'feed' },
      { t: 'scale', title: 'えさ · Timbang pakan tiap sapi', why: 'Tiap sapi diberi pakan sesuai berat badan, produksi susu, dan kondisinya. Takaran yang salah bisa menyebabkan gangguan pencernaan.' },
      { t: 'quiz', w: 'hayashi', q: 'Cara mendekati sapi yang benar…', opts: [{ label: 'Dari depan/samping, pelan, sambil bicara supaya sapi tahu' }, { label: 'Diam-diam dari belakang supaya tidak kaget' }, { label: 'Berlari supaya cepat' }], why: 'Sapi bisa menendang ke belakang. Dekati dari depan atau samping, sentuh bahunya, dan bicara pelan (こえかけ juga untuk hewan!).' },
      { t: 'clock', time: '10:00', title: 'しゅうらん · Ambil & sortir telur', at: 'coop' },
      { t: 'belt', title: 'Singkirkan telur retak & kotor di conveyor', count: 10, items: [
        { e: '🥚', d: 'Telur bersih, cangkang utuh', ok: true }, { e: '🥚', d: 'Telur besar, utuh', ok: true }, { e: '🥚', d: 'Telur normal', ok: true },
        { e: '🥚', b: '💥', d: 'Cangkang retak', ok: false, why: 'ひび (retak): bakteri bisa masuk' }, { e: '🥚', b: '🟤', d: 'Kotor kotoran ayam', ok: false, why: 'よごれ (kotor)' }, { e: '🥚', b: '🩸', d: 'Ada bercak darah', ok: false, why: 'Tidak layak jual' }] },
      { t: 'sort', title: 'Sortir telur sesuai berat', emoji: '🥚', cats: EGG_CATS, count: 6 },
      { t: 'clock', time: '13:00', title: 'じょふん · Bersihkan kandang', at: 'barn' },
      { t: 'spot', title: 'Cek kesehatan sapi: sehat atau perlu lapor?', okLabel: 'げんき', ngLabel: 'ほうこく', count: 7, limit: 9000, items: [
        { e: '🐄', d: 'Makan dengan lahap', ok: true }, { e: '🐄', d: 'Berbaring tenang sambil mengunyah (memamah biak)', ok: true }, { e: '🐄', d: 'Mata cerah, hidung basah', ok: true },
        { e: '🐄', b: '🦵', d: 'Berjalan pincang', ok: false, why: 'Pincang: kuku/kaki bermasalah' }, { e: '🐄', b: '🍽️', d: 'Tidak mau makan sejak pagi', ok: false, why: 'Nafsu makan hilang = tanda sakit' }, { e: '🐄', b: '🌡️', d: 'Napas cepat, badan panas', ok: false, why: 'Kemungkinan demam (normal ≈38,5℃)' }] },
      { t: 'clock', time: '17:30', title: 'たいきん · Desinfeksi & pulang', at: 'gate' },
      { t: 'quiz', w: 'hayashi', q: 'Saat keluar dari area kandang, kamu…', opts: [{ label: 'Celup sepatu di bak desinfeksi & ganti sepatu lagi' }, { label: 'Langsung pulang memakai sepatu kandang' }, { label: 'Hanya cuci tangan' }], why: 'Biosekuriti berlaku dua arah: jangan bawa penyakit masuk, jangan bawa keluar ke peternakan lain atau rumah.' },
      { t: 'say', w: 'hayashi', e: 'happy', jp: 'おつかれさま！どうぶつ たち も よろこんでる よ。', ro: 'otsukaresama! doubutsu-tachi mo yorokonderu yo.', id: 'Kerja bagus! Hewan-hewan juga senang.' },
    ],
  };
  const ROOM_CHIKUSAN = {
    name: 'Peternakan', floor: ['#c9b38a', '#bda67c'], wall: '#b9a07a', wallTop: '#8a5a36', outdoor: true,
    st: {
      office: { x: 1, y: 1, e: '📋', jp: 'じむしつ', id: 'kantor & catatan' },
      gate:   { x: 1, y: 5, e: '🧴', jp: 'しょうどく', id: 'bak desinfeksi' },
      barn:   { x: 5, y: 2, e: '🐄', jp: 'ぎゅうしゃ', id: 'kandang sapi' },
      feed:   { x: 9, y: 1, e: '🌾', jp: 'えさば', id: 'gudang pakan' },
      parlor: { x: 11, y: 3, e: '🥛', jp: 'さくにゅうしつ', id: 'ruang perah' },
      coop:   { x: 9, y: 5, e: '🐔', jp: 'けいしゃ', id: 'kandang ayam' },
      compost:{ x: 5, y: 5, e: '🧹', jp: 'たいひば', id: 'tempat kompos' },
    },
    at: {}, cast: {},
    block: [[3, 2, 7, 2], [11, 2]],
    start: { player: [2, 3], boss: [1, 2] },
    draw(c, t, { TS, yy }) {
      // sekat kandang & sapi
      c.strokeStyle = '#7a5a36'; c.lineWidth = 3;
      for (let x = 3; x <= 8; x++) { c.beginPath(); c.moveTo(x * TS, yy(2) - 4); c.lineTo(x * TS, yy(2) + 30); c.stroke(); }
      c.font = '22px sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
      [3, 4, 6, 7].forEach((x, i) => Emo.draw(c, '🐄', x * TS + 16 + Math.sin(t / 1200 + i) * 1.5, yy(2) + 12, 24));
      // ayam berjalan
      for (let i = 0; i < 3; i++) { const x = 8 * TS + ((t / 40 + i * 30) % (3 * TS)); Emo.draw(c, '🐓', x, yy(6) + 10, 15); }
      // tumpukan jerami
      c.fillStyle = '#e9c46a'; c.fillRect(10 * TS - 6, yy(1) + 18, 26, 12);
    },
  };

  Kerja.register(nogyo, ROOM_NOGYO, {
    boss: 'ogawa',
    uniform: { at: 'naya', look: { uniform: 'blazer', uniformColor: '#5a9a3a', accessory: 'cap', accColor: '#e9d29a' }, say: 'Topi lebar, sarung tangan, dan sepatu bot sudah dipakai.' },
    greet: { jp: 'のうじょう へ ようこそ！つち の におい、いい だろう？', ro: 'noujou e youkoso! tsuchi no nioi, ii darou?', id: 'Selamat datang di pertanian! Bau tanahnya enak, kan?' },
  });
  Kerja.register(chikusan, ROOM_CHIKUSAN, {
    boss: 'hayashi',
    uniform: { at: 'office', look: { uniform: 'blazer', uniformColor: '#3f6fb0', accessory: 'cap', accColor: '#f4ecdc' }, say: 'Baju kerja kandang (つなぎ) & sepatu bot sudah dipakai.' },
    greet: { jp: 'ぼくじょう へ ようこそ。うし も にわとり も まってる よ！', ro: 'bokujou e youkoso. ushi mo niwatori mo matteru yo!', id: 'Selamat datang di peternakan. Sapi dan ayam sudah menunggu!' },
  });
})();
