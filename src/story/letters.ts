/* =========================================================
   14 SURAT — isi sama dengan design/08-SURAT-DAN-BUKU-BERGAMBAR.md
   Kata yang hurufnya belum dipelajari tampil kabur (lihat readable.ts).
   ========================================================= */
import type { Letter } from './types';

export const LETTERS: Letter[] = [
  {
    id: 'L01', n: 1, title: 'はる の てがみ', from: 'dewi', date: 'April 1976',
    unlock: 'attic_opened', hint: 'Buka loteng rumah Nenek Sato.',
    lines: ['さとちゃん へ', '', 'さくら の はな、とても きれい ね。', 'にほん の はる、すき よ。', 'さとちゃん の おかあさん の おかし、ほんとう に おいしい。', 'あした も たくさん はなそう ね。', '', 'Dewi'],
    tr: ['Untuk Sato-chan', '', 'Bunga sakura indah sekali, ya.', 'Aku suka musim semi di Jepang.', 'Kue ibumu benar-benar enak.', 'Besok kita ngobrol banyak lagi, ya.', '', 'Dewi'],
  },
  {
    id: 'L02', n: 2, title: 'カメラ', from: 'dewi', date: 'Mei 1976',
    unlock: 'letter2_open', hint: 'Terbuka di awal Bab 2.',
    lines: ['さとちゃん へ', '', 'インドネシア の ちち から、カメラ を もらいました。', 'この カメラ は すてき。 いろいろ な もの を とりたい。', 'さくら も、かわ も、ねこ も、さとちゃん も！', 'わすれない ように。', 'あした は ふたり を とりたい な。', '', 'Dewi'],
    tr: ['Untuk Sato-chan', '', 'Aku dapat kamera dari ayahku di Indonesia.', 'Kamera ini keren. Aku ingin memotret macam-macam.', 'Sakura, sungai, kucing, dan Sato-chan juga!', 'Supaya tidak lupa.', 'Besok aku ingin memotret kita berdua.', '', 'Dewi'],
  },
  {
    id: 'L03', n: 3, title: 'うみ の しゃしん', from: 'dewi', date: 'Juni 1976',
    unlock: 'letter3_open', hint: 'Terbuka setelah Festival Sekolah (Bab 2).',
    lines: ['さとちゃん へ', '', 'うみ の しゃしん、みて！', 'みんな、~わらって いる ね。', 'あの ひ の そら の いろ、わすれない。', 'また みんな で うみ に いきたい な。', 'うみ の ほこら の こと は、ひみつ よ。', '', 'Dewi'],
    tr: ['Untuk Sato-chan', '', 'Lihat foto di laut!', 'Semua tertawa, ya.', 'Warna langit hari itu tak akan kulupakan.', 'Aku ingin ke laut lagi bersama semuanya.', 'Soal ほこら (kuil kecil) di laut, rahasia, ya.', '', 'Dewi'],
  },
  {
    id: 'L04', n: 4, title: 'もりくん の え', from: 'dewi', date: 'Juni 1976',
    unlock: 'ch2_done', hint: 'Surat bonus: berteman akrab dengan Yuki (♥6) sampai akhir Bab 2.',
    extra: s => (s.friends?.yuki || 0) >= 6,
    lines: ['さとちゃん へ', '', 'もりくん の え、みた？', 'ねこ も、はな も、いきて いる みたい。', 'わたし、もりくん の え が すき。', 'ねえ、さんにん で えほん を つくらない？', 'わたしたち の ほん。', '', 'Dewi'],
    tr: ['Untuk Sato-chan', '', 'Sudah lihat gambar Mori-kun?', 'Kucing dan bunganya seperti hidup.', 'Aku suka gambar Mori-kun.', 'Eh, bagaimana kalau kita bertiga membuat buku bergambar?', 'Buku milik kita.', '', 'Dewi'],
  },
  {
    id: 'L05', n: 5, title: 'メロンソーダ', from: 'dewi', date: 'Juni 1976',
    unlock: 'letter5_open', hint: 'Bab 3 (musim hujan).',
    lines: ['さとちゃん へ', '', 'あめ の ひ の カフェ、たのしい ひ でした ね。', 'はじめて の メロンソーダ！', 'みどり いろ で、あまくて、おどろきました。', 'さとちゃん の ゆめ を ききました。', 'せんせい に なりたい、と。', 'かならず なれる よ。 さとちゃん は やさしい から。', 'わたし の ゆめ は まだ ない けど、', 'さとちゃん の ゆめ を おうえん する よ。', '', 'Dewi'],
    tr: ['Untuk Sato-chan', '', 'Hari hujan di kafe menyenangkan, ya.', 'Melon soda pertamaku!', 'Hijau, manis, aku sampai kaget.', 'Aku mendengar mimpimu.', 'Kamu ingin jadi guru.', 'Kamu pasti bisa, karena kamu baik hati.', 'Aku belum punya mimpi,', 'tapi aku mendukung mimpimu.', '', 'Dewi'],
  },
  {
    id: 'L06', n: 6, title: 'みなと の ふね', from: 'dewi', date: 'Juli 1976',
    unlock: 'letter6_open', hint: 'Bab 3 (akhir).',
    lines: ['さとちゃん へ', '', 'きのう、インドネシア の はは に てがみ を かきました。', 'すこし なきました。', 'もりくん と みなと へ いきました。', 'おおきな ふね が たくさん ありました。', '「いつか あの ふね で かえる の かな」と おもいました。', 'かえる ひ まで、あと 300 にち。', 'でも、いま は まだ かえりたくない。', 'さとちゃん と もりくん が いる から。', '', 'Dewi'],
    tr: ['Untuk Sato-chan', '', 'Kemarin aku menulis surat untuk ibuku di Indonesia.', 'Aku sedikit menangis.', 'Aku pergi ke pelabuhan bersama Mori-kun.', 'Banyak kapal besar.', '"Suatu hari aku akan pulang dengan kapal itu," pikirku.', 'Tinggal 300 hari lagi sampai aku pulang.', 'Tapi sekarang aku belum ingin pulang,', 'karena ada Sato-chan dan Mori-kun.', '', 'Dewi'],
  },
  {
    id: 'L07', n: 7, title: 'ほし と たんざく', from: 'dewi', date: 'Agustus 1976',
    unlock: 'letter7_open', hint: 'Bab 4 (menginap di onsen).',
    lines: ['さとちゃん へ', '', 'やま の よる は、ほし が いっぱい！', 'ほたる も みたね。', 'もりくん が つかまえて、すぐ にがして あげた ね。', 'たなばた の たんざく に、わたし は こう かきました。', '「さんにん が ずっと いっしょ に いられますように」', 'おりひめ と ひこぼし は、1ねん に 1かい しか あえない。', 'わたしたち は、まいにち あえる。 しあわせ ね。', '', 'Dewi'],
    tr: ['Untuk Sato-chan', '', 'Malam di gunung, bintangnya banyak sekali!', 'Kita juga melihat kunang-kunang.', 'Mori-kun menangkapnya lalu langsung melepaskannya, ya.', 'Di tanzaku Tanabata aku menulis:', '"Semoga kami bertiga selalu bisa bersama."', 'Orihime dan Hikoboshi hanya bertemu setahun sekali.', 'Kita bisa bertemu setiap hari. Bahagia, ya.', '', 'Dewi'],
  },
  {
    id: 'L08', n: 8, title: 'ごめんね', from: 'dewi', date: 'Agustus 1976',
    unlock: 'letter8_open', hint: 'Bab 4 (Natsu Matsuri).',
    lines: ['さとちゃん へ', '', 'きのう は ごめんね。', 'わたし、きんぎょすくい に むちゅう で、', 'はなび の やくそく を わすれて いた。', 'さとちゃん が おこる の は とうぜん です。', 'でも、ひとり で はなび を みた とき、', 'ぜんぜん きれい じゃ なかった。', 'さとちゃん が となり に いない と、だめ みたい。', 'さとちゃん は、わたし の いちばん の ともだち。', 'ゆるして くれる？', '', 'Dewi', '', 'P.S. もりくん が、きんぎょ を さとちゃん に あげたい って。'],
    tr: ['Untuk Sato-chan', '', 'Maaf soal kemarin.', 'Aku terlalu asyik menangkap ikan mas,', 'sampai lupa janji menonton kembang api.', 'Wajar kamu marah.', 'Tapi waktu aku menonton kembang api sendirian,', 'sama sekali tidak indah.', 'Sepertinya aku tidak bisa kalau kamu tidak di sebelahku.', 'Kamu sahabat terbaikku.', 'Maukah kamu memaafkanku?', '', 'Dewi', '', 'P.S. Mori-kun ingin memberikan ikan masnya untukmu.'],
  },
  {
    id: 'L09', n: 9, title: 'えま', from: 'dewi', date: 'Oktober 1976',
    unlock: 'letter9_open', hint: 'Bab 5 (musim gugur).',
    lines: ['さとさん へ', '', '（きょう は ていねい な ことば で かきます。 れんしゅう です！）', '', '[今日|きょう] は てら へ いきました。', 'しか が おじぎ を しました。 わたし も おじぎ を しました。', 'おてら で えま を かきました。', '「ずっと ともだち」と かきました。', 'もりくん は、みんな の まえ で は なにも かきませんでした。', 'はずかしい そう です。', 'でも、あと で ひとり で なにか を かいて いました。', 'なん と かいた の でしょう？', '', 'Dewi'],
    tr: ['Untuk Sato-san', '', '(Hari ini aku menulis dengan bahasa sopan. Latihan!)', '', 'Hari ini kami pergi ke kuil.', 'Rusanya membungkuk. Aku juga membungkuk.', 'Di kuil aku menulis ema.', 'Aku menulis "Selamanya sahabat".', 'Di depan semua orang, Mori-kun tidak menulis apa-apa.', 'Katanya malu.', 'Tapi nanti ia menulis sesuatu sendirian.', 'Kira-kira apa yang ia tulis, ya?', '', 'Dewi'],
  },
  {
    id: 'L10', n: 10, title: 'さよなら じゃ ない', from: 'dewi', date: 'Maret 1977',
    unlock: 'letter10_open', hint: 'Bab 5 (malam Tsukimi).',
    lines: ['さとちゃん へ', '', 'ねつ は だいじょうぶ？ むり しないで ね。', '[今日|きょう]、わたし は みなと から ふね で かえります。', 'さとちゃん に あえない の は さびしい けど、', 'ないたら あなた が しんぱい する から、わらって いきます。', '', 'この 1[年|ねん]、ほんとう に ありがとう。', 'にほんご も、おりがみ も、おちゃ の のみかた も、', 'ぜんぶ さとちゃん が おしえて くれた。', '', 'あたらしい じゅうしょ を かきます。 バンドン に ひっこします。', 'Jl. Kenanga No. 17, Bandung, Indonesia', '', 'へんじ、まって います。', 'もりくん が、さとちゃん の へんじ を', 'みなと の ゆうびんきょく から だして くれる そう です。', '', 'また、さくら の [木|き] の [下|した] で あいましょう。', 'ずっと ともだち。', '', 'Dewi'],
    tr: ['Untuk Sato-chan', '', 'Demammu tidak apa-apa? Jangan memaksakan diri.', 'Hari ini aku pulang naik kapal dari pelabuhan.', 'Sedih tidak bisa bertemu,', 'tapi kalau aku menangis kamu akan khawatir, jadi aku pergi sambil tersenyum.', '', 'Terima kasih untuk satu tahun ini.', 'Bahasa Jepang, origami, cara minum teh,', 'semuanya kamu yang mengajariku.', '', 'Aku tulis alamat baruku. Aku pindah ke Bandung.', '(alamat — fiktif)', '', 'Aku menunggu balasanmu.', 'Katanya Mori-kun akan mengirim balasanmu', 'dari kantor pos pelabuhan.', '', 'Mari bertemu lagi di bawah pohon sakura.', 'Selamanya sahabat.', '', 'Dewi'],
  },
  {
    id: 'L11', n: 11, title: 'まって います', from: 'dewi', date: 'Mei 1977',
    unlock: 'letter11_found', hint: 'Bab 6 (pelabuhan みなと).',
    note: 'Cap merah di amplop: あてさき ふめい (alamat tidak dikenal).',
    lines: ['さとちゃん へ', '', 'げんき ですか。', 'バンドン に ついて、もう 2か[月|げつ] に なります。', 'さとちゃん から の てがみ を、まいにち まって います。', 'でも、ポスト は いつも からっぽ です。', '', 'わたし の こと、おこって いますか。', 'みおくり に こなかった こと は、[気|き] に して いない よ。', 'ねつ だった の は、もりくん から [聞|き]きました。', '', 'こちら には さくら が ありません。', 'でも、[白|しろ]い [花|はな] の [木|き] が あります。', 'その [木|き] の [下|した] で、まいとし はる に、さとちゃん を まちます。', '[何年|なんねん] たっても、まって います。', '', 'ずっと ともだち。', 'Dewi'],
    tr: ['Untuk Sato-chan', '', 'Apa kabar?', 'Sudah dua bulan sejak aku tiba di Bandung.', 'Setiap hari aku menunggu suratmu.', 'Tapi kotak pos selalu kosong.', '', 'Apakah kamu marah padaku?', 'Aku tidak mempermasalahkan kamu tidak mengantarku.', 'Mori-kun bilang kamu demam.', '', 'Di sini tidak ada sakura.', 'Tapi ada pohon berbunga putih.', 'Setiap musim semi, di bawah pohon itu, aku menunggumu.', 'Berapa tahun pun, aku akan menunggu.', '', 'Selamanya sahabat.', 'Dewi'],
  },
  {
    id: 'L12', n: 12, title: 'はる の やくそく', from: 'sato', date: 'Maret 1977',
    unlock: 'letter12_obtained', hint: 'Bab 6 (musim dingin).',
    note: 'Surat Sato yang tidak pernah terkirim.',
    lines: ['デウィ へ', '', 'ごめんなさい。', '[見|み]おくり に [行|い]けなくて、ほんとう に ごめんなさい。', 'ねつ で、[立|た]つ こと も できませんでした。', '', 'デウィ が [来|き]た [日|ひ] の こと を おぼえて いますか。', '[駅|えき] で、あなた は はずかしそう に「こんにちは」と [言|い]いました。', 'あの [日|ひ] から、[毎日|まいにち] が [新|あたら]しくて、たのしかった。', 'いっしょ に [本|ほん] を [読|よ]んで、たくさん [話|はな]して、たくさん わらいました。', '[国|くに] が ちがっても、デウィ は わたし の いちばん の [友|とも]だち です。', '', 'わたし は [先生|せんせい] に なります。', 'デウィ が「なれる」と [言|い]って くれた から。', '', '[毎年|まいとし]、はる に なったら、', '[学校|がっこう] の さくら の [木|き] の [下|した] で まって います。', 'いつか また、ここ で あいましょう。', '', 'この てがみ に、えほん の さいご の ページ を いれます。', 'おはなし の おわり は、デウィ が もって いて ください。', 'そして いつか、つづき を いっしょ に かきましょう。', '', 'ずっと ともだち。', 'ハル（さと）より'],
    tr: ['Untuk Dewi', '', 'Maaf.', 'Maaf sekali aku tidak bisa mengantarmu.', 'Aku demam sampai tidak bisa berdiri.', '', 'Ingat hari kamu datang?', 'Di stasiun kamu malu-malu berkata "konnichiwa".', 'Sejak hari itu, setiap hari terasa baru dan menyenangkan.', 'Kita membaca buku bersama, banyak mengobrol, banyak tertawa.', 'Walau negara kita berbeda, kamu sahabat terbaikku.', '', 'Aku akan menjadi guru.', 'Karena kamu bilang aku bisa.', '', 'Setiap musim semi,', 'aku akan menunggu di bawah pohon sakura sekolah.', 'Suatu hari, mari bertemu lagi di sini.', '', 'Kuselipkan halaman terakhir buku kita.', 'Simpanlah akhir ceritanya.', 'Dan suatu hari, mari kita tulis lanjutannya bersama.', '', 'Selamanya sahabat.', 'Dari Haru (Sato)'],
  },
  {
    id: 'L13', n: 13, title: 'デウィ おばあちゃん へ', from: 'player', date: 'Musim semi',
    unlock: 'letter13_written', hint: 'Ditulis olehmu sendiri di Epilog.',
    lines: [], tr: [],
  },
  {
    id: 'L14', n: 14, title: 'リヨン から', from: 'emma', date: 'Setelah tamat',
    unlock: 'game_cleared', hint: 'Surat bonus setelah tamat.',
    lines: ['{name} へ', '', 'こんにちは！ リヨン は まだ さむい です。', 'わたし は だいがく で にほんご の べんきょう を つづけて います。', 'みなと の しろい とう、 いつも おもいだします。', 'こんど は わたし が あなた を フランス に あんない したい です。', 'てがみ、ちゃんと とどきました か？', '', 'ずっと ともだち。', 'Emma'],
    tr: ['Untuk {name}', '', 'Halo! Lyon masih dingin.', 'Aku terus belajar bahasa Jepang di universitas.', 'Aku selalu teringat menara putih di pelabuhan.', 'Lain kali, aku yang ingin mengajakmu keliling Prancis.', 'Suratku sampai dengan benar, kan?', '', 'Selamanya sahabat.', 'Emma'],
  },
];

export const LETTER_BY = Object.fromEntries(LETTERS.map(l => [l.id, l])) as Record<string, Letter>;
