import type { CartItem } from "@/types/cart";
import type {
  CheckoutAddress,
  CheckoutCustomer,
  DeliveryMethod,
  MockPaymentMethod,
} from "@/types/checkout";

export const ORDER_STATUSES = [
  "Order Placed",
  "Confirmed",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
] as const;

export type OrderStatus =
  (typeof ORDER_STATUSES)[number];

export interface OrderStatusEntry {
  status: OrderStatus;
  timestamp: string;
}

export interface OrderTotals {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
}

export interface Order {
  id: string;
  createdAt: string;
  expectedDeliveryDate: string;
  status: OrderStatus;
  statusHistory: OrderStatusEntry[];
  items: CartItem[];
  customer: CheckoutCustomer;
  address: CheckoutAddress;
  deliveryMethod: DeliveryMethod;
  paymentMethod: MockPaymentMethod;
  couponCode?: string;
  totals: OrderTotals;
}
