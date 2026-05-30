# clip-queen

Clip Queen is a demo web app that turns a niche + CTA into a set of short-form video generations. It is built to showcase:

- PixVerse video generation (async jobs + polling)
- A “TRAE pipeline” inside the product (storyboard → prompt variants → generation)
- A smooth end-to-end user journey (not just standalone playback)

## Getting Started

### Install

```bash
pnpm install
```

### Environment

Set `PIXVERSE_API_KEY` in your environment (local `.env.local` or Vercel env vars):

```bash
PIXVERSE_API_KEY=your_key_here
```

### Run dev server

```bash
pnpm dev
```

Open:

- `http://localhost:3000/` (landing)
- `http://localhost:3000/studio` (main demo)

## Demo Workflow (Studio)

### 1) Configure inputs

In `/studio`, pick:

- Niche
- Platform
- Videos to generate (1–5)
- CTA text + CTA style

### 2) TRAE pipeline (built into the UI)

Use the TRAE controls to make generations consistently strong and judge-friendly:

- Generate Storyboard: creates a multi-scene structure (Hook → Problem → Reveal → Proof → CTA) and makes each scene editable
- Style Presets: apply a curated aesthetic suffix (e.g. Clean UGC, Cinematic Product, Neon Cyber, Anime Promo, Retro VHS, Luxury Minimal)
- Generate Variants: produces alternate camera/lighting angles for quick iteration
- Efficiency panel: records storyboard + variants generation timings (ms) to demonstrate measurable workflow gain

All of this metadata is included in the Export JSON pack.

## PixVerse Integration

### Generation endpoint

`POST /api/generate`

- Uses PixVerse Platform API to create async text-to-video jobs
- Accepts optional `prompts[]` (per-scene prompts); if present, each generated video uses the matching scene prompt
- Accepts optional `video{ duration, quality, generateAudio, ... }`
- Uses a valid PixVerse `seed` range (0–2147483647)

### Status polling endpoint

`GET /api/pixverse/status?videoId=...`

- Server-side proxy to poll PixVerse job status without exposing the API key
- Client polls every ~4s for PixVerse videos that have `providerId`

### Account/balance endpoint

`GET /api/pixverse/balance`

- Confirms the server-side API key works and returns credit balance info

## Placeholder Videos (MVP Mode)

If PixVerse is unavailable (missing key) or fails, the app can still return playable demo videos.

- The API will use these public files for demo outputs:
  - `public/fitness1.mp4`
  - `public/fitness2.mp4`
  - `public/fitness3.mp4`
  - `public/fitness4.mp4`

In the Studio UI, “Demo fallback” controls whether PixVerse failures fall back to these videos.

## Finalization & Share Page

From the generated list:

- Preview: opens an in-app modal
- Use this clip: saves the selected clip locally and routes to `/v/[id]` to show the clip embedded in a shareable page with CTA overlay

Note: `/v/[id]` is device-local for the MVP (stored in `localStorage`).

## Export Pack

Export JSON includes:

- Input parameters
- Selected clip metadata
- Generated video tasks + URLs (when ready)
- TRAE details: preset, storyboard, scene prompts, variants, timing metrics

## PixVerse CLI + Skills (for agents)

PixVerse CLI uses OAuth device flow and returns structured JSON (`--json`) for agent-friendly pipelines.

### Install & login

```bash
npm install -g pixverse
pixverse auth login --json
pixverse auth status --json
```

### PixVerse Skills library

Repo: https://github.com/PixVerseAI/skills

```bash
git clone https://github.com/PixVerseAI/skills.git
```

Then ask TRAE:

> Please load skills/SKILL.md as the entry point, then guide me through the PixVerse video generation workflow.

## Deploy (Vercel)

- Add `PIXVERSE_API_KEY` in Vercel Project Settings → Environment Variables (Production)
- Redeploy after setting env vars

## Notes

- Do not commit API keys. Use Vercel env vars or local `.env.local`.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
