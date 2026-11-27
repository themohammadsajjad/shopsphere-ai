import type {
  AssistantContext,
  ParsedAssistantRequest,
} from "@/types/assistant";

const CATEGORY_ALIASES: Array<{
  category: string;
  terms: string[];
}> = [
  {
    category: "headphones",
    terms: [
      "headphone",
      "headphones",
      "earbuds",
      "earphones",
    ],
  },
  {
    category: "smartphones",
    terms: [
      "smartphone",
      "smartphones",
      "phone",
      "phones",
      "mobile phone",
    ],
  },
  {
    category: "laptops",
    terms: [
      "laptop",
      "laptops",
      "notebook",
    ],
  },
  {
    category: "shoes",
    terms: [
      "shoe",
      "shoes",
      "sneaker",
      "sneakers",
    ],
  },
  {
    category: "watches",
    terms: [
      "watch",
      "watches",
    ],
  },
  {
    category: "beauty",
    terms: [
      "beauty",
      "makeup",
      "cosmetic",
      "cosmetics",
    ],
  },
  {
    category: "fragrances",
    terms: [
      "fragrance",
      "fragrances",
      "perfume",
      "perfumes",
    ],
  },
  {
    category: "furniture",
    terms: [
      "furniture",
      "chair",
      "chairs",
      "table",
      "tables",
    ],
  },
];

const COLORS = [
  "black",
  "white",
  "blue",
  "red",
  "green",
  "pink",
  "yellow",
  "brown",
  "grey",
  "gray",
  "purple",
  "orange",
];

function normalize(
  value: string,
) {
  return value
    .toLowerCase()
    .replaceAll("₹", " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractCategory(
  input: string,
) {
  for (const entry of CATEGORY_ALIASES) {
    if (
      entry.terms.some(
        (term) =>
          input.includes(term),
      )
    ) {
      return entry.category;
    }
  }

  return undefined;
}

function extractPrice(
  input: string,
) {
  const maxMatch =
    input.match(
      /(?:under|below|less than|up to|upto)\s*(?:rs\.?|inr)?\s*([\d,]+)/i,
    );

  const minMatch =
    input.match(
      /(?:above|over|more than|starting from)\s*(?:rs\.?|inr)?\s*([\d,]+)/i,
    );

  return {
    maxPrice: maxMatch
      ? Number(
          maxMatch[1].replaceAll(
            ",",
            "",
          ),
        )
      : undefined,

    minPrice: minMatch
      ? Number(
          minMatch[1].replaceAll(
            ",",
            "",
          ),
        )
      : undefined,
  };
}

function extractRating(
  input: string,
) {
  if (
    /\b(good|high|well[- ]rated)\b.*\brating/i.test(
      input,
    ) ||
    /\bgood ratings?\b/i.test(
      input,
    )
  ) {
    return 4;
  }

  const direct =
    input.match(
      /([3-5](?:\.\d)?)\s*(?:\+|stars?|rating)/i,
    );

  if (direct) {
    return Number(
      direct[1],
    );
  }

  return undefined;
}

function extractColor(
  input: string,
) {
  return COLORS.find(
    (color) =>
      new RegExp(
        `\\b${color}\\b`,
        "i",
      ).test(input),
  );
}

function median(
  values: number[],
) {
  if (
    values.length === 0
  ) {
    return undefined;
  }

  const sorted = [
    ...values,
  ].sort(
    (a, b) => a - b,
  );

  const middle =
    Math.floor(
      sorted.length / 2,
    );

  if (
    sorted.length % 2 === 0
  ) {
    return (
      (sorted[
        middle - 1
      ] +
        sorted[middle]) /
      2
    );
  }

  return sorted[middle];
}

function similarIndex(
  input: string,
) {
  const match =
    input.match(
      /(?:like|similar to)\s+(?:the\s+)?(first|second|third|1st|2nd|3rd|1|2|3)\b/i,
    );

  if (!match) {
    return undefined;
  }

  const lookup:
    Record<string, number> = {
      first: 0,
      "1st": 0,
      "1": 0,
      second: 1,
      "2nd": 1,
      "2": 1,
      third: 2,
      "3rd": 2,
      "3": 2,
    };

  return lookup[
    match[1].toLowerCase()
  ];
}

export function parseAssistantInput(
  rawInput: string,
  context: AssistantContext,
): ParsedAssistantRequest {
  const input =
    normalize(rawInput);

  const requestedIndex =
    similarIndex(input);

  if (
    requestedIndex !==
    undefined
  ) {
    if (
      context.lastProducts[
        requestedIndex
      ]
    ) {
      return {
        kind: "similar",
        productIndex:
          requestedIndex,
      };
    }

    return {
      kind: "fallback",
    };
  }

  const explicitCategory =
    extractCategory(input);

  const previous =
    context.intent ?? {};

  if (
    /\bbetter ratings?\b/i.test(
      input,
    ) ||
    /\bbetter rated\b/i.test(
      input,
    )
  ) {
    if (
      !context.intent
    ) {
      return {
        kind: "fallback",
      };
    }

    return {
      kind: "query",
      intent: {
        ...previous,
        minRating:
          Math.min(
            5,
            Math.max(
              4,
              (previous.minRating ??
                4) + 0.5,
            ),
          ),
      },
    };
  }

  if (
    /\bcheaper\b/i.test(
      input,
    )
  ) {
    if (
      !context.intent
    ) {
      return {
        kind: "fallback",
      };
    }

    const lastMedian =
      median(
        context.lastProducts.map(
          (product) =>
            product.price,
        ),
      );

    const maxPrice =
      previous.maxPrice
        ? Math.round(
            previous.maxPrice *
              0.8,
          )
        : lastMedian
          ? Math.round(
              lastMedian,
            )
          : undefined;

    if (!maxPrice) {
      return {
        kind: "fallback",
      };
    }

    return {
      kind: "query",
      intent: {
        ...previous,
        minPrice:
          undefined,
        maxPrice,
      },
    };
  }

  if (
    /\bmore expensive\b/i.test(
      input,
    ) ||
    /\bpricier\b/i.test(
      input,
    )
  ) {
    if (
      !context.intent
    ) {
      return {
        kind: "fallback",
      };
    }

    const lastMedian =
      median(
        context.lastProducts.map(
          (product) =>
            product.price,
        ),
      );

    const minPrice =
      lastMedian
        ? Math.round(
            lastMedian *
              1.1,
          )
        : previous.maxPrice;

    if (!minPrice) {
      return {
        kind: "fallback",
      };
    }

    return {
      kind: "query",
      intent: {
        ...previous,
        minPrice,
        maxPrice:
          undefined,
      },
    };
  }

  const price =
    extractPrice(input);

  const minRating =
    extractRating(input);

  const color =
    extractColor(input);

  const hasNewSignal =
    Boolean(
      explicitCategory ||
        price.maxPrice !==
          undefined ||
        price.minPrice !==
          undefined ||
        minRating !==
          undefined ||
        color,
    );

  if (!hasNewSignal) {
    return {
      kind: "fallback",
    };
  }

  return {
    kind: "query",
    intent: {
      ...previous,

      category:
        explicitCategory ??
        previous.category,

      maxPrice:
        price.maxPrice ??
        previous.maxPrice,

      minPrice:
        price.minPrice ??
        previous.minPrice,

      minRating:
        minRating ??
        previous.minRating,

      color:
        color ??
        previous.color,
    },
  };
}
