# Design System — FormFix

> Follows Impeccable Operate mode: scanability over expression, consistent component vocabulary, earned familiarity. The tool disappears into the task.

## Brand Direction

FormFix is a **serious utility** — not a creative tool, not a SaaS dashboard, not a startup landing page. The visual language should feel:
- **Trustworthy** — government document context demands credibility
- **Fast** — the interface communicates speed and efficiency
- **Clear** — every element serves the task; nothing decorative

**Cultural context**: Indian students on Android phones, applying under deadline pressure, often in bright ambient light. The interface must feel reliable — like a well-built government utility, not a flashy startup.

## Typography

### Font Choice

**System UI stack** as the primary face:

```css
--font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
--font-mono: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, monospace;
```

**Rationale**: Operate mode permits system fonts. Users are completing a task, not admiring typography. System fonts load instantly (zero FOIT/FOUT), render natively on every device, and feel familiar — which is a virtue in Operate mode. On Android (the primary platform), this resolves to Roboto. On iOS, SF Pro. On Windows, Segoe UI.

### Type Scale

Fixed rem scale, ratio 1.15 (between 1.125 and 1.2 as Operate guidance specifies):

```css
--text-xs: 0.75rem;     /* 12px — captions, badges */
--text-sm: 0.875rem;    /* 14px — secondary text, labels */
--text-base: 1rem;      /* 16px — body text */
--text-lg: 1.15rem;     /* 18.4px — large body, emphasis */
--text-xl: 1.325rem;    /* 21.2px — section headings */
--text-2xl: 1.525rem;   /* 24.4px — page sub-headings */
--text-3xl: 1.75rem;    /* 28px — page headings */
--text-4xl: 2rem;       /* 32px — hero heading (homepage only) */
```

### Type Weight

```css
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Tracking

```css
--tracking-tight: -0.02em;   /* Headings */
--tracking-normal: 0;         /* Body */
```

Per craft-floor: tracking floor is -0.04em. We use -0.02em for headings — tighter reads better.

### Line Height

```css
--leading-tight: 1.2;    /* Headings */
--leading-normal: 1.5;   /* Body */
--leading-relaxed: 1.6;  /* Long-form text */
```

### Body Measure

65–75ch for prose content. Data and compact UI can run wider.

## Colors

### Strategy: Restrained

Neutrals plus one accent. Per Operate mode guidance: accent color used for primary actions, current selection, and state indicators only — not decoration.

### Light/Dark Decision

**Light mode only for MVP.** Physical scene: Indian students, bright ambient light, phone screens at high brightness, daytime usage during application season. Light mode is the natural choice.

### Palette

```css
/* Primary — Deep blue, trust/authority */
--color-primary-600: hsl(220, 60%, 45%);
--color-primary-700: hsl(220, 60%, 38%);

/* Neutral — Cool gray foundation */
--color-gray-50: hsl(220, 14%, 98%);
--color-gray-100: hsl(220, 14%, 96%);
--color-gray-200: hsl(220, 13%, 91%);
--color-gray-300: hsl(220, 12%, 82%);
--color-gray-400: hsl(220, 10%, 62%);
--color-gray-500: hsl(220, 9%, 46%);
--color-gray-600: hsl(220, 10%, 36%);
--color-gray-700: hsl(220, 12%, 26%);
--color-gray-800: hsl(220, 14%, 18%);
--color-gray-900: hsl(220, 16%, 12%);

/* Semantic */
--color-success: hsl(152, 56%, 38%);
--color-success-bg: hsl(152, 56%, 95%);
--color-error: hsl(0, 65%, 48%);
--color-error-bg: hsl(0, 65%, 96%);
--color-warning: hsl(38, 90%, 46%);
--color-warning-bg: hsl(38, 90%, 95%);
--color-info: hsl(210, 70%, 48%);
--color-info-bg: hsl(210, 70%, 96%);
```

### Semantic Usage

```css
--color-text-primary: var(--color-gray-900);
--color-text-secondary: var(--color-gray-600);
--color-text-tertiary: var(--color-gray-400);
--color-text-inverse: white;

--color-bg-page: var(--color-gray-50);
--color-bg-surface: white;
--color-bg-elevated: white;
--color-bg-muted: var(--color-gray-100);

--color-border: var(--color-gray-200);
--color-border-strong: var(--color-gray-300);

