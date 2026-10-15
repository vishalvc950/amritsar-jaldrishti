import { useUi } from '../i18n';

export function Footer({ lastUpdated }: { lastUpdated: string }) {
  const { t } = useUi();
  return (
    <footer className="footer" id="about">
      <div className="container">
        <div className="footer__grid">
          <div>
            <div className="footer__brand">
              <svg width="34" height="34" viewBox="0 0 64 64" aria-hidden="true">
                <circle cx="32" cy="32" r="30" fill="#0B2E5B" stroke="#FF9933" strokeWidth="3" />
                <path d="M32 14c7 10.5 12 16 12 21.5a12 12 0 0 1-24 0C20 30 25 24.5 32 14z" fill="#FF9933" />
              </svg>
              <b>{t('brand')}</b>
            </div>
            <p>{t('fAbout')}</p>
          </div>
          <div>
            <h4>{t('fQuick')}</h4>
            <ul>
              <li><a href="#top">{t('navHome')}</a></li>
              <li><a href="#map">{t('navMap')}</a></li>
              <li><a href="#circles">{t('navCircles')}</a></li>
              <li><a href="#alerts">{t('navAlerts')}</a></li>
              <li><a href="#data">{t('navData')}</a></li>
            </ul>
          </div>
          <div>
            <h4>{t('fRes')}</h4>
            <ul>
              <li><a href="https://open-meteo.com/" target="_blank" rel="noreferrer">Open-Meteo API</a></li>
              <li><a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a></li>
              <li><a href="https://www.rainviewer.com/" target="_blank" rel="noreferrer">RainViewer radar</a></li>
              <li><a href="https://mausam.imd.gov.in/" target="_blank" rel="noreferrer">IMD Mausam</a></li>
            </ul>
          </div>
          <div>
            <h4>{t('fContact')}</h4>
            <ul>
              <li>{t('fAddr')}</li>
              <li>{t('h1077l')}: <b>1077</b></li>
              <li>{t('h112l')}: <b>112</b></li>
            </ul>
          </div>
        </div>
        <div className="footer__bar">
          <p className="disc">{t('disclaimer')}</p>
          <div className="footer__meta">
            <span>{t('lastUpdated', { date: lastUpdated })}</span>
            <span>{t('builtFor')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
