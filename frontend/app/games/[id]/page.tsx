import { fetchGameById } from "../../lib/api";
import Link from "next/link";

export default async function GameDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const game = await fetchGameById(params.id);

  // 날짜 포맷팅
  const gameDate = new Date(game.gameDate);
  const formattedDate = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(gameDate);

  // 경기 상태 정보
  let statusText = "";
  let statusColor = "";

  switch (game.status) {
    case "SCHEDULED":
      statusText = "예정";
      statusColor = "text-blue-600";
      break;
    case "IN_PROGRESS":
      statusText = "진행 중";
      statusColor = "text-green-600";
      break;
    case "COMPLETED":
      statusText = "종료";
      statusColor = "text-gray-600";
      break;
    case "POSTPONED":
      statusText = "연기";
      statusColor = "text-yellow-600";
      break;
    case "CANCELED":
      statusText = "취소";
      statusColor = "text-red-600";
      break;
    default:
      statusText = game.status;
      statusColor = "text-gray-600";
  }

  return (
    <main>
      <div className="mb-6">
        <Link href="/games" className="text-blue-600 hover:underline">
          ← 경기 일정으로 돌아가기
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold">
              {game.awayTeam.name} vs {game.homeTeam.name}
            </h1>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor} bg-opacity-10`}
            >
              {statusText}
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
            <div className="text-gray-500 flex items-center">
              <svg
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>{formattedDate}</span>
            </div>

            <div className="text-gray-500 flex items-center">
              <svg
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>{game.stadium}</span>
            </div>
          </div>

          {(game.status === "COMPLETED" || game.status === "IN_PROGRESS") && (
            <div className="flex flex-col md:flex-row justify-center items-center gap-6 py-8 mb-6 bg-gray-50 rounded-lg">
              <div className="flex flex-col items-center">
                <img
                  src={
                    game.awayTeam.logoUrl || "https://via.placeholder.com/64"
                  }
                  alt={game.awayTeam.name}
                  className="h-16 w-16 object-contain mb-2"
                />
                <h2 className="text-lg font-medium">{game.awayTeam.name}</h2>
                <Link
                  href={`/teams/${game.awayTeam.id}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  팀 정보
                </Link>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-5xl font-bold">
                  {game.awayScore || 0}
                </span>
                <span className="text-2xl font-light text-gray-400">:</span>
                <span className="text-5xl font-bold">
                  {game.homeScore || 0}
                </span>
              </div>

              <div className="flex flex-col items-center">
                <img
                  src={
                    game.homeTeam.logoUrl || "https://via.placeholder.com/64"
                  }
                  alt={game.homeTeam.name}
                  className="h-16 w-16 object-contain mb-2"
                />
                <h2 className="text-lg font-medium">{game.homeTeam.name}</h2>
                <Link
                  href={`/teams/${game.homeTeam.id}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  팀 정보
                </Link>
              </div>
            </div>
          )}

          {game.status === "SCHEDULED" && (
            <div className="flex flex-col md:flex-row justify-center items-center gap-6 py-8 mb-6 bg-gray-50 rounded-lg">
              <div className="flex flex-col items-center">
                <img
                  src={
                    game.awayTeam.logoUrl || "https://via.placeholder.com/64"
                  }
                  alt={game.awayTeam.name}
                  className="h-16 w-16 object-contain mb-2"
                />
                <h2 className="text-lg font-medium">{game.awayTeam.name}</h2>
                <Link
                  href={`/teams/${game.awayTeam.id}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  팀 정보
                </Link>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-xl font-medium mb-2">VS</span>
                <span className="text-sm text-gray-500">
                  {formattedDate.split(" ").slice(-2).join(" ")}
                </span>
              </div>

              <div className="flex flex-col items-center">
                <img
                  src={
                    game.homeTeam.logoUrl || "https://via.placeholder.com/64"
                  }
                  alt={game.homeTeam.name}
                  className="h-16 w-16 object-contain mb-2"
                />
                <h2 className="text-lg font-medium">{game.homeTeam.name}</h2>
                <Link
                  href={`/teams/${game.homeTeam.id}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  팀 정보
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {(game.status === "COMPLETED" || game.status === "IN_PROGRESS") &&
        game.inningScores &&
        game.inningScores.length > 0 && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="p-6">
              <h2 className="text-lg font-medium mb-4">이닝 스코어</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        팀
                      </th>
                      {Array.from({ length: 9 }).map((_, index) => (
                        <th
                          key={index}
                          scope="col"
                          className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {index + 1}
                        </th>
                      ))}
                      <th
                        scope="col"
                        className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        R
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        H
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        E
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                        {game.awayTeam.name}
                      </td>
                      {Array.from({ length: 9 }).map((_, index) => {
                        const inningScore = game.inningScores.find(
                          (inning: any) =>
                            inning.inningNumber === index + 1 &&
                            inning.isTopInning
                        );
                        return (
                          <td
                            key={index}
                            className="px-4 py-2 whitespace-nowrap text-sm text-center text-gray-500"
                          >
                            {inningScore?.score || "-"}
                          </td>
                        );
                      })}
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-center font-medium">
                        {game.awayScore || 0}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-center text-gray-500">
                        {game.inningScores
                          .filter((inning: any) => inning.isTopInning)
                          .reduce(
                            (sum: number, inning: any) =>
                              sum + (inning.hits || 0),
                            0
                          )}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-center text-gray-500">
                        {game.inningScores
                          .filter((inning: any) => inning.isTopInning)
                          .reduce(
                            (sum: number, inning: any) =>
                              sum + (inning.errors || 0),
                            0
                          )}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                        {game.homeTeam.name}
                      </td>
                      {Array.from({ length: 9 }).map((_, index) => {
                        const inningScore = game.inningScores.find(
                          (inning: any) =>
                            inning.inningNumber === index + 1 &&
                            !inning.isTopInning
                        );
                        return (
                          <td
                            key={index}
                            className="px-4 py-2 whitespace-nowrap text-sm text-center text-gray-500"
                          >
                            {inningScore?.score || "-"}
                          </td>
                        );
                      })}
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-center font-medium">
                        {game.homeScore || 0}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-center text-gray-500">
                        {game.inningScores
                          .filter((inning: any) => !inning.isTopInning)
                          .reduce(
                            (sum: number, inning: any) =>
                              sum + (inning.hits || 0),
                            0
                          )}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-center text-gray-500">
                        {game.inningScores
                          .filter((inning: any) => !inning.isTopInning)
                          .reduce(
                            (sum: number, inning: any) =>
                              sum + (inning.errors || 0),
                            0
                          )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-medium mb-4">
              {game.awayTeam.name} 주요 선수
            </h2>
            <div className="h-64 flex items-center justify-center">
              <p className="text-gray-500">선수 데이터 준비 중...</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-medium mb-4">
              {game.homeTeam.name} 주요 선수
            </h2>
            <div className="h-64 flex items-center justify-center">
              <p className="text-gray-500">선수 데이터 준비 중...</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
