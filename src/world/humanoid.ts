/* =========================================================
   KARAKTER MANUSIA 3D (prosedural, tanpa file model)
   - Proporsi manusia sungguhan (±6.5 kepala untuk remaja/dewasa, ±5 untuk anak)
   - Kepala berbentuk (rahang & dagu), hidung & telinga 3D, wajah dilukis (face.ts)
   - Rambut, seragam, rok berlipit, aksesori
   - Kerangka sendi: pinggul, lutut, bahu, siku, leher → animasi jalan & diam alami
   Semua ukuran dibuat untuk tinggi 1, lalu diskalakan ke tinggi tokoh.
   ========================================================= */
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import type { CharSpec, Expr } from './spec';
import { faceTexture } from './face';

type Mat = THREE.Material;

interface Mats { skin: Mat; hair: Mat; top: Mat; topDark: Mat; accent: Mat; bottom: Mat; shoes: Mat; collar: Mat; sock: Mat; metal: Mat; lens: Mat; white: Mat }

/* ---------- tekstur helai rambut (dipakai bersama) ---------- */
let hairTex: THREE.CanvasTexture | null = null;
function hairStrands() {
  if (hairTex) return hairTex;
  const cv = document.createElement('canvas'); cv.width = 128; cv.height = 64;
  const c = cv.getContext('2d')!;
  c.fillStyle = '#e8e8e8'; c.fillRect(0, 0, 128, 64);
  for (let i = 0; i < 260; i++) {
    const x = Math.random() * 128, v = 200 + Math.random() * 55;
    c.strokeStyle = `rgb(${v},${v},${v})`; c.lineWidth = .6 + Math.random() * 1.2;
    c.beginPath(); c.moveTo(x, 0); c.lineTo(x + (Math.random() - .5) * 4, 64); c.stroke();
  }
  hairTex = new THREE.CanvasTexture(cv);
  hairTex.wrapS = hairTex.wrapT = THREE.RepeatWrapping; hairTex.colorSpace = THREE.SRGBColorSpace;
  hairTex.userData.keep = true;
  return hairTex;
}

function materials(s: CharSpec, lite: boolean): Mats {
  const M = (color: string, rough = .8, extra: Record<string, unknown> = {}) => lite
    ? new THREE.MeshLambertMaterial({ color, ...extra } as THREE.MeshLambertMaterialParameters)
    : new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: 0, ...extra } as THREE.MeshStandardMaterialParameters);
  const sockColor = s.outfit === 'sailor' ? '#2a2c40' : s.age === 'kid' ? '#f4f1ea' : s.outfit === 'kimono' ? '#f4f1ea' : Pix.shade(s.skin, -.12);
  return {
    skin: M(s.skin, .62),
    hair: M(s.hair, .68, { map: hairStrands() }),
    top: M(s.top, .85), topDark: M(s.topDark, .85), accent: M(s.accent, .6),
    bottom: M(s.bottom, .85), shoes: M(s.shoes, .45), collar: M(s.collar, .8),
    sock: M(sockColor, .9), metal: M('#d8b24a', .35, lite ? {} : { metalness: .6 }),
    lens: M('#2a2238', .3), white: M('#f7f3ea', .85),
  };
}

/* ---------- pembantu bentuk ---------- */
function put(parent: THREE.Object3D, geo: THREE.BufferGeometry, mat: Mat, p: [number, number, number] = [0, 0, 0], r: [number, number, number] = [0, 0, 0], s: [number, number, number] = [1, 1, 1]) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(...p); m.rotation.set(...r); m.scale.set(...s);
  m.castShadow = true; m.receiveShadow = true;
  parent.add(m); return m;
}
// Tungkai: kapsul yang menggantung dari sendi sepanjang L
function limb(parent: THREE.Object3D, rTop: number, rBot: number, L: number, mat: Mat) {
  const g = new THREE.CylinderGeometry(rTop, rBot, L, 12, 1, false);
  put(parent, g, mat, [0, -L / 2, 0]);
  put(parent, new THREE.SphereGeometry(rBot, 12, 8), mat, [0, -L, 0]);
  put(parent, new THREE.SphereGeometry(rTop, 12, 8), mat, [0, 0, 0]);
}
function lathe(profile: [number, number][], seg = 20) { return new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), seg); }

