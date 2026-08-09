/**
 * FormFix Image Processing Engine
 *
 * All processing happens in the browser via Canvas API + Pica.
 * No files are ever uploaded to any server.
 *
 * @module image-engine
 */

/** @type {import('pica') | null} */
let picaInstance = null;

/**
 * Lazy-load Pica for high-quality resize.
 * Only imported when first resize is requested.
 * @returns {Promise<import('pica')>}
 */
async function getPica() {
  if (!picaInstance) {
    const Pica = (await import('pica')).default;
    picaInstance = new Pica();
  }
  return picaInstance;
}

/**
 * Allowed MIME types and their magic byte signatures.
 */
const ALLOWED_TYPES = {
  'image/jpeg': { extensions: ['jpg', 'jpeg'], magic: [0xFF, 0xD8, 0xFF] },
  'image/png':  { extensions: ['png'],        magic: [0x89, 0x50, 0x4E, 0x47] },
  'image/webp': { extensions: ['webp'],       magic: [0x52, 0x49, 0x46, 0x46] }, // RIFF header
};

const MAX_FILE_SIZE = 25 * 1024 * 1024;  // 25 MB
const MAX_DIMENSION = 10000;
const WARN_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

/**
 * Validate a file before processing.
 * Checks MIME type, magic bytes, file size, and dimensions.
 *
 * @param {File} file
 * @returns {Promise<{valid: boolean, warnings: string[], errors: string[], metadata: object}>}
 */
export async function validateFile(file) {
  const errors = [];
  const warnings = [];
  const metadata = { name: file.name, size: file.size, type: file.type };

  // Check MIME type
  if (!ALLOWED_TYPES[file.type]) {
    errors.push(`Unsupported file type: ${file.type || 'unknown'}. Please upload a JPG, PNG, or WebP image.`);
    return { valid: false, errors, warnings, metadata };
  }

  // Check file size
  if (file.size === 0) {
    errors.push('File is empty (0 bytes). Please upload a valid image.');
    return { valid: false, errors, warnings, metadata };
  }

  if (file.size > MAX_FILE_SIZE) {
    errors.push(`File is too large (${formatBytes(file.size)}). Maximum supported size is 25 MB.`);
    return { valid: false, errors, warnings, metadata };
  }

  if (file.size > WARN_FILE_SIZE) {
    warnings.push(`Large file (${formatBytes(file.size)}). Processing may take longer on mobile devices.`);
  }

  // Check magic bytes
  try {
    const header = new Uint8Array(await file.slice(0, 8).arrayBuffer());
    const expectedMagic = ALLOWED_TYPES[file.type].magic;
    const magicMatch = expectedMagic.every((byte, i) => header[i] === byte);

    if (!magicMatch) {
      errors.push('File header does not match its extension. The file may be corrupted or misnamed.');
      return { valid: false, errors, warnings, metadata };
    }
  } catch {
    errors.push('Could not read file. It may be corrupted.');
    return { valid: false, errors, warnings, metadata };
  }

  // Decode image to check dimensions
  try {
    const bitmap = await createImageBitmap(file);
    metadata.width = bitmap.width;
    metadata.height = bitmap.height;
    bitmap.close();

    if (bitmap.width > MAX_DIMENSION || bitmap.height > MAX_DIMENSION) {
      warnings.push(`Very large image (${bitmap.width}×${bitmap.height}). This may use significant memory.`);
    }
  } catch {
    errors.push('Could not decode image. The file may be corrupted or in an unsupported format.');
    return { valid: false, errors, warnings, metadata };
  }

  return { valid: true, errors, warnings, metadata };
}

/**
 * Resize an image to exact dimensions using Pica for high quality.
 *
 * @param {File|Blob} file - Source image
 * @param {number} targetWidth - Target width in pixels
 * @param {number} targetHeight - Target height in pixels
 * @param {object} [options]
 * @param {string} [options.format='image/jpeg'] - Output format
 * @param {number} [options.quality=0.92] - Output quality (0–1)
 * @returns {Promise<{blob: Blob, width: number, height: number}>}
 */
