"use client";

import type { ScheduleItem } from "@/lib/types";

type Props = {
  schedule: ScheduleItem[] | null;
  postsPerDay: number;
};

export function ScheduleOutput({ schedule, postsPerDay }: Props) {
  if (!schedule?.length) {
    return (
      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <div className="text-sm font-semibold text-white">Schedule</div>
        <div className="mt-2 text-sm text-white/60">
          Generate a plan to see a 7-day schedule ({postsPerDay} posts/day).
        </div>
      </section>
    );
  }

  const grouped = schedule.reduce<Record<string, ScheduleItem[]>>((acc, item) => {
    const key = item.dayLabel;
    acc[key] ??= [];
    acc[key].push(item);
    return acc;
  }, {});

  const days = Object.keys(grouped);

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-white">Schedule</div>
          <div className="mt-1 text-xs text-white/60">{schedule.length} posts total</div>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        {days.map((day) => (
          <div key={day} className="rounded-2xl border border-white/10 bg-black/10 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-white/70">{day}</div>
            <div className="mt-3 space-y-2">
              {grouped[day]!.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"
                >
                  <div>
                    <div className="text-sm font-semibold text-white">
                      {item.platform.toUpperCase()} · {item.time}
                    </div>
                    <div className="mt-1 text-xs text-white/60">{item.caption}</div>
                  </div>
                  <div className="shrink-0 rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">
                    {item.cta.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

