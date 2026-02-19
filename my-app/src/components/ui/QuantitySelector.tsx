"use client";

import { cn } from "@/lib/utils";

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

export default function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  className,
}: QuantitySelectorProps) {
  return (
    <div className={cn("flex items-center border border-gray-300 dark:border-gray-600 rounded-lg", className)}>
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="px-3 py-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 transition-colors rounded-l-lg cursor-pointer"
        aria-label="Decrease quantity"
      >
        -
      </button>
      <span className="px-4 py-1.5 text-sm font-medium text-center min-w-[40px] border-x border-gray-300 dark:border-gray-600 dark:text-white">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="px-3 py-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 transition-colors rounded-r-lg cursor-pointer"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
