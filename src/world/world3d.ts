/* =========================================================
   DUNIA 3D (Three.js + TypeScript)
   Kota, rumah, dan sekolah dibangun dari bentuk 3D low-poly,
   sedangkan karakter tetap pixel art lucu yang berdiri di dunia 3D (gaya "HD-2D").
   API-nya sama dengan World 2D (public/js/world.js) supaya game.js tidak peduli
   mode mana yang dipakai.
   ========================================================= */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as THREE from 'three';

type Quality = 'low' | 'normal' | 'high';
interface Actor { key: string; id: string; group: THREE.Group; plane: THREE.Mesh; mat: THREE.MeshBasicMaterial; shadow: THREE.Mesh; marker: THREE.Sprite | null; dir: string | null; frame: number; phase: number; }
interface Npc { id: string; key?: string; x: number; y: number; dir: Dir; marker?: any; [k: string]: any }
interface Other { id: string; name?: string; map?: string; x: number; y: number; fx: number; fy: number; dir?: Dir; sprite?: string; actor?: Actor | null; bubbleSprite?: THREE.Sprite; bubbleT?: number }

const DIRS: Record<Dir, [number, number]> = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
const STEP_MS = 210;
const PITCH = 52 * Math.PI / 180, FOV = 36;

let renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera, canvasEl: HTMLCanvasElement;
let root: THREE.Group | null = null, mapId: string | null = null, W = 0, H = 0, outdoor = false;
let npcs: Npc[] = [];
const actors = new Map<string, Actor>();
const player = { x: 0, y: 0, fx: 0, fy: 0, dir: 'down' as Dir, moving: null as null | { fx: number; fy: number; tx: number; ty: number; t: number }, frame: 0 };
let held: Dir | null = null, route: [number, number][] = [], routeGoal: { face?: Dir } | null = null, paused = false;
let handlers: any = {};
let phase = 'morning', quality: Quality = 'normal', weather = 'sun';
let rain: THREE.LineSegments | null = null;
let dyn: { water: THREE.Texture | null; petals: THREE.Points | null; lamps: any[]; windows: THREE.MeshLambertMaterial[]; emissive: THREE.MeshLambertMaterial[]; train?: THREE.Group | null; fountain?: THREE.Mesh | null } = { water: null, petals: null, lamps: [], windows: [], emissive: [] };
let hemi: THREE.HemisphereLight, sun: THREE.DirectionalLight, camDist = 16;
const camTarget = new THREE.Vector3(), tmpV = new THREE.Vector3();
const raycaster = new THREE.Raycaster(), groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
let running = false, lastT = 0, lastRender = 0, clockT = 0;
let petId: string | null = null;
const pet = { x: 0, y: 0, fx: 0, fy: 0, dir: 'down' as Dir, trail: [] as [number, number, Dir][] };
const others = new Map<string, Other>();

/* ---------- tekstur ---------- */
function pixelTex(cv: HTMLCanvasElement) {
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace; t.magFilter = THREE.NearestFilter; t.minFilter = THREE.NearestFilter; t.generateMipmaps = false;
  return t;
}
function makeCanvas(w: number, h: number, draw: (c: CanvasRenderingContext2D, w: number, h: number) => void) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d')!, w, h); return c;
}
const texCache = new Map<string, THREE.Texture>();
function spriteTex(id: string, dir: string, frame: number) {
  const key = `${id}:${dir}:${frame}`;
  let t = texCache.get(key);
  if (!t) { t = pixelTex(Pix.sprite(id, dir, frame)); texCache.set(key, t); }
  return t;
}
const lam = (color: number, extra?: THREE.MeshLambertMaterialParameters) => new THREE.MeshLambertMaterial(Object.assign({ color }, extra || {}));
const flat = (color: number) => new THREE.MeshLambertMaterial({ color, flatShading: true });

/* ---------- inisialisasi ---------- */
function init(canvas: HTMLCanvasElement, h: any) {
  canvasEl = canvas; handlers = h;
  renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'default' });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 120);
  hemi = new THREE.HemisphereLight(0xffffff, 0x88aa77, 1.1); scene.add(hemi);
  sun = new THREE.DirectionalLight(0xffffff, 1.5);
  sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left: -12, right: 12, top: 12, bottom: -12, near: 1, far: 50 });
  sun.shadow.bias = -0.0008;
  scene.add(sun, sun.target);
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
function setQuality(q: Quality) { if (q === quality) return; quality = q; applyQuality(); if (mapId) { const p = { ...player }; load(mapId, p.x, p.y, p.dir, npcs); } }

function resize() {
  const box = canvasEl.parentElement!.getBoundingClientRect();
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
    const m = o as THREE.Mesh;
    if (m.geometry) m.geometry.dispose();
    if (m.material) (Array.isArray(m.material) ? m.material : [m.material]).forEach((mt: any) => { if (mt.map && !mt.map.userData.keep) mt.map.dispose(); mt.dispose(); });
  });
  root = null; actors.clear(); dyn = { water: null, petals: null, lamps: [], windows: [], emissive: [] };
}

function box(w: number, h: number, d: number, mat: THREE.Material | THREE.Material[], x: number, y: number, z: number, shadow = true) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z); m.castShadow = shadow; m.receiveShadow = true; root!.add(m); return m;
}
function cyl(rt: number, rb: number, h: number, seg: number, mat: THREE.Material, x: number, y: number, z: number) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat);
  m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; root!.add(m); return m;
}
function gableRoof(w: number, d: number, h: number, mat: THREE.Material, x: number, y: number, z: number) {
  const g = new THREE.BufferGeometry();
  const a = w / 2, b = d / 2;
  const v = [
    -a, 0, b, a, 0, b, a, h, 0, -a, 0, b, a, h, 0, -a, h, 0,
    a, 0, -b, -a, 0, -b, -a, h, 0, a, 0, -b, -a, h, 0, a, h, 0,
    -a, 0, -b, -a, 0, b, -a, h, 0,
    a, 0, b, a, 0, -b, a, h, 0,
    -a, 0, -b, a, 0, -b, a, 0, b, -a, 0, -b, a, 0, b, -a, 0, b,
  ];
  g.setAttribute('position', new THREE.Float32BufferAttribute(v, 3)); g.computeVertexNormals();
  const m = new THREE.Mesh(g, mat); m.position.set(x, y, z); m.castShadow = true; root!.add(m); return m;
}
const facade = (w: number, h: number, draw: (c: CanvasRenderingContext2D, w: number, h: number) => void) => pixelTex(makeCanvas(w, h, draw));

function buildGround(id: string) {
  const map = MAPS[id];
  const tex = new THREE.CanvasTexture(Maps.render(id, { ground: true }));
  tex.colorSpace = THREE.SRGBColorSpace; tex.magFilter = THREE.NearestFilter; tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
  const g = new THREE.Mesh(new THREE.PlaneGeometry(W, H), lam(0xffffff, { map: tex }));
  g.rotation.x = -Math.PI / 2; g.position.set(W / 2, 0, H / 2); g.receiveShadow = true; root!.add(g);
  if (map.outdoor) {
    const out = new THREE.Mesh(new THREE.PlaneGeometry(160, 160), lam(0x5f9a52));
    out.rotation.x = -Math.PI / 2; out.position.set(W / 2, -0.02, H / 2); out.receiveShadow = true; root!.add(out);
  }
}

