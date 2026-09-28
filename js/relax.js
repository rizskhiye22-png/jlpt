/* =========================================================
   AKTIVITAS SANTAI
   - Memancing (sungai & kolam): ikan menggigit → baca hurufnya untuk menarik
   - Hewan peliharaan: beli dengan poin, mengikuti pemain, bisa dielus
   - Duduk di bangku taman: mendengar percakapan sehari-hari
   - Membaca buku cerita di perpustakaan (cerita pendek dari huruf yang dikuasai)
   ========================================================= */

const FISH = [
  { id: 'medaka', jp: 'めだか', ro: 'medaka', name: 'ikan medaka', where: 'pond', rare: 1, pts: 5, col: ['#b9c9a0', '#6f8a5a'] },
  { id: 'kingyo', jp: 'きんぎょ', ro: 'kingyo', name: 'ikan mas koki', where: 'pond', rare: 1, pts: 6, col: ['#f28c3c', '#c95a1e'] },
  { id: 'koi', jp: 'こい', ro: 'koi', name: 'ikan koi', where: 'pond', rare: 2, pts: 12, col: ['#fff6ea', '#e0475f'] },
  { id: 'nishiki', jp: 'にしきごい', ro: 'nishikigoi', name: 'koi warna-warni', where: 'pond', rare: 3, pts: 25, col: ['#f6d44a', '#e0475f'] },
  { id: 'kame', jp: 'かめ', ro: 'kame', name: 'kura-kura', where: 'pond', rare: 3, pts: 20, col: ['#6f9a5a', '#3f6b38'], shape: 'turtle' },
  { id: 'ayu', jp: 'あゆ', ro: 'ayu', name: 'ikan ayu', where: 'river', rare: 1, pts: 6, col: ['#c9d6dc', '#6d8a96'] },
  { id: 'funa', jp: 'ふな', ro: 'funa', name: 'ikan mas liar', where: 'river', rare: 1, pts: 5, col: ['#b0a070', '#6a5a30'] },
  { id: 'unagi', jp: 'うなぎ', ro: 'unagi', name: 'belut', where: 'river', rare: 2, pts: 14, col: ['#5a5a3a', '#2f2f1f'], shape: 'eel' },
  { id: 'kani', jp: 'かに', ro: 'kani', name: 'kepiting sungai', where: 'river', rare: 2, pts: 12, col: ['#d8553d', '#8a2a1e'], shape: 'crab' },
  { id: 'iwana', jp: 'いわな', ro: 'iwana', name: 'ikan char', where: 'river', rare: 3, pts: 22, col: ['#8a9aa6', '#f2c14e'] },
  { id: 'akikan', jp: 'あきかん', ro: 'akikan', name: 'kaleng kosong (sampah!)', where: 'any', rare: 0, pts: 1, col: ['#c9ccd3', '#8a8f9e'], shape: 'can' },
  { id: 'geta', jp: 'げた', ro: 'geta', name: 'sandal kayu (siapa yang hilang?)', where: 'any', rare: 0, pts: 2, col: ['#b07a4c', '#6a4228'], shape: 'geta' },
];

const PETS = [
  { id: 'pet_neko', kind: 'neko', jp: 'ねこ', ro: 'neko', name: 'kucing', pet: 'Tama', price: 80, sound: 'にゃあ', pal: { h: '#3a3440', H: '#231f28', o: '#f7f3ea', O: '#d9cfbc', a: '#f28c8c' } },
  { id: 'pet_inu', kind: 'inu', jp: 'いぬ', ro: 'inu', name: 'anjing', pet: 'Pochi', price: 100, sound: 'わん', pal: { h: '#d9a45a', H: '#a8742e', o: '#fff6ea', O: '#e0d0b8', a: '#e0475f' } },
  { id: 'pet_usagi', kind: 'usagi', jp: 'うさぎ', ro: 'usagi', name: 'kelinci', pet: 'Momo', price: 90, sound: 'ぴょん', pal: { h: '#fbf7ef', H: '#d9cfbc', o: '#f7b6c8', O: '#e08aa5', a: '#f28c8c' } },
  { id: 'pet_hiyoko', kind: 'hiyoko', jp: 'ひよこ', ro: 'hiyoko', name: 'anak ayam', pet: 'Piyo', price: 60, sound: 'ぴよ', pal: { h: '#f6d44a', H: '#d9a826', o: '#f29b38', O: '#c97a1e', a: '#f29b38' } },
];

