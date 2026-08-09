/**
 * FilePlate — the recurring FormFix artifact.
 * A document plate carrying its own technical metadata, surrounded by
 * dimension guides and measurement ticks. Pure CSS/SVG, so it renders
 * identically without JS or WebGL.
 */
export function FilePlate({
  label = "PHOTO",
  dimensions = "200 × 230 PX",
  format = "JPG",
  size = "48.7 KB",
  status = "VERIFIED",
  tone = "verify",
  guides = true,
  className = "",
}: {
  label?: string;
  dimensions?: string;
  format?: string;
  size?: string;
  status?: string | null;
  tone?: "verify" | "pending" | "fail";
  guides?: boolean;
  className?: string;
}) {
  const statusColor =
    tone === "verify"
      ? "text-verify"
      : tone === "fail"
        ? "text-destructive"
        : "text-signal";

  return (
    <div className={`relative ${className}`}>
      {guides && (
        <>
          <div className="ticks-x pointer-events-none absolute -top-4 left-0 right-0 h-2 opacity-40" />
          <div className="ticks-y pointer-events-none absolute -left-4 bottom-0 top-0 w-2 opacity-40" />
          <div className="tech-sm pointer-events-none absolute -top-9 left-0 text-muted-foreground">
            {dimensions.split("×")[0]?.trim()}
          </div>
        </>
      )}

      <figure className="shadow-plate relative border border-rule bg-card">
        {/* portrait area */}
        <div className="relative aspect-[200/230] overflow-hidden bg-secondary">
          <div className="absolute inset-0 grid-paper opacity-60" style={{ backgroundSize: "18px 18px" }} />
          {/* abstract subject silhouette */}
          <svg viewBox="0 0 200 230" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <defs>
              <linearGradient id="fp-sub" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.22" />
                <stop offset="100%" stopColor="var(--color-cyan)" stopOpacity="0.32" />
              </linearGradient>
            </defs>
            <circle cx="100" cy="88" r="40" fill="url(#fp-sub)" />
            <path d="M28 230c0-42 32-70 72-70s72 28 72 70Z" fill="url(#fp-sub)" />
          </svg>
          {/* crop frame */}
          <div className="absolute inset-[10%] border border-primary/45">
            {["-top-[3px] -left-[3px]", "-top-[3px] -right-[3px]", "-bottom-[3px] -left-[3px]", "-bottom-[3px] -right-[3px]"].map(
              (pos) => (
                <span key={pos} className={`absolute h-1.5 w-1.5 bg-primary ${pos}`} />
              ),
            )}
          </div>
        </div>

        <figcaption className="grid grid-cols-2 gap-y-2 border-t border-rule px-3 py-3">
          <span className="tech-sm text-muted-foreground">{label}</span>
          <span className="tech-sm text-right text-foreground">{dimensions}</span>
          <span className="tech-sm text-muted-foreground">{format}</span>
          <span className="tech-sm text-right text-foreground">{size}</span>
          {status && (
            <span className={`tech-sm col-span-2 mt-1 flex items-center gap-1.5 ${statusColor}`}>
              <span aria-hidden="true">✓</span>
              {status}
            </span>
          )}
        </figcaption>
      </figure>
    </div>
  );
}
