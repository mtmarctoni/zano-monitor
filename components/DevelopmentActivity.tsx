import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Github, Star, GitFork, AlertCircle, Clock, Users, GitCommit, CheckCircle, Code, Activity, GitPullRequest, GitBranch, GitCommitIcon, GitMerge, GitPullRequestClosed, GitCompare, Tag, GitFork as GitForkIcon, Code2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatDistanceToNow } from "date-fns"
import type { GitHubData, GitHubUserEvent } from "@/types/dashboard"

const EVENT_ICONS: Record<string, React.ReactNode> = {
  PushEvent: <GitCommit className="h-4 w-4" />,
  CreateEvent: <Code2 className="h-4 w-4" />,
  DeleteEvent: <Code2 className="h-4 w-4" />,
  PullRequestEvent: <GitPullRequest className="h-4 w-4" />,
  PullRequestReviewEvent: <GitPullRequest className="h-4 w-4" />,
  PullRequestReviewCommentEvent: <GitPullRequest className="h-4 w-4" />,
  IssuesEvent: <AlertCircle className="h-4 w-4" />,
  IssueCommentEvent: <AlertCircle className="h-4 w-4" />,
  CommitCommentEvent: <GitCommitIcon className="h-4 w-4" />,
  ForkEvent: <GitForkIcon className="h-4 w-4" />,
  WatchEvent: <Star className="h-4 w-4" />,
  ReleaseEvent: <Tag className="h-4 w-4" />,
  PullRequestReviewThreadEvent: <GitPullRequest className="h-4 w-4" />,
  default: <Activity className="h-4 w-4" />,
}

const getEventActionText = (event: GitHubUserEvent) => {
  switch (event.type) {
    case 'PushEvent':
      return `pushed ${event.payload.size} ${event.payload.size === 1 ? 'commit' : 'commits'} to`
    case 'CreateEvent':
      return `created ${event.payload.ref_type} ${event.payload.ref} in`
    case 'DeleteEvent':
      return `deleted ${event.payload.ref_type} ${event.payload.ref} in`
    case 'PullRequestEvent':
      return `${event.payload.action} pull request #${event.payload.number} in`
    case 'IssuesEvent':
      return `${event.payload.action} issue #${event.payload.issue?.number} in`
    case 'ForkEvent':
      return 'forked repository'
    case 'WatchEvent':
      return 'starred repository'
    case 'ReleaseEvent':
      return `released ${event.payload.release?.tag_name} in`
    default:
      return event.type
  }
}

const EventItem = ({ event }: { event: GitHubUserEvent }) => {
  const repoName = event.repo?.name.split('/').pop()

  return (
    <div className="flex items-start gap-3 py-2 text-sm">
      <div className="mt-0.5 flex-shrink-0">
        {EVENT_ICONS[event.type] || EVENT_ICONS.default}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 flex-wrap">
          <span className="font-medium">{event.actor.login}</span>
          <span className="text-muted-foreground">{getEventActionText(event)}</span>
          <a
            href={`https://github.com/${event.repo.name}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline font-medium"
          >
            {repoName}
          </a>
          {event.type === 'PushEvent' && event.payload.commits?.length && event.payload.commits?.length > 0 && (
            <div className="ml-2 text-xs text-muted-foreground">
              {event.payload.commits[0].message.split('\n')[0]}
            </div>
          )}
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          {formatDistanceToNow(new Date(event.created_at), { addSuffix: true })}
        </div>
      </div>
    </div>
  )
}

interface DevelopmentActivityProps {
  data: GitHubData
}

export function DevelopmentActivity({ data }: DevelopmentActivityProps) {

  const getActivityBadge = (activity: string) => {
    switch (activity) {
      case "high":
        return "bg-matrix-green-dim text-matrix-green-dark border-matrix-green text-center"
      case "medium":
        return "bg-cyber-orange/20 text-cyber-orange border-cyber-orange text-center"
      case "low":
        return "bg-cyber-red/20 text-cyber-red border-cyber-red text-center"
      default:
        return "bg-bg-secondary text-text-secondary border-border text-centers"
    }
  }

  if (!data.userActivity) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Github className="h-5 w-5" />
            <span>Development Activity</span>
          </CardTitle>
          <CardDescription>Loading user activity data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </CardContent>
      </Card>
    )
  }

  const { events, eventCounts, repos, lastUpdated } = data.userActivity
  const totalEvents = Object.values(eventCounts).reduce((sum, count) => sum + count, 0)
  const repoCount = repos.size

  // Get top 5 most active repositories
  const repoActivity = events.reduce((acc, event) => {
    if (!event.repo) return acc
    acc[event.repo.name] = (acc[event.repo.name] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const topRepos = Object.entries(repoActivity)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Github className="h-5 w-5" />
              <span>Development Activity</span>
            </CardTitle>
            <CardDescription className="mt-1">
              {repoCount} repositories • {totalEvents} events • Updated {formatDistanceToNow(new Date(lastUpdated), { addSuffix: true })}
            </CardDescription>
          </div>
          <Badge variant="outline" className={getActivityBadge(data.recentActivity)}>
            {data.recentActivity} activity
          </Badge>
        </div>
      </CardHeader>

      <Tabs defaultValue="activity" className="flex-1 flex flex-col">
        <TabsList className="px-4 bg-green-900/50 mx-4 border-border">
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="repos">Top Repositories</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="flex-1 overflow-hidden">
          <ScrollArea className="h-dvh px-4 bg-bg-secondary rounded-lg m-4">
            <div className="space-y-4 py-2">
              {events.length > 0 ? (
                events.map((event) => (
                  <EventItem key={event.id} event={event} />
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No recent activity found
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="repos" className="p-4">
          <div className="space-y-4">
            {topRepos.map(([repo, count]) => (
              <div key={repo} className="flex items-center justify-between">
                <a
                  href={`https://github.com/${repo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline truncate"
                >
                  {repo.split('/').pop()}
                </a>
                <Badge variant="outline" className="ml-2">
                  {count} {count === 1 ? 'event' : 'events'}
                </Badge>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="stats" className="p-4">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Event Types</h4>
              <div className="space-y-2">
                {Object.entries(eventCounts).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {EVENT_ICONS[type] || EVENT_ICONS.default}
                      <span className="capitalize">{type.replace('Event', '')}</span>
                    </div>
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="p-4 border-t">
        <a
          href={`https://github.com/${data.userActivity.events[0]?.actor.login}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-500 hover:underline flex items-center justify-center"
        >
          View full activity on GitHub <span className="ml-1">↗</span>
        </a>
      </div>
    </Card>
  )
}