// Kalimat yang terdengar saat duduk di taman
const OVERHEARD = [
  { who: 'Anak-anak', jp: 'はやく、はやく！', ro: 'hayaku, hayaku!', id: 'Cepat, cepat!' },
  { who: 'Ibu-ibu', jp: 'いい てんき ですね。', ro: 'ii tenki desu ne.', id: 'Cuacanya bagus, ya.' },
  { who: 'Kakek', jp: 'さくら が きれい だ なあ。', ro: 'sakura ga kirei da naa.', id: 'Sakuranya indah sekali.' },
  { who: 'Pelajar', jp: 'あした、テスト だよ！', ro: 'ashita, tesuto da yo!', id: 'Besok ada ulangan, lho!' },
  { who: 'Anak kecil', jp: 'おかあさん、みて！', ro: 'okaasan, mite!', id: 'Ibu, lihat!' },
  { who: 'Penjual', jp: 'いらっしゃい！やきいも だよ！', ro: 'irasshai! yakiimo da yo!', id: 'Silakan! Ada ubi bakar!' },
  { who: 'Teman-teman', jp: 'また あした ね！', ro: 'mata ashita ne!', id: 'Sampai besok, ya!' },
  { who: 'Pemilik anjing', jp: 'おいで、ポチ！', ro: 'oide, Pochi!', id: 'Sini, Pochi!' },
  { who: 'Nenek', jp: 'きを つけて ね。', ro: 'ki o tsukete ne.', id: 'Hati-hati, ya.' },
  { who: 'Pasangan', jp: 'おなか すいた ね。', ro: 'onaka suita ne.', id: 'Lapar, ya.' },
  { who: 'Anak SD', jp: 'じゃんけん ぽん！', ro: 'janken pon!', id: 'Suit! (batu-gunting-kertas)' },
  { who: 'Pelari', jp: 'はあ、つかれた…', ro: 'haa, tsukareta…', id: 'Hah, capek…' },
];

// Buku cerita pendek (terbuka bila semua hurufnya sudah dipelajari)
const BOOKS = [
  { id: 'b1', title: 'あおい いえ', sub: 'Rumah biru', pages: [
    { jp: 'あおい いえ。', ro: 'aoi ie.', id: 'Rumah yang biru.' },
    { jp: 'いえ の うえ。', ro: 'ie no ue.', id: 'Di atas rumah.' },
    { jp: 'あおい そら。', ro: 'aoi sora.', id: 'Langit yang biru.' },
    { jp: 'きれい。', ro: 'kirei.', id: 'Indah.' },
  ]},
  { id: 'b2', title: 'ねこ と いぬ', sub: 'Kucing dan anjing', pages: [
    { jp: 'ねこ が いる。', ro: 'neko ga iru.', id: 'Ada seekor kucing.' },
    { jp: 'いぬ も いる。', ro: 'inu mo iru.', id: 'Ada juga seekor anjing.' },
    { jp: 'ねこ は うえ。', ro: 'neko wa ue.', id: 'Kucingnya di atas.' },
    { jp: 'いぬ は した。', ro: 'inu wa shita.', id: 'Anjingnya di bawah.' },
    { jp: 'ふたり は ともだち。', ro: 'futari wa tomodachi.', id: 'Mereka berdua berteman.' },
  ]},
  { id: 'b3', title: 'おにぎり', sub: 'Nasi kepal', pages: [
    { jp: 'おなか が すいた。', ro: 'onaka ga suita.', id: 'Perutku lapar.' },
    { jp: 'おにぎり を たべる。', ro: 'onigiri o taberu.', id: 'Aku makan onigiri.' },
    { jp: 'おいしい！', ro: 'oishii!', id: 'Enak!' },
    { jp: 'もう ひとつ。', ro: 'mou hitotsu.', id: 'Satu lagi.' },
    { jp: 'ごちそうさま！', ro: 'gochisousama!', id: 'Terima kasih atas makanannya!' },
  ]},
  { id: 'b4', title: 'よる の そら', sub: 'Langit malam', pages: [
    { jp: 'よる です。', ro: 'yoru desu.', id: 'Sekarang malam.' },
    { jp: 'つき が きれい。', ro: 'tsuki ga kirei.', id: 'Bulannya indah.' },
    { jp: 'ほし も ひかる。', ro: 'hoshi mo hikaru.', id: 'Bintang juga bersinar.' },
    { jp: 'おやすみ なさい。', ro: 'oyasumi nasai.', id: 'Selamat tidur.' },
  ]},
  { id: 'b5', title: 'カフェ に いこう', sub: 'Ayo ke kafe (katakana)', pages: [
    { jp: 'カフェ に いこう。', ro: 'kafe ni ikou.', id: 'Ayo ke kafe.' },
    { jp: 'ケーキ と ココア。', ro: 'keeki to kokoa.', id: 'Kue dan cokelat panas.' },
    { jp: 'メロン も ある。', ro: 'meron mo aru.', id: 'Ada melon juga.' },
    { jp: 'おいしい ね。', ro: 'oishii ne.', id: 'Enak, ya.' },
    { jp: 'また きたい な。', ro: 'mata kitai na.', id: 'Ingin datang lagi.' },
  ]},
  { id: 'b6', title: 'ラーメン の ひ', sub: 'Hari ramen (katakana)', pages: [
    { jp: 'きょう は ラーメン。', ro: 'kyou wa raamen.', id: 'Hari ini ramen.' },
    { jp: 'チキン も いれる。', ro: 'chikin mo ireru.', id: 'Masukkan ayam juga.' },
    { jp: 'レモン の アイス も。', ro: 'remon no aisu mo.', id: 'Es krim lemon juga.' },
    { jp: 'しあわせ！', ro: 'shiawase!', id: 'Bahagia!' },
  ]},
];

