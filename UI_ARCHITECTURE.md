# UI Architecture — FormFix

## Component Hierarchy

```
App
├── BaseLayout
│   ├── SEOHead (title, meta, canonical, JSON-LD, OG)
│   ├── Header
│   │   ├── Logo (wordmark)
│   │   ├── Nav
│   │   │   ├── Tools dropdown (Resize, Crop, Compress, Convert)
│   │   │   └── Exams dropdown (SSC, UPSC, NEET, JEE, IBPS, RRB)
│   │   └── MobileMenuToggle
│   └── Footer
│       ├── FooterNav (tool links, exam links)
│       ├── PrivacyNote
│       └── Copyright
│
├── HomePage (index.astro)
│   ├── Hero
│   │   ├── Heading: "Fix Your Application Files"
│   │   ├── Subheading: supporting message
│   │   └── PrimaryActions
│   │       ├── ExamPresetPicker (inline search + popular list)
│   │       └── UploadZone (compact, hero-integrated)
│   ├── PopularTools (grid of ToolCards)
│   ├── HowItWorks (3-step visual)
│   ├── PrivacyBadge (browser-local explanation)
│   ├── PopularExams (grid of exam links)
│   └── FAQ (accordion)
│
├── ToolPage (ToolLayout.astro)
│   ├── ToolHeader
│   │   ├── Heading (tool name + context)
│   │   └── RequirementsBanner (if preset active)
│   ├── UploadZone (full-width)
│   └── ProcessingWorkspace (appears after upload)
│       ├── ImagePreview
│       │   ├── OriginalPreview
│       │   └── ResultPreview
│       ├── ToolControls
│       │   ├── CropEditor (Cropper.js — for crop/photo tools)
│       │   ├── ResizeControls (width/height inputs — for resize)
│       │   ├── CompressionControls (target KB slider — for compress)
│       │   └── FormatSelector (JPG/PNG/WebP — for convert)
│       ├── ValidationResult
│       │   ├── ValidationItem (per requirement: ✓/✗)
│       │   └── OverallStatus
│       └── DownloadPanel
│           ├── FileInfo (name, dimensions, size, format)
│           └── DownloadButton
│
└── ExamPage ([slug].astro — programmatic)
    ├── ExamHeader
    │   ├── Heading: "[Exam] Photo/Signature Resizer"
    │   └── RequirementsTable (official specs + source link)
    ├── UploadZone
    ├── ProcessingWorkspace (same as ToolPage)
    ├── ExamInfo
    │   ├── Guidelines
    │   └── OfficialSourceLink
    └── RelatedTools (internal links)
```

## Component Responsibilities

### Static Components (Astro — no JS)
- `Header.astro` — navigation, logo
- `Footer.astro` — links, privacy note
- `Hero.astro` — homepage hero section
- `HowItWorks.astro` — static 3-step explainer
- `PrivacyBadge.astro` — static trust badge
- `FAQ.astro` — accordion (CSS-only with `<details>`)
- `ToolCard.astro` — static card with link
- `SEOHead.astro` — meta tags, JSON-LD

### Interactive Components (Astro Islands — JS hydrated)
- `UploadZone.astro` — file input, drag/drop, camera (`client:load`)
- `ImageEditor.astro` — Cropper.js wrapper (`client:visible`)
- `CompressionPanel.astro` — target input, progress, result (`client:visible`)
- `ResizePanel.astro` — dimension inputs, aspect ratio lock (`client:visible`)
- `FormatPanel.astro` — format selector (`client:visible`)
- `ValidationResult.astro` — dynamic pass/fail display (`client:visible`)
- `DownloadPanel.astro` — blob download trigger (`client:visible`)
- `ExamPresetPicker.astro` — search/filter presets (`client:load`)

## Data Flow Between Components

```
UploadZone
    │ dispatches 'file-selected' CustomEvent with File object
    ▼
ProcessingWorkspace (listens)
    │ reads File, creates preview
    │ passes to active tool
    ▼
ToolControls (CropEditor / ResizeControls / CompressionControls)
    │ user configures, dispatches 'process-request' with config
    ▼
image-engine.js
    │ processes file, returns result Blob
    ▼
ValidationResult
    │ validates result against requirements
    │ dispatches 'validation-complete'
    ▼
DownloadPanel
    │ creates download link from Blob
    │ shows file metadata
```

## Layout Structure

### Homepage
```
┌──────────────────────────────────────┐
│  Header                              │
├──────────────────────────────────────┤
│  Hero                                │
│  ┌────────────────────────────────┐  │
│  │  "Fix Your Application Files"  │  │
│  │  [Choose Exam ▾] [Upload File] │  │
│  └────────────────────────────────┘  │
├──────────────────────────────────────┤
│  Popular Tools (3-col grid)          │
│  ┌──────┐ ┌──────┐ ┌──────┐        │
│  │Resize│ │ Crop │ │Compr.│        │
│  └──────┘ └──────┘ └──────┘        │
├──────────────────────────────────────┤
│  How It Works (3 steps)              │
├──────────────────────────────────────┤
│  Privacy Badge                       │
├──────────────────────────────────────┤
│  Popular Exams (grid)                │
├──────────────────────────────────────┤
│  FAQ (accordion)                     │
├──────────────────────────────────────┤
│  Footer                              │
└──────────────────────────────────────┘
```

### Tool Page — Desktop (≥ 768px)
```
┌──────────────────────────────────────┐
│  Header                              │
├──────────────────────────────────────┤
│  Tool Header + Requirements Banner   │
├──────────────────┬───────────────────┤
│  Image Preview   │  Tool Controls    │
│  (before/after)  │  (inputs, sliders)│
│                  │                   │
│                  │  Validation Result│
│                  │                   │
│                  │  Download Panel   │
├──────────────────┴───────────────────┤
│  Related Tools                       │
├──────────────────────────────────────┤
│  Footer                              │
└──────────────────────────────────────┘
```

### Tool Page — Mobile (< 768px)
```
┌─────────────────┐
│  Header         │
├─────────────────┤
│  Tool Header    │
│  Requirements   │
├─────────────────┤
│  Upload Zone    │
│  (full-width)   │
├─────────────────┤
│  Image Preview  │
│  (full-width)   │
├─────────────────┤
│  Tool Controls  │
│  (stacked)      │
├─────────────────┤
│  Validation     │
├─────────────────┤
│  Download       │
│  (sticky bottom)│
├─────────────────┤
│  Related Tools  │
├─────────────────┤
│  Footer         │
└─────────────────┘
```

## Ad Slot Architecture

Natural break points where ads can be inserted later without destroying UX:

1. **Between "Popular Tools" and "How It Works"** on homepage (horizontal banner)
2. **Below the tool workspace** on tool pages (horizontal)
3. **In the sidebar** on desktop tool pages (vertical, alongside controls)
4. **Below FAQ** on any page (horizontal)

Rules for future ads:
- Never inside the upload zone or processing workspace
- Never between "Process" and "Download" buttons
- Never imitating interactive controls
- Never causing layout shift during processing
- Clearly labeled as advertisements
