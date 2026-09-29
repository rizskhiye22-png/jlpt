/* =========================================================
   HALAMAN TEMAN (React)
   Lihat potret & sprite pixel tiap tokoh (berjalan di tempat), tingkat keakraban,
   jajanan favorit, dan dengarkan perkenalan diri mereka dalam bahasa Jepang.
   ========================================================= */
import { useEffect, useRef, useState } from 'react';

declare const FAVORITE: Record<string, string>;
declare const SNACKS: Array<{ id: string; jp: string; ro: string; name: string }>;

interface Bio { jp: string; ro: string; id: string; about: string }
const BIOS: Record<string, Bio> = {
  yuki:    { jp: 'はじめまして。ゆき です。よろしく ね！', ro: 'hajimemashite. yuki desu. yoroshiku ne!', id: 'Salam kenal. Aku Yuki. Mohon bantuannya, ya!', about: 'Teman sekelas pertamamu. Ceria, suka dango, dan ikut klub karuta.' },
  kenta:   { jp: 'おれ は けんた。サッカー が すき！', ro: 'ore wa kenta. sakkaa ga suki!', id: 'Aku Kenta. Aku suka sepak bola!', about: 'Teman sebangku yang penuh semangat. Suka sepak bola dan melon pan.' },
  hana:    { jp: 'はな です。ほん が すき です。', ro: 'hana desu. hon ga suki desu.', id: 'Aku Hana. Aku suka buku.', about: 'Kakak kelas yang tenang dan suka membaca. Keluarganya punya kafe kecil.' },
  sensei:  { jp: 'たなか です。いっしょ に べんきょう しましょう。', ro: 'tanaka desu. issho ni benkyou shimashou.', id: 'Saya Tanaka. Ayo belajar bersama.', about: 'Wali kelasmu. Sabar, menjelaskan pelan-pelan, dan diam-diam suka dorayaki.' },
  obaa:    { jp: 'おかえり。ごはん が できた よ。', ro: 'okaeri. gohan ga dekita yo.', id: 'Selamat datang. Makanannya sudah siap.', about: 'Nenek Sato, tempatmu tinggal. Masakannya enak dan selalu menyambutmu pulang.' },
  tenin:   { jp: 'いらっしゃいませ！', ro: 'irasshaimase!', id: 'Selamat datang (di toko)!', about: 'Kasir konbini yang ramah. Hafal jajanan kesukaan semua orang.' },
  kid:     { jp: 'そら だよ！あそぼう！', ro: 'sora da yo! asobou!', id: 'Aku Sora! Ayo main!', about: 'Anak tetangga yang suka bermain layang-layang di taman.' },
  ojii:    { jp: 'もり です。ねこ の もち を しって いる かい？', ro: 'mori desu. neko no mochi wo shitte iru kai?', id: 'Saya Mori. Kamu kenal kucing Mochi?', about: 'Kakek Mori, pemilik kucing Mochi yang suka kabur.' },
  mai:     { jp: 'まい です！あめ が すき！', ro: 'mai desu! ame ga suki!', id: 'Aku Mai! Aku suka permen!', about: 'Anak kecil yang kadang tersesat di kota.' },
  emma:    { jp: 'ハロー！エマ です。にほんご を べんきょう して います。', ro: 'haroo! ema desu. nihongo wo benkyou shite imasu.', id: 'Halo! Aku Emma. Aku sedang belajar bahasa Jepang.', about: 'Turis dari luar negeri yang juga sedang belajar bahasa Jepang, sama sepertimu.' },
  omawari: { jp: 'おまわりさん です。きをつけて ね。', ro: 'omawarisan desu. ki wo tsukete ne.', id: 'Saya polisi. Hati-hati, ya.', about: 'Polisi kota di pos koban. Siap membantu kalau ada yang tersesat.' },
  ryo:     { jp: 'りょう です。ギター を ひきます。', ro: 'ryou desu. gitaa wo hikimasu.', id: 'Aku Ryo. Aku bermain gitar.', about: 'Musisi jalanan yang bermain lagu di dekat stasiun.' },
  imoya:   { jp: 'やきいも！あつい よ！', ro: 'yakiimo! atsui yo!', id: 'Ubi bakar! Masih panas, lho!', about: 'Penjual ubi bakar keliling. Wanginya tercium dari jauh.' },
};
const ORDER = ['yuki', 'kenta', 'hana', 'sensei', 'obaa', 'tenin', 'kid', 'ojii', 'mai', 'emma', 'omawari', 'ryo', 'imoya'];

