import { createFileRoute } from "@tanstack/react-router";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { PipelineRail } from "@/components/PipelineRail";
import { TransformStory } from "@/components/TransformStory";
import { ToolsGrid } from "@/components/ToolsGrid";
import { CheckTeaser } from "@/components/CheckTeaser";
import { RequirementWall } from "@/components/RequirementWall";
import { PrivacySection } from "@/components/PrivacySection";
import { Faq, FAQS } from "@/components/Faq";
import { AdSlot } from "@/components/AdSlot";

const TITLE = "FormFix — Fix Photos, Signatures & Documents for Forms";
const DESCRIPTION =
  "Resize, crop, compress and validate photos, signatures and documents for Indian exam and government application forms — directly in your browser. Free, instant, private.";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "FormFix",
      url: "https://www.formfix.me/",
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any",
      description: DESCRIPTION,
      offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.formfix.me/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://www.formfix.me/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(structuredData),
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <PipelineRail />
        <TransformStory />
        <ToolsGrid />
        <AdSlot slotId="home-mid" format="horizontal" className="py-10" />
        <CheckTeaser />
        <RequirementWall />
        <PrivacySection />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
