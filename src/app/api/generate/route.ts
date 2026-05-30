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

  const pixversePrompt = [
    input.prompt.trim()
      ? input.prompt.trim()
      : `A viral ${input.niche} short video with a clear call-to-action: ${input.cta.text}.`,
    input.ctaPrompt.trim() ? input.ctaPrompt.trim() : null,
  ]
    .filter(Boolean)
    .join("\n");

  const videos: GeneratedVideo[] = [];

  for (let i = 0; i < videoCount; i += 1) {
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
        aspect_ratio: "9:16",
        duration: 5,
        model: "v6",
        prompt: `${pixversePrompt}\n\nVariant: ${i + 1}/${videoCount}`,
        quality: "720p",
        seed: seedBase + i,
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

  const response: GenerateResponse = { schedule: [], videos };
  return NextResponse.json(response);
}
