import { createFileRoute, Link } from "@tanstack/react-router";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PrivacySection } from "@/components/PrivacySection";
import { Reveal } from "@/components/Reveal";

const TITLE = "Terms of Service — FormFix";
const DESCRIPTION =
  "FormFix Terms of Service. User responsibilities, independent service disclaimers, and exam requirement verification guidance.";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.formfix.me/terms" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://www.formfix.me/terms" }],
  }),
  component: TermsPage,
});

function TermsPage() {
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
              <span className="tech text-muted-foreground">LEGAL & USER AGREEMENT</span>
            </Reveal>
            <Reveal as="h1" delay={80} blur className="display-lg mt-6 max-w-[22ch]">
              Terms of Service
            </Reveal>
            <Reveal
              delay={170}
              className="mt-6 max-w-[56ch] text-[15px] leading-relaxed text-muted-foreground md:text-[16.5px]"
            >
              Last updated: February 2026. Please read these terms carefully before using FormFix.
            </Reveal>
          </div>
        </section>

        <section className="mx-auto max-w-[900px] px-5 py-16 md:px-8 md:py-24">
          <div className="space-y-10">
            <Reveal className="border border-rule bg-card p-8 md:p-10">
              <h2 className="tech text-muted-foreground">1. ACCEPTABLE USE</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                FormFix provides web-based image manipulation utilities for personal, educational, and non-commercial
                application preparation. By accessing or using FormFix, you agree to use the service in compliance with
                applicable laws and not to attempt to disrupt or tamper with website assets or infrastructure.
              </p>
            </Reveal>

            <Reveal className="border border-rule bg-card p-8 md:p-10">
              <h2 className="tech text-muted-foreground">2. INDEPENDENT SERVICE & EXAM AUTHORITY DISCLAIMER</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                FormFix is an <strong className="text-foreground">independent utility website</strong>. FormFix is{" "}
                <strong className="text-foreground">
                  not affiliated with, endorsed by, sponsored by, or officially connected to any government agency,
                  examination body, or recruitment board
                </strong>
                , including but not limited to SSC, UPSC, IBPS, NTA, RRB, or state public service commissions.
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                All trademarks, exam names, and official notification titles cited on FormFix belong exclusively to their
                respective owners. Their mention does not imply any official relationship or endorsement.
              </p>
            </Reveal>

            <Reveal className="border border-rule bg-card p-8 md:p-10">
              <h2 className="tech text-muted-foreground">3. REQUIREMENT ACCURACY & USER VERIFICATION RESPONSIBILITY</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                FormFix compiles photo, signature, and document specifications from publicly available official
                notifications. However, examination authorities frequently update file size limits, pixel dimensions,
                background color requirements, and format rules between notification cycles.
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground border-l-2 border-signal pl-4 font-medium text-foreground">
                Important: Users are solely responsible for verifying their specific application requirements against the
                current, official recruitment notification issued by the respective authority prior to submitting their
                application.
              </p>
            </Reveal>

            <Reveal className="border border-rule bg-card p-8 md:p-10">
              <h2 className="tech text-muted-foreground">4. NO GUARANTEE OF APPLICATION ACCEPTANCE</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                While FormFix provides validation checks based on recorded criteria, FormFix does not guarantee that
                files processed on this site will be accepted by third-party application portals. Acceptance remains under
                the sole discretion of the receiving exam authority or portal software.
              </p>
            </Reveal>

            <Reveal className="border border-rule bg-card p-8 md:p-10">
              <h2 className="tech text-muted-foreground">5. SERVICE AVAILABILITY & MODIFICATIONS</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                FormFix is provided on an "as is" and "as available" basis without warranties of any kind. We reserve the
                right to modify, update, or discontinue tools, presets, or features at any time without prior notice.
              </p>
            </Reveal>

            <Reveal className="border border-rule bg-card p-8 md:p-10">
              <h2 className="tech text-muted-foreground">6. INTELLECTUAL PROPERTY</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                The code, brand design, interface components, and custom content of FormFix are protected by applicable
                copyright laws. You may not reproduce, duplicate, or redistribute website code or layout assets without permission.
              </p>
            </Reveal>

            <Reveal className="border border-rule bg-card p-8 md:p-10">
              <h2 className="tech text-muted-foreground">7. LIMITATION OF LIABILITY</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                To the maximum extent permitted by law, FormFix and its creators shall not be liable for any direct,
                indirect, incidental, or consequential damages resulting from the use of, or inability to use, our tools or
                information presented on the website.
              </p>
            </Reveal>

            <Reveal className="border border-rule bg-card p-8 md:p-10">
              <h2 className="tech text-muted-foreground">8. CONTACT INFORMATION</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                Questions regarding these Terms of Service may be directed to our team via the{" "}
                <Link to="/contact" className="text-primary underline">
                  Contact Page
                </Link>{" "}
                or by emailing{" "}
                <a href="mailto:contact@formfix.me" className="text-primary underline">
                  contact@formfix.me
                </a>
                .
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
