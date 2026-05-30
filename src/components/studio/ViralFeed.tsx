"use client";

import type { Clip } from "@/lib/types";

type Props = {
  clips: Clip[];
  selectedClipId: string | null;
  onSelect: (clipId: string) => void;
};

function formatNumber(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${Math.round(value / 1_000)}K`;
  return String(value);
}

export function ViralFeed({ clips, selectedClipId, onSelect }: Props) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-white">Viral feed</div>
          <div className="mt-1 text-xs text-white/60">Mock clips filtered by niche.</div>
        </div>
        <div className="text-xs text-white/55">{clips.length} clips</div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3">
        {clips.map((clip) => {
          const active = clip.id === selectedClipId;
          return (
            <button
              key={clip.id}
              type="button"
              onClick={() => onSelect(clip.id)}
              className={[
                "w-full rounded-2xl border p-4 text-left transition",
                active
                  ? "border-white/25 bg-white/10"
                  : "border-white/10 bg-black/10 hover:border-white/20 hover:bg-white/[0.06]",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-white">{clip.title}</div>
                  <div className="mt-1 text-xs text-white/55">{clip.handle}</div>
                </div>
                <div className="text-right text-xs text-white/55">
                  <div>{clip.durationSeconds}s</div>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-4 text-xs text-white/60">
                <div>
                  <span className="text-white/85">{formatNumber(clip.views)}</span> views
                </div>
                <div>
                  <span className="text-white/85">{formatNumber(clip.likes)}</span> likes
                </div>
                <div className="ml-auto rounded-full border border-white/10 bg-white/[0.03] px-2 py-1 text-[11px] text-white/70">
                  {clip.niche}
                </div>
              </div>
            </button>
          );
        })}

        {!clips.length ? (
          <div className="rounded-2xl border border-white/10 bg-black/10 p-4 text-sm text-white/70">
            No clips for this niche.
          </div>
        ) : null}
      </div>
    </section>
  );
}

