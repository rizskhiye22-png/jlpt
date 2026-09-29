/* =========================================================
   WAJAH: dilukis di kanvas lalu ditempel ke kepala 3D.
   Kanvas 1024x512 memetakan seluruh bola kepala (UV bola three.js):
   bagian depan wajah ada di u = 0.25 → x = 256.
   ========================================================= */
import * as THREE from 'three';
import type { CharSpec, Expr } from './spec';

export const FACE_W = 1024, FACE_H = 512;
const PX_PER_RAD = FACE_W / (Math.PI * 2);
// a = sudut dari depan wajah (radian, + ke kanan layar), t = posisi vertikal (0 atas kepala … 1 dagu)
const X = (a: number) => 256 + a * PX_PER_RAD;
const Y = (t: number) => t * FACE_H;

function hexToRgb(hex: string) { const n = parseInt(hex.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; }
function mix(a: string, b: string, t: number) {
  const A = hexToRgb(a), B = hexToRgb(b);
  return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(',')})`;
}

function drawEye(c: CanvasRenderingContext2D, s: CharSpec, side: -1 | 1, expr: Expr) {
  const cx = X(side * 0.37), cy = Y(s.age === 'kid' ? 0.55 : 0.54);
  const big = (s.age === 'kid' ? 1.12 : s.age === 'old' ? 0.85 : 1) * 1.55;
  const w = 25 * big, h = (s.female ? 13.5 : 11.5) * big;
  const lash = mix(s.hairDark, '#1a1016', 0.6);
  c.save();
  if (expr === 'blink' || expr === 'happy') {
    // mata terpejam / tersenyum: garis melengkung
    c.strokeStyle = lash; c.lineWidth = 5; c.lineCap = 'round';
    c.beginPath();
    if (expr === 'happy') c.ellipse(cx, cy + 3, w * .9, h * .9, 0, Math.PI * 1.1, Math.PI * 1.9);
    else c.ellipse(cx, cy - 2, w * .95, h * .7, 0, Math.PI * .08, Math.PI * .92);
    c.stroke();
    c.restore();
    return;
  }
  const open = expr === 'surprised' ? 1.25 : expr === 'sad' ? 0.85 : 1;
  // bentuk almond (sudut luar sedikit naik)
  const outer = side * w, tilt = expr === 'sad' ? 3 : -2;
  const almond = () => {
    c.beginPath();
    c.moveTo(cx - outer, cy + tilt * side * 0);
    c.moveTo(cx - side * w, cy + 2);
    c.bezierCurveTo(cx - side * w * .5, cy - h * 1.25 * open, cx + side * w * .55, cy - h * 1.2 * open, cx + side * w, cy + tilt);
    c.bezierCurveTo(cx + side * w * .5, cy + h * .95 * open, cx - side * w * .5, cy + h * .95 * open, cx - side * w, cy + 2);
    c.closePath();
  };
  // bagian putih mata
  almond(); c.fillStyle = '#fbf6f2'; c.fill();
  c.save(); almond(); c.clip();
  // bayangan kelopak atas
  const lidShade = c.createLinearGradient(0, cy - h, 0, cy);
  lidShade.addColorStop(0, 'rgba(120,70,80,.35)'); lidShade.addColorStop(1, 'rgba(120,70,80,0)');
  c.fillStyle = lidShade; c.fillRect(cx - w * 1.2, cy - h * 2, w * 2.4, h * 2);
  // iris
  const ir = 10.5 * big * (expr === 'surprised' ? .9 : 1), ix = cx + side * 1.5, iy = cy - 1;
  const g = c.createRadialGradient(ix, iy - ir * .35, ir * .1, ix, iy, ir);
  g.addColorStop(0, mix(s.iris, '#ffffff', .25)); g.addColorStop(.5, mix(s.iris, '#000000', .15)); g.addColorStop(1, mix(s.iris, '#000000', .65));
  c.fillStyle = g; c.beginPath(); c.arc(ix, iy, ir, 0, Math.PI * 2); c.fill();
  c.strokeStyle = mix(s.iris, '#000000', .75); c.lineWidth = 2.4; c.stroke();
  // pupil
  c.fillStyle = '#140c12'; c.beginPath(); c.arc(ix, iy, ir * .42, 0, Math.PI * 2); c.fill();
  // kilau
  c.fillStyle = 'rgba(255,255,255,.95)'; c.beginPath(); c.ellipse(ix - ir * .35, iy - ir * .4, ir * .26, ir * .2, -.4, 0, Math.PI * 2); c.fill();
  c.fillStyle = 'rgba(255,255,255,.55)'; c.beginPath(); c.arc(ix + ir * .35, iy + ir * .38, ir * .12, 0, Math.PI * 2); c.fill();
  c.restore();
  // garis bulu mata atas (tebal, sedikit melebar di ujung luar)
  c.strokeStyle = lash; c.lineCap = 'round'; c.lineJoin = 'round';
  c.lineWidth = s.female ? 6.5 : 5;
  c.beginPath();
  c.moveTo(cx - side * w, cy + 1);
  c.bezierCurveTo(cx - side * w * .5, cy - h * 1.3 * open, cx + side * w * .55, cy - h * 1.25 * open, cx + side * (w + (s.female ? 4 : 1)), cy + tilt - (s.female ? 3 : 0));
  c.stroke();
  if (s.female) { // bulu mata di ujung luar
    c.lineWidth = 3; c.beginPath();
    c.moveTo(cx + side * (w - 2), cy + tilt - 3); c.lineTo(cx + side * (w + 7), cy + tilt - 8);
    c.moveTo(cx + side * (w - 7), cy - h * .75); c.lineTo(cx + side * (w - 1), cy - h * 1.2 - 2);
    c.stroke();
  }
  // lipatan kelopak
  c.strokeStyle = 'rgba(110,60,60,.35)'; c.lineWidth = 1.6;
  c.beginPath(); c.moveTo(cx - side * w * .6, cy - h * 1.35 * open); c.quadraticCurveTo(cx + side * w * .2, cy - h * 1.75 * open, cx + side * w * .9, cy - h * 1.05); c.stroke();
  // kelopak bawah
  c.strokeStyle = 'rgba(120,70,70,.35)'; c.lineWidth = 1.3;
  c.beginPath(); c.moveTo(cx - side * w * .7, cy + h * .75 * open); c.quadraticCurveTo(cx, cy + h * 1.05 * open, cx + side * w * .85, cy + h * .45); c.stroke();
  if (s.age === 'old') { // kerutan
    c.strokeStyle = 'rgba(120,70,60,.35)'; c.lineWidth = 1.4;
    for (let k = 0; k < 3; k++) { c.beginPath(); c.moveTo(cx + side * (w + 4), cy - 4 + k * 5); c.lineTo(cx + side * (w + 12), cy - 7 + k * 7); c.stroke(); }
  }
  c.restore();
}

function drawBrow(c: CanvasRenderingContext2D, s: CharSpec, side: -1 | 1, expr: Expr) {
  const cy = Y(s.age === 'kid' ? 0.485 : 0.468);
  const inner = X(side * 0.14), outer = X(side * 0.6);
  const lift = expr === 'surprised' ? -8 : 0;
  const innerDy = expr === 'sad' ? -7 : expr === 'surprised' ? -9 : 0;
  c.save();
  c.strokeStyle = mix(s.hairDark, '#20141a', .3); c.lineCap = 'round';
  c.lineWidth = s.female ? 5.5 : 8.5;
  if (s.age === 'old') c.strokeStyle = mix(s.hair, '#6a6060', .4);
  c.beginPath();
  c.moveTo(inner, cy + 2 + innerDy + lift);
  c.quadraticCurveTo((inner + outer) / 2, cy - 8 + lift + (expr === 'sad' ? 4 : 0), outer, cy + 4 + lift);
  c.stroke();
  c.restore();
}

function drawMouth(c: CanvasRenderingContext2D, s: CharSpec, expr: Expr) {
  const cx = X(0), cy = Y(s.age === 'kid' ? 0.70 : 0.705);
  c.save(); c.translate(cx, cy); c.scale(1.3, 1.3); c.translate(-cx, -cy);
  const lip = mix(s.skin, '#b8505c', .55);
  c.lineCap = 'round';
  if (expr === 'happy') {
    c.fillStyle = '#7a2a36';
    c.beginPath(); c.moveTo(cx - 17, cy - 3); c.quadraticCurveTo(cx, cy + 16, cx + 17, cy - 3); c.quadraticCurveTo(cx, cy + 2, cx - 17, cy - 3); c.fill();
    c.fillStyle = '#fbf6f2'; c.beginPath(); c.moveTo(cx - 13, cy - 1); c.quadraticCurveTo(cx, cy + 3, cx + 13, cy - 1); c.lineTo(cx + 11, cy + 2); c.quadraticCurveTo(cx, cy + 5, cx - 11, cy + 2); c.fill();
    c.fillStyle = '#e57a88'; c.beginPath(); c.ellipse(cx, cy + 8, 7, 3, 0, 0, Math.PI * 2); c.fill();
  } else if (expr === 'surprised') {
    c.fillStyle = '#7a2a36'; c.beginPath(); c.ellipse(cx, cy + 3, 7, 9, 0, 0, Math.PI * 2); c.fill();
    c.strokeStyle = lip; c.lineWidth = 2; c.stroke();
  } else if (expr === 'sad') {
    c.strokeStyle = mix(s.skin, '#6a2a36', .6); c.lineWidth = 2.6;
    c.beginPath(); c.moveTo(cx - 12, cy + 4); c.quadraticCurveTo(cx, cy - 4, cx + 12, cy + 4); c.stroke();
  } else {
    c.strokeStyle = mix(s.skin, '#6a2a36', .55); c.lineWidth = 2.6;
    c.beginPath(); c.moveTo(cx - 13, cy); c.quadraticCurveTo(cx, cy + 5, cx + 13, cy); c.stroke();
    c.strokeStyle = 'rgba(190,90,100,.25)'; c.lineWidth = 4; c.beginPath(); c.moveTo(cx - 7, cy + 6); c.quadraticCurveTo(cx, cy + 8, cx + 7, cy + 6); c.stroke();
  }
  c.restore();
}

function paint(s: CharSpec, expr: Expr): HTMLCanvasElement {
  const cv = document.createElement('canvas'); cv.width = FACE_W; cv.height = FACE_H;
  const c = cv.getContext('2d')!;
  // kulit + gradasi lembut (lebih gelap ke samping & ke bawah)
  c.fillStyle = s.skin; c.fillRect(0, 0, FACE_W, FACE_H);
  const side = c.createRadialGradient(X(0), Y(.55), 40, X(0), Y(.55), 260);
  side.addColorStop(0, 'rgba(255,255,255,.10)'); side.addColorStop(.6, 'rgba(255,255,255,0)'); side.addColorStop(1, 'rgba(120,60,50,.10)');
  c.fillStyle = side; c.fillRect(0, 0, FACE_W, FACE_H);
  const jaw = c.createLinearGradient(0, Y(.72), 0, Y(1));
  jaw.addColorStop(0, 'rgba(120,60,50,0)'); jaw.addColorStop(1, 'rgba(120,60,50,.22)');
  c.fillStyle = jaw; c.fillRect(0, Y(.72), FACE_W, Y(.28));
  // pipi merona
  const blushA = s.female || s.age === 'kid' ? .38 : .16;
  ([-1, 1] as const).forEach(sd => {
    const g = c.createRadialGradient(X(sd * .46), Y(.62), 2, X(sd * .46), Y(.62), 30);
    g.addColorStop(0, `rgba(240,120,120,${blushA})`); g.addColorStop(1, 'rgba(240,120,120,0)');
    c.fillStyle = g; c.fillRect(X(sd * .46) - 32, Y(.62) - 32, 64, 64);
  });
  // hidung: bayangan halus + kilau
  c.fillStyle = 'rgba(150,80,70,.28)'; c.beginPath(); c.ellipse(X(.03), Y(.635), 5, 3, 0, 0, Math.PI * 2); c.fill();
  c.strokeStyle = 'rgba(150,80,70,.2)'; c.lineWidth = 2; c.beginPath(); c.moveTo(X(-.05), Y(.555)); c.quadraticCurveTo(X(-.07), Y(.61), X(-.03), Y(.635)); c.stroke();
  drawBrow(c, s, -1, expr); drawBrow(c, s, 1, expr);
  drawEye(c, s, -1, expr); drawEye(c, s, 1, expr);
  drawMouth(c, s, expr);
  if (s.beard) {
    c.fillStyle = s.hair;
    c.beginPath(); c.moveTo(X(-.3), Y(.66)); c.quadraticCurveTo(X(0), Y(.64), X(.3), Y(.66)); c.quadraticCurveTo(X(0), Y(.7), X(-.3), Y(.66)); c.fill();
  }
  return cv;
}

const cache = new Map<string, THREE.CanvasTexture>();
export function faceTexture(s: CharSpec, expr: Expr): THREE.CanvasTexture {
  const key = s.key + ':' + expr;
  let t = cache.get(key);
  if (!t) {
    t = new THREE.CanvasTexture(paint(s, expr));
    t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
    t.userData.keep = true;
    cache.set(key, t);
  }
  return t;
}
export function clearFaces(prefix: string) {
  [...cache.keys()].forEach(k => { if (k.startsWith(prefix)) { cache.get(k)!.dispose(); cache.delete(k); } });
}
