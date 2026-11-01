import type { L } from "./i18n";

/* Mahaweli Ganga — Sri Lanka's longest river. Rises in the central highlands, flows
   past Kandy and Mahiyangana, then north-east to the sea at Koddiyar Bay (Trincomalee).
   Coordinates are simplified waypoints (lon, lat), not a survey. */
export const MAHAWELI: [number, number][] = [
  [80.58, 6.98],
  [80.62, 7.15],
  [80.63, 7.29],
  [80.78, 7.34],
  [80.92, 7.27],
  [80.9833, 7.3333], // Mahiyangana
  [81.04, 7.55],
  [81.06, 7.8],
  [81.1, 7.95],
  [81.16, 8.15],
  [81.21, 8.35],
  [81.24, 8.46],
];

export const RIVER_LABEL = {
  /** where the label floats (lon, lat) */
  at: [81.12, 7.98] as [number, number],
  name: { en: "Mahaweli Ganga", si: "මහවැලි ගඟ" } as L,
  text: {
    en: "Sri Lanka's longest river. Dutugemunu's army crossed it at Mahiyangana on the road north.",
    si: "ශ්‍රී ලංකාවේ දිගම ගඟයි. උතුරට යන මගේදී දුටුගැමුණුගේ සේනාව මහියංගනයේදී එය තරණය කළේය.",
  } as L,
};

export type Place = {
  id: string;
  /** offset from Anuradhapura's centre, in map units (+x east, +z south) */
  off: [number, number];
  kind: "gate" | "tomb" | "stupa" | "tank";
  name: L;
  text: L;
};

/* Sacred-city sites shown when the map is focused on Anuradhapura. The layout is schematic. */
export const PLACES: Place[] = [
  {
    id: "south-gate",
    off: [0, 0.66],
    kind: "gate",
    name: { en: "Southern gate — the duel", si: "දකුණු දොරටුව — ද්වන්ද සටන" },
    text: {
      en: "Where the two kings met in single combat, king against king, elephant against elephant.",
      si: "රජුන් දෙදෙනා ඇතුන් පිට තනි සටනකට මුහුණට මුහුණ ලා හමු වූ ස්ථානය.",
    },
  },
  {
    id: "elara-tomb",
    off: [0.56, -0.34],
    kind: "tomb",
    name: { en: "Elara's tomb", si: "එළාරගේ සොහොන" },
    text: {
      en: "Dutugemunu raised a monument for his fallen rival. For centuries every traveller dismounted and silenced their drums here.",
      si: "දුටුගැමුණු පරාජිත ප්‍රතිවාදියා වෙනුවෙන් ස්මාරකයක් ඉදි කළේය. සියවස් ගණනක් තිස්සේ සියලුම ගමන්කරුවෝ මෙහිදී බැස බෙර නිහඬ කළහ.",
    },
  },
  {
    id: "ruwanwelisaya",
    off: [0, 0],
    kind: "stupa",
    name: { en: "Ruwanwelisaya", si: "රුවන්වැලිසෑය" },
    text: {
      en: "The Great Stupa, the king's crowning work, begun after the war.",
      si: "යුද්ධයෙන් පසු ආරම්භ කළ රජුගේ ශ්‍රේෂ්ඨතම ඉදිකිරීම වන මහා ස්තූපයයි.",
    },
  },
  {
    id: "mirisavetiya",
    off: [-0.38, 0.2],
    kind: "stupa",
    name: { en: "Mirisavetiya", si: "මිරිසවැටිය" },
    text: {
      en: "The first great stupa he raised, as penance, where his relic spear stood fixed in the ground.",
      si: "ඔහුගේ ධාතු හෙල්ලය බිම සවි වී තිබූ තැන, පසුතැවිල්ලක් ලෙස ඔහු ඉදි කළ පළමු මහා ස්තූපයයි.",
    },
  },
  {
    id: "tissa-wewa",
    off: [-0.62, 0.55],
    kind: "tank",
    name: { en: "Tissa Wewa", si: "තිස්ස වැව" },
    text: {
      en: "The great reservoir beside Mirisavetiya, a lifeline of the ancient city.",
      si: "මිරිසවැටිය අසල පිහිටි මහා වැවයි; පුරාණ නගරයේ ජීවනාලියකි.",
    },
  },
];

export const PLACES_UI = {
  title: { en: "Places on the map", si: "සිතියමේ ස්ථාන" } as L,
  river: { en: "Mahaweli river", si: "මහවැලි ගඟ" } as L,
  city: { en: "Around Anuradhapura", si: "අනුරාධපුරය අවට" } as L,
  watch: { en: "Watch the duel ↓", si: "ද්වන්ද සටන නරඹන්න ↓" } as L,
  zoomHint: {
    en: "Select stage 8 to see the sacred-city sites.",
    si: "පූජනීය නගරයේ ස්ථාන බැලීමට අදියර 8 තෝරන්න.",
  } as L,
};
