/** Type surface for the browser-local image engine (src/lib/image-engine.js). */

export type ImageMeta = {
  width: number;
  height: number;
  sizeKB: number;
  format: string;
  name: string;
};

export function validateFile(file: File): Promise<{
  valid: boolean;
  warnings: string[];
  errors: string[];
  metadata: { name: string; size: number; type: string; width?: number; height?: number };
}>;

export function resizeImage(
  file: File | Blob,
  targetWidth: number,
  targetHeight: number,
  options?: { format?: string; quality?: number },
): Promise<{ blob: Blob; width: number; height: number }>;

export function cropImage(
  file: File | Blob,
  cropData: { x: number; y: number; width: number; height: number },
  options?: { format?: string; quality?: number },
): Promise<{ blob: Blob; width: number; height: number }>;

export function compressToSize(
  file: File | Blob,
  targetKB: number,
  options?: {
    format?: string;
    maxWidth?: number;
    maxHeight?: number;
    onProgress?: (iteration: number, total: number, currentSizeKB: number) => void;
  },
): Promise<{
  blob: Blob;
  sizeKB: number;
  quality: number;
  success: boolean;
  message: string;
  width: number;
  height: number;
}>;

export function convertFormat(
  file: File | Blob,
  targetFormat: string,
  quality?: number,
): Promise<{ blob: Blob; format: string; sizeKB: number }>;

export function getImageMetadata(file: File | Blob): Promise<ImageMeta>;
export function createPreviewURL(file: File | Blob): string;
export function downloadFile(blob: Blob, filename: string): void;
export function formatBytes(bytes: number): string;
export function sanitizeFilename(name: string): string;
export function getExtension(mimeType: string): string;
