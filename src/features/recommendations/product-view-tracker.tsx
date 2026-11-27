"use client";

import { useEffect } from "react";

import { useRecentlyViewedStore } from "@/store/recently-viewed-store";
import type { Product } from "@/types/product";

export function ProductViewTracker({
  product,
}: {
  product: Product;
}) {
  const addProduct =
    useRecentlyViewedStore(
      (state) =>
        state.addProduct,
    );

  useEffect(() => {
    addProduct(product);
  }, [addProduct, product]);

  return null;
}
