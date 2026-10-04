/* =========================================================
   AKSI KERJA NYATA (tambahan) · KAIGO & GENBA
   Tugas interaktif berdasarkan kasus nyata di tempat kerja Jepang:
   materi 介護技能評価試験 / pelatihan 初任者研修 (バイタル, 着脱介助
   脱健着患, 体位変換 & 褥瘡, 服薬介助 3つの確認, 認知症 帰宅願望 を
   受容する声かけ) dan aturan keselamatan konstruksi (玉掛け合図
   ゴーヘイ・スラー・ストップ, 吊り荷の下に入らない, フルハーネス
   2丁掛け, 誘導員 オーライ・ストップ, 産廃の分別, 鉄筋結束 & ピッチ).

   KAIGO   vital · talk · dress · skin · meds
   GENBA   crane · harness · yudo · bins · rebar
   (talk & bins dipakai juga di bidang lain)

   Setiap tugas mengembalikan skor 0..1 dan punya B._auto() untuk uji
   otomatis (tests/kerja_aksi.py).
   ========================================================= */
(() => {
  const K = Kerja.kit, esc = K.esc, shuffle = K.shuffle, sleep = K.sleep, speak = K.speak, ro = K.ro;
  const S = () => Save.d;
  const relax = () => !!S().settings.relax;
  const trOn = () => S().settings.kjTrans !== false;   // tampilkan arti Indonesia di perintah kerja
  const jpLine = (jp, r, id) => `<b class="jp">${esc(jp)}</b>${ro(jp, r)}${id ? `<small class="kj-idt"${trOn() ? '' : ' hidden'}>${esc(id)}</small>` : ''}`;
  const head = (title, hint) => `<div class="ws-q">${esc(title)}</div>${hint ? `<p class="muted small">${hint}</p>` : ''}`;
  const say = (W, k, jp) => { const who = W.has && W.has(k) ? k : 'boss'; W.bubble(who, `<b class="jp">${esc(jp)}</b>`); speak(jp); };
  const showId = B => B.querySelectorAll('.kj-idt').forEach(x => { x.hidden = false; });
  const buttons = (B, sel) => [...B.querySelectorAll(sel)];
  const click = el => el && el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  const press = async (el, ms) => { el.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })); await sleep(ms); el.dispatchEvent(new PointerEvent('pointerup', { bubbles: true })); };

  // Gerakan di sasaran: tap · taps:n · hold · swipe (sama dengan aksi 'act')
  function gesture(tg, how, bar) {
    const m = /^taps:(\d+)$/.exec(how || 'tap'), kind = m ? 'taps' : (how || 'tap'), times = m ? +m[1] : 1;
    tg.classList.add('ready'); tg.dataset.how = how || 'tap';
    return new Promise(d => {
      let n = 0, dist = 0, last = null, t0 = 0, raf = 0, down = false;
      const fin = () => { tg.onpointerdown = tg.onpointermove = tg.onpointerup = tg.onpointerleave = null; cancelAnimationFrame(raf); tg.classList.remove('ready'); if (bar) bar.style.width = '100%'; Sound.ok(); d(); };
      const tick = t => { if (!t0) t0 = t; const k = Math.min(1, (t - t0) / 900); if (bar) bar.style.width = k * 100 + '%'; if (k >= 1) return fin(); raf = requestAnimationFrame(tick); };
      tg.onpointerdown = e => {
        e.preventDefault(); down = true; last = [e.clientX, e.clientY];
        if (kind === 'tap') return fin();
        if (kind === 'taps') { n++; if (bar) bar.style.width = n / times * 100 + '%'; Sound.blip(); tg.classList.add('hit'); setTimeout(() => tg.classList.remove('hit'), 120); if (n >= times) fin(); return; }
        if (kind === 'hold') { t0 = 0; raf = requestAnimationFrame(tick); }
      };
      tg.onpointermove = e => {
        if (kind !== 'swipe' || !down || !last) return;
        dist += Math.hypot(e.clientX - last[0], e.clientY - last[1]); last = [e.clientX, e.clientY];
        if (bar) bar.style.width = Math.min(100, dist / 1.6) + '%'; if (dist >= 160) fin();
      };
      tg.onpointerup = tg.onpointerleave = () => { down = false; last = null; if (kind === 'hold') { cancelAnimationFrame(raf); if (bar && parseFloat(bar.style.width) < 100) bar.style.width = 0; } };
      tg._finish = fin;   // untuk uji otomatis
    });
  }
  // Pilih satu dari beberapa tombol (kalimat/aksi) → { i, ok }
  function choose(B, sel) {
    return new Promise(d => buttons(B, sel).forEach(b => b.onclick = () => { Sound.blip(); d({ b, ok: b.dataset.ok === '1' }); }));
  }
  const optHtml = (opts, cls = 'ws-o') => shuffle(opts.map((o, i) => ({ ...o, ok: i === 0 }))).map(o => `<button class="${cls}" type="button" data-ok="${o.ok ? 1 : 0}">${o.jp ? `<span class="jp">${esc(o.jp)}</span>${ro(o.jp, o.ro)}` : esc(o.label)}</button>`).join('');

  /* =========================================================
     🩺 KAIGO · バイタル測定 (tanda vital)
     5 tanda vital: suhu, tekanan darah, nadi, napas, kesadaran.
     Ukur → catat → nilai normal/tidak → laporkan ke perawat.
     ========================================================= */
  const VCASE = {
    normal: { who: 'きむら さん', v: { temp: 36.4, bp: [128, 76], pulse: 72, spo2: 97 }, abn: null },
    fever:  { who: 'たなか さん', v: { temp: 38.2, bp: [134, 82], pulse: 96, spo2: 95 }, abn: 'temp' },
    bp:     { who: 'さとう さん', v: { temp: 36.6, bp: [176, 98], pulse: 84, spo2: 96 }, abn: 'bp' },
    spo2:   { who: 'すずき さん', v: { temp: 37.1, bp: [124, 70], pulse: 102, spo2: 90 }, abn: 'spo2' },
  };
  const VITALS = [
    { k: 'temp', tool: ['🌡️', 'たいおんけい'], name: 'たいおん', id: 'suhu badan', jp: 'わき に はさんで、たいおん を はかって。', how: 'hold', zone: 'わき (ketiak)', fmt: v => v.toFixed(1) + '℃', range: '36.0〜37.4℃', bad: v => v >= 37.5 || v < 35.5 },
    { k: 'bp', tool: ['🩺', 'けつあつけい'], name: 'けつあつ', id: 'tekanan darah', jp: 'うで に まいて、けつあつ を はかって。', how: 'taps:5', zone: 'lengan atas (pompa 5×)', fmt: v => `${v[0]}/${v[1]}`, range: '〜139/89', bad: v => v[0] >= 160 || v[1] >= 95 || v[0] < 90 },
    { k: 'pulse', tool: ['⌚', 'とけい'], name: 'みゃくはく', id: 'denyut nadi', jp: 'てくび で みゃく を かぞえて。', how: 'taps:6', zone: 'pergelangan (ketuk tiap denyut)', fmt: v => v + '回/分', range: '60〜100回/分', bad: v => v > 110 || v < 50 },
    { k: 'spo2', tool: ['☝️', 'パルスオキシメーター'], name: 'SpO2', id: 'saturasi oksigen', jp: 'ゆび に つけて、SpO2 を みて。', how: 'hold', zone: 'ujung jari', fmt: v => v + '%', range: '95〜100%', bad: v => v <= 92 },
  ];
  async function taskVital(W, st) {
    const C = st.c || VCASE[st.case] || VCASE[shuffle(['fever', 'bp', 'spo2'])[0]];
    const B = W.box; let miss = 0, pts = 0, max = 0;
    B.dataset.abn = C.abn || '';
    // 1) こえかけ
    B.innerHTML = head(st.title || `バイタル チェック · ${C.who}`, 'Sebelum menyentuh, jelaskan dulu apa yang akan kamu lakukan (こえかけ).') +
      `<div class="ws-opts">${optHtml([{ jp: `${C.who}、いまから たいおん と けつあつ を はかります ね。`, ro: 'ima kara taion to ketsuatsu wo hakarimasu ne.' }, { jp: '（だまって うで を つかむ）', ro: '(diam, langsung pegang lengan)' }, { jp: 'はやく うで だして！', ro: 'hayaku ude dashite!' }])}</div>`;
    max++; let r = await choose(B, '.ws-o');
    if (r.ok) { pts++; W.react(true); } else { W.react(false); say(W, 'boss', 'さきに こえかけ ね。'); await sleep(900); }
    // 2) ukur 4 tanda vital
    const vals = {};
    const tools = shuffle([...VITALS.map(v => v.tool), ['🍵', 'おちゃ'], ['📺', 'リモコン']]);
    for (const v of VITALS) {
      B.innerHTML = head(`${v.name} · ${v.id}`) + `<div class="kj-act"><div class="kj-target" role="button" tabindex="0"><b>🧓</b><span class="kj-tl">${esc(C.who)} · ${esc(v.zone)}</span><span class="kj-state"></span><div class="kj-prog"><i></i></div></div>
        <div class="kj-order"><div class="kj-cmd">${jpLine(v.jp, '', `${v.id}: pilih alat lalu lakukan di sasaran`)}</div></div></div>
        <div class="kj-toolbox">${tools.map(([e, n]) => `<button class="kj-tool2" type="button" data-n="${esc(n)}"><b>${e}</b><span class="jp">${esc(n)}</span></button>`).join('')}</div><p class="kj-msg small"></p>`;
      say(W, 'boss', v.jp); B.dataset.tool = v.tool[1];
      const msg = B.querySelector('.kj-msg');
      await new Promise(d => buttons(B, '.kj-tool2').forEach(b => b.onclick = () => {
        if (b.dataset.n === v.tool[1]) { b.classList.add('sel'); Sound.blip(); d(); }
        else { miss++; Sound.bad(); b.classList.add('bad'); setTimeout(() => b.classList.remove('bad'), 400); msg.textContent = `Itu ${b.dataset.n}. Untuk ${v.id} pakai alat lain.`; showId(B); }
      }));
      msg.textContent = v.how === 'hold' ? '✋ Tahan sasaran sampai angka stabil.' : v.k === 'bp' ? '👆 Pompa manset 5 kali (ketuk).' : '👆 Ketuk setiap kali nadi berdenyut (6×).';
      await gesture(B.querySelector('.kj-target'), v.how, B.querySelector('.kj-prog i'));
      vals[v.k] = C.v[v.k];
      B.querySelector('.kj-state').textContent = v.fmt(C.v[v.k]); W.emote('you', '📝', 700);
      await sleep(500);
    }
    // 3) catat & nilai
    B.innerHTML = head('きろく · Catat & nilai hasilnya', 'Tandai tiap angka: <b>正常</b> (normal) atau <b>要報告</b> (harus dilaporkan).') +
      `<table class="kj-vt">${VITALS.map(v => `<tr data-k="${v.k}"><td><b class="jp">${v.name}</b><small>${esc(v.id)}<br>normal ${esc(v.range)}</small></td><td class="kj-vv">${v.fmt(vals[v.k])}</td><td><div class="seg"><button type="button" data-j="ok">正常</button><button type="button" data-j="ng">要報告</button></div></td></tr>`).join('')}</table>
      <button class="btn block kj-next" type="button" disabled>きろく かんりょう ▶</button><p class="kj-msg small"></p>`;
    const judge = {};
    const next = B.querySelector('.kj-next');
    buttons(B, '[data-j]').forEach(b => b.onclick = () => { const k = b.closest('tr').dataset.k; judge[k] = b.dataset.j; b.parentNode.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b)); Sound.blip(); next.disabled = Object.keys(judge).length < VITALS.length; });
    await new Promise(d => { next.onclick = d; });
    VITALS.forEach(v => { max++; const ng = v.bad(vals[v.k]); if ((judge[v.k] === 'ng') === ng) pts++; else miss++; B.querySelector(`tr[data-k="${v.k}"]`).classList.add((judge[v.k] === 'ng') === ng ? 'good' : 'wrong'); });
    await sleep(900);
    // 4) laporan
    if (C.abn) {
      const v = VITALS.find(x => x.k === C.abn);
      B.innerHTML = head('ほうこく · Lapor ke perawat', `${esc(v.name)} ${esc(C.who)} tidak normal. Laporkan dengan jelas: siapa · apa · berapa.`) +
        `<div class="ws-opts">${optHtml([{ jp: `かんごし さん、${C.who} の ${v.name} が ${v.fmt(vals[v.k])} です。かくにん を おねがい します。`, ro: '' }, { jp: 'ちょっと へん です。', ro: 'chotto hen desu.' }, { jp: '（あとで きろく だけ する）', ro: '(nanti dicatat saja)' }])}</div>`;
      max++; r = await choose(B, '.ws-o');
      if (r.ok) { pts++; W.react(true); speak(r.b.textContent); } else { miss++; W.react(false); }
    } else {
      B.innerHTML = head('Semua normal', 'Tetap catat di 記録 dan beri tahu penghuni hasilnya.') + `<div class="ws-opts">${optHtml([{ jp: 'ぜんぶ だいじょうぶ でした よ。ありがとう ございます。', ro: 'zenbu daijoubu deshita yo.' }, { jp: 'おわり。', ro: 'owari.' }])}</div>`;
      max++; r = await choose(B, '.ws-o'); if (r.ok) pts++;
    }
    return Math.max(0, Math.min(1, pts / max - miss * .05));
  }

  /* =========================================================
     💬 Percakapan dengan meter perasaan (talk)
     Kasus: 帰宅願望 (lansia demensia ingin pulang), menolak makan,
     keluhan keluarga, ditegur mandor, perintah tidak aman, dll.
     st.turns: [{ jp, ro, id, opts: [{ jp, ro, d, fb }] }]  d = +/− perasaan
     ========================================================= */
  async function taskTalk(W, st) {
    const B = W.box, k = st.k || 'r', face = st.face || '👵';
    let mood = st.mood == null ? 30 : st.mood, got = 0, best = 0;
    const faceOf = m => m >= 75 ? st.happy || '😊' : m >= 45 ? st.calm || '🙂' : m >= 20 ? st.sad || '😟' : st.angry || '😠';
    for (const [ti, t] of st.turns.entries()) {
      const opts = shuffle(t.opts.map((o, i) => ({ ...o, i })));
      best += Math.max(...t.opts.map(o => o.d));
      B.innerHTML = head(st.title, ti === 0 ? esc(st.hint || 'Pilih kata-kata yang menenangkan dan menghormati lawan bicara.') : '') +
        `<div class="kj-talk"><div class="kj-face">${face}<span>${faceOf(mood)}</span></div><div class="kj-say">${jpLine(t.jp, t.ro, t.id)}</div></div>
        <div class="kj-mood"><span>😠</span><div><i style="width:${mood}%"></i></div><span>😊</span></div>
        <div class="ws-opts">${opts.map(o => `<button class="ws-o" type="button" data-d="${o.d}">${o.jp ? `<span class="jp">${esc(o.jp)}</span>${ro(o.jp, o.ro)}` : esc(o.label)}</button>`).join('')}</div><p class="kj-msg small"></p>`;
      say(W, k, t.jp);
      const r = await new Promise(d => buttons(B, '.ws-o').forEach(b => b.onclick = () => d(opts[buttons(B, '.ws-o').indexOf(b)])));
      got += r.d; mood = Math.max(0, Math.min(100, mood + r.d));
      B.querySelector('.kj-mood i').style.width = mood + '%'; B.querySelector('.kj-face span').textContent = faceOf(mood);
      buttons(B, '.ws-o').forEach(b => { b.disabled = true; b.classList.add(+b.dataset.d === Math.max(...t.opts.map(o => o.d)) ? 'good' : 'dim'); });
      if (r.jp) speak(r.jp);
      (r.d > 0 ? Sound.ok : Sound.bad)(); W.emote(W.has && W.has(k) ? k : 'boss', r.d > 0 ? '♪' : '💢', 900);
      B.querySelector('.kj-msg').innerHTML = `${r.d > 0 ? '⭕' : '❌'} ${esc(r.fb || '')}`; showId(B);
      await K.done1(W);
    }
    const sc = Math.max(0, Math.min(1, got / Math.max(1, best)));
    W.react(sc >= .7);
    return sc;
  }

  /* =========================================================
     👕 KAIGO · 着脱介助 (ganti baju) — 脱健着患
     Lepas dari sisi SEHAT dulu, pakai dari sisi LUMPUH dulu.
     ========================================================= */
  async function taskDress(W, st) {
    const B = W.box, mahi = st.mahi || shuffle(['R', 'L'])[0], side = s => (s === 'R' ? 'みぎ' : 'ひだり'), kenko = mahi === 'R' ? 'L' : 'R';
    let pts = 0, max = 0;
    B.dataset.mahi = mahi;
    // 1) persiapan (privasi & suhu)
    const PREP = shuffle([['🚪', 'カーテン を しめる', 'tutup tirai (privasi)', 1], ['🧺', 'バスタオル を かける', 'tutup badan dengan handuk', 1], ['🌡️', 'へや を あたためる', 'hangatkan ruangan', 1], ['🪟', 'まど を ぜんぶ あける', 'buka semua jendela', 0], ['📱', 'しゃしん を とる', 'ambil foto', 0]]);
    B.innerHTML = head(st.title || `こうい · Ganti baju (${side(mahi)} lumpuh)`, `Penghuni lumpuh di sisi <b>${side(mahi)}</b> (${mahi === 'R' ? 'kanan' : 'kiri'}). Siapkan dulu: pilih semua persiapan yang benar.`) +
      `<div class="kj-prep">${PREP.map(([e, jp, id, ok]) => `<button type="button" class="kj-pt" data-ok="${ok}"><b>${e}</b><span class="jp">${esc(jp)}</span><small>${esc(id)}</small></button>`).join('')}</div>
      <button class="btn block kj-next" type="button">じゅんび OK ▶</button>`;
    buttons(B, '.kj-prep .kj-pt').forEach(b => b.onclick = () => { b.classList.toggle('sel'); Sound.blip(); });
    await new Promise(d => { B.querySelector('.kj-next').onclick = d; });
    buttons(B, '.kj-prep .kj-pt').forEach(b => { max++; if (b.classList.contains('sel') === (b.dataset.ok === '1')) pts++; });
    // 2) & 3) lepas lalu pakai
    const fig = phase => `<div class="kj-body"><button class="kj-arm" type="button" data-s="R">💪<span class="jp">みぎうで</span><small>${mahi === 'R' ? 'まひ (lumpuh)' : 'けんそく (sehat)'}</small></button><b class="kj-torso">${phase === 'off' ? '👕' : '🧥'}<br>🧓</b><button class="kj-arm" type="button" data-s="L">💪<span class="jp">ひだりうで</span><small>${mahi === 'L' ? 'まひ (lumpuh)' : 'けんそく (sehat)'}</small></button></div>`;
    for (const phase of ['off', 'on']) {
      const want = phase === 'off' ? kenko : mahi;
      B.innerHTML = head(phase === 'off' ? 'ぬぐ · Lepas baju lama' : 'きる · Pakai baju baru', phase === 'off' ? 'Lengan mana yang dikeluarkan <b>lebih dulu</b>?' : 'Lengan mana yang dimasukkan <b>lebih dulu</b>?') + fig(phase) +
        `<div class="kj-cmd">${jpLine(phase === 'off' ? 'いまから ふく を ぬぎます ね。' : 'あたらしい ふく を きましょう ね。', '', phase === 'off' ? 'Sekarang kita lepas bajunya, ya.' : 'Kita pakai baju baru, ya.')}</div><p class="kj-msg small"></p>`;
      say(W, 'boss', phase === 'off' ? 'どっち から ぬぐ？' : 'どっち から きる？');
      max++;
      const r = await new Promise(d => buttons(B, '.kj-arm').forEach(b => b.onclick = () => d(b.dataset.s)));
      const ok = r === want, msg = B.querySelector('.kj-msg');
      if (ok) { pts++; Sound.ok(); W.react(true); } else { Sound.bad(); W.react(false); }
      msg.innerHTML = `${ok ? '⭕' : '❌'} <b>だっけん ちゃっかん</b> (脱健着患): lepas dari sisi sehat, pakai dari sisi lumpuh. Sisi lumpuh tidak bisa ditekuk sendiri, jadi ${phase === 'off' ? 'dikeluarkan terakhir' : 'dimasukkan duluan'} supaya tidak sakit.`;
      B.querySelector(`.kj-arm[data-s="${want}"]`).classList.add('good');
      await K.done1(W);
    }
    // 4) kancing: 自立支援
    B.innerHTML = head('ボタン · Kancing baju', 'Penghuni masih bisa memakai tangan yang sehat. Kamu…') + `<div class="ws-opts">${optHtml([{ jp: 'できる ところ は ご自分 で どうぞ。てつだいます ね。', ro: 'dekiru tokoro wa gojibun de douzo.' }, { jp: 'はやい から ぜんぶ わたし が やります。', ro: 'hayai kara zenbu watashi ga yarimasu.' }, { jp: '（だまって とめる）', ro: '' }])}</div>`;
    max++; const r = await choose(B, '.ws-o'); if (r.ok) { pts++; W.react(true); } else W.react(false);
    return pts / max;
  }

  /* =========================================================
     🛏 KAIGO · 体位変換 & 褥瘡チェック (ubah posisi & cek kulit)
     Ubah posisi tiap ±2 jam. Cek kemerahan (発赤) di tonjolan tulang.
     ========================================================= */
  const SKIN = [
    { k: 'koto', jp: 'こうとうぶ', id: 'belakang kepala', x: 38, y: 60, bony: 1 },
    { k: 'kata', jp: 'けんこうこつ', id: 'tulang belikat', x: 92, y: 52, bony: 1 },
    { k: 'hiji', jp: 'ひじ', id: 'siku', x: 140, y: 40, bony: 1 },
    { k: 'sen', jp: 'せんこつ', id: 'tulang ekor (sakrum)', x: 180, y: 66, bony: 1 },
    { k: 'kakato', jp: 'かかと', id: 'tumit', x: 298, y: 70, bony: 1 },
    { k: 'momo', jp: 'ふともも', id: 'paha', x: 228, y: 56, bony: 0 },
    { k: 'hara', jp: 'おなか', id: 'perut', x: 150, y: 80, bony: 0 },
  ];
  async function taskSkin(W, st) {
    const B = W.box; let pts = 0, max = 0;
    const red = new Set(st.red || shuffle(['sen', 'kakato', 'kata']).slice(0, 2));
    // 1) こえかけ + miring ke arah kita
    B.innerHTML = head(st.title || 'たいい へんかん · Ubah posisi tidur', 'Ucapkan dulu, lalu <b>usap</b> untuk memiringkan badan ke arah kamu (てまえ).') +
      `<div class="ws-opts">${optHtml([{ jp: 'からだ の むき を かえます ね。てまえ に まわります よ。', ro: 'karada no muki wo kaemasu ne.' }, { jp: 'えいっ！', ro: '' }, { jp: '（だまって ひっぱる）', ro: '' }])}</div>`;
    max++; let r = await choose(B, '.ws-o'); if (r.ok) pts++; else { W.react(false); say(W, 'boss', 'こえかけ してから ね。'); await sleep(800); }
    B.innerHTML = head('てまえ に たおす', 'Tekuk lutut penghuni dulu (lebih ringan), lalu usap ke arah kamu.') + `<div class="kj-act"><div class="kj-target"><b>🛌</b><span class="kj-tl">ひざ を たてて、てまえ へ</span><span class="kj-state"></span><div class="kj-prog"><i></i></div></div></div>`;
    await gesture(B.querySelector('.kj-target'), 'swipe', B.querySelector('.kj-prog i'));
    B.querySelector('.kj-state').textContent = '↩️ ✓'; await sleep(400);
    // 2) cek kulit
    B.innerHTML = head('ひふ の チェック · Cek kemerahan (ほっせき)', `Ketuk bagian kulit yang <b>merah</b>. Biasanya di tonjolan tulang yang tertekan.`) + '<p class="kj-msg small"></p>';
    const P = K.pad(W, 320, 110, 'skin'); B.insertBefore(P.c, B.querySelector('.kj-msg'));
    P.c.dataset.items = JSON.stringify(SKIN.map(s => [s.x, s.y, red.has(s.k) ? 1 : 0]));
    const found = new Set(), msg = B.querySelector('.kj-msg');
    let ng = 0;
    const draw = () => {
      const c = P.ctx; c.fillStyle = '#e8f0f7'; c.fillRect(0, 0, 320, 110); c.fillStyle = '#fff'; c.fillRect(6, 74, 308, 30);
      c.fillStyle = '#f2d2b6'; c.strokeStyle = '#7a5a4a'; c.lineWidth = 2;
      c.beginPath(); c.arc(38, 46, 18, 0, 7); c.fill(); c.stroke();                       // kepala
      c.beginPath(); c.ellipse(130, 58, 78, 22, 0, 0, 7); c.fill(); c.stroke();          // badan
      c.beginPath(); c.ellipse(250, 64, 56, 12, 0, 0, 7); c.fill(); c.stroke();          // kaki
      SKIN.forEach(s => {
        if (red.has(s.k)) { c.fillStyle = 'rgba(224,71,95,.55)'; c.beginPath(); c.arc(s.x, s.y, 9, 0, 7); c.fill(); }
        if (found.has(s.k)) { c.strokeStyle = red.has(s.k) ? '#3b8a78' : '#e0475f'; c.lineWidth = 3; c.beginPath(); c.arc(s.x, s.y, 13, 0, 7); c.stroke(); }
      });
    };
    draw();
    const stop = W.watch('ほね が でて いる ところ を みて。');
    await new Promise(d => {
      P.c.addEventListener('pointerdown', e => {
        const [x, y] = P.pos(e), s = SKIN.find(o => Math.hypot(o.x - x, o.y - y) < 16 && !found.has(o.k));
        if (!s) return;
        found.add(s.k);
        if (red.has(s.k)) { Sound.ok(); msg.innerHTML = `⭕ <b class="jp">${s.jp}</b> (${s.id}) merah → ほっせき (kemerahan). Catat & lapor.`; }
        else { ng++; Sound.bad(); msg.innerHTML = `❌ <b class="jp">${s.jp}</b> (${s.id}) normal.`; }
        draw(); if ([...red].every(k => found.has(k))) setTimeout(d, 600);
      });
      const b = document.createElement('button'); b.className = 'btn block ghost'; b.type = 'button'; b.textContent = 'Sudah semua ✓'; b.onclick = d; B.appendChild(b);
    });
    stop();
    const hit = [...red].filter(k => found.has(k)).length;
    max += red.size; pts += Math.max(0, hit - ng * .5);
    // 3) bantal & lapor
    B.innerHTML = head('クッション & ほうこく', 'Bagian yang merah tidak boleh tertekan lagi. Kamu…') + `<div class="ws-opts">${optHtml([{ jp: 'クッション で あかい ところ に あたらない ように して、かんごし に ほうこく します。', ro: '' }, { jp: 'あかい ところ を つよく マッサージ します。', ro: '' }, { jp: '（なにも しない）', ro: '' }])}</div>`;
    max++; r = await choose(B, '.ws-o'); if (r.ok) { pts++; W.react(true); } else W.react(false);
    if (!r.ok) { B.insertAdjacentHTML('beforeend', '<p class="kj-msg small">Kulit yang merah jangan dipijat (merusak jaringan). Kurangi tekanan dengan bantal dan laporkan ke perawat.</p>'); await K.done1(W); }
    return Math.max(0, Math.min(1, pts / max));
  }

  /* =========================================================
     💊 KAIGO · 服薬介助 (membagikan obat)
     3 cek: なまえ (nama) · ひにち (tanggal) · いつ (waktu minum).
     Obat yang salah waktu dikembalikan & dilaporkan (誤薬 = bahaya).
     ========================================================= */
  async function taskMeds(W, st) {
    const B = W.box, time = st.time || 'ひる', tId = { あさ: 'pagi', ひる: 'siang', ゆう: 'sore', ねるまえ: 'sebelum tidur' };
    const ppl = st.people || ['きむら', 'たなか', 'さとう'];
    const wrong = st.wrong || { to: ppl[1], time: 'ゆう' };
    const packs = shuffle([...ppl.map(p => ({ to: p, time })), { to: wrong.to, time: wrong.time, bad: 1 }]);
    let pts = 0, max = packs.length + 1, gone = 0;
    B.innerHTML = head(st.title || `ふくやく · Obat ${time === 'ひる' ? 'siang' : tId[time]} (${time})`, `Ketuk bungkus obat, <b>baca namanya</b>, lalu berikan ke orang yang tepat. Obat yang <b>bukan waktunya</b> → kembalikan ke perawat.`) +
      `<div class="kj-meds">${packs.map((p, i) => `<button class="kj-pack" type="button" data-i="${i}" data-to="${p.bad ? 'back' : p.to}"><b>💊</b><span class="jp">${esc(p.to)} さま</span><small class="jp">${esc(p.time)}</small></button>`).join('')}</div>
      <div class="kj-cmd kj-read"><small>👆 Ketuk bungkus obat untuk membaca labelnya.</small></div>
      <div class="kj-seats">${ppl.map(p => `<button class="kj-seat" type="button" data-p="${esc(p)}"><b>🧓</b><span class="jp">${esc(p)} さん</span></button>`).join('')}<button class="kj-seat back" type="button" data-p="back"><b>↩️</b><span>かんごし へ もどす</span></button></div>
      <p class="kj-msg small"></p>`;
    const msg = B.querySelector('.kj-msg'), read = B.querySelector('.kj-read');
    let cur = null;
    say(W, 'boss', 'なまえ、ひにち、いつ の くすり か、3かい かくにん して ね。');
    await new Promise(d => {
      buttons(B, '.kj-pack').forEach(b => b.onclick = () => {
        if (b.classList.contains('done')) return;
        cur = b; buttons(B, '.kj-pack').forEach(x => x.classList.toggle('sel', x === b)); Sound.blip();
        const p = packs[+b.dataset.i], line = `${p.to} さま、${p.time} の くすり です ね。`;
        read.innerHTML = jpLine(line, '', `${p.to}-sama, obat ${tId[p.time] || p.time}`); speak(line);
      });
      buttons(B, '.kj-seat').forEach(s => s.onclick = () => {
        if (!cur) { msg.textContent = 'Pilih dulu bungkus obatnya.'; return; }
        const p = packs[+cur.dataset.i], ok = s.dataset.p === cur.dataset.to;
        if (ok) { pts++; Sound.ok(); msg.innerHTML = p.bad ? `⭕ Itu obat <b>${esc(p.time)}</b> (${tId[p.time]}), bukan sekarang. Dikembalikan & dilaporkan.` : `⭕ ${esc(p.to)} さん: 「おくすり です。おみず と いっしょ に どうぞ。」`; if (!p.bad) speak('おくすり です。おみず と いっしょ に どうぞ。'); }
        else { Sound.bad(); W.react(false); msg.innerHTML = `❌ <b>ごやく</b> (salah obat)! Bungkus itu untuk <b>${p.bad ? 'dikembalikan (bukan waktunya)' : esc(p.to) + ' さん'}</b>. Salah obat bisa membahayakan nyawa.`; }
        cur.classList.add('done', ok ? 'good' : 'wrong'); cur.classList.remove('sel'); cur = null; gone++;
        if (gone >= packs.length) setTimeout(d, 700);
      });
    });
    // menolak minum obat
    B.innerHTML = head('Penghuni menolak minum obat', `${esc(ppl[0])} さん: 「この くすり、のみたく ない…」 Kamu…`) + `<div class="ws-opts">${optHtml([{ jp: 'そう です か。むり に は のませません。かんごし に そうだん します ね。', ro: '' }, { jp: 'ごはん に まぜて こっそり のませます。', ro: '' }, { jp: 'のまない と だめ！', ro: '' }])}</div>`;
    const r = await choose(B, '.ws-o'); if (r.ok) { pts++; W.react(true); } else { W.react(false); B.insertAdjacentHTML('beforeend', '<p class="kj-msg small">Jangan memaksa atau mencampur obat diam-diam. Hormati, lalu konsultasikan ke perawat.</p>'); await K.done1(W); }
    return pts / max;
  }

  /* =========================================================
     🏗 GENBA · 玉掛け合図 (aba-aba crane)
     ゴーヘイ = naik, スラー = turun, ストップ = berhenti.
     地切り (angkat sedikit lalu berhenti sejenak), jangan ada orang di
     bawah beban (吊り荷の下に入るな), lewati penghalang, turunkan tepat.
     ========================================================= */
  async function taskCrane(W, st) {
    const B = W.box, WALL = { x: st.wallX || 140, w: 26, h: st.wallH || 44 }, TX = st.tx || 262, GROUND = 106, R0 = relax();
    B.innerHTML = head(st.title || 'たまかけ · Pandu crane dengan aba-aba', '① Angkat sedikit → <b>ストップ</b> (地切り) ② naik lewati dinding ③ geser ④ turunkan di kotak kuning. Orang di bawah beban → <b>たいひ！</b>') +
      `<div class="kj-crane"><button type="button" data-c="up">⬆<span class="jp">ゴーヘイ</span></button><button type="button" data-c="down">⬇<span class="jp">スラー</span></button><button type="button" data-c="left">⬅<span class="jp">ひだり</span></button><button type="button" data-c="right">➡<span class="jp">みぎ</span></button><button type="button" data-c="stop" class="stop">✋<span class="jp">ストップ</span></button><button type="button" data-c="evac" class="evac">📣<span class="jp">たいひ！</span></button></div><p class="kj-msg small"></p>`;
    const P = K.pad(W, 320, 124, 'crane'); B.insertBefore(P.c, B.querySelector('.kj-crane'));
    const msg = B.querySelector('.kj-msg');
    const s = { x: 46, h: 0, cmd: 'stop', phase: 'jikiri', miss: 0, man: null, manT: 2500 + Math.random() * 6000, landed: false, t: 0 };
    B._crane = s;
    const VO = { up: 'ゴーヘイ', down: 'スラー', stop: 'ストップ', left: 'ひだり へ', right: 'みぎ へ', evac: 'つりに の した から はなれて！' };
    const draw = () => {
      const c = P.ctx; c.fillStyle = '#cfe3f2'; c.fillRect(0, 0, 320, 124); c.fillStyle = '#d8c79a'; c.fillRect(0, GROUND, 320, 18);
      c.fillStyle = '#f6c90e'; c.fillRect(TX - 18, GROUND - 3, 36, 5);
      c.fillStyle = '#8a9aa8'; c.fillRect(WALL.x, GROUND - WALL.h, WALL.w, WALL.h);
      c.strokeStyle = '#555'; c.lineWidth = 3; c.beginPath(); c.moveTo(0, 8); c.lineTo(320, 8); c.stroke();
      const ly = GROUND - 16 - s.h;
      c.lineWidth = 1.5; c.beginPath(); c.moveTo(s.x, 8); c.lineTo(s.x, ly - 10); c.moveTo(s.x, ly - 10); c.lineTo(s.x - 12, ly); c.moveTo(s.x, ly - 10); c.lineTo(s.x + 12, ly); c.stroke();
      c.fillStyle = st.color || '#b5651d'; c.fillRect(s.x - 16, ly, 32, 16); if (st.load) Emo.draw(c, st.load, s.x, ly + 8, 14);
      if (s.man) Emo.draw(c, '👷', s.man.x, GROUND - 10, 22);
      c.fillStyle = '#222'; c.font = '11px sans-serif'; c.fillText(`${(s.h / 20).toFixed(1)}m`, 4, 22);
    };
    const hitWall = () => s.x + 16 > WALL.x && s.x - 16 < WALL.x + WALL.w && s.h < WALL.h;
    const stop = W.watch('あいず は おおきな こえ で！');
    const res = await new Promise(done => {
      let last = 0, raf = 0, end = false;
      const fin = () => { if (end) return; end = true; cancelAnimationFrame(raf); done(); };
      const cmd = c => {
        if (c === 'evac') { if (s.man) { s.man.go = true; Sound.ok(); msg.textContent = '📣 Pekerja menjauh dari bawah beban. ⭕'; } else { Sound.blip(); } speak(VO.evac); W.bubble('you', `<b class="jp">たいひ！</b>`); return; }
        s.cmd = c; speak(VO[c]); W.bubble('boss', `<b class="jp">${VO[c]}！</b>`); Sound.blip();
        buttons(B, '[data-c]').forEach(b => b.classList.toggle('on', b.dataset.c === c && c !== 'stop'));
        if (c === 'stop' && s.phase === 'jikiri' && s.h > 0) {
          if (s.h <= 24) { s.phase = 'move'; Sound.ok(); msg.innerHTML = '⭕ <b>じきり、いったん ていし</b>: beban seimbang, aman. Lanjutkan.'; say(W, 'boss', 'よし、まきあげ！'); }
        }
      };
      buttons(B, '[data-c]').forEach(b => b.onclick = () => cmd(b.dataset.c));
      B._cmd = cmd;
      const loop = t => {
        if (end || !P.c.isConnected) return fin();
        const dt = last ? Math.min(.05, (t - last) / 1000) : 0; last = t; s.t += dt * 1000;
        const v = 34 * dt;
        if (s.cmd === 'up') s.h = Math.min(78, s.h + v);
        if (s.cmd === 'down') s.h = Math.max(0, s.h - v);
        if (s.cmd === 'left') s.x = Math.max(20, s.x - v);
        if (s.cmd === 'right') s.x = Math.min(300, s.x + v);
        if (s.phase === 'jikiri' && s.h > 24) { s.phase = 'move'; s.miss++; Sound.bad(); msg.innerHTML = '❌ Lupa <b>地切り</b>: angkat sedikit lalu ストップ dulu untuk cek keseimbangan beban.'; }
        if (hitWall()) { s.miss++; Sound.bad(); W.react(false); s.cmd = 'stop'; s.x += s.x < WALL.x ? -10 : 10; msg.textContent = '❌ Beban menabrak dinding! Naikkan lebih tinggi dulu (ゴーヘイ).'; }
        // pekerja lewat di bawah
        if (!s.man && s.phase !== 'jikiri' && s.t > s.manT && !s.manDone) { s.man = { x: 318, go: false, t: 0 }; say(W, 'boss', 'あ、ひと が くる！'); }
        if (s.man) {
          s.man.x += (s.man.go ? 60 : -28) * dt; s.man.t += dt * 1000;
          const under = Math.abs(s.man.x - s.x) < 22 && s.h > 0;
          if (under && !s.man.go && !s.man.warned) { s.man.underT = (s.man.underT || 0) + dt * 1000; if (s.man.underT > 1200) { s.man.warned = true; s.miss++; Sound.bad(); W.react(false); msg.innerHTML = '❌ Ada orang <b>di bawah beban</b>! Teriak 「たいひ！」 dan hentikan crane.'; } }
          if (s.man.x < -20 || s.man.x > 340) { s.man = null; s.manDone = true; }
        }
        // mendarat
        if (s.h === 0 && s.cmd === 'down' && s.phase !== 'jikiri') {
          s.cmd = 'stop';
          if (Math.abs(s.x - TX) <= 16) { s.landed = true; Sound.ok(); msg.innerHTML = '⭕ Mendarat tepat. <b>ちゃくしょう、ヨシ！</b>'; draw(); setTimeout(fin, 700); return; }
          if (s.x > 60) { s.miss++; Sound.bad(); msg.textContent = '❌ Posisi meleset dari kotak kuning. Angkat lagi dan geser.'; }
        }
        if (!R0 && s.t > (st.limit || 90000)) { msg.textContent = '⏰ Waktu habis.'; s.miss++; return fin(); }
        draw(); raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      B._auto = async () => {
        const until = async f => { for (let i = 0; i < 600 && !f() && !end; i++) { if (s.man && !s.man.go && Math.abs(s.man.x - s.x) < 60) cmd('evac'); await sleep(30); } };
        cmd('up'); await until(() => s.h >= 12); cmd('stop'); await sleep(150);
        cmd('up'); await until(() => s.h >= WALL.h + 12); cmd('right'); await until(() => s.x >= TX); cmd('stop'); await sleep(100);
        cmd('down'); await until(() => s.landed);
      };
    });
    stop();
    const sc = Math.max(0, Math.min(1, (B._crane.landed ? 1 : .3) - B._crane.miss * .2));
    W.react(sc >= .8);
    return sc;
  }

  /* =========================================================
     🪝 GENBA · フルハーネス 2丁掛け di perancah
     Selalu ada minimal satu kait yang terpasang (ノーフック禁止).
     Pasang kait baru di depan dulu, baru lepas kait lama.
     ========================================================= */
  async function taskHarness(W, st) {
    const B = W.box, N = st.n || 6;
    const s = { p: 0, A: null, B: null, miss: 0, moves: 0 };
    B._h = s;
    B.innerHTML = head(st.title || 'フルハーネス · Jalan di perancah dengan 2 kait', 'Kait hanya bisa dipasang di tiang <b>tempat kamu berdiri</b>. Untuk maju: pasang kait di tiang ini dulu. Jangan pernah melepas kait terakhir (ノーフック)!') +
      `<div class="kj-scaf"></div>
      <div class="kj-hooks"><button type="button" data-k="A">🪝 A</button><button type="button" data-k="B">🪝 B</button><button type="button" data-k="go" class="go">➡ すすむ</button></div><p class="kj-msg small"></p>`;
    const scaf = B.querySelector('.kj-scaf'), msg = B.querySelector('.kj-msg');
    const paint = () => {
      scaf.innerHTML = Array.from({ length: N + 1 }, (_, i) => `<div class="kj-post${i === s.p ? ' me' : ''}"><span class="kj-anc">⚓</span>${s.A === i ? '<i class="ha">A</i>' : ''}${s.B === i ? '<i class="hb">B</i>' : ''}${i === s.p ? '<b>🧗</b>' : ''}<small>${i === N ? 'ゴール' : i}</small></div>`).join('');
      buttons(B, '[data-k=A],[data-k=B]').forEach(b => { const v = s[b.dataset.k]; b.innerHTML = `🪝 ${b.dataset.k}<small>${v == null ? 'lepas → ketuk: かける' : `tiang ${v} → ketuk: はずす`}</small>`; b.classList.toggle('on', v != null); });
    };
    paint();
    say(W, 'boss', 'フック を かけて から うごけ。ノーフック は ぜったい だめ！');
    const stop = W.watch('あたらしい フック を かけて から、ふるい の を はずす。');
    await new Promise(d => {
      const act = k => {
        if (k === 'go') {
          const ok = s.A === s.p || s.B === s.p;
          if (!ok) { s.miss++; Sound.bad(); W.react(false); msg.innerHTML = '❌ <b>ノーフック</b>! Belum ada kait di tiang ini. Kalau tergelincir, kamu jatuh. Pasang kait dulu.'; say(W, 'boss', 'まて！フック かけろ！'); return; }
          s.p++; s.moves++; Sound.blip(); msg.textContent = '';
          if ((s.A != null && s.A < s.p - 1) || (s.B != null && s.B < s.p - 1)) { /* kait tertinggal: tali tidak cukup panjang */ }
          if (s.p >= N) { paint(); Sound.ok(); msg.innerHTML = '⭕ Sampai tujuan dengan selalu terkait. <b>フック、ヨシ！</b>'; setTimeout(d, 700); return; }
        } else {
          const other = k === 'A' ? 'B' : 'A';
          if (s[k] == null) { s[k] = s.p; Sound.ok(); speak('フック、よし！'); W.bubble('you', '<b class="jp">フック、ヨシ！</b>'); }
          else {
            if (s[other] == null) { s.miss++; Sound.bad(); W.react(false); msg.innerHTML = '❌ Itu kait terakhir! Melepasnya = ノーフック. Pasang kait lain dulu.'; return; }
            s[k] = null; Sound.blip();
          }
          if ((s.A != null && s.p - s.A > 1) || (s.B != null && s.p - s.B > 1)) msg.textContent = 'Kait tertinggal jauh di belakang: talinya tidak sampai. Pindahkan ke tiang ini.';
        }
        // kait yang tertinggal >1 tiang dianggap tidak menahan
        if (s.A != null && s.p - s.A > 1) s.A = null;
        if (s.B != null && s.p - s.B > 1) s.B = null;
        paint();
      };
      buttons(B, '[data-k]').forEach(b => b.onclick = () => act(b.dataset.k));
      B._act = act;
      B._auto = async () => {
        while (s.p < N) {
          const free = s.A == null ? 'A' : s.B == null ? 'B' : (s.A < s.B ? 'A' : 'B');
          if (s.A !== s.p && s.B !== s.p) { if (s.A != null && s.B != null) act(free); act(free); await sleep(60); }
          const old = s.A !== s.p ? 'A' : s.B !== s.p ? 'B' : null;
          if (old && s[old] != null) { act(old); await sleep(60); }
          act('go'); await sleep(80);
        }
      };
    });
    stop();
    const sc = Math.max(0, 1 - s.miss * .25);
    W.react(sc >= .75);
    return sc;
  }

  /* =========================================================
     🚚 GENBA · 誘導 (memandu truk mundur)
     「オーライ、オーライ」 = terus, 「ストップ！」 = berhenti.
     Hentikan segera kalau ada orang lewat di belakang truk.
     ========================================================= */
  async function taskYudo(W, st) {
    const B = W.box, LINE = 250, R0 = relax();
    B.innerHTML = head(st.title || 'ゆうどう · Pandu truk mundur', 'Ketuk <b>オーライ</b> berulang → truk mundur. <b>ストップ</b> saat belakang truk di zona hijau. Ada orang lewat → langsung ストップ!') +
      `<div class="kj-yudo"><button type="button" class="go" data-y="ok">🙌 オーライ</button><button type="button" class="stop" data-y="stop">✋ ストップ！</button></div><p class="kj-msg small"></p>`;
    const P = K.pad(W, 320, 120, 'yudo'); B.insertBefore(P.c, B.querySelector('.kj-yudo'));
    const msg = B.querySelector('.kj-msg');
    const s = { x: 40, go: 0, miss: 0, man: null, manT: 1500 + Math.random() * 3500, parked: false, t: 0, crash: false };
    B._y = s;
    const draw = () => {
      const c = P.ctx; c.fillStyle = '#d8c79a'; c.fillRect(0, 0, 320, 120);
      c.fillStyle = 'rgba(91,179,160,.45)'; c.fillRect(LINE - 12, 20, 22, 80); c.fillStyle = '#e0475f'; c.fillRect(LINE + 18, 16, 6, 88);
      c.save(); c.translate(s.x, 60); Emo.draw(c, st.truck || '🚚', -26, 0, 52); c.restore();
      if (s.man) Emo.draw(c, '🚶', s.man.x, s.man.y, 24);
      Emo.draw(c, '🦺', 300, 104, 20);
    };
    const stop = W.watch('オーライ、オーライ … ストップ！');
    await new Promise(done => {
      let last = 0, raf = 0, end = false;
      const fin = () => { if (end) return; end = true; cancelAnimationFrame(raf); done(); };
      const y = k => {
        if (end) return;
        if (k === 'ok') { s.go = 900; speak('オーライ'); W.bubble('you', '<b class="jp">オーライ、オーライ！</b>'); Sound.blip(); if (s.man && !s.man.gone) { s.miss++; Sound.bad(); W.react(false); msg.innerHTML = '❌ Ada orang di belakang truk! Jangan オーライ, tapi ストップ.'; } return; }
        s.go = 0; speak('ストップ'); W.bubble('you', '<b class="jp">ストップ！</b>');
        if (s.man && !s.man.gone) { Sound.ok(); s.man.saved = true; msg.textContent = '⭕ Truk berhenti, orangnya lewat dengan aman.'; return; }
        const back = s.x + 26;
        if (Math.abs(back - LINE) <= 12) { s.parked = true; Sound.ok(); msg.innerHTML = '⭕ Berhenti tepat di posisi. 「ストップ、ヨシ！」'; setTimeout(fin, 700); }
        else if (back < LINE - 12) msg.textContent = 'Masih terlalu jauh dari posisi. Lanjutkan オーライ.';
      };
      buttons(B, '[data-y]').forEach(b => b.onclick = () => y(b.dataset.y));
      B._cmd = y;
      const loop = t => {
        if (end || !P.c.isConnected) return fin();
        const dt = last ? Math.min(.05, (t - last) / 1000) : 0; last = t; s.t += dt * 1000;
        if (s.go > 0) { s.go -= dt * 1000; s.x += 38 * dt; }
        if (!s.man && !s.manDone && s.t > s.manT && s.x > 90) s.man = { x: s.x + 50, y: 112, gone: false };
        if (s.man) {
          s.man.y -= 30 * dt;
          if (s.go > 0 && Math.abs(s.man.x - (s.x + 26)) < 30) s.man.near = (s.man.near || 0) + dt * 1000;   // beri waktu reaksi ±1 detik
          if (s.man.near > 1000 && !s.man.hit) { s.man.hit = true; s.miss++; Sound.bad(); W.react(false); msg.innerHTML = '❌ Truk tetap mundur saat ada orang! Langsung 「ストップ！」.'; }
          if (s.man.y < 6) { s.man.gone = true; s.man = null; s.manDone = true; say(W, 'boss', 'よし、つづけて。'); }
        }
        if (s.x + 26 > LINE + 18 && !s.crash) { s.crash = true; s.miss++; s.go = 0; Sound.bad(); W.react(false); msg.textContent = '❌ Kelewatan! Truk menabrak batas. Hentikan lebih awal.'; s.x = LINE - 34; }
        if (!R0 && s.t > (st.limit || 60000)) { msg.textContent = '⏰ Waktu habis.'; s.miss++; return fin(); }
        draw(); raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      B._auto = async () => {
        for (let i = 0; i < 800 && !s.parked && !end; i++) {
          if (s.man) { if (s.go > 0 || !s.man.saved) y('stop'); await sleep(40); continue; }
          if (Math.abs(s.x + 26 - LINE) <= 6) { y('stop'); await sleep(40); continue; }
          if (s.go < 200) y('ok');
          await sleep(40);
        }
      };
    });
    stop();
    const sc = Math.max(0, Math.min(1, (s.parked ? 1 : .3) - s.miss * .25));
    W.react(sc >= .75);
    return sc;
  }

  /* =========================================================
     🗑 Memilah ke tempat yang benar (bins)
     Genba: 産業廃棄物の分別 · Kaigo: cucian kotor/menular, dll.
     st.bins: [[key, emoji, jp, id]]  st.items: [[emoji, jp, id, key, why]]
     ========================================================= */
  async function taskBins(W, st) {
    const B = W.box, items = shuffle(st.items).slice(0, st.count || st.items.length);
    let ok = 0;
    B.innerHTML = head(st.title, st.hint || 'Lihat barangnya, lalu ketuk tempat yang benar.') +
      `<div class="kj-item"></div><div class="kj-binrow">${st.bins.map(([k, e, jp, id]) => `<button class="kj-bin" type="button" data-b="${k}"><b>${e}</b><span class="jp">${esc(jp)}</span><small>${esc(id)}</small></button>`).join('')}</div>
      <div class="kj-timer">✅ <b class="ok">0</b> / ${items.length}</div><p class="kj-msg small"></p>`;
    const box = B.querySelector('.kj-item'), msg = B.querySelector('.kj-msg'), okEl = B.querySelector('.ok');
    const stop = W.watch(st.watch || 'よく みて わけて ね。');
    for (const [e, jp, id, key, why] of items) {
      box.innerHTML = `<b>${e}</b><span class="jp">${esc(jp)}</span><small>${esc(id)}</small>`; B.dataset.ans = key;
      const k = await new Promise(d => buttons(B, '.kj-bin').forEach(b => b.onclick = () => d(b.dataset.b)));
      const good = k === key, bin = st.bins.find(x => x[0] === key);
      if (good) { ok++; Sound.ok(); } else { Sound.bad(); W.emote('boss', '💦'); }
      okEl.textContent = ok;
      msg.innerHTML = `${good ? '⭕' : '❌'} <b class="jp">${esc(jp)}</b> → ${bin[1]} <b class="jp">${esc(bin[2])}</b>${why ? ` · ${esc(why)}` : ''}`;
      B.querySelector(`.kj-bin[data-b="${key}"]`).classList.add('flash'); await sleep(good ? 650 : 1500);
      B.querySelectorAll('.kj-bin').forEach(x => x.classList.remove('flash'));
    }
    stop();
    const sc = ok / items.length; W.react(sc >= .8);
    return sc;
  }

  /* =========================================================
     🔩 GENBA · 鉄筋結束 & ピッチ (ikat tulangan besi & cek jarak)
     Tahan di setiap persilangan untuk mengikat dengan ハッカー,
     lalu temukan besi yang jaraknya tidak sesuai gambar (@200).
     ========================================================= */
  async function taskRebar(W, st) {
    const B = W.box, COLS = 5, ROWS = 3, off = 1 + (Math.random() * 3 | 0);   // indeks batang yang salah jarak
    const xs = Array.from({ length: COLS }, (_, i) => 40 + i * 60 + (i === off ? 18 : 0)), ys = [30, 70, 110];
    B.innerHTML = head(st.title || 'てっきん · Ikat tulangan besi', '1) <b>Tahan</b> di setiap persilangan merah untuk mengikat dengan kawat (ハッカー で けっそく). 2) Lalu cek jarak (ピッチ) dengan meteran.') +
      `<div class="kj-timer">🔩 <b class="ok">0</b> / ${COLS * ROWS}</div><p class="kj-msg small"></p>`;
    const P = K.pad(W, 320, 140, 'rebar'); B.insertBefore(P.c, B.querySelector('.kj-timer'));
    const tied = new Set(), msg = B.querySelector('.kj-msg'), okEl = B.querySelector('.ok');
    P.c.dataset.pts = JSON.stringify(xs.flatMap(x => ys.map(y => [x, y])));
    let prog = null, showPitch = false;
    const draw = () => {
      const c = P.ctx; c.fillStyle = '#c9c2b0'; c.fillRect(0, 0, 320, 140);
      c.strokeStyle = '#7a4a2a'; c.lineWidth = 4;
      xs.forEach(x => { c.beginPath(); c.moveTo(x, 10); c.lineTo(x, 130); c.stroke(); });
      ys.forEach(y => { c.beginPath(); c.moveTo(10, y); c.lineTo(310, y); c.stroke(); });
      xs.forEach(x => ys.forEach(y => { const k = x + ',' + y; c.fillStyle = tied.has(k) ? '#3b8a78' : '#e0475f'; c.beginPath(); c.arc(x, y, tied.has(k) ? 5 : 6, 0, 7); c.fill(); }));
      if (prog) { c.strokeStyle = '#ffd24a'; c.lineWidth = 3; c.beginPath(); c.arc(prog.x, prog.y, 12, -Math.PI / 2, -Math.PI / 2 + prog.k * Math.PI * 2); c.stroke(); }
      if (showPitch) { c.fillStyle = '#222'; c.font = 'bold 10px sans-serif'; for (let i = 1; i < COLS; i++) c.fillText(String(Math.round((xs[i] - xs[i - 1]) / 60 * 200)), (xs[i] + xs[i - 1]) / 2 - 10, 136); }
    };
    draw();
    const stop = W.watch('けっそく は しっかり、ぜんぶ の こうてん！');
    // 1) ikat semua persilangan
    await new Promise(d => {
      let raf = 0;
      const tie = (x, y) => { tied.add(x + ',' + y); okEl.textContent = tied.size; Sound.blip(); if (tied.size >= COLS * ROWS) { Sound.ok(); setTimeout(d, 300); } };
      P.c.onpointerdown = e => {
        e.preventDefault(); const [px, py] = P.pos(e);
        const x = xs.find(v => Math.abs(v - px) < 16), y = ys.find(v => Math.abs(v - py) < 16);
        if (x == null || y == null || tied.has(x + ',' + y)) return;
        let t0 = 0; prog = { x, y, k: 0 };
        const tick = t => { if (!t0) t0 = t; prog.k = Math.min(1, (t - t0) / 450); draw(); if (prog.k >= 1) { tie(x, y); prog = null; draw(); return; } raf = requestAnimationFrame(tick); };
        raf = requestAnimationFrame(tick);
      };
      P.c.onpointerup = P.c.onpointerleave = () => { cancelAnimationFrame(raf); if (prog) { prog = null; draw(); msg.textContent = 'Tahan sedikit lebih lama sampai lingkaran penuh (putar ハッカー).'; } };
      B._tieAll = () => xs.forEach(x => ys.forEach(y => { if (!tied.has(x + ',' + y)) tie(x, y); }));
    });
    P.c.onpointerdown = P.c.onpointerup = P.c.onpointerleave = null;
    // 2) cek jarak
    showPitch = true; draw();
    msg.innerHTML = 'Gambar kerja: <b>@200</b> (jarak 200 mm). Ketuk batang tegak yang posisinya <b>salah</b>.';
    say(W, 'boss', 'ピッチ を スケール で かくにん しろ。');
    B.dataset.off = off;
    const pick = await new Promise(d => { P.c.onpointerdown = e => { const [px] = P.pos(e), i = xs.findIndex(v => Math.abs(v - px) < 18); if (i >= 0) d(i); }; B._pick = d; });
    P.c.onpointerdown = null;
    stop();
    const good = pick === off;
    (good ? Sound.ok : Sound.bad)(); W.react(good);
    msg.innerHTML = good ? '⭕ Benar. Batang itu digeser ke posisi @200, lalu diikat ulang. 「ピッチ、ヨシ！」' : `❌ Batang yang salah adalah nomor ${off + 1} dari kiri (jaraknya ${Math.round((xs[off] - xs[off - 1]) / 60 * 200)} mm).`;
    await K.done1(W);
    return good ? 1 : .5;
  }

  /* ---------- daftarkan ---------- */
  Object.assign(Kerja.TASKS, { vital: taskVital, talk: taskTalk, dress: taskDress, skin: taskSkin, meds: taskMeds, crane: taskCrane, harness: taskHarness, yudo: taskYudo, bins: taskBins, rebar: taskRebar });
  Object.assign(Kerja.TASK_START, { vital: 'バイタル を はかりましょう。', talk: 'はなし を きいて あげて。', dress: 'きがえ を てつだって。', skin: 'たいい へんかん の じかん です。', meds: 'おくすり の じかん です。', crane: 'あいず を たのむ！', harness: 'フック を わすれる な！', yudo: 'ゆうどう を たのむ！', bins: 'ぶんべつ して。', rebar: 'けっそく を たのむ。' });
  Object.assign(Kerja.TASK_CAT, { vital: 'horenso', talk: 'kotoba', dress: 'seikaku', skin: 'anzen', meds: 'anzen', crane: 'anzen', harness: 'anzen', yudo: 'anzen', bins: 'seikaku', rebar: 'seikaku' });
  Kerja.HEAVY.push('vital', 'dress', 'skin', 'meds', 'crane', 'harness', 'yudo', 'bins', 'rebar', 'talk');
})();