export async function resizeImage(file, targetWidth, targetHeight, options = {}) {
  const { format = 'image/jpeg', quality = 0.92 } = options;

  const bitmap = await createImageBitmap(file);
  const srcCanvas = document.createElement('canvas');
  srcCanvas.width = bitmap.width;
  srcCanvas.height = bitmap.height;
  const srcCtx = srcCanvas.getContext('2d');
  srcCtx.drawImage(bitmap, 0, 0);
  bitmap.close();

  const destCanvas = document.createElement('canvas');
  destCanvas.width = targetWidth;
  destCanvas.height = targetHeight;

  const pica = await getPica();
  await pica.resize(srcCanvas, destCanvas, { quality: 3 });

  const blob = await canvasToBlob(destCanvas, format, quality);

  // Clean up
  srcCanvas.width = 0;
  srcCanvas.height = 0;
  destCanvas.width = 0;
  destCanvas.height = 0;

  return { blob, width: targetWidth, height: targetHeight };
}

/**
 * Crop an image to specified coordinates.
 *
 * @param {File|Blob} file - Source image
 * @param {object} cropData
 * @param {number} cropData.x - Crop X offset
 * @param {number} cropData.y - Crop Y offset
 * @param {number} cropData.width - Crop width
 * @param {number} cropData.height - Crop height
 * @param {object} [options]
 * @param {string} [options.format='image/jpeg']
 * @param {number} [options.quality=0.92]
 * @returns {Promise<{blob: Blob, width: number, height: number}>}
 */
export async function cropImage(file, cropData, options = {}) {
  const { format = 'image/jpeg', quality = 0.92 } = options;

  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(cropData.width);
  canvas.height = Math.round(cropData.height);
  const ctx = canvas.getContext('2d');

  ctx.drawImage(
    bitmap,
    Math.round(cropData.x), Math.round(cropData.y),
    Math.round(cropData.width), Math.round(cropData.height),
    0, 0,
    Math.round(cropData.width), Math.round(cropData.height)
  );
  bitmap.close();

  const blob = await canvasToBlob(canvas, format, quality);

  canvas.width = 0;
  canvas.height = 0;

  return { blob, width: Math.round(cropData.width), height: Math.round(cropData.height) };
}

/**
 * Compress an image to ≤ targetKB using binary search on quality.
 * Up to 8 iterations. If impossible, returns the smallest achievable size
 * with an explanation.
 *
 * @param {File|Blob} file - Source image
 * @param {number} targetKB - Maximum file size in KB
 * @param {object} [options]
 * @param {string} [options.format='image/jpeg']
 * @param {number} [options.maxWidth] - Optional max width for pre-resize
 * @param {number} [options.maxHeight] - Optional max height for pre-resize
 * @param {function} [options.onProgress] - Progress callback (iteration, total, currentSizeKB)
 * @returns {Promise<{blob: Blob, sizeKB: number, quality: number, success: boolean, message: string, width: number, height: number}>}
 */
