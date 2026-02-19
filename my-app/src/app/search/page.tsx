"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Product } from "@/types/product";
import ProductGrid from "@/components/products/ProductGrid";
import Skeleton from "@/components/ui/Skeleton";
import Link from "next/link";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [products, setProducts] = useState<Product[]>([]);
  const [explanation, setExplanation] = useState("");
  const [refinedQuery, setRefinedQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function search() {
      setLoading(true);
      try {
        const res = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        });

        if (!res.ok) throw new Error("Search failed");

        const data = await res.json();
        if (!cancelled) {
          setProducts(data.products || []);
          setExplanation(data.explanation || "");
          setRefinedQuery(data.refinedQuery || "");
        }
      } catch {
        if (!cancelled) {
          setProducts([]);
          setExplanation("Search encountered an error. Please try again.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    search();
    return () => {
      cancelled = true;
    };
  }, [query]);

  if (!query) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI-Powered Search</h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Try searching in natural language, like &quot;best laptop for video editing under $2000&quot;
        </p>
        <Link href="/products" className="mt-6 inline-block text-blue-600 dark:text-blue-400 hover:underline">
          Browse all products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Search Results
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          for &quot;{query}&quot;
        </p>

        {!loading && explanation && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 rounded-xl">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <div>
                <p className="text-sm text-blue-800 dark:text-blue-200">{explanation}</p>
                {refinedQuery && refinedQuery !== query && (
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    Refined search: &quot;{refinedQuery}&quot;
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
              <Skeleton className="aspect-square w-full mb-4" />
              <Skeleton className="h-3 w-16 mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-3 w-24 mb-3" />
              <Skeleton className="h-5 w-20" />
            </div>
          ))}
        </div>
      ) : (
        <>
          <ProductGrid products={products} />
          {products.length === 0 && (
            <div className="text-center py-8">
              <Link href="/products" className="text-blue-600 dark:text-blue-400 hover:underline">
                Browse all products instead
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-4 w-32 mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-80 w-full rounded-2xl" />
            ))}
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
