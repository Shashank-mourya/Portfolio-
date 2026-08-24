"use client";

import { useEffect, useState } from "react";

/**
 * Types a phrase in, holds, deletes, moves to the next. When motion is reduced
 * it renders the first phrase as plain static text.
 *
 * The live region is `off` deliberately: this is atmosphere, and announcing
 * every character would be hostile to screen reader users. The full phrase list
 * is exposed once in visually-hidden text instead.
 */
export default function Typewriter({
  phrases,
  typeMs = 45,
  deleteMs = 22,
  holdMs = 1900,
}: {
  phrases: string[];
  typeMs?: number;
  deleteMs?: number;
  holdMs?: number;
}) {
  const [still, setStill] = useState(true);
  const [i, setI] = useState(0);
  const [n, setN] = useState(0);
  const [erasing, setErasing] = useState(false);

  useEffect(() => {
    setStill(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (still) return;
    const phrase = phrases[i % phrases.length];

    if (!erasing && n === phrase.length) {
      const t = window.setTimeout(() => setErasing(true), holdMs);
      return () => window.clearTimeout(t);
    }
    if (erasing && n === 0) {
      setErasing(false);
      setI((v) => (v + 1) % phrases.length);
      return;
    }
    const t = window.setTimeout(
      () => setN((v) => v + (erasing ? -1 : 1)),
      erasing ? deleteMs : typeMs,
    );
    return () => window.clearTimeout(t);
  }, [still, phrases, i, n, erasing, typeMs, deleteMs, holdMs]);

  if (still) {
    return <span>{phrases[0]}</span>;
  }

  return (
    <>
      <span aria-hidden="true" className="caret">
        {phrases[i % phrases.length].slice(0, n)}
      </span>
      <span className="sr-only">{phrases.join(". ")}</span>
    </>
  );
}
