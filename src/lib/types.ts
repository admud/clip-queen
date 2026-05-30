export type Platform = "tiktok" | "instagram" | "youtube";

export type CtaStyle = "bottomBanner" | "cornerWatermark";

export type Cta = {
  text: string;
  style: CtaStyle;
};

export type Clip = {
  id: string;
  niche: string;
  title: string;
  handle: string;
  durationSeconds: number;
  views: number;
  likes: number;
};

export type ScheduleItem = {
  id: string;
  dayOffset: number;
  dayLabel: string;
  platform: Platform;
  time: string;
  clipId: string;
  caption: string;
  cta: Cta;
};

export type ScheduleInput = {
  niche: string;
  platforms: Platform[];
  postsPerDay: number;
  clipId: string;
  cta: Cta;
};

export type ScheduleResponse = {
  items: ScheduleItem[];
};

export type GenerateInput = ScheduleInput & {
  prompt: string;
  ctaPrompt: string;
};

export type GeneratedVideoProvider = "demo" | "pixverse";

export type GeneratedVideoStatus =
  | "queued"
  | "generating"
  | "ready"
  | "failed"
  | "moderation_failed";

export type GeneratedVideo = {
  id: string;
  platform: Platform;
  provider: GeneratedVideoProvider;
  providerId: string | null;
  status: GeneratedVideoStatus;
  url: string | null;
  error?: {
    httpStatus?: number;
    code?: number | null;
    message?: string | null;
  };
  prompt: string;
  ctaPrompt: string;
  cta: Cta;
};

export type GenerateResponse = {
  schedule: ScheduleItem[];
  videos: GeneratedVideo[];
};
