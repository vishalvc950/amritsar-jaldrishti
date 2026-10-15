import type { SVGProps, ReactNode } from 'react';
import { wx } from '../api';

type P = SVGProps<SVGSVGElement>;

const base = (p: P) => ({
  width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none',
  stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const, 'aria-hidden': true, ...p,
});

export const IconRain = (p: P) => (
  <svg {...base(p)}>
    <path d="M17.5 15a4.5 4.5 0 0 0 0-9 6 6 0 0 0-11.6 1.6A4 4 0 0 0 7 15" />
    <path d="M8 18l-1 3M12 18l-1 3M16 18l-1 3" />
  </svg>
);

export const IconAlert = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3l9.5 17h-19z" /><path d="M12 10v4" /><circle cx="12" cy="17.4" r=".6" fill="currentColor" />
  </svg>
);

export const IconGauge = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 18a8 8 0 1 1 16 0" /><path d="M12 18l4-6" /><circle cx="12" cy="18" r="1.6" />
  </svg>
);

export const IconClock = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
  </svg>
);

export const IconRefresh = (p: P) => (
  <svg {...base(p)}>
    <path d="M20 11a8 8 0 1 0-2.3 6.3" /><path d="M20 4v7h-7" />
  </svg>
);

export const IconSearch = (p: P) => (
  <svg {...base(p)}>
    <circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" />
  </svg>
);

export const IconMap = (p: P) => (
  <svg {...base(p)}>
    <path d="M9 4l6 2 5-2v14l-5 2-6-2-5 2V6z" /><path d="M9 4v14M15 6v14" />
  </svg>
);

export const IconPhone = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 3h4l2 5-3 2a13 13 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2z" />
  </svg>
);

export const IconChip = (p: P) => (
  <svg {...base(p)}>
    <rect x="7" y="7" width="10" height="10" rx="1.5" />
    <path d="M10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4" />
  </svg>
);

/* ---------- weather glyphs (WMO code → icon) ---------- */

const Glyph = ({ size, children, label = '' }: { size: number; children: ReactNode; label?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.7}
    strokeLinecap="round"
    strokeLinejoin="round"
    role="img"
    aria-label={label}
  >
    {children}
  </svg>
);

const cloudPath = 'M7 18a4.2 4.2 0 0 1 .4-8.4 5.6 5.6 0 0 1 10.7 1.3A3.7 3.7 0 0 1 17.6 18z';

export function WeatherIcon({ code, size = 30 }: { code: number; size?: number }) {
  const kind = wx(code).kind;
  switch (kind) {
    case 'sun':
      return (
        <Glyph size={size} label="">
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.4 5.4l1.5 1.5M17.1 17.1l1.5 1.5M18.6 5.4l-1.5 1.5M6.9 17.1l-1.5 1.5" />
        </Glyph>
      );
    case 'partly':
      return (
        <Glyph size={size} label="">
          <circle cx="8.6" cy="8.4" r="3" />
          <path d="M8.6 2.8v1.6M3 8.4h1.6M4.6 4.4l1.1 1.1M12.6 4.4l-1.1 1.1" />
          <path d={cloudPath} />
        </Glyph>
      );
    case 'cloud':
      return (
        <Glyph size={size} label="">
          <path d={cloudPath} />
        </Glyph>
      );
    case 'fog':
      return (
        <Glyph size={size} label="">
          <path d="M7 15a4.2 4.2 0 0 1 .4-8.4 5.6 5.6 0 0 1 10.7 1.3A3.7 3.7 0 0 1 17.6 15z" />
          <path d="M5 18.4h14M7 21h10" />
        </Glyph>
      );
    case 'drizzle':
      return (
        <Glyph size={size} label="">
          <path d={cloudPath} />
          <path d="M9 20.2v1.4M12.5 20.2v1.4M16 20.2v1.4" />
        </Glyph>
      );
    case 'rain':
      return (
        <Glyph size={size} label="">
          <path d={cloudPath} />
          <path d="M8.6 19.6l-.9 2.2M12.4 19.6l-.9 2.2M16.2 19.6l-.9 2.2" />
        </Glyph>
      );
    case 'heavy':
      return (
        <Glyph size={size} label="">
          <path d={cloudPath} />
          <path d="M8 19.2l-1.1 2.6M11.4 19.2l-1.1 2.6M14.8 19.2l-1.1 2.6M18.2 19.2l-1.1 2.6" />
        </Glyph>
      );
    case 'thunder':
      return (
        <Glyph size={size} label="">
          <path d={cloudPath} />
          <path d="M13 18.6l-3 3.4h3l-1.2 2.4" />
          <path d="M8.4 19.8l-.8 1.8" />
        </Glyph>
      );
    case 'snow':
      return (
        <Glyph size={size} label="">
          <path d={cloudPath} />
          <path d="M9 20.4v1.6M8.2 21.2h1.6M15 20.4v1.6M14.2 21.2h1.6" />
        </Glyph>
      );
  }
}

/** JalDrishti crest — droplet + wave inside an official-looking roundel. */
export const Crest = ({ size = 58 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label="JalDrishti crest">
    <circle cx="32" cy="32" r="30" fill="#0B2E5B" />
    <circle cx="32" cy="32" r="30" fill="none" stroke="#FF9933" strokeWidth="2.5" />
    <circle cx="32" cy="32" r="25" fill="none" stroke="rgba(255,255,255,.35)" strokeWidth="1" strokeDasharray="2 3" />
    <path d="M32 14c7 10.5 12 16 12 21.5a12 12 0 0 1-24 0C20 30 25 24.5 32 14z" fill="#FF9933" />
    <path d="M22 38c4.5-3 15.5-3 20 0" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round" />
    <path d="M24 43c3.5-2.2 12.5-2.2 16 0" stroke="rgba(255,255,255,.75)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    <circle cx="32" cy="7.5" r="1.6" fill="#138808" />
  </svg>
);
