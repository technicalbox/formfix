import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react";

import { FileIntake } from "./FileIntake";
import { FilePlate } from "./FilePlate";
import { KbCounter, formatKb } from "./KbCounter";
import { PresetPicker } from "./PresetPicker";
import { Reveal } from "./Reveal";
import { SpecPlate } from "./SpecPlate";
import { StageRail } from "./StageRail";
import { ValidationReport } from "./ValidationReport";
import { useLocalImage } from "@/hooks/useLocalImage";
import { useWebGLStage } from "@/hooks/useWebGLStage";
import {
  compressToSize,
  convertFormat,
  downloadFile,
  getExtension,
  resizeImage,
  sanitizeFilename,
} from "@/lib/image-engine";
import {
  dimensionLabel,
  formatLabel,
  getPresetBySlug,
  sizeLabel,
  type Preset,
} from "@/lib/presets";
import { planFixSequence, validateImageDetailed, type Requirements } from "@/lib/validator";

const InspectScene = lazy(() => import("./InspectScene"));

const STEPS = [
  { k: "TARGET", d: "Pick the exam, or type the numbers from your own notification." },
  { k: "FILE", d: "Drop the photo or signature. It is read on this device only." },
  { k: "REPORT", d: "Every requirement measured line by line against the target." },
  { k: "READY", d: "Apply the fix in-browser and download a file that gets accepted." },
];

type Custom = { width: string; height: string; maxKB: string; format: string };

const EMPTY_CUSTOM: Custom = { width: "", height: "", maxKB: "", format: "jpg" };

function customRequirements(c: Custom): Requirements {
  const w = Number(c.width) || null;
  const h = Number(c.height) || null;
  const kb = Number(c.maxKB) || null;
  return {
    format: [c.format],
    dimensions: {
      width: w,
      height: h,
      minWidth: null,
      minHeight: null,
      maxWidth: null,
      maxHeight: null,
      aspectRatio: null,
    },
    fileSize: { min: null, max: kb, unit: "KB" },
  };
}

