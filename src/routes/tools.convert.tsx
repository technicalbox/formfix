import { createFileRoute } from "@tanstack/react-router";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PrivacySection } from "@/components/PrivacySection";
import { ToolWorkspace } from "@/components/ToolWorkspace";

const TITLE = "Convert JPG, PNG & WEBP Images — Free Converter | FormFix";
const DESCRIPTION =
  "Convert images between JPG, PNG and WEBP with full control over encode quality, so your upload matches the format the form demands. Private and in-browser.";

export const Route = createFileRoute("/tools/convert")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.formfix.me/tools/convert" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://www.formfix.me/tools/convert" }],
  }),
  component: ConvertPage,
});

function ConvertPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <ToolWorkspace op="convert" />
        <PrivacySection />
      </main>
      <Footer />
    </div>
  );
}
