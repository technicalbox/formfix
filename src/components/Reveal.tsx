import { useEffect, useRef, type ComponentType, type ElementType, type ReactNode } from "react";

/**
 * Progressive-enhancement reveal.
 * Renders fully visible content; the hidden start state only applies once
 * `html.js` is set (see styles.css), so failed JS never blanks a section.
 */
export function Reveal({
  as: Tag = "div",
  children,
  className = "",
  delay = 0,
  blur = false,
  ...rest
}: {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  delay?: number;
  blur?: boolean;
  [key: string]: unknown;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const Component = Tag as unknown as ComponentType<Record<string, unknown>>;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.setAttribute("data-revealed", "true");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-revealed", "true");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    io.observe(el);
    // Safety net: never leave content hidden.
    const t = window.setTimeout(() => el.setAttribute("data-revealed", "true"), 2500);
    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, []);

  return (
    <Component
      ref={ref as never}
      className={`reveal ${blur ? "reveal-blur" : ""} ${className}`}
      style={{ ["--reveal-delay" as string]: `${delay}ms` }}
      {...rest}
    >
      {children}
    </Component>
  );
}
