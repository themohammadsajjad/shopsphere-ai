export type CheckoutStep =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6;

export interface CheckoutCustomer {
  name: string;
  email: string;
  phone: string;
}

export interface CheckoutAddress {
  id?: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pinCode: string;
}

export type DeliveryMethodId =
  | "standard"
  | "express"
  | "priority";

export interface DeliveryMethod {
  id: DeliveryMethodId;
  label: string;
  description: string;
  cost: number;
  etaMinDays: number;
  etaMaxDays: number;
}

export type MockPaymentMethod =
  | "mock-card"
  | "mock-upi"
  | "mock-cod";