/* ---------- kepala ---------- */
// Deformasi bola jadi bentuk kepala: rahang menyempit, dagu sedikit maju, belakang kepala lebih bulat
function deformHead(v: THREE.Vector3) {
  const y = v.y;
  if (y < 0.15) {
    const k = (0.15 - y) / 1.15;
    v.x *= 1 - .22 * Math.pow(k, 1.3);
    v.z *= 1 - .08 * k;
    if (v.z > 0) v.z += .04 * k * k;
  }
  v.x *= .9;
  if (v.z < 0) v.z *= 1.06;
  v.y *= 1.12;
  return v;
}
function headGeometry(r: number) {
  const g = new THREE.SphereGeometry(1, 40, 28);
  const p = g.attributes.position as THREE.BufferAttribute, v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); deformHead(v); p.setXYZ(i, v.x * r, v.y * r, v.z * r); }
  g.computeVertexNormals();
  return g;
}
// Titik di permukaan wajah (a: sudut dari depan, t: 0 atas … 1 bawah), sama dengan pemetaan tekstur wajah
function facePoint(r: number, a: number, t: number, out = 1) {
  const th = t * Math.PI;
  const v = new THREE.Vector3(Math.sin(a) * Math.sin(th), Math.cos(th), Math.cos(a) * Math.sin(th));
  deformHead(v); return v.multiplyScalar(r * out);
}

