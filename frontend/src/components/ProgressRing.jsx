import React from 'react';

export default function ProgressRing({
  radius = 45,
  stroke = 7,
  progress = 70,
  label = 'Completed',
  centerText = '',
  color = '#5e8663',
  trackColor = '#e5ede5'
}) {
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, progress)) / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center">
        <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
          <circle
            stroke={trackColor}
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke={color}
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.8s ease-in-out' }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-serif text-lg font-bold text-stone-800">
            {centerText || `${Math.round(progress)}%`}
          </span>
        </div>
      </div>
      {label && <span className="text-[11px] font-semibold text-stone-500 mt-2">{label}</span>}
    </div>
  );
}
