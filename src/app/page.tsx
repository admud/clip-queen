import { ArrowRight, CalendarDays, Scissors, Search } from "lucide-react";
import Link from "next/link";

import { TrailerPlayer } from "@/components/TrailerPlayer";

export default function Home() {
  return (
    <div className="relative flex flex-1 flex-col bg-[#07080B] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(182,255,59,0.14),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(255,45,170,0.12),transparent_40%),radial-gradient(circle_at_50%_90%,rgba(59,130,246,0.12),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.22] [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:28px_28px]" />

      <header className="relative z-10 border-b border-white/10 bg-[#07080B]/40 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="font-[var(--font-display)] text-lg font-black tracking-[-0.03em]">
              clip-queen
            </div>
            <div className="hidden text-xs text-white/55 sm:block">
              TikTok-native viral shorts factory (demo)
            </div>
          </div>
          <Link
            href="/studio"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/85 transition hover:border-white/20 hover:bg-white/[0.06]"
          >
            Open Studio
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-6xl px-6 py-10">
        <TrailerPlayer />

        <section className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Search className="h-4 w-4" />
              Scrape
            </div>
            <div className="mt-2 text-sm leading-6 text-white/65">
              Demo shows a niche-filtered “viral feed” so you can pick a clip fast.
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Scissors className="h-4 w-4" />
              Stitch
            </div>
            <div className="mt-2 text-sm leading-6 text-white/65">
              Toggle CTA overlay styles and see a stateful preview instantly.
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <CalendarDays className="h-4 w-4" />
              Schedule
            </div>
            <div className="mt-2 text-sm leading-6 text-white/65">
              Generate a 7-day plan for TikTok, IG, and YouTube, then export JSON.
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

