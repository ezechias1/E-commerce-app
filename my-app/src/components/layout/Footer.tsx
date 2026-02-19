import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">Es</span>
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">Es&apos;Store</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              AI-powered electronics store. Smarter shopping, better choices.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Shop</h3>
            <ul className="space-y-2">
              <li><Link href="/products" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">All Products</Link></li>
              <li><Link href="/products?category=laptops" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Laptops</Link></li>
              <li><Link href="/products?category=phones" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Phones</Link></li>
              <li><Link href="/products?category=headphones" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Headphones</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><Link href="/products?category=tablets" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Tablets</Link></li>
              <li><Link href="/products?category=cameras" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Cameras</Link></li>
              <li><Link href="/products?category=accessories" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Accessories</Link></li>
            </ul>
          </div>

          {/* AI Features */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">AI Features</h3>
            <ul className="space-y-2">
              <li className="text-sm text-gray-500 dark:text-gray-400">AI Shopping Assistant</li>
              <li className="text-sm text-gray-500 dark:text-gray-400">Smart Recommendations</li>
              <li className="text-sm text-gray-500 dark:text-gray-400">Natural Language Search</li>
              <li className="text-sm text-gray-500 dark:text-gray-400">AI Product Descriptions</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Es&apos;Store. All rights reserved.
          </p>
          <p className="text-xs text-gray-400">
            Powered by Claude AI &amp; Nano Banana
          </p>
        </div>
      </div>
    </footer>
  );
}
