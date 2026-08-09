import { useCallback, useEffect, useRef, useState } from "react";

import {
  createPreviewURL,
  getImageMetadata,
  validateFile,
  type ImageMeta,
} from "@/lib/image-engine";

export type LoadedImage = {
  file: File | Blob;
  meta: ImageMeta;
  url: string;
};

/**
 * Browser-local file intake.
 * Reads, validates and measures a file entirely on the device — nothing is
 * ever uploaded. Object URLs are revoked as soon as they are replaced.
 */
export function useLocalImage() {
  const [image, setImage] = useState<LoadedImage | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [reading, setReading] = useState(false);
  const urls = useRef<string[]>([]);

  const track = useCallback((url: string) => {
    urls.current.push(url);
    return url;
  }, []);

  useEffect(
    () => () => {
      urls.current.forEach((u) => URL.revokeObjectURL(u));
      urls.current = [];
    },
    [],
  );

  const load = useCallback(
    async (file: File) => {
      setReading(true);
      setError(null);
      setWarnings([]);
      try {
        const check = await validateFile(file);
        if (!check.valid) {
          setError(check.errors[0] ?? "This file could not be read.");
          setImage(null);
          return null;
        }
        const meta = await getImageMetadata(file);
        const url = track(createPreviewURL(file));
        const next: LoadedImage = { file, meta, url };
        setWarnings(check.warnings);
        setImage(next);
        return next;
      } catch {
        setError("This file could not be decoded in your browser.");
        setImage(null);
        return null;
      } finally {
        setReading(false);
      }
    },
    [track],
  );

  /** Replace the working file with a processed blob, keeping the same session. */
  const replace = useCallback(
    async (blob: Blob, name: string) => {
      const meta = await getImageMetadata(blob);
      const url = track(createPreviewURL(blob));
      const next: LoadedImage = { file: blob, meta: { ...meta, name }, url };
      setImage(next);
      return next;
    },
    [track],
  );

  const clear = useCallback(() => {
    setImage(null);
    setError(null);
    setWarnings([]);
  }, []);

  return { image, warnings, error, reading, load, replace, clear, setError };
}
