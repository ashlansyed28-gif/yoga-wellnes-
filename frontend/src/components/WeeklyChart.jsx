import React from 'react';

export default function WeeklyChart({ daysData = [] }) {
  // Default 7 days representation
  const defaultDays = [
    { day: 'Mon', minutes: 20, active: true },
    { day: 'Tue', minutes: 15, active: true },
    { day: 'Wed', minutes: 25, active: true },
    { day: 'Thu', minutes: 0, active: false },
    { day: 'Fri', minutes: 30, active: true },
    { day: 'Sat', minutes: 20, active: true },
    { day: 'Sun', minutes: 10, active: true }
  ];

  const data = daysData.length === 7 ? daysData : defaultDays;
  const maxMinutes = Math.max(...data.map((d) => d.minutes || 0), 30);

  return (
    <div className="w-full">
      <div className="flex items-end justify-between gap-2 h-36 pt-4 pb-2 px-1">
        {data.map((item, index) => {
          const heightPercent = Math.max(8, Math.round(((item.minutes || 0) / maxMinutes) * 100));
          const isToday = index === new Date().getDay() - 1 || (index === 6 && new Date().getDay() === 0);

          return (
            <div key={item.day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
              <span className="text-[10px] text-stone-400 group-hover:text-sage-700 opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
                {item.minutes}m
              </span>

              <div className="w-full max-w-[28px] bg-sage-100 rounded-t-lg overflow-hidden flex flex-col justify-end h-full">
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full rounded-t-lg transition-all duration-700 ease-out ${
                    item.minutes > 0
                      ? isToday
                        ? 'bg-gradient-to-t from-sage-700 to-sage-500 shadow-sm'
                        : 'bg-gradient-to-t from-sage-500 to-sage-400'
                      : 'bg-transparent'
                  }`}
                />
              </div>

              <span
                className={`text-[11px] font-semibold tracking-tight transition-colors ${
                  isToday ? 'text-sage-900 font-bold' : 'text-stone-500'
                }`}
              >
                {item.day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
