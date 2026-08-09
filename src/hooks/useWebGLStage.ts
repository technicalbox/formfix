import { useEffect, useState } from "react";

/**
 * Gate for the WebGL stage: desktop-class viewport, WebGL available, motion
 * not reduced. Matches the homepage hero's gating exactly.
 */
export function useWebGLStage() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let timer = 0;
    if (typeof window !== "undefined") {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const wide = window.matchMedia("(min-width: 768px)").matches;
      let ok = false;
      try {
        const c = document.createElement("canvas");
        ok = !!(c.getContext("webgl2") || c.getContext("webgl"));
      } catch {
        ok = false;
      }
      if (ok && wide && !reduced) {
        timer = window.setTimeout(() => setReady(true), 120);
      }
    }
    return () => window.clearTimeout(timer);
  }, []);
  return ready;
}
