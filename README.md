# Dutugemunu — The Impetuous Prince who United an Island
### දුටුගැමුණු — දිවයින එක් කළ නොඉවසිලිවන්ත කුමාරයා

An interactive, bilingual (**English / සිංහල**) Next.js website that retells the story of
King Dutugemunu from the Mahavamsa — with a 3D war-journey map of Sri Lanka, an animated
Duel of Kings, and a 360° Hall of Heroes with 3D characters.

> **Idea, design and development: Kavindu Bogahawatte.**
> This whole project — the concept, the visual design, the layout and every feature —
> was created by Kavindu Bogahawatte, who is its sole owner.
> © 2026 Kavindu Bogahawatte. All rights reserved. See [LICENSE](./LICENSE).

---

## Features
- **Chronicle** — five chapters of the king's life, in English and Sinhala (language switch in the top bar and footer).
- **Hall of Heroes** — 17 characters (Dutugemunu, Viharamahadevi, Kavan Tissa, the Ten Giants, Elara, Kandula and more) standing in a rotatable 3D ring; pick anyone for a close-up and a 360° turn. Animated bodies, costumes, weapons.
- **3D War Map** — the island in 3D, the Mahaweli river, the golden ship of Viharamahadevi, the marching army with Kandula, the brothers' battle at Kulanganiya, and the Anuradhapura sacred city with a link to the duel. Background music while the journey plays.
- **Duel of Kings** — a fully animated scene of Dutugemunu and Elara fighting on their tuskers, with theme music.
- **Great Works** — the monuments the king built after the war.
- Responsive layout, scroll-progress navigation, and a professional footer.

## Tech stack
Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · three.js · React Three Fiber · drei · Fontsource fonts.

## Run it locally
```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start   # production
```
Deploys to Vercel with no extra configuration.

## Project layout
```
app/              page + global styles
components/       sections (Hero, Story, Heroes, JourneyMap, Duel, Works, Footer…) and 3D scenes
lib/              bilingual text and data (characters, journey, places, duel, UI strings)
public/models/    3D body model (see credits) and optional custom character models
public/audio/     background music
```

### Using your own realistic character models (optional)
Put a rigged, animated `.glb` at `public/models/characters/<character-id>.glb`
(e.g. `dutugemunu.glb`) and add its id to `public/models/characters/manifest.json`
(e.g. `["dutugemunu"]`). It replaces the built-in body for that hero.

---

## Ownership
Kavindu Bogahawatte conceived the idea, designed and developed this project himself.
All original work in it — design, layout, code, 3D scenes, animation, character artwork and
text arrangement — belongs entirely to him. Nobody may copy, reuse, redistribute or sell any
part of it without his written permission. Full terms are in [LICENSE](./LICENSE).

## Credits and third-party notices
Ownership above applies to the original work only. These items belong to others:

| Item | Owner / source | Terms |
| --- | --- | --- |
| Next.js, React, three.js, React Three Fiber, drei | their authors | open-source licences (MIT) |
| Cinzel, Inter, Noto Sans / Serif Sinhala (via Fontsource) | their authors | SIL Open Font Licence |
| `public/models/xbot.glb` ("X Bot") | three.js examples / Adobe Mixamo | check Mixamo's terms; credit Adobe Mixamo when publishing |
| `public/audio/gemunu-theme.mp3` — "Sanda Payanne Maharaja Gemunu" | its artists and rights holders | used with the owner's permission only; not covered by this licence |
| `public/audio/aloko-udapadi.mp3` — "Aloko Udapadi" | its artists and rights holders | used with the owner's permission only; not covered by this licence |
| The story | the Mahavamsa, an ancient Sri Lankan chronicle | public domain; retelling and illustrations are original |

Place locations on the map are approximate; scholars still debate where several Mahavamsa sites stood.

---
© 2026 **Kavindu Bogahawatte** — Designed & developed by Kavindu Bogahawatte. All rights reserved.
