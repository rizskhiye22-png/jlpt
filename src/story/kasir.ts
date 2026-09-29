/* =========================================================
   MINI-GAME: KASIR KAFE (design/12 §C.1)
   Level 1: baca pesanan (1 barang) · 2: dua barang + total · 3: kembalian dari 千円
   4: pesanan hanya lisan (tanpa teks) · 5: mode pasar (lebih banyak pelanggan)
   Harga di menu ditulis dengan kanji angka (三百五十円) — latihan Bab 3.
   ========================================================= */

interface MenuItem { jp: string; ro: string; id: string; price: number; icon: string }
export const MENU: MenuItem[] = [
  { jp: 'コーヒー', ro: 'koohii', id: 'kopi', price: 300, icon: '☕' },
  { jp: 'ケーキ', ro: 'keeki', id: 'kue', price: 350, icon: '🍰' },
  { jp: 'ソーダ', ro: 'sooda', id: 'soda', price: 200, icon: '🥤' },
  { jp: 'メロンソーダ', ro: 'meron sooda', id: 'melon soda', price: 400, icon: '🍈' },
  { jp: 'ドーナツ', ro: 'doonatsu', id: 'donat', price: 150, icon: '🍩' },
  { jp: 'パン', ro: 'pan', id: 'roti', price: 120, icon: '🍞' },
  { jp: 'サンドイッチ', ro: 'sandoitchi', id: 'sandwich', price: 380, icon: '🥪' },
  { jp: 'プリン', ro: 'purin', id: 'puding', price: 250, icon: '🍮' },
];

const D = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
/** 350 → 三百五十, 1000 → 千, 12000 → 一万二千 */
export function kanjiNum(n: number): string {
  if (n === 0) return '〇';
  let out = '';
  const man = Math.floor(n / 10000); n %= 10000;
  if (man) out += (man === 1 ? '一' : kanjiNum(man)) + '万';
  const parts: Array<[number, string]> = [[1000, '千'], [100, '百'], [10, '十']];
  for (const [v, k] of parts) { const q = Math.floor(n / v); n %= v; if (q) out += (q === 1 ? '' : D[q]) + k; }
  if (n) out += D[n];
  return out;
}
/** 350 → さんびゃく ごじゅう (untuk suara & romaji) */
const H = ['', 'いち', 'に', 'さん', 'よん', 'ご', 'ろく', 'なな', 'はち', 'きゅう'];
export function kanaNum(n: number): string {
  const out: string[] = [];
  const th = Math.floor(n / 1000), hu = Math.floor(n / 100) % 10, te = Math.floor(n / 10) % 10, on = n % 10;
  if (th) out.push(th === 1 ? 'せん' : th === 3 ? 'さんぜん' : th === 8 ? 'はっせん' : H[th] + 'せん');
  if (hu) out.push(hu === 1 ? 'ひゃく' : hu === 3 ? 'さんびゃく' : hu === 6 ? 'ろっぴゃく' : hu === 8 ? 'はっぴゃく' : H[hu] + 'ひゃく');
  if (te) out.push(te === 1 ? 'じゅう' : H[te] + 'じゅう');
  if (on) out.push(H[on]);
  return out.join('');
}

const shuffle = <T,>(a: T[]) => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [b[i], b[j]] = [b[j], b[i]]; } return b; };
const pick = <T,>(a: T[]) => a[Math.random() * a.length | 0];
const CUSTOMERS = ['🧑', '👩', '👴', '👧', '👨‍🦱', '👵', '🧒', '👩‍🦰'];

export interface KasirResult { score: number; max: number }

