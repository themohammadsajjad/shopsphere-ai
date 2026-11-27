"use client";

import {
  type FormEvent,
  useState,
} from "react";
import Link from "next/link";
import {
  useRouter,
} from "next/navigation";

import {
  Button,
  buttonVariants,
} from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";

export function HomeHeader() {
  const router = useRouter();

  const [search, setSearch] =
    useState("");

  const cartCount =
    useCartStore(
      (state) =>
        state.items.reduce(
          (total, item) =>
            total +
            item.quantity,
          0,
        ),
    );

  const wishlistCount =
    useWishlistStore(
      (state) =>
        state.productIds.length,
    );

  function submit(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const query =
      search.trim();

    if (!query) {
      router.push(
        "/products",
      );
      return;
    }

    router.push(
      `/products?search=${encodeURIComponent(
        query,
      )}`,
    );
  }

  return (
    <header className="border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-lg font-semibold"
        >
          ShopSphere AI
        </Link>

        <form
          role="search"
          onSubmit={submit}
          className="order-3 flex w-full gap-2 md:order-none md:ml-auto md:w-auto md:min-w-80"
        >
          <label
            htmlFor="home-search"
            className="sr-only"
          >
            Search products
          </label>

          <input
            id="home-search"
            type="search"
            value={search}
            onChange={(
              event,
            ) =>
              setSearch(
                event.target
                  .value,
              )
            }
            placeholder="Search products"
            className="h-9 min-w-0 flex-1 rounded-xl border bg-background px-3 text-sm"
          />

          <Button
            type="submit"
            size="sm"
          >
            Search
          </Button>
        </form>

        <nav
          aria-label="Primary navigation"
          className="ml-auto flex flex-wrap items-center gap-1 md:ml-0"
        >
          <Link
            href="/products"
            className={buttonVariants({
              variant: "ghost",
              size: "sm",
            })}
          >
            Products
          </Link>

          <Link
            href="/wishlist"
            className={buttonVariants({
              variant: "ghost",
              size: "sm",
            })}
          >
            Wishlist{" "}
            <span
              aria-live="polite"
              className="ml-1"
            >
              ({wishlistCount})
            </span>
          </Link>

          <Link
            href="/cart"
            className={buttonVariants({
              variant: "ghost",
              size: "sm",
            })}
          >
            Cart{" "}
            <span
              aria-live="polite"
              className="ml-1"
            >
              ({cartCount})
            </span>
          </Link>

          <Link
            href="/login"
            className={buttonVariants({
              variant:
                "outline",
              size: "sm",
            })}
          >
            Account
          </Link>
        </nav>
      </div>
    </header>
  );
}
