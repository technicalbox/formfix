import { createFileRoute } from "@tanstack/react-router";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PrivacySection } from "@/components/PrivacySection";
import { ToolWorkspace } from "@/components/ToolWorkspace";

const TITLE = "Compress Image to a KB Target — Free & Private | FormFix";
const DESCRIPTION =
  "Compress any photo or signature to an exact kilobyte limit — 20 KB, 50 KB, 100 KB or your own target — without visible quality loss. In-browser, no uploads.";

export const Route = createFileRoute("/tools/compress")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.formfix.me/tools/compress" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://www.formfix.me/tools/compress" }],
  }),
  component: CompressPage,
});

function CompressPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <ToolWorkspace op="compress" />
        <PrivacySection />
      </main>
      <Footer />
    </div>
  );
}
