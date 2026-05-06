'use client';

interface ProgressRingProps {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
}

export default function ProgressRing({
  value,
  max,
  size = 56,
  strokeWidth = 5,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = max > 0 ? value / max : 0;
  const dashOffset = circumference * (1 - progress);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#EDE9FE"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#7C3AED"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      <span className="absolute text-xs font-bold text-primary">
        {value}/{max}
      </span>
    </div>
  );
}
