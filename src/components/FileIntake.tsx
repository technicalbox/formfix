import { useCallback, useRef, useState } from "react";

/**
 * FileIntake — the FormFix intake surface.
 * Engineering-paper drop zone with measurement ticks. Reads the file locally;
 * no network request is made at any point.
 */
export function FileIntake({
  onFile,
  reading = false,
  error = null,
  warnings = [],
  label = "DROP FILE",
  hint = "JPG · PNG · WEBP · up to 25 MB",
  compact = false,
  className = "",
}: {
  onFile: (file: File) => void;
  reading?: boolean;
  error?: string | null;
  warnings?: string[];
  label?: string;
  hint?: string;
  compact?: boolean;
  className?: string;
}) {
  const input = useRef<HTMLInputElement | null>(null);
  const [over, setOver] = useState(false);

  const pick = useCallback(
    (files: FileList | null) => {
      const file = files?.[0];
      if (file) onFile(file);
    },
    [onFile],
  );

  return (
    <div className={className}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          pick(e.dataTransfer.files);
        }}
        className={`relative border transition-colors duration-300 ${
          over ? "border-primary bg-accent/40" : "border-rule bg-card"
        }`}
        style={{ transitionTimingFunction: "var(--ease-ff)" }}
      >
        <div
          className="grid-paper pointer-events-none absolute inset-0 opacity-50"
          style={{ backgroundSize: "22px 22px" }}
          aria-hidden="true"
        />
        <div
          className="ticks-x pointer-events-none absolute inset-x-0 top-0 h-2 opacity-30"
          aria-hidden="true"
        />

        <button
          type="button"
          onClick={() => input.current?.click()}
          className={`relative flex w-full flex-col items-center justify-center gap-3 text-center ${
            compact ? "px-5 py-10" : "px-6 py-16 md:py-20"
          }`}
        >
          <span
            className={`grid h-11 w-11 place-items-center border transition-colors duration-300 ${
              over ? "border-primary text-primary" : "border-rule text-muted-foreground"
            }`}
            aria-hidden="true"
          >
            <span className="text-lg leading-none">↑</span>
          </span>
          <span className="tech mt-1">{reading ? "READING FILE…" : label}</span>
          <span className="tech-sm text-muted-foreground">{hint}</span>
          <span className="mt-2 max-w-[34ch] text-[12.5px] leading-relaxed text-muted-foreground">
            Processing happens on this device. Your file is never uploaded, stored or shared.
          </span>
        </button>

        <input
          ref={input}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={(e) => pick(e.target.files)}
        />
      </div>

      {error && (
        <p
          role="alert"
          className="mt-3 border-l-2 border-destructive pl-3 text-[13px] leading-relaxed text-destructive"
        >
          {error}
        </p>
      )}
      {warnings.map((w) => (
        <p
          key={w}
          className="mt-3 border-l-2 border-signal pl-3 text-[13px] leading-relaxed text-muted-foreground"
        >
          {w}
        </p>
      ))}
    </div>
  );
}
