"use client";

import { ThemeProvider } from "next-themes";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext";
import { WishlistProvider } from "@/context/WishlistContext";
import ToastContainer from "@/components/ui/ToastContainer";
import ChatWidget from "@/components/ai/ChatWidget";
import BackToTop from "@/components/ui/BackToTop";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ToastProvider>
        <CartProvider>
          <WishlistProvider>
            {children}
            <ChatWidget />
            <ToastContainer />
            <BackToTop />
          </WishlistProvider>
        </CartProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
