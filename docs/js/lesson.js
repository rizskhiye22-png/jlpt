/* =========================================================
   PELAJARAN DI KELAS
   1. Kenalan huruf (suara + cara mengingat + contoh kata)
   2. Latihan menulis dengan jari di papan tulis
   3. Soal latihan / ulangan (tanpa hukuman, salah = dijelaskan)
   ========================================================= */
const Lesson = (() => {
  const shuffle = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [b[i], b[j]] = [b[j], b[i]]; } return b; };
  const pick = a => a[Math.random() * a.length | 0];
  const ALL = Object.keys(KANA);

  const knownWords = known => WORDS.filter(w => [...w.jp].every(c => knownChar(c, known)));
  // pasangan hiragana <-> katakana (selisih kode Unicode 0x60)
  const twin = k => String.fromCharCode(k.charCodeAt(0) + (IS_KATA(k) ? -0x60 : 0x60));

  function stat(k) { return Save.d.st[k] || (Save.d.st[k] = { c: 0, w: 0 }); }

  /* ---------- 1. kenalan huruf ---------- */
  function introCard(k, i, n, word) {
    const K = KANA[k];
    const p = UI.panel(`
      <div class="board">
        <div class="b-top">${scriptOf(k) === 'kanji' ? 'Kanji' : IS_KATA(k) ? 'Katakana' : 'Hiragana'} baru ${i + 1} / ${n}</div>
        <button class="b-kana" type="button" aria-label="Dengarkan ${k}">${k}</button>
        <div class="b-ro">${K.ro}</div>
        ${IS_KATA(k) && KANA[twin(k)] ? `<div class="b-twin">Hiragananya: <b>${twin(k)}</b></div>` : ''}
        <p class="b-tip">${K.tip}</p>
        ${word ? `<button class="b-ex" type="button">Contoh: <b>${word.jp}</b> (${word.ro}) = ${word.id} ♪</button>` : ''}
      </div>
      <div class="row">
        <button class="btn ghost" data-a="say" type="button">♪ Dengar</button>
        <button class="btn" data-a="next" type="button">Coba tulis ▶</button>
      </div>`, 'lesson');
    if (Save.d.settings.voice) setTimeout(() => Sound.speak(k), 200);
    return UI.wait(done => {
      p.querySelector('.b-kana').onclick = () => Sound.speak(k);
      p.querySelector('[data-a=say]').onclick = () => Sound.speak(k);
      const ex = p.querySelector('.b-ex'); if (ex) ex.onclick = () => Sound.speak(word.jp);
      p.querySelector('[data-a=next]').onclick = () => { Sound.blip(); done(); };
    });
  }

  /* ---------- 2. latihan menulis ---------- */
  function traceCard(k) {
    const p = UI.panel(`
      <div class="board">
        <div class="b-top">Tulis huruf <b>${k}</b> (${KANA[k].ro})</div>
        <div class="trace-wrap"><canvas class="trace"></canvas><div class="trace-ok">Bagus!</div></div>
        <p class="b-tip small">Ikuti bentuk huruf samar dengan jarimu.</p>
      </div>
      <div class="row">
        <button class="btn ghost" data-a="clear" type="button">Hapus</button>
        <button class="btn" data-a="next" type="button">Lanjut ▶</button>
      </div>`, 'lesson');
    const cv = p.querySelector('canvas');
    const okEl = p.querySelector('.trace-ok');
    const size = Math.max(160, Math.min(cv.parentElement.clientWidth || 240, 250));
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = size * dpr; cv.height = size * dpr; cv.style.width = cv.style.height = size + 'px';
    const ctx = cv.getContext('2d'); ctx.scale(dpr, dpr);
    let ink = 0, last = null;

    function guide() {
      ctx.clearRect(0, 0, size, size);
      ctx.strokeStyle = 'rgba(255,255,255,.14)'; ctx.setLineDash([6, 6]); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(size / 2, 0); ctx.lineTo(size / 2, size); ctx.moveTo(0, size / 2); ctx.lineTo(size, size / 2); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(255,255,255,.2)'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.font = `${Math.round(size * 0.78)}px "Zen Maru Gothic","Hiragino Maru Gothic ProN","Noto Sans JP",sans-serif`;
      ctx.fillText(k, size / 2, size / 2 + size * 0.03);
      ink = 0; okEl.classList.remove('on');
    }
    guide();
    if (document.fonts && document.fonts.load) document.fonts.load(`40px "Zen Maru Gothic"`, k).then(() => { if (ink === 0) guide(); }).catch(() => {});

    const pos = e => { const r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) * size / r.width, y: (e.clientY - r.top) * size / r.height }; };
    cv.onpointerdown = e => { e.preventDefault(); cv.setPointerCapture(e.pointerId); last = pos(e); };
    cv.onpointermove = e => {
      if (!last) return; const q = pos(e);
      ctx.strokeStyle = '#fff8e7'; ctx.lineWidth = size * 0.055; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.beginPath(); ctx.moveTo(last.x, last.y); ctx.lineTo(q.x, q.y); ctx.stroke();
      ink += Math.hypot(q.x - last.x, q.y - last.y); last = q;
      if (ink > size * 1.1 && !okEl.classList.contains('on')) { okEl.classList.add('on'); Sound.ok(); }
    };
    cv.onpointerup = cv.onpointercancel = () => { last = null; };

    return UI.wait(done => {
      p.querySelector('[data-a=clear]').onclick = guide;
      p.querySelector('[data-a=next]').onclick = () => { Sound.blip(); done(); };
    });
  }

  /* ---------- rangkuman ---------- */
  function recap(list) {
    const p = UI.panel(`
      <div class="board">
        <div class="b-top">Hari ini kamu belajar</div>
        <div class="recap">${list.map(k => `<button class="rc" type="button" data-k="${k}"><b>${k}</b><small>${KANA[k].ro}</small></button>`).join('')}</div>
        <p class="b-tip small">Ketuk huruf untuk mendengar lagi.</p>
      </div>
      <div class="row"><button class="btn" data-a="next" type="button">Mulai latihan ▶</button></div>`, 'lesson');
    return UI.wait(done => {
      p.querySelectorAll('.rc').forEach(b => b.onclick = () => Sound.speak(b.dataset.k));
      p.querySelector('[data-a=next]').onclick = () => { Sound.blip(); done(); };
    });
  }

  // Sensei memutar video pelajaran, lalu murid menulis setiap huruf
  async function teach(list, opts = {}) {
    await Video.play({ kana: list, intro: opts.intro || [], title: opts.title || 'Video Pelajaran', day: opts.day });
    for (let i = 0; i < list.length; i++) {
      await Games.shodoCard(list[i], { title: 'Latihan Menulis', info: `${i + 1}/${list.length}` });
    }
    await recap(list);
  }

  /* ---------- 3. soal ---------- */
  function weightedKana(pool) {
    const ws = pool.map(k => { const s = stat(k); return 1 + 3 * (s.w / (s.c + s.w + 1)); });
    let r = Math.random() * ws.reduce((a, b) => a + b, 0);
    for (let i = 0; i < pool.length; i++) { r -= ws[i]; if (r <= 0) return pool[i]; }
    return pool[pool.length - 1];
  }

  function makeQuestions(focus, count, poolKind, only) {
    let pool = Save.d.kana.length ? Save.d.kana.slice() : focus.slice();
    if (only) pool = focus.slice();
    if (poolKind && typeof POOL_FILTER !== 'undefined' && POOL_FILTER[poolKind]) pool = pool.filter(POOL_FILTER[poolKind]);
    else if (poolKind === 'kata') pool = pool.filter(IS_KATA);
    else if (poolKind === 'hira') pool = pool.filter(k => !IS_KATA(k));
    if (typeof NO_QUIZ !== 'undefined') { pool = pool.filter(k => !NO_QUIZ(k)); focus = focus.filter(k => !NO_QUIZ(k)); }
    if (!pool.length) pool = focus.slice();
    const words = knownWords(new Set(Save.d.kana.length ? Save.d.kana : pool));
    const types = ['read', 'read', 'write', 'write', 'word'];
    if (Sound.hasJa()) types.push('listen', 'listen');
    // katakana: cocokkan dengan pasangan hiragananya (pemain sudah hafal hiragana)
    const hasTwin = k => IS_KATA(k) && KANA[twin(k)] && Save.d.kana.includes(twin(k));
    if (focus.some(hasTwin)) types.push('twin', 'twin');
    // setiap huruf baru muncul minimal sekali
    const seeds = shuffle(focus).slice(0, count);
    const out = [];
    let last = null;
    for (let i = 0; i < count; i++) {
      let type = pick(types);
      if (type === 'word' && words.length) {
        const pref = words.filter(w => focus.some(k => w.jp.includes(k)));
        const w = pick(pref.length && Math.random() < .7 ? pref : words);
        if (!out.some(q => q.word === w)) { out.push({ type, word: w }); continue; }
      }
      if (type === 'word') type = 'read';
      let k = seeds[i] || (focus.length && Math.random() < .5 ? pick(focus) : weightedKana(pool));
      for (let t = 0; t < 5 && k === last && pool.length > 1; t++) k = weightedKana(pool);
      if (type === 'twin' && !hasTwin(k)) type = 'read';
      last = k; out.push({ type, kana: k });
    }
    return shuffle(out);
  }

  const scriptOf = k => (typeof SCRIPT_OF !== 'undefined' ? SCRIPT_OF(k) : IS_KATA(k) ? 'kata' : 'hira');
  function options(correct, source, n = 4) {
    const sc = scriptOf(correct);
    // bacaan harus unik (じ/ぢ dan ず/づ sama-sama "ji"/"zu")
    const roOk = k => KANA[k].ro !== KANA[correct].ro;
    const same = Object.keys(KANA).filter(k => scriptOf(k) === sc && roOk(k));
    const learned = Save.d.kana.filter(k => k !== correct && scriptOf(k) === sc && KANA[k] && roOk(k));
    // huruf ber-tenten: pengecoh terbaik adalah huruf dasarnya & pasangan ゛/゜ (が↔か, ば↔ぱ↔は)
    const confuse = [];
    if (typeof DAKU_RO !== 'undefined') {
      const h = IS_KATA(correct) ? String.fromCharCode(correct.charCodeAt(0) - 0x60) : correct;
      const toK = c => IS_KATA(correct) ? String.fromCharCode(c.charCodeAt(0) + 0x60) : c;
      if (DAKU_RO[h]) {
        const handa = /^p/.test(DAKU_RO[h]), code = h.charCodeAt(0);
        [code - (handa ? 2 : 1), handa ? code - 1 : code + 1].map(x => toK(String.fromCharCode(x)))
          .forEach(c => { if (KANA[c] && c !== correct && KANA[c].ro !== KANA[correct].ro) confuse.push(c); });
      }
    }
    // huruf rawan (ね/れ/わ, シ/ツ, ソ/ン…): pengecoh paling berguna, asal sudah dipelajari
    if (typeof SIMILAR !== 'undefined' && SIMILAR[correct]) {
      shuffle([...SIMILAR[correct]]).forEach(c => { if (c !== correct && KANA[c] && KANA[c].ro !== KANA[correct].ro && Save.d.kana.includes(c) && !confuse.includes(c)) confuse.push(c); });
    }
    const others = [...confuse.slice(0, n - 2 > 0 ? n - 2 : 1), ...shuffle(learned).concat(shuffle(same.filter(k => k !== correct && !learned.includes(k)))).filter(k => !confuse.includes(k))];
    return shuffle([correct, ...others.slice(0, n - 1)]).map(source);
  }

  function ask(q, i, n, title) {
    let prompt, main, mainCls = '', opts, answer, explain, sayAfter;
    if (q.kana) {
      const K = KANA[q.kana];
      explain = `<b>${q.kana}</b> = ${K.ro}<br><small>${K.tip}</small>`;
      sayAfter = q.kana;
    }
    if (q.type === 'read') {
      prompt = 'Bagaimana cara membaca huruf ini?'; main = q.kana; mainCls = 'kana';
      answer = KANA[q.kana].ro; opts = options(q.kana, k => ({ label: KANA[k].ro, value: KANA[k].ro }));
    } else if (q.type === 'write') {
      prompt = 'Pilih huruf untuk bunyi ini:'; main = KANA[q.kana].ro; mainCls = 'roma';
      answer = q.kana; opts = options(q.kana, k => ({ label: k, value: k, jp: true }));
    } else if (q.type === 'twin') {
      const tw = twin(q.kana);
      prompt = 'Mana pasangan hiragananya?'; main = q.kana; mainCls = 'kana';
      answer = tw; opts = options(tw, k => ({ label: k, value: k, jp: true }));
      explain = `<b>${q.kana}</b> = <b>${tw}</b> (${KANA[q.kana].ro})<br><small>${KANA[q.kana].tip}</small>`;
    } else if (q.type === 'listen') {
      prompt = 'Dengarkan, lalu pilih hurufnya:'; main = '<button class="q-listen" type="button" aria-label="Putar suara">♪</button>'; mainCls = 'listen';
      answer = q.kana; opts = options(q.kana, k => ({ label: k, value: k, jp: true }));
    } else {
      const w = q.word;
      prompt = 'Apa arti kata ini?'; main = w.jp; mainCls = 'word';
      answer = w.id;
      const seenId = new Set([w.id]);
      const others = shuffle(WORDS).filter(x => !seenId.has(x.id) && seenId.add(x.id)).slice(0, 3);
      opts = shuffle([w, ...others]).map(x => ({ label: x.id, value: x.id }));
      explain = `<b>${w.jp}</b> (${w.ro}) = ${w.id}`; sayAfter = w.jp;
    }

    const p = UI.panel(`
      <div class="quiz">
        <div class="q-top"><span class="q-title">${title}</span><div class="bar"><i style="width:${(i / n) * 100}%"></i></div><span class="q-count">${i + 1}/${n}</span></div>
        <div class="q-card">
          <div class="q-prompt">${prompt}</div>
          <div class="q-main ${mainCls}">${main}</div>
        </div>
        <div class="opts">${opts.map((o, j) => `<button class="opt ${o.jp ? 'jp' : ''} ${o.label.length > 8 ? 'long' : ''}" type="button" data-j="${j}">${o.label}</button>`).join('')}</div>
        <div class="q-foot"></div>
      </div>`, 'quizp');

    const play = () => Sound.speak(q.kana);
    if (q.type === 'listen') { p.querySelector('.q-listen').onclick = play; setTimeout(play, 250); }

    return UI.wait(done => {
      const btns = [...p.querySelectorAll('.opt')];
      let answered = false;
      const choose = j => {
        if (answered) return; answered = true;
        const ok = opts[j].value === answer;
        btns.forEach((b, x) => { b.disabled = true; if (opts[x].value === answer) b.classList.add('right'); });
        if (q.kana) { const s = stat(q.kana); ok ? s.c++ : s.w++; if (Lesson._onAnswer) Lesson._onAnswer(q.kana, ok); }
        if (Save.d.settings.voice && sayAfter) Sound.speak(sayAfter);
        if (ok) { Sound.ok(); setTimeout(() => done(true), 750); return; }
        btns[j].classList.add('wrong'); Sound.bad();
        const foot = p.querySelector('.q-foot');
        foot.innerHTML = `<div class="explain">${explain}</div><button class="btn" type="button">Lanjut ▶</button>`;
        foot.querySelector('button').onclick = () => { Sound.blip(); done(false); };
      };
      btns.forEach((b, j) => b.onclick = () => choose(j));
      Lesson._keys = key => { if (/^[1-4]$/.test(key)) { choose(+key - 1); return true; } return false; };
    });
  }

  async function quiz({ focus = [], count = 10, title = 'Latihan', pool, only, onAnswer }) {
    Music.play('school');
    Lesson._onAnswer = onAnswer || null;
    const qs = makeQuestions(focus, count, pool, only);
    let correct = 0;
    for (let i = 0; i < qs.length; i++) if (await ask(qs[i], i, qs.length, title)) correct++;
    Lesson._keys = null; Lesson._onAnswer = null;
    Save.write();
    return { correct, total: qs.length };
  }

  const stars = (c, t) => c / t >= 0.9 ? 3 : c / t >= 0.7 ? 2 : 1;
  const grade = (c, t) => c === t ? 'A+' : c / t >= 0.9 ? 'A' : c / t >= 0.75 ? 'B' : c / t >= 0.6 ? 'C' : 'D';
  const starHtml = n => `<span class="stars">${'<i class="on">★</i>'.repeat(n)}${'<i>★</i>'.repeat(3 - n)}</span>`;

  function results(r, test) {
    const s = stars(r.correct, r.total), g = grade(r.correct, r.total);
    const msg = r.correct / r.total >= .9 ? 'Luar biasa!' : r.correct / r.total >= .7 ? 'Bagus sekali!' : 'Tidak apa-apa, kita ulangi lagi nanti!';
    const p = UI.panel(`
      <div class="win result">
        <div class="r-title">${test ? 'Hasil Ulangan' : 'Hasil Latihan'}</div>
        ${test ? `<div class="grade g-${g.replace('+', 'p')}">${g}</div>` : starHtml(s)}
        <div class="r-score">${r.correct} / ${r.total} benar</div>
        <div class="r-msg">${msg}</div>
        <button class="btn" type="button">Lanjut ▶</button>
      </div>`, 'center');
    Sound.star();
    return UI.wait(done => { p.querySelector('.btn').onclick = () => { Sound.blip(); UI.closePanel(); done({ stars: s, grade: g }); }; });
  }

  return { teach, quiz, results, stars, grade, starHtml, twin, _keys: null };
})();
