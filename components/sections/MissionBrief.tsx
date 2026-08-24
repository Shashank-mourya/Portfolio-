"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Mission } from "@/lib/data";

const ACCENT: Record<Mission["accent"], string> = {
  cyan: "var(--color-cyan)",
  magenta: "var(--color-magenta)",
  amber: "var(--color-amber)",
};

/**
 * Full-screen mission briefing.
 *
 * A real modal dialog: focus moves in on open and returns on close, Escape
 * dismisses, Tab is trapped inside, and the page behind is inert to scroll.
 * The game-feel is in the scan-in, not in skipping the accessibility work.
 */
export default function MissionBrief({
  mission,
  onClose,
}: {
  mission: Mission | null;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreTo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!mission) return;

    restoreTo.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Move focus into the dialog once it exists.
    const raf = requestAnimationFrame(() => {
      panelRef.current
        ?.querySelector<HTMLElement>("[data-autofocus]")
        ?.focus();
    });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;

      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      restoreTo.current?.focus?.();
    };
  }, [mission, onClose]);

  return (
    <AnimatePresence>
      {mission && (
        <motion.div
          className="fixed inset-0 z-[250] flex items-end justify-center sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
        >
          <button
            type="button"
            aria-label="Close briefing"
            tabIndex={-1}
            onClick={onClose}
            className="absolute inset-0 bg-[color-mix(in_oklab,var(--color-void)_88%,transparent)] backdrop-blur-sm"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="brief-title"
            data-testid="mission-brief"
            initial={{ y: 28, opacity: 0, scaleY: 0.97 }}
            animate={{ y: 0, opacity: 1, scaleY: 1 }}
            exit={{ y: 16, opacity: 0, scaleY: 0.99 }}
            transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
            className="thin-scroll relative max-h-[92svh] w-full max-w-3xl overflow-y-auto border border-[var(--color-line-hot)] bg-[var(--color-panel)] sm:max-h-[86svh]"
            style={{ borderTopColor: ACCENT[mission.accent] }}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-[var(--color-line)] bg-[var(--color-panel)] px-6 py-4 md:px-8">
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <span className="label tnum">{mission.index}</span>
                  <span
                    className="label"
                    style={{ color: ACCENT[mission.accent] }}
                  >
                    {mission.codename}
                  </span>
                </div>
                <h3
                  id="brief-title"
                  className="display mt-2 truncate text-[26px] text-[var(--color-ink)] md:text-[32px]"
                >
                  {mission.name}
                </h3>
              </div>
              <button
                type="button"
                data-autofocus
                data-cursor="link"
                data-testid="mission-brief-close"
                onClick={onClose}
                className="label shrink-0 border border-[var(--color-line-hot)] px-3.5 py-2.5 text-[var(--color-ink-dim)] transition-colors hover:border-[var(--color-magenta)] hover:text-[var(--color-magenta)]"
              >
                CLOSE ESC
              </button>
            </div>

            <div className="px-6 py-7 md:px-8 md:py-8">
              <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-[var(--color-ink-faint)]">
                {mission.classification}
              </p>

              <p className="mt-5 text-[17px] leading-[1.6] text-[var(--color-ink)]">
                {mission.summary}
              </p>

              {/* Readout strip */}
              <dl className="mt-8 grid grid-cols-1 gap-px border border-[var(--color-line)] bg-[var(--color-line)] sm:grid-cols-3">
                {mission.metrics.map((met) => (
                  <div key={met.label} className="bg-[var(--color-deep)] px-5 py-4">
                    <dt className="label">{met.label}</dt>
                    <dd
                      className="tnum mt-2 font-[family-name:var(--font-mono)] text-[15px]"
                      style={{ color: ACCENT[mission.accent] }}
                    >
                      {met.value}
                    </dd>
                  </div>
                ))}
              </dl>

              {/* Objectives */}
              <h4 className="label label-hot mt-10">OBJECTIVES</h4>
              <ul className="mt-4 space-y-4">
                {mission.brief.map((line, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="label tnum mt-1 shrink-0 text-[var(--color-ink-faint)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[15px] leading-[1.7] text-[var(--color-ink-dim)]">
                      {line}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Loadout */}
              <h4 className="label label-hot mt-10">STACK</h4>
              <ul className="mt-4 flex flex-wrap gap-2">
                {mission.stack.map((t) => (
                  <li
                    key={t}
                    className="border border-[var(--color-line-hot)] px-3 py-1.5 font-[family-name:var(--font-mono)] text-[11px] text-[var(--color-ink-dim)]"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
