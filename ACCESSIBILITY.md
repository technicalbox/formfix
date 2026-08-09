# Accessibility — FormFix

## WCAG Target

**WCAG 2.1 Level AA** compliance.

## Keyboard Navigation

- All interactive elements reachable via Tab
- Upload zone activatable via Enter/Space
- Crop tool: arrow keys for fine adjustment
- All buttons, links, inputs focusable
- Focus order follows visual reading order
- No keyboard traps

## Screen Reader Support

- Semantic HTML5 elements (`<main>`, `<nav>`, `<section>`, `<article>`)
- `<h1>` through `<h6>` in proper hierarchy
- `aria-label` on icon-only buttons
- `aria-describedby` linking inputs to their descriptions
- `role="status"` on validation results (live region for dynamic updates)
- `aria-busy="true"` during processing
- `aria-live="polite"` on compression progress updates
- Alt text on all informational images

## Focus Management

- Visible focus indicator: 2px ring with offset
- Focus moves to processing workspace after file upload
- Focus moves to validation result after processing
- Focus moves to download button after validation passes
- Modal/overlay focus trapping (if any modals used)

## Contrast

- Body text: ≥ 4.5:1 contrast ratio
- Large text (≥ 18px): ≥ 3:1 contrast ratio
- Placeholder text: ≥ 4.5:1 (not the typical faded gray)
- Interactive elements: ≥ 3:1 against surrounding content
- Focus indicators: ≥ 3:1 against background

## Touch Targets

- Minimum touch target: 44 × 44 px (WCAG 2.5.5)
- Adequate spacing between touch targets
- Upload zone: large, easy-to-tap area
- Download button: prominent, easy to reach on mobile

## Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

All animations and transitions respect this preference.

## Accessible Upload Workflow

1. Upload zone has descriptive label: "Upload image — JPG, PNG, or WebP, maximum 25 MB"
2. File input has associated label
3. Drag-and-drop zone has `role="button"` and keyboard activation
4. After upload: screen reader announces "File uploaded: [filename]"
5. During processing: screen reader announces "Processing image..."
6. After processing: screen reader announces validation results
7. Download button clearly labeled: "Download [filename] ([size])"

## Error Announcements

- Errors use `role="alert"` for immediate screen reader announcement
- Error messages describe the problem and the fix
- Errors are associated with their input via `aria-describedby`

## Form Controls

- Every input has a visible label (not just placeholder)
- Required fields marked with `aria-required="true"`
- Invalid fields marked with `aria-invalid="true"`
- Error messages connected via `aria-describedby`

## Language

- `lang="en"` on `<html>` element
- Language changes marked with `lang` attribute if Hindi content is added later

## Skip Navigation

- "Skip to main content" link as first focusable element
- Hidden visually, visible on focus
