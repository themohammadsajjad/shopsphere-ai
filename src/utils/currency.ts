export const USD_TO_INR_RATE = 83;

export function convertUsdToInr(
  amount: number,
) {
  return Number(
    (amount * USD_TO_INR_RATE).toFixed(2),
  );
}

export function formatInr(
  amount: number,
) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
}
