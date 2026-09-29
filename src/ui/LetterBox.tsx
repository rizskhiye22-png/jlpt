/* =========================================================
   📮 KOTAK SURAT (React) — surat, buku bergambar, Peta Harta 1976, benda kenangan
   Kata yang hurufnya belum dipelajari tampil kabur; ketuk untuk tahu kapan dipelajari.
   ========================================================= */
import { useMemo, useState } from 'react';
import { LETTERS, LETTER_BY } from '../story/letters';
import { PAGES, MAP_SPOTS, ITEMS } from '../story/book';
import { knowledge, tokenize, clarity, whenLearned, type Tok } from '../story/readable';
import type { Letter } from '../story/types';
import { CLUES, QUESTIONS } from '../story/scenes3';

type Tab = 'letters' | 'book' | 'map' | 'items' | 'journal';

const fmtName = (s: string) => s.replace(/\{name\}/g, Save.d.name || 'Kamu');
const speakable = (line: string) => line.replace(/\[([^|\]]+)\|([^\]]+)\]/g, '$2').replace(/~/g, '').replace(/[A-Za-z.]+/g, '').trim();

function Tokens({ line, know, onHint }: { line: string; know: ReturnType<typeof knowledge>; onHint: (t: Tok) => void }) {
  const toks = tokenize(fmtName(line), know);
  return (
    <>
      {toks.map((t, i) => t.show === ' ' ? <span key={i}> </span>
        : t.clear
          ? (t.ruby ? <ruby key={i} className="tk">{t.show}<rt>{t.ruby}</rt></ruby> : <span key={i} className="tk">{t.show}</span>)
          : <button key={i} type="button" className="tk blur" onClick={() => onHint(t)} aria-label="Kata yang belum bisa dibaca">{t.show}</button>)}
    </>
  );
}

function Reader({ lines, tr, title, sub, note, onBack }: { lines: string[]; tr: string[]; title: string; sub: string; note?: string; onBack: () => void }) {
  const know = useMemo(() => knowledge(), []);
  const [showTr, setShowTr] = useState(false);
  const [hint, setHint] = useState<string>('');
  const pct = Math.round(clarity(lines, know) * 100);
  const onHint = (t: Tok) => { Sound.bad(); setHint(t.missing.map(whenLearned).filter(Boolean).join(' ')); };
  const speakAll = async () => { Sound.stop(); for (const l of lines) { const s = speakable(fmtName(l)); if (s) await Sound.speak(s); } };
  return (
    <div className="lt-read">
      <div className="lt-head">
        <button type="button" className="btn ghost small" onClick={onBack}>◀ Kembali</button>
        <div><b>{title}</b><small>{sub}</small></div>
      </div>
      <div className="lt-paper">
        {lines.map((l, i) => l === '' ? <div key={i} className="lt-gap" /> : (
          <div key={i} className="lt-line">
            <div className="lt-jp">
              <Tokens line={l} know={know} onHint={onHint} />
              {speakable(l) && <button type="button" className="say" aria-label="Dengarkan" onClick={() => Sound.speak(speakable(fmtName(l)))}>♪</button>}
            </div>
            {showTr && tr[i] && <div className="lt-tr">{fmtName(tr[i])}</div>}
          </div>
        ))}
        {note && <p className="lt-note">{note}</p>}
      </div>
      {hint && <p className="lt-hint">🔒 {hint}</p>}
      <div className="lt-bar"><i style={{ width: pct + '%' }} /></div>
      <p className="muted small center">{pct === 100 ? 'Kamu bisa membaca semuanya! 🎉' : `${pct}% kata bisa dibaca. Kata kabur akan jelas setelah hurufnya dipelajari.`}</p>
      <div className="row">
        <button type="button" className="btn ghost" onClick={speakAll}>♪ Dengar semua</button>
        <button type="button" className="btn ghost" onClick={() => { Sound.blip(); setShowTr(v => !v); }}>{showTr ? 'Sembunyikan arti' : '🇮🇩 Arti'}</button>
      </div>
    </div>
  );
}

