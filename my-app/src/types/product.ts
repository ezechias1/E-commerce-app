export interface ProductSpecs {
  [key: string]: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  salePrice: number | null;
  category: string;
  brand: string;
  image: string;
  images: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  featured: boolean;
  specs: ProductSpecs;
  description: string;
  tags: string[];
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  inStock?: boolean;
  sort?: "price-asc" | "price-desc" | "name" | "rating";
}

export type Category = {
  name: string;
  slug: string;
  count: number;
};
