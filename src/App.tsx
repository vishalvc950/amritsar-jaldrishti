import { useState } from 'react';
import { UiProvider, useUi } from './i18n';
import { imdLevel, istString, useDashboard } from './api';
import { HOTSPOTS } from './data/geo';
import { UtilityBar, Masthead, Nav, Ticker } from './components/Header';
import { Footer } from './components/Footer';
import { Hero, StatStrip } from './sections/Hero';
import { Alerts, CirclesSection, DataSection, HowItWorks, MapSection } from './sections/Sections';

function Page() {
  const { t } = useUi();
  const { city, spots, monsoon, loading, error, refresh } = useDashboard();
  const [focus, setFocus] = useState<{ id: string; tick: number } | null>(null);

  const levelWord = city
    ? t(
        imdLevel(city.next24hMm) === 'red' ? 'lvlShortRed'
          : imdLevel(city.next24hMm) === 'orange' ? 'lvlShortOrange'
          : imdLevel(city.next24hMm) === 'yellow' ? 'lvlShortYellow'
          : 'lvlShortGreen',
      )
    : '';

  const tickerItems = [
    loading
      ? t('tickLoading')
      : city
        ? t('tickLive', { mm: city.next24hMm.toFixed(1), level: levelWord })
        : t('tickOffline'),
    t('tickPoints', { n: HOTSPOTS.length }),
    monsoon?.y2026 != null
      ? t('tickMonsoon', { mm: monsoon.y2026.toLocaleString('en-IN') })
      : t('tickMonsoonNa'),
    t('tick4'),
  ];

  const focusPoint = (id: string) => {
    setFocus({ id, tick: Date.now() });
    document.querySelector('#map')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <UtilityBar />
      <Masthead />
      <Nav />
      <Ticker items={tickerItems} />
      <main id="main">
        <Hero city={city} loading={loading} onRefresh={refresh} />
        <StatStrip city={city} />
        <HowItWorks />
        <MapSection spots={spots} focus={focus} fetchedAt={city?.fetchedAt ?? null} />
        <CirclesSection spots={spots} onFocus={focusPoint} />
        <Alerts city={city} spots={spots} loading={loading} />
        <DataSection city={city} monsoon={monsoon} spots={spots} />
        {error && (
          <div className="neterr" role="status">
            {t('netErr')}
          </div>
        )}
      </main>
      <Footer
        lastUpdated={city?.fetchedAt ? istString(city.fetchedAt) + ' IST' : t('offline')}
      />
    </>
  );
}

export default function App() {
  return (
    <UiProvider>
      <Page />
    </UiProvider>
  );
}
