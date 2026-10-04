"""Uji Simulasi Kerja: buka Menu → Kerja, mainkan keempat shift sampai penilaian.
Jalankan: npm run build && npx vite preview --port 4173 &  lalu  python3 tests/kerja_sim.py [folder_screenshot]"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from playwright.sync_api import sync_playwright
import helpers as H

OUT = sys.argv[1] if len(sys.argv) > 1 else '.'

def play_job(pg, jid, wrong=False):
    pg.click(f'[data-go={jid}]')
    shots = set()
    for _ in range(900):
        pg.wait_for_timeout(60)
        if pg.locator('.kj-rank').count():
            rank = pg.locator('.kj-rank').inner_text()
            pg.screenshot(path=f'{OUT}/kerja_{jid}_hasil.png')
            pg.click('.kj [data-a=close]'); pg.wait_for_timeout(800)
            return rank
        if pg.locator('.timecard').count(): pg.locator('.modals').click(); continue
        if pg.locator('.kj-seq').count():  # urutkan
            b = pg.locator('.kj-opts .kj-o')
            if b.count():
                if 'order' not in shots: shots.add('order'); pg.screenshot(path=f'{OUT}/kerja_{jid}_urut.png')
                i = min(int(b.nth(k).get_attribute('data-i')) for k in range(b.count()))
                pg.click(f'.kj-o[data-i="{i}"]')
            else: pg.click('.kj-opts .btn')
            continue
        if pg.locator('.kj-grid').count():  # pilih
            if 'pick' not in shots:
                shots.add('pick'); pg.locator('.kj-t').first.click(); pg.click('[data-a=check]'); pg.screenshot(path=f'{OUT}/kerja_{jid}_pilih.png')
            else: pg.click('[data-a=check]')
            continue
        if pg.locator('.kj-card').count():  # ヨシ / NG
            if pg.locator('.kj-yn .btn.block').count(): pg.click('.kj-yn .btn.block'); continue
            if 'spot' not in shots: shots.add('spot'); pg.screenshot(path=f'{OUT}/kerja_{jid}_cek.png')
            pg.click('.kj-ok' if pg.evaluate("Math.random()<.5") else '.kj-ng'); pg.wait_for_timeout(1400); continue
        if pg.locator('.choices .choice').count():
            if 'quiz' not in shots: shots.add('quiz'); pg.screenshot(path=f'{OUT}/kerja_{jid}_kuis.png')
            pg.locator('.choices .choice').first.click(); continue
        if pg.locator('.dialog:not(.hide)').count(): pg.locator('.dialog').click(); continue
    raise RuntimeError('timeout ' + jid)

with sync_playwright() as p:
    H.CTX['br'] = p.chromium.launch(executable_path=os.environ.get('PW_CHROMIUM') or None)
    pg = H.boot(H.base(12, 'after'))
    pg.evaluate("setTimeout(() => Game.menu()); 0"); pg.wait_for_timeout(400)
    pg.click('.mi[data-a=kerja]'); pg.wait_for_timeout(400)
    pg.screenshot(path=f'{OUT}/kerja_menu.png')
    pg.click('[data-info=kaigo]'); pg.wait_for_timeout(300)
    pg.screenshot(path=f'{OUT}/kerja_info.png', full_page=True)
    pg.click('.kj [data-a=close]'); pg.wait_for_timeout(300)
    for j in ['food', 'kaigo', 'genba', 'gaishoku']:
        print(j, '→ rank', play_job(pg, j))
    rec = pg.evaluate("JSON.stringify(Save.d.kerja)"); print('save', rec)
    print('stamps', pg.evaluate("Save.d.stamps.filter(s => s.id.startsWith('kerja')).map(s => s.title)"))
    pg.screenshot(path=f'{OUT}/kerja_menu_after.png')
    print('ERRORS:', H.errors or 'none')
