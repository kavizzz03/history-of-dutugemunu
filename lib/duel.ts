import type { L } from "./i18n";

/** Total length of one pass of the animation, in seconds. */
export const DURATION = 19;

export type Beat = { from: number; to: number; title: L; text: L };

/* Follows the Mahavamsa's account of the single combat at the southern gate of Anuradhapura. */
export const BEATS: Beat[] = [
  {
    from: 0,
    to: 3.6,
    title: { en: "The challenge", si: "අභියෝගය" },
    text: {
      en: "To spare both armies, the kings settle the war alone. Dutugemunu rides Kandula; aged Elara rides his tusker Maha Pabbata.",
      si: "සේනා දෙකේ ජීවිත බේරා ගනිමින් රජුන් දෙදෙනා තනිව යුද්ධය නිමා කිරීමට එළඹේ. දුටුගැමුණු කණ්ඩුල පිටද, වයෝවෘද්ධ එළාර මහා පබ්බත ඇතා පිටද ගමන් කරයි.",
    },
  },
  {
    from: 3.6,
    to: 6.4,
    title: { en: "Elara strikes first", si: "එළාර පළමුව පහර දෙයි" },
    text: {
      en: "Elara hurls his javelin. Kandula swerves, the king ducks, and the weapon whistles past to stick in the earth.",
      si: "එළාර රජු හෙල්ලය විසි කරයි. කණ්ඩුල පසෙකට වන අතර රජු නැමෙයි; හෙල්ලය හමා ගොස් පොළොවේ සිර වේ.",
    },
  },
  {
    from: 6.4,
    to: 9.4,
    title: { en: "Kandula charges", si: "කණ්ඩුලගේ ප්‍රහාරය" },
    text: {
      en: "Kandula lowers his head and drives his tusks into Maha Pabbata. The great elephant staggers back.",
      si: "කණ්ඩුල හිස පහත් කර දළ දෙකෙන් මහා පබ්බතයාට ඇන ගනී. මහා ඇතා පසුබසියි.",
    },
  },
  {
    from: 9.4,
    to: 11.6,
    title: { en: "The king's javelin", si: "රජුගේ හෙල්ලය" },
    text: {
      en: "As Elara's elephant reels, Dutugemunu hurls his javelin with all his strength. It strikes true.",
      si: "එළාරගේ ඇතා වැනෙන විට දුටුගැමුණු සියලු ශක්තියෙන් හෙල්ලය විසි කරයි. එය නිවැරදිව වදී.",
    },
  },
  {
    from: 11.6,
    to: 14.6,
    title: { en: "Elara falls", si: "එළාර වැටෙයි" },
    text: {
      en: "The aged king slips from his elephant and falls. Kandula raises his trunk and trumpets: the island is one.",
      si: "වයෝවෘද්ධ රජු ඇතු පිටින් ලිස්සා වැටේ. කණ්ඩුල හොඬය ඔසවා නාද කරයි; දිවයින එක් වෙයි.",
    },
  },
  {
    from: 14.6,
    to: DURATION,
    title: { en: "Honour for a worthy foe", si: "සුදුසු සතුරාට ගෞරවය" },
    text: {
      en: "Dutugemunu cremates Elara with full honours and raises a monument on the spot. Every traveller who passes, even kings, must dismount and lower their banners.",
      si: "දුටුගැමුණු එළාර රජුව සියලු ගෞරව සහිතව ආදාහනය කර එම ස්ථානයේම ස්මාරකයක් ඉදි කරයි. එතැනින් යන සෑම කෙනෙකුම, රජවරුන් පවා, බැස කොඩි පහත් කළ යුතුය.",
    },
  },
];

export const DUEL_UI = {
  kicker: { en: "The Duel of Kings", si: "රජුන්ගේ ද්වන්ද සටන" } as L,
  title: { en: "Two kings, two tuskers, one javelin", si: "රජවරු දෙදෙනෙක්, ඇතුන් දෙදෙනෙක්, හෙල්ලයක්" } as L,
  sub: {
    en: "The legendary single combat at the southern gate of Anuradhapura, as the Mahavamsa tells it.",
    si: "මහාවංසයේ කියැවෙන පරිදි අනුරාධපුරයේ දකුණු දොරටුව අසල සිදු වූ ප්‍රසිද්ධ ද්වන්ද සටන.",
  } as L,
  play: { en: "Play", si: "ධාවනය" } as L,
  pause: { en: "Pause", si: "නවත්වන්න" } as L,
  replay: { en: "Replay", si: "නැවත" } as L,
  scrub: { en: "Timeline", si: "කාල රේඛාව" } as L,
  musicOn: { en: "Music on", si: "සංගීතය සක්‍රීය" } as L,
  musicOff: { en: "Music off", si: "සංගීතය නැත" } as L,
  musicTap: { en: "Tap to hear the theme", si: "තේමා ගීතය ඇසීමට ස්පර්ශ කරන්න" } as L,
  gate: { en: "Southern Gate of Anuradhapura", si: "අනුරාධපුරයේ දකුණු දොරටුව" } as L,
  dutu: { en: "Dutugemunu · Kandula", si: "දුටුගැමුණු · කණ්ඩුල" } as L,
  elara: { en: "Elara · Maha Pabbata", si: "එළාර · මහා පබ්බත" } as L,
  tomb: { en: "Elara's tomb", si: "එළාරගේ සොහොන" } as L,
  note: {
    en: "An artistic retelling. Details of the combat vary between sources.",
    si: "කලාත්මක නැවත කියවීමකි. සටනේ විස්තර මූලාශ්‍ර අනුව වෙනස් වේ.",
  } as L,
};
