# Product Specification — FormFix

## Target Users

### Primary: Indian Exam Applicants
- Students (18–25) applying for competitive exams: SSC, UPSC, NEET, JEE, IBPS, RRB
- Job seekers applying for government recruitment
- University/scholarship applicants

### Secondary
- Parents assisting children with applications
- Coaching center staff processing student applications in bulk
- Anyone needing to meet specific file requirements for Indian portals

## User Problems

1. **Rejection at upload**: Portal says "file too large" or "wrong dimensions" — user doesn't know how to fix it
2. **Confusing requirements**: Notifications specify "200×230 pixels, 20–50 KB, JPG" — user doesn't know what pixels or KB mean
3. **Privacy anxiety**: Existing tools upload sensitive documents (Aadhaar, PAN) to unknown servers
4. **Mobile-only access**: Many users only have a phone — desktop image editors aren't an option
5. **Time pressure**: Application deadlines create urgency; spending 30 minutes figuring out image editing is unacceptable
6. **Multiple attempts**: Users try and fail multiple times, degrading image quality each time

## Product Positioning

**FormFix is the exam-aware file fixer, not a generic image editor.**

| Generic Image Compressor | FormFix |
|--------------------------|---------|
| "Enter dimensions manually" | "Select SSC CGL → Photo" |
| Uploads to server | Processes in browser |
| No validation | Shows pass/fail per requirement |
| No exam awareness | Knows official requirements |
| Desktop-focused | Mobile-first |

## Core Use Cases

### UC1: Fix photo for exam application
User has a photo, needs it to be 200×230px, ≤50 KB, JPG for SSC.
→ Pick SSC → Photo → Upload → Auto-resize + compress → Validate → Download

### UC2: Fix signature for exam application
User has a signature scan, needs it ≤20 KB, 140×60px, JPG.
→ Pick SSC → Signature → Upload → Crop to ratio → Compress → Download

### UC3: Compress image to specific KB
User knows they need "≤50 KB" but nothing else.
→ Use compression tool → Set target → Upload → Download

### UC4: Resize image to specific dimensions
User has exact pixel requirements from a notification.
→ Use resize tool → Enter dimensions → Upload → Download

### UC5: Validate existing file
User has already processed a file, wants to check if it meets requirements.
→ Pick exam → Upload → See validation results → Fix or download

## MVP Scope

### In MVP
- Image resize (exact pixel dimensions)
- Image crop (drag, zoom, pan, aspect ratio lock, touch support)
- Compress to ≤ X KB (binary search algorithm)
- Format conversion (JPG, PNG, WebP)
- Requirement validation (dimensions, size, format)
- Exam presets: SSC, UPSC, NEET, JEE Main, IBPS, RRB
- SEO pages for top exam + compression queries
- Mobile-responsive workflow
- Privacy-first architecture (browser-local processing)

### NOT in MVP
- PDF processing
- Batch processing
- Background removal
- User accounts / saved history
- AI-powered features
- Signature pad / drawing tool
- Hindi / regional language UI
- Advertisements
- Backend / API

## User Journeys

### Journey 1: Exam Preset Flow
1. User searches "SSC photo size" → lands on /ssc-photo-resizer
2. Sees: "SSC Photo Resizer — Fix your photo for SSC applications"
3. Sees official requirements displayed
4. Uploads photo
5. Tool auto-crops to correct aspect ratio, resizes, compresses
6. Sees validation: ✓ Format ✓ Dimensions ✓ Size
7. Downloads compliant file
8. Returns to SSC portal and uploads

### Journey 2: Direct Tool Flow
1. User searches "compress image to 50kb" → lands on /compress-image-to-50kb
2. Uploads image
3. Tool compresses to ≤50 KB
4. Sees: Original 342 KB → Result 47.8 KB
5. Downloads

### Journey 3: Homepage Flow
1. User arrives at homepage
2. Sees "Fix Your Application Files"
3. Either: picks an exam from the preset list, or uploads directly
4. Completes processing workflow
5. Downloads

## Success Criteria

- User can go from upload to compliant download in ≤ 60 seconds
- Compression hits ≤ target KB in > 95% of cases
- Zero files transmitted to any server during processing
- Mobile workflow is fully functional on Android Chrome
- Lighthouse performance score ≥ 95
- First Contentful Paint < 1.5s
- Every SEO page has a working tool, not just text

## Non-Goals

- Being a full-featured image editor (Photoshop/Canva competitor)
- Handling video files
- Social media image resizing (Instagram, Facebook etc.)
- Watermarking or branding
- Cloud storage or file management
- Real-time collaboration
