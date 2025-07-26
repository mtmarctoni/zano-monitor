import type { GitHubData } from "@/types/dashboard"
import { API_CONFIG, getApiUrl, getRateLimit } from "@/config/api"

export interface GitHubRepoResponse {
  stargazers_count: number
  forks_count: number
  open_issues_count: number
  pushed_at: string
}

export interface GitHubCommitResponse {
  commit: {
    committer: {
      date: string
    }
  }
}

export interface GitHubContributorResponse {
  login: string
  contributions: number
}

export interface GitHubIssuesResponse {
  state: "open" | "closed"
  created_at: string
  closed_at?: string
}

export class GitHubService {
  private static instance: GitHubService
  private token?: string

  constructor(token?: string) {
    this.token = token
  }

  static getInstance(token?: string): GitHubService {
    if (!GitHubService.instance) {
      GitHubService.instance = new GitHubService(token)
    }
    return GitHubService.instance
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      ...API_CONFIG.REQUEST.DEFAULT_HEADERS,
      Accept: "application/vnd.github.v3+json",
    }

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`
    }

    return headers
  }

  private async makeRequest(endpoint: string, params: Record<string, string> = {}): Promise<Response> {
    const url = getApiUrl("GITHUB", endpoint, params)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.GITHUB.TIMEOUT)

    try {
      const response = await fetch(url, {
        headers: this.getHeaders(),
        signal: controller.signal,
        next: { revalidate: API_CONFIG.GITHUB.CACHE_TTL },
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error(API_CONFIG.ERROR_MESSAGES.API_RATE_LIMIT)
        }
        throw new Error(`${API_CONFIG.ERROR_MESSAGES.API_UNAVAILABLE}: ${response.status}`)
      }

      return response
    } catch (error) {
      clearTimeout(timeoutId)
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error(API_CONFIG.ERROR_MESSAGES.TIMEOUT)
      }
      throw error
    }
  }

  private formatLastCommitDate(dateString: string): string {
    const lastCommitDate = new Date(dateString)
    const now = new Date()
    const daysSinceLastCommit = Math.floor((now.getTime() - lastCommitDate.getTime()) / (1000 * 60 * 60 * 24))

    if (daysSinceLastCommit === 0) {
      return "Today"
    } else if (daysSinceLastCommit === 1) {
      return "1 day ago"
    } else if (daysSinceLastCommit < 7) {
      return `${daysSinceLastCommit} days ago`
    } else if (daysSinceLastCommit < 30) {
      const weeks = Math.floor(daysSinceLastCommit / 7)
      return `${weeks} week${weeks > 1 ? "s" : ""} ago`
    } else {
      const months = Math.floor(daysSinceLastCommit / 30)
      return `${months} month${months > 1 ? "s" : ""} ago`
    }
  }

  private calculateActivityLevel(weeklyCommits: number): "high" | "medium" | "low" {
    if (weeklyCommits >= 10) {
      return "high"
    } else if (weeklyCommits >= 3) {
      return "medium"
    } else {
      return "low"
    }
  }

  async fetchRepositoryData(
    owner: string = API_CONFIG.ZANO.GITHUB_OWNER,
    repo: string = API_CONFIG.ZANO.GITHUB_REPO,
  ): Promise<GitHubRepoResponse> {
    try {
      const response = await this.makeRequest(API_CONFIG.GITHUB.ENDPOINTS.REPO, { owner, repo })
      const data = await response.json()

      if (!data.stargazers_count && data.stargazers_count !== 0) {
        throw new Error(API_CONFIG.ERROR_MESSAGES.INVALID_RESPONSE)
      }

      return data
    } catch (error) {
      console.error("Error fetching repository data:", error)
      throw error
    }
  }

  async fetchRecentCommits(
    owner: string = API_CONFIG.ZANO.GITHUB_OWNER,
    repo: string = API_CONFIG.ZANO.GITHUB_REPO,
    count = 50,
  ): Promise<GitHubCommitResponse[]> {
    try {
      const response = await this.makeRequest(`${API_CONFIG.GITHUB.ENDPOINTS.COMMITS}?per_page=${count}`, {
        owner,
        repo,
      })
      return await response.json()
    } catch (error) {
      console.error("Error fetching commits:", error)
      throw error
    }
  }

  async fetchContributors(
    owner: string = API_CONFIG.ZANO.GITHUB_OWNER,
    repo: string = API_CONFIG.ZANO.GITHUB_REPO,
  ): Promise<GitHubContributorResponse[]> {
    try {
      const response = await this.makeRequest(`${API_CONFIG.GITHUB.ENDPOINTS.CONTRIBUTORS}?per_page=100`, {
        owner,
        repo,
      })
      return await response.json()
    } catch (error) {
      console.error("Error fetching contributors:", error)
      throw error
    }
  }

  async fetchClosedIssues(
    owner: string = API_CONFIG.ZANO.GITHUB_OWNER,
    repo: string = API_CONFIG.ZANO.GITHUB_REPO,
  ): Promise<number> {
    try {
      const response = await this.makeRequest(`${API_CONFIG.GITHUB.ENDPOINTS.ISSUES}?state=closed&per_page=100`, {
        owner,
        repo,
      })
      const closedIssues: GitHubIssuesResponse[] = await response.json()
      return closedIssues.length
    } catch (error) {
      console.error("Error fetching closed issues:", error)
      return 0
    }
  }

  async fetchWeeklyCommits(
    owner: string = API_CONFIG.ZANO.GITHUB_OWNER,
    repo: string = API_CONFIG.ZANO.GITHUB_REPO,
  ): Promise<number> {
    try {
      const commits = await this.fetchRecentCommits(owner, repo, 100)
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

      const weeklyCommits = commits.filter((commit) => {
        const commitDate = new Date(commit.commit.committer.date)
        return commitDate > oneWeekAgo
      })

      return weeklyCommits.length
    } catch (error) {
      console.error("Error calculating weekly commits:", error)
      return 0
    }
  }

  async fetchAllData(repoPath: string = API_CONFIG.ZANO.FULL_REPO_PATH): Promise<GitHubData> {
    const [owner, repo] = repoPath.split("/")

    try {
      // Fetch all data in parallel
      const [repoData, commits, contributors, closedIssuesCount] = await Promise.allSettled([
        this.fetchRepositoryData(owner, repo),
        this.fetchRecentCommits(owner, repo, 100),
        this.fetchContributors(owner, repo),
        this.fetchClosedIssues(owner, repo),
      ])

      // Handle repository data
      if (repoData.status === "rejected") {
        throw new Error("Failed to fetch repository data")
      }

      // Calculate weekly commits
      let weeklyCommits = 0
      let lastCommit = "Unknown"
      let recentActivity: "high" | "medium" | "low" = "low"

      if (commits.status === "fulfilled" && commits.value.length > 0) {
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        weeklyCommits = commits.value.filter((commit) => {
          const commitDate = new Date(commit.commit.committer.date)
          return commitDate > oneWeekAgo
        }).length

        lastCommit = this.formatLastCommitDate(commits.value[0].commit.committer.date)
        recentActivity = this.calculateActivityLevel(weeklyCommits)
      }

      // Count contributors
      const contributorsCount = contributors.status === "fulfilled" ? contributors.value.length : 0

      // Get closed issues count
      const closedIssues = closedIssuesCount.status === "fulfilled" ? closedIssuesCount.value : 0

      return {
        stars: repoData.value.stargazers_count,
        forks: repoData.value.forks_count,
        openIssues: repoData.value.open_issues_count,
        closedIssues,
        contributors: contributorsCount,
        weeklyCommits,
        lastCommit,
        recentActivity,
      }
    } catch (error) {
      console.error("Error fetching GitHub data:", error)
      throw new Error(`Failed to fetch GitHub data: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  async fetchMultipleRepos(repoPaths: string[]): Promise<Record<string, GitHubData>> {
    try {
      const promises = repoPaths.map((repoPath) => this.fetchAllData(repoPath))
      const results = await Promise.allSettled(promises)

      const data: Record<string, GitHubData> = {}

      results.forEach((result, index) => {
        if (result.status === "fulfilled") {
          data[repoPaths[index]] = result.value
        }
      })

      return data
    } catch (error) {
      console.error("Error fetching multiple repos:", error)
      throw error
    }
  }

  // Get current rate limit info
  getRateLimitInfo() {
    return {
      limit: getRateLimit("GITHUB", !!this.token),
      hasToken: !!this.token,
      tier: this.token ? "authenticated" : "unauthenticated",
    }
  }
}

// Export a default instance
export const githubService = GitHubService.getInstance(process.env.GITHUB_TOKEN)
