import axios from 'axios';
import type { 
  Player, 
  Team, 
  Game, 
  InningScore
} from '../types/api';
import { GameStatus } from '../types/api';

// API 기본 설정
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 응답 인터셉터 - 에러 처리
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Player API
export const playerApi = {
  // 모든 선수 조회
  getAllPlayers: async (): Promise<Player[]> => {
    const response = await apiClient.get('/api/players');
    return response.data;
  },

  // 선수 상세 조회
  getPlayerById: async (id: number): Promise<Player> => {
    const response = await apiClient.get(`/api/players/${id}`);
    return response.data;
  },

  // 팀별 선수 조회
  getPlayersByTeam: async (teamId: number): Promise<Player[]> => {
    const response = await apiClient.get(`/api/players/team/${teamId}`);
    return response.data;
  },

  // 포지션별 선수 조회
  getPlayersByPosition: async (position: string): Promise<Player[]> => {
    const response = await apiClient.get(`/api/players/position/${position}`);
    return response.data;
  },

  // 최고 투수들 조회
  getTopPitchers: async (): Promise<Player[]> => {
    const response = await apiClient.get('/api/players/top-pitchers');
    return response.data;
  },

  // 타율 상위 타자들 조회
  getTopHittersByAverage: async (): Promise<Player[]> => {
    const response = await apiClient.get('/api/players/top-hitters/average');
    return response.data;
  },

  // 홈런 상위 타자들 조회
  getTopHittersByHomeRuns: async (): Promise<Player[]> => {
    const response = await apiClient.get('/api/players/top-hitters/home-runs');
    return response.data;
  },
};

// Team API
export const teamApi = {
  // 모든 팀 조회
  getAllTeams: async (): Promise<Team[]> => {
    const response = await apiClient.get('/api/teams');
    return response.data;
  },

  // 팀 상세 조회
  getTeamById: async (id: number): Promise<Team> => {
    const response = await apiClient.get(`/api/teams/${id}`);
    return response.data;
  },

  // 팀 순위 조회 (승률 순)
  getTeamStandings: async (): Promise<Team[]> => {
    const response = await apiClient.get('/api/teams/standings');
    return response.data;
  },
};

// Game API
export const gameApi = {
  // 모든 경기 조회
  getAllGames: async (): Promise<Game[]> => {
    const response = await apiClient.get('/api/games');
    return response.data;
  },

  // 경기 상세 조회
  getGameById: async (id: number): Promise<Game> => {
    const response = await apiClient.get(`/api/games/${id}`);
    return response.data;
  },

  // 날짜별 경기 조회
  getGamesByDate: async (date: string): Promise<Game[]> => {
    const response = await apiClient.get(`/api/games/date?date=${date}`);
    return response.data;
  },

  // 팀별 경기 조회
  getGamesByTeam: async (teamId: number): Promise<Game[]> => {
    const response = await apiClient.get(`/api/games/team/${teamId}`);
    return response.data;
  },

  // 예정된 경기 조회
  getUpcomingGames: async (): Promise<Game[]> => {
    const response = await apiClient.get('/api/games/upcoming');
    return response.data;
  },

  // 상태별 경기 조회
  getGamesByStatus: async (status: GameStatus): Promise<Game[]> => {
    const response = await apiClient.get(`/api/games/status/${status}`);
    return response.data;
  },

  // 경기별 이닝 스코어 조회
  getInningScoresByGame: async (gameId: number): Promise<InningScore[]> => {
    const response = await apiClient.get(`/api/games/${gameId}/innings`);
    return response.data;
  },

  // 실시간 데이터 업데이트
  updateRealTimeData: async (): Promise<{ status: string; message: string; timestamp: string }> => {
    const response = await apiClient.post('/api/games/real-time-update');
    return response.data;
  },
};

// 유틸리티 함수들
export const formatters = {
  // 타율 포맷팅 (소수점 3자리)
  formatBattingAverage: (avg?: number): string => {
    if (avg === undefined || avg === null) return '-.---';
    return avg.toFixed(3);
  },

  // ERA 포맷팅 (소수점 2자리)
  formatERA: (era?: number): string => {
    if (era === undefined || era === null) return '-.--';
    return era.toFixed(2);
  },

  // 승률 포맷팅 (소수점 3자리)
  formatWinningPercentage: (pct?: number): string => {
    if (pct === undefined || pct === null) return '-.---';
    return pct.toFixed(3);
  },

  // 날짜 포맷팅
  formatGameDate: (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    }).format(date);
  },

  // 시간 포맷팅
  formatGameTime: (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  },

  // 게임 상태 한글 변환
  getGameStatusText: (status: GameStatus): string => {
    switch (status) {
      case GameStatus.SCHEDULED:
        return '예정';
      case GameStatus.IN_PROGRESS:
        return '진행중';
      case GameStatus.COMPLETED:
        return '종료';
      case GameStatus.POSTPONED:
        return '연기';
      case GameStatus.CANCELED:
        return '취소';
      default:
        return '알 수 없음';
    }
  },

  // 포지션 한글 변환
  getPositionText: (position: string): string => {
    const positionMap: Record<string, string> = {
      '투수': '투수',
      '포수': '포수',
      '내야수': '내야수',
      '외야수': '외야수',
      'pitcher': '투수',
      'catcher': '포수',
      'infielder': '내야수',
      'outfielder': '외야수',
    };
    return positionMap[position] || position;
  },
};

export default apiClient; 