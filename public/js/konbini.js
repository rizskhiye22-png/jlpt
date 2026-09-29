/* =========================================================
   KONBINI LENGKAP
   - ±30 barang baru per kategori: おにぎり・おべんとう, パン, おかし,
     デザート, のみもの (lemari dingin), jajanan panas di samping kasir.
   - Mesin minuman: minuman あたたかい (panas) & つめたい (dingin).
   - Keranjang (かご) → kasir: dipindai satu per satu, lalu kasir bertanya
     sesuai isi keranjang (dipanaskan? kantong? sumpit? kartu poin? struk?),
     total harga dibacakan dengan angka Jepang, pilih cara bayar.
   - きょう の おすすめ & barang きかん げんてい (edisi terbatas) berganti tiap hari.
   - Mini-game アルバイト: jadi pegawai konbini, layani pesanan pelanggan.
   Harga ditampilkan dalam yen (1 poin 🌸 = 10 えん).
   ========================================================= */
(() => {
  /* ---------- barang baru ---------- */
  const NEW = [
    // おにぎり・おべんとう
    { id: 'tsunamayo', jp: 'ツナマヨ', ro: 'tsunamayo', name: 'onigiri tuna mayo', price: 15, shop: 'konbini', cat: 'onigiri', icon: ['onigiri', '#f6e0a0'], fact: 'Isi onigiri paling populer di konbini: tuna + mayones!' },
    { id: 'ume', jp: 'うめ', ro: 'ume', name: 'onigiri acar plum', price: 13, shop: 'konbini', cat: 'onigiri', icon: ['onigiri', '#c9384a'], fact: 'うめぼし = acar plum yang sangat asam. すっぱい！ (asam!)' },
    { id: 'sake', jp: 'さけ', ro: 'sake', name: 'onigiri salmon', price: 15, shop: 'konbini', cat: 'onigiri', icon: ['onigiri', '#f28c5c'], fact: 'さけ (salmon) di sini bukan minuman sake, lho!' },
    { id: 'konbu', jp: 'こんぶ', ro: 'konbu', name: 'onigiri rumput laut', price: 13, shop: 'konbini', cat: 'onigiri', icon: ['onigiri', '#3a4a2a'], fact: 'こんぶ = rumput laut kombu yang dimasak manis-asin.' },
    { id: 'bentou', jp: 'おべんとう', ro: 'obentou', name: 'bekal nasi', price: 50, shop: 'konbini', cat: 'onigiri', heat: true, icon: ['bento', '#e35f6b'], fact: 'Bekal konbini bisa dipanaskan di kasir. あたためますか？' },
    { id: 'pasta', jp: 'パスタ', ro: 'pasuta', name: 'pasta', price: 45, shop: 'konbini', cat: 'onigiri', heat: true, icon: ['bento', '#f29b38'], fact: 'Konbini Jepang menjual pasta, kari, bahkan ramen siap panas.' },
    // パン
    { id: 'karepan', jp: 'カレーパン', ro: 'karee pan', name: 'roti kari', price: 18, shop: 'konbini', cat: 'pan', icon: ['bread', '#c98a3a'], fact: 'Roti goreng berisi kari. Renyah di luar, pedas-gurih di dalam.' },
    { id: 'anpan', jp: 'あんパン', ro: 'anpan', name: 'roti kacang merah', price: 15, shop: 'konbini', cat: 'pan', icon: ['bun', '#b8742e'], fact: 'あん = pasta kacang merah manis. Ada pahlawan anime bernama アンパンマン!' },
    { id: 'sando', jp: 'サンドイッチ', ro: 'sandoicchi', name: 'sandwich', price: 25, shop: 'konbini', cat: 'pan', icon: ['sando', '#f6e0a0'], fact: 'Sandwich telur (たまごサンド) konbini terkenal sangat lembut.' },
    // おかし
    { id: 'chippusu', jp: 'ポテトチップス', ro: 'poteto chippusu', name: 'keripik kentang', price: 15, shop: 'konbini', cat: 'okashi', icon: ['bag', '#f2c14e'], fact: 'Rasa unik Jepang: のりしお (rumput laut & garam)!' },
    { id: 'choko', jp: 'チョコ', ro: 'choko', name: 'cokelat', price: 12, shop: 'konbini', cat: 'okashi', icon: ['box', '#6a3a2a'], fact: 'Hari Valentine di Jepang: perempuan memberi チョコ kepada laki-laki.' },
    { id: 'gumi', jp: 'グミ', ro: 'gumi', name: 'permen jeli', price: 10, shop: 'konbini', cat: 'okashi', icon: ['bag', '#f28fb0'], fact: 'グミ (gummy) rasa buah sangat populer di kalangan pelajar.' },
    { id: 'kyandi', jp: 'キャンディ', ro: 'kyandi', name: 'permen', price: 8, shop: 'konbini', cat: 'okashi', icon: ['candy', '#8fd3b0'], fact: 'あめ juga berarti permen (dan hujan! beda aksen).' },
    // デザート
    { id: 'shukurimu', jp: 'シュークリーム', ro: 'shuu kuriimu', name: 'kue sus', price: 15, shop: 'konbini', cat: 'dessert', icon: ['bun', '#f2d27a'], fact: 'Dari bahasa Prancis "chou à la crème". Isinya krim vanila.' },
    { id: 'daifuku', jp: 'だいふく', ro: 'daifuku', name: 'daifuku', price: 15, shop: 'konbini', cat: 'dessert', icon: ['mochi', '#f7b6c8'], fact: 'Mochi bulat berisi kacang merah. Ada juga versi stroberi: いちごだいふく!' },
    { id: 'kakigori', jp: 'かきごおり', ro: 'kakigoori', name: 'es serut', price: 18, shop: 'konbini', cat: 'dessert', icon: ['cup', '#e35f6b'], fact: 'Es serut dengan sirup. Wajib saat musim panas (なつ).' },
    // のみもの (lemari dingin konbini)
    { id: 'mizu', jp: 'みず', ro: 'mizu', name: 'air mineral', price: 10, shop: 'konbini', cat: 'nomimono', temp: 'cold', icon: ['bottle', '#cfe8ff'], fact: 'みず = air. Air keran di Jepang aman diminum.' },
    { id: 'orenji', jp: 'オレンジジュース', ro: 'orenji juusu', name: 'jus jeruk', price: 14, shop: 'konbini', cat: 'nomimono', temp: 'cold', icon: ['carton', '#f29b38'], fact: 'オレンジ = jeruk (orange). Kata serapan → katakana.' },
    { id: 'kora', jp: 'コーラ', ro: 'koora', name: 'cola', price: 15, shop: 'konbini', cat: 'nomimono', temp: 'cold', icon: ['bottle', '#6a2a1a'], fact: 'Tanda panjang ー membuat bunyi "o" dibaca dua ketukan: ko-o-ra.' },
    { id: 'karupisu', jp: 'カルピス', ro: 'karupisu', name: 'minuman susu asam', price: 15, shop: 'konbini', cat: 'nomimono', temp: 'cold', icon: ['bottle', '#fbf7ef'], fact: 'Minuman susu fermentasi yang manis-asam, khas Jepang sejak 1919.' },
    { id: 'mugicha', jp: 'むぎちゃ', ro: 'mugicha', name: 'teh jelai', price: 12, shop: 'konbini', cat: 'nomimono', temp: 'cold', icon: ['bottle', '#b8742e'], fact: 'Teh jelai tanpa kafein, diminum dingin di musim panas.' },
    { id: 'ichigomiruku', jp: 'いちごミルク', ro: 'ichigo miruku', name: 'susu stroberi', price: 13, shop: 'konbini', cat: 'nomimono', temp: 'cold', icon: ['carton', '#f7b6c8'], fact: 'いちご = stroberi. ミルク = susu.' },
    // jajanan panas di samping kasir (レジよこ)
    { id: 'karaage', jp: 'からあげ', ro: 'karaage', name: 'ayam goreng', price: 22, shop: 'hot', cat: 'hot', icon: ['karaage', '#c98a3a'], fact: 'Ayam goreng ala Jepang. Paling dicari saat pulang sekolah!' },
    { id: 'nikuman', jp: 'にくまん', ro: 'nikuman', name: 'bakpao daging', price: 15, shop: 'hot', cat: 'hot', icon: ['bun', '#fbf7ef'], fact: 'にく = daging, まん = bakpao. Hangat di musim dingin.' },
    { id: 'oden', jp: 'おでん', ro: 'oden', name: 'oden', price: 20, shop: 'hot', cat: 'hot', icon: ['oden', '#e9c46a'], fact: 'Telur, lobak (だいこん), dan tahu direbus dalam kaldu. Pilih sendiri dari panci!' },
    { id: 'korokke', jp: 'コロッケ', ro: 'korokke', name: 'kroket', price: 12, shop: 'hot', cat: 'hot', icon: ['bread', '#d9a45a'], fact: 'Kroket kentang renyah. Dari kata Prancis "croquette".' },
    // mesin minuman (jidouhanbaiki)
    { id: 'kankohi', jp: 'かんコーヒー', ro: 'kan koohii', name: 'kopi kaleng', price: 12, shop: 'vending', temp: 'hot', icon: ['can', '#6a4228'], fact: 'かん = kaleng. Kopi kaleng hangat sangat populer di pagi hari.' },
    { id: 'konsupu', jp: 'コーンスープ', ro: 'koon suupu', name: 'sup jagung kaleng', price: 13, shop: 'vending', temp: 'hot', icon: ['can', '#f6d44a'], fact: 'Sup jagung dalam kaleng dari mesin minuman! Goyangkan dulu supaya jagungnya ikut keluar.' },
    { id: 'supotsu', jp: 'スポーツドリンク', ro: 'supootsu dorinku', name: 'minuman isotonik', price: 13, shop: 'vending', temp: 'cold', icon: ['bottle', '#6fb8e6'], fact: 'Diminum setelah olahraga atau saat cuaca panas.' },
  ];
  NEW.forEach(s => { SNACKS.push(s); SNACK_BY[s.id] = s; });
  // kategori barang lama
  Object.assign(SNACK_BY.onigiri, { cat: 'onigiri' }); Object.assign(SNACK_BY.meronpan, { cat: 'pan' });
  Object.assign(SNACK_BY.purin, { cat: 'dessert' }); Object.assign(SNACK_BY.aisu, { cat: 'dessert' });
  Object.assign(SNACK_BY.ocha, { temp: 'cold' }); Object.assign(SNACK_BY.miruku, { temp: 'cold' }); Object.assign(SNACK_BY.ramune, { temp: 'cold' }); Object.assign(SNACK_BY.kokoa, { temp: 'hot' });
  Object.assign(FAVORITE, { mai: 'kyandi', emma: 'karupisu', ryo: 'kora', omawari: 'anpan' });

  /* ---------- ikon pixel untuk barang baru ---------- */
  const K = '#2a1f2d';
  const P = (c, col, x, y, w = 1, h = 1) => { c.fillStyle = col; c.fillRect(x, y, w, h); };
  const shade = (hex, t) => Pix.shade(hex, t);
  const ICON = {
    onigiri: (c, a) => { P(c, K, 4, 3, 8, 1); P(c, K, 3, 4, 10, 9); P(c, '#fff', 5, 4, 6, 1); P(c, '#fff', 4, 5, 8, 7); P(c, '#1f3a2a', 5, 9, 6, 4); P(c, a, 7, 6, 2, 2); },
    bento: (c, a) => { P(c, K, 1, 4, 14, 10); P(c, '#fff', 2, 5, 6, 8); P(c, a, 9, 5, 5, 4); P(c, '#8fcf6f', 9, 10, 5, 3); P(c, '#e35f6b', 4, 7, 2, 2); },
    bread: (c, a) => { P(c, K, 2, 5, 12, 8); P(c, a, 3, 6, 10, 6); P(c, shade(a, -.25), 3, 10, 10, 2); P(c, '#fff8', 5, 7, 4, 1); },
    bun: (c, a) => { P(c, K, 3, 4, 10, 9); P(c, a, 4, 5, 8, 7); P(c, shade(a, -.2), 4, 11, 8, 1); P(c, '#fff9', 6, 6, 3, 1); },
    sando: (c, a) => { P(c, K, 2, 3, 12, 11); P(c, '#fbf7ef', 3, 4, 10, 3); P(c, a, 3, 7, 10, 2); P(c, '#8fcf6f', 3, 9, 10, 1); P(c, '#fbf7ef', 3, 10, 10, 3); },
    bag: (c, a) => { P(c, K, 3, 1, 10, 14); P(c, a, 4, 2, 8, 12); P(c, '#fff', 5, 5, 6, 3); P(c, shade(a, -.3), 4, 2, 8, 1); P(c, shade(a, -.3), 4, 13, 8, 1); },
    box: (c, a) => { P(c, K, 2, 4, 12, 9); P(c, a, 3, 5, 10, 7); P(c, shade(a, .3), 3, 5, 10, 1); P(c, '#f6d44a', 5, 7, 6, 3); },
    candy: (c, a) => { P(c, K, 4, 5, 8, 6); P(c, a, 5, 6, 6, 4); P(c, K, 1, 6, 3, 4); P(c, K, 12, 6, 3, 4); P(c, shade(a, .3), 2, 7, 1, 2); P(c, shade(a, .3), 13, 7, 1, 2); },
    mochi: (c, a) => { P(c, K, 3, 5, 10, 8); P(c, a, 4, 6, 8, 6); P(c, '#fff9', 5, 7, 2, 1); P(c, shade(a, -.15), 4, 11, 8, 1); },
    cup: (c, a) => { P(c, K, 3, 7, 10, 8); P(c, '#fbf7ef', 4, 8, 8, 6); P(c, K, 3, 3, 10, 5); P(c, a, 4, 4, 8, 3); P(c, '#fff', 6, 4, 3, 1); },
    bottle: (c, a) => { P(c, K, 6, 1, 4, 3); P(c, '#f4f1ea', 7, 1, 2, 2); P(c, K, 4, 3, 8, 12); P(c, a, 5, 4, 6, 10); P(c, '#fff', 5, 7, 6, 3); P(c, '#fff9', 5, 4, 1, 3); },
    carton: (c, a) => { P(c, K, 4, 1, 8, 14); P(c, '#fff', 5, 2, 6, 12); P(c, a, 5, 7, 6, 5); P(c, K, 6, 0, 4, 1); },
    can: (c, a) => { P(c, K, 4, 2, 8, 12); P(c, a, 5, 3, 6, 10); P(c, '#c9ccd3', 5, 3, 6, 1); P(c, '#fff', 5, 6, 6, 2); P(c, '#c9ccd3', 5, 12, 6, 1); },
    karaage: (c, a) => { P(c, K, 3, 4, 10, 11); P(c, '#e35f6b', 4, 5, 8, 9); P(c, '#fff', 4, 8, 8, 2); [[4, 2], [7, 1], [10, 2]].forEach(([x, y]) => { P(c, K, x - 1, y, 4, 4); P(c, a, x, y + 1, 2, 2); }); },
    oden: (c, a) => { P(c, K, 2, 7, 12, 7); P(c, '#fbf7ef', 3, 8, 10, 5); P(c, '#8a5a36', 7, 1, 2, 8); P(c, K, 5, 2, 6, 3); P(c, a, 6, 3, 4, 1); P(c, '#fff', 5, 5, 6, 2); P(c, '#f6d44a', 7, 5, 2, 2); },
  };
  const cache = {};
  const img0 = SnackArt.img;
  SnackArt.img = (id, size = 40) => {
    const s = SNACK_BY[id];
    if (!s || !s.icon) return img0(id, size);
    if (!cache[id]) { const cv = document.createElement('canvas'); cv.width = cv.height = 16; ICON[s.icon[0]](cv.getContext('2d'), s.icon[1]); cache[id] = cv.toDataURL(); }
    return `<img class="snack-ic" src="${cache[id]}" width="${size}" height="${size}" alt="">`;
  };

  /* ---------- toko konbini dengan kategori & keranjang ---------- */
  const S = () => Save.d;
  const H = () => Game.h;
  const say = l => UI.say(l);
  const pick = a => a[Math.random() * a.length | 0];
  const shuffle = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [b[i], b[j]] = [b[j], b[i]]; } return b; };
  const romaji = () => Save.d.settings.romaji !== false;
  const yen = p => p * 10;
  const num = n => (window.Places2 ? Places2.num(n) : String(n));
  const CATS = {
    onigiri: { jp: 'おにぎり・おべんとう', id: 'Nasi kepal & bekal' },
    pan: { jp: 'パン', id: 'Roti' },
    okashi: { jp: 'おかし', id: 'Camilan' },
    dessert: { jp: 'デザート・アイス', id: 'Makanan penutup & es krim' },
    nomimono: { jp: 'のみもの', id: 'Minuman dingin' },
    hot: { jp: 'レジよこ', id: 'Jajanan panas di samping kasir' },
  };
  const kago = () => S().kago || (S().kago = []);
  const inCat = cat => SNACKS.filter(s => (s.cat === cat) && (s.shop === 'konbini' || s.shop === 'hot'));
  // Rekomendasi & edisi terbatas berganti tiap hari
  const todaysPick = () => { const all = SNACKS.filter(s => s.shop === 'konbini'); return all[S().day * 7 % all.length]; };
  const limited = () => { const L = ['kakigori', 'oden', 'daifuku', 'nikuman', 'ichigomiruku']; return SNACK_BY[L[S().day % L.length]]; };
  const tempTag = s => s.temp ? `<i class="temp ${s.temp}">${s.temp === 'hot' ? 'あたたかい' : 'つめたい'}</i>` : '';

  function browse(cat) {
    const items = inCat(cat), rec = todaysPick(), lim = limited();
    const known = new Set(S().kana);
    const p = UI.panel(`<div class="win shopwin">
      <div class="w-title">${CATS[cat].jp} <span class="pts-badge">🌸 <b class="pts-n">${S().points || 0}</b></span></div>
      <p class="muted small">${CATS[cat].id}. Masukkan ke かご (keranjang), lalu bayar di kasir (レジ). 1🌸 = 10えん.</p>
      <div class="snack-grid">${items.map(s => {
        const readable = [...s.jp].every(c => knownChar(c, known) || !KANA[c]);
        const badge = s === rec ? '<i class="badge-rec">おすすめ</i>' : s === lim ? '<i class="badge-lim">きかんげんてい</i>' : '';
        return `<div class="snack" data-id="${s.id}">${badge}${SnackArt.img(s.id, 48)}<b class="jp">${s.jp}</b><small>${readable || romaji() ? s.ro : '???'}</small>${tempTag(s)}
          <div class="snack-row"><button class="say" data-say="${s.jp}" type="button">♪</button><button class="buy" type="button">${yen(s.price)}えん</button></div>
          <em class="own"></em></div>`;
      }).join('')}</div>
      <p class="kago-line">🧺 かご: <b class="kago-n">${kago().length}</b> barang</p>
      <button class="btn block" data-a="close" type="button">Selesai</button></div>`, 'scroll');
    return UI.wait(done => {
      p.querySelectorAll('[data-say]').forEach(b => b.onclick = () => Sound.speak(b.dataset.say));
      p.querySelectorAll('.buy').forEach(b => b.onclick = () => {
        const card = b.closest('.snack'), s = SNACK_BY[card.dataset.id];
        kago().push(s.id); Save.write();
        Sound.blip(); Sound.speak(s.jp);
        const n = kago().filter(x => x === s.id).length;
        card.querySelector('.own').textContent = '×' + n;
        p.querySelector('.kago-n').textContent = kago().length;
        card.classList.add('bought'); setTimeout(() => card.classList.remove('bought'), 350);
      });
      p.querySelector('[data-a=close]').onclick = () => { Sound.blip(); UI.closePanel(); done(); if (kago().length) UI.toast(`🧺 ${kago().length} barang di keranjang. Bayar di kasir (レジ)!`); };
    });
  }

  /* ---------- kasir: percakapan sesuai isi keranjang ---------- */
  async function checkout() {
    const items = kago().map(id => SNACK_BY[id]).filter(Boolean);
    const total = items.reduce((a, s) => a + s.price, 0);
    await say({ w: 'tenin', e: 'happy', jp: 'いらっしゃいませ。', ro: 'irasshaimase.', id: 'Selamat datang.' });
    await say({ n: 'ピッ、ピッ… Kasir memindai: ' + items.map(s => s.jp).join('、') });
    const q = async (jp, ro, idn, yes, no, yesSay, noSay) => {
      await say({ w: 'tenin', jp, ro, id: idn });
      const i = await UI.choose('Jawab:', [{ jp: yes, ro: '' }, { jp: no, ro: '' }]);
      await say({ w: 'tenin', e: 'happy', ...(i === 0 ? yesSay : noSay) });
      return i === 0;
    };
    if (items.some(s => s.heat)) {
      await q('おべんとう は あたためますか？', 'obentou wa atatamemasu ka?', 'Bekalnya mau dipanaskan?', 'はい、おねがいします。', 'いいえ、けっこう です。',
        { jp: 'しょうしょう おまち ください。', ro: 'shoushou omachi kudasai.', id: 'Mohon tunggu sebentar. (ピッ… チン！)' }, { jp: 'かしこまりました。', ro: 'kashikomarimashita.', id: 'Baik.' });
    }
    const hot = items.some(s => s.heat || s.cat === 'hot'), cold = items.some(s => s.temp === 'cold' || s.cat === 'dessert');
    if (hot && cold) {
      await q('ふくろ は わけますか？', 'fukuro wa wakemasu ka?', 'Kantongnya mau dipisah? (panas & dingin)', 'はい、わけて ください。', 'いっしょ で いい です。',
        { jp: 'はい、わけます ね。', ro: 'hai, wakemasu ne.', id: 'Baik, saya pisahkan.' }, { jp: 'かしこまりました。', ro: 'kashikomarimashita.', id: 'Baik.' });
    } else {
      await q('ふくろ は いりますか？', 'fukuro wa irimasu ka?', 'Perlu kantong plastik?', 'はい、おねがいします。', 'いいえ、だいじょうぶ です。',
        { jp: 'ふくろ は さんえん です。', ro: 'fukuro wa san-en desu.', id: 'Kantong plastik 3 yen, ya.' }, { jp: 'ありがとうございます。', ro: 'arigatou gozaimasu.', id: 'Terima kasih (ramah lingkungan!).' });
    }
    if (items.some(s => s.heat || s.cat === 'hot' || s.cat === 'dessert')) {
      const spoon = items.some(s => s.cat === 'dessert');
      await q(spoon ? 'スプーン は おつけしますか？' : 'おはし は おつけしますか？', spoon ? 'supuun wa otsuke shimasu ka?' : 'ohashi wa otsuke shimasu ka?', spoon ? 'Perlu sendok?' : 'Perlu sumpit?',
        'はい、おねがいします。', 'いいえ、いりません。', { jp: 'はい、どうぞ。', ro: 'hai, douzo.', id: 'Ini, silakan.' }, { jp: 'かしこまりました。', ro: 'kashikomarimashita.', id: 'Baik.' });
    }
    await q('ポイントカード は おもち ですか？', 'pointo kaado wa omochi desu ka?', 'Punya kartu poin?', 'はい、あります。', 'いいえ、ありません。',
      { jp: 'ポイント を おつけ しました。', ro: 'pointo wo otsuke shimashita.', id: 'Poinnya sudah ditambahkan. (+2🌸)' }, { jp: 'かしこまりました。', ro: 'kashikomarimashita.', id: 'Baik.' });
    // total harga
    await say({ w: 'tenin', jp: `ぜんぶ で ${num(yen(total))} えん です。`, ro: `zenbu de … en desu.`, id: 'Semuanya jadi… (dengarkan angkanya!)' });
    const wrong = shuffle([yen(total) + 100, Math.max(10, yen(total) - 100), yen(total) * 2].filter((x, i, a) => x !== yen(total) && a.indexOf(x) === i)).slice(0, 2);
    await H().runLines([{ q: `「${num(yen(total))} えん」 = ?`, o: [{ jp: `${yen(total)} yen`, ro: '', ok: true }, ...wrong.map(w => ({ jp: `${w} yen`, ro: '', why: `${num(yen(total))} = ${yen(total)}. (${num(w)} = ${w})` }))] }], ['tenin']);
    if ((S().points || 0) < total) {
      await say({ w: 'tenin', e: 'sad', jp: 'すみません、たりません…', ro: 'sumimasen, tarimasen…', id: 'Maaf, uangnya kurang…' });
      await say({ n: `Poinmu 🌸${S().points || 0}, butuh 🌸${total}. Keranjang dikosongkan. Main mini-game untuk dapat poin!` });
      S().kago = []; Save.write(); return;
    }
    const pay = await UI.choose('Bayar dengan…', [{ jp: 'げんきん', ro: romaji() ? 'genkin (tunai)' : '' }, { jp: 'カード', ro: romaji() ? 'kaado (kartu)' : '' }, { jp: 'スマホ', ro: romaji() ? 'sumaho (ponsel)' : '' }]);
    await say(pay === 0 ? { w: 'tenin', jp: `${num(yen(total) >= 1000 ? 1000 * Math.ceil(yen(total) / 1000) : 1000)} えん おあずかり します。`, ro: '', id: 'Uangnya saya terima. (bahasa kasir yang sopan)' }
      : { w: 'tenin', jp: 'タッチ して ください。', ro: 'tacchi shite kudasai.', id: 'Silakan tempelkan (kartu/ponsel).' });
    await q('レシート は いりますか？', 'reshiito wa irimasu ka?', 'Perlu struk?', 'はい。', 'いいえ、いりません。', { jp: 'はい、レシート です。', ro: 'hai, reshiito desu.', id: 'Ini struknya.' }, { jp: 'かしこまりました。', ro: 'kashikomarimashita.', id: 'Baik.' });
    S().points -= total; S().points += 2;
    items.forEach(s => { S().bag[s.id] = (S().bag[s.id] || 0) + 1; });
    S().kago = []; S().konbiniBuys = (S().konbiniBuys || 0) + items.length; Save.write();
    Sound.star();
    await say({ w: 'tenin', e: 'happy', jp: 'ありがとうございました！また おこし ください！', ro: 'arigatou gozaimashita! mata okoshi kudasai!', id: 'Terima kasih! Silakan datang lagi!' });
    UI.toast(`🛍 ${items.length} barang masuk ke Tas.`);
    H().addStamp('konbini', 'Belanja di konbini');
    if (S().konbiniBuys >= 20) H().addStamp('konbini20', 'Langganan konbini (20 barang)');
  }

  /* ---------- mini-game アルバイト: jadi pegawai konbini ---------- */
  async function arubaito() {
    await say({ w: 'tenin', e: 'happy', jp: 'きょう は アルバイト、よろしく ね！', ro: 'kyou wa arubaito, yoroshiku ne!', id: 'Hari ini kamu kerja paruh waktu, mohon bantuannya!' });
    await say({ w: 'tenin', t: 'Pelanggan akan meminta barang dalam bahasa Jepang. Ketuk barang atau layanan yang tepat secepatnya!' });
    const pool = SNACKS.filter(s => s.shop === 'konbini' || s.shop === 'hot');
    const SERV = [
      { key: 'atatame', jp: 'レンジ', label: 'Panaskan', req: 'あたためて ください。', ro: 'atatamete kudasai.' },
      { key: 'fukuro', jp: 'ふくろ', label: 'Kantong', req: 'ふくろ を ください。', ro: 'fukuro wo kudasai.' },
      { key: 'hashi', jp: 'おはし', label: 'Sumpit', req: 'おはし を ください。', ro: 'ohashi wo kudasai.' },
      { key: 'reshito', jp: 'レシート', label: 'Struk', req: 'レシート を ください。', ro: 'reshiito wo kudasai.' },
    ];
    const goal = 8, relax = !!Save.d.settings.relax;
    const p = UI.panel(`<div class="win mg arb">
      <div class="w-title">アルバイト · Kerja di konbini</div>
      <div class="arb-cust"><canvas width="48" height="48"></canvas><div class="arb-say">…</div></div>
      <div class="arb-timer"><i></i></div>
      <div class="arb-grid"></div>
      <p class="muted small arb-info">Layani ${goal} pelanggan.</p></div>`, 'gamep');
    const face = p.querySelector('canvas'), bubble = p.querySelector('.arb-say'), grid = p.querySelector('.arb-grid'), info = p.querySelector('.arb-info'), bar = p.querySelector('.arb-timer i');
    const res = await UI.wait(done => {
      let n = 0, ok = 0, timer = 0, t0 = 0, raf = 0, answer = null;
      const custs = ['kid', 'ojii', 'mai', 'emma', 'kenta', 'yuki', 'obaa', 'ryo', 'imoya', 'hana'];
      const nextCust = () => {
        if (n >= goal) { cancelAnimationFrame(raf); done(ok); return; }
        n++;
        Pix.drawPortrait(face, pick(custs), 'happy');
        const service = Math.random() < .3;
        let opts;
        if (service) { answer = pick(SERV); opts = shuffle([answer, ...shuffle(SERV.filter(s => s !== answer)).slice(0, 2), ...shuffle(pool).slice(0, 3)]); bubble.innerHTML = `「<b class="jp">${answer.req}</b>」${romaji() ? `<small>${answer.ro}</small>` : ''}`; Sound.speak(answer.req); }
        else { answer = pick(pool); opts = shuffle([answer, ...shuffle(pool.filter(s => s !== answer && s.jp !== answer.jp)).slice(0, 5)]); bubble.innerHTML = `「<b class="jp">${answer.jp} を ください。</b>」${romaji() ? `<small>${answer.ro} wo kudasai.</small>` : ''}`; Sound.speak(answer.jp + ' を ください'); }
        grid.innerHTML = opts.map((o, i) => o.key
          ? `<button class="arb-o serv" data-i="${i}" type="button"><span class="jp">${o.jp}</span><small>${o.label}</small></button>`
          : `<button class="arb-o" data-i="${i}" type="button">${SnackArt.img(o.id, 32)}<span class="jp">${o.jp}</span></button>`).join('');
        grid.querySelectorAll('.arb-o').forEach(b => b.onclick = () => {
          const o = opts[+b.dataset.i];
          if (o === answer) { ok++; Sound.ok(); info.textContent = `ありがとうございました！ (${ok}/${goal})`; nextCust(); }
          else { Sound.bad(); b.classList.add('bad'); info.textContent = `Bukan itu. Pelanggan minta: ${answer.jp}`; }
        });
        t0 = performance.now();
      };
      const limit = relax ? 1e9 : 9000;
      const loop = t => {
        if (!p.isConnected) return;
        const left = Math.max(0, 1 - (t - t0) / limit); bar.style.width = (left * 100) + '%';
        if (left <= 0) { Sound.bad(); info.textContent = 'Pelanggan pergi… Lebih cepat, ya!'; nextCust(); }
        raf = requestAnimationFrame(loop);
      };
      nextCust(); raf = requestAnimationFrame(loop); void timer;
    });
    UI.closePanel();
    Sound.star();
    await say({ w: 'tenin', e: 'happy', jp: 'おつかれさま でした！', ro: 'otsukaresama deshita!', id: `Kerja bagus! Kamu melayani ${res}/${goal} pelanggan dengan benar.` });
    H().addPoints(res * 4, 'gaji arubaito');
    if (res >= 6) H().addStamp('arubaito', 'Pegawai konbini teladan');
  }

  /* ---------- kasir & jajanan panas ---------- */
  async function register() {
    await say({ w: 'tenin', e: 'happy', jp: 'いらっしゃいませ！', ro: 'irasshaimase!', id: 'Selamat datang!' });
    if (H().q('list').state === 'active') {
      UI.hideDialog();
      await Games.shop({ count: 3 });
      H().setQ('list', { state: 'done' }); H().addPoints(QUESTS.list.reward, 'misi'); H().addStamp('list', QUESTS.list.title);
      return;
    }
    const lim = limited(), rec = todaysPick();
    await say({ w: 'tenin', jp: `きょう の おすすめ は ${rec.jp} です。`, ro: `kyou no osusume wa ${rec.ro} desu.`, id: `Rekomendasi hari ini: ${rec.name}. Edisi terbatas (きかんげんてい): ${lim.jp}!` });
    const opts = [kago().length ? `Bayar keranjang (${kago().length} barang) 🧺` : 'Keranjang kosong', 'Jajanan panas di samping kasir 🍗', 'Kerja paruh waktu (アルバイト) 💼', 'Latihan belanja (daftar katakana)', 'Tidak jadi'];
    const a = await H().menuChoice('Di kasir (レジ):', opts);
    UI.hideDialog();
    if (a === 0) { if (kago().length) await checkout(); else await say({ n: 'Ambil barang dari rak atau lemari minuman dulu, lalu bawa ke kasir.' }); }
    if (a === 1) { await browse('hot'); if (kago().length) await checkout(); }
    if (a === 2) await arubaito();
    if (a === 3) await Games.shop({ count: 3, title: 'Latihan Belanja' });
  }

  // Rak di peta konbini: baris 1 kanan = okashi, rak kiri = onigiri, rak tengah atas = pan, rak tengah bawah = dessert
  function shelfCat(t) {
    if (t.y === 1) return 'okashi';
    if ((t.x || 0) <= 3) return 'onigiri';
    return t.y === 3 ? 'pan' : 'dessert';
  }

  /* ---------- sambungkan ke Places ---------- */
  const P0 = Object.assign({}, Places);
  Places.claims = t => (World.map === 'konbini' && (t.type === 'goods' || t.type === 'cooler')) || (P0.claims ? P0.claims(t) : false);
  Places.interact = t => {
    if (World.map === 'konbini' && t.type === 'goods') { const c = shelfCat(t); return say({ jp: CATS[c].jp, ro: '', id: `Rak ${CATS[c].id}.` }).then(() => { UI.hideDialog(); return browse(c); }); }
    if (World.map === 'konbini' && t.type === 'cooler') return say({ jp: 'のみもの', ro: 'nomimono', id: 'Lemari minuman dingin (つめたい).' }).then(() => { UI.hideDialog(); return browse('nomimono'); });
    return P0.interact(t);
  };
  Places.talk = npc => (World.map === 'konbini' && npc.id === 'tenin' ? register() : P0.talk(npc));
  window.Konbini = { browse, checkout, arubaito, register };
})();
