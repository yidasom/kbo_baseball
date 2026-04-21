import { useMemo, useState } from 'react'
import { CalendarClock, ChevronRight, ExternalLink, Instagram, ListFilter, Trophy } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { TableSkeleton } from '../components/ui/Loading'
import { formatters } from '../lib/api'
import {
  useGamesByDate,
  useRecentResults,
  useStandings,
  useTeamInstagramFeeds,
  useTodayGames,
} from '../hooks/useApi'
import type { GameStatus, GameSummary, Standing, TeamInstagramFeed } from '../types/api'
import { cn } from '../lib/utils'

export type MvpView = 'home' | 'standings' | 'games'

interface HomePageProps {
  view: MvpView
  onNavigate: (path: string) => void
}

const statusFilters: Array<{ label: string; value: 'all' | GameStatus }> = [
  { label: '전체', value: 'all' },
  { label: '예정', value: 'scheduled' },
  { label: '진행중', value: 'live' },
  { label: '종료', value: 'finished' },
]

const getTodayInputValue = () => {
  const now = new Date()
  const offset = now.getTimezoneOffset() * 60 * 1000
  return new Date(now.getTime() - offset).toISOString().slice(0, 10)
}

const getScoreText = (game: GameSummary) => {
  if (game.status === 'scheduled') return formatters.formatGameTime(game.date)
  if (game.homeScore === undefined || game.awayScore === undefined) return '-'
  return `${game.awayScore} : ${game.homeScore}`
}

