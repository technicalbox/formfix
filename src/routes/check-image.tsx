import { createFileRoute } from "@tanstack/react-router";

import { AdSlot } from "@/components/AdSlot";
import { CheckWorkspace } from "@/components/CheckWorkspace";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PrivacySection } from "@/components/PrivacySection";

const TITLE = "Check My Image — Validate Exam Photos & Signatures | FormFix";
const DESCRIPTION =
  "Check any photo or signature against official exam requirements — format, dimensions, aspect ratio and file size — then fix it instantly. Runs entirely in your browser.";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "FormFix — Check My Image",
  url: "https://www.formfix.me/check-image",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  description: DESCRIPTION,
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
};

export const Route = createFileRoute("/check-image")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.formfix.me/check-image" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://www.formfix.me/check-image" }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(structuredData) }],
  }),
  component: CheckImagePage,
});

function CheckImagePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <CheckWorkspace />
        <AdSlot slotId="check-image-mid" format="horizontal" className="py-12" />
        <PrivacySection />
      </main>
      <Footer />
    </div>
  );
}
