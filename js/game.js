/* =========================================================
   ALUR GAME
   Setiap hari: pagi (sapa teman) → kelas → sepulang sekolah → tidur
   ========================================================= */
const Game = (() => {
  const PLACE = { gate: 'gerbang sekolah', home_front: 'depan rumahmu', park: 'taman', konbini: 'depan konbini', river: 'tepi sungai' };
  const PHASE = { morning: 'Pagi', lesson: 'Sekolah', break: 'Sore', sleep: 'Malam' };
  const FRIENDS = ['yuki', 'kenta'];
  let busy = false, autoGoto = false;

  const day = () => DAYS[Save.d.day - 1];
  const shuffle = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [b[i], b[j]] = [b[j], b[i]]; } return b; };
  const pickOne = a => a[Math.random() * a.length | 0];
  const nameOf = id => CHARACTERS[id].name;

  /* ---------- siapa berdiri di mana ---------- */
  function npcsFor(mapId) {
    const d = day(), step = Save.d.step, S = MAPS[mapId].spots, list = [];
    if (mapId === 'town') {
      list.push({ id: 'obaa', x: S.obaa[0], y: S.obaa[1], dir: 'right' });
      list.push({ id: 'tenin', x: S.tenin[0], y: S.tenin[1], dir: 'down' });
      list.push({ id: 'kid', x: S.kid[0], y: S.kid[1], dir: 'down' });
      list.push({ id: 'ojii', x: S.ojii[0], y: S.ojii[1], dir: 'left' });
      if (d && (step === 'morning' || step === 'break')) {
        const sc = step === 'morning' ? d.morning : d.brk;
        const [x, y] = S[sc.at];
        list.push({ id: sc.npc, x, y, dir: 'down', marker: true, script: sc, idle: true });
        if (sc.with) list.push({ id: sc.with, x: x + 1, y, dir: 'down', script: sc, idle: true });
      }
    }
    if (mapId === 'class') {
      list.push({ id: 'sensei', x: 5, y: 2, dir: 'down', marker: !!(d && step === 'lesson') });
      if (d && step === 'lesson') {
        list.push({ id: 'yuki', x: S.yuki[0], y: S.yuki[1], dir: 'up' });
        list.push({ id: 'kenta', x: S.kenta[0], y: S.kenta[1], dir: 'up' });
      }
    }
    return list;
  }

  /* ---------- tugas saat ini ---------- */
  function objective() {
    const d = day(), step = Save.d.step;
    if (!d) return { text: 'Bab 1 selesai! Latihan bebas di meja belajar', map: 'home', tile: [6, 2] };
    if (step === 'morning') return { text: `Sapa ${nameOf(d.morning.npc)} di ${PLACE[d.morning.at]}`, map: 'town', tile: MAPS.town.spots[d.morning.at] };
    if (step === 'lesson') return { text: 'Masuk kelas, temui Tanaka-sensei', map: 'class', tile: [5, 2] };
    if (step === 'break') return { text: `Temui ${nameOf(d.brk.npc)} di ${PLACE[d.brk.at]}`, map: 'town', tile: MAPS.town.spots[d.brk.at] };
    return { text: 'Pulang dan tidur di kamarmu', map: 'home', tile: [2, 3] };
  }

  function refreshHud() {
    const d = day();
    UI.setDay(d ? `Hari ${Save.d.day} · ${PHASE[Save.d.step]}` : 'Libur');
    UI.setObjective(objective().text, () => { if (!busy) gotoObjective(); });
  }

  // Ketuk teks tugas = berjalan otomatis ke tujuan
  function gotoObjective() {
    const o = objective(), here = World.map;
    autoGoto = true;
    if (o.map === here) { autoGoto = false; World.walkTo(o.tile[0], o.tile[1]); return; }
    if (here !== 'town') { const w = MAPS[here].warps[0]; World.walkTo(w.x, w.y); return; }
    if (o.map === 'home') World.walkTo(4, 10); else World.walkTo(13, 5);
  }
  const cancelAuto = () => { autoGoto = false; };

  /* ---------- percakapan ---------- */
  async function runLines(lines, cast) {
    for (const line of lines) {
      if (line.q) await question(line, cast);
      else await UI.say(line);
    }
  }

  async function question(line, cast) {
    let order = shuffle(line.o.map((_, i) => i));
    const friends = cast.filter(c => FRIENDS.includes(c));
    let first = true;
    for (;;) {
      const i = await UI.choose(line.q, order.map(j => ({ jp: UI.fmt(line.o[j].jp), ro: UI.fmt(line.o[j].ro) })));
      const o = line.o[order[i]];
      // jawaban salah dihapus dari pilihan berikutnya, jadi pemain tidak pernah buntu
      if (!o.ok) order = order.filter((_, x) => x !== i);
      if (o.ok) {
        Sound.ok();
        if (first && friends.length) {
          friends.forEach(f => Save.d.friends[f]++); Save.write();
          setTimeout(() => { Sound.heart(); UI.toast(`♥ ${friends.map(nameOf).join(' & ')} senang!`); }, 350);
        }
        if (Save.d.settings.voice) await Promise.race([Sound.speak(UI.fmt(o.jp)), UI.sleep(2600)]);
        return;
      }
      Sound.bad(); first = false;
      const who = friends[0] || cast[0];
      await UI.say(who ? { w: who, e: 'sad', t: o.why } : { n: o.why });
    }
  }

  async function talk(npc) {
    const d = day(), step = Save.d.step;
    // teman yang sedang ditunggu (tugas hari ini)
    if (npc.script && d) {
      const sc = npc.script;
      const cast = [sc.npc, sc.with].filter(Boolean);
      await runLines(sc.lines, cast);
      UI.hideDialog();
      Save.d.step = step === 'morning' ? 'lesson' : 'sleep';
      Save.write();
      World.setNpcs(npcsFor(World.map));
      refreshHud();
      UI.toast(`Tugas selesai! ▶ ${objective().text}`);
      return;
    }
    if (npc.id === 'sensei') {
      if (d && step === 'lesson') return classTime();
      if (!d) return runLines([{ w: 'sensei', e: 'happy', t: 'Selamat, kamu sudah menguasai semua hiragana! Katakana kita pelajari di Bab 2, ya.' }], ['sensei']);
      if (step === 'morning') return runLines([{ w: 'sensei', t: `Pelajaran belum dimulai. ${nameOf(d.morning.npc)} menunggumu di ${PLACE[d.morning.at]}.` }], ['sensei']);
      return runLines([{ w: 'sensei', e: 'happy', jp: 'また あした。', ro: 'mata ashita.', id: 'Sampai besok.' }, { w: 'sensei', t: 'Pelajaran hari ini sudah selesai. Jangan lupa mengulang di rumah!' }], ['sensei']);
    }
    if (npc.id === 'yuki') return runLines([{ w: 'yuki', t: 'Sst! Sensei sudah mau mulai. Ayo ke depan!' }], ['yuki']);
    if (npc.id === 'kenta') return runLines([{ w: 'kenta', e: 'happy', t: 'Semoga pelajarannya tidak susah… Kamu duluan, ya!' }], ['kenta']);
    const lines = AMBIENT[npc.id];
    if (lines) return runLines(lines[(Save.d.day - 1) % lines.length], [npc.id]);
  }

  /* ---------- di kelas ---------- */
  async function classTime() {
    const d = day(), n = Save.d.day;
    await runLines(d.cls, ['sensei']);
    UI.hideDialog();
    let res;
    if (d.type === 'lesson') {
      await Lesson.teach(d.kana);
      d.kana.forEach(k => { if (!Save.d.kana.includes(k)) Save.d.kana.push(k); });
      Save.write();
      UI.closePanel();
      await UI.say({ w: 'sensei', e: 'happy', t: 'Bagus! Sekarang latihan soal, ya. Tidak apa-apa kalau salah.' });
      UI.hideDialog();
      const r = await Lesson.quiz({ focus: d.kana, count: 10, title: 'Latihan' });
      const g = await Lesson.results(r, false);
      res = { stars: g.stars, correct: r.correct, total: r.total };
      const react = g.stars === 3 ? { e: 'happy', jp: 'すばらしい！', ro: 'subarashii!', id: 'Luar biasa!' }
        : g.stars === 2 ? { e: 'happy', jp: 'よく できました。', ro: 'yoku dekimashita.', id: 'Bagus sekali.' }
        : { e: 'normal', jp: 'だいじょうぶ。', ro: 'daijoubu.', id: 'Tidak apa-apa. Pelan-pelan saja!' };
      await UI.say({ w: 'sensei', ...react });
    } else {
      const r = await Lesson.quiz({ focus: [], count: d.count, title: d.title });
      const g = await Lesson.results(r, true);
      res = { grade: g.grade, correct: r.correct, total: r.total };
      await UI.say({ w: 'sensei', e: /A/.test(g.grade) ? 'happy' : 'normal', t: /A/.test(g.grade) ? `Nilai ${g.grade}! Hebat sekali!` : `Nilaimu ${g.grade}. Huruf yang salah akan sering muncul di latihan berikutnya.` });
    }
    Save.d.days[n] = res;
    if (!Save.d.phrases.includes(n)) Save.d.phrases.push(n);
    Save.d.step = 'break'; Save.write();
    World.setNpcs(npcsFor('class'));
    await UI.say({ w: 'sensei', t: `Sampai di sini dulu. Sepulang sekolah, ${nameOf(d.brk.npc)} menunggumu di ${PLACE[d.brk.at]}.` });
  }

  /* ---------- di rumah ---------- */
  async function bed() {
    const d = day();
    if (!d) return UI.say({ n: 'Kamu berbaring sebentar… Bab 1 sudah selesai. Coba latihan bebas di meja belajar!' });
    if (Save.d.step !== 'sleep') return UI.say({ n: `Belum mengantuk. Tugasmu: ${objective().text}.` });
    await UI.say({ n: pickOne(NIGHT_LINES) });
    UI.hideDialog();
    await diary(Save.d.day, d);
    await UI.fade(() => {
      Save.d.day++; Save.d.step = 'morning'; Save.write();
      World.load('home', 3, 3, 'left', []);
      refreshHud();
    }, 450);
    if (day()) await dayCard(); else await ending();
  }

  function diary(n, d) {
    const r = Save.d.days[n] || {};
    const result = r.grade ? `<span class="grade-s g-${r.grade.replace('+', 'p')}">${r.grade}</span>` : Lesson.starHtml(r.stars || 0);
    const p = UI.panel(`
      <div class="win diary">
        <div class="w-title">Buku Harian — Hari ${n}</div>
        <div class="muted">${d.title} · ${d.sub}</div>
        ${d.kana ? `<div class="sec"><div class="sec-h">Huruf baru</div><div class="chips">${d.kana.map(k => `<button class="chip" type="button" data-say="${k}"><b>${k}</b><small>${KANA[k].ro}</small></button>`).join('')}</div></div>` : ''}
        <div class="sec"><div class="sec-h">${d.type === 'test' ? 'Nilai ulangan' : 'Latihan'}</div><div>${result} <span class="muted">(${r.correct || 0}/${r.total || 0} benar)</span></div></div>
        <div class="sec"><div class="sec-h">Kalimat hari ini</div><ul class="phr">${d.phrases.map(ph => `<li><button class="say" type="button" data-say="${ph.jp.replace(/[〜~]/g, '')}">♪</button><div><b>${ph.jp}</b><small>${ph.ro} — ${ph.id}</small></div></li>`).join('')}</ul></div>
        <div class="sec"><div class="sec-h">Pertemanan</div><div class="hearts">${FRIENDS.map(f => `<span>${nameOf(f)} <b>♥ ${Save.d.friends[f]}</b></span>`).join('')}</div></div>
        <button class="btn block" data-a="sleep" type="button">Tidur ▶</button>
      </div>`, 'scroll');
    return UI.wait(done => {
      p.querySelectorAll('[data-say]').forEach(b => b.onclick = () => Sound.speak(b.dataset.say));
      p.querySelector('[data-a=sleep]').onclick = () => { Sound.blip(); UI.closePanel(); done(); };
    });
  }

  function dayCard() { const d = day(); return UI.timecard(`Hari ${Save.d.day}`, `${d.title}<br><span class="jp">${d.sub}</span>`); }

  function ending() {
    const learned = Save.d.kana.length;
    const p = UI.panel(`
      <div class="win result">
        <div class="r-title">Selamat!</div>
        <div class="big-jp">ひらがな</div>
        <p>Kamu sudah mempelajari <b>${learned}</b> huruf hiragana dan banyak kalimat sehari-hari.</p>
        <p class="muted">Bab 2: Katakana & konbini — segera hadir.<br>Sementara itu, pakai <b>Latihan Bebas</b> di meja belajar atau menu.</p>
        <button class="btn" type="button">Lanjut ▶</button>
      </div>`, 'center');
    Sound.star();
    return UI.wait(done => { p.querySelector('.btn').onclick = () => { UI.closePanel(); done(); }; });
  }

  async function desk() {
    const m = UI.modal(`
      <div class="w-title">Meja belajar</div>
      <div class="menu-list">
        <button class="mi" data-a="book" type="button">Buku catatan</button>
        <button class="mi" data-a="drill" type="button">Latihan bebas</button>
        <button class="mi ghost" data-a="close" type="button">Tutup</button>
      </div>`);
    const a = await UI.wait(done => m.querySelectorAll('.mi').forEach(b => b.onclick = () => { Sound.blip(); done(b.dataset.a); }));
    UI.closeModal();
    if (a === 'book') await book();
    if (a === 'drill') await drill();
  }

  async function drill() {
    if (Save.d.kana.length < 4) return UI.say({ n: 'Belum cukup huruf untuk latihan bebas. Belajar dulu di sekolah, ya!' });
    const r = await Lesson.quiz({ focus: [], count: 10, title: 'Latihan Bebas' });
    await Lesson.results(r, false);
  }

  async function readSign(s) {
    if (s.kata) return UI.say({ jp: s.text, ro: 'katakana', id: 'Ini katakana: hurufnya belum kamu pelajari. Nanti di Bab 2!' });
    const chars = [...s.text];
    const known = chars.every(c => c === ' ' || Save.d.kana.includes(c));
    const ro = chars.map(c => c === ' ' ? ' ' : Save.d.kana.includes(c) ? KANA[c].ro : '?').join('');
    return UI.say({ jp: s.text, ro, id: known ? `Papan: "${s.note}". Kamu bisa membacanya!` : 'Ada huruf yang belum kamu pelajari (?). Semangat belajar!' });
  }

  /* ---------- interaksi dari dunia ---------- */
  async function interact(t) {
    if (busy) return;
    busy = true; cancelAuto(); World.pause(true);
    try {
      if (t.type === 'npc') await talk(t.npc);
      else if (t.type === 'sign') await readSign(t.sign);
      else if (t.type === 'bed') await bed();
      else if (t.type === 'desk') await desk();
      else if (t.type === 'board') await UI.say({ jp: 'がんばろう！', ro: 'ganbarou!', id: 'Tulisan di papan: "Ayo berjuang!"' });
    } catch (e) { if (!(e && e.abort)) console.error(e); }
    UI.hideDialog(); UI.closePanel();
    busy = false; World.pause(false); refreshHud();
  }

  async function warp(w) {
    busy = true; World.pause(true); Sound.door();
    await UI.fade(() => { World.load(w.to, w.tx, w.ty, w.dir, npcsFor(w.to)); refreshHud(); });
    busy = false; World.pause(false);
    if (autoGoto) setTimeout(gotoObjective, 120);
  }

  async function blocked(door) {
    if (busy) return;
    busy = true; World.pause(true);
    try { await UI.say({ n: door.msg }); } catch (e) {}
    UI.hideDialog(); busy = false; World.pause(false);
  }

  /* ---------- menu ---------- */
  async function menu() {
    if (busy) return;
    busy = true; World.pause(true);
    try {
      for (;;) {
        const m = UI.modal(`
          <div class="w-title">Menu</div>
          <div class="menu-list">
            <button class="mi" data-a="book" type="button">Buku catatan</button>
            <button class="mi" data-a="report" type="button">Rapor</button>
            <button class="mi" data-a="drill" type="button">Latihan bebas</button>
            <button class="mi" data-a="settings" type="button">Pengaturan</button>
            <button class="mi" data-a="title" type="button">Simpan & ke layar judul</button>
            <button class="mi ghost" data-a="close" type="button">Tutup</button>
          </div>`);
        const a = await UI.wait(done => {
          m.querySelectorAll('.mi').forEach(b => b.onclick = () => { Sound.blip(); done(b.dataset.a); });
          Game._menuClose = () => done('close');
        });
        Game._menuClose = null;
        UI.closeModal();
        if (a === 'close') break;
        if (a === 'book') await book();
        if (a === 'report') await report();
        if (a === 'settings') await settings();
        if (a === 'drill') { await drill(); UI.hideDialog(); UI.closePanel(); break; }
        if (a === 'title') { Save.write(); busy = false; World.pause(false); return title(); }
      }
    } catch (e) { if (!(e && e.abort)) console.error(e); }
    UI.hideDialog(); UI.closePanel();
    busy = false; World.pause(false); refreshHud();
  }

  function book(tab = 'kana') {
    const learned = new Set(Save.d.kana);
    const tabs = `<div class="tabs">${[['kana', 'Hiragana'], ['words', 'Kosakata'], ['phrases', 'Kalimat']].map(([k, l]) => `<button class="tab ${k === tab ? 'on' : ''}" data-tab="${k}" type="button">${l}</button>`).join('')}</div>`;
    let body = '';
    if (tab === 'kana') {
      body = `<p class="muted">${learned.size} / 46 huruf dipelajari. Ketuk huruf untuk detail.</p><div class="kgrid">` +
        HIRAGANA_GRID.flat().map(k => {
          if (!k) return '<span class="kc empty"></span>';
          if (!learned.has(k)) return '<span class="kc locked">?</span>';
          const s = Save.d.st[k] || { c: 0, w: 0 }; const acc = s.c + s.w ? s.c / (s.c + s.w) : 0;
          const lv = s.c + s.w === 0 ? '' : acc >= .85 ? 'lv3' : acc >= .6 ? 'lv2' : 'lv1';
          return `<button class="kc ${lv}" data-k="${k}" type="button"><b>${k}</b><small>${KANA[k].ro}</small></button>`;
        }).join('') + '</div><div class="legend"><i class="lv1"></i>perlu latihan <i class="lv2"></i>lumayan <i class="lv3"></i>hafal</div>';
    } else if (tab === 'words') {
      const ws = WORDS.filter(w => [...w.jp].every(c => learned.has(c)));
      body = ws.length ? `<ul class="phr">${ws.map(w => `<li><button class="say" data-say="${w.jp}" type="button">♪</button><div><b>${w.jp}</b><small>${w.ro} — ${w.id}</small></div></li>`).join('')}</ul>` : '<p class="muted">Belum ada kosakata. Pelajari huruf di sekolah dulu.</p>';
    } else {
      const list = Save.d.phrases.slice().sort((a, b) => a - b).flatMap(n => DAYS[n - 1].phrases);
      body = list.length ? `<ul class="phr">${list.map(ph => `<li><button class="say" data-say="${ph.jp.replace(/[〜~]/g, '')}" type="button">♪</button><div><b>${ph.jp}</b><small>${ph.ro} — ${ph.id}</small></div></li>`).join('')}</ul>` : '<p class="muted">Kalimat baru muncul setelah pelajaran di kelas.</p>';
    }
    const p = UI.panel(`<div class="win book"><div class="w-title">Buku Catatan</div>${tabs}<div class="book-body">${body}</div><button class="btn block" data-a="close" type="button">Tutup</button></div>`, 'scroll');
    return UI.wait(done => {
      p.querySelectorAll('.tab').forEach(b => b.onclick = () => { Sound.blip(); done(b.dataset.tab); });
      p.querySelectorAll('[data-say]').forEach(b => b.onclick = () => Sound.speak(b.dataset.say));
      p.querySelectorAll('.kc[data-k]').forEach(b => b.onclick = () => kanaDetail(b.dataset.k));
      p.querySelector('[data-a=close]').onclick = () => { Sound.blip(); done(null); };
    }).then(next => { UI.closePanel(); if (next) return book(next); });
  }

  function kanaDetail(k) {
    const s = Save.d.st[k] || { c: 0, w: 0 };
    const m = UI.modal(`
      <button class="b-kana small" type="button">${k}</button>
      <div class="b-ro dark">${KANA[k].ro}</div>
      <p>${KANA[k].tip}</p>
      <p class="muted">Benar ${s.c} kali · salah ${s.w} kali</p>
      <div class="row"><button class="btn ghost" data-a="say" type="button">♪ Dengar</button><button class="btn" data-a="close" type="button">Tutup</button></div>`, 'detail');
    Sound.speak(k);
    m.querySelector('.b-kana').onclick = () => Sound.speak(k);
    m.querySelector('[data-a=say]').onclick = () => Sound.speak(k);
    m.querySelector('[data-a=close]').onclick = () => UI.closeModal();
  }

  function report() {
    const rows = DAYS.map((d, i) => {
      const n = i + 1, r = Save.d.days[n];
      const res = !r ? '<span class="muted">—</span>' : r.grade ? `<span class="grade-s g-${r.grade.replace('+', 'p')}">${r.grade}</span>` : Lesson.starHtml(r.stars);
      return `<tr class="${n > Save.d.day ? 'lock' : ''}"><td>Hari ${n}</td><td>${d.title}<small>${d.sub}</small></td><td>${res}</td></tr>`;
    }).join('');
    let c = 0, w = 0; Object.values(Save.d.st).forEach(s => { c += s.c; w += s.w; });
    const weak = Object.entries(Save.d.st).filter(([, s]) => s.w > 0).sort((a, b) => (b[1].w / (b[1].c + b[1].w)) - (a[1].w / (a[1].c + a[1].w))).slice(0, 5);
    const p = UI.panel(`
      <div class="win report">
        <div class="w-title">Rapor — ${UI.esc(Save.d.name)}</div>
        <div class="stats">
          <div><b>${Save.d.kana.length}</b><small>huruf</small></div>
          <div><b>${c + w ? Math.round(c / (c + w) * 100) : 0}%</b><small>ketepatan</small></div>
          ${FRIENDS.map(f => `<div><b>♥ ${Save.d.friends[f]}</b><small>${nameOf(f)}</small></div>`).join('')}
        </div>
        ${weak.length ? `<div class="sec"><div class="sec-h">Perlu diulang</div><div class="chips">${weak.map(([k]) => `<button class="chip" data-say="${k}" type="button"><b>${k}</b><small>${KANA[k].ro}</small></button>`).join('')}</div></div>` : ''}
        <table class="tbl">${rows}</table>
        <button class="btn block" type="button">Tutup</button>
      </div>`, 'scroll');
    return UI.wait(done => {
      p.querySelectorAll('[data-say]').forEach(b => b.onclick = () => Sound.speak(b.dataset.say));
      p.querySelector('.btn').onclick = () => { Sound.blip(); UI.closePanel(); done(); };
    });
  }

  function settings() {
    const s = Save.d.settings;
    const tog = (k, label, sub) => `<label class="set"><span>${label}<small>${sub}</small></span><input type="checkbox" data-k="${k}" ${s[k] ? 'checked' : ''}><i class="sw"></i></label>`;
    const p = UI.panel(`
      <div class="win settings">
        <div class="w-title">Pengaturan</div>
        ${tog('romaji', 'Tampilkan romaji', 'Cara baca huruf latin di bawah teks Jepang')}
        ${tog('voice', 'Suara otomatis', 'Kalimat Jepang langsung diucapkan')}
        ${tog('sfx', 'Efek suara', 'Bunyi 8-bit saat memilih')}
        <label class="set col"><span>Kecepatan suara<small>Lebih lambat = lebih jelas</small></span><input type="range" min="0.6" max="1.1" step="0.05" value="${s.rate}" data-k="rate"></label>
        ${Sound.hasJa() ? '' : '<p class="warn">Suara bahasa Jepang tidak ditemukan di perangkat ini. Soal "dengarkan" dilewati. Tambahkan suara Jepang di pengaturan Text-to-Speech perangkatmu.</p>'}
        <button class="btn ghost small" data-a="test" type="button">♪ Tes suara: こんにちは</button>
        <button class="btn danger small" data-a="reset" type="button">Hapus semua progres</button>
        <button class="btn block" data-a="close" type="button">Simpan</button>
      </div>`, 'scroll');
    return UI.wait(done => {
      p.querySelectorAll('input[type=checkbox]').forEach(i => i.onchange = () => { s[i.dataset.k] = i.checked; Save.write(); });
      p.querySelector('input[type=range]').oninput = e => { s.rate = +e.target.value; Save.write(); };
      p.querySelector('[data-a=test]').onclick = () => Sound.speak('こんにちは');
      p.querySelector('[data-a=reset]').onclick = () => {
        if (confirm('Hapus semua progres dan mulai dari awal?')) { Save.reset(); location.reload(); }
      };
      p.querySelector('[data-a=close]').onclick = () => { Sound.blip(); UI.closePanel(); done(); };
    });
  }

  /* ---------- layar judul & mulai ---------- */
  async function title() {
    UI.abortAll(); UI.hideDialog(); UI.closePanel(); UI.closeModal();
    UI.showGame(false);
    World.load('town', 13, 12, 'down', npcsFor('town'));
    World.pause(true);
    const has = Save.hasGame();
    const p = UI.panel(`
      <div class="title">
        <div class="logo">
          <div class="logo-jp">にほんご<span>がっこう</span></div>
          <div class="logo-sub">NIHONGO GAKKOU</div>
        </div>
        <p class="tagline">Jadi murid pindahan di Jepang.<br>Belajar hiragana & percakapan sehari-hari.</p>
        <div class="title-btns">
          ${has ? `<button class="btn" data-a="cont" type="button">Lanjutkan — Hari ${Math.min(Save.d.day, DAYS.length)}</button>` : ''}
          <button class="btn ${has ? 'ghost' : ''}" data-a="new" type="button">${has ? 'Main dari awal' : 'Mulai'}</button>
        </div>
        <div class="ver">Bab 1: Hiragana · 11 hari sekolah</div>
      </div>`, 'title-p');
    const a = await UI.wait(done => p.querySelectorAll('[data-a]').forEach(b => b.onclick = () => { Sound.unlock(); Sound.blip(); done(b.dataset.a); }));
    if (a === 'new') {
      if (has && !confirm('Mulai dari awal? Progres lama akan dihapus.')) return title();
      if (has) Save.reset();
      const name = await askName();
      Save.d.name = name; Save.write();
      UI.closePanel();
      return start(true);
    }
    UI.closePanel();
    return start(false);
  }

  function askName() {
    const p = UI.panel(`
      <div class="win namebox">
        <div class="w-title">Siapa namamu?</div>
        <p class="muted">Nama ini dipakai teman-teman di game.</p>
        <input class="name-in" maxlength="12" autocomplete="off" placeholder="contoh: Rizki">
        <button class="btn block" type="button">Mulai sekolah ▶</button>
      </div>`, 'center');
    const input = p.querySelector('input');
    setTimeout(() => input.focus(), 50);
    return UI.wait(done => {
      const go = () => {
        const v = input.value.replace(/[<>&"'{}]/g, '').trim().slice(0, 12);
        if (!v) { input.classList.add('shake'); setTimeout(() => input.classList.remove('shake'), 400); return; }
        Sound.blip(); done(v);
      };
      p.querySelector('.btn').onclick = go;
      input.onkeydown = e => { if (e.key === 'Enter') { e.stopPropagation(); go(); } };
    });
  }

  async function start(isNew) {
    UI.showGame(true);
    World.resize();
    busy = true;
    try {
      await UI.fade(() => {
        if (World.map !== 'home' || isNew) World.load('home', 3, 3, 'left', []);
        else World.load('home', 3, 3, 'left', []);
        refreshHud();
      });
      if (isNew) {
        await UI.say({ n: 'Musim semi. Kamu baru saja pindah dari Indonesia ke kota kecil di Jepang.' });
        await UI.say({ n: 'Besok hari pertamamu di SMA Sakura, dan kamu belum bisa bahasa Jepang sama sekali…' });
        await UI.say({ n: 'Cara main: ketuk layar untuk berjalan, atau pakai tombol arah. Tekan A atau ketuk orang untuk bicara.' });
        await UI.say({ n: 'Tugasmu selalu tertulis di atas layar. Ketuk tulisan itu untuk berjalan otomatis ke tujuan!' });
        UI.hideDialog();
      }
      if (day()) { if (Save.d.step === 'morning') await dayCard(); }
      else await UI.say({ n: 'Bab 1 sudah selesai. Pakai Latihan Bebas di meja belajar untuk mengulang.' });
    } catch (e) { if (!(e && e.abort)) console.error(e); }
    UI.hideDialog();
    busy = false; World.pause(false); refreshHud();
  }

  return {
    title, interact, warp, blocked, menu, cancelAuto,
    get busy() { return busy; }, _menuClose: null,
  };
})();
