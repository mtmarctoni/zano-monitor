export const API_CONFIG = {
  // CoinGecko API configuration
  COINGECKO: {
    BASE_URL: "https://api.coingecko.com/api/v3",
    PRO_BASE_URL: "https://pro-api.coingecko.com/api/v3",
    RATE_LIMIT_FREE: 50, // requests per minute for free tier
    RATE_LIMIT_PRO: 500, // requests per minute for pro tier
    TIMEOUT: 10000, // 10 seconds
    CACHE_TTL: 120, // 2 minutes in seconds
    ENDPOINTS: {
      COIN_DATA: "/coins/{id}",
      MARKET_CHART: "/coins/{id}/market_chart",
      SIMPLE_PRICE: "/simple/price",
    },
  },

  // GitHub API configuration
  GITHUB: {
    BASE_URL: "https://api.github.com",
    RATE_LIMIT_UNAUTHENTICATED: 60, // requests per hour
    RATE_LIMIT_AUTHENTICATED: 5000, // requests per hour with token
    TIMEOUT: 10000, // 10 seconds
    CACHE_TTL: 300, // 5 minutes in seconds
    ENDPOINTS: {
      REPO: "/repos/{owner}/{repo}",
      COMMITS: "/repos/{owner}/{repo}/commits",
      CONTRIBUTORS: "/repos/{owner}/{repo}/contributors",
      ISSUES: "/repos/{owner}/{repo}/issues",
      USER_EVENTS: "/users/{username}/events/public",
      USER_ORGS: "/users/{username}/orgs"
    },
  },

  // Zano Blockchain Explorer API configuration
  ONCHAIN: {
    BASE_URL: "https://explorer.zano.org/api",
    TIMEOUT: 20000, // 20 seconds (blockchain APIs can be slower)
    CACHE_TTL: 180, // 3 minutes in seconds
    ENDPOINTS: {
      GET_INFO: "/get_info/{height}",
      GET_TOTAL_COINS: "/get_total_coins",
      GET_BLOCKS_DETAILS: "/get_blocks_details/{offset}/{count}",
      GET_POOL_TXS_BRIEF: "/get_pool_txs_brief_details",
      GET_TX_DETAILS: "/get_tx_details/{tx_hash}",
    },
  },

  // Refresh intervals (in milliseconds)
  REFRESH_INTERVALS: {
    PRICE_DATA: 120000, // 2 minutes
    GITHUB_DATA: 1000 * 60 * 60 * 240, // 1 day
    AUTO_REFRESH: 1000 * 60 * 60 * 24, // 1 day for dashboard auto-refresh
  },

  // ZANO specific configuration
  ZANO: {
    COIN_ID: "zano",
    GITHUB_OWNER: "hyle-team",
    GITHUB_REPO: "zano",
    SYMBOL: "ZANO",
    FULL_REPO_PATH: "hyle-team/zano",
    EXPLORER_URL: "https://explorer.zano.org",
    DECIMALS: 12, // ZANO has 12 decimal places
    BLOCKS_PER_DAY: 1440, // Approximate blocks per day (1 minute block time)
  },

  // Request configuration
  REQUEST: {
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000, // 1 second
    DEFAULT_HEADERS: {
      "User-Agent": "Zano-Investment-Monitor/1.0",
      Accept: "application/json",
    },
  },

  // Error messages
  ERROR_MESSAGES: {
    NETWORK_ERROR: "Network connection failed. Please check your internet connection.",
    API_RATE_LIMIT: "API rate limit exceeded. Please try again later.",
    API_UNAVAILABLE: "API service is temporarily unavailable.",
    INVALID_RESPONSE: "Received invalid response from API.",
    TIMEOUT: "Request timed out. Please try again.",
  },
}

// Helper functions for configuration
export const getApiUrl = (service: keyof typeof API_CONFIG, endpoint: string, params: Record<string, string> = {}) => {
  const config = API_CONFIG[service]
  if (!config || !("BASE_URL" in config)) {
    throw new Error(`Invalid service: ${service}`)
  }

  let url = `${config.BASE_URL}${endpoint}`

  // Replace path parameters
  Object.entries(params).forEach(([key, value]) => {
    url = url.replace(`{${key}}`, value)
  })

  return url
}

export const getRateLimit = (service: keyof typeof API_CONFIG, hasToken = false) => {
  const config = API_CONFIG[service] as any
  if (!config) {
    throw new Error(`Invalid service: ${service}`)
  }

  if (service === "GITHUB") {
    return hasToken ? config.RATE_LIMIT_AUTHENTICATED : config.RATE_LIMIT_UNAUTHENTICATED
  }

  if (service === "COINGECKO") {
    return hasToken ? config.RATE_LIMIT_PRO : config.RATE_LIMIT_FREE
  }

  return 60 // default fallback
}
