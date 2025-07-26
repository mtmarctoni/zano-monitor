import type { DashboardData } from "@/types/dashboard"

export function getMockDashboardData(): DashboardData {
  const currentPrice = 9.87
  const targetPrice = 9.5
  const targetInvestment = 10000
  const targetTokens = Math.floor(targetInvestment / targetPrice)
  const currentValue = targetTokens * currentPrice
  const profitLoss = currentValue - targetInvestment
  const profitLossPercentage = (profitLoss / targetInvestment) * 100

  return {
    price: {
      current: currentPrice,
      change24h: 2.3,
      change7d: -1.2,
      change30d: 8.7,
      marketCap: 98700000,
      volume24h: 2400000,
      lastUpdated: new Date().toISOString(),
    },
    investment: {
      targetInvestment,
      targetPrice,
      targetTokens,
      currentValue,
      profitLoss,
      profitLossPercentage,
    },
    github: {
      stars: 1234,
      forks: 456,
      openIssues: 23,
      lastCommit: "2 days ago",
      recentActivity: "high",
    },
  }
}
