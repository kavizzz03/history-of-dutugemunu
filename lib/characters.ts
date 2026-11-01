import type { L } from "./i18n";

export type Group = "royal" | "giant" | "foe" | "companion";

export type AvatarCfg = {
  skin: string;
  hair: string;
  outfit: string;
  accent: string;
  bg: [string, string];
  head: "crown" | "helmet" | "topknot" | "headdress" | "turban" | "bald" | "royalturban";
  beard?: "full" | "short" | "mustache" | "none";
  weapon?: "spear" | "bow" | "sword" | "mace" | "club" | "shield" | "none";
  build?: number; // shoulder width multiplier, 1 = normal
  female?: boolean;
  monkSoon?: boolean;
  age?: "young" | "mid" | "old";
  scar?: boolean;
};

export type Character = {
  id: string;
  group: Group;
  name: L;
  title: L;
  short: L;
  long: L;
  stats: { strength: number; speed: number; skill: number; loyalty: number };
  avatar: AvatarCfg;
};

export const GROUPS: { id: Group | "all"; label: L }[] = [
  { id: "all", label: { en: "All", si: "සියල්ල" } },
  { id: "royal", label: { en: "Royal House", si: "රාජ පරපුර" } },
  { id: "giant", label: { en: "Ten Giants", si: "දස මහා යෝධයෝ" } },
  { id: "foe", label: { en: "The Opposition", si: "ප්‍රතිවාදීහු" } },
  { id: "companion", label: { en: "Royal Companion", si: "රාජකීය සහචරයා" } },
];

export const STAT_LABELS: Record<keyof Character["stats"], L> = {
  strength: { en: "Strength", si: "බලය" },
  speed: { en: "Speed", si: "වේගය" },
  skill: { en: "Battle skill", si: "යුධ ශිල්පය" },
  loyalty: { en: "Loyalty", si: "භක්තිය" },
};

