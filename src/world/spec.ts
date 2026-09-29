/* =========================================================
   SPESIFIKASI KARAKTER 3D
   Diturunkan dari palet & gaya yang sama dengan versi pixel (Pix.PAL / Pix.STYLE),
   jadi setiap tokoh, pemain, dan pemain online otomatis punya versi 3D.
   ========================================================= */
export type Expr = 'normal' | 'happy' | 'sad' | 'surprised' | 'blink';
export type HairStyle = 'short' | 'bob' | 'long' | 'spiky' | 'twin' | 'bun' | 'bald';
export type Outfit = 'blazer' | 'sailor' | 'gakuran' | 'kimono' | 'apron' | 'tee' | 'cardigan';
export type Age = 'kid' | 'teen' | 'adult' | 'old';

export interface CharSpec {
  key: string;            // kunci cache (id + versi tampilan)
  id: string;
  skin: string; hair: string; hairDark: string; iris: string;
  top: string; topDark: string; accent: string; bottom: string; shoes: string; collar: string;
  hairStyle: HairStyle; outfit: Outfit; age: Age; female: boolean;
  glasses: boolean; ribbon: boolean; cap: boolean; headband: boolean; flower: boolean; beard: boolean;
  height: number;
}

const FEMALE = new Set(['yuki', 'sensei', 'obaa', 'hana', 'mai', 'emma']);
const AGE: Record<string, Age> = {
  kid: 'kid', mai: 'kid', obaa: 'old', ojii: 'old', imoya: 'old',
  sensei: 'adult', tenin: 'adult', omawari: 'adult', emma: 'adult', ryo: 'adult',
};
const HEIGHT: Record<Age, [number, number]> = { kid: [1.02, 1.04], teen: [1.36, 1.44], adult: [1.42, 1.52], old: [1.3, 1.38] };

let version = 0;
const versions = new Map<string, number>();
export function bumpLook(id: string) { versions.set(id, ++version); }

export function specFor(id: string): CharSpec {
  const pal = (Pix.PAL[id] || Pix.PAL.player || {}) as Record<string, string>;
  const st = (Pix.STYLE[id] || {}) as Record<string, any>;
  const hairStyle: HairStyle = st.hair === 'bun' ? 'bun' : st.hair || 'short';
  const outfit: Outfit = st.uniform || 'blazer';
  const isPlayerLike = id === 'player' || id.startsWith('o_');
  const female = isPlayerLike ? ['bob', 'long', 'twin'].includes(hairStyle) || outfit === 'sailor' : FEMALE.has(id);
  const age: Age = AGE[id] || (st.kid ? 'kid' : st.old ? 'old' : 'teen');
  const skin = pal.s || '#f5d6bf';
  return {
    key: id + '#' + (versions.get(id) || 0),
    id, skin,
    hair: pal.h || '#3f3a4f', hairDark: pal.H || Pix.shade(pal.h || '#3f3a4f', -.35),
    iris: pal.E || '#5a4a3a',
    top: pal.o || '#3e4a7a', topDark: pal.O || Pix.shade(pal.o || '#3e4a7a', -.3),
    accent: pal.a || '#d24c5a', bottom: pal.p || '#34497e', shoes: pal.b || '#3a2a2a', collar: pal.c || '#f7f3ea',
    hairStyle, outfit, age, female,
    glasses: !!st.glasses, ribbon: !!st.ribbon, cap: !!st.cap, headband: !!st.headband, flower: !!st.flower, beard: !!st.beard,
    height: HEIGHT[age][female ? 0 : 1],
  };
}
