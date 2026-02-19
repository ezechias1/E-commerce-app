"use client";

import { useState, useEffect } from "react";
import Skeleton from "@/components/ui/Skeleton";

interface AIDescriptionProps {
  productId: string;
}

export default function AIDescription({ productId }: AIDescriptionProps) {
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchDescription() {
      try {
        const res = await fetch("/api/describe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });

        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();
        if (!cancelled) {
          setDescription(data.description);
        }
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchDescription();
    return () => { cancelled = true; };
  }, [productId]);

  if (error) return null;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-2xl p-6 sm:p-8 border border-blue-100 dark:border-blue-900/50">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI-Enhanced Description</h3>
        <span className="text-xs text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50 px-2 py-0.5 rounded-full">
          Powered by Claude
        </span>
      </div>

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
          <Skeleton className="h-4 w-full mt-4" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ) : (
        <div className="prose prose-sm dark:prose-invert max-w-none">
          {description.split("\n").map((paragraph, i) => (
            <p key={i} className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
