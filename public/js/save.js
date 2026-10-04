/* =========================================================
   SIMPAN PROGRES di browser (localStorage). Tanpa server.
   ========================================================= */
const Save = (() => {
  const KEY = 'nihongo-gakkou-v2';
  const fresh = () => ({
    name: '',
    day: 1,              // hari yang sedang berjalan (DAYS.length + 1 = tamat)
    step: 'wake',        // wake → commute → class1 → class2 → after → evening → night
    days: {},            // hasil per hari
    kana: [],            // huruf yang sudah dipelajari
    st: {},              // statistik per huruf: { c: benar, w: salah }
    friends: { yuki: 0, kenta: 0, hana: 0 },
    phrases: [],         // hari yang kalimatnya sudah dipelajari
    points: 0,           // poin sakura (untuk lemari)
    look: { hair: 'short', hairColor: '#3f3a4f', skin: '#f8d9c0', uniform: 'blazer', uniformColor: '#3e4a7a', accessory: 'none', accColor: '#e0475f' },
    owned: [],           // barang lemari yang sudah dibeli
    quests: {},          // status misi sampingan
    seen: [],            // event persahabatan yang sudah dilihat
    stamps: [],          // stempel koleksi
    lunch: { yuki: 0, kenta: 0, hana: 0 },
    omikuji: 0,          // hari terakhir menarik omikuji
    bag: {}, tried: [], ach: [], stats: {}, streak: { last: '', count: 0 }, srs: {},   // fitur tambahan
    fish: {}, pets: [], petActive: null, books: [], daily: {}, kerja: {},
    settings: { romaji: 'auto', romajiV: 1, voice: true, sfx: true, rate: 0.85, music: 0.5, relax: false, quality: 'normal', fx: true, text: 'fast', force2d: false, narr: true, yt: true, chat: true, server: '', online: false },
  });

  let d = fresh();
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const loaded = JSON.parse(raw), f = fresh();
      d = Object.assign(f, loaded);
      ['settings', 'friends', 'look', 'lunch'].forEach(k => { d[k] = Object.assign(fresh()[k], loaded[k] || {}); });
      // v3.6: romaji otomatis (sekali saja; pemain tetap bisa memilih "Selalu" di Pengaturan)
      if (!(loaded.settings || {}).romajiV) { if (d.settings.romaji === true) d.settings.romaji = 'auto'; d.settings.romajiV = 1; }
    }
  } catch (e) { /* mode privat / penyimpanan diblokir: tetap bisa main */ }

  return {
    get d() { return d; },
    write() { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {} },
    reset() { d = fresh(); try { localStorage.removeItem(KEY); } catch (e) {} },
    hasGame() { return !!d.name; },
  };
})();
