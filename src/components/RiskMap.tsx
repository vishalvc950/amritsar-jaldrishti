import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  imdLevel, LEVEL_HEX, LEVEL_SHORT_KEY, istString, radarTileUrl,
  useRadar, type Level, type SpotW,
} from '../api';
import { CITY, HOTSPOTS, LANDMARKS, WATERWAYS } from '../data/geo';
import { useUi, type Key } from '../i18n';

const WATER_HEX = { canal: '#2f8fd6', drain: '#6aa9e0' } as const;

interface Props {
  spots: SpotW[] | null;
  focus: { id: string; tick: number } | null;
  fetchedAt: number | null;
}

export function RiskMap({ spots, focus, fetchedAt }: Props) {
  const { t, lang } = useUi();
  const { radar } = useRadar();
  const [radarOn, setRadarOn] = useState(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).get('radar') === '1';
  });
  const [mapObj, setMapObj] = useState<L.Map | null>(null);
  const elRef = useRef<HTMLDivElement | null>(null);
  const circlesRef = useRef<Record<string, L.Circle>>({});

  /* ---- base map (created once per mount) ---- */
  useEffect(() => {
    if (!elRef.current || mapObj) return;
    const map = L.map(elRef.current, {
      center: [CITY.lat, CITY.lon],
      zoom: 12,
      zoomControl: false,
      scrollWheelZoom: false,
    });

    const street = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    });
    const light = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
    });
    street.addTo(map);
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    L.control.scale({ metric: true, imperial: false, position: 'bottomleft' }).addTo(map);
    L.control
      .layers(
        { [t('bmStreet')]: street, [t('bmLight')]: light },
        undefined,
        { position: 'bottomright' },
      )
      .addTo(map);

    map.fitBounds(
      L.latLngBounds(HOTSPOTS.map((h) => [h.lat, h.lon] as [number, number])).pad(0.3),
      { animate: false },
    );

    setMapObj(map);
    return () => {
      map.remove();
      setMapObj(null);
      circlesRef.current = {};
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---- overlay layers: waterways, landmarks, risk circles ---- */
  useEffect(() => {
    if (!mapObj) return;
    const added: L.Layer[] = [];

    for (const w of WATERWAYS) {
      const line = L.polyline(w.path, {
        color: WATER_HEX[w.kind],
        weight: 3,
        opacity: 0.75,
        lineCap: 'round',
      });
      line.bindTooltip(w.name ?? t(w.kind === 'canal' ? 'lgCanalOsm' : 'lgDrainOsm'), {
        sticky: true,
      });
      line.addTo(mapObj);
      added.push(line);
    }

    for (const lm of LANDMARKS) {
      const dot = L.circleMarker([lm.lat, lm.lon], {
        radius: 6,
        color: '#0b2e5b',
        weight: 2,
        fillColor: '#0b2e5b',
        fillOpacity: 0.9,
      });
      dot.bindTooltip(lang === 'hi' ? lm.nameHi : lm.name, { direction: 'top' });
      dot.bindPopup(
        `<div class="pop"><b>${lang === 'hi' ? lm.nameHi : lm.name}</b>` +
          `<div class="pop__row"><span>${t('popCoord')}</span><b>${lm.lat.toFixed(4)}, ${lm.lon.toFixed(4)}</b></div>` +
          `<small>${t('popOsm')}</small></div>`,
      );
      dot.addTo(mapObj);
      added.push(dot);
    }

    const circles: Record<string, L.Circle> = {};
    for (const h of HOTSPOTS) {
      const w = spots?.find((s) => s.id === h.id) ?? null;
      const level: Level = w ? imdLevel(w.mm24) : 'green';
      const radius = w ? 550 + Math.min(w.mm24, 220) * 4.5 : 550;
      const hex = w ? LEVEL_HEX[level] : '#94a3b8';

      const circle = L.circle([h.lat, h.lon], {
        radius,
        color: hex,
        weight: w ? 2 : 1.5,
        opacity: 0.95,
        fillColor: hex,
        fillOpacity: w ? 0.22 : 0.1,
      });
      circle.bindTooltip(lang === 'hi' ? h.nameHi : h.name, { sticky: true });

      const name = lang === 'hi' ? h.nameHi : h.name;
      const body = w
        ? `<div class="pop__rows">` +
          `<div class="pop__row"><span>${t('p24')}</span><b>${w.mm24.toFixed(1)} ${t('unitMm')}</b></div>` +
          `<div class="pop__row"><span>${t('p6')}</span><b>${w.mm6.toFixed(1)} ${t('unitMm')}</b></div>` +
          `<div class="pop__row"><span>${t('popTemp')}</span><b>${w.tempC.toFixed(1)}°C</b></div>` +
          `</div>`
        : `<div class="pop__rows"><div class="pop__row"><span>${t('popAwait')}</span></div></div>`;

      circle.bindPopup(
        `<div class="pop">` +
          `<div class="pop__top"><b>${name}</b>` +
          `<span class="pop__level pop__level--${level}">${t(LEVEL_SHORT_KEY[level] as Key)}</span></div>` +
          body +
          `<small>${t('popSrc', { time: fetchedAt ? istString(fetchedAt) : '—' })}</small>` +
          `</div>`,
      );
      circle.addTo(mapObj);
      added.push(circle);
      circles[h.id] = circle;
    }
    circlesRef.current = circles;

    return () => {
      for (const l of added) {
        try {
          mapObj.removeLayer(l);
        } catch {
          /* map already gone */
        }
      }
      circlesRef.current = {};
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapObj, spots, lang, t, fetchedAt]);

  /* ---- fly to a circle when a gauge card is clicked ---- */
  useEffect(() => {
    if (!mapObj || !focus) return;
    const h = HOTSPOTS.find((x) => x.id === focus.id);
    if (!h) return;
    mapObj.flyTo([h.lat, h.lon], 14, { duration: 0.7 });
    const open = () => circlesRef.current[focus.id]?.openPopup();
    const id = window.setTimeout(open, 500);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapObj, focus]);

  /* ---- RainViewer radar overlay ---- */
  useEffect(() => {
    if (!mapObj || !radarOn || !radar) return;
    const layer = L.tileLayer(radarTileUrl(radar), {
      opacity: 0.7,
      maxZoom: 18,
      maxNativeZoom: 7, // RainViewer free tiles stop at z7 (2026 limit); overzoom instead
      attribution: 'Radar &copy; <a href="https://www.rainviewer.com/">RainViewer</a>',
    });
    layer.addTo(mapObj);
    return () => {
      try {
        mapObj.removeLayer(layer);
      } catch {
        /* map already gone */
      }
    };
  }, [mapObj, radarOn, radar]);

  return (
    <div className="mapwrap">
      <div className="mapel" ref={elRef} role="application" aria-label={t('mapAria')} />
      <div className="map-tools">
        <button
          type="button"
          className={'map-tool' + (radarOn ? ' is-on' : '')}
          aria-pressed={radarOn}
          onClick={() => setRadarOn((v) => !v)}
        >
          <span className="map-tool__dot" aria-hidden="true" />
          {t('btnRadar')}
        </button>
        {radarOn && (
          <span className="map-tool__note">
            {radar ? t('radarAt', { time: istString(radar.time * 1000) }) : t('radarLoad')}
          </span>
        )}
      </div>
      <span className="map-attrib-note">{t('mapSourceNote')}</span>
    </div>
  );
}
