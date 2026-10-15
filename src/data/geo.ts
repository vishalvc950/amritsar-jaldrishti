/* Verified geography for the Amritsar flood map.
   - Point coordinates geocoded with OpenStreetMap Nominatim (Oct 2026), each
     result matched to a real OSM feature inside Amritsar city/tahsil.
   - Waterway geometries exported from the OpenStreetMap Overpass API.
   © OpenStreetMap contributors (ODbL). https://www.openstreetmap.org/copyright */

export interface Hotspot {
  id: string;
  name: string;
  nameHi: string;
  lat: number;
  lon: number;
}

export interface Landmark {
  id: string;
  name: string;
  nameHi: string;
  lat: number;
  lon: number;
}

export interface Waterway {
  id: string;
  /** OSM name tag, null when the way carries no name in OSM. */
  name: string | null;
  kind: 'canal' | 'drain';
  path: [number, number][];
}

export const CITY = { lat: 31.634, lon: 74.872 };

export const HOTSPOTS: Hotspot[] = [
  { id: 'maqbool', name: 'Maqbool Road, Joshi Nagar', nameHi: 'मकबूल रोड, जोशी नगर', lat: 31.6419317, lon: 74.8671983 },
  { id: 'gandhi', name: 'Gandhi Bazaar (Gandhi Gate)', nameHi: 'गांधी बाज़ार (गांधी गेट)', lat: 31.6312551, lon: 74.8744429 },
  { id: 'krishna', name: 'Krishna Nagar, Golden Avenue', nameHi: 'कृष्णा नगर, गोल्डन एवेन्यू', lat: 31.6330802, lon: 74.8953702 },
  { id: 'chheharta', name: 'Chheharta', nameHi: 'छेहरटा', lat: 31.6222109, lon: 74.7947718 },
  { id: 'bhagtan', name: 'Bhagtanwala', nameHi: 'भगतानवाला', lat: 31.6089352, lon: 74.8643374 },
  { id: 'gndu', name: 'GNDU Campus', nameHi: 'जीएनडीयू परिसर', lat: 31.6393173, lon: 74.8227292 },
  { id: 'gumtala', name: 'Gumtala', nameHi: 'गुमटला', lat: 31.6646141, lon: 74.8540592 },
  { id: 'airport', name: 'Airport Road, Cantonment', nameHi: 'एयरपोर्ट रोड, छावनी', lat: 31.6525095, lon: 74.8521419 },
  { id: 'majitha', name: 'Majitha Road, Naushahra', nameHi: 'मजीठा रोड, नौशहरा', lat: 31.6723476, lon: 74.8947781 },
  { id: 'verka', name: 'Verka', nameHi: 'वेरका', lat: 31.6641033, lon: 74.9350828 },
];

export const LANDMARKS: Landmark[] = [
  { id: 'temple', name: 'Shri Harmandir Sahib', nameHi: 'श्री हरमंदिर साहिब', lat: 31.6199787, lon: 74.8765281 },
  { id: 'station', name: 'Amritsar Junction', nameHi: 'अमृतसर जंक्शन', lat: 31.6332129, lon: 74.8671432 },
  { id: 'gmch', name: 'Government Medical College', nameHi: 'सरकारी मेडिकल कॉलेज', lat: 31.6547978, lon: 74.884761 },
];

export const WATERWAYS: Waterway[] = [
  {
    id: 'ubdc',
    name: 'Upper Bari Doab Canal',
    kind: 'canal',
    path: [
      [31.70486, 75.00267], [31.69131, 74.98723], [31.6873, 74.98334], [31.68191, 74.97898],
      [31.66886, 74.97], [31.66879, 74.96996], [31.6443, 74.9531], [31.64074, 74.95033],
      [31.63721, 74.94726], [31.63369, 74.94378], [31.63, 74.9396], [31.62487, 74.93268],
      [31.6197, 74.92403], [31.59503, 74.88314], [31.5949, 74.88292], [31.58759, 74.87085],
      [31.58019, 74.85855], [31.57791, 74.85473], [31.56361, 74.83115], [31.5592, 74.82433],
      [31.55367, 74.81481], [31.54771, 74.80519], [31.54405, 74.79881], [31.53637, 74.78612],
      [31.53561, 74.78487], [31.52188, 74.7622], [31.51918, 74.75799], [31.51655, 74.75412],
      [31.50341, 74.73757], [31.48462, 74.71487],
    ],
  },
  {
    id: 'c-north',
    name: null,
    kind: 'canal',
    path: [
      [31.68305, 74.92861], [31.68287, 74.92832], [31.68279, 74.92823], [31.6826, 74.92806],
      [31.6821, 74.92762], [31.68129, 74.92698], [31.67762, 74.92393], [31.67482, 74.92198],
      [31.67409, 74.92076], [31.67294, 74.91898], [31.67095, 74.91689], [31.67033, 74.91638],
      [31.67015, 74.91621], [31.67015, 74.91599], [31.6704, 74.91535], [31.6713, 74.91342],
      [31.67237, 74.91046], [31.67391, 74.9084], [31.674, 74.9083], [31.67424, 74.90805],
      [31.67424, 74.90775], [31.6742, 74.90732], [31.67378, 74.90576], [31.67256, 74.90475],
      [31.6723, 74.90445], [31.67222, 74.90415], [31.67222, 74.90371],
    ],
  },
  {
    id: 'c-west',
    name: null,
    kind: 'canal',
    path: [
      [31.63805, 74.77639], [31.644, 74.77916], [31.64816, 74.78109], [31.65159, 74.78267],
      [31.65222, 74.78296], [31.65951, 74.78634], [31.66833, 74.79051], [31.6794, 74.79575],
      [31.67978, 74.79611], [31.68076, 74.79715], [31.68553, 74.80202], [31.68615, 74.80262],
    ],
  },
  {
    id: 'd-north',
    name: null,
    kind: 'drain',
    path: [
      [31.68626, 74.831], [31.68639, 74.83034], [31.68727, 74.82613], [31.68745, 74.82524],
      [31.68743, 74.82454], [31.68727, 74.82389], [31.6869, 74.8231], [31.68672, 74.82285],
      [31.68621, 74.82233], [31.68545, 74.82185], [31.68249, 74.81981], [31.68186, 74.81944],
      [31.67748, 74.81647], [31.67361, 74.81388],
    ],
  },
  {
    id: 'd-south',
    name: null,
    kind: 'drain',
    path: [
      [31.61224, 74.8575], [31.61201, 74.85659], [31.61103, 74.85004], [31.61092, 74.84924],
      [31.61076, 74.84816], [31.60925, 74.83803], [31.60772, 74.82817], [31.60647, 74.81982],
      [31.60524, 74.81129], [31.60404, 74.80414], [31.60308, 74.79741], [31.60232, 74.79306],
      [31.60121, 74.78537], [31.60057, 74.78103], [31.59899, 74.77087], [31.59755, 74.76165],
      [31.59686, 74.75703], [31.59584, 74.75003], [31.59436, 74.74057], [31.59318, 74.73271],
      [31.59165, 74.72275], [31.59126, 74.72038], [31.58932, 74.7073], [31.5881, 74.69971],
      [31.58794, 74.69865], [31.58708, 74.69283],
    ],
  },
];