function buildWater(list: [number, number][]) {
  if (!list.length) return;
  const cv = makeCanvas(32, 32, (c) => {
    c.clearRect(0, 0, 32, 32); c.fillStyle = 'rgba(255,255,255,.55)';
    [[3, 6, 8], [18, 12, 6], [8, 21, 9], [22, 27, 7]].forEach(([x, y, w]) => c.fillRect(x, y, w, 1));
  });
  const tex = pixelTex(cv); tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: .7, depthWrite: false });
  const geo = new THREE.PlaneGeometry(1, 1); geo.rotateX(-Math.PI / 2);
  const inst = new THREE.InstancedMesh(geo, mat, list.length);
  const m4 = new THREE.Matrix4();
  list.forEach(([x, y], i) => { m4.makeTranslation(x + .5, 0.03, y + .5); inst.setMatrixAt(i, m4); });
  root!.add(inst); dyn.water = tex;
}

function buildTrees(list: [number, number, boolean][]) {
  if (!list.length) return;
  const trunkGeo = new THREE.CylinderGeometry(0.09, 0.14, 0.9, 6); trunkGeo.translate(0, 0.45, 0);
  const leafGeo = new THREE.IcosahedronGeometry(0.58, 0);
  const trunks = new THREE.InstancedMesh(trunkGeo, flat(0x7a4f35), list.length);
  const leaves = new THREE.InstancedMesh(leafGeo, flat(0xffffff), list.length * 2);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3(), c = new THREE.Color();
  const GREEN = [0x4f9a5e, 0x428f55, 0x5aa866, 0x3f8a52], PINK = [0xf3adc4, 0xf7bfd1, 0xeb9fb9, 0xf9cbd8];
  list.forEach(([x, y, pink], i) => {
    const h = Maps.hash(x, y, 7), r = (h % 100) / 100;
    trunks.setMatrixAt(i, m4.makeTranslation(x + .5, 0, y + .5));
    for (let k = 0; k < 2; k++) {
      const sc = k === 0 ? 1 + r * .25 : .62 + r * .15;
      q.setFromEuler(new THREE.Euler(r * 2, h % 7, r));
      p.set(x + .5 + (k ? (r - .5) * .5 : 0), k ? 1.55 + r * .2 : 1.2, y + .5 + (k ? .1 : 0));
      s.set(sc, sc * .92, sc);
      leaves.setMatrixAt(i * 2 + k, m4.compose(p, q, s));
      c.setHex((pink ? PINK : GREEN)[(h >>> (k * 3)) % 4]); leaves.setColorAt(i * 2 + k, c);
    }
  });
  trunks.castShadow = leaves.castShadow = true; leaves.receiveShadow = true;
  root!.add(trunks, leaves);
}

function signTex(text: string) {
  const cv = makeCanvas(128, 64, (c, w, h) => {
    c.fillStyle = '#d9a46a'; c.fillRect(0, 0, w, h);
    c.fillStyle = '#b07a4c'; c.fillRect(0, 20, w, 2); c.fillRect(0, 44, w, 2);
    c.strokeStyle = '#6a4228'; c.lineWidth = 6; c.strokeRect(3, 3, w - 6, h - 6);
    c.fillStyle = '#3a2418'; c.textAlign = 'center'; c.textBaseline = 'middle';
    const size = text.length > 5 ? 22 : 30;
    c.font = `700 ${size}px "Zen Maru Gothic","Hiragino Maru Gothic ProN","Noto Sans JP",sans-serif`;
    c.fillText(text, w / 2, h / 2 + 2);
  });
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t;
}

function winPattern(c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, lit: boolean) {
  c.fillStyle = '#2a1f2d'; c.fillRect(x, y, w, h);
  c.fillStyle = lit ? '#ffd98a' : '#9fd0ee'; c.fillRect(x + 2, y + 2, w - 4, h - 4);
  if (!lit) { c.fillStyle = '#d8f0fb'; c.fillRect(x + 3, y + 3, Math.max(2, w / 4), 2); }
  c.fillStyle = '#2a1f2d'; c.fillRect(x + w / 2 - 1, y, 2, h);
}