/* ---------- rambut ---------- */
// Poni: lembaran yang mengikuti bentuk dahi, ujung bawahnya bergerigi seperti helai rambut
function fringeGeo(r: number, a0: number, a1: number, tTop: number, tBot: number, teeth: number, out = 1.1) {
  const cols = teeth * 2, rows = 6;
  const pos: number[] = [], uv: number[] = [], idx: number[] = [];
  for (let i = 0; i <= cols; i++) {
    const a = a0 + (a1 - a0) * i / cols;
    const edge = (Math.abs(a) > (a1 - a0) * .42 ? 0.04 : 0) + (i % 2 ? -0.045 : 0.02) + Math.sin(i * 1.7) * .01;
    const bot = tBot + edge - Math.abs(a) * .02;
    for (let j = 0; j <= rows; j++) {
      const t = tTop + (bot - tTop) * j / rows;
      const o = out + (1 - j / rows) * .02 - (j / rows) * .01;
      const v = facePoint(r, a, t, o);
      pos.push(v.x, v.y, v.z); uv.push(i / cols, 1 - j / rows);
    }
  }
  for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
    const k = i * (rows + 1) + j, n = k + rows + 1;
    idx.push(k, k + 1, n, n, k + 1, n + 1);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx); g.computeVertexNormals();
  return g;
}
// Tirai rambut di belakang & samping kepala (terbuka di bagian wajah)
function curtainGeo(r: number, len: number, flare: number, open = .62) {
  const g = new THREE.CylinderGeometry(r * 1.02, r * flare, len, 28, 4, true, Math.PI * open / 2 + Math.PI * 0, Math.PI * (2 - open));
  // ujung bawah sedikit bergerigi
  const p = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) {
    const y = p.getY(i);
    if (y < -len / 2 + 1e-4) { const ang = Math.atan2(p.getX(i), p.getZ(i)); p.setY(i, y + Math.abs(Math.sin(ang * 7)) * r * .18); }
  }
  g.computeVertexNormals();
  return g;
}
function buildHair(head: THREE.Group, s: CharSpec, M: Mats, r: number) {
  const H = M.hair;
  const H2 = (H as THREE.Material).clone(); H2.side = THREE.DoubleSide;
  const style = s.hairStyle;
  if (style === 'bald') {
    const ring = new THREE.TorusGeometry(r * .98, r * .16, 8, 20, Math.PI * 1.2);
    put(head, ring, H, [0, r * .05, 0], [Math.PI / 2, 0, Math.PI * -.1 + Math.PI], [1, 1, .8]);
    return;
  }
  // tudung rambut mengikuti bentuk kepala
  const cap = new THREE.SphereGeometry(1, 32, 16, 0, Math.PI * 2, 0, Math.PI * .6);
  const cp = cap.attributes.position as THREE.BufferAttribute, v = new THREE.Vector3();
  for (let i = 0; i < cp.count; i++) { v.fromBufferAttribute(cp, i); deformHead(v); cp.setXYZ(i, v.x * r * 1.09, v.y * r * 1.09 + r * .04, v.z * r * 1.09); }
  cap.computeVertexNormals();
  put(head, cap, H, [0, 0, -r * .02], [-.3, 0, 0]);
  // belakang kepala sampai tengkuk
  put(head, new THREE.SphereGeometry(r * 1.1, 28, 14, Math.PI * .95, Math.PI * 1.1, Math.PI * .3, Math.PI * .45), H, [0, r * .02, -r * .03], [0, 0, 0], [.96, 1.08, 1.02]);
  // poni
  if (style === 'spiky') put(head, fringeGeo(r, -.75, .75, .22, .36, 5), H2);
  else if (style === 'long' || style === 'twin') put(head, fringeGeo(r, -.85, .85, .2, .47, 7), H2);
  else put(head, fringeGeo(r, -.9, .9, .2, s.female ? .44 : .395, 7), H2);
  // tirai rambut: bob sebatas dagu, panjang sampai punggung
  if (style === 'bob') put(head, curtainGeo(r * 1.08, r * 1.5, 1.12), H2, [0, -r * .45, -r * .05], [0, 0, 0], [.95, 1, 1]);
  if (style === 'long') put(head, curtainGeo(r * 1.08, r * 3.6, 1.35, .7), H2, [0, -r * 1.45, -r * .1], [.06, 0, 0], [.95, 1, .9]);
  if (style === 'bun') put(head, curtainGeo(r * 1.06, r * .7, 1.02, .9), H2, [0, -r * .2, -r * .04], [0, 0, 0], [.95, 1, 1]);
  // helai di depan telinga (membingkai wajah)
  if (['long', 'twin', 'bob'].includes(style)) {
    ([-1, 1] as const).forEach(sd => {
      const len = style === 'bob' ? r * 1.1 : r * 1.4;
      const p = facePoint(r, sd * .98, .45, 1.08);
      put(head, new THREE.CapsuleGeometry(r * .17, len, 4, 8), H, [p.x, p.y - len * .42, p.z], [.08, sd * .5, sd * -.06], [1, 1, .45]);
    });
  }
  if (style === 'twin') {
    ([-1, 1] as const).forEach(sd => {
      put(head, new THREE.SphereGeometry(r * .28, 12, 8), H, [sd * r * .95, r * .3, -r * .45]);
      put(head, new THREE.CapsuleGeometry(r * .24, r * 1.9, 4, 10), H, [sd * r * 1.2, -r * .75, -r * .55], [.12, 0, sd * .16], [1, 1, .8]);
      put(head, new THREE.TorusGeometry(r * .17, r * .05, 6, 12), M.accent, [sd * r * 1.02, r * .18, -r * .47], [Math.PI / 2, 0, 0]);
    });
  }
  if (style === 'bun') put(head, new THREE.SphereGeometry(r * .42, 16, 12), H, [0, r * .82, -r * .72]);
  if (style === 'spiky') {
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2, tilt = .7;
      const dir = new THREE.Vector3(Math.sin(a) * Math.sin(tilt), Math.cos(tilt), Math.cos(a) * Math.sin(tilt) - .25).normalize();
      const cone = new THREE.ConeGeometry(r * .24, r * .5, 5);
      const m = put(head, cone, H, [dir.x * r * .95, r * .12 + dir.y * r * .95, dir.z * r * .95]);
      m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    }
  }
}

