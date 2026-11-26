import {
  act,
  renderHook,
} from "@testing-library/react";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { useDebouncedValue } from "./use-debounced-value";

describe("useDebouncedValue", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns the initial value immediately", () => {
    const { result } = renderHook(() =>
      useDebouncedValue("phone"),
    );

    expect(result.current).toBe("phone");
  });

  it("updates the value after the debounce delay", () => {
    const { result, rerender } = renderHook(
      ({ value }) =>
        useDebouncedValue(value, 350),
      {
        initialProps: {
          value: "phone",
        },
      },
    );

    rerender({
      value: "laptop",
    });

    expect(result.current).toBe("phone");

    act(() => {
      vi.advanceTimersByTime(349);
    });

    expect(result.current).toBe("phone");

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(result.current).toBe("laptop");
  });

  it("resets the timer when the value changes again", () => {
    const { result, rerender } = renderHook(
      ({ value }) =>
        useDebouncedValue(value, 350),
      {
        initialProps: {
          value: "p",
        },
      },
    );

    rerender({
      value: "ph",
    });

    act(() => {
      vi.advanceTimersByTime(200);
    });

    rerender({
      value: "phone",
    });

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current).toBe("p");

    act(() => {
      vi.advanceTimersByTime(150);
    });

    expect(result.current).toBe("phone");
  });
});
