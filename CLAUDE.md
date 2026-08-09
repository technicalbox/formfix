# CLAUDE.md — FormFix Project Instructions

> This file is the permanent source of truth for the FormFix project.
> All AI agents and human engineers must follow these rules.

## Product Mission

FormFix helps Indian users fix their photos, signatures, and documents for government exams, competitive tests, and recruitment portals — entirely in the browser.

**Core promise**: Upload → Fix → Download. No server. No signup. No cost.

## Non-Negotiable Rules

### 1. Files Never Leave the Browser

All image processing happens client-side using Canvas API, Pica, and Cropper.js. No file is ever uploaded to any server for processing.

**This is a release-blocking requirement.** If any dependency sends file data to an external server, that dependency must be removed immediately.

Verify in QA: open Network tab, process a file, confirm zero outbound file data.

### 2. No Paid AI API Dependencies

The production website must not depend on Gemini, OpenAI, Claude, or any paid AI/OCR/image-processing API. AI tools may be used during development only.

### 3. No Invented Requirements

Exam/application requirements must come from official sources (ssc.gov.in, upsc.gov.in, neet.nta.nic.in, ibps.in, etc.). Every preset must include:
- Source URL
- Verification date
- Notification year
- Disclaimer that users should verify against the current notification

Do not treat numbers from research as automatically correct. Independently verify before making them production data.

### 4. Open-Source First

For every technical need, prefer in this order:
1. Browser-native API
2. Open-source library
3. WebAssembly/local processing
4. Static data
5. Free infrastructure
6. Paid service only if unavoidable

Evaluate: maintenance, GitHub activity, license, browser compatibility, mobile support, bundle size, security.

### 5. Search Demand Before Pages

Only create SEO pages where verified search demand exists. The strategy is:

> Search demand → page → working tool

Not: generate pages → hope for traffic.

Every page must provide genuine utility with a working tool.

## Technology Rules

- **Framework**: Astro (static output, SSG)
- **Styling**: Vanilla CSS with custom properties
- **JavaScript**: Vanilla JS, Astro islands for interactivity
- **Image resize**: Pica (Web Workers, high-quality downscaling)
- **Image crop**: Cropper.js (vanilla, mobile touch support)
- **Compression**: Canvas API binary search on `toBlob()`
- **Deployment**: Cloudflare Pages (static)
- **Fonts**: System UI stack or self-hosted workhorse sans

## Design Rules

- **Impeccable skill is mandatory** for all UI/UX work
- **Mode**: Operate (task-completion focus). Homepage hero uses Persuade.
- **Color strategy**: Restrained (neutrals + one accent)
- **Typography**: One family, fixed rem scale, 1.125–1.2 ratio
- **Motion**: 150–250ms transitions for state feedback only. No orchestrated page-load sequences.
- **States**: Every interactive component must have: default, hover, focus, active, disabled, loading, error
- **No generic AI UI**: No excessive gradients, random glassmorphism, huge rounded cards, meaningless animations, kicker/eyebrow labels above headings

### Impeccable Iteration Cycle

Design → Build → Impeccable critique → Fix → Mobile critique → Fix → Final polish.

Not: Design once → use Impeccable → forget it.

## Privacy Rules

- Uploaded files never leave the browser
- No filename tracking
- No file content logging
- Analytics (if added) must not capture file metadata
- Cookies only for essential site function

## Architecture Rules

- No microservices, Kubernetes, unnecessary backend
- No authentication, database, or queue systems
- Simplest architecture capable of becoming large
- Static output only for MVP
- Code splitting and lazy loading for processing libraries

## SEO Rules

- Unique title, description, H1 per page
- Proper heading hierarchy (single H1)
- Semantic HTML5 elements
- Sitemap, robots.txt, canonical URLs
- JSON-LD structured data (HowTo schema)
- Internal linking between related tools
- No thin content — every page has a working tool

## Compression Language

Always say "≤ X KB" (at most X KB), never promise mathematically exact file sizes. The binary search targets a maximum, not an exact match.

## Coding Conventions

- Meaningful file and variable names
- JSDoc comments on public functions
- CSS custom properties for all design tokens
- Astro components for reusable UI
- Data-driven presets (JSON, not hardcoded)
- Error boundaries around processing code

## Testing Requirements

- Functional: all formats (JPG, PNG, WebP), edge cases, compression targets
- UX: mobile, desktop, touch, keyboard
- SEO: metadata, sitemap, canonical, structured data
- Performance: Lighthouse 95+ all categories
- Privacy: Network tab verification (zero file uploads)
- Release-blocking: any outbound file transfer = cannot ship

## Documentation Rules

- Keep all 18+ MD files current
- Update DECISIONS.md for every meaningful architecture choice
- Update CHANGELOG.md for every meaningful change
- Update DATA_SOURCES.md when requirements are verified
- Never delete documentation without replacement
