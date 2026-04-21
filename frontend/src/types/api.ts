export type GameStatus = 'scheduled' | 'live' | 'finished' | 'postponed' | 'canceled'

export interface Standing {
  teamId: number
  teamName: string
  games: number
  wins: number
  losses: number
  winRate: number
  recentForm?: string[]
  updatedAt?: string
}

export interface GameSummary {
  id: number
  date: string
  homeTeamId: number
  homeTeamName: string
  awayTeamId: number
  awayTeamName: string
  homeScore?: number
  awayScore?: number
  status: GameStatus
  stadium?: string
  updatedAt?: string
}

export interface InstagramPost {
  id: number
  postUrl: string
  mediaUrl?: string
  caption?: string
  publishedAt?: string
}

export interface TeamInstagramFeed {
  teamId: number
  teamName: string
  instagramUrl?: string
  posts: InstagramPost[]
}
