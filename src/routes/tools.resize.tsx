import { createFileRoute } from "@tanstack/react-router";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PrivacySection } from "@/components/PrivacySection";
import { ToolWorkspace } from "@/components/ToolWorkspace";

const TITLE = "Resize Image to Exact Pixels — Free & In-Browser | FormFix";
const DESCRIPTION =
  "Resize any photo or signature to exact pixel dimensions for exam and government forms, with high-quality resampling. Free, instant and completely private.";

export const Route = createFileRoute("/tools/resize")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.formfix.me/tools/resize" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://www.formfix.me/tools/resize" }],
  }),
  component: ResizePage,
});

function ResizePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <ToolWorkspace op="resize" />
        <PrivacySection />
      </main>
      <Footer />
    </div>
  );
}
