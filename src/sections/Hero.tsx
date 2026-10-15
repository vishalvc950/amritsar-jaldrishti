import { useEffect, useState } from 'react';
import { useUi, type Key } from '../i18n';
import {
  imdLevel, LEVEL_KEY, msToNextRefresh, windDirKey, wx, type City,
} from '../api';
import { IconAlert, IconClock, IconGauge, IconRain, IconRefresh, WeatherIcon } from '../components/icons';
import { RingGauge } from '../components/Circles';

const fmt = (n: number, d = 0) =>
  n.toLocaleString('en-IN', { minimumFractionDigits: d, maximumFractionDigits: d });

export function Hero({
  city, loading, onRefresh,
}: { city: City | null; loading: boolean; onRefresh: () => void }) {
  const { t, lang } = useUi();
  const level = city ? imdLevel(city.next24hMm) : 'green';
  const maxMm = Math.max(...(city?.daily7.map((d) => d.mm) ?? [1]), 1);
  const maxHour = Math.max(...(city?.hours.map((h) => h.mm) ?? [1]), 1);
  const wxc = city ? wx(city.code) : null;

  return (
    <section className="hero" id="top">
      <div className="container hero__in">
        <div>
          <span className="eyebrow">{t('heroEyebrow')}</span>
          <h1>
            {t('heroTitle1')}
            <span className="accent">{t('heroTitle2')}</span>
          </h1>
          <p className="hero__sub">{t('heroSub')}</p>
          <div className="hero__cta">
            <a className="btn btn--primary" href="#map">{t('ctaMap')} →</a>
            <a className="btn btn--ghost" href="#alerts">{t('ctaAlerts')}</a>
          </div>
        </div>

        <div className="panel" aria-live="polite">
          <div className="panel__top">
            <span className={`pill pill--${city ? level : 'green'}`}>
              <span className="dot" aria-hidden="true" />
              {city ? t(LEVEL_KEY[level] as Key) : t('lvlPending')}
            </span>
            <span className={'live-tag' + (city ? '' : ' is-off')}>
              {city ? t('live') : loading ? t('loading') : t('offline')}
            </span>
          </div>

          <div className="panel__now">
            <RingGauge pct={city ? city.next24hMm / 204.4 : 0} level={level} size={116} stroke={10}>
              <b>{city ? fmt(city.next24hMm, 1) : '—'}</b>
              <span>{t('unitMm')} · {t('p24')}</span>
            </RingGauge>

            <div className="panel__wx">
              <div className="wxline">
                <span className="wxline__ico" aria-hidden="true">
                  {wxc ? <WeatherIcon code={city!.code} size={40} /> : null}
                </span>
                <div>
                  <b>{city ? `${fmt(city.tempC, 1)}°C` : '—'}</b>
                  <span>{wxc ? t(wxc.key) : t('popAwait')}</span>
                </div>
              </div>
              <div className="minigrid">
                <div><b>{city ? `${fmt(city.feelsC, 1)}°` : '—'}</b><span>{t('pFeels')}</span></div>
                <div><b>{city ? `${fmt(city.humidityPct)}%` : '—'}</b><span>{t('pHum')}</span></div>
                <div>
                  <b>{city ? `${fmt(city.windKmh)}` : '—'}</b>
                  <span>{city ? `${t(windDirKey(city.windDirDeg))} · ${t('pWind')}` : t('pWind')}</span>
                </div>
                <div><b>{city ? `${fmt(city.pressureHpa)}` : '—'}</b><span>{t('pPres')} hPa</span></div>
              </div>
            </div>
          </div>

          <div className="panel__hour">
            <h4>{t('p12h')}</h4>
            <div className="hstrip">
              {(city?.hours ?? []).slice(0, 12).map((h, i) => (
                <div className="hcol" key={h.time + i} title={`${h.time} · ${h.mm} mm · ${h.pop}%`}>
                  <span className="hval">{h.mm > 0 ? fmt(h.mm, h.mm < 10 ? 1 : 0) : ''}</span>
                  <div
                    className={'hbar' + (h.mm <= 0 ? ' is-0' : '')}
                    style={{ height: `${Math.max(3, (h.mm / maxHour) * 34)}px` }}
                  />
                  <span className="hhr">{h.time.slice(11, 13)}h</span>
                </div>
              ))}
              {!city && <span className="hstrip__wait">{t('popAwait')}</span>}
            </div>
          </div>

          <div className="panel__week">
            <h4>
              {t('pWeek')} · {t('p24')}: {city ? fmt(city.next24hMm, 1) : '—'} {t('unitMm')}
            </h4>
            <div className="bars">
              {(city?.daily7 ?? []).map((d, i) => (
                <div className="col" key={d.date + i} title={`${d.date}: ${d.mm} mm`}>
                  <span className="val">{d.mm > 0 ? fmt(d.mm) : ''}</span>
                  <div
                    className={'bar' + (d.mm <= 0 ? ' is-0' : '')}
                    style={{ height: `${Math.max(4, (d.mm / maxMm) * 42)}px` }}
                  />
                  <span className="day">{i === 0 ? (lang === 'hi' ? 'आज' : 'today') : `+${i}`}</span>
                  <span className="dtemp">{fmt(d.maxC)}°/{fmt(d.minC)}°</span>
                </div>
              ))}
              {!city && <span className="hstrip__wait">{t('popAwait')}</span>}
            </div>
          </div>

          <div className="panel__foot">
            <span>
              {t('updated')}{' '}
              {city?.fetchedAt
                ? new Date(city.fetchedAt).toLocaleString('en-IN', {
                    hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short',
                  }) + ' IST'
                : '—'}
            </span>
            <button className="link-btn" onClick={onRefresh} disabled={loading}>
              <IconRefresh width={13} height={13} />
              {t('refresh')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function StatStrip({ city }: { city: City | null }) {
  const { t } = useUi();
  const level = city ? imdLevel(city.next24hMm) : 'green';
  return (
    <section className="stats" aria-label="Key figures">
      <div className="container stats__in">
        <div className="stat">
          <span className="stat__ico" aria-hidden="true"><IconRain /></span>
          <div>
            <b>{city ? fmt(city.todayMm, 1) : '—'} <span style={{ fontSize: '0.85rem' }}>{t('unitMm')}</span></b>
            <span>{t('stToday')}</span>
          </div>
        </div>
        <div className="stat">
          <span className="stat__ico" aria-hidden="true"><IconGauge /></span>
          <div>
            <b>{city ? fmt(city.next24hMm, 1) : '—'} <span style={{ fontSize: '0.85rem' }}>{t('unitMm')}</span></b>
            <span>{t('st24')}</span>
          </div>
        </div>
        <div className="stat">
          <span className="stat__ico" aria-hidden="true"><IconAlert /></span>
          <div>
            <b>
              <span className={`pill pill--${city ? level : 'green'}`}>
                {city ? t(LEVEL_KEY[level] as Key) : t('lvlPending')}
              </span>
            </b>
            <span>{t('stStatus')}</span>
          </div>
        </div>
        <div className="stat">
          <span className="stat__ico" aria-hidden="true"><IconClock /></span>
          <div>
            {city ? <Countdown /> : <b className="mono">—</b>}
            <span>{t('stRun')}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Countdown() {
  const [ms, setMs] = useState(msToNextRefresh());
  useEffect(() => {
    const id = setInterval(() => setMs(msToNextRefresh()), 1000);
    return () => clearInterval(id);
  }, []);
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  const s = Math.floor((ms % 60_000) / 1000);
  const p = (n: number) => String(n).padStart(2, '0');
  return <b className="mono">{p(h)}:{p(m)}:{p(s)}</b>;
}
