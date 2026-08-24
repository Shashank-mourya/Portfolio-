"use client";

import { useEffect, useState } from "react";
import { NAV, OPERATOR } from "@/lib/data";
import ThemeToggle from "@/components/hud/ThemeToggle";

/**
 * Two pieces of navigation chrome:
 *   - a left rail of indexed section markers (desktop), showing the active one
 *   - a top bar with the callsign and a resume action (all widths)
 * The rail is a real <nav> with anchor links, so keyboard and screen reader
 * users get the same map the HUD is drawing.
 */
export default function Nav() {
  const [active, setActive] = useState(NAV[0].id);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const sections = NAV.map((n) => document.getElementById(n.id)).filter(
      (el): el is HTMLElement => el !== null,
    );

    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    sections.forEach((s) => io.observe(s));

    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      {/* Top bar */}
      <header className="fixed inset-x-0 top-0 z-[100] border-b border-[var(--color-line)] bg-[color-mix(in_oklab,var(--color-void)_82%,transparent)] backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between px-6 md:pl-[var(--rail)] lg:px-10 lg:pl-[calc(var(--rail)+24px)]">
          <a
            href="#hero"
            data-cursor="link"
            className="display text-[15px] tracking-[0.22em] text-[var(--color-ink)] transition-colors hover:text-[var(--color-cyan)]"
          >
            {OPERATOR.callsign}
            <span className="text-[var(--color-cyan)]">.</span>
          </a>

          <nav aria-label="Sections" className="hidden items-center gap-7 md:flex">
            {NAV.slice(1).map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                data-cursor="link"
                aria-current={active === item.id ? "true" : undefined}
                className="label transition-colors hover:text-[var(--color-cyan)]"
                style={
                  active === item.id
                    ? { color: "var(--color-cyan)" }
                    : undefined
                }
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            <a
              href={OPERATOR.resume}
              download
              data-cursor="link"
              className="label border border-[var(--color-line-hot)] px-4 py-2 text-[var(--color-ink-dim)] transition-colors hover:border-[var(--color-cyan)] hover:text-[var(--color-cyan)]"
            >
              RESUME ↓
            </a>
          </div>
        </div>
        {/* Scroll progress, drawn as a throttle trace */}
        <div className="h-px w-full bg-[var(--color-line)]">
          <div
            className="h-px bg-[var(--color-cyan)] transition-[width] duration-150 ease-linear"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </header>

      {/* Mobile tab bar. The desktop nav and rail are both hidden below md, so
          without this small screens can only reach a section by scrolling. */}
      <nav
        aria-label="Sections"
        className="fixed inset-x-0 bottom-0 z-[100] border-t border-[var(--color-line)] bg-[color-mix(in_oklab,var(--color-void)_92%,transparent)] backdrop-blur-md md:hidden"
      >
        <ul className="thin-scroll flex overflow-x-auto">
          {NAV.map((item) => {
            const on = active === item.id;
            return (
              <li key={item.id} className="flex-1">
                <a
                  href={`#${item.id}`}
                  aria-current={on ? "true" : undefined}
                  className="flex min-w-[68px] flex-col items-center gap-1.5 px-3 py-3"
                >
                  <span
                    aria-hidden="true"
                    className="h-0.5 w-5 transition-colors"
                    style={{
                      background: on
                        ? "var(--color-cyan)"
                        : "var(--color-line-hot)",
                    }}
                  />
                  <span
                    className="label whitespace-nowrap text-[9px]"
                    style={{ color: on ? "var(--color-cyan)" : undefined }}
                  >
                    {item.label}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Left rail — decorative duplicate of the nav above, so it is hidden
          from assistive tech to avoid announcing the same map twice. */}
      <div
        aria-hidden="true"
        className="fixed left-0 top-14 bottom-0 z-[95] hidden w-[var(--rail)] flex-col items-center justify-center gap-6 border-r border-[var(--color-line)] md:flex"
      >
        {NAV.map((item) => {
          const on = active === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              tabIndex={-1}
              data-cursor="link"
              className="group flex flex-col items-center gap-2"
            >
              <span
                className="h-px transition-all duration-300"
                style={{
                  width: on ? 20 : 10,
                  background: on ? "var(--color-cyan)" : "var(--color-line-hot)",
                }}
              />
              <span
                className="label tnum transition-colors"
                style={{ color: on ? "var(--color-cyan)" : "var(--color-ink-faint)" }}
              >
                {item.index}
              </span>
            </a>
          );
        })}
      </div>
    </>
  );
}
