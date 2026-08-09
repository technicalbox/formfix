import { createFileRoute } from "@tanstack/react-router";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PrivacySection } from "@/components/PrivacySection";
import { Reveal } from "@/components/Reveal";

const TITLE = "Contact Us — FormFix";
const DESCRIPTION =
  "Get in touch with FormFix for bug reports, outdated exam requirement reports, feedback, or privacy inquiries.";
const CONTACT_EMAIL = "contact@formfix.me";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.formfix.me/contact" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://www.formfix.me/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
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
              <span className="tech text-muted-foreground">SUPPORT & FEEDBACK</span>
            </Reveal>
            <Reveal as="h1" delay={80} blur className="display-lg mt-6 max-w-[22ch]">
              Contact Us
            </Reveal>
            <Reveal
              delay={170}
              className="mt-6 max-w-[56ch] text-[15px] leading-relaxed text-muted-foreground md:text-[16.5px]"
            >
              Have a question, feedback, or noticed an outdated exam requirement? We'd love to hear from you.
            </Reveal>
          </div>
        </section>

        <section className="mx-auto max-w-[900px] px-5 py-16 md:px-8 md:py-24">
          <div className="space-y-12">
            <Reveal className="border border-rule bg-card p-8 md:p-10">
              <h2 className="tech text-muted-foreground">HOW TO REACH US</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                You can contact the FormFix team directly via email at:
              </p>

              <div className="mt-6 flex items-center gap-3 border border-rule bg-accent/40 px-6 py-4">
                <span className="tech-sm text-primary">EMAIL:</span>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="font-mono text-[16px] font-medium text-foreground transition-colors hover:text-primary"
                >
                  {CONTACT_EMAIL}
                </a>
              </div>
            </Reveal>

            <Reveal className="border border-rule bg-card p-8 md:p-10">
              <h2 className="tech text-muted-foreground">WHAT YOU CAN CONTACT US FOR</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="border border-rule bg-background p-5">
                  <h3 className="tech-sm text-foreground">🐛 BUG REPORTS</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                    If an image fails to process, or a tool button doesn't respond on your device or browser version.
                  </p>
                </div>
                <div className="border border-rule bg-background p-5">
                  <h3 className="tech-sm text-foreground">📋 OUTDATED EXAM REQUIREMENTS</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                    If an official exam notification has changed photo/signature dimensions or file size limits, let us
                    know so we can update the preset immediately.
                  </p>
                </div>
                <div className="border border-rule bg-background p-5">
                  <h3 className="tech-sm text-foreground">🔒 PRIVACY INQUIRIES</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                    Questions regarding our client-side processing architecture or privacy policies.
                  </p>
                </div>
                <div className="border border-rule bg-background p-5">
                  <h3 className="tech-sm text-foreground">💡 GENERAL FEEDBACK</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                    Suggestions for new exam presets, compression targets, or user interface improvements.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal className="border border-rule bg-card p-8 md:p-10">
              <h2 className="tech text-muted-foreground">RESPONSE TIME</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                We review all incoming messages and aim to respond to bug reports and requirement correction requests
                within 24 to 48 hours.
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
