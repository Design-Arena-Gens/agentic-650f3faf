import { z } from "zod";

export const blueprintSchema = z.object({
  topic: z.string().min(3),
  audience: z.string().min(3),
  tone: z.string().default("energetic"),
  goal: z.string().min(3),
  duration: z.number().min(1).max(60),
  contentType: z.enum([
    "tutorial",
    "essay",
    "review",
    "vlog",
    "interview",
    "news"
  ]),
  differentiation: z.string().min(3),
  callToAction: z.string().min(3)
});

export type BlueprintInput = z.infer<typeof blueprintSchema>;

const segmentTemplates: Record<
  BlueprintInput["contentType"],
  { title: string; purpose: string }[]
> = {
  tutorial: [
    { title: "Hook & Problem", purpose: "Surface the pain point immediately." },
    {
      title: "Authority Snapshot",
      purpose: "Show why you can solve this problem better than others."
    },
    {
      title: "Step-by-step Breakdown",
      purpose: "Guide viewers through concise, actionable steps."
    },
    {
      title: "Power Tips",
      purpose: "Add bonus insights to create differentiation."
    },
    {
      title: "Summary & CTA",
      purpose: "Recap the win and drive action to your chosen CTA."
    }
  ],
  essay: [
    { title: "Narrative Hook", purpose: "Open with a personal or cultural story." },
    {
      title: "Context & Stakes",
      purpose: "Explain why the topic matters right now."
    },
    {
      title: "Core Argument",
      purpose: "Deliver the main thesis backed by data or anecdotes."
    },
    {
      title: "Counterpoints",
      purpose: "Address opposing views to build trust."
    },
    {
      title: "Resolution & CTA",
      purpose: "Tie the narrative together and channel momentum."
    }
  ],
  review: [
    {
      title: "Unboxing & First Impressions",
      purpose: "Frame authenticity by reacting in real time."
    },
    {
      title: "Feature Deep Dive",
      purpose: "Break down standout features with macro/micro shots."
    },
    { title: "Performance Tests", purpose: "Show raw proof for your claims." },
    {
      title: "Pros, Cons & Alternatives",
      purpose: "De-risk the purchase for the viewer."
    },
    {
      title: "Verdict & CTA",
      purpose: "Clarify who should buy and outline next steps."
    }
  ],
  vlog: [
    {
      title: "Set the Scene",
      purpose: "Transport viewers into your world instantly."
    },
    {
      title: "Micro-narratives",
      purpose: "Layer mini-stories to maintain engagement."
    },
    {
      title: "Behind-the-scenes Moment",
      purpose: "Expose authenticity and relatability."
    },
    {
      title: "Value Drop",
      purpose: "Add insights, tips, or lessons learned."
    },
    {
      title: "Wrap & CTA",
      purpose: "Land the emotional beat and drive the CTA."
    }
  ],
  interview: [
    {
      title: "Magnetic Intro",
      purpose: "Explain why this guest matters in one sentence."
    },
    {
      title: "Signature Story",
      purpose: "Let the guest retell the pivotal moment in their journey."
    },
    {
      title: "Contrarian Take",
      purpose: "Extract an opinion that challenges the status quo."
    },
    {
      title: "Rapid-fire Insights",
      purpose: "Deliver quick wins to satisfy impatient viewers."
    },
    {
      title: "Actionable Wrap",
      purpose: "Summarize key insights and direct viewers to the CTA."
    }
  ],
  news: [
    {
      title: "Headline & Impact",
      purpose: "Deliver the core update and why it matters."
    },
    {
      title: "Context Snapshot",
      purpose: "Add history or data viewers need to understand the story."
    },
    {
      title: "Expert Reactions",
      purpose: "Reference authoritative quotes or sources."
    },
    {
      title: "Implications",
      purpose: "Explain who benefits and who loses."
    },
    {
      title: "Next Steps & CTA",
      purpose: "Tell viewers what to watch for next."
    }
  ]
};

