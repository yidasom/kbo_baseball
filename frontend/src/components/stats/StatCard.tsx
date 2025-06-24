import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card"
import { cn } from "../../lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  change?: {
    value: number
    type: 'increase' | 'decrease' | 'neutral'
  }
  icon?: React.ReactNode
  className?: string
}

export const StatCard = ({ 
  title, 
  value, 
  subtitle, 
  change, 
  icon, 
  className 
}: StatCardProps) => {
  const getChangeColor = (type: 'increase' | 'decrease' | 'neutral') => {
    switch (type) {
      case 'increase':
        return 'text-green-600'
      case 'decrease':
        return 'text-red-600'
      case 'neutral':
        return 'text-gray-600'
      default:
        return 'text-gray-600'
    }
  }

  const getChangeIcon = (type: 'increase' | 'decrease' | 'neutral') => {
    switch (type) {
      case 'increase':
        return '↗'
      case 'decrease':
        return '↘'
      case 'neutral':
        return '→'
      default:
        return '→'
    }
  }

  return (
    <Card className={cn("stat-card", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && (
          <div className="text-muted-foreground">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="stat-number text-2xl font-bold">
          {value}
        </div>
        {subtitle && (
          <p className="stat-label text-xs text-muted-foreground mt-1">
            {subtitle}
          </p>
        )}
        {change && (
          <div className={cn(
            "flex items-center text-xs mt-2",
            getChangeColor(change.type)
          )}>
            <span className="mr-1">
              {getChangeIcon(change.type)}
            </span>
            {Math.abs(change.value)}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// 선수 통계용 특화 컴포넌트
interface PlayerStatCardProps {
  playerName: string
  teamName: string
  position: string
  stats: {
    primary: { label: string; value: string | number }
    secondary?: { label: string; value: string | number }[]
  }
  profileImage?: string
  className?: string
}

export const PlayerStatCard = ({
  playerName,
  teamName,
  position,
  stats,
  profileImage,
  className
}: PlayerStatCardProps) => {
  return (
    <Card className={cn("hover:shadow-md transition-shadow", className)}>
      <CardHeader>
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center overflow-hidden">
            {profileImage ? (
              <img 
                src={profileImage} 
                alt={playerName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl font-bold text-muted-foreground">
                {playerName.charAt(0)}
              </span>
            )}
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg">{playerName}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {teamName} • {position}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">
              {stats.primary.value}
            </div>
            <div className="text-sm text-muted-foreground">
              {stats.primary.label}
            </div>
          </div>
          
          {stats.secondary && stats.secondary.length > 0 && (
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              {stats.secondary.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-xl font-semibold">
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// 팀 통계용 특화 컴포넌트
interface TeamStatCardProps {
  teamName: string
  logo?: string
  wins: number
  losses: number
  draws?: number
  winningPercentage: number
  additionalStats?: { label: string; value: string | number }[]
  className?: string
}

export const TeamStatCard = ({
  teamName,
  logo,
  wins,
  losses,
  draws = 0,
  winningPercentage,
  additionalStats,
  className
}: TeamStatCardProps) => {
  return (
    <Card className={cn("hover:shadow-md transition-shadow", className)}>
      <CardHeader>
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden">
            {logo ? (
              <img 
                src={logo} 
                alt={teamName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-lg font-bold text-muted-foreground">
                {teamName.charAt(0)}
              </span>
            )}
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg">{teamName}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {wins}승 {losses}패 {draws > 0 && `${draws}무`}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">
              {winningPercentage.toFixed(3)}
            </div>
            <div className="text-sm text-muted-foreground">
              승률
            </div>
          </div>
          
          {additionalStats && additionalStats.length > 0 && (
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              {additionalStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-xl font-semibold">
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 