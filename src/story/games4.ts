/* =========================================================
   MINI-GAME BAB 4 (design/12 §C.3–C.5)
   - drill('sokuon' | 'long'): latihan telinga pasangan rawan (きて/きって, おばさん/おばあさん)
   - drill('rawan'): Mata Jeli — huruf yang bentuknya mirip (ね/れ/わ, シ/ツ, ソ/ン) — Bab 1–2
   - fireflies: Tangkap Kunang-kunang (yōon)
   - tanzaku: susun permohonan Tanabata
   - taiko: ritme festival (baca huruf sebelum mencapai garis)
   ========================================================= */

const shuffle = <T,>(a: T[]) => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [b[i], b[j]] = [b[j], b[i]]; } return b; };
const relax = () => !!Save.d.settings.relax;

function resultPanel(title: string, score: number, max: number, note = ''): Promise<void> {
  const ratio = max ? score / max : 0, stars = ratio >= .85 ? 3 : ratio >= .6 ? 2 : 1, pts = 10 + stars * 5;
  Save.d.points = (Save.d.points || 0) + pts; Save.write();
  const p = UI.panel(`<div class="win result"><div class="r-title">${title}</div>
    <div class="stars">${'<i class="on">★</i>'.repeat(stars)}${'<i>★</i>'.repeat(3 - stars)}</div>
    <div class="r-score">${score} / ${max}</div>${note ? `<div class="r-msg">${note}</div>` : ''}
    <div class="pts">+${pts} <span>poin sakura</span></div><button class="btn" type="button">Lanjut ▶</button></div>`, 'center');
  Sound.star();
  return UI.wait<void>(done => { (p.querySelector('.btn') as HTMLButtonElement).onclick = () => { Sound.blip(); UI.closePanel(); done(); }; });
}

/* ---------- 1. Latihan telinga ---------- */
type Pair = [string, string, string, string, string, string]; // a, ro_a, arti_a, b, ro_b, arti_b
const DRILLS: Record<string, { title: string; hint: string; pairs: Pair[] }> = {
  sokuon: { title: 'Latihan Telinga: っ', hint: 'Dengarkan: ada jeda kecil (っ) atau tidak?', pairs: [
    ['きて', 'kite', 'datanglah', 'きって', 'kitte', 'perangko'],
    ['かこ', 'kako', 'masa lalu', 'かっこ', 'kakko', 'keren / tanda kurung'],
    ['さか', 'saka', 'tanjakan', 'さっか', 'sakka', 'penulis'],
    ['おと', 'oto', 'suara', 'おっと', 'otto', 'suami'],
    ['いた', 'ita', 'papan', 'いった', 'itta', 'sudah pergi'],
    ['まくら', 'makura', 'bantal', 'マッチ', 'macchi', 'korek api'],
  ] },
  long: { title: 'Latihan Telinga: Bunyi Panjang', hint: 'Dengarkan: bunyinya pendek atau panjang?', pairs: [
    ['おばさん', 'obasan', 'bibi', 'おばあさん', 'obaasan', 'nenek'],
    ['おじさん', 'ojisan', 'paman', 'おじいさん', 'ojiisan', 'kakek'],
    ['ゆき', 'yuki', 'salju', 'ゆうき', 'yuuki', 'keberanian'],
    ['ここ', 'koko', 'di sini', 'こうこう', 'koukou', 'SMA'],
    ['ビル', 'biru', 'gedung', 'ビール', 'biiru', 'bir'],
    ['とり', 'tori', 'burung', 'とおり', 'toori', 'jalan raya'],
  ] },
};

