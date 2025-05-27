import { fetchPlayersByTeam, fetchTeamById } from "../../lib/api";
import Link from "next/link";

export default async function TeamDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const team = await fetchTeamById(params.id);
  const players = await fetchPlayersByTeam(params.id);

  return (
    <main>
      <div className="mb-6">
        <Link href="/teams" className="text-blue-600 hover:underline">
          ← 팀 목록으로 돌아가기
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
        {team.logoUrl && (
          <div className="flex-shrink-0">
            <img
              src={team.logoUrl}
              alt={team.name}
              className="h-32 w-32 rounded-full object-cover border-4 border-blue-600"
            />
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold">{team.name}</h1>
          <p className="text-gray-500 mt-1">설립: {team.foundedYear}</p>
          <p className="text-gray-500">홈구장: {team.stadium}</p>
          <div className="mt-4 flex gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-500">승</p>
              <p className="text-2xl font-bold">{team.wins || 0}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">패</p>
              <p className="text-2xl font-bold">{team.losses || 0}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">무</p>
              <p className="text-2xl font-bold">{team.draws || 0}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">승률</p>
              <p className="text-2xl font-bold">
                {team.winningPercentage
                  ? team.winningPercentage.toFixed(3)
                  : ".000"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">팀 통계</h2>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm text-gray-500">팀 타율</dt>
              <dd className="text-lg font-medium">
                {team.teamBattingAverage
                  ? team.teamBattingAverage.toFixed(3)
                  : ".000"}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">팀 평균자책점</dt>
              <dd className="text-lg font-medium">
                {team.teamEra ? team.teamEra.toFixed(2) : "0.00"}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">홈런</dt>
              <dd className="text-lg font-medium">{team.homeRuns || 0}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">연속 기록</dt>
              <dd className="text-lg font-medium">
                {team.consecutiveWins
                  ? `${team.consecutiveWins}연승`
                  : team.consecutiveLosses
                  ? `${team.consecutiveLosses}연패`
                  : "-"}
              </dd>
            </div>
          </dl>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">현재 시즌</h2>
          <div className="h-48 flex items-center justify-center">
            <p className="text-gray-500">시즌 차트 준비 중...</p>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">선수 명단</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {players.map((player: any) => (
          <Link
            key={player.id}
            href={`/players/${player.id}`}
            className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
          >
            <div className="p-4">
              <div className="flex items-center">
                {player.profileImageUrl && (
                  <img
                    src={player.profileImageUrl}
                    alt={player.name}
                    className="h-16 w-16 rounded-full mr-4 object-cover"
                  />
                )}
                <div>
                  <h3 className="text-lg font-medium">{player.name}</h3>
                  <p className="text-gray-500">
                    {player.position} | #{player.number || "N/A"}
                  </p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                {player.position === "투수" ? (
                  <>
                    <div>
                      <p className="text-gray-500">ERA</p>
                      <p className="font-medium">{player.era || "0.00"}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">승-패</p>
                      <p className="font-medium">
                        {player.wins || 0}-{player.losses || 0}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <p className="text-gray-500">타율</p>
                      <p className="font-medium">
                        {player.battingAverage || ".000"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">홈런</p>
                      <p className="font-medium">{player.homeRuns || 0}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