function buildBuilding(b: any) {
  const cx = b.x + b.w / 2, cz = b.y + b.h / 2;
  const S = 32; // piksel per ubin untuk tekstur dinding
  const doorsX = b.doors.map(([dx]: [number]) => dx - b.x);
  const specs = ({
    house:   { wall: '#f3e6cf', trim: '#d8c4a2', wallH: 1.9, roof: 0xc9574f, roofH: 1.1, door: '#9a6a44', rows: 1 },
    school:  { wall: '#f6eee0', trim: '#e0d2bb', wallH: 2.8, roof: 0x5f74a6, flat: true, door: '#6a7fae', rows: 2 },
    konbini: { wall: '#fbf7ef', trim: '#e3dccf', wallH: 2.0, roof: 0xe9ecef, flat: true, door: '#9fd0ee', rows: 0 },
    station: { wall: '#efe2cf', trim: '#d6c4a6', wallH: 2.3, roof: 0x8a73a6, roofH: 1.2, door: '#6d5a86', rows: 1 },
    shrine:  { wall: '#8a5a36', trim: '#6a4228', wallH: 1.4, roof: 0x4a5a4f, roofH: 1.3, door: '#6a4228', rows: 0 },
  } as Record<string, any>)[b.type] || (() => {
    const sp = (Maps as any).SHOPS[b.type];
    return { wall: sp.wall, trim: '#d8c4a2', wallH: 2.0, roof: new THREE.Color(sp.awning).getHex(), flat: true, door: sp.door, rows: 0, shop: sp };
  })();
  const hPx = Math.round(specs.wallH * S);
  const draw = (lit: boolean) => (c: CanvasRenderingContext2D, w: number, h: number) => {
    c.fillStyle = lit ? '#000' : specs.wall; c.fillRect(0, 0, w, h);
    if (!lit) { c.fillStyle = specs.trim; c.fillRect(0, h - 6, w, 6); for (let y = 10; y < h - 6; y += 12) c.fillRect(0, y, w, 1); }
    if (specs.shop) {
      const sp = specs.shop;
      if (!lit) {
        for (let x = 0; x < w; x += 16) { c.fillStyle = (x / 16) % 2 ? '#ffffff' : sp.awning; c.fillRect(x, 0, 16, 12); }
        c.fillStyle = '#2a1f2d'; c.fillRect(w / 2 - 46, 15, 92, 22); c.fillStyle = sp.board || '#fbf7ef'; c.fillRect(w / 2 - 44, 17, 88, 18);
        c.fillStyle = sp.ink || '#2a1f2d'; c.font = '700 14px "Zen Maru Gothic",sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(sp.sign, w / 2, 27);
      }
      [8, w - 30].forEach(x => { if (!doorsX.some((i: number) => Math.abs(i * S + 16 - x - 11) < 20)) winPattern(c, x, h - 34, 22, 18, lit); });
    } else if (b.type === 'konbini') {
      if (!lit) { c.fillStyle = '#3fa06a'; c.fillRect(0, 4, w, 8); c.fillStyle = '#f29b38'; c.fillRect(0, 12, w, 4); c.fillStyle = '#3f6fb0'; c.fillRect(0, 16, w, 8); }
      c.fillStyle = '#2a1f2d'; c.fillRect(8, 28, w - 16, h - 36);
      c.fillStyle = lit ? '#ffe7a8' : '#a9d8f2'; c.fillRect(10, 30, w - 20, h - 40);
      if (!lit) [['#e9d8b0', 16], ['#f28fb0', 60], ['#f6e05e', 110], ['#8fd3b0', 150]].forEach(([col, x]) => { c.fillStyle = col as string; c.fillRect(x as number, h - 22, 26, 10); });
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
    doorsX.forEach((i: number) => {
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
  const plain = lam(new THREE.Color(specs.wall).getHex());
  const frontMat = lam(0xffffff, { map: front, emissiveMap: glow, emissive: 0x000000 });
  dyn.windows.push(frontMat);
  const sideMat = lam(0xffffff, { map: side });
  box(b.w, specs.wallH, b.h, [sideMat, sideMat, plain, plain, frontMat, sideMat], cx, specs.wallH / 2, cz);

  if (specs.flat) {
    box(b.w + .3, .25, b.h + .3, flat(specs.roof), cx, specs.wallH + .12, cz);
    if (b.type === 'school') {
      const tw = 2.2, td = 1.6, th = 1.6;
      box(tw, th, td, lam(0xf6eee0), cx, specs.wallH + th / 2, b.y + b.h - td / 2 - 0.4);
      const roof = new THREE.Mesh(new THREE.ConeGeometry(1.75, 1, 4), flat(specs.roof));
      roof.rotation.y = Math.PI / 4; roof.position.set(cx, specs.wallH + th + .5, b.y + b.h - td / 2 - 0.4); roof.castShadow = true; root!.add(roof);
      const clock = facade(64, 64, (c) => {
        c.fillStyle = '#2a1f2d'; c.beginPath(); c.arc(32, 32, 30, 0, 7); c.fill();
        c.fillStyle = '#fbf7ef'; c.beginPath(); c.arc(32, 32, 26, 0, 7); c.fill();
        c.fillStyle = '#2a1f2d'; c.fillRect(31, 12, 3, 22); c.fillRect(31, 31, 14, 3);
      });
      const cm = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.1), new THREE.MeshBasicMaterial({ map: clock, transparent: true }));
      cm.position.set(cx, specs.wallH + th / 2, b.y + b.h - 0.39); root!.add(cm);
      box(2.4, .12, .6, flat(0xd8455d), cx, 1.5, b.y + b.h + .25);
    }
    if (b.type === 'konbini') box(b.w, .12, .7, flat(0x3fa06a), cx, 1.35, b.y + b.h + .3);
    if (specs.shop) box(b.w, .1, .6, flat(specs.roof), cx, 1.55, b.y + b.h + .28);
  } else {
    gableRoof(b.w + .5, b.h + .6, specs.roofH, flat(specs.roof), cx, specs.wallH, cz);
    box(b.w + .5, .08, .12, flat(0x2a1f2d), cx, specs.wallH + .02, b.y + b.h + .3, false);
  }
  if (b.type === 'station') {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(1.4, .7), lam(0xffffff, { map: signTex('えき') }));
    m.position.set(cx, specs.wallH - .45, b.y + b.h + .01); root!.add(m);
  }
}

function buildTorii(pr: any) {
  const red = flat(0xd8455d), black = flat(0x2a1f2d);
  const z = pr.y + .5, x1 = pr.x + .5, x2 = pr.x + pr.w - .5;
  cyl(.1, .12, 2.3, 8, red, x1, 1.15, z); cyl(.1, .12, 2.3, 8, red, x2, 1.15, z);
  box(pr.w + .6, .16, .32, black, (x1 + x2) / 2, 2.38, z);
  box(pr.w + .3, .12, .22, red, (x1 + x2) / 2, 2.22, z);
  box(pr.w - .2, .12, .16, red, (x1 + x2) / 2, 1.85, z);
}

function buildSigns(map: any) {
  const wood = flat(0x8a5a36);
  (map.signs || []).forEach((s: any) => {
    cyl(.05, .05, .7, 5, wood, s.x + .5, .35, s.y + .5);
    const mats = [wood, wood, wood, wood, lam(0xffffff, { map: signTex(s.text) }), wood];
    box(1.0, .5, .08, mats, s.x + .5, .8, s.y + .55);
  });
}

function buildOutdoorProps(map: any) {
  const trees: [number, number, boolean][] = [], water: [number, number][] = [];
  const post = flat(0x5b5f6e), woodL = flat(0xd19a66), wood = flat(0x8a5a36);
  const lamps: [number, number][] = [];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const t = Maps.tileAt(mapId!, x, y), X = x + .5, Z = y + .5;
    if (t === 'T' || t === 'P') trees.push([x, y, t === 'P']);
    else if (t === 'W') water.push([x, y]);
    else if (t === '#') { box(.1, .6, .1, wood, X - .3, .3, Z); box(.1, .6, .1, wood, X + .3, .3, Z); box(1, .08, .06, woodL, X, .45, Z); box(1, .08, .06, woodL, X, .22, Z); }
    else if (t === 'b') { box(.9, .08, .35, woodL, X, .35, Z); box(.9, .3, .06, woodL, X, .55, Z - .16); box(.08, .35, .3, wood, X - .38, .17, Z); box(.08, .35, .3, wood, X + .38, .17, Z); }
    else if (t === 'L') {
      cyl(.05, .07, 1.9, 6, post, X, .95, Z);
      const lm = lam(0xfff3b0, { emissive: 0x000000 }); dyn.emissive.push(lm);
      box(.3, .3, .3, lm, X, 2.0, Z, false);
      lamps.push([X, Z]);
    } else if (t === 'V') {
      box(.8, 1.4, .6, flat(0xd8455d), X, .7, Z);
      const vm = lam(0xbfe6f5, { emissive: 0x000000 }); dyn.emissive.push(vm);
      box(.6, .7, .02, vm, X, .9, Z + .31, false);
    } else if (t === 'M') { cyl(.04, .04, .7, 5, post, X, .35, Z); box(.4, .5, .35, flat(0xd8455d), X, .9, Z); }
    else if (t === 'Y') {
      box(.95, .7, .7, wood, X, .45, Z); box(.95, .06, .75, woodL, X, .82, Z);
      [-.42, .42].forEach(dx => box(.06, 1.2, .06, wood, X + dx, 1.2, Z + .3));
      const aw = facade(32, 16, (c) => { for (let i = 0; i < 4; i++) { c.fillStyle = i % 2 ? '#ffffff' : '#d8455d'; c.fillRect(i * 8, 0, 8, 16); } });
      box(1.1, .08, .9, lam(0xffffff, { map: aw }), X, 1.82, Z + .1);
      cyl(.07, .07, .2, 8, lam(0xf28c3c, { emissive: 0x331500 }), X - .3, 1.55, Z + .42);
      box(.3, .12, .2, flat(0xf6d44a), X + .15, .9, Z);
    }
    else if (t === 'O') {
      if (Maps.tileAt(mapId!, x - 1, y) !== 'O' && Maps.tileAt(mapId!, x, y - 1) !== 'O') {
        const stone = flat(0xc9ccd3);
        cyl(1.0, 1.05, .35, 20, stone, X + .5, .18, Z + .5);
        const wtr = new THREE.Mesh(new THREE.CylinderGeometry(.88, .88, .05, 20), lam(0x5aa6de, { emissive: 0x0a2a44 }));
        wtr.position.set(X + .5, .34, Z + .5); root!.add(wtr);
        cyl(.14, .2, .9, 10, stone, X + .5, .6, Z + .5);
        const spray = new THREE.Mesh(new THREE.ConeGeometry(.3, .5, 12, 1, true), new THREE.MeshBasicMaterial({ color: 0xd8f0fb, transparent: true, opacity: .55, side: THREE.DoubleSide }));
        spray.position.set(X + .5, 1.25, Z + .5); spray.rotation.x = Math.PI; root!.add(spray); dyn.fountain = spray;
      }
    }
    else if (t === 'u') {
      cyl(.03, .03, 1.5, 6, flat(0xf4f1ea), X, .75, Z);
      const top = new THREE.Mesh(new THREE.ConeGeometry(.8, .35, 8), flat((x + y) % 2 ? 0xe35f6b : 0x3f6fb0));
      top.position.set(X, 1.55, Z); top.castShadow = true; root!.add(top);
      box(.5, .06, .9, flat(0xf6e05e), X + .45, .05, Z + .3);
    }
    else if (t === '*') {
      const sh = new THREE.Mesh(new THREE.SphereGeometry(.14, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), flat(0xf7c6d3));
      sh.position.set(X, .02, Z); sh.scale.set(1, .6, 1.2); sh.castShadow = true; root!.add(sh);
    }
    else if (t === 'B') { box(1, .12, 1, woodL, X, .1, Z); if (x === 13) box(.08, .35, 1, wood, X - .45, .3, Z); else box(.08, .35, 1, wood, X + .45, .3, Z); }
  }
  buildTrees(trees); buildWater(water);
  (map.buildings || []).forEach(buildBuilding);
  (map.props || []).forEach((pr: any) => pr.type === 'torii' && buildTorii(pr));
  buildSigns(map);
  if (quality !== 'low') dyn.lamps = lamps.slice(0, 4).map(([x, z]) => { const l = new THREE.PointLight(0xffd98a, 0, 6, 1.6); l.position.set(x, 1.9, z); root!.add(l); return l; });
  if (quality !== 'low' && Save.d.settings.fx !== false) {
    const N = 70, pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) { pos[i * 3] = Math.random() * 20 - 10; pos[i * 3 + 1] = Math.random() * 6; pos[i * 3 + 2] = Math.random() * 20 - 10; }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const p = new THREE.Points(g, new THREE.PointsMaterial({ color: 0xf7b6c8, size: .1 }));
    root!.add(p); dyn.petals = p;
  }
}

