import Link from "next/link";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-20 text-center">
      <h1 className="text-6xl font-bold text-gray-200 dark:text-gray-700">404</h1>
      <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Page Not Found</h2>
      <p className="mt-2 text-gray-500 dark:text-gray-400">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link href="/">
        <Button className="mt-6">Go Home</Button>
      </Link>
    </div>
  );
}
