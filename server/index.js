/* =========================================================
   SERVER ONLINE — Nihongo Gakkou
   Server WebSocket kecil: meneruskan posisi, penampilan, dan
   stempel frasa antar pemain. Tanpa teks bebas (aman untuk anak).

   Jalankan:  cd server && npm install && npm start
   Port bawaan 8787 (ubah dengan variabel lingkungan PORT).
   ========================================================= */
const http = require('http');
const { WebSocketServer } = require('ws');

const PORT = process.env.PORT || 8787;
const MAX_PLAYERS = +process.env.MAX_PLAYERS || 100;
const PHRASE_COUNT = 24;       // harus sama dengan jumlah PHRASES di js/online.js
const MAPS = new Set(['town', 'class', 'home', 'roof', 'library', 'club']);
const HEX = /^#[0-9a-f]{6}$/i;
const LOOK_KEYS = {
  hair: ['short', 'bob', 'long', 'spiky', 'twin'],
  uniform: ['blazer', 'sailor', 'gakuran'],
  accessory: ['none', 'ribbon', 'glasses', 'headband', 'cap', 'flower'],
};

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'content-type': 'text/plain; charset=utf-8', 'access-control-allow-origin': '*' });
  res.end(`Nihongo Gakkou server · ${players.size} pemain online\n`);
});
const wss = new WebSocketServer({ server, maxPayload: 4096 });
const players = new Map();   // ws → data pemain
let nextId = 1;

const clean = (s, n) => String(s || '').replace(/[<>&"'{}\\]/g, '').trim().slice(0, n);
const int = (v, lo, hi) => { v = Math.round(+v); return Number.isFinite(v) ? Math.max(lo, Math.min(hi, v)) : lo; };
function cleanLook(l) {
  l = l && typeof l === 'object' ? l : {};
  const out = {};
  for (const [k, allowed] of Object.entries(LOOK_KEYS)) out[k] = allowed.includes(l[k]) ? l[k] : allowed[0];
  for (const k of ['hairColor', 'skin', 'uniformColor', 'accColor']) out[k] = HEX.test(l[k]) ? l[k] : '#3f3a4f';
  return out;
}
const pub = p => ({ id: p.id, name: p.name, look: p.look, map: p.map, x: p.x, y: p.y, dir: p.dir });
function broadcast(msg, except) {
  const s = JSON.stringify(msg);
  for (const [ws] of players) if (ws !== except && ws.readyState === 1) ws.send(s);
}

wss.on('connection', ws => {
  if (players.size >= MAX_PLAYERS) { ws.close(1013, 'penuh'); return; }
  let me = null, bucket = 20, last = Date.now();
  ws.isAlive = true;
  ws.on('pong', () => { ws.isAlive = true; });
  ws.on('message', raw => {
    // batas kirim: ~10 pesan per detik
    const now = Date.now(); bucket = Math.min(20, bucket + (now - last) / 100); last = now;
    if (bucket < 1) return; bucket--;
    let m; try { m = JSON.parse(raw); } catch (e) { return; }
    if (!m || typeof m !== 'object') return;
    if (m.t === 'hello' && !me) {
      me = { id: 'p' + (nextId++), name: clean(m.name, 12) || 'Murid', look: cleanLook(m.look), map: MAPS.has(m.map) ? m.map : 'town', x: int(m.x, 0, 40), y: int(m.y, 0, 40), dir: ['up', 'down', 'left', 'right'].includes(m.dir) ? m.dir : 'down' };
      players.set(ws, me);
      ws.send(JSON.stringify({ t: 'welcome', id: me.id, players: [...players.values()].filter(p => p !== me).map(pub) }));
      broadcast({ t: 'join', player: pub(me) }, ws);
      return;
    }
    if (!me) return;
    if (m.t === 'move') {
      me.map = MAPS.has(m.map) ? m.map : me.map; me.x = int(m.x, 0, 40); me.y = int(m.y, 0, 40);
      me.dir = ['up', 'down', 'left', 'right'].includes(m.dir) ? m.dir : me.dir;
      broadcast({ t: 'move', id: me.id, map: me.map, x: me.x, y: me.y, dir: me.dir }, ws);
    } else if (m.t === 'say') {
      broadcast({ t: 'say', id: me.id, p: int(m.p, 0, PHRASE_COUNT - 1) }, ws);
    } else if (m.t === 'look') {
      me.look = cleanLook(m.look);
      broadcast({ t: 'look', id: me.id, look: me.look }, ws);
    }
  });
  ws.on('close', () => { if (me) { players.delete(ws); broadcast({ t: 'leave', id: me.id }); } });
});

// putuskan koneksi yang mati
setInterval(() => { for (const ws of wss.clients) { if (!ws.isAlive) { ws.terminate(); continue; } ws.isAlive = false; ws.ping(); } }, 30000);

server.listen(PORT, () => console.log(`Server Nihongo Gakkou berjalan di port ${PORT}`));
