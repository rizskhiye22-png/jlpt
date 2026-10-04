"""Uji aksi kerja nyata tambahan (kerja-aksi.js): バイタル, ganti baju 脱健着患, ubah posisi & cek kulit,
bagikan obat, percakapan (帰宅願望 dll.), pilah cucian/limbah, crane 玉掛け, harness 2丁掛け, pandu truk,
ikat besi; menu 🎮 Latihan aksi; bagian Pengaturan "Umum".
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
    plan = [(a, int(b)) for a, b in (x.split(':') for x in os.environ.get('PLAN', 'kaigo:5,kaigo:6,kaigo:3,kaigo:8,genba:9,genba:6,genba:8,genba:3').split(','))]
    for job, n in plan:
        pg.evaluate(f"setTimeout(() => Kerja.day('{job}', {n})); 0"); pg.wait_for_timeout(600)
        rank = KS.play(pg, f'aksi_{job}{n}', keep=True); close_all(pg, f'aksi_{job}{n}')
        print(f'{job} hari {n} → {rank}')
    # menu 🎮 Latihan aksi
    pg.evaluate("setTimeout(() => Kerja.open()); 0"); pg.wait_for_timeout(500)
    for job in ['kaigo', 'genba']:
        KS.tap(pg, f'[data-act={job}]'); pg.wait_for_timeout(400)
        names = pg.locator('.kj-actb span').all_inner_texts()
        print(f'latihan aksi {job}: {len(names)} aksi →', ', '.join(names[:8]), '…')
        pg.screenshot(path=f'{OUT}/aksi_menu_{job}.png', full_page=True)
        pick = 'Bagikan obat' if job == 'kaigo' else 'Pandu crane'
        pg.locator('.kj-actb', has_text=pick).first.click(); pg.wait_for_timeout(500)
        print(f'  main "{pick}" →', KS.play(pg, f'aksi_latih_{job}', keep=True))
        KS.tap(pg, '.kj [data-a=close]'); pg.wait_for_timeout(500)
    print('rekor karier tidak berubah oleh latihan:', pg.evaluate("JSON.stringify({ k: (Save.d.kerja.kaigo || {}).day, g: (Save.d.kerja.genba || {}).day })"))
    print('ERRORS:', H.errors or 'none')
