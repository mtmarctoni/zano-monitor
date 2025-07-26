export function formatPrice(price: number): string {
  return `$${price.toFixed(4)}`
}

export function formatLargeNumber(num: number): string {
  if (num >= 1e9) {
    return `$${(num / 1e9).toFixed(1)}B`
  } else if (num >= 1e6) {
    return `$${(num / 1e6).toFixed(1)}M`
  } else if (num >= 1e3) {
    return `$${(num / 1e3).toFixed(1)}K`
  }
  return `$${num.toFixed(2)}`
}

export function formatPercentage(percentage: number): string {
  const sign = percentage >= 0 ? "+" : ""
  return `${sign}${percentage.toFixed(2)}%`
}

export function formatTokens(tokens: number): string {
  return tokens.toLocaleString("en-US", { maximumFractionDigits: 0 })
}

export function getPercentageColor(percentage: number): string {
  return percentage >= 0 ? "text-green-500" : "text-red-500"
}

export function getTrendIcon(percentage: number): "up" | "down" {
  return percentage >= 0 ? "up" : "down"
}