export function kasir(opts: { level?: number; rounds?: number; title?: string } = {}): Promise<KasirResult> {
  const level = Math.max(1, Math.min(5, opts.level || 1));
  const rounds = opts.rounds || (level >= 5 ? 6 : 3);
  const title = opts.title || 'Kasir Kafe';
  let r = 0, score = 0, max = 0;
  Music.play('game');

  return UI.wait<KasirResult>(done => {
    const nextRound = () => {
      if (r >= rounds) return finish();
      r++;
      const n = level >= 2 ? 2 : 1;
      const order = shuffle(MENU).slice(0, n);
      const total = order.reduce((a, x) => a + x.price, 0);
      const talkJp = order.map(x => x.jp).join(' と ') + ' を ください。';
      const showText = level !== 4;
      let stage: 'pick' | 'total' | 'change' = 'pick';
      const picked: MenuItem[] = [];
      const p = UI.panel(`<div class="win kasir">
        <div class="w-title">${title} <span class="pts-badge">${r}/${rounds}</span></div>
        <div class="ks-cust"><span class="ks-face">${pick(CUSTOMERS)}</span>
          <div class="ks-bubble"><span class="jp">${showText ? talkJp : '（🔊 dengarkan pesanannya）'}</span><button class="say" type="button" aria-label="Dengar">♪</button></div></div>
        <div class="ks-stage"></div>
        <p class="ks-msg muted small"></p>
      </div>`, 'gamep');
      const stageEl = p.querySelector('.ks-stage') as HTMLElement, msg = p.querySelector('.ks-msg') as HTMLElement;
      const say = () => Sound.speak(talkJp);
      (p.querySelector('.say') as HTMLButtonElement).onclick = say;
      setTimeout(say, 300);

      const renderPick = () => {
        stageEl.innerHTML = `<div class="ks-menu">${MENU.map((m, i) => `<button type="button" class="ks-item ${picked.includes(m) ? 'on' : ''}" data-i="${i}"><i>${m.icon}</i><b class="jp">${m.jp}</b><small class="jp">${kanjiNum(m.price)}円</small></button>`).join('')}</div>`;
        msg.textContent = n === 1 ? 'Ketuk menu yang dipesan.' : `Ketuk ${n} menu yang dipesan (${picked.length}/${n}).`;
        stageEl.querySelectorAll<HTMLButtonElement>('.ks-item').forEach(b => b.onclick = () => {
          const m = MENU[+b.dataset.i!];
          if (picked.includes(m)) return;
          max++;
          if (order.includes(m)) { Sound.ok(); score++; picked.push(m); }
          else { Sound.bad(); msg.textContent = `Bukan ${m.jp} (${m.ro}). Dengarkan lagi, ya.`; say(); return; }
          if (picked.length >= n) { if (level >= 2) { stage = 'total'; setTimeout(renderTotal, 350); } else setTimeout(next, 500); }
          else renderPick();
        });
      };
      const numChoices = (right: number) => shuffle([right, ...shuffle([right + 100, right - 50, right + 50, right - 100, right + 30].filter(v => v > 0 && v !== right)).slice(0, 2)]);
      const renderTotal = () => {
        const ch = numChoices(total);
        stageEl.innerHTML = `<p class="ks-q">${order.map(x => `${x.jp} <span class="jp">${kanjiNum(x.price)}円</span>`).join(' + ')} = ?</p>
          <div class="ks-opts">${ch.map(v => `<button type="button" class="btn ghost ks-opt" data-v="${v}"><b class="jp">${kanjiNum(v)}円</b><small>${v} yen</small></button>`).join('')}</div>`;
        msg.textContent = 'Berapa totalnya? Pilih lalu ucapkan ke pelanggan.';
        stageEl.querySelectorAll<HTMLButtonElement>('.ks-opt').forEach(b => b.onclick = () => {
          max++;
          const v = +b.dataset.v!;
          if (v === total) {
            Sound.ok(); score++;
            Sound.speak(`${kanaNum(total)}えん です。`);
            if (level >= 3) { stage = 'change'; setTimeout(renderChange, 900); } else setTimeout(next, 900);
          } else { Sound.bad(); b.disabled = true; msg.textContent = `Hitung lagi: ${order.map(x => x.price).join(' + ')} = ${total}.`; }
        });
      };
      const renderChange = () => {
        const paid = total <= 1000 ? 1000 : 10000;
        const change = paid - total;
        const ch = numChoices(change);
        stageEl.innerHTML = `<p class="ks-q">Pelanggan membayar <b class="jp">${kanjiNum(paid)}円</b>. Kembaliannya?</p>
          <div class="ks-opts">${ch.map(v => `<button type="button" class="btn ghost ks-opt" data-v="${v}"><b class="jp">${kanjiNum(v)}円</b><small>${v} yen</small></button>`).join('')}</div>`;
        msg.textContent = `${paid} − ${total} = ?`;
        Sound.speak(`${kanaNum(paid)}えん で おねがいします。`);
        stageEl.querySelectorAll<HTMLButtonElement>('.ks-opt').forEach(b => b.onclick = () => {
          max++;
          if (+b.dataset.v! === change) { Sound.ok(); score++; Sound.speak(`${kanaNum(change)}えん の おかえし です。`); setTimeout(next, 1100); }
          else { Sound.bad(); b.disabled = true; }
        });
      };
      const next = () => { UI.closePanel(); nextRound(); };
      void stage;
      renderPick();
    };
    const finish = async () => {
      const ratio = max ? score / max : 0;
      const stars = ratio >= .85 ? 3 : ratio >= .6 ? 2 : 1;
      const pts = 10 + stars * 5;
      Save.d.points = (Save.d.points || 0) + pts; Save.write();
      const p = UI.panel(`<div class="win result"><div class="r-title">${title} selesai!</div>
        <div class="stars">${'<i class="on">★</i>'.repeat(stars)}${'<i>★</i>'.repeat(3 - stars)}</div>
        <div class="r-score">${score} / ${max} benar</div>
        <div class="pts">+${pts} <span>poin sakura</span></div>
        <p class="jp">ありがとう ございました！</p>
        <button class="btn" type="button">Lanjut ▶</button></div>`, 'center');
      Sound.star();
      (p.querySelector('.btn') as HTMLButtonElement).onclick = () => { Sound.blip(); UI.closePanel(); done({ score, max }); };
    };
    nextRound();
  });
}