--color-focus-ring: hsl(220, 60%, 50%);
```

### Contrast

Per craft-floor: body and placeholder text ≥ 4.5:1, large text ≥ 3:1. On colored surfaces, tint secondary text from that hue — never gray.

## Spacing System

4px base unit:

```css
--space-1: 0.25rem;    /* 4px */
--space-2: 0.5rem;     /* 8px */
--space-3: 0.75rem;    /* 12px */
--space-4: 1rem;       /* 16px */
--space-5: 1.25rem;    /* 20px */
--space-6: 1.5rem;     /* 24px */
--space-8: 2rem;       /* 32px */
--space-10: 2.5rem;    /* 40px */
--space-12: 3rem;      /* 48px */
--space-16: 4rem;      /* 64px */
--space-20: 5rem;      /* 80px */
```

Per craft-floor: tight groups, generous separation, more space above a heading than below it.

## Border Radius

```css
--radius-sm: 6px;
--radius-md: 8px;
--radius-lg: 12px;
```

Per craft-floor: card radii stay at 12–16px. Pills are for small controls only.

## Shadows

Per craft-floor: shadows carry an offset and a soft blur. A zero-offset colored halo is decoration. Declare elevation once — border or shadow, not both.

```css
--shadow-sm: 0 1px 2px 0 hsl(220 14% 10% / 0.05);
--shadow-md: 0 2px 8px -2px hsl(220 14% 10% / 0.08);
--shadow-lg: 0 8px 24px -4px hsl(220 14% 10% / 0.1);
```

## Iconography

Per craft-floor: icons must be from a real library or authored SVG, in one consistent stroke and weight. No Unicode glyphs or emoji as icon substitutes.

**Choice**: Inline SVG icons, custom-authored to match the tool context. Minimal set:
- Upload, download, crop, resize, compress, convert
- Check, cross, warning, info
- Photo, signature, document
- Search, menu, close, chevron

All icons: 24×24 viewBox, 1.5px stroke, round line caps.

## Buttons

### Primary Button
```css
.btn-primary {
  background: var(--color-primary-600);
  color: white;
  font-weight: var(--font-semibold);
  font-size: var(--text-base);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
  transition: background-color 150ms ease-out;
  min-height: 44px; /* Touch target */
}
```

### States (ALL required per Operate mode)
- **Default**: Primary blue background
- **Hover**: Darker shade (-700)
- **Focus**: 2px focus ring offset
- **Active**: Slightly darker, subtle scale(0.98)
- **Disabled**: Gray background, reduced opacity, no pointer events
- **Loading**: Show spinner, disable interaction
- **Error**: Not applicable for buttons (handled by forms)

### Secondary Button
Same dimensions. Transparent background, primary color border and text.

### Ghost Button
Same dimensions. No background, no border. Text color only.

## Inputs

```css
.input {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  font-size: var(--text-base);
  background: white;
  color: var(--color-text-primary);
  min-height: 44px;
  transition: border-color 150ms ease-out;
}
```

### States
- **Default**: Gray border
- **Hover**: Darker border
- **Focus**: Primary color border + focus ring
- **Disabled**: Gray background, faded text
- **Error**: Red border + error message below
- **Valid**: Green border (only when actively validating)

## Upload Zone

Large drop target with dashed border. States:
- **Default**: Dashed border, icon + "Drop file or click to upload"
- **Hover/Drag-over**: Solid border, tinted background
- **File selected**: Show thumbnail preview, file name, size
- **Error**: Red border, error message
- **Processing**: Progress indicator

Touch target: entire zone is tappable on mobile (≥ 44px height, typically much larger).

## Cards

Per craft-floor: same-size cards of icon + heading + text as page structure is the lazy container. Cards used sparingly and purposefully.

```css
.card {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
}
```

No shadow AND border together. Pick one elevation method.

## Alerts / Validation States

### Success
Green left accent (1px max per craft-floor), success icon, green-tinted background.

### Error
Red left accent, error icon, red-tinted background.

### Warning
Amber left accent, warning icon, amber-tinted background.

### Info
Blue left accent, info icon, blue-tinted background.

Per craft-floor: colored `border-left` above 1px is banned. Use 1px max, or use background tint alone.

## Progress Indicators

### Compression Progress
Show percentage + current size. No spinners in the middle of content — use skeleton states for loading.

### Processing
Subtle progress bar within the processing panel.

## Navigation

### Header
- Logo/wordmark left
- Primary nav center (Tools dropdown, Exams)
- No heavy chrome

### Mobile
- Compact header
- Hamburger menu (standard pattern per Operate mode)
- Bottom sheet for tool options (natural mobile pattern)

### Desktop
- Full nav visible
- Sidebar for tool options when in processing workspace

## Responsive Breakpoints

```css
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
```

### Mobile (< 768px)
- Single column layout
- Full-width upload zone
- Stacked processing controls
- Bottom sheet for settings
- Touch-optimized controls (≥ 44px targets)

### Desktop (≥ 768px)
- Two-column layout for tool pages (preview left, controls right)
- Sidebar navigation within tools
- Wider content area

## Accessibility Rules

- WCAG 2.1 AA target
- All interactive elements focusable via keyboard
- Visible focus indicators (2px ring, offset)
- `aria-label` on icon-only buttons
- `role="status"` on validation results (live region)
- `aria-busy` during processing
- Touch targets ≥ 44px
- `prefers-reduced-motion` respected — disable transitions

## Motion Rules

Per Operate mode: 150–250ms on most transitions. Motion conveys state, not decoration.

```css
--duration-fast: 150ms;
--duration-normal: 200ms;
--ease-out: cubic-bezier(0.16, 1, 0.3, 1); /* Exponential ease-out */
```

Per craft-floor: one authored moment, not scattered effects. Exponential ease-out from an already-visible default.

**No**:
- Orchestrated page-load sequences
- Scroll-triggered animations
- Parallax effects
- Decorative motion that doesn't convey state

## Component States Checklist

Every interactive component must have documented and implemented:

| State | Required |
|-------|----------|
| Default | ✓ |
| Hover | ✓ |
| Focus (keyboard) | ✓ |
| Active (pressed) | ✓ |
| Disabled | ✓ |
| Loading | ✓ (where applicable) |
| Error | ✓ (where applicable) |

## Empty States

Per Operate mode: empty states teach the interface, not "nothing here."

Upload zone when no file is loaded: show what file types are accepted, what happens next, and a clear call to action.

## Loading States

Per Operate mode: skeleton states for loading, not spinners in the middle of content.

Processing state: inline progress within the processing panel.
