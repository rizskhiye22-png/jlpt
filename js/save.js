/* =========================================================
   SIMPAN PROGRES di browser (localStorage). Tanpa server.
   ========================================================= */
const Save = (() => {
  const KEY = 'nihongo-gakkou-v1';
  const fresh = () => ({
    name: '',
    day: 1,              // hari yang sedang berjalan (DAYS.length + 1 = tamat)
    step: 'morning',     // morning → lesson → break → sleep
    days: {},            // hasil per hari: { stars, grade, correct, total }
    kana: [],            // huruf yang sudah dipelajari
    st: {},              // statistik per huruf: { c: benar, w: salah }
    friends: { yuki: 0, kenta: 0 },
    phrases: [],         // indeks hari yang kalimatnya sudah dipelajari
    settings: { romaji: true, voice: true, sfx: true, rate: 0.85 },
  });

  let d = fresh();
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const loaded = JSON.parse(raw);
      d = Object.assign(fresh(), loaded);
      d.settings = Object.assign(fresh().settings, loaded.settings || {});
      d.friends = Object.assign(fresh().friends, loaded.friends || {});
    }
  } catch (e) { /* mode privat / penyimpanan diblokir: tetap bisa main */ }

  return {
    get d() { return d; },
    write() { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {} },
    reset() { d = fresh(); try { localStorage.removeItem(KEY); } catch (e) {} },
    hasGame() { return !!d.name; },
  };
})();