function buildAccessories(head: THREE.Group, s: CharSpec, M: Mats, r: number) {
  if (s.glasses) {
    const frame = s.age === 'adult' || s.age === 'old' ? M.lens : M.lens;
    ([-1, 1] as const).forEach(sd => {
      const p = facePoint(r, sd * .36, .535, 1.08);
      put(head, new THREE.TorusGeometry(r * .2, r * .022, 6, 20), frame, [p.x, p.y, p.z], [0, sd * .3, 0], [1, .8, 1]);
      const e = facePoint(r, sd * .82, .52, 1.02);
      put(head, new THREE.CylinderGeometry(r * .02, r * .02, r * .75, 4), frame, [e.x, e.y, e.z - r * .3], [Math.PI / 2, 0, 0]);
    });
    const b = facePoint(r, 0, .525, 1.1);
    put(head, new THREE.BoxGeometry(r * .18, r * .03, r * .03), frame, [b.x, b.y, b.z]);
  }
  if (s.ribbon) {
    const p = new THREE.Vector3(r * .55, r * .85, -r * .25);
    ([-1, 1] as const).forEach(sd => put(head, new THREE.ConeGeometry(r * .2, r * .38, 4), M.accent, [p.x + sd * r * .2, p.y, p.z], [0, 0, sd * Math.PI / 2], [1, 1, .4]));
    put(head, new THREE.SphereGeometry(r * .09, 8, 6), M.accent, [p.x, p.y, p.z]);
  }
  if (s.flower) {
    const p = new THREE.Vector3(-r * .8, r * .55, r * .2);
    for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2; put(head, new THREE.SphereGeometry(r * .1, 8, 6), M.white, [p.x, p.y + Math.cos(a) * r * .12, p.z + Math.sin(a) * r * .12]); }
    put(head, new THREE.SphereGeometry(r * .08, 8, 6), M.accent, [p.x - r * .03, p.y, p.z]);
  }
  if (s.headband) put(head, new THREE.TorusGeometry(r * 1.1, r * .06, 6, 24, Math.PI), M.accent, [0, r * .35, -r * .05], [0, Math.PI / 2, 0], [1, 1.02, 1]);
  if (s.cap) {
    put(head, new THREE.CylinderGeometry(r * 1.12, r * 1.08, r * .55, 20), M.topDark, [0, r * .78, -r * .05]);
    put(head, new THREE.CylinderGeometry(r * 1.15, r * 1.15, r * .1, 20), M.top, [0, r * 1.05, -r * .05]);
    put(head, new THREE.CylinderGeometry(r * .75, r * .75, r * .05, 16, 1, false, -Math.PI / 2, Math.PI), M.lens, [0, r * .56, r * .55], [.25, 0, 0], [1, 1, .8]);
    put(head, new THREE.SphereGeometry(r * .12, 8, 6), M.metal, [0, r * .85, r * 1.02]);
  }
  if (s.beard) {
    const p = facePoint(r, 0, .82, 1.02);
    put(head, new THREE.SphereGeometry(r * .38, 12, 8), M.hair, [p.x, p.y - r * .1, p.z - r * .12], [0, 0, 0], [1, 1.2, .7]);
  }
}

/* ---------- badan & pakaian ---------- */
interface Rig {
  body: THREE.Group; pelvis: THREE.Group; spine: THREE.Group; neck: THREE.Group; head: THREE.Group;
  thigh: THREE.Group[]; shin: THREE.Group[]; upper: THREE.Group[]; fore: THREE.Group[];
}

export class Humanoid {
  readonly root = new THREE.Group();
  readonly spec: CharSpec;
  readonly height: number;
  private rig!: Rig;
  private faceMat!: THREE.MeshStandardMaterial | THREE.MeshLambertMaterial;
  private expr: Expr = 'normal';
  private shown: Expr | null = null;
  private walkT = Math.random() * 10;
  private idleT = Math.random() * 10;
  private blinkAt = 1500 + Math.random() * 3000;
  private blinkUntil = 0;
  private clock = 0;
  private yaw = 0;
  private yawTarget = 0;
  private walkAmt = 0;
  lookYaw = 0;          // menoleh (radian) — dipakai potret
  readonly hitbox: THREE.Mesh;

  constructor(spec: CharSpec, opts: { lite?: boolean } = {}) {
    this.spec = spec;
    this.height = spec.height;
    const M = materials(spec, !!opts.lite);
    this.build(M, !!opts.lite);
    // kotak tak terlihat untuk diketuk
    this.hitbox = new THREE.Mesh(new THREE.BoxGeometry(.7, this.height * 1.05, .6), new THREE.MeshBasicMaterial({ visible: false }));
    this.hitbox.position.y = this.height / 2;
    this.root.add(this.hitbox);
    this.setExpression('normal');
  }

