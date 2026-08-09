import { useEffect, useRef, useState } from "react";

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export function formatKb(kb: number) {
  if (kb >= 1024) return `${(kb / 1024).toFixed(1)} MB`;
  return `${kb >= 100 ? Math.round(kb) : kb.toFixed(1)} KB`;
}

/**
 * KbCounter — the homepage's live kilobyte interpolation, reusable.
 * Animates from the previous value to the next one instead of snapping.
 */
export function KbCounter({
  value,
  duration = 900,
  className = "",
}: {
  value: number;
  duration?: number;
  className?: string;
}) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);

  useEffect(() => {
    const start = performance.now();
    const a = from.current;
    const b = value;
    let raf = 0;
    const tick = (now: number) => {
      const t = clamp01((now - start) / duration);
      setShown(a + (b - a) * easeOut(t));
      if (t < 1) raf = requestAnimationFrame(tick);
      else from.current = b;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return (
    <span className={`font-mono tabular-nums ${className}`}>{formatKb(shown)}</span>
  );
}
