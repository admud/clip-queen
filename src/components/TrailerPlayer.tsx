"use client";

import { Play, Sparkles, Wand2 } from "lucide-react";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";

type Chapter = {
  key: string;
  label: string;
  seconds: number;
};

const chapters: Chapter[] = [
  { key: "scrape", label: "Scrape", seconds: 6 },
  { key: "stitch", label: "Stitch", seconds: 18 },
  { key: "schedule", label: "Schedule", seconds: 30 },
];

export function TrailerPlayer() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isReady, setIsReady] = useState(false);

  const meta = useMemo(
    () => [
      { icon: Sparkles, label: "TikTok-native", value: "9:16" },
      { icon: Wand2, label: "PixVerse", value: "30s+" },
      { icon: Play, label: "Demo", value: "Interactive" },
    ],
    [],
  );

  return (
    <section className="w-full">
      <div className="w-full">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium tracking-wide text-white/80">
                clip-queen
                <span className="h-1 w-1 rounded-full bg-white/40" />
                viral shorts factory demo
              </div>

              <h1 className="mt-4 text-balance text-4xl font-black leading-[1.05] tracking-[-0.04em] text-white sm:text-5xl">
                Make 100 TikTok-style posts in minutes.
                <span className="text-white/60"> Scrape → Stitch → Schedule.</span>
              </h1>

              <p className="mt-4 max-w-2xl text-pretty text-base leading-7 text-white/70">
                Pick a niche, select a viral short, add your CTA overlay, and auto-generate a 7-day
                posting plan for TikTok, Instagram, and YouTube.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="grid grid-cols-3 gap-3">
                {meta.map((m) => (
                  <div
                    key={m.label}
                    className="rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3"
                  >
                    <div className="flex items-center gap-2 text-white/80">
                      <m.icon className="h-4 w-4" />
                      <span className="text-xs font-medium tracking-wide">{m.label}</span>
                    </div>
                    <div className="mt-1 text-base font-semibold text-white">{m.value}</div>
                  </div>
                ))}
              </div>

              <Link
                href="/studio"
                className="inline-flex items-center justify-center rounded-2xl bg-[#B6FF3B] px-5 py-3 text-sm font-semibold text-black shadow-[0_10px_40px_rgba(182,255,59,0.2)] transition hover:translate-y-[-1px] hover:bg-[#c7ff63]"
              >
                Open Studio
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-6 relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.02] p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_20px_80px_rgba(0,0,0,0.6)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(182,255,59,0.18),transparent_40%),radial-gradient(circle_at_70%_40%,rgba(255,45,170,0.15),transparent_40%),radial-gradient(circle_at_50%_90%,rgba(59,130,246,0.14),transparent_45%)]" />
          <div className="relative">
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                {chapters.map((c) => (
                  <button
                    key={c.key}
                    type="button"
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium tracking-wide text-white/90 transition hover:border-white/20 hover:bg-white/10"
                    onClick={() => {
                      const el = videoRef.current;
                      if (!el) return;
                      el.currentTime = c.seconds;
                      void el.play();
                    }}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
              <div
                className={[
                  "h-2 w-2 shrink-0 rounded-full",
                  isReady ? "bg-[#B6FF3B]" : "bg-white/25",
                ].join(" ")}
                aria-label={isReady ? "Trailer ready" : "Trailer loading"}
              />
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[420px_1fr]">
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
                <div className="relative aspect-[9/16] w-full">
                  <video
                    ref={videoRef}
                    className="absolute inset-0 h-full w-full object-cover"
                    controls
                    playsInline
                    preload="metadata"
                    onCanPlay={() => setIsReady(true)}
                  >
                    <source src="/trailer.mp4" type="video/mp4" />
                  </video>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-white/70">
                Drop your exported PixVerse video at{" "}
                <span className="font-mono text-white/90">public/trailer.mp4</span> to replace this
                player’s source.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