/* ---------- 1b. Mata Jeli: huruf rawan tertukar (design/01 §6.2) ---------- */
function rawan(): Promise<{ correct: number; total: number }> {
  const learned: string[] = (Save.d.kana || []).filter((k: string) => [...k].length === 1 && KANA[k] && !KANA[k].noQuiz);
  const focus: string[] = ((DAYS[(Save.d.day || 1) - 1] || {}).kana || []).filter((k: string) => learned.includes(k));
  const kata = focus.length ? IS_KATA(focus[0]) : false;
  const same = (k: string) => IS_KATA(k) === kata && /^[ぁ-んァ-ン]$/.test(k);
  const pool = learned.filter(same);
  const group = (t: string) => [...(SIMILAR[t] || '')].filter(c => pool.includes(c) && KANA[c].ro !== KANA[t].ro);
  const risky = shuffle(pool.filter(t => group(t).length));
  const targets = [...focus.filter(same), ...risky.filter(t => !focus.includes(t))].slice(0, 8);
  const rounds = shuffle(targets);
  let correct = 0;
  Music.play('school');
  return UI.wait(done => {
    let i = 0;
    const next = () => {
      if (i >= rounds.length) { UI.closePanel(); resultPanel('Mata Jeli', correct, rounds.length, 'Huruf kembar tidak bisa menipumu lagi!').then(() => done({ correct, total: rounds.length })); return; }
      const t = rounds[i++], g = group(t);
      const fill = shuffle(pool.filter(c => c !== t && !g.includes(c) && KANA[c].ro !== KANA[t].ro));
      const opts = shuffle([t, ...g, ...fill].slice(0, Math.max(3, Math.min(4, g.length + 2))));
      const p = UI.panel(`<div class="quiz"><div class="q-top"><span class="q-title">Mata Jeli 👀</span><div class="bar"><i style="width:${(i - 1) / rounds.length * 100}%"></i></div><span class="q-count">${i}/${rounds.length}</span></div>
        <div class="q-card"><div class="q-prompt">Huruf-huruf ini mirip. Mana yang dibaca…</div><div class="q-main roma">${KANA[t].ro}</div></div>
        <div class="opts">${opts.map((o, j) => `<button class="opt jp" type="button" data-j="${j}">${o}</button>`).join('')}</div><div class="q-foot"></div></div>`, 'quizp');
      let answered = false;
      p.querySelectorAll<HTMLButtonElement>('.opt').forEach(b => b.onclick = () => {
        if (answered) return; answered = true;
        const o = opts[+b.dataset.j!], ok = o === t;
        const st = Save.d.st[t] || (Save.d.st[t] = { c: 0, w: 0 }); ok ? st.c++ : st.w++;
        p.querySelectorAll<HTMLButtonElement>('.opt').forEach((x, j) => { x.disabled = true; x.innerHTML = `${opts[j]}<small style="display:block;font-size:11px">${KANA[opts[j]].ro}</small>`; if (opts[j] === t) x.classList.add('right'); });
        if (Save.d.settings.voice !== false) Sound.speak(t);
        if (ok) { correct++; Sound.ok(); setTimeout(() => { UI.closePanel(); next(); }, 800); return; }
        b.classList.add('wrong'); Sound.bad();
        const foot = p.querySelector('.q-foot') as HTMLElement;
        foot.innerHTML = `<div class="explain"><b>${t}</b> = ${KANA[t].ro}<br><small>${KANA[t].tip}</small></div><button class="btn" type="button">Lanjut ▶</button>`;
        (foot.querySelector('button') as HTMLButtonElement).onclick = () => { Sound.blip(); UI.closePanel(); next(); };
      });
    };
    next();
  });
}

export function drill(kind: string): Promise<{ correct: number; total: number }> {
  if (kind === 'rawan') return rawan();
  const D = DRILLS[kind] || DRILLS.sokuon;
  const rounds = shuffle(D.pairs).slice(0, 6);
  const noVoice = !Sound.hasJa() || Save.d.settings.voice === false;
  let correct = 0;
  Music.play('school');
  return UI.wait(done => {
    let i = 0;
    const next = () => {
      if (i >= rounds.length) { UI.closePanel(); resultPanel(D.title, correct, rounds.length, 'Telinga yang terlatih = membaca lebih cepat!').then(() => done({ correct, total: rounds.length })); return; }
      const pr = rounds[i++], pickB = Math.random() < .5;
      const target = pickB ? pr[3] : pr[0], tro = pickB ? pr[4] : pr[1];
      const opts = shuffle([[pr[0], pr[1], pr[2]], [pr[3], pr[4], pr[5]]]);
      const p = UI.panel(`<div class="quiz"><div class="q-top"><span class="q-title">${D.title}</span><div class="bar"><i style="width:${(i - 1) / rounds.length * 100}%"></i></div><span class="q-count">${i}/${rounds.length}</span></div>
        <div class="q-card"><div class="q-prompt">${D.hint}</div><div class="q-main listen"><button class="q-listen" type="button" aria-label="Putar">♪</button></div>
        ${noVoice ? `<p class="muted small">Suara Jepang tidak aktif. Bacaan: <b>${tro}</b></p>` : ''}</div>
        <div class="opts">${opts.map((o, j) => `<button class="opt jp" type="button" data-j="${j}">${o[0]}<small style="display:block;font-size:11px">${o[1]}</small></button>`).join('')}</div><div class="q-foot"></div></div>`, 'quizp');
      const play = () => Sound.speak(target);
      (p.querySelector('.q-listen') as HTMLButtonElement).onclick = play; setTimeout(play, 250);
      let answered = false;
      p.querySelectorAll<HTMLButtonElement>('.opt').forEach(b => b.onclick = () => {
        if (answered) return; answered = true;
        const o = opts[+b.dataset.j!], ok = o[0] === target;
        p.querySelectorAll<HTMLButtonElement>('.opt').forEach((x, j) => { x.disabled = true; if (opts[j][0] === target) x.classList.add('right'); });
        const foot = p.querySelector('.q-foot') as HTMLElement;
        foot.innerHTML = `<div class="explain"><b>${pr[0]}</b> (${pr[1]}) = ${pr[2]}<br><b>${pr[3]}</b> (${pr[4]}) = ${pr[5]}</div><button class="btn" type="button">Lanjut ▶</button>`;
        (foot.querySelector('button') as HTMLButtonElement).onclick = () => { Sound.blip(); UI.closePanel(); next(); };
        if (ok) { correct++; Sound.ok(); } else { b.classList.add('wrong'); Sound.bad(); }
      });
    };
    next();
  });
}

