import { RefreshCw } from 'lucide-react'
import { Button } from '../ui/Button'
import { cn } from '../../lib/utils'
import { useRefreshMvpData } from '../../hooks/useApi'

interface HeaderProps {
  currentPath: string
}

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/': {
    title: 'Baseball Insight',
    subtitle: '오늘 경기와 현재 순위',
  },
  '/standings': {
    title: '팀 순위',
    subtitle: '승률 기준 KBO 순위',
  },
  '/games': {
    title: '경기',
    subtitle: '날짜별 일정과 결과',
  },
}

export const Header = ({ currentPath }: HeaderProps) => {
  const refreshData = useRefreshMvpData()
  const page = pageTitles[currentPath] ?? pageTitles['/']!

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex min-h-16 w-full max-w-md items-center justify-between px-4 py-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground">KBO MVP</p>
          <h1 className="truncate text-xl font-bold leading-tight">{page.title}</h1>
          <p className="truncate text-xs text-muted-foreground">{page.subtitle}</p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="데이터 새로고침"
          title="데이터 새로고침"
          onClick={refreshData}
          className="ml-3 shrink-0"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}

export const StatusBar = ({
  isLoading,
  lastUpdate,
  errorCount = 0,
}: {
  isLoading?: boolean
  lastUpdate?: Date
  errorCount?: number
}) => {
  return (
    <div className="border-b bg-muted/40 px-4 py-2">
      <div className="mx-auto flex max-w-md items-center justify-between gap-3 text-xs text-muted-foreground">
        <div className="flex min-w-0 items-center gap-2">
          <div
            className={cn(
              'h-2 w-2 rounded-full',
              isLoading ? 'animate-pulse bg-yellow-500' : 'bg-green-600'
            )}
          />
          <span className="truncate">{isLoading ? '업데이트 확인 중' : '데이터 연결됨'}</span>
        </div>
        <div className="shrink-0">
          {errorCount > 0 ? (
            <span className="text-destructive">오류 {errorCount}</span>
          ) : (
            lastUpdate && <span>{lastUpdate.toLocaleTimeString('ko-KR')}</span>
          )}
        </div>
      </div>
    </div>
  )
}
