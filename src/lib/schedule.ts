import type { ScheduleInput, ScheduleItem } from "@/lib/types";

const defaultTimes = ["10:00", "13:00", "16:00", "19:00", "21:00"];

function dayLabel(dayOffset: number) {
  if (dayOffset === 0) return "Day 1";
  return `Day ${dayOffset + 1}`;
}

export function generateSchedule(input: ScheduleInput): ScheduleItem[] {
  const days = 7;
  const perDay = Math.max(1, Math.min(6, Math.floor(input.postsPerDay)));
  const platforms: ScheduleInput["platforms"] = input.platforms.length ? input.platforms : ["tiktok"];

  const items: ScheduleItem[] = [];
  let cursor = 0;

  for (let day = 0; day < days; day += 1) {
    for (let i = 0; i < perDay; i += 1) {
      const platform = platforms[cursor % platforms.length]!;
      cursor += 1;

      const time = defaultTimes[i] ?? defaultTimes[defaultTimes.length - 1]!;

      items.push({
        id: `s_${day}_${i}_${platform}`,
        dayOffset: day,
        dayLabel: dayLabel(day),
        platform,
        time,
        clipId: input.clipId,
        caption: `${input.niche}: post ${i + 1} (${platform})`,
        cta: input.cta,
      });
    }
  }

  return items;
}
