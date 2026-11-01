import type { Bil } from '@/lib/i18n';

export type LatLon = [number, number]; // [lat, lon]

export type Stop = {
  id: string;
  pos: LatLon;
  /** waypoints between the previous stop and this one */
  path: LatLon[];
  name: Bil;
  place: Bil;
  kind: 'sea' | 'land' | 'fort' | 'capital';
  title: Bil;
  text: Bil;
  /** how many soldiers to show marching at this point (visual only) */
  army: number;
};

/**
 * Locations are traditional / approximate — scholars debate the exact sites of
 * several fortresses named in the Mahavamsa (e.g. Vijithapura), so positions
 * here are for storytelling, not surveying.
 */
export const stops: Stop[] = [
  {
    id: 'kalyani',
    pos: [6.96, 79.92],
    path: [],
    kind: 'sea',
    name: { en: 'Kalyani (Kelaniya)', si: 'කැළණිය' },
    place: { en: 'West coast', si: 'බටහිර වෙරළ' },
    title: { en: 'The golden boat', si: 'රන් බෝට්ටුව' },
    text: {
      en: 'Princess Viharamahadevi is set adrift on the sea in a golden boat, to calm the waves after her father’s sin against a monk.',
      si: 'පියාගේ වරදින් කෝපවූ මුහුද සන්සිඳුවීමට, විහාරමහාදේවී කුමරිය රන් බෝට්ටුවක තබා මුහුදට මුදා හරින ලදී.',
    },
    army: 0,
  },
  {
    id: 'magama',
    pos: [6.28, 81.29],
    path: [
      [6.7, 79.8],
      [6.2, 79.85],
      [5.82, 80.2],
      [5.78, 80.7],
      [5.95, 81.1],
      [6.15, 81.32],
    ],
    kind: 'capital',
    name: { en: 'Magama', si: 'මාගම' },
    place: { en: 'Ruhuna · south-east', si: 'රුහුණ · ගිනිකොන' },
    title: { en: 'Landing and birth', si: 'වෙරළට පැමිණීම සහ උපත' },
    text: {
      en: 'The boat comes ashore in Ruhuna. The princess marries Kavan Tissa and, at Magama, Prince Gamani is born with the tusker Kandula at his side.',
      si: 'බෝට්ටුව රුහුණු වෙරළට පැමිණේ. කුමරිය කාවන්තිස්ස රජු හා විවාහ වන අතර මාගම නුවරදී ගැමුණු කුමරු උපත ලබයි; කණ්ඩුල ඇතා ද ඔහු සමඟ ය.',
    },
    army: 0,
  },
  {
    id: 'malaya',
    pos: [7.0, 80.78],
    path: [
      [6.5, 81.15],
      [6.75, 80.95],
    ],
    kind: 'land',
    name: { en: 'Malaya Rata', si: 'මලය රට' },
    place: { en: 'Central highlands', si: 'මධ්‍යම කඳුකරය' },
    title: { en: 'Exile in the hills', si: 'කඳුකරයේ ප්‍රවාසය' },
    text: {
      en: 'After the quarrel with his father the prince flees into the misty hill country, where he is known as Dutu-Gamani.',
      si: 'පියා සමඟ ඇති වූ කෝලාහලයෙන් පසු කුමරු මීදුමෙන් වැසුණු කඳුකරයට පලා ගොස්, “දුටු ගැමුණු” නමින් හැඳින්විය.',
    },
    army: 0,
  },
  {
    id: 'reunion',
    pos: [6.3, 81.2],
    path: [
      [6.7, 80.95],
      [6.5, 81.1],
    ],
    kind: 'capital',
    name: { en: 'Ruhuna — brothers’ war', si: 'රුහුණ — සහෝදර සටන' },
    place: { en: 'Near Magama', si: 'මාගම අසල' },
    title: { en: 'Brothers reconciled', si: 'සහෝදරයන් සමඟි වීම' },
    text: {
      en: 'With Kavan Tissa dead, Gamani returns to claim his birthright. After one defeat and one victory, Queen Viharamahadevi and the monks make peace between the brothers.',
      si: 'කාවන්තිස්ස රජුගේ අභාවයෙන් පසු ගැමුණු තම උරුමය ඉල්ලා නැවත පැමිණේ. එක් පරාජයකින් හා එක් ජයක් ලැබූ පසු විහාරමහාදේවී බිසව සහ භික්ෂූන් සහෝදරයන් සමඟි කරවයි.',
    },
    army: 40,
  },
  {
    id: 'mahiyangana',
    pos: [7.32, 81.0],
    path: [
      [6.55, 81.3],
      [6.95, 81.2],
    ],
    kind: 'land',
    name: { en: 'Mahiyangana', si: 'මහියංගනය' },
    place: { en: 'Mahaweli valley', si: 'මහවැලි නිම්නය' },
    title: { en: 'The army gathers', si: 'හමුදාව රැස් වේ' },
    text: {
      en: 'The ten giant warriors join the march. Dutugemunu sets a Buddha relic in his spear and the northern campaign begins.',
      si: 'දස මහා යෝධයෝ ගමනට එක්වෙති. ගැමුණු රජු ධාතුවක් හෙලයේ තැන්පත් කර උතුරු ව්‍යාපාරය අරඹයි.',
    },
    army: 90,
  },
  {
    id: 'ambatittha',
    pos: [7.88, 80.92],
    path: [[7.6, 81.0]],
    kind: 'fort',
    name: { en: 'Ambatittha', si: 'අම්බතිත්ථ' },
    place: { en: 'Mahaweli crossing', si: 'මහවැලි තොටුපළ' },
    title: { en: 'Crossing the river', si: 'ගඟ තරණය' },
    text: {
      en: 'The army crosses the Mahaweli and storms the first Tamil strongholds on the road to the capital.',
      si: 'හමුදාව මහවැලි ගඟ තරණය කර අගනුවරට යන මගදී පළමු සතුරු බලකොටු අල්ලා ගනී.',
    },
    army: 120,
  },
  {
    id: 'vijithapura',
    pos: [8.12, 80.68],
    path: [[8.0, 80.8]],
    kind: 'fort',
    name: { en: 'Vijithapura', si: 'විජිතපුරය' },
    place: { en: 'North-central plains', si: 'උතුරු මැද තැනිතලාව' },
    title: { en: 'The great siege', si: 'මහා වැටලීම' },
    text: {
      en: 'The strongest fortress of the north. Nandimitra and Kandula batter down its iron-plated gates, and the city falls.',
      si: 'උතුරේ ප්‍රබලතම බලකොටුව. නන්දිමිත්‍ර සහ කණ්ඩුල යකඩ දොරටු බිඳ දැමූ අතර නගරය පරාජය විය.',
    },
    army: 140,
  },
  {
    id: 'anuradhapura',
    pos: [8.31, 80.4],
    path: [[8.22, 80.52]],
    kind: 'capital',
    name: { en: 'Anuradhapura', si: 'අනුරාධපුරය' },
    place: { en: 'Ancient capital', si: 'පුරාණ අගනුවර' },
    title: { en: 'The duel with Elara', si: 'එළාර සමඟ ද්වන්ද්වය' },
    text: {
      en: 'At the southern gate, Dutugemunu on Kandula faces the aged King Elara in single combat — and wins. The island is one kingdom again.',
      si: 'දකුණු දොරටුව අසලදී කණ්ඩුල ඇතුපිට සිටින ගැමුණු රජු, මහලු එළාර රජු සමඟ ද්වන්ද්ව සටනේ යෙදී ජය ගනී. ලක්දිව නැවතත් එක රාජ්‍යයක් විය.',
    },
    army: 160,
  },
  {
    id: 'monuments',
    pos: [8.345, 80.395],
    path: [],
    kind: 'capital',
    name: { en: 'Anuradhapura — Monuments', si: 'අනුරාධපුරය — සසුන් ගොඩනැඟිලි' },
    place: { en: 'The Sacred City', si: 'පූජනීය නගරය' },
    title: { en: 'The Builder King', si: 'සසුන් ගොඩනැඟූ රජු' },
    text: {
      en: 'Crowned in 161 BCE, the king raises the Mirisavetiya, the nine-storey Lohapasada and the mighty Ruwanwelisaya.',
      si: 'ක්‍රි.පූ. 161දී අභිෂේක ලද රජු මිරිසවැටිය, මහල් නවයක ලෝවාමහාපාය සහ මහා රුවන්වැලිසෑය ඉදි කළේය.',
    },
    army: 160,
  },
];

