import { useEffect, useState } from 'react';
import type { Key } from './i18n';
import { HOTSPOTS } from './data/geo';

/* Live data layer — every number on the site comes from one of these open APIs:
   - Open-Meteo forecast : current conditions, hourly and 7-day rainfall (keyless, CORS-open)
   - Open-Meteo archive  : observed daily rainfall history for monsoon totals
   - RainViewer          : composite weather-radar frames
   Nothing is fabricated: if a request fails the UI shows "—" instead of sample numbers. */

export const AMRITSAR = { lat: 31.634, lon: 74.872 };
export const REFRESH_MS = 10 * 60_000;

export interface HourSlice {
  time: string; // "2026-10-15T14:00"
  mm: number;
  tempC: number;
  pop: number; // precipitation probability %
}

export interface Day {
  date: string; // "2026-10-15"
  mm: number;
  maxC: number;
  minC: number;
  code: number;
  pop: number;
}

export interface City {
  tempC: number;
  feelsC: number;
  humidityPct: number;
  windKmh: number;
  windDirDeg: number;
  pressureHpa: number;
  precipMm: number;
  code: number;
  isDay: boolean;
  todayMm: number;
  next6hMm: number;
  next24hMm: number;
  hours: HourSlice[];
  daily7: Day[];
  fetchedAt: number;
}

export interface SpotW {
  id: string;
  mm6: number;
  mm24: number;
  nowMm: number;
  tempC: number;
}

export interface Monsoon {
  y2026: number | null;
  y2025: number | null;
  avg10y: number | null;
}

export interface RadarMeta {
  host: string;
  path: string;
  time: number; // unix seconds
}

export type Level = 'green' | 'yellow' | 'orange' | 'red';

/** IMD 24-hour rainfall warning thresholds (mm/24h). */
export function imdLevel(mm24: number): Level {
  if (mm24 > 204.4) return 'red';
  if (mm24 > 115.5) return 'orange';
  if (mm24 > 64.4) return 'yellow';
  return 'green';
}

export const IMD_THRESHOLD = { yellow: 64.4, orange: 115.5, red: 204.4 } as const;

export const LEVEL_KEY = {
  green: 'lvlGreen',
  yellow: 'lvlYellow',
  orange: 'lvlOrange',
  red: 'lvlRed',
} as const;

export const LEVEL_SHORT_KEY = {
  green: 'lvlShortGreen',
  yellow: 'lvlShortYellow',
  orange: 'lvlShortOrange',
  red: 'lvlShortRed',
} as const;

export const LEVEL_HEX: Record<Level, string> = {
  green: '#2e9e5b',
  yellow: '#eab308',
  orange: '#f97316',
  red: '#dc2626',
};

export type WxKind = 'sun' | 'partly' | 'cloud' | 'fog' | 'drizzle' | 'rain' | 'heavy' | 'thunder' | 'snow';

/** WMO weather interpretation code → label key + icon kind. */
export function wx(code: number): { key: Key; kind: WxKind } {
  if (code === 0) return { key: 'wxClear', kind: 'sun' };
  if (code === 1) return { key: 'wxMostlyClear', kind: 'sun' };
  if (code === 2) return { key: 'wxPartly', kind: 'partly' };
  if (code === 3) return { key: 'wxOvercast', kind: 'cloud' };
  if (code === 45 || code === 48) return { key: 'wxFog', kind: 'fog' };
  if (code >= 51 && code <= 57) return { key: 'wxDrizzle', kind: 'drizzle' };
  if (code === 66 || code === 67) return { key: 'wxFreezing', kind: 'rain' };
  if (code >= 71 && code <= 77) return { key: 'wxSnow', kind: 'snow' };
  if (code >= 85 && code <= 86) return { key: 'wxSnow', kind: 'snow' };
  if (code >= 95) return { key: 'wxThunder', kind: 'thunder' };
  if (code === 61 || code === 80) return { key: 'wxRainLight', kind: 'rain' };
  if (code === 63 || code === 81) return { key: 'wxRainModerate', kind: 'heavy' };
  if (code === 65 || code === 82) return { key: 'wxRainHeavy', kind: 'heavy' };
  return { key: 'wxOvercast', kind: 'cloud' };
}

export function windDirKey(deg: number): Key {
  const dirs: Key[] = ['windN', 'windNE', 'windE', 'windSE', 'windS', 'windSW', 'windW', 'windNW'];
  return dirs[Math.round(((deg % 360) + 360) % 360 / 45) % 8];
}

async function json(url: string): Promise<any | null> {
  try {
    const r = await fetch(url);
    return r.ok ? await r.json() : null;
  } catch {
    return null;
  }
}

const n = (v: unknown, fallback = 0) => (typeof v === 'number' && Number.isFinite(v) ? v : fallback);