export async function compressToSize(file, targetKB, options = {}) {
  const {
    format = 'image/jpeg',
    maxWidth,
    maxHeight,
    onProgress,
  } = options;

  const targetBytes = targetKB * 1024;
  const bitmap = await createImageBitmap(file);

  let width = bitmap.width;
  let height = bitmap.height;

  // Optional pre-resize
  if (maxWidth && width > maxWidth) {
    const scale = maxWidth / width;
    width = maxWidth;
    height = Math.round(height * scale);
  }
  if (maxHeight && height > maxHeight) {
    const scale = maxHeight / height;
    height = maxHeight;
    width = Math.round(width * scale);
  }

  let canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  if (width !== bitmap.width || height !== bitmap.height) {
    // Need to resize first
    const srcCanvas = document.createElement('canvas');
    srcCanvas.width = bitmap.width;
    srcCanvas.height = bitmap.height;
    srcCanvas.getContext('2d').drawImage(bitmap, 0, 0);
    bitmap.close();

    const pica = await getPica();
    await pica.resize(srcCanvas, canvas, { quality: 3 });

    srcCanvas.width = 0;
    srcCanvas.height = 0;
  } else {
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bitmap, 0, 0);
    bitmap.close();
  }

  // Binary search on quality
  let lo = 0.05;
  let hi = 0.95;
  let bestBlob = null;
  let bestQuality = lo;
  const iterations = 8;

  for (let i = 0; i < iterations; i++) {
    const mid = (lo + hi) / 2;
    const blob = await canvasToBlob(canvas, format, mid);

    if (onProgress) {
      onProgress(i + 1, iterations, blob.size / 1024);
    }

    if (blob.size <= targetBytes) {
      bestBlob = blob;
      bestQuality = mid;
      lo = mid; // Try higher quality
    } else {
      hi = mid; // Reduce quality
    }
  }

  // If we never fit, take the lowest quality result
  if (!bestBlob) {
    bestBlob = await canvasToBlob(canvas, format, 0.05);
    bestQuality = 0.05;
  }

  const sizeKB = Math.round((bestBlob.size / 1024) * 10) / 10;
  const success = bestBlob.size <= targetBytes;

  let message;
  if (success) {
    message = `Compressed to ${sizeKB} KB (≤ ${targetKB} KB target).`;
  } else {
    message = `Could not compress to ≤ ${targetKB} KB at current dimensions (${width}×${height}). Smallest achievable: ${sizeKB} KB. Try reducing dimensions first.`;
  }

  canvas.width = 0;
  canvas.height = 0;

  return { blob: bestBlob, sizeKB, quality: bestQuality, success, message, width, height };
}

/**
 * Convert an image to a different format.
 *
 * @param {File|Blob} file
 * @param {string} targetFormat - 'image/jpeg', 'image/png', or 'image/webp'
 * @param {number} [quality=0.92]
 * @returns {Promise<{blob: Blob, format: string, sizeKB: number}>}
 */
export async function convertFormat(file, targetFormat, quality = 0.92) {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext('2d');

  // For JPEG, fill white background (no alpha channel)
  if (targetFormat === 'image/jpeg') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();

  const blob = await canvasToBlob(canvas, targetFormat, quality);

  canvas.width = 0;
  canvas.height = 0;

  return {
    blob,
    format: targetFormat,
    sizeKB: Math.round((blob.size / 1024) * 10) / 10,
  };
}

/**
 * Get image metadata without processing.
 *
 * @param {File} file
 * @returns {Promise<{width: number, height: number, sizeKB: number, format: string, name: string}>}
 */
export async function getImageMetadata(file) {
  const bitmap = await createImageBitmap(file);
  const metadata = {
    width: bitmap.width,
    height: bitmap.height,
    sizeKB: Math.round((file.size / 1024) * 10) / 10,
    format: file.type,
    name: file.name,
  };
  bitmap.close();
  return metadata;
}

/**
 * Create a preview URL for an image.
 * Remember to revoke with URL.revokeObjectURL when done.
 *
 * @param {File|Blob} file
 * @returns {string} Object URL for use in <img> src
 */
export function createPreviewURL(file) {
  return URL.createObjectURL(file);
}

/**
 * Trigger a file download.
 *
 * @param {Blob} blob
 * @param {string} filename
 */
export function downloadFile(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = sanitizeFilename(filename);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * canvas.toBlob() wrapped as a Promise.
 * @param {HTMLCanvasElement} canvas
 * @param {string} format
 * @param {number} quality
 * @returns {Promise<Blob>}
 */
function canvasToBlob(canvas, format, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('canvas.toBlob returned null'));
      },
      format,
      quality
    );
  });
}

/**
 * Format bytes to human-readable string.
 * @param {number} bytes
 * @returns {string}
 */
export function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Sanitize a filename for download.
 * @param {string} name
 * @returns {string}
 */
export function sanitizeFilename(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_');
}

/**
 * Get file extension from MIME type.
 * @param {string} mimeType
 * @returns {string}
 */
export function getExtension(mimeType) {
  const map = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
  };
  return map[mimeType] || 'jpg';
}
