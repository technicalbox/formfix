# FormFix

A privacy-first, client-side utility website for preparing, resizing, cropping, compressing, and validating photos, signatures, and documents for Indian exam and government application forms.

Live Production Site: **[https://formfix.me](https://formfix.me)**

---

## 🚀 What FormFix Does

FormFix eliminates the frustration of rejected application photos and signatures on Indian government and competitive exam portals (e.g. SSC, IBPS, UPSC, NEET, JEE, RRB).

- **Resize Image**: Downscale or upscale images to exact pixel dimensions (e.g. 200 × 230 px) with aspect ratio lock.
- **Crop Image**: Drag, zoom, pan, and crop images to specific target ratios using touch-friendly controls.
- **Compress Image**: Intelligently compress JPG/PNG/WebP images to `≤ target KB` (e.g. ≤ 20 KB, ≤ 50 KB, ≤ 100 KB) using a deterministic binary search algorithm without destroying visual clarity.
- **Convert Format**: Convert images between JPG, PNG, and WebP formats instantly.
- **Exam & Application Presets**: Preset rules for major exams auto-apply official dimensions, file size limits, and format requirements.
- **Instant Validation**: Check images against official requirements before downloading.

---

## 🔒 Privacy Architecture

- **100% Client-Side Processing**: All image manipulation (cropping, resizing, compression, format conversion) is executed directly within the user's browser using HTML5 Canvas API, Pica Web Workers, and Cropper.js.
- **Zero Server Uploads**: User files are never uploaded to any remote server or third-party service.
- **No Tracking / No Account Required**: Completely free, open, and private utility.

---

## 🛠️ Technology Stack

- **Framework**: [Astro 5](https://astro.build/) (Static Site Generation / SSG)
- **Styling**: Vanilla CSS with custom properties (System Design tokens following Impeccable Operate mode rules)
- **Image Resizing**: [Pica](https://github.com/nodeca/pica) (High-quality Lanczos3 downscaling via Web Workers)
- **Image Cropping**: [Cropper.js v2](https://github.com/fengyuanchen/cropperjs) (Touch-friendly canvas cropping)
- **Compression Engine**: Client-side binary search algorithm targeting deterministic `toBlob` quality parameters
- **Sitemap & SEO**: `@astrojs/sitemap`, OpenGraph metadata, JSON-LD `HowTo` & `WebApplication` schemas

---

## 📐 Architecture Flow

```text
User Selects Preset / Tool
        ↓
Loads Target Specifications (Width, Height, Max KB, Format)
        ↓
User Selects Image (Drag & Drop / Camera)
        ↓
Browser Local Processing (Pica / Cropper / Canvas API)
        ↓
Binary Search Compression (Targeting ≤ X KB)
        ↓
Requirement Validation Engine
        ↓
Instant Direct Download (No Backend Network Call)
```

---

## 🌐 SEO & Programmatic Pages

FormFix programmatically generates optimized landing pages for verified high-intent searches:

- **Exam Preset Resizers**:
  - `/ibps-photo-resizer` (200 × 230 px, 20–50 KB)
  - `/ibps-signature-resizer` (140 × 60 px, 10–20 KB)
  - `/ssc-signature-resizer` (≤ 20 KB)
  - `/upsc-photo-resizer` (≤ 300 KB)
  - `/upsc-signature-resizer` (≤ 100 KB)
  - `/neet-photo-resizer` (≤ 200 KB)
  - `/neet-signature-resizer` (≤ 30 KB)
  - `/jee-photo-resizer` (≤ 200 KB)
  - `/jee-signature-resizer` (≤ 100 KB)
  - `/rrb-photo-resizer` (≤ 100 KB)
  - `/rrb-signature-resizer` (≤ 50 KB)

- **Quick Compress Routes**:
  - `/compress-image-to-20kb`
  - `/compress-image-to-50kb`
  - `/compress-image-to-100kb`
  - `/compress-image-to-200kb`

---

## 💻 Local Development

### Prerequisites

- Node.js `v18+`
- `npm`

### Setup & Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

## 📁 Repository Structure

```text
site-1/
├── public/              # Static public assets (favicon.svg, robots.txt)
├── src/
│   ├── data/            # Presets JSON dataset (presets.json)
│   ├── layouts/         # Base HTML layout & site header/footer (BaseLayout.astro)
│   ├── lib/             # Core processing engines (image-engine.js, validator.js)
│   ├── pages/           # Astro pages (index.astro, tools/*, [slug].astro)
│   └── styles/          # Global design system & tokens (global.css)
├── astro.config.mjs     # Astro configuration & sitemap integration
├── package.json         # Dependencies and build scripts
└── *.md                 # Architecture, Privacy, Security & Design documentation
```

---

## 📄 Documentation

Comprehensive technical documentation is maintained within the repository:

- [PRODUCT_SPEC.md](file:///c:/Users/aktec/Site%201/PRODUCT_SPEC.md) — Feature requirements & product vision
- [PRIVACY_ARCHITECTURE.md](file:///c:/Users/aktec/Site%201/PRIVACY_ARCHITECTURE.md) — Client-side privacy guarantees
- [SECURITY.md](file:///c:/Users/aktec/Site%201/SECURITY.md) — Security policies & verification
- [PERFORMANCE.md](file:///c:/Users/aktec/Site%201/PERFORMANCE.md) — Web Vitals & image processing benchmarks
- [DECISIONS.md](file:///c:/Users/aktec/Site%201/DECISIONS.md) — Architectural Decision Records (ADRs)
- [DATA_SOURCES.md](file:///c:/Users/aktec/Site%201/DATA_SOURCES.md) — Exam notification verification records

---

## ⚖️ License

MIT License — see [LICENSE](file:///c:/Users/aktec/Site%201/LICENSE) for details.
