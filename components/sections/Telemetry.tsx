"use client";

import { useState } from "react";
import { motion } from "motion/react";
import SectionHeader from "@/components/hud/SectionHeader";
import { TELEMETRY, type TelemetryEntry } from "@/lib/data";

const KIND_TONE: Record<TelemetryEntry["kind"], string> = {
  ROLE: "var(--color-cyan)",
  AWARD: "var(--color-magenta)",
  EDUCATION: "var(--color-amber)",
  SERVICE: "var(--color-ink-faint)",
};

/**
 * The record laid out as an F1 lap chart: a trace across the top where each
 * point's height is the intensity of that period, and the stint list below.
 * Hovering or focusing a stint highlights its point on the trace.
 *
 * The trace is decorative — every value it draws is also written out in the
 * list, so nothing lives only in the graphic.
 */
export default function Telemetry() {
  const [hot, setHot] = useState<number | null>(null);
  const [open, setOpen] = useState<number | null>(0);

  const points = TELEMETRY.map((t, i) => {
    const x = (i / (TELEMETRY.length - 1)) * 100;
    // Map load from 0-100 to y from 95-5 to prevent clipping at the top edge
    const y = 100 - (t.load * 0.9 + 5);
    return { x, y, t };
  });

  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(" ");

  return (
    <section
      id="telemetry"
      className="relative px-6 py-24 md:pl-[calc(var(--rail)+32px)] md:py-32 lg:px-10 lg:pl-[calc(var(--rail)+56px)]"
    >
      <div className="mx-auto max-w-[1440px]">
        <SectionHeader
          index="04"
          title="Telemetry"
          note="RECORD · READ NEWEST FIRST"
        />

        {/* ---- Trace ---- */}
        <div className="plate mb-4 overflow-hidden p-6 md:p-8">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <span className="label label-hot">INTENSITY TRACE</span>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {(
                ["ROLE", "AWARD", "EDUCATION", "SERVICE"] as const
              ).map((k) => (
                <span key={k} className="label flex items-center gap-1.5">
                  <span
                    className="inline-block h-1.5 w-1.5"
                    style={{ background: KIND_TONE[k] }}
                  />
                  {k}
                </span>
              ))}
            </div>
          </div>

          <div className="trace-grid relative h-40 w-full md:h-52">
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="traceFill" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="var(--color-cyan)"
                    stopOpacity="0.22"
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--color-cyan)"
                    stopOpacity="0"
                  />
                </linearGradient>
              </defs>
              <motion.path
                d={`${path} L 100 100 L 0 100 Z`}
                fill="url(#traceFill)"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
              />
              <motion.path
                d={path}
                fill="none"
                stroke="var(--color-cyan)"
                strokeWidth="0.6"
                vectorEffect="non-scaling-stroke"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              />
            </svg>

            {/* Points sit in a separate non-scaling layer so they stay round. */}
            <div className="absolute inset-0" aria-hidden="true">
              {points.map((p, i) => {
                const on = hot === i || open === i;
                return (
                  <span
                    key={i}
                    className="absolute transition-all duration-200"
                    style={{
                      left: `${p.x}%`,
                      top: `${p.y}%`,
                      width: on ? 9 : 5,
                      height: on ? 9 : 5,
                      marginLeft: on ? -4.5 : -2.5,
                      marginTop: on ? -4.5 : -2.5,
                      background: on
                        ? KIND_TONE[p.t.kind]
                        : "var(--color-void)",
                      border: `1px solid ${KIND_TONE[p.t.kind]}`,
                      boxShadow: on
                        ? `0 0 12px ${KIND_TONE[p.t.kind]}`
                        : "none",
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Sector axis */}
          <div className="mt-3 flex justify-between border-t border-[var(--color-line)] pt-3">
            {["S1 · CURRENT", "S2 · AWARDS", "S3 · SERVICE", "S4 · ACADEMIC"].map(
              (s) => (
                <span key={s} className="label">
                  {s}
                </span>
              ),
            )}
          </div>
        </div>

        {/* ---- Stint list ---- */}
        <ul className="grid grid-cols-1 gap-px bg-[var(--color-line)]">
          {TELEMETRY.map((t, i) => {
            const expanded = open === i;
            return (
              <li key={`${t.title}-${i}`} className="bg-[var(--color-panel)]">
                <h3>
                  <button
                    type="button"
                    data-cursor="link"
                    data-testid={`telemetry-row-${i}`}
                    aria-expanded={expanded}
                    aria-controls={`telemetry-detail-${i}`}
                    onClick={() => setOpen(expanded ? null : i)}
                    onMouseEnter={() => setHot(i)}
                    onMouseLeave={() => setHot(null)}
                    onFocus={() => setHot(i)}
                    onBlur={() => setHot(null)}
                    className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-4 px-5 py-5 text-left transition-colors hover:bg-[var(--color-raise)] md:grid-cols-[52px_170px_1fr_auto] md:gap-6 md:px-7"
                  >
                    <span
                      className="label tnum"
                      style={{ color: KIND_TONE[t.kind] }}
                    >
                      {t.sector}
                    </span>
                    <span className="label tnum hidden md:block">
                      {t.window}
                    </span>
                    <span className="min-w-0">
                      <span className="display block truncate text-[17px] text-[var(--color-ink)] md:text-[19px]">
                        {t.title}
                      </span>
                      <span className="mt-1 block truncate font-[family-name:var(--font-mono)] text-[11px] text-[var(--color-ink-dim)]">
                        {t.org}
                      </span>
                      <span className="label tnum mt-1.5 block md:hidden">
                        {t.window}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className="text-[var(--color-ink-faint)] transition-transform duration-300"
                      style={{
                        transform: expanded ? "rotate(45deg)" : "rotate(0deg)",
                      }}
                    >
                      +
                    </span>
                  </button>
                </h3>

                <div
                  id={`telemetry-detail-${i}`}
                  hidden={!expanded}
                  className="border-t border-[var(--color-line)] bg-[var(--color-deep)] px-5 py-6 md:px-7 md:pl-[104px]"
                >
                  <ul className="space-y-3">
                    {t.detail.map((d, j) => (
                      <li
                        key={j}
                        className="flex gap-3 text-[14px] leading-[1.7] text-[var(--color-ink-dim)]"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-2.5 h-px w-3 shrink-0"
                          style={{ background: KIND_TONE[t.kind] }}
                        />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