  private build(M: Mats, lite: boolean) {
    const s = this.spec, kid = s.age === 'kid', old = s.age === 'old';
    const P = kid
      ? { hip: .47, knee: .25, ankle: .04, pelvisBot: .44, torso: .33, headR: .088, shoulderW: .1, upper: .14, fore: .125, hipW: .05 }
      : { hip: .53, knee: .285, ankle: .045, pelvisBot: .495, torso: .335, headR: .07, shoulderW: s.female ? .098 : .114, upper: .158, fore: .142, hipW: s.female ? .058 : .055 };
    const body = new THREE.Group(); body.scale.setScalar(this.height); this.root.add(body);

    // --- panggul & kaki ---
    const pelvis = new THREE.Group(); pelvis.position.y = P.hip; body.add(pelvis);
    const skirt = s.female && s.outfit !== 'kimono';
    const pants = !s.female && s.outfit !== 'kimono';
    const shortPants = pants && s.age === 'kid';
    const thigh: THREE.Group[] = [], shin: THREE.Group[] = [];
    ([-1, 1] as const).forEach(sd => {
      const th = new THREE.Group(); th.position.set(sd * P.hipW, 0, 0); pelvis.add(th);
      const tl = P.hip - P.knee;
      const thighMat = pants && !shortPants ? M.bottom : shortPants ? M.bottom : M.skin;
      limb(th, (s.female ? .05 : .052) * (kid ? .9 : 1), .036, tl, thighMat);
      const sh = new THREE.Group(); sh.position.y = -tl; th.add(sh);
      const sl = P.knee - P.ankle;
      const shinMat = pants && !shortPants ? M.bottom : skirt && (s.outfit === 'sailor' || kid) ? M.sock : s.outfit === 'kimono' ? M.sock : skirt ? M.sock : M.skin;
      limb(sh, .036, .026, sl, shinMat);
      // sepatu
      put(sh, new THREE.CapsuleGeometry(.03, .065, 4, 8), M.shoes, [0, -sl - .01, .026], [Math.PI / 2, 0, 0], [1, 1, .72]);
      thigh.push(th); shin.push(sh);
    });
    // pinggul (celana/rok menutup sambungan)
    put(pelvis, new THREE.SphereGeometry(.105, 16, 10), pants ? M.bottom : skirt ? M.bottom : M.top, [0, .01, 0], [0, 0, 0], [s.female ? 1.08 : 1.02, .62, .72]);
    if (skirt) {
      const sk = new THREE.CylinderGeometry(.1, s.outfit === 'sailor' ? .19 : .165, kid ? .17 : .2, 40, 2, true);
      const pa = sk.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < pa.count; i++) {
        const x = pa.getX(i), y = pa.getY(i), z = pa.getZ(i), ang = Math.atan2(z, x);
        const w = (.1 - y) / .2; const k = 1 + .07 * Math.abs(Math.sin(ang * 9)) * Math.max(0, w);
        pa.setXYZ(i, x * k, y, z * k);
      }
      sk.computeVertexNormals();
      const skMat = (M.bottom as THREE.Material).clone(); skMat.side = THREE.DoubleSide;
      put(pelvis, sk, skMat, [0, -(kid ? .06 : .075), 0], [0, 0, 0], [1, 1, .8]);
    }
    if (s.outfit === 'kimono') {
      put(pelvis, lathe([[.11, .05], [.13, -.1], [.145, -.3], [.14, -.44], [0, -.44]], 22), M.top, [0, 0, 0], [0, 0, 0], [1, 1, .8]);
      put(pelvis, new THREE.CylinderGeometry(.112, .112, .07, 20), M.accent, [0, .08, 0], [0, 0, 0], [1, 1, .78]);
    }
    if (s.outfit === 'apron') put(pelvis, new THREE.BoxGeometry(.2, .3, .01), M.white, [0, -.12, .085], [.08, 0, 0]);