function buildIndoorProps() {
  const wallMat = lam(0xeadcc3), wallTop = lam(0xcdb895), wood = flat(0xb07a4c), woodD = flat(0x8a5a36), white = flat(0xf4f1ea);
  const done = new Set<string>();
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const t = Maps.tileAt(mapId!, x, y), X = x + .5, Z = y + .5;
    const front = y === H - 1;
    if (t === 'W' || t === 'n' || t === 'K') {
      const h = front ? .3 : 1.7;
      box(1, h, 1, [wallMat, wallMat, wallTop, wallMat, wallMat, wallMat], X, h / 2, Z, false);
      const below = Maps.tileAt(mapId!, x, y + 1);
      if (!front && !'WnK'.includes(below)) box(1, .18, .04, woodD, X, .09, Z + .52, false);
      if (t === 'n' && !'WnK'.includes(below)) {
        const wm = lam(0x9fd0ee, { emissive: 0x000000 }); dyn.emissive.push(wm);
        box(.7, .6, .03, wm, X, 1.05, Z + .52, false); box(.04, .6, .04, woodD, X, 1.05, Z + .54, false);
      }
      if (t === 'K' && !done.has('K')) {
        done.add('K');
        let n = 0; while (Maps.tileAt(mapId!, x + n, y) === 'K') n++;
        const bt = facade(n * 32, 36, (c, w) => {
          c.fillStyle = '#2f5d50'; c.fillRect(0, 0, w, 36); c.fillStyle = '#e9efe6';
          c.font = '700 16px "Zen Maru Gothic",sans-serif'; c.textAlign = 'center'; c.fillText(mapId === 'class' ? 'にほんご ・ カタカナ' : '', w / 2, 23);
        });
        box(n - .1, .95, .06, [woodD, woodD, woodD, woodD, lam(0xffffff, { map: bt }), woodD], x + n / 2, 1.0, Z + .53, false);
      }
      continue;
    }
    if (t === '#') { box(1, .9, .06, flat(0x3f8f58), X, .45, Z, false); continue; }
    if (t === 'D') { box(.8, .06, .6, flat(0xd19a66), X, .62, Z - .05); box(.7, .5, .06, woodD, X, .33, Z - .3); box(.5, .06, .45, flat(0x8a8f9e), X, .35, Z + .35); box(.5, .4, .05, flat(0x8a8f9e), X, .55, Z + .56); }
    else if (t === 'T') box(1, .8, .7, wood, X, .4, Z);
    else if (t === 'd') { box(1, .75, .7, wood, X, .375, Z - .1); if (Maps.tileAt(mapId!, x - 1, y) === 'd') { const lm = lam(0xfff3b0, { emissive: 0x332200 }); box(.2, .3, .2, lm, X, .9, Z - .2); } }
    else if (t === 'b') {
      if (done.has('b')) continue; done.add('b');
      box(1.9, .35, 1.9, white, X + .45, .18, Z + .45); box(1.8, .1, 1.2, flat(0x7fa8dd), X + .45, .4, Z + .75); box(1.2, .14, .5, white, X + .45, .42, Z - .15);
    }
    else if (t === 'p') { cyl(.2, .15, .35, 8, flat(0xc46b4a), X, .18, Z); const lf = new THREE.Mesh(new THREE.IcosahedronGeometry(.32, 0), flat(0x3f8f58)); lf.position.set(X, .6, Z); lf.castShadow = true; root!.add(lf); }
    else if (t === 'k') box(1, .9, .8, [white, white, flat(0xe8e2d6), white, flat(0xd8d0c2), white], X, .45, Z - .1);
    else if (t === 'F') box(.9, 1.6, .8, flat(0xeef1f4), X, .8, Z - .1);
    else if (t === 't') box(1, .35, 1, flat(0xd19a66), X, .18, Z);
    else if (t === 'C') box(.9, 1.6, .7, wood, X, .8, Z - .1);
    else if (t === 'S') {
      const st = facade(32, 48, (c) => { c.fillStyle = '#7a4f35'; c.fillRect(0, 0, 32, 48); ['#c9574f', '#3f6fb0', '#f2c14e', '#5aa878', '#8a78c8'].forEach((col, i) => { c.fillStyle = col; c.fillRect(3 + (i % 3) * 9, 4 + Math.floor(i / 3) * 22, 6, 18); }); });
      box(.95, 1.5, .5, [woodD, woodD, woodD, woodD, lam(0xffffff, { map: st }), woodD], X, .75, Z - .2);
    }
    else if (t === 'Q') { if (!done.has('Q')) { done.add('Q'); cyl(.8, .8, 1.3, 10, flat(0xc9ccd3), X + .5, .65, Z + .5); } }
    else if (t === 'G') {
      const gt = facade(32, 48, (c) => {
        c.fillStyle = '#e9ecef'; c.fillRect(0, 0, 32, 48);
        const cols = ['#e35f6b', '#f6d44a', '#5bb3a0', '#3f6fb0', '#f29b38', '#f7b6c8'];
        for (let r = 0; r < 3; r++) { c.fillStyle = '#9a9ea8'; c.fillRect(0, 14 + r * 16, 32, 2); for (let i = 0; i < 4; i++) { c.fillStyle = cols[(Maps.hash(x, y, r * 4 + i) >> 3) % 6]; c.fillRect(2 + i * 8, 3 + r * 16, 6, 11); } }
      });
      const gm = lam(0xffffff, { map: gt }), side = flat(0xd8dce2);
      box(.95, 1.25, .6, [side, side, side, side, gm, gm], X, .63, Z);
    }
    else if (t === 'I') {
      const im = lam(0xbfe6f5, { emissive: 0x0a2233 }); dyn.emissive.push(im);
      box(.95, 1.7, .7, flat(0xdfe8ee), X, .85, Z - .1);
      box(.8, 1.4, .02, im, X, .9, Z + .26, false);
      [0xe35f6b, 0x3f6fb0, 0x5bb3a0, 0xf6d44a].forEach((col, i) => box(.1, .25, .1, flat(col), X - .3 + i * .2, 1.1, Z + .15, false));
    }
    else if (t === 'R') {
      box(1, .95, .7, [white, white, flat(0xf4f1ea), white, flat(0x3fa06a), white], X, .48, Z);
      if ((x + y) % 2) { box(.4, .3, .35, flat(0x5b5f6e), X, 1.1, Z - .05); box(.25, .15, .02, lam(0x9fe0b0, { emissive: 0x1a4a2a }), X, 1.2, Z + .13, false); }
    }
    else if (t === 'J') {
      box(.85, 1.6, .6, flat(0xe9ecef), X, .8, Z - .1);
      box(.65, .45, .02, lam(0x3f6fb0, { emissive: 0x0a1a44 }), X, 1.2, Z + .21, false);
      for (let i = 0; i < 6; i++) box(.16, .1, .03, flat(i % 2 ? 0xf6d44a : 0xf28fb0), X - .2 + (i % 3) * .2, .85 - Math.floor(i / 3) * .15, Z + .21, false);
    }
    else if (t === 'g') { box(.5, .95, .9, flat(0xc9ccd3), X, .48, Z); box(.4, .06, .5, flat(0x3fa06a), X, .98, Z); }
    else if (t === 'Z') {
      const bed = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), flat(0x6a6a70)); bed.rotation.x = -Math.PI / 2; bed.position.set(X, .01, Z); root!.add(bed);
      if (Maps.tileAt(mapId!, x, y + 1) !== 'Z') box(1, .25, .15, flat(0xf6d44a), X, .12, Z + .45, false);
      if (!done.has('rails')) {
        done.add('rails');
        let n = 0; while (Maps.tileAt(mapId!, x + n, y) === 'Z') n++;
        [-.3, .3].forEach(dz => box(n, .05, .06, flat(0xb9bcc4), x + n / 2, .04, y + 1 + dz, false));
        buildTrain(x, n, y + 1);
      }
    }
    else if (t === 'h') { box(.95, .1, .45, flat(0x3f6fb0), X, .42, Z); box(.95, .4, .08, flat(0x5b8fd0), X, .65, Z - .2); box(.08, .4, .4, flat(0x5b5f6e), X - .4, .2, Z); box(.08, .4, .4, flat(0x5b5f6e), X + .4, .2, Z); }
    else if (t === 'N') {
      const wallRow = Maps.tileAt(mapId!, x, y - 1) === 'W' || y === 1;
      const nt = facade(32, 32, (c) => { c.fillStyle = '#2f5d50'; c.fillRect(0, 0, 32, 32); c.fillStyle = '#e9efe6'; for (let i = 0; i < 4; i++) c.fillRect(5, 5 + i * 6, 22 - i * 3, 2); });
      const nm = lam(0xffffff, { map: nt });
      if (wallRow) { box(1, 1.7, 1, [wallMat, wallMat, wallTop, wallMat, wallMat, wallMat], X, .85, Z, false); box(.8, .7, .04, [woodD, woodD, woodD, woodD, nm, woodD], X, 1.05, Z + .52, false); }
      else { cyl(.04, .04, 1.1, 5, woodD, X, .55, Z); box(.8, .6, .06, [woodD, woodD, woodD, woodD, nm, woodD], X, 1.2, Z); }
    }
  }
  const l = new THREE.PointLight(0xffe8c8, quality === 'low' ? 0 : 6, 14, 1.5); l.position.set(W / 2, 3, H / 2); root!.add(l);
}

