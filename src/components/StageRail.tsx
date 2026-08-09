/**
 * StageRail — the pipeline rail grammar, driven by explicit props so product
 * pages can share the homepage's measurement-line language without touching
 * the homepage's scroll-linked rail.
 */
export function StageRail({
  steps,
  active,
  progress = 0,
  eyebrow = "SEQUENCE",
  className = "",
}: {
  steps: { k: string; d: string }[];
  active: number;
  progress?: number;
  eyebrow?: string;
  className?: string;
}) {
  const total = steps.length;

  return (
    <div className={className}>
      <div className="flex items-baseline justify-between">
        <span className="tech text-muted-foreground">{eyebrow}</span>
        <span className="tech-sm text-muted-foreground">
          {String(Math.min(active + 1, total)).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </div>

      <div className="relative mt-6">
        <div className="absolute -top-[7px] inset-x-0 hidden h-px bg-rule md:block" aria-hidden="true">
          <div
            className="h-px bg-primary transition-[width] duration-500"
            style={{
              width: `${((Math.min(active, total - 1) + progress) / total) * 100}%`,
              transitionTimingFunction: "var(--ease-ff)",
            }}
          />
        </div>

        <ol className="grid gap-px bg-rule md:grid-cols-4">
          {steps.map((s, i) => {
            const isActive = i === active;
            const done = i < active;
            return (
              <li key={s.k} className="relative bg-card p-5 md:p-6">
                <span
                  className="absolute inset-x-0 top-0 h-[2px] origin-left bg-primary transition-transform duration-500"
                  style={{
                    transform: `scaleX(${isActive || done ? 1 : 0})`,
                    opacity: done && !isActive ? 0.35 : 1,
                    transitionTimingFunction: "var(--ease-ff)",
                  }}
                  aria-hidden="true"
                />
                <div className="flex items-baseline justify-between">
                  <span
                    className={`tech-sm transition-colors duration-500 ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`h-1.5 w-1.5 bg-primary transition-opacity duration-500 ${
                      isActive ? "opacity-100" : "opacity-25"
                    }`}
                    aria-hidden="true"
                  />
                </div>
                <h3
                  className={`mt-5 flex items-center gap-2 font-mono text-[14px] tracking-[0.08em] transition-opacity duration-500 ${
                    isActive || done ? "opacity-100" : "opacity-60"
                  }`}
                >
                  {s.k}
                  {done && (
                    <span className="text-primary" aria-hidden="true">
                      ✓
                    </span>
                  )}
                </h3>
                <p className="mt-2.5 text-[13px] leading-relaxed text-muted-foreground">{s.d}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
