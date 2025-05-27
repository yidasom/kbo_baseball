import { fetchPlayers, fetchTeams } from "../lib/api";
import Link from "next/link";
import { Suspense } from "react";

export default async function PlayersPage() {
  return (
    <main>
      <h1 className="mb-6 text-xl md:text-2xl">선수 통계</h1>

      <div className="mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">필터</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label
                htmlFor="team"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                팀
              </label>
              <select
                id="team"
                name="team"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                defaultValue=""
              >
                <option value="">전체 팀</option>
                <Suspense fallback={<option>로딩 중...</option>}>
                  <TeamOptions />
                </Suspense>
              </select>
            </div>

            <div>
              <label
                htmlFor="position"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                포지션
              </label>
              <select
                id="position"
                name="position"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                defaultValue=""
              >
                <option value="">전체 포지션</option>
                <option value="투수">투수</option>
                <option value="포수">포수</option>
                <option value="내야수">내야수</option>
                <option value="외야수">외야수</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="sort"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                정렬
              </label>
              <select
                id="sort"
                name="sort"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                defaultValue=""
              >
                <option value="">기본 정렬</option>
                <option value="battingAverage">타율 (높은순)</option>
                <option value="homeRuns">홈런 (높은순)</option>
                <option value="era">ERA (낮은순)</option>
                <option value="wins">승수 (높은순)</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                적용
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Suspense fallback={<PlayerListSkeleton />}>
          <PlayersList />
        </Suspense>
      </div>
    </main>
  );
}

async function TeamOptions() {
  const teams = await fetchTeams();

  return (
    <>
      {teams.map((team: any) => (
        <option key={team.id} value={team.id}>
          {team.name}
        </option>
      ))}
    </>
  );
}

function PlayerListSkeleton() {
  return (
    <>
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="bg-gray-200 rounded-lg shadow-md h-64 animate-pulse"
        ></div>
      ))}
    </>
  );
}

async function PlayersList() {
  const players = await fetchPlayers();

  return (
    <>
      {players.map((player: any) => (
        <Link
          key={player.id}
          href={`/players/${player.id}`}
          className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
        >
          <div className="p-6">
            <div className="flex items-center mb-4">
              {player.profileImageUrl && (
                <img
                  src={player.profileImageUrl}
                  alt={player.name}
                  className="h-20 w-20 rounded-full mr-4 object-cover"
                />
              )}
              <div>
                <h3 className="text-lg font-medium">{player.name}</h3>
                <p className="text-gray-500">
                  {player.position} | #{player.number || "N/A"}
                </p>
                <p className="text-blue-600">{player.team?.name}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              {player.position === "투수" ? (
                <>
                  <div>
                    <p className="text-gray-500">ERA</p>
                    <p className="font-medium text-lg">
                      {player.era || "0.00"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">승-패</p>
                    <p className="font-medium text-lg">
                      {player.wins || 0}-{player.losses || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">이닝</p>
                    <p className="font-medium">{player.inningsPitched || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">삼진</p>
                    <p className="font-medium">{player.strikeouts || 0}</p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-gray-500">타율</p>
                    <p className="font-medium text-lg">
                      {player.battingAverage || ".000"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">홈런</p>
                    <p className="font-medium text-lg">
                      {player.homeRuns || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">타점</p>
                    <p className="font-medium">{player.rbi || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">득점</p>
                    <p className="font-medium">{player.runs || 0}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </Link>
      ))}
    </>
  );
}