// Potret besar + sprite yang berjalan di tempat (berputar arah pelan-pelan)
function Viewer({ id }: { id: string }) {
  const face = useRef<HTMLCanvasElement>(null), walk = useRef<HTMLCanvasElement>(null);
  useEffect(() => { if (face.current) Pix.drawPortrait(face.current, id, 'happy'); }, [id]);
  useEffect(() => {
    const dirs = ['down', 'left', 'up', 'right'];
    let n = 0, blink = 0;
    const t = setInterval(() => {
      n++;
      const c = walk.current?.getContext('2d');
      if (c) { c.clearRect(0, 0, 16, 16); c.drawImage(Pix.sprite(id, dirs[Math.floor(n / 8) % 4], n % 2 ? 1 : 2), 0, 0); }
      if (face.current && ++blink % 14 === 0) { Pix.drawPortrait(face.current, id, 'blink'); setTimeout(() => face.current && Pix.drawPortrait(face.current, id, 'happy'), 140); }
    }, 220);
    return () => clearInterval(t);
  }, [id]);
  return (
    <div className="fr-view">
      <canvas ref={face} width={48} height={48} className="fr-face" />
      <canvas ref={walk} width={16} height={16} className="fr-walk" />
    </div>
  );
}

function Thumb({ id }: { id: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => { if (ref.current) Pix.drawPortrait(ref.current, id, 'happy'); }, [id]);
  return <canvas ref={ref} width={48} height={48} className="fr-thumb" />;
}

export function Friends({ onClose }: { onClose: () => void }) {
  const [sel, setSel] = useState('yuki');
  const friends: Record<string, number> = Save.d.friends || {};
  const bio = BIOS[sel];
  const snackId = typeof FAVORITE !== 'undefined' ? FAVORITE[sel] : undefined;
  const snack = snackId && typeof SNACKS !== 'undefined' ? SNACKS.find(s => s.id === snackId) : undefined;
  const hearts = Math.min(10, friends[sel] || 0);
  return (
    <div className="win friends">
      <div className="w-title">Teman <span className="muted small">ともだち · tomodachi</span></div>
      <div className="fr-main">
        <Viewer id={sel} />
        <div className="fr-info">
          <div className="fr-name" style={{ ['--c' as string]: CHARACTERS[sel]?.color }}>{CHARACTERS[sel]?.name || sel}</div>
          <div className="fr-hearts" aria-label={`Keakraban ${hearts} dari 10`}>
            {Array.from({ length: 10 }, (_, i) => <i key={i} className={i < hearts ? 'on' : ''}>♥</i>)}
          </div>
          <p className="fr-about">{bio.about}</p>
          {snack && <p className="fr-snack">Jajanan favorit: <b>{snack.jp}</b> <span className="muted">({snack.ro})</span></p>}
          <button className="fr-say" type="button" onClick={() => Sound.speak(bio.jp)}>
            <span className="jp">{bio.jp}</span>
            {Save.d.settings.romaji !== false && <span className="ro">{bio.ro}</span>}
            <span className="idn">♪ {bio.id}</span>
          </button>
        </div>
      </div>
      <div className="fr-list">
        {ORDER.filter(id => CHARACTERS[id]).map(id => (
          <button key={id} type="button" className={'fr-item' + (id === sel ? ' on' : '')} onClick={() => { Sound.blip(); setSel(id); }}>
            <Thumb id={id} />
            <span>{(CHARACTERS[id].name || id).replace(/\s*\(.*\)/, '')}</span>
          </button>
        ))}
      </div>
      <button className="btn block" data-a="close" type="button" onClick={onClose}>Tutup</button>
    </div>
  );
}
