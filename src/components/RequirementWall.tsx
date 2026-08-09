import { Reveal } from "./Reveal";
import {
  compressionTargets,
  dimensionLabel,
  formatLabel,
  presetGroups,
  sizeLabel,
} from "@/lib/presets";

export function RequirementWall() {
  const groups = presetGroups();

  return (
    <section className="border-t border-rule">
      <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-8 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal className="tech text-muted-foreground">REQUIREMENT WALL</Reveal>
            <Reveal as="h2" delay={80} className="display-md mt-4 max-w-[20ch]">
              The numbers, straight from the notification.
            </Reveal>
          </div>
          <Reveal delay={140} className="max-w-[38ch] text-[14px] leading-relaxed text-muted-foreground">
            Presets are transcribed from official documents and dated. Always confirm against the
            notification for your cycle.
          </Reveal>
        </div>

        <div className="mt-12 grid gap-px bg-rule md:grid-cols-2 xl:grid-cols-3">
          {groups.map((group, gi) => (
            <Reveal key={group.exam} delay={gi * 70} className="bg-background p-6 md:p-7">
              <div className="flex items-baseline justify-between border-b border-rule pb-4">
                <h3 className="text-[15px] font-medium tracking-[-0.02em]">{group.exam}</h3>
                <span className="tech-sm text-muted-foreground">
                  {group.items[0]?.source.notificationYear}
                </span>
              </div>

              <div className="mt-5 space-y-5">
                {group.items.map((p) => (
                  <a key={p.slug} href={`/${p.slug}`} className="group block">
                    <div className="flex items-center justify-between">
                      <span className="tech text-muted-foreground group-hover:text-foreground">
                        {p.type.toUpperCase()}
                      </span>
                      <span className="tech-sm text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                        OPEN →
                      </span>
                    </div>
                    <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 border-l border-rule pl-4">
                      <dt className="tech-sm text-muted-foreground">DIM</dt>
                      <dd className="font-mono text-[12.5px]">{dimensionLabel(p)}</dd>
                      <dt className="tech-sm text-muted-foreground">SIZE</dt>
                      <dd className="font-mono text-[12.5px]">{sizeLabel(p)}</dd>
                      <dt className="tech-sm text-muted-foreground">FMT</dt>
                      <dd className="font-mono text-[12.5px]">{formatLabel(p)}</dd>
                    </dl>
                  </a>
                ))}
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14 border-t border-rule pt-8">
          <div className="tech text-muted-foreground">COMPRESSION TARGETS</div>
          <div className="mt-5 grid gap-px bg-rule sm:grid-cols-2 lg:grid-cols-4">
            {compressionTargets.map((t) => (
              <a
                key={t.slug}
                href={`/${t.slug}`}
                className="group bg-background p-6 transition-colors duration-300 hover:bg-card"
              >
                <div className="font-mono text-3xl tracking-tight">
                  ≤{t.targetKB}
                  <span className="text-base text-muted-foreground"> KB</span>
                </div>
                <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
                  {t.commonUses.slice(0, 2).join(" · ")}
                </p>
                <span className="tech-sm mt-4 inline-block text-muted-foreground transition-transform duration-300 group-hover:translate-x-1">
                  COMPRESS →
                </span>
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
