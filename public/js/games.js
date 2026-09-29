/* =========================================================
   MINI-GAME BELAJAR
   karuta   : dengarkan huruf, ambil kartu yang benar secepatnya
   catch    : "Hujan Huruf", tangkap gelembung huruf yang cocok
   speed    : benar atau salah kilat
   kanahunt : cari semua huruf yang sama di antara huruf mirip
   wordmatch: pasangkan kata Jepang dengan artinya
   dictation: dikte, dengar bunyi lalu tulis hurufnya tanpa contoh
   builder  : susun huruf menjadi kata
   shodo    : kaligrafi dengan kuas, tulisan dinilai otomatis
   shop     : belanja di konbini sesuai daftar katakana
   Semua mengembalikan { score, max }.
   ========================================================= */
const Games = (() => {
  const shuffle = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [b[i], b[j]] = [b[j], b[i]]; } return b; };
  const pick = a => a[Math.random() * a.length | 0];
  const relax = () => !!Save.d.settings.relax;
  const learnedSet = () => new Set(Save.d.kana);

  function stat(k, ok) { const s = Save.d.st[k] || (Save.d.st[k] = { c: 0, w: 0 }); ok ? s.c++ : s.w++; }
  const scriptOf = k => (typeof SCRIPT_OF !== 'undefined' ? SCRIPT_OF(k) : IS_KATA(k) ? 'kata' : 'hira');
  function sameScript(k, pool) {
    const sc = scriptOf(k), ro = KANA[k] && KANA[k].ro;
    const ok = x => scriptOf(x) === sc && KANA[x] && (x === k || KANA[x].ro !== ro);
    const mine = pool.filter(ok);
    const all = Object.keys(KANA).filter(ok);
    return { mine, all };
  }
  function distractors(k, pool, n) {
    const { mine, all } = sameScript(k, pool);
    return shuffle(mine.filter(x => x !== k)).concat(shuffle(all.filter(x => x !== k && !mine.includes(x)))).slice(0, n);
  }
  function header(title, extra = '') {
    return `<div class="g-head"><span class="g-title">${title}</span>${extra}</div>`;
  }

  /* ---------- hasil permainan ---------- */
  function result(title, score, max, note) {
    const ratio = max ? score / max : 0;
    const stars = ratio >= .85 ? 3 : ratio >= .6 ? 2 : ratio > 0 ? 1 : 0;
    const pts = Math.round(ratio * 20) + stars * 5;
    Save.d.points = (Save.d.points || 0) + pts; Save.write();
    const p = UI.panel(`
      <div class="win result">
        <div class="r-title">${title}</div>
        ${Lesson.starHtml(stars)}
        <div class="r-score">${score} / ${max}</div>
        ${note ? `<div class="r-msg">${note}</div>` : ''}
        <div class="pts">+${pts} <span>poin sakura</span></div>
        <button class="btn" type="button">Lanjut ▶</button>
      </div>`, 'center');
    Sound.star();
    return UI.wait(done => { p.querySelector('.btn').onclick = () => { Sound.blip(); UI.closePanel(); done({ score, max, stars, pts }); }; });
  }

  /* ---------- 1. KARUTA ---------- */
  async function karuta({ pool, rounds = 8, title = 'Karuta' }) {
    pool = pool && pool.length ? pool : Save.d.kana;
    Music.play('game');
    let score = 0;
    const order = shuffle(pool.length >= rounds ? pool : [...pool, ...pool, ...pool]).slice(0, rounds);
    for (let r = 0; r < order.length; r++) {
      const k = order[r];
      const cards = shuffle([k, ...distractors(k, pool, 5)]);
      const ok = await UI.wait(done => {
        const p = UI.panel(`
          <div class="game karuta">
            ${header(title, `<span class="g-info">${r + 1}/${order.length} · ★ ${score}</span>`)}
            <div class="reader"><div class="reader-card"><span class="rd-ro">…</span><button class="say" type="button" aria-label="Dengar lagi">♪</button></div>
              ${relax() ? '' : '<div class="timer"><i></i></div>'}</div>
            <div class="tatami">${cards.map(c => `<button class="kcard" type="button" data-k="${c}"><b>${c}</b></button>`).join('')}</div>
            <p class="g-hint">Dengarkan (atau baca romaji), lalu ambil kartu yang benar!</p>
          </div>`, 'gamep');
        const ro = p.querySelector('.rd-ro');
        const speak = () => Sound.speak(k);
        speak();
        const reveal = setTimeout(() => { ro.textContent = KANA[k].ro; }, Sound.hasJa() ? 1400 : 0);
        p.querySelector('.say').onclick = speak;
        let finished = false, tmr = null;
        const end = good => {
          if (finished) return; finished = true; clearTimeout(reveal); clearTimeout(tmr);
          ro.textContent = KANA[k].ro;
          p.querySelectorAll('.kcard').forEach(b => { b.disabled = true; if (b.dataset.k === k) b.classList.add(good ? 'taken' : 'right'); });
          stat(k, good);
          setTimeout(() => done(good), good ? 650 : 1300);
        };
        if (!relax()) {
          const bar = p.querySelector('.timer i'); const T0 = Date.now(), LIM = 7000;
          const tick = () => { if (finished || !p.isConnected) return; const f = 1 - (Date.now() - T0) / LIM; bar.style.width = Math.max(0, f * 100) + '%'; if (f <= 0) { Sound.bad(); end(false); } else tmr = setTimeout(tick, 100); };
          tick();
        }
        p.querySelectorAll('.kcard').forEach(b => b.onclick = () => {
          if (finished) return;
          if (b.dataset.k === k) { Sound.ok(); score++; end(true); }
          else { Sound.bad(); b.classList.add('wrong'); setTimeout(() => b.classList.remove('wrong'), 350); stat(k, false); }
        });
      });
      void ok;
    }
    Save.write();
    if (score === order.length && typeof Extras !== 'undefined') Extras.bump('karutaPerfect');
    return result('Karuta', score, order.length, score === order.length ? 'Sempurna! Kamu juara karuta!' : 'Karuta melatih telinga dan kecepatan membaca.');
  }

  /* ---------- 2. HUJAN HURUF ---------- */
  async function catchGame({ pool, goal = 8, title = 'Hujan Huruf' }) {
    pool = pool && pool.length ? pool : Save.d.kana;
    Music.play('game');
    const res = await UI.wait(done => {
      const p = UI.panel(`
        <div class="game catch">
          ${header(title, `<span class="g-info"><b class="c-score">0</b>/${goal}</span>`)}
          <div class="c-target">Tangkap: <b class="c-ro"></b> <button class="say" type="button">♪</button></div>
          ${relax() ? '' : '<div class="timer"><i></i></div>'}
          <div class="c-field"></div>
          <p class="g-hint">Ketuk gelembung berisi huruf yang cocok. Awas yang salah!</p>
        </div>`, 'gamep');
      const field = p.querySelector('.c-field'), roEl = p.querySelector('.c-ro'), scEl = p.querySelector('.c-score');
      let target = pick(pool), score = 0, miss = 0, over = false, spawnT = null, tmr = null;
      const setTarget = () => { target = pick(pool); roEl.textContent = KANA[target].ro; };
      setTarget();
      p.querySelector('.say').onclick = () => Sound.speak(target);
      const finish = () => { if (over) return; over = true; clearTimeout(spawnT); clearTimeout(tmr); field.innerHTML = ''; done({ score, miss }); };
      const spawn = () => {
        if (over || !field.isConnected) return;
        const isT = Math.random() < .42;
        const k = isT ? target : pick(distractors(target, pool, 4).concat(pool.filter(x => x !== target)));
        const b = document.createElement('button');
        b.className = 'bubble'; b.type = 'button'; b.textContent = k;
        b.style.left = (6 + Math.random() * 74) + '%';
        b.style.animationDuration = (relax() ? 6.5 : 4.6) + Math.random() * 1.2 + 's';
        b.onpointerdown = e => {
          e.preventDefault(); if (over || b.classList.contains('pop')) return;
          if (k === target) { Sound.ok(); score++; scEl.textContent = score; stat(k, true); b.classList.add('pop'); setTimeout(() => b.remove(), 250); if (score >= goal) return finish(); setTarget(); }
          else { Sound.bad(); miss++; stat(target, false); b.classList.add('bad'); setTimeout(() => b.remove(), 300); }
        };
        b.addEventListener('animationend', () => b.remove());
        field.appendChild(b);
        spawnT = setTimeout(spawn, relax() ? 900 : 620);
      };
      spawn();
      if (!relax()) {
        const bar = p.querySelector('.timer i'), T0 = Date.now(), LIM = 40000;
        const tick = () => { if (over || !p.isConnected) return; const f = 1 - (Date.now() - T0) / LIM; bar.style.width = Math.max(0, f * 100) + '%'; if (f <= 0) finish(); else tmr = setTimeout(tick, 200); };
        tick();
      }
    });
    Save.write();
    return result('Hujan Huruf', res.score, goal, res.miss ? `Salah tangkap: ${res.miss} kali` : 'Tanpa salah sama sekali!');
  }

  /* ---------- 3. BENAR ATAU SALAH KILAT ---------- */
  async function speed({ pool, goal = 12, title = 'Benar atau Salah?' }) {
    pool = pool && pool.length ? pool : Save.d.kana;
    Music.play('game');
    const res = await UI.wait(done => {
      const p = UI.panel(`
        <div class="game speed">
          ${header(title, '<span class="g-info">★ <b class="sp-s">0</b> · <b class="sp-n">0</b>/' + goal + '</span>')}
          ${relax() ? '' : '<div class="timer"><i></i></div>'}
          <div class="sp-card"><div class="sp-kana jp"></div><div class="sp-eq">=</div><div class="sp-ro"></div></div>
          <div class="sp-btns"><button class="sp-b yes" type="button">⭕ Benar</button><button class="sp-b no" type="button">❌ Salah</button></div>
          <p class="g-hint">Apakah huruf dan cara bacanya cocok? Jawab secepat mungkin!</p>
        </div>`, 'gamep');
      const kEl = p.querySelector('.sp-kana'), rEl = p.querySelector('.sp-ro'), card = p.querySelector('.sp-card');
      let n = 0, score = 0, cur = null, over = false, tmr = null;
      const next = () => {
        if (n >= goal) return finish();
        const k = pick(pool), truth = Math.random() < .5;
        const other = distractors(k, pool, 3)[0] || k;
        cur = { k, truth: truth || other === k };
        kEl.textContent = k; rEl.textContent = cur.truth ? KANA[k].ro : KANA[other].ro;
        card.className = 'sp-card pop';
      };
      const finish = () => { if (over) return; over = true; clearTimeout(tmr); done({ score, n }); };
      const answer = yes => {
        if (over || !cur) return;
        const ok = yes === cur.truth; n++;
        stat(cur.k, ok);
        if (ok) { score++; Sound.ok(); card.className = 'sp-card good'; } else { Sound.bad(); card.className = 'sp-card bad'; UI.toast(`${cur.k} dibaca "${KANA[cur.k].ro}"`); }
        p.querySelector('.sp-s').textContent = score; p.querySelector('.sp-n').textContent = n;
        cur = null; setTimeout(next, ok ? 350 : 900);
      };
      p.querySelector('.yes').onclick = () => answer(true);
      p.querySelector('.no').onclick = () => answer(false);
      next();
      if (!relax()) {
        const bar = p.querySelector('.timer i'), T0 = Date.now(), LIM = 45000;
        const tick = () => { if (over || !p.isConnected) return; const f = 1 - (Date.now() - T0) / LIM; bar.style.width = Math.max(0, f * 100) + '%'; if (f <= 0) finish(); else tmr = setTimeout(tick, 200); };
        tick();
      }
    });
    Save.write();
    return result('Benar atau Salah', res.score, Math.max(res.n, 1), 'Kecepatan membaca adalah kunci!');
  }

  /* ---------- 3b. CARI HURUF ---------- */
  async function kanahunt({ pool, rounds = 3, title = 'Cari Huruf' }) {
    pool = pool && pool.length ? pool : Save.d.kana;
    Music.play('game');
    let score = 0, total = 0;
    const targets = shuffle(pool).slice(0, rounds);
    for (let r = 0; r < targets.length; r++) {
      const k = targets[r], count = 3 + (Math.random() * 3 | 0);
      const others = distractors(k, pool, 6);
      const cells = shuffle([...Array(count).fill(k), ...Array.from({ length: 16 - count }, () => pick(others.length ? others : [k]))]);
      total += count;
      const found = await UI.wait(done => {
        const p = UI.panel(`
          <div class="game hunt">
            ${header(title, `<span class="g-info">${r + 1}/${targets.length}</span>`)}
            <div class="c-target">Temukan semua: <b class="jp hunt-k">${k}</b> <span class="muted">(${KANA[k].ro})</span> <button class="say" type="button">♪</button></div>
            <div class="hunt-grid">${cells.map((c, i) => `<button class="hc jp" type="button" data-i="${i}">${c}</button>`).join('')}</div>
            <p class="g-hint">Masih ada <b class="left">${count}</b> lagi. Hati-hati dengan huruf yang mirip!</p>
          </div>`, 'gamep');
        p.querySelector('.say').onclick = () => Sound.speak(k);
        let left = count, miss = 0;
        p.querySelectorAll('.hc').forEach(b => b.onclick = () => {
          if (b.classList.contains('got')) return;
          if (cells[+b.dataset.i] === k) {
            Sound.ok(); b.classList.add('got'); left--; p.querySelector('.left').textContent = left;
            if (!left) { stat(k, miss === 0); setTimeout(() => done(Math.max(0, count - miss)), 600); }
          } else { Sound.bad(); miss++; b.classList.add('wrong'); UI.toast(`Itu ${cells[+b.dataset.i]} (${KANA[cells[+b.dataset.i]].ro})`); setTimeout(() => b.classList.remove('wrong'), 350); }
        });
      });
      score += found;
    }
    Save.write();
    return result('Cari Huruf', score, total, 'Mata yang teliti membuat membaca jadi cepat.');
  }

  /* ---------- 3c. PASANGKAN KATA ---------- */
  async function wordmatch({ words, count = 5, title = 'Pasangkan Kata' }) {
    let list = words && words.length >= 3 ? words : wordsFor(learnedSet());
    if (list.length < 3) return karuta({ pool: Save.d.kana, title });
    list = shuffle(list).slice(0, count);
    Music.play('game');
    const res = await UI.wait(done => {
      const right = shuffle(list);
      const p = UI.panel(`
        <div class="game match">
          ${header(title, '<span class="g-info">✓ <b class="m-ok">0</b>/' + list.length + '</span>')}
          <div class="wm">
            <div class="wm-col">${list.map((w, i) => `<button class="wm-b jp" data-l="${i}" type="button">${w.jp}</button>`).join('')}</div>
            <div class="wm-col">${right.map((w, i) => `<button class="wm-b" data-r="${i}" type="button">${w.id}</button>`).join('')}</div>
          </div>
          <p class="g-hint">Ketuk kata Jepang, lalu ketuk artinya.</p>
        </div>`, 'gamep');
      let sel = null, ok = 0, miss = 0;
      p.querySelectorAll('[data-l]').forEach(b => b.onclick = () => {
        if (b.classList.contains('done')) return;
        p.querySelectorAll('[data-l]').forEach(x => x.classList.remove('sel'));
        b.classList.add('sel'); sel = list[+b.dataset.l]; sel._btn = b; Sound.speak(sel.jp);
      });
      p.querySelectorAll('[data-r]').forEach(b => b.onclick = () => {
        if (!sel || b.classList.contains('done')) return;
        if (right[+b.dataset.r] === sel) {
          Sound.ok(); ok++; b.classList.add('done'); sel._btn.classList.add('done'); sel._btn.classList.remove('sel'); sel = null;
          p.querySelector('.m-ok').textContent = ok;
          if (ok === list.length) setTimeout(() => done({ ok, miss }), 600);
        } else { Sound.bad(); miss++; b.classList.add('wrong'); UI.toast(`${sel.jp} (${sel.ro}) = ${sel.id}`); setTimeout(() => b.classList.remove('wrong'), 350); }
      });
    });
    Save.write();
    return result('Pasangkan Kata', Math.max(0, res.ok - res.miss), res.ok, res.miss ? `Salah pasang: ${res.miss} kali` : 'Semua benar!');
  }

  /* ---------- 3d. DIKTE ---------- */
  async function dictation({ pool, count = 3, title = 'Dikte' }) {
    pool = pool && pool.length ? pool : Save.d.kana;
    Music.play('home');
    const ks = shuffle(pool).slice(0, count);
    let score = 0;
    for (let i = 0; i < ks.length; i++) score += await shodoCard(ks[i], { title, info: `${i + 1}/${ks.length}`, blind: true });
    Save.write();
    return result('Dikte', score, ks.length * 3, 'Menulis dari ingatan = hafal sungguhan!');
  }

  /* ---------- 4. SUSUN KATA ---------- */
  function wordsFor(known) { return WORDS.filter(w => [...w.jp].every(c => knownChar(c, known))); }
  async function builder({ words, count = 4, title = 'Susun Kata' }) {
    const known = learnedSet();
    let list = words && words.length ? words : wordsFor(known);
    if (list.length < 2) return karuta({ pool: Save.d.kana, title });
    list = shuffle(list).slice(0, count);
    Music.play('game');
    let score = 0;
    for (let r = 0; r < list.length; r++) {
      const w = list[r], chars = [...w.jp].filter(c => c !== ' ');
      const extra = distractors(chars.find(c => c !== 'ー') || chars[0], Save.d.kana.length ? Save.d.kana : chars, 2);
      const tiles = shuffle([...chars, ...extra]);
      const good = await UI.wait(done => {
        const p = UI.panel(`
          <div class="game builder">
            ${header(title, `<span class="g-info">${r + 1}/${list.length} · ★ ${score}</span>`)}
            <div class="b-card"><div class="b-mean">${w.id}</div><button class="say" type="button">♪</button></div>
            <div class="slots" data-answer="${chars.join('')}">${chars.map((_, i) => `<button class="slot" type="button" data-i="${i}"></button>`).join('')}</div>
            <div class="tiles">${tiles.map((c, i) => `<button class="tile" type="button" data-i="${i}">${c}</button>`).join('')}</div>
            <p class="g-hint">Ketuk huruf sesuai urutan. Ketuk kotak atas untuk menghapus.</p>
          </div>`, 'gamep');
        const slots = [...p.querySelectorAll('.slot')], tb = [...p.querySelectorAll('.tile')];
        const fill = []; let tries = 0;
        p.querySelector('.say').onclick = () => Sound.speak(w.jp);
        const render = () => slots.forEach((s, i) => { s.textContent = fill[i] != null ? tiles[fill[i]] : ''; s.classList.toggle('on', fill[i] != null); });
        const check = () => {
          const guess = fill.map(i => tiles[i]).join('');
          if (guess === chars.join('')) {
            Sound.ok(); slots.forEach(s => s.classList.add('good')); Sound.speak(w.jp);
            chars.forEach(c => c !== 'ー' && stat(c, tries === 0));
            setTimeout(() => done(tries === 0), 900);
          } else {
            Sound.bad(); tries++;
            p.querySelector('.slots').classList.add('shake');
            setTimeout(() => {
              p.querySelector('.slots').classList.remove('shake'); fill.length = 0; tb.forEach(t => t.disabled = false); render();
              if (tries >= 2) { p.querySelector('.g-hint').innerHTML = `Petunjuk: <b class="jp">${w.jp}</b> (${w.ro})`; }
            }, 450);
          }
        };
        tb.forEach(t => t.onclick = () => {
          if (fill.length >= chars.length) return;
          fill.push(+t.dataset.i); t.disabled = true; Sound.blip(); render();
          if (fill.length === chars.length) check();
        });
        slots.forEach((s, i) => s.onclick = () => { if (fill[i] == null) return; const removed = fill.splice(i); removed.forEach(x => tb[x].disabled = false); render(); });
      });
      if (good) score++;
    }
    Save.write();
    return result('Susun Kata', score, list.length, 'Kata-kata ini tersimpan di Buku Catatan.');
  }

  /* ---------- 5. KALIGRAFI (dinilai) ---------- */
  /* Menggambar goresan KanjiVG (kotak 109x109) ke canvas */
  function strokePaths(ctx, k, size, upto, style) {
    const list = (typeof STROKES !== 'undefined' && STROKES[k]) || [];
    ctx.save(); ctx.scale(size / 109, size / 109); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    list.forEach((d, i) => {
      if (i >= upto) return;
      const st = style(i); if (!st) return;
      ctx.strokeStyle = st.color; ctx.lineWidth = st.width; ctx.stroke(new Path2D(d));
    });
    ctx.restore();
    return list.length;
  }
  function strokeStart(d) { const m = d.match(/[Mm]\s*([\d.]+)[ ,]([\d.]+)/); return m ? [+m[1], +m[2]] : [0, 0]; }

  /* ---------- 5. KALIGRAFI (bertahap per goresan, dinilai) ---------- */
  function shodoCard(k, opt = {}) {
    const strokes = (typeof STROKES !== 'undefined' && STROKES[k]) || [];
    const n = strokes.length;
    let blind = !!opt.blind;   // mode dikte: contoh huruf disembunyikan
    const p = UI.panel(`
      <div class="game shodo">
        ${header(opt.title || 'Kaligrafi', `<span class="g-info">${opt.info || ''}</span>`)}
        <div class="washi">
          <div class="w-top"><b class="w-k">${blind ? '？' : k}</b> <span>${KANA[k].ro}</span> <em class="w-step"></em></div>
          ${blind ? `<div class="dict-say"><button class="say" type="button">♪</button> Dengarkan, lalu tulis hurufnya dari ingatan!</div>` : ''}
          ${n ? `<div class="steps ${blind ? 'hide' : ''}">${strokes.map((_, i) => `<canvas class="stp" data-i="${i}" width="88" height="88"></canvas>`).join('')}</div>` : ''}
          <div class="trace-wrap"><canvas class="trace"></canvas><div class="hanko"></div></div>
        </div>
        <p class="g-hint">Ikuti goresan yang <b style="color:#d8455d">berwarna</b> dari titik bernomor. Setelah satu goresan, lanjut ke goresan berikutnya.</p>
        <div class="row three">
          <button class="btn ghost" data-a="demo" type="button">${blind ? '💡 Petunjuk' : '▶ Contoh'}</button>
          <button class="btn ghost" data-a="clear" type="button">Hapus</button>
          <button class="btn" data-a="done" type="button">Nilai ✓</button>
        </div>
      </div>`, 'gamep');
    // deretan langkah seperti di buku pelajaran
    p.querySelectorAll('.stp').forEach(c => {
      const i = +c.dataset.i, x = c.getContext('2d');
      x.fillStyle = '#fffaf0'; x.fillRect(0, 0, 88, 88);
      x.strokeStyle = 'rgba(160,60,60,.25)'; x.setLineDash([3, 3]); x.beginPath(); x.moveTo(44, 0); x.lineTo(44, 88); x.moveTo(0, 44); x.lineTo(88, 44); x.stroke(); x.setLineDash([]);
      x.translate(4, 4);
      strokePaths(x, k, 80, i + 1, j => j < i ? { color: '#8a7f86', width: 6 } : { color: '#d8455d', width: 7 });
      const [sx, sy] = strokeStart(strokes[i]);
      x.fillStyle = '#d8455d'; x.beginPath(); x.arc(sx * 80 / 109, sy * 80 / 109, 7, 0, 7); x.fill();
      x.fillStyle = '#fff'; x.font = '700 10px sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(i + 1, sx * 80 / 109, sy * 80 / 109 + .5);
    });
    const cv = p.querySelector('canvas.trace'), hanko = p.querySelector('.hanko'), stepEl = p.querySelector('.w-step');
    const size = Math.max(180, Math.min(cv.parentElement.clientWidth || 240, 250));
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = size * dpr; cv.height = size * dpr; cv.style.width = cv.style.height = size + 'px';
    const ctx = cv.getContext('2d'); ctx.scale(dpr, dpr);
    const inkFull = document.createElement('canvas'); inkFull.width = inkFull.height = size * dpr;
    const inkX = inkFull.getContext('2d'); inkX.scale(dpr, dpr);
    const R = 64;
    const inkC = document.createElement('canvas'); inkC.width = inkC.height = R; const ink = inkC.getContext('2d');
    const font = s => `700 ${s}px "Zen Maru Gothic","Hiragino Maru Gothic ProN","Noto Sans JP",sans-serif`;
    let last = null, lastT = 0, drawn = 0, step = 0, demo = null, strokeInk = 0;

    function redraw(demoProg) {
      ctx.clearRect(0, 0, size, size);
      ctx.strokeStyle = 'rgba(160,60,60,.18)'; ctx.setLineDash([5, 6]); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(size / 2, 0); ctx.lineTo(size / 2, size); ctx.moveTo(0, size / 2); ctx.lineTo(size, size / 2); ctx.stroke(); ctx.setLineDash([]);
      if (n && blind) { /* dikte: tanpa contoh */ }
      else if (n) {
        const pad = size * .06, S2 = size - pad * 2;
        ctx.save(); ctx.translate(pad, pad);
        strokePaths(ctx, k, S2, n, i => i === step && demoProg == null ? { color: 'rgba(216,69,93,.35)', width: 9 } : { color: 'rgba(40,30,50,.12)', width: 8 });
        if (demoProg == null && step < n) {
          const [sx, sy] = strokeStart(strokes[step]), f = S2 / 109;
          ctx.fillStyle = '#d8455d'; ctx.beginPath(); ctx.arc(sx * f, sy * f, 9, 0, 7); ctx.fill();
          ctx.fillStyle = '#fff'; ctx.font = '700 11px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(step + 1, sx * f, sy * f + .5);
        }
        if (demoProg != null) {
          // animasi contoh: goresan muncul satu per satu
          ctx.scale(S2 / 109, S2 / 109); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
          strokes.forEach((d, i) => {
            const local = Math.max(0, Math.min(1, demoProg * n - i)); if (!local) return;
            const pth = document.createElementNS('http://www.w3.org/2000/svg', 'path'); pth.setAttribute('d', d);
            const L = pth.getTotalLength ? pth.getTotalLength() || 100 : 100;
            ctx.strokeStyle = '#1d1a22'; ctx.lineWidth = 6.5; ctx.setLineDash([L, L]); ctx.lineDashOffset = L * (1 - local); ctx.stroke(new Path2D(d)); ctx.setLineDash([]);
          });
        }
        ctx.restore();
      } else if (!blind) {
        ctx.fillStyle = 'rgba(40,30,50,.13)'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.font = font(Math.round(size * .78)); ctx.fillText(k, size / 2, size / 2 + size * .03);
      }
      if (demoProg == null) ctx.drawImage(inkFull, 0, 0, size, size);
      stepEl.textContent = blind ? `${n} goresan` : n ? (step < n ? `Goresan ${step + 1} dari ${n}` : 'Semua goresan selesai!') : '';
      p.querySelectorAll('.stp').forEach(c => c.classList.toggle('on', +c.dataset.i === step));
    }
    function clearAll() {
      inkX.clearRect(0, 0, size, size); ink.clearRect(0, 0, R, R);
      drawn = 0; step = 0; hanko.className = 'hanko'; hanko.textContent = ''; redraw();
    }
    clearAll();
    if (document.fonts && document.fonts.load && !n) document.fonts.load(font(40), k).then(() => { if (!drawn) redraw(); }).catch(() => {});
    function playDemo() {
      cancelAnimationFrame(demo); const T0 = performance.now(), DUR = Math.max(1, n) * 900;
      Sound.speak(k);
      const tick = now => { const f = (now - T0) / DUR; if (f >= 1) { demo = null; redraw(); return; } redraw(f); demo = requestAnimationFrame(tick); };
      demo = requestAnimationFrame(tick);
    }
    const reveal = () => { blind = false; p.querySelector('.w-k').textContent = k; const st = p.querySelector('.steps'); if (st) st.classList.remove('hide'); redraw(); };
    if (blind) { const say = () => Sound.speak(k); setTimeout(say, 300); p.querySelector('.dict-say .say').onclick = say; }
    else setTimeout(playDemo, 300);

    const pos = e => { const r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) * size / r.width, y: (e.clientY - r.top) * size / r.height }; };
    cv.onpointerdown = e => { e.preventDefault(); if (demo) { cancelAnimationFrame(demo); demo = null; redraw(); } cv.setPointerCapture(e.pointerId); last = pos(e); lastT = performance.now(); strokeInk = 0; };
    cv.onpointermove = e => {
      if (!last) return; const q = pos(e), now = performance.now();
      const dist = Math.hypot(q.x - last.x, q.y - last.y), speed = dist / Math.max(1, now - lastT);
      const wBr = size * (0.07 - Math.min(0.03, speed * 0.02));   // kuas: pelan = tebal, cepat = tipis
      [[inkX, 1], [ctx, 1]].forEach(([c]) => { c.strokeStyle = '#1d1a22'; c.lineWidth = wBr; c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath(); c.moveTo(last.x, last.y); c.lineTo(q.x, q.y); c.stroke(); });
      ink.strokeStyle = '#000'; ink.lineWidth = wBr * R / size; ink.lineCap = 'round';
      ink.beginPath(); ink.moveTo(last.x * R / size, last.y * R / size); ink.lineTo(q.x * R / size, q.y * R / size); ink.stroke();
      drawn += dist; strokeInk += dist; last = q; lastT = now;
    };
    cv.onpointerup = cv.onpointercancel = () => {
      if (last && strokeInk > size * .06 && step < n) { step++; Sound.blip(); redraw(); }
      last = null;
    };

    // Penilaian: (1) seberapa banyak jalur goresan asli yang dilewati tinta,
    // (2) seberapa banyak tinta yang berada dekat jalur (tidak asal coret)
    function grade() {
      const id = ink.getImageData(0, 0, R, R).data;
      const inkAt = (x, y) => x >= 0 && y >= 0 && x < R && y < R && id[(y * R + x) * 4 + 3] > 60;
      const m = document.createElement('canvas'); m.width = m.height = R; const mc = m.getContext('2d');
      const pad = R * .06, f = (R - pad * 2) / 109;
      let samples = 0, covered = 0; const perStroke = [];
      if (n) {
        mc.translate(pad, pad); strokePaths(mc, k, R - pad * 2, n, () => ({ color: '#000', width: 7 }));
        strokes.forEach(d => {
          const e = document.createElementNS('http://www.w3.org/2000/svg', 'path'); e.setAttribute('d', d);
          const L = e.getTotalLength ? e.getTotalLength() : 0, N = Math.max(8, Math.round(L / 4));
          let sc = 0;
          for (let i = 0; i <= N; i++) {
            const q = e.getPointAtLength(L * i / N), x = Math.round(pad + q.x * f), y = Math.round(pad + q.y * f);
            samples++;
            let hit = false; for (let dy = -3; dy <= 3 && !hit; dy++) for (let dx = -3; dx <= 3; dx++) if (inkAt(x + dx, y + dy)) { hit = true; break; }
            if (hit) { covered++; sc++; }
          }
          perStroke.push(sc / (N + 1));
        });
      } else { mc.fillStyle = '#000'; mc.textAlign = 'center'; mc.textBaseline = 'middle'; mc.font = font(Math.round(R * .78)); mc.fillText(k, R / 2, R / 2 + R * .03); }
      const md = mc.getImageData(0, 0, R, R).data;
      const maskAt = (x, y) => x >= 0 && y >= 0 && x < R && y < R && md[(y * R + x) * 4 + 3] > 100;
      let I = 0, inside = 0, M = 0, cov2 = 0;
      for (let y = 0; y < R; y++) for (let x = 0; x < R; x++) {
        if (maskAt(x, y)) { M++; if (inkAt(x, y)) cov2++; }
        if (!inkAt(x, y)) continue;
        I++;
        let near = false; for (let dy = -2; dy <= 2 && !near; dy++) for (let dx = -2; dx <= 2; dx++) if (maskAt(x + dx, y + dy)) { near = true; break; }
        if (near) inside++;
      }
      if (!I) return 0;
      // rata-rata per goresan: setiap goresan harus ditulis
      const coverage = n ? perStroke.reduce((a, b) => a + b, 0) / n : cov2 / Math.max(1, M);
      const precision = inside / I;
      let score = coverage * .7 + precision * .3;
      const worst = n ? Math.min(...perStroke) : 1;
      if (worst < .5) score *= .55 + worst * .5;   // ada goresan yang terlewat
      return score;
    }

    // dua mode: menulis → dinilai (bisa diulang)
    return UI.wait(done => {
      const clearBtn = p.querySelector('[data-a=clear]'), doneBtn = p.querySelector('[data-a=done]');
      let graded = null;
      const toDraw = () => { graded = null; clearAll(); clearBtn.textContent = 'Hapus'; doneBtn.textContent = 'Nilai ✓'; };
      clearBtn.onclick = toDraw;
      p.querySelector('[data-a=demo]').onclick = () => { if (graded !== null) toDraw(); if (blind) { reveal(); UI.toast('Petunjuk dibuka. Coba tulis lagi!'); } playDemo(); };
      doneBtn.onclick = () => {
        if (graded !== null) { Sound.blip(); cancelAnimationFrame(demo); done(graded); return; }
        if (!drawn) { UI.toast('Tulis hurufnya dulu, ya!'); return; }
        const s = grade(); window.__lastShodo = s;
        graded = s >= .86 ? 3 : s >= .72 ? 2 : s >= .6 ? 1 : 0;
        if (blind) { reveal(); Sound.speak(k); }
        hanko.className = 'hanko on s' + graded;
        hanko.textContent = ['もう一度', 'よし', 'よい', 'すごい'][graded];
        (graded ? Sound.ok : Sound.bad)();
        stat(k, graded >= 2);
        if (graded === 3 && typeof Extras !== 'undefined') Extras.bump('shodo3');
        clearBtn.textContent = 'Ulangi'; doneBtn.textContent = 'Lanjut ▶';
      };
    });
  }
  async function shodo({ pool, count = 3, title = 'Kaligrafi' }) {
    pool = pool && pool.length ? pool : Save.d.kana;
    Music.play('home');
    const ks = shuffle(pool).slice(0, count);
    let score = 0;
    for (let i = 0; i < ks.length; i++) score += await shodoCard(ks[i], { title, info: `${i + 1}/${ks.length}` });
    Save.write();
    return result('Kaligrafi', score, ks.length * 3, 'Setiap stempel merah = tulisan yang rapi.');
  }

  /* ---------- 6. BELANJA DI KONBINI ---------- */
  async function shop({ count = 3, title = 'Belanja di Konbini' }) {
    const known = learnedSet();
    const kataWords = WORDS.filter(w => [...w.jp].some(IS_KATA) && [...w.jp].every(c => knownChar(c, known)));
    const pool = kataWords.length >= 4 ? kataWords : WORDS.filter(w => [...w.jp].some(IS_KATA)).slice(0, 8);
    const want = shuffle(pool).slice(0, count);
    const shelf = shuffle([...want, ...shuffle(pool.filter(w => !want.includes(w))).slice(0, 6 - want.length)]);
    const prices = shelf.map(() => (1 + Math.floor(Math.random() * 4)) * 100);
    Music.play('game');
    const res = await UI.wait(done => {
      const p = UI.panel(`
        <div class="game shop">
          ${header(title, '<span class="g-info">🛒 <b class="s-n">0</b>/' + count + '</span>')}
          <div class="memo"><div class="memo-h">Daftar belanja Nenek:</div>${want.map(w => `<div class="memo-i" data-w="${w.jp}">□ ${w.jp}</div>`).join('')}</div>
          <div class="shelf">${shelf.map((w, i) => `<button class="item" type="button" data-i="${i}"><span class="i-box c${i % 6}"></span><b>${w.jp}</b><small>${prices[i]}えん</small></button>`).join('')}</div>
          <p class="g-hint">Baca label katakana di rak, lalu ambil barang yang ada di daftar.</p>
        </div>`, 'gamep');
      let got = 0, miss = 0;
      p.querySelectorAll('.item').forEach(b => b.onclick = () => {
        const w = shelf[+b.dataset.i];
        Sound.speak(w.jp);
        if (want.includes(w) && !b.classList.contains('got')) {
          Sound.ok(); b.classList.add('got'); got++;
          p.querySelector(`.memo-i[data-w="${w.jp}"]`).classList.add('done');
          p.querySelector('.s-n').textContent = got;
          [...w.jp].forEach(c => IS_KATA(c) && stat(c, true));
          if (got === want.length) setTimeout(() => done({ got, miss, total: want.reduce((a, x) => a + prices[shelf.indexOf(x)], 0) }), 700);
        } else if (!b.classList.contains('got')) {
          Sound.bad(); miss++; b.classList.add('wrong'); setTimeout(() => b.classList.remove('wrong'), 350);
          UI.toast(`${w.jp} = ${w.id}. Tidak ada di daftar!`);
        }
      });
    });
    Save.write();
    return result('Belanja Selesai', Math.max(0, count - res.miss), count, `Total belanja: ${res.total} えん (yen)`);
  }

  const RUN = { karuta, catch: catchGame, builder, shodo, shop, speed, kanahunt, wordmatch, dictation };
  function run(name, opts) {
    opts = Object.assign({}, opts || {});
    // huruf pembantu (ゃ っ ー) tidak dimainkan sendirian
    if (opts.pool && typeof NO_QUIZ !== 'undefined') { const p = opts.pool.filter(k => !NO_QUIZ(k)); opts.pool = p.length >= 3 ? p : Save.d.kana.filter(k => !NO_QUIZ(k)); }
    return (RUN[name] || karuta)(opts);
  }
  const NAMES = { karuta: 'Karuta', catch: 'Hujan Huruf', builder: 'Susun Kata', shodo: 'Kaligrafi', shop: 'Belanja', speed: 'Benar atau Salah Kilat', kanahunt: 'Cari Huruf', wordmatch: 'Pasangkan Kata', dictation: 'Dikte' };
  const DESC = { karuta: 'dengar lalu ambil kartu tercepat', catch: 'tangkap gelembung huruf', builder: 'susun huruf menjadi kata', shodo: 'menulis rapi dengan kuas', speed: 'benar atau salah secepat kilat', kanahunt: 'temukan huruf di antara yang mirip', wordmatch: 'pasangkan kata dengan artinya', dictation: 'dengar bunyinya, tulis tanpa contoh' };

  return { run, karuta, catchGame, builder, shodo, shodoCard, shop, speed, kanahunt, wordmatch, dictation, NAMES, DESC, wordsFor };
})();
