# Testing Strategy — FormFix

## Functional Tests

### Image Processing
- [ ] JPG upload → resize → correct dimensions
- [ ] PNG upload → resize → correct dimensions
- [ ] WebP upload → resize → correct dimensions
- [ ] Compress JPG to ≤ 50 KB → result ≤ 50 KB
- [ ] Compress JPG to ≤ 20 KB → result ≤ 20 KB
- [ ] Compress PNG to ≤ 100 KB → result ≤ 100 KB
- [ ] Impossible compression → clear error message
- [ ] Crop with aspect ratio lock → correct ratio maintained
- [ ] Crop with free ratio → correct output
- [ ] Convert JPG → PNG → valid PNG output
- [ ] Convert PNG → JPG → valid JPG output
- [ ] Convert WebP → JPG → valid JPG output

### Edge Cases
- [ ] Very small file (1 KB) → processes correctly
- [ ] Very large file (20 MB) → processes or warns
- [ ] 1×1 pixel image → handles gracefully
- [ ] 10000×10000 image → handles or warns about memory
- [ ] Portrait orientation → correct output
- [ ] Landscape orientation → correct output
- [ ] Square image → correct output
- [ ] Image with transparency (PNG) → preserved in PNG, handled in JPG
- [ ] Corrupt/invalid file → clear error message
- [ ] 0-byte file → rejected with message
- [ ] Non-image file (.pdf, .txt) → rejected with message
- [ ] File already meets requirements → shows "already compliant"

### Exam Presets
- [ ] Each preset loads correct requirements
- [ ] Auto-processing produces compliant output
- [ ] Validation checks all criteria
- [ ] Source links are valid

### Download
- [ ] Downloaded file has correct format
- [ ] Downloaded file has correct dimensions
- [ ] Downloaded file is ≤ target size
- [ ] Downloaded filename is safe (no special characters)

## UX Tests

### First-Time User
- [ ] Homepage clearly communicates purpose
- [ ] Primary action is obvious
- [ ] User can process a file within 60 seconds

### Mobile
- [ ] Upload works on Android Chrome
- [ ] Upload works on iOS Safari
- [ ] Crop tool works with touch (pinch, drag)
- [ ] All controls have ≥ 44px touch targets
- [ ] Download works on mobile
- [ ] Layout doesn't break on small screens (320px width)

### Desktop
- [ ] Upload works with drag-and-drop
- [ ] Keyboard navigation works throughout
- [ ] All states visible (hover, focus, active)

### Slow Connection
- [ ] Page loads without JS blocking
- [ ] Processing libraries lazy-load on demand
- [ ] No infinite loading states

## SEO Tests

- [ ] Every page has unique `<title>`
- [ ] Every page has unique `<meta name="description">`
- [ ] Every page has one `<h1>`
- [ ] Heading hierarchy is correct (no skipped levels)
- [ ] Canonical URL present on every page
- [ ] Sitemap generated and valid
- [ ] Robots.txt present and correct
- [ ] JSON-LD structured data valid (test with Google's tool)
- [ ] Internal links are not broken
- [ ] No duplicate title tags across pages

## Performance Tests

- [ ] Lighthouse Performance ≥ 95
- [ ] Lighthouse Accessibility ≥ 90
- [ ] Lighthouse Best Practices ≥ 95
- [ ] Lighthouse SEO ≥ 95
- [ ] LCP < 1.5s on 4G
- [ ] CLS < 0.05
- [ ] INP < 100ms
- [ ] Total JS bundle < 100 KB (interactive)
- [ ] No render-blocking resources

## Privacy / Security Tests

- [ ] **RELEASE-BLOCKING**: Network tab shows zero file uploads during processing
- [ ] No cookies set
- [ ] No localStorage/IndexedDB written
- [ ] CSP headers configured correctly
- [ ] No `eval()` or `innerHTML` with user data
- [ ] File type validation rejects non-images
- [ ] Oversized files are rejected or warned

## Accessibility Tests

- [ ] All images have alt text
- [ ] Form inputs have labels
- [ ] Focus indicators visible
- [ ] Color contrast ≥ 4.5:1 for body text
- [ ] Screen reader can navigate upload → process → download flow
- [ ] `prefers-reduced-motion` disables animations
