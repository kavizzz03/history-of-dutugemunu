"use client";

import { LangProvider } from "@/lib/i18n";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Story from "@/components/Story";
import Heroes from "@/components/Heroes";
import JourneyMap from "@/components/JourneyMap";
import Duel from "@/components/Duel";
import Works from "@/components/Works";
import Footer from "@/components/Footer";
import { Legacy, Ornament, Ribbon } from "@/components/Extras";

/* the reading order follows the story:
   hero → chronicle (what happened) → the cast → the war journey → the duel (climax) → the great works → legacy */
export default function Page() {
  return (
    <LangProvider>
      <Nav />
      <main>
        <Hero />
        <Ribbon />
        <Story />
        <Ornament />
        <Heroes />
        <Ornament />
        <JourneyMap />
        <Ornament />
        <Duel />
        <Ornament />
        <Works />
        <Legacy />
      </main>
      <Footer />
    </LangProvider>
  );
}
