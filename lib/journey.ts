import type { L } from "./i18n";

export type Stage = {
  id: string;
  lat: number;
  lon: number;
  place: L;
  title: L;
  text: L;
  year: L;
  /** index of the army's current node along the northern march (0..4) */
  marchNode: number;
  /** show the army/Kandula token */
  army: boolean;
  kind: "origin" | "base" | "exile" | "battle" | "siege" | "capital";
};

/* Coordinates are approximate. Many sites named in the Mahavamsa
   (Ambatthakola, Vijithapura, Kulanganiya Pitti) have debated identifications. */
export const STAGES: Stage[] = [
  {
    id: "kalyani",
    lat: 6.9553, lon: 79.922,
    place: { en: "Kalyani (Kelaniya)", si: "කැලණිය" },
    title: { en: "The golden boat", si: "රන් බෝට්ටුව" },
    text: {
      en: "On the west coast, King Kelanitissa offends a monk and the sea floods the land. His daughter, Viharamahadevi, is set adrift in a golden boat to calm the waves.",
      si: "බටහිර වෙරළේ, කැලණිතිස්ස රජු භික්ෂුවකට අපරාධයක් කිරීමෙන් මුහුද රට යට කරයි. එය සන්සුන් කිරීමට ඔහුගේ දියණිය විහාරමහාදේවි රන් බෝට්ටුවක තබා මුහුදට යවනු ලැබේ.",
    },
    year: { en: "Prologue", si: "ප්‍රස්තාවනාව" },
    marchNode: 0, army: false, kind: "origin",
  },
  {
    id: "magama",
    lat: 6.2833, lon: 81.2889,
    place: { en: "Magama, Ruhuna", si: "මාගම, රුහුණ" },
    title: { en: "A prince is born", si: "කුමාරයෙකු උපදී" },
    text: {
      en: "The boat lands in the south. Viharamahadevi marries Kavan Tissa, and in Magama she bears Gamani Abhaya — with the tusker Kandula at his side.",
      si: "බෝට්ටුව දකුණට ළඟා වේ. විහාරමහාදේවි කාවන්තිස්ස රජු සමඟ විවාහ වී, මාගමේදී ගැමුණු අභය කුමරු බිහි කරයි — කණ්ඩුල ඇතා ඔහු සමඟය.",
    },
    year: { en: "c. 177 BCE", si: "ක්‍රි.පූ. 177 පමණ" },
    marchNode: 0, army: true, kind: "base",
  },
  {
    id: "malaya",
    lat: 7.0, lon: 80.62,
    place: { en: "Malaya hill country", si: "මලය රට" },
    title: { en: "Exile in the hills", si: "කඳුකරයේ සැඟවීම" },
    text: {
      en: "After sending his father a woman's ornament, the furious prince is threatened with death and flees into the misty central highlands.",
      si: "පියාට කාන්තා ආභරණයක් එවූ කුමරුට මරණ තර්ජන එල්ල වූ විට, ඔහු මීදුමෙන් වැසුණු මධ්‍යම කඳුකරයට පලා යයි.",
    },
    year: { en: "c. 170 BCE", si: "ක්‍රි.පූ. 170 පමණ" },
    marchNode: 0, army: false, kind: "exile",
  },
  {
    id: "kulanganiya",
    lat: 6.55, lon: 80.98,
    place: { en: "Southern battlefields (Kulanganiya Pitti)", si: "දකුණු සටන් බිම (කුලංගනිය පිට්ටිය)" },
    title: { en: "Brother against brother", si: "සහෝදරයාට විරුද්ධ සහෝදරයා" },
    text: {
      en: "With Kavan Tissa dead, Gamani marches south and fights Prince Tissa — losing the first battle, winning the second. Their mother and the monks bring peace.",
      si: "කාවන්තිස්ස රජුගේ අභාවයෙන් පසු ගැමුණු දකුණට පැමිණ තිස්ස කුමරු සමඟ සටන් කරයි — පළමු සටන පරාජයි, දෙවන සටන ජයයි. මව සහ භික්ෂූන් සාමය ගෙන එති.",
    },
    year: { en: "c. 164 BCE", si: "ක්‍රි.පූ. 164 පමණ" },
    marchNode: 0, army: true, kind: "battle",
  },
  {
    id: "mahiyangana",
    lat: 7.3333, lon: 80.9833,
    place: { en: "Mahiyangana", si: "මහියංගනය" },
    title: { en: "Crossing the Mahaweli", si: "මහවැලිය තරණය" },
    text: {
      en: "The Ten Giants join the host. Crossing the Mahaweli, Dutugemunu storms the first of Elara's fortresses on the road north.",
      si: "දස මහා යෝධයෝ සේනාවට එක් වෙති. මහවැලිය තරණය කරමින් දුටුගැමුණු උතුරු මාර්ගයේ එළාරගේ පළමු බලකොටු වලට පහර දෙයි.",
    },
    year: { en: "c. 163 BCE", si: "ක්‍රි.පූ. 163 පමණ" },
    marchNode: 1, army: true, kind: "battle",
  },
  {
    id: "ambatthakola",
    lat: 7.86, lon: 80.67,
    place: { en: "Ambatthakola (approx.)", si: "අම්බට්ඨකොල (ආසන්න)" },
    title: { en: "Fortress after fortress", si: "බලකොටුවෙන් බලකොටුවට" },
    text: {
      en: "Twenty-odd Tamil strongholds fall in turn. The army pushes deep into the dry zone, Nandimitra and Mahasona always at the front.",
      si: "දෙමළ බලකොටු විස්සක් පමණ එකිනෙක බිඳ වැටේ. නන්දිමිත්‍ර සහ මහාසෝණ සැමවිටම ඉදිරියෙන් සිටිමින් සේනාව වියළි කලාපයට ඇතුළු වේ.",
    },
    year: { en: "c. 162 BCE", si: "ක්‍රි.පූ. 162 පමණ" },
    marchNode: 2, army: true, kind: "battle",
  },
  {
    id: "vijithapura",
    lat: 8.1, lon: 80.52,
    place: { en: "Vijithapura (approx.)", si: "විජිතපුරය (ආසන්න)" },
    title: { en: "The great siege", si: "මහා වටලෑම" },
    text: {
      en: "The mightiest fortress before the capital. Iron-plated gates, deep moats — and Nandimitra at the door. After four months the walls fall and the road to Anuradhapura opens.",
      si: "අගනුවරට පෙර තිබූ බලවත්ම බලකොටුවයි. යකඩ දොරටු, ගැඹුරු දිය අගල් — දොරටුව අසල නන්දිමිත්‍රය. මාස හතරකට පසු ප්‍රාකාර බිඳ වැටී අනුරාධපුරයට මග විවර වේ.",
    },
    year: { en: "c. 161 BCE", si: "ක්‍රි.පූ. 161 පමණ" },
    marchNode: 3, army: true, kind: "siege",
  },
  {
    id: "anuradhapura",
    lat: 8.3114, lon: 80.4037,
    place: { en: "Anuradhapura", si: "අනුරාධපුරය" },
    title: { en: "Duel of kings", si: "රජුන් දෙදෙනාගේ ද්වන්ද සටන" },
    text: {
      en: "At the southern gate the aged Elara rides out on his elephant. Dutugemunu, on Kandula, meets him — and the spear flies. Elara falls, and the island is one.",
      si: "දකුණු දොරටුවෙන් වයෝවෘද්ධ එළාර රජු ඇතු පිටින් පිටතට පැමිණේ. කණ්ඩුල පිට සිටි දුටුගැමුණු ඔහු හමුවෙයි — හෙල්ලය පියාසර කරයි. එළාර වැටෙයි, දිවයින එක් වෙයි.",
    },
    year: { en: "161 BCE", si: "ක්‍රි.පූ. 161" },
    marchNode: 4, army: true, kind: "capital",
  },
  {
    id: "monuments",
    lat: 8.3114, lon: 80.4037,
    place: { en: "Anuradhapura — the sacred city", si: "අනුරාධපුරය — පූජනීය නගරය" },
    title: { en: "The king becomes a builder", si: "රජු ගොඩනැගීමේ රජෙකු වෙයි" },
    text: {
      en: "Mirisavetiya, the Brazen Palace and finally the Ruwanwelisaya rise from the plain. Elara's tomb is honoured, and a united island begins its golden age.",
      si: "මිරිසවැටිය, ලෝවාමහාපාය සහ අවසානයේ රුවන්වැලිසෑය තැනින් ඉහළට නැගේ. එළාරගේ සොහොන ගෞරවයට පත් වන අතර, එක්සත් දිවයින රන්වන් යුගයකට පිවිසේ.",
    },
    year: { en: "160 – 137 BCE", si: "ක්‍රි.පූ. 160 – 137" },
    marchNode: 4, army: false, kind: "capital",
  },
];

/** the nodes (stage indices) the army physically marches through */
export const MARCH_STAGE_IDS = ["magama", "mahiyangana", "ambatthakola", "vijithapura", "anuradhapura"];

/* Equirectangular-ish projection, centred on the island.  1° ≈ UNIT units. */
export const UNIT = 6;
export const CENTER = { lon: 80.78, lat: 7.88 };
export const project = (lon: number, lat: number): [number, number] => [
  (lon - CENTER.lon) * UNIT * 0.99,
  -(lat - CENTER.lat) * UNIT,
];
