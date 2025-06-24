import { cn } from "../../lib/utils"

// 기본 로딩 스피너
export const LoadingSpinner = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "animate-spin rounded-full h-8 w-8 border-b-2 border-primary",
        className
      )}
    />
  )
}

// 페이지 중앙 로딩
export const PageLoading = ({ message = "로딩 중..." }: { message?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <LoadingSpinner className="h-12 w-12" />
      <p className="text-muted-foreground text-sm">{message}</p>
    </div>
  )
}

// 카드 스켈레톤
export const CardSkeleton = () => {
  return (
    <div className="rounded-lg border bg-card p-6 space-y-4">
      <div className="space-y-2">
        <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
        <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
      </div>
      <div className="space-y-2">
        <div className="h-8 bg-muted rounded animate-pulse" />
        <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
      </div>
    </div>
  )
}

// 선수 카드 스켈레톤
export const PlayerCardSkeleton = () => {
  return (
    <div className="rounded-lg border bg-card p-6 space-y-4">
      <div className="flex items-center space-x-4">
        <div className="h-16 w-16 bg-muted rounded-full animate-pulse" />
        <div className="space-y-2 flex-1">
          <div className="h-5 bg-muted rounded w-24 animate-pulse" />
          <div className="h-4 bg-muted rounded w-16 animate-pulse" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="h-8 bg-muted rounded animate-pulse" />
          <div className="h-4 bg-muted rounded animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-8 bg-muted rounded animate-pulse" />
          <div className="h-4 bg-muted rounded animate-pulse" />
        </div>
      </div>
    </div>
  )
}

// 테이블 스켈레톤
export const TableSkeleton = ({ rows = 5 }: { rows?: number }) => {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex space-x-4 p-4">
          <div className="h-4 bg-muted rounded w-1/4 animate-pulse" />
          <div className="h-4 bg-muted rounded w-1/4 animate-pulse" />
          <div className="h-4 bg-muted rounded w-1/4 animate-pulse" />
          <div className="h-4 bg-muted rounded w-1/4 animate-pulse" />
        </div>
      ))}
    </div>
  )
}

// 차트 스켈레톤
export const ChartSkeleton = () => {
  return (
    <div className="space-y-4">
      <div className="h-6 bg-muted rounded w-1/3 animate-pulse" />
      <div className="h-64 bg-muted rounded animate-pulse" />
      <div className="flex justify-center space-x-4">
        <div className="h-4 bg-muted rounded w-16 animate-pulse" />
        <div className="h-4 bg-muted rounded w-16 animate-pulse" />
        <div className="h-4 bg-muted rounded w-16 animate-pulse" />
      </div>
    </div>
  )
} 