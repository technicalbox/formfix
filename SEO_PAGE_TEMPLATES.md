# SEO Page Templates — FormFix

## Template 1: Exam Photo Page

**URL pattern**: `/{exam}-photo-resizer`

### Structure
```
H1: [Exam Name] Photo Resizer
Subtitle: Resize and compress your photo for [exam] applications

Requirements Table:
  Format: JPG
  Dimensions: [W] × [H] px
  File Size: [min]–[max] KB
  Source: [Official URL] (verified [date])

Working Tool: UploadZone + auto-process + validate + download

Guidelines Section:
  H2: [Exam] Photo Guidelines
  - Official submission guidelines (from notification)
  - Tips for best results

FAQ Section:
  H2: Frequently Asked Questions
  - What size photo is needed for [exam]?
  - How to compress photo for [exam]?
  - What background is required?
  - Can I use a phone camera?

Related Tools:
  - [Exam] Signature Resizer
  - Other exam photo resizers
  - Generic resize/compress tools
```

## Template 2: Exam Signature Page

**URL pattern**: `/{exam}-signature-resizer`

### Structure
```
H1: [Exam Name] Signature Resizer
Subtitle: Crop and compress your signature for [exam] applications

Requirements Table (same format)

Working Tool (same as photo but with signature-specific crop preset)

Guidelines Section:
  H2: [Exam] Signature Guidelines
  - Ink color requirements
  - Paper requirements
  - Signing style (running handwriting, no capitals)

FAQ Section:
  - What size signature is needed for [exam]?
  - Should I use black or blue ink?
  - Can I sign in capital letters?

Related Tools
```

## Template 3: Compression Target Page

**URL pattern**: `/compress-image-to-{X}kb`

### Structure
```
H1: Compress Image to ≤ [X] KB
Subtitle: Reduce your image file size to [X] KB or less — free, in your browser

Working Tool: UploadZone + compression with pre-filled target

Result Display:
  Original: [size] KB
  Target: ≤ [X] KB
  Result: [size] KB
  Status: ✓ Ready / ✗ Could not compress

Common Uses:
  H2: Which exams need ≤ [X] KB images?
  - List of relevant exams with links

FAQ Section:
  - How to reduce image size to [X] KB?
  - Why is my image still too large?
  - Will compressing reduce quality?

Related Pages:
  - Other compression targets
  - Exam-specific resizers
```

## Template 4: Generic Tool Page

**URL pattern**: `/tools/{tool}`

### Structure
```
H1: [Tool Name] — Free Online Tool
Subtitle: [Tool description]

Working Tool (full-featured, no preset)

How It Works:
  Step 1: Upload your image
  Step 2: [Tool-specific step]
  Step 3: Download your processed image

Exam Presets:
  H2: Quick Presets for Popular Exams
  - Grid of exam links

FAQ Section
```

## Content Quality Rules

Every generated page must:
1. Have a working tool (not just text)
2. Have unique H1 (not template-swapped)
3. Have unique meta description
4. Have ≥ 300 words of useful content
5. Have at least 3 internal links
6. Have official source links (for exam pages)
7. Have a disclaimer about verification date
8. NOT have invented requirements
9. NOT duplicate another page's content verbatim
