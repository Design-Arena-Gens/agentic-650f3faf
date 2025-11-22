import { NextResponse } from "next/server";
import { fetchChannelLatest } from "@/lib/youtube";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const channelId = searchParams.get("channelId");

  if (!channelId) {
    return NextResponse.json(
      { error: "Missing channelId parameter" },
      { status: 400 }
    );
  }

  try {
    const videos = await fetchChannelLatest(channelId);
    return NextResponse.json({ videos });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to load channel feed",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
