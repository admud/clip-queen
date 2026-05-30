import { randomInt, randomUUID } from "crypto";
import { NextResponse } from "next/server";

import type {
  GenerateInput,
  GenerateResponse,
  GeneratedVideo,
  Platform,
} from "@/lib/types";

const pixverseBaseUrl = "https://app-api.pixverse.ai";

function isPlatform(value: unknown): value is Platform {
  return value === "tiktok" || value === "instagram" || value === "youtube";
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((v) => typeof v === "string");
}

function normalizeQuality(value: unknown) {
  if (value === "360p" || value === "540p" || value === "720p" || value === "1080p") return value;
  return null;
}

export async function POST(req: Request) {
  const body = (await req.json()) as Partial<GenerateInput>;

  if (
    !body ||
    typeof body.niche !== "string" ||
    !Array.isArray(body.platforms) ||
    body.platforms.some((p) => !isPlatform(p)) ||
    typeof body.postsPerDay !== "number" ||
    typeof body.clipId !== "string" ||
    typeof body.prompt !== "string" ||
    typeof body.ctaPrompt !== "string" ||
    !body.cta ||
    typeof body.cta.text !== "string" ||
    (body.cta.style !== "bottomBanner" && body.cta.style !== "cornerWatermark")
  ) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const input = body as GenerateInput;
  const nonce = Date.now();
  const apiKey = process.env.PIXVERSE_API_KEY;
  const platform = input.platforms[0] ?? "tiktok";
  const videoCount = Math.max(1, Math.min(5, Math.floor(input.postsPerDay)));
  const seedBase = randomInt(0, 2_147_483_647 - videoCount);
  const demoFallback = req.headers.get("x-demo-fallback") === "1";

  const prompts = isStringArray(input.prompts)
    ? input.prompts.map((p) => p.trim()).filter(Boolean).slice(0, 5)
    : [];

  const pixversePrompt = [
    input.prompt.trim()
      ? input.prompt.trim()
      : `A viral ${input.niche} short video with a clear call-to-action: ${input.cta.text}.`,
    input.ctaPrompt.trim() ? input.ctaPrompt.trim() : null,
  ]
    .filter(Boolean)
    .join("\n");

  const model = typeof input.video?.model === "string" && input.video.model.trim() ? input.video.model.trim() : "v6";
  const aspectRatio =
    typeof input.video?.aspectRatio === "string" && input.video.aspectRatio.trim()
      ? input.video.aspectRatio.trim()
      : "9:16";
  const durationRaw = typeof input.video?.duration === "number" ? input.video.duration : 5;
  const duration = Math.max(1, Math.min(15, Math.round(durationRaw)));
  const quality = normalizeQuality(input.video?.quality) ?? "720p";
  const generateAudio = Boolean(input.video?.generateAudio);

  const videos: GeneratedVideo[] = [];

  for (let i = 0; i < videoCount; i += 1) {
    const scenePrompt = prompts[i] ? prompts[i] : pixversePrompt;
    if (!apiKey) {
      videos.push({
        id: `v_${platform}_${nonce}_${i}`,
        platform,
        provider: "demo",
        providerId: null,
        status: "ready",
        url: `/trailer.mp4?p=${platform}&v=${nonce}&i=${i}`,
        prompt: input.prompt,
        ctaPrompt: input.ctaPrompt,
        cta: input.cta,
      });
      continue;
    }

    const res = await fetch(`${pixverseBaseUrl}/openapi/v2/video/text/generate`, {
      method: "POST",
      headers: {
        "API-KEY": apiKey,
        "Ai-trace-id": randomUUID(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        aspect_ratio: aspectRatio,
        duration,
        model,
        prompt: `${scenePrompt}\n\nVariant: ${i + 1}/${videoCount}`,
        quality,
        seed: seedBase + i,
        generate_audio_switch: generateAudio,
      }),
    });

    const json = (await res.json()) as {
      ErrCode?: number;
      ErrMsg?: string;
      Resp?: { video_id?: number | string };
    };

    const videoId = json.Resp?.video_id;

    if (!res.ok || json.ErrCode !== 0 || videoId === undefined || videoId === null) {
      console.error("pixverse_text_generate_failed", {
        httpStatus: res.status,
        errCode: json.ErrCode ?? null,
        errMsg: json.ErrMsg ?? null,
      });

      if (demoFallback) {
        videos.push({
          id: `v_${platform}_${nonce}_${i}`,
          platform,
          provider: "demo",
          providerId: null,
          status: "ready",
          url: `/trailer.mp4?p=${platform}&v=${nonce}&i=${i}`,
          error: {
            httpStatus: res.status,
            code: json.ErrCode ?? null,
            message: json.ErrMsg ?? null,
          },
          prompt: input.prompt,
          ctaPrompt: input.ctaPrompt,
          cta: input.cta,
        });
        continue;
      }

      videos.push({
        id: `v_${platform}_${nonce}_${i}`,
        platform,
        provider: "pixverse",
        providerId: null,
        status: "failed",
        url: null,
        error: {
          httpStatus: res.status,
          code: json.ErrCode ?? null,
          message: json.ErrMsg ?? null,
        },
        prompt: input.prompt,
        ctaPrompt: input.ctaPrompt,
        cta: input.cta,
      });
      continue;
    }

    videos.push({
      id: `v_${platform}_${nonce}_${i}`,
      platform,
      provider: "pixverse",
      providerId: String(videoId),
      status: "queued",
      url: null,
      prompt: input.prompt,
      ctaPrompt: input.ctaPrompt,
      cta: input.cta,
    });
  }

  const response: GenerateResponse = { schedule: [], videos, trae: input.trae };
  return NextResponse.json(response);
}
