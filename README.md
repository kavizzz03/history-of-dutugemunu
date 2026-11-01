<div align="center">

# Dutugemunu
### The Impetuous Prince who United an Island
### දුටුගැමුණු — දිවයින එක් කළ නොඉවසිලිවන්ත කුමාරයා

**An interactive, bilingual (English / සිංහල) retelling of King Dutugemunu's story from the Mahavamsa — with a 3D war-journey map of Sri Lanka, an animated Duel of Kings, and a 360° Hall of Heroes.**

`Next.js 16` · `React 19` · `TypeScript` · `three.js` · `React Three Fiber`

**Idea, design and development: Kavindu Bogahawatte**
© 2026 Kavindu Bogahawatte — All rights reserved. See [LICENSE](./LICENSE).

</div>

---

## Table of contents
1. [About the project](#1-about-the-project)
2. [Ownership](#2-ownership)
3. [Feature tour](#3-feature-tour)
4. [Page structure and reading order](#4-page-structure-and-reading-order)
5. [Technology stack](#5-technology-stack)
6. [Getting started](#6-getting-started)
7. [Project structure](#7-project-structure)
8. [How the system works](#8-how-the-system-works)
   - [8.1 Bilingual system](#81-bilingual-system-english--sinhala)
   - [8.2 Content and data model](#82-content-and-data-model)
   - [8.3 Hall of Heroes (3D characters)](#83-hall-of-heroes-3d-characters)
   - [8.4 Animated characters](#84-animated-characters)
   - [8.5 Kandula the tusker](#85-kandula-the-tusker)
   - [8.6 3D war-journey map](#86-3d-war-journey-map)
   - [8.7 Duel of Kings](#87-duel-of-kings)
   - [8.8 Background music](#88-background-music)
   - [8.9 Navigation, footer and styling](#89-navigation-footer-and-styling)
   - [8.10 Performance and GPU management](#810-performance-and-gpu-management)
9. [Customising the project](#9-customising-the-project)
10. [Deploying to Vercel](#10-deploying-to-vercel)
11. [Troubleshooting](#11-troubleshooting)
12. [Browser and device support](#12-browser-and-device-support)
13. [Historical note](#13-historical-note)
14. [Credits and third-party notices](#14-credits-and-third-party-notices)

---

## 1. About the project
King **Dutugemunu** (Gamani Abhaya, 2nd century BCE) is remembered in the *Mahavamsa* as the Sri Lankan king who defeated the Chola ruler **Elara** at Anuradhapura and united the island. This website turns that chronicle into an experience you can explore instead of just read:

- watch the **golden ship** carrying Princess Viharamahadevi, then follow Dutugemunu's **army and the war elephant Kandula** across a 3D map of Sri Lanka;
- see the **brothers' battle** between Gamani and Prince Tissa;
- watch the **Duel of Kings** at the gates of Anuradhapura, animated frame by frame;
- meet **17 characters** — the king, his mother, his father, the **Ten Giant Warriors**, his rival Elara and Kandula — in a rotatable 3D hall, each with a short and a long biography;
- switch the whole site between **English and Sinhala** at any time.

It was built as a creative, story-first website: every section is meant to be seen, touched and listened to.

## 2. Ownership
This project — **the idea, the concept, the visual design, the page layout, the animations, the 3D scenes, the character artwork and the source code** — was created entirely by **Kavindu Bogahawatte**, who is its sole owner. Nobody may copy, reuse, redistribute or sell any part of it without his written permission. Full terms: [LICENSE](./LICENSE).
Third-party items (libraries, fonts, the base body model, the two songs) keep their own owners and licences — see [section 14](#14-credits-and-third-party-notices).

## 3. Feature tour

| Section | What you see | What you can do |
| --- | --- | --- |
| **Hero** | Title in gold, glowing sun, rising embers, a turning wheel behind an arched portrait of Dutugemunu, Viharamahadevi and Kandula, and a stupa skyline | Start the story or jump to the 3D map; switch language |
| **Ribbon** | A slow marquee of key names (Mahavamsa, Anuradhapura, Ruhuna, Kandula, Ten Giants…) | — |
| **01 · Chronicle** | A timeline of five chapters of the king's life, from prophecy to legacy | Scroll; cards lift on hover |
| **02 · Heroes** | **Hall of Heroes**: all characters stand on plinths in a 3D ring. Below it, a filterable card gallery | Drag to spin the ring, click a hero to zoom in, drag again to turn them 360°, step with ‹ ›, read the full story in a modal with its own 3D viewer, filter by group (royal / giants / foes / companions) |
| **03 · 3D War Map** | The island in 3D with terrain, sea, the Mahaweli river, route line, 8 numbered stages and the sacred city | Rotate, zoom, tap pins, press **Play journey**, toggle music |
| **04 · Duel of Kings** | A full SVG animation of Dutugemunu on Kandula against Elara on his elephant | Play / pause / replay, scrub the timeline, jump between 6 story beats, toggle music |
| **05 · Great Works** | The monuments built after the war and the honour paid to Elara | Read |
| **Legacy** | A closing call-to-action | Jump back to the heroes or the duel |
| **Footer** | Brand, section links, project facts, language switch, credit and back-to-top | — |

## 4. Page structure and reading order
The page is a single route (`app/page.tsx`) whose order follows the story:

```
Nav ─ fixed bar with numbered links, scroll-progress line and language switch
Hero
Ribbon
01 Story      → what happened
   Ornament
02 Heroes     → who was there
   Ornament
03 JourneyMap → where it happened
   Ornament
04 Duel       → the climax
   Ornament
05 Works      → what came after
Legacy
Footer
```

Section numbers (01–05) are generated by a CSS counter, so reordering sections renumbers them automatically.

## 5. Technology stack

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | **Next.js 16** (App Router, Turbopack) | Fast dev server, easy Vercel deployment |
| UI | **React 19** + **TypeScript** | Typed components and data |
| 3D | **three.js**, **@react-three/fiber**, **@react-three/drei** | Declarative 3D in React; `useGLTF`, `OrbitControls`, `Sparkles`, `Stars` |
| 2D animation | Hand-written **SVG** driven by one `time` value | Frame-accurate, resolution independent duel |
| Styling | One global stylesheet (`app/globals.css`) with CSS variables | No styling runtime, tiny and fast |
| Fonts | **Fontsource**: Cinzel, Inter, Noto Sans Sinhala, Noto Serif Sinhala | Self-hosted; correct Sinhala rendering |
| Audio | Native `HTMLAudioElement` via a small hook | No audio library needed |

No database, no backend and no API keys: it is a fully static front-end.

## 6. Getting started

**Requirements:** Node.js 20 or newer and npm.

```bash
npm install          # install dependencies
npm run dev          # development server → http://localhost:3000
npm run build        # production build (also type-checks)
npm start            # serve the production build
```

Scripts: `dev` → `next dev`, `build` → `next build`, `start` → `next start`.
`scripts/extract-lk.mjs` is the one-off helper that was used to prepare the Sri Lanka outline data in `lib/lk-outline.json`; you do not need to run it.

## 7. Project structure

```
dutugemunu/
├─ app/
│  ├─ layout.tsx          # <html>, metadata, font imports
│  ├─ page.tsx            # page order (Nav → Hero → … → Footer)
│  └─ globals.css         # every style: theme variables, sections, 3D UI, footer
├─ components/
│  ├─ Nav.tsx             # fixed header, active section, scroll progress, language switch
│  ├─ Hero.tsx            # landing section with SVG portraits and skyline
│  ├─ Extras.tsx          # Ribbon marquee, Ornament divider, Legacy closing band
│  ├─ Story.tsx           # five-chapter timeline
│  ├─ Heroes.tsx          # gallery + filters + modal; mounts the 3D hall when near
│  ├─ HeroStage.tsx       # the 3D ring of characters (camera, drag, selection)
│  ├─ ModelViewer.tsx     # single-character 3D viewer inside the modal
│  ├─ Figure.tsx          # picks the right 3D body: Kandula, custom .glb, or animated person
│  ├─ AnimatedPerson.tsx  # skeleton-animated human with costume mounted on bones
│  ├─ Figure3D.tsx        # procedural costume parts (heads, weapons, shields…) and fallback body
│  ├─ Elephant.tsx        # articulated, animated Kandula
│  ├─ Avatar.tsx          # 2D SVG portraits used in cards and hero
│  ├─ JourneyMap.tsx      # stage list, side panel, toolbar, music, autoplay, recovery
│  ├─ Map3D.tsx           # the 3D map scene (sea, land, terrain, river, route, markers, camera)
│  ├─ MapActors.tsx       # ship, army, soldiers, brothers' battle, duel marker, compass
│  ├─ Duel.tsx            # SVG animation of the duel and its controls
│  ├─ Works.tsx           # great works section
│  ├─ Reveal.tsx          # fade-in on scroll wrapper
│  └─ Footer.tsx          # professional footer with credit
├─ lib/
│  ├─ i18n.tsx            # language context, `t()` helper, storage
│  ├─ ui.ts               # all interface strings (EN + SI)
│  ├─ story.ts            # chronicle chapters
│  ├─ characters.ts       # 17 characters: bios, stats, look (AvatarCfg)
│  ├─ journey.ts          # 9 map stages, march nodes, map projection
│  ├─ places.ts           # Mahaweli river path, sacred-city places, map strings
│  ├─ duel.ts             # duel beats and strings
│  ├─ stage.ts            # Hall of Heroes strings
│  ├─ terrain.ts          # elevation, colours, land test from the island outline
│  ├─ lk-outline.json     # simplified Sri Lanka coastline
│  └─ useMusic.ts         # background-music hook (fade, browser-autoplay handling)
├─ public/
│  ├─ models/xbot.glb     # animated human skeleton (see credits)
│  ├─ models/characters/  # optional drop-in realistic models + manifest.json
│  └─ audio/              # background songs
├─ scripts/extract-lk.mjs # one-off data preparation script
├─ data/                  # early draft data (excluded from the build)
├─ LICENSE · README.md · next.config.mjs · tsconfig.json · package.json
```

## 8. How the system works

### 8.1 Bilingual system (English / Sinhala)
- Every piece of text is stored as a small object `{ en: "…", si: "…" }` (type `L`).
- `lib/i18n.tsx` provides `LangProvider`; any component calls `const { t, lang, setLang } = useLang()` and writes `t(text)` to get the current language.
- The chosen language is saved in `localStorage` (`dg-lang`) and applied to `<html data-lang="…">`. CSS reacts to it: Sinhala gets Noto fonts, looser line height and no forced uppercase / letter-spacing.
- Language buttons live in the top bar and in the footer. The 3D map labels, the duel captions and the music buttons all follow the language.
- To add or edit text, change the matching `{ en, si }` pair in `lib/*.ts` — there is no other translation file.

### 8.2 Content and data model
All content lives in `lib/` and is plain TypeScript, so it is type-checked.

- **Characters** (`lib/characters.ts`): `id`, `group` (`royal | giant | foe | companion`), bilingual `name`, `title`, `short` and `long` biographies, four illustrative `stats` (strength, speed, skill, loyalty — for fun, not from the chronicle) and an `avatar` configuration (`AvatarCfg`): skin, hair, outfit and accent colours, headgear (`crown | helmet | topknot | headdress | turban | bald | royalturban`), beard, weapon (`spear | bow | sword | mace | club | shield`), build, age, scars, and flags such as `female` or `monkSoon`.
  *One configuration drives three renderings:* the 2D SVG portrait, the animated 3D person and the modal viewer — so changing a colour or weapon updates everywhere.
- **Journey** (`lib/journey.ts`): 9 `Stage` records — latitude/longitude, bilingual place/title/text, year, kind (`origin | base | exile | battle | siege | capital`), whether the army is shown and which march node it has reached. It also defines the map projection `project(lon, lat)`.
- **Places** (`lib/places.ts`): the Mahaweli river waypoints and the sacred-city sites (southern gate, Elara's tomb, Ruwanwelisaya, Tissa Wewa…).
- **Duel** (`lib/duel.ts`): the six story beats with start times, and the captions.

### 8.3 Hall of Heroes (3D characters)
`Heroes.tsx` → `HeroStage.tsx` → `Figure.tsx`.

1. The characters are placed on a circle (`radius ≈ count × 1.9 / 2π`), each on its own plinth with a glowing ring in its group colour.
2. **Overview mode:** the ring slowly turns by itself; the camera looks at the whole circle. Dragging adds momentum that eases off.
3. **Selection mode:** clicking a hero rotates the ring so that hero faces you, moves the camera in, and enlarges them. Dragging now turns *that character* a full 360°.
4. `‹ ›` buttons step through heroes; a panel shows name, title and summary, with buttons to *Look closer*, go back to *all*, or open the *full story*.
5. The modal shows the long biography, the illustrative "legend meter" and a **single-character 3D viewer** (`ModelViewer.tsx`) with OrbitControls and auto-rotate.
6. Clicks are distinguished from drags (movement threshold) so spinning never selects by accident, and each figure has an invisible hit-capsule so thin limbs are easy to tap.

### 8.4 Animated characters
`AnimatedPerson.tsx` gives every human a believable, moving body.

- **Skeleton:** `public/models/xbot.glb` (a Mixamo-style humanoid) provides real human proportions and animation clips (`idle`, `agree`, `headShake`). Each character gets its own clone (`SkeletonUtils.clone`) and its own `AnimationMixer`, started at a different phase so the crowd never moves in unison.
- **Individuality:** skin tone is tinted per character; body width and height follow `build`, `age` and `female`.
- **Costume on the bones:** clothing and equipment are *not* baked in. They are small groups attached to bones — hips (dhoti or long skirt, belt), spine (tunic, armour, sash, cape), upper arms (sleeves, shoulder plates), head (skull, face, hair, beard, crown/helmet/turban) and hands (spear, sword, mace, club, shield, bow). Their mount matrices are computed from the idle pose so they stay perfectly aligned while the body moves. React portals (`createPortal`) place them into the skeleton.
- **Gestures:** when a hero is selected they nod now and then; the royal cape sways.
- **Fallback:** while the model loads, a lighter procedural figure (`Person` in `Figure3D.tsx`) is shown.
- **Your own models:** if `public/models/characters/manifest.json` lists a character id and `<id>.glb` exists, that model replaces the built-in body (auto-scaled to ~1.8 m, standing on the plinth, idle animation played).

### 8.5 Kandula the tusker
`Elephant.tsx` is a fully procedural, articulated elephant (no model file):
- body built from layered ellipsoids; a procedural **wrinkle bump-map** drawn on a canvas gives skin texture;
- a **10-joint trunk chain** whose joints bend in a travelling wave, so it sways like a real trunk;
- ears hinged at the temple that flap, eyes that blink every few seconds, a nodding head, a breathing torso, a tail made of four joints that swishes;
- four legs in two-part (thigh + shin) form that march in diagonal pairs;
- ivory tusks, toenails, a red-and-gold ceremonial caparison with swaying side drapes and a gold forehead plate.
It accepts a `cloth` colour (used for Elara's elephant in blue-green) and a `pace` value so the gait quickens when the army marches.

### 8.6 3D war-journey map
`JourneyMap.tsx` (UI and state) + `Map3D.tsx` (scene) + `MapActors.tsx` (moving things).

**World building**
- The island outline (`lk-outline.json`) is smoothed and used to build land, a shaded **terrain** (central highlands raised, colours by elevation), and an animated shader **sea**.
- The **Mahaweli river** is a glowing animated ribbon following real waypoints to the sea.
- A **route line** joins the marching nodes; the part already travelled turns bright gold.
- A **compass rose**, glowing pins with a light beam on the selected stage, and a drifting sparkle effect add atmosphere.
- Pin labels are plain HTML placed each frame from projected 3D positions (cheaper and safer than 3D text).

**The nine stages**
1. *The golden boat* — Kalyani (Kelaniya)
2. *A prince is born* — Magama, Ruhuna
3. *Exile in the hills* — Malaya hill country
4. *Brother against brother* — Kulanganiya Pitti
5. *Crossing the Mahaweli* — Mahiyangana
6. *Fortress after fortress* — Ambatthakola (approx.)
7. *The great siege* — Vijithapura (approx.)
8. *Duel of kings* — Anuradhapura
9. *The king becomes a builder* — Anuradhapura, the sacred city

**Moving actors**
- **Golden ship of Viharamahadevi:** a crimson-and-gold hull, swan-shaped prow and tail, a pavilion with a gold roof and tassels, a sail with a golden sun, eight rowing oars, lanterns, a wake, and the princess in a pink gown with a halo of light standing under the canopy. In stage 1 the camera follows the ship across the sea.
- **Army:** Kandula carrying the king, with banners and 36 soldiers marching in columns. Soldiers are *instanced* parts (legs, torso, head, helmet, spear, spear-tip, shield) animated from one clock: legs swing from the hip, bodies bob, spears are carried.
- **Smooth movement:** the army accelerates, cruises and glides to a stop (velocity easing, not a jump), and the camera follows it with exponential damping; when it stops, the camera settles on the stage view.
- **Brothers' battle:** at Kulanganiya two hosts — Gamani's crimson and Prince Tissa's teal — clash with lunging spears, flashes of light, sparks and dust; it intensifies when that stage is selected.
- **Duel marker:** two tuskers charge at Anuradhapura's southern gate with a spark on impact. A red label "Duel of Kings — Watch the animation" (and the tuskers themselves) scroll you to the Duel section.

**Autoplay:** *Play journey* advances through the stages, lingering as long as each scene needs (the ship's voyage and marches get the longest). The side panel text changes with the stage; manual controls (overview, previous, next, step list, pins) stop autoplay.

### 8.7 Duel of Kings
`Duel.tsx` is a 2D SVG animation controlled by **one number: time**.
- Everything on screen (elephant gaits, rider poses, javelins, dust, banners, the clash flash, the pyre and the tomb) is a *pure function of `t`*, drawn each frame by a `requestAnimationFrame` loop.
- Because of that, **scrubbing the slider, replaying or jumping to a story beat** always shows the correct frame.
- Six beats: *The challenge* → *Elara strikes first* → *Kandula charges* → *The king's javelin* → *Elara falls* → *Honour for a worthy foe* (pyre and tomb).
- Labels follow the elephants; the camera shakes briefly on impact; reduced-motion users start paused.
- It only runs while on screen (IntersectionObserver).

### 8.8 Background music
`lib/useMusic.ts` is a small hook used by the map; the duel uses the same behaviour.
- **Duel:** `gemunu-theme.mp3` plays while the duel animation is playing and visible.
- **Map:** `aloko-udapadi.mp3` plays while *Play journey* is running and the map is visible.
- Volume fades in and out; music stops when you pause or scroll away; it loops.
- Browsers refuse sound before a user gesture. If that happens the button shows **"Tap for music"** and playback starts on the next click or key press.
- Each section has a ♪ toggle.

### 8.9 Navigation, footer and styling
- **Nav:** transparent over the hero, blurred dark when scrolled; numbered links highlight the section you are in; a gold progress line shows how far down the page you are.
- **Reveal:** content fades up once as it enters the screen.
- **Theme:** CSS variables in `:root` (`--gold`, `--crimson`, `--panel`, `--ink`, …) — change them to re-skin the whole site. Gold-on-dark palette inspired by temple murals and royal banners.
- **Section details:** big outlined section numbers, gold-gradient headings, per-section ambient glow, ornamental dividers, corner frames on the map.
- **Footer:** brand, links, project facts, language switch, a credit bar "Designed & developed by Kavindu Bogahawatte" (always in English) and a back-to-top button, with a dagoba skyline and drifting embers.
- **Responsive:** layouts collapse to one column under ~860 px; the map toolbar wraps on phones; 3D cameras pull back on narrow screens.
- **Accessibility:** semantic landmarks, `aria` labels on controls, visible focus rings, and `prefers-reduced-motion` support.

### 8.10 Performance and GPU management
Three heavy 3D scenes exist (hall, map, modal viewer). To keep the site smooth and the map reliable:
- 3D scenes are **loaded lazily** (`next/dynamic`, `ssr: false`) and only built when their section is near the viewport.
- The Hall of Heroes and the map are **torn down when far away**, so only one large WebGL scene is alive at a time (browsers limit GPU contexts).
- The map **pauses rendering** when not on screen (`frameloop="never"`).
- If the browser drops the WebGL context, the map **rebuilds itself**; if loading takes more than 12 s a **"Tap to load the map"** button appears; the map's code chunk is retried once if the download fails.
- Soldiers are drawn with **instanced meshes** (8 draw calls for the whole army).
- Pixel ratio is capped (`dpr` ≤ 1.6–1.75).

## 9. Customising the project

| I want to… | Edit |
| --- | --- |
| Change any wording or translate it | the `{ en, si }` text in `lib/ui.ts`, `story.ts`, `characters.ts`, `journey.ts`, `places.ts`, `duel.ts`, `stage.ts` |
| Add or change a character | `lib/characters.ts` (append an entry with an `avatar` config; the 2D card, 3D ring and modal update automatically) |
| Change a character's look | its `avatar` fields: colours, `head`, `beard`, `weapon`, `build`, `age` |
| Use a realistic model for a hero | put `<id>.glb` in `public/models/characters/` and list the id in `manifest.json` |
| Add a map stage | add a `Stage` in `lib/journey.ts` (update `MARCH_STAGE_IDS` if the army marches there) |
| Add a sacred-city site | add a `Place` in `lib/places.ts` |
| Change the duel timing | beats in `lib/duel.ts` and timing constants at the top of `components/Duel.tsx` |
| Replace a song | overwrite the file in `public/audio/` (keep the file name or update the path in `Duel.tsx` / `JourneyMap.tsx`) |
| Re-colour the site | CSS variables at the top of `app/globals.css` |
| Change the footer credit | `footer` block in `lib/ui.ts` |
| Reorder sections | `app/page.tsx` (numbers update by themselves) |

After editing, run `npm run build` once — it type-checks everything.

## 10. Deploying to Vercel
1. Push the project to a GitHub repository.
2. On vercel.com choose **Add New → Project**, import the repository.
3. Keep the detected settings (Framework: Next.js, build command `next build`) and deploy. No environment variables are required.
4. Every push to the main branch redeploys automatically.

Notes: audio and model files in `public/` are served as static assets; the 3D body model is about 3 MB and the songs (about 1.5 MB and 3 MB) only download when played, so a fast host/CDN (Vercel's) helps. `next.config.mjs` pins `turbopack.root` so a stray `package-lock.json` in a parent folder is ignored.

## 11. Troubleshooting

| Problem | Cause and fix |
| --- | --- |
| Map shows "Raising the island…" for a long time | Slow network or a busy GPU. After 12 s a **Tap to load the map** button appears; press it. Reloading also works. |
| Map blank after a long idle | Browser dropped the WebGL context; the map rebuilds itself, or use the button above. |
| No music | Browsers need a click first. Press the ♪ button or click anywhere, then press *Play journey* / play the duel. Make sure music is not toggled off. |
| `THREE.Clock … deprecated` in the console | A harmless notice from a library dependency. |
| "Next.js ignored package-lock.json …" warning | Already handled by `turbopack.root` in `next.config.mjs`; delete stray lockfiles in parent folders if it persists. |
| Sinhala text looks wrong | Make sure the Fontsource packages installed (`npm install`) and that the language switch is on සිං. |
| 3D is slow on an old phone | Use *Portrait* view in the Heroes section (2D cards), or a newer device. |

## 12. Browser and device support
Modern evergreen browsers with WebGL 2 — Chrome, Edge, Firefox, Safari (desktop and mobile). Touch is supported: drag to rotate, pinch to zoom the map. Without WebGL the 2D portraits, chronicle and duel animation still work.

## 13. Historical note
The story follows the *Mahavamsa*; some details come from later tradition. Place locations on the map (for example Vijithapura, Ambatthakola and Kulanganiya Pitti) are approximate — scholars still debate where they stood. The "legend meter" values for each character are illustrative, for fun, and are not from the chronicle. All illustrations and 3D figures are original artwork.

## 14. Credits and third-party notices
Ownership in section 2 applies to the original work only. These items belong to others:

| Item | Owner / source | Terms |
| --- | --- | --- |
| Next.js, React, three.js, React Three Fiber, drei | their authors | open-source licences (MIT) |
| Cinzel, Inter, Noto Sans / Serif Sinhala (via Fontsource) | their authors | SIL Open Font Licence |
| `public/models/xbot.glb` ("X Bot") | three.js examples / Adobe Mixamo | check Mixamo's terms; credit Adobe Mixamo when publishing |
| `public/audio/gemunu-theme.mp3` — "Sanda Payanne Maharaja Gemunu" | its artists and rights holders | used with the owner's permission only; not covered by this licence |
| `public/audio/aloko-udapadi.mp3` — "Aloko Udapadi" | its artists and rights holders | used with the owner's permission only; not covered by this licence |
| The story | the Mahavamsa, an ancient Sri Lankan chronicle | public domain; retelling and illustrations are original |

---

<div align="center">

**Designed & developed by Kavindu Bogahawatte**
© 2026 Kavindu Bogahawatte. All rights reserved.

</div>