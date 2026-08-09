/**
 * Tiny shared store so the pipeline rail and the transformation story stay in
 * lockstep: the story publishes the active stage as the user scrolls, the rail
 * lights up the matching step. No provider, no re-render cascade.
 */
export type StageState = {
  /** 0 INPUT · 1 TRANSFORM · 2 VERIFY · 3 READY */
  stage: number;
  /** 0..1 across the whole transformation zone */
  progress: number;
};

let state: StageState = { stage: 0, progress: 0 };
const subs = new Set<(s: StageState) => void>();

export function setStageState(next: StageState) {
  if (next.stage === state.stage && Math.abs(next.progress - state.progress) < 0.004) return;
  state = next;
  subs.forEach((f) => f(state));
}

export function subscribeStage(f: (s: StageState) => void) {
  subs.add(f);
  f(state);
  return () => {
    subs.delete(f);
  };
}
