/* =========================================================
   MESIN CERITA v3
   - Flag cerita di Save.d.story.flags (nilai = hari flag diset)
   - Pemicu adegan per slot (class/morning/dinner/night/talk/event)
   - Migrasi save v2 → v3 (pemain lama tidak kehilangan progres)
   - Prolog, mini-game papan lantai, benda kenangan, halaman buku
   Dipakai oleh public/js/game.js lewat window.Story.
   ========================================================= */
import type { Scene, Line, Act } from './types';
import { SCENES as SCENES12, PROLOGUE, DIARY } from './scenes';
import { SCENES3 } from './scenes3';
import { kasir } from './kasir';

const SCENES = [...SCENES12, ...SCENES3];
import { LETTERS } from './letters';
import { ITEM_BY, PAGES } from './book';

export interface StoryState {
  v: number;
  flags: Record<string, number>;
  seen: string[];
  items: string[];
  pages: number[];
  opened: string[];     // surat yang sudah pernah dibuka
  goal?: string;
  migrated?: boolean;
  town?: number;        // Meter Kota 0–100
  baito?: Record<string, number>; // kerja paruh waktu: jumlah shift
  baitoDay?: number;
}

const S = () => Save.d;
const st = (): StoryState => S().story;
const today = () => S().day || 1;
const H = () => Game.h;

function blank(): StoryState { return { v: 3, flags: {}, seen: [], items: [], pages: [], opened: [] }; }

/* ---------- tokoh baru ---------- */
function addCharacters() {
  Object.assign(CHARACTERS, { dewi: { name: 'Eyang Dewi', color: '#b5673a' } });
  Object.assign(Pix.PAL, { dewi: { h: '#8d8494', H: '#5f5866', e: '#3b2a2a', E: '#6e4a36', I: '#b88a66', o: '#b5673a', O: '#7e4424', a: '#f2d49b', A: '#c9a45f', p: '#5a3a2a', b: '#3a2a2a', c: '#f4ecdc' } });
  Object.assign(Pix.STYLE, { dewi: { hair: 'bun', old: true, uniform: 'cardigan' } });
}

/* ---------- migrasi ---------- */
function migrate() {
  const d = S();
  if (d.story && d.story.v >= 3) { const s = d.story; s.flags ||= {}; s.seen ||= []; s.items ||= []; s.pages ||= []; s.opened ||= []; return; }
  const s = blank();
  d.story = s;
  if (!d.name) return;                       // permainan baru: prolog akan berjalan
  // Save lama (v2): isi flag sesuai hari yang sudah dilewati
  const day = d.day || 1, q = (id: string) => (d.quests || {})[id] || {};
  const set = (...fs: string[]) => fs.forEach(f => { s.flags[f] = Math.max(1, day - 1); });
  const item = (...is: string[]) => is.forEach(i => { if (!s.items.includes(i)) s.items.push(i); });
  set('prolog_met_sato', 'prolog_done', 'attic_seen');
  if (day > 1) set('sensei_knows_sato');
  if (q('mochi').state === 'done') { set('key_found'); item('key'); }
  if (q('letter').state === 'done') { set('dewi_petal_sent'); item('petal'); }
  if (day > 9) { set('key_found', 'attic_promise', 'attic_opened', 'letterbox_unlocked'); item('key', 'sepia'); }
  if (day > 11) { set('letter1_read', 'ch1_done'); s.pages.push(1); }
  if (day > 12) set('letter2_open');
  if (day > 15) { set('treasure_map'); item('map1976'); }
  if (day > 16) { set('page2', 'camera_unlocked'); item('camera'); s.pages.push(2); }
  if (day > 21) set('sato_knows');
  if (day > 22) set('letter3_open', 'letter3_read', 'ch2_done');
  // adegan hari-hari yang sudah lewat tidak diputar lagi
  SCENES.forEach(sc => { if (sc.from < day && !sc.slot.startsWith('event:')) s.seen.push(sc.id); });
  s.migrated = true;
  Save.write();
}

/* ---------- flag ---------- */
const has = (f: string) => !!st().flags[f];
function set(f: string) { if (!st().flags[f]) { st().flags[f] = today(); Save.write(); } }