/* ---------- 2. Tangkap Kunang-kunang ---------- */
export function fireflies(opts: { rounds?: number; title?: string } = {}): Promise<number> {
  const pool = Object.keys(KANA).filter(k => /^[ぁ-ゖ][ゃゅょ]$/.test(k));
  const rounds = opts.rounds || 6, title = opts.title || 'Tangkap Kunang-kunang';
  const noVoice = !Sound.hasJa() || Save.d.settings.voice === false;
  let score = 0, r = 0;
  return UI.wait<number>(done => {
    const next = () => {
      if (r >= rounds) { UI.closePanel(); resultPanel(title, score, rounds).then(() => done(score)); return; }
      r++;
      const target = pool[Math.random() * pool.length | 0];
      const big = target[0];
      // pengecoh: huruf yang sama dengan や besar, yōon lain dengan huruf dasar sama
      const decoys = shuffle([big + String.fromCharCode(target.charCodeAt(1) + 1), ...pool.filter(k => k !== target && k[0] === big), ...shuffle(pool.filter(k => k !== target)).slice(0, 3)]).slice(0, 4);
      const all = shuffle([target, ...decoys]);
      const p = UI.panel(`<div class="win ff-game"><div class="w-title">${title} <span class="pts-badge">${r}/${rounds}</span></div>
        <p class="muted small">Dengarkan bunyinya, lalu tangkap kunang-kunang yang tepat. ${noVoice ? `(Bunyi: <b>${KANA[target].ro}</b>)` : ''}</p>
        <div class="ff-sky">${all.map((k, i) => `<button type="button" class="ff" data-k="${k}" style="left:${8 + (i * 19) % 80}%;top:${12 + ((i * 37) % 64)}%;animation-delay:${i * .4}s"><span class="jp">${k}</span></button>`).join('')}</div>
        <div class="row"><button type="button" class="btn ghost ff-say">♪ Dengar lagi</button></div></div>`, 'gamep');
      const say = () => Sound.speak(target);
      (p.querySelector('.ff-say') as HTMLButtonElement).onclick = say; setTimeout(say, 300);
      p.querySelectorAll<HTMLButtonElement>('.ff').forEach(b => b.onclick = () => {
        if (b.dataset.k === target) { Sound.ok(); score++; b.classList.add('caught'); setTimeout(() => { UI.closePanel(); next(); }, 500); }
        else { Sound.bad(); b.classList.add('miss'); b.disabled = true; UI.toast(KANA[b.dataset.k!] ? `${b.dataset.k} = ${KANA[b.dataset.k!].ro}. Dengarkan lagi!` : `${b.dataset.k} = dua ketukan (や besar). Dengarkan lagi!`); }
      });
    };
    next();
  });
}

