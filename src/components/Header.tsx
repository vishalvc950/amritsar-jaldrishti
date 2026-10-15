import { useState, type FormEvent } from 'react';
import { useUi, type Key } from '../i18n';
import { IconAlert } from './icons';

const NAV: { key: Key; href: string }[] = [
  { key: 'navHome', href: '#top' },
  { key: 'navMap', href: '#map' },
  { key: 'navCircles', href: '#circles' },
  { key: 'navAlerts', href: '#alerts' },
  { key: 'navData', href: '#data' },
  { key: 'navAbout', href: '#about' },
];

const SEARCH_INDEX: [string[], string][] = [
  [['map', 'ward', 'risk', 'मानचित्र', 'वार्ड', 'जोखिम'], '#map'],
  [['circle', 'circles', 'gauge', 'ring', 'वृत्त', 'गेज'], '#circles'],
  [['alert', 'warning', 'sms', 'चेतावनी', 'अलर्ट'], '#alerts'],
  [['forecast', 'rain', 'weather', 'predict', 'पूर्वानुमान', 'वर्षा', 'मौसम'], '#forecast'],
  [['data', 'source', 'api', 'radar', 'डेटा', 'स्रोत', 'रडार'], '#data'],
  [['help', 'contact', 'about', 'helpline', 'हेल्पलाइन', 'परिचय', 'संपर्क'], '#about'],
];

export function UtilityBar() {
  const { t, lang, setLang, scaleIdx, setScaleIdx, hc, setHc } = useUi();
  return (
    <div className="utility">
      <div className="container utility__in">
        <div className="utility__left">
          <a className="skip" href="#main">{t('skip')}</a>
          <span className="open-chip">{t('openChip')}</span>
          <span style={{ fontSize: '0.72rem', color: '#8fa2bd' }}>{t('dept')}</span>
        </div>
        <div className="utility__right">
          <span className="sizes">
            <span className="lbl">{t('textSize')}</span>
            <button className="ubtn" aria-label={t('textSize') + ' −'}
              onClick={() => setScaleIdx(Math.max(0, scaleIdx - 1))}>A−</button>
            <button className="ubtn" aria-label={t('textSize') + ' reset'}
              onClick={() => setScaleIdx(1)}>A</button>
            <button className="ubtn" aria-label={t('textSize') + ' +'}
              onClick={() => setScaleIdx(Math.min(3, scaleIdx + 1))}>A+</button>
          </span>
          <button className={'ubtn' + (hc ? ' is-on' : '')} aria-pressed={hc}
            onClick={() => setHc(!hc)}>{t('contrast')}</button>
          <button className="ubtn" onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
            lang={lang === 'en' ? 'hi' : 'en'}>
            {lang === 'en' ? 'हिंदी' : 'English'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function Masthead() {
  const { t, lang } = useUi();
  const [q, setQ] = useState('');
  const [note, setNote] = useState('');

  const dateline = new Date().toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  function onSearch(e: FormEvent) {
    e.preventDefault();
    const s = q.trim().toLowerCase();
    if (!s) return;
    const hit = SEARCH_INDEX.find(([words]) => words.some((w) => s.includes(w) || w.includes(s)));
    if (hit) {
      setNote('');
      document.querySelector(hit[1])?.scrollIntoView({ behavior: 'smooth' });
    } else {
      setNote(t('noResults'));
      setTimeout(() => setNote(''), 3000);
    }
  }

  return (
    <header className="masthead">
      <div className="container masthead__in">
        <span className="crest" aria-hidden="true">
          <CrestInline />
        </span>
        <div className="masthead__titles">
          <div className="masthead__brandline">
            <span className="masthead__brand">{t('brand')}</span>
          </div>
          <div className="masthead__name">{t('title')}</div>
          <div className="masthead__dateline">
            <span>{dateline}</span>
            <i>▪</i>
            <span>{t('dept')}</span>
          </div>
        </div>
        <form className="search" role="search" onSubmit={onSearch}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t('searchPh')}
            aria-label={t('searchPh')}
          />
          <button type="submit">{t('searchBtn')}</button>
          {note && <span className="search-note" role="status">{note}</span>}
        </form>
      </div>
    </header>
  );
}

function CrestInline() {
  return (
    <svg width="58" height="58" viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="32" r="30" fill="#0B2E5B" />
      <circle cx="32" cy="32" r="30" fill="none" stroke="#FF9933" strokeWidth="2.5" />
      <circle cx="32" cy="32" r="25" fill="none" stroke="rgba(255,255,255,.35)" strokeWidth="1" strokeDasharray="2 3" />
      <path d="M32 14c7 10.5 12 16 12 21.5a12 12 0 0 1-24 0C20 30 25 24.5 32 14z" fill="#FF9933" />
      <path d="M22 38c4.5-3 15.5-3 20 0" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M24 43c3.5-2.2 12.5-2.2 16 0" stroke="rgba(255,255,255,.75)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <circle cx="32" cy="7.5" r="1.6" fill="#138808" />
    </svg>
  );
}

export function Nav() {
  const { t } = useUi();
  return (
    <nav className="nav" aria-label="Primary">
      <div className="container nav__in">
        {NAV.map((n) => (
          <a key={n.href} href={n.href}>{t(n.key)}</a>
        ))}
      </div>
    </nav>
  );
}

export function Ticker({ items }: { items: string[] }) {
  const { t } = useUi();
  const doubled = [...items, ...items];
  return (
    <div className="ticker" role="region" aria-label={t('tickerLabel')}>
      <div className="ticker__label">
        <IconAlert width={13} height={13} />
        {t('tickerLabel')}
      </div>
      <div className="ticker__win">
        <div className="ticker__track">
          {doubled.map((s, i) => (
            <span key={i}>{s}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
