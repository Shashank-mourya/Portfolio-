"use client";

import { useCallback, useEffect, useState } from "react";

export type Theme = "dark" | "light";

export const THEME_KEY = "hud-theme";

/**
 * Runs before first paint (injected in app/layout.tsx) so the correct palette is
 * on the element for the very first frame — no flash of the wrong theme.
 *
 * Kept as a string so it can be inlined verbatim; it must stay dependency-free
 * and must never throw, since storage can be blocked in private windows.
 */
export const THEME_INIT_SCRIPT = `
(function(){
  try {
    var stored = localStorage.getItem(${JSON.stringify(THEME_KEY)});
    var theme = stored === "light" || stored === "dark"
      ? stored
      : (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {
    document.documentElement.setAttribute("data-theme", "dark");
  }
})();
`;

/**
 * NIGHT / DAY switch.
 *
 * A single toggle with `aria-pressed`, so assistive tech reports the state
 * rather than just the label. The visible text names the *current* theme, the
 * accessible name names the *action* — a control should say what happens when
 * you use it.
 */
export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const current = (document.documentElement.getAttribute("data-theme") ||
      "dark") as Theme;
    setTheme(current);
    setReady(true);

    // Follow the system only while the visitor has not made a choice.
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    const onSystem = (e: MediaQueryListEvent) => {
      let stored: string | null = null;
      try {
        stored = localStorage.getItem(THEME_KEY);
      } catch {
        /* storage unavailable — treat as no stored choice */
      }
      if (stored === "light" || stored === "dark") return;
      const next: Theme = e.matches ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      setTheme(next);
    };
    mq.addEventListener("change", onSystem);
    return () => mq.removeEventListener("change", onSystem);
  }, []);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch {
        /* the theme still applies for this page view */
      }
      return next;
    });
  }, []);

  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={toggle}
      data-cursor="link"
      data-testid="theme-toggle"
      aria-pressed={isLight}
      aria-label={isLight ? "Switch to night theme" : "Switch to day theme"}
      title={isLight ? "Switch to night theme" : "Switch to day theme"}
      className="group flex items-center gap-2.5 border border-[var(--color-line-hot)] px-3 py-2 transition-colors hover:border-[var(--color-cyan)]"
    >
      {/* Two-position switch track — the HUD reading of a toggle. */}
      <span
        aria-hidden="true"
        className="relative block h-3.5 w-7 border border-[var(--color-line-hot)] transition-colors group-hover:border-[var(--color-cyan)]"
      >
        <span
          className="absolute top-[1px] block h-[10px] w-[10px] bg-[var(--color-cyan)] transition-[left] duration-300"
          style={{
            left: isLight ? "calc(100% - 11px)" : "1px",
            transitionTimingFunction: "var(--ease-hud)",
          }}
        />
      </span>
      <span
        className="label tnum w-9 text-left transition-colors group-hover:text-[var(--color-cyan)]"
        // The label is meaningful text, but before hydration we do not yet know
        // the resolved theme, so hold the space without asserting a wrong value.
        style={{ visibility: ready ? "visible" : "hidden" }}
      >
        {isLight ? "DAY" : "NIGHT"}
      </span>
    </button>
  );
}
