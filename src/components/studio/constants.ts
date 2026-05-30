export function clampPostsPerDay(value: number) {
  if (!Number.isFinite(value)) return 1;
  return Math.max(1, Math.min(6, Math.round(value)));
}

