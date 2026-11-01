import type { Bil } from '@/lib/i18n';

export type Phase = {
  id: string;
  years: Bil;
  title: Bil;
  body: Bil;
  icon: 'boat' | 'ornament' | 'swords' | 'spear' | 'crown' | 'stupa';
};

export const phases: Phase[] = [
  {
    id: 'birth',
    icon: 'boat',
    years: { en: 'Before 161 BCE', si: 'ක්‍රි.පූ. 161ට පෙර' },
    title: { en: 'Born of a Prophecy', si: 'අනාවැකියෙන් උපන් කුමරු' },
    body: {
      en: 'Prince Gamani Abhaya was born at Magama in Ruhuna to King Kavan Tissa and Queen Viharamahadevi — a princess who had drifted ashore in a golden boat. Soothsayers foretold a son who would unite the island, and a royal tusker named Kandula joined his household.',
      si: 'ගැමුණු අභය කුමරු උපන්නේ රුහුණේ මාගම නුවර කාවන්තිස්ස රජතුමා සහ විහාරමහාදේවී බිසව යුවළට ය. රන් බෝට්ටුවකින් රුහුණු වෙරළට පැමිණි කුමරිය ඇය ය. මුළු රට එක්සේසත් කරන පුතෙකු ඉපදෙනු ඇතැයි නිමිත්තෙන් කී අතර, කණ්ඩුල නම් රාජකීය ඇතා ද ඔහුගේ පිරිවරට එක් විය.',
    },
  },
  {
    id: 'defiance',
    icon: 'ornament',
    years: { en: 'c. 177 – 161 BCE', si: 'ක්‍රි.පූ. 177 – 161 පමණ' },
    title: { en: 'The Impetuous Prince', si: 'නොපනත් කුමරු' },
    body: {
      en: 'Impatient with his father’s cautious peace with Elara, Gamani sent him a woman’s ornament as a taunt. Kavan Tissa was furious and threatened punishment; the prince — now called Dutu-Gamani, “the Disobedient” — fled into hiding in the hills of Malaya.',
      si: 'එළාර සමඟ යුද්ධ නොකර සාමයෙන් සිටීමේ පියාගේ ප්‍රතිපත්තියට නොඉවසූ ගැමුණු කුමරු, පියාට ගැහැනු ආභරණයක් එවා සමච්චල් කළේය. කෝපයට පත් කාවන්තිස්ස රජු දඬුවම් කරන බව කීවේය. මෙයින් “දුටු ගැමුණු” යන නම ලැබූ කුමරු මලය රටේ කඳුකරයට ගොස් සැඟවී සිටියේය.',
    },
  },
  {
    id: 'brothers',
    icon: 'swords',
    years: { en: 'c. 161 BCE', si: 'ක්‍රි.පූ. 161 පමණ' },
    title: { en: 'A War Between Brothers', si: 'සහෝදර සටන සහ සමගිය' },
    body: {
      en: 'When Kavan Tissa died, Prince Tissa seized Kandula and their mother. Gamani marched south, lost a first battle at Kulanganiya Pitti and then won the second. Queen Viharamahadevi and the monks reconciled the brothers, and Tissa became Gamani’s chief commander.',
      si: 'කාවන්තිස්ස රජු අභාවප්‍රාප්ත වූ පසු තිස්ස කුමරු කණ්ඩුල ඇතාත්, මෑණියනුත් තමා සතු කරගත්තේය. ගැමුණු කුමරු දකුණට ගොස් කුලංගනිය පිට්ටියේ පළමු සටනින් පරාජය වුවද දෙවැනි සටනින් ජය ගත්තේය. විහාරමහාදේවී බිසව සහ භික්ෂූන් වහන්සේ සහෝදරයන් සමඟි කළ අතර, තිස්ස කුමරු ප්‍රධාන සේනාපති විය.',
    },
  },
  {
    id: 'campaign',
    icon: 'spear',
    years: { en: 'c. 161 BCE', si: 'ක්‍රි.පූ. 161 පමණ' },
    title: { en: 'The Great March North', si: 'උතුරට මහා ගමන' },
    body: {
      en: 'He gathered ten legendary champions and set out with a relic of the Buddha enshrined in his spear, framing the war as the defence of the Sasana. His army took the enemy fortresses one by one until it stood at the southern gate of Anuradhapura.',
      si: 'ඔහු දස මහා යෝධයන් එක් කර, බුදුරදුන්ගේ ධාතුවක් තැන්පත් කළ හෙලයක් රැගෙන සසුන රැකීමේ අරමුණින් ගමන් අරඹා, සතුරු බලකොටු එකින් එක අල්ලා ගනිමින් අනුරාධපුරයේ දකුණු දොරටුව වෙත පැමිණියේය.',
    },
  },
  {
    id: 'victory',
    icon: 'crown',
    years: { en: '161 BCE', si: 'ක්‍රි.පූ. 161' },
    title: { en: 'Duel, Victory and Honour', si: 'ද්වන්ද්වය, ජයග්‍රහණය සහ ගෞරවය' },
    body: {
      en: 'Aged King Elara, who had ruled justly for 44 years, met Dutugemunu in single combat on elephant-back and fell to his spear. Honouring a worthy foe, the victor gave Elara a royal cremation, raised a monument, and decreed that every traveller — even kings — must dismount and silence their drums when passing it. Dutugemunu was crowned king of a united island.',
      si: 'වසර 44ක් යුක්තිගරුකව රාජ්‍ය කළ මහලු එළාර රජු ඇතුපිට ද්වන්ද්ව සටනකින් ගැමුණු රජු හමුවී, ඔහුගේ හෙලයට හසු වී වැටුණි. සතුරෙකු වුවද ගුණවතෙකුට ගරු කළ ජයග්‍රාහකයා එළාරට රාජකීය ආදාහනයක් කරවා ස්මාරකයක් ඉදි කළේය; එම ස්ථානය පසුකරන සියල්ලෝම — රජවරුන් පවා — ඇතුපිටින් බැස බෙර හඬ නවතා යා යුතු බව නියම කළේය. එතැන් සිට ගැමුණු රජු එක්සේසත් ලංකාවේ රජු විය.',
    },
  },
  {
    id: 'builder',
    icon: 'stupa',
    years: { en: '160 – 137 BCE', si: 'ක්‍රි.පූ. 160 – 137' },
    title: { en: 'The Builder King', si: 'සසුන් ගොඩනැඟූ රජු' },
    body: {
      en: 'Remorseful over the lives lost in war, he devoted his reign to religious works: the Mirisavetiya, the nine-storey Lohapasada and the great Ruwanwelisaya. As he lay dying in 137 BCE, a scroll of his good deeds was read to him and he passed away at peace; his brother Saddhatissa completed the stupa.',
      si: 'යුද්ධයේ ජීවිත හානි ගැන පසුතැවුණු ඔහු රාජ්‍ය කාලය සසුන් සේවයට කැප කළේය. මිරිසවැටිය, මහල් නවයක ලෝවාමහාපාය සහ මහා රුවන්වැලිසෑය ඉදි කළේය. ක්‍රි.පූ. 137දී මරණාසන්නව සිටියදී තමා කළ පින්කම් ලියවුණු ලේඛනය කියවනු ඇසූ ඔහු සමාදානයෙන් අභාවප්‍රාප්ත විය. ථූපය නිම කළේ සහෝදර සද්ධාතිස්ස රජතුමාය.',
    },
  },
];

