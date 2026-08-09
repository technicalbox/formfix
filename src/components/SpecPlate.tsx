/**
 * SpecPlate — a real file rendered as the FormFix artifact.
 * Same plate grammar as FilePlate (rules, ticks, printed metadata caption),
 * but carrying an actual browser-local image.
 */
export function SpecPlate({
  url,
  label = "FILE",
  dimensions,
  format,
  size,
  status = null,
  tone = "pending",
  guides = true,
  crop = false,
  ratio,
  className = "",
}: {
  url: string;
  label?: string;
  dimensions: string;
  format: string;
  size: string;
  status?: string | null;
  tone?: "verify" | "pending" | "fail";
  guides?: boolean;
  crop?: boolean;
  ratio?: number;
  className?: string;
}) {
  const statusColor =
    tone === "verify" ? "text-verify" : tone === "fail" ? "text-destructive" : "text-signal";
  const statusMark = tone === "verify" ? "✓" : tone === "fail" ? "✕" : "·";

  return (
    <div className={`relative ${className}`}>
      {guides && (
        <>
          <div
            className="ticks-x pointer-events-none absolute -top-4 inset-x-0 h-2 opacity-40"
            aria-hidden="true"
          />
          <div
            className="ticks-y pointer-events-none absolute -left-4 bottom-0 top-0 w-2 opacity-40"
            aria-hidden="true"
          />
          <div className="tech-sm pointer-events-none absolute -top-9 left-0 text-muted-foreground">
            {dimensions}
          </div>
        </>
      )}

      <figure className="shadow-plate relative border border-rule bg-card">
        <div
          className="relative overflow-hidden bg-secondary"
          style={ratio ? { aspectRatio: `${ratio}` } : { aspectRatio: "1 / 1" }}
        >
          <div
            className="absolute inset-0 grid-paper opacity-40"
            style={{ backgroundSize: "18px 18px" }}
            aria-hidden="true"
          />
          <img
            src={url}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-contain"
          />
          {crop && (
            <div className="pointer-events-none absolute inset-[6%] border border-primary/55">
              {[
                "-top-[3px] -left-[3px]",
                "-top-[3px] -right-[3px]",
                "-bottom-[3px] -left-[3px]",
                "-bottom-[3px] -right-[3px]",
              ].map((pos) => (
                <span key={pos} className={`absolute h-1.5 w-1.5 bg-primary ${pos}`} />
              ))}
            </div>
          )}
        </div>

        <figcaption className="grid grid-cols-2 gap-y-2 border-t border-rule px-3 py-3">
          <span className="tech-sm text-muted-foreground">{label}</span>
          <span className="tech-sm text-right">{dimensions}</span>
          <span className="tech-sm text-muted-foreground">{format}</span>
          <span className="tech-sm text-right">{size}</span>
          {status && (
            <span className={`tech-sm col-span-2 mt-1 flex items-center gap-1.5 ${statusColor}`}>
              <span aria-hidden="true">{statusMark}</span>
              {status}
            </span>
          )}
        </figcaption>
      </figure>
    </div>
  );
}