    // --- tulang punggung & dada ---
    const spine = new THREE.Group(); spine.position.y = P.pelvisBot; body.add(spine);
    if (old) spine.rotation.x = .16;
    const fem: [number, number][] = [[0, 0], [.098, 0], [.108, .035], [.105, .07], [.088, .13], [.084, .165], [.095, .21], [.102, .245], [.098, .275], [.08, .305], [.05, .325], [.03, .335], [0, .335]];
    const mal: [number, number][] = [[0, 0], [.1, 0], [.104, .04], [.098, .09], [.096, .14], [.104, .19], [.118, .24], [.126, .28], [.118, .305], [.075, .328], [.034, .338], [0, .338]];
    const prof = (s.female ? fem : mal).map(([r, y]) => [r * (kid ? .95 : 1), y * (P.torso / .335)] as [number, number]);
    put(spine, lathe(prof, 24), M.top, [0, 0, 0], [0, 0, 0], [1, 1, .66]);
    const T = P.torso;
    // detail seragam
    if (s.outfit === 'sailor') {
      put(spine, new THREE.BoxGeometry(.17, .1, .01), M.collar, [0, T * .86, -.066], [-.22, 0, 0]);
      ([-1, 1] as const).forEach(sd => put(spine, new THREE.BoxGeometry(.016, .12, .01), M.collar, [sd * .03, T * .83, .066], [.25, 0, sd * .42]));
      put(spine, new THREE.ConeGeometry(.03, .06, 4), M.accent, [-.018, T * .66, .07], [0, 0, .9], [1, 1, .4]);
      put(spine, new THREE.ConeGeometry(.03, .06, 4), M.accent, [.018, T * .66, .07], [0, 0, -.9], [1, 1, .4]);
      put(spine, new THREE.SphereGeometry(.014, 8, 6), M.accent, [0, T * .68, .072]);
    } else if (s.outfit === 'blazer' || s.outfit === 'cardigan') {
      put(spine, new THREE.CylinderGeometry(.0, .045, .13, 3, 1), M.collar, [0, T * .82, .062], [Math.PI, 0, 0], [1, 1, .15]);
      if (s.outfit === 'blazer') put(spine, new THREE.BoxGeometry(.018, .1, .006), M.accent, [0, T * .72, .07]);
      [.45, .3].forEach(y => put(spine, new THREE.SphereGeometry(.008, 6, 4), M.metal, [.02, T * y, .068]));
    } else if (s.outfit === 'gakuran') {
      put(spine, new THREE.CylinderGeometry(.043, .05, .04, 16), M.topDark, [0, T + .005, 0], [0, 0, 0], [1, 1, .85]);
      [.8, .64, .48, .32, .16].forEach(y => put(spine, new THREE.SphereGeometry(.009, 6, 4), M.metal, [0, T * y, .066 + (y > .6 ? .002 : 0)]));
    } else if (s.outfit === 'apron') {
      put(spine, new THREE.BoxGeometry(.15, .2, .008), M.white, [0, T * .45, .07]);
    } else if (s.outfit === 'kimono') {
      ([-1, 1] as const).forEach(sd => put(spine, new THREE.BoxGeometry(.025, .2, .01), M.collar, [sd * .03, T * .72, .062], [0, 0, sd * -.5]));
    } else if (s.outfit === 'tee') {
      put(spine, new THREE.CircleGeometry(.03, 16), M.accent, [0, T * .62, .071]);
    }

    // --- lengan ---
    const upper: THREE.Group[] = [], fore: THREE.Group[] = [];
    const longSleeve = s.outfit !== 'tee';
    ([-1, 1] as const).forEach(sd => {
      const sh = new THREE.Group(); sh.position.set(sd * (P.shoulderW - .004), T * .86, 0); spine.add(sh);
      sh.rotation.z = sd * .09;
      put(sh, new THREE.SphereGeometry(.033, 12, 8), M.top, [0, -.008, 0]);
      limb(sh, .031, .027, P.upper, s.outfit === 'kimono' ? M.top : M.top);
      if (!longSleeve) put(sh, new THREE.CylinderGeometry(.04, .042, .07, 12, 1, true), M.top, [0, -.03, 0]);
      const el = new THREE.Group(); el.position.y = -P.upper; sh.add(el);
      limb(el, .029, .024, P.fore, longSleeve ? (s.outfit === 'sailor' ? M.white : M.top) : M.skin);
      if (s.outfit === 'sailor') put(el, new THREE.CylinderGeometry(.027, .027, .025, 12), M.collar, [0, -P.fore + .02, 0]);
      if (s.outfit === 'kimono') put(el, new THREE.CylinderGeometry(.04, .06, .12, 12, 1, true), M.top, [0, -P.fore * .55, -.01]);
      if (longSleeve && s.outfit !== 'kimono') put(el, new THREE.SphereGeometry(.024, 8, 6), M.skin, [0, -P.fore - .005, 0]);
      // tangan
      put(el, new THREE.SphereGeometry(.026, 10, 8), M.skin, [0, -P.fore - .035, .004], [0, 0, 0], [.8, 1.25, .62]);
      put(el, new THREE.CapsuleGeometry(.008, .02, 2, 6), M.skin, [sd * -.018, -P.fore - .03, .012], [.2, 0, sd * .6]);
      upper.push(sh); fore.push(el);
    });

