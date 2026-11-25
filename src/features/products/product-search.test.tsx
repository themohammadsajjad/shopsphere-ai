import {
  act,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { ProductSearch } from "./product-search";

describe("ProductSearch", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the initial search value", () => {
    render(
      <ProductSearch
        initialValue="phone"
        onSearchChange={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("searchbox", {
        name: "Search products",
      }),
    ).toHaveValue("phone");
  });

  it("emits a trimmed value after 350ms", () => {
    const onSearchChange = vi.fn();

    render(
      <ProductSearch
        onSearchChange={onSearchChange}
      />,
    );

    onSearchChange.mockClear();

    fireEvent.change(
      screen.getByRole("searchbox", {
        name: "Search products",
      }),
      {
        target: {
          value: "  laptop  ",
        },
      },
    );

    act(() => {
      vi.advanceTimersByTime(349);
    });

    expect(onSearchChange).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(onSearchChange).toHaveBeenCalledWith(
      "laptop",
    );
  });

  it("resets the debounce timer while typing", () => {
    const onSearchChange = vi.fn();

    render(
      <ProductSearch
        onSearchChange={onSearchChange}
      />,
    );

    onSearchChange.mockClear();

    const input = screen.getByRole("searchbox", {
      name: "Search products",
    });

    fireEvent.change(input, {
      target: {
        value: "lap",
      },
    });

    act(() => {
      vi.advanceTimersByTime(200);
    });

    fireEvent.change(input, {
      target: {
        value: "laptop",
      },
    });

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(onSearchChange).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(150);
    });

    expect(onSearchChange).toHaveBeenCalledWith(
      "laptop",
    );
  });

  it("clears the search input and resets the search", () => {
    const onSearchChange = vi.fn();

    render(
      <ProductSearch
        key="phone"
        initialValue="phone"
        onSearchChange={onSearchChange}
      />,
    );

    onSearchChange.mockClear();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Clear product search",
      }),
    );

    expect(
      screen.getByRole("searchbox", {
        name: "Search products",
      }),
    ).toHaveValue("");

    act(() => {
      vi.advanceTimersByTime(350);
    });

    expect(onSearchChange).toHaveBeenCalledWith(
      undefined,
    );
  });

  it("uses a new initial value when remounted", () => {
    const onSearchChange = vi.fn();

    const { rerender } = render(
      <ProductSearch
        initialValue="phone"
        onSearchChange={onSearchChange}
      />,
    );

    expect(
      screen.getByRole("searchbox", {
        name: "Search products",
      }),
    ).toHaveValue("phone");

    rerender(
      <ProductSearch
        key="laptop"
        initialValue="laptop"
        onSearchChange={onSearchChange}
      />,
    );

    expect(
      screen.getByRole("searchbox", {
        name: "Search products",
      }),
    ).toHaveValue("laptop");
  });

  it("does not emit a redundant empty search for whitespace-only input", () => {
    const onSearchChange = vi.fn();

    render(
      <ProductSearch
        onSearchChange={onSearchChange}
      />,
    );

    onSearchChange.mockClear();

    fireEvent.change(
      screen.getByRole("searchbox", {
        name: "Search products",
      }),
      {
        target: {
          value: "   ",
        },
      },
    );

    act(() => {
      vi.advanceTimersByTime(350);
    });

    expect(onSearchChange).not.toHaveBeenCalled();
  });
});
