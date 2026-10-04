"""Uji video sensei YouTube: hari あいうえお hanya memutar bagian baris あ; tanpa internet → kembali ke video animasi.
Jalankan: npm run build && npx vite preview --port 4173 &  lalu  python3 tests/yt_video.py [folder_screenshot]"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from playwright.sync_api import sync_playwright
import helpers as H
OUT = sys.argv[1] if len(sys.argv) > 1 else '.'
with sync_playwright() as p:
    H.CTX['br'] = p.chromium.launch(executable_path=os.environ.get('PW_CHROMIUM') or None)
    pg = H.boot(H.base(12, 'after'))
    pg.evaluate("Save.d.settings.yt = true; 0")
    # pemetaan hari → baris video
    print(pg.evaluate("""JSON.stringify([['あ','い','う','え','お'], ['や','ゆ','よ','ら','り','る','れ','ろ'], ['ア','イ','ウ','エ','オ'], ['が','ぎ'], ['き']].map(k => YTSensei.rowsFor(k)))"""))
    pg.evaluate("setTimeout(() => Video.play({ kana: ['あ','い','う','え','お'], title: 'Video: Baris A', day: 1 }).then(() => window.__done = 1)); 0")
    pg.wait_for_selector('.yt', timeout=5000)
    pg.wait_for_timeout(11500)  # API YouTube diblokir di lingkungan uji → pesan offline
    print('info:', pg.locator('.yt-info').inner_text().replace('\n', ' | '), '| load:', pg.locator('.yt-load').inner_text() if pg.locator('.yt-load').count() else '-')
    pg.click('.yt [data-a=cal]'); pg.wait_for_timeout(200)
    pg.screenshot(path=f'{OUT}/yt_panel.png')
    pg.click('.yt [data-a=anim]'); pg.wait_for_timeout(800)
    print('animasi jalan:', pg.locator('.video canvas').count() == 1)
    pg.click('[data-a=skip]'); pg.wait_for_timeout(300)
    print('selesai:', pg.evaluate("window.__done || 0"))
    print('ERRORS:', H.errors or 'none')
