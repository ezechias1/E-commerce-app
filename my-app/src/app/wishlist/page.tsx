"use client";

import Link from "next/link";
import Image from "next/image";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import PriceTag from "@/components/ui/PriceTag";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export default function WishlistPage() {
  const { items, toggleWishlist } = useWishlist();
  const { addItem } = useCart();
  const { addToast } = useToast();
  const router = useRouter();

  const handleAddToCart = (product: typeof items[0]) => {
    addItem(product);
    addToast({
      message: `${product.name} added to cart`,
      type: "success",
      action: { label: "View Cart", onClick: () => router.push("/cart") },
    });
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center animate-fade-in">
        <svg className="w-20 h-20 mx-auto text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Your wishlist is empty</h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">Save items you love by clicking the heart icon</p>
        <Link href="/products">
          <Button className="mt-6">Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Wishlist ({items.length} {items.length === 1 ? "item" : "items"})
        </h1>
      </div>

      <div className="space-y-4">
        {items.map((product) => (
          <div
            key={product.id}
            className="flex items-center gap-4 sm:gap-6 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800"
          >
            <Link href={`/products/${product.id}`} className="shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 dark:bg-gray-800 rounded-lg relative overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain p-2"
                  sizes="96px"
                />
              </div>
            </Link>

            <div className="flex-1 min-w-0">
              <Link href={`/products/${product.id}`}>
                <p className="text-xs text-gray-500 dark:text-gray-400">{product.brand}</p>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {product.name}
                </h3>
              </Link>
              <PriceTag price={product.price} salePrice={product.salePrice} size="sm" className="mt-1" />
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                size="sm"
                onClick={() => handleAddToCart(product)}
                disabled={!product.inStock}
              >
                {product.inStock ? "Add to Cart" : "Out of Stock"}
              </Button>
              <button
                onClick={() => {
                  toggleWishlist(product);
                  addToast({ message: `${product.name} removed from wishlist`, type: "info" });
                }}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                aria-label="Remove from wishlist"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
