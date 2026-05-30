import { NextResponse } from "next/server";

import { generateSchedule } from "@/lib/schedule";
import type { ScheduleInput, ScheduleResponse } from "@/lib/types";

export async function POST(req: Request) {
  const body = (await req.json()) as Partial<ScheduleInput>;

  if (
    !body ||
    typeof body.niche !== "string" ||
    !Array.isArray(body.platforms) ||
    typeof body.postsPerDay !== "number" ||
    typeof body.clipId !== "string" ||
    !body.cta ||
    typeof body.cta.text !== "string" ||
    (body.cta.style !== "bottomBanner" && body.cta.style !== "cornerWatermark")
  ) {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 },
    );
  }

  const items = generateSchedule(body as ScheduleInput);
  const response: ScheduleResponse = { items };
  return NextResponse.json(response);
}
