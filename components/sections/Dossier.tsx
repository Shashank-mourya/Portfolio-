"use client";

import { motion } from "motion/react";
import SectionHeader from "@/components/hud/SectionHeader";
import { OPERATOR } from "@/lib/data";

const DOMAINS = [
  {
    tag: "PRIMARY DOMAIN",
    title: "Forensic & applied ML",
    body: "Gradient-boosted risk models and image forensics that have to survive an adversary, not just a validation split. InsureTrust is the reference build.",
  },
  {
    tag: "SECONDARY DOMAIN",
    title: "Edge computer vision",
    body: "Detection loops tuned for latency budgets rather than leaderboard accuracy, because a late warning is a wrong warning. Drishti AI runs on that constraint.",
  },
  {
    tag: "OPERATING PRINCIPLE",
    title: "Privacy-first by architecture",
    body: "Inference runs on-device where the data is sensitive. FlowState reads how you work and never what you write — the guarantee is structural, not a policy line.",
  },
];

export default function Dossier() {
  return (
    <section
      id="dossier"
      className="relative px-6 py-24 md:pl-[calc(var(--rail)+32px)] md:py-32 lg:px-10 lg:pl-[calc(var(--rail)+56px)]"
    >
      <div className="mx-auto max-w-[1440px]">
        <SectionHeader index="01" title="Dossier" note="OPERATOR PROFILE" />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          {/* Narrative */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            {OPERATOR.bio.map((p, idx) => (
              <p
                key={idx}
                className={
                  idx === 0
                    ? "text-[19px] leading-[1.6] text-[var(--color-ink)]"
                    : "text-[16px] leading-[1.7] text-[var(--color-ink-dim)]"
                }
              >
                {p}
              </p>
            ))}

            {/* Current deployment — the one piece of real industry experience,
                so it gets its own plate rather than a bullet. */}
            <div className="plate mt-10 p-6 md:p-8">
              <span className="bracket bracket-tl text-[var(--color-cyan)]" />
              <span className="bracket bracket-br text-[var(--color-cyan)]" />
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="label label-hot">LAST DEPLOYMENT</span>
                <span className="label tnum">16 JUN — 16 AUG 2026</span>
              </div>
              <h3 className="display mt-4 text-2xl text-[var(--color-ink)]">
                Nerumach.AI
              </h3>
              <p className="mt-1 font-[family-name:var(--font-mono)] text-[12px] text-[var(--color-magenta)]">
                QA / Automation Engineer → QA Lead
              </p>
              <p className="mt-4 text-[15px] leading-[1.7] text-[var(--color-ink-dim)]">
                Owned functional, regression and exploratory testing on a live
                production product, then took the whole QA strategy after one
                month — test plan, scope assignment, peer review and release
                sign-off. The automation suites cut manual verification per
                release and caught regressions before staging.
              </p>
            </div>
          </motion.div>

          {/* Domain cards */}
          <div className="space-y-4">
            {DOMAINS.map((d, idx) => (
              <motion.div
                key={d.title}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.55,
                  delay: idx * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="plate p-6"
              >
                <span className="bracket bracket-tl text-[var(--color-cyan)]" />
                <span className="bracket bracket-br text-[var(--color-cyan)]" />
                <span className="label label-hot">{d.tag}</span>
                <h3 className="display mt-3 text-lg text-[var(--color-ink)]">
                  {d.title}
                </h3>
                <p className="mt-2.5 text-[14px] leading-[1.65] text-[var(--color-ink-dim)]">
                  {d.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
