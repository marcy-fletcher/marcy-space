export type Currency = "USD" | "USDC"

export type Money<TCurrency extends Currency = Currency> = Readonly<{
  amount: number
  currency: TCurrency
}>

export function formatMoney(money: Money) {
  return `${money.amount.toLocaleString("en-US", {
    maximumFractionDigits: 6,
  })} ${money.currency}`
}
