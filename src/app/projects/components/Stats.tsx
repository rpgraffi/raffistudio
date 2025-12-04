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
    <div
      className={`flex flex-col gap-1 shrink-0 ${className}`}
    >
      <span className="font-sentient text-4xl md:text-6xl font-medium">
        {value}
      </span>
      <span className="text-xl md:text-2xl font-regular">{label}</span>
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
      className={`flex gap-12 md:gap-16 overflow-x-auto scrollbar-hide ${className}`}
    >
      {stats.map((stat, index) => (
        <StatItem key={index} value={stat.value} label={stat.label} />
      ))}
    </div>
  );
};
