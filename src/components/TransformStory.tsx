import { useEffect, useRef, useState } from "react";
import { setStageState } from "@/lib/stage";

const FRAMES = [
  {
    size: "3.2 MB",
    kb: 3276,
    dim: "4032 × 3024 PX",
    ratio: 4 / 3,
    note: "Straight from the camera. Too large, wrong shape.",
    stage: 0,
  },
  {
    size: "1.8 MB",
    kb: 1843,
    dim: "1200 × 1380 PX",
    ratio: 1200 / 1380,
    note: "Resampled down with high-quality Lanczos filtering.",
    stage: 1,
  },
  {
    size: "920 KB",
    kb: 920,
    dim: "600 × 690 PX",
    ratio: 600 / 690,
    note: "Cropped to the required aspect ratio.",
    stage: 1,
  },
  {
    size: "120 KB",
    kb: 120,
    dim: "200 × 230 PX",
    ratio: 200 / 230,
    note: "Scaled to the exact pixel dimensions.",
    stage: 2,
  },
  {
    size: "48.7 KB",
    kb: 48.7,
    dim: "200 × 230 PX",
    ratio: 200 / 230,
    note: "Compressed inside the accepted size window.",
    stage: 3,
  },
];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

function formatKb(kb: number) {
  if (kb >= 1024) return `${(kb / 1024).toFixed(1)} MB`;
  return `${kb >= 100 ? Math.round(kb) : kb.toFixed(1)} KB`;
}

