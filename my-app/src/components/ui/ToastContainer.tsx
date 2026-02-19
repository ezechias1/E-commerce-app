"use client";

import { useToast } from "@/context/ToastContext";

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`animate-slide-up flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border backdrop-blur-sm ${
            toast.type === "success"
              ? "bg-green-50/90 dark:bg-green-950/90 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200"
              : toast.type === "error"
                ? "bg-red-50/90 dark:bg-red-950/90 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200"
                : "bg-blue-50/90 dark:bg-blue-950/90 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200"
          }`}
        >
          {/* Icon */}
          {toast.type === "success" && (
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
          {toast.type === "error" && (
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          {toast.type === "info" && (
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}

          <p className="text-sm font-medium flex-1">{toast.message}</p>

          {toast.action && (
            <button
              onClick={toast.action.onClick}
              className="text-sm font-semibold underline underline-offset-2 hover:no-underline shrink-0 cursor-pointer"
            >
              {toast.action.label}
            </button>
          )}

          <button
            onClick={() => removeToast(toast.id)}
            className="p-0.5 hover:opacity-70 transition-opacity shrink-0 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
