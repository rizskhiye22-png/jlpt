/* =========================================================
   TIPE DATA CERITA (v3 「さくら の てがみ」)
   Lihat design/08-SURAT-DAN-BUKU-BERGAMBAR.md & design/12-SISTEM-DAN-MINIGAME.md
   ========================================================= */

/** Satu baris dialog dalam format lama game (public/js). */
export type Line =
  | { n: string }
  | { w: string; e?: string; jp: string; ro: string; id: string }
  | { w: string; e?: string; t: string }
  | { q: string; o: Array<{ jp: string; ro: string; ok?: boolean; why?: string }> }
  | { choose: string; opts: string[] }   // pilihan teks Indonesia (tanpa benar/salah)
  | { act: Act };

/** Aksi khusus di tengah adegan (bukan dialog). */
export type Act =
  | { flag: string }
  | { item: string }                       // benda kenangan (kunci, foto, peta…)
  | { page: number }                       // halaman buku bergambar
  | { letter: string; read?: boolean }     // buka surat (read = mode membaca)
  | { points: number; why?: string }
  | { heart: string[] }
  | { toast: string }
  | { card: [string, string] }             // kartu judul (timecard)
  | { music: string }
  | { stamp: [string, string] }
  | { floorGame: true }                    // mini-game "ketuk papan lantai"
  | { goal: string }                        // teks tujuan sementara di HUD
  | { town: number }                       // Meter Kota +n
  | { trip: 'umi' | 'home' }               // pindah peta di tengah adegan
  | { kasir: { level: number; rounds?: number; title?: string } };

export type Slot = 'class' | 'morning' | 'after' | 'dinner' | 'night' | 'event';

export interface Scene {
  id: string;
  /** Kapan adegan boleh dimainkan (hari ≥ from, ≤ until). */
  from: number;
  until?: number;
  /** Di mana adegan dipicu. `talk:<npc>` = saat bicara dengan NPC itu; `event:<nama>` = dipanggil kode game. */
  slot: Slot | `talk:${string}` | `event:${string}`;
  /** Peta tempat NPC (untuk slot talk). Kosong = di mana saja. */
  map?: string;
  /** NPC cerita tambahan yang dimunculkan di kota (slot talk + spawn). */
  spawn?: { id: string; x: number; y: number; dir?: string; steps?: string[] };
  requires?: string[];
  /** Adegan wajib: bila terlewat di kota, diputar saat makan malam (dengan pembuka `fallback`). */
  must?: Line[];
  cast?: string[];
  lines: Line[];
  /** Syarat tambahan (dicek saat dijalankan). */
  cond?: (s: any) => boolean;
}

/** Surat. Setiap baris = string; kata dipisah spasi. `[漢字|かな]` = kanji. Awalan `~` = kata lunak (lihat 12 §A.3). */
export interface Letter {
  id: string;
  n: number;
  title: string;
  from: 'dewi' | 'sato' | 'emma' | 'player';
  date: string;
  /** Flag yang membuat surat muncul di kotak. */
  unlock: string;
  /** Petunjuk saat masih terkunci. */
  hint: string;
  lines: string[];
  tr: string[];
  /** Bonus: syarat tambahan. */
  extra?: (s: any) => boolean;
  note?: string;
}

export interface Page {
  n: number;
  title: string;
  where: string;
  lines: string[];
  tr: string[];
  art: 'tree' | 'names' | 'wind' | 'sea' | 'firefly' | 'river' | 'autumn' | 'calendar' | 'lighthouse' | 'bloom' | 'newpetal' | 'cover';
}

export interface MapSpot {
  n: number;           // nomor halaman
  text: string;        // tulisan di peta (token dipisah spasi)
  place: string;       // nama tempat (ditampilkan bila terbaca)
  chapter: number;     // bab kunjungan
  x: number; y: number; // posisi di gambar peta (0..100)
}

export interface Item { id: string; icon: string; name: string; desc: string; }
