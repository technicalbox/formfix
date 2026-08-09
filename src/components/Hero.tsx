import { lazy, Suspense, useEffect, useState } from "react";
import { FilePlate } from "./FilePlate";
import { Reveal } from "./Reveal";

const HeroScene = lazy(() => import("./HeroScene"));

function useWebGLStage() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let timer = 0;
    if (typeof window !== "undefined") {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const wide = window.matchMedia("(min-width: 768px)").matches;
      let ok = false;
      try {
        const c = document.createElement("canvas");
        ok = !!(c.getContext("webgl2") || c.getContext("webgl"));
      } catch {
        ok = false;
      }
      if (ok && wide && !reduced) {
        timer = window.setTimeout(() => setReady(true), 120);
      }
    }
    return () => window.clearTimeout(timer);
  }, []);
  return ready;
}

export function Hero() {
  const webgl = useWebGLStage();

  return (
    <section className="relative overflow-hidden">
      <div className="atmos pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />
      <div
        className="grid-paper pointer-events-none absolute inset-0 -z-10 opacity-[0.55] [mask-image:radial-gradient(75%_60%_at_50%_35%,#000,transparent)]"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-[1400px] px-5 pb-16 pt-12 md:px-8 md:pb-28 md:pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-6">
          <div>
            <Reveal className="flex items-center gap-3">
              <span className="h-px w-8 bg-foreground/40" />
              <span className="tech text-muted-foreground">APPLICATION FILE INFRASTRUCTURE</span>
            </Reveal>

            <Reveal as="h1" delay={90} blur className="display-xl mt-6 max-w-[16ch]">
              Every application deserves a{" "}
              <span className="relative inline-block">
                perfect
                <span className="absolute -bottom-1 left-0 h-[3px] w-full bg-primary/70" aria-hidden="true" />
              </span>{" "}
              file.
            </Reveal>

            <Reveal delay={200} className="mt-7 max-w-[46ch] text-[15px] leading-relaxed text-muted-foreground md:text-[17px]">
              Resize, crop, compress and convert photos and signatures to the exact dimensions and
              file size your exam form demands. Everything runs in your browser — nothing is
              uploaded, nothing is stored.
            </Reveal>

            <Reveal delay={300} className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href="/tools/resize"
                className="tech group inline-flex items-center gap-3 bg-foreground px-6 py-4 text-background transition-transform duration-300 hover:-translate-y-[2px]"
              >
                UPLOAD YOUR FILE
                <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
                  →
                </span>
              </a>
              <a
                href="#tools"
                className="tech inline-flex items-center gap-3 border border-rule px-6 py-4 text-foreground transition-colors duration-300 hover:bg-secondary"
              >
                EXPLORE TOOLS
              </a>
            </Reveal>

            <Reveal delay={420} className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-rule pt-6">
              {[
                ["100%", "IN-BROWSER"],
                ["0", "UPLOADS"],
                ["11", "EXAM PRESETS"],
              ].map(([value, label]) => (
                <div key={label}>
                  <div className="font-mono text-xl tracking-tight">{value}</div>
                  <div className="tech-sm mt-1 text-muted-foreground">{label}</div>
                </div>
              ))}
            </Reveal>
          </div>

          {/* The artifact */}
          <Reveal delay={220} className="relative mx-auto w-full max-w-[340px] lg:max-w-none">
            <div className="relative aspect-[4/5] w-full">
              {webgl ? (
                <Suspense fallback={<PlateFallback />}>
                  <div className="absolute inset-0">
                    <HeroScene />
                  </div>
                </Suspense>
              ) : (
                <PlateFallback />
              )}
            </div>
            <div className="tech-sm mt-4 flex items-center justify-between text-muted-foreground lg:mt-0 lg:absolute lg:-bottom-8 lg:inset-x-6">
              <span>FIG. 01 — VERIFIED FILE</span>
              <span>JPG · 48.7 KB</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function PlateFallback() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <FilePlate className="w-[62%] max-w-[240px] rotate-[-2deg]" />
    </div>
  );
}