    // --- leher & kepala ---
    const neck = new THREE.Group(); neck.position.y = T; spine.add(neck);
    if (old) neck.rotation.x = -.12;
    put(neck, new THREE.CylinderGeometry(.027, .031, .05, 12), M.skin, [0, .015, 0]);
    const r = P.headR;
    const head = new THREE.Group(); head.position.y = .018 + r * 1.0; neck.add(head);
    const faceMat = lite
      ? new THREE.MeshLambertMaterial({ color: 0xffffff })
      : new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .6 });
    this.faceMat = faceMat;
    const skull = new THREE.Mesh(headGeometry(r), faceMat); skull.castShadow = true; head.add(skull);
    // hidung & telinga
    const np = facePoint(r, 0, .6, .98);
    put(head, new THREE.SphereGeometry(r * .075, 10, 8), M.skin, [np.x, np.y, np.z - r * .01], [-.35, 0, 0], [.85, 1.3, .6]);
    ([-1, 1] as const).forEach(sd => {
      const e = facePoint(r, sd * Math.PI / 2, .52, .92);
      put(head, new THREE.SphereGeometry(r * .2, 10, 8), M.skin, [e.x, e.y, e.z - r * .05], [0, 0, 0], [.35, 1, .7]);
    });
    buildHair(head, s, M, r);
    buildAccessories(head, s, M, r);
    this.rig = { body, pelvis, spine, neck, head, thigh, shin, upper, fore };
    [pelvis, spine, neck, head, ...thigh, ...shin, ...upper, ...fore].forEach(g => mergeByMaterial(g, skull));
  }

  /* ---------- ekspresi & arah ---------- */
  setExpression(e: Expr) { this.expr = e; this.applyFace(); }
  private applyFace() {
    const now = this.clock < this.blinkUntil ? 'blink' : this.expr;
    if (now === this.shown) return;
    this.shown = now;
    this.faceMat.map = faceTexture(this.spec, now); this.faceMat.needsUpdate = true;
  }
  face(dir: Dir | string, snap = false) {
    this.yawTarget = ({ down: 0, right: Math.PI / 2, up: Math.PI, left: -Math.PI / 2 } as Record<string, number>)[dir] ?? 0;
    if (snap) { this.yaw = this.yawTarget; this.root.rotation.y = this.yaw; }
  }

  /* ---------- animasi ---------- */
  update(dt: number, walking: boolean, speed = 1) {
    this.clock += dt;
    // kedip acak
    if (this.clock > this.blinkAt) { this.blinkUntil = this.clock + 120; this.blinkAt = this.clock + 2200 + Math.random() * 3500; }
    this.applyFace();
    // berputar halus ke arah hadap
    let d = this.yawTarget - this.yaw; d = Math.atan2(Math.sin(d), Math.cos(d));
    this.yaw += d * Math.min(1, dt / 90); this.root.rotation.y = this.yaw;

    this.walkAmt += ((walking ? 1 : 0) - this.walkAmt) * Math.min(1, dt / 120);
    const w = this.walkAmt, R = this.rig;
    this.walkT += dt * .0145 * speed * (walking ? 1 : 0);
    this.idleT += dt * .001;
    const ph = this.walkT, sw = Math.sin(ph);
    const old = this.spec.age === 'old';
    const stride = old ? .32 : .5;
    // kaki
    R.thigh[0].rotation.x = -sw * stride * w;
    R.thigh[1].rotation.x = sw * stride * w;
    R.shin[0].rotation.x = Math.max(0, Math.sin(ph - 1.3)) * .85 * w + .02;
    R.shin[1].rotation.x = Math.max(0, Math.sin(ph + Math.PI - 1.3)) * .85 * w + .02;
    // lengan berayun berlawanan
    const idleSway = Math.sin(this.idleT * 1.3) * .03 * (1 - w);
    R.upper[0].rotation.x = sw * .42 * w + idleSway;
    R.upper[1].rotation.x = -sw * .42 * w - idleSway;
    R.fore[0].rotation.x = -(.18 + Math.max(0, sw) * .35 * w);
    R.fore[1].rotation.x = -(.18 + Math.max(0, -sw) * .35 * w);
    // badan: naik-turun, berputar kecil, bernapas
    const bob = Math.abs(Math.cos(ph)) * .018 * w;
    R.body.position.y = bob * this.height - .004 * w;
    R.spine.rotation.y = sw * .07 * w;
    R.pelvis.rotation.y = -sw * .08 * w;
    const breathe = Math.sin(this.idleT * 2.2) * .012 * (1 - w);
    R.spine.scale.set(1 + breathe * .5, 1 + breathe, 1 + breathe);
    R.body.position.x = Math.sin(this.idleT * .7) * .004 * (1 - w);
    // kepala: menoleh pelan saat diam, stabil saat berjalan
    R.head.rotation.y = this.lookYaw + Math.sin(this.idleT * .45) * .18 * (1 - w) - R.spine.rotation.y * .8;
    R.head.rotation.x = Math.sin(this.idleT * .8) * .03 * (1 - w) + (old ? .1 : 0);
  }

  // Pose untuk potret (tanpa animasi waktu)
  pose(expr: Expr) {
    const R = this.rig;
    this.expr = expr; this.blinkUntil = 0; this.shown = null; this.applyFace();
    R.head.rotation.set(expr === 'sad' ? .16 : expr === 'surprised' ? -.08 : 0, expr === 'happy' ? .12 : -.12, expr === 'happy' ? -.08 : 0);
    R.upper.forEach((u, i) => { u.rotation.x = 0; u.rotation.z = (i ? 1 : -1) * .09; });
    R.fore.forEach(f => { f.rotation.x = -.2; });
  }
  get headWorld() { const v = new THREE.Vector3(); this.rig.head.getWorldPosition(v); return v; }

  dispose() {
    this.root.traverse(o => {
      const m = o as THREE.Mesh;
      if (m.geometry) m.geometry.dispose();
      if (m.material) (Array.isArray(m.material) ? m.material : [m.material]).forEach(mt => mt.dispose());
    });
  }
}

