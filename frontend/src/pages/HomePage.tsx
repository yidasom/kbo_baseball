import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { StatCard, PlayerStatCard, TeamStatCard } from '../components/stats/StatCard'
import { CardSkeleton } from '../components/ui/Loading'
import { 
  useTeamStandings, 
  useTopHittersByAverage, 
  useTopPitchers, 
  useUpcomingGames 
} from '../hooks/useApi'
import { formatters } from '../lib/api'

export const HomePage = () => {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'teams' | 'players' | 'games'>('overview')
  
  // API 호출
  const { data: teamStandings, isLoading: isLoadingTeams } = useTeamStandings()
  const { data: topHitters, isLoading: isLoadingHitters } = useTopHittersByAverage()
  const { data: topPitchers, isLoading: isLoadingPitchers } = useTopPitchers()
  const { data: upcomingGames, isLoading: isLoadingGames } = useUpcomingGames()

  // 주요 통계 계산
  const leagueStats = {
    totalTeams: teamStandings?.length || 0,
    totalPlayers: (topHitters?.length || 0) + (topPitchers?.length || 0),
    totalGames: upcomingGames?.length || 0,
    avgBattingAverage: topHitters?.reduce((sum, player) => sum + (player.battingAverage || 0), 0) / (topHitters?.length || 1)
  }

  const tabs = [
    { id: 'overview', label: '개요', icon: '📊' },
    { id: 'teams', label: '팀 순위', icon: '🏆' },
    { id: 'players', label: '선수 통계', icon: '⚾' },
    { id: 'games', label: '경기 일정', icon: '📅' },
  ]

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* 헤더 섹션 */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">Baseball Insight</h1>
        <p className="text-xl text-muted-foreground">데이터 기반 야구 경기 분석 플랫폼</p>
        <div className="flex justify-center items-center space-x-4 text-sm text-muted-foreground">
          <span>🏟️ KBO 리그</span>
          <span>•</span>
          <span>📊 실시간 통계</span>
          <span>•</span>
          <span>🔍 상세 분석</span>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="flex justify-center">
        <div className="flex bg-muted p-1 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedTab === tab.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 콘텐츠 영역 */}
      <div className="space-y-8">
        {selectedTab === 'overview' && (
          <div className="space-y-8">
            {/* 주요 통계 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="참가 팀수"
                value={leagueStats.totalTeams}
                subtitle="KBO 리그"
                icon="🏟️"
              />
              <StatCard
                title="등록 선수"
                value={leagueStats.totalPlayers}
                subtitle="전체 선수"
                icon="⚾"
              />
              <StatCard
                title="예정 경기"
                value={leagueStats.totalGames}
                subtitle="이번 주"
                icon="📅"
              />
              <StatCard
                title="평균 타율"
                value={formatters.formatBattingAverage(leagueStats.avgBattingAverage)}
                subtitle="리그 평균"
                icon="📊"
              />
            </div>

            {/* 하이라이트 섹션 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* 최근 경기 결과 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span>🔥</span>
                    <span>최근 경기 하이라이트</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {isLoadingGames ? (
                      <CardSkeleton />
                    ) : (
                      <div className="text-center text-muted-foreground">
                        <p>곧 경기 데이터가 업데이트될 예정입니다</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* 주요 기록 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span>⭐</span>
                    <span>이번 주 주요 기록</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">최고 타율</p>
                        <p className="text-sm text-muted-foreground">
                          {topHitters?.[0]?.name || '데이터 로딩 중'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">
                          {formatters.formatBattingAverage(topHitters?.[0]?.battingAverage)}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">최고 ERA</p>
                        <p className="text-sm text-muted-foreground">
                          {topPitchers?.[0]?.name || '데이터 로딩 중'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">
                          {formatters.formatERA(topPitchers?.[0]?.era)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {selectedTab === 'teams' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold">팀 순위</h2>
              <p className="text-muted-foreground">승률 기준 순위</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoadingTeams ? (
                Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
              ) : (
                teamStandings?.slice(0, 6).map((team, index) => (
                  <TeamStatCard
                    key={team.id}
                    teamName={team.name}
                    logo={team.logoUrl}
                    wins={team.wins || 0}
                    losses={team.losses || 0}
                    draws={team.draws}
                    winningPercentage={team.winningPercentage || 0}
                    additionalStats={[
                      { label: '순위', value: `${index + 1}위` },
                      { label: '팀 타율', value: formatters.formatBattingAverage(team.teamBattingAverage) }
                    ]}
                  />
                ))
              )}
            </div>
          </div>
        )}

        {selectedTab === 'players' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold">선수 통계</h2>
              <p className="text-muted-foreground">상위 타자 & 투수</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* 상위 타자 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">상위 타자 (타율)</h3>
                <div className="space-y-4">
                  {isLoadingHitters ? (
                    Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)
                  ) : (
                    topHitters?.slice(0, 3).map((player) => (
                      <PlayerStatCard
                        key={player.id}
                        playerName={player.name}
                        teamName={player.team?.name || ''}
                        position={formatters.getPositionText(player.position)}
                        stats={{
                          primary: {
                            label: '타율',
                            value: formatters.formatBattingAverage(player.battingAverage)
                          },
                          secondary: [
                            { label: '홈런', value: player.homeRuns || 0 },
                            { label: '타점', value: player.rbi || 0 }
                          ]
                        }}
                        profileImage={player.profileImageUrl}
                      />
                    ))
                  )}
                </div>
              </div>

              {/* 상위 투수 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">상위 투수 (ERA)</h3>
                <div className="space-y-4">
                  {isLoadingPitchers ? (
                    Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)
                  ) : (
                    topPitchers?.slice(0, 3).map((player) => (
                      <PlayerStatCard
                        key={player.id}
                        playerName={player.name}
                        teamName={player.team?.name || ''}
                        position={formatters.getPositionText(player.position)}
                        stats={{
                          primary: {
                            label: 'ERA',
                            value: formatters.formatERA(player.era)
                          },
                          secondary: [
                            { label: '승', value: player.wins || 0 },
                            { label: '삼진', value: player.strikeouts || 0 }
                          ]
                        }}
                        profileImage={player.profileImageUrl}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'games' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold">경기 일정</h2>
              <p className="text-muted-foreground">예정된 경기</p>
            </div>
            <div className="space-y-4">
              {isLoadingGames ? (
                Array.from({ length: 5 }).map((_, i) => <CardSkeleton key={i} />)
              ) : upcomingGames?.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <p className="text-muted-foreground">예정된 경기가 없습니다</p>
                  </CardContent>
                </Card>
              ) : (
                upcomingGames?.map((game) => (
                  <Card key={game.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <p className="font-semibold">{game.awayTeam.name}</p>
                            <p className="text-sm text-muted-foreground">원정</p>
                          </div>
                          <div className="text-2xl font-bold text-muted-foreground">VS</div>
                          <div className="text-center">
                            <p className="font-semibold">{game.homeTeam.name}</p>
                            <p className="text-sm text-muted-foreground">홈</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {formatters.formatGameDate(game.gameDate)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatters.formatGameTime(game.gameDate)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {game.stadium}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 