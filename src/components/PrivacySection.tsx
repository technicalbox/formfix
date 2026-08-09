import { Reveal } from "./Reveal";

const NODES = [
  { k: "YOUR DEVICE", d: "The file is opened locally by your browser." },
  { k: "PROCESSING", d: "Canvas and WebAssembly do the work on your own processor." },
  { k: "RESULT", d: "The finished file is written straight back to your downloads." },
];

export function PrivacySection() {
  return (
    <section className="relative overflow-hidden border-t border-rule bg-foreground text-background">
      <div
        className="grid-paper pointer-events-none absolute inset-0 opacity-[0.07]"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-[1400px] px-5 py-16 md:px-8 md:py-24">
        <Reveal className="tech text-background/55">PRIVACY BY ARCHITECTURE</Reveal>
        <Reveal as="h2" delay={80} className="display-md mt-4 max-w-[18ch]">
          Your files stay on your device.
        </Reveal>
        <Reveal delay={140} className="mt-5 max-w-[58ch] text-[15px] leading-relaxed text-background/70">
          FormFix processes everything using your browser's built-in image capabilities. Photos,
          signatures, and documents are never uploaded to any server. No account needed. No data
          collected.
        </Reveal>

        <div className="mt-14 grid gap-px bg-background/15 md:grid-cols-3">
          {NODES.map((n, i) => (
            <Reveal key={n.k} delay={i * 90} className="relative bg-foreground p-6 md:p-8">
              <div className="flex items-center gap-3">
                <span className="grid h-7 w-7 place-items-center border border-background/30 font-mono text-[11px]">
                  {i + 1}
                </span>
                <span className="tech">{n.k}</span>
              </div>
              <p className="mt-5 text-[13.5px] leading-relaxed text-background/65">{n.d}</p>
              {i < NODES.length - 1 && (
                <span
                  className="absolute right-4 top-8 hidden font-mono text-background/35 md:block"
                  aria-hidden="true"
                >
                  →
                </span>
              )}
            </Reveal>
          ))}
        </div>

        <Reveal delay={200} className="mt-10 flex flex-wrap gap-x-10 gap-y-4 border-t border-background/15 pt-8">
          {[
            ["NO UPLOAD", "Files never touch a server"],
            ["NO ACCOUNT", "Nothing to sign up for"],
            ["NO TRACKING", "No file data collected"],
          ].map(([k, v]) => (
            <div key={k}>
              <div className="tech">{k}</div>
              <div className="mt-2 text-[13px] text-background/60">{v}</div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
