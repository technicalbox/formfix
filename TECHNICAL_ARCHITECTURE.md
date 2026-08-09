# Technical Architecture — FormFix

## Framework

**Astro** (v5.x) with static output (SSG).

**Why**: Zero JavaScript shipped by default. Islands architecture hydrates only interactive components. Static HTML output is ideal for SEO-driven content pages. Built-in sitemap, optimized asset handling. Vite-powered build with excellent DX.

## Rendering Strategy

- **Static Site Generation (SSG)** — all pages pre-rendered at build time
- **No SSR** — no server-side runtime needed
- **Astro Islands** — interactive components (crop editor, compression panel, upload zone) hydrate on the client with `client:load` or `client:visible`
- **Content Collections** — exam presets stored as data, pages generated programmatically

## Application Structure

```
formfix/
├── public/
│   ├── robots.txt
│   ├── favicon.svg
│   └── fonts/                    # Self-hosted font files
├── src/
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── Hero.astro
│   │   ├── UploadZone.astro      # Drag/drop + click + camera
│   │   ├── ImageEditor.astro     # Crop workspace (Cropper.js island)
│   │   ├── CompressionPanel.astro
│   │   ├── ResizePanel.astro
│   │   ├── FormatPanel.astro
│   │   ├── ValidationResult.astro
│   │   ├── DownloadPanel.astro
│   │   ├── ExamPresetPicker.astro
│   │   ├── ToolCard.astro
│   │   ├── HowItWorks.astro
│   │   ├── PrivacyBadge.astro
│   │   ├── FAQ.astro
│   │   └── SEOHead.astro
│   ├── layouts/
│   │   ├── BaseLayout.astro      # HTML shell, meta, fonts, global CSS
│   │   └── ToolLayout.astro      # Layout for tool pages
│   ├── pages/
│   │   ├── index.astro           # Homepage
│   │   ├── tools/
│   │   │   ├── resize.astro
│   │   │   ├── crop.astro
│   │   │   ├── compress.astro
│   │   │   └── convert.astro
│   │   └── [slug].astro          # Dynamic exam/compression pages
│   ├── data/
│   │   ├── presets.json          # Verified exam requirements
│   │   └── seo-pages.json       # SEO page definitions
│   ├── lib/
│   │   ├── image-engine.js       # Core processing (resize, compress, convert)
│   │   ├── compression.js        # Binary search exact-size compression
│   │   ├── validator.js          # Requirement validation
│   │   ├── presets.js            # Preset loading and lookup
│   │   └── file-utils.js         # MIME validation, metadata extraction
│   └── styles/
│       └── global.css            # Design system tokens + global styles
├── astro.config.mjs
├── package.json
└── [documentation files]
```

## Processing Architecture

```
USER'S FILE
    │
    ▼
┌─────────────────────┐
│   File Validation    │  MIME check, size check, format check
│   (file-utils.js)    │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  createImageBitmap   │  Native browser API — decode image
│  (Browser API)       │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│    Canvas API        │  Draw image, read pixel data
│    + Pica            │  High-quality resize via Web Workers
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│   Cropper.js         │  Interactive crop (if needed)
│   (User interaction) │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  canvas.toBlob()     │  Encode to target format
│  Binary search loop  │  8 iterations to hit ≤ target KB
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  Validation          │  Check dimensions, size, format
│  (validator.js)      │  against preset requirements
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  URL.createObjectURL │  Create download link
│  → <a download>     │  User downloads file
└─────────────────────┘
```

**Everything above happens in the browser. No network requests for processing.**

## Browser APIs Used

| API | Purpose |
|-----|---------|
| `createImageBitmap()` | Decode uploaded images efficiently |
| `Canvas 2D` | Draw, resize, read image data |
| `OffscreenCanvas` | (where supported) Process in Web Worker |
| `canvas.toBlob()` | Encode canvas to JPEG/PNG/WebP blob |
| `URL.createObjectURL()` | Create downloadable link from blob |
| `File API` | Read uploaded files |
| `Drag and Drop API` | Drop zone for file upload |
| `Web Workers` | Offload Pica resize from main thread |

## Open-Source Libraries

| Library | Version | Purpose | Size | License |
|---------|---------|---------|------|---------|
| Astro | 5.x | Framework | (dev only) | MIT |
| Pica | 9.x | High-quality image resize | ~45 KB | MIT |
| Cropper.js | 2.x | Interactive crop UI | ~30 KB | MIT |

**No other runtime dependencies.** Compression uses native Canvas API. Validation is custom code.

## State Management

No framework state manager. Vanilla JS with:
- DOM events for component communication
- `CustomEvent` for cross-component messaging
- Module-scoped variables for processing state

## Data Flow

```
presets.json → Astro build → static pages with embedded requirements
User upload → JS processing pipeline → download blob
```

No API calls. No database. No server state.

## Error Handling

- File validation errors: clear message about what's wrong and how to fix it
- Processing errors: caught, displayed inline, never crash the page
- Impossible compression: explain why (e.g., "Image is already at minimum quality; consider reducing dimensions")
- Unsupported format: list supported formats
- Memory errors on large files: warn about file size, suggest reducing before upload

## Performance Strategy

- **Zero JS by default** (Astro static output)
- **Island hydration**: only interactive components load JS
- **Lazy load** Pica and Cropper.js (loaded when user uploads, not on page load)
- **Web Workers** for Pica resize (no main thread blocking)
- **Code splitting**: each tool page loads only its processing code
- **Self-hosted fonts** with `font-display: swap`
- **Preconnect** to CDN origins
- **Static pages**: HTML files served from Cloudflare CDN edge

## Caching

- **Static assets**: immutable hashes, 1-year cache
- **HTML pages**: short cache, stale-while-revalidate
- **Fonts**: long cache, immutable
- **No dynamic content** to cache

## Deployment

**Cloudflare Pages** (free tier):
- Global CDN (300+ edge locations)
- Automatic HTTPS
- Git-based deploys
- Zero cold starts (static files)
- Free custom domain
- Unlimited bandwidth (free tier)

Build command: `astro build`
Output directory: `dist/`

## Security

- MIME type validation before processing
- File size limits enforced client-side
- No `eval()`, no `innerHTML` with user data
- CSP headers configured in Cloudflare
- Subresource Integrity for any CDN scripts (none planned)
- No server = minimal attack surface
