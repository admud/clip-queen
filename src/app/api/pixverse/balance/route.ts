import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

const baseUrl = "https://app-api.pixverse.ai";

export async function GET() {
  const apiKey = process.env.PIXVERSE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "missing_pixverse_api_key" }, { status: 500 });
  }

  const traceId = randomUUID();
  const res = await fetch(`${baseUrl}/openapi/v2/account/balance`, {
    headers: {
      "API-KEY": apiKey,
      "Ai-trace-id": traceId,
      "ai-trace-id": traceId,
    },
    cache: "no-store",
  });

  const json = (await res.json()) as {
    ErrCode?: number;
    ErrMsg?: string;
    Resp?: { account_id?: number; credit_monthly?: number; credit_package?: number };
  };

  if (!res.ok || json.ErrCode !== 0) {
    return NextResponse.json({ error: "pixverse_error", httpStatus: res.status, pixverse: json }, { status: 502 });
  }

  return NextResponse.json({
    accountId: json.Resp?.account_id ?? null,
    creditMonthly: json.Resp?.credit_monthly ?? null,
    creditPackage: json.Resp?.credit_package ?? null,
  });
}
