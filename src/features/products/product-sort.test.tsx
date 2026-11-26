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

import { ProductSort } from "./product-sort";

describe("ProductSort", () => {
  it("shows Recommended when no sort is selected", () => {
    render(
      <ProductSort
        onSortChange={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("combobox", {
        name: "Sort products",
      }),
    ).toHaveValue("default");
  });

  it("reflects the current sort selection", () => {
    render(
      <ProductSort
        sortBy="price"
        order="desc"
        onSortChange={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("combobox", {
        name: "Sort products",
      }),
    ).toHaveValue("price-desc");
  });

  it("sorts by price ascending", () => {
    const onSortChange = vi.fn();

    render(
      <ProductSort
        onSortChange={onSortChange}
      />,
    );

    fireEvent.change(
      screen.getByRole("combobox", {
        name: "Sort products",
      }),
      {
        target: {
          value: "price-asc",
        },
      },
    );

    expect(onSortChange).toHaveBeenCalledWith(
      "price",
      "asc",
    );
  });

  it("sorts by rating descending", () => {
    const onSortChange = vi.fn();

    render(
      <ProductSort
        onSortChange={onSortChange}
      />,
    );

    fireEvent.change(
      screen.getByRole("combobox", {
        name: "Sort products",
      }),
      {
        target: {
          value: "rating-desc",
        },
      },
    );

    expect(onSortChange).toHaveBeenCalledWith(
      "rating",
      "desc",
    );
  });

  it("sorts by newest", () => {
    const onSortChange = vi.fn();

    render(
      <ProductSort
        onSortChange={onSortChange}
      />,
    );

    fireEvent.change(
      screen.getByRole("combobox", {
        name: "Sort products",
      }),
      {
        target: {
          value: "newest",
        },
      },
    );

    expect(
      onSortChange,
    ).toHaveBeenCalledWith(
      "createdAt",
      "desc",
    );
  });

  it("sorts by biggest discount", () => {
    const onSortChange = vi.fn();

    render(
      <ProductSort
        onSortChange={onSortChange}
      />,
    );

    fireEvent.change(
      screen.getByRole("combobox", {
        name: "Sort products",
      }),
      {
        target: {
          value: "discount-desc",
        },
      },
    );

    expect(onSortChange).toHaveBeenCalledWith(
      "discountPercentage",
      "desc",
    );
  });

  it("clears sorting when Recommended is selected", () => {
    const onSortChange = vi.fn();

    render(
      <ProductSort
        sortBy="title"
        order="asc"
        onSortChange={onSortChange}
      />,
    );

    fireEvent.change(
      screen.getByRole("combobox", {
        name: "Sort products",
      }),
      {
        target: {
          value: "default",
        },
      },
    );

    expect(onSortChange).toHaveBeenCalledWith(
      undefined,
      undefined,
    );
  });
});
