"use client";

import { ThemeProvider } from "next-themes";
import { CartProvider } from "@/context/CartContext";
import ChatWidget from "@/components/ai/ChatWidget";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <CartProvider>
        {children}
        <ChatWidget />
      </CartProvider>
    </ThemeProvider>
  );
}
