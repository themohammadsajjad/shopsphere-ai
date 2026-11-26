"use client";

import {
  useEffect,
} from "react";

import { Button } from "@/components/ui/button";
import type { Product } from "@/types/product";
import { formatInr } from "@/utils/currency";

type ProductComparisonProps = {
  products: Product[];
  onClose: () => void;
};

export function ProductComparison({
  products,
  onClose,
}: ProductComparisonProps) {
  useEffect(() => {
    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="comparison-title"
        className="max-h-[90vh] w-full max-w-6xl overflow-auto rounded-3xl border bg-background p-5 shadow-2xl sm:p-7"
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2
              id="comparison-title"
              className="text-2xl font-semibold"
            >
              Product comparison
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Comparing{" "}
              {products.length} products
            </p>
          </div>

          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            aria-label="Close comparison"
          >
            ✕
          </Button>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-[720px] w-full border-collapse text-left text-sm">
            <thead>
              <tr>
                <th className="border-b p-3 text-muted-foreground">
                  Feature
                </th>

                {products.map(
                  (product) => (
                    <th
                      key={product.id}
                      className="border-b p-3 align-top text-base font-semibold"
                    >
                      {product.title}
                    </th>
                  ),
                )}
              </tr>
            </thead>

            <tbody>
              <tr>
                <th className="border-b p-3">
                  Brand
                </th>
                {products.map(
                  (product) => (
                    <td
                      key={product.id}
                      className="border-b p-3"
                    >
                      {product.brand ??
                        "—"}
                    </td>
                  ),
                )}
              </tr>

              <tr>
                <th className="border-b p-3">
                  Price
                </th>
                {products.map(
                  (product) => (
                    <td
                      key={product.id}
                      className="border-b p-3"
                    >
                      {formatInr(
                        product.price,
                      )}
                    </td>
                  ),
                )}
              </tr>

              <tr>
                <th className="border-b p-3">
                  Rating
                </th>
                {products.map(
                  (product) => (
                    <td
                      key={product.id}
                      className="border-b p-3"
                    >
                      ★{" "}
                      {product.rating.toFixed(
                        1,
                      )}
                    </td>
                  ),
                )}
              </tr>

              <tr>
                <th className="border-b p-3">
                  Stock
                </th>
                {products.map(
                  (product) => (
                    <td
                      key={product.id}
                      className="border-b p-3"
                    >
                      {product.stock}
                    </td>
                  ),
                )}
              </tr>

              <tr>
                <th className="border-b p-3">
                  Discount
                </th>
                {products.map(
                  (product) => (
                    <td
                      key={product.id}
                      className="border-b p-3"
                    >
                      {product.discountPercentage.toFixed(
                        0,
                      )}
                      %
                    </td>
                  ),
                )}
              </tr>

              <tr>
                <th className="p-3">
                  Category
                </th>
                {products.map(
                  (product) => (
                    <td
                      key={product.id}
                      className="p-3"
                    >
                      {product.category}
                    </td>
                  ),
                )}
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
