/* =========================================================
   BUKU BERGAMBAR 『さくら と ともだち』 + PETA HARTA 1976 + BENDA KENANGAN
   Sumber: design/08 §D, design/02 §A.5–A.6
   ========================================================= */
import type { Page, MapSpot, Item } from './types';

export const PAGES: Page[] = [
  { n: 1, title: 'はる の あさ', where: 'Kotak surat di loteng', art: 'tree',
    lines: ['はる の あさ。', 'おおきな さくら の き に、', 'ちいさな はなびら。', 'いち まい、に まい、さん まい。'],
    tr: ['Pagi musim semi.', 'Di pohon sakura yang besar,', 'kelopak-kelopak kecil.', 'Satu, dua, tiga.'] },
  { n: 2, title: 'なまえ', where: 'Di bawah papan lantai loteng', art: 'names',
    lines: ['はなびら の なまえ は、', 'ハル と ミナミ と モク。', 'ハル は あかるい。', 'ミナミ は とおい みなみ の くに から きた。', 'モク は え を かく。'],
    tr: ['Nama kelopak-kelopak itu:', 'Haru, Minami, dan Moku.', 'Haru ceria.', 'Minami datang dari negeri selatan yang jauh.', 'Moku menggambar.'] },
  { n: 3, title: 'かぜ', where: 'ほこら di tebing pantai (うみ)', art: 'wind',
    lines: ['ある ひ、つよい かぜ が ふきました。', 'さん まい は、ばらばら に', 'とんで いきました。'],
    tr: ['Suatu hari, angin kencang bertiup.', 'Ketiganya tercerai-berai,', 'terbang ke arah yang berbeda.'] },
  { n: 4, title: 'うみ', where: 'Kafe Hanamizuki, di balik bingkai menu', art: 'sea',
    lines: ['ミナミ は うみ へ。', 'なみ に ゆられて、とおく へ。', '「さびしい よ」と ないて います。'],
    tr: ['Minami ke laut.', 'Terombang-ambing ombak, jauh sekali.', '"Aku kesepian," tangisnya.'] },
  { n: 5, title: 'やま', where: 'Patung jizo di gunung (やま)', art: 'firefly',
    lines: ['ハル は やま へ。', 'ほたる が いいました。', '「きっと また あえる よ」', 'でも ハル は、しんじられません でした。'],
    tr: ['Haru ke gunung.', 'Kunang-kunang berkata,', '"Kalian pasti bertemu lagi."', 'Tapi Haru tidak bisa percaya.'] },
  { n: 6, title: 'かわ', where: 'Di bawah tatami onsen', art: 'river',
    lines: ['モク は かわ で、', 'いわ に ひっかかりました。', '「ぼく が もっと つよければ…」', 'モク は ずっと、かくれて いました。'],
    tr: ['Moku di sungai', 'tersangkut di batu.', '"Seandainya aku lebih kuat…"', 'Moku terus bersembunyi.'] },
  { n: 7, title: 'あき', where: 'Gudang ema kuil (てら)', art: 'autumn',
    lines: ['あき に なりました。', '[山|やま] は あかく、[川|かわ] は つめたく なりました。', 'さん まい は それぞれ、', 'ほか の はなびら を おもいだしました。'],
    tr: ['Musim gugur tiba.', 'Gunung memerah, sungai mendingin.', 'Ketiganya masing-masing', 'teringat kelopak yang lain.'] },
  { n: 8, title: 'つき と ひ', where: 'Kapsul waktu di atap department store (まち)', art: 'calendar',
    lines: ['[何日|なんにち] も、[何月|なんがつ] も たちました。', '[小|ちい]さな はなびら たち は、', '[大|おお]きな [木|き] の こと を', 'わすれません でした。'],
    tr: ['Berhari-hari, berbulan-bulan berlalu.', 'Kelopak-kelopak kecil itu', 'tidak melupakan', 'pohon besar.'] },
  { n: 9, title: 'ひかり', where: 'Mercusuar putih (みなと)', art: 'lighthouse',
    lines: ['[白|しろ]い とう の [上|うえ] で、', 'ひかり が まわって います。', 'ひかり は [言|い]いました。', '「みんな、[木|き] へ かえって おいで。', 'はる は かならず [来|き]ます。」'],
    tr: ['Di atas menara putih,', 'cahaya berputar.', 'Cahaya berkata,', '"Kalian semua, pulanglah ke pohon.', 'Musim semi pasti datang."'] },
  { n: 10, title: 'ただいま', where: 'Di dalam amplop surat Sato', art: 'bloom',
    lines: ['はる。', 'さくら の [木|き] の [下|した] に、', 'ハル と ミナミ と モク が かえって きました。', '「ただいま」「おかえり」', 'さん まい は、また いっしょ に さきました。', 'おわり'],
    tr: ['Musim semi.', 'Di bawah pohon sakura,', 'Haru, Minami, dan Moku pulang.', '"Aku pulang." "Selamat datang."', 'Ketiganya kembali mekar bersama.', 'Tamat'] },
  { n: 11, title: 'つづき', where: 'Digambar Kenta (Epilog)', art: 'newpetal',
    lines: ['そして、あたらしい はなびら が [一|いち]まい。', 'とおい くに から とんで きた、', 'ちいさな はなびら。', '「はじめまして」「ようこそ」', 'おはなし は、まだ つづきます。'],
    tr: ['Lalu, satu kelopak baru.', 'Terbang dari negeri yang jauh,', 'sebuah kelopak kecil.', '"Senang berkenalan." "Selamat datang."', 'Ceritanya masih berlanjut.'] },
];

