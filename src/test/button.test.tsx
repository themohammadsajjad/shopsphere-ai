import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("renders and handles a click", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>Shop now</Button>);

    const button = screen.getByRole("button", {
      name: "Shop now",
    });

    expect(button).toBeInTheDocument();

    await user.click(button);

    expect(handleClick).toHaveBeenCalledOnce();
  });
});
