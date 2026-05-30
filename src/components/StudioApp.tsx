"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { InputsPanel } from "@/components/studio/InputsPanel";
import { ViralFeed } from "@/components/studio/ViralFeed";
import { CtaPreview } from "@/components/studio/CtaPreview";
import { GeneratedVideos } from "@/components/studio/GeneratedVideos";
import { ScheduleOutput } from "@/components/studio/ScheduleOutput";
import { clampPostsPerDay } from "@/components/studio/constants";
import { downloadJson } from "@/components/studio/utils";
import { mockClips, niches } from "@/lib/mockClips";
import type { CtaStyle, GenerateInput, GeneratedVideo, Platform, ScheduleItem } from "@/lib/types";

function mapPixverseStatus(status: number | null): GeneratedVideo["status"] {
  if (status === 1) return "ready";
  if (status === 5) return "generating";
  if (status === 7) return "moderation_failed";
  return "failed";
}

export function StudioApp() {
  const [niche, setNiche] = useState<string>(niches[0] ?? "Creator tools");
  const [prompt, setPrompt] = useState<string>("");
  const [platform, setPlatform] = useState<Platform>("tiktok");
  const [postsPerDay, setPostsPerDay] = useState<number>(3);
  const [selectedClipId, setSelectedClipId] = useState<string>(mockClips[0]?.id ?? "");
  const [ctaText, setCtaText] = useState<string>("Get the app");
  const [ctaStyle, setCtaStyle] = useState<CtaStyle>("bottomBanner");
  const [ctaPrompt, setCtaPrompt] = useState<string>("");
  const [schedule, setSchedule] = useState<ScheduleItem[] | null>(null);
  const [videos, setVideos] = useState<GeneratedVideo[] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const filteredClips = useMemo(() => mockClips.filter((c) => c.niche === niche), [niche]);

  const selectedClip = useMemo(
    () => mockClips.find((c) => c.id === selectedClipId) ?? filteredClips[0],
    [filteredClips, selectedClipId],
  );

  const input: GenerateInput = useMemo(
    () => ({
      niche,
      platforms: [platform],
      postsPerDay: clampPostsPerDay(postsPerDay),
      clipId: selectedClip?.id ?? "",
      cta: { text: ctaText, style: ctaStyle },
      prompt,
      ctaPrompt,
    }),
    [ctaPrompt, ctaStyle, ctaText, niche, platform, postsPerDay, prompt, selectedClip?.id],
  );

  useEffect(() => {
    const pending = (videos ?? []).filter(
      (v) =>
        v.provider === "pixverse" &&
        v.providerId &&
        v.status !== "ready" &&
        v.status !== "failed" &&
        v.status !== "moderation_failed",
    );

    if (!pending.length) return;

    let cancelled = false;

    const tick = async () => {
      const targets = (videos ?? []).filter((v) => v.provider === "pixverse" && v.providerId);
      if (!targets.length) return;

      const updates = await Promise.all(
        targets.map(async (v) => {
          const res = await fetch(`/api/pixverse/status?videoId=${encodeURIComponent(v.providerId!)}`);
          if (!res.ok) {
            return { id: v.id, status: "failed" as const, url: null as string | null };
          }
          const json = (await res.json()) as { status: number | null; url: string | null };
          const status = mapPixverseStatus(json.status);
          const url = status === "ready" ? json.url : null;
          return { id: v.id, status, url };
        }),
      );

      if (cancelled) return;

      setVideos((prev) => {
        if (!prev) return prev;
        return prev.map((v) => {
          const next = updates.find((u) => u.id === v.id);
          if (!next) return v;
          return {
            ...v,
            status: next.status,
            url: next.url ?? v.url,
          };
        });
      });
    };

    void tick();
    const handle = window.setInterval(() => {
      void tick();
    }, 4000);

    return () => {
      cancelled = true;
      window.clearInterval(handle);
    };
  }, [videos]);

  return (
    <div className="min-h-dvh bg-[#07080B] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(182,255,59,0.14),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(255,45,170,0.12),transparent_40%),radial-gradient(circle_at_50%_90%,rgba(59,130,246,0.12),transparent_45%)]" />
      <div className="pointer-events-none fixed inset-0 opacity-[0.22] [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:28px_28px]" />

      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#07080B]/70 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-sm font-medium text-white/85 transition hover:border-white/20 hover:bg-white/[0.06]"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Link>
            <div className="text-sm font-semibold tracking-wide">clip-queen Studio</div>
          </div>
          <div className="hidden items-center gap-2 text-xs text-white/60 md:flex">
            Demo-only: mock clips + exportable schedule plan
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
          <InputsPanel
            niche={niche}
            onNicheChange={(n) => {
              setNiche(n);
              const first = mockClips.find((c) => c.niche === n);
              if (first) setSelectedClipId(first.id);
            }}
            prompt={prompt}
            onPromptChange={(v) => setPrompt(v)}
            platform={platform}
            onPlatformChange={(next) => setPlatform(next)}
            postsPerDay={postsPerDay}
            onPostsPerDayChange={(v) => setPostsPerDay(v)}
            ctaText={ctaText}
            onCtaTextChange={(v) => setCtaText(v)}
            ctaStyle={ctaStyle}
            onCtaStyleChange={(v) => setCtaStyle(v)}
            ctaPrompt={ctaPrompt}
            onCtaPromptChange={(v) => setCtaPrompt(v)}
            isGenerating={isGenerating}
            canGenerate={Boolean(selectedClip?.id)}
            hasSchedule={Boolean(schedule?.length)}
            hasVideos={Boolean(videos?.length)}
            onGenerate={async () => {
              if (!selectedClip?.id) return;
              setIsGenerating(true);
              try {
                const res = await fetch("/api/generate", {
                  method: "POST",
                  headers: { "content-type": "application/json" },
                  body: JSON.stringify(input),
                });
                if (!res.ok) throw new Error("generate_failed");
                const data = (await res.json()) as { schedule: ScheduleItem[]; videos: GeneratedVideo[] };
                setSchedule(data.schedule);
                setVideos(data.videos);
              } finally {
                setIsGenerating(false);
              }
            }}
            onExport={() => {
              if (!schedule?.length && !videos?.length) return;
              downloadJson("clip-queen-plan.json", {
                input,
                clip: selectedClip ?? null,
                schedule: schedule ?? [],
                videos: videos ?? [],
              });
            }}
            onResetOutput={() => {
              setSchedule(null);
              setVideos(null);
            }}
          />

          <section className="space-y-6">
            <ViralFeed
              clips={filteredClips}
              selectedClipId={selectedClip?.id ?? null}
              onSelect={(clipId) => setSelectedClipId(clipId)}
            />

            <GeneratedVideos videos={videos} />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <CtaPreview clip={selectedClip ?? null} ctaText={ctaText} ctaStyle={ctaStyle} />
              <ScheduleOutput schedule={schedule} postsPerDay={postsPerDay} />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
