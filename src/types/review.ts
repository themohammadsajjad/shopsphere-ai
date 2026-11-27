export type ReviewSort =
  | "recent"
  | "highest"
  | "lowest"
  | "helpful";

export interface LocalReview {
  id: string;
  productId: number;
  rating: number;
  comment: string;
  createdAt: string;
  reviewerName: string;
  reviewerEmail: string;
  verifiedPurchase: boolean;
  helpful: number;
  notHelpful: number;
}

export interface ReviewVote {
  helpful: number;
  notHelpful: number;
}

export interface DisplayReview {
  id: string;
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
  verifiedPurchase: boolean;
  helpful: number;
  notHelpful: number;
  local: boolean;
}
