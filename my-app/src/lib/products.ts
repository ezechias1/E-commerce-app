import productsData from "@/data/products.json";
import { Product, ProductFilters, Category } from "@/types/product";

const products: Product[] = productsData as unknown as Product[];

export function getAllProducts(): Product[] {
  return products;
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function getCategories(): Category[] {
  const categoryMap = new Map<string, number>();
  products.forEach((p) => {
    categoryMap.set(p.category, (categoryMap.get(p.category) || 0) + 1);
  });

  return Array.from(categoryMap.entries()).map(([name, count]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    slug: name,
    count,
  }));
}

export function getBrands(): string[] {
  return [...new Set(products.map((p) => p.brand))].sort();
}

export function filterProducts(filters: ProductFilters): Product[] {
  let result = [...products];

  if (filters.category) {
    result = result.filter((p) => p.category === filters.category);
  }
  if (filters.minPrice !== undefined) {
    result = result.filter((p) => p.price >= filters.minPrice!);
  }
  if (filters.maxPrice !== undefined) {
    result = result.filter((p) => p.price <= filters.maxPrice!);
  }
  if (filters.brand) {
    result = result.filter((p) => p.brand === filters.brand);
  }
  if (filters.inStock) {
    result = result.filter((p) => p.inStock);
  }

  if (filters.sort) {
    switch (filters.sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
    }
  }

  return result;
}

export function searchProducts(query: string): Product[] {
  const lower = query.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(lower) ||
      p.description.toLowerCase().includes(lower) ||
      p.category.toLowerCase().includes(lower) ||
      p.brand.toLowerCase().includes(lower) ||
      p.tags.some((t) => t.toLowerCase().includes(lower))
  );
}

export function getCatalogSummaryForAI(): string {
  return products
    .map(
      (p) =>
        `[${p.id}] ${p.name} - $${p.price}${p.salePrice ? ` (sale: $${p.salePrice})` : ""} (${p.category}, ${p.brand}) | ${p.inStock ? "In stock" : "Out of stock"} | Tags: ${p.tags.join(", ")} | Key specs: ${Object.entries(p.specs).map(([k, v]) => `${k}: ${v}`).join(", ")}`
    )
    .join("\n");
}
