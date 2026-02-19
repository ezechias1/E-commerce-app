import { ProductSpecs as Specs } from "@/types/product";

interface ProductSpecsProps {
  specs: Specs;
}

export default function ProductSpecs({ specs }: ProductSpecsProps) {
  const entries = Object.entries(specs);

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Specifications</h3>
      <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
        {entries.map(([key, value], index) => (
          <div
            key={key}
            className={`flex ${index % 2 === 0 ? "bg-gray-50 dark:bg-gray-800/50" : "bg-white dark:bg-gray-900"}`}
          >
            <dt className="w-1/3 px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
              {key}
            </dt>
            <dd className="w-2/3 px-4 py-3 text-sm text-gray-900 dark:text-white">
              {value}
            </dd>
          </div>
        ))}
      </div>
    </div>
  );
}