export const CHARACTERS: Character[] = [
  /* ───────────── ROYAL HOUSE ───────────── */
  {
    id: "dutugemunu",
    group: "royal",
    name: { en: "King Dutugemunu", si: "දුටුගැමුණු රජතුමා" },
    title: { en: "Dutthagamani Abhaya · King of Anuradhapura", si: "දුට්ඨගාමණී අභය · අනුරාධපුර රජ" },
    short: {
      en: "The impetuous prince of Ruhuna who united the whole island in 161 BCE.",
      si: "ක්‍රි.පූ. 161දී මුළු දිවයිනම එක්සත් කළ රුහුණේ නොඉවසිලිවන්ත කුමාරයා.",
    },
    long: {
      en: "Born in Ruhuna to Kavan Tissa and Viharamahadevi, Gamani grew impatient with his father's cautious peace with King Elara. Nicknamed Dutugemunu — 'the disobedient' — he later reconciled with his brother, raised a great army, and in 161 BCE ended Elara's rule in single combat. Heavy with remorse for the lives lost, he spent the rest of his reign raising stupas and monasteries.",
      si: "රුහුණේ කාවන්තිස්ස රජුටත් විහාරමහාදේවියටත් දාව උපන් ගැමුණු කුමරු, එළාර රජු සමඟ පියාණන් දැක්වූ සාම ප්‍රතිපත්තියට නොඉවසිලිවන්ත විය. 'දුටුගැමුණු' නම ලැබූ ඔහු සහෝදරයා සමඟ සමගි වී, මහා සේනාවක් රැස්කර, ක්‍රි.පූ. 161දී එළාර රජු සමඟ ඒකපුද්ගල සටනින් ජය ලැබීය. සටනෙහි විනාශ වූ ජීවිත ගැන පසුතැවුණු ඔහු, ඉතිරි රාජ්‍ය සමය ස්තූප හා විහාර තැනීමට කැප කළේය.",
    },
    stats: { strength: 92, speed: 78, skill: 95, loyalty: 100 },
    avatar: {
      skin: "#b9764a", hair: "#1c1410", outfit: "#8f1d1d", accent: "#f0b429",
      bg: ["#7a1f1f", "#2a0e0e"], head: "crown", beard: "mustache", weapon: "spear", build: 1.1, age: "mid",
    },
  },
  {
    id: "kavan-tissa",
    group: "royal",
    name: { en: "King Kavan Tissa", si: "කාවන්තිස්ස රජතුමා" },
    title: { en: "King of Ruhuna · Father of Dutugemunu", si: "රුහුණේ රජ · දුටුගැමුණුගේ පියා" },
    short: {
      en: "The cautious ruler of Magama who kept the south free and Buddhist.",
      si: "දකුණු රාජධානිය නිදහසින් හා බුද්ධාගමට ගරු කරමින් රැකගත් මාගමේ ප්‍රඥාවන්ත රජු.",
    },
    long: {
      en: "From his capital at Magama, Kavan Tissa kept the southern kingdom of Ruhuna independent while Elara ruled in the north. He preferred patience to bloodshed, making him the opposite of his fiery son — yet it was his careful building of Ruhuna's strength that later made the unification possible.",
      si: "මාගම අගනුවර සිට කාවන්තිස්ස රජු, උතුරේ එළාර රජ කල රුහුණු රාජධානිය ස්වාධීනව පාලනය කළේය. ඔහු ලේ වැගිරීමට වඩා ඉවසීමට කැමති විය; එය ගිනි බඳු පුතුගේ ස්වභාවයට හාත්පසින්ම වෙනස් විය. එහෙත් ඔහු රුහුණේ බලය ප්‍රවේශමෙන් ගොඩනැගීමම පසුව එක්සත් කිරීමට පාර කැපීය.",
    },
    stats: { strength: 70, speed: 55, skill: 80, loyalty: 95 },
    avatar: {
      skin: "#a96a42", hair: "#6b6b6b", outfit: "#1f4e5f", accent: "#e2a93b",
      bg: ["#1f4e5f", "#0b1e26"], head: "royalturban", beard: "full", weapon: "sword", build: 1, age: "old",
    },
  },
  {
    id: "viharamahadevi",
    group: "royal",
    name: { en: "Queen Viharamahadevi", si: "විහාරමහාදේවි බිසව" },
    title: { en: "Princess of Kalyani · Mother of the King", si: "කැලණි කුමරිය · රජුගේ මව" },
    short: {
      en: "The golden-boat princess whose courage shaped two princes.",
      si: "රන් බෝට්ටුවෙන් ආ කුමරිය — කුමාරවරුන් දෙදෙනාම හැඩගැස්වූ ධෛර්ය සම්පන්න මව.",
    },
    long: {
      en: "Daughter of King Kelanitissa of Kalyani, she was — in the chronicle's telling — set adrift in a golden boat to calm the sea, and came ashore safely in Ruhuna where Kavan Tissa married her. During her pregnancy she craved to drink the water that washed a sword which had beheaded a Tamil commander, a sign the soothsayers read as the birth of a unifier. Years later she stepped between her two sons and ended their civil war.",
      si: "කැලණිතිස්ස රජුගේ දියණිය වූ ඇය, වංශකතාවට අනුව මුහුද සන්සිඳුවීමට රන් බෝට්ටුවක තබා මුහුදට යවනු ලැබූ අතර, රුහුණේ ගොඩබැස කාවන්තිස්ස රජු සමඟ විවාහ විය. ගර්භණී සමයේ දෙමළ සෙනෙවියෙකුගේ හිස සිඳි කඩුවක් සෝදා ගත් දිය පානය කිරීමේ දොළදුක ඇති වූ අතර, එය දිවයින එක්සත් කරන පුතෙකුගේ පෙර නිමිත්තක් ලෙස නිමිති කියන්නෝ කීහ. පසුව ඇය පුතුන් දෙදෙනා අතර සිට සහෝදර යුද්ධය නිමා කළාය.",
    },
    stats: { strength: 55, speed: 60, skill: 70, loyalty: 100 },
    avatar: {
      skin: "#c08457", hair: "#14100d", outfit: "#a63a6b", accent: "#f2c14e",
      bg: ["#7b2f5a", "#240d1b"], head: "headdress", beard: "none", weapon: "none", female: true, age: "mid",
    },
  },
  {
    id: "tissa",
    group: "royal",
    name: { en: "Prince Tissa (Saddhatissa)", si: "තිස්ස කුමරු (සද්ධාතිස්ස)" },
    title: { en: "Younger brother · Later King", si: "බාල සහෝදරයා · පසුකාලීන රජ" },
    short: {
      en: "The rival-turned-commander who finished the Ruwanwelisaya.",
      si: "ප්‍රතිවාදියාගෙන් සේනාපතියා බවට පත් වූ, රුවන්වැලිසෑය නිම කළ සහෝදරයා.",
    },
    long: {
      en: "After Kavan Tissa's death, Tissa took the royal elephant and their mother, and the brothers fought bitterly. Their mother and the Sangha reconciled them, and Tissa became Dutugemunu's chief commander. When Dutugemunu died, he ruled as King Saddhatissa and completed the pinnacle of the Great Stupa.",
      si: "කාවන්තිස්ස රජුගේ අභාවයෙන් පසු තිස්ස කුමරු රාජකීය ඇතා හා මව ගෙන ගිය අතර සහෝදරයෝ දෙදෙනා දරුණු ලෙස සටන් කළහ. මව හා සංඝයා මැදිහත් වී ඔවුන් සමගි කළ අතර, තිස්ස කුමරු දුටුගැමුණුගේ ප්‍රධාන සේනාපතියා විය. දුටුගැමුණුගේ අභාවයෙන් පසු සද්ධාතිස්ස නමින් රජ වී මහා ථූපයේ කොත් කැරැල්ල නිම කළේය.",
    },
    stats: { strength: 82, speed: 76, skill: 85, loyalty: 90 },
    avatar: {
      skin: "#b27249", hair: "#1c1410", outfit: "#2d5a3d", accent: "#e8b84a",
      bg: ["#2d5a3d", "#0d1f15"], head: "helmet", beard: "short", weapon: "sword", build: 1.05, age: "young",
    },
  },

  /* ───────────── COMPANION ───────────── */
  {
    id: "kandula",
    group: "companion",
    name: { en: "Kandula, the War Elephant", si: "කණ්ඩුල ඇතා" },
    title: { en: "Royal mount of Dutugemunu", si: "දුටුගැමුණුගේ රාජකීය වාහනය" },
    short: {
      en: "The legendary tusker who carried the king into battle.",
      si: "රජතුමා යුද්ධයට රැගෙන ගිය ජනප්‍රවාදගත මහා දළ ඇතා.",
    },
    long: {
      en: "Tradition says a noble tusker calf appeared around the time of Gamani's birth and grew up beside him as his royal mount, Kandula. Its fate was tied to the brothers' quarrel, and in the northern war it bore the king through the siege of Anuradhapura and into the duel with Elara.",
      si: "ගැමුණු කුමරුගේ උපත වටා කාලයේ උතුම් දළ ඇත් පැටවෙකු පහළ වූ බවත්, ඔහු සමඟම හැදී වැඩුණු එය කණ්ඩුල නමින් රාජකීය වාහනය වූ බවත් ජනශ්‍රැතියේ සඳහන් වේ. සහෝදර ගැටුමේදීද කණ්ඩුල වැදගත් විය; උතුරු යුද්ධයේදී අනුරාධපුර වටලෑමෙන් එළාර සමඟ ද්වන්ද සටන දක්වාම එය රජුව රැගෙන ගියේය.",
    },
    stats: { strength: 100, speed: 60, skill: 88, loyalty: 100 },
    avatar: {
      skin: "#8a8a92", hair: "#000", outfit: "#a02525", accent: "#f0b429",
      bg: ["#3b3b52", "#12121d"], head: "bald",
    },
  },

  /* ───────────── TEN GIANTS ───────────── */
  {
    id: "nandimitra",
    group: "giant",
    name: { en: "Nandimitra", si: "නන්දිමිත්‍ර" },
    title: { en: "Giant 1 · Vanguard Breaker", si: "යෝධයා 1 · පෙරටු බිඳින්නා" },
    short: {
      en: "Strength of ten elephants; shatterer of Vijithapura's gates.",
      si: "ඇතුන් දසදෙනෙකුගේ බලය ඇති, විජිතපුර දොරටු බිඳ හෙළූ වීරයා.",
    },
    long: {
      en: "Raised by his uncle Mitta, Nandimitra had the strength of ten elephants even in youth. Seeing foreign garrisons in Anuradhapura, his patriotism ignited and he joined Gamani. As vanguard commander he is remembered, by tradition, for charging the iron-plated gates of Vijithapura.",
      si: "මාමා වූ මිත්ත විසින් හදා වඩාගත් නන්දිමිත්‍ර, කුඩා කල සිටම ඇතුන් දසදෙනෙකුගේ බලය දැරීය. අනුරාධපුරයේ විදේශ බලකොටු දුටු ඔහුගේ රට ගැන ආදරය ඇවිළී ගැමුණු කුමරු හා එක් විය. පෙරටු සේනාධිපති වූ ඔහු, ජනශ්‍රැතියට අනුව විජිතපුරයේ යකඩ දොරටු කඩා බිඳ හෙළීම නිසා සිහිපත් කෙරේ.",
    },
    stats: { strength: 98, speed: 70, skill: 82, loyalty: 96 },
    avatar: {
      skin: "#a86a42", hair: "#1a120d", outfit: "#7a3a1a", accent: "#d9a441",
      bg: ["#6b3a1a", "#1e1008"], head: "helmet", beard: "short", weapon: "mace", build: 1.35, age: "young",
    },
  },
  {
    id: "suranimala",
    group: "giant",
    name: { en: "Suranimala", si: "සූරනිමල" },
    title: { en: "Giant 2 · The Tireless Guard", si: "යෝධයා 2 · නොසැලෙන ආරක්ෂකයා" },
    short: {
      en: "Immense endurance; stood at the king's side the whole campaign.",
      si: "අසමසම ඉවසීමකින් යුතුව මුළු ව්‍යාපාරයේම රජුගේ ළඟ සිටි වීරයා.",
    },
    long: {
      en: "Born into a noble family, Suranimala was agile and enduring, able to hold off whole companies of enemy soldiers alone. He fought close to Dutugemunu throughout the northern campaign, clearing swarms of infantry in the hardest skirmishes.",
      si: "උසස් පවුලක උපන් සූරනිමල දක්ෂ හා දරාගැනීමේ හැකියාවෙන් යුතු වූ අතර, සතුරු භටයන් රැසක් තනිවම ඇද නවතා ගැනීමට සමත් විය. උතුරු ව්‍යාපාරය පුරාම ඔහු දුටුගැමුණු රජුගේ ආසන්නයේම සටන් කළ අතර, දරුණුම ගැටුම් වලදී සතුරු පාබල බලකායන් විසුරුවා හැරියේය.",
    },
    stats: { strength: 88, speed: 82, skill: 88, loyalty: 98 },
    avatar: {
      skin: "#b27a50", hair: "#16100c", outfit: "#2c4a6b", accent: "#cfd8e3",
      bg: ["#2c4a6b", "#0b1624"], head: "helmet", beard: "mustache", weapon: "shield", build: 1.2, age: "mid",
    },
  },
  {
    id: "mahasona",
    group: "giant",
    name: { en: "Mahasona", si: "මහාසෝණ" },
    title: { en: "Giant 3 · The Mountain", si: "යෝධයා 3 · කඳු සිඛරය" },
    short: {
      en: "Uprooted palms and crushed boulders; led the heavy infantry.",
      si: "තල් ගස් උදුරා ගල් කුඩු කළ, බර පාබල බලකායේ නායකයා.",
    },
    long: {
      en: "Supernaturally strong from childhood, Mahasona could uproot palm trees and crush boulders. In the march on Anuradhapura he led the heavy infantry, hammering through enemy defensive lines.",
      si: "ළමා කාලයේ සිටම අද්භූත බලයක් දැරූ මහාසෝණ, තල් ගස් උදුරා දැමීමටත් ගල් කුඩු කිරීමටත් සමත් විය. අනුරාධපුරය දෙසට ගමන් කරන විට ඔහු බර පාබල බලකායට නායකත්වය දී සතුරු ආරක්ෂක පෙළ බිඳ දැමීය.",
    },
    stats: { strength: 97, speed: 55, skill: 78, loyalty: 94 },
    avatar: {
      skin: "#9d6039", hair: "#120c08", outfit: "#4b3a2a", accent: "#b89b5e",
      bg: ["#4b3a2a", "#150f09"], head: "bald", beard: "full", weapon: "club", build: 1.5, age: "mid",
    },
  },
  {
    id: "gothaimbara",
    group: "giant",
    name: { en: "Gothaimbara", si: "ගෝඨයිම්බර" },
    title: { en: "Giant 4 · The Shield of the Lines", si: "යෝධයා 4 · සේනා පෙළේ පලිහ" },
    short: {
      en: "Swift and tactical; guarded the army's supply lines and flanks.",
      si: "වේගවත් හා උපායශීලී; සේනාවේ සැපයුම් මාර්ග හා පාර්ශ්ව රැකගත් වීරයා.",
    },
    long: {
      en: "Known for his speed, agility and defensive skill, Gothaimbara protected the long supply lines of the marching army and outmaneuvered flanking attacks by Elara's regional commanders.",
      si: "වේගය, චපලතාව හා ආරක්ෂක ශිල්පය නිසා ප්‍රසිද්ධ ගෝඨයිම්බර, ගමන් කළ සේනාවේ දිගු සැපයුම් මාර්ග ආරක්ෂා කළ අතර, එළාරගේ ප්‍රාදේශීය සෙනෙවියන්ගේ පාර්ශ්වික ප්‍රහාර ද නිෂ්ප්‍රභා කළේය.",
    },
    stats: { strength: 85, speed: 92, skill: 86, loyalty: 92 },
    avatar: {
      skin: "#b88257", hair: "#1b130e", outfit: "#44693f", accent: "#d8c27a",
      bg: ["#355a35", "#0e1d0e"], head: "topknot", beard: "none", weapon: "sword", build: 1.1, age: "young",
    },
  },
  {
    id: "theraputtabhaya",
    group: "giant",
    name: { en: "Theraputtabhaya", si: "ථේරපුත්තාභය" },
    title: { en: "Giant 5 · Warrior who became a Monk", si: "යෝධයා 5 · භික්ෂුවක් වූ යෝධයා" },
    short: {
      en: "A chieftain's son who laid down arms for the robe.",
      si: "අවි බිම තබා සිවුරු හැඳගත් ප්‍රධානියෙකුගේ පුත්‍රයා.",
    },
    long: {
      en: "The son of a chieftain, Theraputtabhaya was a fiercely loyal commander of great physical power. After the unification he renounced worldly life and entered the Sangha, and is remembered as having attained arahatship.",
      si: "ප්‍රධානියෙකුගේ පුත්‍රයෙකු වූ ථේරපුත්තාභය මහත් කායික බලයකින් හා දැඩි භක්තියකින් යුතු සේනාධිපතියෙකි. දිවයින එක්සත් වූ පසු ඔහු ගිහි ජීවිතය අත්හැර සංඝයා සමඟ පැවිදි වූ අතර, රහත් බව ලැබූවෙකු ලෙස සිහිපත් කෙරේ.",
    },
    stats: { strength: 90, speed: 75, skill: 84, loyalty: 100 },
    avatar: {
      skin: "#a96e45", hair: "#18110c", outfit: "#d98a1c", accent: "#fff1c7",
      bg: ["#a8661a", "#2b1a07"], head: "bald", beard: "none", weapon: "none", build: 1.15, age: "mid", monkSoon: true,
    },
  },
  {
    id: "bharana",
    group: "giant",
    name: { en: "Bharana", si: "භරණ" },
    title: { en: "Giant 6 · The Fearless", si: "යෝධයා 6 · බිය නොදත් තැනැත්තා" },
    short: {
      en: "Led assault squads through the fortified barricades.",
      si: "බලකොටු බාධක බිඳ දමමින් ප්‍රහාරක කණ්ඩායම් මෙහෙයවූ වීරයා.",
    },
    long: {
      en: "Exceptionally strong and unafraid, Bharana was said to catch wild animals bare-handed. He fought with unmatched aggression in close quarters and led the assault squads that broke fortified enemy barricades.",
      si: "අසාමාන්‍ය බලයක් හා නිර්භීතකමක් ඇති භරණ, වන සතුන් අතින්ම අල්ලා ගත් බව කියවේ. ළඟින් කරන සටන්වලදී ඔහු අසමසම ආක්‍රමණශීලීභාවයක් පෙන්වා, සතුරු බලකොටු බාධක බිඳ දැමූ ප්‍රහාරක කණ්ඩායම් මෙහෙයවීය.",
    },
    stats: { strength: 92, speed: 80, skill: 80, loyalty: 90 },
    avatar: {
      skin: "#ad6c42", hair: "#0f0a07", outfit: "#7d2d2d", accent: "#e1b259",
      bg: ["#7d2d2d", "#210b0b"], head: "topknot", beard: "full", weapon: "club", build: 1.3, age: "mid", scar: true,
    },
  },
  {
    id: "velusumana",
    group: "giant",
    name: { en: "Velusumana", si: "වේළුසුමන" },
    title: { en: "Giant 7 · Rider & Scout", si: "යෝධයා 7 · අශ්වාරෝහකයා හා ඔත්තුකරු" },
    short: {
      en: "A brilliant horseman who scouted Elara's strength before the march.",
      si: "ගමනට පෙර එළාරගේ බලය හඳුනාගත් දක්ෂ අශ්වාරෝහකයා.",
    },
    long: {
      en: "A brilliant horseman and tactician of fearless courage, Velusumana rode deep into enemy territory before the main army advanced, bringing back vital intelligence on Elara's troop movements, fortifications and supply depots.",
      si: "නිර්භීත අශ්වාරෝහකයෙකු හා උපායශීලියෙකු වූ වේළුසුමන, ප්‍රධාන සේනාව ඉදිරියට යාමට පෙර සතුරු ප්‍රදේශයේ ගැඹුරටම ගොස්, එළාරගේ සේනා චලන, බලකොටු හා සැපයුම් ගබඩා පිළිබඳ වැදගත් තොරතුරු රැගෙන ආවේය.",
    },
    stats: { strength: 75, speed: 96, skill: 88, loyalty: 92 },
    avatar: {
      skin: "#b5794d", hair: "#1a120d", outfit: "#2f6f73", accent: "#e8d28c",
      bg: ["#235c60", "#08191b"], head: "turban", beard: "short", weapon: "spear", build: 0.95, age: "young",
    },
  },
  {
    id: "khanjadeva",
    group: "giant",
    name: { en: "Khanjadeva", si: "ඛඤ්ජදේව" },
    title: { en: "Giant 8 · The Lightning", si: "යෝධයා 8 · විදුලි වේගය" },
    short: {
      en: "Eagle-eyed and lightning quick with thrown weapons.",
      si: "උකුස්සෙකු මෙන් තියුණු ඇස් හා විදුලි වේගයෙන් යුත්, විසි කිරීමේ අවි ශිල්පියා.",
    },
    long: {
      en: "Renowned for keen eyesight, lightning reflexes and skill with throwing weapons, Khanjadeva gave missile support to the advancing army and brought down enemy commanders trying to rally troops from behind the ramparts.",
      si: "තියුණු ඇස් පෙනීම, විදුලි ප්‍රතික්‍රියා හා විසිකිරීමේ අවි ශිල්පය නිසා ප්‍රසිද්ධ ඛඤ්ජදේව, ඉදිරියට ගමන් කළ සේනාවට ප්‍රක්ෂේපිත ආධාර සැපයූ අතර, ප්‍රාකාරවල සැඟව සිට භටයන් එක්රැස් කිරීමට උත්සාහ කළ සතුරු සෙනෙවියන් බිම හෙළීය.",
    },
    stats: { strength: 80, speed: 94, skill: 92, loyalty: 90 },
    avatar: {
      skin: "#b27b52", hair: "#17100b", outfit: "#5b3f78", accent: "#e6c36a",
      bg: ["#4b3366", "#150d1e"], head: "turban", beard: "mustache", weapon: "spear", build: 1, age: "young",
    },
  },
  {
    id: "phussadeva",
    group: "giant",
    name: { en: "Phussadeva", si: "ඵුස්සදේව" },
    title: { en: "Giant 9 · Master Archer", si: "යෝධයා 9 · ප්‍රධාන දුනුවායා" },
    short: {
      en: "Arrows that pierced shields — and the one that felled King Bhalluka.",
      si: "පලිහ විනිවිද යන ඊතල — භල්ලුක රජු බිම හෙළූ ඊතලයද ඔහුගේමය.",
    },
    long: {
      en: "The army's master archer, Phussadeva's arrows could pierce thick shields and trees, and it was said he could hear an arrow cutting the air. In the final battle it was his shot that struck down the Tamil king Bhalluka, sealing the victory.",
      si: "සේනාවේ ප්‍රධාන දුනුවායා වූ ඵුස්සදේවගේ ඊතල ඝන පලිහ හා ගස් පවා විනිවිද ගියේය; ඊතලයක් වාතය කපන හඬ ඔහුට ඇසුණු බව කියවේ. අවසන් සටනේදී දෙමළ රජු වූ භල්ලුකට වැදී ඔහු බිම හෙළූ ඊතලය ඔහුගේමය; එය ජයග්‍රහණය තහවුරු කළේය.",
    },
    stats: { strength: 72, speed: 85, skill: 100, loyalty: 92 },
    avatar: {
      skin: "#b37a4f", hair: "#16100b", outfit: "#3f5f3a", accent: "#d9c27d",
      bg: ["#3f5f3a", "#0f1a0d"], head: "topknot", beard: "none", weapon: "bow", build: 0.95, age: "young",
    },
  },
  {
    id: "labhiyavasabha",
    group: "giant",
    name: { en: "Labhiyavasabha", si: "ලභියවසභ" },
    title: { en: "Giant 10 · The Steadfast Flank", si: "යෝධයා 10 · නොසැලෙන පාර්ශ්වය" },
    short: {
      en: "Unyielding stamina; held the flanks against counter-attacks.",
      si: "නොසැලෙන ශක්තියකින් සේනා පාර්ශ්ව රැකගත්, ප්‍රති-ප්‍රහාර වළක්වාගත් වීරයා.",
    },
    long: {
      en: "The tenth giant in the Mahavamsa's list, Labhiyavasabha was a resilient senior commander who held key flanks and defensive ground against counter-attacks. (Some modern retellings name this tenth hero 'Lohitadeva'.)",
      si: "මහාවංසයේ සඳහන් දසවන යෝධයා වූ ලභියවසභ, නොසැලෙන ශක්තියෙන් යුතු ජ්‍යෙෂ්ඨ සේනාධිපතියෙකු ලෙස ප්‍රධාන පාර්ශ්ව හා ආරක්ෂක ස්ථාන රැකගනිමින් ප්‍රති-ප්‍රහාර වළක්වාගත්තේය. (සමහර නූතන ප්‍රකාශනවල මෙම දසවන වීරයා 'ලෝහිතදේව' ලෙසද හඳුන්වයි.)",
    },
    stats: { strength: 88, speed: 70, skill: 84, loyalty: 95 },
    avatar: {
      skin: "#a66a42", hair: "#15100c", outfit: "#6b4a2a", accent: "#e0b45a",
      bg: ["#5e4426", "#1a1209"], head: "helmet", beard: "full", weapon: "shield", build: 1.25, age: "mid",
    },
  },

  /* ───────────── OPPOSITION ───────────── */
  {
    id: "elara",
    group: "foe",
    name: { en: "King Elara", si: "එළාර රජතුමා" },
    title: { en: "Chola ruler of Anuradhapura", si: "අනුරාධපුරය පාලනය කළ චෝළ රජු" },
    short: {
      en: "The just foreign king whom Dutugemunu honoured even in defeat.",
      si: "පරාජයෙන් පසුවත් දුටුගැමුණුගේ ගෞරවයට පාත්‍ර වූ සාධාරණ විදේශ රජු.",
    },
    long: {
      en: "Elara ruled Anuradhapura for around four and a half decades and is praised even by the Mahavamsa for his justice — famously ringing a bell of justice for any subject wronged. He fell to Dutugemunu in single combat at the southern gate, and the victor gave him a royal cremation, raised a monument, and ordered that every passer-by dismount and silence their music before it.",
      si: "එළාර රජු දශක හතරහමාරක පමණ කාලයක් අනුරාධපුරය පාලනය කළ අතර, මහාවංසය පවා ඔහුගේ යුක්තිය අගය කරයි — අසාධාරණයට ලක් වූ ඕනෑම පුද්ගලයෙකුට නාද කළ හැකි විනිශ්චය සීනුවක් එල්ලා තිබූ බව ප්‍රකටය. දකුණු දොරටුව අසල දුටුගැමුණු සමඟ ඒකපුද්ගල සටනේදී ඔහු බිම හෙළුණු අතර, ජයග්‍රාහකයා රාජකීය අවමංගල්‍යයක් පවත්වා, ස්මාරකයක් තනා, එම ස්ථානය පසු කරන සියලු දෙනා ඇතුන් හෝ රථවලින් බැස වාද්‍ය නවත්වා යා යුතු බවට නියෝග කළේය.",
    },
    stats: { strength: 82, speed: 65, skill: 90, loyalty: 88 },
    avatar: {
      skin: "#7a4a2d", hair: "#cfcfcf", outfit: "#1d3557", accent: "#e9c46a",
      bg: ["#1d3557", "#0a1220"], head: "royalturban", beard: "full", weapon: "sword", build: 1.1, age: "old",
    },
  },
  {
    id: "bhalluka",
    group: "foe",
    name: { en: "King Bhalluka", si: "භල්ලුක රජු" },
    title: { en: "Tamil ally of Elara", si: "එළාරගේ දෙමළ සගයා" },
    short: {
      en: "The late-arriving king whose fall ended the war.",
      si: "පසුව පැමිණ, ඔහු බිම හෙළීමෙන් යුද්ධය අවසන් කළ රජු.",
    },
    long: {
      en: "Bhalluka came with his army to reinforce the beleaguered defenders of Anuradhapura. In the closing battle he was struck down by an arrow from Phussadeva, and the city's resistance collapsed.",
      si: "වටලනු ලැබූ අනුරාධපුර ආරක්ෂකයන්ට ශක්තිය දීමට භල්ලුක තම සේනාව සමඟ පැමිණියේය. අවසන් සටනේදී ඵුස්සදේවගේ ඊතලයකින් ඔහු බිම හෙළුණු අතර, නගරයේ ප්‍රතිරෝධය බිඳ වැටුණි.",
    },
    stats: { strength: 78, speed: 70, skill: 80, loyalty: 70 },
    avatar: {
      skin: "#6e4128", hair: "#101010", outfit: "#3d1f4f", accent: "#d4a73a",
      bg: ["#3d1f4f", "#12091a"], head: "helmet", beard: "mustache", weapon: "spear", build: 1.15, age: "mid",
    },
  },
];

export const getCharacter = (id: string) => CHARACTERS.find((c) => c.id === id)!;
