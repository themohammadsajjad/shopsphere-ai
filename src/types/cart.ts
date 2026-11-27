export interface CartItem {
  id: string;
  productId: number;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
  stock: number;
  variantId?: string;
  variantLabel?: string;
}

export interface AddCartItemInput {
  productId: number;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
  stock: number;
  variantId?: string;
  variantLabel?: string;
}
