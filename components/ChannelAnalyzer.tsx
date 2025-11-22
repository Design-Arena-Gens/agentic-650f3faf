/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import useSWR from "swr";
import { BarChart3, Loader2, Search } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { VideoItem } from "@/lib/youtube";
import { cn } from "@/lib/utils";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function ChannelAnalyzer() {
  const [channelId, setChannelId] = useState("");
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const { data, isLoading, error } = useSWR<{ videos: VideoItem[] }>(
    submittedId ? `/api/channel?channelId=${submittedId}` : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  const latestVideos = data?.videos ?? [];
  const avgLength = averageDuration(latestVideos);
  const releaseCadence = cadence(latestVideos);

  return (
    <section className="glass rounded-2xl p-6">
      <SectionHeader
        title="Channel health monitor"
        subtitle="Drop in a channel ID to map velocity, cadence, and breakout opportunities."
        icon={<BarChart3 className="h-5 w-5" />}
      />

      <form
        className="mt-4 flex flex-col gap-3 sm:flex-row"
        onSubmit={(event) => {
          event.preventDefault();
          setSubmittedId(channelId.trim());
        }}
      >
        <input
          value={channelId}
          onChange={(event) => setChannelId(event.target.value)}
          placeholder="UC_x5XG1OV2P6uZZ5FSM9Ttw"
          className="flex-1 rounded-xl border border-slate-800/70 bg-slate-900/60 px-4 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-pink-500"
        >
          <Search className="h-4 w-4" />
          Analyze
        </button>
      </form>

      {isLoading && (
        <div className="mt-6 flex items-center gap-2 text-sm text-slate-400">
          <Loader2 className="h-4 w-4 animate-spin" />
          Pulling channel feed…
        </div>
      )}

      {error && (
        <p className="mt-6 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
          Failed to load channel feed. Double-check the channel ID.
        </p>
      )}

      {latestVideos.length > 0 && (
        <div className="mt-6 space-y-6">
          <div className="grid gap-4 rounded-xl bg-slate-900/60 p-4 sm:grid-cols-3">
            <MetricBlock label="Latest upload" value={latestVideos[0].title} />
            <MetricBlock
              label="Upload cadence"
              value={releaseCadence}
              accent
            />
            <MetricBlock label="Avg. length" value={avgLength} />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-200">
              Recent uploads
            </h3>
            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
              {latestVideos.slice(0, 6).map((video) => (
                <a
                  key={video.id}
                  href={video.link}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex rounded-xl border border-slate-800/70 bg-slate-900/40 p-3 transition hover:border-accent hover:bg-slate-900"
                >
                  <div className="relative mr-3 h-20 w-36 overflow-hidden rounded-lg">
                    {video.thumbnail && (
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="h-full w-full object-cover transition group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="flex flex-col justify-between">
                    <div>
                      <p className="line-clamp-2 text-sm font-medium text-slate-200">
                        {video.title}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {new Date(video.publishedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-[11px] uppercase tracking-wide text-slate-500">
                      {video.author}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function MetricBlock({
  label,
  value,
  accent
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border px-3 py-4",
        accent
          ? "border-accent/40 bg-accent/10 text-accent"
          : "border-slate-800/70 bg-slate-900/40 text-slate-100"
      )}
    >
      <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold leading-snug">{value}</p>
    </div>
  );
}

function averageDuration(videos: VideoItem[]) {
  const matches = videos
    .map((video) => video.description.match(/(\d+):(\d+)/))
    .filter(Boolean) as RegExpMatchArray[];

  if (matches.length === 0) {
    return "Unknown";
  }

  const totalMinutes = matches.reduce((sum, match) => {
    const minutes = Number.parseInt(match[1] ?? "0", 10);
    const seconds = Number.parseInt(match[2] ?? "0", 10);
    return sum + minutes + seconds / 60;
  }, 0);

  const avg = totalMinutes / matches.length;

  return `${avg.toFixed(1)} min`;
}

function cadence(videos: VideoItem[]) {
  if (videos.length < 2) {
    return "Needs data";
  }

  const timestamps = videos
    .map((video) => new Date(video.publishedAt).getTime())
    .sort((a, b) => b - a);

  const diffs = [];
  for (let idx = 0; idx < timestamps.length - 1; idx += 1) {
    diffs.push(timestamps[idx] - timestamps[idx + 1]);
  }

  const averageMs = diffs.reduce((sum, diff) => sum + diff, 0) / diffs.length;
  const days = averageMs / (1000 * 60 * 60 * 24);

  if (Number.isNaN(days) || days <= 0) {
    return "Irregular";
  }

  if (days < 1) {
    return "Multiple uploads per day";
  }

  return `${days.toFixed(1)} days per upload`;
}
