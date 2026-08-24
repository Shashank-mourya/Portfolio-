"use client";

import { useState } from "react";
import { motion } from "motion/react";
import SectionHeader from "@/components/hud/SectionHeader";
import { LOADOUT } from "@/lib/data";

/**
 * The weapon-loadout screen: slot tabs down the left, the selected slot's
 * contents in the pane. Tier bars are a self-assessment and the header says so
 * — an unlabelled 5/5 bar is the kind of claim that reads as decoration.
 */
export default function Loadout() {
  const [slot, setSlot] = useState(0);
  const active = LOADOUT[slot];

  return (
    <section
      id="loadout"
      className="relative px-6 py-24 md:pl-[calc(var(--rail)+32px)] md:py-32 lg:px-10 lg:pl-[calc(var(--rail)+56px)]"
    >
      <div className="mx-auto max-w-[1440px]">
        <SectionHeader
          index="03"
          title="Loadout"
          note="TIER BARS ARE A SELF-ASSESSMENT"
        />

        <div className="plate overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr]">
            {/* Slot selector */}
            <div
              role="tablist"
              aria-label="Loadout slots"
              aria-orientation="vertical"
              className="flex overflow-x-auto border-b border-[var(--color-line)] lg:flex-col lg:overflow-visible lg:border-b-0 lg:border-r"
            >
              {LOADOUT.map((s, i) => {
                const on = i === slot;
                return (
                  <button
                    key={s.slot}
                    role="tab"
                    id={`slot-tab-${i}`}
                    aria-selected={on}
                    aria-controls={`slot-panel-${i}`}
                    tabIndex={on ? 0 : -1}
                    data-cursor="link"
                    data-testid={`loadout-tab-${s.slot.toLowerCase()}`}
                    onClick={() => setSlot(i)}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
                        e.preventDefault();
                        const n = (i + 1) % LOADOUT.length;
                        setSlot(n);
                        document.getElementById(`slot-tab-${n}`)?.focus();
                      }
                      if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
                        e.preventDefault();
                        const n = (i - 1 + LOADOUT.length) % LOADOUT.length;
                        setSlot(n);
                        document.getElementById(`slot-tab-${n}`)?.focus();
                      }
                    }}
                    className="relative shrink-0 px-5 py-5 text-left transition-colors lg:px-6"
                    style={{
                      background: on
                        ? "color-mix(in oklab, var(--color-cyan) 8%, transparent)"
                        : "transparent",
                    }}
                  >
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 left-0 top-auto h-0.5 w-full transition-colors lg:bottom-auto lg:left-0 lg:top-0 lg:h-full lg:w-0.5"
                      style={{
                        background: on ? "var(--color-cyan)" : "transparent",
                      }}
                    />
                    <span
                      className="label block"
                      style={{
                        color: on
                          ? "var(--color-cyan)"
                          : "var(--color-ink-faint)",
                      }}
                    >
                      {s.slot}
                    </span>
                    <span
                      className="display mt-2 block whitespace-nowrap text-[15px]"
                      style={{
                        color: on
                          ? "var(--color-ink)"
                          : "var(--color-ink-dim)",
                      }}
                    >
                      {s.category}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Slot contents */}
            <div
              role="tabpanel"
              id={`slot-panel-${slot}`}
              aria-labelledby={`slot-tab-${slot}`}
              className="p-6 md:p-8"
            >
              <div className="mb-6 flex items-center justify-between">
                <span className="label label-hot">
                  {active.slot} · {active.category.toUpperCase()}
                </span>
                <span className="label tnum">
                  {String(active.items.length).padStart(2, "0")} EQUIPPED
                </span>
              </div>

              <ul className="divide-y divide-[var(--color-line)]">
                {active.items.map((item, i) => (
                  <motion.li
                    key={item.name}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.35,
                      delay: i * 0.05,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="grid grid-cols-1 items-center gap-2 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-6"
                  >
                    <div className="min-w-0">
                      <p className="display text-[17px] text-[var(--color-ink)]">
                        {item.name}
                      </p>
                      {item.note && (
                        <p className="mt-1 text-[13px] leading-snug text-[var(--color-ink-dim)]">
                          {item.note}
                        </p>
                      )}
                    </div>

                    {/* Tier bar — five segments, exposed to AT as a meter. */}
                    <div
                      className="flex items-center gap-3"
                      role="meter"
                      aria-valuenow={item.tier}
                      aria-valuemin={1}
                      aria-valuemax={5}
                      aria-label={`${item.name} proficiency`}
                    >
                      <div aria-hidden="true" className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, seg) => (
                          <motion.span
                            key={seg}
                            initial={{ scaleY: 0.2, opacity: 0.3 }}
                            animate={{ scaleY: 1, opacity: 1 }}
                            transition={{
                              duration: 0.3,
                              delay: i * 0.05 + seg * 0.03,
                            }}
                            className="block h-4 w-2.5 origin-bottom"
                            style={{
                              background:
                                seg < item.tier
                                  ? "var(--color-cyan)"
                                  : "var(--color-line-hot)",
                            }}
                          />
                        ))}
                      </div>
                      <span className="tnum w-8 text-right font-[family-name:var(--font-mono)] text-[12px] text-[var(--color-ink-dim)]">
                        {item.tier}/5
                      </span>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
