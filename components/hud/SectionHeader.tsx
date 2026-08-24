"use client";

import { motion } from "motion/react";

/**
 * `[ 02 // MISSION LOG ]` — the index is not decoration here. A HUD addresses
 * its panels by number, and the left rail uses the same indices to show you
 * where you are.
 */
export default function SectionHeader({
  index,
  title,
  note,
}: {
  index: string;
  title: string;
  note?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="mb-12 md:mb-16"
    >
      <div className="flex items-center gap-4">
        <span className="label label-hot tnum">[ {index} ]</span>
        <span className="rule flex-1" />
        {note && <span className="label hidden sm:inline">{note}</span>}
      </div>
      <h2 className="display mt-5 text-[clamp(2rem,5.5vw,3.5rem)] uppercase text-[var(--color-ink)]">
        <span className="glitch" data-text={title} data-cursor="link">
          {title}
        </span>
      </h2>
    </motion.div>
  );
}
