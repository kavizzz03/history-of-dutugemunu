import type { Bil } from '@/lib/i18n';
import type { AvatarSpec } from '@/components/Avatar';

export type Group = 'royal' | 'giant' | 'foe' | 'companion';

export type Character = {
  id: string;
  group: Group;
  name: Bil;
  title: Bil;
  desc: Bil;
  tags: Bil[];
  avatar: AvatarSpec;
  kind?: 'elephant';
};

const SKIN = {
  a: '#b0703f',
  b: '#a56a3f',
  c: '#8f5a35',
  d: '#c48a5a',
  e: '#7b4a2c',
  f: '#d09a6a',
};

export const characters: Character[] = [
  /* ───────────── ROYALS ───────────── */
  {
    id: 'dutugemunu',
    group: 'royal',
    name: { en: 'King Dutugemunu', si: 'දුටුගැමුණු රජ' },
    title: { en: 'The Unifier · King of Anuradhapura', si: 'ලක් රට එක්සේසත් කළ රජ' },
    desc: {
      en: 'Born Prince Gamani Abhaya, eldest son of Kavan Tissa. He defeated King Elara, was crowned in 161 BCE as ruler of a united island, and raised the Ruwanwelisaya.',
      si: 'කාවන්තිස්ස රජුගේ ජ්‍යෙෂ්ඨ පුත් ගැමුණු අභය කුමරු. එළාර රජු පරදවා ක්‍රි.පූ. 161දී එක්සේසත් ලංකාවේ රජු ලෙස අභිෂේක ලැබූ ඔහු රුවන්වැලිසෑය ඇරඹූ සේක.',
    },
    tags: [
      { en: 'Relic spear', si: 'ධාතු හෙලය' },
      { en: 'Rides Kandula', si: 'කණ්ඩුල ඇතා' },
      { en: 'Reign 161–137 BCE', si: 'ක්‍රි.පූ. 161–137' },
    ],
    avatar: {
      skin: SKIN.a, hair: '#17100d', garment: '#7a1730', trim: '#e2b04a', bg: ['#5a1020', '#1a0a0c'],
      hairStyle: 'short', beard: 'short', mustache: 'thick', headwear: 'crown', headColor: '#e2b04a',
      weapon: 'spear', armor: true, necklace: true, earrings: true, brow: 'stern', build: 1.15,
    },
  },
  {
    id: 'viharamahadevi',
    group: 'royal',
    name: { en: 'Queen Viharamahadevi', si: 'විහාරමහාදේවී බිසව' },
    title: { en: 'Mother of the King · Princess of Kalyani', si: 'රජුගේ මාතාව · කැළණි කුමරිය' },
    desc: {
      en: 'Daughter of King Kelanitissa of Kalyani. Set adrift in a golden boat, she came ashore in Ruhuna and married Kavan Tissa. Her wise counsel later reconciled her two sons.',
      si: 'කැළණි රජු වූ කැළණිතිස්සගේ දියණිය. රන් බෝට්ටුවකින් රුහුණු වෙරළට පැමිණ කාවන්තිස්ස රජු හා විවාහ වූවාය. ඇගේ ප්‍රඥාවන්ත අවවාදයෙන් පුතුන් දෙදෙනා සමඟි වූහ.',
    },
    tags: [
      { en: 'Golden boat', si: 'රන් බෝට්ටුව' },
      { en: 'Peacemaker', si: 'සමගිය ගෙන ආ තැනැත්තිය' },
    ],
    avatar: {
      skin: SKIN.d, hair: '#1a100c', garment: '#1f5c4a', trim: '#e2b04a', bg: ['#2d5b52', '#0e1d1a'],
      hairStyle: 'veil', beard: 'none', mustache: 'none', headwear: 'queen', headColor: '#e2b04a',
      weapon: 'none', necklace: true, earrings: true, brow: 'calm', veil: '#f0d9a8', build: 0.95,
    },
  },
  {
    id: 'kavantissa',
    group: 'royal',
    name: { en: 'King Kavan Tissa', si: 'කාවන්තිස්ස රජ' },
    title: { en: 'King of Ruhuna · Father', si: 'රුහුණේ රජ · පියා' },
    desc: {
      en: 'Cautious ruler of the southern kingdom of Ruhuna, ruling from Magama. He chose patience over open war with Elara — a policy his fiery son could not accept.',
      si: 'මාගම නුවර සිට රුහුණු රට පාලනය කළ ප්‍රවේශම්කාරී රජු. එළාර සමඟ විවෘත යුද්ධයකට නොගොස් ඉවසීමෙන් රට රැකගත් ඔහුගේ ප්‍රතිපත්තිය, තරුණ ගැමුණු කුමරුට අනුමත නොවීය.',
    },
    tags: [
      { en: 'Ruler of Ruhuna', si: 'රුහුණු රජ' },
      { en: 'Patient strategist', si: 'ඉවසිලිවන්ත උපායශීලියා' },
    ],
    avatar: {
      skin: SKIN.b, hair: '#cfc8bd', garment: '#2a3a7a', trim: '#e2b04a', bg: ['#2a3a7a', '#0b0f22'],
      hairStyle: 'short', beard: 'long', mustache: 'thick', headwear: 'crown', headColor: '#d9b45a',
      weapon: 'staff', necklace: true, earrings: false, brow: 'calm', build: 1.05,
    },
  },
  {
    id: 'tissa',
    group: 'royal',
    name: { en: 'Prince Tissa (Saddhatissa)', si: 'තිස්ස කුමරු (සද්ධාතිස්ස)' },
    title: { en: 'Younger Brother · Later King', si: 'බාල සහෝදරයා · පසු කාලීන රජ' },
    desc: {
      en: 'After their civil war the brothers reconciled and Tissa became chief commander. He later ruled as King Saddhatissa and completed the Ruwanwelisaya.',
      si: 'සහෝදර සටනෙන් පසු සමඟි වූ තිස්ස කුමරු ප්‍රධාන සේනාපති විය. පසුව සද්ධාතිස්ස නමින් රජ වී රුවන්වැලිසෑය නිම කළේය.',
    },
    tags: [
      { en: 'Chief commander', si: 'ප්‍රධාන සේනාපති' },
      { en: 'Completed the stupa', si: 'ථූපය නිම කළා' },
    ],
    avatar: {
      skin: SKIN.a, hair: '#1b1210', garment: '#b8862b', trim: '#7a1730', bg: ['#8a5a1b', '#1c1207'],
      hairStyle: 'short', beard: 'stubble', mustache: 'thin', headwear: 'turban', headColor: '#a3202e',
      weapon: 'sword', armor: true, earrings: true, brow: 'calm', build: 1.1,
    },
  },

  /* ───────────── TEN GIANTS ───────────── */
  {
    id: 'nandimitra',
    group: 'giant',
    name: { en: 'Nandimitra', si: 'නන්දිමිත්‍ර' },
    title: { en: 'Giant No. 1 · Vanguard Breaker', si: 'දස මහා යෝධයින් අතරින් · පෙරටුගාමියා' },
    desc: {
      en: 'Said to have the strength of ten elephants. He led the vanguard and, at the siege of Vijithapura, shattered the iron-plated gates.',
      si: 'ඇතුන් දසදෙනෙකුගේ බලය ඇති යැයි කියැවෙන ඔහු හමුදාවේ පෙරටුගාමියා විය. විජිතපුර ආක්‍රමණයේදී යකඩ දොරටු බිඳ දැමීය.',
    },
    tags: [
      { en: 'Strength of 10 elephants', si: 'ඇත් දසදෙනෙකුගේ බලය' },
      { en: 'Gate-breaker', si: 'දොරටු බිඳින්නා' },
    ],
    avatar: {
      skin: SKIN.b, hair: '#150e0b', garment: '#a3202e', trim: '#d6a24a', bg: ['#7a1b25', '#1b0a0d'],
      hairStyle: 'short', beard: 'stubble', mustache: 'thick', headwear: 'helmet', headColor: '#9a7b43',
      weapon: 'mace', armor: true, brow: 'fierce', build: 1.3,
    },
  },
  {
    id: 'suranimala',
    group: 'giant',
    name: { en: 'Suranimala', si: 'සූරනිමල' },
    title: { en: 'Giant No. 2 · The King’s Shadow', si: 'දෙවන යෝධයා · රජුගේ සෙවණැල්ල' },
    desc: {
      en: 'Of noble birth, famed for endurance and agility. He fought at the king’s side through the northern campaign, holding off swarms of soldiers.',
      si: 'වංශවත් කුලයෙන් පැවත එන ඔහු විශිෂ්ට ශක්තියෙන් හා කඩිසරකමෙන් යුතු විය. උතුරු ව්‍යාපාරය පුරාම රජුගේ අසල සිට සතුරු හමුදා රැසක් වළක්වා සිටියේය.',
    },
    tags: [
      { en: 'Endurance', si: 'විඳදරාගැනීම' },
      { en: 'Royal guard', si: 'රාජ ආරක්ෂකයා' },
    ],
    avatar: {
      skin: SKIN.d, hair: '#17100d', garment: '#1b6a73', trim: '#e2b04a', bg: ['#1f5a63', '#0a1a1d'],
      hairStyle: 'bun', beard: 'short', mustache: 'thin', headwear: 'headband', headColor: '#e2b04a',
      weapon: 'sword', armor: true, earrings: true, brow: 'stern', build: 1.1,
    },
  },
  {
    id: 'mahasona',
    group: 'giant',
    name: { en: 'Mahasona', si: 'මහාසෝණ' },
    title: { en: 'Giant No. 3 · Uprooter of Palms', si: 'තුන්වන යෝධයා · තල් ගස් උදුරන්නා' },
    desc: {
      en: 'Showed superhuman strength from childhood — he could pull up palm trees and crush boulders. A front-line fighter who smashed enemy formations.',
      si: 'ළමා වියේ පටන් අසාමාන්‍ය ශක්තියක් පෙන්වූ ඔහුට තල් ගස් උදුරා ගැනීමටත් ගල් කුඩු කිරීමටත් හැකි විය. සතුරු සේනා ව්‍යූහ බිඳ දැමූ පෙරටුගාමී සටන්කරුවෙකි.',
    },
    tags: [
      { en: 'Raw power', si: 'අති බලය' },
      { en: 'Heavy infantry', si: 'බර පාබල' },
    ],
    avatar: {
      skin: SKIN.e, hair: '#0f0a08', garment: '#2c2a30', trim: '#c98b2a', bg: ['#4a3b2a', '#120d09'],
      hairStyle: 'curly', beard: 'full', mustache: 'thick', headwear: 'none',
      weapon: 'mace', armor: true, brow: 'fierce', build: 1.4,
    },
  },
  {
    id: 'gothaimbara',
    group: 'giant',
    name: { en: 'Gothaimbara', si: 'ගෝඨයිම්බර' },
    title: { en: 'Giant No. 4 · The Swift Guard', si: 'සිව්වන යෝධයා · වේගවත් ආරක්ෂකයා' },
    desc: {
      en: 'Known for speed and tactical defence. He helped guard the army’s supply lines and turned back flanking attacks.',
      si: 'වේගයෙන් හා උපායශීලී ආරක්ෂාවෙන් පිළිගත් ඔහු හමුදාවේ සැපයුම් මාර්ග රැකගත් අතර පැති ප්‍රහාර ද වළක්වා ලීය.',
    },
    tags: [
      { en: 'Speed', si: 'වේගය' },
      { en: 'Defence', si: 'ආරක්ෂාව' },
    ],
    avatar: {
      skin: SKIN.a, hair: '#17100d', garment: '#1f5c4a', trim: '#d6a24a', bg: ['#27564a', '#0a1713'],
      hairStyle: 'short', beard: 'none', mustache: 'thin', headwear: 'turban', headColor: '#d9822b',
      weapon: 'shield', armor: true, brow: 'calm', build: 1.05,
    },
  },
  {
    id: 'theraputtabhaya',
    group: 'giant',
    name: { en: 'Theraputtabhaya', si: 'තේරපුත්තාභය' },
    title: { en: 'Giant No. 5 · Warrior who became a Monk', si: 'පස්වන යෝධයා · පසුව භික්ෂුවක් වූවා' },
    desc: {
      en: 'A fiercely loyal commander of enormous strength. After the island was united he gave up worldly life and entered the Sangha.',
      si: 'අතිවිශාල බලයක් සහිත ස්වාමිභක්ත සෙන්පතියෙකි. රට එක්සේසත් වූ පසු ගිහි ජීවිතය අත්හැර සංඝයා අතරට එක් විය.',
    },
    tags: [
      { en: 'Loyal commander', si: 'ස්වාමිභක්තිය' },
      { en: 'Later a monk', si: 'පසුව භික්ෂුව' },
    ],
    avatar: {
      skin: SKIN.c, hair: '#0f0a08', garment: '#d9822b', trim: '#8c3b10', bg: ['#a65a1c', '#1d0f06'],
      hairStyle: 'bald', beard: 'none', mustache: 'none', headwear: 'none',
      weapon: 'staff', armor: false, brow: 'calm', build: 1.15,
    },
  },
  {
    id: 'bharana',
    group: 'giant',
    name: { en: 'Bharana', si: 'භරණ' },
    title: { en: 'Giant No. 6 · The Fearless Wrestler', si: 'හයවන යෝධයා · නිර්භීත පොරකරුවා' },
    desc: {
      en: 'Exceptionally strong and fearless in close combat. He led assault squads that broke through fortified barricades.',
      si: 'අතිශය බලවත්, සමීප සටන්වලදී නිර්භීත ය. බලකොටු බාධක බිඳ ගිය ප්‍රහාරක කණ්ඩායම් මෙහෙයවූයේය.',
    },
    tags: [
      { en: 'Close combat', si: 'සමීප සටන' },
      { en: 'Assault leader', si: 'ප්‍රහාර නායකයා' },
    ],
    avatar: {
      skin: SKIN.e, hair: '#130c09', garment: '#6b1420', trim: '#c98b2a', bg: ['#5c1822', '#13070a'],
      hairStyle: 'long', beard: 'full', mustache: 'curl', headwear: 'headband', headColor: '#a3202e',
      weapon: 'axe', armor: true, scar: true, brow: 'fierce', build: 1.3,
    },
  },
  {
    id: 'velusumana',
    group: 'giant',
    name: { en: 'Velusumana', si: 'වේළුසුමන' },
    title: { en: 'Giant No. 7 · Scout & Horseman', si: 'සත්වන යෝධයා · ඔත්තුකරු හා අශ්වාරෝහයා' },
    desc: {
      en: 'A bold horseman sent far ahead of the army to study Elara’s troop movements, fortresses and supply depots.',
      si: 'ප්‍රධාන හමුදාවට පෙර සතුරු ප්‍රදේශයට ගොස් එළාරගේ හමුදා චලන, බලකොටු සහ සැපයුම් ගබඩා ගැන තොරතුරු රැගෙන ආ නිර්භීත අශ්වාරෝහයා.',
    },
    tags: [
      { en: 'Scout', si: 'ඔත්තුකරු' },
      { en: 'Cavalry', si: 'අශ්වාරෝහ' },
    ],
    avatar: {
      skin: SKIN.f, hair: '#1a110c', garment: '#2a3a7a', trim: '#d6a24a', bg: ['#2f4290', '#0a0d20'],
      hairStyle: 'short', beard: 'none', mustache: 'curl', headwear: 'cap', headColor: '#2a3a7a',
      weapon: 'sword', armor: false, earrings: true, brow: 'calm', build: 0.98,
    },
  },
  {
    id: 'khanjadeva',
    group: 'giant',
    name: { en: 'Khanjadeva', si: 'ඛඤ්ජදේව' },
    title: { en: 'Giant No. 8 · The Hawk-Eyed', si: 'අටවන යෝධයා · උකුස්සා වැනි ඇස' },
    desc: {
      en: 'Renowned for keen eyesight and lightning reflexes with throwing weapons, he picked off commanders trying to rally troops behind the ramparts.',
      si: 'ඉතා තියුණු ඇස් පෙනීමෙන් හා විදින අවි භාවිතයේ වේගයෙන් පිළිගත් ඔහු, ප්‍රාකාර පිටුපස සිට හමුදා ඒකරාශී කරන්නට උත්සාහ කළ සතුරු නායකයන් වීසි කළේය.',
    },
    tags: [
      { en: 'Throwing weapons', si: 'විසි කරන අවි' },
      { en: 'Sharp eyes', si: 'තියුණු ඇස්' },
    ],
    avatar: {
      skin: SKIN.a, hair: '#1b1210', garment: '#b8862b', trim: '#7a1730', bg: ['#a27b24', '#1b1405'],
      hairStyle: 'short', beard: 'stubble', mustache: 'thin', headwear: 'headband', headColor: '#7a1730',
      weapon: 'spear', armor: false, brow: 'stern', build: 1.0,
    },
  },
  {
    id: 'phussadeva',
    group: 'giant',
    name: { en: 'Phussadeva', si: 'ඵුස්සදේව' },
    title: { en: 'Giant No. 9 · Master Archer', si: 'නවවන යෝධයා · ප්‍රධාන දුනුවායා' },
    desc: {
      en: 'The army’s master archer, whose arrows could pierce shields. It was Phussadeva’s arrow that brought down the Tamil chief Bhalluka.',
      si: 'පලිහ පවා විනිවිද යන ඊතල විදි හමුදාවේ ප්‍රධාන දුනුවායා. භල්ලුක නම් දෙමළ නායකයා වැටුණේ ඵුස්සදේවගේ ඊතලයෙනි.',
    },
    tags: [
      { en: 'Archery', si: 'දුනු ශිල්පය' },
      { en: 'Slayer of Bhalluka', si: 'භල්ලුක නසාලූ තැනැත්තා' },
    ],
    avatar: {
      skin: SKIN.d, hair: '#120c09', garment: '#1f5c4a', trim: '#e2b04a', bg: ['#2a6354', '#0a1814'],
      hairStyle: 'short', beard: 'short', mustache: 'curl', headwear: 'turban', headColor: '#e2b04a',
      weapon: 'bow', armor: false, earrings: true, brow: 'stern', build: 1.0,
    },
  },
  {
    id: 'labhiyavasabha',
    group: 'giant',
    name: { en: 'Labhiyavasabha', si: 'ලභියවසභ' },
    title: { en: 'Giant No. 10 · The Steadfast', si: 'දසවන යෝධයා · ස්ථිර සටන්කරුවා' },
    desc: {
      en: 'Named last among the ten champions, remembered for his stamina, steadiness and unwavering loyalty at the flanks of the army.',
      si: 'දස මහා යෝධයින් අතරින් අවසානයට නම් කෙරෙන ඔහු හමුදාවේ පැති ආරක්ෂා කරමින් විඳදරාගැනීමෙන් හා අචල ස්වාමිභක්තියෙන් සිහිපත් වේ.',
    },
    tags: [
      { en: 'Stamina', si: 'විඳදරාගැනීම' },
      { en: 'Flank guard', si: 'පැති ආරක්ෂකයා' },
    ],
    avatar: {
      skin: SKIN.e, hair: '#0f0a08', garment: '#7a1730', trim: '#d6a24a', bg: ['#6b1d3a', '#150810'],
      hairStyle: 'short', beard: 'short', mustache: 'thick', headwear: 'helmet', headColor: '#6d7077',
      weapon: 'spear', armor: true, brow: 'stern', build: 1.2,
    },
  },

  /* ───────────── FOES ───────────── */
  {
    id: 'elara',
    group: 'foe',
    name: { en: 'King Elara', si: 'එළාර රජ' },
    title: { en: 'Chola ruler of Anuradhapura', si: 'අනුරාධපුරයේ සෝළී රජ' },
    desc: {
      en: 'Ruled for about 44 years and is remembered as a just king. He fell to Dutugemunu in single combat and was honoured with a royal cremation and a tomb.',
      si: 'වසර 44ක් පමණ රාජ්‍ය කළ ඔහු යුක්තිගරුක රජෙකු ලෙස සිහිපත් වේ. ගැමුණු රජු සමඟ ද්වන්ද්ව සටනින් මිය ගිය අතර රාජකීය ආදාහනයකින් හා සොහොනකින් ගෞරව ලැබීය.',
    },
    tags: [
      { en: 'Just ruler', si: 'යුක්තිගරුක රජු' },
      { en: 'Honoured foe', si: 'ගෞරව ලත් සතුරා' },
    ],
    avatar: {
      skin: SKIN.c, hair: '#d6d1c8', garment: '#17294d', trim: '#e2b04a', bg: ['#223d73', '#080d1a'],
      hairStyle: 'short', beard: 'short', mustache: 'curl', headwear: 'turban', headColor: '#e2b04a',
      weapon: 'sword', armor: true, necklace: true, earrings: true, brow: 'calm', build: 1.1,
    },
  },
  {
    id: 'bhalluka',
    group: 'foe',
    name: { en: 'Bhalluka', si: 'භල්ලුක' },
    title: { en: 'Tamil chief from the mainland', si: 'මහාද්වීපයෙන් පැමිණි දෙමළ නායකයා' },
    desc: {
      en: 'Landed with a fresh army to challenge the king after Elara’s fall. He met his end by an arrow from the master archer Phussadeva.',
      si: 'එළාරගේ පරාජයෙන් පසු නැවුම් හමුදාවක් සමඟ රජුට අභියෝග කිරීමට පැමිණියේය. ප්‍රධාන දුනුවායා වූ ඵුස්සදේවගේ ඊතලයෙන් මරු වැළඳගත්තේය.',
    },
    tags: [
      { en: 'Last challenger', si: 'අවසන් අභියෝගකරු' },
    ],
    avatar: {
      skin: SKIN.e, hair: '#100a08', garment: '#2c2a30', trim: '#9a7b43', bg: ['#33333c', '#0a0a0d'],
      hairStyle: 'short', beard: 'full', mustache: 'thick', headwear: 'helmet', headColor: '#4a4d55',
      weapon: 'axe', armor: true, brow: 'fierce', build: 1.25,
    },
  },

  /* ───────────── COMPANION ───────────── */
  {
    id: 'kandula',
    group: 'companion',
    name: { en: 'Kandula', si: 'කණ්ඩුල' },
    title: { en: 'The Royal War Elephant', si: 'රාජකීය යුද ඇතා' },
    desc: {
      en: 'The mighty tusker that grew up with Prince Gamani. He carried the king into battle, battered fortress gates and bore him in the duel with Elara.',
      si: 'ගැමුණු කුමරුත් සමඟ හැදුණු බලවත් ඇතා. රජුව යුද්ධයට රැගෙන ගිය ඔහු බලකොටු දොරටු බිඳ දැමූ අතර, එළාර සමඟ ද්වන්ද්වයේදීත් රජුව දරාගත්තේය.',
    },
    tags: [
      { en: 'War elephant', si: 'යුද ඇතා' },
      { en: 'Faithful mount', si: 'විශ්වාසවන්ත වාහනය' },
    ],
    kind: 'elephant',
    avatar: {
      skin: '#6f6a66', hair: '#000', garment: '#7a1730', trim: '#e2b04a', bg: ['#5a4a2a', '#150f07'],
      hairStyle: 'bald', beard: 'none', headwear: 'none', weapon: 'none',
    },
  },
];

export const groups: { id: Group | 'all'; label: Bil }[] = [
  { id: 'all', label: { en: 'All', si: 'සියල්ල' } },
  { id: 'royal', label: { en: 'Royal House', si: 'රාජ පරපුර' } },
  { id: 'giant', label: { en: 'Ten Giants', si: 'දස මහා යෝධයෝ' } },
  { id: 'foe', label: { en: 'Opponents', si: 'විරුද්ධවාදීන්' } },
  { id: 'companion', label: { en: 'Companion', si: 'සහචරයා' } },
];
