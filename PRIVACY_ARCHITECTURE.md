# Privacy Architecture — FormFix

## Core Privacy Principle

**Uploaded files never leave the user's browser.**

This is not a feature — it is the architecture. There is no server to send files to.

## What Stays in the Browser

| Data | Location | Duration |
|------|----------|----------|
| Uploaded files | Browser memory (JS heap) | Until page close or new file uploaded |
| Processed files | Browser memory (Blob/ObjectURL) | Until page close or new file processed |
| Canvas pixel data | Browser memory | During processing only |
| Crop coordinates | JavaScript variables | During editing session |
| Processing settings | JavaScript variables | During editing session |

## What Never Leaves the Browser

- ✗ File contents (pixels, metadata, EXIF)
- ✗ Filenames
- ✗ File sizes
- ✗ Processing parameters
- ✗ Crop coordinates
- ✗ Any derivative of the uploaded file

## What May Leave the Browser

| Data | Destination | Purpose | Removable? |
|------|-------------|---------|------------|
| Page views | Analytics (if added) | Traffic measurement | Yes |
| Browser/OS info | Analytics (if added) | Device stats | Yes |
| Error logs | Error tracking (if added) | Bug fixing | Yes |

### Analytics Policy (Future)

If analytics are added:
- Use privacy-respecting analytics (e.g., Cloudflare Web Analytics — no cookies, no personal data)
- Never track filenames, file sizes, or any file metadata
- Never track which exam preset was selected
- Track only: page views, referrer, country, device type

## Cookies

MVP uses **zero cookies**. No session, no preferences, no tracking.

## Local Storage / IndexedDB

MVP uses **no persistent browser storage**. Every visit is a fresh start.

## Network Activity During Processing

During file processing, the browser makes **zero network requests**. This can be verified by:
1. Open DevTools → Network tab
2. Upload and process a file
3. Confirm: no requests to any server

## Third-Party Scripts

MVP loads **zero third-party scripts**. No analytics, no ads, no social widgets.

If third-party scripts are added later:
- Must be documented here
- Must not access file data
- Must be loaded with `async` or `defer`
- Must not block the main thread

## File Lifecycle

```
1. User selects file via <input type="file"> or drag-and-drop
2. File object exists in browser memory
3. createImageBitmap() decodes the file (browser memory)
4. Canvas draws the image (browser memory)
5. Processing happens on Canvas (browser memory)
6. canvas.toBlob() creates result (browser memory)
7. URL.createObjectURL() creates download link (browser memory)
8. User downloads via <a download> (file saved to device)
9. Old ObjectURLs are revoked to free memory
10. When user navigates away, all memory is freed
```

At no point does any file data cross a network boundary.

## GDPR / Data Protection

FormFix does not collect, store, or process personal data (in the GDPR sense) during file processing. No consent banner is needed for the core functionality.

If analytics are added, a minimal privacy notice will be required.

## Release-Blocking Requirement

**If any dependency sends file data to an external server, that dependency must be removed or replaced immediately.**

QA process: inspect Network tab during every file processing test. Any unexpected outbound request containing file data is a critical security issue.
