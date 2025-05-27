import { fetchPlayerById } from "../../lib/api";
import Link from "next/link";

export default async function PlayerDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const player = await fetchPlayerById(params.id);

  return (
    <main>
      <div className="mb-6">
        <Link href="/players" className="text-blue-600 hover:underline">
          ← 선수 목록으로 돌아가기
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="md:w-1/3">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex flex-col items-center">
              {player.profileImageUrl && (
                <img
                  src={player.profileImageUrl}
                  alt={player.name}
                  className="h-48 w-48 rounded-full object-cover border-4 border-blue-600 mb-4"
                />
              )}
              <h1 className="text-3xl font-bold text-center">{player.name}</h1>
              <p className="text-gray-500 text-lg">
                {player.position} | #{player.number || "N/A"}
              </p>
              <Link
                href={`/teams/${player.team?.id}`}
                className="text-blue-600 font-medium hover:underline"
              >
                {player.team?.name}
              </Link>

              <div className="mt-6 w-full">
                <h2 className="text-xl font-medium mb-3">기본 정보</h2>
                <dl className="grid grid-cols-2 gap-y-3 text-sm">
                  <dt className="text-gray-500">생년월일</dt>
                  <dd className="font-medium">{player.birthDate || "-"}</dd>

                  <dt className="text-gray-500">신장</dt>
                  <dd className="font-medium">
                    {player.height ? `${player.height}cm` : "-"}
                  </dd>

                  <dt className="text-gray-500">체중</dt>
                  <dd className="font-medium">
                    {player.weight ? `${player.weight}kg` : "-"}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="md:w-2/3">
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-medium mb-4">시즌 통계</h2>

            {player.position === "투수" ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">ERA</p>
                  <p className="text-3xl font-bold">{player.era || "0.00"}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">승-패</p>
                  <p className="text-3xl font-bold">
                    {player.wins || 0}-{player.losses || 0}
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">세이브</p>
                  <p className="text-3xl font-bold">{player.saves || 0}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">이닝</p>
                  <p className="text-3xl font-bold">
                    {player.inningsPitched || 0}
                  </p>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">삼진</p>
                  <p className="text-3xl font-bold">{player.strikeouts || 0}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">볼넷</p>
                  <p className="text-3xl font-bold">{player.walks || 0}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">홀드</p>
                  <p className="text-3xl font-bold">{player.holds || 0}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">QS</p>
                  <p className="text-3xl font-bold">
                    {player.qualityStarts || 0}
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">타율</p>
                  <p className="text-3xl font-bold">
                    {player.battingAverage || ".000"}
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">홈런</p>
                  <p className="text-3xl font-bold">{player.homeRuns || 0}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">타점</p>
                  <p className="text-3xl font-bold">{player.rbi || 0}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">득점</p>
                  <p className="text-3xl font-bold">{player.runs || 0}</p>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">안타</p>
                  <p className="text-3xl font-bold">{player.hits || 0}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">출루율</p>
                  <p className="text-3xl font-bold">
                    {player.onBasePercentage || ".000"}
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">장타율</p>
                  <p className="text-3xl font-bold">
                    {player.sluggingPercentage || ".000"}
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">OPS</p>
                  <p className="text-3xl font-bold">{player.ops || ".000"}</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-medium mb-4">통산 기록</h2>
            <div className="h-64 flex items-center justify-center">
              <p className="text-gray-500">통산 기록 차트 준비 중...</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
