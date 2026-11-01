import type { L } from "./i18n";

export type Phase = {
  id: string;
  years: L;
  title: L;
  summary: L;
  points: L[];
  icon: "birth" | "exile" | "war" | "build" | "legacy";
};

export const PHASES: Phase[] = [
  {
    id: "birth",
    icon: "birth",
    years: { en: "Before 161 BCE", si: "ක්‍රි.පූ. 161ට පෙර" },
    title: { en: "Birth & Prophecy", si: "උපත සහ නිමිති" },
    summary: {
      en: "A prince is born in the south, to a queen who crossed the sea in a golden boat.",
      si: "රන් බෝට්ටුවෙන් මුහුද තරණය කළ බිසවකට දකුණේ කුමාරයෙකු උපදී.",
    },
    points: [
      {
        en: "Parents: King Kavan Tissa of Ruhuna and Queen Viharamahadevi, daughter of King Kelanitissa of Kalyani.",
        si: "දෙමාපියෝ: රුහුණේ කාවන්තිස්ස රජු සහ කැලණිතිස්ස රජුගේ දියණිය වූ විහාරමහාදේවි බිසව.",
      },
      {
        en: "Her pregnancy craving — to drink water that washed the sword that beheaded a Tamil commander — was read as the sign of a future unifier.",
        si: "දෙමළ සෙනෙවියෙකුගේ හිස සිඳි කඩුව සෝදූ දිය පානය කිරීමේ ඇගේ දොළදුක, දිවයින එක්සත් කරන්නෙකුගේ නිමිත්තක් ලෙස කියවිණි.",
      },
      {
        en: "Around his birth a noble tusker calf, Kandula, came to be his royal mount.",
        si: "ඔහු උපන් අවධියේම උතුම් දළ ඇත් පැටවෙකු වූ කණ්ඩුල ඔහුගේ රාජකීය වාහනය බවට පත් විය.",
      },
    ],
  },
  {
    id: "exile",
    icon: "exile",
    years: { en: "c. 177 – 161 BCE", si: "ක්‍රි.පූ. 177 – 161 පමණ" },
    title: { en: "Defiance, Exile & Brothers' War", si: "නොඉවසීම, පලා යාම සහ සහෝදර යුද්ධය" },
    summary: {
      en: "The impatient prince defies his father — then must win his own family before he can win a kingdom.",
      si: "නොඉවසිලිවන්ත කුමාරයා පියාට විරුද්ධ වේ — රාජ්‍යයක් දිනීමට පෙර ඔහුට තම පවුල දිනාගත යුතු විය.",
    },
    points: [
      {
        en: "Gamani chafed at his father's peace with Elara. When refused permission to fight, he sent his father a woman's ornament — and earned the name Dutugemunu, 'the disobedient'.",
        si: "එළාර සමඟ පියාගේ සාමයට ගැමුණු කුමරු නොඉවසුවේය. යුද්ධයට අවසර නොලැබුණු විට ඔහු පියාට කාන්තා ආභරණයක් එවූ අතර, 'දුටුගැමුණු' නම ලැබීය.",
      },
      {
        en: "He fled to the Malaya hill country. After Kavan Tissa died, his brother Tissa seized the royal elephant and their mother.",
        si: "ඔහු මලය රට කඳුකරයට පලා ගියේය. කාවන්තිස්ස රජුගේ අභාවයෙන් පසු සහෝදර තිස්ස කුමරු රාජකීය ඇතා හා මව ගෙන ගියේය.",
      },
      {
        en: "After a bloody defeat at Kulanganiya Pitti and a second battle won, the queen and the monks reconciled the brothers.",
        si: "කුලංගනිය පිට්ටියේදී ලේ වැගිරුණු පරාජයකින් සහ දෙවන සටනේ ජයෙන් පසු, මව සහ භික්ෂූන් වහන්සේලා සහෝදරයන් සමගි කළහ.",
      },
    ],
  },
  {
    id: "war",
    icon: "war",
    years: { en: "161 – 137 BCE", si: "ක්‍රි.පූ. 161 – 137" },
    title: { en: "The March North & the Duel", si: "උතුරු ගමන සහ ද්වන්ද සටන" },
    summary: {
      en: "With ten giants, a relic-bearing spear and Kandula, Dutugemunu fights his way to Anuradhapura.",
      si: "දස මහා යෝධයින්, ධාතු සහිත හෙල්ලය සහ කණ්ඩුල සමඟ දුටුගැමුණු අනුරාධපුරය දක්වා සටන් කරමින් ගමන් කරයි.",
    },
    points: [
      {
        en: "He assembled the Ten Giants and carried a relic of the Buddha in his spear, framing the war as a defence of the Sasana.",
        si: "ඔහු දස මහා යෝධයින් එක්රැස් කර, බුද්ධ ධාතුවක් හෙල්ලයේ තබා ගනිමින් යුද්ධය සසුන රැකීමක් ලෙස පෙන්වීය.",
      },
      {
        en: "Fortress after fortress fell — Mahiyangana, Ambatthakola, the great siege of Vijithapura — until the army stood at Anuradhapura.",
        si: "මහියංගනය, අම්බට්ඨකොල, විජිතපුරයේ මහා වටලෑම ඇතුළු බලකොටු එකින් එක බිඳ වැටී, සේනාව අනුරාධපුරයට ළඟා විය.",
      },
      {
        en: "Elara and Dutugemunu met in single combat on elephant-back at the southern gate; Elara fell to the king's spear.",
        si: "දකුණු දොරටුව අසල ඇත් පිටින් සිදු වූ ඒකපුද්ගල සටනේදී එළාර රජු දුටුගැමුණුගේ හෙල්ලයට ගොදුරු විය.",
      },
      {
        en: "Dutugemunu honoured his enemy with a royal cremation and a monument that all travellers had to pass in respect.",
        si: "දුටුගැමුණු සතුරාට රාජකීය අවමංගල්‍යයක් හා ස්මාරකයක් කරවා, එය පසු කරන සියලු දෙනා ගරු කළ යුතු බවට නියෝග කළේය.",
      },
    ],
  },
  {
    id: "build",
    icon: "build",
    years: { en: "160 – 137 BCE", si: "ක්‍රි.පූ. 160 – 137" },
    title: { en: "The Builder King", si: "ගොඩනැගීමේ රජතුමා" },
    summary: {
      en: "Remorse over the dead turns a conqueror into a builder of monuments.",
      si: "මියගිය අයගැන පසුතැවිල්ල ජයග්‍රාහකයා ගොඩනැගීමේ රජෙකු බවට පත් කළේය.",
    },
    points: [
      {
        en: "Mirisavetiya Stupa — built where his relic spear stood fixed in the ground, as penance for eating a meal without sharing it with the monks.",
        si: "මිරිසවැටිය ස්තූපය — භික්ෂූන්ට නොබෙදා ආහාර ගැනීමේ වරදට ප්‍රායශ්චිත්තයක් ලෙස, ධාතු හෙල්ලය ස්ථාපිත වූ තැන ඉදි කෙරිණි.",
      },
      {
        en: "Lohapasada, the Brazen Palace — a nine-storey monastic residence on 1,600 stone pillars, roofed in bronze.",
        si: "ලෝවාමහාපාය — ගල් කුලුනු 1,600ක් මත ඉදි වූ, තඹ සෙවිලි කළ මහල් නවයක භික්ෂු නිවාසය.",
      },
      {
        en: "Ruwanwelisaya (Mahathupa) — his crowning work, its foundation pounded by elephants in leather-padded boots.",
        si: "රුවන්වැලිසෑය (මහාථූපය) — ඔහුගේ අග්‍ර ශිල්ප කෘතිය; එහි අත්තිවාරම ඇතුන් විසින් සම්පිණ්ඩනය කරවන ලදී.",
      },
    ],
  },
  {
    id: "legacy",
    icon: "legacy",
    years: { en: "137 BCE", si: "ක්‍රි.පූ. 137" },
    title: { en: "Passing & Legacy", si: "පරලොව ගමන සහ උරුමය" },
    summary: {
      en: "A king listens to the record of his good deeds, and goes peacefully.",
      si: "රජෙක් තම පින්කම් වාර්තාව ඇසෙමින් නිශ්ශබ්දව සමුගනී.",
    },
    points: [
      {
        en: "On his deathbed his minister read aloud the scroll of his works — hospitals, stupas, monasteries.",
        si: "මරණ මංචකයේදී ඇමති ඔහුගේ පින්කම් — රෝහල්, ස්තූප, විහාර — අඩංගු ලේඛනය හඬ නඟා කියවීය.",
      },
      {
        en: "He died before the pinnacle of the Ruwanwelisaya was set; his brother, King Saddhatissa, completed it.",
        si: "රුවන්වැලිසෑයේ කොත් කැරැල්ල පිහිටුවීමට පෙර ඔහු අභාවප්‍රාප්ත විය; සහෝදර සද්ධාතිස්ස රජු එය නිම කළේය.",
      },
      {
        en: "Remembered across Sri Lanka as the king who united the island and built its first great monuments.",
        si: "දිවයින එක්සත් කර ශ්‍රී ලංකාවේ මහා ස්මාරක තැනූ රජු ලෙස අද දක්වාත් ජනතාව සිහිපත් කරයි.",
      },
    ],
  },
];

