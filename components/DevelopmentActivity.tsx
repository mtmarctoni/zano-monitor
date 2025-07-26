import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Github, Star, GitFork, AlertCircle, Clock, Users, GitCommit, CheckCircle, Code, Activity } from "lucide-react"
import type { GitHubData } from "@/types/dashboard"

interface DevelopmentActivityProps {
  data: GitHubData
}

export function DevelopmentActivity({ data }: DevelopmentActivityProps) {
  const getActivityColor = (activity: string) => {
    switch (activity) {
      case "high":
        return "text-matrix-green"
      case "medium":
        return "text-cyber-orange"
      case "low":
        return "text-cyber-red"
      default:
        return "text-text-secondary"
    }
  }

  const getActivityBadge = (activity: string) => {
    switch (activity) {
      case "high":
        return "bg-matrix-green-dim text-matrix-green-dark border-matrix-green"
      case "medium":
        return "bg-cyber-orange/20 text-cyber-orange border-cyber-orange"
      case "low":
        return "bg-cyber-red/20 text-cyber-red border-cyber-red"
      default:
        return "bg-bg-secondary text-text-secondary border-border"
    }
  }

  const getHealthScore = () => {
    let score = 0
    if (data.stars > 1000) score += 25
    else if (data.stars > 500) score += 20
    else if (data.stars > 100) score += 15
    else if (data.stars > 50) score += 10

    if (data.weeklyCommits > 10) score += 25
    else if (data.weeklyCommits > 5) score += 20
    else if (data.weeklyCommits > 2) score += 15
    else if (data.weeklyCommits > 0) score += 10

    const issueRatio = data.closedIssues / (data.openIssues + data.closedIssues)
    if (issueRatio > 0.8) score += 25
    else if (issueRatio > 0.6) score += 20
    else if (issueRatio > 0.4) score += 15
    else if (issueRatio > 0.2) score += 10

    return Math.min(100, score)
  }

  const healthScore = getHealthScore()

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Github className="h-5 w-5 text-text-secondary" />
          Development Activity
        </CardTitle>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm text-text-secondary">Development Health Score</span>
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-bg-secondary rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${healthScore >= 70 ? "bg-matrix-green" : healthScore >= 40 ? "bg-cyber-orange" : "bg-cyber-red"
                  }`}
                style={{ width: `${healthScore}%` }}
              />
            </div>
            <span className="text-sm font-bold text-text-primary">{healthScore}/100</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Repository Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-4 bg-bg-secondary rounded-lg border border-border">
            <Star className="h-6 w-6 text-matrix-green" />
            <div>
              <p className="text-sm text-text-secondary font-medium">Stars</p>
              <p className="text-xl font-bold text-text-primary">{data.stars.toLocaleString()}</p>
              <p className="text-xs text-text-secondary">Community interest</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-bg-secondary rounded-lg border border-border">
            <GitFork className="h-6 w-6 text-cyber-blue" />
            <div>
              <p className="text-sm text-text-secondary font-medium">Forks</p>
              <p className="text-xl font-bold text-text-primary">{data.forks.toLocaleString()}</p>
              <p className="text-xs text-text-secondary">Developer adoption</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-bg-secondary rounded-lg border border-border">
            <Users className="h-6 w-6 text-cyber-purple" />
            <div>
              <p className="text-sm text-text-secondary font-medium">Contributors</p>
              <p className="text-xl font-bold text-text-primary">{data.contributors}</p>
              <p className="text-xs text-text-secondary">Active developers</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-bg-secondary rounded-lg border border-border">
            <GitCommit className="h-6 w-6 text-matrix-green" />
            <div>
              <p className="text-sm text-text-secondary font-medium">Weekly Commits</p>
              <p className="text-xl font-bold text-text-primary">{data.weeklyCommits}</p>
              <p className="text-xs text-text-secondary">Recent activity</p>
            </div>
          </div>
        </div>

        {/* Issue Management */}
        <div className="space-y-3">
          <h4 className="font-medium text-text-primary flex items-center gap-2">
            <Code className="h-4 w-4" />
            Issue Management
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-bg-secondary rounded-lg border border-border">
              <AlertCircle className="h-5 w-5 text-cyber-orange" />
              <div>
                <p className="text-sm text-text-secondary font-medium">Open Issues</p>
                <p className="text-lg font-bold text-text-primary">{data.openIssues}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-bg-secondary rounded-lg border border-border">
              <CheckCircle className="h-5 w-5 text-matrix-green" />
              <div>
                <p className="text-sm text-text-secondary font-medium">Closed Issues</p>
                <p className="text-lg font-bold text-text-primary">{data.closedIssues}</p>
              </div>
            </div>
          </div>

          <div className="p-3 bg-bg-secondary rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-text-secondary">Issue Resolution Rate</span>
              <span className="text-sm font-bold text-text-primary">
                {((data.closedIssues / (data.openIssues + data.closedIssues)) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="w-full h-2 bg-bg-tertiary rounded-full overflow-hidden">
              <div
                className="h-full bg-matrix-green transition-all duration-500"
                style={{
                  width: `${(data.closedIssues / (data.openIssues + data.closedIssues)) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="space-y-3">
          <h4 className="font-medium text-text-primary flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Recent Activity
          </h4>
          <div className="flex items-center gap-3 p-3 bg-bg-secondary rounded-lg">
            <Clock className="h-5 w-5 text-text-secondary" />
            <div className="flex-1">
              <p className="text-sm text-text-secondary">Last Commit</p>
              <p className="text-sm font-medium text-text-primary">{data.lastCommit}</p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium border ${getActivityBadge(data.recentActivity)}`}
            >
              {data.recentActivity.toUpperCase()} ACTIVITY
            </span>
          </div>
        </div>

        {/* Development Insights */}
        <div className="text-xs text-text-secondary bg-bg-secondary p-4 rounded-lg border border-border">
          <p className="font-medium mb-2 text-text-primary">Development Insights</p>
          <div className="space-y-1">
            <p>• Active development with regular commits and community engagement</p>
            <p>• Strong community support with {data.stars.toLocaleString()} stars</p>
            <p>• {data.contributors} contributors actively maintaining the codebase</p>
            <p>• Healthy issue resolution rate indicating good project maintenance</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}