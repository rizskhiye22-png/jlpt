/* =========================================================
   DUNIA GAME: peta, pemain berjalan, NPC, kamera, sentuhan.
   Canvas kecil (resolusi pixel asli) lalu diperbesar tajam,
   jadi ringan untuk HP.
   ========================================================= */
const World2D = (() => {
  const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
  const STEP_MS = 190;

  let cv, ctx, scale = 2, vw = 180, vh = 240;
  let mapId = null, mapCanvas = null;
  let npcs = [];
  const player = { x: 0, y: 0, px: 0, py: 0, dir: 'down', moving: null, frame: 0, walkT: 0 };
  let held = null, route = [], routeGoal = null;
  let paused = false, dirty = true, lastDraw = 0, running = false;
  let handlers = { interact: null, warp: null, blocked: null };

  function init(canvas, h) {
    cv = canvas; ctx = cv.getContext('2d'); handlers = h;
    resize(); window.addEventListener('resize', resize);
    cv.addEventListener('pointerdown', onTap);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) { dirty = true; kick(); } });
  }

  function resize() {
    const box = cv.parentElement.getBoundingClientRect();
    if (!box.width) return;
    scale = Math.max(2, Math.round(box.width / 185));
    vw = Math.ceil(box.width / scale); vh = Math.ceil(box.height / scale);
    cv.width = vw; cv.height = vh;
    cv.style.width = vw * scale + 'px'; cv.style.height = vh * scale + 'px';
    ctx.imageSmoothingEnabled = false; dirty = true; kick();
  }

  /* ---------- memuat peta ---------- */
  function load(id, x, y, dir, npcList) {
    mapId = id; mapCanvas = Maps.render(id);
    player.x = x; player.y = y; player.px = x * TILE; player.py = y * TILE; player.dir = dir || 'down';
    player.moving = null; route = []; routeGoal = null; held = null;
    setNpcs(npcList || []);
    dirty = true; kick();
  }
  function setNpcs(list) {
    npcs = list.map(n => ({ ...n, dir: n.dir || 'down' }));
    dirty = true;
  }
  const npcAt = (x, y) => npcs.find(n => n.x === x && n.y === y);
  const free = (x, y) => Maps.walkable(mapId, x, y) && !npcAt(x, y) ;

  /* ---------- gerakan ---------- */
  function tryStep(dir) {
    player.dir = dir;
    const [dx, dy] = DIRS[dir];
    const nx = player.x + dx, ny = player.y + dy;
    if (!free(nx, ny)) {
      dirty = true;
      const door = (MAPS[mapId].closedDoors || []).find(d => d.x === nx && d.y === ny);
      if (door && handlers.blocked) handlers.blocked(door);
      else if (!route.length) Sound.bump();
      return false;
    }
    player.moving = { fx: player.x, fy: player.y, tx: nx, ty: ny, t: 0 };
    player.x = nx; player.y = ny;
    return true;
  }

  function update(dt) {
    if (paused) return;
    if (player.moving) {
      const m = player.moving;
      m.t += dt / STEP_MS;
      player.walkT += dt;
      if (m.t >= 1) {
        player.px = m.tx * TILE; player.py = m.ty * TILE; player.moving = null;
        player.frame = (player.frame + 1) % 4;
        const w = (MAPS[mapId].warps || []).find(w => w.x === player.x && w.y === player.y);
        if (w) { route = []; held = null; handlers.warp(w); return; }
        if (!route.length && routeGoal) { const g = routeGoal; routeGoal = null; arrive(g); }
      } else {
        player.px = (m.fx + (m.tx - m.fx) * m.t) * TILE;
        player.py = (m.fy + (m.ty - m.fy) * m.t) * TILE;
      }
      dirty = true;
    }
    if (!player.moving) {
      if (route.length) {
        const [nx, ny] = route.shift();
        const dir = nx > player.x ? 'right' : nx < player.x ? 'left' : ny > player.y ? 'down' : 'up';
        if (!tryStep(dir)) { route = []; routeGoal = null; }
      } else if (held) {
        tryStep(held);
      }
    }
  }

  /* ---------- menggambar ---------- */
  function draw(now) {
    const mw = mapCanvas.width, mh = mapCanvas.height;
    let cx = Math.round(player.px + 8 - vw / 2), cy = Math.round(player.py + 8 - vh / 2);
    cx = mw <= vw ? Math.round((mw - vw) / 2) : Math.max(0, Math.min(mw - vw, cx));
    cy = mh <= vh ? Math.round((mh - vh) / 2) : Math.max(0, Math.min(mh - vh, cy));
    ctx.fillStyle = '#1f1823'; ctx.fillRect(0, 0, vw, vh);
    ctx.drawImage(mapCanvas, -cx, -cy);

    const actors = npcs.map(n => ({ id: n.id, px: n.x * TILE, py: n.y * TILE, dir: n.dir, frame: 0, npc: n }));
    const walking = !!player.moving;
    actors.push({ id: 'player', px: player.px, py: player.py, dir: player.dir, frame: walking ? (player.frame % 2 ? 1 : 2) : 0 });
    actors.sort((a, b) => a.py - b.py);
    const bob = Math.floor(now / 350) % 2;
    for (const a of actors) {
      const x = Math.round(a.px - cx), y = Math.round(a.py - cy);
      ctx.fillStyle = 'rgba(30,20,35,.25)'; ctx.fillRect(x + 4, y + 13, 8, 2); ctx.fillRect(x + 3, y + 14, 10, 1);
      ctx.drawImage(Pix.sprite(a.id, a.dir, a.frame), x, y - 4 - (a.npc && a.npc.idle && bob ? 1 : 0));
      if (a.npc && a.npc.marker) drawMarker(x + 8, y - 12 - (bob ? 1 : 0), a.npc.marker === '?');
    }
    // penanda tujuan saat berjalan otomatis
    if (routeGoal && routeGoal.tile) {
      const [gx, gy] = routeGoal.tile; const x = gx * TILE - cx, y = gy * TILE - cy;
      ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.strokeRect(x + 2.5, y + 2.5, 11, 11);
    }
  }
  function drawMarker(x, y, q) {
    ctx.fillStyle = '#2a1f2d'; ctx.fillRect(x - 3, y - 1, 7, 9);
    ctx.fillStyle = q ? '#6fd3e6' : '#ffd24a'; ctx.fillRect(x - 2, y, 5, 7);
    ctx.fillStyle = '#2a1f2d'; ctx.fillRect(x, y + 1, 1, 3); ctx.fillRect(x, y + 5, 1, 1);
  }

  let lastT = 0;
  function frame(t) {
    if (!running) return;
    const dt = Math.min(50, t - (lastT || t)); lastT = t;
    update(dt);
    const animate = npcs.some(n => n.marker || n.idle);
    if (mapCanvas && (dirty || (animate && t - lastDraw > 170))) { draw(t); dirty = false; lastDraw = t; }
    const busy = player.moving || route.length || held || dirty || animate;
    if (busy && !document.hidden) requestAnimationFrame(frame);
    else { running = false; lastT = 0; }
  }
  function kick() { if (!running) { running = true; requestAnimationFrame(frame); } }

  /* ---------- input ---------- */
  function hold(dir) { if (paused) return; held = dir; route = []; routeGoal = null; kick(); }
  function release(dir) { if (!dir || held === dir) held = null; }

  // Tombol A: bicara / periksa yang ada di depan
  function action() {
    if (paused || player.moving) return;
    const t = target(player.x, player.y, player.dir);
    if (t) handlers.interact(t);
  }
  function target(x, y, dir) {
    const [dx, dy] = DIRS[dir];
    const fx = x + dx, fy = y + dy;
    let n = npcAt(fx, fy);
    if (!n && Maps.across(mapId, fx, fy)) n = npcAt(fx + dx, fy + dy);
    if (n) { n.dir = { up: 'down', down: 'up', left: 'right', right: 'left' }[dir]; dirty = true; kick(); return { type: 'npc', npc: n }; }
    return Maps.interactAt(mapId, fx, fy);
  }

  // Cari jalur terpendek (BFS) ke salah satu ubin tujuan
  function findPath(goals) {
    const key = (x, y) => x + ',' + y;
    const goalSet = new Set(goals.map(([x, y]) => key(x, y)));
    const start = [player.x, player.y];
    if (goalSet.has(key(...start))) return [];
    const prev = new Map([[key(...start), null]]);
    const q = [start];
    while (q.length) {
      const [x, y] = q.shift();
      for (const [dx, dy] of Object.values(DIRS)) {
        const nx = x + dx, ny = y + dy, k = key(nx, ny);
        if (prev.has(k) || !free(nx, ny)) continue;
        prev.set(k, [x, y]);
        if (goalSet.has(k)) {
          const out = [[nx, ny]]; let c = [x, y];
          while (c && key(...c) !== key(...start)) { out.unshift(c); c = prev.get(key(...c)); }
          return out;
        }
        q.push([nx, ny]);
      }
      if (prev.size > 2000) break;
    }
    return null;
  }

  // Jalan ke ubin tertentu; kalau ubin itu NPC/objek, berdiri di sebelahnya lalu bicara
  function walkTo(tx, ty) {
    if (paused) return false;
    const n = npcAt(tx, ty);
    const special = n || Maps.interactAt(mapId, tx, ty);
    if (special) {
      const goals = [];
      Object.entries(DIRS).forEach(([d, [dx, dy]]) => {
        const sx = tx - dx, sy = ty - dy;
        if (free(sx, sy) || (sx === player.x && sy === player.y)) goals.push([sx, sy, d]);
        if (n && Maps.across(mapId, sx, sy)) { const ax = sx - dx, ay = sy - dy; if (free(ax, ay) || (ax === player.x && ay === player.y)) goals.push([ax, ay, d]); }
      });
      if (!goals.length) return false;
      const p = findPath(goals.map(g => [g[0], g[1]]));
      if (!p) return false;
      const end = p.length ? p[p.length - 1] : [player.x, player.y];
      const g = goals.find(g => g[0] === end[0] && g[1] === end[1]);
      route = p; routeGoal = { face: g[2], tile: [tx, ty] }; held = null;
      if (!p.length) { const r = routeGoal; routeGoal = null; arrive(r); }
      kick(); return true;
    }
    if (!free(tx, ty)) return false;
    const p = findPath([[tx, ty]]);
    if (!p) return false;
    route = p; routeGoal = { tile: [tx, ty] }; held = null; kick(); return true;
  }
  function arrive(g) {
    dirty = true; kick();
    if (g.face) { player.dir = g.face; const t = target(player.x, player.y, g.face); if (t) handlers.interact(t); }
  }

  function onTap(e) {
    if (paused || UI.dialogOpen()) return;
    const r = cv.getBoundingClientRect();
    const mw = mapCanvas.width, mh = mapCanvas.height;
    let cx = Math.round(player.px + 8 - vw / 2), cy = Math.round(player.py + 8 - vh / 2);
    cx = mw <= vw ? Math.round((mw - vw) / 2) : Math.max(0, Math.min(mw - vw, cx));
    cy = mh <= vh ? Math.round((mh - vh) / 2) : Math.max(0, Math.min(mh - vh, cy));
    const wx = (e.clientX - r.left) / scale + cx, wy = (e.clientY - r.top) / scale + cy + 4;
    const tx = Math.floor(wx / TILE), ty = Math.floor(wy / TILE);
    if (tx === player.x && ty === player.y) return;
    if (!walkTo(tx, ty)) Sound.bump();
  }

  function pause(on) { paused = on; if (on) { held = null; route = []; routeGoal = null; } dirty = true; kick(); }
  function refresh() { dirty = true; kick(); }

  // Mode 2D: suasana waktu cukup lewat warna layar (CSS)
  function setPhase(p) { document.body.dataset.phase = p; }
  return {
    init, load, setNpcs, hold, release, action, walkTo, pause, refresh, resize, setPhase,
    setQuality() {}, refreshLook() { dirty = true; kick(); }, is3D: false,
    setPet() {}, setOthers() {}, sayOther() {}, online: false,
    setWeather(w) { document.body.dataset.weather = w; },
    get map() { return mapId; }, get player() { return player; }, get npcs() { return npcs; },
  };
})();
