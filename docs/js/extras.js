/* =========================================================
   FITUR TAMBAHAN (Fase 1 ROADMAP)
   - Jajanan Jepang: jidouhanbaiki, yatai, konbini, tas, makan & hadiah
   - Pencapaian (achievement)
   - Streak harian & bonus login
   - Ulasan Harian (spaced repetition / kotak Leitner)
   ========================================================= */

/* ---------- Data jajanan ---------- */
const SNACKS = [
  // mesin minuman (jidouhanbaiki)
  { id: 'ramune', jp: 'ラムネ', ro: 'ramune', name: 'soda ramune', price: 15, shop: 'vending', fact: 'Soda dalam botol kaca yang ditutup kelereng. Dorong kelerengnya ke dalam untuk membuka!' },
  { id: 'ocha', jp: 'おちゃ', ro: 'ocha', name: 'teh hijau', price: 10, shop: 'vending', fact: 'Teh hijau tanpa gula. Di Jepang, teh dingin dijual di hampir setiap mesin minuman.' },
  { id: 'miruku', jp: 'ミルク', ro: 'miruku', name: 'susu', price: 12, shop: 'vending', fact: 'Susu kotak sering diminum saat makan siang di sekolah Jepang.' },
  { id: 'kokoa', jp: 'ココア', ro: 'kokoa', name: 'cokelat panas', price: 15, shop: 'vending', fact: 'Mesin minuman Jepang juga menjual minuman HANGAT, lho! Tombolnya berwarna merah.' },
  // warung festival (yatai)
  { id: 'dango', jp: 'だんご', ro: 'dango', name: 'dango', price: 20, shop: 'yatai', fact: 'Bola-bola kue beras yang ditusuk. Dango tiga warna (hanami dango) dimakan saat melihat sakura.' },
  { id: 'taiyaki', jp: 'たいやき', ro: 'taiyaki', name: 'kue ikan', price: 25, shop: 'yatai', fact: 'Kue berbentuk ikan tai (kakap) berisi pasta kacang merah manis.' },
  { id: 'dorayaki', jp: 'どらやき', ro: 'dorayaki', name: 'dorayaki', price: 25, shop: 'yatai', fact: 'Dua pancake dengan isi kacang merah. Kesukaan Doraemon!' },
  { id: 'senbei', jp: 'せんべい', ro: 'senbei', name: 'kerupuk beras', price: 15, shop: 'yatai', fact: 'Kerupuk beras panggang dengan kecap asin. Renyah!' },
  { id: 'mochi', jp: 'もち', ro: 'mochi', name: 'mochi', price: 20, shop: 'yatai', fact: 'Kue beras kenyal. Saat tahun baru, orang Jepang makan mochi bersama keluarga.' },
  // konbini (Bab 2)
  { id: 'onigiri', jp: 'おにぎり', ro: 'onigiri', name: 'nasi kepal', price: 20, shop: 'konbini', fact: 'Nasi kepal isi salmon atau acar plum, dibungkus rumput laut nori. Makanan favorit untuk bekal!' },
  { id: 'meronpan', jp: 'メロンパン', ro: 'meronpan', name: 'roti melon', price: 25, shop: 'konbini', fact: 'Roti manis bertekstur renyah seperti kulit melon, walau biasanya tidak berasa melon!' },
  { id: 'purin', jp: 'プリン', ro: 'purin', name: 'puding', price: 25, shop: 'konbini', fact: 'Puding karamel lembut. Salah satu dessert konbini paling populer.' },
  { id: 'aisu', jp: 'アイス', ro: 'aisu', name: 'es krim', price: 20, shop: 'konbini', fact: 'Konbini punya lemari es krim yang selalu penuh, bahkan di musim dingin.' },
];
const SNACK_BY = Object.fromEntries(SNACKS.map(s => [s.id, s]));
// jajanan favorit (hadiah favorit = ♥ lebih banyak)
const FAVORITE = { yuki: 'dango', kenta: 'meronpan', hana: 'purin', obaa: 'ocha', kid: 'ramune', ojii: 'senbei', sensei: 'dorayaki', tenin: 'onigiri' };

