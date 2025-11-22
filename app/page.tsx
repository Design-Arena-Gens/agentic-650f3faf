import { BlueprintForm } from "@/components/BlueprintForm";
import { ChannelAnalyzer } from "@/components/ChannelAnalyzer";
import { TrendingPanel } from "@/components/TrendingPanel";
import { Rocket, Sparkles, Workflow } from "lucide-react";

const heroHighlights = [
  {
    title: "Automation-native planning",
    description:
      "Blueprint scripts, metadata, and deliverables pulled from a single intelligence brief."
  },
  {
    title: "Signal-driven research",
    description:
      "Monitor trend velocity and channel cadence to inform your automation triggers."
  },
  {
    title: "Launch-ready execution",
    description:
      "Operational sprint board with tasks for humans, bots, and integrations."
  }
];

export default function Home() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 md:py-16">
      <section className="overflow-hidden rounded-3xl border border-slate-800/80 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8 md:p-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-accent">
              <Sparkles className="h-4 w-4" />
              Agentic automation
            </div>
            <h1 className="text-3xl font-bold text-white md:text-5xl">
              Command center for YouTube automation teams
            </h1>
            <p className="text-lg text-slate-300">
              Merge creative strategy, operational checklists, and automation hooks
              into a single workspace. This agent turns raw ideas into a deployable,
              data-backed publishing plan in seconds.
            </p>
            <div className="flex flex-wrap gap-3 text-sm text-slate-300">
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-900/70 px-3 py-1">
                <Rocket className="h-4 w-4 text-accent" />
                Idea → publish automation
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-900/70 px-3 py-1">
                <Workflow className="h-4 w-4 text-accent" />
                SOP & task orchestration
              </span>
            </div>
          </div>
          <div className="grid w-full max-w-sm gap-4 rounded-2xl border border-slate-800/60 bg-slate-900/50 p-6 text-sm text-slate-300">
            {heroHighlights.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-slate-800/60 bg-slate-950/50 p-4"
              >
                <p className="text-sm font-semibold text-slate-100">
                  {item.title}
                </p>
                <p className="mt-2 text-slate-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <BlueprintForm />
      <TrendingPanel />
      <ChannelAnalyzer />
    </main>
  );
}
