import { useCallback, useEffect, useRef, useState } from "react";

export type CropRect = { x: number; y: number; width: number; height: number };

/**
 * CropStage — measurement-first cropping.
 * The selection is a real crop frame with corner handles over the file; the
 * numbers below are the pixel rect that will be cut. Drag to reposition,
 * scale with the guide slider. Pointer-driven, no external cropper UI.
 */
export function CropStage({
  url,
  naturalWidth,
  naturalHeight,
  ratio,
  onChange,
}: {
  url: string;
  naturalWidth: number;
  naturalHeight: number;
  ratio: number | null;
  onChange: (rect: CropRect) => void;
}) {
  const box = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(0.9);
  const [center, setCenter] = useState({ x: 0.5, y: 0.5 });
  const drag = useRef<{ x: number; y: number; cx: number; cy: number } | null>(null);

  const r = ratio ?? naturalWidth / naturalHeight;

  // Selection size in source pixels: largest box of ratio r that fits, scaled.
  const fitW = Math.min(naturalWidth, naturalHeight * r);
  const fitH = fitW / r;
  const selW = Math.round(fitW * scale);
  const selH = Math.round(fitH * scale);

  const clamp = useCallback(
    (c: { x: number; y: number }) => {
      const halfW = selW / 2 / naturalWidth;
      const halfH = selH / 2 / naturalHeight;
      return {
        x: Math.min(1 - halfW, Math.max(halfW, c.x)),
        y: Math.min(1 - halfH, Math.max(halfH, c.y)),
      };
    },
    [selW, selH, naturalWidth, naturalHeight],
  );

  useEffect(() => {
    const c = clamp(center);
    const rect: CropRect = {
      x: Math.round(c.x * naturalWidth - selW / 2),
      y: Math.round(c.y * naturalHeight - selH / 2),
      width: selW,
      height: selH,
    };
    onChange(rect);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selW, selH, center.x, center.y, naturalWidth, naturalHeight]);

  const c = clamp(center);
  const leftPct = ((c.x * naturalWidth - selW / 2) / naturalWidth) * 100;
  const topPct = ((c.y * naturalHeight - selH / 2) / naturalHeight) * 100;
  const wPct = (selW / naturalWidth) * 100;
  const hPct = (selH / naturalHeight) * 100;

  return (
    <div>
      <div
        ref={box}
        className="relative select-none overflow-hidden border border-rule bg-secondary"
        style={{ aspectRatio: `${naturalWidth} / ${naturalHeight}`, touchAction: "none" }}
        onPointerDown={(e) => {
          (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
          drag.current = { x: e.clientX, y: e.clientY, cx: c.x, cy: c.y };
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          const el = box.current;
          if (!d || !el) return;
          const b = el.getBoundingClientRect();
          setCenter(
            clamp({
              x: d.cx + (e.clientX - d.x) / b.width,
              y: d.cy + (e.clientY - d.y) / b.height,
            }),
          );
        }}
        onPointerUp={() => {
          drag.current = null;
        }}
      >
        <img src={url} alt="" className="absolute inset-0 h-full w-full object-contain" />
        <div className="pointer-events-none absolute inset-0 bg-background/55" aria-hidden="true" />
        <div
          className="pointer-events-none absolute border border-primary"
          style={{
            left: `${leftPct}%`,
            top: `${topPct}%`,
            width: `${wPct}%`,
            height: `${hPct}%`,
          }}
        >
          {["-top-[3px] -left-[3px]", "-top-[3px] -right-[3px]", "-bottom-[3px] -left-[3px]", "-bottom-[3px] -right-[3px]"].map(
            (pos) => (
              <span key={pos} className={`absolute h-2 w-2 bg-primary ${pos}`} />
            ),
          )}
          <span className="tech-sm absolute -top-6 left-0 text-primary">
            {selW} × {selH}
          </span>
        </div>
        <div className="ticks-x pointer-events-none absolute inset-x-0 top-0 h-2 opacity-40" aria-hidden="true" />
        <div className="ticks-y pointer-events-none absolute bottom-0 left-0 top-0 w-2 opacity-40" aria-hidden="true" />
      </div>

      <div className="mt-5">
        <div className="flex items-baseline justify-between">
          <label className="tech-sm text-muted-foreground" htmlFor="crop-scale">
            SELECTION SCALE
          </label>
          <span className="font-mono text-[12.5px]">{Math.round(scale * 100)}%</span>
        </div>
        <input
          id="crop-scale"
          type="range"
          min={20}
          max={100}
          value={Math.round(scale * 100)}
          onChange={(e) => setScale(Number(e.target.value) / 100)}
          className="mt-3 h-1 w-full appearance-none bg-rule accent-primary"
        />
        <p className="mt-4 text-[12.5px] leading-relaxed text-muted-foreground">
          Drag inside the frame to reposition. The frame keeps the required aspect ratio, so the
          crop can never come out the wrong shape.
        </p>
      </div>
    </div>
  );
}
