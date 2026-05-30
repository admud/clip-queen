"use client";

import { X } from "lucide-react";

type Props = {
  open: boolean;
  url: string | null;
  title?: string;
  onClose: () => void;
};

export function VideoPreviewModal({ open, url, title, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-[#07080B] shadow-[0_30px_120px_rgba(0,0,0,0.55)]">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
          <div className="text-sm font-semibold text-white">{title ?? "Preview"}</div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.03] p-2 text-white/80 transition hover:border-white/20 hover:bg-white/[0.06]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-[360px_1fr]">
          <div className="rounded-2xl border border-white/10 bg-black/40 p-4 text-xs text-white/60">
            Tip: if the video is still rendering, keep this open while it updates.
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40">
            {url ? (
              <video
                src={url}
                controls
                playsInline
                className="h-full w-full"
                autoPlay
              />
            ) : (
              <div className="flex aspect-video items-center justify-center text-sm text-white/70">
                No preview URL yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

