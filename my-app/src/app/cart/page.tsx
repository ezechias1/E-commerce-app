"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/utils";
import QuantitySelector from "@/components/ui/QuantitySelector";
import Button from "@/components/ui/Button";

export default function CartPage() {
  const { items, subtotal, removeItem, updateQuantity } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <svg className="w-20 h-20 mx-auto text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <h1 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">Your cart is empty</h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">Looks like you haven&apos;t added anything yet.</p>
        <Link href="/products">
          <Button className="mt-6">Browse Products</Button>
        </Link>
      </div>
    );
  }

  const tax = subtotal * 0.0825;
  const total = subtotal + tax;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Shopping Cart ({items.length} {items.length === 1 ? "item" : "items"})
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-1 space-y-4">
          {items.map((item) => (
            <div
              key={item.product.id}
              className="flex gap-4 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800"
            >
              <Link href={`/products/${item.product.id}`} className="shrink-0">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-lg relative">
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    className="object-contain p-2"
                    sizes="96px"
                  />
                </div>
              </Link>
              <div className="flex-1 min-w-0">
                <Link href={`/products/${item.product.id}`}>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {item.product.name}
                  </h3>
                </Link>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.product.brand}</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white mt-2">
                  {formatCurrency(item.product.salePrice ?? item.product.price)}
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <QuantitySelector
                    value={item.quantity}
                    onChange={(q) => updateQuantity(item.product.id, q)}
                  />
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="text-sm text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  {formatCurrency((item.product.salePrice ?? item.product.price) * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 lg:sticky lg:top-24">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-300">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-300">
                <span>Estimated Tax</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-300">
                <span>Shipping</span>
                <span className="text-green-600 dark:text-green-400">
                  {subtotal >= 99 ? "Free" : formatCurrency(9.99)}
                </span>
              </div>
              <hr className="border-gray-200 dark:border-gray-700" />
              <div className="flex justify-between font-bold text-gray-900 dark:text-white text-base">
                <span>Total</span>
                <span>{formatCurrency(total + (subtotal < 99 ? 9.99 : 0))}</span>
              </div>
            </div>
            <Link href="/checkout">
              <Button className="w-full mt-6" size="lg">
                Proceed to Checkout
              </Button>
            </Link>
            <Link href="/products" className="block text-center text-sm text-blue-600 dark:text-blue-400 hover:underline mt-4">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
