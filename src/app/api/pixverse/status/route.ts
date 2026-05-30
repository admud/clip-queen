import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

const baseUrl = "https://app-api.pixverse.ai";

export async function GET(req: Request) {
  const apiKey = process.env.PIXVERSE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "missing_pixverse_api_key" }, { status: 500 });
  }

  const { searchParams } = new URL(req.url);
  const videoId = searchParams.get("videoId");
  if (!videoId) return NextResponse.json({ error: "missing_video_id" }, { status: 400 });

  const res = await fetch(`${baseUrl}/openapi/v2/video/result/${encodeURIComponent(videoId)}`, {
    headers: {
      "API-KEY": apiKey,
      "Ai-trace-id": randomUUID(),
    },
    cache: "no-store",
  });

  const json = (await res.json()) as {
    ErrCode?: number;
    ErrMsg?: string;
    Resp?: { status?: number; url?: string };
  };

  if (!res.ok || json.ErrCode !== 0) {
    return NextResponse.json({ error: "pixverse_error", pixverse: json }, { status: 502 });
  }

  return NextResponse.json({
    status: json.Resp?.status ?? null,
    url: json.Resp?.url ?? null,
  });
}

