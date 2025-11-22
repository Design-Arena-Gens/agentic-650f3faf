/*
  This module powers the automation agent form that translates creator intent into
  structured deliverables, metadata, and execution checklists.
*/
"use client";

import { FormEvent, useMemo, useState } from "react";
import { BrainCircuit, ClipboardList, Workflow, WandSparkles } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import {
  BlueprintInput,
  blueprintSchema,
  generateOptimizationToolkit,
  generateSprintBoard,
  generateVideoBlueprint
} from "@/lib/automation";
import { cn } from "@/lib/utils";

const defaultValues: BlueprintInput = {
  topic: "AI automations for YouTube growth",
  audience: "busy solo creators",
  tone: "fast-paced",
  goal: "ship consistent videos each week",
  duration: 12,
  contentType: "tutorial",
  differentiation: "zero fluff, automation-first approach",
  callToAction: "Grab the automation toolkit in description"
};

type GeneratedPayload = {
  blueprint: ReturnType<typeof generateVideoBlueprint>;
  optimization: ReturnType<typeof generateOptimizationToolkit>;
  sprint: ReturnType<typeof generateSprintBoard>;
};

export function BlueprintForm() {
  const [formState, setFormState] = useState<BlueprintInput>(defaultValues);
  const [payload, setPayload] = useState<GeneratedPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sections = useMemo(
    () => [
      {
        id: "blueprint",
        title: "Video blueprint",
        icon: <BrainCircuit className="h-4 w-4" />
      },
      {
        id: "optimization",
        title: "Optimization toolkit",
        icon: <WandSparkles className="h-4 w-4" />
      },
      {
        id: "sprint",
        title: "Automation sprint",
        icon: <Workflow className="h-4 w-4" />
      }
    ],
    []
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    try {
      const parsed = blueprintSchema.parse(formState);
      const blueprint = generateVideoBlueprint(parsed);
      const optimization = generateOptimizationToolkit(parsed);
      const sprint = generateSprintBoard(parsed);
      setPayload({ blueprint, optimization, sprint });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid input");
    }
  }

  return (
    <section className="glass rounded-2xl p-6">
      <SectionHeader
        title="Automation blueprint assistant"
        subtitle="Transform an idea into scripts, assets, metadata, and execution tasks with one click."
        icon={<ClipboardList className="h-5 w-5" />}
      />

      <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
        <TextField
          label="Video topic"
          value={formState.topic}
          onChange={(value) => setFormState((prev) => ({ ...prev, topic: value }))}
        />
        <TextField
          label="Target audience"
          value={formState.audience}
          onChange={(value) =>
            setFormState((prev) => ({ ...prev, audience: value }))
          }
        />
        <TextField
          label="Delivery tone"
          value={formState.tone}
          onChange={(value) => setFormState((prev) => ({ ...prev, tone: value }))}
        />
        <TextField
          label="Primary goal"
          value={formState.goal}
          onChange={(value) => setFormState((prev) => ({ ...prev, goal: value }))}
        />
        <NumberField
          label="Target duration (minutes)"
          value={formState.duration}
          onChange={(value) =>
            setFormState((prev) => ({ ...prev, duration: value }))
          }
        />
        <SelectField
          label="Content type"
          value={formState.contentType}
          onChange={(value) =>
            setFormState((prev) => ({ ...prev, contentType: value }))
          }
          options={[
            { label: "Tutorial", value: "tutorial" },
            { label: "Essay", value: "essay" },
            { label: "Review", value: "review" },
            { label: "Vlog", value: "vlog" },
            { label: "Interview", value: "interview" },
            { label: "News", value: "news" }
          ]}
        />
        <TextField
          label="Differentiation angle"
          value={formState.differentiation}
          onChange={(value) =>
            setFormState((prev) => ({ ...prev, differentiation: value }))
          }
        />
        <TextArea
          label="Call to action"
          value={formState.callToAction}
          onChange={(value) =>
            setFormState((prev) => ({ ...prev, callToAction: value }))
          }
        />

        <div className="md:col-span-2 flex items-center justify-between rounded-xl border border-slate-800/70 bg-slate-900/50 px-4 py-3 text-xs text-slate-400">
          <span>
            Fill out the brief, hit generate, and the agent will output deliverables and
            automation tasks tailored to your inputs.
          </span>
          <button
            type="submit"
            className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-pink-500"
          >
            Generate system
          </button>
        </div>
      </form>

      {error && (
        <p className="mt-4 rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">
          {error}
        </p>
      )}

      {payload && (
        <div className="mt-8 space-y-8">
          {sections.map((section) => (
            <div key={section.id} className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-5">
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                {section.icon}
                {section.title}
              </div>
              {section.id === "blueprint" && <BlueprintPanel data={payload.blueprint} />}
              {section.id === "optimization" && (
                <OptimizationPanel data={payload.optimization} />
              )}
              {section.id === "sprint" && <SprintPanel data={payload.sprint} />}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function TextField({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex flex-col text-sm">
      <span className="mb-2 text-xs uppercase tracking-[0.2em] text-slate-400">
        {label}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-xl border border-slate-800/70 bg-slate-900/60 px-4 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
      />
    </label>
  );
}

function NumberField({
  label,
  value,
  onChange
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="flex flex-col text-sm">
      <span className="mb-2 text-xs uppercase tracking-[0.2em] text-slate-400">
        {label}
      </span>
      <input
        type="number"
        value={value}
        min={1}
        max={60}
        onChange={(event) => onChange(Number(event.target.value))}
        className="rounded-xl border border-slate-800/70 bg-slate-900/60 px-4 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options
}: {
  label: string;
  value: BlueprintInput["contentType"];
  onChange: (value: BlueprintInput["contentType"]) => void;
  options: { value: BlueprintInput["contentType"]; label: string }[];
}) {
  return (
    <label className="flex flex-col text-sm">
      <span className="mb-2 text-xs uppercase tracking-[0.2em] text-slate-400">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value as BlueprintInput["contentType"])
        }
        className="rounded-xl border border-slate-800/70 bg-slate-900/60 px-4 py-2 text-sm text-slate-200 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-slate-900">
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex flex-col text-sm md:col-span-2">
      <span className="mb-2 text-xs uppercase tracking-[0.2em] text-slate-400">
        {label}
      </span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={3}
        className="rounded-xl border border-slate-800/70 bg-slate-900/60 px-4 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
      />
    </label>
  );
}

function BlueprintPanel({
  data
}: {
  data: ReturnType<typeof generateVideoBlueprint>;
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-800/70 bg-slate-950/60 p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
          Hook
        </p>
        <p className="mt-2 text-sm text-slate-100">{data.hook}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {data.segments.map((segment) => (
          <div
            key={segment.title}
            className="rounded-xl border border-slate-800/60 bg-slate-900/50 p-4 text-sm"
          >
            <p className="text-sm font-semibold text-slate-200">
              {segment.title}
            </p>
            <p className="mt-1 text-xs text-slate-400">{segment.purpose}</p>
            <ul className="mt-3 space-y-2 text-slate-300">
              {segment.talkingPoints.map((point) => (
                <li key={point} className="flex gap-2">
                  <span className="text-accent">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <InfoCard
          title="Differentiation"
          items={[data.differentiator]}
          tone="accent"
        />
        <InfoCard title="Retention devices" items={data.retentionDevices} />
        <InfoCard title="Deliverables" items={data.deliverables} />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <InfoCard
          title="Primary keyword"
          items={[data.metadata.primaryKeyword]}
        />
        <InfoCard
          title="Supporting keywords"
          items={data.metadata.supportingKeywords}
        />
        <InfoCard
          title="Estimated runtime"
          items={[data.metadata.durationEstimate]}
        />
      </div>
    </div>
  );
}

function OptimizationPanel({
  data
}: {
  data: ReturnType<typeof generateOptimizationToolkit>;
}) {
  return (
    <div className="space-y-6 text-sm">
      <InfoCard title="Title variations" items={data.titles} tone="accent" />
      <InfoCard title="Descriptions & notes" items={data.descriptions} />
      <InfoCard title="Hashtags" items={data.hashtags} />

      <div className="grid gap-4 md:grid-cols-3">
        {data.thumbnailConcepts.map((concept) => (
          <div
            key={concept.title}
            className="rounded-xl border border-slate-800/60 bg-slate-900/50 p-4"
          >
            <p className="text-sm font-semibold text-slate-200">
              {concept.title}
            </p>
            <p className="mt-2 text-slate-300">{concept.concept}</p>
            <div className="mt-3 flex gap-2">
              {concept.colorPalette.map((color) => (
                <span
                  key={color}
                  className="h-6 w-6 rounded-full border border-slate-800/80"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-800/60 bg-slate-900/50 p-4">
          <p className="text-sm font-semibold text-slate-200">Automation ops</p>
          <ul className="mt-3 space-y-3 text-slate-300">
            {data.automationOps.map((item) => (
              <li key={item.id} className="rounded-lg border border-slate-800/60 bg-slate-950/50 p-3">
                <p className="font-medium text-slate-200">{item.description}</p>
                <p className="mt-1 text-xs text-slate-400">
                  Owner: <span className="text-slate-200">{item.owner}</span> · Tooling:{" "}
                  <span className="text-slate-200">{item.tooling}</span>
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-slate-800/60 bg-slate-900/50 p-4">
          <p className="text-sm font-semibold text-slate-200">
            Distribution plan
          </p>
          <ul className="mt-3 space-y-3 text-slate-300">
            {data.distributionPlan.map((item) => (
              <li key={item.platform} className="rounded-lg border border-slate-800/60 bg-slate-950/50 p-3">
                <p className="font-medium text-slate-200">
                  {item.platform} — {item.timing}
                </p>
                <p className="text-sm text-slate-300">{item.action}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function SprintPanel({
  data
}: {
  data: ReturnType<typeof generateSprintBoard>;
}) {
  return (
    <div className="space-y-6 text-sm">
      <div className="rounded-xl border border-slate-800/60 bg-slate-900/50 p-4">
        <p className="text-sm font-semibold text-slate-200">
          {data.kickoff.milestone}
        </p>
        <ul className="mt-3 space-y-2 text-slate-300">
          {data.kickoff.tasks.map((task) => (
            <li key={task} className="flex gap-2">
              <span className="text-accent">•</span>
              <span>{task}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {data.production.map((segment) => (
          <div
            key={segment.id}
            className="rounded-xl border border-slate-800/60 bg-slate-900/50 p-4"
          >
            <p className="text-sm font-semibold text-slate-200">
              {segment.title}
            </p>
            <ul className="mt-3 space-y-2 text-slate-300">
              {segment.tasks.map((task) => (
                <li key={task} className="flex gap-2">
                  <span className="text-accent">•</span>
                  <span>{task}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-800/60 bg-slate-900/50 p-4">
        <p className="text-sm font-semibold text-slate-200">
          {data.wrapUp.milestone}
        </p>
        <ul className="mt-3 space-y-2 text-slate-300">
          {data.wrapUp.tasks.map((task) => (
            <li key={task} className="flex gap-2">
              <span className="text-accent">•</span>
              <span>{task}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function InfoCard({
  title,
  items,
  tone
}: {
  title: string;
  items: string[];
  tone?: "accent";
}) {
  return (
    <div
      className={cn(
        "rounded-xl border p-4",
        tone === "accent"
          ? "border-accent/40 bg-accent/10 text-accent"
          : "border-slate-800/60 bg-slate-900/50 text-slate-200"
      )}
    >
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{title}</p>
      <ul className="mt-3 space-y-2 text-sm">
        {items.map((item) => (
          <li key={item} className="text-slate-200">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
