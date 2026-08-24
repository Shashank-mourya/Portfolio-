"use client";

import { useEffect, useRef, useState } from "react";

type CursorMode = "idle" | "link" | "target" | "text";

/**
 * Valorant-style crosshair cursor.
 *
 * The whole layer is `pointer-events: none` and lives in a fixed container, so
 * it can never intercept a click — that is asserted in the e2e suite.
 *
 * Elements opt into a mode with `data-cursor="link|target|text"`. The `target`
 * mode is the signature: the reticle rotates 45deg, flips to magenta and throws
 * corner brackets, the way a game marks a lock.
 */
export default function Crosshair() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<CursorMode>("idle");
  const [visible, setVisible] = useState(false);
  const [down, setDown] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Only take over the cursor on a precise pointer with motion allowed.
    const fine = window.matchMedia("(pointer: fine)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches) return;

    setEnabled(true);
    document.documentElement.classList.add("hud-cursor");

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { ...target };
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      setVisible(true);

      const el = (e.target as HTMLElement | null)?.closest?.("[data-cursor]");
      const next = (el?.getAttribute("data-cursor") as CursorMode) ?? "idle";
      setMode((prev) => (prev === next ? prev : next));
    };

    const tick = () => {
      // The dot is exact; the ring trails it. Instant when motion is reduced.
      const k = still.matches ? 1 : 0.22;
      ring.x += (target.x - ring.x) * k;
      ring.y += (target.y - ring.y) * k;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);
    const onDown = () => setDown(true);
    const onUp = () => setDown(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
      document.documentElement.classList.remove("hud-cursor");
    };
  }, []);

  if (!enabled) return null;

  const isTarget = mode === "target";
  const isLink = mode === "link";
  const isText = mode === "text";

  const accent = isTarget ? "var(--color-magenta)" : "var(--color-cyan)";
  // Gap between the reticle arms — opens up on hover, snaps in on click.
  const gap = isTarget ? 16 : isLink ? 11 : 6;
  const arm = isTarget ? 12 : isLink ? 9 : 7;
  const ringSize = isTarget ? 62 : isLink ? 40 : 30;

  return (
    <div className="crosshair-layer" data-testid="crosshair" aria-hidden="true">
      {/* Trailing ring / lock frame */}
      <div
        ref={ringRef}
        className="absolute left-0 top-0"
        style={{
          width: ringSize,
          height: ringSize,
          opacity: visible ? (isText ? 0 : 1) : 0,
          transition: "width 220ms var(--ease-hud), height 220ms var(--ease-hud), opacity 200ms linear",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            color: accent,
            transform: `rotate(${isTarget ? 45 : 0}deg) scale(${down ? 0.86 : 1})`,
            transition: "transform 260ms var(--ease-hud)",
          }}
        >
          {/* Four corner brackets — the lock indicator. */}
          {(
            [
              ["top-0 left-0", "border-t border-l"],
              ["top-0 right-0", "border-t border-r"],
              ["bottom-0 left-0", "border-b border-l"],
              ["bottom-0 right-0", "border-b border-r"],
            ] as const
          ).map(([pos, edge]) => (
            <span
              key={pos}
              className={`absolute ${pos} ${edge}`}
              style={{
                width: isTarget ? 12 : 8,
                height: isTarget ? 12 : 8,
                borderColor: "currentColor",
                opacity: isTarget ? 1 : 0.55,
                transition: "opacity 200ms linear",
              }}
            />
          ))}
        </div>
      </div>

      {/* Reticle: centre dot + four arms */}
      <div
        ref={dotRef}
        className="absolute left-0 top-0"
        style={{ opacity: visible && !isText ? 1 : 0, transition: "opacity 200ms linear" }}
      >
        <div style={{ position: "relative", width: 0, height: 0, color: accent }}>
          <span
            style={{
              position: "absolute",
              width: 2,
              height: 2,
              background: "currentColor",
              transform: "translate(-50%, -50%)",
            }}
          />
          {/* top / bottom / left / right arms */}
          <span style={armStyle("v", -gap - arm, arm)} />
          <span style={armStyle("v", gap, arm)} />
          <span style={armStyle("h", -gap - arm, arm)} />
          <span style={armStyle("h", gap, arm)} />
        </div>
      </div>
    </div>
  );
}

function armStyle(axis: "v" | "h", offset: number, len: number): React.CSSProperties {
  const base: React.CSSProperties = {
    position: "absolute",
    background: "currentColor",
    transition: "all 200ms var(--ease-hud)",
  };
  return axis === "v"
    ? { ...base, width: 2, height: len, left: 0, top: offset, transform: "translateX(-50%)" }
    : { ...base, height: 2, width: len, top: 0, left: offset, transform: "translateY(-50%)" };
}
