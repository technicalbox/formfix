import { Reveal } from "./Reveal";
import { FilePlate } from "./FilePlate";

const TOOLS = [
  {
    href: "/tools/resize",
    name: "Resize",
    desc: "Set exact pixel dimensions or physical size in centimetres.",
    plate: { label: "RESIZE", dimensions: "200 × 230 PX", format: "JPG", size: "112 KB", status: "EXACT PX" },
  },
  {
    href: "/tools/crop",
    name: "Crop",
    desc: "Lock the aspect ratio and frame the face the way examiners expect.",
    plate: { label: "CROP", dimensions: "3.5 × 4.5 CM", format: "JPG", size: "96 KB", status: "RATIO LOCKED" },
  },
  {
    href: "/tools/compress",
    name: "Compress",
    desc: "Hit a kilobyte target without visibly damaging the photograph.",
    plate: { label: "COMPRESS", dimensions: "200 × 230 PX", format: "JPG", size: "48.7 KB", status: "≤ 50 KB" },
  },
  {
    href: "/tools/convert",
    name: "Convert",
    desc: "Move between JPG, PNG and WEBP when the form insists on one format.",
    plate: { label: "CONVERT", dimensions: "200 × 230 PX", format: "PNG → JPG", size: "51 KB", status: "FORMAT OK" },
  },
];

export function ToolsGrid() {
  return (
    <section id="tools" className="scroll-mt-20 border-t border-rule">
      <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-8 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal className="tech text-muted-foreground">FOUR TRANSFORMATIONS</Reveal>
            <Reveal as="h2" delay={80} className="display-md mt-4 max-w-[18ch]">
              The same file, four ways.
            </Reveal>
          </div>
          <Reveal delay={140} className="max-w-[38ch] text-[14px] leading-relaxed text-muted-foreground">
            Each tool works on the file already in your browser — chain them together and download
            once at the end.
          </Reveal>
        </div>

        <div className="mt-12 grid gap-px bg-rule sm:grid-cols-2 lg:grid-cols-4">
          {TOOLS.map((t, i) => (
            <Reveal key={t.href} delay={i * 80} className="bg-background">
              <a
                href={t.href}
                className="group flex h-full flex-col justify-between gap-8 p-6 transition-colors duration-300 hover:bg-card md:p-7"
              >
                <div className="relative mx-auto w-[62%] max-w-[170px] transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-[-1.5deg]">
                  <FilePlate {...t.plate} guides={false} />
                </div>
                <div>
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-lg font-medium tracking-[-0.02em]">{t.name}</h3>
                    <span className="tech-sm text-muted-foreground transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">{t.desc}</p>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
