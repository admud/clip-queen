"use client";

import type { GeneratedVideo } from "@/lib/types";

type Props = {
  videos: GeneratedVideo[] | null;
};

const statusLabel: Record<GeneratedVideo["status"], string> = {
  queued: "Queued",
  generating: "Generating",
  ready: "Ready",
  failed: "Failed",
  moderation_failed: "Moderation failed",
};

export function GeneratedVideos({ videos }: Props) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-white">Generated videos</div>
          <div className="mt-1 text-xs text-white/60">
            PixVerse renders asynchronously; previews appear when ready.
          </div>
        </div>
        <div className="text-xs text-white/55">{videos?.length ?? 0} items</div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
        {(videos ?? []).map((video) => {
          const content = (
            <>
              <div className="flex items-start justify-between gap-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-white/70">
                  {video.platform}
                </div>
                <div
                  className={[
                    "rounded-full border px-3 py-1 text-[11px] font-semibold",
                    video.status === "ready"
                      ? "border-[#B6FF3B]/50 bg-[#B6FF3B]/15 text-white"
                      : video.status === "failed" || video.status === "moderation_failed"
                        ? "border-[#FF2DAA]/40 bg-[#FF2DAA]/10 text-white"
                        : "border-white/10 bg-white/[0.03] text-white/70",
                  ].join(" ")}
                >
                  {statusLabel[video.status]}
                </div>
              </div>

              <div className="mt-3 text-sm font-semibold text-white">
                {video.url ? "Preview" : video.provider === "pixverse" ? "Rendering…" : "Preview"}
              </div>

              <div className="mt-2 text-xs text-white/55 line-clamp-3">{video.prompt}</div>

              {video.provider === "pixverse" && video.status === "failed" && video.error?.message ? (
                <div className="mt-3 text-xs text-white/70 line-clamp-2">{video.error.message}</div>
              ) : null}

              {video.provider === "pixverse" && video.providerId ? (
                <div className="mt-3 font-mono text-[11px] text-white/55">{video.providerId}</div>
              ) : null}

              <div className="mt-3 rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">
                {video.cta.text}
              </div>
            </>
          );

          if (video.url) {
            return (
              <a
                key={video.id}
                href={video.url}
                target="_blank"
                rel="noreferrer"
                className="block rounded-2xl border border-white/10 bg-black/10 p-4 transition hover:border-white/20 hover:bg-white/[0.06]"
              >
                {content}
              </a>
            );
          }

          return (
            <div
              key={video.id}
              className="block rounded-2xl border border-white/10 bg-black/10 p-4"
            >
              {content}
            </div>
          );
        })}

        {!videos?.length ? (
          <div className="rounded-2xl border border-white/10 bg-black/10 p-4 text-sm text-white/70 md:col-span-3">
            No videos yet. Click Generate to produce demo outputs.
          </div>
        ) : null}
      </div>
    </section>
  );
}
