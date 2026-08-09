import { createFileRoute } from "@tanstack/react-router";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PrivacySection } from "@/components/PrivacySection";
import { ToolWorkspace } from "@/components/ToolWorkspace";

const TITLE = "Crop Image to Exact Aspect Ratio — Free Tool | FormFix";
const DESCRIPTION =
  "Crop photos and signatures to the exact aspect ratio your application form requires, with a locked crop frame. Runs in your browser — nothing is uploaded.";

export const Route = createFileRoute("/tools/crop")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.formfix.me/tools/crop" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://www.formfix.me/tools/crop" }],
  }),
  component: CropPage,
});

function CropPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <ToolWorkspace op="crop" />
        <PrivacySection />
      </main>
      <Footer />
    </div>
  );
}
