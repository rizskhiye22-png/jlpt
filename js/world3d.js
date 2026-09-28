/* =========================================================
   DUNIA 3D (Three.js) — gaya "HD-2D"
   Kota, rumah, dan sekolah dibangun dari bentuk 3D low-poly,
   sedangkan karakter tetap pixel art yang berdiri di dunia 3D.
   API-nya sama dengan World 2D (world.js) supaya game.js tidak peduli
   mode mana yang dipakai.
   ========================================================= */
const World3D = (() => {
  const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
  const STEP_MS = 210;
  const PITCH = 52 * Math.PI / 180, FOV = 36;

  let T, renderer, scene, camera, canvasEl;
  let root = null, mapId = null, W = 0, H = 0, outdoor = false;
  let npcs = [];
  const actors = new Map();           // key → { group, plane, mat, shadow, marker, id }
  const player = { x: 0, y: 0, fx: 0, fy: 0, dir: 'down', moving: null, frame: 0 };
  let held = null, route = [], routeGoal = null, paused = false, handlers = {};
  let phase = 'morning', quality = 'normal';
  let dyn = { water: null, petals: null, lamps: [], windows: [], emissive: [] };
  let hemi, sun, camDist = 16, camTarget, raycaster, groundPlane, tmpV;
  let running = false, lastT = 0, lastRender = 0, clockT = 0;
  let petId = null, pet = { x: 0, y: 0, fx: 0, fy: 0, dir: 'down', trail: [] };
  let others = new Map();   // pemain lain (online): id → { name, x, y, fx, fy, dir, bubble, bubbleT }

  /* ---------- tekstur ---------- */
  const texCache = new Map();
  function pixelTex(cv) {
    const t = new T.CanvasTexture(cv);
    t.colorSpace = T.SRGBColorSpace; t.magFilter = T.NearestFilter; t.minFilter = T.NearestFilter; t.generateMipmaps = false;
    return t;
  }
  function spriteTex(id, dir, frame) {
    const key = `${id}:${dir}:${frame}`;
    if (!texCache.has(key)) texCache.set(key, pixelTex(Pix.sprite(id, dir, frame)));
    return texCache.get(key);
  }
  function makeCanvas(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); return c; }

  const lam = (color, extra) => new T.MeshLambertMaterial(Object.assign({ color }, extra || {}));
  const flat = color => new T.MeshLambertMaterial({ color, flatShading: true });

  /* ---------- inisialisasi ---------- */
  function init(canvas, h) {
    T = window.THREE; canvasEl = canvas; handlers = h;
    renderer = new T.WebGLRenderer({ canvas, antialias: false, powerPreference: 'default' });
    renderer.outputColorSpace = T.SRGBColorSpace;
    renderer.shadowMap.type = T.PCFShadowMap;
    scene = new T.Scene();
    camera = new T.PerspectiveCamera(FOV, 1, 0.1, 120);
    hemi = new T.HemisphereLight(0xffffff, 0x88aa77, 1.1); scene.add(hemi);
    sun = new T.DirectionalLight(0xffffff, 1.5);
    sun.shadow.mapSize.set(1024, 1024);
    Object.assign(sun.shadow.camera, { left: -12, right: 12, top: 12, bottom: -12, near: 1, far: 50 });
    sun.shadow.bias = -0.0008;
    scene.add(sun, sun.target);
    camTarget = new T.Vector3(); tmpV = new T.Vector3();
    raycaster = new T.Raycaster(); groundPlane = new T.Plane(new T.Vector3(0, 1, 0), 0);
    applyQuality();
    window.addEventListener('resize', resize);
    canvas.addEventListener('pointerdown', onTap);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) kick(); });
    resize();
  }

  function applyQuality() {
    const dpr = window.devicePixelRatio || 1;
    renderer.setPixelRatio(quality === 'low' ? Math.min(dpr, 1) : quality === 'high' ? Math.min(dpr, 2) : Math.min(dpr, 1.5));
    renderer.shadowMap.enabled = quality !== 'low';
    sun.castShadow = quality !== 'low';
  }
  function setQuality(q) { if (q === quality) return; quality = q; applyQuality(); if (mapId) { const p = { ...player }; load(mapId, p.x, p.y, p.dir, npcs); } }

  function resize() {
    const box = canvasEl.parentElement.getBoundingClientRect();
    if (!box.width || !box.height) return;
    canvasEl.style.width = box.width + 'px'; canvasEl.style.height = box.height + 'px';
    renderer.setSize(box.width, box.height, false);
    camera.aspect = box.width / box.height; camera.updateProjectionMatrix();
    fitCamera(); kick();
  }
  // Atur jarak kamera supaya lebar tampilan pas di HP (portrait) maupun layar lebar
  function fitCamera() {
    const aspect = camera.aspect || 1;
    const wantW = outdoor ? 10.5 : W + 1.2;
    const wantH = outdoor ? 9 : (H + 1) * 0.95;
    const vis = Math.max(wantW / aspect, wantH);
    camDist = (vis / 2) / Math.tan(FOV * Math.PI / 360) * 1.02;
  }

  /* ---------- membangun peta 3D ---------- */
  function clearMap() {
    if (!root) return;
    scene.remove(root);
    root.traverse(o => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => { if (m.map && !m.map.userData.keep) m.map.dispose(); m.dispose(); });
    });
    root = null; actors.clear(); dyn = { water: null, petals: null, lamps: [], windows: [], emissive: [] };
  }

  function box(w, h, d, mat, x, y, z, shadow = true) {
    const m = new T.Mesh(new T.BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z); m.castShadow = shadow; m.receiveShadow = true; root.add(m); return m;
  }
  function cyl(rt, rb, h, seg, mat, x, y, z) {
    const m = new T.Mesh(new T.CylinderGeometry(rt, rb, h, seg), mat);
    m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; root.add(m); return m;
  }
  // Atap pelana (segitiga memanjang)
  function gableRoof(w, d, h, mat, x, y, z) {
    const g = new T.BufferGeometry();
    const a = w / 2, b = d / 2;
    const v = [
      -a, 0, b, a, 0, b, a, h, 0, -a, 0, b, a, h, 0, -a, h, 0,       // depan
      a, 0, -b, -a, 0, -b, -a, h, 0, a, 0, -b, -a, h, 0, a, h, 0,    // belakang
      -a, 0, -b, -a, 0, b, -a, h, 0,                                  // ujung kiri
      a, 0, b, a, 0, -b, a, h, 0,                                     // ujung kanan
      -a, 0, -b, a, 0, -b, a, 0, b, -a, 0, -b, a, 0, b, -a, 0, b,     // bawah
    ];
    g.setAttribute('position', new T.Float32BufferAttribute(v, 3)); g.computeVertexNormals();
    const m = new T.Mesh(g, mat); m.position.set(x, y, z); m.castShadow = true; root.add(m); return m;
  }

  function facade(wPx, hPx, draw) {
    const cv = makeCanvas(wPx, hPx, draw);
    return pixelTex(cv);
  }

  function buildGround(id) {
    const map = MAPS[id];
    const tex = new T.CanvasTexture(Maps.render(id, { ground: true }));
    tex.colorSpace = T.SRGBColorSpace; tex.magFilter = T.NearestFilter; tex.minFilter = T.LinearMipmapLinearFilter;
    tex.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
    const g = new T.Mesh(new T.PlaneGeometry(W, H), lam(0xffffff, { map: tex }));
    g.rotation.x = -Math.PI / 2; g.position.set(W / 2, 0, H / 2); g.receiveShadow = true; root.add(g);
    if (map.outdoor) {
      const out = new T.Mesh(new T.PlaneGeometry(160, 160), lam(0x5f9a52));
      out.rotation.x = -Math.PI / 2; out.position.set(W / 2, -0.02, H / 2); out.receiveShadow = true; root.add(out);
    }
  }

  function buildWater(list) {
    if (!list.length) return;
    const cv = makeCanvas(32, 32, (c) => {
      c.clearRect(0, 0, 32, 32); c.fillStyle = 'rgba(255,255,255,.55)';
      [[3, 6, 8], [18, 12, 6], [8, 21, 9], [22, 27, 7]].forEach(([x, y, w]) => c.fillRect(x, y, w, 1));
    });
    const tex = pixelTex(cv); tex.wrapS = tex.wrapT = T.RepeatWrapping;
    const mat = new T.MeshBasicMaterial({ map: tex, transparent: true, opacity: .7, depthWrite: false });
    const geo = new T.PlaneGeometry(1, 1); geo.rotateX(-Math.PI / 2);
    const inst = new T.InstancedMesh(geo, mat, list.length);
    const m4 = new T.Matrix4();
    list.forEach(([x, y], i) => { m4.makeTranslation(x + .5, 0.03, y + .5); inst.setMatrixAt(i, m4); });
    root.add(inst); dyn.water = tex;
  }

  function buildTrees(list) {
    if (!list.length) return;
    const trunkGeo = new T.CylinderGeometry(0.09, 0.14, 0.9, 6); trunkGeo.translate(0, 0.45, 0);
    const leafGeo = new T.IcosahedronGeometry(0.58, 0);
    const trunks = new T.InstancedMesh(trunkGeo, flat(0x7a4f35), list.length);
    const leaves = new T.InstancedMesh(leafGeo, flat(0xffffff), list.length * 2);
    const m4 = new T.Matrix4(), q = new T.Quaternion(), s = new T.Vector3(), p = new T.Vector3(), c = new T.Color();
    const GREEN = [0x4f9a5e, 0x428f55, 0x5aa866, 0x3f8a52], PINK = [0xf3adc4, 0xf7bfd1, 0xeb9fb9, 0xf9cbd8];
    list.forEach(([x, y, pink], i) => {
      const h = Maps.hash(x, y, 7), r = (h % 100) / 100;
      trunks.setMatrixAt(i, m4.makeTranslation(x + .5, 0, y + .5));
      for (let k = 0; k < 2; k++) {
        const sc = k === 0 ? 1 + r * .25 : .62 + r * .15;
        q.setFromEuler(new T.Euler(r * 2, h % 7, r));
        p.set(x + .5 + (k ? (r - .5) * .5 : 0), k ? 1.55 + r * .2 : 1.2, y + .5 + (k ? .1 : 0));
        s.set(sc, sc * .92, sc);
        leaves.setMatrixAt(i * 2 + k, m4.compose(p, q, s));
        c.setHex((pink ? PINK : GREEN)[(h >>> (k * 3)) % 4]); leaves.setColorAt(i * 2 + k, c);
      }
    });
    trunks.castShadow = leaves.castShadow = true; leaves.receiveShadow = true;
    root.add(trunks, leaves);
  }

  function signTex(text) {
    const cv = makeCanvas(128, 64, (c, w, h) => {
      c.fillStyle = '#d9a46a'; c.fillRect(0, 0, w, h);
      c.fillStyle = '#b07a4c'; c.fillRect(0, 20, w, 2); c.fillRect(0, 44, w, 2);
      c.strokeStyle = '#6a4228'; c.lineWidth = 6; c.strokeRect(3, 3, w - 6, h - 6);
      c.fillStyle = '#3a2418'; c.textAlign = 'center'; c.textBaseline = 'middle';
      const size = text.length > 5 ? 22 : 30;
      c.font = `700 ${size}px "Zen Maru Gothic","Hiragino Maru Gothic ProN","Noto Sans JP",sans-serif`;
      c.fillText(text, w / 2, h / 2 + 2);
    });
    const t = new T.CanvasTexture(cv); t.colorSpace = T.SRGBColorSpace; return t;
  }

  function winPattern(c, x, y, w, h, lit) {
    c.fillStyle = '#2a1f2d'; c.fillRect(x, y, w, h);
    c.fillStyle = lit ? '#ffd98a' : '#9fd0ee'; c.fillRect(x + 2, y + 2, w - 4, h - 4);
    if (!lit) { c.fillStyle = '#d8f0fb'; c.fillRect(x + 3, y + 3, Math.max(2, w / 4), 2); }
    c.fillStyle = '#2a1f2d'; c.fillRect(x + w / 2 - 1, y, 2, h);
  }

  function buildBuilding(b) {
    const cx = b.x + b.w / 2, cz = b.y + b.h / 2;
    const S = 32; // piksel per ubin untuk tekstur dinding
    const doorsX = b.doors.map(([dx]) => dx - b.x);
    const specs = {
      house:   { wall: '#f3e6cf', trim: '#d8c4a2', wallH: 1.9, roof: 0xc9574f, roofH: 1.1, door: '#9a6a44', rows: 1 },
      school:  { wall: '#f6eee0', trim: '#e0d2bb', wallH: 2.8, roof: 0x5f74a6, flat: true, door: '#6a7fae', rows: 2 },
      konbini: { wall: '#fbf7ef', trim: '#e3dccf', wallH: 2.0, roof: 0xe9ecef, flat: true, door: '#9fd0ee', rows: 0 },
      station: { wall: '#efe2cf', trim: '#d6c4a6', wallH: 2.3, roof: 0x8a73a6, roofH: 1.2, door: '#6d5a86', rows: 1 },
      shrine:  { wall: '#8a5a36', trim: '#6a4228', wallH: 1.4, roof: 0x4a5a4f, roofH: 1.3, door: '#6a4228', rows: 0 },
    }[b.type];
    const hPx = Math.round(specs.wallH * S);
    const draw = lit => (c, w, h) => {
      c.fillStyle = lit ? '#000' : specs.wall; c.fillRect(0, 0, w, h);
      if (!lit) { c.fillStyle = specs.trim; c.fillRect(0, h - 6, w, 6); for (let y = 10; y < h - 6; y += 12) c.fillRect(0, y, w, 1); }
      if (b.type === 'konbini') {
        if (!lit) { c.fillStyle = '#3fa06a'; c.fillRect(0, 4, w, 8); c.fillStyle = '#f29b38'; c.fillRect(0, 12, w, 4); c.fillStyle = '#3f6fb0'; c.fillRect(0, 16, w, 8); }
        c.fillStyle = '#2a1f2d'; c.fillRect(8, 28, w - 16, h - 36);
        c.fillStyle = lit ? '#ffe7a8' : '#a9d8f2'; c.fillRect(10, 30, w - 20, h - 40);
        if (!lit) [['#e9d8b0', 16], ['#f28fb0', 60], ['#f6e05e', 110], ['#8fd3b0', 150]].forEach(([col, x]) => { c.fillStyle = col; c.fillRect(x, h - 22, 26, 10); });
        if (!lit) { c.fillStyle = '#fff'; c.font = '700 13px "Zen Maru Gothic",sans-serif'; c.textAlign = 'left'; c.fillText('コンビニ', w - 70, 21); }
      } else if (b.type === 'shrine') {
        if (!lit) { c.fillStyle = '#f6f0e0'; c.fillRect(w / 2 - 14, h - 30, 28, 24); c.fillStyle = '#2a1f2d'; c.fillRect(w / 2 - 1, h - 30, 2, 24); c.fillStyle = '#e0c060'; c.fillRect(w / 2 - 4, 4, 8, 8); }
      } else {
        for (let r = 0; r < specs.rows; r++) for (let i = 0; i < b.w; i++) {
          if (doorsX.includes(i) && r === specs.rows - 1) continue;
          const lit2 = lit && (Maps.hash(b.x + i, r, 3) % 3 !== 0);
          if (lit && !lit2) continue;
          winPattern(c, i * S + 7, 10 + r * 30, 18, 16, lit);
        }
      }
      doorsX.forEach(i => {
        c.fillStyle = '#2a1f2d'; c.fillRect(i * S + 5, h - 40, 22, 40);
        c.fillStyle = lit ? '#ffcf7a' : specs.door; c.fillRect(i * S + 7, h - 38, 18, 38);
        if (!lit) { c.fillStyle = '#f7d06b'; c.fillRect(i * S + 21, h - 20, 2, 3); }
      });
    };
    const front = facade(b.w * S, hPx, draw(false));
    const glow = facade(b.w * S, hPx, draw(true));
    const side = facade(b.h * S, hPx, (c, w, h) => {
      c.fillStyle = specs.wall; c.fillRect(0, 0, w, h); c.fillStyle = specs.trim; c.fillRect(0, h - 6, w, 6);
      for (let y = 10; y < h - 6; y += 12) c.fillRect(0, y, w, 1);
      if (b.type !== 'shrine' && b.h > 2) winPattern(c, w / 2 - 9, 12, 18, 16, false);
    });
    const plain = lam(specs.wall);
    const frontMat = lam(0xffffff, { map: front, emissiveMap: glow, emissive: 0x000000 });
    dyn.windows.push(frontMat);
    const sideMat = lam(0xffffff, { map: side });
    box(b.w, specs.wallH, b.h, [sideMat, sideMat, plain, plain, frontMat, sideMat], cx, specs.wallH / 2, cz);

    if (specs.flat) {
      box(b.w + .3, .25, b.h + .3, flat(specs.roof), cx, specs.wallH + .12, cz);
      if (b.type === 'school') {
        // menara jam
        const tw = 2.2, td = 1.6, th = 1.6;
        box(tw, th, td, lam(0xf6eee0), cx, specs.wallH + th / 2, b.y + b.h - td / 2 - 0.4);
        const roof = new T.Mesh(new T.ConeGeometry(1.75, 1, 4), flat(specs.roof));
        roof.rotation.y = Math.PI / 4; roof.position.set(cx, specs.wallH + th + .5, b.y + b.h - td / 2 - 0.4); roof.castShadow = true; root.add(roof);
        const clock = facade(64, 64, (c) => {
          c.fillStyle = '#2a1f2d'; c.beginPath(); c.arc(32, 32, 30, 0, 7); c.fill();
          c.fillStyle = '#fbf7ef'; c.beginPath(); c.arc(32, 32, 26, 0, 7); c.fill();
          c.fillStyle = '#2a1f2d'; c.fillRect(31, 12, 3, 22); c.fillRect(31, 31, 14, 3);
        });
        const cm = new T.Mesh(new T.PlaneGeometry(1.1, 1.1), new T.MeshBasicMaterial({ map: clock, transparent: true }));
        cm.position.set(cx, specs.wallH + th / 2, b.y + b.h - 0.39); root.add(cm);
        // kanopi pintu
        box(2.4, .12, .6, flat(0xd8455d), cx, 1.5, b.y + b.h + .25);
      }
      if (b.type === 'konbini') box(b.w, .12, .7, flat(0x3fa06a), cx, 1.35, b.y + b.h + .3);
    } else {
      gableRoof(b.w + .5, b.h + .6, specs.roofH, flat(specs.roof), cx, specs.wallH, cz);
      box(b.w + .5, .08, .12, flat(0x2a1f2d), cx, specs.wallH + .02, b.y + b.h + .3, false);
    }
    if (b.type === 'station') {
      const t = signTex('えき');
      const m = new T.Mesh(new T.PlaneGeometry(1.4, .7), lam(0xffffff, { map: t }));
      m.position.set(cx, specs.wallH - .45, b.y + b.h + .01); root.add(m);
    }
  }

  function buildTorii(pr) {
    const red = flat(0xd8455d), black = flat(0x2a1f2d);
    const z = pr.y + .5, x1 = pr.x + .5, x2 = pr.x + pr.w - .5;
    cyl(.1, .12, 2.3, 8, red, x1, 1.15, z); cyl(.1, .12, 2.3, 8, red, x2, 1.15, z);
    box(pr.w + .6, .16, .32, black, (x1 + x2) / 2, 2.38, z);
    box(pr.w + .3, .12, .22, red, (x1 + x2) / 2, 2.22, z);
    box(pr.w - .2, .12, .16, red, (x1 + x2) / 2, 1.85, z);
  }

  function buildSigns(map) {
    const wood = flat(0x8a5a36);
    (map.signs || []).forEach(s => {
      cyl(.05, .05, .7, 5, wood, s.x + .5, .35, s.y + .5);
      const mats = [wood, wood, wood, wood, lam(0xffffff, { map: signTex(s.text) }), wood];
      box(1.0, .5, .08, mats, s.x + .5, .8, s.y + .55);
    });
  }

  function buildOutdoorProps(map) {
    const trees = [], water = [];
    const post = flat(0x5b5f6e), woodL = flat(0xd19a66), wood = flat(0x8a5a36);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const t = Maps.tileAt(mapId, x, y), X = x + .5, Z = y + .5;
      if (t === 'T' || t === 'P') trees.push([x, y, t === 'P']);
      else if (t === 'W') water.push([x, y]);
      else if (t === '#') { box(.1, .6, .1, wood, X - .3, .3, Z); box(.1, .6, .1, wood, X + .3, .3, Z); box(1, .08, .06, woodL, X, .45, Z); box(1, .08, .06, woodL, X, .22, Z); }
      else if (t === 'b') { box(.9, .08, .35, woodL, X, .35, Z); box(.9, .3, .06, woodL, X, .55, Z - .16); box(.08, .35, .3, wood, X - .38, .17, Z); box(.08, .35, .3, wood, X + .38, .17, Z); }
      else if (t === 'L') {
        cyl(.05, .07, 1.9, 6, post, X, .95, Z);
        const lm = lam(0xfff3b0, { emissive: 0x000000 }); dyn.emissive.push(lm);
        box(.3, .3, .3, lm, X, 2.0, Z, false);
        dyn.lamps.push([X, Z]);
      } else if (t === 'V') {
        box(.8, 1.4, .6, flat(0xd8455d), X, .7, Z);
        const vm = lam(0xbfe6f5, { emissive: 0x000000 }); dyn.emissive.push(vm);
        box(.6, .7, .02, vm, X, .9, Z + .31, false);
      } else if (t === 'M') { cyl(.04, .04, .7, 5, post, X, .35, Z); box(.4, .5, .35, flat(0xd8455d), X, .9, Z); }
      else if (t === 'B') { box(1, .12, 1, woodL, X, .1, Z); if (x === 13) box(.08, .35, 1, wood, X - .45, .3, Z); else box(.08, .35, 1, wood, X + .45, .3, Z); }
    }
    buildTrees(trees); buildWater(water);
    (map.buildings || []).forEach(buildBuilding);
    (map.props || []).forEach(pr => pr.type === 'torii' && buildTorii(pr));
    buildSigns(map);
    // lampu jalan (menyala malam hari)
    if (quality !== 'low') dyn.lamps = dyn.lamps.slice(0, 4).map(([x, z]) => { const l = new T.PointLight(0xffd98a, 0, 6, 1.6); l.position.set(x, 1.9, z); root.add(l); return l; });
    else dyn.lamps = [];
    // kelopak sakura berjatuhan
    if (quality !== 'low' && Save.d.settings.fx !== false) {
      const N = 70, pos = new Float32Array(N * 3);
      for (let i = 0; i < N; i++) { pos[i * 3] = Math.random() * 20 - 10; pos[i * 3 + 1] = Math.random() * 6; pos[i * 3 + 2] = Math.random() * 20 - 10; }
      const g = new T.BufferGeometry(); g.setAttribute('position', new T.BufferAttribute(pos, 3));
      const p = new T.Points(g, new T.PointsMaterial({ color: 0xf7b6c8, size: .1 }));
      root.add(p); dyn.petals = p;
    }
  }

  function buildIndoorProps(map) {
    const wallMat = lam(0xeadcc3), wallTop = lam(0xcdb895), wood = flat(0xb07a4c), woodD = flat(0x8a5a36), white = flat(0xf4f1ea);
    const done = new Set();
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const t = Maps.tileAt(mapId, x, y), X = x + .5, Z = y + .5;
      const front = y === H - 1;
      if (t === 'W' || t === 'n' || t === 'K') {
        const h = front ? .3 : 1.7;
        box(1, h, 1, [wallMat, wallMat, wallTop, wallMat, wallMat, wallMat], X, h / 2, Z, false);
        const below = Maps.tileAt(mapId, x, y + 1);
        if (!front && !'WnK'.includes(below)) box(1, .18, .04, woodD, X, .09, Z + .52, false);
        if (t === 'n' && !'WnK'.includes(below)) {
          const wm = lam(0x9fd0ee, { emissive: 0x000000 }); dyn.emissive.push(wm);
          box(.7, .6, .03, wm, X, 1.05, Z + .52, false); box(.04, .6, .04, woodD, X, 1.05, Z + .54, false);
        }
        if (t === 'K' && !done.has('K')) {
          done.add('K');
          let n = 0; while (Maps.tileAt(mapId, x + n, y) === 'K') n++;
          const bt = facade(n * 32, 36, (c, w, h) => {
            c.fillStyle = '#2f5d50'; c.fillRect(0, 0, w, h); c.fillStyle = '#e9efe6';
            c.font = '700 16px "Zen Maru Gothic",sans-serif'; c.textAlign = 'center'; c.fillText(mapId === 'class' ? 'にほんご ・ カタカナ' : '', w / 2, 23);
          });
          box(n - .1, .95, .06, [woodD, woodD, woodD, woodD, lam(0xffffff, { map: bt }), woodD], x + n / 2, 1.0, Z + .53, false);
        }
        continue;
      }
      if (t === '#') { box(1, .9, .06, flat(0x3f8f58), X, .45, Z, false); continue; }
      if (t === 'D') { box(.8, .06, .6, flat(0xd19a66), X, .62, Z - .05); box(.7, .5, .06, woodD, X, .33, Z - .3); box(.5, .06, .45, flat(0x8a8f9e), X, .35, Z + .35); box(.5, .4, .05, flat(0x8a8f9e), X, .55, Z + .56); }
      else if (t === 'T') box(1, .8, .7, wood, X, .4, Z);
      else if (t === 'd') { box(1, .75, .7, wood, X, .375, Z - .1); if (Maps.tileAt(mapId, x - 1, y) === 'd') { const lm = lam(0xfff3b0, { emissive: 0x332200 }); box(.2, .3, .2, lm, X, .9, Z - .2); } }
      else if (t === 'b') {
        if (done.has('b')) continue; done.add('b');
        box(1.9, .35, 1.9, white, X + .45, .18, Z + .45); box(1.8, .1, 1.2, flat(0x7fa8dd), X + .45, .4, Z + .75); box(1.2, .14, .5, white, X + .45, .42, Z - .15);
      }
      else if (t === 'p') { cyl(.2, .15, .35, 8, flat(0xc46b4a), X, .18, Z); const lf = new T.Mesh(new T.IcosahedronGeometry(.32, 0), flat(0x3f8f58)); lf.position.set(X, .6, Z); lf.castShadow = true; root.add(lf); }
      else if (t === 'k') box(1, .9, .8, [white, white, flat(0xe8e2d6), white, flat(0xd8d0c2), white], X, .45, Z - .1);
      else if (t === 'F') box(.9, 1.6, .8, flat(0xeef1f4), X, .8, Z - .1);
      else if (t === 't') box(1, .35, 1, flat(0xd19a66), X, .18, Z);
      else if (t === 'C') box(.9, 1.6, .7, wood, X, .8, Z - .1);
      else if (t === 'S') {
        const st = facade(32, 48, (c) => { c.fillStyle = '#7a4f35'; c.fillRect(0, 0, 32, 48); ['#c9574f', '#3f6fb0', '#f2c14e', '#5aa878', '#8a78c8'].forEach((col, i) => { c.fillStyle = col; c.fillRect(3 + (i % 3) * 9, 4 + Math.floor(i / 3) * 22, 6, 18); }); });
        box(.95, 1.5, .5, [woodD, woodD, woodD, woodD, lam(0xffffff, { map: st }), woodD], X, .75, Z - .2);
      }
      else if (t === 'Q') { if (!done.has('Q')) { done.add('Q'); cyl(.8, .8, 1.3, 10, flat(0xc9ccd3), X + .5, .65, Z + .5); } }
    }
    // lampu ruangan
    const l = new T.PointLight(0xffe8c8, quality === 'low' ? 0 : 6, 14, 1.5); l.position.set(W / 2, 3, H / 2); root.add(l);
  }

  /* ---------- karakter (billboard pixel art) ---------- */
  const PLANE = () => { const g = new T.PlaneGeometry(1.5, 1.5); g.translate(0, .7, 0); return g; };
  function markerTex(kind) {
    const key = 'marker:' + kind;
    if (!texCache.has(key)) texCache.set(key, pixelTex(makeCanvas(12, 14, (c) => {
      c.fillStyle = '#2a1f2d'; c.fillRect(2, 0, 8, 11); c.fillRect(0, 2, 12, 7); c.fillRect(4, 11, 4, 2); c.fillRect(5, 13, 2, 1);
      c.fillStyle = kind === '?' ? '#6fd3e6' : '#ffd24a'; c.fillRect(3, 1, 6, 9); c.fillRect(1, 3, 10, 5); c.fillRect(5, 10, 2, 2);
      c.fillStyle = '#2a1f2d';
      if (kind === '?') { c.fillRect(4, 2, 4, 1); c.fillRect(7, 3, 1, 2); c.fillRect(5, 5, 2, 1); c.fillRect(5, 6, 1, 1); c.fillRect(5, 8, 1, 1); }
      else { c.fillRect(5, 2, 2, 4); c.fillRect(5, 7, 2, 2); }
    })));
    return texCache.get(key);
  }
  let shadowTex = null;
  function makeActor(key, id) {
    const g = new T.Group();
    const mat = new T.MeshBasicMaterial({ map: spriteTex(id, 'down', 0), transparent: true, alphaTest: .5, side: T.DoubleSide });
    const plane = new T.Mesh(PLANE(), mat); plane.rotation.x = -0.42;
    if (!shadowTex) {
      shadowTex = new T.CanvasTexture(makeCanvas(32, 32, (c) => { const gr = c.createRadialGradient(16, 16, 2, 16, 16, 15); gr.addColorStop(0, 'rgba(20,10,25,.55)'); gr.addColorStop(1, 'rgba(20,10,25,0)'); c.fillStyle = gr; c.fillRect(0, 0, 32, 32); }));
      shadowTex.userData.keep = true;
    }
    const shadow = new T.Mesh(new T.PlaneGeometry(.9, .6), new T.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }));
    shadow.rotation.x = -Math.PI / 2; shadow.position.y = .02;
    g.add(shadow, plane);
    root.add(g);
    const a = { key, id, group: g, plane, mat, shadow, marker: null, dir: 'down', frame: 0, phase: Math.random() * 6 };
    actors.set(key, a); applyTint(a); return a;
  }
  function setActorFrame(a, dir, frame) {
    if (a.dir === dir && a.frame === frame) return;
    a.dir = dir; a.frame = frame; a.mat.map = spriteTex(a.id, dir, frame); a.mat.needsUpdate = true;
  }
  function setMarker(a, kind) {
    if (a.marker && a.marker.userData.kind === kind) return;
    if (a.marker) { a.group.remove(a.marker); a.marker.material.dispose(); a.marker = null; }
    if (!kind) return;
    const s = new T.Sprite(new T.SpriteMaterial({ map: markerTex(kind), depthTest: false }));
    s.scale.set(.42, .5, 1); s.position.set(0, 1.95, 0); s.userData.kind = kind; s.renderOrder = 10;
    a.group.add(s); a.marker = s;
  }

  /* ---------- memuat peta ---------- */
  function load(id, x, y, dir, list) {
    clearMap();
    mapId = id; const map = MAPS[id];
    W = map.rows[0].length; H = map.rows.length; outdoor = !!map.outdoor;
    root = new T.Group(); scene.add(root);
    buildGround(id);
    if (outdoor) buildOutdoorProps(map); else buildIndoorProps(map);
    player.x = x; player.y = y; player.fx = x + .5; player.fy = y + .5; player.dir = dir || 'down';
    player.moving = null; route = []; routeGoal = null; held = null;
    makeActor('player', 'player');
    pet.trail = []; placePet();
    others.forEach(o => { o.actor = null; });
    setNpcs(list || []);
    syncOthers();
    handlers.moved && handlers.moved(mapId, player.x, player.y, player.dir);
    fitCamera(); applyPhase(); updateCamera(0, true);
    kick();
  }

  function setNpcs(list) {
    npcs = list.map(n => ({ ...n, dir: n.dir || 'down' }));
    [...actors.keys()].forEach(k => { if (k !== 'player' && !npcs.some(n => 'npc:' + n.id === k)) { const a = actors.get(k); root.remove(a.group); actors.delete(k); } });
    npcs.forEach(n => {
      const a = actors.get('npc:' + n.id) || makeActor('npc:' + n.id, n.id);
      a.group.position.set(n.x + .5, 0, n.y + .5);
      setActorFrame(a, n.dir, 0);
      setMarker(a, n.marker === true ? '!' : n.marker || null);
    });
    kick();
  }
  const npcAt = (x, y) => npcs.find(n => n.x === x && n.y === y);
  const free = (x, y) => Maps.walkable(mapId, x, y) && !npcAt(x, y);

  /* ---------- cahaya & suasana ---------- */
  const PHASES = {
    morning: { sky: 0xcfe8ff, hs: 0xffffff, hg: 0x8fb37a, hi: 1.15, sc: 0xfff0d8, si: 1.6, sp: [-7, 12, 7], tint: 0xffffff, night: 0 },
    day:     { sky: 0xbfe3ff, hs: 0xffffff, hg: 0x8fb37a, hi: 1.2, sc: 0xffffff, si: 1.7, sp: [-3, 14, 6], tint: 0xffffff, night: 0 },
    evening: { sky: 0xffc9a4, hs: 0xffdcb8, hg: 0x7a6a5a, hi: .95, sc: 0xffa564, si: 1.4, sp: [9, 6, 5], tint: 0xffe6cc, night: .35 },
    night:   { sky: 0x161b35, hs: 0x5a68a8, hg: 0x1a1f30, hi: .6, sc: 0xa8b8ff, si: .35, sp: [-6, 12, 4], tint: 0xa9b2e0, night: 1 },
  };
  function applyPhase() {
    if (!scene) return;
    let P = PHASES[phase] || PHASES.day;
    if (!outdoor) P = Object.assign({}, P, { sky: 0x1f1823, hs: 0xfff4e0, hg: 0x8a7a6a, hi: phase === 'night' ? .85 : 1.05, sc: phase === 'night' ? 0xd8c8ff : 0xfff0dd, si: phase === 'night' ? .6 : 1.1, sp: [-4, 10, 6], tint: phase === 'night' ? 0xe6e0ff : 0xffffff, night: 0 });
    scene.background = new T.Color(P.sky);
    scene.fog = outdoor ? new T.Fog(P.sky, camDist + 8, camDist + 30) : null;
    hemi.color.setHex(P.hs); hemi.groundColor.setHex(P.hg); hemi.intensity = P.hi;
    sun.color.setHex(P.sc); sun.intensity = P.si; sun.userData.off = P.sp;
    dyn.windows.forEach(m => m.emissive.setScalar(P.night * .9));
    dyn.emissive.forEach(m => m.emissive.setHex(P.night > .5 ? 0xffd98a : P.night > 0 ? 0x553a10 : 0x000000));
    dyn.lamps.forEach(l => { l.intensity = P.night > .5 ? 4 : 0; });
    actors.forEach(applyTint);
    kick();
  }
  function applyTint(a) { const P = outdoor ? (PHASES[phase] || PHASES.day) : { tint: phase === 'night' ? 0xe6e0ff : 0xffffff }; a.mat.color.setHex(P.tint); }
  function setPhase(p) { phase = p; applyPhase(); }

  /* ---------- gerakan ---------- */
  function tryStep(dir) {
    player.dir = dir;
    const [dx, dy] = DIRS[dir];
    const nx = player.x + dx, ny = player.y + dy;
    if (!free(nx, ny)) {
      const door = (MAPS[mapId].closedDoors || []).find(d => d.x === nx && d.y === ny);
      if (door && handlers.blocked) handlers.blocked(door);
      else if (!route.length) Sound.bump();
      return false;
    }
    player.moving = { fx: player.x, fy: player.y, tx: nx, ty: ny, t: 0 };
    pet.trail.push([player.x, player.y, dir]); if (pet.trail.length > 3) pet.trail.shift();
    player.x = nx; player.y = ny;
    handlers.moved && handlers.moved(mapId, nx, ny, dir);
    return true;
  }

  /* ---------- hewan peliharaan ---------- */
  function placePet() {
    const a = actors.get('pet'); if (a) { root.remove(a.group); actors.delete('pet'); }
    if (!petId) return;
    let px = player.x, py = player.y + 1;
    if (!Maps.walkable(mapId, px, py)) { const alt = [[1, 0], [-1, 0], [0, -1]].map(([dx, dy]) => [player.x + dx, player.y + dy]).find(([x, y]) => Maps.walkable(mapId, x, y)); if (alt) [px, py] = alt; else [px, py] = [player.x, player.y]; }
    Object.assign(pet, { x: px, y: py, fx: px + .5, fy: py + .5, dir: 'down' });
    const pa = makeActor('pet', petId); pa.plane.scale.set(.8, .8, .8);
  }
  function setPet(id) { petId = id; if (root) placePet(); kick(); }
  function updatePet(dt) {
    const a = actors.get('pet'); if (!a) return;
    if (pet.trail.length) {
      const [tx, ty] = pet.trail[0];
      const dx = tx + .5 - pet.fx, dy = ty + .5 - pet.fy, d = Math.hypot(dx, dy);
      if (d > .02) {
        const sp = Math.min(d, dt / STEP_MS);
        pet.fx += dx / d * sp; pet.fy += dy / d * sp;
        pet.dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');
      } else if (pet.trail.length > 1 || !player.moving) pet.trail.shift();
    }
    const moving = pet.trail.length > 0;
    setActorFrame(a, pet.dir === 'left' ? 'left' : pet.dir === 'right' ? 'right' : 'down', moving ? (Math.floor(clockT / 160) % 2) : 0);
    a.group.position.set(pet.fx, moving ? Math.abs(Math.sin(clockT / 90)) * .05 : 0, pet.fy);
  }

  /* ---------- pemain lain (online) ---------- */
  function nameTag(text, bubble) {
    const cv = makeCanvas(bubble ? 512 : 256, 64, (c, w, h) => {
      c.font = bubble ? '700 28px "Zen Maru Gothic","Noto Sans JP",sans-serif' : '700 20px "DotGothic16",sans-serif';
      const tw = Math.min(w - 8, c.measureText(text).width + 24);
      c.fillStyle = bubble ? '#fffaf0' : 'rgba(42,31,45,.8)'; c.strokeStyle = '#2a1f2d'; c.lineWidth = 4;
      const x = (w - tw) / 2, y = bubble ? 6 : 18, hh = bubble ? 44 : 30;
      c.beginPath(); c.roundRect ? c.roundRect(x, y, tw, hh, 10) : c.rect(x, y, tw, hh); c.fill(); if (bubble) c.stroke();
      c.fillStyle = bubble ? '#2a1f2d' : '#fff'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(text, w / 2, y + hh / 2 + 1);
    });
    const t = new T.CanvasTexture(cv); t.colorSpace = T.SRGBColorSpace;
    const s = new T.Sprite(new T.SpriteMaterial({ map: t, depthTest: false, transparent: true }));
    s.scale.set(2, .5, 1); s.renderOrder = 11; return s;
  }
  function setOthers(list) {
    const seen = new Set();
    list.forEach(o => {
      seen.add(o.id);
      const cur = others.get(o.id) || { fx: o.x + .5, fy: o.y + .5 };
      Object.assign(cur, o); others.set(o.id, cur);
    });
    [...others.keys()].forEach(id => { if (!seen.has(id)) { const o = others.get(id); if (o.actor) { root && root.remove(o.actor.group); actors.delete('o:' + id); } others.delete(id); } });
    syncOthers();
  }
  function syncOthers() {
    if (!root) return;
    others.forEach((o, id) => {
      const here = o.map === mapId;
      if (!here) { if (o.actor) { root.remove(o.actor.group); actors.delete('o:' + id); o.actor = null; } return; }
      if (!o.actor) {
        o.actor = makeActor('o:' + id, o.sprite);
        const tag = nameTag(o.name || '???'); tag.position.set(0, 1.85, 0); o.actor.group.add(tag);
        o.fx = o.x + .5; o.fy = o.y + .5;
      }
    });
  }
  function sayOther(id, text) {
    const o = id === 'me' ? { actor: actors.get('player') } : others.get(id);
    if (!o || !o.actor) return;
    if (o.bubbleSprite) o.actor.group.remove(o.bubbleSprite);
    const b = nameTag(text, true); b.scale.set(4.4, .55, 1); b.position.set(0, 2.35, 0);
    o.actor.group.add(b); o.bubbleSprite = b;
    clearTimeout(o.bubbleT); o.bubbleT = setTimeout(() => { o.actor && o.actor.group.remove(b); }, 4500);
    kick();
  }
  function updateOthers(dt) {
    others.forEach(o => {
      if (!o.actor) return;
      const dx = o.x + .5 - o.fx, dy = o.y + .5 - o.fy, d = Math.hypot(dx, dy);
      if (d > 3) { o.fx = o.x + .5; o.fy = o.y + .5; }
      else if (d > .01) { const sp = Math.min(d, dt / STEP_MS); o.fx += dx / d * sp; o.fy += dy / d * sp; }
      setActorFrame(o.actor, o.dir || 'down', d > .05 ? (Math.floor(clockT / 150) % 2 ? 1 : 2) : 0);
      o.actor.group.position.set(o.fx, d > .05 ? Math.abs(Math.sin(clockT / 70)) * .06 : 0, o.fy);
    });
  }

  function update(dt) {
    clockT += dt;
    if (!paused) {
      if (player.moving) {
        const m = player.moving; m.t += dt / STEP_MS;
        if (m.t >= 1) {
          player.fx = m.tx + .5; player.fy = m.ty + .5; player.moving = null; player.frame = (player.frame + 1) % 4;
          const w = (MAPS[mapId].warps || []).find(w => w.x === player.x && w.y === player.y);
          if (w) { route = []; held = null; handlers.warp(w); return; }
          if (!route.length && routeGoal) { const g = routeGoal; routeGoal = null; arrive(g); }
        } else {
          player.fx = m.fx + .5 + (m.tx - m.fx) * m.t; player.fy = m.fy + .5 + (m.ty - m.fy) * m.t;
        }
      }
      if (!player.moving) {
        if (route.length) {
          const [nx, ny] = route.shift();
          const dir = nx > player.x ? 'right' : nx < player.x ? 'left' : ny > player.y ? 'down' : 'up';
          if (!tryStep(dir)) { route = []; routeGoal = null; }
        } else if (held) tryStep(held);
      }
    }
    // pemain
    const pa = actors.get('player');
    if (pa) {
      const walking = !!player.moving;
      setActorFrame(pa, player.dir, walking ? (player.frame % 2 ? 1 : 2) : 0);
      const bob = walking ? Math.abs(Math.sin(clockT / 70)) * .06 : 0;
      pa.group.position.set(player.fx, bob, player.fy);
      pa.plane.scale.y = walking ? 1 : 1 + Math.sin(clockT / 500) * .015;
    }
    // NPC bernapas & penanda melayang
    npcs.forEach(n => {
      const a = actors.get('npc:' + n.id); if (!a) return;
      setActorFrame(a, n.dir, 0);
      a.plane.scale.y = 1 + Math.sin(clockT / 520 + a.phase) * .02;
      if (a.marker) a.marker.position.y = 1.95 + Math.sin(clockT / 260) * .06;
    });
    updatePet(dt); updateOthers(dt);
    if (dyn.water) dyn.water.offset.x = (clockT / 9000) % 1;
    if (dyn.petals) {
      const p = dyn.petals.geometry.attributes.position, arr = p.array;
      for (let i = 0; i < arr.length; i += 3) {
        arr[i + 1] -= dt * .0006; arr[i] += Math.sin(clockT / 900 + i) * dt * .0003;
        if (arr[i + 1] < 0) { arr[i + 1] = 6; arr[i] = camTarget.x + Math.random() * 16 - 8; arr[i + 2] = camTarget.z + Math.random() * 14 - 9; }
      }
      p.needsUpdate = true;
    }
    updateCamera(dt, false);
  }

  function updateCamera(dt, snap) {
    let tx = player.fx, tz = player.fy;
    if (!outdoor) { tx = W / 2; tz = H / 2 + .3; }
    else {
      const half = 3.5; tx = Math.max(half, Math.min(W - half, tx)); tz = Math.max(2, Math.min(H - 1.5, tz));
    }
    tmpV.set(tx, 0, tz);
    if (snap) camTarget.copy(tmpV); else camTarget.lerp(tmpV, 1 - Math.pow(.002, dt / 1000));
    camera.position.set(camTarget.x, camTarget.y + camDist * Math.sin(PITCH), camTarget.z + camDist * Math.cos(PITCH));
    camera.lookAt(camTarget.x, .5, camTarget.z);
    const off = sun.userData.off || [-5, 12, 6];
    sun.position.set(camTarget.x + off[0], off[1], camTarget.z + off[2]); sun.target.position.copy(camTarget);
  }

  function frame(t) {
    if (!running) return;
    const dt = Math.min(50, t - (lastT || t)); lastT = t;
    update(dt);
    const minGap = paused ? 90 : quality === 'low' ? 33 : 0;
    if (t - lastRender >= minGap && root) { renderer.render(scene, camera); lastRender = t; }
    if (document.hidden) { running = false; lastT = 0; return; }
    requestAnimationFrame(frame);
  }
  function kick() { if (!running && renderer) { running = true; requestAnimationFrame(frame); } }

  /* ---------- input ---------- */
  function hold(dir) { if (paused) return; held = dir; route = []; routeGoal = null; }
  function release(dir) { if (!dir || held === dir) held = null; }
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
    if (n) { n.dir = { up: 'down', down: 'up', left: 'right', right: 'left' }[dir]; return { type: 'npc', npc: n }; }
    return Maps.interactAt(mapId, fx, fy);
  }

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
      if (prev.size > 3000) break;
    }
    return null;
  }

  function walkTo(tx, ty) {
    if (paused) return false;
    const n = npcAt(tx, ty);
    const special = n || Maps.interactAt(mapId, tx, ty);
    if (special) {
      let goals = [];
      Object.entries(DIRS).forEach(([d, [dx, dy]]) => {
        const sx = tx - dx, sy = ty - dy;
        if (free(sx, sy) || (sx === player.x && sy === player.y)) goals.push([sx, sy, d]);
        // lewat meja/konter
        if (n && Maps.across(mapId, sx, sy)) { const ax = sx - dx, ay = sy - dy; if (free(ax, ay) || (ax === player.x && ay === player.y)) goals.push([ax, ay, d]); }
      });
      if (!goals.length) return false;
      const p = findPath(goals.map(g => [g[0], g[1]]));
      if (!p) return false;
      const end = p.length ? p[p.length - 1] : [player.x, player.y];
      const g = goals.find(g => g[0] === end[0] && g[1] === end[1]);
      route = p; routeGoal = { face: g[2] }; held = null;
      if (!p.length) { const r = routeGoal; routeGoal = null; arrive(r); }
      return true;
    }
    if (!free(tx, ty)) return false;
    const p = findPath([[tx, ty]]);
    if (!p) return false;
    route = p; routeGoal = {}; held = null; return true;
  }
  function arrive(g) {
    if (g.face) { player.dir = g.face; const t = target(player.x, player.y, g.face); if (t) handlers.interact(t); }
  }

  function onTap(e) {
    if (paused || UI.dialogOpen()) return;
    const r = canvasEl.getBoundingClientRect();
    const ndc = new T.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    // ketuk karakter langsung
    const petA = actors.get('pet');
    if (petA && raycaster.intersectObject(petA.plane, false)[0] && Math.abs(pet.x - player.x) + Math.abs(pet.y - player.y) <= 2) { handlers.interact({ type: 'pet' }); return; }
    const planes = npcs.map(n => actors.get('npc:' + n.id)).filter(Boolean).map(a => a.plane);
    const hit = raycaster.intersectObjects(planes, false)[0];
    if (hit) {
      const a = [...actors.values()].find(a => a.plane === hit.object);
      const n = npcs.find(n => 'npc:' + n.id === a.key);
      if (n && walkTo(n.x, n.y)) return;
    }
    const pt = raycaster.ray.intersectPlane(groundPlane, tmpV);
    if (!pt) return;
    const tx = Math.floor(pt.x), ty = Math.floor(pt.z);
    if (tx === player.x && ty === player.y) return;
    if (!walkTo(tx, ty)) {
      // coba ubin di atasnya (mengetuk bagian atas benda tinggi)
      if (!walkTo(tx, ty - 1)) Sound.bump();
    }
  }

  function pause(on) { paused = on; if (on) { held = null; route = []; routeGoal = null; } kick(); }
  function refresh() { kick(); }
  function refreshLook(prefix = 'player:') { [...texCache.keys()].forEach(k => { if (k.startsWith(prefix)) { texCache.get(k).dispose(); texCache.delete(k); } }); const a = actors.get('player'); if (a) { a.dir = null; } }

  return {
    init, load, setNpcs, hold, release, action, walkTo, pause, refresh, resize, setPhase, setQuality, refreshLook,
    setPet, setOthers, sayOther, online: true,
    get map() { return mapId; }, get player() { return player; }, get npcs() { return npcs; }, is3D: true,
  };
})();
