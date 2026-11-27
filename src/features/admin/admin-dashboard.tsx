"use client";

import {
  type FormEvent,
  useMemo,
  useState,
} from "react";

import {
  useQuery,
} from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
  createLocalProduct,
  mergeAdminProducts,
} from "@/features/admin/admin-utils";
import { useProductsQuery } from "@/features/products/queries";
import { getUsers } from "@/features/auth/storage";
import { useAdminCatalogueStore } from "@/store/admin-catalogue-store";
import { useOrderStore } from "@/store/order-store";
import { useRecommendationAnalyticsStore } from "@/store/recommendation-analytics-store";
import type {
  OrderStatus,
} from "@/types/order";
import {
  ORDER_STATUSES,
} from "@/types/order";
import type {
  Product,
} from "@/types/product";
import type {
  RecommendationStrategy,
} from "@/types/recommendation";
import { formatInr } from "@/utils/currency";

const STRATEGIES:
  RecommendationStrategy[] = [
    "recently-viewed",
    "similar-products",
    "category-based",
    "price-based",
    "wishlist-based",
    "cart-based",
    "frequently-bought-together",
    "trending",
    "personalized",
  ];

export function AdminDashboard() {
  const productsQuery =
    useProductsQuery({
      limit: 100,
      skip: 0,
    });

  const usersQuery =
    useQuery({
      queryKey: [
        "admin",
        "users",
      ],
      queryFn: getUsers,
    });

  const upsertedProducts =
    useAdminCatalogueStore(
      (state) =>
        state.upsertedProducts,
    );

  const deletedIds =
    useAdminCatalogueStore(
      (state) =>
        state.deletedIds,
    );

  const localCategories =
    useAdminCatalogueStore(
      (state) =>
        state.categories,
    );

  const upsertProduct =
    useAdminCatalogueStore(
      (state) =>
        state.upsertProduct,
    );

  const deleteProduct =
    useAdminCatalogueStore(
      (state) =>
        state.deleteProduct,
    );

  const addCategory =
    useAdminCatalogueStore(
      (state) =>
        state.addCategory,
    );

  const orders =
    useOrderStore(
      (state) =>
        state.orders,
    );

  const advanceOrderStatus =
    useOrderStore(
      (state) =>
        state.advanceOrderStatus,
    );

  const impressions =
    useRecommendationAnalyticsStore(
      (state) =>
        state.impressions,
    );

  const clicks =
    useRecommendationAnalyticsStore(
      (state) =>
        state.clicks,
    );

  const conversions =
    useRecommendationAnalyticsStore(
      (state) =>
        state.conversions,
    );

  const [search, setSearch] =
    useState("");

  const [
    categoryFilter,
    setCategoryFilter,
  ] = useState("");

  const [
    selectedProductId,
    setSelectedProductId,
  ] =
    useState<
      number | null
    >(null);

  const [
    newProduct,
    setNewProduct,
  ] = useState({
    title: "",
    category: "",
    price: "",
    stock: "",
  });

  const [
    newCategory,
    setNewCategory,
  ] = useState("");

  const [
    orderStatus,
    setOrderStatus,
  ] = useState<
    OrderStatus | ""
  >("");

  const [
    customerFilter,
    setCustomerFilter,
  ] = useState("");

  const [
    startDate,
    setStartDate,
  ] = useState("");

  const [
    endDate,
    setEndDate,
  ] = useState("");

  const [
    selectedOrderId,
    setSelectedOrderId,
  ] =
    useState<
      string | null
    >(null);

  const products =
    useMemo(
      () =>
        mergeAdminProducts(
          productsQuery.data
            ?.products ?? [],
          upsertedProducts,
          deletedIds,
        ),
      [
        deletedIds,
        productsQuery.data,
        upsertedProducts,
      ],
    );

  const categories =
    useMemo(
      () =>
        [
          ...new Set([
            ...products.map(
              (product) =>
                product.category,
            ),
            ...localCategories,
          ]),
        ].sort(),
      [
        localCategories,
        products,
      ],
    );

  const visibleProducts =
    useMemo(
      () =>
        products.filter(
          (product) => {
            const term =
              search
                .trim()
                .toLowerCase();

            if (
              term &&
              ![
                product.title,
                product.brand ?? "",
                product.sku,
              ]
                .join(" ")
                .toLowerCase()
                .includes(
                  term,
                )
            ) {
              return false;
            }

            if (
              categoryFilter &&
              product.category !==
                categoryFilter
            ) {
              return false;
            }

            return true;
          },
        ),
      [
        categoryFilter,
        products,
        search,
      ],
    );

  const selectedProduct =
    products.find(
      (product) =>
        product.id ===
        selectedProductId,
    );

  const filteredOrders =
    useMemo(
      () =>
        orders.filter(
          (order) => {
            if (
              orderStatus &&
              order.status !==
                orderStatus
            ) {
              return false;
            }

            if (
              customerFilter.trim() &&
              ![
                order.customer.name,
                order.customer.email,
              ]
                .join(" ")
                .toLowerCase()
                .includes(
                  customerFilter
                    .trim()
                    .toLowerCase(),
                )
            ) {
              return false;
            }

            const created =
              Date.parse(
                order.createdAt,
              );

            if (
              startDate &&
              created <
                Date.parse(
                  `${startDate}T00:00:00`,
                )
            ) {
              return false;
            }

            if (
              endDate &&
              created >
                Date.parse(
                  `${endDate}T23:59:59`,
                )
            ) {
              return false;
            }

            return true;
          },
        ),
      [
        customerFilter,
        endDate,
        orderStatus,
        orders,
        startDate,
      ],
    );

  const selectedOrder =
    orders.find(
      (order) =>
        order.id ===
        selectedOrderId,
    );

  const revenue =
    orders.reduce(
      (sum, order) =>
        sum +
        order.totals.total,
      0,
    );

  const lowStock =
    products.filter(
      (product) =>
        product.stock > 0 &&
        product.stock <= 5,
    );

  const topProducts =
    [...products]
      .sort(
        (a, b) =>
          b.rating -
          a.rating,
      )
      .slice(0, 3);

  const totalImpressions =
    Object.values(
      impressions,
    ).reduce(
      (sum, value) =>
        sum +
        (value ?? 0),
      0,
    );

  const totalClicks =
    Object.values(
      clicks,
    ).reduce(
      (sum, value) =>
        sum +
        (value ?? 0),
      0,
    );

  const totalConversions =
    Object.values(
      conversions,
    ).reduce(
      (sum, value) =>
        sum +
        (value ?? 0),
      0,
    );

  const clickThroughRate =
    totalImpressions > 0
      ? (totalClicks /
          totalImpressions) *
        100
      : 0;

  const conversionRate =
    totalClicks > 0
      ? (totalConversions /
          totalClicks) *
        100
      : 0;

  function addProduct(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const price =
      Number(
        newProduct.price,
      );

    const stock =
      Number(
        newProduct.stock,
      );

    if (
      !newProduct.title.trim() ||
      !newProduct.category.trim() ||
      !Number.isFinite(
        price,
      ) ||
      price < 0 ||
      !Number.isInteger(
        stock,
      ) ||
      stock < 0
    ) {
      return;
    }

    upsertProduct(
      createLocalProduct({
        title:
          newProduct.title,
        category:
          newProduct.category,
        price,
        stock,
      }),
    );

    setNewProduct({
      title: "",
      category: "",
      price: "",
      stock: "",
    });
  }

  function saveProduct(
    product: Product,
    form:
      HTMLFormElement,
  ) {
    const data =
      new FormData(
        form,
      );

    const title =
      String(
        data.get(
          "title",
        ) ?? "",
      ).trim();

    const category =
      String(
        data.get(
          "category",
        ) ?? "",
      )
        .trim()
        .toLowerCase()
        .replaceAll(
          " ",
          "-",
        );

    const price =
      Number(
        data.get(
          "price",
        ),
      );

    const stock =
      Number(
        data.get(
          "stock",
        ),
      );

    if (
      !title ||
      !category ||
      !Number.isFinite(
        price,
      ) ||
      price < 0 ||
      !Number.isInteger(
        stock,
      ) ||
      stock < 0
    ) {
      return;
    }

    upsertProduct({
      ...product,
      title,
      category,
      price,
      stock,
      availabilityStatus:
        stock > 0
          ? "In Stock"
          : "Out of Stock",
      meta: {
        ...product.meta,
        updatedAt:
          new Date().toISOString(),
      },
    });
  }

  if (
    productsQuery.isPending
  ) {
    return (
      <div
        role="status"
        className="glass-panel rounded-3xl border p-8"
      >
        Loading admin data…
      </div>
    );
  }

  if (
    productsQuery.isError
  ) {
    return (
      <section className="glass-panel rounded-3xl border p-8">
        <h2 className="text-xl font-semibold">
          Admin catalogue could
          not be loaded
        </h2>

        <Button
          type="button"
          variant="outline"
          className="mt-4"
          onClick={() =>
            productsQuery.refetch()
          }
        >
          Retry
        </Button>
      </section>
    );
  }

  return (
    <div className="space-y-10">
      <section>
        <div className="mb-4">
          <p className="text-sm font-medium text-muted-foreground">
            Overview
          </p>

          <h2 className="text-2xl font-semibold">
            Store operations
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {[
            [
              "Products",
              products.length,
            ],
            [
              "Orders",
              orders.length,
            ],
            [
              "Customers",
              usersQuery.data
                ?.filter(
                  (user) =>
                    user.role ===
                    "customer",
                ).length ?? 0,
            ],
            [
              "Simulated revenue",
              formatInr(
                revenue,
              ),
            ],
            [
              "Simulated conversion",
              `${conversionRate.toFixed(
                1,
              )}%`,
            ],
          ].map(
            ([
              label,
              value,
            ]) => (
              <article
                key={
                  label
                }
                className="glass-panel rounded-2xl border p-4"
              >
                <p className="text-xs text-muted-foreground">
                  {label}
                </p>

                <p className="mt-2 text-xl font-semibold">
                  {value}
                </p>
              </article>
            ),
          )}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <article className="glass-panel rounded-2xl border p-5">
            <h3 className="font-semibold">
              Top-performing products
            </h3>

            <div className="mt-3 space-y-2 text-sm">
              {topProducts.map(
                (product) => (
                  <p
                    key={
                      product.id
                    }
                  >
                    {product.title} · ★{" "}
                    {product.rating.toFixed(
                      1,
                    )}
                  </p>
                ),
              )}
            </div>
          </article>

          <article className="glass-panel rounded-2xl border p-5">
            <h3 className="font-semibold">
              Low-stock alerts
            </h3>

            <div className="mt-3 space-y-2 text-sm">
              {lowStock.length >
              0 ? (
                lowStock
                  .slice(0, 5)
                  .map(
                    (
                      product,
                    ) => (
                      <p
                        key={
                          product.id
                        }
                      >
                        {
                          product.title
                        }{" "}
                        ·{" "}
                        {
                          product.stock
                        }{" "}
                        left
                      </p>
                    ),
                  )
              ) : (
                <p className="text-muted-foreground">
                  No low-stock
                  products.
                </p>
              )}
            </div>
          </article>

          <article className="glass-panel rounded-2xl border p-5">
            <h3 className="font-semibold">
              Recommendation CTR
            </h3>

            <p className="mt-3 text-2xl font-semibold">
              {clickThroughRate.toFixed(
                1,
              )}
              %
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              {totalClicks} clicks
              from{" "}
              {totalImpressions}{" "}
              local impressions
            </p>
          </article>
        </div>
      </section>

      <section
        aria-labelledby="product-management-heading"
        className="space-y-5"
      >
        <div>
          <p className="inline-flex rounded-full border px-2 py-1 text-xs font-medium">
            Local Simulation
          </p>

          <h2
            id="product-management-heading"
            className="mt-2 text-2xl font-semibold"
          >
            Product management
          </h2>
        </div>

        <form
          onSubmit={
            addProduct
          }
          className="glass-panel grid gap-3 rounded-2xl border p-4 sm:grid-cols-2 lg:grid-cols-5"
        >
          <input
            aria-label="New product title"
            placeholder="Product title"
            value={
              newProduct.title
            }
            onChange={(
              event,
            ) =>
              setNewProduct(
                (current) => ({
                  ...current,
                  title:
                    event.target
                      .value,
                }),
              )
            }
            className="h-10 rounded-xl border bg-background px-3"
          />

          <input
            aria-label="New product category"
            placeholder="Category"
            value={
              newProduct.category
            }
            onChange={(
              event,
            ) =>
              setNewProduct(
                (current) => ({
                  ...current,
                  category:
                    event.target
                      .value,
                }),
              )
            }
            className="h-10 rounded-xl border bg-background px-3"
          />

          <input
            aria-label="New product price"
            type="number"
            min="0"
            placeholder="Price ₹"
            value={
              newProduct.price
            }
            onChange={(
              event,
            ) =>
              setNewProduct(
                (current) => ({
                  ...current,
                  price:
                    event.target
                      .value,
                }),
              )
            }
            className="h-10 rounded-xl border bg-background px-3"
          />

          <input
            aria-label="New product stock"
            type="number"
            min="0"
            step="1"
            placeholder="Stock"
            value={
              newProduct.stock
            }
            onChange={(
              event,
            ) =>
              setNewProduct(
                (current) => ({
                  ...current,
                  stock:
                    event.target
                      .value,
                }),
              )
            }
            className="h-10 rounded-xl border bg-background px-3"
          />

          <Button type="submit">
            Add product locally
          </Button>
        </form>

        <div className="grid gap-3 sm:grid-cols-3">
          <input
            aria-label="Search admin products"
            placeholder="Search products"
            value={search}
            onChange={(
              event,
            ) =>
              setSearch(
                event.target
                  .value,
              )
            }
            className="h-10 rounded-xl border bg-background px-3"
          />

          <select
            aria-label="Filter admin products by category"
            value={
              categoryFilter
            }
            onChange={(
              event,
            ) =>
              setCategoryFilter(
                event.target
                  .value,
              )
            }
            className="h-10 rounded-xl border bg-background px-3"
          >
            <option value="">
              All categories
            </option>
            {categories.map(
              (category) => (
                <option
                  key={
                    category
                  }
                  value={
                    category
                  }
                >
                  {category}
                </option>
              ),
            )}
          </select>

          <div className="flex gap-2">
            <input
              aria-label="New category"
              placeholder="New category"
              value={
                newCategory
              }
              onChange={(
                event,
              ) =>
                setNewCategory(
                  event.target
                    .value,
                )
              }
              className="h-10 min-w-0 flex-1 rounded-xl border bg-background px-3"
            />

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                addCategory(
                  newCategory,
                );
                setNewCategory(
                  "",
                );
              }}
            >
              Add locally
            </Button>
          </div>
        </div>

        <div className="grid gap-3">
          {visibleProducts
            .slice(0, 20)
            .map(
              (product) => (
                <article
                  key={
                    product.id
                  }
                  className="glass-panel rounded-2xl border p-4"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">
                        {
                          product.title
                        }
                      </p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {
                          product.category
                        }{" "}
                        ·{" "}
                        {formatInr(
                          product.price,
                        )}{" "}
                        · Stock{" "}
                        {
                          product.stock
                        }
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          setSelectedProductId(
                            product.id,
                          )
                        }
                      >
                        Edit
                      </Button>

                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() =>
                          deleteProduct(
                            product.id,
                          )
                        }
                      >
                        Delete locally
                      </Button>
                    </div>
                  </div>
                </article>
              ),
            )}
        </div>

        {selectedProduct ? (
          <form
            onSubmit={(
              event,
            ) => {
              event.preventDefault();
              saveProduct(
                selectedProduct,
                event.currentTarget,
              );
            }}
            className="glass-panel grid gap-3 rounded-2xl border p-5 sm:grid-cols-2"
          >
            <div className="sm:col-span-2">
              <p className="text-xs font-medium text-muted-foreground">
                Local Simulation
              </p>

              <h3 className="text-lg font-semibold">
                Edit product
              </h3>
            </div>

            <input
              name="title"
              aria-label="Edit product title"
              defaultValue={
                selectedProduct.title
              }
              className="h-10 rounded-xl border bg-background px-3"
            />

            <input
              name="category"
              aria-label="Edit product category"
              defaultValue={
                selectedProduct.category
              }
              className="h-10 rounded-xl border bg-background px-3"
            />

            <input
              name="price"
              aria-label="Edit product price"
              type="number"
              min="0"
              defaultValue={
                selectedProduct.price
              }
              className="h-10 rounded-xl border bg-background px-3"
            />

            <input
              name="stock"
              aria-label="Edit product stock"
              type="number"
              min="0"
              step="1"
              defaultValue={
                selectedProduct.stock
              }
              className="h-10 rounded-xl border bg-background px-3"
            />

            <div className="flex gap-2 sm:col-span-2">
              <Button type="submit">
                Save local edit
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={() =>
                  setSelectedProductId(
                    null,
                  )
                }
              >
                Close
              </Button>
            </div>
          </form>
        ) : null}
      </section>

      <section className="space-y-5">
        <div>
          <p className="inline-flex rounded-full border px-2 py-1 text-xs font-medium">
            Local Simulation
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            Order management
          </h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <select
            aria-label="Filter orders by status"
            value={
              orderStatus
            }
            onChange={(
              event,
            ) =>
              setOrderStatus(
                event.target
                  .value as
                  OrderStatus | "",
              )
            }
            className="h-10 rounded-xl border bg-background px-3"
          >
            <option value="">
              All statuses
            </option>
            {ORDER_STATUSES.map(
              (status) => (
                <option
                  key={
                    status
                  }
                  value={
                    status
                  }
                >
                  {status}
                </option>
              ),
            )}
          </select>

          <input
            aria-label="Filter orders by customer"
            placeholder="Customer or email"
            value={
              customerFilter
            }
            onChange={(
              event,
            ) =>
              setCustomerFilter(
                event.target
                  .value,
              )
            }
            className="h-10 rounded-xl border bg-background px-3"
          />

          <input
            aria-label="Order start date"
            type="date"
            value={
              startDate
            }
            onChange={(
              event,
            ) =>
              setStartDate(
                event.target
                  .value,
              )
            }
            className="h-10 rounded-xl border bg-background px-3"
          />

          <input
            aria-label="Order end date"
            type="date"
            value={
              endDate
            }
            onChange={(
              event,
            ) =>
              setEndDate(
                event.target
                  .value,
              )
            }
            className="h-10 rounded-xl border bg-background px-3"
          />
        </div>

        {filteredOrders.length >
        0 ? (
          <div className="grid gap-3">
            {filteredOrders.map(
              (order) => (
                <article
                  key={
                    order.id
                  }
                  className="glass-panel flex flex-col gap-3 rounded-2xl border p-4 lg:flex-row lg:items-center"
                >
                  <div className="flex-1">
                    <p className="font-semibold">
                      {order.id}
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {
                        order.customer.name
                      }{" "}
                      ·{" "}
                      {order.status}{" "}
                      ·{" "}
                      {formatInr(
                        order.totals.total,
                      )}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        setSelectedOrderId(
                          order.id,
                        )
                      }
                    >
                      View details
                    </Button>

                    <Button
                      type="button"
                      disabled={
                        order.status ===
                        "Delivered"
                      }
                      onClick={() =>
                        advanceOrderStatus(
                          order.id,
                        )
                      }
                    >
                      Advance status locally
                    </Button>
                  </div>
                </article>
              ),
            )}
          </div>
        ) : (
          <p className="glass-panel rounded-2xl border p-5 text-sm text-muted-foreground">
            No local orders match
            these filters.
          </p>
        )}

        {selectedOrder ? (
          <article className="glass-panel rounded-2xl border p-5">
            <h3 className="text-lg font-semibold">
              Order detail ·{" "}
              {selectedOrder.id}
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              {
                selectedOrder.customer
                  .name
              }{" "}
              ·{" "}
              {
                selectedOrder.customer
                  .email
              }
            </p>

            <div className="mt-4 space-y-2">
              {selectedOrder.items.map(
                (item) => (
                  <p
                    key={
                      item.id
                    }
                    className="text-sm"
                  >
                    {item.title} ×{" "}
                    {item.quantity} ·{" "}
                    {formatInr(
                      item.price *
                        item.quantity,
                    )}
                  </p>
                ),
              )}
            </div>
          </article>
        ) : null}
      </section>

      <section className="space-y-5">
        <div>
          <p className="inline-flex rounded-full border px-2 py-1 text-xs font-medium">
            Local Analytics
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            Recommendation
            analytics
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Metrics are generated
            from local recommendation
            impressions, clicks and
            add-to-cart conversions.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <article className="glass-panel rounded-2xl border p-4">
            <p className="text-xs text-muted-foreground">
              Impressions
            </p>
            <p className="mt-2 text-2xl font-semibold">
              {totalImpressions}
            </p>
          </article>

          <article className="glass-panel rounded-2xl border p-4">
            <p className="text-xs text-muted-foreground">
              Clicks
            </p>
            <p className="mt-2 text-2xl font-semibold">
              {totalClicks}
            </p>
          </article>

          <article className="glass-panel rounded-2xl border p-4">
            <p className="text-xs text-muted-foreground">
              Recommendation
              conversion
            </p>
            <p className="mt-2 text-2xl font-semibold">
              {conversionRate.toFixed(
                1,
              )}
              %
            </p>
          </article>
        </div>

        <div className="overflow-x-auto rounded-2xl border">
          <table className="w-full min-w-[42rem] text-left text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="p-3">
                  Strategy
                </th>
                <th className="p-3">
                  Impressions
                </th>
                <th className="p-3">
                  Clicks
                </th>
                <th className="p-3">
                  Conversions
                </th>
              </tr>
            </thead>

            <tbody>
              {STRATEGIES.map(
                (
                  strategy,
                ) => (
                  <tr
                    key={
                      strategy
                    }
                    className="border-t"
                  >
                    <td className="p-3 font-medium">
                      {
                        strategy
                      }
                    </td>

                    <td className="p-3">
                      {impressions[
                        strategy
                      ] ?? 0}
                    </td>

                    <td className="p-3">
                      {clicks[
                        strategy
                      ] ?? 0}
                    </td>

                    <td className="p-3">
                      {conversions[
                        strategy
                      ] ?? 0}
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