export async function fetchCity(): Promise<City | null> {
  const q = `latitude=${AMRITSAR.lat}&longitude=${AMRITSAR.lon}&timezone=Asia%2FKolkata`;
  const url =
    `https://api.open-meteo.com/v1/forecast?${q}` +
    '&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,' +
    'wind_speed_10m,wind_direction_10m,surface_pressure,is_day' +
    '&hourly=precipitation,temperature_2m,precipitation_probability,weather_code' +
    '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max' +
    '&forecast_days=7';

  const d = await json(url);
  if (!d || !d.current || !d.hourly) return null;

  try {
    const curKey = String(d.current.time).slice(0, 13);
    const times: string[] = d.hourly.time;
    let i = times.findIndex((t) => t.slice(0, 13) >= curKey);
    if (i < 0) i = 0;

    const sum = (from: number, to: number) => {
      let s = 0;
      for (let k = from; k < Math.min(to, times.length); k++) s += n(d.hourly.precipitation[k]);
      return Math.round(s * 10) / 10;
    };

    const hours: HourSlice[] = [];
    for (let k = i; k < Math.min(i + 18, times.length); k++) {
      hours.push({
        time: times[k],
        mm: n(d.hourly.precipitation[k]),
        tempC: n(d.hourly.temperature_2m[k]),
        pop: n(d.hourly.precipitation_probability[k]),
      });
    }

    const daily7: Day[] = (d.daily?.time ?? []).slice(0, 7).map((date: string, k: number) => ({
      date,
      mm: n(d.daily.precipitation_sum[k]),
      maxC: n(d.daily.temperature_2m_max[k]),
      minC: n(d.daily.temperature_2m_min[k]),
      code: n(d.daily.weather_code[k]),
      pop: n(d.daily.precipitation_probability_max[k]),
    }));

    return {
      tempC: n(d.current.temperature_2m),
      feelsC: n(d.current.apparent_temperature),
      humidityPct: n(d.current.relative_humidity_2m),
      windKmh: n(d.current.wind_speed_10m),
      windDirDeg: n(d.current.wind_direction_10m),
      pressureHpa: n(d.current.surface_pressure),
      precipMm: n(d.current.precipitation),
      code: n(d.current.weather_code),
      isDay: Boolean(d.current.is_day),
      todayMm: n(d.daily?.precipitation_sum?.[0]),
      next6hMm: sum(i, i + 6),
      next24hMm: sum(i, i + 24),
      hours,
      daily7,
      fetchedAt: Date.now(),
    };
  } catch {
    return null;
  }
}

/** Greedy nearest-coordinate match so grid snapping cannot mis-assign points. */
function matchSpots(records: any[]): SpotW[] {
  const pairs: { i: number; j: number; d: number }[] = [];
  records.forEach((r, j) => {
    HOTSPOTS.forEach((h, i) => {
      const dlat = n(r.latitude) - h.lat;
      const dlon = n(r.longitude) - h.lon;
      pairs.push({ i, j, d: Math.hypot(dlat, dlon) });
    });
  });
  pairs.sort((a, b) => a.d - b.d);

  const takenI = new Set<number>();
  const takenJ = new Set<number>();
  const out: SpotW[] = [];

  for (const p of pairs) {
    if (takenI.has(p.i) || takenJ.has(p.j)) continue;
    if (p.d > 0.35) continue; // > ~35 km means nonsense — leave the point empty
    takenI.add(p.i);
    takenJ.add(p.j);

    const r = records[p.j];
    let mm6 = 0;
    let mm24 = 0;
    try {
      const curKey = String(r.current?.time ?? r.hourly.time[0]).slice(0, 13);
      const times: string[] = r.hourly.time;
      let i = times.findIndex((t) => t.slice(0, 13) >= curKey);
      if (i < 0) i = 0;
      for (let k = i; k < Math.min(i + 6, times.length); k++) mm6 += n(r.hourly.precipitation[k]);
      for (let k = i; k < Math.min(i + 24, times.length); k++) mm24 += n(r.hourly.precipitation[k]);
    } catch {
      /* keep zeros */
    }

    out.push({
      id: HOTSPOTS[p.i].id,
      mm6: Math.round(mm6 * 10) / 10,
      mm24: Math.round(mm24 * 10) / 10,
      nowMm: n(r.current?.precipitation),
      tempC: n(r.current?.temperature_2m),
    });
  }
  return out;
}

export async function fetchSpots(): Promise<SpotW[] | null> {
  const lat = HOTSPOTS.map((h) => h.lat.toFixed(4)).join(',');
  const lon = HOTSPOTS.map((h) => h.lon.toFixed(4)).join(',');
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    '&current=temperature_2m,precipitation' +
    '&hourly=precipitation&forecast_days=2&timezone=Asia%2FKolkata';

  const d = await json(url);
  if (!d) return null;
  const recs = Array.isArray(d) ? d : [d];
  if (!recs.length || !recs[0].hourly) return null;
  try {
    const spots = matchSpots(recs);
    return spots.length ? spots : null;
  } catch {
    return null;
  }
}

