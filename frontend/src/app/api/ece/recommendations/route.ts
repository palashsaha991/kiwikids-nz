import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.KIWIKIDS_API_BASE_URL ??
  "http://127.0.0.1:8000";

export async function POST(
  request: NextRequest,
) {
  try {
    const payload =
      await request.json();

    const response = await fetch(
      `${API_BASE_URL}/api/v1/ece/recommendations`,
      {
        method: "POST",
        cache: "no-store",
        headers: {
          Accept: "application/json",
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(payload),
      },
    );

    const body =
      await response.text();

    return new NextResponse(body, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get(
            "content-type",
          ) ??
          "application/json",
        "Cache-Control":
          "no-store, max-age=0",
      },
    });
  } catch {
    return NextResponse.json(
      {
        detail:
          "Recommendation request failed.",
      },
      {
        status: 500,
        headers: {
          "Cache-Control":
            "no-store, max-age=0",
        },
      },
    );
  }
}
