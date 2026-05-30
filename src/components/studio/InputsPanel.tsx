"use client";

import { Download, RefreshCcw, Sparkles } from "lucide-react";
import { useMemo } from "react";

import type { CtaStyle, Platform } from "@/lib/types";

type Props = {
  niche: string;
  onNicheChange: (value: string) => void;
  prompt: string;
  onPromptChange: (value: string) => void;
  platforms: Platform[];
  onPlatformsChange: (value: Platform[]) => void;
  postsPerDay: number;
  onPostsPerDayChange: (value: number) => void;
  ctaText: string;
  onCtaTextChange: (value: string) => void;
  ctaStyle: CtaStyle;
  onCtaStyleChange: (value: CtaStyle) => void;
  ctaPrompt: string;
  onCtaPromptChange: (value: string) => void;
  isGenerating: boolean;
  canGenerate: boolean;
  hasSchedule: boolean;
  hasVideos: boolean;
  onGenerate: () => void | Promise<void>;
  onExport: () => void;
  onResetOutput: () => void;
};

const allPlatforms: Platform[] = ["tiktok", "instagram", "youtube"];

function TogglePill({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-full border px-3 py-1 text-xs font-medium transition",
        active
          ? "border-[#B6FF3B]/60 bg-[#B6FF3B]/15 text-white shadow-[0_0_0_1px_rgba(182,255,59,0.14)]"
          : "border-white/10 bg-white/[0.03] text-white/70 hover:border-white/20 hover:bg-white/[0.06]",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

function CheckboxPill({
  checked,
  label,
  onCheckedChange,
}: {
  checked: boolean;
  label: string;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <label
      className={[
        "cursor-pointer select-none rounded-full border px-3 py-1 text-xs font-medium transition",
        checked
          ? "border-[#B6FF3B]/60 bg-[#B6FF3B]/15 text-white shadow-[0_0_0_1px_rgba(182,255,59,0.14)]"
          : "border-white/10 bg-white/[0.03] text-white/70 hover:border-white/20 hover:bg-white/[0.06]",
      ].join(" ")}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        className="sr-only"
      />
      {label}
    </label>
  );
}

export function InputsPanel(props: Props) {
  const platformLabel = useMemo(
    () =>
      ({
        tiktok: "TikTok",
        instagram: "Instagram",
        youtube: "YouTube",
      }) satisfies Record<Platform, string>,
    [],
  );

  return (
    <aside className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-white">Inputs</div>
          <div className="mt-1 text-xs text-white/60">Choose a clip, CTA, and output volume.</div>
        </div>

        <button
          type="button"
          onClick={props.onResetOutput}
          disabled={!props.hasSchedule && !props.hasVideos}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-semibold text-white/80 transition enabled:hover:border-white/20 enabled:hover:bg-white/[0.06] disabled:opacity-40"
        >
          <RefreshCcw className="h-4 w-4" />
          Reset
        </button>
      </div>

      <div className="mt-6 space-y-6">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-white/60">Niche</div>
          <input
            value={props.niche}
            onChange={(e) => props.onNicheChange(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/20"
            placeholder="Creator tools"
          />
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-white/60">Platforms</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {allPlatforms.map((p) => (
              <CheckboxPill
                key={p}
                checked={props.platforms.includes(p)}
                label={platformLabel[p]}
                onCheckedChange={(checked) => {
                  const next = checked
                    ? props.platforms.includes(p)
                      ? props.platforms
                      : [...props.platforms, p]
                    : props.platforms.filter((x) => x !== p);
                  props.onPlatformsChange(next);
                }}
              />
            ))}
          </div>
          <div className="mt-2 text-xs text-white/55">Pick at least one platform.</div>
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-white/60">
            Posts Per Day
          </div>
          <div className="mt-2 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
            <input
              type="range"
              min={1}
              max={5}
              value={props.postsPerDay}
              onInput={(e) => {
                props.onPostsPerDayChange(Number((e.target as HTMLInputElement).value));
              }}
              onChange={(e) => props.onPostsPerDayChange(Number(e.target.value))}
              className="w-full"
            />
            <div className="w-10 text-right text-sm font-semibold text-white">{props.postsPerDay}</div>
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-white/60">
            Caption Prompt
          </div>
          <textarea
            value={props.prompt}
            onChange={(e) => props.onPromptChange(e.target.value)}
            rows={3}
            className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/20"
            placeholder="Generate captions in a punchy, TikTok-native tone..."
          />
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-white/60">CTA</div>
              <div className="mt-1 text-xs text-white/55">Overlay styling + text.</div>
            </div>
            <Sparkles className="h-4 w-4 text-white/60" />
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <div className="text-xs font-medium text-white/70">Text</div>
              <input
                value={props.ctaText}
                onChange={(e) => props.onCtaTextChange(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/20"
                placeholder="Get the app"
              />
            </div>

            <div>
              <div className="text-xs font-medium text-white/70">Style</div>
              <div className="mt-2 flex flex-wrap gap-2">
                <TogglePill
                  active={props.ctaStyle === "bottomBanner"}
                  label="Bottom banner"
                  onClick={() => props.onCtaStyleChange("bottomBanner")}
                />
                <TogglePill
                  active={props.ctaStyle === "cornerWatermark"}
                  label="Corner watermark"
                  onClick={() => props.onCtaStyleChange("cornerWatermark")}
                />
              </div>
            </div>

            <div>
              <div className="text-xs font-medium text-white/70">CTA Prompt</div>
              <textarea
                value={props.ctaPrompt}
                onChange={(e) => props.onCtaPromptChange(e.target.value)}
                rows={2}
                className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/20"
                placeholder="Optional: describe your CTA overlay vibe..."
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            disabled={!props.canGenerate || props.isGenerating}
            onClick={props.onGenerate}
            className="w-full rounded-2xl bg-[#B6FF3B] px-4 py-3 text-sm font-semibold text-black shadow-[0_10px_40px_rgba(182,255,59,0.18)] transition enabled:hover:translate-y-[-1px] enabled:hover:bg-[#c7ff63] disabled:opacity-50"
          >
            {props.isGenerating ? "Generating..." : "Generate Plan"}
          </button>

          <button
            type="button"
            disabled={!props.hasSchedule && !props.hasVideos}
            onClick={props.onExport}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-white/85 transition enabled:hover:border-white/20 enabled:hover:bg-white/[0.06] disabled:opacity-40"
          >
            <Download className="h-4 w-4" />
            Export JSON
          </button>
        </div>
      </div>
    </aside>
  );
}
