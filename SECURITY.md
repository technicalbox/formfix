# Security — FormFix

## Threat Model

FormFix is a static website that processes files entirely in the browser. The attack surface is minimal:
- No server-side code
- No database
- No authentication
- No file uploads to servers
- No user-generated content stored

### Primary Threats

1. **Malicious file input**: User uploads a crafted file designed to exploit browser image parsing
2. **XSS via filename**: File names injected into DOM
3. **Dependency vulnerabilities**: Third-party libraries with known CVEs
4. **CDN compromise**: Tampered static assets

## File Validation

### MIME Type Validation

Before processing, validate:
1. File extension matches expected types (`.jpg`, `.jpeg`, `.png`, `.webp`)
2. MIME type from `file.type` matches expected types
3. Magic bytes (file header) match expected format

```javascript
const ALLOWED_TYPES = {
  'image/jpeg': [0xFF, 0xD8, 0xFF],
  'image/png': [0x89, 0x50, 0x4E, 0x47],
  'image/webp': [0x52, 0x49, 0x46, 0x46]  // RIFF header
};
```

### File Size Limits

- Maximum input file: 25 MB (client-side enforcement)
- Warn at 10 MB (may cause performance issues on mobile)
- Minimum input file: 1 byte (reject 0-byte files)

### Dimension Limits

- Maximum dimensions: 10000 × 10000 pixels
- Canvas memory limit: ~256 MB (varies by browser/device)
- Warn for images > 4000 × 4000 on mobile devices

## XSS Prevention

### Filename Handling

- Never inject filenames into innerHTML
- Use `textContent` for displaying filenames
- Sanitize filenames in download links: replace non-alphanumeric characters

```javascript
function sanitizeFilename(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_');
}
```

### User Input

- Dimension inputs: validate as positive integers
- KB target inputs: validate as positive numbers
- No `eval()` or `new Function()` anywhere

### Content Security Policy

Recommended CSP headers (configured in Cloudflare):

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data:;
  connect-src 'self';
  font-src 'self';
  object-src 'none';
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
```

Key rules:
- `blob:` allowed for img-src (processed image previews)
- `data:` allowed for img-src (canvas data URLs)
- `unsafe-inline` for styles (Astro may inline critical CSS)
- No external script sources
- No iframes embedding

## Dependency Security

### Current Dependencies (Runtime)

| Package | Purpose | License | Last Audit |
|---------|---------|---------|------------|
| pica | Image resize | MIT | 2026-08-09 |
| cropperjs | Image crop UI | MIT | 2026-08-09 |

### Audit Process

- Run `npm audit` before each deployment
- Review `npm audit` output for critical/high vulnerabilities
- Update vulnerable dependencies within 48 hours for critical issues
- Pin dependency versions in package.json

## Browser Processing Safety

- `createImageBitmap()` — browser-native, sandboxed image decoding
- Canvas 2D — browser-native, sandboxed rendering
- `canvas.toBlob()` — browser-native encoding
- Web Workers — isolated execution context for Pica

All processing uses browser-sandboxed APIs. A malformed image that crashes the browser tab does not affect other tabs or the OS.

## Unsafe Filename Handling

Download filenames are constructed, never derived from user input without sanitization:

```javascript
// Safe: constructed filename
const downloadName = `photo_formfix.${format}`;

// Also safe: sanitized original name
const downloadName = `${sanitizeFilename(originalName)}_formfix.${format}`;
```

## Future Backend Security (if needed)

If a backend is ever added:
- All file processing must remain client-side
- Backend would only serve: preset data updates, analytics aggregation
- HTTPS required
- Rate limiting on any API endpoints
- No file storage on server
- Input validation on all endpoints
- CORS restricted to formfix.me domain
