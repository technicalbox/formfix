/** Type surface for the requirement validator (src/lib/validator.js). */

export type CheckStatus = "PASS" | "FAIL" | "WARNING";

export type FixActionType = "crop" | "resize" | "convert" | "compress";

export type DiagnosticCheck = {
  id: string;
  status: CheckStatus;
  pass: boolean;
  label: string;
  expected: string;
  actual: string;
  explanation?: string;
  fixAction?: FixActionType | null;
  fixParams?: Record<string, number | string> | null;
};

export type DetailedValidation = {
  allPass: boolean;
  failCount: number;
  warningCount: number;
  checks: DiagnosticCheck[];
  summary: string;
  canAutoFix: boolean;
};

export type FileInfo = {
  width: number;
  height: number;
  sizeKB: number;
  format: string;
  name?: string;
};

export type Requirements = {
  format?: string[];
  dimensions?: {
    width?: number | null;
    height?: number | null;
    minWidth?: number | null;
    minHeight?: number | null;
    maxWidth?: number | null;
    maxHeight?: number | null;
    aspectRatio?: string | null;
  };
  fileSize?: { min?: number | null; max?: number | null; unit?: string };
};

export type PlannedFix = {
  type: FixActionType;
  label: string;
  params: {
    width?: number;
    height?: number;
    format?: string;
    targetFormat?: string;
    targetKB?: number;
    maxWidth?: number;
    maxHeight?: number;
  };
};

export function validateImageDetailed(
  fileInfo: FileInfo,
  requirements?: Requirements,
): DetailedValidation;

export function planFixSequence(
  validation: DetailedValidation,
  requirements: Requirements,
): PlannedFix[];

export function validateAgainstPreset(
  fileInfo: FileInfo,
  requirements: Requirements,
): {
  allPass: boolean;
  results: { pass: boolean; label: string; expected: string; actual: string }[];
  summary: string;
};
