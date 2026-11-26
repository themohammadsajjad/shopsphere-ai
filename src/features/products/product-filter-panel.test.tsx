import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import type { ProductFilters } from "@/types/product";

import { ProductFilterPanel } from "./product-filter-panel";

function createFilters(
  overrides: Partial<ProductFilters> = {},
): ProductFilters {
  return {
    brands: [],
    categories: [],
    ...overrides,
  };
}

const brands = ["Acme", "Luxury"];

const categories = [
  {
    slug: "beauty",
    name: "Beauty",
  },
  {
    slug: "furniture",
    name: "Furniture",
  },
];

describe("ProductFilterPanel", () => {
  it("shows the active filter count", () => {
    render(
      <ProductFilterPanel
        filters={createFilters({
          minPrice: 100,
          minRating: 4,
          brands: ["Acme"],
        })}
        brands={brands}
        categories={categories}
        onFiltersChange={vi.fn()}
      />,
    );

    expect(
      screen.getByText("3 active"),
    ).toBeInTheDocument();
  });

  it("updates minimum and maximum price inputs", () => {
    const onFiltersChange = vi.fn();

    render(
      <ProductFilterPanel
        filters={createFilters()}
        brands={brands}
        categories={categories}
        onFiltersChange={onFiltersChange}
      />,
    );

    fireEvent.change(
      screen.getByLabelText("Minimum"),
      {
        target: {
          value: "100",
        },
      },
    );

    expect(onFiltersChange).toHaveBeenCalledWith(
      createFilters({
        minPrice: 100,
      }),
    );

    fireEvent.change(
      screen.getByLabelText("Maximum"),
      {
        target: {
          value: "500",
        },
      },
    );

    expect(onFiltersChange).toHaveBeenCalledWith(
      createFilters({
        maxPrice: 500,
      }),
    );
  });

  it("updates price sliders", () => {
    const onFiltersChange = vi.fn();

    render(
      <ProductFilterPanel
        filters={createFilters()}
        brands={brands}
        categories={categories}
        priceBounds={{
          min: 0,
          max: 1000,
        }}
        onFiltersChange={onFiltersChange}
      />,
    );

    fireEvent.change(
      screen.getByLabelText(
        "Minimum price slider",
      ),
      {
        target: {
          value: "200",
        },
      },
    );

    expect(onFiltersChange).toHaveBeenCalledWith(
      createFilters({
        minPrice: 200,
      }),
    );

    fireEvent.change(
      screen.getByLabelText(
        "Maximum price slider",
      ),
      {
        target: {
          value: "800",
        },
      },
    );

    expect(onFiltersChange).toHaveBeenCalledWith(
      createFilters({
        maxPrice: 800,
      }),
    );
  });

  it("updates rating and availability", () => {
    const onFiltersChange = vi.fn();

    render(
      <ProductFilterPanel
        filters={createFilters()}
        brands={brands}
        categories={categories}
        onFiltersChange={onFiltersChange}
      />,
    );

    fireEvent.change(
      screen.getByLabelText("Minimum rating"),
      {
        target: {
          value: "4",
        },
      },
    );

    expect(onFiltersChange).toHaveBeenCalledWith(
      createFilters({
        minRating: 4,
      }),
    );

    fireEvent.click(
      screen.getByLabelText("In stock"),
    );

    expect(onFiltersChange).toHaveBeenCalledWith(
      createFilters({
        availability: "in-stock",
      }),
    );
  });

  it("updates the on-sale filter", () => {
    const onFiltersChange = vi.fn();

    render(
      <ProductFilterPanel
        filters={createFilters()}
        brands={brands}
        categories={categories}
        onFiltersChange={onFiltersChange}
      />,
    );

    fireEvent.click(
      screen.getByLabelText("On sale only"),
    );

    expect(onFiltersChange).toHaveBeenCalledWith(
      createFilters({
        onSale: true,
      }),
    );
  });

  it("supports brand multi-select", () => {
    const onFiltersChange = vi.fn();

    render(
      <ProductFilterPanel
        filters={createFilters({
          brands: ["Acme"],
        })}
        brands={brands}
        categories={categories}
        onFiltersChange={onFiltersChange}
      />,
    );

    fireEvent.click(
      screen.getByLabelText("Luxury"),
    );

    expect(onFiltersChange).toHaveBeenCalledWith(
      createFilters({
        brands: ["Acme", "Luxury"],
      }),
    );
  });

  it("supports category multi-select", () => {
    const onFiltersChange = vi.fn();

    render(
      <ProductFilterPanel
        filters={createFilters({
          categories: ["beauty"],
        })}
        brands={brands}
        categories={categories}
        onFiltersChange={onFiltersChange}
      />,
    );

    fireEvent.click(
      screen.getByLabelText("Furniture"),
    );

    expect(onFiltersChange).toHaveBeenCalledWith(
      createFilters({
        categories: [
          "beauty",
          "furniture",
        ],
      }),
    );
  });

  it("clears all active filters", () => {
    const onFiltersChange = vi.fn();

    render(
      <ProductFilterPanel
        filters={createFilters({
          minPrice: 100,
          maxPrice: 500,
          minRating: 4,
          availability: "in-stock",
          onSale: true,
          brands: ["Acme"],
          categories: ["beauty"],
        })}
        brands={brands}
        categories={categories}
        onFiltersChange={onFiltersChange}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Clear filters",
      }),
    );

    expect(onFiltersChange).toHaveBeenCalledWith({
      brands: [],
      categories: [],
    });
  });
});
