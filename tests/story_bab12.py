"""Uji sinkron Bab 1–2 (v3.6): huruf rawan sebagai pengecoh, soal pasangan katakana→hiragana,
latihan Mata Jeli (Hari 10 & 21), romaji otomatis, contoh kata video dengan bantuan hiragana.
Jalankan: npm run build && npx vite preview --port 4173 &  lalu  python3 tests/story_bab12.py [folder_screenshot]"""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
exec(open(os.path.join(os.path.dirname(__file__), 'helpers.py')).read())

def early(day, step, kana):
    return {'name': 'Rizki', 'day': day, 'step': step, 'kana': kana, 'friends': {'yuki': 3, 'kenta': 3, 'hana': 0},
            'story': {'v': 3, 'flags': {'prolog_done': 1, 'attic_seen': 1}, 'seen': [], 'items': [], 'pages': [], 'opened': []}}

def harvest(page, js, label, limit=60):
    """Jalankan kuis/latihan dan catat setiap soal: (prompt, main, opsi)."""
    page.evaluate(f"void ({js}).then(r => {{ window.__r = r; }})")
    seen = []
    for _ in range(limit * 4):
        if ev(page, "!!window.__r"): break
        if page.locator('.quiz .opt:not([disabled])').count():
            seen.append(ev(page, "[document.querySelector('.q-prompt').innerText, document.querySelector('.q-main').innerText, [...document.querySelectorAll('.quiz .opt')].map(b => b.innerText.split('\\n')[0])]"))
            page.locator('.quiz .opt:not([disabled])').first.click()
        elif page.locator('.q-foot button').count(): page.locator('.q-foot button').click()
        elif page.locator('.panels.on button:not([disabled])').count(): page.locator('.panels.on button:not([disabled])').last.click()
        page.wait_for_timeout(120)
    print(f'{label}:', ev(page, "window.__r")); ev(page, "window.__r = null")
    return seen

with sync_playwright() as p:
    CTX['br'] = p.chromium.launch()
    # 1) data & migrasi romaji
    page = boot(early(10, 'wake', HIRA))
    print('data:', ev(page, "[DAYS[9].drill, DAYS[20].drill, SIMILAR['ね'], SIMILAR['シ'], Save.d.settings.romaji, WORDS.some(w => w.jp === 'トースト')]"))
    # 2) romaji otomatis
    page.evaluate("void UI.say({ w: 'yuki', jp: 'ねこ、かわいい ね。', ro: 'neko, kawaii ne.', id: 'Kucingnya lucu, ya.' })"); page.wait_for_selector('.dialog:not(.hide)')
    a = ev(page, "[!!document.querySelector('.dlg-ro:not(.hide)'), !!document.querySelector('.ro-peek')]")
    page.locator('.ro-peek').click(); b = ev(page, "!!document.querySelector('.dlg-ro:not(.hide)')")
    page.screenshot(path=f'{OUT}/b12_01_romaji_otomatis.png'); page.keyboard.press('Space'); page.wait_for_timeout(200)
    page.evaluate("void UI.say({ w: 'kenta', jp: 'げんき？', ro: 'genki?', id: 'Apa kabar?' })"); page.wait_for_timeout(300)
    c = ev(page, "!!document.querySelector('.dlg-ro:not(.hide)')"); page.keyboard.press('Space')
    print('romaji otomatis [ねこ tampil?, tombol Aa, setelah Aa, げんき tampil?]:', a + [b, c])
    # 3) Mata Jeli hiragana (Hari 10)
    q = harvest(page, "Story.drill('rawan')", 'Mata Jeli hiragana')
    print('   contoh ronde:', q[:3])
    grp = sum(1 for pr, main, opts in q if any(ev(page, f"KANA[{o!r}] && KANA[{o!r}].ro === {main!r} && (SIMILAR[{o!r}]||'').split('').some(x => {opts!r}.includes(x))") for o in opts))
    print('   ronde yang memuat huruf kembar:', grp, '/', len(q))
    # 4) Kuis katakana (Hari 21): pengecoh mirip & soal pasangan
    page = boot(early(21, 'wake', HIRA + KATA))
    qs = []
    for i in range(3): qs += harvest(page, "Lesson.quiz({ focus: ['シ','ツ','ソ','ン','ク'], count: 12, title: 'Uji' })", f'kuis {i+1}')
    twin = [x for x in qs if 'pasangan hiragana' in x[0]]
    sim = [x for x in qs if x[0].startswith(('Pilih huruf', 'Dengarkan')) and ev(page, f"(SIMILAR[{x[2][0]!r}] !== undefined) && {x[2]!r}.some(o => {x[2]!r}.some(k => (SIMILAR[o]||'').includes(k)))")]
    print('soal pasangan:', len(twin), twin[:2]); print('soal tulis dengan huruf kembar:', len(sim), '/', len([x for x in qs if x[0].startswith(('Pilih huruf', 'Dengarkan'))]))
    q = harvest(page, "Story.drill('rawan')", 'Mata Jeli katakana')
    page.evaluate("void Story.drill('rawan')"); page.wait_for_selector('.quiz .opt'); page.screenshot(path=f'{OUT}/b12_02_mata_jeli.png'); ev(page, "UI.closePanel()")
    # 5) Video: contoh kata katakana dengan bantuan hiragana (Hari 12, ア)
    page = boot(early(12, 'wake', HIRA))
    page.evaluate("void Video.play({ kana: ['ア'], title: 'Video: ア', day: 12 })"); page.wait_for_selector('.video')
    cap = ''
    for _ in range(12):
        cap = ev(page, "document.querySelector('.v-cap').textContent")
        if cap.startswith('Contoh kata'): break
        page.locator('[data-a=next]').click(); page.wait_for_timeout(150)
    page.wait_for_timeout(500); page.screenshot(path=f'{OUT}/b12_03_video_bantuan.png')
    print('video ア:', cap)
    page.locator('[data-a=skip]').click()
    # 6) Video を: contoh ほん を よむ
    ev(page, "Save.d.kana = " + repr(HIRA))
    page.evaluate("void Video.play({ kana: ['を'], title: 'Video: を', day: 10 })"); page.wait_for_selector('.video')
    for _ in range(12):
        cap = ev(page, "document.querySelector('.v-cap').textContent")
        if cap.startswith('Contoh kata'): break
        page.locator('[data-a=next]').click(); page.wait_for_timeout(150)
    print('video を:', cap); page.locator('[data-a=skip]').click()
    # 7) Hari 10 lengkap dari kelas → Mata Jeli dipakai di pelajaran kedua
    page = boot(early(10, 'class1', HIRA[:43]))
    mj = [False]
    def d10():
        if not mj[0] and page.locator('.q-title').count() and 'Mata Jeli' in page.locator('.q-title').inner_text(): mj[0] = True
        if ev(page, "Save.d.step === 'class2' && !Game.busy && !document.querySelector('.dialog:not(.hide)')"): page.evaluate("void Game.interact({ type: 'npc', npc: { id: 'sensei' } })")
        return ev(page, "Save.d.days[10] !== undefined")
    page.evaluate("void Game.interact({ type: 'npc', npc: { id: 'sensei' } })")
    drive(page, d10, 500, 'hari10'); print('Mata Jeli muncul di kelas:', mj[0])
    print('hari 10:', ev(page, "[Save.d.days[10], Save.d.kana.includes('ん')]"))
    CTX['br'].close()
print('ERRORS:', len(errors)); [print(' ', e) for e in errors[:20]]
