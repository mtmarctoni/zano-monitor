import type { DashboardData } from "@/types/dashboard";

export function getMockDashboardData(): DashboardData {
  const currentPrice = 9.87;
  const targetPrice = 9.5;
  const targetInvestment = 10000;
  const targetTokens = Math.floor(targetInvestment / targetPrice);
  const currentValue = targetTokens * currentPrice;
  const profitLoss = currentValue - targetInvestment;
  const profitLossPercentage = (profitLoss / targetInvestment) * 100;

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
    github: {
      stars: 1234,
      forks: 456,
      openIssues: 23,
      closedIssues: 100, // mock value
      contributors: 12, // mock value
      weeklyCommits: 34, // mock value
      lastCommit: "2 days ago",
      recentActivity: "high",
    },
    onchain: {
      height: 1234567,
      hashrate: 456789,
      difficulty: 1234567890,
      networkState: 8,
      totalCoins: 21000000,
      transactionCount: 12345678,
      dailyTransactions: 2345,
      dailyVolume: 56789,
      txPoolSize: 12,
      blockReward: 6.25,
      lastBlockTimestamp: Math.floor(Date.now() / 1000) - 300, // 5 minutes ago
      avgBlockTime: 120, // seconds
      incomingConnections: 50,
      outgoingConnections: 45,
      synchronizedConnections: 40,
      blockSizeUtilization: 75, // percentage
      networkGrowthRate: 5.2, // percentage
      adoptionScore: 82, // out of 100
    },
  };
}
