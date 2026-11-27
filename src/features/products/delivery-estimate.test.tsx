import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import {
  describe,
  expect,
  it,
} from "vitest";

import { DeliveryEstimate } from "./delivery-estimate";

describe("DeliveryEstimate", () => {
  it("shows an error for an invalid PIN code", () => {
    render(<DeliveryEstimate />);

    fireEvent.change(
      screen.getByLabelText("Delivery PIN code"),
      {
        target: {
          value: "123",
        },
      },
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Check delivery",
      }),
    );

    expect(
      screen.getByRole("alert"),
    ).toHaveTextContent(
      "Enter a valid 6-digit Indian PIN code.",
    );
  });

  it("shows a delivery estimate for a valid PIN code", () => {
    render(<DeliveryEstimate />);

    fireEvent.change(
      screen.getByLabelText("Delivery PIN code"),
      {
        target: {
          value: "144411",
        },
      },
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Check delivery",
      }),
    );

    expect(
      screen.getByRole("status"),
    ).toHaveTextContent(
      "Estimated delivery in 3–5 business days.",
    );
  });

  it("keeps only numeric PIN input", () => {
    render(<DeliveryEstimate />);

    const input =
      screen.getByLabelText(
        "Delivery PIN code",
      );

    fireEvent.change(input, {
      target: {
        value: "14ab44-11",
      },
    });

    expect(input).toHaveValue(
      "144411",
    );
  });
});