/* ---------- Gambar ikon jajanan (pixel 16x16) ---------- */
const SnackArt = (() => {
  const cache = {};
  const P = (c, col, x, y, w = 1, h = 1) => { c.fillStyle = col; c.fillRect(x, y, w, h); };
  const draw = {
    onigiri: c => { P(c, '#2a1f2d', 4, 3, 8, 1); P(c, '#2a1f2d', 3, 4, 10, 9); P(c, '#fff', 5, 4, 6, 1); P(c, '#fff', 4, 5, 8, 7); P(c, '#1f3a2a', 5, 9, 6, 4); P(c, '#d8455d', 7, 6, 2, 2); },
    dango: c => { P(c, '#8a5a36', 7, 1, 2, 14); [['#f7b6c8', 2], ['#fff', 6], ['#8fd3b0', 10]].forEach(([col, y]) => { P(c, '#2a1f2d', 4, y - 1, 8, 5); P(c, col, 5, y, 6, 3); }); },
    taiyaki: c => { P(c, '#2a1f2d', 2, 5, 11, 7); P(c, '#d99a4c', 3, 6, 9, 5); P(c, '#2a1f2d', 12, 4, 3, 9); P(c, '#d99a4c', 13, 5, 1, 7); P(c, '#2a1f2d', 4, 7, 1, 1); P(c, '#b8742e', 6, 8, 5, 1); },
    dorayaki: c => { P(c, '#2a1f2d', 2, 4, 12, 9); P(c, '#b8742e', 3, 5, 10, 3); P(c, '#6a2f2a', 3, 8, 10, 1); P(c, '#b8742e', 3, 9, 10, 3); },
    senbei: c => { P(c, '#2a1f2d', 3, 3, 10, 10); P(c, '#c98a4a', 4, 4, 8, 8); P(c, '#8a5a36', 6, 6, 1, 1); P(c, '#8a5a36', 9, 8, 1, 1); P(c, '#1f3a2a', 4, 9, 8, 3); },
    mochi: c => { P(c, '#2a1f2d', 3, 5, 10, 8); P(c, '#fffaf0', 4, 6, 8, 6); P(c, '#f7b6c8', 5, 7, 2, 1); P(c, '#e8e0d0', 4, 11, 8, 1); },
    ramune: c => { P(c, '#2a1f2d', 6, 1, 4, 14); P(c, '#9fd0ee', 7, 2, 2, 12); P(c, '#2a1f2d', 5, 6, 6, 9); P(c, '#6fb8e6', 6, 7, 4, 7); P(c, '#fff', 7, 4, 2, 2); },
    ocha: c => { P(c, '#2a1f2d', 4, 3, 8, 12); P(c, '#8fcf6f', 5, 4, 6, 10); P(c, '#fff', 5, 7, 6, 3); P(c, '#3f8f58', 7, 8, 2, 1); },
    miruku: c => { P(c, '#2a1f2d', 4, 2, 8, 13); P(c, '#fff', 5, 3, 6, 11); P(c, '#6fb8e6', 5, 9, 6, 2); P(c, '#2a1f2d', 6, 1, 4, 1); },
    kokoa: c => { P(c, '#2a1f2d', 4, 2, 8, 13); P(c, '#8a5a36', 5, 3, 6, 11); P(c, '#f2c14e', 5, 6, 6, 2); },
    meronpan: c => { P(c, '#2a1f2d', 2, 4, 12, 9); P(c, '#f2d27a', 3, 5, 10, 7); for (let i = 0; i < 3; i++) { P(c, '#d9b050', 4 + i * 3, 5, 1, 7); P(c, '#d9b050', 3, 6 + i * 2, 10, 1); } },
    purin: c => { P(c, '#2a1f2d', 4, 4, 8, 10); P(c, '#f6d27a', 5, 7, 6, 6); P(c, '#8a4a2a', 5, 5, 6, 2); P(c, '#2a1f2d', 3, 13, 10, 1); },
    aisu: c => { P(c, '#2a1f2d', 5, 1, 7, 9); P(c, '#f7b6c8', 6, 2, 5, 7); P(c, '#fff', 7, 3, 1, 2); P(c, '#8a5a36', 8, 10, 1, 5); },
  };
  function canvas(id) {
    if (!cache[id]) { const c = document.createElement('canvas'); c.width = c.height = 16; const x = c.getContext('2d'); (draw[id] || draw.mochi)(x); cache[id] = c.toDataURL(); }
    return cache[id];
  }
  const img = (id, size = 40) => `<img class="snack-ic" src="${canvas(id)}" width="${size}" height="${size}" alt="">`;
  return { img };
})();

