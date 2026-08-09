# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro (static SSG) + vanilla CSS + vanilla JS. Delegated: chose Astro for zero-JS default, static output for SEO, islands architecture for interactive tools. Cloudflare Pages for deployment.

## Users

Indian students, job seekers, and government applicants who need to upload photos, signatures, and documents to online application portals (competitive exams, government recruitment, university admissions, scholarship forms). They are typically:
- 18–35 years old
- Using Android phones on mobile data
- Applying under deadline pressure
- Frustrated by portal rejection messages about file size/dimensions
- Not technically skilled in image editing

Secondary: parents helping children apply, coaching center staff assisting students.

## Product Purpose

FormFix makes application files compliant with portal requirements — resize, crop, compress, validate — directly in the browser.

**What it does**: Takes a user's photo, signature, or document file and processes it to meet exact specifications (dimensions, file size, format) required by Indian exam and government portals.

**Why it exists**: Portals reject applications for files that are 1 KB too large, 10 pixels too wide, or the wrong format. Users lose time, miss deadlines, and resort to unreliable tools that upload their sensitive documents to unknown servers.

**Success means**: A user arrives with a rejected file, processes it in under 60 seconds, downloads a compliant version, and successfully uploads it to their target portal.

## Positioning

FormFix is the only tool that combines verified Indian exam-specific presets with browser-local processing. Users don't need to know image dimensions — they pick their exam, upload their file, and get a compliant result. No generic "image resizer" offers exam-aware validation. No competitor guarantees files stay on the device.

## Operating Context

Users typically arrive from Google search during application season (varies by exam: SSC Jan–Mar, UPSC Feb–Mar, NEET Jan–Mar, JEE Nov–Jan, IBPS Jul–Sep). They have:
- A notification PDF open in another tab with requirements
- A photo or signature file on their phone
- A portal upload form waiting for a compliant file
- Limited time and patience

The workflow is: search → land on FormFix → upload → process → download → go back to portal → upload.

## Capabilities and Constraints

**Confirmed functionality (MVP)**:
- Image resize to exact pixel dimensions
- Image crop with aspect ratio lock (drag, zoom, pan, touch)
- Compress to target file size (≤ X KB) via binary search
- Format conversion (JPG ↔ PNG ↔ WebP)
- Validate file against exam/portal requirements
- Download processed file

**Constraints**:
- All processing is browser-local (Canvas API, Pica, Cropper.js)
- No server-side processing in MVP
- No user accounts or saved history
- Exam requirements must be independently verified from official sources before becoming production data
- File size compression targets ≤ X KB, not mathematically exact

**Undecided**:
- PDF processing (future consideration)
- Batch processing (future consideration)
- Background removal (future consideration)

## Evidence on Hand

- Official exam requirement specifications from ssc.gov.in, upsc.gov.in, neet.nta.nic.in, ibps.in, rrbapply.gov.in (to be independently verified before production use)
- No real user testimonials yet (do not fabricate)
- No case studies yet (do not fabricate)
- No partnerships or endorsements (do not fabricate)

## Product Principles

1. **Privacy is the product** — files never leave the browser. This isn't a feature; it's the architecture.
2. **Exam-aware, not generic** — users pick their exam, not pixel counts. The tool knows what the portal needs.
3. **60-second workflow** — upload to download in under a minute. Every extra step is a failure.
4. **Honest about limits** — if compression would destroy quality, say so. If requirements are unverified, say so.
5. **Mobile-first** — most users are on Android phones. If it doesn't work on a ₹10,000 phone, it doesn't work.

## Accessibility & Inclusion

- WCAG 2.1 AA target
- Keyboard-navigable upload and crop workflow
- Screen reader support for validation results
- Touch targets ≥ 44px for mobile
- Reduced motion support
- Hindi language support (future consideration, not MVP)
