"use client";

import { useEffect, useState } from "react";

/**
 * The fixed chrome that sits over everything: corner brackets, CRT scanlines,
 * a slow sweep, vignette, and a live status strip along the bottom edge.
 * Entirely decorative and inert — `pointer-events: none` throughout.
 */
export default function HudFrame() {
  const [clock, setClock] = useState("--:--:--");
  const [fps, setFps] = useState(60);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setClock(
        [d.getHours(), d.getMinutes(), d.getSeconds()]
          .map((n) => String(n).padStart(2, "0"))
          .join(":"),
      );
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frames = 0;
    let last = performance.now();
    let raf = 0;
    const loop = (now: number) => {
      frames++;
      if (now - last >= 1000) {
        setFps(Math.round((frames * 1000) / (now - last)));
        frames = 0;
        last = now;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="hud-overlay hud-scanlines hud-vignette" aria-hidden="true">
      <div className="hud-sweep" />

      {/* Corner brackets, inset on the 8px baseline */}
      {(
        [
          ["top-4 left-4", "border-t border-l"],
          ["top-4 right-4", "border-t border-r"],
          ["bottom-4 left-4", "border-b border-l"],
          ["bottom-4 right-4", "border-b border-r"],
        ] as const
      ).map(([pos, edge]) => (
        <span
          key={pos}
          className={`absolute ${pos} ${edge} h-6 w-6 border-[var(--color-line-hot)]`}
        />
      ))}

      {/* Bottom status strip */}
      <div className="absolute bottom-0 left-0 right-0 hidden h-8 items-center justify-between border-t border-[var(--color-line)] bg-[color-mix(in_oklab,var(--color-void)_88%,transparent)] px-6 backdrop-blur-sm md:flex">
        <div className="flex items-center gap-6">
          <span className="label label-hot flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 animate-pulse bg-[var(--color-cyan)]" />
            LINK STABLE
          </span>
          <span className="label">BUILD 2.0.0</span>
          <span className="label">PUNE · IST</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="label tnum">{fps} FPS</span>
          <span className="label tnum">{clock}</span>
        </div>
      </div>
    </div>
  );
}
