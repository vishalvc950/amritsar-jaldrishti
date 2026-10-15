import { HOTSPOTS } from '../data/geo';
import {
  IMD_THRESHOLD, LEVEL_HEX, LEVEL_KEY, LEVEL_SHORT_KEY, imdLevel, istString,
  type City, type Monsoon, type SpotW,
} from '../api';
import { useUi, type Key } from '../i18n';
import { IconAlert, IconGauge, IconMap, IconRain } from '../components/icons';
import { RiskMap } from '../components/RiskMap';
import { RiskCircles } from '../components/Circles';

const fmt = (n: number, d = 0) =>
  n.toLocaleString('en-IN', { minimumFractionDigits: d, maximumFractionDigits: d });

/* ---------- how it works ---------- */
export function HowItWorks() {
  const { t } = useUi();
  const steps = [
    { icon: <IconRain />, t: t('s1t'), b: t('s1b') },
    { icon: <IconGauge />, t: t('s2t'), b: t('s2b') },
    { icon: <IconAlert />, t: t('s3t'), b: t('s3b') },
  ];
  return (
    <section className="section" id="forecast">
      <div className="container">
        <div className="section__head">
          <span className="kicker">{t('howEyebrow')}</span>
          <h2>{t('howTitle')}</h2>
        </div>
        <div className="steps">
          {steps.map((s, i) => (
            <article className="step" key={i}>
              <div className="step__num" aria-hidden="true">{i + 1}</div>
              <h3>
                <span aria-hidden="true" style={{ verticalAlign: '-3px', marginRight: 8, color: 'var(--blue)' }}>
                  {s.icon}
                </span>
                {s.t}
              </h3>
              <p>{s.b}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- live map ---------- */
export function MapSection({
  spots, focus, fetchedAt,
}: { spots: SpotW[] | null; focus: { id: string; tick: number } | null; fetchedAt: number | null }) {
  const { t } = useUi();

  const legend: { hex: string; label: string; round?: boolean }[] = [
    { hex: LEVEL_HEX.green, label: t('lgG1') },
    { hex: LEVEL_HEX.yellow, label: t('lgG2') },
    { hex: LEVEL_HEX.orange, label: t('lgG3') },
    { hex: LEVEL_HEX.red, label: t('lgG4') },
    { hex: '#2f8fd6', label: t('lgWater') },
    { hex: '#0b2e5b', label: t('lgLandmark'), round: true },
  ];

  return (
    <section className="section section--alt" id="map">
      <div className="container">
        <div className="section__head">
          <span className="kicker">{t('mapEyebrow')}</span>
          <h2>{t('mapTitle')}</h2>
          <p>{t('mapBody')}</p>
        </div>

        <RiskMap spots={spots} focus={focus} fetchedAt={fetchedAt} />

        <div className="mapbar">
          <div className="legend">
            <b className="legend__title">{t('lgTitle')}</b>
            {legend.map((l) => (
              <span key={l.label}>
                <i style={{ background: l.hex, borderRadius: l.round ? '50%' : 3 }} />
                {l.label}
              </span>
            ))}
            <span><i className="legend__radar" />{t('lgRadar')}</span>
          </div>
          <a className="btn btn--primary" href="#circles">
            <IconMap width={16} height={16} />
            {t('mapCta')}
          </a>
        </div>

        <ul className="bullets">
          <li>{t('b1', { n: HOTSPOTS.length })}</li>
          <li>{t('b2')}</li>
          <li>{t('b3')}</li>
        </ul>
        <p className="map-note">{t('mapNote')}</p>
      </div>
    </section>
  );
}

/* ---------- risk circle gauges ---------- */
export function CirclesSection({
  spots, onFocus,
}: { spots: SpotW[] | null; onFocus: (id: string) => void }) {
  const { t } = useUi();
  return (
    <section className="section" id="circles">
      <div className="container">
        <div className="section__head">
          <span className="kicker">{t('cirEyebrow')}</span>
          <h2>{t('cirTitle')}</h2>
          <p>{t('cirBody', { red: String(IMD_THRESHOLD.red) })}</p>
        </div>
        <RiskCircles spots={spots} onFocus={onFocus} />
        <p className="map-note">{t('cirNote')}</p>
      </div>
    </section>
  );
}

/* ---------- alerts ---------- */
export function Alerts({ city, spots, loading }: { city: City | null; spots: SpotW[] | null; loading: boolean }) {
  const { t, lang } = useUi();
  const level = city ? imdLevel(city.next24hMm) : 'green';
  const time = city?.fetchedAt ? istString(city.fetchedAt) : '—';
  const top = (spots ?? [])
    .slice()
    .sort((a, b) => b.mm24 - a.mm24)
    .slice(0, 3);

  const nameOf = (id: string) => {
    const h = HOTSPOTS.find((x) => x.id === id);
    return h ? (lang === 'hi' ? h.nameHi : h.name) : id;
  };

  return (
    <section className="section" id="alerts">
      <div className="container">
        <div className="section__head">
          <span className="kicker">{t('alEyebrow')}</span>
          <h2>{t('alTitle')}</h2>
        </div>

        <div className="alerts">
          <article className={`alert alert--${level} alert--lead`}>
            <div className="alert__head">
              <span className={`pill pill--${level}`}>
                <span className="dot" aria-hidden="true" />
                {t(LEVEL_SHORT_KEY[level] as Key)}
              </span>
              <span className="alert__tag">{t('alDistrict')}</span>
            </div>
            <h3>{t(LEVEL_KEY[level] as Key)}</h3>
            <p>
              {city
                ? t('alLiveBody', { mm: city.next24hMm.toFixed(1), level: t(LEVEL_SHORT_KEY[level] as Key) })
                : t('popAwait')}
            </p>
            <span className="alert__time">
              {city
                ? t('alValid', { time, h6: city.next6hMm.toFixed(1) })
                : t('alWait')}
            </span>
          </article>

          {top.map((w) => {
            const lv = imdLevel(w.mm24);
            return (
              <article className={`alert alert--${lv}`} key={w.id}>
                <div className="alert__head">
                  <span className={`pill pill--${lv}`}>
                    <span className="dot" aria-hidden="true" />
                    {t(LEVEL_SHORT_KEY[lv] as Key)}
                  </span>
                </div>
                <h3>{nameOf(w.id)}</h3>
                <p>{t('alSpot', { h24: w.mm24.toFixed(1), h6: w.mm6.toFixed(1) })}</p>
                <span className="alert__time">{t('alSpotSrc', { time })}</span>
              </article>
            );
          })}

          {!spots && (
            <article className="alert alert--green">
              <div className="alert__head">
                <span className="alert__tag">{loading ? t('alLoading') : t('alOfflineTag')}</span>
              </div>
              <h3>{loading ? t('alLoading') : t('alOffline')}</h3>
              <p>{t('alOfflineBody')}</p>
            </article>
          )}
        </div>

        <div className="channels">
          <div>
            <h3>{t('chTitle')}</h3>
            <p>{t('chBody')}</p>
          </div>
          <div className="channels__links">
            <a className="btn btn--ghost" href="https://mausam.imd.gov.in/" target="_blank" rel="noreferrer">
              {t('linkIMD')}
            </a>
            <a className="btn btn--ghost" href="https://www.ndma.gov.in/" target="_blank" rel="noreferrer">
              {t('linkNDMA')}
            </a>
            <a className="btn btn--ghost" href="tel:112">{t('call112')}</a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- data & sources ---------- */
export function DataSection({
  city, monsoon, spots,
}: { city: City | null; monsoon: Monsoon | null; spots: SpotW[] | null }) {
  const { t } = useUi();

  const monoLine =
    monsoon?.y2026 != null
      ? t('covMonsoonSub', {
          y25: monsoon.y2025 != null ? fmt(monsoon.y2025) : '—',
          avg: monsoon.avg10y != null ? fmt(monsoon.avg10y) : '—',
        })
      : t('covMonsoonNone');

  return (
    <section className="section section--alt" id="data">
      <div className="container">
        <div className="section__head">
          <span className="kicker">{t('covEyebrow')}</span>
          <h2>{t('covTitle')}</h2>
        </div>

        <div className="helplines">
          <div className="helpline"><b>112</b><span>{t('h112l')}</span></div>
          <div className="helpline"><b>1077</b><span>{t('h1077l')}</span></div>
          <div className="helpline"><b>1078</b><span>{t('h1078l')}</span></div>
        </div>

        <div className="covgrid">
          <div>
            <h3 className="cov-h">{t('srcTitle')}</h3>
            <div className="chips">
              <span className="chip"><a href="https://open-meteo.com/" target="_blank" rel="noreferrer">{t('src1')}</a></span>
              <span className="chip"><a href="https://open-meteo.com/en/docs/historical-weather-api" target="_blank" rel="noreferrer">{t('src2')}</a></span>
              <span className="chip"><a href="https://www.rainviewer.com/" target="_blank" rel="noreferrer">{t('src3')}</a></span>
              <span className="chip"><a href="https://www.openstreetmap.org/" target="_blank" rel="noreferrer">{t('src4')}</a></span>
              <span className="chip">{t('src5')}</span>
            </div>
            <p className="map-note">{t('srcNote', { time: city?.fetchedAt ? istString(city.fetchedAt) : '—' })}</p>
          </div>
          <div className="kv">
            <div className="item">
              <b>{spots ? spots.length : '—'}</b>
              <span>{t('covPoints')}</span>
            </div>
            <div className="item">
              <b>7 {t('unitDays')}</b>
              <span>{t('covHorizon')}</span>
            </div>
            <div className="item">
              <b>10 {t('unitMin')}</b>
              <span>{t('covRefresh')}</span>
            </div>
            <div className="item">
              <b>{monsoon?.y2026 != null ? `${fmt(monsoon.y2026)} ${t('unitMm')}` : '—'}</b>
              <span>{t('covMonsoon')}</span>
            </div>
          </div>
        </div>
        <p className="map-note">{monoLine}</p>
      </div>
    </section>
  );
}
