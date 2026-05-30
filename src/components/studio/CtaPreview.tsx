"use client";

import type { Clip, CtaStyle } from "@/lib/types";

type Props = {
  clip: Clip | null;
  ctaText: string;
  ctaStyle: CtaStyle;
};

export function CtaPreview({ clip, ctaText, ctaStyle }: Props) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-white">CTA preview</div>
          <div className="mt-1 text-xs text-white/60">
            {clip ? `${clip.title} · ${clip.handle}` : "Select a clip to preview the overlay."}
          </div>
        </div>
        <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/70">
          {ctaStyle === "bottomBanner" ? "Bottom banner" : "Corner watermark"}
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-black/40">
        <div className="relative aspect-[9/16] w-full">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_20%,rgba(255,255,255,0.08),transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_40%)]" />

          <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[11px] text-white/80">
            {clip ? clip.niche : "Category"}
          </div>

          {ctaStyle === "bottomBanner" ? (
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-black/70 p-4">
              <div className="text-sm font-semibold text-white">{ctaText || "Your CTA"}</div>
              <div className="rounded-full bg-[#B6FF3B] px-3 py-1 text-xs font-semibold text-black">
                Tap
              </div>
            </div>
          ) : (
            <div className="absolute bottom-4 right-4 rounded-2xl bg-black/70 px-4 py-2 text-xs font-semibold text-white shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
              {ctaText || "Your CTA"}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
