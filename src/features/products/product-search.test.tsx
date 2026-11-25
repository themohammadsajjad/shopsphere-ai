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

import {
  addRecentSearch,
  clearRecentSearches,
  getRecentSearches,
} from "@/features/products/search-history";

import { ProductSearch } from "./product-search";

vi.mock("@/features/products/search-history", () => ({
  getRecentSearches: vi.fn(),
  addRecentSearch: vi.fn(),
  clearRecentSearches: vi.fn(),
}));

vi.mock("@/features/products/search-suggestions", () => ({
  SearchSuggestions: ({
    search,
    recentSearches,
    onSelectSearch,
    onClearRecent,
  }: {
    search: string;
    recentSearches: string[];
    onSelectSearch: (search: string) => void;
    onClearRecent: () => void;
  }) => (
    <div
      role="dialog"
      aria-label="Search suggestions"
      data-search={search}
    >
      <span data-testid="recent-searches">
        {recentSearches.join(",")}
      </span>

      <button
        type="button"
        onClick={() =>
          onSelectSearch("Laptop Pro")
        }
      >
        Choose suggestion
      </button>

      <button
        type="button"
        onClick={onClearRecent}
      >
        Mock clear history
      </button>
    </div>
  ),
}));

const mockedGetRecentSearches = vi.mocked(
  getRecentSearches,
);

const mockedAddRecentSearch = vi.mocked(
  addRecentSearch,
);

const mockedClearRecentSearches = vi.mocked(
  clearRecentSearches,
);

describe("ProductSearch", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();

    mockedGetRecentSearches.mockReturnValue([]);
    mockedAddRecentSearch.mockImplementation(
      (search) => [search],
    );
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

  it("stores a manually typed search after debounce", () => {
    render(
      <ProductSearch
        onSearchChange={vi.fn()}
      />,
    );

    fireEvent.change(
      screen.getByRole("searchbox", {
        name: "Search products",
      }),
      {
        target: {
          value: "laptop",
        },
      },
    );

    act(() => {
      vi.advanceTimersByTime(350);
    });

    expect(
      mockedAddRecentSearch,
    ).toHaveBeenCalledWith("laptop");
  });

  it("resets the debounce timer while typing", () => {
    const onSearchChange = vi.fn();

    render(
      <ProductSearch
        onSearchChange={onSearchChange}
      />,
    );

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

    mockedGetRecentSearches.mockReturnValue([
      "phone",
    ]);

    render(
      <ProductSearch
        initialValue="phone"
        onSearchChange={onSearchChange}
      />,
    );

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

    expect(
      screen.getByRole("dialog", {
        name: "Search suggestions",
      }),
    ).toBeInTheDocument();

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
        key="phone"
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

  it("opens recent and popular suggestions on focus", () => {
    mockedGetRecentSearches.mockReturnValue([
      "camera",
      "phone",
    ]);

    render(
      <ProductSearch
        onSearchChange={vi.fn()}
      />,
    );

    fireEvent.focus(
      screen.getByRole("searchbox", {
        name: "Search products",
      }),
    );

    expect(
      mockedGetRecentSearches,
    ).toHaveBeenCalledTimes(1);

    expect(
      screen.getByRole("dialog", {
        name: "Search suggestions",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByTestId("recent-searches"),
    ).toHaveTextContent("camera,phone");
  });

  it("does not show typed suggestions until debounce completes", () => {
    render(
      <ProductSearch
        onSearchChange={vi.fn()}
      />,
    );

    const input = screen.getByRole("searchbox", {
      name: "Search products",
    });

    fireEvent.focus(input);

    fireEvent.change(input, {
      target: {
        value: "lap",
      },
    });

    expect(
      screen.queryByRole("dialog", {
        name: "Search suggestions",
      }),
    ).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(350);
    });

    expect(
      screen.getByRole("dialog", {
        name: "Search suggestions",
      }),
    ).toHaveAttribute(
      "data-search",
      "lap",
    );
  });

  it("stores a selected suggestion in recent history", () => {
    mockedAddRecentSearch.mockReturnValue([
      "Laptop Pro",
      "phone",
    ]);

    render(
      <ProductSearch
        onSearchChange={vi.fn()}
      />,
    );

    fireEvent.focus(
      screen.getByRole("searchbox", {
        name: "Search products",
      }),
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Choose suggestion",
      }),
    );

    expect(
      mockedAddRecentSearch,
    ).toHaveBeenCalledWith("Laptop Pro");

    expect(
      screen.getByRole("searchbox", {
        name: "Search products",
      }),
    ).toHaveValue("Laptop Pro");

    expect(
      screen.queryByRole("dialog", {
        name: "Search suggestions",
      }),
    ).not.toBeInTheDocument();
  });

  it("clears recent history from the suggestions dropdown", () => {
    mockedGetRecentSearches.mockReturnValue([
      "phone",
    ]);

    render(
      <ProductSearch
        onSearchChange={vi.fn()}
      />,
    );

    fireEvent.focus(
      screen.getByRole("searchbox", {
        name: "Search products",
      }),
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Mock clear history",
      }),
    );

    expect(
      mockedClearRecentSearches,
    ).toHaveBeenCalledTimes(1);

    expect(
      screen.getByTestId("recent-searches"),
    ).toHaveTextContent("");
  });
});
