import { parseAssistantInput } from "@/features/ai-assistant/intent-parser";
import {
  findProductsForAssistant,
  getRecommendations,
} from "@/services/recommendation-service";
import type {
  AssistantContext,
  AssistantIntent,
  AssistantTurnResult,
} from "@/types/assistant";
import { formatInr } from "@/utils/currency";

export const STARTER_PROMPTS = [
  "Show me headphones under 5000",
  "Show me smartphones with good ratings",
  "Show me laptops under 60000 with good ratings",
];

const FALLBACK_SUGGESTIONS = [
  "Show me headphones under 5000",
  "Show me smartphones with good ratings",
  "Show me shoes under 4000",
];

function describeIntent(
  intent: AssistantIntent,
) {
  const filters:
    string[] = [];

  if (intent.category) {
    filters.push(
      `category = ${intent.category}`,
    );
  }

  if (
    intent.minPrice !==
    undefined
  ) {
    filters.push(
      `minimum price = ${formatInr(
        intent.minPrice,
      )}`,
    );
  }

  if (
    intent.maxPrice !==
    undefined
  ) {
    filters.push(
      `max price = ${formatInr(
        intent.maxPrice,
      )}`,
    );
  }

  if (
    intent.minRating !==
    undefined
  ) {
    filters.push(
      `minimum rating = ${intent.minRating.toFixed(
        1,
      )}`,
    );
  }

  if (intent.color) {
    filters.push(
      `color = ${intent.color}`,
    );
  }

  return filters.join(", ");
}

export async function runAssistantTurn(
  input: string,
  context: AssistantContext,
): Promise<AssistantTurnResult> {
  const parsed =
    parseAssistantInput(
      input,
      context,
    );

  if (
    parsed.kind ===
    "fallback"
  ) {
    return {
      text:
        "I could not confidently understand that shopping request. Try a category with a price or rating preference.",
      products: [],
      suggestions:
        FALLBACK_SUGGESTIONS,
      context,
    };
  }

  if (
    parsed.kind ===
    "similar"
  ) {
    const seed =
      context.lastProducts[
        parsed.productIndex
      ];

    if (!seed) {
      return {
        text:
          "I could not find the product you referenced. Try a new product request first.",
        products: [],
        suggestions:
          FALLBACK_SUGGESTIONS,
        context,
      };
    }

    const result =
      await getRecommendations(
        {
          strategy:
            "similar-products",
          seedProduct: seed,
          limit: 4,
        },
      );

    return {
      text: `Here are products similar to ${seed.title}. I used ShopSphere's Similar Products recommendation strategy.`,
      products:
        result.products,
      context: {
        ...context,
        lastProducts:
          result.products,
      },
    };
  }

  const products =
    await findProductsForAssistant(
      parsed.intent,
      6,
    );

  const description =
    describeIntent(
      parsed.intent,
    );

  if (
    products.length === 0
  ) {
    return {
      text: `I applied these filters: ${description}. I could not find a matching product, so try widening the price or rating range.`,
      products: [],
      suggestions:
        FALLBACK_SUGGESTIONS,
      context: {
        intent:
          parsed.intent,
        lastProducts: [],
      },
    };
  }

  return {
    text: `I applied these filters: ${description}. Here are the best matching products, ranked by rating and price.`,
    products,
    context: {
      intent:
        parsed.intent,
      lastProducts:
        products,
    },
  };
}
