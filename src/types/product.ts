export interface ProductDimensions {
  width: number;
  height: number;
  depth: number;
}

export interface ProductReview {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface ProductVariant {
  id: string;
  label: string;
  stock: number;
}

export interface ProductMeta {
  createdAt: string;
  updatedAt: string;
  barcode: string;
  qrCode: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand?: string;
  sku: string;
  weight: number;
  dimensions: ProductDimensions;
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: ProductReview[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: ProductMeta;
  images: string[];
  thumbnail: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface ProductCategory {
  slug: string;
  name: string;
  url: string;
}

export type ProductSortField =
  | "title"
  | "price"
  | "rating"
  | "discountPercentage"
  | "createdAt";

export type SortOrder = "asc" | "desc";

export interface ProductListParams {
  limit?: number;
  skip?: number;
  sortBy?: ProductSortField;
  order?: SortOrder;
  category?: string;
  search?: string;
}

export type ProductAvailabilityFilter =
  | "in-stock"
  | "out-of-stock";

export interface ProductFilters {
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  availability?: ProductAvailabilityFilter;
  onSale?: boolean;
  brands: string[];
  categories: string[];
}
