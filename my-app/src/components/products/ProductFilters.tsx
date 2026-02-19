"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { getCategories, getBrands } from "@/lib/products";
import { useCallback } from "react";

export default function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categories = getCategories();
  const brands = getBrands();

  const currentCategory = searchParams.get("category") || "";
  const currentBrand = searchParams.get("brand") || "";
  const currentSort = searchParams.get("sort") || "";

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/products?${params.toString()}`);
    },
    [router, searchParams]
  );

  const clearFilters = () => {
    router.push("/products");
  };

  const hasFilters = currentCategory || currentBrand || currentSort;

  return (
    <div className="space-y-6">
      {hasFilters && (
        <button
          onClick={clearFilters}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
        >
          Clear all filters
        </button>
      )}

      {/* Sort */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Sort By</h3>
        <select
          value={currentSort}
          onChange={(e) => updateParams("sort", e.target.value)}
          className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:border-blue-500 cursor-pointer"
        >
          <option value="">Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
          <option value="name">Name: A-Z</option>
        </select>
      </div>

      {/* Category */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Category</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="category"
              checked={!currentCategory}
              onChange={() => updateParams("category", "")}
              className="text-blue-600"
            />
            <span className="text-sm text-gray-600 dark:text-gray-300">All Categories</span>
          </label>
          {categories.map((cat) => (
            <label key={cat.slug} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                checked={currentCategory === cat.slug}
                onChange={() => updateParams("category", cat.slug)}
                className="text-blue-600"
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {cat.name} ({cat.count})
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Brand */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Brand</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="brand"
              checked={!currentBrand}
              onChange={() => updateParams("brand", "")}
              className="text-blue-600"
            />
            <span className="text-sm text-gray-600 dark:text-gray-300">All Brands</span>
          </label>
          {brands.map((brand) => (
            <label key={brand} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="brand"
                checked={currentBrand === brand}
                onChange={() => updateParams("brand", brand)}
                className="text-blue-600"
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">{brand}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
