import type { ReactNode } from 'react';
import { IMD_THRESHOLD, LEVEL_HEX, LEVEL_SHORT_KEY, imdLevel, type SpotW } from '../api';
import { HOTSPOTS } from '../data/geo';
import { useUi, type Key } from '../i18n';

const RED = IMD_THRESHOLD.red;

export function RingGauge({
  pct, level, size = 122, stroke = 11, children,
}: {
  pct: number;
  level: 'green' | 'yellow' | 'orange' | 'red';
  size?: number;
  stroke?: number;
  children?: ReactNode;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(1, pct));
  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke="#d5dce8" strokeWidth={stroke}
        />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke={LEVEL_HEX[level]}
          strokeWidth={stroke}
          strokeLinecap="butt"
          strokeDasharray={`${c * clamped} ${c}`}
          strokeDashoffset={0}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dasharray .6s ease, stroke .3s ease' }}
        />
      </svg>
      <div className="ring__in">{children}</div>
    </div>
  );
}

interface Props {
  spots: SpotW[] | null;
  onFocus: (id: string) => void;
}

export function RiskCircles({ spots, onFocus }: Props) {
  const { t, lang } = useUi();

  return (
    <div className="circgrid">
      {HOTSPOTS.map((h) => {
        const w = spots?.find((s) => s.id === h.id) ?? null;
        const level = w ? imdLevel(w.mm24) : 'green';
        const pct = w ? w.mm24 / RED : 0;
        const name = lang === 'hi' ? h.nameHi : h.name;
        return (
          <button
            type="button"
            className="circ"
            key={h.id}
            onClick={() => onFocus(h.id)}
            aria-label={`${name} — ${w ? `${w.mm24.toFixed(1)} ${t('unitMm')}` : t('popAwait')}`}
          >
            <RingGauge pct={pct} level={level}>
              <b>{w ? w.mm24.toFixed(1) : '—'}</b>
              <span>{t('unitMm')} · {t('p24')}</span>
            </RingGauge>
            <span className="circ__name">{name}</span>
            <span className={`pill pill--${w ? level : 'green'}`}>
              <span className="dot" aria-hidden="true" />
              {w ? t(LEVEL_SHORT_KEY[level] as Key) : t('awaitShort')}
            </span>
            <span className="circ__sub">
              {t('p6')}: {w ? w.mm6.toFixed(1) : '—'} {t('unitMm')}
            </span>
          </button>
        );
      })}
    </div>
  );
}
