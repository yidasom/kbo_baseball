import axios from 'axios'
import type { GameStatus, GameSummary, Standing, TeamInstagramFeed } from '../types/api'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

export const standingsApi = {
  getStandings: async (): Promise<Standing[]> => {
    const response = await apiClient.get('/api/standings')
    return response.data
  },
}

export const gamesApi = {
  getTodayGames: async (): Promise<GameSummary[]> => {
    const response = await apiClient.get('/api/games/today')
    return response.data
  },

  getGamesByDate: async (date: string): Promise<GameSummary[]> => {
    const response = await apiClient.get('/api/games', { params: { date } })
    return response.data
  },

  getRecentResults: async (): Promise<GameSummary[]> => {
    const response = await apiClient.get('/api/games/recent', { params: { limit: 5 } })
    return response.data
  },
}

export const teamsApi = {
  getInstagramFeeds: async (): Promise<TeamInstagramFeed[]> => {
    const response = await apiClient.get('/api/teams/instagram')
    return response.data
  },
}

export const formatters = {
  formatWinRate: (rate?: number): string => {
    if (rate === undefined || rate === null) return '-'
    return rate.toFixed(3)
  },

  formatGameDate: (dateString: string): string => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('ko-KR', {
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    }).format(date)
  },

  formatGameTime: (dateString: string): string => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  },

  formatShortDate: (dateString: string): string => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('ko-KR', {
      month: 'numeric',
      day: 'numeric',
    }).format(date)
  },

  formatRelativeDate: (dateString?: string): string => {
    if (!dateString) return ''

    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

    if (!Number.isFinite(diffHours) || diffHours < 0) return ''
    if (diffHours < 1) return '방금 전'
    if (diffHours < 24) return `${diffHours}시간 전`

    const diffDays = Math.floor(diffHours / 24)
    if (diffDays < 7) return `${diffDays}일 전`

    return new Intl.DateTimeFormat('ko-KR', {
      month: 'numeric',
      day: 'numeric',
    }).format(date)
  },

  getGameStatusText: (status: GameStatus): string => {
    switch (status) {
      case 'scheduled':
        return '예정'
      case 'live':
        return '진행중'
      case 'finished':
        return '종료'
      case 'postponed':
        return '연기'
      case 'canceled':
        return '취소'
      default:
        return '확인중'
    }
  },
}

export default apiClient
