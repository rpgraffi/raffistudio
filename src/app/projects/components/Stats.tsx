"use client";

import React from "react";

interface StatItemProps {
  value: string;
  label: string;
  className?: string;
}

export const StatItem: React.FC<StatItemProps> = ({
  value,
  label,
  className = "",
}) => {
  return (
    <div className={`flex flex-col gap-1 min-w-[120px] ${className}`}>
      <span className="font-sentient text-4xl md:text-5xl font-bold text-zinc-900">
        {value}
      </span>
      <span className="text-zinc-600 font-medium">{label}</span>
    </div>
  );
};

interface StatsRowProps {
  stats: { value: string; label: string }[];
  className?: string;
}

export const StatsRow: React.FC<StatsRowProps> = ({
  stats,
  className = "",
}) => {
  return (
    <div
      className={`flex gap-12 md:gap-16 overflow-x-auto pb-4 scrollbar-hide ${className}`}
    >
      {stats.map((stat, index) => (
        <StatItem key={index} value={stat.value} label={stat.label} />
      ))}
    </div>
  );
};
