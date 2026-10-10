# FormFix

FormFix is a free, browser-based toolkit for preparing photos and signatures for online application forms, including exam and recruitment applications.

**Live site:** https://www.formfix.me

## Features

- Resize images to exact pixel dimensions.
- Crop images to a target aspect ratio.
- Compress images toward a required file-size limit.
- Convert supported image formats (JPEG, PNG, and WebP).
- Validate images against exam presets or custom requirements.
- Process image contents locally in the browser rather than uploading them to a FormFix processing server.

Presets are guidance only. Always confirm current requirements in the official notification or application portal before submitting a file.

## Technology

- React 19 and TypeScript
- TanStack Start and TanStack Router
- Vite
- Tailwind CSS
- Canvas API and Pica for image processing
- Cropper.js for crop interactions

## Requirements

- Node.js 22 or newer
- npm

## Run locally

```bash
git clone https://github.com/technicalbox/formfix.git
cd formfix
npm ci
npm run dev
```

The development server prints its local URL in the terminal.

## Production build

```bash
npm run build
npm run preview
```

The build generates the sitemap from `src/data/presets.json` and builds the application. Review the production preview and generated sitemap before deployment.

## Project structure

```text
src/
  components/  Product UI and reusable components
  data/        Exam presets and compression targets
  hooks/       Browser-local image and UI hooks
  lib/         Image engine, validation, and utilities
  routes/      Homepage, tools, preset pages, and trust pages
  styles.css   Global styles and design tokens
scripts/       Build-time sitemap generation
public/        Static assets, robots.txt, and sitemap files
```

## Privacy

Image intake, validation, preview, transformations, and downloads are implemented in the browser. Do not introduce upload-based image processing or send image contents, filenames, or image metadata to third-party services. Re-check network requests whenever analytics, error reporting, or dependencies change.

## Preset data

Application requirements may change between notifications. Keep source references and verification notes alongside preset data, and remind users to confirm the latest official requirements before submission.

## Quality checks

```bash
npm run lint
npm run build
```

GitHub Actions runs the production build on pushes and pull requests to `main`.

## License

See [LICENSE](./LICENSE).

## Disclaimer

FormFix is an independent utility and is not affiliated with government departments, examination bodies, or recruitment portals. Users are responsible for checking current official requirements before submitting files.
