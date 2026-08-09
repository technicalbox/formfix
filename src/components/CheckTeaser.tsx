import { useEffect, useRef, useState } from "react";
import { Reveal } from "./Reveal";

const CHECKS = [
  { label: "FORMAT", value: "JPG", ok: true },
  { label: "DIMENSIONS", value: "200 × 230 PX", ok: true },
  { label: "ASPECT RATIO", value: "0.87 : 1", ok: true },
  { label: "FILE SIZE", value: "48.7 KB · ≤ 50 KB", ok: true },
];

export function CheckTeaser() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setStep(CHECKS.length);
      return;
    }
    let timers: number[] = [];
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          io.disconnect();
          timers = CHECKS.map((_, i) => window.setTimeout(() => setStep(i + 1), 320 + i * 340));
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      timers.forEach(window.clearTimeout);
    };
  }, []);

  const done = step >= CHECKS.length;

  return (
    <section className="border-t border-rule bg-card/60">
      <div ref={ref} className="mx-auto grid max-w-[1400px] items-center gap-12 px-5 py-16 md:px-8 md:py-24 lg:grid-cols-2">
        <div>
          <Reveal className="tech text-muted-foreground">CHECK MY IMAGE</Reveal>
          <Reveal as="h2" delay={80} className="display-md mt-4 max-w-[16ch]">
            Know it will be accepted before you upload it.
          </Reveal>
          <Reveal delay={160} className="mt-5 max-w-[44ch] text-[15px] leading-relaxed text-muted-foreground">
            Pick your exam, drop the file, and every requirement from the official notification is
            checked line by line — format, dimensions, ratio and size. If something fails, the fix
            is one click away.
          </Reveal>
          <Reveal delay={240} className="mt-8">
            <a
              href="/check-image"
              className="tech group inline-flex items-center gap-3 border border-foreground px-6 py-4 transition-colors duration-300 hover:bg-foreground hover:text-background"
            >
              CHECK MY IMAGE
              <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
                →
              </span>
            </a>
          </Reveal>
        </div>

        <Reveal delay={120} className="shadow-plate border border-rule bg-background">
          <div className="flex items-center justify-between border-b border-rule px-5 py-3">
            <span className="tech-sm text-muted-foreground">VALIDATION REPORT</span>
            <span className="tech-sm text-muted-foreground">IBPS PO / CLERK</span>
          </div>
          <ul>
            {CHECKS.map((c, i) => {
              const passed = step > i;
              return (
                <li
                  key={c.label}
                  className="flex items-center justify-between gap-4 border-b border-rule/70 px-5 py-4"
                >
                  <span className="tech-sm text-muted-foreground">{c.label}</span>
                  <span className="flex items-center gap-3">
                    <span className="font-mono text-[12.5px]">{c.value}</span>
                    <span
                      className={`grid h-5 w-5 place-items-center text-[11px] transition-all duration-500 ${
                        passed
                          ? "bg-verify/15 text-verify"
                          : "bg-muted text-muted-foreground/50"
                      }`}
                      style={{ transitionTimingFunction: "var(--ease-ff)" }}
                      aria-hidden="true"
                    >
                      {passed ? "✓" : "·"}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
          <div
            className={`flex items-center justify-between px-5 py-4 transition-colors duration-700 ${
              done ? "bg-verify/10" : "bg-transparent"
            }`}
          >
            <span className={`tech ${done ? "text-verify" : "text-muted-foreground"}`}>
              {done ? "READY TO SUBMIT" : "CHECKING…"}
            </span>
            <span className="tech-sm text-muted-foreground">{step}/{CHECKS.length}</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