/* ---------- 3. Tanzaku ---------- */
const WISH_PARTS: Array<{ q: string; o: Array<[string, string]> }> = [
  { q: 'Tentang siapa permohonanmu?', o: [['みんな と', 'bersama semuanya'], ['ともだち と', 'bersama teman'], ['おばあちゃん と', 'bersama nenek']] },
  { q: 'Keinginanmu…', o: [['ずっと いっしょ に いられます', 'bisa selalu bersama'], ['にほんご が じょうず に なります', 'jadi pandai bahasa Jepang'], ['また あえます', 'bisa bertemu lagi']] },
];
export function tanzaku(): Promise<string> {
  const picked: string[] = [];
  return UI.wait<string>(done => {
    const step = (i: number) => {
      if (i >= WISH_PARTS.length) {
        const wish = picked.join(' ') + ' ように';
        const p = UI.panel(`<div class="win tz"><div class="w-title">Tanzaku 🎋</div>
          <div class="tz-paper"><span class="jp">${wish}</span></div>
          <p class="muted small center">Kamu menggantungkan tanzaku di pohon bambu. 〜ます ように = semoga ….</p>
          <button class="btn block" type="button">Gantungkan ▶</button></div>`, 'scroll');
        Sound.speak(wish);
        (p.querySelector('.btn') as HTMLButtonElement).onclick = () => { Sound.star(); UI.closePanel(); Save.d.story.tanzaku = wish; Save.write(); done(wish); };
        return;
      }
      const W = WISH_PARTS[i];
      const p = UI.panel(`<div class="win tz"><div class="w-title">Tulis permohonan (${i + 1}/${WISH_PARTS.length})</div>
        <p>${W.q}</p><div class="ks-opts">${W.o.map(([jp, id], j) => `<button type="button" class="btn ghost ks-opt" data-j="${j}"><b class="jp">${jp}</b><small>${id}</small></button>`).join('')}</div></div>`, 'scroll');
      p.querySelectorAll<HTMLButtonElement>('.ks-opt').forEach(b => b.onclick = () => { Sound.blip(); picked.push(W.o[+b.dataset.j!][0]); UI.closePanel(); step(i + 1); });
    };
    step(0);
  });
}

/* ---------- 4. Taiko ---------- */
export function taiko(opts: { notes?: number } = {}): Promise<number> {
  const pool = Object.keys(KANA).filter(k => !KANA[k].noQuiz && (Save.d.kana || []).includes(k) && !/[一-鿿]/.test(k));
  const N = opts.notes || 10;
  const notes = shuffle(pool).slice(0, N);
  let score = 0, i = 0;
  Music.play('festival');
  return UI.wait<number>(done => {
    const p = UI.panel(`<div class="win taiko"><div class="w-title">Taiko Matsuri 🥁 <span class="pts-badge tk-n">0/${N}</span></div>
      <div class="tk-lane"><div class="tk-line"></div><div class="tk-note jp"></div></div>
      <div class="tk-btns"><button type="button" class="tk-drum don" data-s="0">ドン<small></small></button><button type="button" class="tk-drum ka" data-s="1">カッ<small></small></button></div>
      <p class="muted small center">Pilih bacaan yang benar sebelum huruf mencapai garis!</p></div>`, 'gamep');
    const noteEl = p.querySelector('.tk-note') as HTMLElement, cnt = p.querySelector('.tk-n') as HTMLElement;
    const btns = [...p.querySelectorAll<HTMLButtonElement>('.tk-drum')];
    let timer = 0, answer = 0, live = true;
    const fin = () => { live = false; clearTimeout(timer); UI.closePanel(); resultPanel('Taiko Matsuri', score, N, 'ドン！カッ！ Seru sekali!').then(() => done(score)); };
    const next = () => {
      if (!live) return;
      if (i >= notes.length) return fin();
      const k = notes[i++];
      const wrong = shuffle(pool.filter(x => x !== k && KANA[x].ro !== KANA[k].ro))[0] || k;
      answer = Math.random() < .5 ? 0 : 1;
      const ros = answer === 0 ? [KANA[k].ro, KANA[wrong].ro] : [KANA[wrong].ro, KANA[k].ro];
      btns.forEach((b, j) => { (b.querySelector('small') as HTMLElement).textContent = ros[j]; b.disabled = false; });
      noteEl.textContent = k; noteEl.classList.remove('go'); void noteEl.offsetWidth; noteEl.classList.add('go');
      if (!relax()) timer = window.setTimeout(() => { Sound.bad(); cnt.textContent = `${score}/${N}`; next(); }, 2600);
    };
    btns.forEach((b, j) => b.onclick = () => {
      if (!live) return;
      clearTimeout(timer); btns.forEach(x => x.disabled = true);
      if (j === answer) { score++; Sound.ok(); b.classList.add('hit'); setTimeout(() => b.classList.remove('hit'), 200); } else Sound.bad();
      cnt.textContent = `${score}/${N}`;
      setTimeout(next, 350);
    });
    next();
  });
}
