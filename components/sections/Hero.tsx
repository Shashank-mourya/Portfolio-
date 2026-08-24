"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { OPERATOR, VITALS } from "@/lib/data";
import Typewriter from "@/components/hud/Typewriter";

const ROLES = [
  "AI SYSTEMS ENGINEER",
  "COMPUTER VISION / FORENSIC ML",
  "QA LEAD · NERUMACH.AI",
  "C++17 · PYTHON · TYPESCRIPT",
];

/**
 * The standby screen: operator loaded in, vitals on the readout, portrait
 * framed the way a match-start screen frames an agent.
 */
export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] items-center px-6 pb-24 pt-28 md:pl-[calc(var(--rail)+32px)] lg:px-10 lg:pl-[calc(var(--rail)+56px)]"
    >
      <div className="mx-auto grid w-full max-w-[1320px] grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(380px,460px)] lg:gap-20">
        {/* ---- Identity block ---- */}
        <div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3"
          >
            <span className="inline-block h-1.5 w-1.5 bg-[var(--color-cyan)]" />
            <span className="label label-hot">OPERATOR ONLINE</span>
            <span className="label">· {OPERATOR.location}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="display mt-6 text-[clamp(3rem,11vw,7.5rem)] uppercase"
          >
            <span className="block text-[var(--color-ink)]">Shashank</span>
            <span className="block text-[var(--color-ink-dim)]">Mourya</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-6 flex h-6 items-center gap-3 border-l-2 border-[var(--color-cyan)] pl-4"
          >
            <span className="font-[family-name:var(--font-mono)] text-[12px] tracking-[0.14em] text-[var(--color-cyan)] sm:text-[13px]">
              <Typewriter phrases={ROLES} />
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 max-w-xl text-[17px] leading-[1.65] text-[var(--color-ink-dim)]"
          >
            {OPERATOR.tagline} Computer vision, forensic ML and real-time
            systems — built privacy-first, measured, and tested before they ship.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <a
              href="#missions"
              data-cursor="link"
              className="group relative inline-flex items-center gap-3 border border-[var(--color-cyan)] bg-[color-mix(in_oklab,var(--color-cyan)_10%,transparent)] px-6 py-3 transition-colors hover:bg-[color-mix(in_oklab,var(--color-cyan)_20%,transparent)]"
            >
              <span className="label label-hot">VIEW MISSION LOG</span>
              <span className="text-[var(--color-cyan)] transition-transform group-hover:translate-x-1">
                →
              </span>
            </a>
            <a
              href="#comms"
              data-cursor="link"
              className="inline-flex items-center gap-3 border border-[var(--color-line-hot)] px-6 py-3 transition-colors hover:border-[var(--color-ink-dim)]"
            >
              <span className="label text-[var(--color-ink-dim)]">OPEN COMMS</span>
            </a>
          </motion.div>
        </div>

        {/* ---- Portrait + vitals ---- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto w-full max-w-sm lg:max-w-none"
        >
          <div className="plate relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-[var(--color-line)] px-4 py-2.5">
              <span className="label label-hot">OPR / 001</span>
              <span className="label">RANK · S</span>
            </div>

            <div className="relative aspect-[4/5] overflow-hidden bg-[var(--color-deep)]">
              {/* Grid backing behind the cut-out portrait */}
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-[0.4]"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, var(--color-line) 1px, transparent 1px), linear-gradient(to bottom, var(--color-line) 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-2/3"
                style={{
                  background:
                    "radial-gradient(ellipse 70% 60% at 50% 100%, var(--portrait-glow), transparent 70%)",
                }}
              />
              <Image
                src="/assets/profile-nobg.png"
                alt={`Portrait of ${OPERATOR.name}`}
                fill
                priority
                sizes="(max-width: 1024px) 380px, 420px"
                className="object-contain object-bottom"
              />
              {/* Reticle marks over the portrait */}
              <span
                aria-hidden="true"
                className="absolute left-4 top-4 h-4 w-4 border-l border-t border-[var(--color-cyan)]"
              />
              <span
                aria-hidden="true"
                className="absolute bottom-4 right-4 h-4 w-4 border-b border-r border-[var(--color-cyan)]"
              />
            </div>

            <dl className="grid grid-cols-2 divide-x divide-y divide-[var(--color-line)] border-t border-[var(--color-line)]">
              {VITALS.map((v) => (
                <div key={v.label} className="px-4 py-3.5">
                  <dt className="label">{v.label}</dt>
                  <dd className="mt-1.5 flex items-baseline gap-1.5">
                    <span className="display tnum text-2xl text-[var(--color-ink)]">
                      {v.value}
                    </span>
                    <span className="font-[family-name:var(--font-mono)] text-[10px] text-[var(--color-ink-faint)]">
                      {v.unit}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-14 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex"
      >
        <span className="label">SCROLL</span>
        <span className="h-8 w-px bg-gradient-to-b from-[var(--color-cyan)] to-transparent" />
      </motion.div>
    </section>
  );
}
