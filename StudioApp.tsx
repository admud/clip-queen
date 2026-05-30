import { NextResponse } from "next/server";

import { generateSchedule } from "@/lib/schedule";
import type {
  GenerateInput,
  GenerateResponse,
  GeneratedVideo,
  Platform,
} from "@/lib/types";

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
  const schedule = generateSchedule(input);
  const nonce = Date.now();

  const videos: GeneratedVideo[] = input.platforms.map((platform) => ({
    id: `v_${platform}_${nonce}`,
    platform,
    url: `/trailer.mp4?p=${platform}&v=${nonce}`,
    prompt: input.prompt,
    ctaPrompt: input.ctaPrompt,
    cta: input.cta,
  }));

  const response: GenerateResponse = { schedule, videos };
  return NextResponse.json(response);
}