/* ---------- Pencapaian ---------- */
const ACHIEVEMENTS = [
  { id: 'day1', icon: '一', title: 'Langkah Pertama', desc: 'Selesaikan hari pertama sekolah.', pts: 10, test: s => !!s.days[1] },
  { id: 'hira10', icon: 'あ', title: '10 Hiragana', desc: 'Pelajari 10 huruf hiragana.', pts: 10, test: s => s.kana.filter(k => !IS_KATA(k)).length >= 10 },
  { id: 'hira46', icon: 'ひ', title: 'Ahli Hiragana', desc: 'Pelajari semua 46 hiragana.', pts: 50, test: s => s.kana.filter(k => !IS_KATA(k)).length >= 46 },
  { id: 'kata10', icon: 'ア', title: '10 Katakana', desc: 'Pelajari 10 huruf katakana.', pts: 10, test: s => s.kana.filter(IS_KATA).length >= 10 },
  { id: 'kata46', icon: 'カ', title: 'Ahli Katakana', desc: 'Pelajari semua 46 katakana.', pts: 50, test: s => s.kana.filter(IS_KATA).length >= 46 },
  { id: 'star3', icon: '★', title: 'Sempurna!', desc: 'Dapatkan 3 bintang di latihan soal.', pts: 15, test: s => Object.values(s.days).some(d => d.stars === 3) },
  { id: 'gradeA', icon: 'Ａ', title: 'Nilai A', desc: 'Dapatkan nilai A di ulangan.', pts: 20, test: s => Object.values(s.days).some(d => /A/.test(d.grade || '')) },
  { id: 'shodo10', icon: '書', title: 'Tangan Kaligrafer', desc: 'Dapatkan stempel すごい 10 kali.', pts: 25, test: s => (s.stats.shodo3 || 0) >= 10 },
  { id: 'karuta', icon: '札', title: 'Juara Karuta', desc: 'Menangkan karuta tanpa salah.', pts: 20, test: s => (s.stats.karutaPerfect || 0) >= 1 },
  { id: 'streak3', icon: '火', title: 'Tiga Hari Berturut', desc: 'Bermain 3 hari berturut-turut.', pts: 15, test: s => (s.streak.count || 0) >= 3 },
  { id: 'streak7', icon: '炎', title: 'Seminggu Penuh', desc: 'Bermain 7 hari berturut-turut.', pts: 40, test: s => (s.streak.count || 0) >= 7 },
  { id: 'review5', icon: '復', title: 'Rajin Mengulas', desc: 'Selesaikan Ulasan Harian 5 kali.', pts: 25, test: s => (s.stats.reviews || 0) >= 5 },
  { id: 'yuki5', icon: '雪', title: 'Teman Baik Yuki', desc: 'Pertemanan dengan Yuki ♥5.', pts: 15, test: s => (s.friends.yuki || 0) >= 5 },
  { id: 'kenta5', icon: '健', title: 'Teman Baik Kenta', desc: 'Pertemanan dengan Kenta ♥5.', pts: 15, test: s => (s.friends.kenta || 0) >= 5 },
  { id: 'hana5', icon: '花', title: 'Teman Baik Hana', desc: 'Pertemanan dengan Hana ♥5.', pts: 15, test: s => (s.friends.hana || 0) >= 5 },
  { id: 'snack1', icon: '食', title: 'Itadakimasu!', desc: 'Makan jajanan Jepang pertamamu.', pts: 10, test: s => s.tried.length >= 1 },
  { id: 'snack8', icon: '団', title: 'Pemburu Jajanan', desc: 'Cicipi 8 jajanan berbeda.', pts: 30, test: s => s.tried.length >= 8 },
  { id: 'gift5', icon: '贈', title: 'Suka Berbagi', desc: 'Beri hadiah kepada teman 5 kali.', pts: 20, test: s => (s.stats.gifts || 0) >= 5 },
  { id: 'quest3', icon: '助', title: 'Penolong Kota', desc: 'Selesaikan 3 misi sampingan.', pts: 25, test: s => Object.values(s.quests).filter(q => q.state === 'done').length >= 3 },
  { id: 'mochi', icon: '猫', title: 'Detektif Kucing', desc: 'Temukan Mochi.', pts: 15, test: s => (s.quests.mochi || {}).state === 'done' },
  { id: 'daikichi', icon: '吉', title: 'Daikichi!', desc: 'Dapatkan omikuji keberuntungan besar.', pts: 15, test: s => (s.stats.daikichi || 0) >= 1 },
  { id: 'ch1', icon: '卒', title: 'Lulus Bab 1', desc: 'Selesaikan Bab Hiragana.', pts: 40, test: s => s.day > 11 },
  { id: 'ch2', icon: '祭', title: 'Bintang Festival', desc: 'Selesaikan Bab Katakana.', pts: 60, test: s => s.day > 22 },
  { id: 'online', icon: '友', title: 'Halo Dunia', desc: 'Sapa pemain lain secara online.', pts: 15, test: s => (s.stats.onlineSay || 0) >= 1 },
];

