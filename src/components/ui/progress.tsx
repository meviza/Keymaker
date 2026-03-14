import * as React from "react";

export function Progress({
  value = 0,
  className = "",
}: {
  value?: number;
  className?: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className={`relative h-2 w-full overflow-hidden rounded-full bg-white/10 ${className}`}>
      <div
        className="h-full rounded-full bg-cyan-400 transition-all duration-500"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
