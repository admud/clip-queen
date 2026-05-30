"use client";

import type { GeneratedVideo } from "@/lib/types";

type Props = {
  videos: GeneratedVideo[] | null;
  onPreview: (url: string) => void;
  onUse: (video: GeneratedVideo) => void;
};

const statusLabel: Record<GeneratedVideo["status"], string> = {
  queued: "Queued",
  generating: "Generating",
  ready: "Ready",
  failed: "Failed",
  moderation_failed: "Moderation failed",
};

export function GeneratedVideos(props: Props) {
  const { videos } = props;
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
          const canPreview = Boolean(video.url);
          const canUse = Boolean(video.url);

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

              {video.status === "failed" && video.error?.message ? (
                <div className="mt-3 text-xs text-white/70 line-clamp-2">{video.error.message}</div>
              ) : null}

              {video.provider === "pixverse" && video.providerId ? (
                <div className="mt-3 font-mono text-[11px] text-white/55">{video.providerId}</div>
              ) : null}

              <div className="mt-3 rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">
                {video.cta.text}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={!canPreview}
                  onClick={() => {
                    if (!video.url) return;
                    props.onPreview(video.url);
                  }}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-semibold text-white/85 transition enabled:hover:border-white/20 enabled:hover:bg-white/[0.06] disabled:opacity-40"
                >
                  Preview
                </button>
                <button
                  type="button"
                  disabled={!canUse}
                  onClick={() => props.onUse(video)}
                  className="rounded-2xl bg-[#B6FF3B] px-3 py-2 text-xs font-semibold text-black transition enabled:hover:bg-[#c7ff63] disabled:opacity-40"
                >
                  Use this clip
                </button>
              </div>
            </>
          );

          return (
            <div
              key={video.id}
              className={[
                "block rounded-2xl border border-white/10 bg-black/10 p-4",
                video.url ? "transition hover:border-white/20 hover:bg-white/[0.06]" : "",
              ].join(" ")}
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
