import presetData from "@/data/presets.json";

export type Preset = {
  id: string;
  exam: string;
  organization: string;
  type: string;
  displayName: string;
  description: string;
  requirements: {
    format: string[];
    dimensions: {
      width: number | null;
      height: number | null;
      minWidth: number | null;
      minHeight: number | null;
      maxWidth: number | null;
      maxHeight: number | null;
      aspectRatio: string | null;
    };
    fileSize: { min: number | null; max: number | null; unit: string };
  };
  guidelines: string[];
  source: {
    url: string;
    document: string;
    verifiedDate: string;
    notificationYear: string;
    status: string;
  };
  notes?: string;
  slug: string;
  relatedPresets?: string[];
};

export type CompressionTarget = {
  targetKB: number;
  slug: string;
  title: string;
  description: string;
  commonUses: string[];
  searchDemand?: string;
};

export const presets = presetData.presets as unknown as Preset[];
export const compressionTargets = presetData.compressionTargets as unknown as CompressionTarget[];

export function getPresetBySlug(slug: string) {
  return presets.find((p) => p.slug === slug);
}

export function getCompressionTargetBySlug(slug: string) {
  return compressionTargets.find((t) => t.slug === slug);
}

/** Short technical dimension label, e.g. "200 × 230 PX" or "MAX 3.5 × 4.5 CM". */
export function dimensionLabel(p: Preset) {
  const d = p.requirements.dimensions;
  if (d.width && d.height) return `${d.width} × ${d.height} PX`;
  if (d.minWidth && d.minHeight) return `MIN ${d.minWidth} × ${d.minHeight} PX`;
  if (d.maxWidth && d.maxHeight) return `MAX ${d.maxWidth} × ${d.maxHeight} PX`;
  if (d.aspectRatio) return `RATIO ${d.aspectRatio}`;
  return "AS PER NOTIFICATION";
}

export function sizeLabel(p: Preset) {
  const s = p.requirements.fileSize;
  if (s.min && s.max) return `${s.min}–${s.max} ${s.unit}`;
  if (s.max) return `≤ ${s.max} ${s.unit}`;
  if (s.min) return `≥ ${s.min} ${s.unit}`;
  return "—";
}

export function formatLabel(p: Preset) {
  return p.requirements.format.map((f) => f.toUpperCase()).join(" / ");
}

/** Exam groups in the order shown on the requirement wall. */
export function presetGroups() {
  const order = ["IBPS PO / Clerk", "SSC CGL / CHSL / GD", "UPSC CSE", "NEET UG", "JEE Main", "RRB (Railway)"];
  return order
    .map((exam) => ({ exam, items: presets.filter((p) => p.exam === exam) }))
    .filter((g) => g.items.length > 0);
}