const getLastUpdatedText = (standings: Standing[], games: GameSummary[]) => {
  const timestamps = [...standings, ...games]
    .map((item) => item.updatedAt)
    .filter((value): value is string => Boolean(value))

  if (timestamps.length === 0) return '업데이트 대기'

  const latest = timestamps
    .map((timestamp) => new Date(timestamp).getTime())
    .filter((time) => Number.isFinite(time))
    .sort((a, b) => b - a)[0]

  if (!latest) return '업데이트 대기'

  return new Intl.DateTimeFormat('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(latest))
}

const EmptyState = ({ label }: { label: string }) => (
  <div className="rounded-md border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
    {label}
  </div>
)

const SectionHeader = ({
  title,
  actionLabel,
  onAction,
}: {
  title: string
  actionLabel?: string
  onAction?: () => void
}) => (
  <div className="flex items-center justify-between gap-3">
    <h2 className="text-lg font-bold">{title}</h2>
    {actionLabel && onAction && (
      <Button type="button" variant="ghost" size="sm" onClick={onAction} className="gap-1 px-2">
        {actionLabel}
        <ChevronRight className="h-4 w-4" />
      </Button>
    )}
  </div>
)

const StandingTable = ({
  standings,
  isLoading,
  limit,
}: {
  standings?: Standing[]
  isLoading: boolean
  limit?: number
}) => {
  const rows = limit ? standings?.slice(0, limit) : standings

  if (isLoading) return <TableSkeleton rows={limit ?? 8} />
  if (!rows || rows.length === 0) return <EmptyState label="순위 데이터가 아직 없습니다." />

  return (
    <div className="overflow-hidden rounded-md border">
      <table className="w-full table-fixed text-sm">
        <thead className="bg-muted/60 text-xs text-muted-foreground">
          <tr>
            <th className="w-10 px-2 py-2 text-left">순위</th>
            <th className="px-2 py-2 text-left">팀</th>
            <th className="w-12 px-2 py-2 text-right">경기</th>
            <th className="w-16 px-2 py-2 text-right">승패</th>
            <th className="w-16 px-2 py-2 text-right">승률</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {rows.map((team, index) => (
            <tr key={team.teamId} className="bg-card">
              <td className="px-2 py-3 font-semibold">{index + 1}</td>
              <td className="min-w-0 px-2 py-3">
                <div className="truncate font-medium">{team.teamName}</div>
                {team.recentForm && team.recentForm.length > 0 && (
                  <div className="mt-1 truncate text-xs text-muted-foreground">
                    최근 {team.recentForm.slice(0, 5).join(' ')}
                  </div>
                )}
              </td>
              <td className="px-2 py-3 text-right text-muted-foreground">{team.games}</td>
              <td className="px-2 py-3 text-right">{team.wins}-{team.losses}</td>
              <td className="px-2 py-3 text-right font-semibold">{formatters.formatWinRate(team.winRate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const GameCard = ({ game, compact = false }: { game: GameSummary; compact?: boolean }) => (
  <article className="rounded-md border bg-card px-3 py-3">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{formatters.formatShortDate(game.date)}</span>
          <span>{formatters.getGameStatusText(game.status)}</span>
          {game.stadium && !compact && <span className="truncate">{game.stadium}</span>}
        </div>
        <div className="mt-2 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          <span className="truncate text-right font-medium">{game.awayTeamName}</span>
          <span className="min-w-14 rounded-md bg-muted px-2 py-1 text-center text-sm font-bold">
            {getScoreText(game)}
          </span>
          <span className="truncate font-medium">{game.homeTeamName}</span>
        </div>
      </div>
    </div>
  </article>
)

const GameList = ({
  games,
  isLoading,
  emptyLabel,
}: {
  games?: GameSummary[]
  isLoading: boolean
  emptyLabel: string
}) => {
  if (isLoading) return <TableSkeleton rows={4} />
  if (!games || games.length === 0) return <EmptyState label={emptyLabel} />

  return (
    <div className="space-y-2">
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  )
}

const InstagramFeeds = ({
  feeds,
  isLoading,
  limit,
}: {
  feeds?: TeamInstagramFeed[]
  isLoading: boolean
  limit?: number
}) => {
  const visibleFeeds = limit ? feeds?.slice(0, limit) : feeds

  if (isLoading) return <TableSkeleton rows={limit ?? 4} />
  if (!visibleFeeds || visibleFeeds.length === 0) {
    return <EmptyState label="구단 인스타그램 데이터가 아직 없습니다." />
  }

  return (
    <div className="space-y-3">
      {visibleFeeds.map((feed) => (
        <article key={feed.teamId} className="rounded-md border bg-card p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Instagram className="h-4 w-4 text-muted-foreground" />
                <h3 className="truncate text-sm font-semibold">{feed.teamName}</h3>
              </div>
              <p className="mt-1 truncate text-xs text-muted-foreground">
                {feed.posts.length > 0 ? `최신 게시글 ${feed.posts.length}개` : '게시글 수집 대기'}
              </p>
            </div>
            {feed.instagramUrl && (
              <a
                href={feed.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 shrink-0 items-center gap-1 rounded-md border px-2 text-xs font-medium"
              >
                더보기
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>

          {feed.posts.length > 0 ? (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {feed.posts.slice(0, 3).map((post) => (
                <a
                  key={post.id}
                  href={post.postUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group overflow-hidden rounded-md border bg-muted"
                  title={post.caption || `${feed.teamName} Instagram post`}
                >
                  {post.mediaUrl ? (
                    <img
                      src={post.mediaUrl}
                      alt={post.caption || `${feed.teamName} Instagram post`}
                      className="aspect-square w-full object-cover transition-transform group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex aspect-square items-center justify-center p-2 text-center text-xs text-muted-foreground">
                      {formatters.formatRelativeDate(post.publishedAt) || 'Instagram'}
                    </div>
                  )}
                </a>
              ))}
            </div>
          ) : (
            <div className="mt-3 rounded-md bg-muted px-3 py-3 text-xs text-muted-foreground">
              n8n이 최신 게시글을 저장하면 여기에 표시됩니다.
            </div>
          )}
        </article>
      ))}
    </div>
  )
}

export const HomePage = ({ view, onNavigate }: HomePageProps) => {
  const [selectedDate, setSelectedDate] = useState(getTodayInputValue)
  const [statusFilter, setStatusFilter] = useState<'all' | GameStatus>('all')

  const standingsQuery = useStandings()
  const todayGamesQuery = useTodayGames()
  const recentResultsQuery = useRecentResults()
  const selectedDateGamesQuery = useGamesByDate(selectedDate)
  const instagramFeedsQuery = useTeamInstagramFeeds()

  const standings = standingsQuery.data ?? []
  const todayGames = todayGamesQuery.data ?? []
  const recentResults = recentResultsQuery.data ?? []
  const instagramFeeds = instagramFeedsQuery.data ?? []

  const filteredGames = useMemo(() => {
    const selectedDateGames = selectedDateGamesQuery.data ?? []
    if (statusFilter === 'all') return selectedDateGames
    return selectedDateGames.filter((game) => game.status === statusFilter)
  }, [selectedDateGamesQuery.data, statusFilter])

  const finishedTodayCount = todayGames.filter((game) => game.status === 'finished').length
  const scheduledTodayCount = todayGames.filter((game) => game.status === 'scheduled').length
  const liveTodayCount = todayGames.filter((game) => game.status === 'live').length
  const lastUpdated = getLastUpdatedText(standings, [...todayGames, ...recentResults])

  if (view === 'standings') {
    return (
      <div className="space-y-6">
        <section className="space-y-4">
          <SectionHeader title="전체 팀 순위" />
          <StandingTable standings={standings} isLoading={standingsQuery.isLoading} />
        </section>

        <section className="space-y-3">
          <SectionHeader title="구단 인스타그램" />
          <InstagramFeeds feeds={instagramFeeds} isLoading={instagramFeedsQuery.isLoading} />
        </section>
      </div>
    )
  }

  if (view === 'games') {
    return (
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
            className="h-10 min-w-0 flex-1 rounded-md border bg-background px-3 text-sm"
          />
          <Button type="button" variant="outline" size="icon" aria-label="오늘로 이동" onClick={() => setSelectedDate(getTodayInputValue())}>
            <CalendarClock className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <ListFilter className="h-4 w-4 shrink-0 text-muted-foreground" />
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setStatusFilter(filter.value)}
              className={cn(
                'h-9 shrink-0 rounded-md border px-3 text-sm font-medium',
                statusFilter === filter.value
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'bg-background text-muted-foreground'
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <GameList
          games={filteredGames}
          isLoading={selectedDateGamesQuery.isLoading}
          emptyLabel="선택한 날짜의 경기 데이터가 없습니다."
        />
      </section>
    )
  }

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-3 gap-2">
        <div className="rounded-md border bg-card p-3">
          <p className="text-xs text-muted-foreground">오늘 경기</p>
          <p className="mt-1 text-2xl font-bold">{todayGames.length}</p>
        </div>
        <div className="rounded-md border bg-card p-3">
          <p className="text-xs text-muted-foreground">진행중</p>
          <p className="mt-1 text-2xl font-bold">{liveTodayCount}</p>
        </div>
        <div className="rounded-md border bg-card p-3">
          <p className="text-xs text-muted-foreground">업데이트</p>
          <p className="mt-2 truncate text-sm font-semibold">{lastUpdated}</p>
        </div>
      </section>

      <section className="space-y-3">
        <SectionHeader title="오늘 경기" actionLabel="전체" onAction={() => onNavigate('/games')} />
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="rounded-md bg-muted px-3 py-2">
            <span className="text-muted-foreground">예정</span>
            <span className="ml-2 font-semibold">{scheduledTodayCount}</span>
          </div>
          <div className="rounded-md bg-muted px-3 py-2">
            <span className="text-muted-foreground">종료</span>
            <span className="ml-2 font-semibold">{finishedTodayCount}</span>
          </div>
        </div>
        <GameList games={todayGames} isLoading={todayGamesQuery.isLoading} emptyLabel="오늘 등록된 경기가 없습니다." />
      </section>

      <section className="space-y-3">
        <SectionHeader title="팀 순위" actionLabel="전체" onAction={() => onNavigate('/standings')} />
        <StandingTable standings={standings} isLoading={standingsQuery.isLoading} limit={5} />
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-bold">최근 결과</h2>
        </div>
        <GameList games={recentResults} isLoading={recentResultsQuery.isLoading} emptyLabel="최근 종료 경기 데이터가 없습니다." />
      </section>

      <section className="space-y-3">
        <SectionHeader title="구단 인스타그램" actionLabel="전체" onAction={() => onNavigate('/standings')} />
        <InstagramFeeds feeds={instagramFeeds} isLoading={instagramFeedsQuery.isLoading} limit={3} />
      </section>
    </div>
  )
}
