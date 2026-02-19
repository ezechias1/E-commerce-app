import { Suspense } from "react";
import { filterProducts } from "@/lib/products";
import { ProductFilters as Filters } from "@/types/product";
import ProductGrid from "@/components/products/ProductGrid";
import ProductFilters from "@/components/products/ProductFilters";
import Skeleton from "@/components/ui/Skeleton";

interface ProductsPageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;

  const filters: Filters = {
    category: params.category,
    brand: params.brand,
    sort: params.sort as Filters["sort"],
  };

  const products = filterProducts(filters);
  const title = params.category
    ? `${params.category.charAt(0).toUpperCase() + params.category.slice(1)}`
    : "All Products";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          {title}
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {products.length} {products.length === 1 ? "product" : "products"}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="lg:sticky lg:top-24">
            <Suspense fallback={<Skeleton className="h-96 w-full" />}>
              <ProductFilters />
            </Suspense>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <ProductGrid products={products} />
        </div>
      </div>
    </div>
  );
}
