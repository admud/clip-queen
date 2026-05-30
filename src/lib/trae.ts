import type { Cta, StoryboardScene } from "@/lib/types";

export type StylePreset = {
  id: string;
  name: string;
  promptSuffix: string;
};

export const stylePresets: StylePreset[] = [
  {
    id: "ugc_clean",
    name: "Clean UGC",
    promptSuffix:
      "Realistic handheld phone video, natural indoor lighting, shallow depth of field, clean skin tones, subtle film grain, smooth motion, no text, no subtitles, no watermark.",
  },
  {
    id: "cinematic_product",
    name: "Cinematic Product",
    promptSuffix:
      "Cinematic commercial, dramatic rim light, soft volumetric lighting, glossy highlights, slow dolly-in, sharp focus, premium look, no text, no subtitles, no watermark.",
  },
  {
    id: "neon_cyber",
    name: "Neon Cyber",
    promptSuffix:
      "Neon cyberpunk aesthetic, high contrast lighting, reflective wet streets, vibrant bokeh, energetic camera movement, crisp details, no text, no subtitles, no watermark.",
  },
  {
    id: "anime_promo",
    name: "Anime Promo",
    promptSuffix:
      "High-quality anime style, clean linework, dynamic camera, vivid color grading, expressive motion, no text, no subtitles, no watermark.",
  },
  {
    id: "retro_vhs",
    name: "Retro VHS",
    promptSuffix:
      "Retro VHS camcorder look, slight chromatic aberration, scanlines, subtle tape noise, warm color cast, handheld movement, no text, no subtitles, no watermark.",
  },
  {
    id: "luxury_minimal",
    name: "Luxury Minimal",
    promptSuffix:
      "Minimal luxury aesthetic, soft studio lighting, clean background, precise product framing, slow camera movement, high-end brand feel, no text, no subtitles, no watermark.",
  },
];

export function getStylePreset(id: string | undefined) {
  return stylePresets.find((p) => p.id === id) ?? stylePresets[0]!;
}

export function generateStoryboard({
  niche,
  cta,
  count,
}: {
  niche: string;
  cta: Cta;
  count: number;
}): StoryboardScene[] {
  const uuid =
    typeof globalThis.crypto?.randomUUID === "function"
      ? () => globalThis.crypto.randomUUID()
      : () => `${Date.now()}_${Math.random().toString(16).slice(2)}`;

  const safeCount = Math.max(1, Math.min(5, Math.round(count)));
  const hook = `Hook: stop-scrolling moment about ${niche}.`;
  const problem = `Problem: the pain point creators face in ${niche}.`;
  const reveal = `Reveal: a simple solution that feels instantly actionable.`;
  const proof = `Proof: quick before/after, speed, or social proof.`;
  const ctaScene = `CTA: ${cta.text} with a clear tap-to-act moment.`;

  const pool = [
    { title: "Hook", prompt: hook },
    { title: "Problem", prompt: problem },
    { title: "Reveal", prompt: reveal },
    { title: "Proof", prompt: proof },
    { title: "CTA", prompt: ctaScene },
  ];

  const selected = pool.slice(0, safeCount);
  return selected.map((s, idx) => ({
    id: `sc_${idx + 1}_${uuid()}`,
    title: s.title,
    prompt: s.prompt,
  }));
}

export function buildScenePrompt({
  scene,
  presetId,
  basePrompt,
  ctaPrompt,
}: {
  scene: StoryboardScene;
  presetId?: string;
  basePrompt: string;
  ctaPrompt: string;
}) {
  const preset = getStylePreset(presetId);
  const parts = [
    basePrompt.trim() ? basePrompt.trim() : null,
    scene.prompt.trim() ? scene.prompt.trim() : null,
    ctaPrompt.trim() ? ctaPrompt.trim() : null,
    preset.promptSuffix.trim() ? preset.promptSuffix.trim() : null,
  ].filter(Boolean) as string[];

  return parts.join("\n");
}

export function generatePromptVariants({
  prompt,
  count,
}: {
  prompt: string;
  count: number;
}) {
  const safeCount = Math.max(1, Math.min(3, Math.round(count)));
  const angles = [
    "Close-up, shallow depth of field.",
    "Wide establishing shot, strong composition.",
    "Low-angle hero shot, dramatic lighting.",
  ];

  return Array.from({ length: safeCount }).map((_, i) => {
    const angle = angles[i] ?? angles[0]!;
    return `${prompt}\n\nVariation: ${angle}`;
  });
}