/* ---------- kereta (stasiun): datang, berhenti, lalu pergi ---------- */
function buildTrain(x0: number, n: number, zc: number) {
  const g = new THREE.Group();
  const body = flat(0xf4f1ea), stripe = flat(0x3fa06a), glass = lam(0x9fd0ee, { emissive: 0x0a2233 }), dark = flat(0x3a3f55);
  const len = 9;
  const add = (w: number, h: number, d: number, m: THREE.Material, px: number, py: number, pz: number) => { const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); b.position.set(px, py, pz); b.castShadow = true; g.add(b); };
  add(len, 1.5, 1.5, body, 0, 1.0, 0);
  add(len, .22, 1.52, stripe, 0, .75, 0);
  add(len - .2, .12, 1.4, dark, 0, 1.8, 0);
  for (let i = -3; i <= 3; i++) add(.8, .5, 1.54, glass, i * 1.2, 1.25, 0);
  add(.1, .8, 1.3, glass, len / 2, 1.2, 0);
  g.position.set(x0 - len, 0, zc);
  g.userData = { x0, n, t: 0, len };
  root!.add(g); dyn.train = g;
}
function updateTrain(dt: number) {
  const g = dyn.train; if (!g) return;
  const u = g.userData as any; u.t = (u.t + dt / 1000) % 22;
  // 0-4 s datang (melambat), 4-12 s berhenti, 12-16 s pergi, sisanya kosong
  const stop = u.x0 + u.n / 2, from = u.x0 - u.len, to = u.x0 + u.n + u.len;
  let x = from;
  if (u.t < 4) { const k = u.t / 4; x = from + (stop - from) * (1 - Math.pow(1 - k, 2)); }
  else if (u.t < 12) x = stop;
  else if (u.t < 16) { const k = (u.t - 12) / 4; x = stop + (to - stop) * k * k; }
  else x = to + 50;
  g.position.x = x; g.visible = u.t < 16;
}

