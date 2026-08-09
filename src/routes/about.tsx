import { createFileRoute, Link } from "@tanstack/react-router";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PrivacySection } from "@/components/PrivacySection";
import { Reveal } from "@/components/Reveal";

const TITLE = "About FormFix — Independent Image Utility for Application Forms";
const DESCRIPTION =
  "Learn about FormFix, an independent, browser-local image utility for resizing, cropping, compressing, and validating application photos and signatures.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.formfix.me/about" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://www.formfix.me/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="relative overflow-hidden border-b border-rule">
          <div className="atmos pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />
          <div
            className="grid-paper pointer-events-none absolute inset-0 -z-10 opacity-50 [mask-image:radial-gradient(70%_55%_at_45%_30%,#000,transparent)]"
            aria-hidden="true"
          />
          <div className="mx-auto max-w-[1400px] px-5 pb-14 pt-12 md:px-8 md:pb-20 md:pt-16">
            <Reveal className="flex items-center gap-3">
              <span className="h-px w-8 bg-foreground/40" />
              <span className="tech text-muted-foreground">INDEPENDENT UTILITY INFRASTRUCTURE</span>
            </Reveal>
            <Reveal as="h1" delay={80} blur className="display-lg mt-6 max-w-[22ch]">
              About FormFix
            </Reveal>
            <Reveal
              delay={170}
              className="mt-6 max-w-[56ch] text-[15px] leading-relaxed text-muted-foreground md:text-[16.5px]"
            >
              FormFix is an independent utility designed to help applicants prepare compliant digital photos,
              signatures, and documents for online examination and job application portals.
            </Reveal>
          </div>
        </section>

        <section className="mx-auto max-w-[900px] px-5 py-16 md:px-8 md:py-24">
          <div className="space-y-12">
            <Reveal className="border border-rule bg-card p-8 md:p-10">
              <h2 className="tech text-muted-foreground">WHAT FORMFIX DOES</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                Online application portals often reject file uploads due to strict requirements for pixel dimensions,
                file size (in KB), aspect ratio, and file format. FormFix provides specialized tools to solve these
                exact problems directly in your browser:
              </p>
              <ul className="mt-6 space-y-4 font-mono text-[14px]">
                <li className="flex gap-3">
                  <span className="text-primary">▸</span>
                  <span>
                    <strong className="font-semibold text-foreground">Resize Image:</strong> Change width and height to exact pixel specifications required by application forms.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">▸</span>
                  <span>
                    <strong className="font-semibold text-foreground">Crop Image:</strong> Aspect-ratio-locked and freeform cropping with intuitive drag, zoom, and pan controls.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">▸</span>
                  <span>
                    <strong className="font-semibold text-foreground">Compress Image:</strong> Smart binary-search compression algorithm to reduce file size to ≤ target KB (e.g., 20 KB, 50 KB, 100 KB) without sacrificing visual quality.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">▸</span>
                  <span>
                    <strong className="font-semibold text-foreground">Convert Format:</strong> Seamless conversion between JPG/JPEG, PNG, and WebP formats.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">▸</span>
                  <span>
                    <strong className="font-semibold text-foreground">Exam Presets:</strong> Pre-configured specifications for major exams (SSC, UPSC, IBPS, NEET, JEE, RRB) to auto-apply required dimensions and file size limits.
                  </span>
                </li>
              </ul>
            </Reveal>

            <Reveal className="border border-rule bg-card p-8 md:p-10">
              <h2 className="tech text-muted-foreground">BROWSER-LOCAL PROCESSING & PRIVACY ARCHITECTURE</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                FormFix is built with a <strong className="text-foreground">privacy-first architecture</strong>. All image
                processing operations — including resizing, cropping, compression, and validation — are performed
                entirely within your web browser using client-side JavaScript and HTML5 Canvas technology.
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                Your uploaded photos, signatures, and documents are{" "}
                <strong className="text-foreground">never uploaded to any external server</strong> or cloud storage.
                They remain strictly on your local device throughout the entire workflow.
              </p>
            </Reveal>

            <Reveal className="border border-rule bg-card p-8 md:p-10">
              <h2 className="tech text-muted-foreground">INDEPENDENT SERVICE DISCLAIMER</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                FormFix is an <strong className="text-foreground">independent utility website</strong> created solely
                to assist users with file preparation. FormFix is{" "}
                <strong className="text-foreground">
                  not affiliated with, endorsed by, or sponsored by any government organization, examination board, or
                  testing agency
                </strong>
                , including but not limited to the Staff Selection Commission (SSC), Union Public Service Commission
                (UPSC), Institute of Banking Personnel Selection (IBPS), National Testing Agency (NTA), or Railway
                Recruitment Boards (RRB).
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                All exam names, logos, and trademarks referenced on this site belong to their respective trademark
                owners. Official requirements are researched from publicly available notifications, but users are strongly
                advised to verify current requirements against the official notification for their specific exam before
                submitting an application.
              </p>
            </Reveal>

            <Reveal className="border border-rule bg-card p-8 md:p-10">
              <h2 className="tech text-muted-foreground">CONTACT & FEEDBACK</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                If you encounter issues, notice an outdated requirement for an exam preset, or have questions about how
                FormFix works, please visit our{" "}
                <Link to="/contact" className="text-primary underline">
                  Contact Page
                </Link>{" "}
                to get in touch with us.
              </p>
            </Reveal>
          </div>
        </section>

        <PrivacySection />
      </main>
      <Footer />
    </div>
  );
}
