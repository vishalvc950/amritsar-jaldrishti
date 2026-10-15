import {
  createContext, useContext, useEffect, useMemo, useState,
  type ReactNode,
} from 'react';

export type Lang = 'en' | 'hi';

const en = {
  skip: 'Skip to main content',
  textSize: 'Text size',
  contrast: 'High contrast',
  dept: 'Amritsar, Punjab · live flood & rain watch',
  openChip: 'OPEN DATA',
  brand: 'JalDrishti',
  title: 'Amritsar Urban Flood Warning System',
  searchPh: 'Search wards, alerts, sources…',
  searchBtn: 'Search',
  noResults: 'No matching section',
  navHome: 'Home',
  navMap: 'Live Risk Map',
  navCircles: 'Risk Circles',
  navAlerts: 'Alerts',
  navData: 'Data & Sources',
  navAbout: 'About',
  tickerLabel: 'Latest updates',
  tickLoading: 'Fetching live rainfall forecasts from Open-Meteo…',
  tickLive: '{mm} mm rain forecast in next 24 hrs — district status {level}.',
  tickOffline: 'Open-Meteo unreachable — live figures appear as soon as the API responds.',
  tickPoints: '{n} flood-sensitive points monitored live across Amritsar.',
  tickMonsoon: 'Monsoon 2026 (Jun–Sep) observed rainfall: {mm} mm — Open-Meteo archive.',
  tickMonsoonNa: 'Monsoon archive unavailable right now — will retry automatically.',
  tick4: 'Helpline 1077 (District Control Room) · 112 (Emergency)',
  heroEyebrow: 'Live rainfall & flood watch · Amritsar district',
  heroTitle1: 'Know the rain,',
  heroTitle2: 'before it reaches your street.',
  heroSub:
    'Open-Meteo forecasts, IMD colour thresholds and OpenStreetMap basemaps, turned into ward-level flood circles for Amritsar — fetched live in your browser and refreshed every 10 minutes.',
  ctaMap: 'Open flood risk map',
  ctaAlerts: 'View current alerts',
  updated: 'Updated',
  offline: 'Offline — no live data',
  loading: 'LOADING…',
  live: 'LIVE',
  refresh: 'Refresh',
  lvlPending: 'AWAITING LIVE DATA',
  pFeels: 'Feels like',
  pHum: 'Humidity',
  pWind: 'Wind',
  pPres: 'Pressure',
  p24: 'Next 24 h',
  p6: 'Next 6 h',
  p12h: 'Next 12 hours · rainfall',
  pWeek: '7-day rainfall outlook',
  stToday: 'Rain today so far',
  st24: 'Forecast · next 24 hrs',
  stStatus: 'District status',
  stRun: 'Next auto-refresh',
  unitMm: 'mm',
  unitDays: 'days',
  unitMin: 'min',
  lvlGreen: 'GREEN — normal',
  lvlYellow: 'YELLOW — be aware',
  lvlOrange: 'ORANGE — be prepared',
  lvlRed: 'RED — take action',
  lvlShortGreen: 'GREEN',
  lvlShortYellow: 'YELLOW',
  lvlShortOrange: 'ORANGE',
  lvlShortRed: 'RED',
  wxClear: 'Clear',
  wxMostlyClear: 'Mainly clear',
  wxPartly: 'Partly cloudy',
  wxOvercast: 'Overcast',
  wxFog: 'Fog',
  wxDrizzle: 'Drizzle',
  wxFreezing: 'Freezing rain',
  wxSnow: 'Snow',
  wxThunder: 'Thundery showers',
  wxRainLight: 'Light rain',
  wxRainModerate: 'Moderate rain',
  wxRainHeavy: 'Heavy rain',
  windN: 'N',
  windNE: 'NE',
  windE: 'E',
  windSE: 'SE',
  windS: 'S',
  windSW: 'SW',
  windW: 'W',
  windNW: 'NW',
  howEyebrow: 'How JalDrishti works',
  howTitle: 'Three steps from open data to street.',
  s1t: 'Fetch',
  s1b:
    'Current conditions, hourly rainfall and the 7-day outlook stream in from the Open-Meteo forecast API for Amritsar — live in your browser, refreshed every 10 minutes.',
  s2t: 'Apply thresholds',
  s2b:
    'Each point’s 24-hour rainfall total is matched to the IMD colour code: yellow above 64.4 mm, orange above 115.5 mm, red above 204.4 mm.',
  s3t: 'Circle & alert',
  s3b:
    'Every monitored point becomes a risk circle on the map and a ring gauge in the dashboard, with alert cards ranked by forecast rainfall.',
  mapEyebrow: 'Live risk map',
  mapTitle: 'A real map of Amritsar, circle by circle.',
  mapBody:
    'OpenStreetMap street tiles with a risk circle over each monitored point, canal and drain geometry straight from OSM, landmark pins and an optional RainViewer radar overlay.',
  b1: '{n} live monitoring points, colour-coded by IMD threshold',
  b2: 'Canal & drain lines exported from OpenStreetMap (Upper Bari Doab Canal included)',
  b3: 'Rain-radar overlay, scale bar and two basemaps (street / light)',
  mapCta: 'See the risk circles →',
  mapNote:
    'Base map © OpenStreetMap contributors · place coordinates geocoded with OSM Nominatim · waterway geometry from the OSM Overpass API · rainfall values from Open-Meteo.',
  mapAria: 'Interactive flood-risk map of Amritsar',
  mapSourceNote: 'Circles show forecast rainfall risk, not confirmed waterlogging.',
  bmStreet: 'Street',
  bmLight: 'Light',
  btnRadar: 'Radar',
  radarAt: 'Radar composite · {time} IST',
  radarLoad: 'Loading radar…',
  lgTitle: 'Circle colour = rainfall forecast, next 24 h',
  lgG1: 'Under 64.4 mm (green)',
  lgG2: '64.4–115.5 mm (yellow)',
  lgG3: '115.5–204.4 mm (orange)',
  lgG4: 'Over 204.4 mm (red)',
  lgWater: 'Canal / drain (OSM)',
  lgLandmark: 'Landmark',
  lgRadar: 'Radar overlay (RainViewer)',
  lgCanalOsm: 'Canal (OSM)',
  lgDrainOsm: 'Drain (OSM)',
  cirEyebrow: 'Risk circles',
  cirTitle: 'Every watched point, as a circle.',
  cirBody:
    'Each ring is the forecast rainfall for the next 24 hours at that point, measured against the IMD red threshold of {red} mm per 24 hours. Colour follows the IMD colour code. Click any card to fly to it on the live map.',
  cirNote:
    'Coordinates: OpenStreetMap · values: Open-Meteo, refreshed every 10 minutes. Circles show forecast risk, not confirmed waterlogging.',
  awaitShort: 'NO DATA',
  popAwait: 'Awaiting live data…',
  popCoord: 'Coordinates',
  popOsm: 'Point geocoded from OpenStreetMap',
  popTemp: 'Temperature now',
  popSrc: 'Open-Meteo · updated {time} IST',
  alEyebrow: 'Alerts',
  alTitle: 'Colour-coded, point-specific, early.',
  alDistrict: 'DISTRICT · NEXT 24 H',
  alLiveBody:
    '{mm} mm of rain possible under {level} conditions. Low-lying wards should keep dewatering pumps on standby.',
  alValid: 'Valid now · {h6} mm expected in the next 6 h · updated {time} IST',
  alWait: 'Awaiting live forecast data…',
  alSpot: '{h24} mm possible in the next 24 hours, {h6} mm in the next 6.',
  alSpotSrc: 'Open-Meteo grid forecast · updated {time} IST',
  alLoading: 'Loading live data…',
  alOffline: 'Live data unavailable',
  alOfflineTag: 'OFFLINE',
  alOfflineBody:
    'The forecast API could not be reached from your network. Nothing here is simulated — figures return on the next successful refresh.',
  chTitle: 'Official warning channels',
  chBody:
    'This portal publishes the same IMD colour codes live. For authoritative warnings follow IMD and NDMA; in an emergency call 112.',
  linkIMD: 'IMD Mausam',
  linkNDMA: 'NDMA',
  call112: 'Call 112',
  covEyebrow: 'Data & helplines',
  covTitle: 'One portal, every open source, one response chain.',
  h112l: 'Emergency',
  h1077l: 'District Control Room',
  h1078l: 'National Disaster Response',
  srcTitle: 'Live data sources',
  src1: 'Open-Meteo — forecast API',
  src2: 'Open-Meteo — archive (daily rainfall)',
  src3: 'RainViewer — radar composite',
  src4: 'OpenStreetMap — tiles, places, waterways',
  src5: 'IMD colour-code thresholds (64.4 / 115.5 / 204.4 mm per 24 h)',
  srcNote: 'All figures fetched live from your browser at {time} IST — nothing on this page is pre-recorded.',
  covPoints: 'points monitored live',
  covHorizon: 'rainfall forecast',
  covRefresh: 'automatic refresh',
  covMonsoon: 'monsoon 2026 rainfall (Jun–Sep)',
  covMonsoonSub: '2025 same period: {y25} mm · 10-year Jun–Sep average: {avg} mm (Open-Meteo archive)',
  covMonsoonNone: 'Archive unavailable right now — retrying on the next refresh.',
  netErr:
    'Could not reach the live weather API from this network. Values shown as “—” fill in on the next successful refresh.',
  aboutHead: 'About',
  fAbout:
    'Live rainfall forecasting and ward-level flood circles for Amritsar — honest numbers from open APIs, in English and Hindi.',
  fQuick: 'Quick links',
  fRes: 'Resources',
  fContact: 'Emergency contacts',
  fAddr: 'Amritsar, Punjab',
  disclaimer:
    'JalDrishti is an independent public-interest portal for Amritsar built entirely on open data. Weather: Open-Meteo (free API). Map: © OpenStreetMap contributors. Radar: RainViewer. Warning levels follow IMD’s 24-hour rainfall colour codes. It is not an official government service and does not replace IMD/NDMA/SDMA advisories — in an emergency call 112.',
  lastUpdated: 'Last updated: {date}',
  builtFor: 'Built on open data · Open-Meteo · OpenStreetMap · RainViewer',
};

