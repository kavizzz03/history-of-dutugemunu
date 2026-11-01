/** The public address of the site. On Vercel it is picked up automatically; set NEXT_PUBLIC_SITE_URL to use a custom domain. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

export const SITE = {
  name: "Dutugemunu",
  nameSi: "දුටුගැමුණු",
  title: "Dutugemunu · දුටුගැමුණු — The King Who United Sri Lanka",
  description:
    "Explore the story of King Dutugemunu from the Mahavamsa in English and Sinhala: a 3D war-journey map of Sri Lanka, the animated Duel of Kings against Elara, the war elephant Kandula, and a 360° Hall of Heroes with the Ten Giant Warriors.",
  shortDescription: "Interactive English & Sinhala story of King Dutugemunu: 3D war map, animated Duel of Kings and 360° Hall of Heroes.",
  author: "Kavindu Bogahawatte",
  keywords: [
    "Dutugemunu", "Dutugamunu", "Dutthagamani", "Gamani Abhaya", "King Dutugemunu", "දුටුගැමුණු", "දුටුගැමුණු රජු",
    "Mahavamsa", "මහාවංසය", "Elara", "එළාර", "Kandula", "කණ්ඩුල", "Ten Giant Warriors", "දස මහා යෝධයෝ", "Viharamahadevi",
    "Kavan Tissa", "Anuradhapura", "Ruhuna", "Sri Lanka history", "ශ්‍රී ලංකා ඉතිහාසය", "ancient Sri Lanka", "Duel of Kings",
    "3D map of Sri Lanka", "interactive history", "Sinhala", "bilingual website", "Kavindu Bogahawatte",
  ],
};