/* ---------- kelayakan adegan ---------- */
function eligible(sc: Scene, slot: string, map?: string): boolean {
  if (sc.slot !== slot) return false;
  if (st().seen.includes(sc.id)) return false;
  const d = today();
  if (d < sc.from || (sc.until != null && d > sc.until)) return false;
  if (sc.requires && !sc.requires.every(has)) return false;
  if (sc.map && map && sc.map !== map) return false;
  if (sc.cond) { try { if (!sc.cond(S())) return false; } catch { return false; } }
  return true;
}

/* ---------- menjalankan adegan ---------- */
async function doAct(a: Act) {
  if ('flag' in a) set(a.flag);
  else if ('item' in a) {
    if (!st().items.includes(a.item)) { st().items.push(a.item); Save.write(); const it = ITEM_BY[a.item]; if (it) UI.toast(`${it.icon} Benda kenangan: ${it.name}`); }
  } else if ('page' in a) {
    if (!st().pages.includes(a.page)) { st().pages.push(a.page); Save.write(); Sound.star(); UI.toast(`📖 Halaman buku #${a.page} ditemukan! (${st().pages.length}/10)`); }
  } else if ('letter' in a) {
    UI.hideDialog();
    if (window.ReactUI) await window.ReactUI.letters({ letter: a.letter, reading: !!a.read });
  } else if ('points' in a) H().addPoints(a.points, a.why);
  else if ('heart' in a) H().heart(a.heart);
  else if ('toast' in a) { UI.toast(a.toast); await UI.sleep(400); }
  else if ('card' in a) { UI.hideDialog(); await UI.timecard(a.card[0], a.card[1]); }
  else if ('music' in a) Music.play(a.music);
  else if ('stamp' in a) H().addStamp(a.stamp[0], a.stamp[1]);
  else if ('floorGame' in a) { UI.hideDialog(); await floorGame(); }
  else if ('goal' in a) { st().goal = a.goal; Save.write(); UI.toast(`🎯 ${a.goal}`); await UI.sleep(300); }
  else if ('town' in a) addTown(a.town);
  else if ('kasir' in a) { UI.hideDialog(); await kasir(a.kasir); UI.closePanel(); Music.play('festival'); }
  else if ('trip' in a) {
    UI.hideDialog();
    if (a.trip === 'umi') await UI.fade(() => { World.load('umi', 12, 4, 'down', [{ id: 'obaa', x: 11, y: 4, dir: 'right' }, { id: 'emma', x: 15, y: 4, dir: 'left' }]); World.setPhase('evening'); Music.play('morning'); }, 400);
    else await UI.fade(() => { World.load('town', 22, 20, 'down', []); World.setPhase('evening'); Music.play('evening'); }, 400);
  }
}

async function runLines(lines: Line[], cast: string[]) {
  for (const line of lines) {
    if ('act' in line) { await doAct(line.act); continue; }
    if ('choose' in line) { await H().menuChoice(line.choose, line.opts); UI.hideDialog(); continue; }
    await H().runLines([line], cast);
  }
}

async function play(sc: Scene, prefix?: Line[]) {
  const cast = sc.cast || [];
  if (prefix) await runLines(prefix, cast);
  await runLines(sc.lines, cast);
  if (!st().seen.includes(sc.id)) st().seen.push(sc.id);
  Save.write();
  UI.hideDialog();
}

/** Jalankan adegan yang layak untuk slot ini (maks. 2). Mengembalikan true bila ada. */
async function hook(slot: string): Promise<boolean> {
  const map = (window as any).World ? World.map : undefined;
  let ran = 0;
  for (const sc of SCENES) {
    if (ran >= 2) break;
    if (!eligible(sc, slot, map)) continue;
    await play(sc); ran++;
  }
  // makan malam: adegan kota "wajib" yang terlewat hari ini
  if (slot === 'dinner') {
    for (const sc of SCENES) {
      if (!sc.must || !sc.spawn || st().seen.includes(sc.id)) continue;
      const d = today();
      if (d < sc.from || (sc.until != null && d > sc.until)) continue;
      if (sc.requires && !sc.requires.every(has)) continue;
      await play(sc, sc.must); ran++;
    }
  }
  return ran > 0;
}

async function event(name: string) { return hook('event:' + name); }