const actionPlaybook = [
  "Schedule publish date with buffer for quality control.",
  "Auto-generate community post teaser 12 hours before launch.",
  "Prepare Shorts cut-down with dynamic captioning for TikTok/IG.",
  "Trigger newsletter snippet with key quotes and CTA links.",
  "Queue end-screen updates across relevant evergreen videos.",
  "Push metadata update to Notion or Airtable content calendar."
];

const keywordClusters = [
  "tutorial",
  "beginners",
  "2024",
  "step by step",
  "review",
  "comparison",
  "ultimate guide",
  "best practices",
  "strategy",
  "growth hacks"
];

export function generateVideoBlueprint(input: BlueprintInput) {
  const validated = blueprintSchema.parse(input);

  const segments = segmentTemplates[validated.contentType].map(
    ({ title, purpose }) => ({
      title,
      purpose,
      talkingPoints: buildTalkingPoints(title, validated)
    })
  );

  return {
    hook: buildHook(validated),
    differentiator: validated.differentiation,
    segments,
    callToAction: validated.callToAction,
    retentionDevices: buildRetentionDevices(validated),
    deliverables: buildDeliverables(validated),
    metadata: {
      primaryKeyword: buildPrimaryKeyword(validated),
      supportingKeywords: buildSupportingKeywords(validated),
      durationEstimate: `${validated.duration} minutes`
    }
  };
}

function buildHook(input: BlueprintInput) {
  const personas = input.audience.split(",").map((s) => s.trim());
  const persona = personas[0] || input.audience;
  return `If you're a ${persona} trying to ${input.goal}, this ${input.contentType} will show you how to do it in ${input.duration} minutes without the usual headaches.`;
}

function buildTalkingPoints(sectionTitle: string, input: BlueprintInput) {
  const base = [
    `Frame the ${input.topic} through the lens of ${input.audience}.`,
    `Lean into a ${input.tone} delivery to maintain energy.`,
    `Reinforce the end goal: ${input.goal}.`
  ];

  const sectionSpecific = {
    Hook: [`Open with an unexpected data point around ${input.topic}.`],
    Authority: [
      `Show proof that your approach to ${input.topic} has delivered measurable wins.`
    ],
    "Step-by-step": [
      `Break the process into ${Math.min(5, Math.max(3, Math.round(input.duration / 3)))} cognitive steps.`
    ],
    Tips: [`Drop a tactic that directly addresses ${input.differentiation}.`],
    Summary: [`Tie back to ${input.callToAction} within 10 seconds.`]
  };

  const matches = Object.entries(sectionSpecific).flatMap(([key, items]) =>
    sectionTitle.includes(key) ? items : []
  );

  return [...base, ...matches];
}

function buildRetentionDevices(input: BlueprintInput) {
  return [
    "Pattern interrupts every 45 seconds using B-roll or overlay text.",
    "Use chapter markers aligned with the major segments.",
    `Pre-frame the payoff of ${input.goal} before each section.`,
    "Spatial audio cues for critical moments.",
    "On-screen progress tracker for the steps."
  ];
}

function buildDeliverables(input: BlueprintInput) {
  return [
    "Main video edit (4K, 24fps).",
    "Vertical short (60s) featuring the strongest hook moment.",
    "Thumbnail concept board with three iterations.",
    "Metadata spreadsheet with keywords and timestamps.",
    `Automation checklist covering publishing workflow for ${input.topic}.`
  ];
}

function buildPrimaryKeyword(input: BlueprintInput) {
  return `${input.topic} ${input.contentType} for ${input.audience}`.toLowerCase();
}

function buildSupportingKeywords(input: BlueprintInput) {
  const topicKeywords = input.topic
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .slice(0, 3);

  const dynamic = keywordClusters.slice(0, 5).map((k) => `${input.topic} ${k}`);

  return [...dynamic, ...topicKeywords];
}