/* ---------- karakter ---------- */
const markerCache = new Map<string, THREE.Texture>();
function markerTex(kind: string) {
  let t = markerCache.get(kind);
  if (!t) {
    t = pixelTex(makeCanvas(12, 14, (c) => {
      c.fillStyle = '#2a1f2d'; c.fillRect(2, 0, 8, 11); c.fillRect(0, 2, 12, 7); c.fillRect(4, 11, 4, 2); c.fillRect(5, 13, 2, 1);
      c.fillStyle = kind === '?' ? '#6fd3e6' : kind === '★' ? '#ff9fc0' : '#ffd24a'; c.fillRect(3, 1, 6, 9); c.fillRect(1, 3, 10, 5); c.fillRect(5, 10, 2, 2);
      c.fillStyle = '#2a1f2d';
      if (kind === '★') { c.fillRect(5, 2, 2, 2); c.fillRect(3, 4, 6, 2); c.fillRect(4, 6, 4, 1); c.fillRect(3, 7, 2, 2); c.fillRect(7, 7, 2, 2); }
      else if (kind === '?') { c.fillRect(4, 2, 4, 1); c.fillRect(7, 3, 1, 2); c.fillRect(5, 5, 2, 1); c.fillRect(5, 6, 1, 1); c.fillRect(5, 8, 1, 1); }
      else { c.fillRect(5, 2, 2, 4); c.fillRect(5, 7, 2, 2); }
    }));
    t.userData.keep = true; markerCache.set(kind, t);
  }
  return t;
}
const PLANE = () => { const g = new THREE.PlaneGeometry(1.5, 1.5); g.translate(0, .7, 0); return g; };
let shadowTex: THREE.Texture | null = null;
function makeActor(key: string, id: string): Actor {
  const g = new THREE.Group();
  const mat = new THREE.MeshBasicMaterial({ map: spriteTex(id, 'down', 0), transparent: true, alphaTest: .5, side: THREE.DoubleSide });
  const plane = new THREE.Mesh(PLANE(), mat); plane.rotation.x = -0.42;
  if (!shadowTex) {
    shadowTex = new THREE.CanvasTexture(makeCanvas(32, 32, (c) => { const gr = c.createRadialGradient(16, 16, 2, 16, 16, 15); gr.addColorStop(0, 'rgba(20,10,25,.55)'); gr.addColorStop(1, 'rgba(20,10,25,0)'); c.fillStyle = gr; c.fillRect(0, 0, 32, 32); }));
    shadowTex.userData.keep = true;
  }
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(.9, .6), new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2; shadow.position.y = .02;
  g.add(shadow, plane);
  root!.add(g);
  const a: Actor = { key, id, group: g, plane, mat, shadow, marker: null, dir: 'down', frame: 0, phase: Math.random() * 6 };
  actors.set(key, a); applyTint(a); return a;
}
function removeActor(key: string) { const a = actors.get(key); if (!a) return; root?.remove(a.group); actors.delete(key); }
function setActorFrame(a: Actor, dir: string, frame: number) {
  if (a.dir === dir && a.frame === frame) return;
  a.dir = dir; a.frame = frame; a.mat.map = spriteTex(a.id, dir, frame); a.mat.needsUpdate = true;
}
function setMarker(a: Actor, kind: string | null) {
  if (a.marker && a.marker.userData.kind === kind) return;
  if (a.marker) { a.group.remove(a.marker); a.marker.material.dispose(); a.marker = null; }
  if (!kind) return;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: markerTex(kind), depthTest: false }));
  s.scale.set(.42, .5, 1); s.position.set(0, 1.95, 0); s.userData.kind = kind; s.renderOrder = 10;
  a.group.add(s); a.marker = s;
}

/* ---------- memuat peta ---------- */
function load(id: string, x: number, y: number, dir: Dir, list: Npc[]) {
  clearMap();
  mapId = id; const map = MAPS[id];
  W = map.rows[0].length; H = map.rows.length; outdoor = !!map.outdoor;
  root = new THREE.Group(); scene.add(root);
  buildGround(id);
  if (outdoor) buildOutdoorProps(map); else buildIndoorProps();
  player.x = x; player.y = y; player.fx = x + .5; player.fy = y + .5; player.dir = dir || 'down';
  player.moving = null; route = []; routeGoal = null; held = null;
  makeActor('player', 'player');
  pet.trail = []; placePet();
  others.forEach(o => { o.actor = null; });
  setNpcs(list || []);
  syncOthers();
  handlers.moved && handlers.moved(mapId, player.x, player.y, player.dir);
  rain = null; buildRain();
  fitCamera(); applyPhase(); updateCamera(0, true);
  kick();
}

function setNpcs(list: Npc[]) {
  npcs = list.map(n => ({ ...n, dir: n.dir || 'down' }));
  [...actors.keys()].forEach(k => { if (k.startsWith('npc:') && !npcs.some(n => 'npc:' + (n.key || n.id) === k)) removeActor(k); });
  npcs.forEach(n => {
    const key = 'npc:' + (n.key || n.id);
    const a = actors.get(key) || makeActor(key, n.id);
    a.group.position.set(n.x + .5, 0, n.y + .5);
    setActorFrame(a, n.dir, 0);
    setMarker(a, n.marker === true ? '!' : n.marker || null);
  });
  kick();
}
const npcAt = (x: number, y: number) => npcs.find(n => n.x === x && n.y === y);
const free = (x: number, y: number) => Maps.walkable(mapId!, x, y) && !npcAt(x, y);

/* ---------- cahaya & suasana ---------- */
const PHASES: Record<string, any> = {
  morning: { sky: 0xcfe8ff, hs: 0xffffff, hg: 0x8fb37a, hi: 1.15, sc: 0xfff0d8, si: 1.6, sp: [-7, 12, 7], tint: 0xffffff, night: 0 },
  day:     { sky: 0xbfe3ff, hs: 0xffffff, hg: 0x8fb37a, hi: 1.2, sc: 0xffffff, si: 1.7, sp: [-3, 14, 6], tint: 0xffffff, night: 0 },
  evening: { sky: 0xffc9a4, hs: 0xffdcb8, hg: 0x7a6a5a, hi: .95, sc: 0xffa564, si: 1.4, sp: [9, 6, 5], tint: 0xffe6cc, night: .35 },
  night:   { sky: 0x161b35, hs: 0x5a68a8, hg: 0x1a1f30, hi: .6, sc: 0xa8b8ff, si: .35, sp: [-6, 12, 4], tint: 0xa9b2e0, night: 1 },
};
function applyPhase() {
  if (!scene) return;
  let P = PHASES[phase] || PHASES.day;
  if (outdoor && weather !== 'sun') {
    const k = weather === 'rain' ? .45 : .7;
    P = Object.assign({}, P, { sky: weather === 'rain' ? (phase === 'night' ? 0x10131f : 0x8a96a8) : (phase === 'night' ? P.sky : 0xb8c4d0), si: P.si * k, hi: P.hi * (weather === 'rain' ? .85 : .95), tint: weather === 'rain' && phase !== 'night' ? 0xdde2ec : P.tint });
  }
  if (!outdoor) P = Object.assign({}, P, { sky: 0x1f1823, hs: 0xfff4e0, hg: 0x8a7a6a, hi: phase === 'night' ? .85 : 1.05, sc: phase === 'night' ? 0xd8c8ff : 0xfff0dd, si: phase === 'night' ? .6 : 1.1, sp: [-4, 10, 6], tint: phase === 'night' ? 0xe6e0ff : 0xffffff, night: 0 });
  scene.background = new THREE.Color(P.sky);
  scene.fog = outdoor ? new THREE.Fog(P.sky, camDist + 8, camDist + 30) : null;
  hemi.color.setHex(P.hs); hemi.groundColor.setHex(P.hg); hemi.intensity = P.hi;
  sun.color.setHex(P.sc); sun.intensity = P.si; sun.userData.off = P.sp;
  dyn.windows.forEach(m => m.emissive.setScalar(P.night * .9));
  dyn.emissive.forEach(m => m.emissive.setHex(P.night > .5 ? 0xffd98a : P.night > 0 ? 0x553a10 : 0x000000));
  dyn.lamps.forEach(l => { l.intensity = P.night > .5 ? 4 : 0; });
  actors.forEach(applyTint);
  kick();
}
function applyTint(a: Actor) { const P = outdoor ? (PHASES[phase] || PHASES.day) : { tint: phase === 'night' ? 0xe6e0ff : 0xffffff }; a.mat.color.setHex(P.tint); }
function setPhase(p: string) { phase = p; applyPhase(); }
function setWeather(w: string) { weather = w || 'sun'; buildRain(); applyPhase(); }
function buildRain() {
  if (rain) { rain.parent && rain.parent.remove(rain); rain.geometry.dispose(); (rain.material as THREE.Material).dispose(); rain = null; }
  if (weather !== 'rain' || !outdoor || !root || quality === 'low') return;
  const N = 260, pos = new Float32Array(N * 6);
  for (let i = 0; i < N; i++) { const x = Math.random() * 22 - 11, y = Math.random() * 7, z = Math.random() * 20 - 12; pos.set([x, y, z, x - .04, y - .45, z + .04], i * 6); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  rain = new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: 0xcfe0f5, transparent: true, opacity: .55 }));
  root.add(rain);
}

