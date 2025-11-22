import { parseStringPromise } from "xml2js";

export type VideoItem = {
  id: string;
  title: string;
  author: string;
  link: string;
  publishedAt: string;
  thumbnail: string;
  description: string;
};

export async function fetchTrendingVideos(regionCode = "US"): Promise<VideoItem[]> {
  const url = `https://www.youtube.com/feeds/videos.xml?chart=mostPopular&hl=en&region=${regionCode}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "AgenticYouTubeAutomation/1.0" },
    cache: "no-store"
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch trending videos (${res.status})`);
  }

  const xml = await res.text();
  return mapFeedToItems(xml);
}

export async function fetchChannelLatest(channelId: string): Promise<VideoItem[]> {
  const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "AgenticYouTubeAutomation/1.0" },
    cache: "no-store"
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch channel feed (${res.status})`);
  }

  const xml = await res.text();
  return mapFeedToItems(xml);
}

async function mapFeedToItems(xml: string): Promise<VideoItem[]> {
  const parsed = await parseStringPromise(xml, { explicitArray: false });
  const entries = parsed.feed?.entry ?? [];
  const arrayEntries = Array.isArray(entries) ? entries : [entries];

  return arrayEntries
    .filter(Boolean)
    .map((entry) => {
      const id = entry["yt:videoId"];
      const media = entry["media:group"] ?? {};

      return {
        id,
        title: entry.title,
        author: entry.author?.name ?? "Unknown",
        link: entry.link?.["@"]?.href ?? `https://www.youtube.com/watch?v=${id}`,
        publishedAt: entry.published,
        thumbnail: media["media:thumbnail"]?.["@"]?.url ?? "",
        description: media["media:description"] ?? ""
      } as VideoItem;
    })
    .slice(0, 15);
}