export type Monument = {
  id: "mirisavetiya" | "lohapasada" | "ruwanwelisaya";
  year: L;
  name: L;
  tagline: L;
  text: L;
};

export const MONUMENTS: Monument[] = [
  {
    id: "mirisavetiya",
    year: { en: "c. 161 BCE", si: "ක්‍රි.පූ. 161 පමණ" },
    name: { en: "Mirisavetiya Stupa", si: "මිරිසවැටි ස්තූපය" },
    tagline: { en: "A spear that would not move", si: "ඉවත් නොවූ හෙල්ලය" },
    text: {
      en: "Raised beside the Tissa Wewa where the king's relic-spear stood fast. Legend says Dutugemunu built it in penance after eating a chilli-spiced meal without offering it to the Sangha first.",
      si: "රජුගේ ධාතු හෙල්ලය ස්ථාපිත වූ තිස්ස වැව අසල ඉදි කෙරිණි. භික්ෂූන්ට නොබෙදා මිරිස් සහිත ආහාර වැළඳීම නිසා ප්‍රායශ්චිත්තයක් ලෙස රජු මෙය කරවූ බව ජනප්‍රවාදයේ කියවේ.",
    },
  },
  {
    id: "lohapasada",
    year: { en: "c. 150 BCE", si: "ක්‍රි.පූ. 150 පමණ" },
    name: { en: "Lohapasada · Brazen Palace", si: "ලෝවාමහාපාය" },
    tagline: { en: "Nine storeys, 1,600 pillars", si: "මහල් නවය, කුලුනු 1,600" },
    text: {
      en: "A vast monastic residence whose copper-bronze roof gave it its name. Its forest of stone pillars still stands today in Anuradhapura — silent proof of the scale of the king's vision.",
      si: "තඹ-ලෝහ සෙවිලි නිසා නම ලැබූ විශාල භික්ෂු නිවාසයකි. එහි ගල් කුලුනු වනය අදත් අනුරාධපුරයේ ඉතිරිව ඇත — රජුගේ දැක්මේ විශාලත්වයට නිශ්ශබ්ද සාක්ෂියකි.",
    },
  },
  {
    id: "ruwanwelisaya",
    year: { en: "begun c. 140 BCE", si: "ක්‍රි.පූ. 140 පමණ ඇරඹූ" },
    name: { en: "Ruwanwelisaya · Mahathupa", si: "රුවන්වැලිසෑය · මහාථූපය" },
    tagline: { en: "The crowning work", si: "අග්‍ර ශිල්ප කෘතිය" },
    text: {
      en: "The Great Stupa, built to enshrine relics of the Buddha. Its foundations were tamped by elephants in padded boots, and monks from across the Buddhist world attended its ceremonies. The pinnacle was completed by King Saddhatissa.",
      si: "බුද්ධ ධාතු තැන්පත් කිරීමට ඉදි කළ මහා ථූපයයි. එහි අත්තිවාරම පාදම ඇතුන් විසින් පාගා තද කරවූ අතර, බෞද්ධ ලෝකය පුරා භික්ෂූන් එහි උත්සව වලට පැමිණියහ. කොත් කැරැල්ල සද්ධාතිස්ස රජු විසින් නිම කරන ලදී.",
    },
  },
];