/* Gabungkan mesh anak dengan bahan yang sama (per sendi) → jauh lebih sedikit draw call di HP */
function mergeByMaterial(g: THREE.Group, keep: THREE.Object3D) {
  const groups = new Map<THREE.Material, THREE.Mesh[]>();
  g.children.forEach(c => {
    const m = c as THREE.Mesh;
    if (!m.isMesh || m === keep || Array.isArray(m.material)) return;
    const list = groups.get(m.material) || []; list.push(m); groups.set(m.material, list);
  });
  groups.forEach((list, mat) => {
    if (list.length < 2) return;
    const geos = list.map(m => {
      m.updateMatrix();
      const geo = (m.geometry.index ? m.geometry : m.geometry).clone();
      geo.applyMatrix4(m.matrix);
      // samakan atribut (hanya position, normal, uv)
      Object.keys(geo.attributes).forEach(k => { if (!['position', 'normal', 'uv'].includes(k)) geo.deleteAttribute(k); });
      return geo.index ? geo : geo;
    });
    const indexed = geos.every(x => x.index), plain = geos.every(x => !x.index);
    if (!indexed && !plain) { for (let i = 0; i < geos.length; i++) if (geos[i].index) geos[i] = geos[i].toNonIndexed(); }
    const merged = mergeGeometries(geos, false);
    geos.forEach(x => x.dispose());
    if (!merged) return;
    list.forEach(m => { g.remove(m); m.geometry.dispose(); });
    const mesh = new THREE.Mesh(merged, mat); mesh.castShadow = true; mesh.receiveShadow = true;
    g.add(mesh);
  });
}