/** The outline of Sri Lanka as [lat, lon] — a hand-traced approximation used to shape the 3D island. */
export const outline: LatLon[] = [
  [9.82, 80.23], // Point Pedro
  [9.72, 79.95],
  [9.6, 79.9], // Jaffna lagoon
  [9.4, 80.0],
  [9.25, 80.0],
  [9.08, 79.72], // Talaimannar side
  [8.95, 79.9],
  [8.6, 79.95],
  [8.3, 79.72], // Kalpitiya
  [8.05, 79.75],
  [7.6, 79.8], // Chilaw
  [7.2, 79.84], // Negombo
  [6.93, 79.84], // Colombo
  [6.58, 79.95], // Kalutara
  [6.2, 80.05],
  [6.03, 80.22], // Galle
  [5.93, 80.5], // Dondra
  [6.0, 80.85],
  [6.12, 81.1], // Hambantota
  [6.22, 81.35], // Kirinda
  [6.5, 81.62],
  [6.85, 81.84], // Arugam Bay
  [7.3, 81.72],
  [7.72, 81.7], // Batticaloa
  [8.15, 81.4],
  [8.57, 81.24], // Trincomalee
  [8.95, 81.0],
  [9.27, 80.81], // Mullaitivu
  [9.55, 80.4], // Elephant Pass
];

export const BOUNDS = { latMin: 5.75, latMax: 10.0, lonMin: 79.4, lonMax: 82.1 };
