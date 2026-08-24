"use client";

import { useState } from "react";
import { motion } from "motion/react";
import SectionHeader from "@/components/hud/SectionHeader";
import MissionBrief from "@/components/sections/MissionBrief";
import { MISSIONS, type Mission } from "@/lib/data";

const ACCENT: Record<Mission["accent"], string> = {
  cyan: "var(--color-cyan)",
  magenta: "var(--color-magenta)",
  amber: "var(--color-amber)",
};

const STATUS_TONE: Record<Mission["status"], string> = {
  DEPLOYED: "var(--color-cyan)",
  ACTIVE: "var(--color-magenta)",
  ARCHIVED: "var(--color-ink-faint)",
};

export default function MissionLog() {
  const [open, setOpen] = useState<Mission | null>(null);

  return (
    <section
      id="missions"
      className="relative px-6 py-24 md:pl-[calc(var(--rail)+32px)] md:py-32 lg:px-10 lg:pl-[calc(var(--rail)+56px)]"
    >
      <div className="mx-auto max-w-[1440px]">
        <SectionHeader
          index="02"
          title="Mission Log"
          note={`${MISSIONS.length} SYSTEMS · SELECT FOR BRIEFING`}
        />

        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {MISSIONS.map((m, idx) => (
            <motion.li
              key={m.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.55,
                delay: (idx % 3) * 0.07,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={idx === 0 ? "md:col-span-2 xl:col-span-1" : undefined}
            >
              <button
                type="button"
                data-cursor="target"
                data-testid={`mission-card-${m.id}`}
                onClick={() => setOpen(m)}
                aria-haspopup="dialog"
                className="plate group flex h-full w-full flex-col p-6 text-left transition-transform duration-300 hover:-translate-y-1 hover:border-[color-mix(in_oklab,var(--color-cyan)_50%,transparent)] md:p-7"
              >
                <span
                  className="bracket bracket-tl"
                  style={{ color: ACCENT[m.accent] }}
                />
                <span
                  className="bracket bracket-tr"
                  style={{ color: ACCENT[m.accent] }}
                />
                <span
                  className="bracket bracket-bl"
                  style={{ color: ACCENT[m.accent] }}
                />
                <span
                  className="bracket bracket-br"
                  style={{ color: ACCENT[m.accent] }}
                />

                <div className="flex items-center justify-between">
                  <span className="label tnum">{m.index}</span>
                  <span
                    className="label flex items-center gap-1.5"
                    style={{ color: STATUS_TONE[m.status] }}
                  >
                    <span
                      className="inline-block h-1 w-1"
                      style={{ background: "currentColor" }}
                    />
                    {m.status}
                  </span>
                </div>

                <h3 className="display mt-5 text-[28px] leading-none text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-cyan)]">
                  {m.name}
                </h3>
                <p
                  className="mt-2 font-[family-name:var(--font-mono)] text-[10px] tracking-[0.18em]"
                  style={{ color: ACCENT[m.accent] }}
                >
                  {m.codename}
                </p>

                <p className="mt-5 flex-1 text-[14px] leading-[1.65] text-[var(--color-ink-dim)]">
                  {m.summary}
                </p>

                <dl className="mt-6 grid grid-cols-3 gap-x-4 border-t border-[var(--color-line)] pt-4">
                  {m.metrics.map((met) => (
                    <div key={met.label} className="min-w-0">
                      <dt className="label break-words">{met.label}</dt>
                      <dd className="tnum mt-2 truncate font-[family-name:var(--font-mono)] text-[13px] text-[var(--color-ink)]">
                        {met.value}
                      </dd>
                    </div>
                  ))}
                </dl>

                <span className="label mt-5 flex items-center gap-2 text-[var(--color-ink-faint)] transition-colors group-hover:text-[var(--color-cyan)]">
                  OPEN BRIEFING
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </button>
            </motion.li>
          ))}
        </ul>
      </div>

      <MissionBrief mission={open} onClose={() => setOpen(null)} />
    </section>
  );
}
