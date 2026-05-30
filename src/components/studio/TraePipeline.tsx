"use client";

import { ClipboardCopy, Sparkles } from "lucide-react";

import { stylePresets } from "@/lib/trae";
import type { StoryboardScene } from "@/lib/types";

type Props = {
  presetId: string;
  onPresetChange: (id: string) => void;
  storyboard: StoryboardScene[] | null;
  onStoryboardChange: (next: StoryboardScene[] | null) => void;
  promptVariants: string[] | null;
  timingsMs: { storyboard?: number; variants?: number } | null;
};

export function TraePipeline({
  presetId,
  onPresetChange,
  storyboard,
  onStoryboardChange,
  promptVariants,
  timingsMs,
}: Props) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-white">TRAE pipeline</div>
          <div className="mt-1 text-xs text-white/60">
            Storyboard → prompts → PixVerse jobs. Everything is editable.
          </div>
        </div>
        <Sparkles className="h-4 w-4 text-white/60" />
      </div>

      <div className="mt-4 space-y-5">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-white/60">Style preset</div>
          <select
            value={presetId}
            onChange={(e) => onPresetChange(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-white/20"
          >
            {stylePresets.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="flex items-center justify-between gap-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-white/60">Storyboard</div>
            <button
              type="button"
              onClick={() => onStoryboardChange(null)}
              disabled={!storyboard?.length}
              className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-semibold text-white/80 transition enabled:hover:border-white/20 enabled:hover:bg-white/[0.06] disabled:opacity-40"
            >
              Clear
            </button>
          </div>

          {!storyboard?.length ? (
            <div className="mt-3 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/70">
              No storyboard yet. Use “Generate Storyboard” on the left.
            </div>
          ) : (
            <div className="mt-3 space-y-3">
              {storyboard.map((scene) => (
                <div key={scene.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-sm font-semibold text-white">{scene.title}</div>
                    <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] text-white/70">
                      {scene.id.slice(0, 8)}
                    </div>
                  </div>
                  <textarea
                    value={scene.prompt}
                    onChange={(e) => {
                      const next = storyboard.map((s) => (s.id === scene.id ? { ...s, prompt: e.target.value } : s));
                      onStoryboardChange(next);
                    }}
                    rows={3}
                    className="mt-3 w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-white/20"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between gap-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-white/60">Prompt variants</div>
            <button
              type="button"
              onClick={() => {
                if (!promptVariants?.length) return;
                void navigator.clipboard?.writeText(promptVariants.join("\n\n---\n\n"));
              }}
              disabled={!promptVariants?.length}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-semibold text-white/80 transition enabled:hover:border-white/20 enabled:hover:bg-white/[0.06] disabled:opacity-40"
            >
              <ClipboardCopy className="h-3.5 w-3.5" />
              Copy
            </button>
          </div>

          {!promptVariants?.length ? (
            <div className="mt-3 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/70">
              No variants yet. Use “Generate Variants” to create alternate angles.
            </div>
          ) : (
            <div className="mt-3 space-y-3">
              {promptVariants.map((p, idx) => (
                <div key={`${idx}`} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-xs font-semibold uppercase tracking-wide text-white/60">
                    Variant {idx + 1}
                  </div>
                  <div className="mt-2 whitespace-pre-wrap text-xs text-white/70">{p}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-white/60">Efficiency</div>
          <div className="mt-2 grid grid-cols-2 gap-3 text-sm text-white">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
              <div className="text-xs text-white/60">Storyboard</div>
              <div className="mt-1 font-semibold">{timingsMs?.storyboard ?? "—"} ms</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
              <div className="text-xs text-white/60">Variants</div>
              <div className="mt-1 font-semibold">{timingsMs?.variants ?? "—"} ms</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

