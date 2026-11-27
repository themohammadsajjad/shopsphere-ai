import {
  describe,
  expect,
  it,
} from "vitest";

import { parseAssistantInput } from "./intent-parser";
import type {
  AssistantContext,
} from "@/types/assistant";
import type { Product } from "@/types/product";

const emptyContext:
  AssistantContext = {
    lastProducts: [],
  };

const product = {
  id: 1,
  title:
    "Wireless Headphones",
  description: "Audio",
  category:
    "mobile-accessories",
  price: 4000,
  discountPercentage: 0,
  rating: 4.3,
  stock: 10,
  tags: [
    "headphones",
    "audio",
  ],
  brand: "AudioCo",
  sku: "A-1",
  weight: 1,
  dimensions: {
    width: 1,
    height: 1,
    depth: 1,
  },
  warrantyInformation:
    "Warranty",
  shippingInformation:
    "Shipping",
  availabilityStatus:
    "In Stock",
  reviews: [],
  returnPolicy:
    "Return",
  minimumOrderQuantity: 1,
  meta: {
    createdAt:
      "2026-01-01T00:00:00.000Z",
    updatedAt:
      "2026-01-01T00:00:00.000Z",
    barcode: "1",
    qrCode: "qr",
  },
  images: ["/file.svg"],
  thumbnail: "/file.svg",
} satisfies Product;

describe("assistant intent parser", () => {
  it("parses category and price ceiling", () => {
    expect(
      parseAssistantInput(
        "Show me headphones under 5000",
        emptyContext,
      ),
    ).toEqual({
      kind: "query",
      intent: {
        category:
          "headphones",
        maxPrice: 5000,
        minPrice:
          undefined,
        minRating:
          undefined,
        color:
          undefined,
      },
    });
  });

  it("parses good ratings as four stars", () => {
    const parsed =
      parseAssistantInput(
        "Show me smartphones with good ratings",
        emptyContext,
      );

    expect(parsed).toMatchObject({
      kind: "query",
      intent: {
        category:
          "smartphones",
        minRating: 4,
      },
    });
  });

  it("retains context and raises rating threshold", () => {
    const parsed =
      parseAssistantInput(
        "show me something with better ratings",
        {
          intent: {
            category:
              "headphones",
            maxPrice: 5000,
            minRating: 4,
          },
          lastProducts: [
            product,
          ],
        },
      );

    expect(parsed).toEqual({
      kind: "query",
      intent: {
        category:
          "headphones",
        maxPrice: 5000,
        minRating: 4.5,
      },
    });
  });

  it("makes a contextual query cheaper", () => {
    const parsed =
      parseAssistantInput(
        "show me something cheaper",
        {
          intent: {
            category:
              "headphones",
            maxPrice: 5000,
          },
          lastProducts: [
            product,
          ],
        },
      );

    expect(parsed).toMatchObject({
      kind: "query",
      intent: {
        category:
          "headphones",
        maxPrice: 4000,
      },
    });
  });

  it("recognizes similarity references", () => {
    const parsed =
      parseAssistantInput(
        "show me more like the second one",
        {
          lastProducts: [
            product,
            {
              ...product,
              id: 2,
            },
          ],
        },
      );

    expect(parsed).toEqual({
      kind: "similar",
      productIndex: 1,
    });
  });

  it("keeps price preference when category changes", () => {
    const parsed =
      parseAssistantInput(
        "never mind show me laptops instead",
        {
          intent: {
            category:
              "headphones",
            maxPrice: 50000,
          },
          lastProducts: [],
        },
      );

    expect(parsed).toMatchObject({
      kind: "query",
      intent: {
        category:
          "laptops",
        maxPrice: 50000,
      },
    });
  });

  it("supports a color refinement", () => {
    const parsed =
      parseAssistantInput(
        "only in blue",
        {
          intent: {
            category:
              "headphones",
            maxPrice: 5000,
          },
          lastProducts: [
            product,
          ],
        },
      );

    expect(parsed).toMatchObject({
      kind: "query",
      intent: {
        category:
          "headphones",
        maxPrice: 5000,
        color: "blue",
      },
    });
  });

  it("falls back for unclear input", () => {
    expect(
      parseAssistantInput(
        "hmm not sure",
        emptyContext,
      ),
    ).toEqual({
      kind: "fallback",
    });
  });
});
