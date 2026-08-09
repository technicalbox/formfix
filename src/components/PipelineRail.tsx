import { useEffect, useState } from "react";
import { Reveal } from "./Reveal";
import { subscribeStage } from "@/lib/stage";

const STEPS = [
  { n: "01", k: "INPUT", d: "Drop a photo or signature from any camera, scanner or phone." },
  { n: "02", k: "TRANSFORM", d: "Resize, crop, compress or convert — precise to the pixel and kilobyte." },
  { n: "03", k: "VERIFY", d: "Every requirement checked against the official notification values." },
  { n: "04", k: "READY", d: "Download a file that the upload form accepts the first time." },
];

export function PipelineRail() {
  const [{ stage, progress }, setS] = useState({ stage: 0, progress: 0 });
  useEffect(() => subscribeStage(setS), []);

  return (
    <section className="border-y border-rule bg-card/60">
      <div className="mx-auto max-w-[1400px] px-5 py-14 md:px-8 md:py-20">
        <div className="flex items-baseline justify-between">
          <Reveal className="tech text-muted-foreground">THE PROCESS</Reveal>
          <span className="tech-sm text-muted-foreground">
            {String(stage + 1).padStart(2, "0")} / 04
          </span>
        </div>

        <div className="relative mt-10">
          <div className="ticks-x absolute -top-3 left-0 right-0 hidden h-2 opacity-30 md:block" aria-hidden="true" />
          {/* measurement line drawing with scroll */}
          <div className="absolute -top-[7px] left-0 right-0 hidden h-px bg-rule md:block" aria-hidden="true">
            <div
              className="h-px bg-primary transition-[width] duration-300 ease-out"
              style={{ width: `${((stage + progress) / 4) * 100}%` }}
            />
          </div>

          <div className="grid gap-px bg-rule md:grid-cols-4">
            {STEPS.map((s, i) => {
              const active = i === stage;
              const done = i < stage;
              return (
                <Reveal
                  key={s.k}
                  delay={i * 90}
                  className={`group relative bg-card p-6 transition-colors duration-500 md:p-7 ${
                    active ? "bg-card" : ""
                  }`}
                >
                  <span
                    className="absolute inset-x-0 top-0 h-[2px] origin-left bg-primary transition-transform duration-500"
                    style={{
                      transform: `scaleX(${active ? 1 : done ? 1 : 0})`,
                      opacity: done && !active ? 0.35 : 1,
                      transitionTimingFunction: "var(--ease-ff)",
                    }}
                    aria-hidden="true"
                  />
                  <div className="flex items-baseline justify-between">
                    <span
                      className={`tech-sm transition-colors duration-500 ${
                        active ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {s.n}
                    </span>
                    <span
                      className={`h-1.5 w-1.5 bg-primary transition-opacity duration-500 ${
                        active ? "opacity-100" : "opacity-25"
                      }`}
                      aria-hidden="true"
                    />
                  </div>
                  <h3
                    className={`mt-6 flex items-center gap-2 font-mono text-[15px] tracking-[0.08em] transition-opacity duration-500 ${
                      active || done ? "opacity-100" : "opacity-60"
                    }`}
                  >
                    {s.k}
                    {i === 3 && stage === 3 && (
                      <span className="text-primary" aria-hidden="true">
                        ✓
                      </span>
                    )}
                  </h3>
                  <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">{s.d}</p>
                  {i < STEPS.length - 1 && (
                    <span
                      className="tech-sm absolute right-3 top-1/2 hidden -translate-y-1/2 text-muted-foreground/50 md:block"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  )}
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