/** Tanda × di Peta Harta 1976 (digambar Mori muda). x,y = posisi % di gambar peta. */
export const MAP_SPOTS: MapSpot[] = [
  { n: 2, text: 'さと の いえ の うえ', place: 'Loteng rumah Nenek Sato', chapter: 2, x: 30, y: 52 },
  { n: 3, text: 'うみ の ほこら', place: 'Kuil kecil di tebing pantai', chapter: 3, x: 12, y: 86 },
  { n: 4, text: 'メロンソーダ の みせ', place: 'Kafe Hanamizuki', chapter: 3, x: 52, y: 46 },
  { n: 5, text: 'やま の じぞうさん', place: 'Patung jizo di jalan gunung', chapter: 4, x: 78, y: 12 },
  { n: 6, text: 'おんせん の しょうじ の へや、たたみ の した', place: 'Kamar lama di onsen', chapter: 4, x: 88, y: 26 },
  { n: 7, text: 'おてら の えま の [木|き]', place: 'Gudang ema kuil てら', chapter: 5, x: 62, y: 16 },
  { n: 8, text: 'まち の デパート の うえ、[五十|ごじゅう] ねん ご', place: 'Atap department store (kapsul waktu)', chapter: 5, x: 86, y: 58 },
  { n: 9, text: 'みなと の [白|しろ]い とう', place: 'Mercusuar pelabuhan', chapter: 6, x: 40, y: 90 },
];

export const ITEMS: Item[] = [
  { id: 'key', icon: '🗝️', name: 'Kunci berkarat', desc: 'Digali Mochi di bedeng bunga Nenek Sato. Terikat pita merah yang pudar.' },
  { id: 'sepia', icon: '🖼️', name: 'Foto sepia', desc: 'Tiga remaja tertawa di pantai. Gadis di kanan memakai kain batik bermotif sama dengan kopermu.' },
  { id: 'map1976', icon: '🗺️', name: 'Peta Harta 1976', desc: 'Ditemukan Mai di buku perpustakaan. Di pojoknya: tiga kelopak sakura dan inisial S・D・M.' },
  { id: 'camera', icon: '📷', name: 'Kamera film lama', desc: 'Milik Dewi muda. "Supaya tidak lupa," katanya.' },
  { id: 'compost', icon: '🪴', name: 'Kompos Pak Petani', desc: 'Untuk menyehatkan akar pohon sakura tua di sekolah.' },
  { id: 'yukata', icon: '👘', name: 'Yukata biru tua', desc: 'Yukata yang dulu dipinjamkan Nenek Sato kepada Dewi muda.' },
  { id: 'petal', icon: '🌸', name: 'Kelopak kering', desc: 'Dikirim Eyang Dewi untuk Nenek Sato bersama tulisan ありがとう.' },
];
export const ITEM_BY = Object.fromEntries(ITEMS.map(i => [i.id, i]));
