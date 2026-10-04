"""Uji Karier 15 hari: memainkan hari-hari contoh di 6 bidang (termasuk hari libur di asrama,
slip gaji hari 5, dan kelulusan + sertifikat hari 15), plus shift latihan pertanian & peternakan.
Jalankan: npm run build && npx vite preview --port 4173 &  lalu  python3 tests/kerja_hari.py [folder_screenshot]"""
import sys, os, functools
print = functools.partial(print, flush=True)
sys.path.insert(0, os.path.dirname(__file__))
from playwright.sync_api import sync_playwright
import helpers as H
import kerja_sim as KS

OUT = sys.argv[1] if len(sys.argv) > 1 else '.'
KS.OUT = OUT

def close_all(pg, tag):
    seen = []
    for _ in range(8):
        pg.wait_for_timeout(400)
        t = pg.evaluate("(document.querySelector('.panels .w-title')||{}).textContent||''")
        if not t or not pg.locator('.panels .kj [data-a=close]').count(): break
        seen.append(t.strip()[:30]); pg.screenshot(path=f'{OUT}/hari_{tag}_{len(seen)}.png', full_page=True)
        KS.tap(pg, '.panels .kj [data-a=close]')
    return seen

def day(pg, job, n):
    pg.evaluate(f"setTimeout(() => Kerja.day('{job}', {n})); 0"); pg.wait_for_timeout(600)
    rank = KS.play(pg, f'{job}{n}', keep=True)
    extra = close_all(pg, f'{job}{n}')
    print(f'{job} hari {n} → {rank} · layar setelahnya: {extra}')

if __name__ == '__main__':
  with sync_playwright() as p:
        H.CTX['br'] = p.chromium.launch(executable_path=os.environ.get('PW_CHROMIUM') or None)
        pg = H.boot(H.base(12, 'after'))
        only = os.environ.get('PLAN')
        for job in ([] if only else ['nogyo', 'chikusan']):
            pg.evaluate(f"setTimeout(() => Kerja.run('{job}')); 0"); pg.wait_for_timeout(600)
            print(job, 'latihan →', KS.play(pg, job + '_latihan'))
        plan = [(a, int(b)) for a, b in (x.split(':') for x in only.split(','))] if only else [('food', 1), ('kaigo', 3), ('genba', 2), ('gaishoku', 2), ('nogyo', 6), ('chikusan', 6), ('nogyo', 10), ('food', 5)]
        for job, n in plan: day(pg, job, n)
        # hari 15 + sertifikat: tandai 14 hari sudah selesai
        pg.evaluate("Save.d.kerja.chikusan = Object.assign(Save.d.kerja.chikusan || {}, { day: 15, days: Object.fromEntries(Array.from({ length: 14 }, (_, i) => [i + 1, 'A'])) }); 0")
        day(pg, 'chikusan', 15)
        print('progres tersimpan:', pg.evaluate("JSON.stringify(Object.fromEntries(Object.entries(Save.d.kerja).map(([k, v]) => [k, v.day])))"))
        print('stempel:', pg.evaluate("Save.d.stamps.filter(s => s.id.startsWith('kerja')).map(s => s.title)"))
        # menu karier & kamus kerja
        pg.evaluate("setTimeout(() => Kerja.open()); 0"); pg.wait_for_timeout(500); pg.screenshot(path=f'{OUT}/hari_menu.png', full_page=True)
        KS.tap(pg, '[data-kotoba=genba]'); pg.wait_for_timeout(400); pg.screenshot(path=f'{OUT}/hari_kotoba.png', full_page=True)
        print('kamus genba:', pg.locator('.kj-v').count(), 'kata')
        KS.tap(pg, '[data-a=quiz]'); pg.wait_for_timeout(400)
        for _ in range(10):
            if not pg.locator('.ws-o').count(): break
            KS.tap(pg, '.ws-o'); pg.wait_for_timeout(1900)
        print('hasil latihan kosakata:', pg.locator('.kj-res').inner_text().replace('\n', ' ') if pg.locator('.kj-res').count() else '-')
        print('ERRORS:', H.errors or 'none')
