# Architecture Decision Records — FormFix

## ADR-001: Framework Choice — Astro

**Date**: 2026-08-09

**Problem**: Need a framework that supports static site generation for SEO, minimal JavaScript for performance, and component-based architecture for maintainability.

**Options considered**:
1. **Astro** — zero JS default, islands architecture, SSG, built-in sitemap
2. **Next.js** — React-based, SSR/SSG, large ecosystem, ships React runtime
3. **Vite (vanilla)** — fast build, no SSR/SSG without manual setup
4. **Plain HTML** — no build step, no component reuse, no programmatic pages

**Chosen**: Astro

**Why**: FormFix is a content-heavy utility site where SEO is critical. Astro ships zero JavaScript by default and only hydrates interactive components (islands). This means exam info pages are pure HTML — perfect for SEO and performance. The islands architecture lets us add Cropper.js and Pica only on pages that need them. Built-in sitemap generation and static output align with Cloudflare Pages deployment.

**Tradeoffs**: Smaller ecosystem than Next.js. Less community support for edge cases. No SSR (not needed for MVP).

---

## ADR-002: Image Processing Stack — Canvas API + Pica + Cropper.js

**Date**: 2026-08-09

**Problem**: Need browser-based image resize, crop, and compression without server uploads.

**Options considered**:
1. **Canvas API only** — native, no dependencies, lower quality resize
2. **Canvas + Pica** — high-quality resize via Web Workers
3. **browser-image-compression** — convenience library, abstracts Canvas
4. **Sharp (server-side)** — best quality, requires backend

**Chosen**: Canvas API + Pica + Cropper.js

**Why**: Canvas API provides native compression via `toBlob()`. Pica adds high-quality Lanczos downscaling with automatic Web Worker offloading (prevents UI freeze). Cropper.js is the mature standard for interactive crop UI with mobile touch support. Total bundle: ~75 KB for both libraries, lazy-loaded.

**Tradeoffs**: Pica adds a dependency. Canvas compression quality varies by browser. Binary search on toBlob is needed for exact-size targeting.

---

## ADR-003: Compression Algorithm — Binary Search on canvas.toBlob()

**Date**: 2026-08-09

**Problem**: Need to compress images to ≤ X KB target. JPEG quality parameter has a non-linear relationship with output size.

**Options considered**:
1. **Single pass** — guess quality, hope for the best
2. **Linear search** — try quality 0.9, 0.8, 0.7... too slow
3. **Binary search** — converge in 8 iterations
4. **Pre-computed lookup table** — image-dependent, won't generalize

**Chosen**: Binary search

**Why**: 8 iterations of binary search on quality (0.05–0.95) reliably converges within 1–2% of the target KB. Each iteration calls `canvas.toBlob()` which is fast and async. If the target is unreachable at minimum quality, we suggest dimension reduction before retrying.

**Tradeoffs**: 8 encoding passes per compression. On large images this could take 2–3 seconds on mobile. Acceptable for the use case.

---

## ADR-004: Deployment — Cloudflare Pages

**Date**: 2026-08-09

**Problem**: Need free, fast, globally distributed hosting for a static site.

**Options considered**:
1. **Cloudflare Pages** — free, 300+ edge locations, no bandwidth limits, auto HTTPS
2. **Vercel** — free tier, good Astro support, bandwidth limits on free
3. **Netlify** — free tier, good static hosting, bandwidth limits on free
4. **GitHub Pages** — free, limited features, no custom headers

**Chosen**: Cloudflare Pages

**Why**: Free tier with unlimited bandwidth. Global CDN with 300+ edge locations ensures fast delivery to Indian users. Custom domain support. Configurable headers (for CSP). Git-based deploys. No cold starts (static files). User's explicit preference.

**Tradeoffs**: Slightly more complex initial setup than Vercel. Limited to static output (no serverless functions in MVP, which is fine).

---

## ADR-005: Typography — System UI Stack

**Date**: 2026-08-09

**Problem**: Need a font that loads instantly, renders well on all devices, and serves the Operate mode's task-completion focus.

**Options considered**:
1. **System UI stack** — zero download, native rendering, instant
2. **Inter** — popular, well-designed, but on Impeccable's banned list
3. **Geist** — modern, but requires self-hosting
4. **General Sans** — distinctive, but adds 100KB+ download

**Chosen**: System UI stack

**Why**: Impeccable Operate mode explicitly permits system fonts. The primary audience (Indian students on Android) gets Roboto natively. Zero font download means instant text rendering, no FOIT/FOUT, and reduced page weight. The tool disappears into the task — familiar typography is a virtue.

**Tradeoffs**: Less distinctive visual identity. Varies across platforms (Roboto on Android, SF Pro on iOS, Segoe UI on Windows).

---

## ADR-006: State Management — Vanilla JS + CustomEvent

**Date**: 2026-08-09

**Problem**: Need component communication without a framework state manager.

**Options considered**:
1. **React/Vue state** — requires framework runtime
2. **Vanilla JS + CustomEvent** — zero overhead, browser-native
3. **Zustand/Jotai** — lightweight, but adds dependency

**Chosen**: Vanilla JS + CustomEvent

**Why**: FormFix has a simple data flow: file in → process → result out. No complex state graphs. CustomEvent on the document allows any component to publish/subscribe without coupling. Module-scoped variables hold processing state. No framework runtime shipped.

**Tradeoffs**: No devtools for state inspection. Manual event cleanup needed. Scales poorly if application becomes very complex (unlikely for this product).

---

## ADR-007: Color Strategy — Restrained

**Date**: 2026-08-09

**Problem**: Need a color approach for a utility tool handling government documents.

**Options considered**:
1. **Restrained** — neutrals + one accent
2. **Committed** — one saturated color at 30–60% surface coverage
3. **Full palette** — 3–4 named color roles

**Chosen**: Restrained

**Why**: Per Impeccable Operate mode, Restrained is the default for task-completion surfaces. Users are processing sensitive government documents under time pressure. The interface should feel trustworthy and fade into the background. One primary blue accent for actions and selection states. Semantic colors (green/red/amber) for validation feedback.

**Tradeoffs**: Less visually distinctive. Homepage hero could benefit from more color (handled by Persuade mode on that section only).
