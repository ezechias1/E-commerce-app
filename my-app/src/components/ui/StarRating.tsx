import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  reviewCount?: number;
  size?: "sm" | "md";
  className?: string;
}

export default function StarRating({ rating, reviewCount, size = "sm", className }: StarRatingProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = rating >= star;
          const half = !filled && rating >= star - 0.5;
          return (
            <svg
              key={star}
              className={cn(
                filled ? "text-yellow-400" : half ? "text-yellow-400" : "text-gray-300 dark:text-gray-600",
                size === "sm" ? "w-4 h-4" : "w-5 h-5"
              )}
              fill={filled ? "currentColor" : half ? "currentColor" : "none"}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {half ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 2l2.09 6.26L21 9.27l-5 3.92L17.18 22 12 18.27 6.82 22 8 13.19 3 9.27l6.91-1.01L12 2z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              )}
            </svg>
          );
        })}
      </div>
      {reviewCount !== undefined && (
        <span className={cn("text-gray-500 dark:text-gray-400", size === "sm" ? "text-xs" : "text-sm")}>
          ({reviewCount.toLocaleString()})
        </span>
      )}
    </div>
  );
}
