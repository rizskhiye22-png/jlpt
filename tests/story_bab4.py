"""Uji Bab 4: yōon (goresan gabungan), latihan telinga, onsen 3 hari + kilas balik, Tanabata, Natsu Matsuri, Surat #7–#8.
Jalankan: npm run build && npx vite preview --port 4173 &  lalu  python3 tests/story_bab4.py [folder_screenshot]"""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
exec(open(os.path.join(os.path.dirname(__file__), 'helpers.py')).read())
Y = list('ゃゅょャュョ') + ['きゃ','きゅ','きょ','しゃ','しゅ','しょ','ちゃ','ちゅ','ちょ','にゃ','にゅ','にょ','キャ','キュ','キョ','シャ','シュ','ショ']
ALL = HIRA + KATA + DAKU + KANJI + Y
def b4(day, step, flags=None, kana=None):
    f = {'baito_cafe': 24, 'page4': 26, 'page3': 29, 'market_done': 34, 'letter5_open': 28, 'letter6_open': 34, 'ch3_done': 34, 'journal_unlocked': 23}
    f.update(flags or {})
    s = base(day, step, f, kana or ALL); s['story']['pages'] = [1, 2, 3, 4]; return s
with sync_playwright() as p:
    CTX['br'] = p.chromium.launch()
    page = boot(b4(36, 'wake'))
    print('data:', ev(page, "[DAYS.length, CHAPTERS.length, STROKES['きゃ'].length, STROKES['キョ'].length, KANA['きゃ'].ro, POOL_FILTER.youon('シュ'), NO_QUIZ('っ'), weatherFor(39)]"))
    page.evaluate("void Video.play({ kana: ['きゃ'], title: 'Video: きゃ', day: 35 })"); page.wait_for_selector('.video')
    page.locator('[data-a=next]').click(); page.locator('[data-a=next]').click(); page.locator('[data-a=next]').click(); page.wait_for_timeout(1800)
    page.screenshot(path=f'{OUT}/b4_01_video_kya.png'); page.locator('[data-a=skip]').click(); ev(page, "UI.closePanel()")
    page.evaluate("void Story.drill('sokuon').then(r => { window.__dr = r; })")
    drive(page, lambda: ev(page, "!!window.__dr"), 80, 'drill'); print('latihan telinga っ:', ev(page, "window.__dr"))
    # Hari 36 malam: さとちゃん
    ev(page, "Save.d.step = 'night'"); page.evaluate("void Game.interact({ type: 'bed' })")
    drive(page, lambda: ev(page, "Save.d.day === 37"), 200, 'chan')
    print('さとちゃん:', ev(page, "!!Save.d.story.flags.chan_revealed"))
    # Hari 40–42: onsen
    for d, flag in [(40, 'stay_yama_1'), (41, 'flashback1'), (42, 'sato_mori_argue')]:
        page = boot(b4(d, 'after', {'stay_yama_1': 40, 'flashback1': 41} if d > 40 else None))
        ev(page, "Save.d.story.flags = Object.assign(Save.d.story.flags, {}); 0")
        if d == 41: ev(page, "delete Save.d.story.flags.flashback1")
        if d == 42: ev(page, "delete Save.d.story.flags.sato_mori_argue")
        shot = [False]
        def watch():
            if d == 41 and not shot[0] and ev(page, "document.querySelector('.screen').classList.contains('flashback')") and page.locator('.dialog:not(.hide)').count():
                shot[0] = True; page.screenshot(path=f'{OUT}/b4_02_kilasbalik.png')
            return ev(page, f"!!Save.d.story.flags.{flag} && !Game.busy")
        page.evaluate(f"void Game.interact({{ type: 'npc', npc: {{ id: DAYS[{d-1}].brk.npc, script: DAYS[{d-1}].brk }} }})")
        drive(page, watch, 400, f'hari{d}')
        print(f'hari {d}:', ev(page, "[Save.d.story.pages, World.map, document.querySelector('.screen').classList.contains('flashback')]"), 'sepia terlihat:' if d == 41 else '', shot[0] if d == 41 else '')
    # Hari 44: Tanabata
    page = boot(b4(44, 'after'))
    page.evaluate("void Game.interact({ type: 'npc', npc: { id: DAYS[43].brk.npc, script: DAYS[43].brk } })")
    drive(page, lambda: ev(page, "!!Save.d.story.flags.mori_tanzaku && !Game.busy"), 200, 'tanabata')
    print('tanzaku:', ev(page, "Save.d.story.tanzaku"))
    # Hari 46: matsuri + surat #8
    page = boot(b4(46, 'after', {'tree_care_1': 43, 'mori_tanzaku': 44, 'festival_photo': 45}))
    page.evaluate("void Game.interact({ type: 'npc', npc: { id: DAYS[45].brk.npc, script: DAYS[45].brk } })")
    t = [False]
    def mat():
        if not t[0] and page.locator('.taiko').count(): t[0] = True; page.wait_for_timeout(700); page.screenshot(path=f'{OUT}/b4_03_taiko.png')
        return ev(page, "!!Save.d.story.flags.matsuri_done && !Game.busy")
    drive(page, mat, 300, 'matsuri')
    print('matsuri:', ev(page, "[Save.d.story.town, Save.d.friends.yuki]"))
    ev(page, "Save.d.step = 'night'"); page.evaluate("void Game.interact({ type: 'bed' })")
    drive(page, lambda: ev(page, "Save.d.day === 47"), 300, 'malam46'); page.wait_for_timeout(600)
    print('akhir bab 4:', ev(page, "[!!Save.d.story.flags.ch4_done, !!Save.d.story.flags.third_is_mori]"))
    page.screenshot(path=f'{OUT}/b4_04_tamat.png')
    CTX['br'].close()
print('ERRORS:', len(errors)); [print(' ', e) for e in errors[:20]]
