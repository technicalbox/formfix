import { useState } from "react";
import { Reveal } from "./Reveal";

export const FAQS = [
  {
    q: "Are my files uploaded to a server?",
    a: "No. All processing happens directly in your browser using your device's processor. Your files never leave your device — they are not sent to any server.",
  },
  {
    q: "What file formats are supported?",
    a: "FormFix currently supports JPG/JPEG, PNG, and WebP images. Most Indian exam portals require JPG format, which FormFix can convert to automatically.",
  },
  {
    q: "How does the compression work?",
    a: "FormFix uses a binary search algorithm to find the optimal compression quality that keeps your file under the target size (e.g., ≤ 50 KB) while maintaining the best possible image quality.",
  },
  {
    q: "Are the exam requirements accurate?",
    a: "Requirements are researched from official government and exam body websites. However, requirements can change between notification years. Always verify against the current official notification for your specific exam.",
  },
  {
    q: "Does it work on mobile?",
    a: "Yes. FormFix is designed mobile-first. The full upload → crop → compress → download workflow works on Android Chrome and iOS Safari. You can even use your phone camera to capture photos directly.",
  },
  {
    q: "Is FormFix free?",
    a: "Yes. FormFix is completely free to use. There are no hidden charges, no sign-up required, and no limits on the number of files you can process.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="border-t border-rule">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-5 py-16 md:px-8 md:py-24 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <Reveal className="tech text-muted-foreground">FAQ</Reveal>
          <Reveal as="h2" delay={80} className="display-md mt-4 max-w-[12ch]">
            Questions, answered.
          </Reveal>
        </div>

        <div className="border-t border-rule">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={i * 50} className="border-b border-rule">
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-start justify-between gap-6 py-5 text-left"
                  >
                    <span className="text-[15px] font-medium tracking-[-0.01em] md:text-[16px]">
                      {f.q}
                    </span>
                    <span
                      className={`mt-1 font-mono text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                      aria-hidden="true"
                      style={{ transitionTimingFunction: "var(--ease-ff)" }}
                    >
                      +
                    </span>
                  </button>
                </h3>
                <div
                  className="grid transition-[grid-template-rows] duration-400"
                  style={{
                    gridTemplateRows: isOpen ? "1fr" : "0fr",
                    transitionTimingFunction: "var(--ease-ff)",
                  }}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-[62ch] pb-6 text-[14px] leading-relaxed text-muted-foreground">
                      {f.a}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
