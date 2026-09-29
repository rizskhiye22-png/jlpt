/* =========================================================
   ALUR GAME
   Satu hari: sarapan → berangkat (sapa teman) → pelajaran 1
   → makan siang (pilih tempat) → pelajaran 2 → klub (pilih)
   → sore di kota (teman + misi sampingan) → makan malam → tidur
   ========================================================= */
const Game = (() => {
  const PLACE = { gate: 'gerbang sekolah', home_front: 'depan rumahmu', park: 'taman', konbini: 'depan konbini', river: 'tepi sungai', shrine: 'kuil' };
  const STEP_LABEL = { wake: 'Pagi', commute: 'Pagi', class1: 'Sekolah', class2: 'Sekolah', after: 'Sore', evening: 'Petang', night: 'Malam' };
  const FRIENDS = ['yuki', 'kenta', 'hana'];
  let busy = false, autoGoto = false;

  const day = () => DAYS[Save.d.day - 1];
  const chapter = () => (day() || DAYS[DAYS.length - 1]).chapter;
  const shuffle = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [b[i], b[j]] = [b[j], b[i]]; } return b; };
  const pickOne = a => a[Math.random() * a.length | 0];
  const nameOf = id => CHARACTERS[id].name;
  const S = () => Save.d;
  const q = id => S().quests[id] || {};
  const setQ = (id, v) => { S().quests[id] = Object.assign({}, q(id), v); Save.write(); };
  const todayEvent = () => { const id = EVENT_BY_DAY[S().day]; return id && !(S().events || []).includes(S().day) ? id : null; };
  const questOpen = id => !q(id).state && Save.d.day >= QUESTS[id].from && (QUESTS[id].to ? Save.d.day <= QUESTS[id].to : true);

  function addPoints(n, why) { S().points = (S().points || 0) + n; Save.write(); UI.toast(`🌸 +${n} poin${why ? ' · ' + why : ''}`); }
  function addStamp(id, title) { if (S().stamps.some(s => s.id === id)) return; S().stamps.push({ id, title }); Save.write(); setTimeout(() => UI.toast(`Stempel baru: ${title}`), 900); }
  function heart(ids) {
    ids.forEach(f => { S().friends[f] = (S().friends[f] || 0) + 1; }); Save.write();
    setTimeout(() => { Sound.heart(); UI.toast(`♥ ${ids.map(nameOf).join(' & ')} senang!`); }, 350);
  }

  /* ---------- suasana: cahaya & musik ---------- */
  function mood() {
    const st = S().step, m = World.map;
    const phase = st === 'wake' || st === 'commute' ? 'morning' : st === 'class1' || st === 'class2' ? 'day' : st === 'night' ? 'night' : 'evening';
    World.setWeather && World.setWeather(day() ? weatherFor(S().day) : 'sun');
    World.setPhase(phase);
    let song = 'morning';
    if (m === 'home') song = st === 'night' ? 'night' : 'home';
    else if (m !== 'town') song = (window.Places && Places.song(m)) || 'school';
    else song = phase === 'morning' ? 'morning' : phase === 'night' ? 'night' : (Save.d.day === 22 && st === 'after' ? 'festival' : phase === 'day' ? 'school' : 'evening');
    Music.play(song);
  }

  /* ---------- siapa berdiri di mana ---------- */
  function npcsFor(mapId) {
    const d = day(), st = S().step, SP = MAPS[mapId].spots || {}, list = [];
    const scripted = d && (st === 'commute' ? d.morning : st === 'after' ? d.brk : null);
    const inScript = id => scripted && (scripted.npc === id || scripted.with === id);
    const evId = (st === 'after' || st === 'evening') ? todayEvent() : null;
    const ev = evId ? EVENTS[evId] : null;
    if (mapId === 'town') {
      const amb = (id, dir) => { if (!inScript(id) && SP[id] && !(ev && ev.npc === id)) list.push({ id, x: SP[id][0], y: SP[id][1], dir, marker: questMarker(id) }); };
      if (ev && !(st === 'after' && inScript(ev.npc))) list.push({ id: ev.npc, key: 'ev', x: ev.at[0], y: ev.at[1], dir: 'down', marker: '★', event: evId, idle: true });
      amb('kid', 'down'); amb('ojii', 'left');
      if (q('mochi').state === 'active' && !q('mochi').found) list.push({ id: 'mochi', x: SP.mochi[0], y: SP.mochi[1], dir: 'left', marker: '?' });
      if (q('mochi').state === 'done') list.push({ id: 'mochi', x: 16, y: 21, dir: 'right' });
      if (scripted) {
        const [x, y] = SP[scripted.at];
        list.push({ id: scripted.npc, x, y, dir: 'down', marker: true, script: scripted });
        if (scripted.with) list.push({ id: scripted.with, x: x + 1, y, dir: 'down', script: scripted });
      }
    }
    if (mapId === 'class') {
      const lesson = st === 'class1' || st === 'class2';
      list.push({ id: 'sensei', x: 5, y: 2, dir: 'down', marker: !!(d && lesson) });
      if (d && lesson) {
        list.push({ id: 'yuki', x: SP.yuki[0], y: SP.yuki[1], dir: 'up' });
        list.push({ id: 'kenta', x: SP.kenta[0], y: SP.kenta[1], dir: 'up' });
        if (chapter() >= 2) list.push({ id: 'hana', x: SP.hana[0], y: SP.hana[1], dir: 'up' });
      }
    }
    if (mapId === 'home') {
      const need = st === 'wake' || st === 'evening';
      list.push({ id: 'obaa', x: SP.obaa[0], y: SP.obaa[1], dir: 'left', marker: need ? true : questMarker('obaa') });
    }
    if (window.Places) list.push(...Places.npcs(mapId, { inScript, ev }));
    if (window.Story) { list.push(...Story.npcs(mapId)); Story.mark(list); }
    return list;
  }
  // tanda "?" untuk warga yang punya misi
  function questMarker(id) {
    for (const [qid, Q] of Object.entries(QUESTS)) {
      if (Q.giver !== id) continue;
      if (id === 'obaa') continue; // Nenek memberi misi saat sarapan
      if (questOpen(qid)) return '?';
      if (qid === 'sora' && q('sora').state === 'active' && (q('sora').read || []).length >= 2) return '?';
      if (qid === 'mochi' && q('mochi').state === 'active' && q('mochi').found) return '?';
    }
    return null;
  }

  /* ---------- tugas saat ini ---------- */
  function objective() {
    const d = day(), st = S().step, SP = MAPS.town.spots;
    if (!d) return { text: 'Semua bab selesai! Latihan bebas di meja belajar', map: 'home', tile: [5, 2] };
    if (st === 'wake') return { text: 'Sarapan bersama Nenek', map: 'home', tile: MAPS.home.spots.obaa };
    if (st === 'commute') return { text: `Sapa ${nameOf(d.morning.npc)} di ${PLACE[d.morning.at]}`, map: 'town', tile: SP[d.morning.at] };
    if (st === 'class1') return { text: 'Masuk kelas: pelajaran pertama', map: 'class', tile: [5, 2] };
    if (st === 'class2') return { text: 'Pelajaran kedua bersama sensei', map: 'class', tile: [5, 2] };
    if (st === 'after') return { text: `Temui ${nameOf(d.brk.npc)} di ${PLACE[d.brk.at]}`, map: 'town', tile: SP[d.brk.at] };
    if (st === 'evening') return { text: 'Pulang untuk makan malam', map: 'home', tile: MAPS.home.spots.obaa };
    if (st === 'night' && window.Story && Story.goal()) return { text: `Tidur di kamarmu · 🎯 ${Story.goal()}`, map: 'home', tile: [2, 3] };
    return { text: 'Tidur di kamarmu', map: 'home', tile: [2, 3] };
  }
  function refreshHud() {
    const d = day();
    UI.setDay(d ? `Hari ${S().day} · ${STEP_LABEL[S().step]}` : 'Libur');
    UI.setObjective(objective().text, () => { if (!busy) gotoObjective(); });
    UI.setPoints(S().points || 0);
    UI.setReview(Extras.due().length, () => { if (!busy) reviewNow(); });
    Extras.checkAch();
  }
  async function reviewNow() {
    busy = true; World.pause(true);
    try { await Extras.review(); } catch (e) { if (!(e && e.abort)) console.error(e); }
    UI.hideDialog(); UI.closePanel(); busy = false; World.pause(false); mood(); refreshHud();
  }
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
    for (const line of lines) { if (line.q) await question(line, cast); else await UI.say(line); }
  }
  async function question(line, cast) {
    let order = shuffle(line.o.map((_, i) => i));
    const friends = cast.filter(c => FRIENDS.includes(c));
    let first = true;
    for (;;) {
      if (!order.length) return;  // pengaman: tidak ada pilihan tersisa → jangan macet
      const i = await UI.choose(line.q, order.map(j => ({ jp: UI.fmt(line.o[j].jp), ro: UI.fmt(line.o[j].ro) })));
      const o = line.o[order[i]];
      if (!o.ok) order = order.filter((_, x) => x !== i);
      if (o.ok) {
        Sound.ok();
        if (first && friends.length) heart(friends);
        if (Save.d.settings.voice) await Promise.race([Sound.speak(UI.fmt(o.jp)), UI.sleep(2600)]);
        return;
      }
      Sound.bad(); first = false;
      const who = friends[0] || cast[0];
      await UI.say(who ? { w: who, e: 'sad', t: o.why } : { n: o.why });
    }
  }
  // Pilihan menu biasa (teks Indonesia)
  function menuChoice(prompt, options) { return UI.choose(prompt, options.map(o => ({ label: o }))); }

  /* ---------- pindah tempat ---------- */
  async function goTo(mapId, x, y, dir, extraNpcs) {
    Sound.door();
    await UI.fade(() => { World.load(mapId, x, y, dir, extraNpcs || npcsFor(mapId)); mood(); refreshHud(); });
  }

  /* ---------- bicara dengan NPC ---------- */
  async function talk(npc) {
    const d = day(), st = S().step;
    if (npc.script && d) {
      const sc = npc.script, cast = [sc.npc, sc.with].filter(Boolean);
      await runLines(sc.lines, cast);
      UI.hideDialog();
      if (st === 'commute' && window.Story) { await Story.hook('morning'); UI.hideDialog(); }
      if (st === 'after') {
        if (window.Story) { await Story.hook('after'); UI.hideDialog(); }
        await friendEvent(cast);
        S().step = 'evening';
      } else S().step = 'class1';
      Save.write();
      World.setNpcs(npcsFor(World.map)); mood(); refreshHud();
      UI.toast(`Tugas selesai! ▶ ${objective().text}`);
      return;
    }
    if (npc.event) return runEvent(npc.event);
    if (window.Story && Story.claims(npc)) { await Story.talk(npc); World.setNpcs(npcsFor(World.map)); return; }
    if (npc.id === 'sensei') return senseiTalk();
    if (npc.id === 'obaa') return obaaTalk();
    if (npc.id === 'kid' && (questOpen('sora') || q('sora').state === 'active')) return soraQuest();
    if (npc.id === 'ojii' && (questOpen('mochi') || (q('mochi').state === 'active' && q('mochi').found))) return mochiQuest();
    if (npc.id === 'mochi') return mochiFound();
    if (window.Story && await Story.offer(npc)) { World.setNpcs(npcsFor(World.map)); return; }
    if (window.Places && Places.talks(npc)) return Places.talk(npc);
    if (npc.id !== 'mochi' && Object.values(S().bag || {}).some(n => n > 0)) {
      const a = await menuChoice(`Bicara dengan ${nameOf(npc.id)}`, ['Ngobrol', 'Beri jajanan 🎁']);
      UI.hideDialog();
      if (a === 1) { await Extras.gift(npc.id); return; }
    }
    if (npc.id === 'yuki') return runLines([{ w: 'yuki', t: 'Sst! Sensei sudah mau mulai. Ayo ke depan!' }], ['yuki']);
    if (npc.id === 'kenta') return runLines([{ w: 'kenta', e: 'happy', t: 'Semoga pelajarannya seru hari ini!' }], ['kenta']);
    if (npc.id === 'hana') return runLines([{ w: 'hana', e: 'happy', t: 'Semangat belajar, ya! Kalau bingung, tanya aku.' }], ['hana']);
    const pool = AMBIENT[npc.id];
    if (pool) return runLines(pool[(S().day - 1) % pool.length], [npc.id]);
  }

  // Kejadian Harian ★
  async function runEvent(id) {
    const E = EVENTS[id];
    await UI.timecard('★ Kejadian Hari Ini', E.title);
    await runLines(E.lines, [E.npc]);
    UI.hideDialog();
    if (E.game) {
      await Games.run(E.game, { pool: S().kana, title: E.title });
      await UI.say({ w: E.npc, e: 'happy', t: 'Seru sekali! Ayo main lagi lain kali.' });
    }
    S().events = S().events || []; S().events.push(S().day); Save.write();
    addPoints(20, 'kejadian harian'); addStamp('ev_' + id, E.title);
    World.setNpcs(npcsFor(World.map));
  }

  async function friendEvent(cast) {
    for (const ev of FRIEND_EVENTS) {
      if (!cast.includes(ev.who) || S().seen.includes(ev.id) || (S().friends[ev.who] || 0) < ev.need) continue;
      S().seen.push(ev.id); Save.write();
      await UI.timecard('♥ Event Teman', nameOf(ev.who));
      await runLines(ev.lines, [ev.who]);
      addPoints(20, 'event teman'); addStamp(ev.id, `Kenangan bersama ${nameOf(ev.who)}`);
      UI.hideDialog();
      return;
    }
  }

  /* ---------- di rumah ---------- */
  async function obaaTalk() {
    const st = S().step, n = S().day;
    if (st === 'wake' && day()) {
      const wx = weatherFor(n);
      if (wx === 'rain') await UI.say({ w: 'obaa', jp: 'きょう は あめ だよ。かさ を もって いってね。', ro: 'kyou wa ame da yo. kasa o motte itte ne.', id: 'Hari ini hujan. Bawa payung, ya.' });
      else if (wx === 'cloud') await UI.say({ w: 'obaa', jp: 'きょう は くもり ね。', ro: 'kyou wa kumori ne.', id: 'Hari ini mendung, ya.' });
      else await UI.say({ w: 'obaa', e: 'happy', jp: 'きょう は いい てんき だね。', ro: 'kyou wa ii tenki da ne.', id: 'Hari ini cuacanya bagus, ya.' });
      await runLines(BREAKFAST[(n - 1) % BREAKFAST.length], ['obaa']);
      await offerHomeQuest();
      if (n <= 3 || n % 4 === 0) await runLines(LEAVE_HOME, ['obaa']);
      else await UI.say({ w: 'obaa', e: 'happy', jp: 'いってらっしゃい！', ro: 'itterasshai!', id: 'Hati-hati di jalan!' });
      S().step = 'commute'; Save.write();
      World.setNpcs(npcsFor('home')); mood(); refreshHud();
      UI.toast(`▶ ${objective().text}`);
      return;
    }
    if (st === 'evening') return dinner();
    if (st === 'night') return runLines(GOOD_NIGHT, ['obaa']);
    return UI.say({ w: 'obaa', e: 'happy', t: 'Nenek sedang merajut. Hati-hati kalau keluar, ya.' });
  }

  async function dinner() {
    await runLines(WELCOME_HOME, ['obaa']);
    await runLines(DINNER[(S().day - 1) % DINNER.length], ['obaa']);
    if (q('letter').state === 'active' && q('letter').got) {
      if (window.Story) await Story.event('letter_delivered');
      else await runLines([{ n: 'Kamu memberikan surat itu kepada Nenek.' }, { w: 'obaa', e: 'happy', jp: 'まあ、まごから の てがみ！ありがとう。', ro: 'maa, mago kara no tegami! arigatou.', id: 'Wah, surat dari cucuku! Terima kasih.' }], ['obaa']);
      setQ('letter', { state: 'done' }); addPoints(QUESTS.letter.reward, 'misi'); addStamp('letter', QUESTS.letter.title);
    }
    if (window.Story) { await Story.hook('dinner'); UI.hideDialog(); }
    await runLines(GOOD_NIGHT, ['obaa']);
    S().step = 'night'; Save.write();
    World.setNpcs(npcsFor('home')); mood(); refreshHud();
  }

  async function offerHomeQuest() {
    for (const id of ['letter', 'list']) {
      if (!questOpen(id)) continue;
      const lines = id === 'letter'
        ? [{ w: 'obaa', jp: 'ポスト を みて きて くれる？', ro: 'posuto o mite kite kureru?', id: 'Bisa tolong lihat kotak pos?' }, { w: 'obaa', t: 'Kotak pos merah ada di dekat rumah. Pastikan namanya さとう, ya.' }]
        : [{ w: 'obaa', jp: 'おかいもの、たのめる？', ro: 'okaimono, tanomeru?', id: 'Bisa minta tolong belanja?' }, { w: 'obaa', t: 'Daftarnya ditulis katakana. Konbini sudah buka, lho.' }];
      await runLines(lines, ['obaa']);
      const a = await menuChoice('Terima misi?', ['Siap, Nek!', 'Nanti saja']);
      if (a === 0) { setQ(id, { state: 'active' }); UI.toast(`Misi baru: ${QUESTS[id].title}`); }
      return;
    }
  }

  async function bed() {
    const d = day();
    if (!d) return UI.say({ n: 'Kamu berbaring sebentar… Semua bab sudah selesai. Coba latihan bebas di meja belajar!' });
    if (S().step !== 'night') return UI.say({ n: `Belum mengantuk. Tugasmu: ${objective().text}.` });
    Music.play('night');
    await UI.say({ n: pickOne(NIGHT_LINES) });
    UI.hideDialog();
    if (window.Story) { await Story.hook('night'); UI.hideDialog(); UI.closePanel(); Music.play('night'); }
    await diary(S().day, d);
    const finished = S().day;
    await UI.fade(() => {
      S().day++; S().step = 'wake'; Save.write();
      World.load('home', 3, 3, 'left', npcsFor('home'));
      mood(); refreshHud();
    }, 500);
    const nextCh = CHAPTERS.find(c => c.from === finished + 1);
    if (nextCh && day()) await chapterCard(nextCh.n);
    if (day()) await dayCard(); else await ending();
  }

  function diary(n, d) {
    const r = S().days[n] || {};
    const result = r.grade ? `<span class="grade-s g-${r.grade.replace('+', 'p')}">${r.grade}</span>` : Lesson.starHtml(r.stars || 0);
    const p = UI.panel(`
      <div class="win diary">
        <div class="w-title">Buku Harian — Hari ${n}</div>
        <div class="muted">${d.title} · ${d.sub}</div>
        ${d.kana ? `<div class="sec"><div class="sec-h">Huruf baru</div><div class="chips">${d.kana.map(k => `<button class="chip" type="button" data-say="${k}"><b>${k}</b><small>${KANA[k].ro}</small></button>`).join('')}</div></div>` : ''}
        <div class="sec"><div class="sec-h">${d.type === 'test' ? 'Nilai ulangan' : 'Latihan'}</div><div>${result} <span class="muted">(${r.correct || 0}/${r.total || 0} benar)</span></div></div>
        <div class="sec"><div class="sec-h">Kalimat hari ini</div><ul class="phr">${d.phrases.map(ph => `<li><button class="say" type="button" data-say="${ph.jp.replace(/[〜~]/g, '')}">♪</button><div><b>${ph.jp}</b><small>${ph.ro} — ${ph.id}</small></div></li>`).join('')}</ul></div>
        ${window.Story && Story.town ? `<div class="sec"><div class="sec-h">🏮 Meter Kota</div><div class="lt-bar"><i style="width:${Story.town}%"></i></div></div>` : ''}
        ${window.Story && Story.diaryNote() ? `<div class="sec story-note"><div class="sec-h">Catatan hati</div><p>${UI.esc(Story.diaryNote())}</p></div>` : ''}
        <div class="sec"><div class="sec-h">Pertemanan</div><div class="hearts">${FRIENDS.filter(f => f !== 'hana' || chapter() >= 2 || S().friends.hana).map(f => `<span>${nameOf(f)} <b>♥ ${S().friends[f] || 0}</b></span>`).join('')}</div></div>
        <button class="btn block" data-a="sleep" type="button">Tidur ▶</button>
      </div>`, 'scroll');
    return UI.wait(done => {
      p.querySelectorAll('[data-say]').forEach(b => b.onclick = () => Sound.speak(b.dataset.say));
      p.querySelector('[data-a=sleep]').onclick = () => { Sound.blip(); UI.closePanel(); done(); };
    });
  }
  function dayCard() { const d = day(); return UI.timecard(`Hari ${S().day}`, `${d.title}<br><span class="jp">${d.sub}</span>`); }
  function chapterCard(n) {
    const c = CHAPTERS[n - 1];
    return UI.timecard(`Bab ${n}`, `${c.title}<br><span class="jp">${c.jp || (n === 2 ? 'カタカナ' : 'ひらがな')}</span>`);
  }
  function ending() {
    Music.play('festival');
    const p = UI.panel(`
      <div class="win result">
        <div class="r-title">Tamat — Terima kasih!</div>
        <div class="big-jp" style="font-size:24px;line-height:1.6">${CHAPTERS.map(c => c.jp).join('<br>')}</div>
        <p>Kamu sudah mempelajari <b>${S().kana.length}</b> huruf & kanji dan banyak kalimat sehari-hari bersama teman-temanmu.</p>
        <p class="muted">Bab ${CHAPTERS.length + 1} (musim panas di gunung やま) sedang disiapkan! Sementara itu, terus latihan lewat <b>Latihan Bebas</b> dan buka 📮 Kotak Surat.</p>
        <button class="btn" type="button">Lanjut ▶</button>
      </div>`, 'center');
    Sound.star();
    return UI.wait(done => { p.querySelector('.btn').onclick = () => { UI.closePanel(); done(); }; });
  }

  /* ---------- di kelas ---------- */
  async function senseiTalk() {
    const d = day(), st = S().step;
    if (d && st === 'class1') return classOne();
    if (d && st === 'class2') return classTwo();
    if (!d) return UI.say({ w: 'sensei', e: 'happy', t: `Selamat! Kamu sudah menyelesaikan ${CHAPTERS.length} bab. Sensei bangga padamu!` });
    if (st === 'wake' || st === 'commute') return UI.say({ w: 'sensei', t: `Pelajaran belum dimulai. ${nameOf(d.morning.npc)} menunggumu di ${PLACE[d.morning.at]}.` });
    return runLines([{ w: 'sensei', e: 'happy', jp: 'また あした。', ro: 'mata ashita.', id: 'Sampai besok.' }], ['sensei']);
  }

  async function classOne() {
    const d = day(), n = S().day;
    Music.play('school');
    await runLines(d.cls, ['sensei']);
    UI.hideDialog();
    if (window.Story) { await Story.hook('class'); UI.hideDialog(); }
    if (d.type === 'lesson') {
      const intro = n === 1 ? [
        'Bahasa Jepang punya tiga jenis huruf: hiragana, katakana, dan kanji.',
        'Hiragana dipakai untuk kata asli Jepang dan tata bahasa. Satu huruf mewakili satu suku kata.',
        'Kita mulai dari lima huruf vokal. Perhatikan cara menulisnya baik-baik.',
      ] : n === 12 ? [
        'Katakana punya bunyi yang sama dengan hiragana, tetapi bentuknya lebih tegas dan bersudut.',
        'Katakana dipakai untuk kata serapan, nama negara, dan nama orang asing.',
        'Garis panjang ー artinya bunyi sebelumnya dipanjangkan, seperti pada ケーキ.',
      ] : (d.intro || []);
      await Lesson.teach(d.kana, { title: `Video: ${d.sub}`, intro, day: n });
      const learnedNow = [...d.kana, ...(d.also || [])];
      learnedNow.forEach(k => { if (!S().kana.includes(k)) S().kana.push(k); });
      Extras.learn(learnedNow);
      Save.write(); UI.closePanel();
      if (d.also && d.also.length) await UI.say({ w: 'sensei', e: 'happy', t: `Katakananya ikut kamu kuasai hari ini: ${d.also.join(' ')}. Aturannya sama persis!` });
      const acts = activitiesFor(n);
      await UI.say({ w: 'sensei', e: 'happy', t: 'Bagus! Sekarang pilih cara latihan hari ini. Setiap hari pilihannya berbeda, lho!' });
      const pickA = await menuChoice('Mau latihan dengan cara apa?', acts.map(x => `${Games.NAMES[x]} — ${Games.DESC[x]}`));
      const g = acts[pickA];
      UI.hideDialog();
      const sc = typeof SCRIPT_OF !== 'undefined' ? SCRIPT_OF : (k => IS_KATA(k) ? 'kata' : 'hira');
      const pool = [...new Set([...d.kana, ...shuffle(S().kana.filter(k => sc(k) === sc(d.kana[0]))).slice(0, 3)])];
      await Games.run(g, { pool, words: Games.wordsFor(new Set(S().kana)).filter(w => d.kana.some(k => w.jp.includes(k))) });
    } else {
      const r = await Lesson.quiz({ focus: [], count: d.count, title: d.title, pool: d.pool || 'hira' });
      const g = await Lesson.results(r, true);
      S().days[n] = { grade: g.grade, correct: r.correct, total: r.total };
      await UI.say({ w: 'sensei', e: /A/.test(g.grade) ? 'happy' : 'normal', t: /A/.test(g.grade) ? `Nilai ${g.grade}! Hebat sekali!` : `Nilaimu ${g.grade}. Huruf yang salah akan sering muncul lagi di latihan.` });
    }
    S().step = 'class2'; Save.write();
    await UI.say({ w: 'sensei', jp: 'ひるやすみ です。', ro: 'hiruyasumi desu.', id: 'Waktunya istirahat siang.' });
    UI.hideDialog();
    await lunch();
  }

  async function lunch() {
    const ch2 = chapter() >= 2;
    const special = LUNCH_SPECIAL[(S().day - 1) % LUNCH_SPECIAL.length];
    const opts = ['Atap sekolah bersama Yuki', 'Makan di kelas bersama Kenta', ch2 ? 'Perpustakaan bersama Hana' : 'Perpustakaan (belajar sendiri)', `★ ${special.label}`];
    const a = await menuChoice('Bel berbunyi! Makan siang di mana?', opts);
    UI.hideDialog();
    if (a === 3) {
      await UI.fade(() => { World.load('class', 5, 6, 'up', special.who ? [{ id: special.who, x: 5, y: 5, dir: 'down' }] : []); mood(); });
      await runLines(special.lines, special.who ? [special.who] : []);
      addPoints(8, 'makan siang spesial');
      UI.hideDialog();
      await UI.say({ n: 'Kin-kon-kan-kon… Bel masuk berbunyi.' });
      UI.hideDialog();
      await goTo('class', 5, 4, 'up');
      return;
    }
    const who = ['yuki', 'kenta', ch2 ? 'hana' : null][a];
    const map = ['roof', 'class', 'library'][a];
    const SPm = MAPS[map].spots;
    if (map === 'class') {
      World.setNpcs([{ id: 'kenta', x: 6, y: 6, dir: 'left' }, { id: 'sensei', x: 5, y: 2, dir: 'down' }]);
      await UI.fade(() => { World.load('class', 5, 6, 'right', [{ id: 'kenta', x: 6, y: 6, dir: 'left' }]); mood(); });
    } else {
      await goTo(map, SPm.me[0], SPm.me[1], 'left', who ? [{ id: who, x: SPm.npc[0], y: SPm.npc[1], dir: 'right' }] : []);
    }
    if (who) {
      const pool = LUNCH[who], i = S().lunch[who]++ % pool.length; Save.write();
      await runLines(pool[i], [who]);
    } else {
      await UI.say({ n: 'Kamu membuka bekal sambil membaca buku di perpustakaan yang sunyi.' });
    }
    if (map === 'library') {
      if (who === 'hana' && questOpen('menu')) await menuQuest();
      else {
        await UI.say(who ? { w: who, e: 'happy', t: 'Ayo latihan sebentar sebelum bel masuk!' } : { n: 'Ayo latihan sebentar sebelum bel masuk!' });
        UI.hideDialog();
        await Games.run(pickOne(['builder', 'wordmatch', 'kanahunt']), { pool: S().kana });
      }
    }
    UI.hideDialog();
    await UI.say({ n: 'Kin-kon-kan-kon… Bel masuk berbunyi.' });
    UI.hideDialog();
    await goTo('class', 5, 4, 'up');
  }

  async function classTwo() {
    const d = day(), n = S().day;
    Music.play('school');
    if (d.type === 'lesson') {
      await UI.say({ w: 'sensei', t: 'Pelajaran kedua: latihan soal. Tidak apa-apa kalau salah!' });
      UI.hideDialog();
      const r = await Lesson.quiz({ focus: d.kana, count: 10, title: 'Latihan Soal' });
      const g = await Lesson.results(r, false);
      S().days[n] = { stars: g.stars, correct: r.correct, total: r.total };
      const react = g.stars === 3 ? { e: 'happy', jp: 'すばらしい！', ro: 'subarashii!', id: 'Luar biasa!' }
        : g.stars === 2 ? { e: 'happy', jp: 'よく できました。', ro: 'yoku dekimashita.', id: 'Bagus sekali.' }
        : { e: 'normal', jp: 'だいじょうぶ。', ro: 'daijoubu.', id: 'Tidak apa-apa. Pelan-pelan saja!' };
      await UI.say({ w: 'sensei', ...react });
    } else {
      await UI.say({ w: 'sensei', e: 'happy', t: 'Ulangan selesai. Sekarang turnamen karuta untuk bersenang-senang!' });
      UI.hideDialog();
      const pf = typeof POOL_FILTER !== 'undefined' && POOL_FILTER[d.pool];
      const pool = pf ? S().kana.filter(pf) : S().kana.filter(k => (d.pool === 'kata') === IS_KATA(k));
      await Games.karuta({ pool, rounds: 8, title: 'Turnamen Karuta' });
    }
    if (!S().phrases.includes(n)) S().phrases.push(n);
    S().step = 'after'; Save.write();
    await UI.say({ w: 'sensei', t: `Sampai di sini dulu. Sepulang sekolah, ${nameOf(d.brk.npc)} menunggumu di ${PLACE[d.brk.at]}.` });
    UI.hideDialog();
    await club();
  }

  async function club() {
    const fav = featuredClub(S().day);
    const list = CLUBS.filter(c => c.id !== 'hoka' || chapter() >= 2);
    const opts = [...list.map(c => `${c.id === fav ? '★ ' : ''}${c.name} — ${c.desc}${c.id === fav ? ' (unggulan hari ini: bonus poin!)' : ''}`), 'Langsung pulang'];
    const a = await menuChoice('Kegiatan klub sepulang sekolah?', opts);
    UI.hideDialog();
    if (a < list.length) {
      const c = list[a], SPm = MAPS.club.spots;
      await goTo('club', SPm.me[0], SPm.me[1], 'left', [{ id: c.host, x: SPm.npc[0], y: SPm.npc[1], dir: 'right' }]);
      await runLines(c.intro, [c.host]);
      UI.hideDialog();
      const r = await Games.run(c.game, { pool: S().kana });
      if (FRIENDS.includes(c.host) && r && r.stars >= 2) heart([c.host]);
      if (c.id === fav) addPoints(20, 'klub unggulan');
      await UI.say({ w: c.host, e: 'happy', t: 'Kerja bagus hari ini! Sampai jumpa di klub lagi.' });
      UI.hideDialog();
    }
    await goTo('town', 13, 6, 'down');
  }

  /* ---------- misi sampingan ---------- */
  async function soraQuest() {
    const Q = q('sora');
    if (!Q.state) {
      await runLines([
        { w: 'kid', e: 'happy', jp: 'ねえ、ひらがな よめる？', ro: 'nee, hiragana yomeru?', id: 'Hei, kamu bisa baca hiragana?' },
        { w: 'kid', t: 'Aku belum bisa membaca papan いけ dan えき. Tolong baca, lalu ajari aku!' },
      ], ['kid']);
      const a = await menuChoice('Bantu Sora?', ['Boleh, aku bantu!', 'Nanti saja']);
      if (a === 0) { setQ('sora', { state: 'active', read: [] }); UI.toast(`Misi baru: ${QUESTS.sora.title}`); }
      return;
    }
    if ((Q.read || []).length < 2) return UI.say({ w: 'kid', t: 'Papan いけ ada di dekat kolam, papan えき ada di dekat stasiun!' });
    await UI.say({ w: 'kid', e: 'happy', t: 'Sudah dibaca? Ajari aku!' });
    for (const [word, right] of [['いけ', 'ike'], ['えき', 'eki']]) {
      await runLines([{ q: `Sora bertanya: "${word}" dibaca apa?`, o: shuffle([{ jp: right, ro: '', ok: true }, ...['iku', 'eke', 'aki', 'ika'].filter(x => x !== right).slice(0, 2).map(x => ({ jp: x, ro: '', why: `Coba baca lagi hurufnya satu per satu: ${[...word].map(c => c + '=' + KANA[c].ro).join(', ')}.` }))]) }], ['kid']);
    }
    await UI.say({ w: 'kid', e: 'happy', jp: 'ありがとう、せんせい！', ro: 'arigatou, sensei!', id: 'Terima kasih, guru!' });
    setQ('sora', { state: 'done' }); addPoints(QUESTS.sora.reward, 'misi'); addStamp('sora', QUESTS.sora.title);
    World.setNpcs(npcsFor(World.map));
  }

  async function mochiQuest() {
    const Q = q('mochi');
    if (!Q.state) {
      await runLines([
        { w: 'ojii', e: 'sad', jp: 'ねこ の モチ が いない…', ro: 'neko no Mochi ga inai…', id: 'Kucingku, Mochi, tidak ada…' },
        { w: 'ojii', t: 'Kucing putih dengan ekor oranye. Dia suka menyelinap ke taman rumah Sato… mungkin di sana?' },
      ], ['ojii']);
      const a = await menuChoice('Bantu mencari Mochi?', ['Aku cari sekarang!', 'Nanti saja']);
      if (a === 0) { setQ('mochi', { state: 'active' }); UI.toast(`Misi baru: ${QUESTS.mochi.title}`); World.setNpcs(npcsFor(World.map)); }
      return;
    }
    if (Q.found) {
      await runLines([
        { n: 'Kamu menyerahkan Mochi kepada Kakek Mori.' },
        { w: 'ojii', e: 'happy', jp: 'モチ！よかった… ほんとう に ありがとう！', ro: 'Mochi! yokatta… hontou ni arigatou!', id: 'Mochi! Syukurlah… Terima kasih banyak!' },
      ], ['ojii']);
      if (window.Story) await Story.event('mochi_returned');
      setQ('mochi', { state: 'done' }); addPoints(QUESTS.mochi.reward, 'misi'); addStamp('mochi', QUESTS.mochi.title);
      World.setNpcs(npcsFor(World.map));
    }
  }
  async function mochiFound() {
    if (q('mochi').state === 'done') return runLines(AMBIENT.mochi[0], []);
    await UI.say({ n: 'Seekor kucing putih berekor oranye sedang menggali tanah di bedeng bunga samping rumah Nenek Sato. Itu Mochi!' });
    await runLines([{ q: 'Panggil Mochi dengan lembut!', o: [
      { jp: 'おいで、モチ！', ro: 'oide, Mochi!', ok: true },
      { jp: 'あっち いけ！', ro: 'acchi ike!', why: 'あっち いけ = pergi sana! Mochi malah takut. Panggil dia: おいで (kemarilah)!' },
    ] }], []);
    if (window.Story) await Story.event('mochi_found');
    await UI.say({ n: 'Mochi mengeong "にゃあ" lalu melompat ke pelukanmu. Bawa dia ke Kakek Mori di dekat stasiun!' });
    setQ('mochi', { found: true });
    World.setNpcs(npcsFor(World.map));
  }

  async function mailbox() {
    if (q('letter').state !== 'active' || q('letter').got) return UI.say({ jp: 'ポスト', ro: 'posuto', id: 'Kotak pos. Isinya kosong.' });
    await UI.say({ n: 'Ada tiga surat di kotak pos. Nama penerimanya ditulis hiragana.' });
    const names = shuffle([['さとう', 'Sato', true], ['もり', 'Mori', false], ['たなか', 'Tanaka', false]]);
    await runLines([{ q: 'Surat mana untuk Nenek Sato?', o: names.map(([jp, id, ok]) => ok ? { jp, ro: '', ok: true } : { jp, ro: '', why: `Itu dibaca "${[...jp].map(c => KANA[c].ro).join('')}" (${id}). Cari yang dibaca "satou".` }) }], []);
    setQ('letter', { got: true });
    UI.toast('Surat didapat! Berikan ke Nenek saat makan malam.');
  }

  async function konbiniDoor() {
    if (q('list').state === 'active') {
      await UI.say({ w: 'tenin', e: 'happy', jp: 'いらっしゃいませ！', ro: 'irasshaimase!', id: 'Selamat datang!' });
      UI.hideDialog();
      await Games.shop({ count: 3 });
      setQ('list', { state: 'done' }); addPoints(QUESTS.list.reward, 'misi'); addStamp('list', QUESTS.list.title);
      return;
    }
    const a = await menuChoice('Masuk konbini?', ['Beli jajanan 🍙', 'Latihan belanja (baca label katakana)', 'Tidak jadi']);
    UI.hideDialog();
    if (a === 0) await Extras.shop('konbini');
    if (a === 1) await Games.shop({ count: 3, title: 'Latihan Belanja' });
  }

  async function menuQuest() {
    await runLines([
      { w: 'hana', jp: 'カフェ の メニュー、チェック して くれる？', ro: 'kafe no menyuu, chekku shite kureru?', id: 'Bisa bantu cek menu kafe?' },
      { w: 'hana', t: 'Aku ingin memastikan artinya benar sebelum dicetak.' },
    ], ['hana']);
    const known = new Set(S().kana);
    const items = shuffle(WORDS.filter(w => [...w.jp].some(IS_KATA) && [...w.jp].every(c => knownChar(c, known)))).slice(0, 3);
    for (const w of items) {
      const wrong = shuffle(WORDS.filter(x => x.id !== w.id)).slice(0, 2);
      await runLines([{ q: `Menu: 「${w.jp}」 artinya…`, o: shuffle([{ jp: w.id, ro: w.ro, ok: true }, ...wrong.map(x => ({ jp: x.id, ro: '', why: `${w.jp} dibaca "${w.ro}", artinya ${w.id}.` }))]) }], ['hana']);
    }
    await UI.say({ w: 'hana', e: 'happy', jp: 'かんぺき！ありがとう！', ro: 'kanpeki! arigatou!', id: 'Sempurna! Terima kasih!' });
    setQ('menu', { state: 'done' }); addPoints(QUESTS.menu.reward, 'misi'); addStamp('menu', QUESTS.menu.title);
  }

  async function readSign(s) {
    const known = new Set(S().kana);
    const chars = [...s.text];
    const all = chars.every(c => knownChar(c, known));
    const ro = chars.map(c => c === ' ' ? ' ' : c === 'ー' ? '-' : known.has(c) ? KANA[c].ro : '?').join('');
    if (all && q('sora').state === 'active' && ['いけ', 'えき'].includes(s.text)) {
      const read = q('sora').read || []; if (!read.includes(s.text)) { read.push(s.text); setQ('sora', { read }); UI.toast(`Misi Sora: ${read.length}/2 papan dibaca`); }
    }
    const kata = chars.some(IS_KATA);
    return UI.say({ jp: s.text, ro, id: all ? `Papan: "${s.note}". Kamu bisa membacanya!` : kata ? 'Ada katakana yang belum dipelajari (?). Nanti di Bab 2!' : 'Ada huruf yang belum kamu pelajari (?). Semangat!' });
  }

  async function shrine() {
    if (S().omikuji === S().day) return UI.say({ n: 'Kamu sudah menarik omikuji hari ini. Kembali besok, ya!' });
    await UI.say({ n: 'Kamu melempar koin, membungkuk dua kali, bertepuk tangan dua kali, lalu membungkuk sekali lagi.' });
    const f = pickOne([
      { jp: 'だいきち', ro: 'daikichi', id: 'Keberuntungan besar! Hari ini pasti lancar.', pts: 15 },
      { jp: 'きち', ro: 'kichi', id: 'Beruntung! Teruslah belajar.', pts: 10 },
      { jp: 'ちゅうきち', ro: 'chuukichi', id: 'Cukup beruntung. Pelan-pelan saja.', pts: 8 },
      { jp: 'しょうきち', ro: 'shoukichi', id: 'Sedikit beruntung. Senyum membawa rezeki!', pts: 5 },
    ]);
    await UI.say({ n: 'Kamu menarik kertas ramalan (omikuji):' });
    await UI.say({ jp: f.jp, ro: f.ro, id: f.id });
    S().omikuji = S().day; addPoints(f.pts, 'omikuji');
    if (f.jp === 'だいきち') Extras.bump('daikichi');
  }

  /* ---------- interaksi dari dunia ---------- */
  async function interact(t) {
    if (busy) return;
    busy = true; cancelAuto(); World.pause(true);
    try {
      if (window.Places && Places.claims && Places.claims(t)) await Places.interact(t);
      else if (t.type === 'npc') await talk(t.npc);
      else if (t.type === 'sign') await readSign(t.sign);
      else if (t.type === 'bed') await bed();
      else if (t.type === 'desk') await study();
      else if (t.type === 'closet') await wardrobe();
      else if (t.type === 'mailbox') await mailbox();
      else if (t.type === 'shrine') await shrine();
      else if (t.type === 'vending') { await UI.say({ jp: 'じどうはんばいき', ro: 'jidouhanbaiki', id: 'Mesin minuman otomatis! Ada di mana-mana di Jepang.' }); UI.hideDialog(); await Extras.shop('vending'); }
      else if (t.type === 'yatai') { await UI.say({ w: 'tenin', e: 'happy', jp: 'いらっしゃい！おいしい よ！', ro: 'irasshai! oishii yo!', id: 'Silakan! Enak, lho!' }); UI.hideDialog(); await Extras.shop('yatai'); }
      else if (t.type === 'water') { const a = await menuChoice(t.where === 'pond' ? 'Kolam yang tenang. Mau memancing?' : 'Sungai yang jernih. Mau memancing?', ['Memancing 🎣', 'Lihat Buku Ikan', 'Tidak jadi']); UI.hideDialog(); if (a === 0) await Relax.fishing(t.where); if (a === 1) await Relax.fishBook(); }
      else if (t.type === 'bench') await Relax.bench();
      else if (t.type === 'pet') await Relax.petPet();
      else if (t.type === 'fridge') await UI.say({ jp: 'れいぞうこ', ro: 'reizouko', id: 'Kulkas. Ada ミルク dan プリン di dalamnya.' });
      else if (t.type === 'shelf') { UI.hideDialog(); await Relax.library(); }
      else if (t.type === 'board') await UI.say({ jp: 'がんばろう！', ro: 'ganbarou!', id: 'Tulisan di papan: "Ayo berjuang!"' });
      else if (window.Places && Places.handles(t.type)) await Places.interact(t);
    } catch (e) { if (!(e && e.abort)) console.error(e); }
    UI.hideDialog(); UI.closePanel();
    busy = false; World.pause(false); mood(); refreshHud();
  }

  async function warp(w) {
    busy = true; World.pause(true);
    // tidak boleh keluar kelas saat pelajaran belum selesai
    if (World.map === 'class' && (S().step === 'class1' || S().step === 'class2') && w.to === 'town') {
      try { await UI.say({ w: 'sensei', t: 'Eh, mau ke mana? Pelajarannya belum selesai!' }); } catch (e) {}
      UI.hideDialog();
      World.load('class', 5, 7, 'up', npcsFor('class'));
      busy = false; World.pause(false); return;
    }
    await goTo(w.to, w.tx, w.ty, w.dir);
    busy = false; World.pause(false);
    if (w.to === 'home' && S().step === 'evening') { setTimeout(() => interact({ type: 'npc', npc: { id: 'obaa' } }), 150); return; }
    if (autoGoto) setTimeout(gotoObjective, 150);
  }

  async function blocked(door) {
    if (busy) return;
    busy = true; World.pause(true);
    try {
      if (door.kind === 'gate') await Places.gate();
      else if (door.kind === 'scene') await Places.scene(door.id);
      else if (door.until && S().day >= door.until) await konbiniDoor();
      else await UI.say({ n: door.msg });
    } catch (e) { if (!(e && e.abort)) console.error(e); }
    UI.hideDialog(); UI.closePanel(); busy = false; World.pause(false); mood(); refreshHud();
  }

  /* ---------- menu ---------- */
  async function menu() {
    if (busy) return;
    busy = true; World.pause(true);
    try {
      for (;;) {
        const m = UI.modal(`
          <div class="w-title">Menu <span class="pts-badge">🌸 ${S().points || 0}</span></div>
          <div class="menu-grid">
            <button class="mi tile-mi" data-a="review" type="button"><i>📝</i><span>Ulasan</span>${Extras.due().length ? `<span class="badge">${Extras.due().length}</span>` : ''}</button>
            <button class="mi tile-mi" data-a="book" type="button"><i>📖</i><span>Catatan</span></button>
            ${window.Story && Story.unlocked ? `<button class="mi tile-mi" data-a="letters" type="button"><i>📮</i><span>Surat</span>${Story.unread() ? `<span class="badge">${Story.unread()}</span>` : ''}</button>` : ''}
            <button class="mi tile-mi" data-a="drill" type="button"><i>✏️</i><span>Latihan</span></button>
            <button class="mi tile-mi" data-a="bag" type="button"><i>🎒</i><span>Tas</span></button>
            <button class="mi tile-mi" data-a="friends" type="button"><i>👥</i><span>Teman</span></button>
            <button class="mi tile-mi" data-a="food" type="button"><i>🍱</i><span>Makanan</span></button>
            <button class="mi tile-mi" data-a="pets" type="button"><i>🐱</i><span>Hewan</span></button>
            <button class="mi tile-mi" data-a="fish" type="button"><i>🎣</i><span>Ikan</span></button>
            <button class="mi tile-mi" data-a="ach" type="button"><i>🏆</i><span>Prestasi</span></button>
            <button class="mi tile-mi" data-a="quests" type="button"><i>🗺️</i><span>Misi</span></button>
            <button class="mi tile-mi" data-a="report" type="button"><i>📊</i><span>Rapor</span></button>
            <button class="mi tile-mi" data-a="wardrobe" type="button"><i>👕</i><span>Lemari</span></button>
            <button class="mi tile-mi" data-a="online" type="button"><i>💬</i><span>Online</span></button>
            <button class="mi tile-mi" data-a="settings" type="button"><i>⚙️</i><span>Atur</span></button>
          </div>
          <div class="menu-foot">
            <button class="mi small-mi" data-a="title" type="button">🏠 Simpan & keluar</button>
            <button class="mi ghost small-mi" data-a="close" type="button">Tutup ✕</button>
          </div>`);
        const a = await UI.wait(done => {
          m.querySelectorAll('.mi').forEach(b => b.onclick = () => { Sound.blip(); done(b.dataset.a); });
          Game._menuClose = () => done('close');
        });
        Game._menuClose = null;
        UI.closeModal();
        if (a === 'close') break;
        if (a === 'book') await book();
        if (a === 'review') { await Extras.review(); UI.hideDialog(); }
        if (a === 'bag') await Extras.bag();
        if (a === 'friends') { if (window.ReactUI) await window.ReactUI.friends(); }
        if (a === 'letters') { if (window.ReactUI) await window.ReactUI.letters(); }
        if (a === 'food' && window.Places && Places.foodBook) await Places.foodBook();
        if (a === 'pets') await Relax.petShop();
        if (a === 'fish') await Relax.fishBook();
        if (a === 'ach') await Extras.achPage();
        if (a === 'online') { Online.palette(); break; }
        if (a === 'report') await report();
        if (a === 'quests') await questLog();
        if (a === 'settings') await settings();
        if (a === 'wardrobe') await wardrobe();
        if (a === 'drill') { await study(); break; }
        if (a === 'title') { Save.write(); busy = false; World.pause(false); return title(); }
      }
    } catch (e) { if (!(e && e.abort)) console.error(e); }
    UI.hideDialog(); UI.closePanel();
    busy = false; World.pause(false); mood(); refreshHud();
  }

  async function study() {
    if (S().kana.length < 4) return UI.say({ n: 'Belum cukup huruf untuk latihan bebas. Belajar dulu di sekolah, ya!' });
    const names = ['review', 'quiz', 'karuta', 'catch', 'builder', 'speed', 'kanahunt', 'wordmatch', 'dictation', 'shodo', 'books'];
    const labels = [`Ulasan (${Extras.due().length})`, 'Kuis campuran', 'Karuta', 'Hujan Huruf', 'Susun Kata', 'Benar/Salah', 'Cari Huruf', 'Pasangkan Kata', 'Dikte', 'Kaligrafi', 'Buku cerita'];
    const icons = ['📝', '❓', '🃏', '🌧️', '🧩', '⚡', '🔍', '🔗', '👂', '🖌️', '📚'];
    const m = UI.modal(`<div class="w-title">Latihan Bebas</div>
      <div class="menu-grid two">${labels.map((l, i) => `<button class="mi tile-mi row-mi" data-i="${i}" type="button"><i>${icons[i]}</i><span>${l}</span></button>`).join('')}</div><div class="menu-foot"><button class="mi ghost small-mi" data-i="-1" type="button">Batal</button></div>`);
    const i = await UI.wait(done => m.querySelectorAll('.mi').forEach(b => b.onclick = () => { Sound.blip(); done(+b.dataset.i); }));
    UI.closeModal();
    if (i < 0) return;
    if (names[i] === 'review') { await Extras.review(); return; }
    if (names[i] === 'books') { await Relax.library(); return; }
    const scriptPick = S().kana.some(IS_KATA) && S().kana.some(k => !IS_KATA(k))
      ? await menuChoice('Huruf apa yang mau dilatih?', ['Hiragana', 'Katakana', 'Campur']) : 2;
    UI.hideDialog();
    const pool = S().kana.filter(k => scriptPick === 2 || (scriptPick === 1) === IS_KATA(k));
    if (names[i] === 'quiz') { const r = await Lesson.quiz({ focus: [], count: 10, title: 'Latihan Bebas', pool: ['hira', 'kata', null][scriptPick] }); await Lesson.results(r, false); }
    else await Games.run(names[i], { pool });
    mood();
  }

  function book(tab = 'hira') {
    const learned = new Set(S().kana);
    const extraTabs = typeof DAKU_GRID !== 'undefined' && S().kana.some(k => DAKU_GRID.flat().includes(k) || KANJI_GRID.flat().includes(k)) ? [['daku', 'Tenten'], ['kanji', 'Kanji']] : [];
    const tabs = `<div class="tabs">${[['hira', 'Hiragana'], ['kata', 'Katakana'], ...extraTabs, ['words', 'Kata'], ['phrases', 'Kalimat']].map(([k, l]) => `<button class="tab ${k === tab ? 'on' : ''}" data-tab="${k}" type="button">${l}</button>`).join('')}</div>`;
    let body = '';
    if (tab === 'hira' || tab === 'kata' || tab === 'daku' || tab === 'kanji') {
      const grid = { hira: HIRAGANA_GRID, kata: KATAKANA_GRID, daku: typeof DAKU_GRID !== 'undefined' ? DAKU_GRID : [], kanji: typeof KANJI_GRID !== 'undefined' ? KANJI_GRID : [] }[tab];
      const n = grid.flat().filter(k => k && learned.has(k)).length;
      body = `<p class="muted">${n} / ${grid.flat().filter(Boolean).length} ${tab === 'kanji' ? 'kanji' : 'huruf'} dipelajari. Ketuk huruf untuk detail.</p><div class="kgrid">` +
        grid.flat().map(k => {
          if (!k) return '<span class="kc empty"></span>';
          if (!learned.has(k)) return '<span class="kc locked">?</span>';
          const s = S().st[k] || { c: 0, w: 0 }; const acc = s.c + s.w ? s.c / (s.c + s.w) : 0;
          const lv = s.c + s.w === 0 ? '' : acc >= .85 ? 'lv3' : acc >= .6 ? 'lv2' : 'lv1';
          return `<button class="kc ${lv}" data-k="${k}" type="button"><b>${k}</b><small>${KANA[k].ro}</small></button>`;
        }).join('') + '</div><div class="legend"><i class="lv1"></i>perlu latihan <i class="lv2"></i>lumayan <i class="lv3"></i>hafal</div>';
    } else if (tab === 'words') {
      const ws = Games.wordsFor(learned);
      body = ws.length ? `<ul class="phr">${ws.map(w => `<li><button class="say" data-say="${w.jp}" type="button">♪</button><div><b>${w.jp}</b><small>${w.ro} — ${w.id}</small></div></li>`).join('')}</ul>` : '<p class="muted">Belum ada kosakata. Pelajari huruf di sekolah dulu.</p>';
    } else {
      const list = S().phrases.slice().sort((a, b) => a - b).flatMap(n => DAYS[n - 1].phrases);
      body = list.length ? `<ul class="phr">${list.map(ph => `<li><button class="say" data-say="${ph.jp.replace(/[〜~]/g, '')}" type="button">♪</button><div><b>${ph.jp}</b><small>${ph.ro} — ${ph.id}</small></div></li>`).join('')}</ul>` : '<p class="muted">Kalimat baru muncul setelah pelajaran di kelas.</p>';
    }
    const p = UI.panel(`<div class="win book"><div class="w-title">Buku Catatan</div>${tabs}<div class="book-body">${body}</div><button class="btn block" data-a="close" type="button">Tutup</button></div>`, 'scroll');
    return UI.wait(done => {
      p.querySelectorAll('.tab').forEach(b => b.onclick = () => { Sound.blip(); done(b.dataset.tab); });
      p.querySelectorAll('[data-say]').forEach(b => b.onclick = () => Sound.speak(b.dataset.say));
      p.querySelectorAll('.kc[data-k]').forEach(b => b.onclick = () => kanaDetail(b.dataset.k, done));
      p.querySelector('[data-a=close]').onclick = () => { Sound.blip(); done(null); };
    }).then(async next => {
      UI.closePanel();
      if (next && next.video) { await Video.play({ kana: [next.video], title: `Video: ${next.video}`, outro: 'Coba tulis huruf ini lewat tombol Tulis, ya!' }); UI.closePanel(); Music.play('home'); return book(tab); }
      if (next && next.write) { await Games.shodoCard(next.write, { title: 'Latihan Menulis' }); UI.closePanel(); return book(tab); }
      if (next) return book(next);
    });
  }

  function kanaDetail(k, bookDone) {
    const s = S().st[k] || { c: 0, w: 0 };
    const tw = Lesson.twin(k);
    const m = UI.modal(`
      <button class="b-kana small" type="button">${k}</button>
      <div class="b-ro dark">${KANA[k].ro}</div>
      ${KANA[tw] && !(typeof IS_KANJI !== 'undefined' && IS_KANJI(k)) ? `<p class="muted">${IS_KATA(k) ? 'Hiragana' : 'Katakana'}: <b class="jp">${tw}</b></p>` : ''}
      <p>${KANA[k].tip}</p>
      <p class="muted">Benar ${s.c} kali · salah ${s.w} kali</p>
      <div class="row"><button class="btn ghost" data-a="say" type="button">♪ Dengar</button><button class="btn ghost" data-a="video" type="button">▶ Video</button></div>
      <div class="row"><button class="btn ghost" data-a="write" type="button">✍ Tulis</button><button class="btn" data-a="close" type="button">Tutup</button></div>`, 'detail');
    Sound.speak(k);
    m.querySelector('[data-a=video]').onclick = () => { UI.closeModal(); bookDone({ video: k }); };
    m.querySelector('[data-a=write]').onclick = () => { UI.closeModal(); bookDone({ write: k }); };
    m.querySelector('.b-kana').onclick = () => Sound.speak(k);
    m.querySelector('[data-a=say]').onclick = () => Sound.speak(k);
    m.querySelector('[data-a=close]').onclick = () => UI.closeModal();
  }

  function questLog() {
    const rows = Object.entries(QUESTS).map(([id, Q]) => {
      const st = q(id).state;
      const status = st === 'done' ? '<span class="tag ok">Selesai</span>' : st === 'active' ? '<span class="tag go">Berjalan</span>' : S().day >= Q.from ? '<span class="tag">Tersedia</span>' : `<span class="tag off">Hari ${Q.from}</span>`;
      return `<li class="quest ${st || ''}"><div><b>${Q.title}</b><small>${S().day >= Q.from ? Q.desc : 'Belum tersedia'}</small></div>${status}</li>`;
    }).join('');
    const stamps = S().stamps.length ? S().stamps.map(s => `<div class="stamp"><span>印</span><small>${s.title}</small></div>`).join('') : '<p class="muted">Selesaikan misi dan event teman untuk mengumpulkan stempel.</p>';
    const p = UI.panel(`<div class="win"><div class="w-title">Misi & Stempel</div><ul class="quests">${rows}</ul>
      <div class="sec"><div class="sec-h">Buku stempel (${S().stamps.length})</div><div class="stamps">${stamps}</div></div>
      <button class="btn block" type="button">Tutup</button></div>`, 'scroll');
    return UI.wait(done => { p.querySelector('.btn').onclick = () => { Sound.blip(); UI.closePanel(); done(); }; });
  }

  function report() {
    const rows = DAYS.map((d, i) => {
      const n = i + 1, r = S().days[n];
      const res = !r ? '<span class="muted">—</span>' : r.grade ? `<span class="grade-s g-${r.grade.replace('+', 'p')}">${r.grade}</span>` : Lesson.starHtml(r.stars || 0);
      return `${CHAPTERS.some(c => c.from === n) ? `<tr class="ch"><td colspan="3">Bab ${d.chapter}: ${CHAPTERS[d.chapter - 1].title}</td></tr>` : ''}<tr class="${n > S().day ? 'lock' : ''}"><td>Hari ${n}</td><td>${d.title}<small>${d.sub}</small></td><td>${res}</td></tr>`;
    }).join('');
    let c = 0, w = 0; Object.values(S().st).forEach(s => { c += s.c; w += s.w; });
    const weak = Object.entries(S().st).filter(([, s]) => s.w > 0).sort((a, b) => (b[1].w / (b[1].c + b[1].w)) - (a[1].w / (a[1].c + a[1].w))).slice(0, 6);
    const p = UI.panel(`
      <div class="win report">
        <div class="w-title">Rapor — ${UI.esc(S().name)}</div>
        <div class="stats">
          <div><b>${S().kana.length}</b><small>huruf</small></div>
          <div><b>${c + w ? Math.round(c / (c + w) * 100) : 0}%</b><small>ketepatan</small></div>
          <div><b>🌸${S().points || 0}</b><small>poin</small></div>
          <div><b>${S().stamps.length}</b><small>stempel</small></div>
        </div>
        <div class="hearts center">${FRIENDS.map(f => `<span>${nameOf(f)} <b>♥ ${S().friends[f] || 0}</b></span>`).join('')}</div>
        ${weak.length ? `<div class="sec"><div class="sec-h">Perlu diulang</div><div class="chips">${weak.map(([k]) => `<button class="chip" data-say="${k}" type="button"><b>${k}</b><small>${KANA[k].ro}</small></button>`).join('')}</div></div>` : ''}
        <table class="tbl">${rows}</table>
        <button class="btn block" type="button">Tutup</button>
      </div>`, 'scroll');
    return UI.wait(done => {
      p.querySelectorAll('[data-say]').forEach(b => b.onclick = () => Sound.speak(b.dataset.say));
      p.querySelector('.btn').onclick = () => { Sound.blip(); UI.closePanel(); done(); };
    });
  }

  /* ---------- lemari: kustomisasi karakter ---------- */
  function priceOf(kind, v) { const it = SHOP.find(s => s.kind === kind && s.v === v); return it && !S().owned.includes(kind + ':' + v) ? it.price : 0; }
  function wardrobe(opts = {}) {
    const O = Pix.PLAYER_OPTIONS;
    const look = Object.assign({}, S().look);
    const creator = !!opts.creator;
    const rowHtml = (kind, label, swatch) => `<div class="w-row"><div class="w-lbl">${label}</div><div class="w-opts">${O[kind].map(([v, name]) => {
      const price = priceOf(kind, v);
      const inner = swatch ? `<i style="background:${v}"></i>` : name;
      return `<button class="w-opt ${swatch ? 'swc' : ''} ${look[kind] === v ? 'on' : ''} ${price ? 'lock' : ''}" data-k="${kind}" data-v="${v}" title="${name}" type="button">${inner}${price ? `<em>🌸${price}</em>` : ''}</button>`;
    }).join('')}</div></div>`;
    const p = UI.panel(`
      <div class="win wardrobe">
        <div class="w-title">${creator ? 'Buat karaktermu' : 'Lemari'} <span class="pts-badge">🌸 <b class="pts-n">${S().points || 0}</b></span></div>
        <div class="w-preview"><canvas class="w-face" width="48" height="48"></canvas><canvas class="w-body" width="16" height="16"></canvas></div>
        ${creator ? `<input class="name-in" maxlength="12" autocomplete="off" placeholder="Nama kamu (contoh: Rizki)" value="${UI.esc(S().name || '')}">` : ''}
        ${rowHtml('hair', 'Rambut')}${rowHtml('hairColor', 'Warna rambut', true)}${rowHtml('skin', 'Kulit', true)}
        ${rowHtml('uniform', 'Seragam')}${rowHtml('uniformColor', 'Warna seragam', true)}
        ${rowHtml('accessory', 'Aksesori')}${rowHtml('accColor', 'Warna aksesori', true)}
        <p class="muted small">Barang bertanda 🌸 dibeli dengan poin sakura dari permainan, misi, dan omikuji.</p>
        <button class="btn block" data-a="ok" type="button">${creator ? 'Mulai sekolah ▶' : 'Simpan'}</button>
      </div>`, 'scroll');
    const draw = () => {
      Pix.setPlayer(look);
      Pix.drawPortrait(p.querySelector('.w-face'), 'player', 'happy');
      const b = p.querySelector('.w-body'), c = b.getContext('2d'); c.clearRect(0, 0, 16, 16); c.drawImage(Pix.sprite('player', 'down', 0), 0, 0);
    };
    draw();
    return UI.wait(done => {
      p.querySelectorAll('.w-opt').forEach(btn => btn.onclick = () => {
        const { k, v } = btn.dataset, price = priceOf(k, v);
        if (price) {
          if ((S().points || 0) < price) { Sound.bad(); UI.toast(`Butuh 🌸${price} poin. Poinmu: ${S().points || 0}`); return; }
          if (!confirm(`Beli seharga 🌸${price} poin?`)) return;
          S().points -= price; S().owned.push(k + ':' + v); Save.write();
          btn.classList.remove('lock'); const em = btn.querySelector('em'); if (em) em.remove();
          p.querySelector('.pts-n').textContent = S().points; Sound.star();
        }
        look[k] = v; Sound.blip();
        p.querySelectorAll(`.w-opt[data-k="${k}"]`).forEach(b => b.classList.toggle('on', b.dataset.v === v));
        draw();
      });
      p.querySelector('[data-a=ok]').onclick = () => {
        if (creator) {
          const input = p.querySelector('.name-in');
          const v = input.value.replace(/[<>&"'{}]/g, '').trim().slice(0, 12);
          if (!v) { input.classList.add('shake'); input.focus(); setTimeout(() => input.classList.remove('shake'), 400); return; }
          S().name = v;
        }
        S().look = look; Save.write(); Pix.setPlayer(look); World.refreshLook(); Online.lookChanged(); Sound.blip(); UI.closePanel(); done();
      };
    });
  }

  function settings() {
    const s = S().settings;
    const tog = (k, label, sub) => `<label class="set"><span>${label}<small>${sub}</small></span><input type="checkbox" data-k="${k}" ${s[k] ? 'checked' : ''}><i class="sw"></i></label>`;
    const seg = (k, label, opts) => `<div class="set col"><span>${label}</span><div class="seg">${opts.map(([v, l]) => `<button type="button" class="${s[k] === v ? 'on' : ''}" data-seg="${k}" data-v="${v}">${l}</button>`).join('')}</div></div>`;
    const vsel = (kind, label, sub) => {
      const list = Sound.voices(kind), cur = Sound.voiceName(kind);
      if (!list.length) return '';
      return `<label class="set col"><span>${label}<small>${sub}</small></span><select class="vsel" data-v="${kind}"><option value="">Otomatis (terbaik)</option>${list.map(v => `<option value="${UI.esc(v.name)}" ${s[kind + 'Voice'] === v.name ? 'selected' : ''}>${UI.esc(v.name)}${v.name === cur && !s[kind + 'Voice'] ? ' ✓' : ''}</option>`).join('')}</select></label>`;
    };
    const p = UI.panel(`
      <div class="win settings">
        <div class="w-title">Pengaturan</div>
        <div class="sec-h">Belajar</div>
        ${tog('romaji', 'Tampilkan romaji', 'Cara baca huruf latin di bawah teks Jepang')}
        ${tog('relax', 'Mode santai', 'Tanpa batas waktu di permainan')}
        ${seg('text', 'Kecepatan teks', [['slow', 'Pelan'], ['fast', 'Cepat'], ['instant', 'Langsung']])}
        <div class="sec-h">Suara</div>
        ${tog('voice', 'Suara otomatis', 'Kalimat Jepang langsung diucapkan')}
        <label class="set col"><span>Kecepatan suara<small>Lebih lambat = lebih jelas</small></span><input type="range" min="0.6" max="1.1" step="0.05" value="${s.rate}" data-r="rate"></label>
        <label class="set col"><span>Volume musik</span><input type="range" min="0" max="1" step="0.05" value="${s.music}" data-r="music"></label>
        ${tog('sfx', 'Efek suara', 'Bunyi saat memilih')}
        ${tog('narr', 'Narasi video', 'Sensei menjelaskan dengan suara di video pelajaran')}
        ${vsel('ja', 'Suara bahasa Jepang', 'Pilih yang paling alami (Natural / Google / Online biasanya terbaik)')}
        ${vsel('id', 'Suara narasi sensei', 'Suara bahasa Indonesia untuk penjelasan video')}
        <div class="row"><button class="btn ghost small" data-a="test" type="button">♪ Tes Jepang</button><button class="btn ghost small" data-a="testid" type="button">♪ Tes narasi</button></div>
        ${Sound.hasJa() ? '' : '<p class="warn">Suara bahasa Jepang belum ditemukan. Di Android: Pengaturan → Text-to-Speech → Google → pasang data suara 日本語 (Jepang) & Bahasa Indonesia, lalu muat ulang game.</p>'}
        <div class="sec-h">Grafik</div>
        ${seg('quality', 'Kualitas 3D', [['low', 'Hemat'], ['normal', 'Normal'], ['high', 'Tinggi']])}
        ${tog('fx', 'Kelopak sakura', 'Efek kelopak berjatuhan di kota')}
        ${tog('force2d', 'Mode 2D klasik', 'Untuk HP lama (muat ulang game)')}
        <div class="sec-h">Online (opsional)</div>
        <label class="set col"><span>Alamat server<small>Contoh: wss://nama-server.onrender.com — lihat server/README</small></span><input class="srv" type="text" autocomplete="off" placeholder="wss://..." value="${UI.esc(s.server || '')}"></label>
        <div class="row"><button class="btn ghost small" data-a="conn" type="button">${Online.status === 'on' ? 'Putuskan' : 'Sambungkan'}</button></div>
        <p class="muted small online-st">Status: ${{ on: 'terhubung ✓', off: 'offline', connecting: 'menghubungkan…', error: 'gagal terhubung' }[Online.status]}${World.online ? '' : ' (online hanya di mode 3D)'}</p>
        <button class="btn danger small" data-a="reset" type="button">Hapus semua progres</button>
        <button class="btn block" data-a="close" type="button">Simpan</button>
      </div>`, 'scroll');
    return UI.wait(done => {
      p.querySelectorAll('input[type=checkbox]').forEach(i => i.onchange = () => {
        s[i.dataset.k] = i.checked; Save.write();
        if (i.dataset.k === 'fx') World.setQuality && World.setQuality(s.quality === 'normal' ? 'normal' : s.quality);
        if (i.dataset.k === 'force2d') UI.toast('Muat ulang halaman untuk menerapkan.');
      });
      p.querySelectorAll('input[type=range]').forEach(i => i.oninput = () => { s[i.dataset.r] = +i.value; Save.write(); if (i.dataset.r === 'music') Music.setVolume(); });
      p.querySelectorAll('[data-seg]').forEach(b => b.onclick = () => {
        s[b.dataset.seg] = b.dataset.v; Save.write(); Sound.blip();
        p.querySelectorAll(`[data-seg="${b.dataset.seg}"]`).forEach(x => x.classList.toggle('on', x === b));
        if (b.dataset.seg === 'quality') World.setQuality(b.dataset.v);
      });
      p.querySelector('[data-a=test]').onclick = () => Sound.speak('こんにちは。わたしは たなか です。');
      p.querySelector('[data-a=testid]').onclick = async () => { if (!(await Sound.speakLang('Halo! Ini suara sensei. Yuk, belajar hiragana bareng.'))) UI.toast('Suara bahasa Indonesia tidak ada di perangkat ini.'); };
      p.querySelectorAll('.vsel').forEach(sel => sel.onchange = () => {
        s[sel.dataset.v + 'Voice'] = sel.value; Save.write(); Sound.pickVoice();
        if (sel.dataset.v === 'ja') Sound.speak('こんにちは'); else Sound.speakLang('Halo, apa kabar?');
      });
      p.querySelector('[data-a=conn]').onclick = () => {
        if (Online.status === 'on' || Online.status === 'connecting') { s.online = false; Save.write(); Online.disconnect(); }
        else { s.server = p.querySelector('.srv').value.trim(); s.online = !!s.server; Save.write(); if (!s.server) { UI.toast('Isi alamat server dulu.'); return; } Online.connect(s.server); }
        setTimeout(() => { p.querySelector('.online-st').textContent = 'Status: ' + { on: 'terhubung ✓', off: 'offline', connecting: 'menghubungkan…', error: 'gagal terhubung' }[Online.status]; p.querySelector('[data-a=conn]').textContent = Online.status === 'on' || Online.status === 'connecting' ? 'Putuskan' : 'Sambungkan'; }, 800);
      };
      p.querySelector('[data-a=reset]').onclick = () => { if (confirm('Hapus semua progres dan mulai dari awal?')) { Save.reset(); location.reload(); } };
      p.querySelector('[data-a=close]').onclick = () => { Sound.blip(); UI.closePanel(); done(); };
    });
  }

  /* ---------- layar judul & mulai ---------- */
  async function title() {
    UI.abortAll(); UI.hideDialog(); UI.closePanel(); UI.closeModal();
    UI.showGame(false);
    Pix.setPlayer(S().look);
    World.load('town', 13, 12, 'down', npcsFor('town'));
    World.setPhase('morning'); World.pause(true);
    Music.play('title');
    const has = Save.hasGame();
    const d = DAYS[Math.min(S().day, DAYS.length) - 1];
    const p = UI.panel(`
      <div class="title">
        <div class="logo">
          <div class="logo-jp">にほんご<span>がっこう</span></div>
          <div class="logo-sub">NIHONGO GAKKOU</div>
        </div>
        <p class="tagline">Jadi murid pindahan di Jepang.<br>Belajar hiragana, katakana & percakapan sehari-hari.</p>
        <div class="title-btns">
          ${has ? `<button class="btn" data-a="cont" type="button">Lanjutkan — Hari ${Math.min(S().day, DAYS.length)} · Bab ${d.chapter}</button>` : ''}
          <button class="btn ${has ? 'ghost' : ''}" data-a="new" type="button">${has ? 'Main dari awal' : 'Mulai'}</button>
        </div>
        <div class="ver">v3 「さくら の てがみ」 · Bab 1–${CHAPTERS.length} · ${World.is3D ? '3D' : '2D'}</div>
      </div>`, 'title-p');
    const a = await UI.wait(done => p.querySelectorAll('[data-a]').forEach(b => b.onclick = () => { Sound.unlock(); Music.unlock(); Sound.blip(); done(b.dataset.a); }));
    if (a === 'new') {
      if (has && !confirm('Mulai dari awal? Progres lama akan dihapus.')) return title();
      if (has) Save.reset();
      if (window.Story) Story.init();
      UI.closePanel();
      await wardrobe({ creator: true });
      return start(true);
    }
    UI.closePanel();
    return start(false);
  }

  async function start(isNew) {
    UI.showGame(true);
    World.resize();
    busy = true;
    try {
      await UI.fade(() => { World.setPet(Relax.activePet() ? Relax.activePet().id : null); World.load('home', 3, 3, 'left', npcsFor('home')); mood(); refreshHud(); });
      Online.autoStart();
      if (isNew && window.Story && !Story.has('prolog_done')) {
        await Story.prologue();
        await UI.fade(() => { World.load('home', 3, 3, 'left', npcsFor('home')); mood(); refreshHud(); });
        await chapterCard(1);
      } else if (isNew) {
        await UI.say({ n: 'Musim semi. Kamu baru saja pindah dari Indonesia dan tinggal bersama Nenek Sato di kota kecil di Jepang.' });
        await UI.say({ w: 'obaa', e: 'happy', jp: 'ようこそ、{name}ちゃん。', ro: 'youkoso, {name}-chan.', id: 'Selamat datang, {name}.' });
        await UI.say({ n: 'Cara main: ketuk layar untuk berjalan, atau pakai tombol arah. Ketuk orang atau tekan A untuk bicara.' });
        await UI.say({ n: 'Tugasmu selalu tertulis di kiri atas. Ketuk tulisan itu untuk berjalan otomatis ke tujuan!' });
        UI.hideDialog();
        await chapterCard(1);
      } else if (window.Story) await Story.welcomeBack();
      if (day()) { if (S().step === 'wake') await dayCard(); }
      else await UI.say({ n: 'Semua bab sudah selesai. Pakai Latihan Bebas di meja belajar untuk mengulang.' });
      UI.hideDialog();
      await Extras.login();
    } catch (e) { if (!(e && e.abort)) console.error(e); }
    UI.hideDialog();
    busy = false; World.pause(false); refreshHud();
  }

  return {
    title, interact, warp, blocked, menu, cancelAuto,
    // pembantu untuk modul tempat (places.js)
    h: { runLines, menuChoice, addPoints, addStamp, heart, q, setQ, goTo, chapter },
    get busy() { return busy; }, _menuClose: null,
  };
})();