const Relax = (() => {
  const S = () => Save.d;
  const shuffle = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [b[i], b[j]] = [b[j], b[i]]; } return b; };
  const ensure = () => { const s = S(); s.fish = s.fish || {}; s.pets = s.pets || []; s.books = s.books || []; s.daily = s.daily || {}; };
  const once = key => { ensure(); const t = Extras.today(); if (S().daily[key] === t) return false; S().daily[key] = t; Save.write(); return true; };

  /* ---------- gambar ikan ---------- */
  const fishImg = (() => {
    const cache = {};
    return (f, size = 64) => {
      if (!cache[f.id]) {
        const c = document.createElement('canvas'); c.width = c.height = 16; const x = c.getContext('2d');
        const P = (col, a, b, w = 1, h = 1) => { x.fillStyle = col; x.fillRect(a, b, w, h); };
        const [m, d] = f.col, k = '#2a1f2d';
        if (f.shape === 'crab') { P(k, 3, 6, 10, 6); P(m, 4, 7, 8, 4); P(k, 1, 4, 3, 3); P(k, 12, 4, 3, 3); P(m, 2, 5, 1, 1); P(m, 13, 5, 1, 1); P('#fff', 6, 7, 1, 1); P('#fff', 9, 7, 1, 1); P(k, 4, 12, 1, 2); P(k, 11, 12, 1, 2); }
        else if (f.shape === 'turtle') { P(k, 3, 5, 9, 7); P(m, 4, 6, 7, 5); P(d, 6, 7, 3, 3); P(k, 12, 7, 3, 3); P('#9fc98a', 12, 8, 2, 1); P(k, 3, 12, 2, 2); P(k, 10, 12, 2, 2); }
        else if (f.shape === 'eel') { P(k, 1, 7, 14, 4); P(m, 2, 8, 12, 2); P(d, 2, 9, 12, 1); P('#fff', 12, 8, 1, 1); }
        else if (f.shape === 'can') { P(k, 5, 3, 6, 11); P(m, 6, 4, 4, 9); P('#d8455d', 6, 7, 4, 3); }
        else if (f.shape === 'geta') { P(k, 3, 4, 10, 5); P(m, 4, 5, 8, 3); P(k, 4, 9, 2, 3); P(k, 10, 9, 2, 3); P('#d8455d', 7, 3, 2, 3); }
        else { P(k, 2, 5, 10, 7); P(m, 3, 6, 8, 5); P(d, 3, 9, 8, 2); P(k, 11, 4, 4, 9); P(d, 12, 5, 2, 7); P('#fff', 4, 7, 1, 1); P(k, 4, 7, 1, 1); P('#fff', 5, 6, 1, 1); }
        cache[f.id] = c.toDataURL();
      }
      return `<img class="fish-ic" src="${cache[f.id]}" width="${size}" height="${size}" alt="">`;
    };
  })();

  /* ---------- MEMANCING ---------- */
  async function fishing(where) {
    ensure();
    Music.play('evening');
    const pool = FISH.filter(f => f.where === where || f.where === 'any');
    const roll = () => { const r = Math.random(); const tier = r < .08 ? 3 : r < .3 ? 2 : r < .88 ? 1 : 0; const c = pool.filter(f => f.rare === tier); return c[Math.random() * c.length | 0] || pool[0]; };
    let caught = 0, keep = true;
    while (keep) {
      const fish = roll();
      const res = await UI.wait(done => {
        const p = UI.panel(`
          <div class="game fishing">
            <div class="g-head"><span class="g-title">🎣 Memancing</span><span class="g-info">${where === 'pond' ? 'Kolam' : 'Sungai'} · tangkapan ${caught}</span></div>
            <div class="pondview ${where}"><div class="ripple"></div><div class="bobber"></div><div class="bite">!</div></div>
            <div class="f-q"></div>
            <p class="g-hint">Tunggu pelampung bergerak. Saat ada huruf muncul, pilih cara bacanya dengan cepat!</p>
            <div class="row"><button class="btn ghost" data-a="stop" type="button">Berhenti</button></div>
          </div>`, 'gamep');
        const view = p.querySelector('.pondview'), q = p.querySelector('.f-q');
        let state = 'wait', timer = null, over = false;
        const end = v => { if (over) return; over = true; clearTimeout(timer); done(v); };
        p.querySelector('[data-a=stop]').onclick = () => end('stop');
        timer = setTimeout(() => {
          state = 'bite'; view.classList.add('biting'); Sound.blip();
          const known = S().kana.length >= 3 ? S().kana : null;
          if (known) {
            const k = known[Math.random() * known.length | 0];
            const opts = shuffle([k, ...shuffle(known.filter(x => x !== k && IS_KATA(x) === IS_KATA(k))).slice(0, 2)]);
            q.innerHTML = `<div class="f-kana jp">${k}</div><div class="f-opts">${opts.map(o => `<button class="opt" type="button" data-k="${o}">${KANA[o].ro}</button>`).join('')}</div>`;
            q.querySelectorAll('.opt').forEach(b => b.onclick = () => {
              if (b.dataset.k === k) { Sound.ok(); Sound.speak(k); end('catch'); }
              else { Sound.bad(); b.classList.add('wrong'); UI.toast(`${k} dibaca "${KANA[k].ro}"`); end('miss'); }
            });
          } else {
            q.innerHTML = `<button class="btn big-reel" type="button">Tarik!</button>`;
            q.querySelector('button').onclick = () => { Sound.ok(); end('catch'); };
          }
          timer = setTimeout(() => { Sound.bad(); end('miss'); }, Save.d.settings.relax ? 6000 : 3500);
        }, 1500 + Math.random() * 3500);
        view.onclick = () => { if (state === 'wait') { Sound.bump(); UI.toast('Sabar… tunggu ikannya menggigit.'); } };
      });
      if (res === 'stop') break;
      if (res === 'miss') {
        const again = await UI.wait(done => {
          const p = UI.panel(`<div class="win result"><div class="r-title">Ikannya lepas…</div><p class="muted">Tidak apa-apa, coba lagi!</p>
            <div class="row"><button class="btn ghost" data-a="no" type="button">Selesai</button><button class="btn" data-a="yes" type="button">Lempar lagi</button></div></div>`, 'center');
          p.querySelector('[data-a=yes]').onclick = () => done(true); p.querySelector('[data-a=no]').onclick = () => done(false);
        });
        if (!again) break; continue;
      }
      caught++;
      const isNew = !S().fish[fish.id];
      S().fish[fish.id] = (S().fish[fish.id] || 0) + 1;
      S().points = (S().points || 0) + fish.pts; Save.write();
      Sound.star(); Sound.speak(fish.jp);
      keep = await UI.wait(done => {
        const p = UI.panel(`<div class="win result catch-card">
            <div class="r-title">${isNew ? '✨ Tangkapan baru!' : 'Dapat!'}</div>
            ${fishImg(fish, 96)}
            <div class="big-jp">${fish.jp}</div>
            <div class="r-score">${fish.ro} — ${fish.name}</div>
            <div class="rarity">${'★'.repeat(fish.rare) || '…'}</div>
            <div class="pts">+${fish.pts} <span>poin sakura</span></div>
            <div class="row"><button class="btn ghost" data-a="no" type="button">Selesai</button><button class="btn" data-a="yes" type="button">Lempar lagi</button></div>
          </div>`, 'center');
        p.querySelector('.big-jp').onclick = () => Sound.speak(fish.jp);
        p.querySelector('[data-a=yes]').onclick = () => { Sound.blip(); done(true); };
        p.querySelector('[data-a=no]').onclick = () => { Sound.blip(); done(false); };
      });
      Extras.checkAch();
    }
    UI.closePanel();
  }

  function fishBook() {
    ensure();
    const got = Object.keys(S().fish).length;
    const p = UI.panel(`<div class="win"><div class="w-title">Buku Ikan · さかな ずかん <span class="pts-badge">${got}/${FISH.length}</span></div>
      <div class="fish-grid">${FISH.map(f => { const n = S().fish[f.id]; return `<div class="fishcard ${n ? 'on' : ''}">${n ? fishImg(f, 48) : '<span class="unk">？</span>'}<b class="jp">${n ? f.jp : '？？？'}</b><small>${n ? `${f.name} ×${n}` : (f.where === 'pond' ? 'kolam' : f.where === 'river' ? 'sungai' : '???')}</small></div>`; }).join('')}</div>
      <button class="btn block" type="button">Tutup</button></div>`, 'scroll');
    return UI.wait(done => { p.querySelector('.btn').onclick = () => { Sound.blip(); UI.closePanel(); done(); }; });
  }

  /* ---------- HEWAN PELIHARAAN ---------- */
  function activePet() { ensure(); const id = S().petActive; return id && S().pets.includes(id) ? PETS.find(p => p.id === id) : null; }
  async function petShop() {
    ensure();
    for (;;) {
      const p = UI.panel(`<div class="win"><div class="w-title">Hewan Peliharaan <span class="pts-badge">🌸 <b class="pts-n">${S().points || 0}</b></span></div>
        <p class="muted">Hewan peliharaan akan mengikutimu ke mana pun. Elus setiap hari untuk bonus poin!</p>
        <div class="pet-grid">${PETS.map(pt => {
          const own = S().pets.includes(pt.id), on = S().petActive === pt.id;
          return `<div class="petcard ${on ? 'on' : ''}"><canvas width="16" height="16" data-pet="${pt.id}"></canvas><b class="jp">${pt.jp}</b><small>${pt.pet} · ${pt.name}</small>
            <button class="btn small ${own ? 'ghost' : ''}" data-id="${pt.id}" type="button">${on ? 'Bersamamu ✓' : own ? 'Ajak jalan' : `Adopsi 🌸${pt.price}`}</button></div>`;
        }).join('')}</div>
        <button class="btn block" data-a="close" type="button">Tutup</button></div>`, 'scroll');
      p.querySelectorAll('canvas[data-pet]').forEach(c => c.getContext('2d').drawImage(Pix.sprite(c.dataset.pet, 'down', 0), 0, 0));
      const id = await UI.wait(done => {
        p.querySelectorAll('[data-id]').forEach(b => b.onclick = () => done(b.dataset.id));
        p.querySelector('[data-a=close]').onclick = () => { Sound.blip(); done(null); };
      });
      if (!id) { UI.closePanel(); return; }
      const pt = PETS.find(x => x.id === id);
      if (!S().pets.includes(pt.id)) {
        if ((S().points || 0) < pt.price) { Sound.bad(); UI.toast(`Butuh 🌸${pt.price}. Kumpulkan poin dari mini-game, memancing, dan misi!`); continue; }
        if (!confirm(`Adopsi ${pt.pet} si ${pt.name} seharga 🌸${pt.price}?`)) continue;
        S().points -= pt.price; S().pets.push(pt.id); Sound.star();
      }
      S().petActive = S().petActive === pt.id ? null : pt.id; Save.write();
      World.setPet && World.setPet(activePet() ? activePet().id : null);
      Extras.checkAch();
    }
  }
  async function petPet() {
    const pt = activePet(); if (!pt) return;
    Sound.heart();
    await UI.say({ n: `Kamu mengelus ${pt.pet}. ${pt.jp} (${pt.ro}) = ${pt.name}.` });
    await UI.say({ jp: `${pt.sound}〜♪`, ro: pt.sound, id: `${pt.pet} terlihat sangat senang!` });
    if (once('pet')) { S().points = (S().points || 0) + 10; Save.write(); UI.toast('🌸 +10 poin · bonus elus harian'); }
    Extras.bump('pets');
  }

  /* ---------- DUDUK DI TAMAN ---------- */
  async function bench() {
    const a = await UI.choose('Duduk sebentar di bangku?', [{ label: 'Duduk & dengarkan sekitar' }, { label: 'Tidak jadi' }]);
    if (a !== 0) return;
    Music.play('home');
    await UI.fade(() => {}, 300);
    await UI.say({ n: 'Kamu duduk dan menikmati angin sepoi-sepoi. Kelopak sakura berjatuhan perlahan…' });
    const lines = shuffle(OVERHEARD).slice(0, 3);
    for (const l of lines) await UI.say({ n: `${l.who} di dekatmu berkata:` }).then(() => UI.say({ jp: l.jp, ro: l.ro, id: l.id }));
    await UI.say({ n: 'Kamu merasa segar kembali!' });
    if (once('bench')) { S().points = (S().points || 0) + 8; Save.write(); UI.toast('🌸 +8 poin · waktu santai'); }
    Extras.bump('bench');
  }

  /* ---------- MEMBACA BUKU ---------- */
  function readable(book) {
    const known = new Set(S().kana);
    return book.pages.every(pg => [...pg.jp].every(c => !KANA[c] || known.has(c)));
  }
  async function library() {
    ensure();
    Music.play('home');
    const p = UI.panel(`<div class="win"><div class="w-title">Rak Buku · ほんだな</div>
      <p class="muted">Buku terbuka setelah kamu mempelajari semua hurufnya. Membaca = latihan terbaik!</p>
      <div class="books">${BOOKS.map(b => { const ok = readable(b), read = S().books.includes(b.id); return `<button class="bookcard ${ok ? '' : 'lock'} ${read ? 'read' : ''}" data-id="${b.id}" type="button" ${ok ? '' : 'disabled'}><b class="jp">${ok ? b.title : '？？？'}</b><small>${ok ? b.sub : 'Pelajari lebih banyak huruf'}</small>${read ? '<em>✓ dibaca</em>' : ''}</button>`; }).join('')}</div>
      <button class="btn block" data-a="close" type="button">Tutup</button></div>`, 'scroll');
    const id = await UI.wait(done => {
      p.querySelectorAll('.bookcard:not(.lock)').forEach(b => b.onclick = () => { Sound.blip(); done(b.dataset.id); });
      p.querySelector('[data-a=close]').onclick = () => { Sound.blip(); done(null); };
    });
    UI.closePanel();
    if (!id) return;
    await readBook(BOOKS.find(b => b.id === id));
    return library();
  }
  function readBook(book) {
    let i = 0, showRo = false, showId = false;
    return UI.wait(done => {
      const render = () => {
        const pg = book.pages[i];
        const p = UI.panel(`<div class="win reader-book">
          <div class="w-title">${book.title} <span class="pts-badge">${i + 1}/${book.pages.length}</span></div>
          <div class="page"><div class="pg-jp">${pg.jp}</div>
            ${showRo ? `<div class="pg-ro">${pg.ro}</div>` : ''}${showId ? `<div class="pg-id">${pg.id}</div>` : ''}</div>
          <div class="row"><button class="btn ghost" data-a="say" type="button">♪ Dengar</button><button class="btn ghost ${showRo ? 'on' : ''}" data-a="ro" type="button">Romaji</button><button class="btn ghost ${showId ? 'on' : ''}" data-a="id" type="button">Arti</button></div>
          <div class="row"><button class="btn ghost" data-a="prev" type="button" ${i ? '' : 'disabled'}>◀</button><button class="btn" data-a="next" type="button">${i < book.pages.length - 1 ? 'Halaman berikut ▶' : 'Selesai ✓'}</button></div>
        </div>`, 'center');
        if (Save.d.settings.voice) Sound.speak(pg.jp);
        p.querySelector('[data-a=say]').onclick = () => Sound.speak(pg.jp);
        p.querySelector('[data-a=ro]').onclick = () => { showRo = !showRo; render(); };
        p.querySelector('[data-a=id]').onclick = () => { showId = !showId; render(); };
        p.querySelector('[data-a=prev]').onclick = () => { if (i) { i--; render(); } };
        p.querySelector('[data-a=next]').onclick = () => {
          Sound.blip();
          if (i < book.pages.length - 1) { i++; render(); return; }
          if (!S().books.includes(book.id)) { S().books.push(book.id); S().points = (S().points || 0) + 15; Save.write(); UI.toast('🌸 +15 poin · buku selesai dibaca'); }
          Extras.bump('booksRead'); Extras.checkAch();
          UI.closePanel(); done();
        };
      };
      render();
    });
  }

  return { fishing, fishBook, petShop, petPet, activePet, bench, library, readBook, fishImg };
})();
