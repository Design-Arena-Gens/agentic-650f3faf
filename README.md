## Agentic YouTube Automation

This project is a Next.js 14 application that operates as an automation agent for YouTube creators. It combines trend intelligence, channel analytics, and an automation-first planning assistant to convert raw ideas into production-ready workflows.

### Features
- **Automation Blueprint Assistant** – Turn a creative brief into scripts, retention strategies, deliverables, and automation tasks.
- **Optimization Toolkit** – Generate title variants, descriptions, hashtags, distribution plans, and thumbnail concepts tuned to the brief.
- **Automation Sprint Board** – Lay out human + bot responsibilities with milestone-based execution tasks.
- **Trend Intelligence** – Live RSS integration to monitor regional YouTube trending videos.
- **Channel Health Monitor** – Inspect any public channel feed to infer cadence, velocity, and recent uploads.

### Tech Stack
- Next.js 14 with the App Router
- TypeScript + Zod validation
- Tailwind CSS for styling
- SWR for data fetching
- xml2js for parsing YouTube RSS feeds

### Getting Started
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Lint and Type Check
```bash
npm run lint
npm run typecheck
```

Deploy-ready for Vercel using the provided production command.