export function CheckWorkspace({ initialPresetSlug }: { initialPresetSlug?: string }) {
  const initial = initialPresetSlug ? getPresetBySlug(initialPresetSlug) : undefined;
  const [mode, setMode] = useState<"preset" | "custom">("preset");
  const [preset, setPreset] = useState<Preset | null>(initial ?? null);
  const [custom, setCustom] = useState<Custom>(EMPTY_CUSTOM);
  const { image, load, replace, reading, error, warnings, clear } = useLocalImage();
  const [fixing, setFixing] = useState(false);
  const [fixNote, setFixNote] = useState<string | null>(null);
  const [fixed, setFixed] = useState<{ blob: Blob; sizeKB: number; width: number; height: number } | null>(
    null,
  );
  const [origin, setOrigin] = useState<{ sizeKB: number; dim: string } | null>(null);
  const webgl = useWebGLStage();

  const requirements: Requirements | null = useMemo(() => {
    if (mode === "custom") {
      const r = customRequirements(custom);
      const hasAny =
        !!r.dimensions?.width || !!r.dimensions?.height || !!r.fileSize?.max;
      return hasAny ? r : null;
    }
    return preset ? (preset.requirements as Requirements) : null;
  }, [mode, preset, custom]);

  const targetName =
    mode === "custom"
      ? "CUSTOM REQUIREMENT"
      : preset
        ? `${preset.exam} · ${preset.type}`
        : "NO TARGET SELECTED";

  const validation = useMemo(() => {
    if (!image || !requirements) return null;
    return validateImageDetailed(
      {
        width: image.meta.width,
        height: image.meta.height,
        sizeKB: image.meta.sizeKB,
        format: image.meta.format,
        name: image.meta.name,
      },
      requirements,
    );
  }, [image, requirements]);

  const stage = !requirements ? 0 : !image ? 1 : validation?.allPass ? 3 : 2;

  const verdict: "pass" | "fail" | "pending" = validation
    ? validation.allPass
      ? "pass"
      : "fail"
    : "pending";

  useEffect(() => {
    setFixed(null);
    setFixNote(null);
  }, [image, requirements]);

  const runFix = useCallback(async () => {
    if (!image || !requirements || !validation) return;
    const actions = planFixSequence(validation, requirements);
    if (actions.length === 0) return;
    setFixing(true);
    setOrigin({ sizeKB: image.meta.sizeKB, dim: `${image.meta.width} × ${image.meta.height} PX` });
    try {
      let current: Blob = image.file;
      for (const action of actions) {
        setFixNote(action.label);
        if (action.type === "resize" && action.params.width && action.params.height) {
          const out = await resizeImage(current, action.params.width, action.params.height, {
            ...(action.params.format ? { format: action.params.format } : {}),
          });
          current = out.blob;
        } else if (action.type === "convert" && action.params.targetFormat) {
          current = (await convertFormat(current, action.params.targetFormat)).blob;
        } else if (action.type === "compress" && action.params.targetKB) {
          const out = await compressToSize(current, action.params.targetKB, {
            ...(action.params.format ? { format: action.params.format } : {}),
            ...(action.params.maxWidth ? { maxWidth: action.params.maxWidth } : {}),
            ...(action.params.maxHeight ? { maxHeight: action.params.maxHeight } : {}),
          });
          current = out.blob;
        }
      }
      const next = await replace(current, image.meta.name);
      setFixed({
        blob: current,
        sizeKB: next.meta.sizeKB,
        width: next.meta.width,
        height: next.meta.height,
      });
      setFixNote(null);
    } catch {
      setFixNote("The fix could not be completed in this browser. Try a smaller source file.");
    } finally {
      setFixing(false);
    }
  }, [image, requirements, validation, replace]);

  const download = useCallback(() => {
    if (!image) return;
    const ext = getExtension(image.meta.format);
    const base = sanitizeFilename(
      (mode === "custom" ? "formfix-custom" : `formfix-${preset?.id ?? "file"}`) as string,
    );
    downloadFile(image.file as Blob, `${base}.${ext}`);
  }, [image, mode, preset]);

  const ratio = image ? image.meta.width / image.meta.height : 200 / 230;

  return (
    <>
      {/* ── STAGE 00 · the intake bench ─────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-rule">
        <div className="atmos pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />
        <div
          className="grid-paper pointer-events-none absolute inset-0 -z-10 opacity-[0.5] [mask-image:radial-gradient(75%_60%_at_50%_35%,#000,transparent)]"
          aria-hidden="true"
        />

        <div className="mx-auto max-w-[1400px] px-5 pb-16 pt-12 md:px-8 md:pb-24 md:pt-20">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <Reveal className="flex items-center gap-3">
                <span className="h-px w-8 bg-foreground/40" />
                <span className="tech text-muted-foreground">DIAGNOSTIC BENCH</span>
              </Reveal>

              <Reveal as="h1" delay={90} blur className="display-lg mt-6 max-w-[17ch]">
                Know it will be accepted{" "}
                <span className="relative inline-block">
                  before
                  <span
                    className="absolute -bottom-1 left-0 h-[3px] w-full bg-primary/70"
                    aria-hidden="true"
                  />
                </span>{" "}
                you upload it.
              </Reveal>

              <Reveal
                delay={200}
                className="mt-6 max-w-[48ch] text-[15px] leading-relaxed text-muted-foreground md:text-[16.5px]"
              >
                Choose the requirement, drop the file, and every line of the notification is
                measured — format, dimensions, aspect ratio and kilobytes. If something fails, the
                fix runs here in your browser and the file is ready to download.
              </Reveal>

              <Reveal delay={280} className="mt-9">
                <FileIntake
                  onFile={load}
                  reading={reading}
                  error={error}
                  warnings={warnings}
                  label={image ? "REPLACE FILE" : "DROP YOUR FILE"}
                />
              </Reveal>

              <Reveal
                delay={380}
                className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-t border-rule pt-6"
              >
                {[
                  ["100%", "IN-BROWSER"],
                  ["0", "UPLOADS"],
                  ["11", "EXAM PRESETS"],
                ].map(([value, label]) => (
                  <div key={label}>
                    <div className="font-mono text-xl tracking-tight">{value}</div>
                    <div className="tech-sm mt-1 text-muted-foreground">{label}</div>
                  </div>
                ))}
              </Reveal>
            </div>

            {/* the artifact under inspection */}
            <Reveal delay={220} className="relative mx-auto w-full max-w-[380px] lg:max-w-none">
              <div className="relative aspect-[4/5] w-full">
                {image && webgl ? (
                  <Suspense fallback={<PlateStandIn url={image.url} ratio={ratio} />}>
                    <div className="absolute inset-0">
                      <InspectScene url={image.url} ratio={ratio} verdict={verdict} />
                    </div>
                  </Suspense>
                ) : image ? (
                  <PlateStandIn url={image.url} ratio={ratio} />
                ) : (
                  <div className="absolute inset-0 grid place-items-center">
                    <FilePlate
                      className="w-[62%] max-w-[230px] rotate-[-2deg]"
                      label="AWAITING FILE"
                      status="NO FILE LOADED"
                      tone="pending"
                      size="—"
                      dimensions="— × — PX"
                      format="—"
                    />
                  </div>
                )}
              </div>

              <div className="tech-sm mt-4 flex items-center justify-between text-muted-foreground lg:absolute lg:inset-x-6 lg:-bottom-8 lg:mt-0">
                <span>FIG. 01 — FILE UNDER TEST</span>
                <span>
                  {image
                    ? `${image.meta.format.replace("image/", "").toUpperCase()} · ${formatKb(image.meta.sizeKB)}`
                    : "IDLE"}
                </span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── the rail ────────────────────────────────────────────────── */}
      <section className="border-b border-rule bg-card/60">
        <div className="mx-auto max-w-[1400px] px-5 py-12 md:px-8 md:py-16">
          <StageRail steps={STEPS} active={stage} eyebrow="DIAGNOSTIC SEQUENCE" />
        </div>
      </section>

      {/* ── target + report ────────────────────────────────────────── */}
      <section className="border-b border-rule">
        <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-8 md:py-20">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
            <div>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <Reveal className="tech text-muted-foreground">STAGE 01 — TARGET</Reveal>
                  <Reveal as="h2" delay={70} className="display-md mt-4 max-w-[20ch]">
                    Which requirement are we measuring against?
                  </Reveal>
                </div>
                <Reveal delay={120} className="flex gap-px bg-rule">
                  {(["preset", "custom"] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMode(m)}
                      aria-pressed={mode === m}
                      className={`tech px-4 py-3 transition-colors duration-300 ${
                        mode === m
                          ? "bg-foreground text-background"
                          : "bg-background text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {m === "preset" ? "EXAM PRESET" : "CUSTOM"}
                    </button>
                  ))}
                </Reveal>
              </div>

              {mode === "preset" ? (
                <Reveal delay={120} className="mt-9">
                  <PresetPicker value={preset?.id ?? null} onChange={setPreset} />
                  {preset && (
                    <dl className="mt-8 grid gap-x-10 gap-y-3 border-t border-rule pt-6 sm:grid-cols-2">
                      <div className="flex items-baseline justify-between gap-4 border-b border-rule/60 pb-2">
                        <dt className="tech-sm text-muted-foreground">DIMENSIONS</dt>
                        <dd className="font-mono text-[12.5px]">{dimensionLabel(preset)}</dd>
                      </div>
                      <div className="flex items-baseline justify-between gap-4 border-b border-rule/60 pb-2">
                        <dt className="tech-sm text-muted-foreground">FILE SIZE</dt>
                        <dd className="font-mono text-[12.5px]">{sizeLabel(preset)}</dd>
                      </div>
                      <div className="flex items-baseline justify-between gap-4 border-b border-rule/60 pb-2">
                        <dt className="tech-sm text-muted-foreground">FORMAT</dt>
                        <dd className="font-mono text-[12.5px]">{formatLabel(preset)}</dd>
                      </div>
                      <div className="flex items-baseline justify-between gap-4 border-b border-rule/60 pb-2">
                        <dt className="tech-sm text-muted-foreground">SOURCE</dt>
                        <dd className="font-mono text-[12.5px]">
                          {preset.source.document} {preset.source.notificationYear}
                        </dd>
                      </div>
                    </dl>
                  )}
                </Reveal>
              ) : (
                <Reveal delay={120} className="mt-9 border border-rule bg-card p-6 md:p-7">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field
                      label="WIDTH (PX)"
                      value={custom.width}
                      onChange={(v) => setCustom((c) => ({ ...c, width: v }))}
                      placeholder="200"
                    />
                    <Field
                      label="HEIGHT (PX)"
                      value={custom.height}
                      onChange={(v) => setCustom((c) => ({ ...c, height: v }))}
                      placeholder="230"
                    />
                    <Field
                      label="MAX SIZE (KB)"
                      value={custom.maxKB}
                      onChange={(v) => setCustom((c) => ({ ...c, maxKB: v }))}
                      placeholder="50"
                    />
                    <div>
                      <label className="tech-sm block text-muted-foreground" htmlFor="fmt">
                        FORMAT
                      </label>
                      <select
                        id="fmt"
                        value={custom.format}
                        onChange={(e) => setCustom((c) => ({ ...c, format: e.target.value }))}
                        className="mt-3 w-full border-b border-rule bg-transparent pb-2 font-mono text-[15px] focus:border-primary focus:outline-none"
                      >
                        <option value="jpg">JPG</option>
                        <option value="png">PNG</option>
                        <option value="webp">WEBP</option>
                      </select>
                    </div>
                  </div>
                  <p className="mt-6 max-w-[46ch] text-[13px] leading-relaxed text-muted-foreground">
                    Leave a field blank to skip that check. Values come from your own notification —
                    FormFix does not guess them.
                  </p>
                </Reveal>
              )}
            </div>

            {/* report column */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <Reveal className="tech text-muted-foreground">STAGE 02 — REPORT</Reveal>

              {validation && image ? (
                <div className="mt-6">
                  <ValidationReport
                    validation={validation}
                    target={targetName}
                    source={mode === "preset" ? preset?.source.notificationYear : "CUSTOM"}
                  />

                  <p className="mt-5 max-w-[46ch] border-l-2 border-primary pl-4 text-[13.5px] leading-relaxed">
                    {validation.summary}
                  </p>

                  <div className="mt-7 flex flex-wrap items-center gap-3">
                    {!validation.allPass && validation.canAutoFix && (
                      <button
                        type="button"
                        onClick={runFix}
                        disabled={fixing}
                        className="tech group inline-flex items-center gap-3 bg-foreground px-6 py-4 text-background transition-transform duration-300 hover:-translate-y-[2px] disabled:opacity-60"
                      >
                        {fixing ? "FIXING…" : "FIX IT FOR ME"}
                        <span
                          className="transition-transform duration-300 group-hover:translate-x-1"
                          aria-hidden="true"
                        >
                          →
                        </span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={download}
                      className="tech inline-flex items-center gap-3 border border-foreground px-6 py-4 transition-colors duration-300 hover:bg-foreground hover:text-background"
                    >
                      DOWNLOAD FILE
                    </button>
                    <button
                      type="button"
                      onClick={clear}
                      className="tech text-muted-foreground transition-colors hover:text-foreground"
                    >
                      CLEAR
                    </button>
                  </div>

                  {fixNote && (
                    <p className="tech-sm mt-5 text-muted-foreground">{fixNote}</p>
                  )}

                  {fixed && origin && (
                    <div className="mt-8 border border-rule bg-card p-5">
                      <div className="tech-sm text-muted-foreground">TRANSFORM RESULT</div>
                      <div className="mt-4 flex items-end justify-between gap-6">
                        <div>
                          <div className="tech-sm text-muted-foreground">BEFORE</div>
                          <div className="mt-2 font-mono text-[13px] text-muted-foreground line-through">
                            {origin.dim} · {formatKb(origin.sizeKB)}
                          </div>
                        </div>
                        <span className="tech-sm text-muted-foreground" aria-hidden="true">
                          →
                        </span>
                        <div className="text-right">
                          <div className="tech-sm text-verify">AFTER</div>
                          <div className="mt-2 font-mono text-[13px]">
                            {fixed.width} × {fixed.height} PX
                          </div>
                          <KbCounter value={fixed.sizeKB} className="mt-1 block text-xl" />
                        </div>
                      </div>
                      <div className="mt-4 h-px bg-rule">
                        <div
                          className="h-px bg-verify"
                          style={{
                            width: `${Math.min(100, (1 - fixed.sizeKB / Math.max(origin.sizeKB, 1)) * 100)}%`,
                          }}
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-6 border border-rule bg-card p-6">
                  <div className="tech-sm text-muted-foreground">AWAITING INPUT</div>
                  <ol className="mt-5 space-y-3">
                    {[
                      { done: !!requirements, t: "Select a requirement target" },
                      { done: !!image, t: "Drop a photo or signature" },
                    ].map((row) => (
                      <li
                        key={row.t}
                        className={`flex items-center gap-3 border-l-2 py-2 pl-4 text-[13.5px] transition-colors duration-500 ${
                          row.done ? "border-primary" : "border-rule text-muted-foreground"
                        }`}
                      >
                        <span className="tech-sm w-4">{row.done ? "✓" : "·"}</span>
                        {row.t}
                      </li>
                    ))}
                  </ol>
                  <p className="mt-6 max-w-[42ch] text-[13px] leading-relaxed text-muted-foreground">
                    The report is generated on this device the moment both are set. Nothing is sent
                    anywhere.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── the two plates, side by side ───────────────────────────── */}
      {image && (
        <section className="border-b border-rule bg-card/50">
          <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-8 md:py-20">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <span className="tech text-muted-foreground">FIG. 02 — THE FILE</span>
                <h2 className="display-md mt-4 max-w-[18ch]">
                  {verdict === "pass" ? "Verified against the target." : "Measured, not guessed."}
                </h2>
              </div>
              <p className="max-w-[38ch] text-[14px] leading-relaxed text-muted-foreground">
                The plate carries its own metadata — the same values the upload form will read.
              </p>
            </div>

            <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-[minmax(0,300px)_minmax(0,300px)]">
              <SpecPlate
                url={image.url}
                ratio={ratio}
                label="CURRENT"
                dimensions={`${image.meta.width} × ${image.meta.height} PX`}
                format={image.meta.format.replace("image/", "").toUpperCase()}
                size={formatKb(image.meta.sizeKB)}
                status={
                  verdict === "pass" ? "MEETS TARGET" : verdict === "fail" ? "NEEDS FIXING" : null
                }
                tone={verdict === "pass" ? "verify" : verdict === "fail" ? "fail" : "pending"}
                crop={verdict === "pass"}
              />

              {mode === "preset" && preset && (
                <FilePlate
                  label="TARGET"
                  dimensions={dimensionLabel(preset)}
                  format={formatLabel(preset)}
                  size={sizeLabel(preset)}
                  status="NOTIFICATION VALUE"
                  tone="pending"
                />
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── guidelines from the notification ───────────────────────── */}
      {mode === "preset" && preset && (
        <section className="border-b border-rule">
          <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-8 md:py-20">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <Reveal className="tech text-muted-foreground">FROM THE NOTIFICATION</Reveal>
                <Reveal as="h2" delay={70} className="display-md mt-4 max-w-[16ch]">
                  {preset.exam}
                </Reveal>
                <Reveal delay={140} className="mt-5 max-w-[40ch] text-[14px] leading-relaxed text-muted-foreground">
                  {preset.description}
                </Reveal>
                <Reveal delay={200} className="tech-sm mt-6 text-muted-foreground">
                  TRANSCRIBED {preset.source.verifiedDate} · {preset.source.document}
                </Reveal>
              </div>
              <Reveal delay={120} className="grid gap-px bg-rule sm:grid-cols-2">
                {preset.guidelines.map((g, i) => (
                  <div key={g} className="bg-background p-5">
                    <div className="tech-sm text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <p className="mt-3 text-[13.5px] leading-relaxed">{g}</p>
                  </div>
                ))}
              </Reveal>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function PlateStandIn({ url, ratio }: { url: string; ratio: number }) {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="w-[68%] max-w-[250px] rotate-[-2deg]">
        <SpecPlate
          url={url}
          ratio={ratio}
          label="FILE"
          dimensions="LOADED"
          format="LOCAL"
          size="ON DEVICE"
          guides={false}
        />
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
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
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, ""))}
        className="mt-3 w-full border-b border-rule bg-transparent pb-2 font-mono text-[15px] placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none"
      />
    </div>
  );
}
