import { useEffect, useState } from "react";

const NAV = [
  { href: "/tools/resize", label: "Resize" },
  { href: "/tools/crop", label: "Crop" },
  { href: "/tools/compress", label: "Compress" },
  { href: "/tools/convert", label: "Convert" },
  { href: "/check-image", label: "Check my image" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-colors duration-300 ${
        scrolled
          ? "border-rule bg-background/85 backdrop-blur-xl"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-6 px-5 md:px-8">
        <a href="/" className="group flex items-baseline gap-2" aria-label="FormFix home">
          <span className="text-[17px] font-semibold tracking-[-0.04em]">FormFix</span>
          <span className="tech-sm hidden text-muted-foreground sm:inline">FILE INFRA</span>
        </a>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Tools">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="link-underline text-[13px] text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="/tools/resize"
            className="tech hidden items-center gap-2 bg-foreground px-4 py-3 text-background transition-transform duration-300 hover:-translate-y-[1px] sm:inline-flex"
          >
            UPLOAD FILE
          </a>
          <button
            type="button"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center border border-rule md:hidden"
          >
            <span className="relative block h-[9px] w-4">
              <span
                className={`absolute inset-x-0 top-0 h-px bg-foreground transition-transform duration-300 ${open ? "translate-y-[4px] rotate-45" : ""}`}
              />
              <span
                className={`absolute inset-x-0 bottom-0 h-px bg-foreground transition-transform duration-300 ${open ? "-translate-y-[4px] -rotate-45" : ""}`}
              />
            </span>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-rule bg-background md:hidden">
          <nav className="mx-auto grid max-w-[1400px] px-5 py-2" aria-label="Tools">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="flex items-center justify-between border-b border-rule/60 py-3.5 text-sm last:border-0"
              >
                {item.label}
                <span className="tech-sm text-muted-foreground">→</span>
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
