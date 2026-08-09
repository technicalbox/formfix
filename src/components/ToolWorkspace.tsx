import { useCallback, useEffect, useMemo, useState } from "react";

import { AdSlot } from "./AdSlot";
import { CropStage, type CropRect } from "./CropStage";
import { FileIntake } from "./FileIntake";
import { FilePlate } from "./FilePlate";
import { KbCounter, formatKb } from "./KbCounter";
import { Reveal } from "./Reveal";
import { SpecPlate } from "./SpecPlate";
import { StageRail } from "./StageRail";
import { useLocalImage } from "@/hooks/useLocalImage";
import {
  compressToSize,
  convertFormat,
  cropImage,
  downloadFile,
  getExtension,
  resizeImage,
  sanitizeFilename,
} from "@/lib/image-engine";
import { compressionTargets, presets, type Preset } from "@/lib/presets";

export type Op = "resize" | "crop" | "compress" | "convert";

const COPY: Record<Op, { n: string; label: string; verb: string; steps: { k: string; d: string }[] }> = {
  resize: {
    n: "01",
    label: "RESIZE",
    verb: "RESIZE FILE",
    steps: [
      { k: "INPUT", d: "Drop the photo or signature you need to resample." },
      { k: "DIMENSIONS", d: "Type exact pixels, or load them from an exam preset." },
      { k: "RESAMPLE", d: "High-quality Lanczos filtering runs on this device." },
      { k: "READY", d: "Download the resized file, or chain another tool." },
    ],
  },
  crop: {
    n: "02",
    label: "CROP",
    verb: "CROP FILE",
    steps: [
      { k: "INPUT", d: "Drop the file you want to reframe." },
      { k: "RATIO", d: "Lock the aspect ratio the form expects." },
      { k: "FRAME", d: "Drag the crop frame over the face or signature." },
      { k: "READY", d: "Cut it and download, exact to the pixel." },
    ],
  },
  compress: {
    n: "03",
    label: "COMPRESS",
    verb: "COMPRESS FILE",
    steps: [
      { k: "INPUT", d: "Drop the oversized file straight from your camera." },
      { k: "TARGET", d: "Set the kilobyte ceiling from your notification." },
      { k: "SEARCH", d: "Quality is searched downward until the file fits." },
      { k: "READY", d: "Download the smallest file that still looks right." },
    ],
  },
  convert: {
    n: "04",
    label: "CONVERT",
    verb: "CONVERT FILE",
    steps: [
      { k: "INPUT", d: "Drop a JPG, PNG or WEBP file." },
      { k: "FORMAT", d: "Choose the format the upload form insists on." },
      { k: "ENCODE", d: "Re-encoded locally with quality you control." },
      { k: "READY", d: "Download the converted file." },
    ],
  },
};