export const stats: { value: string; label: Bil }[] = [
  { value: '161 BCE', label: { en: 'Crowned king of the united island', si: 'එක්සේසත් රටේ රජු ලෙස අභිෂේකය' } },
  { value: '10', label: { en: 'Giant Warriors at his side', si: 'දස මහා යෝධයින්' } },
  { value: '24', label: { en: 'Years of reign (161–137 BCE)', si: 'රාජ්‍ය වර්ෂ' } },
  { value: '3', label: { en: 'Great monuments built', si: 'මහා ගොඩනැඟිලි තුන' } },
];

export type Monument = {
  id: 'miris' | 'loha' | 'ruwan';
  name: Bil;
  era: Bil;
  desc: Bil;
  facts: Bil[];
};

export const monuments: Monument[] = [
  {
    id: 'miris',
    name: { en: 'Mirisavetiya Stupa', si: 'මිරිසවැටි ථූපය' },
    era: { en: 'c. 161 BCE', si: 'ක්‍රි.පූ. 161 පමණ' },
    desc: {
      en: 'Built on the spot where the king planted his relic-spear and it would not be moved. It was raised as penance for eating a chilli (miris) curry without first sharing it with the monks.',
      si: 'රජතුමා ධාතු හෙලය සිටුවූ තැන, එය නොසෙල්වී පිහිටි තැන ඉදි කළ ථූපයයි. සංඝයාට පූජා නොකර මිරිස් ව්‍යංජනයක් වැළඳූ වරදට ප්‍රායශ්චිත්තයක් ලෙස කළ බව කියැවේ.',
    },
    facts: [
      { en: 'First great work after victory', si: 'ජයග්‍රහණයෙන් පසු පළමු මහා කර්මය' },
      { en: 'Near Tissa Wewa', si: 'තිසාවැව අසල' },
    ],
  },
  {
    id: 'loha',
    name: { en: 'Lohapasada — Brazen Palace', si: 'ලෝවාමහාපාය' },
    era: { en: 'c. 150 BCE', si: 'ක්‍රි.පූ. 150 පමණ' },
    desc: {
      en: 'A monastic residence for the monks, nine storeys tall, with 1,600 stone pillars and a roof of bronze/copper tiles that gleamed across the city.',
      si: 'භික්ෂූන් වහන්සේ සඳහා ඉදි කළ මහල් නවයකින් යුත්, ගල් කණු 1,600ක් සහිත, තඹ/ලෝකඩ උළුවලින් සෙවිලි කළ මහා නේවාසිකාගාරය.',
    },
    facts: [
      { en: '9 storeys · 1,600 pillars', si: 'මහල් 9 · කණු 1,600' },
      { en: 'Pillar field still visible', si: 'ගල් කණු අදත් දැකිය හැක' },
    ],
  },
  {
    id: 'ruwan',
    name: { en: 'Ruwanwelisaya (Mahathupa)', si: 'රුවන්වැලිසෑය (මහාථූපය)' },
    era: { en: 'Begun c. 140 BCE', si: 'ක්‍රි.පූ. 140 පමණ ඇරඹිණි' },
    desc: {
      en: 'His crowning work, built to enshrine relics of the Buddha. Its foundation was packed by elephants with padded feet, and monks came from across the Buddhist world for the ceremony. The king died before the pinnacle was set; Saddhatissa finished it.',
      si: 'බුදුරදුන්ගේ ධාතු තැන්පත් කිරීමට ඉදි කළ ඔහුගේ අග්‍ර කෘතියයි. අත්තිවාරම ඇතුන් ලවා පා ආවරණ දමා තදකළ අතර, පින්කම් උත්සවයට බෞද්ධ ලොව පුරා භික්ෂූන් පැමිණියහ. කොත පිහිටුවීමට පෙර රජු අභාවප්‍රාප්ත වූ අතර සද්ධාතිස්ස රජු එය නිම කළේය.',
    },
    facts: [
      { en: 'Foundation tamped by elephants', si: 'අත්තිවාරම ඇතුන් ලවා තද කරන ලදී' },
      { en: 'Completed by Saddhatissa', si: 'නිම කළේ සද්ධාතිස්සයි' },
    ],
  },
];
