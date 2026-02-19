"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import PriceTag from "@/components/ui/PriceTag";
import StarRating from "@/components/ui/StarRating";
import Badge from "@/components/ui/Badge";
import AddToCartButton from "./AddToCartButton";
import WishlistButton from "@/components/ui/WishlistButton";

interface QuickViewModalProps {
  product: Product;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-modal-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Image */}
          <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain p-8"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {product.salePrice && (
              <Badge variant="danger" className="absolute top-4 left-4">Sale</Badge>
            )}
            <div className="absolute top-4 right-4">
              <WishlistButton product={product} size="sm" />
            </div>
          </div>

          {/* Info */}
          <div className="p-6 flex flex-col">
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">{product.brand}</p>
            <h2 className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
              {product.name}
            </h2>

            <div className="mt-2 flex items-center gap-3">
              <StarRating rating={product.rating} reviewCount={product.reviewCount} />
              {product.inStock ? (
                <Badge variant="success">In Stock</Badge>
              ) : (
                <Badge variant="danger">Out of Stock</Badge>
              )}
            </div>

            <PriceTag price={product.price} salePrice={product.salePrice} size="lg" className="mt-3" />

            <p className="mt-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
              {product.description}
            </p>

            <div className="mt-6">
              <AddToCartButton product={product} />
            </div>

            <Link
              href={`/products/${product.id}`}
              className="mt-4 text-sm text-blue-600 dark:text-blue-400 hover:underline text-center"
              onClick={onClose}
            >
              View Full Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