/** Observed monsoon rainfall (1–30 Jun–Sep windows) from the Open-Meteo archive. */
export async function fetchMonsoon(): Promise<Monsoon | null> {
  const base =
    `https://archive-api.open-meteo.com/v1/archive?latitude=${AMRITSAR.lat}&longitude=${AMRITSAR.lon}` +
    '&daily=precipitation_sum&timezone=Asia%2FKolkata';

  const sum = async (start: string, end: string, monsoonOnly = false): Promise<number | null> => {
    const d = await json(`${base}&start_date=${start}&end_date=${end}`);
    const times: string[] | undefined = d?.daily?.time;
    const vals: (number | null)[] | undefined = d?.daily?.precipitation_sum;
    if (!times || !vals) return null;
    let s = 0;
    let seen = false;
    times.forEach((t, i) => {
      if (monsoonOnly) {
        const m = Number(t.slice(5, 7));
        if (m < 6 || m > 9) return;
      }
      seen = true;
      s += n(vals[i]);
    });
    if (!seen) return null;
    return Math.round(s);
  };

  const [a, b, c] = await Promise.all([
    sum('2026-06-01', '2026-09-30'),
    sum('2025-06-01', '2025-09-30'),
    sum('2016-06-01', '2025-09-30', true),
  ]);
  if (a === null && b === null && c === null) return null;
  return { y2026: a, y2025: b, avg10y: c === null ? null : Math.round(c / 10) };
}

export async function fetchRadar(): Promise<RadarMeta | null> {
  const d = await json('https://api.rainviewer.com/public/weather-maps.json');
  const past: { time: number; path: string }[] | undefined = d?.radar?.past;
  if (!d?.host || !past?.length) return null;
  const last = past[past.length - 1];
  return { host: d.host, path: last.path, time: last.time };
}

export const radarTileUrl = (m: RadarMeta): string =>
  `${m.host}${m.path}/256/{z}/{x}/{y}/2/1_1.png`;

/* ---------------- hooks ---------------- */

export interface Dash {
  city: City | null;
  spots: SpotW[] | null;
  monsoon: Monsoon | null;
  loading: boolean;
  error: boolean;
  refresh: () => void;
}

/* Last successful payload, kept so a reload shows data instantly and the
   refresh countdown keeps counting the shared wall-clock cycle. */
const CACHE_KEY = 'jaldrishti.cache.v1';

interface Cache {
  city: City | null;
  spots: SpotW[] | null;
  monsoon: Monsoon | null;
  savedAt: number;
}

function readCache(): Cache | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const c = JSON.parse(raw);
    if (!c || typeof c.savedAt !== 'number') return null;
    return c as Cache;
  } catch {
    return null;
  }
}

function writeCache(c: Cache) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(c));
  } catch {
    /* private mode / quota — countdown still works, just no instant reload */
  }
}

export function useDashboard(): Dash {
  const [city, setCity] = useState<City | null>(null);
  const [spots, setSpots] = useState<SpotW[] | null>(null);
  const [monsoon, setMonsoon] = useState<Monsoon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [gen, setGen] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const cached = readCache();
    if (cached) {
      setCity(cached.city);
      setSpots(cached.spots);
      setMonsoon(cached.monsoon);
      setError(cached.city === null);
      setLoading(false);
    }

    const load = async () => {
      const [c, s, m] = await Promise.all([fetchCity(), fetchSpots(), fetchMonsoon()]);
      if (cancelled) return;
      if (c) {
        setCity(c);
        setSpots(s);
        setMonsoon(m);
        setError(false);
        writeCache({ city: c, spots: s, monsoon: m, savedAt: Date.now() });
      } else {
        setError(true);
      }
      setLoading(false);
    };

    load();

    /* Fire on shared wall-clock 10-minute boundaries (12:00, 12:10, …) so the
       countdown is the same for every visitor and a reload does not reset it. */
    let timer = 0;
    const schedule = () => {
      timer = window.setTimeout(() => {
        load().finally(schedule);
      }, Math.max(msToNextRefresh(), 30_000));
    };
    schedule();

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [gen]);

  return { city, spots, monsoon, loading, error, refresh: () => setGen((g) => g + 1) };
}

export function useRadar(): { radar: RadarMeta | null; loading: boolean } {
  const [radar, setRadar] = useState<RadarMeta | null>(null);
  const [loading, setLoading] = useState(false);

  const load = () => {
    setLoading(true);
    fetchRadar().then((r) => {
      setRadar(r);
      setLoading(false);
    });
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 5 * 60_000);
    return () => clearInterval(id);
  }, []);

  return { radar, loading };
}

/** ms until the next shared auto-refresh (aligned to 10-minute wall-clock boundaries). */
export function msToNextRefresh(): number {
  const next = Math.ceil(Date.now() / REFRESH_MS) * REFRESH_MS;
  return Math.max(0, next - Date.now());
}

/** "HH:MM" in IST for a unix-seconds radar frame timestamp. */
export function istTime(unixSeconds: number): string {
  const d = new Date(unixSeconds * 1000);
  return d.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Kolkata',
  });
}

/** "HH:MM" in IST for a Date.now() timestamp. */
export function istString(ts: number): string {
  return new Date(ts).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Kolkata',
  });
}
