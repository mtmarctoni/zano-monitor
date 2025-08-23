export interface GitHubUserEvent {
  id: string;
  type: string;
  actor: {
    login: string;
    avatar_url: string;
  };
  repo: {
    id: number;
    name: string;
    url: string;
  };
  payload: {
    number?: number;
    issue?: {
      number: number;
      title: string;
      state: string;
      url: string;
    };
    release?: {
      tag_name: string;
      name: string;
      url: string;
    };
    action?: string;
    ref?: string;
    ref_type?: string;
    push_id?: number;
    size?: number;
    distinct_size?: number;
    commits?: Array<{
      sha: string;
      message: string;
      url: string;
    }>;
  };
  public: boolean;
  created_at: string;
}

export interface GitHubUserActivity {
  events: GitHubUserEvent[];
  eventCounts: Record<string, number>;
  repos: Set<string>;
  lastUpdated: string;
}

export interface GitHubData {
  stars: number;
  forks: number;
  openIssues: number;
  closedIssues: number;
  contributors: number;
  weeklyCommits: number;
  lastCommit: string;
  recentActivity: "high" | "medium" | "low";
  userActivity?: GitHubUserActivity | null; // Optional field for user activity
}

export interface PriceData {
  current: number
  change24h: number
  change7d: number
  change30d: number
  marketCap: number
  volume24h: number
  lastUpdated: string
}

export interface OnchainData {
  // Network Health Metrics
  height: number
  hashrate: number
  difficulty: number
  networkState: number

  // Adoption Metrics
  totalCoins: number
  transactionCount: number
  dailyTransactions: number
  dailyVolume: number

  // Network Activity
  txPoolSize: number
  blockReward: number
  lastBlockTimestamp: number
  avgBlockTime: number

  // Network Connectivity
  incomingConnections: number
  outgoingConnections: number
  synchronizedConnections: number

  // Growth Indicators
  blockSizeUtilization: number
  networkGrowthRate: number
  adoptionScore: number
}

export interface DashboardData {
  price: PriceData
  github: GitHubData
  onchain: OnchainData
}

export interface InvestmentData {
  targetInvestment: number
  targetPrice: number
  targetTokens: number
  currentValue: number
  profitLoss: number
  profitLossPercentage: number
}
