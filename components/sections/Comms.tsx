"use client";

import { useEffect, useRef, useState } from "react";
import SectionHeader from "@/components/hud/SectionHeader";
import { MISSIONS, OPERATOR, TERMINAL_COMMANDS } from "@/lib/data";

type Line = { kind: "in" | "out" | "hot" | "err"; text: string };

const BANNER: Line[] = [
  { kind: "out", text: "comms channel open · shashank@hud ~ %" },
  { kind: "out", text: "type `help` for the command list, or use the links below." },
];

/**
 * The contact terminal. It is a genuine input, not a prop — but every fact it
 * can print is also on the page as plain links underneath, so nobody has to
 * play the game to reach an email address.
 */
export default function Comms() {
  const [lines, setLines] = useState<Line[]>(BANNER);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hIdx, setHIdx] = useState(-1);
  const bufferRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = bufferRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const push = (next: Line[]) => setLines((prev) => [...prev, ...next]);

  const run = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;

    setHistory((h) => [cmd, ...h].slice(0, 40));
    setHIdx(-1);
    push([{ kind: "in", text: raw.trim() }]);

    switch (cmd) {
      case "help":
        push([
          { kind: "hot", text: "available commands" },
          ...TERMINAL_COMMANDS.map<Line>((c) => ({
            kind: "out",
            text: `  ${c.cmd.padEnd(10)} ${c.desc}`,
          })),
        ]);
        break;

      case "whoami":
        push([
          { kind: "hot", text: OPERATOR.name },
          { kind: "out", text: `${OPERATOR.role} · ${OPERATOR.secondaryRole}` },
          { kind: "out", text: `B.Tech IT, MMCOE Pune · CGPA 9.01 / 10` },
          { kind: "out", text: `${OPERATOR.location}` },
        ]);
        break;

      case "contact":
        push([
          { kind: "hot", text: "comms channels" },
          { kind: "out", text: `  email     ${OPERATOR.email}` },
          { kind: "out", text: `  phone     ${OPERATOR.phone}` },
          { kind: "out", text: `  linkedin  ${OPERATOR.linkedin}` },
          { kind: "out", text: `  github    ${OPERATOR.github}` },
        ]);
        break;

      case "missions":
        push([
          { kind: "hot", text: `${MISSIONS.length} systems on record` },
          ...MISSIONS.map<Line>((m) => ({
            kind: "out",
            text: `  ${m.index}  ${m.name.padEnd(15)} ${m.status.padEnd(9)} ${m.classification}`,
          })),
        ]);
        break;

      case "stack":
        push([
          { kind: "hot", text: "primary loadout" },
          { kind: "out", text: "  languages  C++17 · Python · TypeScript · SQL · Java" },
          { kind: "out", text: "  ai/ml      Computer Vision · CNNs · XGBoost · LLMs · Image Forensics" },
          { kind: "out", text: "  qa         Test design · Regression · Automation · Release sign-off" },
          { kind: "out", text: "  embedded   STM32 · ESP32" },
        ]);
        break;

      case "resume":
        push([{ kind: "hot", text: "downloading resume…" }]);
        window.location.href = OPERATOR.resume;
        break;

      case "clear":
        setLines(BANNER);
        break;

      case "sudo":
      case "sudo su":
        push([{ kind: "err", text: "nice try. permission denied." }]);
        break;

      default:
        push([
          {
            kind: "err",
            text: `command not found: ${cmd}. type \`help\` for the list.`,
          },
        ]);
    }
  };

  return (
    <section
      id="comms"
      className="relative px-6 py-24 md:pl-[calc(var(--rail)+32px)] md:py-32 lg:px-10 lg:pl-[calc(var(--rail)+56px)]"
    >
      <div className="mx-auto max-w-[1440px]">
        <SectionHeader index="05" title="Comms" note="CHANNEL OPEN" />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.35fr_0.65fr]">
          {/* Terminal */}
          <div className="plate flex min-h-[420px] flex-col">
            <div className="flex items-center justify-between border-b border-[var(--color-line)] px-5 py-3">
              <span className="label label-hot">/dev/comms</span>
              <span className="label">TTY 01</span>
            </div>

            <div
              ref={bufferRef}
              data-testid="terminal-buffer"
              className="thin-scroll max-h-[340px] flex-1 overflow-y-auto px-5 py-4 font-[family-name:var(--font-mono)] text-[12.5px] leading-[1.85]"
              role="log"
              aria-live="polite"
              aria-label="Terminal output"
            >
              {lines.map((l, i) => (
                <div
                  key={i}
                  className="whitespace-pre-wrap break-words"
                  style={{
                    color:
                      l.kind === "in"
                        ? "var(--color-ink)"
                        : l.kind === "hot"
                          ? "var(--color-cyan)"
                          : l.kind === "err"
                            ? "var(--color-magenta)"
                            : "var(--color-ink-dim)",
                  }}
                >
                  {l.kind === "in" && (
                    <span className="text-[var(--color-cyan)]">$ </span>
                  )}
                  {l.text}
                </div>
              ))}
            </div>

            <form
              className="flex items-center gap-2 border-t border-[var(--color-line)] px-5 py-3.5"
              onSubmit={(e) => {
                e.preventDefault();
                run(value);
                setValue("");
              }}
            >
              <label htmlFor="comms-input" className="sr-only">
                Terminal command
              </label>
              <span aria-hidden="true" className="text-[var(--color-cyan)]">
                $
              </span>
              <input
                id="comms-input"
                ref={inputRef}
                data-testid="terminal-input"
                data-cursor="text"
                value={value}
                autoComplete="off"
                spellCheck={false}
                placeholder="help"
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowUp") {
                    e.preventDefault();
                    const n = Math.min(hIdx + 1, history.length - 1);
                    if (n >= 0) {
                      setHIdx(n);
                      setValue(history[n]);
                    }
                  }
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    const n = hIdx - 1;
                    setHIdx(n);
                    setValue(n >= 0 ? history[n] : "");
                  }
                }}
                className="w-full bg-transparent font-[family-name:var(--font-mono)] text-[13px] text-[var(--color-ink)] outline-none placeholder:text-[var(--color-ink-faint)]"
              />
              <button
                type="submit"
                data-cursor="link"
                className="label shrink-0 border border-[var(--color-line-hot)] px-3 py-2 text-[var(--color-ink-dim)] transition-colors hover:border-[var(--color-cyan)] hover:text-[var(--color-cyan)]"
              >
                RUN
              </button>
            </form>
          </div>

          {/* Plain channels — the terminal is optional, this is not. */}
          <div className="plate flex flex-col p-6">
            <span className="label label-hot">DIRECT CHANNELS</span>
            <ul className="mt-6 flex-1 divide-y divide-[var(--color-line)]">
              {[
                { k: "EMAIL", v: OPERATOR.email, href: `mailto:${OPERATOR.email}` },
                {
                  k: "PHONE",
                  v: OPERATOR.phone,
                  href: `tel:${OPERATOR.phone.replace(/\s/g, "")}`,
                },
                { k: "LINKEDIN", v: "shashank-mourya-it", href: OPERATOR.linkedin },
                { k: "GITHUB", v: "Shashank-mourya", href: OPERATOR.github },
              ].map((c) => (
                <li key={c.k}>
                  <a
                    href={c.href}
                    data-cursor="link"
                    target={c.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      c.href.startsWith("http") ? "noreferrer noopener" : undefined
                    }
                    className="group flex items-center justify-between gap-3 py-4 transition-colors hover:text-[var(--color-cyan)]"
                  >
                    <span>
                      <span className="label block">{c.k}</span>
                      <span className="mt-1.5 block break-all font-[family-name:var(--font-mono)] text-[13px] text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-cyan)]">
                        {c.v}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className="shrink-0 text-[var(--color-ink-faint)] transition-transform group-hover:translate-x-1 group-hover:text-[var(--color-cyan)]"
                    >
                      →
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <a
              href={OPERATOR.resume}
              download
              data-cursor="link"
              className="label mt-6 flex items-center justify-center gap-2 border border-[var(--color-cyan)] bg-[color-mix(in_oklab,var(--color-cyan)_10%,transparent)] py-3.5 text-[var(--color-cyan)] transition-colors hover:bg-[color-mix(in_oklab,var(--color-cyan)_20%,transparent)]"
            >
              DOWNLOAD RESUME ↓
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
