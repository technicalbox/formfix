# Performance — FormFix

## Bundle Size Goals

| Asset | Target | Rationale |
|-------|--------|-----------|
| Initial HTML + CSS | < 50 KB | First paint on slow 3G |
| Core JS (upload zone) | < 10 KB | Minimal JS for first interaction |
| Pica (lazy loaded) | ~45 KB | Loaded only when processing starts |
| Cropper.js (lazy loaded) | ~30 KB | Loaded only when crop tool used |
| Total interactive JS | < 100 KB | Full tool loaded |
| Fonts | 0 KB | System UI stack |

## Initial Load Strategy

1. Static HTML rendered at build time — zero server processing
2. CSS inlined critical path, rest loaded async
3. No JavaScript blocks first paint
4. Interactive components hydrate via Astro islands (`client:visible` or `client:load`)
5. Processing libraries (Pica, Cropper.js) lazy-loaded on first file upload

## Core Web Vitals Targets

| Metric | Target | Strategy |
|--------|--------|----------|
| LCP | < 1.5s | Static HTML, no blocking JS, system fonts |
| FID/INP | < 100ms | Web Workers for heavy processing |
| CLS | < 0.05 | Fixed-size containers, no layout shift |
| FCP | < 1.0s | Minimal critical CSS, static HTML |
| TTFB | < 200ms | Cloudflare CDN edge serving |

## Lazy Loading

- **Pica**: imported dynamically when user uploads first file
- **Cropper.js**: imported dynamically when crop tool is activated
- **Below-fold sections**: loaded with `loading="lazy"` on images
- **FAQ accordion**: CSS-only (`<details>`), no JS needed

## Web Workers

Pica uses Web Workers automatically for resize operations. This prevents main thread blocking during heavy image processing.

For the binary search compression loop:
- Each `canvas.toBlob()` call is async and non-blocking
- Progress updates are sent to UI between iterations
- User can cancel mid-compression

## Image Processing Memory Management

- Revoke `ObjectURL`s after download or when new file is uploaded
- Clear canvas after processing
- Limit input file size to 25 MB
- Warn users on mobile for files > 10 MB
- Use `createImageBitmap()` for efficient decoding (doesn't create a DOM element)

## Caching Strategy

### Static Assets
```
Cache-Control: public, max-age=31536000, immutable
```
Astro hashes all built assets — safe to cache forever.

### HTML Pages
```
Cache-Control: public, max-age=3600, stale-while-revalidate=86400
```
Pages can be cached for 1 hour, served stale for 24 hours while revalidating.

## Static Generation

All pages are pre-rendered at build time:
- Zero server-side processing
- HTML files served directly from CDN edge
- No cold start latency
- No database queries

## Mobile Performance

- System fonts: zero font download
- Minimal CSS: no unused styles
- Touch events: passive listeners where possible
- Canvas size: capped on mobile to prevent memory issues
- Compression iterations: may reduce to 6 on low-memory devices
