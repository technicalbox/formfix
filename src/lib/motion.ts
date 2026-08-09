/** Centralised FormFix motion system. */
export const EASE_FF = [0.16, 1, 0.3, 1] as const;

export const DUR = {
  micro: 0.2,
  interaction: 0.34,
  section: 0.62,
  cinematic: 1.1,
} as const;

export const transition = (duration: number = DUR.section, delay = 0) => ({
  duration,
  delay,
  ease: EASE_FF as unknown as [number, number, number, number],
});
