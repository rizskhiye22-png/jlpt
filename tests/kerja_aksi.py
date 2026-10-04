"""Uji aksi kerja nyata tambahan (kerja-aksi.js): バイタル, ganti baju 脱健着患, ubah posisi & cek kulit,
bagikan obat, percakapan (帰宅願望 dll.), pilah cucian/limbah, crane 玉掛け, harness 2丁掛け, pandu truk,
ikat besi; daftar hari dengan adegan, kamus kerja; bagian Pengaturan "Umum".
Jalankan: npm run build && npx vite preview --port 4173 &  lalu  python3 tests/kerja_aksi.py [folder_screenshot]"""
import sys, os, functools
print = functools.partial(print, flush=True)
sys.path.insert(0, os.path.dirname(__file__))
from playwright.sync_api import sync_playwright
import helpers as H
import kerja_sim as KS
from kerja_hari import close_all

OUT = sys.argv[1] if len(sys.argv) > 1 else '.'
KS.OUT = OUT

if __name__ == '__main__':
  with sync_playwright() as p:
    H.CTX['br'] = p.chromium.launch(executable_path=os.environ.get('PW_CHROMIUM') or None)
    pg = H.boot(H.base(12, 'after'))
    # Pengaturan: bagian Umum berisi opsi belajar & kerja
    pg.evaluate("setTimeout(() => Game.menu()); 0"); pg.wait_for_timeout(400)
    pg.click('.mi[data-a=settings]'); pg.wait_for_timeout(300)
    print('bagian pengaturan:', pg.locator('.settings .sec-h').all_inner_texts())
    print('opsi kerja ada:', pg.locator('.settings input[data-k=kjTrans]').count() == 1, '| tercentang:', pg.locator('.settings input[data-k=kjTrans]').is_checked())
    pg.click('.settings [data-a=close]'); pg.wait_for_timeout(300)
    pg.locator('.pad [data-btn=b]').dispatch_event('pointerdown'); pg.wait_for_timeout(400)
    plan = [(a, int(b)) for a, b in (x.split(':') for x in os.environ.get('PLAN', 'kaigo:13,kaigo:14,genba:12,genba:15,food:8,gaishoku:8,nogyo:7,chikusan:7').split(','))]
    for job, n in plan:
        pg.evaluate(f"setTimeout(() => Kerja.day('{job}', {n})); 0"); pg.wait_for_timeout(600)
        rank = KS.play(pg, f'aksi_{job}{n}', keep=True); close_all(pg, f'aksi_{job}{n}')
        print(f'{job} hari {n} → {rank}')
    # daftar hari menampilkan adegan tiap hari; kamus memuat kosakata cerita
    pg.evaluate("setTimeout(() => Kerja.open()); 0"); pg.wait_for_timeout(500)
    for job in ['kaigo', 'genba']:
        KS.tap(pg, f'[data-list={job}]') or KS.tap(pg, f'[data-day={job}]'); pg.wait_for_timeout(400)
        sc = pg.locator('.kj-dayb .kj-sc').all_inner_texts()
        print(f'daftar hari {job}: {len(sc)} hari, contoh →', sc[0][:60], '|', sc[13][:60] if len(sc) > 13 else '')
        pg.screenshot(path=f'{OUT}/aksi_hari_{job}.png', full_page=True)
        KS.tap(pg, '.kj [data-a=close]'); pg.wait_for_timeout(400)
    KS.tap(pg, '[data-kotoba=kaigo]'); pg.wait_for_timeout(400)
    print('kamus kaigo:', pg.locator('.kj-v').count(), 'kata · kategori:', pg.locator('.kj-kcat button').all_inner_texts())
    KS.tap(pg, '.kj [data-a=close]'); pg.wait_for_timeout(300)
    print('tombol 🎮 Aksi sudah tidak ada:', pg.locator('[data-act]').count() == 0)
    KS.tap(pg, '.kj [data-a=close]'); pg.wait_for_timeout(300)
    # tidak ada adegan yang sama di dua hari
    print('adegan berulang:', pg.evaluate("""(() => { const out = []; for (const [id, days] of Object.entries(Kerja.DAYS)) { const seen = new Map(); days.forEach((d, i) => d.tasks.forEach(x => { const k = typeof x === 'string' ? x : x.t + '|' + (x.title || x.q || ''); if (seen.has(k) && !(typeof x === 'object' && !x.title && !x.q)) out.push(id + ':' + k + ' ' + seen.get(k) + '/' + (i + 1)); else seen.set(k, i + 1); })); } return out.length ? out.slice(0, 5) : 'tidak ada'; })()"""))
    print('ERRORS:', H.errors or 'none')
