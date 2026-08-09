import { useEffect, useState } from "react";

import type { DetailedValidation } from "@/lib/validator";

const TONE = {
  PASS: { chip: "bg-verify/15 text-verify", mark: "✓", text: "text-verify" },
  FAIL: { chip: "bg-destructive/12 text-destructive", mark: "✕", text: "text-destructive" },
  WARNING: { chip: "bg-signal/15 text-signal", mark: "!", text: "text-signal" },
} as const;

/**
 * ValidationReport — the printed diagnostic sheet.
 * Rows land one after another so the report reads as a machine working through
 * the notification, not as a static table.
 */
export function ValidationReport({
  validation,
  target,
  source,
  className = "",
}: {
  validation: DetailedValidation;
  target: string;
  source?: string | undefined;
  className?: string;
}) {
  const [step, setStep] = useState(0);
  const count = validation.checks.length;

  useEffect(() => {
    setStep(0);
    const timers = validation.checks.map((_, i) =>
      window.setTimeout(() => setStep(i + 1), 140 + i * 130),
    );
    return () => timers.forEach(window.clearTimeout);
  }, [validation]);

  const done = step >= count;
  const tone = validation.allPass
    ? validation.warningCount > 0
      ? TONE.WARNING
      : TONE.PASS
    : TONE.FAIL;

  return (
    <section
      className={`shadow-plate border border-rule bg-background ${className}`}
      aria-label="Validation report"
    >
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-rule px-5 py-3">
        <span className="tech-sm text-muted-foreground">VALIDATION REPORT</span>
        <span className="tech-sm">{target.toUpperCase()}</span>
      </header>

      <div className="h-px bg-rule">
        <div
          className="h-px bg-primary transition-[width] duration-300"
          style={{ width: `${count ? (step / count) * 100 : 0}%`, transitionTimingFunction: "var(--ease-ff)" }}
          aria-hidden="true"
        />
      </div>

      <ul>
        {validation.checks.map((c, i) => {
          const shown = step > i;
          const t = TONE[c.status];
          return (
            <li
              key={c.id}
              className="border-b border-rule/70 px-5 py-4 transition-opacity duration-500"
              style={{ opacity: shown ? 1 : 0.28, transitionTimingFunction: "var(--ease-ff)" }}
            >
              <div className="flex items-baseline justify-between gap-4">
                <span className="tech-sm text-muted-foreground">{c.label.toUpperCase()}</span>
                <span className="flex items-center gap-3">
                  <span className="font-mono text-[12.5px]">{c.actual}</span>
                  <span
                    className={`grid h-5 w-5 place-items-center text-[11px] transition-colors duration-500 ${
                      shown ? t.chip : "bg-muted text-muted-foreground/50"
                    }`}
                    aria-hidden="true"
                  >
                    {shown ? t.mark : "·"}
                  </span>
                </span>
              </div>
              <div className="mt-2 flex flex-wrap items-baseline gap-x-6 gap-y-1 border-l border-rule pl-3">
                <span className="tech-sm text-muted-foreground">
                  REQUIRED <span className="text-foreground">{c.expected}</span>
                </span>
                {c.explanation && shown && c.status !== "PASS" && (
                  <span className="max-w-[46ch] text-[12.5px] leading-relaxed text-muted-foreground">
                    {c.explanation}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <footer
        className={`flex flex-wrap items-center justify-between gap-3 px-5 py-4 transition-colors duration-700 ${
          done ? (validation.allPass ? "bg-verify/10" : "bg-destructive/8") : ""
        }`}
      >
        <span className={`tech ${done ? tone.text : "text-muted-foreground"}`}>
          {done
            ? validation.allPass
              ? "READY TO SUBMIT"
              : `${validation.failCount} REQUIREMENT${validation.failCount > 1 ? "S" : ""} FAILED`
            : "CHECKING…"}
        </span>
        <span className="tech-sm text-muted-foreground">
          {step}/{count}
          {source ? ` · ${source}` : ""}
        </span>
      </footer>
    </section>
  );
}