/* ---------- gerakan ---------- */
function tryStep(dir: Dir) {
  player.dir = dir;
  const [dx, dy] = DIRS[dir];
  const nx = player.x + dx, ny = player.y + dy;
  if (!free(nx, ny)) {
    const door = (MAPS[mapId!].closedDoors || []).find((d: any) => d.x === nx && d.y === ny);
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
  removeActor('pet');
  if (!petId || !root) return;
  let px = player.x, py = player.y + 1;
  if (!Maps.walkable(mapId!, px, py)) {
    const alt = [[1, 0], [-1, 0], [0, -1]].map(([dx, dy]) => [player.x + dx, player.y + dy]).find(([x, y]) => Maps.walkable(mapId!, x, y));
    if (alt) [px, py] = alt; else [px, py] = [player.x, player.y];
  }
  Object.assign(pet, { x: px, y: py, fx: px + .5, fy: py + .5, dir: 'down' });
  const pa = makeActor('pet', petId); pa.plane.scale.set(.8, .8, .8);
}
function setPet(id: string | null) { petId = id; if (root) placePet(); kick(); }
function updatePet(dt: number) {
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
function nameTag(text: string, bubble = false) {
  const cv = makeCanvas(bubble ? 512 : 256, 64, (c, w) => {
    c.font = bubble ? '700 28px "Zen Maru Gothic","Noto Sans JP",sans-serif' : '700 20px "DotGothic16",sans-serif';
    const tw = Math.min(w - 8, c.measureText(text).width + 24);
    c.fillStyle = bubble ? '#fffaf0' : 'rgba(42,31,45,.8)'; c.strokeStyle = '#2a1f2d'; c.lineWidth = 4;
    const x = (w - tw) / 2, y = bubble ? 6 : 18, hh = bubble ? 44 : 30;
    c.beginPath(); (c as any).roundRect ? (c as any).roundRect(x, y, tw, hh, 10) : c.rect(x, y, tw, hh); c.fill(); if (bubble) c.stroke();
    c.fillStyle = bubble ? '#2a1f2d' : '#fff'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(text, w / 2, y + hh / 2 + 1);
  });
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, depthTest: false, transparent: true }));
  s.scale.set(2, .5, 1); s.renderOrder = 11; return s;
}
function setOthers(list: Other[]) {
  const seen = new Set<string>();
  list.forEach(o => {
    seen.add(o.id);
    const cur = others.get(o.id) || ({ fx: o.x + .5, fy: o.y + .5 } as Other);
    Object.assign(cur, o); others.set(o.id, cur);
  });
  [...others.keys()].forEach(id => { if (!seen.has(id)) { const o = others.get(id)!; if (o.actor) removeActor('o:' + id); others.delete(id); } });
  syncOthers();
}
function syncOthers() {
  if (!root) return;
  others.forEach((o, id) => {
    const here = o.map === mapId;
    if (!here) { if (o.actor) { removeActor('o:' + id); o.actor = null; } return; }
    if (!o.actor) {
      o.actor = makeActor('o:' + id, o.sprite || 'player');
      const tag = nameTag(o.name || '???'); tag.position.set(0, 1.85, 0); o.actor.group.add(tag);
      o.fx = o.x + .5; o.fy = o.y + .5;
    }
  });
}
function sayOther(id: string, text: string) {
  const o: any = id === 'me' ? { actor: actors.get('player') } : others.get(id);
  if (!o || !o.actor) return;
  if (o.bubbleSprite) o.actor.group.remove(o.bubbleSprite);
  const b = nameTag(text, true); b.scale.set(4.4, .55, 1); b.position.set(0, 2.35, 0);
  o.actor.group.add(b); o.bubbleSprite = b;
  clearTimeout(o.bubbleT); o.bubbleT = setTimeout(() => { o.actor && o.actor.group.remove(b); }, 4500);
  kick();
}
function updateOthers(dt: number) {
  others.forEach(o => {
    if (!o.actor) return;
    const dx = o.x + .5 - o.fx, dy = o.y + .5 - o.fy, d = Math.hypot(dx, dy);
    if (d > 3) { o.fx = o.x + .5; o.fy = o.y + .5; }
    else if (d > .01) { const sp = Math.min(d, dt / STEP_MS); o.fx += dx / d * sp; o.fy += dy / d * sp; }
    setActorFrame(o.actor, o.dir || 'down', d > .05 ? (Math.floor(clockT / 150) % 2 ? 1 : 2) : 0);
    o.actor.group.position.set(o.fx, d > .05 ? Math.abs(Math.sin(clockT / 70)) * .06 : 0, o.fy);
  });
}

function update(dt: number) {
  clockT += dt;
  if (!paused) {
    if (player.moving) {
      const m = player.moving; m.t += dt / STEP_MS;
      if (m.t >= 1) {
        player.fx = m.tx + .5; player.fy = m.ty + .5; player.moving = null; player.frame = (player.frame + 1) % 4;
        const w = (MAPS[mapId!].warps || []).find((w: any) => w.x === player.x && w.y === player.y);
        if (w) { route = []; held = null; handlers.warp(w); return; }
        if (!route.length && routeGoal) { const g = routeGoal; routeGoal = null; arrive(g); }
      } else {
        player.fx = m.fx + .5 + (m.tx - m.fx) * m.t; player.fy = m.fy + .5 + (m.ty - m.fy) * m.t;
      }
    }
    if (!player.moving) {
      if (route.length) {
        const [nx, ny] = route.shift()!;
        const dir: Dir = nx > player.x ? 'right' : nx < player.x ? 'left' : ny > player.y ? 'down' : 'up';
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
    const a = actors.get('npc:' + (n.key || n.id)); if (!a) return;
    setActorFrame(a, n.dir, 0);
    a.plane.scale.y = 1 + Math.sin(clockT / 520 + a.phase) * .02;
    if (a.marker) a.marker.position.y = 1.95 + Math.sin(clockT / 260) * .06;
  });
  updatePet(dt); updateOthers(dt); updateTrain(dt);
  if (dyn.fountain) dyn.fountain.scale.y = 1 + Math.sin(clockT / 180) * .12;
  if (rain) {
    const a = rain.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < a.length; i += 6) {
      const d = dt * .018; a[i + 1] -= d; a[i + 4] -= d;
      if (a[i + 4] < 0) { const x = camTarget.x + Math.random() * 22 - 11, y = 6 + Math.random() * 2, z = camTarget.z + Math.random() * 20 - 12; a[i] = x; a[i + 1] = y; a[i + 2] = z; a[i + 3] = x - .04; a[i + 4] = y - .45; a[i + 5] = z + .04; }
    }
    rain.geometry.attributes.position.needsUpdate = true;
  }
  if (dyn.water) dyn.water.offset.x = (clockT / 9000) % 1;
  if (dyn.petals) {
    const p = dyn.petals.geometry.attributes.position, arr = p.array as Float32Array;
    for (let i = 0; i < arr.length; i += 3) {
      arr[i + 1] -= dt * .0006; arr[i] += Math.sin(clockT / 900 + i) * dt * .0003;
      if (arr[i + 1] < 0) { arr[i + 1] = 6; arr[i] = camTarget.x + Math.random() * 16 - 8; arr[i + 2] = camTarget.z + Math.random() * 14 - 9; }
    }
    p.needsUpdate = true;
  }
  updateCamera(dt, false);
}

