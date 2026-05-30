"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";

import type { CtaStyle, GeneratedVideo, Platform } from "@/lib/types";

type StoredFinal = {
  video: GeneratedVideo;
  ctaText: string;
  ctaStyle: CtaStyle;
  niche: string;
  platform: Platform;
  createdAt: number;
};

export default function FinalVideoPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";
  const data = useMemo(() => {
    if (!id) return null;
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(`clip-queen:final:${id}`);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as StoredFinal;
    } catch {
      return null;
    }
  }, [id]);

  const videoUrl = data?.video.url ?? null;
  const title = useMemo(() => {
    if (!data) return "Final clip";
    return `${data.niche} · ${data.platform}`;
  }, [data]);

  return (
    <div className="min-h-dvh bg-[#07080B] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(182,255,59,0.14),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(255,45,170,0.12),transparent_40%),radial-gradient(circle_at_50%_90%,rgba(59,130,246,0.12),transparent_45%)]" />
      <div className="pointer-events-none fixed inset-0 opacity-[0.22] [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:28px_28px]" />

      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#07080B]/70 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
          <div>
            <div className="text-sm font-semibold text-white">{title}</div>
            <div className="mt-1 text-xs text-white/60">Shareable demo page (local).</div>
          </div>
          <Link
            href="/studio"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-semibold text-white/85 transition hover:border-white/20 hover:bg-white/[0.06]"
          >
            Back to Studio
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-6 py-10">
        {!data ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-sm text-white/70">
            This clip isn’t available on this device yet. Go back to Studio and click “Use this clip”.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-[360px_1fr]">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <div className="text-xs font-semibold uppercase tracking-wide text-white/60">Details</div>
              <div className="mt-3 space-y-3 text-sm text-white/80">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-xs text-white/60">CTA</div>
                  <div className="mt-1 font-semibold text-white">{data.ctaText}</div>
                  <div className="mt-2 text-xs text-white/60">
                    {data.ctaStyle === "bottomBanner" ? "Bottom banner" : "Corner watermark"}
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-xs text-white/60">Prompt</div>
                  <div className="mt-2 whitespace-pre-wrap text-xs text-white/70">{data.video.prompt}</div>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/40">
              <div className="relative">
                {videoUrl ? (
                  <video src={videoUrl} controls playsInline className="w-full" />
                ) : (
                  <div className="flex aspect-video items-center justify-center text-sm text-white/70">
                    No video URL available.
                  </div>
                )}

                {data.ctaStyle === "bottomBanner" ? (
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-black/70 p-4">
                    <div className="text-sm font-semibold text-white">{data.ctaText || "Your CTA"}</div>
                    <div className="rounded-full bg-[#B6FF3B] px-3 py-1 text-xs font-semibold text-black">
                      Tap
                    </div>
                  </div>
                ) : (
                  <div className="absolute bottom-4 right-4 rounded-2xl bg-black/70 px-4 py-2 text-xs font-semibold text-white shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                    {data.ctaText || "Your CTA"}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
