"use client";

import { useState } from "react";

import type { Product } from "@/types/product";

type ProductInfoTabsProps = {
  product: Product;
};

type Tab =
  | "description"
  | "specifications";

export function ProductInfoTabs({
  product,
}: ProductInfoTabsProps) {
  const [tab, setTab] =
    useState<Tab>("description");

  return (
    <section className="glass-panel rounded-3xl border p-5 sm:p-7">
      <div
        role="tablist"
        aria-label="Product information"
        className="flex gap-2 border-b pb-4"
      >
        <button
          type="button"
          role="tab"
          aria-selected={
            tab === "description"
          }
          onClick={() =>
            setTab("description")
          }
          className={`rounded-xl px-4 py-2 text-sm font-medium ${
            tab === "description"
              ? "bg-foreground text-background"
              : "hover:bg-muted"
          }`}
        >
          Description
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={
            tab ===
            "specifications"
          }
          onClick={() =>
            setTab(
              "specifications",
            )
          }
          className={`rounded-xl px-4 py-2 text-sm font-medium ${
            tab ===
            "specifications"
              ? "bg-foreground text-background"
              : "hover:bg-muted"
          }`}
        >
          Specifications
        </button>
      </div>

      {tab === "description" ? (
        <div className="pt-5">
          <p className="max-w-3xl leading-7 text-muted-foreground">
            {product.description}
          </p>

          {product.tags.length >
          0 ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {product.tags.map(
                (tag) => (
                  <span
                    key={tag}
                    className="rounded-full border px-3 py-1 text-xs"
                  >
                    {tag}
                  </span>
                ),
              )}
            </div>
          ) : null}
        </div>
      ) : (
        <dl className="grid gap-4 pt-5 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-muted-foreground">
              SKU
            </dt>
            <dd className="mt-1 font-medium">
              {product.sku}
            </dd>
          </div>

          <div>
            <dt className="text-sm text-muted-foreground">
              Weight
            </dt>
            <dd className="mt-1 font-medium">
              {product.weight}
            </dd>
          </div>

          <div>
            <dt className="text-sm text-muted-foreground">
              Dimensions
            </dt>
            <dd className="mt-1 font-medium">
              {
                product.dimensions
                  .width
              }{" "}
              ×{" "}
              {
                product.dimensions
                  .height
              }{" "}
              ×{" "}
              {
                product.dimensions
                  .depth
              }
            </dd>
          </div>

          <div>
            <dt className="text-sm text-muted-foreground">
              Warranty
            </dt>
            <dd className="mt-1 font-medium">
              {
                product.warrantyInformation
              }
            </dd>
          </div>

          <div>
            <dt className="text-sm text-muted-foreground">
              Shipping
            </dt>
            <dd className="mt-1 font-medium">
              {
                product.shippingInformation
              }
            </dd>
          </div>

          <div>
            <dt className="text-sm text-muted-foreground">
              Return policy
            </dt>
            <dd className="mt-1 font-medium">
              {
                product.returnPolicy
              }
            </dd>
          </div>
        </dl>
      )}
    </section>
  );
}