/* ---------- NPC cerita di peta ---------- */
function npcs(mapId: string) {
  const out: any[] = [];
  const step = S().step;
  for (const sc of SCENES) {
    if (!sc.spawn || sc.map !== mapId) continue;
    if (!eligible(sc, sc.slot, mapId)) continue;
    if (sc.spawn.steps && !sc.spawn.steps.includes(step)) continue;
    out.push({ id: sc.spawn.id, x: sc.spawn.x, y: sc.spawn.y, dir: sc.spawn.dir || 'down', marker: '!', story: sc.id });
  }
  return out;
}
function sceneFor(npc: any): Scene | null {
  const map = (window as any).World ? World.map : undefined;
  if (npc.story) return SCENES.find(s => s.id === npc.story && !st().seen.includes(s.id)) || null;
  return SCENES.find(s => eligible(s, 'talk:' + npc.id, map) && (!s.map || s.map === map) && !s.spawn) || null;
}
const claims = (npc: any) => !!sceneFor(npc);
async function talk(npc: any) { const sc = sceneFor(npc); if (sc) await play(sc); }
/** Beri tanda "!" pada NPC yang punya adegan cerita. */
function mark(list: any[]) { list.forEach(n => { if (!n.marker && claims(n)) n.marker = '!'; }); return list; }

/* ---------- mini-game: ketuk papan lantai ---------- */
function floorGame(): Promise<void> {
  const N = 8, hollow = 2 + Math.floor(Math.random() * 5);
  const p = UI.panel(`<div class="win floor-game"><div class="w-title">Ketuk papan lantai</div>
    <p class="muted">Dengarkan bunyinya. Papan yang kosong di bawahnya berbunyi berbeda.</p>
    <div class="boards">${Array.from({ length: N }, (_, i) => `<button class="board" data-i="${i}" type="button"><span>とん</span></button>`).join('')}</div>
    <p class="fg-msg muted">Ketuk satu per satu…</p></div>`, 'scroll');
  return UI.wait<void>(done => {
    p.querySelectorAll<HTMLButtonElement>('.board').forEach(b => b.onclick = () => {
      const i = +b.dataset.i!;
      if (i === hollow) {
        Sound.ok(); b.classList.add('hollow'); b.innerHTML = '<span>ぽこっ</span>';
        p.querySelector('.fg-msg')!.textContent = 'Bunyinya kosong! Papannya bisa diangkat…';
        setTimeout(() => { UI.closePanel(); done(); }, 1100);
      } else { Sound.bump(); b.classList.add('solid'); b.innerHTML = '<span>とん</span>'; }
    });
  });
}

/* ---------- prolog ---------- */
async function prologue() {
  await UI.timecard('プロローグ', 'ようこそ、さくらまち へ<br><span class="jp">Selamat datang di Sakura-machi</span>');
  await runLines(PROLOGUE.train, []);
  await UI.fade(() => {
    World.load('town', 21, 21, 'right', [
      { id: 'obaa', x: 22, y: 21, dir: 'left' },
      { id: 'mochi', x: 19, y: 22, dir: 'right' },
      { id: 'ojii', x: 15, y: 21, dir: 'right' },
    ]);
    World.setPhase('evening'); Music.play('evening');
  });
  await runLines(PROLOGUE.station, ['obaa']);
  await runLines(PROLOGUE.walk, ['obaa']);
  await UI.fade(() => { World.load('home', 3, 3, 'left', [{ id: 'obaa', x: MAPS.home.spots.obaa[0], y: MAPS.home.spots.obaa[1], dir: 'left' }]); World.setPhase('evening'); Music.play('home'); });
  await runLines(PROLOGUE.home, ['obaa']);
  await UI.fade(() => { World.setPhase('night'); Music.play('night'); });
  await runLines(PROLOGUE.night, []);
  UI.hideDialog();
  await UI.say({ n: 'Cara main: ketuk layar untuk berjalan, atau pakai tombol arah. Ketuk orang atau tekan A untuk bicara. Tugasmu selalu tertulis di kiri atas — ketuk untuk berjalan otomatis.' });
  UI.hideDialog();
}

/* ---------- Meter Kota ---------- */
function addTown(n: number) {
  const before = st().town || 0;
  st().town = Math.min(100, before + n); Save.write();
  UI.toast(`🏮 Meter Kota +${n} (${st().town}/100)`);
}

