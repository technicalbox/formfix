import { createFileRoute, notFound, Link } from "@tanstack/react-router";

import { AdSlot } from "@/components/AdSlot";
import { CheckWorkspace } from "@/components/CheckWorkspace";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PrivacySection } from "@/components/PrivacySection";
import { Reveal } from "@/components/Reveal";
import { ToolWorkspace } from "@/components/ToolWorkspace";
import {
  dimensionLabel,
  formatLabel,
  getCompressionTargetBySlug,
  getPresetBySlug,
  presets,
  sizeLabel,
} from "@/lib/presets";

const ORIGIN = "https://www.formfix.me";

function resolve(slug: string) {
  const preset = getPresetBySlug(slug);
  if (preset) return { kind: "preset" as const, preset };
  const target = getCompressionTargetBySlug(slug);
  if (target) return { kind: "compress" as const, target };
  return null;
}

export const Route = createFileRoute("/$slug")({
  loader: ({ params }) => {
    const found = resolve(params.slug);
    if (!found) throw notFound();
    return { slug: params.slug };
  },
  head: ({ params }) => {
    const found = resolve(params.slug);
    const url = `${ORIGIN}/${params.slug}`;
    if (!found) {
      return {
        meta: [{ title: "Page not found — FormFix" }, { name: "robots", content: "noindex" }],
      };
    }
    const title =
      found.kind === "preset"
        ? `${found.preset.displayName} — Size, Format & Dimensions | FormFix`
        : `${found.target.title} | FormFix`;
    const description =
      found.kind === "preset"
        ? `${found.preset.description} Check your file against the official specification and fix it in one click — free, private and in-browser.`
        : `${found.target.description} Free, instant and entirely in your browser.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: SlugPage,
  notFoundComponent: SlugNotFound,
});

function SlugPage() {
  const { slug } = Route.useLoaderData();
  const found = resolve(slug);
  if (!found) return <SlugNotFound />;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {found.kind === "preset" ? (
          <PresetPage slug={slug} />
        ) : (
          <CompressPage slug={slug} targetKB={found.target.targetKB} />
        )}
        <PrivacySection />
      </main>
      <Footer />
    </div>
  );
}

function PresetPage({ slug }: { slug: string }) {
  const preset = getPresetBySlug(slug)!;
  const related = (preset.relatedPresets ?? [])
    .map((id) => presets.find((p) => p.id === id))
    .filter(Boolean)
    .slice(0, 4);

  return (
    <>
      <section className="relative overflow-hidden border-b border-rule">
        <div className="atmos pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />
        <div
          className="grid-paper pointer-events-none absolute inset-0 -z-10 opacity-50 [mask-image:radial-gradient(70%_55%_at_45%_30%,#000,transparent)]"
          aria-hidden="true"
        />
        <div className="mx-auto max-w-[1400px] px-5 pb-14 pt-12 md:px-8 md:pb-20 md:pt-16">
          <Reveal className="flex items-center gap-3">
            <span className="h-px w-8 bg-foreground/40" />
            <span className="tech text-muted-foreground">
              {preset.organization} — {preset.type.toUpperCase()} SPECIFICATION
            </span>
          </Reveal>
          <Reveal as="h1" delay={80} blur className="display-lg mt-6 max-w-[22ch]">
            {preset.displayName}
          </Reveal>
          <Reveal
            delay={170}
            className="mt-6 max-w-[56ch] text-[15px] leading-relaxed text-muted-foreground md:text-[16.5px]"
          >
            {preset.description}
          </Reveal>

          <Reveal delay={240} className="mt-12 grid gap-px border border-rule bg-rule sm:grid-cols-3">
            {[
              ["FORMAT", formatLabel(preset)],
              ["DIMENSIONS", dimensionLabel(preset)],
              ["FILE SIZE", sizeLabel(preset)],
            ].map(([k, v]) => (
              <div key={k} className="bg-card px-6 py-7">
                <div className="tech-sm text-muted-foreground">{k}</div>
                <div className="mt-3 font-mono text-[18px]">{v}</div>
              </div>
            ))}
          </Reveal>

          <Reveal delay={300} className="mt-10 grid gap-10 md:grid-cols-[1.1fr_0.9fr]">
            <div>
              <h2 className="tech text-muted-foreground">OFFICIAL GUIDELINES</h2>
              <ul className="mt-5 space-y-3">
                {preset.guidelines.map((g) => (
                  <li key={g} className="flex gap-3 text-[14.5px] leading-relaxed">
                    <span className="tech-sm mt-[3px] text-primary" aria-hidden="true">
                      ▸
                    </span>
                    <span>{g}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-l border-rule pl-8">
              <h2 className="tech text-muted-foreground">SOURCE</h2>
              <p className="mt-5 text-[14px] leading-relaxed text-muted-foreground">
                {preset.source.document}
                <br />
                Notification year {preset.source.notificationYear} · verified{" "}
                {preset.source.verifiedDate}
              </p>
              <a
                href={preset.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline tech-sm mt-5 inline-block"
              >
                OFFICIAL PAGE ↗
              </a>
              {preset.notes && (
                <p className="mt-6 border-l-2 border-signal pl-3 text-[13px] leading-relaxed text-muted-foreground">
                  {preset.notes}
                </p>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      <CheckWorkspace initialPresetSlug={slug} />

      <AdSlot slotId={`preset-${slug}`} format="horizontal" className="py-12" />

      {related.length > 0 && (
        <section className="border-y border-rule">
          <div className="mx-auto max-w-[1400px] px-5 py-14 md:px-8">
            <h2 className="tech text-muted-foreground">RELATED SPECIFICATIONS</h2>
            <div className="mt-7 grid gap-px border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <Link
                  key={p!.id}
                  to="/$slug"
                  params={{ slug: p!.slug }}
                  className="group bg-card px-6 py-7 transition-colors duration-300 hover:bg-accent/40"
                >
                  <div className="tech-sm text-muted-foreground">{p!.exam}</div>
                  <div className="mt-3 text-[15px] leading-snug">{p!.displayName}</div>
                  <div className="tech-sm mt-4 text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    OPEN →
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function CompressPage({ slug, targetKB }: { slug: string; targetKB: number }) {
  const target = getCompressionTargetBySlug(slug)!;
  return (
    <>
      <section className="relative overflow-hidden border-b border-rule">
        <div className="atmos pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />
        <div className="mx-auto max-w-[1400px] px-5 pb-14 pt-12 md:px-8 md:pb-20 md:pt-16">
          <Reveal className="flex items-center gap-3">
            <span className="h-px w-8 bg-foreground/40" />
            <span className="tech text-muted-foreground">COMPRESSION TARGET — {targetKB} KB</span>
          </Reveal>
          <Reveal as="h1" delay={80} blur className="display-lg mt-6 max-w-[20ch]">
            {target.title}
          </Reveal>
          <Reveal
            delay={170}
            className="mt-6 max-w-[54ch] text-[15px] leading-relaxed text-muted-foreground md:text-[16.5px]"
          >
            {target.description}
          </Reveal>
          {target.commonUses.length > 0 && (
            <Reveal delay={240} className="mt-10">
              <div className="tech text-muted-foreground">COMMONLY REQUIRED FOR</div>
              <ul className="mt-5 flex flex-wrap gap-2">
                {target.commonUses.map((u) => (
                  <li key={u} className="tech-sm border border-rule px-3 py-2 text-muted-foreground">
                    {u}
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
        </div>
      </section>
      <ToolWorkspace op="compress" defaultTargetKB={targetKB} />
    </>
  );
}

function SlugNotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-[1400px] px-5 py-28 md:px-8">
        <div className="tech text-muted-foreground">404 — NO SUCH SPECIFICATION</div>
        <h1 className="display-lg mt-6 max-w-[20ch]">This page isn’t in the archive.</h1>
        <p className="mt-6 max-w-[46ch] text-[15px] leading-relaxed text-muted-foreground">
          The exam specification or compression target you asked for doesn’t exist yet. Start from
          the checker instead.
        </p>
        <Link
          to="/check-image"
          className="tech mt-10 inline-flex items-center gap-3 bg-foreground px-6 py-4 text-background"
        >
          CHECK MY IMAGE →
        </Link>
      </main>
      <Footer />
    </div>
  );
}
