"use client";

import { useCallback, useState } from "react";
import BootSequence from "@/components/hud/BootSequence";
import Crosshair from "@/components/hud/Crosshair";
import HudFrame from "@/components/hud/HudFrame";
import Nav from "@/components/hud/Nav";
import Hero from "@/components/sections/Hero";
import Dossier from "@/components/sections/Dossier";
import MissionLog from "@/components/sections/MissionLog";
import Loadout from "@/components/sections/Loadout";
import Telemetry from "@/components/sections/Telemetry";
import Comms from "@/components/sections/Comms";
import { OPERATOR } from "@/lib/data";

export default function Page() {
  const [booted, setBooted] = useState(false);
  const onDone = useCallback(() => setBooted(true), []);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <BootSequence onDone={onDone} />
      <Crosshair />
      <HudFrame />
      <Nav />

      <main id="main" data-booted={booted}>
        <Hero />
        <Dossier />
        <MissionLog />
        <Loadout />
        <Telemetry />
        <Comms />
      </main>

      {/* Extra bottom padding clears the mobile tab bar / desktop status strip. */}
      <footer className="border-t border-[var(--color-line)] px-6 pb-28 pt-10 md:pb-16 md:pl-[calc(var(--rail)+32px)] lg:px-10 lg:pl-[calc(var(--rail)+56px)]">
        <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="label">
            {OPERATOR.name} · BUILT WITH NEXT.JS &amp; MOTION
          </p>
          <p className="label tnum">© {new Date().getFullYear()} · PUNE, IN</p>
        </div>
      </footer>
    </>
  );
}
