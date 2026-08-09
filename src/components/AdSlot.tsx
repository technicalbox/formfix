/**
 * AdSlot — AdSense-ready placement (layout only).
 *
 * Ported from the production Astro AdSlot component. No external ad script is
 * loaded here. When AdSense is approved, replace the inner placeholder with the
 * <ins class="adsbygoogle"> tag — no layout changes needed.
 *
 * Placement rules preserved: labelled, non-sticky, non-overlay, never adjacent
 * to upload/download controls or navigation.
 */
export function AdSlot({
  slotId,
  format = "responsive",
  className = "",
}: {
  slotId: string;
  format?: "horizontal" | "rectangle" | "responsive";
  className?: string;
}) {
  const minHeight = format === "horizontal" ? 90 : format === "rectangle" ? 250 : 120;

  return (
    <aside
      data-ad-slot={slotId}
      data-ad-format={format}
      aria-label="Advertisement"
      role="complementary"
      className={`mx-auto w-full max-w-5xl px-5 ${className}`}
    >
      <div className="tech-sm mb-2 text-muted-foreground">Advertisement</div>
      <div
        className="grid place-items-center border border-dashed border-rule bg-muted/40"
        style={{ minHeight }}
      >
        {/*
          ADSENSE PLACEHOLDER
          Replace with the real <ins class="adsbygoogle" …> tag after approval.
        */}
        <span className="tech-sm text-muted-foreground/70">Ad space</span>
      </div>
    </aside>
  );
}
