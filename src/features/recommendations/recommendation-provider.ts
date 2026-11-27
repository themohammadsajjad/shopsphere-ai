import { runRecommendationStrategy } from "@/features/recommendations/mock-recommendation-engine";
import type {
  RecommendationContext,
  RecommendationRequest,
  RecommendationResult,
} from "@/types/recommendation";

export interface RecommendationProvider {
  getRecommendations(
    request: RecommendationRequest,
    context: RecommendationContext,
  ): Promise<RecommendationResult>;
}

export const mockRecommendationProvider: RecommendationProvider =
  {
    async getRecommendations(
      request,
      context,
    ) {
      return runRecommendationStrategy(
        request.strategy,
        context,
        request.limit ?? 4,
      );
    },
  };