function LetterList({ onOpen }: { onOpen: (l: Letter) => void }) {
  const know = useMemo(() => knowledge(), []);
  const st = Save.d.story;
  const avail = new Set(Story.lettersAvailable().map(l => l.id));
  return (
    <ul className="lt-list">
      {LETTERS.filter(l => l.n <= 12 || avail.has(l.id)).map(l => {
        const on = avail.has(l.id);
        const pct = on ? Math.round(clarity(l.lines, know) * 100) : 0;
        const fresh = on && !st.opened.includes(l.id);
        return (
          <li key={l.id}>
            <button type="button" className={`lt-env ${on ? '' : 'lock'}`} disabled={!on} onClick={() => onOpen(l)}>
              <span className="lt-no">#{l.n}</span>
              <span className="lt-t">{on ? <><b className="jp">{l.title}</b><small>{l.date} · {pct}% terbaca</small></> : <><b>？？？</b><small>{l.hint}</small></>}</span>
              {fresh && <span className="badge">baru</span>}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function BookTab() {
  const [sel, setSel] = useState<number | null>(null);
  const have: number[] = Save.d.story.pages || [];
  if (sel != null) {
    const p = PAGES.find(x => x.n === sel)!;
    return <Reader lines={p.lines} tr={p.tr} title={`Halaman ${p.n} — ${p.title}`} sub={p.where} onBack={() => setSel(null)} />;
  }
  return (
    <>
      <p className="muted small">『さくら と ともだち』 — buku bergambar buatan tangan tahun 1976. Terkumpul {have.filter(n => n <= 10).length}/10 halaman.</p>
      <div className="bk-grid">
        {PAGES.filter(p => p.n <= 10).map(p => {
          const on = have.includes(p.n);
          return (
            <button key={p.n} type="button" className={`bk-page art-${p.art} ${on ? '' : 'lock'}`} disabled={!on} onClick={() => { Sound.blip(); setSel(p.n); }}>
              <span className="bk-n">{p.n}</span>
              <span className="bk-t">{on ? p.title : '？'}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}

function MapTab() {
  const know = useMemo(() => knowledge(), []);
  const have: number[] = Save.d.story.pages || [];
  if (!Story.has('treasure_map')) return <p className="muted">Belum punya peta. Mungkin seseorang di kota menemukannya…</p>;
  return (
    <>
      <p className="muted small">Digambar tangan. Di pojok: tiga kelopak sakura dan inisial S・D・M. Tulisan yang belum bisa kamu baca tampil kabur.</p>
      <div className="tm-paper">
        {MAP_SPOTS.map(s => {
          const toks = tokenize(s.text, know);
          const readable = toks.every(t => t.clear && !t.fb);
          const found = have.includes(s.n);
          return <span key={s.n} className={`tm-x ${found ? 'found' : readable ? 'read' : ''}`} style={{ left: s.x + '%', top: s.y + '%' }}>×</span>;
        })}
      </div>
      <ul className="tm-list">
        {MAP_SPOTS.map(s => {
          const toks = tokenize(s.text, know);
          const readable = toks.every(t => t.clear && !t.fb);
          const found = have.includes(s.n);
          return (
            <li key={s.n} className={found ? 'found' : ''}>
              <span className="tm-mark">{found ? '✔' : '×'}</span>
              <div>
                <div className="jp">{toks.map((t, i) => t.show === ' ' ? ' ' : <span key={i} className={t.clear && !t.fb ? '' : 'tk blur'}>{t.ruby ? <ruby>{t.show}<rt>{t.ruby}</rt></ruby> : t.show}</span>)}</div>
                <small>{found ? `Halaman #${s.n} ditemukan · ${s.place}` : readable ? `${s.place} · dikunjungi di Bab ${s.chapter}` : 'Belum bisa dibaca'}</small>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}

function JournalTab() {
  const flags: Record<string, number> = Save.d.story.flags || {};
  const got = CLUES.filter(c => flags[c.flag]);
  return (
    <>
      <p className="muted small">Petunjuk yang kamu kumpulkan. Pertanyaan besar akan terjawab satu per satu.</p>
      <div className="jr-board">
        {got.map(c => <div key={c.id} className="jr-card"><span className="jr-pin" /><b>{c.icon} {c.title}</b><small>{c.text}</small></div>)}
        {!got.length && <p className="muted">Belum ada petunjuk.</p>}
      </div>
      <ul className="jr-q">
        {QUESTIONS.map((q, i) => { const on = !!flags[q.answered]; return <li key={i} className={on ? 'on' : ''}><span>{on ? '！' : '？'}</span><div><b>{q.q}</b>{on && <small>{q.a}</small>}</div></li>; })}
      </ul>
    </>
  );
}

function ItemsTab() {
  const own: string[] = Save.d.story.items || [];
  const list = ITEMS.filter(i => own.includes(i.id));
  if (!list.length) return <p className="muted">Belum ada benda kenangan.</p>;
  return <ul className="it-list">{list.map(i => <li key={i.id}><span className="it-ic">{i.icon}</span><div><b>{i.name}</b><small>{i.desc}</small></div></li>)}</ul>;
}

export function LetterBox({ onClose, letter, tab: tab0 }: { onClose: () => void; letter?: string; reading?: boolean; tab?: Tab }) {
  const [tab, setTab] = useState<Tab>(tab0 || 'letters');
  const [open, setOpen] = useState<Letter | null>(letter ? LETTER_BY[letter] || null : null);
  const openLetter = (l: Letter) => {
    Sound.blip();
    const st = Save.d.story;
    if (!st.opened.includes(l.id)) { st.opened.push(l.id); Save.write(); }
    setOpen(l);
  };
  if (open && !Save.d.story.opened.includes(open.id)) { Save.d.story.opened.push(open.id); Save.write(); }
  const from = open ? ({ dewi: 'Dari Dewi', sato: 'Dari Haru Sato', emma: 'Dari Emma', player: 'Darimu' } as const)[open.from] : '';
  const TABS: Array<[Tab, string]> = [['letters', '📮 Surat'], ['book', '📖 Buku'], ['map', '🗺️ Peta'], ...(Story.has('journal_unlocked') ? [['journal', '🔎 Jurnal'] as [Tab, string]] : []), ['items', '🎁 Benda']];
  const town = Story.town;
  return (
    <div className="win letterbox">
      <div className="w-title">Kotak Surat <span className="jp">てがみ</span>{town > 0 && <span className="pts-badge" title="Meter Kota">🏮 {town}</span>}</div>
      {open ? (
        <Reader lines={open.lines} tr={open.tr} title={`#${open.n} ${open.title}`} sub={`${from} · ${open.date}`} note={open.note} onBack={() => (letter ? onClose() : setOpen(null))} />
      ) : (
        <>
          <div className="tabs">{TABS.map(([k, l]) => <button key={k} type="button" className={`tab ${tab === k ? 'on' : ''}`} onClick={() => { Sound.blip(); setTab(k); }}>{l}</button>)}</div>
          <div className="book-body">
            {tab === 'letters' && <LetterList onOpen={openLetter} />}
            {tab === 'book' && <BookTab />}
            {tab === 'map' && <MapTab />}
            {tab === 'journal' && <JournalTab />}
            {tab === 'items' && <ItemsTab />}
          </div>
        </>
      )}
      <button type="button" className="btn block" data-a="close" onClick={onClose}>Tutup</button>
    </div>
  );
}