function updateCamera(dt: number, snap: boolean) {
  let tx = player.fx, tz = player.fy;
  if (!outdoor) { tx = W / 2; tz = H / 2 + .3; }
  else { const half = 3.5; tx = Math.max(half, Math.min(W - half, tx)); tz = Math.max(2, Math.min(H - 1.5, tz)); }
  tmpV.set(tx, 0, tz);
  if (snap) camTarget.copy(tmpV); else camTarget.lerp(tmpV, 1 - Math.pow(.002, dt / 1000));
  camera.position.set(camTarget.x, camTarget.y + camDist * Math.sin(PITCH), camTarget.z + camDist * Math.cos(PITCH));
  camera.lookAt(camTarget.x, .5, camTarget.z);
  const off = sun.userData.off || [-5, 12, 6];
  sun.position.set(camTarget.x + off[0], off[1], camTarget.z + off[2]); sun.target.position.copy(camTarget);
}

function frame(t: number) {
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
function hold(dir: Dir) { if (paused) return; held = dir; route = []; routeGoal = null; }
function release(dir?: Dir) { if (!dir || held === dir) held = null; }
function action() {
  if (paused || player.moving) return;
  const t = target(player.x, player.y, player.dir);
  if (t) handlers.interact(t);
}
function target(x: number, y: number, dir: Dir) {
  const [dx, dy] = DIRS[dir];
  const fx = x + dx, fy = y + dy;
  let n = npcAt(fx, fy);
  if (!n && Maps.across(mapId!, fx, fy)) n = npcAt(fx + dx, fy + dy);
  if (n) { n.dir = ({ up: 'down', down: 'up', left: 'right', right: 'left' } as Record<Dir, Dir>)[dir]; return { type: 'npc', npc: n }; }
  return Maps.interactAt(mapId!, fx, fy);
}

function findPath(goals: [number, number][]) {
  const key = (x: number, y: number) => x + ',' + y;
  const goalSet = new Set(goals.map(([x, y]) => key(x, y)));
  const start: [number, number] = [player.x, player.y];
  if (goalSet.has(key(...start))) return [];
  const prev = new Map<string, [number, number] | null>([[key(...start), null]]);
  const q: [number, number][] = [start];
  while (q.length) {
    const [x, y] = q.shift()!;
    for (const [dx, dy] of Object.values(DIRS)) {
      const nx = x + dx, ny = y + dy, k = key(nx, ny);
      if (prev.has(k) || !free(nx, ny)) continue;
      prev.set(k, [x, y]);
      if (goalSet.has(k)) {
        const out: [number, number][] = [[nx, ny]]; let c: [number, number] | null | undefined = [x, y];
        while (c && key(...c) !== key(...start)) { out.unshift(c); c = prev.get(key(...c)); }
        return out;
      }
      q.push([nx, ny]);
    }
    if (prev.size > 3000) break;
  }
  return null;
}

function walkTo(tx: number, ty: number) {
  if (paused) return false;
  const n = npcAt(tx, ty);
  const special = n || Maps.interactAt(mapId!, tx, ty);
  if (special) {
    const goals: [number, number, Dir][] = [];
    (Object.entries(DIRS) as [Dir, [number, number]][]).forEach(([d, [dx, dy]]) => {
      const sx = tx - dx, sy = ty - dy;
      if (free(sx, sy) || (sx === player.x && sy === player.y)) goals.push([sx, sy, d]);
      if (n && Maps.across(mapId!, sx, sy)) { const ax = sx - dx, ay = sy - dy; if (free(ax, ay) || (ax === player.x && ay === player.y)) goals.push([ax, ay, d]); }
    });
    if (!goals.length) return false;
    const p = findPath(goals.map(g => [g[0], g[1]]));
    if (!p) return false;
    const end = p.length ? p[p.length - 1] : [player.x, player.y];
    const g = goals.find(g => g[0] === end[0] && g[1] === end[1])!;
    route = p; routeGoal = { face: g[2] }; held = null;
    if (!p.length) { const r = routeGoal; routeGoal = null; arrive(r); }
    return true;
  }
  if (!free(tx, ty)) return false;
  const p = findPath([[tx, ty]]);
  if (!p) return false;
  route = p; routeGoal = {}; held = null; return true;
}
function arrive(g: { face?: Dir }) {
  if (g.face) { player.dir = g.face; const t = target(player.x, player.y, g.face); if (t) handlers.interact(t); }
}

function onTap(e: PointerEvent) {
  if (paused || UI.dialogOpen()) return;
  const r = canvasEl.getBoundingClientRect();
  const ndc = new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
  raycaster.setFromCamera(ndc, camera);
  const petA = actors.get('pet');
  if (petA && raycaster.intersectObject(petA.plane, false)[0] && Math.abs(pet.x - player.x) + Math.abs(pet.y - player.y) <= 2) { handlers.interact({ type: 'pet' }); return; }
  const planes = npcs.map(n => actors.get('npc:' + (n.key || n.id))).filter(Boolean).map(a => a!.plane);
  const hit = raycaster.intersectObjects(planes, false)[0];
  if (hit) {
    const a = [...actors.values()].find(a => a.plane === hit.object);
    const n = a && npcs.find(n => 'npc:' + (n.key || n.id) === a.key);
    if (n && walkTo(n.x, n.y)) return;
  }
  const pt = raycaster.ray.intersectPlane(groundPlane, tmpV);
  if (!pt) return;
  const tx = Math.floor(pt.x), ty = Math.floor(pt.z);
  if (tx === player.x && ty === player.y) return;
  if (!walkTo(tx, ty)) { if (!walkTo(tx, ty - 1)) Sound.bump(); }
}

function pause(on: boolean) { paused = on; if (on) { held = null; route = []; routeGoal = null; } kick(); }
function refresh() { kick(); }
// Tampilan berubah (lemari / pemain online ganti gaya): buang tekstur sprite lama
function refreshLook(prefix = 'player:') {
  [...texCache.keys()].forEach(k => { if (k.startsWith(prefix)) { texCache.get(k)!.dispose(); texCache.delete(k); } });
  const a = actors.get('player'); if (a) a.dir = null;
  kick();
}

export const World3D = {
  init, load, setNpcs, hold, release, action, walkTo, pause, refresh, resize, setPhase, setQuality, refreshLook,
  setPet, setOthers, sayOther, setWeather, online: true,
  get map() { return mapId; }, get player() { return player; }, get npcs() { return npcs; }, is3D: true,
};
