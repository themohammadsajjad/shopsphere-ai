import {
  describe,
  expect,
  it,
} from "vitest";

import {
  STARTER_PROMPTS,
  runAssistantTurn,
} from "./assistant-service";

describe("assistant service", () => {
  it("provides three starter prompts", () => {
    expect(
      STARTER_PROMPTS,
    ).toHaveLength(3);
  });

  it("returns clarification suggestions for unparseable input", async () => {
    const result =
      await runAssistantTurn(
        "hmm not sure",
        {
          lastProducts: [],
        },
      );

    expect(
      result.products,
    ).toEqual([]);

    expect(
      result.suggestions,
    ).toHaveLength(3);

    expect(
      result.text,
    ).toMatch(
      /could not confidently understand/i,
    );
  });
});
