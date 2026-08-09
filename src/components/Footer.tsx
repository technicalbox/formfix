const COLS = [
  {
    title: "TOOLS",
    links: [
      { href: "/tools/resize", label: "Resize image" },
      { href: "/tools/crop", label: "Crop image" },
      { href: "/tools/compress", label: "Compress image" },
      { href: "/tools/convert", label: "Convert format" },
      { href: "/check-image", label: "Check my image" },
    ],
  },
  {
    title: "EXAMS",
    links: [
      { href: "/ibps-photo-resizer", label: "IBPS photo" },
      { href: "/ssc-signature-resizer", label: "SSC signature" },
      { href: "/upsc-photo-resizer", label: "UPSC photo" },
      { href: "/neet-photo-resizer", label: "NEET photo" },
      { href: "/jee-photo-resizer", label: "JEE Main photo" },
      { href: "/rrb-photo-resizer", label: "RRB photo" },
    ],
  },
  {
    title: "SIZES",
    links: [
      { href: "/compress-image-to-20kb", label: "≤ 20 KB" },
      { href: "/compress-image-to-50kb", label: "≤ 50 KB" },
      { href: "/compress-image-to-100kb", label: "≤ 100 KB" },
      { href: "/compress-image-to-200kb", label: "≤ 200 KB" },
    ],
  },
  {
    title: "COMPANY",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-rule bg-secondary/40">
      <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-8 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2.4fr]">
          <div>
            <div className="text-[17px] font-semibold tracking-[-0.04em]">FormFix</div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Free browser-based tools that resize, crop, compress and convert application
              documents to exact exam requirements. Your files never leave your device.
            </p>
            <a
              href="mailto:contact@formfix.me"
              className="link-underline tech mt-6 inline-block text-muted-foreground hover:text-foreground"
            >
              CONTACT@FORMFIX.ME
            </a>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {COLS.map((col) => (
              <div key={col.title}>
                <div className="tech-sm text-muted-foreground">{col.title}</div>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <a
                        href={l.href}
                        className="link-underline text-[13px] text-foreground/75 hover:text-foreground"
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-rule pt-6 text-[12px] text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} FormFix. All rights reserved.</p>
          <p className="max-w-2xl">
            FormFix is an independent tool and is not affiliated with, endorsed by, or connected to
            IBPS, SSC, UPSC, NTA, Indian Railways or any government body. Always verify
            requirements with the official notification.
          </p>
        </div>
      </div>
    </footer>
  );
}
