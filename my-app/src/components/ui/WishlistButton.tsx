"use client";

import { useState } from "react";
import { Product } from "@/types/product";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/context/ToastContext";

interface WishlistButtonProps {
  product: Product;
  size?: "sm" | "md";
}

export default function WishlistButton({ product, size = "md" }: WishlistButtonProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToast } = useToast();
  const [animating, setAnimating] = useState(false);
  const active = isInWishlist(product.id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    setAnimating(true);
    setTimeout(() => setAnimating(false), 300);
    addToast({
      message: active
        ? `${product.name} removed from wishlist`
        : `${product.name} added to wishlist`,
      type: active ? "info" : "success",
    });
  };

  const iconSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";
  const btnSize = size === "sm" ? "p-2" : "p-2.5";

  return (
    <button
      onClick={handleClick}
      className={`${btnSize} bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
        animating ? "animate-heart-pulse" : ""
      }`}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
    >
      <svg
        className={`${iconSize} transition-colors ${
          active ? "text-red-500 fill-red-500" : "text-gray-400 dark:text-gray-500"
        }`}
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  );
}
