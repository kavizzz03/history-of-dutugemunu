import type { Metadata, Viewport } from "next";
import "@fontsource/cinzel/500.css";
import "@fontsource/cinzel/700.css";
import "@fontsource/cinzel/900.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/noto-sans-sinhala/400.css";
import "@fontsource/noto-sans-sinhala/500.css";
import "@fontsource/noto-sans-sinhala/700.css";
import "@fontsource/noto-serif-sinhala/500.css";
import "@fontsource/noto-serif-sinhala/700.css";
import "@fontsource/noto-serif-sinhala/900.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dutugemunu · දුටුගැමුණු — The King Who United Sri Lanka",
  description:
    "An interactive, bilingual (English / සිංහල) journey through the story of King Dutugemunu: his ten giant warriors, the war elephant Kandula, and a 3D map of the campaign across Sri Lanka.",
};

export const viewport: Viewport = { themeColor: "#0c0907", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-lang="en">
      <body>{children}</body>
    </html>
  );
}