const Extras = (() => {
  const S = () => Save.d;
  const ensure = () => {
    const s = S();
    s.bag = s.bag || {}; s.tried = s.tried || []; s.ach = s.ach || []; s.stats = s.stats || {};
    s.streak = s.streak || { last: '', count: 0 }; s.srs = s.srs || {};
  };
  const today = (off = 0) => { const d = new Date(); d.setDate(d.getDate() + off); return d.toISOString().slice(0, 10); };
  const bump = (k, n = 1) => { ensure(); S().stats[k] = (S().stats[k] || 0) + n; Save.write(); };

  /* ---------- pencapaian ---------- */
  let banner = null;
  function checkAch() {
    ensure();
    const fresh = ACHIEVEMENTS.filter(a => !S().ach.includes(a.id) && (() => { try { return a.test(S()); } catch (e) { return false; } })());
    fresh.forEach((a, i) => {
      S().ach.push(a.id); S().points = (S().points || 0) + a.pts;
      setTimeout(() => showBanner(a), 600 + i * 2600);
    });
    if (fresh.length) Save.write();
  }
  function showBanner(a) {
    if (!banner) { banner = document.createElement('div'); banner.className = 'ach-banner'; document.getElementById('app').appendChild(banner); }
    banner.innerHTML = `<span class="ach-ic">${a.icon}</span><div><small>Pencapaian terbuka!</small><b>${a.title}</b><em>+${a.pts} 🌸</em></div>`;
    banner.classList.remove('on'); void banner.offsetWidth; banner.classList.add('on');
    Sound.star();
    clearTimeout(banner._t); banner._t = setTimeout(() => banner.classList.remove('on'), 2400);
  }
  function achPage() {
    ensure();
    const n = S().ach.length;
    const p = UI.panel(`<div class="win"><div class="w-title">Pencapaian <span class="pts-badge">${n}/${ACHIEVEMENTS.length}</span></div>
      <div class="ach-grid">${ACHIEVEMENTS.map(a => { const on = S().ach.includes(a.id); return `<div class="ach ${on ? 'on' : ''}"><span class="ach-ic">${on ? a.icon : '？'}</span><b>${a.title}</b><small>${a.desc}</small><em>🌸${a.pts}</em></div>`; }).join('')}</div>
      <button class="btn block" type="button">Tutup</button></div>`, 'scroll');
    return UI.wait(done => { p.querySelector('.btn').onclick = () => { Sound.blip(); UI.closePanel(); done(); }; });
  }

  /* ---------- streak & bonus login ---------- */
  async function login() {
    ensure();
    const st = S().streak, t = today();
    if (st.last === t) return;
    st.count = st.last === today(-1) ? st.count + 1 : 1;
    st.last = t;
    const bonus = Math.min(10 + st.count * 5, 45);
    S().points = (S().points || 0) + bonus; Save.write();
    await UI.timecard(`🔥 ${st.count} hari berturut-turut`, `Bonus login: +${bonus} poin sakura${st.count >= 7 ? '<br>Luar biasa, pertahankan!' : ''}`);
    checkAch();
  }

  /* ---------- Ulasan Harian (kotak Leitner) ---------- */
  const GAP = [0, 1, 2, 4, 7, 14];
  function learn(list) {
    ensure();
    list.forEach(k => { if (!S().srs[k]) S().srs[k] = { b: 1, due: today(1) }; });
    Save.write();
  }
  function due() {
    ensure();
    const t = today();
    // huruf lama (sebelum fitur ini) otomatis masuk ulasan
    S().kana.forEach(k => { if (!S().srs[k]) S().srs[k] = { b: 1, due: t }; });
    return Object.entries(S().srs).filter(([k, v]) => v.due <= t && KANA[k]).map(([k]) => k);
  }
  function answer(k, ok) {
    const r = S().srs[k]; if (!r) return;
    r.b = ok ? Math.min(5, r.b + 1) : 1;
    r.due = today(GAP[r.b]);
  }
  async function review() {
    const list = due();
    if (!list.length) return UI.say({ n: 'Tidak ada huruf yang perlu diulas hari ini. Hebat! Datang lagi besok, ya.' });
    const pick = list.sort(() => Math.random() - .5).slice(0, 12);
    const r = await Lesson.quiz({ focus: pick, count: pick.length, title: 'Ulasan Harian', only: true, onAnswer: answer });
    Save.write();
    await Lesson.results(r, false);
    bump('reviews'); S().points = (S().points || 0) + 15; Save.write();
    UI.toast('🌸 +15 poin · ulasan selesai');
    checkAch();
  }

  /* ---------- jajanan: toko, tas, makan, hadiah ---------- */
  function shop(kind) {
    ensure();
    const items = SNACKS.filter(s => s.shop === kind);
    const titles = { vending: '自動販売機 · Mesin Minuman', yatai: '屋台 · Warung Jajanan', konbini: 'コンビニ · Konbini' };
    const known = new Set(S().kana);
    const p = UI.panel(`<div class="win shopwin"><div class="w-title">${titles[kind]} <span class="pts-badge">🌸 <b class="pts-n">${S().points || 0}</b></span></div>
      <p class="muted">Baca nama jajanan dalam bahasa Jepang, lalu beli dengan poin sakura. Ketuk ♪ untuk mendengar.</p>
      <div class="snack-grid">${items.map(s => {
        const readable = [...s.jp].every(c => knownChar(c, known) || !KANA[c]);
        return `<div class="snack" data-id="${s.id}">${SnackArt.img(s.id, 48)}<b class="jp">${s.jp}</b><small>${readable || Save.d.settings.romaji ? s.ro : '???'}</small>${s.temp ? `<i class="temp ${s.temp}">${s.temp === 'hot' ? 'あたたかい' : 'つめたい'}</i>` : ''}
          <div class="snack-row"><button class="say" data-say="${s.jp}" type="button">♪</button><button class="buy" type="button">🌸${s.price}</button></div>
          <em class="own">${S().bag[s.id] ? '×' + S().bag[s.id] : ''}</em></div>`;
      }).join('')}</div>
      <button class="btn block" data-a="close" type="button">Selesai</button></div>`, 'scroll');
    return UI.wait(done => {
      p.querySelectorAll('[data-say]').forEach(b => b.onclick = () => Sound.speak(b.dataset.say));
      p.querySelectorAll('.buy').forEach(b => b.onclick = () => {
        const card = b.closest('.snack'), s = SNACK_BY[card.dataset.id];
        if ((S().points || 0) < s.price) { Sound.bad(); UI.toast(`Poin kurang. Butuh 🌸${s.price}. Main mini-game untuk dapat poin!`); return; }
        S().points -= s.price; S().bag[s.id] = (S().bag[s.id] || 0) + 1; Save.write();
        Sound.star(); Sound.speak(s.jp);
        card.querySelector('.own').textContent = '×' + S().bag[s.id];
        p.querySelector('.pts-n').textContent = S().points;
        UI.toast(`Kamu membeli ${s.jp} (${s.name})! Tersimpan di Tas.`);
        card.classList.add('bought'); setTimeout(() => card.classList.remove('bought'), 400);
      });
      p.querySelector('[data-a=close]').onclick = () => { Sound.blip(); UI.closePanel(); done(); };
    });
  }

  function bagHtml(mode) {
    const items = Object.entries(S().bag || {}).filter(([, n]) => n > 0);
    if (!items.length) return '<p class="muted">Tas masih kosong. Beli jajanan di mesin minuman, warung dekat kuil, atau konbini.</p>';
    return `<div class="snack-grid">${items.map(([id, n]) => { const s = SNACK_BY[id]; return `<button class="snack pickable" data-id="${id}" type="button">${SnackArt.img(id, 44)}<b class="jp">${s.jp}</b><small>${s.name}</small><em class="own">×${n}</em></button>`; }).join('')}</div>`;
  }
  // Buka tas: pilih jajanan untuk dimakan
  async function bag() {
    ensure();
    const p = UI.panel(`<div class="win"><div class="w-title">Tas · かばん</div>${bagHtml()}
      <div class="sec"><div class="sec-h">Buku jajanan (${S().tried.length}/${SNACKS.length} dicicipi)</div>
      <div class="tried">${SNACKS.map(s => `<span class="${S().tried.includes(s.id) ? 'on' : ''}" title="${s.name}">${S().tried.includes(s.id) ? SnackArt.img(s.id, 28) : '？'}</span>`).join('')}</div></div>
      <button class="btn block" data-a="close" type="button">Tutup</button></div>`, 'scroll');
    const id = await UI.wait(done => {
      p.querySelectorAll('.pickable').forEach(b => b.onclick = () => { Sound.blip(); done(b.dataset.id); });
      p.querySelector('[data-a=close]').onclick = () => { Sound.blip(); done(null); };
    });
    UI.closePanel();
    if (id) { await eat(id); return bag(); }
  }
  async function eat(id) {
    const s = SNACK_BY[id];
    await UI.say({ n: `Kamu membuka ${s.jp} (${s.ro}).` });
    let opts = [{ jp: 'いただきます！', ro: 'itadakimasu!', ok: true }, { jp: 'ただいま！', ro: 'tadaima!' }].sort(() => Math.random() - .5);
    for (;;) {
      const i = await UI.choose('Sebelum makan, ucapkan…', opts);
      if (opts[i].ok) { Sound.ok(); break; }
      Sound.bad(); await UI.say({ n: 'ただいま diucapkan saat pulang ke rumah. Sebelum makan: いただきます!' });
      opts = opts.filter((_, x) => x !== i);
    }
    await UI.say({ jp: 'いただきます！', ro: 'itadakimasu!', id: 'Selamat makan!' });
    S().bag[id]--; if (!S().tried.includes(id)) S().tried.push(id);
    await UI.say({ n: `Nyam… ${s.fact}` });
    await UI.say({ jp: 'ごちそうさまでした！', ro: 'gochisousama deshita!', id: 'Terima kasih atas makanannya!' });
    S().points = (S().points || 0) + 3; Save.write();
    UI.hideDialog(); checkAch();
  }
  // Beri jajanan kepada NPC; mengembalikan true bila memberi
  async function gift(npcId) {
    ensure();
    const items = Object.entries(S().bag).filter(([, n]) => n > 0);
    if (!items.length) { await UI.say({ n: 'Tasmu kosong. Beli jajanan dulu, yuk!' }); return false; }
    const i = await UI.choose(`Beri apa untuk ${CHARACTERS[npcId].name}?`, [...items.map(([id]) => ({ jp: SNACK_BY[id].jp, ro: SNACK_BY[id].ro })), { label: 'Tidak jadi' }]);
    if (i >= items.length) return false;
    const id = items[i][0], s = SNACK_BY[id];
    S().bag[id]--;
    const fav = FAVORITE[npcId] === id;
    await UI.say({ w: npcId, e: 'surprised', jp: `わあ、${s.jp}！`, ro: `waa, ${s.ro}!`, id: `Wah, ${s.name}!` });
    await UI.say({ w: npcId, e: 'happy', jp: fav ? 'だいすき！ほんとう に ありがとう！' : 'ありがとう！', ro: fav ? 'daisuki! hontou ni arigatou!' : 'arigatou!', id: fav ? 'Ini favoritku! Terima kasih banyak!' : 'Terima kasih!' });
    if (S().friends[npcId] !== undefined) S().friends[npcId] += fav ? 3 : 1;
    bump('gifts');
    S().points = (S().points || 0) + (fav ? 10 : 4); Save.write();
    Sound.heart(); UI.toast(fav ? `♥♥♥ ${CHARACTERS[npcId].name} sangat senang! (jajanan favorit)` : `♥ ${CHARACTERS[npcId].name} senang!`);
    checkAch();
    return true;
  }

  return { checkAch, achPage, login, learn, due, review, shop, bag, eat, gift, bump, ensure, today };
})();
