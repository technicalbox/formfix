import { dimensionLabel, formatLabel, presetGroups, sizeLabel, type Preset } from "@/lib/presets";

/**
 * PresetPicker — the requirement target, chosen from transcribed notifications.
 * Reads as a specification index rather than a dropdown.
 */
export function PresetPicker({
  value,
  onChange,
  className = "",
}: {
  value: string | null;
  onChange: (preset: Preset) => void;
  className?: string;
}) {
  const groups = presetGroups();

  return (
    <div className={className}>
      <div className="grid gap-px bg-rule sm:grid-cols-2">
        {groups.map((group) => (
          <div key={group.exam} className="bg-background p-5">
            <div className="flex items-baseline justify-between border-b border-rule pb-3">
              <h3 className="text-[14px] font-medium tracking-[-0.02em]">{group.exam}</h3>
              <span className="tech-sm text-muted-foreground">
                {group.items[0]?.source.notificationYear}
              </span>
            </div>
            <div className="mt-4 grid gap-2">
              {group.items.map((p) => {
                const selected = value === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => onChange(p)}
                    aria-pressed={selected}
                    className={`relative border px-4 py-3 text-left transition-colors duration-300 ${
                      selected
                        ? "border-primary bg-accent/50"
                        : "border-rule hover:border-foreground/30 hover:bg-card"
                    }`}
                    style={{ transitionTimingFunction: "var(--ease-ff)" }}
                  >
                    <span
                      className="absolute inset-x-0 top-0 h-[2px] origin-left bg-primary transition-transform duration-400"
                      style={{
                        transform: `scaleX(${selected ? 1 : 0})`,
                        transitionTimingFunction: "var(--ease-ff)",
                      }}
                      aria-hidden="true"
                    />
                    <span className="flex items-baseline justify-between gap-3">
                      <span className="tech-sm text-muted-foreground">{p.type.toUpperCase()}</span>
                      <span className="font-mono text-[12px]">{dimensionLabel(p)}</span>
                    </span>
                    <span className="mt-2 flex items-baseline justify-between gap-3">
                      <span className="font-mono text-[12px] text-muted-foreground">
                        {formatLabel(p)}
                      </span>
                      <span className="font-mono text-[12px] text-muted-foreground">
                        {sizeLabel(p)}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
