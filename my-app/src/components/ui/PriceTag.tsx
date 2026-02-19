import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";

interface PriceTagProps {
  price: number;
  salePrice?: number | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function PriceTag({ price, salePrice, size = "md", className }: PriceTagProps) {
  const hasSale = salePrice !== null && salePrice !== undefined;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {hasSale ? (
        <>
          <span
            className={cn("font-bold text-red-600 dark:text-red-400", {
              "text-sm": size === "sm",
              "text-lg": size === "md",
              "text-2xl": size === "lg",
            })}
          >
            {formatCurrency(salePrice)}
          </span>
          <span
            className={cn("line-through text-gray-400", {
              "text-xs": size === "sm",
              "text-sm": size === "md",
              "text-base": size === "lg",
            })}
          >
            {formatCurrency(price)}
          </span>
        </>
      ) : (
        <span
          className={cn("font-bold text-gray-900 dark:text-white", {
            "text-sm": size === "sm",
            "text-lg": size === "md",
            "text-2xl": size === "lg",
          })}
        >
          {formatCurrency(price)}
        </span>
      )}
    </div>
  );
}
