"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const LINES = [
  "POST ........................ OK",
  "MOUNT /operator/shashank .... OK",
  "LOAD vision.kernel .......... OK",
  "LOAD forensics.xgb .......... OK",
  "VERIFY telemetry signature .. OK",
  "HANDSHAKE ................... ESTABLISHED",
];

/**
 * A short cold-boot before the page hands over. It is skippable with any key or
 * click, runs once per tab (sessionStorage), and is skipped outright when the
 * visitor prefers reduced motion — nobody should be made to wait for a flourish.
 */
export default function BootSequence({ onDone }: { onDone: () => void }) {
  const [shown, setShown] = useState(0);
  const [open, setOpen] = useState(true);
  const finished = useRef(false);

  const finish = useRef(() => {
    if (finished.current) return;
    finished.current = true;
    setOpen(false);
    window.setTimeout(onDone, 420);
  });

  useEffect(() => {
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = sessionStorage.getItem("hud-booted") === "1";
    if (still || seen) {
      finished.current = true;
      setOpen(false);
      onDone();
      return;
    }
    sessionStorage.setItem("hud-booted", "1");

    const step = window.setInterval(() => {
      setShown((n) => {
        if (n >= LINES.length) {
          window.clearInterval(step);
          window.setTimeout(() => finish.current(), 320);
          return n;
        }
        return n + 1;
      });
    }, 150);

    const skip = () => finish.current();
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    const hardStop = window.setTimeout(skip, 3200);

    return () => {
      window.clearInterval(step);
      window.clearTimeout(hardStop);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, [onDone]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          data-testid="boot-sequence"
          className="fixed inset-0 z-[400] flex items-center justify-center bg-[var(--color-void)] px-6"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="w-full max-w-md">
            <div className="mb-6 flex items-baseline justify-between border-b border-[var(--color-line)] pb-3">
              <span className="display text-lg tracking-[0.2em] text-[var(--color-ink)]">
                SHASHANK
              </span>
              <span className="label label-hot">COLD BOOT</span>
            </div>
            <div className="min-h-[132px] font-[family-name:var(--font-mono)] text-[11px] leading-[22px] text-[var(--color-ink-dim)]">
              {LINES.slice(0, shown).map((line) => (
                <div key={line} className="flex justify-between gap-4">
                  <span>{line.split(" ")[0]}</span>
                  <span className="flex-1 overflow-hidden text-[var(--color-line-hot)]">
                    {line.slice(line.indexOf(" ") + 1, line.lastIndexOf(" "))}
                  </span>
                  <span className="text-[var(--color-cyan)]">
                    {line.slice(line.lastIndexOf(" ") + 1)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-6 h-px w-full bg-[var(--color-line)]">
              <motion.div
                className="h-px bg-[var(--color-cyan)]"
                initial={{ width: "0%" }}
                animate={{ width: `${(shown / LINES.length) * 100}%` }}
                transition={{ duration: 0.15, ease: "linear" }}
              />
            </div>
            <p className="label mt-3 text-right">PRESS ANY KEY TO SKIP</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
