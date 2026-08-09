# FormFix — Cinematic Redesign (Homepage First)

## Context

The uploaded `formfix-main.zip` is an Astro 7 static site (`astro.config.mjs`, `src/pages/*.astro`, `src/lib/image-engine.js`, `src/lib/validator.js`, `src/data/presets.json`, `AdSlot.astro`, sitemap integration). This Lovable workspace runs React on TanStack Start and cannot run Astro. You chose to port it here, so the redesign is built in React while the product truth — routes, presets, copy, validation rules, SEO metadata, ad placement architecture — is carried over verbatim from the ZIP.

This first pass delivers the homepage as a complete, production-quality experience. Tool pages, Check My Image, preset routes and trust pages come in follow-up passes; their URLs are reserved now so nothing links into a dead end.

## Design direction

Light-first, editorial, technical. Warm near-white surfaces, near-black type, electric blue as the single load-bearing accent with cyan/violet only in atmospheric gradients. Display grotesk at genuinely large sizes; all technical metadata (dimensions, KB, formats, checkmarks) set in monospace. No card-wall sections, no centered SaaS hero, no purple gradient wash.

The recurring artifact is **THE FILE CARD** — a document plate carrying `PHOTO / 200 × 230 PX / JPG / 48.7 KB / ✓ VERIFIED`, surrounded by dimension guides, crop frames and measurement ticks. It appears as a real 3D object in the hero, as a scroll-driven subject in the transformation story, and as flat technical plates in the requirement wall.

## Homepage composition

1. **Header** — minimal wordmark, tool links, upload CTA.
2. **Hero** — small mono eyebrow (`APPLICATION FILE INFRASTRUCTURE`), oversized asymmetric headline "Every application deserves a perfect file.", supporting line, `Upload your file` / `Explore tools`. WebGL file card composed into the type, not floating beside it. Staggered entrance, subtle float, desktop pointer parallax only.
3. **INPUT → TRANSFORM → VERIFY → READY** — a horizontal technical progression, drawn as a measurement rail rather than four cards.
4. **Transformation story** — scroll-scrubbed sequence: crop frame lands, dimensions retick, size counts down 3.2 MB → 1.8 MB → 920 KB → 120 KB → 48.7 KB.
5. **Tools** — Resize / Crop / Compress / Convert shown as four live transformations of the same file card, each linking to its existing route.
6. **Check My Image teaser** — validation checklist resolving from ✕ file size to `READY TO SUBMIT`, linking to `/check-image`.
7. **Requirement wall** — IBPS, SSC, UPSC, NEET, JEE Main, RRB rendered as engineering-drawing plates with real preset data from `presets.json`, plus the ≤20/50/100/200 KB compression targets.
8. **Privacy** — device → processing → result diagram, existing claim text unchanged.
9. **Ad slot** — preserved architecture: labeled, static, outside interactive zones.
10. **FAQ** (existing questions verbatim) → **footer** with About / Contact / Privacy / Terms, `contact@formfix.me`, independent-tool disclaimer.

## Motion and 3D

- React Three Fiber for the hero file card (and later Check My Image): lazy-loaded, mounted on intersection, capped DPR, no constant spin.
- CSS 3D + Motion for every secondary section; scroll choreography via scroll-linked transforms.
- Designed CSS/SVG fallback card for no-WebGL and small mobile — never an empty canvas, never "3D failed".
- Central motion tokens: easing `cubic-bezier(0.16, 1, 0.3, 1)`; micro 150–250ms, interaction 250–450ms, section 450–800ms, cinematic 800–1400ms.
- Sections animate from a visible baseline, so nothing can be permanently stuck at `opacity: 0`.
- `prefers-reduced-motion` collapses movement to opacity/dissolve, keeping the composition intact.

## Mobile

Deliberate composition, not a squeezed desktop. First viewport at 320–430px contains wordmark, headline, supporting line, CTA and a visible file card. No blind `100vh`, no blank gap, no overflow. Pointer effects disabled on touch.

## Preserved from the existing product

- Routes: `/`, `/check-image`, `/tools/{resize,crop,compress,convert}`, `/[slug]` preset pages, `/about`, `/contact`, `/privacy`, `/terms`.
- `presets.json` copied unchanged; no invented requirements.
- `image-engine.js` and `validator.js` ported as-is (they are framework-agnostic browser JS) — no rewrite of processing logic.
- SEO: per-route title/description/canonical/OG, JSON-LD WebApplication block, `robots.txt`, `ads.txt`, sitemap, `https://www.formfix.me` domain.
- AdSlot component behaviour and placement rules.

## Technical notes

- Stack: TanStack Start + Tailwind v4 tokens in `src/styles.css`; add `three`, `@react-three/fiber`, `@react-three/drei`, `motion`. Existing deps `pica` and `cropperjs` carried over for the tool pages.
- No duplicate animation libraries; no framework migration beyond the required Astro → React port.
- Verification pass: rendered screenshots at 320/390/430/768/1280/1440, overflow and console checks, then one fix batch.

## Not in this pass

Tool pages, Check My Image, preset and compression routes, and trust pages keep their current content and get the new design system in follow-up passes. Nothing is committed or published until you review the preview.
