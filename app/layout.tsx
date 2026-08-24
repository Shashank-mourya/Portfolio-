import type { Metadata, Viewport } from "next";
import { Chakra_Petch, Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { OPERATOR } from "@/lib/data";
import { THEME_INIT_SCRIPT } from "@/components/hud/ThemeToggle";

const chakra = Chakra_Petch({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-chakra",
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter-tight",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${OPERATOR.name} — ${OPERATOR.role}`,
  description:
    "Portfolio of Shashank Mourya — AI systems engineer working in computer vision, forensic ML and real-time systems. C++17, Python, TypeScript.",
  keywords: [
    "Shashank Mourya",
    "AI Systems Engineer",
    "Computer Vision",
    "XGBoost",
    "MMCOE Pune",
    "QA Automation",
  ],
  authors: [{ name: OPERATOR.name }],
  openGraph: {
    title: `${OPERATOR.name} — ${OPERATOR.role}`,
    description: OPERATOR.tagline,
    type: "profile",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#08090C" },
    { media: "(prefers-color-scheme: light)", color: "#EEF1F5" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${chakra.variable} ${interTight.variable} ${jetbrains.variable}`}
      // The init script stamps data-theme before paint, so the server-rendered
      // markup deliberately differs from the first client attribute set.
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
