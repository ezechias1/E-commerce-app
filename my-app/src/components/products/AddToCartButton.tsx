"use client";

import { useState } from "react";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import Button from "@/components/ui/Button";
import QuantitySelector from "@/components/ui/QuantitySelector";

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
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