/* ---------- tawaran di tempat (kerja paruh waktu, dll.) ---------- */
async function offer(npc: any): Promise<boolean> {
  const map = (window as any).World ? World.map : '';
  if (map === 'kafe' && npc.id === 'mama' && has('baito_cafe')) {
    const step = S().step;
    if (step !== 'after' && step !== 'evening') return false;
    const done = st().baitoDay === today();
    const a = await H().menuChoice('Ibu Hana: 「いらっしゃい！」', [done ? 'Kerja paruh waktu (sudah hari ini)' : '🧾 Kerja paruh waktu (kasir)', 'Pesan menu', 'Tidak jadi']);
    UI.hideDialog();
    if (a === 0) {
      if (done) { await UI.say({ w: 'mama', e: 'happy', t: 'Hari ini sudah cukup. Istirahat, ya! Besok datang lagi.' }); return true; }
      const b = st().baito || (st().baito = {});
      const shifts = b.cafe || 0;
      const level = Math.min(4, 1 + Math.floor(shifts / 2));
      await UI.say({ w: 'mama', e: 'happy', jp: 'よろしく ね！', ro: 'yoroshiku ne!', id: 'Mohon bantuannya, ya!' });
      UI.hideDialog();
      const r = await kasir({ level, rounds: 3, title: `Kasir Kafe · Lv ${level}` });
      UI.closePanel();
      b.cafe = shifts + 1; st().baitoDay = today(); Save.write();
      H().addPoints(15, 'upah kerja kafe');
      if (r.score >= r.max * 0.7) addTown(2);
      await UI.say({ w: 'mama', e: 'happy', jp: 'おつかれさま！', ro: 'otsukaresama!', id: 'Terima kasih atas kerja kerasnya!' });
      if (level < 4 && Math.floor((shifts + 1) / 2) > Math.floor(shifts / 2)) UI.toast(`⬆ Kasir naik ke Lv ${level + 1}!`);
      return true;
    }
    return a === 2;
  }
  return false;
}

/* ---------- lain-lain ---------- */
function diaryNote(): string | null {
  for (const e of DIARY) if (st().flags[e.flag] === today()) return e.text;
  return null;
}
function lettersAvailable() {
  return LETTERS.filter(l => has(l.unlock) && (!l.extra || l.extra(S())) && l.lines.length);
}
function unread() { return lettersAvailable().filter(l => !st().opened.includes(l.id)).length; }
function goal(): string | null {
  const g = st().goal;
  if (!g) return null;
  if (g.startsWith('Pelajari 36') && has('attic_opened')) { st().goal = undefined; return null; }
  if (g.startsWith('Lulus ujian hiragana') && has('letter1_read')) { st().goal = undefined; return null; }
  if (g.startsWith('Pelajari katakana') && has('ch2_done')) { st().goal = undefined; return null; }
  return g;
}

/** Sapaan sekali untuk pemain lama setelah pembaruan v3. */
async function welcomeBack() {
  if (!st().migrated || has('v3_hello')) return;
  set('v3_hello');
  await UI.say({ n: '🌸 Pembaruan 「さくら の てがみ」! Rumah Nenek Sato menyimpan sebuah rahasia dari 50 tahun lalu.' });
  if (has('letterbox_unlocked')) await UI.say({ n: 'Surat-surat dari loteng sudah menunggumu di 📮 Kotak Surat (Menu → Surat). Kata yang hurufnya belum kamu pelajari akan tampil kabur.' });
  else await UI.say({ n: 'Perhatikan Mochi, kucing Kakek Mori… dan loteng yang terkunci di rumah Nenek Sato.' });
  UI.hideDialog();
}

function init() {
  addCharacters();
  migrate();
}

export const Story = {
  init, welcomeBack, has, set, hook, offer, addTown, event, npcs, claims, talk, mark, prologue, diaryNote,
  lettersAvailable, unread, goal,
  get state() { return st(); },
  get unlocked() { return has('letterbox_unlocked'); },
  get town() { return st().town || 0; },
  get pagesTotal() { return PAGES.length; },
  /** Hanya untuk pengujian / debug. */
  _debug: { SCENES, eligible },
};