export function TransformStory() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [p, setP] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const total = r.height - window.innerHeight;
        if (total <= 0) return;
        const next = clamp01(-r.top / total);
        setP(next);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Continuous position along the five states — never a discrete jump.
  // settle on the final state slightly before the zone ends
  const pe = clamp01(p / 0.9);
  const pos = pe * (FRAMES.length - 1);
  const i = Math.min(FRAMES.length - 1, Math.round(pos));
  const lo = Math.floor(pos);
  const hi = Math.min(FRAMES.length - 1, lo + 1);
  const t = pos - lo;
  const a = FRAMES[lo]!;
  const b = FRAMES[hi]!;
  const f = FRAMES[i]!;

  const kb = lerp(a.kb, b.kb, t);
  const ratio = lerp(a.ratio, b.ratio, t);
  const scale = lerp(1.06, 0.82, p);
  const rotate = lerp(-2.6, 0, p);
  const drift = lerp(46, -46, p);
  const cropInset = `${lerp(17, 5.5, clamp01((p - 0.18) / 0.55))}%`;
  const cropOpacity = clamp01((p - 0.1) / 0.22);
  const guideOpacity = clamp01((p - 0.04) / 0.2);
  const verified = pe > 0.985;

  useEffect(() => {
    setStageState({ stage: f.stage, progress: p });
  }, [f.stage, p]);

  return (
    <section
      ref={ref}
      id="transform"
      className="relative border-t border-rule"
      style={{ minHeight: "300vh" }}
      aria-label="How one file moves through the pipeline"
    >
      <div className="sticky top-16 flex min-h-[calc(100vh-4rem)] items-center overflow-hidden">
        <div
          className="grid-paper pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(70%_60%_at_60%_50%,#000,transparent)]"
          aria-hidden="true"
        />
        <div className="relative mx-auto grid w-full max-w-[1400px] items-center gap-10 px-5 py-10 md:px-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <div className="tech text-muted-foreground">ONE FILE, FIVE STATES</div>
            <h2 className="display-lg mt-5 max-w-[14ch]">From camera roll to accepted.</h2>
            <p className="mt-5 max-w-[42ch] text-[15px] leading-relaxed text-muted-foreground">
              Watch the same photograph move through the pipeline — dimensions retick, the crop
              frame lands, and the file size falls until it fits the notification exactly.
            </p>

            <ol className="mt-9 space-y-3">
              {FRAMES.map((frame, idx) => (
                <li
                  key={frame.size}
                  className={`flex items-center gap-4 border-l-2 py-2 pl-4 transition-all duration-500 ${
                    idx === i ? "border-primary opacity-100" : "border-rule opacity-40"
                  }`}
                >
                  <span className="tech-sm w-16 text-muted-foreground">
                    {frame.dim.split(" ")[0]}
                  </span>
                  <span className="font-mono text-sm">{frame.size}</span>
                </li>
              ))}
            </ol>

            <p
              key={f.note}
              className="mt-8 max-w-[46ch] border-l-2 border-primary pl-4 text-[13.5px] leading-relaxed text-foreground"
            >
              {f.note}
            </p>
          </div>

          {/* The artifact travelling through the zone */}
          <div className="relative mx-auto flex aspect-[4/5] w-full max-w-[480px] items-center justify-center">
            <div
              className="ticks-x absolute left-0 right-0 top-0 h-2 transition-opacity duration-500"
              style={{ opacity: guideOpacity * 0.45 }}
              aria-hidden="true"
            />
            <div
              className="ticks-y absolute bottom-0 left-0 top-0 w-2 transition-opacity duration-500"
              style={{ opacity: guideOpacity * 0.45 }}
              aria-hidden="true"
            />

            {/* depth layer — the previous state, parallaxing behind */}
            <div
              className="absolute border border-rule bg-card/70"
              style={{
                width: "min(70%, 300px)",
                aspectRatio: `${a.ratio}`,
                transform: `translate3d(${lerp(-26, 18, p)}px, ${drift * 0.45}px, 0) scale(${scale * 0.88}) rotate(${rotate * 1.8}deg)`,
                opacity: 0.4 * (1 - p * 0.6),
              }}
              aria-hidden="true"
            />

            <div
              className="shadow-plate relative border border-rule bg-card"
              style={{
                width: "min(78%, 340px)",
                aspectRatio: `${ratio}`,
                transform: `translate3d(0, ${drift}px, 0) scale(${scale}) rotate(${rotate}deg)`,
                willChange: "transform",
              }}
            >
              <div
                className="absolute inset-0 grid-paper opacity-50"
                style={{ backgroundSize: "16px 16px" }}
              />
              <svg
                viewBox="0 0 200 230"
                preserveAspectRatio="xMidYMid slice"
                className="absolute inset-0 h-full w-full"
              >
                <circle cx="100" cy="88" r="40" fill="var(--color-primary)" opacity="0.22" />
                <path d="M28 230c0-42 32-70 72-70s72 28 72 70Z" fill="var(--color-cyan)" opacity="0.3" />
              </svg>

              {/* crop frame entering */}
              <div
                className="absolute border border-primary/60"
                style={{ inset: cropInset, opacity: cropOpacity }}
              />
              {[
                "left-0 top-0",
                "right-0 top-0",
                "left-0 bottom-0",
                "right-0 bottom-0",
              ].map((pos2) => (
                <span
                  key={pos2}
                  className={`absolute h-2 w-2 bg-primary ${pos2}`}
                  style={{ opacity: cropOpacity * 0.9, transform: "translate(-50%, -50%)" }}
                  aria-hidden="true"
                />
              ))}

              <div className="tech-sm absolute -bottom-9 left-0 flex w-full items-center justify-between text-muted-foreground">
                <span>{f.dim}</span>
                <span className={verified ? "text-primary" : "text-foreground"}>
                  {verified ? "✓ " : ""}
                  {formatKb(kb)}
                </span>
              </div>
            </div>

            {/* live counter, right rail */}
            <div className="tech-sm absolute right-0 top-6 hidden text-right text-muted-foreground lg:block">
              <div>STAGE {String(f.stage + 1).padStart(2, "0")} / 04</div>
              <div className="mt-2 font-mono text-2xl tracking-tight text-foreground">
                {formatKb(kb)}
              </div>
              <div className="mt-3 h-24 w-px bg-rule">
                <div className="w-px bg-primary" style={{ height: `${p * 100}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
