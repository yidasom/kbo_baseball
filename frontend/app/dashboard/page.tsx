import { Card } from "../components/card";
import { Suspense } from "react";
import {
  fetchTopHittersByAverage,
  fetchTopHittersByHomeRuns,
  fetchTopPitchers,
  fetchUpcomingGames,
} from "../lib/api";

export default async function Dashboard() {
  return (
    <main>
      <h1 className="mb-4 text-xl md:text-2xl">대시보드</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardSkeleton />}>
          <TeamStandings />
        </Suspense>
        <Suspense fallback={<CardSkeleton />}>
          <TopHitters />
        </Suspense>
        <Suspense fallback={<CardSkeleton />}>
          <TopPitchers />
        </Suspense>
        <Suspense fallback={<CardSkeleton />}>
          <UpcomingGames />
        </Suspense>
      </div>
    </main>
  );
}

function CardSkeleton() {
  return <div className="h-[180px] rounded-xl bg-gray-200 animate-pulse" />;
}

async function TeamStandings() {
  return (
    <Card title="팀 순위">
      <p className="text-sm">현재 순위 정보를 불러오는 중입니다...</p>
    </Card>
  );
}

async function TopHitters() {
  const topHitters = await fetchTopHittersByAverage();
  const topHomeRuns = await fetchTopHittersByHomeRuns();

  return (
    <Card title="타자 TOP 5">
      <div className="space-y-2">
        <h3 className="text-sm font-medium">타율 순위</h3>
        <ul className="text-sm">
          {topHitters?.slice(0, 5).map((player: any, idx: number) => (
            <li key={player.id} className="flex justify-between py-1">
              <span>
                {idx + 1}. {player.name} ({player.team?.name})
              </span>
              <span className="font-medium">{player.battingAverage}</span>
            </li>
          ))}
        </ul>

        <h3 className="text-sm font-medium mt-4">홈런 순위</h3>
        <ul className="text-sm">
          {topHomeRuns?.slice(0, 5).map((player: any, idx: number) => (
            <li key={player.id} className="flex justify-between py-1">
              <span>
                {idx + 1}. {player.name} ({player.team?.name})
              </span>
              <span className="font-medium">{player.homeRuns}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

async function TopPitchers() {
  const pitchers = await fetchTopPitchers();

  return (
    <Card title="투수 TOP 5">
      <div className="space-y-2">
        <h3 className="text-sm font-medium">ERA 순위</h3>
        <ul className="text-sm">
          {pitchers?.slice(0, 5).map((player: any, idx: number) => (
            <li key={player.id} className="flex justify-between py-1">
              <span>
                {idx + 1}. {player.name} ({player.team?.name})
              </span>
              <span className="font-medium">{player.era}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

async function UpcomingGames() {
  const games = await fetchUpcomingGames();

  return (
    <Card title="다가오는 경기">
      <div className="space-y-2">
        <ul className="text-sm">
          {games?.slice(0, 5).map((game: any) => {
            // ISO 문자열에서 날짜 포맷팅
            const gameDate = new Date(game.gameDate);
            const formattedDate = new Intl.DateTimeFormat("ko", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }).format(gameDate);

            return (
              <li key={game.id} className="py-1">
                <p className="font-medium">{formattedDate}</p>
                <p>
                  {game.awayTeam.name} vs {game.homeTeam.name}
                </p>
                <p className="text-xs text-gray-500">{game.stadium}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </Card>
  );
}
