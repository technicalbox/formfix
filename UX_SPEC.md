# UX Specification — FormFix

## First Visit

```
User arrives (from search or direct)
↓
Sees hero: "Fix Your Application Files"
Supporting text explains what FormFix does
↓
Two primary paths visible:
  A) "Choose Your Exam" — preset picker
  B) "Upload a File" — direct tool access
↓
Below: Popular tools, How It Works, Privacy explanation, FAQ
```

## Exam Preset Flow

```
User selects exam (e.g., "SSC CGL")
↓
Sees requirement type selector: Photo / Signature
↓
System displays official requirements:
  "Photo: JPG, 200×230px, 20–50 KB"
  Source link + verification date shown
↓
Upload zone activated with preset locked
↓
User uploads file
↓
System auto-processes:
  1. Validates current file against requirements
  2. If non-compliant: auto-resize, auto-compress
  3. Shows before/after comparison
↓
Validation panel shows pass/fail per criterion:
  ✓ Format: JPG
  ✓ Dimensions: 200×230
  ✓ Size: 47.2 KB (≤ 50 KB)
↓
If all pass: "Ready to Upload" + Download button
If any fail: show what failed + option to adjust manually
↓
User downloads compliant file
```

## Direct Upload Flow

```
User clicks "Upload a File" or drops file on upload zone
↓
System reads file metadata:
  Format, dimensions, file size
↓
Shows file preview + metadata
↓
Tool selector appears:
  Resize | Crop | Compress | Convert
↓
User picks tool → tool panel opens
↓
User configures (dimensions, target KB, crop area, format)
↓
System processes
↓
Shows result with validation
↓
User downloads
```

## Photo Workflow

```
User uploads photo
↓
Preview shown with current dimensions and size
↓
If preset active:
  System suggests crop to correct aspect ratio
  Cropper.js opens with locked ratio
↓
User adjusts crop (drag, zoom, pan)
↓
User confirms crop
↓
System resizes to target dimensions (Pica)
↓
System compresses to target KB (binary search)
↓
Validation result shown
↓
Download
```

## Signature Workflow

```
User uploads signature scan
↓
Preview shown
↓
If preset active:
  Crop tool opens with signature aspect ratio locked
↓
User crops to isolate signature
↓
System resizes to target dimensions
↓
System compresses to target KB
↓
Validation result shown
↓
Download
```

## Compression Workflow

```
User selects compression tool (or arrives from /compress-image-to-50kb)
↓
Target KB is set (from URL param or manual input)
↓
User uploads file
↓
System shows:
  Original: 342 KB
  Target: ≤ 50 KB
  Processing...
↓
Binary search runs (8 iterations max)
↓
Result shown:
  Result: 47.8 KB
  Quality: Acceptable (visual preview available)
  Status: ✓ Ready
↓
If impossible without severe degradation:
  "Cannot reach ≤ 50 KB at current dimensions without unacceptable quality loss.
   Suggestion: Reduce dimensions to 800×600 first."
↓
Download
```

## Crop Workflow

```
User selects crop tool
↓
User uploads file
↓
Cropper.js loads with image
↓
Controls available:
  - Drag to position
  - Pinch/scroll to zoom
  - Pan within crop area
  - Aspect ratio: Free / Lock (with presets: 1:1, 4:3, 3:4, custom)
  - Exact dimensions input (width × height in pixels)
↓
Real-time preview of crop area
↓
User confirms crop → "Apply Crop"
↓
Cropped image shown with new dimensions and size
↓
Option to compress or download directly
```

## Resize Workflow

```
User selects resize tool
↓
User uploads file
↓
Current dimensions shown: 1200×1600
↓
Target dimensions input:
  Width: [___] px    Height: [___] px
  □ Maintain aspect ratio (checked by default)
↓
When one dimension changes, other updates if ratio locked
↓
Preview of result at new dimensions
↓
User confirms → "Resize"
↓
Resized image shown with new file size
↓
Option to compress or download
```

## Validation Workflow

```
User has a file, wants to check if it meets requirements
↓
Selects exam preset
↓
Uploads file
↓
System validates WITHOUT processing:
  Format: ✓ JPG
  Dimensions: ✗ 1200×1600 (need 200×230)
  Size: ✗ 342 KB (need ≤ 50 KB)
↓
"Fix All Issues" button → runs auto-processing
OR: manual tool selection
↓
After fixing: re-validates and shows all-pass result
```

## Download Workflow

```
File is processed and validated
↓
Download panel shows:
  Filename: photo_formfix.jpg
  Dimensions: 200 × 230 px
  Size: 47.2 KB
  Format: JPG
↓
Primary action: [Download] button
↓
Click triggers browser download (a[download] with blob URL)
↓
After download:
  "Process Another File" option
  "Share FormFix" option (native share API on mobile)
```

## Error Workflow

### Invalid File Type
```
User uploads .pdf, .gif, .bmp, or unsupported format
↓
Error: "Unsupported file type. Please upload a JPG, PNG, or WebP image."
↓
Upload zone resets, ready for new file
```

### File Too Large for Browser Processing
```
User uploads 50 MB image
↓
Warning: "This file is very large and may take time to process.
For best results, use a file under 10 MB."
↓
Option to proceed or cancel
```

### Impossible Compression
```
System cannot reach target KB even at minimum quality
↓
Error: "Cannot compress to ≤ 20 KB at 1200×1600 without unacceptable quality loss."
↓
Suggestion: "Try reducing dimensions first, then compressing."
↓
One-click: "Resize to 600×800 and compress" (smart suggestion)
```

### Corrupt File
```
File cannot be decoded by createImageBitmap
↓
Error: "This file appears to be damaged or in an unsupported format.
Please try a different file."
```

## Mobile Workflow

Same logical flow as desktop, adapted for touch:

- Upload: tap zone (full-width), or camera capture button
- Crop: pinch-to-zoom, drag to pan, touch handles to resize crop area
- Controls: stacked vertically, full-width buttons
- Download: prominent button, native share sheet available
- Navigation: hamburger menu, bottom-anchored actions

### Key Mobile Differences
- Camera option in upload zone (capture attribute on file input)
- Larger touch targets (≥ 44px)
- Simplified controls — fewer visible options, progressive disclosure
- Bottom-anchored download button (thumb-reachable)

## Returning User Workflow

```
User returns to FormFix (no accounts, no saved state)
↓
Same homepage experience
↓
If they arrived from a bookmarked exam page:
  Preset is already loaded
↓
Upload → process → download
```

No saved preferences, history, or state in MVP. Every visit is a fresh start.
