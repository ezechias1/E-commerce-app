"use client";

import { useState } from "react";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import Button from "@/components/ui/Button";
import QuantitySelector from "@/components/ui/QuantitySelector";
import { useRouter } from "next/navigation";

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const { addToast } = useToast();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    addToast({
      message: `${quantity}x ${product.name} added to cart`,
      type: "success",
      action: {
        label: "View Cart",
        onClick: () => router.push("/cart"),
      },
    });
  };

  return (
    <div className="flex items-center gap-4">
      <QuantitySelector value={quantity} onChange={setQuantity} />
      <Button
        onClick={handleAdd}
        disabled={!product.inStock}
        size="lg"
        className="flex-1"
      >
        {!product.inStock
          ? "Out of Stock"
          : added
            ? "Added!"
            : "Add to Cart"}
      </Button>
    </div>
  );
}
