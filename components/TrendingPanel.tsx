/* eslint-disable @next/next/no-img-element */
"use client";

import useSWR from "swr";
import { useState } from "react";
import { Loader2, TrendingUp } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { VideoItem } from "@/lib/youtube";
import { cn } from "@/lib/utils";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const regions = [
  { code: "US", label: "United States" },
  { code: "GB", label: "United Kingdom" },
  { code: "CA", label: "Canada" },
  { code: "IN", label: "India" },
  { code: "DE", label: "Germany" },
  { code: "JP", label: "Japan" }
];

export function TrendingPanel() {
  const [region, setRegion] = useState("US");
  const { data, error, isLoading } = useSWR<{ videos: VideoItem[] }>(
    `/api/trending?region=${region}`,
    fetcher,
    { revalidateOnFocus: false }
  );

  return (
    <section className="glass rounded-2xl p-6">
      <SectionHeader
        title="Trending intelligence"
        subtitle="Live RSS pull from YouTube trending feed so you can react before competitors do."
        icon={<TrendingUp className="h-5 w-5" />}
      />

      <div className="mt-4 flex flex-wrap gap-2">
        {regions.map((item) => (
          <button
            key={item.code}
            onClick={() => setRegion(item.code)}
            className={cn(
              "rounded-full px-3 py-1 text-sm transition",
              region === item.code
                ? "bg-accent text-slate-50"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {isLoading && (
          <div className="col-span-full flex items-center justify-center py-10 text-slate-400">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Syncing with YouTube…
          </div>
        )}

        {error && (
          <div className="col-span-full rounded-xl bg-red-500/10 border border-red-500/40 p-4 text-sm text-red-200">
            Failed to load trending videos.
          </div>
        )}

        {data?.videos?.map((video) => (
          <a
            key={video.id}
            href={video.link}
            target="_blank"
            rel="noreferrer"
            className="group flex gap-3 rounded-xl border border-slate-800/70 bg-slate-900/60 p-3 transition hover:border-accent hover:bg-slate-900"
          >
            <div className="relative h-20 w-32 flex-shrink-0 overflow-hidden rounded-lg border border-slate-800/40">
              {video.thumbnail ? (
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="h-full w-full object-cover transition group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-slate-900 text-xs text-slate-500">
                  No thumbnail
                </div>
              )}
            </div>
            <div className="flex flex-col justify-between">
              <div>
                <h3 className="line-clamp-2 text-sm font-semibold text-slate-100">
                  {video.title}
                </h3>
                <p className="mt-1 text-xs text-slate-400">{video.author}</p>
              </div>
              <p className="text-[11px] uppercase tracking-wide text-slate-500">
                {new Date(video.publishedAt).toLocaleString()}
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
