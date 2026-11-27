import type { Product } from "@/types/product";

export interface AssistantIntent {
  category?: string;
  maxPrice?: number;
  minPrice?: number;
  minRating?: number;
  color?: string;
}

export interface AssistantContext {
  intent?: AssistantIntent;
  lastProducts: Product[];
}

export type ParsedAssistantRequest =
  | {
      kind: "query";
      intent: AssistantIntent;
    }
  | {
      kind: "similar";
      productIndex: number;
    }
  | {
      kind: "fallback";
    };

export type AssistantRole =
  | "user"
  | "assistant";

export interface AssistantMessage {
  id: string;
  role: AssistantRole;
  text: string;
  products?: Product[];
  suggestions?: string[];
}

export interface AssistantTurnResult {
  text: string;
  products: Product[];
  suggestions?: string[];
  context: AssistantContext;
}
