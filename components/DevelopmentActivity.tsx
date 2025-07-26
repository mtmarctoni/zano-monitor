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
        return "text-green-500"
      case "medium":
        return "text-yellow-500"
      case "low":
        return "text-red-500"
      default:
        return "text-slate-500"
    }
  }

  const getActivityBadge = (activity: string) => {
    switch (activity) {
      case "high":
        return "bg-green-100 text-green-800 border-green-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-slate-100 text-slate-800 border-slate-200"
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

    if (data.contributors > 50) score += 25
    else if (data.contributors > 20) score += 20
    else if (data.contributors > 10) score += 15
    else if (data.contributors > 5) score += 10

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
          <Github className="h-5 w-5 text-slate-700" />
          Development Activity
        </CardTitle>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm text-slate-600">Development Health Score</span>
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  healthScore >= 70 ? "bg-green-500" : healthScore >= 40 ? "bg-yellow-500" : "bg-red-500"
                }`}
                style={{ width: `${healthScore}%` }}
              />
            </div>
            <span className="text-sm font-bold text-slate-900">{healthScore}/100</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Repository Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
            <Star className="h-6 w-6 text-yellow-600" />
            <div>
              <p className="text-sm text-yellow-700 font-medium">Stars</p>
              <p className="text-xl font-bold text-yellow-800">{data.stars.toLocaleString()}</p>
              <p className="text-xs text-yellow-600">Community interest</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
            <GitFork className="h-6 w-6 text-blue-600" />
            <div>
              <p className="text-sm text-blue-700 font-medium">Forks</p>
              <p className="text-xl font-bold text-blue-800">{data.forks.toLocaleString()}</p>
              <p className="text-xs text-blue-600">Developer adoption</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
            <Users className="h-6 w-6 text-purple-600" />
            <div>
              <p className="text-sm text-purple-700 font-medium">Contributors</p>
              <p className="text-xl font-bold text-purple-800">{data.contributors}</p>
              <p className="text-xs text-purple-600">Active developers</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
            <GitCommit className="h-6 w-6 text-green-600" />
            <div>
              <p className="text-sm text-green-700 font-medium">Weekly Commits</p>
              <p className="text-xl font-bold text-green-800">{data.weeklyCommits}</p>
              <p className="text-xs text-green-600">Recent activity</p>
            </div>
          </div>
        </div>

        {/* Issue Management */}
        <div className="space-y-3">
          <h4 className="font-medium text-slate-900 flex items-center gap-2">
            <Code className="h-4 w-4" />
            Issue Management
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-orange-700 font-medium">Open Issues</p>
                <p className="text-lg font-bold text-orange-800">{data.openIssues}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-green-700 font-medium">Closed Issues</p>
                <p className="text-lg font-bold text-green-800">{data.closedIssues}</p>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-slate-600">Issue Resolution Rate</span>
              <span className="text-sm font-bold text-slate-900">
                {((data.closedIssues / (data.openIssues + data.closedIssues)) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all duration-500"
                style={{
                  width: `${(data.closedIssues / (data.openIssues + data.closedIssues)) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="space-y-3">
          <h4 className="font-medium text-slate-900 flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Recent Activity
          </h4>
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <Clock className="h-5 w-5 text-slate-500" />
            <div className="flex-1">
              <p className="text-sm text-slate-600">Last Commit</p>
              <p className="text-sm font-medium text-slate-900">{data.lastCommit}</p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium border ${getActivityBadge(data.recentActivity)}`}
            >
              {data.recentActivity.toUpperCase()} ACTIVITY
            </span>
          </div>
        </div>

        {/* Development Insights */}
        <div className="text-xs text-slate-500 bg-gradient-to-r from-slate-50 to-slate-100 p-4 rounded-lg border border-slate-200">
          <p className="font-medium mb-2 text-slate-700">Development Insights</p>
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
