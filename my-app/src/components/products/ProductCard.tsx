"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";
import PriceTag from "@/components/ui/PriceTag";
import StarRating from "@/components/ui/StarRating";
import Badge from "@/components/ui/Badge";
import WishlistButton from "@/components/ui/WishlistButton";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { addItem } = useCart();
  const { addToast } = useToast();
  const router = useRouter();

  const handleAddToCart = () => {
    addItem(product);
    addToast({
      message: `${product.name} added to cart`,
      type: "success",
      action: {
        label: "View Cart",
        onClick: () => router.push("/cart"),
      },
    });
  };

  return (
    <div className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300">
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-6 group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          {product.salePrice && (
            <Badge variant="danger" className="absolute top-3 left-3">
              Sale
            </Badge>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Badge variant="default" className="bg-gray-900 text-white">Out of Stock</Badge>
            </div>
          )}

          {/* Hover overlay with quick actions */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 dark:group-hover:bg-white/5 transition-colors duration-300" />
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <WishlistButton product={product} size="sm" />
            {onQuickView && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onQuickView(product);
                }}
                className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                aria-label="Quick view"
              >
                <svg className="w-4 h-4 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{product.brand}</p>
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-snug line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {product.name}
          </h3>
        </Link>
        <StarRating rating={product.rating} reviewCount={product.reviewCount} className="mt-2" />
        <div className="mt-3 flex items-center justify-between">
          <PriceTag price={product.price} salePrice={product.salePrice} size="sm" />
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            aria-label={`Add ${product.name} to cart`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
