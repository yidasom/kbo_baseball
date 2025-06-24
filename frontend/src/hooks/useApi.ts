import { useQuery, useQueryClient } from '@tanstack/react-query';
import { playerApi, teamApi, gameApi } from '../lib/api';
import { GameStatus } from '../types/api';

// Query Keys
export const queryKeys = {
  players: ['players'] as const,
  player: (id: number) => ['players', id] as const,
  playersByTeam: (teamId: number) => ['players', 'team', teamId] as const,
  playersByPosition: (position: string) => ['players', 'position', position] as const,
  topPitchers: ['players', 'top-pitchers'] as const,
  topHittersByAverage: ['players', 'top-hitters', 'average'] as const,
  topHittersByHomeRuns: ['players', 'top-hitters', 'home-runs'] as const,
  
  teams: ['teams'] as const,
  team: (id: number) => ['teams', id] as const,
  teamStandings: ['teams', 'standings'] as const,
  
  games: ['games'] as const,
  game: (id: number) => ['games', id] as const,
  gamesByDate: (date: string) => ['games', 'date', date] as const,
  gamesByTeam: (teamId: number) => ['games', 'team', teamId] as const,
  upcomingGames: ['games', 'upcoming'] as const,
  gamesByStatus: (status: GameStatus) => ['games', 'status', status] as const,
  inningScores: (gameId: number) => ['games', gameId, 'innings'] as const,
};

// Player Hooks
export const useAllPlayers = () => {
  return useQuery({
    queryKey: queryKeys.players,
    queryFn: playerApi.getAllPlayers,
    staleTime: 5 * 60 * 1000, // 5분
  });
};

export const usePlayer = (id: number) => {
  return useQuery({
    queryKey: queryKeys.player(id),
    queryFn: () => playerApi.getPlayerById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10분
  });
};

export const usePlayersByTeam = (teamId: number) => {
  return useQuery({
    queryKey: queryKeys.playersByTeam(teamId),
    queryFn: () => playerApi.getPlayersByTeam(teamId),
    enabled: !!teamId,
    staleTime: 5 * 60 * 1000,
  });
};

export const usePlayersByPosition = (position: string) => {
  return useQuery({
    queryKey: queryKeys.playersByPosition(position),
    queryFn: () => playerApi.getPlayersByPosition(position),
    enabled: !!position,
    staleTime: 5 * 60 * 1000,
  });
};

export const useTopPitchers = () => {
  return useQuery({
    queryKey: queryKeys.topPitchers,
    queryFn: playerApi.getTopPitchers,
    staleTime: 15 * 60 * 1000, // 15분
  });
};

export const useTopHittersByAverage = () => {
  return useQuery({
    queryKey: queryKeys.topHittersByAverage,
    queryFn: playerApi.getTopHittersByAverage,
    staleTime: 15 * 60 * 1000,
  });
};

export const useTopHittersByHomeRuns = () => {
  return useQuery({
    queryKey: queryKeys.topHittersByHomeRuns,
    queryFn: playerApi.getTopHittersByHomeRuns,
    staleTime: 15 * 60 * 1000,
  });
};

// Team Hooks
export const useAllTeams = () => {
  return useQuery({
    queryKey: queryKeys.teams,
    queryFn: teamApi.getAllTeams,
    staleTime: 30 * 60 * 1000, // 30분 - 팀 정보는 자주 변경되지 않음
  });
};

export const useTeam = (id: number) => {
  return useQuery({
    queryKey: queryKeys.team(id),
    queryFn: () => teamApi.getTeamById(id),
    enabled: !!id,
    staleTime: 30 * 60 * 1000,
  });
};

export const useTeamStandings = () => {
  return useQuery({
    queryKey: queryKeys.teamStandings,
    queryFn: teamApi.getTeamStandings,
    staleTime: 10 * 60 * 1000, // 10분 - 순위는 자주 업데이트
  });
};

// Game Hooks
export const useAllGames = () => {
  return useQuery({
    queryKey: queryKeys.games,
    queryFn: gameApi.getAllGames,
    staleTime: 2 * 60 * 1000, // 2분 - 경기 정보는 자주 업데이트
  });
};

export const useGame = (id: number) => {
  return useQuery({
    queryKey: queryKeys.game(id),
    queryFn: () => gameApi.getGameById(id),
    enabled: !!id,
    staleTime: 1 * 60 * 1000, // 1분 - 경기 상세는 빠른 업데이트 필요
  });
};

export const useGamesByDate = (date: string) => {
  return useQuery({
    queryKey: queryKeys.gamesByDate(date),
    queryFn: () => gameApi.getGamesByDate(date),
    enabled: !!date,
    staleTime: 5 * 60 * 1000,
  });
};

export const useGamesByTeam = (teamId: number) => {
  return useQuery({
    queryKey: queryKeys.gamesByTeam(teamId),
    queryFn: () => gameApi.getGamesByTeam(teamId),
    enabled: !!teamId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpcomingGames = () => {
  return useQuery({
    queryKey: queryKeys.upcomingGames,
    queryFn: gameApi.getUpcomingGames,
    staleTime: 5 * 60 * 1000,
  });
};

export const useGamesByStatus = (status: GameStatus) => {
  return useQuery({
    queryKey: queryKeys.gamesByStatus(status),
    queryFn: () => gameApi.getGamesByStatus(status),
    enabled: !!status,
    staleTime: 2 * 60 * 1000,
  });
};

export const useInningScores = (gameId: number) => {
  return useQuery({
    queryKey: queryKeys.inningScores(gameId),
    queryFn: () => gameApi.getInningScoresByGame(gameId),
    enabled: !!gameId,
    staleTime: 30 * 1000, // 30초 - 이닝 스코어는 실시간성이 중요
  });
};

// 유틸리티 훅
export const useRefreshQueries = () => {
  const queryClient = useQueryClient();
  
  const refreshPlayerData = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.players });
  };
  
  const refreshTeamData = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.teams });
  };
  
  const refreshGameData = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.games });
  };
  
  const refreshAllData = () => {
    queryClient.invalidateQueries();
  };
  
  return {
    refreshPlayerData,
    refreshTeamData,
    refreshGameData,
    refreshAllData,
  };
}; 