export function ToolWorkspace({
  op,
  defaultTargetKB,
  defaultPresetSlug,
}: {
  op: Op;
  defaultTargetKB?: number;
  defaultPresetSlug?: string;
}) {
  const { image, load, replace, reading, error, warnings, clear } = useLocalImage();
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [lock, setLock] = useState(true);
  const [ratioPreset, setRatioPreset] = useState<string>("free");
  const [rect, setRect] = useState<CropRect | null>(null);
  const [targetKB, setTargetKB] = useState(String(defaultTargetKB ?? 50));
  const [format, setFormat] = useState("image/jpeg");
  const [quality, setQuality] = useState(92);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [before, setBefore] = useState<{ sizeKB: number; dim: string } | null>(null);
  const [after, setAfter] = useState<{ sizeKB: number; dim: string } | null>(null);

  const copy = COPY[op];

  useEffect(() => {
    if (!defaultPresetSlug) return;
    const p = presets.find((x) => x.slug === defaultPresetSlug);
    if (p) applyPreset(p);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultPresetSlug]);

  useEffect(() => {
    if (image && !width && !height) {
      setWidth(String(image.meta.width));
      setHeight(String(image.meta.height));
    }
  }, [image, width, height]);

  const sourceRatio = image ? image.meta.width / image.meta.height : 1;

  const cropRatio = useMemo(() => {
    if (ratioPreset === "free") return null;
    const p = presets.find((x) => x.id === ratioPreset);
    const d = p?.requirements.dimensions;
    if (d?.width && d?.height) return d.width / d.height;
    return null;
  }, [ratioPreset]);

  const applyPreset = useCallback(
    (p: Preset) => {
      const d = p.requirements.dimensions;
      if (d.width) setWidth(String(d.width));
      if (d.height) setHeight(String(d.height));
      if (p.requirements.fileSize.max) setTargetKB(String(p.requirements.fileSize.max));
      if (p.requirements.format[0]) {
        setFormat(p.requirements.format[0] === "png" ? "image/png" : "image/jpeg");
      }
      setRatioPreset(p.id);
    },
    [],
  );

  const stage = !image ? 0 : busy ? 2 : after ? 3 : 1;

  const run = useCallback(async () => {
    if (!image) return;
    setBusy(true);
    setNote(null);
    setBefore({ sizeKB: image.meta.sizeKB, dim: `${image.meta.width} × ${image.meta.height} PX` });
    try {
      let out: Blob | null = null;
      if (op === "resize") {
        const w = Number(width);
        const h = Number(height);
        if (!w || !h) {
          setNote("Enter both a width and a height in pixels.");
          return;
        }
        out = (await resizeImage(image.file, w, h, { format, quality: quality / 100 })).blob;
      } else if (op === "crop") {
        if (!rect || rect.width < 2 || rect.height < 2) {
          setNote("Set a crop frame first.");
          return;
        }
        out = (await cropImage(image.file, rect, { format, quality: quality / 100 })).blob;
      } else if (op === "compress") {
        const kb = Number(targetKB);
        if (!kb) {
          setNote("Enter a kilobyte target.");
          return;
        }
        const res = await compressToSize(image.file, kb, { format });
        out = res.blob;
        if (!res.success) setNote(res.message);
      } else {
        out = (await convertFormat(image.file, format, quality / 100)).blob;
      }
      if (!out) return;
      const next = await replace(out, image.meta.name);
      setAfter({
        sizeKB: next.meta.sizeKB,
        dim: `${next.meta.width} × ${next.meta.height} PX`,
      });
      setWidth(String(next.meta.width));
      setHeight(String(next.meta.height));
    } catch {
      setNote("This transformation could not be completed in your browser.");
    } finally {
      setBusy(false);
    }
  }, [image, op, width, height, rect, targetKB, format, quality, replace]);

  const download = useCallback(() => {
    if (!image) return;
    downloadFile(
      image.file as Blob,
      `${sanitizeFilename(`formfix-${op}`)}.${getExtension(image.meta.format)}`,
    );
  }, [image, op]);

  return (
    <>
      <section className="relative overflow-hidden border-b border-rule">
        <div className="atmos pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />
        <div
          className="grid-paper pointer-events-none absolute inset-0 -z-10 opacity-50 [mask-image:radial-gradient(70%_55%_at_45%_30%,#000,transparent)]"
          aria-hidden="true"
        />
        <div className="mx-auto max-w-[1400px] px-5 pb-14 pt-12 md:px-8 md:pb-20 md:pt-16">
          <Reveal className="flex items-center gap-3">
            <span className="h-px w-8 bg-foreground/40" />
            <span className="tech text-muted-foreground">
              TOOL {copy.n} — {copy.label}
            </span>
          </Reveal>
          <Reveal as="h1" delay={80} blur className="display-lg mt-6 max-w-[18ch]">
            {op === "resize" && "Exact pixels, no guesswork."}
            {op === "crop" && "Frame it the way examiners expect."}
            {op === "compress" && "Hit the kilobyte, keep the face."}
            {op === "convert" && "The format the form insists on."}
          </Reveal>
          <Reveal delay={170} className="mt-6 max-w-[52ch] text-[15px] leading-relaxed text-muted-foreground md:text-[16.5px]">
            {op === "resize" &&
              "Resample any photo or signature to exact pixel dimensions with high-quality Lanczos filtering — entirely inside your browser."}
            {op === "crop" &&
              "Lock the aspect ratio your form requires, drag the crop frame over the subject and cut precisely, with nothing uploaded."}
            {op === "compress" &&
              "Set a kilobyte ceiling and FormFix searches quality downward until the file fits, without visibly damaging the photograph."}
            {op === "convert" &&
              "Move between JPG, PNG and WEBP with full control over encode quality. All conversion happens on this device."}
          </Reveal>
        </div>
      </section>

      <section className="border-b border-rule bg-card/60">
        <div className="mx-auto max-w-[1400px] px-5 py-12 md:px-8 md:py-14">
          <StageRail steps={copy.steps} active={stage} eyebrow={`${copy.label} SEQUENCE`} />
        </div>
      </section>

      <section className="border-b border-rule">
        <div className="mx-auto max-w-[1400px] px-5 py-14 md:px-8 md:py-20">
          {!image ? (
            <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
              <FileIntake
                onFile={load}
                reading={reading}
                error={error}
                warnings={warnings}
                label="DROP YOUR FILE"
              />
              <div className="mx-auto w-[70%] max-w-[240px] rotate-[-2deg]">
                <FilePlate
                  label={copy.label}
                  status="AWAITING FILE"
                  tone="pending"
                  dimensions="— × — PX"
                  format="—"
                  size="—"
                />
              </div>
            </div>
          ) : (
            <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
              {/* controls */}
              <div>
                <div className="tech text-muted-foreground">CONTROLS</div>

                {op === "resize" && (
                  <div className="mt-6 border border-rule bg-card p-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <NumField
                        label="WIDTH (PX)"
                        value={width}
                        onChange={(v) => {
                          setWidth(v);
                          if (lock && v) setHeight(String(Math.round(Number(v) / sourceRatio)));
                        }}
                      />
                      <NumField
                        label="HEIGHT (PX)"
                        value={height}
                        onChange={(v) => {
                          setHeight(v);
                          if (lock && v) setWidth(String(Math.round(Number(v) * sourceRatio)));
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setLock((v) => !v)}
                      aria-pressed={lock}
                      className={`tech-sm mt-6 inline-flex items-center gap-2 border px-3 py-2 transition-colors duration-300 ${
                        lock ? "border-primary text-primary" : "border-rule text-muted-foreground"
                      }`}
                    >
                      <span aria-hidden="true">{lock ? "▣" : "▢"}</span> KEEP ASPECT RATIO
                    </button>
                  </div>
                )}

                {op === "crop" && (
                  <div className="mt-6 border border-rule bg-card p-6">
                    <div className="tech-sm text-muted-foreground">ASPECT RATIO</div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Chip active={ratioPreset === "free"} onClick={() => setRatioPreset("free")}>
                        FREE
                      </Chip>
                      {presets
                        .filter((p) => p.requirements.dimensions.width && p.requirements.dimensions.height)
                        .slice(0, 6)
                        .map((p) => (
                          <Chip
                            key={p.id}
                            active={ratioPreset === p.id}
                            onClick={() => setRatioPreset(p.id)}
                          >
                            {p.requirements.dimensions.width}:{p.requirements.dimensions.height}
                          </Chip>
                        ))}
                    </div>
                    <div className="mt-7">
                      <CropStage
                        url={image.url}
                        naturalWidth={image.meta.width}
                        naturalHeight={image.meta.height}
                        ratio={cropRatio}
                        onChange={setRect}
                      />
                    </div>
                  </div>
                )}

                {op === "compress" && (
                  <div className="mt-6 border border-rule bg-card p-6">
                    <NumField label="TARGET SIZE (KB)" value={targetKB} onChange={setTargetKB} />
                    <div className="mt-6 flex flex-wrap gap-2">
                      {compressionTargets.map((t) => (
                        <Chip
                          key={t.slug}
                          active={targetKB === String(t.targetKB)}
                          onClick={() => setTargetKB(String(t.targetKB))}
                        >
                          ≤ {t.targetKB} KB
                        </Chip>
                      ))}
                    </div>
                    <p className="mt-6 max-w-[42ch] text-[12.5px] leading-relaxed text-muted-foreground">
                      Quality is searched downward in steps until the encoded file lands under the
                      ceiling. Dimensions are preserved.
                    </p>
                  </div>
                )}

                {op === "convert" && (
                  <div className="mt-6 border border-rule bg-card p-6">
                    <div className="tech-sm text-muted-foreground">OUTPUT FORMAT</div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {[
                        ["image/jpeg", "JPG"],
                        ["image/png", "PNG"],
                        ["image/webp", "WEBP"],
                      ].map(([mime, label]) => (
                        <Chip key={mime} active={format === mime} onClick={() => setFormat(mime!)}>
                          {label}
                        </Chip>
                      ))}
                    </div>
                  </div>
                )}

                {op !== "compress" && (
                  <div className="mt-6 border border-rule bg-card p-6">
                    <div className="flex items-baseline justify-between">
                      <label className="tech-sm text-muted-foreground" htmlFor="q">
                        ENCODE QUALITY
                      </label>
                      <span className="font-mono text-[12.5px]">{quality}</span>
                    </div>
                    <input
                      id="q"
                      type="range"
                      min={40}
                      max={100}
                      value={quality}
                      onChange={(e) => setQuality(Number(e.target.value))}
                      className="mt-4 h-1 w-full appearance-none bg-rule accent-primary"
                    />
                  </div>
                )}

                {/* exam presets */}
                <div className="mt-6 border border-rule bg-card p-6">
                  <div className="tech-sm text-muted-foreground">LOAD FROM EXAM PRESET</div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {presets.slice(0, 8).map((p) => (
                      <Chip key={p.id} active={false} onClick={() => applyPreset(p)}>
                        {p.exam.split(" ")[0]} {p.type.toUpperCase()}
                      </Chip>
                    ))}
                  </div>
                </div>

                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={run}
                    disabled={busy}
                    className="tech group inline-flex items-center gap-3 bg-foreground px-6 py-4 text-background transition-transform duration-300 hover:-translate-y-[2px] disabled:opacity-60"
                  >
                    {busy ? "WORKING…" : copy.verb}
                    <span
                      className="transition-transform duration-300 group-hover:translate-x-1"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={download}
                    className="tech inline-flex items-center gap-3 border border-foreground px-6 py-4 transition-colors duration-300 hover:bg-foreground hover:text-background"
                  >
                    DOWNLOAD
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      clear();
                      setAfter(null);
                      setBefore(null);
                      setWidth("");
                      setHeight("");
                    }}
                    className="tech text-muted-foreground transition-colors hover:text-foreground"
                  >
                    CLEAR
                  </button>
                </div>

                {note && (
                  <p className="mt-5 border-l-2 border-signal pl-3 text-[13px] leading-relaxed text-muted-foreground">
                    {note}
                  </p>
                )}
              </div>

              {/* plate + readout */}
              <div className="lg:sticky lg:top-24 lg:self-start">
                <div className="tech text-muted-foreground">FIG. 01 — WORKING FILE</div>
                <div className="mt-6 grid gap-8 sm:grid-cols-[minmax(0,280px)_1fr]">
                  <SpecPlate
                    url={image.url}
                    ratio={image.meta.width / image.meta.height}
                    label={copy.label}
                    dimensions={`${image.meta.width} × ${image.meta.height} PX`}
                    format={image.meta.format.replace("image/", "").toUpperCase()}
                    size={formatKb(image.meta.sizeKB)}
                    status={after ? "TRANSFORMED" : null}
                    tone={after ? "verify" : "pending"}
                  />

                  <dl className="grid content-start gap-3">
                    {[
                      ["FILE", image.meta.name],
                      ["DIMENSIONS", `${image.meta.width} × ${image.meta.height} PX`],
                      ["FORMAT", image.meta.format.replace("image/", "").toUpperCase()],
                      ["SIZE", formatKb(image.meta.sizeKB)],
                      ["RATIO", (image.meta.width / image.meta.height).toFixed(2)],
                    ].map(([k, v]) => (
                      <div
                        key={k}
                        className="flex items-baseline justify-between gap-4 border-b border-rule/60 pb-2"
                      >
                        <dt className="tech-sm text-muted-foreground">{k}</dt>
                        <dd className="max-w-[18ch] truncate font-mono text-[12.5px]">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                {before && after && (
                  <div className="mt-8 border border-rule bg-card p-5">
                    <div className="tech-sm text-muted-foreground">TRANSFORM RESULT</div>
                    <div className="mt-4 flex items-end justify-between gap-6">
                      <div>
                        <div className="tech-sm text-muted-foreground">BEFORE</div>
                        <div className="mt-2 font-mono text-[13px] text-muted-foreground line-through">
                          {before.dim} · {formatKb(before.sizeKB)}
                        </div>
                      </div>
                      <span className="tech-sm text-muted-foreground" aria-hidden="true">
                        →
                      </span>
                      <div className="text-right">
                        <div className="tech-sm text-verify">AFTER</div>
                        <div className="mt-2 font-mono text-[13px]">{after.dim}</div>
                        <KbCounter value={after.sizeKB} className="mt-1 block text-xl" />
                      </div>
                    </div>
                  </div>
                )}

                <p className="mt-7 max-w-[44ch] text-[13px] leading-relaxed text-muted-foreground">
                  Chain tools freely — the result stays in this browser tab, so you can crop, resize
                  and compress before downloading once at the end.{" "}
                  <a href="/check-image" className="link-underline text-foreground">
                    Verify it against your exam
                  </a>
                  .
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      <AdSlot slotId={`tool-${op}`} format="horizontal" className="py-12" />
    </>
  );
}

function NumField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const id = label.toLowerCase().replace(/[^a-z]+/g, "-");
  return (
    <div>
      <label className="tech-sm block text-muted-foreground" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, ""))}
        className="mt-3 w-full border-b border-rule bg-transparent pb-2 font-mono text-[16px] focus:border-primary focus:outline-none"
      />
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`tech-sm border px-3 py-2 transition-colors duration-300 ${
        active
          ? "border-primary bg-accent/50 text-primary"
          : "border-rule text-muted-foreground hover:border-foreground/30 hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