export type Key = keyof typeof en;

const hi: Record<Key, string> = {
  skip: 'मुख्य सामग्री पर जाएँ',
  textSize: 'टेक्स्ट आकार',
  contrast: 'उच्च कंट्रास्ट',
  dept: 'अमृतसर, पंजाब · लाइव बाढ़ एवं वर्षा निगरानी',
  openChip: 'खुला डेटा',
  brand: 'जलदृष्टि',
  title: 'अमृतसर शहरी बाढ़ पूर्व चेतावनी प्रणाली',
  searchPh: 'वार्ड, चेतावनियाँ, स्रोत खोजें…',
  searchBtn: 'खोजें',
  noResults: 'कोई मिलान अनुभाग नहीं',
  navHome: 'मुख्य पृष्ठ',
  navMap: 'लाइव जोखिम मानचित्र',
  navCircles: 'जोखिम वृत्त',
  navAlerts: 'चेतावनियाँ',
  navData: 'डेटा एवं स्रोत',
  navAbout: 'परिचय',
  tickerLabel: 'ताज़ा सूचनाएँ',
  tickLoading: 'Open-Meteo से लाइव वर्षा पूर्वानुमान प्राप्त किया जा रहा है…',
  tickLive: 'अगले 24 घंटे में {mm} मिमी वर्षा संभव — जिले की स्थिति {level}।',
  tickOffline: 'Open-Meteo अभी उपलब्ध नहीं — डेटा आते ही आँकड़े दिखेंगे।',
  tickPoints: 'अमृतसर भर में {n} बाढ़-संवेदनशील बिंदु लाइव निगरानी में।',
  tickMonsoon: 'मानसून 2026 (जून–सितंबर) दर्ज वर्षा: {mm} मिमी — Open-Meteo आर्काइव।',
  tickMonsoonNa: 'मानसून आर्काइव अभी उपलब्ध नहीं — अपने आप पुनः प्रयास होगा।',
  tick4: 'हेल्पलाइन 1077 (जिला नियंत्रण कक्ष) · 112 (आपातकाल)',
  heroEyebrow: 'लाइव वर्षा एवं बाढ़ निगरानी · अमृतसर जिला',
  heroTitle1: 'बारिश की जानकारी,',
  heroTitle2: 'सड़कों पर पानी आने से पहले।',
  heroSub:
    'Open-Meteo पूर्वानुमान, IMD रंग-सीमाएँ और OpenStreetMap — इन्हीं से अमृतसर के हर वार्ड के लिए जोखिम वृत्त बनते हैं। ब्राउज़र में सीधे लाइव डेटा, हर 10 मिनट में अपडेट।',
  ctaMap: 'बाढ़ जोखिम मानचित्र खोलें',
  ctaAlerts: 'वर्तमान चेतावनियाँ देखें',
  updated: 'अपडेट',
  offline: 'ऑफ़लाइन — कोई लाइव डेटा नहीं',
  loading: 'लोड हो रहा है…',
  live: 'लाइव',
  refresh: 'रीफ्रेश',
  lvlPending: 'लाइव डेटा की प्रतीक्षा में',
  pFeels: 'महसूस',
  pHum: 'आर्द्रता',
  pWind: 'हवा',
  pPres: 'दाब',
  p24: 'अगले 24 घंटे',
  p6: 'अगले 6 घंटे',
  p12h: 'अगले 12 घंटे · वर्षा',
  pWeek: '7-दिन वर्षा परिदृश्य',
  stToday: 'आज अब तक वर्षा',
  st24: 'पूर्वानुमान · अगले 24 घंटे',
  stStatus: 'जिले की स्थिति',
  stRun: 'अगला ऑटो-रीफ्रेश',
  unitMm: 'मिमी',
  unitDays: 'दिन',
  unitMin: 'मिनट',
  lvlGreen: 'हरा — सामान्य',
  lvlYellow: 'पीला — सतर्क',
  lvlOrange: 'नारंगी — तैयार रहें',
  lvlRed: 'लाल — कार्रवाई करें',
  lvlShortGreen: 'हरा',
  lvlShortYellow: 'पीला',
  lvlShortOrange: 'नारंगी',
  lvlShortRed: 'लाल',
  wxClear: 'साफ़',
  wxMostlyClear: 'मुख्यतः साफ़',
  wxPartly: 'आंशिक बादल',
  wxOvercast: 'बादल छाए',
  wxFog: 'कोहरा',
  wxDrizzle: 'बूँदाबाँदी',
  wxFreezing: 'हिमपात वर्षा',
  wxSnow: 'बर्फ़',
  wxThunder: 'गरज के साथ वर्षा',
  wxRainLight: 'हल्की वर्षा',
  wxRainModerate: 'मध्यम वर्षा',
  wxRainHeavy: 'तेज़ वर्षा',
  windN: 'उत्तर',
  windNE: 'पूर्वोत्तर',
  windE: 'पूर्व',
  windSE: 'दक्षिण-पूर्व',
  windS: 'दक्षिण',
  windSW: 'दक्षिण-पश्चिम',
  windW: 'पश्चिम',
  windNW: 'उत्तर-पश्चिम',
  howEyebrow: 'जलदृष्टि कैसे काम करती है',
  howTitle: 'खुले डेटा से सड़क तक तीन चरण।',
  s1t: 'प्राप्त करना',
  s1b:
    'अमृतसर के लिए Open-Meteo पूर्वानुमान API से वर्तमान स्थिति, घंटे-दर-घंटे वर्षा और 7-दिन परिदृश्य सीधे ब्राउज़र में आता है — हर 10 मिनट में ताज़ा।',
  s2t: 'सीमाएँ लागू',
  s2b:
    'हर बिंदु की 24-घंटे वर्षा को IMD रंग-कोड से जोड़ा जाता है: 64.4 मिमी से अधिक पीला, 115.5 से अधिक नारंगी, 204.4 से अधिक लाल।',
  s3t: 'वृत्त एवं चेतावनी',
  s3b:
    'हर निगरानी बिंदु मानचित्र पर जोखिम वृत्त और डैशबोर्ड पर रिंग गेज बन जाता है; चेतावनी कार्ड वर्षा के अनुमान के क्रम में दिखते हैं।',
  mapEyebrow: 'लाइव जोखिम मानचित्र',
  mapTitle: 'अमृतसर का असली मानचित्र, एक वृत्त-दर-वृत्त।',
  mapBody:
    'OpenStreetMap स्ट्रीट टाइल्स, हर निगरानी बिंदु पर जोखिम वृत्त, OSM से सीधे नहर व नाला ज्यामिति, स्थान-चिह्न और वैकल्पिक RainViewer रडार परत।',
  b1: '{n} लाइव निगरानी बिंदु, IMD सीमा के रंग में',
  b2: 'नहर व नाला रेखाएँ OpenStreetMap से (ऊपरी बारी दोआब नहर सहित)',
  b3: 'वर्षा रडार परत, स्केल बार और दो आधार-मानचित्र (स्ट्रीट / लाइट)',
  mapCta: 'जोखिम वृत्त देखें →',
  mapNote:
    'आधार मानचित्र © OpenStreetMap योगदानकर्ता · स्थान निर्देशांक OSM Nominatim से · जल-मार्ग ज्यामिति OSM Overpass API से · वर्षा मान Open-Meteo से।',
  mapAria: 'अमृतसर का इंटरैक्टिव बाढ़-जोखिम मानचित्र',
  mapSourceNote: 'वृत्त पूर्वानुमानित वर्षा-जोखिम दिखाते हैं, पुष्ट जलभराव नहीं।',
  bmStreet: 'स्ट्रीट',
  bmLight: 'लाइट',
  btnRadar: 'रडार',
  radarAt: 'रडार कंपोज़िट · {time} IST',
  radarLoad: 'रडार लोड हो रहा है…',
  lgTitle: 'वृत्त का रंग = अगले 24 घंटे की वर्षा पूर्वानुमान',
  lgG1: '64.4 मिमी से कम (हरा)',
  lgG2: '64.4–115.5 मिमी (पीला)',
  lgG3: '115.5–204.4 मिमी (नारंगी)',
  lgG4: '204.4 मिमी से अधिक (लाल)',
  lgWater: 'नहर / नाला (OSM)',
  lgLandmark: 'स्थान-चिह्न',
  lgRadar: 'रडार परत (RainViewer)',
  lgCanalOsm: 'नहर (OSM)',
  lgDrainOsm: 'नाला (OSM)',
  cirEyebrow: 'जोखिम वृत्त',
  cirTitle: 'हर निगरानी बिंदु, एक वृत्त में।',
  cirBody:
    'हर रिंग उस बिंदु पर अगले 24 घंटे की पूर्वानुमानित वर्षा है, जिसे IMD की लाल सीमा {red} मिमी/24 घंटे से नापा जाता है। रंग IMD रंग-कोड के अनुसार है। किसी भी कार्ड पर क्लिक कर मानचित्र पर उड़ान भरें।',
  cirNote:
    'निर्देशांक: OpenStreetMap · मान: Open-Meteo, हर 10 मिनट में ताज़ा। वृत्त पूर्वानुमानित जोखिम दिखाते हैं, पुष्ट जलभराव नहीं।',
  awaitShort: 'डेटा नहीं',
  popAwait: 'लाइव डेटा की प्रतीक्षा…',
  popCoord: 'निर्देशांक',
  popOsm: 'बिंदु OpenStreetMap से जियोकोडेड',
  popTemp: 'अभी तापमान',
  popSrc: 'Open-Meteo · {time} IST अपडेट',
  alEyebrow: 'चेतावनियाँ',
  alTitle: 'रंग-कोडित, बिंदु-विशिष्ट, समय पर।',
  alDistrict: 'जिला · अगले 24 घंटे',
  alLiveBody:
    '{level} स्थिति में {mm} मिमी वर्षा संभव। निम्न-क्षेत्रीय वार्ड डीवॉटरिंग पंप तैयार रखें।',
  alValid: 'अभी मान्य · अगले 6 घंटे में {h6} मिमी अनुमान · {time} IST अपडेट',
  alWait: 'लाइव पूर्वानुमान डेटा की प्रतीक्षा…',
  alSpot: 'अगले 24 घंटे में {h24} मिमी, अगले 6 घंटे में {h6} मिमी संभव।',
  alSpotSrc: 'Open-Meteo ग्रिड पूर्वानुमान · {time} IST अपडेट',
  alLoading: 'लाइव डेटा लोड हो रहा है…',
  alOffline: 'लाइव डेटा उपलब्ध नहीं',
  alOfflineTag: 'ऑफ़लाइन',
  alOfflineBody:
    'इस नेटवर्क से पूर्वानुमान API तक पहुँच नहीं हुई। यहाँ कुछ भी सिम्युलेटेड नहीं है — अगले सफल रीफ्रेश पर आँकड़े लौट आएँगे।',
  chTitle: 'आधिकारिक चेतावनी चैनल',
  chBody:
    'यह पोर्टल वही IMD रंग-कोड लाइव दिखाता है। प्रामाणिक चेतावनियों के लिए IMD व NDMA देखें; आपात स्थिति में 112 पर कॉल करें।',
  linkIMD: 'IMD मौसम',
  linkNDMA: 'NDMA',
  call112: '112 पर कॉल करें',
  covEyebrow: 'डेटा एवं हेल्पलाइन',
  covTitle: 'एक पोर्टल, हर खुला स्रोत, एक प्रतिक्रिया श्रृंखला।',
  h112l: 'आपातकाल',
  h1077l: 'जिला नियंत्रण कक्ष',
  h1078l: 'राष्ट्रीय आपदा प्रतिक्रिया',
  srcTitle: 'लाइव डेटा स्रोत',
  src1: 'Open-Meteo — पूर्वानुमान API',
  src2: 'Open-Meteo — आर्काइव (दैनिक वर्षा)',
  src3: 'RainViewer — रडार कंपोज़िट',
  src4: 'OpenStreetMap — टाइल, स्थान, जल-मार्ग',
  src5: 'IMD रंग-कोड सीमाएँ (64.4 / 115.5 / 204.4 मिमी प्रति 24 घंटे)',
  srcNote: 'सभी आँकड़े आपके ब्राउज़र से {time} IST पर सीधे प्राप्त — यहाँ कुछ भी पूर्व-रिकॉर्डेड नहीं।',
  covPoints: 'बिंदु लाइव निगरानी में',
  covHorizon: 'वर्षा पूर्वानुमान',
  covRefresh: 'स्वतः रीफ्रेश',
  covMonsoon: 'मानसून 2026 वर्षा (जून–सितंबर)',
  covMonsoonSub: '2025 इसी अवधि: {y25} मिमी · 10-वर्षीय जून–सितंबर औसत: {avg} मिमी (Open-Meteo आर्काइव)',
  covMonsoonNone: 'आर्काइव अभी उपलब्ध नहीं — अगले रीफ्रेश पर पुनः प्रयास होगा।',
  netErr:
    'इस नेटवर्क से लाइव मौसम API तक पहुँच नहीं हुई। “—” दिखे आँकड़े अगले सफल रीफ्रेश पर भर जाएँगे।',
  aboutHead: 'परिचय',
  fAbout:
    'अमृतसर के लिए लाइव वर्षा पूर्वानुमान और वार्ड-स्तरीय बाढ़ वृत्त — खुले API से ईमानदार आँकड़े, हिंदी और अंग्रेज़ी में।',
  fQuick: 'त्वरित लिंक',
  fRes: 'संसाधन',
  fContact: 'आपातकालीन संपर्क',
  fAddr: 'अमृतसर, पंजाब',
  disclaimer:
    'जलदृष्टि अमृतसर के लिए एक स्वतंत्र जनहित पोर्टल है, पूरी तरह खुले डेटा से बना। मौसम: Open-Meteo (निःशुल्क API)। मानचित्र: © OpenStreetMap योगदानकर्ता। रडार: RainViewer। चेतावनी स्तर IMD के 24-घंटे वर्षा रंग-कोड पर आधारित हैं। यह कोई आधिकारिक सरकारी सेवा नहीं है और IMD/NDMA/SDMA की सलाह का विकल्प नहीं — आपात में 112 पर कॉल करें।',
  lastUpdated: 'अंतिम अपडेट: {date}',
  builtFor: 'खुले डेटा पर निर्मित · Open-Meteo · OpenStreetMap · RainViewer',
};

