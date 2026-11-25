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

import { ProductPagination } from "./product-pagination";

describe("ProductPagination", () => {
  it("does not render when all products fit on one page", () => {
    const { container } = render(
      <ProductPagination
        page={1}
        total={10}
        limit={12}
        onPageChange={vi.fn()}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("disables Previous on the first page", () => {
    render(
      <ProductPagination
        page={1}
        total={30}
        limit={12}
        onPageChange={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("button", {
        name: "Previous",
      }),
    ).toBeDisabled();

    expect(
      screen.getByRole("button", {
        name: "Next",
      }),
    ).toBeEnabled();

    expect(
      screen.getByText("Page 1 of 3"),
    ).toBeInTheDocument();
  });

  it("moves to the next page", () => {
    const onPageChange = vi.fn();

    render(
      <ProductPagination
        page={1}
        total={30}
        limit={12}
        onPageChange={onPageChange}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Next",
      }),
    );

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("moves to the previous page", () => {
    const onPageChange = vi.fn();

    render(
      <ProductPagination
        page={2}
        total={30}
        limit={12}
        onPageChange={onPageChange}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Previous",
      }),
    );

    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it("disables Next on the last page", () => {
    render(
      <ProductPagination
        page={3}
        total={30}
        limit={12}
        onPageChange={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("button", {
        name: "Previous",
      }),
    ).toBeEnabled();

    expect(
      screen.getByRole("button", {
        name: "Next",
      }),
    ).toBeDisabled();

    expect(
      screen.getByText("Page 3 of 3"),
    ).toBeInTheDocument();
  });
});
