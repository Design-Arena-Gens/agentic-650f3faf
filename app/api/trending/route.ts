import { NextResponse } from "next/server";
import { fetchTrendingVideos } from "@/lib/youtube";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const region = searchParams.get("region") ?? "US";

  try {
    const videos = await fetchTrendingVideos(region);
    return NextResponse.json({ videos });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to load trending videos",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