export function generateOptimizationToolkit(input: BlueprintInput) {
  const validated = blueprintSchema.parse(input);

  const titleVariants = [
    `Stop wasting time on ${validated.topic}: do this instead`,
    `${validated.topic} in ${validated.duration} minutes (${validated.tone} guide)`,
    `The ${validated.topic} roadmap ${validated.audience} asked for`,
    `${validated.topic} secrets for ${validated.goal}`
  ];

  const segmentCount = segmentTemplates[validated.contentType].length;

  const descriptions = [
    `In this ${validated.contentType}, we go deep on ${validated.topic}. Designed for ${validated.audience}, you will learn how to ${validated.goal}. Stay to the end for a surprise resource.`,
    `This ${validated.tone} walkthrough gives you the exact playbook to master ${validated.topic}. Download the companion checklist here: <add link>.`,
    `Chapters:\n${buildChapters(segmentCount)}`
  ];

  const hashtags = [
    `#${validated.topic.replace(/\s+/g, "")}`,
    `#${validated.goal.replace(/\s+/g, "")}`,
    "#youtubeautomation",
    "#contentstrategy",
    "#creatorworkflow"
  ];

  const automationOps = actionPlaybook.map((item, idx) => ({
    id: `op-${idx}`,
    description: item,
    owner: idx % 2 === 0 ? "Creator" : "Automation Bot",
    tooling:
      idx % 3 === 0
        ? "Zapier → Google Sheets"
        : idx % 3 === 1
          ? "Make.com → Notion"
          : "Airtable Script → Slack"
  }));

  const thumbnailConcepts = [
    {
      title: "Split Screen Transformation",
      concept:
        "Left side = chaos, right side = your streamlined solution. Bold typography with 3-word limit.",
      colorPalette: ["#030712", "#7c3aed", "#facc15"]
    },
    {
      title: "Face + Overlay Metric",
      concept:
        "Close-up expressive face with oversized metric overlay (e.g., +327% Views).",
      colorPalette: ["#020617", "#38bdf8", "#22d3ee"]
    },
    {
      title: "Blueprint Aesthetic",
      concept:
        "Isometric grid with line-art icons guiding the viewer through automation steps.",
      colorPalette: ["#f1f5f9", "#2563eb", "#f97316"]
    }
  ];

  return {
    titles: titleVariants,
    descriptions,
    hashtags,
    automationOps,
    thumbnailConcepts,
    distributionPlan: buildDistributionPlan(validated)
  };
}

function buildChapters(count: number) {
  return Array.from({ length: count }, (_, index) => {
    const timestamp = `${String(index).padStart(2, "0")}:${
      index === 0 ? "00" : "30"
    }`;
    return `${timestamp} Part ${index + 1}`;
  }).join("\n");
}

function buildDistributionPlan(input: BlueprintInput) {
  return [
    {
      platform: "YouTube",
      action: "Publish main video with pinned comment linking to resource.",
      timing: "Day 0"
    },
    {
      platform: "YouTube Shorts",
      action:
        "Upload teaser extracted from hook with auto captions and CTA sticker.",
      timing: "Day 1"
    },
    {
      platform: "Newsletter",
      action:
        "Send summary with top 3 insights and embed GIF of transformation.",
      timing: "Day 2"
    },
    {
      platform: "Twitter/X",
      action:
        "Thread distilling each segment with visual carousel. Link to video at end.",
      timing: "Day 2"
    },
    {
      platform: "LinkedIn",
      action:
        "Long-form post targeting professionals who match: " + input.audience,
      timing: "Day 3"
    }
  ];
}

export function generateSprintBoard(input: BlueprintInput) {
  const validated = blueprintSchema.parse(input);
  const segments = segmentTemplates[validated.contentType];

  return {
    kickoff: {
      milestone: "Pre-production Alignment",
      tasks: [
        "Define success metrics & north star KPI.",
        `Lock creative angle emphasizing "${validated.differentiation}".`,
        "Assign automation tasks and QA owners."
      ]
    },
    production: segments.map((segment, idx) => ({
      id: `segment-${idx}`,
      title: segment.title,
      tasks: [
        `Script block focusing on ${segment.purpose.toLowerCase()}.`,
        "Capture supporting B-roll and overlay assets.",
        "Log timestamps and highlights for metadata pass."
      ]
    })),
    wrapUp: {
      milestone: "Distribution Follow-up",
      tasks: [
        "Monitor first 48 hours analytics; capture retention graph.",
        "Trigger iterative thumbnail test using A/B experimentation.",
        "Archive SOP updates in knowledge base."
      ]
    }
  };
}
