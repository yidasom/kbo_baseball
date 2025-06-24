// 백엔드 모델에 기반한 타입 정의
export interface Player {
  id: number;
  name: string;
  position: string; // 투수, 포수, 내야수, 외야수
  number?: number; // 등번호
  team: Team;
  birthDate?: string;
  height?: number;
  weight?: number;
  profileImageUrl?: string;
  
  // 타자 통계
  games?: number;
  atBats?: number;
  hits?: number;
  homeRuns?: number;
  rbi?: number;
  runs?: number;
  stolenBases?: number;
  battingAverage?: number;
  onBasePercentage?: number;
  sluggingPercentage?: number;
  ops?: number; // On-base Plus Slugging
  
  // 투수 통계
  wins?: number;
  losses?: number;
  era?: number;
  inningsPitched?: number;
  strikeouts?: number;
  walks?: number;
  saves?: number;
  holds?: number;
  qualityStarts?: number;
  completeGames?: number;
}

export interface Team {
  id: number;
  name: string;
  stadium?: string;
  logoUrl?: string;
  foundedYear?: string;
  players?: Player[];
  
  // 팀 통계 정보
  games?: number;
  wins?: number;
  losses?: number;
  draws?: number;
  winningPercentage?: number;
  consecutiveWins?: number;
  consecutiveLosses?: number;
  homeRuns?: number;
  teamBattingAverage?: number;
  teamEra?: number;
}

export interface Game {
  id: number;
  homeTeam: Team;
  awayTeam: Team;
  gameDate: string; // ISO string format
  stadium?: string;
  homeScore?: number;
  awayScore?: number;
  status: GameStatus;
  inningScores?: InningScore[];
}

export interface InningScore {
  id: number;
  game: Game;
  inning: number;
  homeScore: number;
  awayScore: number;
}

export enum GameStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  POSTPONED = 'POSTPONED',
  CANCELED = 'CANCELED'
}

// API 응답 타입
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: 'success' | 'error';
}

// 통계 관련 타입
export interface PlayerStats {
  playerId: number;
  playerName: string;
  position: string;
  teamName: string;
  
  // 타자 지표
  battingAverage?: number;
  homeRuns?: number;
  rbi?: number;
  stolenBases?: number;
  ops?: number;
  
  // 투수 지표
  era?: number;
  wins?: number;
  losses?: number;
  saves?: number;
  strikeouts?: number;
  qualityStarts?: number;
}

export interface TeamStats {
  teamId: number;
  teamName: string;
  winningPercentage: number;
  wins: number;
  losses: number;
  draws?: number;
  homeRuns: number;
  teamBattingAverage: number;
  teamEra: number;
}

export interface MonthlyStats {
  month: number;
  year: number;
  stats: PlayerStats | TeamStats;
}

// 차트 데이터 타입
export interface ChartData {
  name: string;
  value: number;
  month?: string;
  label?: string;
}

// 필터 타입
export interface PlayerFilter {
  position?: string;
  team?: number;
  minGames?: number;
}

export interface GameFilter {
  date?: string;
  team?: number;
  status?: GameStatus;
  stadium?: string;
} 