import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getAllProducts, getProductById } from "@/lib/products";
import PriceTag from "@/components/ui/PriceTag";
import StarRating from "@/components/ui/StarRating";
import Badge from "@/components/ui/Badge";
import ProductSpecs from "@/components/products/ProductSpecs";
import AddToCartButton from "@/components/products/AddToCartButton";
import AIDescription from "@/components/products/AIDescription";
import AIRecommendations from "@/components/products/AIRecommendations";

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ id: p.id }));
}

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link href="/" className="hover:text-gray-900 dark:hover:text-white transition-colors">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-gray-900 dark:hover:text-white transition-colors">Products</Link>
        <span>/</span>
        <Link href={`/products?category=${product.category}`} className="hover:text-gray-900 dark:hover:text-white transition-colors capitalize">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-white truncate">{product.name}</span>
      </nav>

      {/* Product Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-8 aspect-square relative">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-8"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
          {product.salePrice && (
            <Badge variant="danger" className="absolute top-4 left-4">
              Sale
            </Badge>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">{product.brand}</p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {product.name}
          </h1>

          <div className="mt-3 flex items-center gap-3">
            <StarRating rating={product.rating} reviewCount={product.reviewCount} size="md" />
            {product.inStock ? (
              <Badge variant="success">In Stock</Badge>
            ) : (
              <Badge variant="danger">Out of Stock</Badge>
            )}
          </div>

          <PriceTag price={product.price} salePrice={product.salePrice} size="lg" className="mt-4" />

          <p className="mt-6 text-gray-600 dark:text-gray-300 leading-relaxed">
            {product.description}
          </p>

          <div className="mt-8">
            <AddToCartButton product={product} />
          </div>

          <div className="mt-8">
            <ProductSpecs specs={product.specs} />
          </div>
        </div>
      </div>

      {/* AI Description */}
      <div className="mt-16">
        <AIDescription productId={product.id} />
      </div>

      {/* AI Recommendations */}
      <div className="mt-16">
        <AIRecommendations productId={product.id} category={product.category} />
      </div>
    </div>
  );
}
