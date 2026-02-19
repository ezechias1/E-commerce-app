import Link from "next/link";
import { getCategories } from "@/lib/products";
import { getCategoryIcon } from "@/lib/utils";

export default function CategoryGrid() {
  const categories = getCategories();

  const gradients: Record<string, string> = {
    laptops: "from-violet-500 to-purple-600",
    phones: "from-blue-500 to-cyan-500",
    tablets: "from-emerald-500 to-teal-600",
    headphones: "from-orange-500 to-red-500",
    cameras: "from-pink-500 to-rose-600",
    accessories: "from-amber-500 to-yellow-500",
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Shop by Category
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/products?category=${category.slug}`}
            className="group relative overflow-hidden rounded-2xl p-6 text-center transition-transform hover:scale-105"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${gradients[category.slug] || "from-gray-500 to-gray-600"} opacity-90 group-hover:opacity-100 transition-opacity`}
            />
            <div className="relative">
              <span className="text-3xl block mb-2">
                {getCategoryIcon(category.slug)}
              </span>
              <h3 className="text-sm font-semibold text-white">{category.name}</h3>
              <p className="text-xs text-white/70 mt-1">
                {category.count} {category.count === 1 ? "product" : "products"}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
