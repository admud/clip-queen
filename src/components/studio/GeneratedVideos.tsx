"use client";

import type { GeneratedVideo } from "@/lib/types";

type Props = {
  videos: GeneratedVideo[] | null;
};

export function GeneratedVideos({ videos }: Props) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-white">Generated videos</div>
          <div className="mt-1 text-xs text-white/60">
            Demo output links back to the trailer asset.
          </div>
        </div>
        <div className="text-xs text-white/55">{videos?.length ?? 0} items</div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
        {(videos ?? []).map((video) => (
          <a
            key={video.id}
            href={video.url}
            className="block rounded-2xl border border-white/10 bg-black/10 p-4 transition hover:border-white/20 hover:bg-white/[0.06]"
          >
            <div className="text-xs font-semibold uppercase tracking-wide text-white/70">
              {video.platform}
            </div>
            <div className="mt-2 text-sm font-semibold text-white">Preview</div>
            <div className="mt-2 text-xs text-white/55 line-clamp-3">{video.prompt}</div>
            <div className="mt-3 rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">
              {video.cta.text}
            </div>
          </a>
        ))}

        {!videos?.length ? (
          <div className="rounded-2xl border border-white/10 bg-black/10 p-4 text-sm text-white/70 md:col-span-3">
            No videos yet. Click Generate to produce demo outputs.
          </div>
        ) : null}
      </div>
    </section>
  );
}