const SCALES = [0.9, 1, 1.12, 1.25];

function initialLang(): Lang {
  if (typeof window === 'undefined') return 'en';
  const p = new URLSearchParams(window.location.search).get('lang');
  if (p === 'hi' || p === 'en') return p;
  try {
    const s = window.localStorage.getItem('jaldrishti-lang');
    if (s === 'hi' || s === 'en') return s;
  } catch {
    /* storage blocked */
  }
  return 'en';
}

interface Ui {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: Key, vars?: Record<string, string | number>) => string;
  scaleIdx: number;
  setScaleIdx: (i: number) => void;
  hc: boolean;
  setHc: (v: boolean) => void;
}

const UiCtx = createContext<Ui | null>(null);

export function UiProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(initialLang);
  const [scaleIdx, setScaleIdx] = useState(1);
  const [hc, setHc] = useState(false);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      window.localStorage.setItem('jaldrishti-lang', lang);
    } catch {
      /* storage blocked */
    }
  }, [lang]);
  useEffect(() => {
    document.documentElement.style.fontSize = `${16 * SCALES[scaleIdx]}px`;
  }, [scaleIdx]);
  useEffect(() => {
    document.documentElement.toggleAttribute('data-hc', hc);
  }, [hc]);

  const value = useMemo<Ui>(
    () => ({
      lang,
      setLang,
      t: (k, vars) => {
        let s = (lang === 'hi' ? hi[k] : en[k]) ?? k;
        if (vars) {
          for (const [key, v] of Object.entries(vars)) s = s.replaceAll(`{${key}}`, String(v));
        }
        return s;
      },
      scaleIdx,
      setScaleIdx,
      hc,
      setHc,
    }),
    [lang, scaleIdx, hc],
  );

  return <UiCtx.Provider value={value}>{children}</UiCtx.Provider>;
}

export function useUi(): Ui {
  const ctx = useContext(UiCtx);
  if (!ctx) throw new Error('useUi outside provider');
  return ctx;
}

export const NAV_KEYS = ['navHome', 'navMap', 'navCircles', 'navAlerts', 'navData', 'navAbout'] as const;
