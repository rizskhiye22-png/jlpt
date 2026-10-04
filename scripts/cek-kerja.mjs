// Validasi isi simulasi kerja: 6 bidang × 15 hari + shift latihan.
// Jalankan: node scripts/cek-kerja.mjs
import fs from 'node:fs';
import vm from 'node:vm';

const noop = () => {};
const ctx = {
  console, setTimeout, clearTimeout, setInterval, clearInterval, performance: { now: () => 0 },
  CHARACTERS: { sensei: {}, yuki: {}, kenta: {}, obaa: {}, hana: {}, tenin: {}, kid: {}, ojii: {}, mai: {}, emma: {}, ryo: {}, imoya: {} },
  Pix: { PAL: {}, STYLE: {}, sprite: noop, registerLook: noop, drawPortrait: noop },
  Save: { d: { settings: {}, kerja: {} }, write: noop },
  MAPS: {}, Maps: { SHOPS: {} },
  Places: { npcs: () => [], talks: () => false, talk: noop, song: () => '', interact: noop },
  UI: {}, Sound: {}, Music: {}, World: {}, Game: { h: {} },
  document: { createElement: () => ({ getContext: () => ({}) }) },
};
vm.createContext(ctx);
for (const f of ['kerja.js', 'kerja-tani.js', 'kerja-aksi.js', 'kerja-hari.js']) vm.runInContext(fs.readFileSync(`public/js/${f}`, 'utf8') + (f === 'kerja.js' ? '\nglobalThis.Kerja = Kerja;' : ''), ctx, { filename: f });
const K = ctx.Kerja;
const errs = [];
let days = 0, steps = 0, vocab = 0;
const check = (job, room, list, where) => {
  list.forEach((st, i) => {
    steps++;
    const tag = `${job.id} ${where} #${i} (${st.t})`;
    if (st.at && !room.st[st.at]) errs.push(`${tag}: pos "${st.at}" tidak ada`);
    if (!['say', 'clock'].includes(st.t) && !K.TASKS[st.t]) errs.push(`${tag}: jenis tugas tidak dikenal`);
    if (st.w && !ctx.CHARACTERS[st.w]) errs.push(`${tag}: tokoh "${st.w}" tidak ada`);
    if (st.t === 'quiz' && (!st.opts || st.opts.length < 2 || !st.q)) errs.push(`${tag}: kuis tidak lengkap`);
    if (st.t === 'act') st.steps.forEach((a, j) => { if (!a.tool || !a.jp || !/^(tap|hold|swipe|taps:\d+)$/.test(a.how || 'tap')) errs.push(`${tag}: langkah aksi ${j} tidak valid`); });
    if (st.t === 'hunt' && !st.items.some(x => !x.ok)) errs.push(`${tag}: tidak ada bahaya`);
    if (st.t === 'talk') st.turns.forEach((t, j) => { if (!t.jp || !t.opts || t.opts.length < 2 || !t.opts.some(o => o.d > 0)) errs.push(`${tag}: giliran bicara ${j} tidak valid`); });
    if (st.t === 'bins') st.items.forEach(([e, jp, id, k]) => { if (!st.bins.some(b => b[0] === k)) errs.push(`${tag}: "${jp}" tidak punya tempat "${k}"`); });
    (st.cast || []).forEach(c => { if (c.id && !ctx.CHARACTERS[c.id]) errs.push(`${tag}: pemeran "${c.id}" tidak ada`); });
  });
};
for (const job of K.JOBS) {
  const room = K.ROOMS[job.id];
  check(job, room, job.steps, 'latihan');
  const list = K.DAYS[job.id] || [];
  if (list.length !== 15) errs.push(`${job.id}: ${list.length} hari (harus 15)`);
  list.forEach((d, n) => {
    days++; vocab += (d.vocab || []).length;
    try { check(job, d.room || room, K._build(job, d, n + 1), `hari ${n + 1}`); }
    catch (e) { errs.push(`${job.id} hari ${n + 1}: ${e.message}`); }
    if (!d.learn) errs.push(`${job.id} hari ${n + 1}: tanpa ringkasan pelajaran`);
    if (n < 14 && !d.next) errs.push(`${job.id} hari ${n + 1}: tanpa petunjuk "Besok"`);
  });
}
console.log(`${K.JOBS.length} bidang · ${days} hari · ${steps} langkah · ${vocab} kosakata harian`);
if (errs.length) { console.log('❌ MASALAH:\n' + errs.join('\n')); process.exit(1); }
console.log('✅ Semua isi valid');
