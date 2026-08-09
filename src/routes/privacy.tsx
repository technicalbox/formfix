import { createFileRoute, Link } from "@tanstack/react-router";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PrivacySection } from "@/components/PrivacySection";
import { Reveal } from "@/components/Reveal";

const TITLE = "Privacy Policy — FormFix";
const DESCRIPTION =
  "FormFix Privacy Policy. Learn how your files and data are processed with 100% browser-local execution.";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.formfix.me/privacy" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://www.formfix.me/privacy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
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
              <span className="tech text-muted-foreground">LEGAL & ARCHITECTURE</span>
            </Reveal>
            <Reveal as="h1" delay={80} blur className="display-lg mt-6 max-w-[22ch]">
              Privacy Policy
            </Reveal>
            <Reveal
              delay={170}
              className="mt-6 max-w-[56ch] text-[15px] leading-relaxed text-muted-foreground md:text-[16.5px]"
            >
              Last updated: February 2026. This policy explains how FormFix handles user privacy and local file processing.
            </Reveal>
          </div>
        </section>

        <section className="mx-auto max-w-[900px] px-5 py-16 md:px-8 md:py-24">
          <div className="space-y-10">
            <Reveal className="border border-rule bg-card p-8 md:p-10">
              <h2 className="tech text-muted-foreground">1. INFORMATION PROCESSED BY FORMFIX</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                FormFix is designed as a client-side utility. When you select, upload, or drag-and-drop a photo,
                signature, or document into FormFix, all image manipulation tasks (resizing, cropping, compression,
                format conversion, and validation) are executed entirely on your device using your browser's native
                JavaScript processor and HTML5 Canvas API.
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                Your uploaded files <strong className="text-foreground">are not transferred to any remote server or cloud storage</strong> operated by FormFix. FormFix does not maintain a server-side file upload pipeline.
              </p>
            </Reveal>

            <Reveal className="border border-rule bg-card p-8 md:p-10">
              <h2 className="tech text-muted-foreground">2. LOCAL BROWSER PROCESSING & STORAGE</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                Selected images exist temporarily in your web browser's volatile memory (RAM) while you adjust settings
                or perform edits. Once you click download or close the page, the processed file is downloaded directly
                to your device's local storage.
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                FormFix does not save your images to persistent browser storage (<code className="font-mono text-foreground">localStorage</code> or <code className="font-mono text-foreground">IndexedDB</code>) unless explicitly required for temporary workspace state.
              </p>
            </Reveal>

            <Reveal className="border border-rule bg-card p-8 md:p-10">
              <h2 className="tech text-muted-foreground">3. PERSONAL INFORMATION</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                FormFix does not require user registration, account creation, or login. We do not collect names, email
                addresses, phone numbers, or government identification details when you use the tool.
              </p>
            </Reveal>

            <Reveal className="border border-rule bg-card p-8 md:p-10">
              <h2 className="tech text-muted-foreground">4. COOKIES & WEB STORAGE</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                FormFix does not set first-party cookies for file processing or user tracking. Essential web infrastructure
                providers (such as hosting and CDN services) may set standard HTTP headers for connection reliability,
                routing, and DDoS prevention.
              </p>
            </Reveal>

            <Reveal className="border border-rule bg-card p-8 md:p-10">
              <h2 className="tech text-muted-foreground">5. ADVERTISING & THIRD-PARTY DISCLOSURES</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                Live third-party advertising scripts (such as Google AdSense) are <strong className="text-foreground">not currently active</strong> on FormFix. FormFix may introduce third-party display advertising in the future to support website maintenance.
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                When third-party advertising is enabled, this Privacy Policy will be updated to include all required
                disclosures regarding third-party ad networks, vendor cookies, and ad-personalization choices.
              </p>
            </Reveal>

            <Reveal className="border border-rule bg-card p-8 md:p-10">
              <h2 className="tech text-muted-foreground">6. THIRD-PARTY HOSTING SERVICES</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                FormFix is hosted on global web infrastructure. Hosting providers collect standard server logs (such as
                IP addresses, user agent strings, and request timestamps) to maintain server health, security, and bandwidth analytics.
              </p>
            </Reveal>

            <Reveal className="border border-rule bg-card p-8 md:p-10">
              <h2 className="tech text-muted-foreground">7. DATA SECURITY</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                Because your files remain entirely on your own device and are never sent across the internet to our
                servers, risks associated with server data breaches or interception during file transfer are inherently eliminated.
              </p>
            </Reveal>

            <Reveal className="border border-rule bg-card p-8 md:p-10">
              <h2 className="tech text-muted-foreground">8. CHANGES TO THIS PRIVACY POLICY</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                We may update this Privacy Policy from time to time to reflect changes in functionality, hosting
                infrastructure, or legal requirements. Updates will be posted on this page with a revised "Last updated" date.
              </p>
            </Reveal>

            <Reveal className="border border-rule bg-card p-8 md:p-10">
              <h2 className="tech text-muted-foreground">9. CONTACT US</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                If you have questions about this Privacy Policy, please contact us via our{" "}
                <Link to="/contact" className="text-primary underline">
                  Contact Page
                </Link>{" "}
                or by email at{" "}
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
