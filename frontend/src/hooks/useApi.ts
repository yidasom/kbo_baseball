import { useQuery, useQueryClient } from '@tanstack/react-query'
import { gamesApi, standingsApi, teamsApi } from '../lib/api'

export const queryKeys = {
  standings: ['standings'] as const,
  todayGames: ['games', 'today'] as const,
  gamesByDate: (date: string) => ['games', 'date', date] as const,
  recentResults: ['games', 'recent-results'] as const,
  teamInstagramFeeds: ['teams', 'instagram'] as const,
}

export const useStandings = () => {
  return useQuery({
    queryKey: queryKeys.standings,
    queryFn: standingsApi.getStandings,
    staleTime: 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
  })
}

export const useTodayGames = () => {
  return useQuery({
    queryKey: queryKeys.todayGames,
    queryFn: gamesApi.getTodayGames,
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  })
}

export const useGamesByDate = (date: string) => {
  return useQuery({
    queryKey: queryKeys.gamesByDate(date),
    queryFn: () => gamesApi.getGamesByDate(date),
    enabled: Boolean(date),
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  })
}

export const useRecentResults = () => {
  return useQuery({
    queryKey: queryKeys.recentResults,
    queryFn: gamesApi.getRecentResults,
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  })
}

export const useTeamInstagramFeeds = () => {
  return useQuery({
    queryKey: queryKeys.teamInstagramFeeds,
    queryFn: teamsApi.getInstagramFeeds,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
  })
}

export const useRefreshMvpData = () => {
  const queryClient = useQueryClient()

  return () => {
    queryClient.invalidateQueries({ queryKey: ['standings'] })
    queryClient.invalidateQueries({ queryKey: ['games'] })
    queryClient.invalidateQueries({ queryKey: ['teams'] })
  }
}
