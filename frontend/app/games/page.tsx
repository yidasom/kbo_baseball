import { fetchGames, fetchUpcomingGames } from "../lib/api";
import Link from "next/link";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

export default async function GamesPage() {
  const allGames = await fetchGames();
  const upcomingGames = await fetchUpcomingGames();

  // 날짜별로 그룹화
  const gamesByDate = allGames.reduce((acc: any, game: any) => {
    const gameDate = new Date(game.gameDate);
    const dateKey = gameDate.toISOString().split("T")[0];

    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }

    acc[dateKey].push(game);
    return acc;
  }, {});

  // 날짜 정렬
  const sortedDates = Object.keys(gamesByDate).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <main>
      <h1 className="mb-6 text-xl md:text-2xl">경기 일정</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-medium mb-4">일정 필터</h2>
            <div className="flex flex-wrap gap-4">
              <div className="w-full sm:w-auto">
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  날짜
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="w-full sm:w-auto">
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
                  <option value="team1">두산 베어스</option>
                  <option value="team2">LG 트윈스</option>
                  <option value="team3">KT 위즈</option>
                  <option value="team4">SSG 랜더스</option>
                  <option value="team5">키움 히어로즈</option>
                </select>
              </div>

              <div className="w-full sm:w-auto">
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  상태
                </label>
                <select
                  id="status"
                  name="status"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  defaultValue=""
                >
                  <option value="">전체</option>
                  <option value="SCHEDULED">예정</option>
                  <option value="IN_PROGRESS">진행 중</option>
                  <option value="COMPLETED">완료</option>
                  <option value="POSTPONED">연기</option>
                  <option value="CANCELED">취소</option>
                </select>
              </div>

              <div className="w-full sm:w-auto flex items-end">
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

        <div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-medium mb-4">다가오는 경기</h2>
            <div className="space-y-4">
              {upcomingGames.slice(0, 3).map((game: any) => {
                const gameDate = new Date(game.gameDate);
                const formattedDate = new Intl.DateTimeFormat("ko", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(gameDate);

                return (
                  <Link
                    key={game.id}
                    href={`/games/${game.id}`}
                    className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">
                        {game.awayTeam.name} vs {game.homeTeam.name}
                      </span>
                      <span className="text-sm text-blue-600">
                        {game.status === "SCHEDULED" ? "예정" : game.status}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      <span>{formattedDate}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      <span>{game.stadium}</span>
                    </div>
                  </Link>
                );
              })}

              <Link
                href="/games?filter=upcoming"
                className="block text-blue-600 text-center text-sm hover:underline mt-4"
              >
                모든 예정 경기 보기 →
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {sortedDates.map((dateKey) => {
          const formattedDate = new Date(dateKey).toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "long",
          });

          return (
            <div key={dateKey}>
              <h2 className="text-lg font-medium mb-4 border-b pb-2">
                {formattedDate}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {gamesByDate[dateKey].map((game: any) => {
                  const gameDate = new Date(game.gameDate);
                  const gameTime = gameDate.toLocaleTimeString("ko-KR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

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
                    <Link
                      key={game.id}
                      href={`/games/${game.id}`}
                      className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                    >
                      <div className="p-4">
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center">
                            <ClockIcon className="h-4 w-4 mr-1 text-gray-500" />
                            <span className="text-sm text-gray-500">
                              {gameTime}
                            </span>
                          </div>
                          <span
                            className={`text-sm font-medium ${statusColor}`}
                          >
                            {statusText}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            {game.awayTeam.logoUrl && (
                              <img
                                src={game.awayTeam.logoUrl}
                                alt={game.awayTeam.name}
                                className="h-8 w-8 object-contain"
                              />
                            )}
                            <span className="font-medium">
                              {game.awayTeam.name}
                            </span>
                          </div>

                          {game.status === "COMPLETED" ||
                          game.status === "IN_PROGRESS" ? (
                            <span className="text-lg font-bold">
                              {game.awayScore}
                            </span>
                          ) : (
                            <span>-</span>
                          )}
                        </div>

                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center gap-2">
                            {game.homeTeam.logoUrl && (
                              <img
                                src={game.homeTeam.logoUrl}
                                alt={game.homeTeam.name}
                                className="h-8 w-8 object-contain"
                              />
                            )}
                            <span className="font-medium">
                              {game.homeTeam.name}
                            </span>
                          </div>

                          {game.status === "COMPLETED" ||
                          game.status === "IN_PROGRESS" ? (
                            <span className="text-lg font-bold">
                              {game.homeScore}
                            </span>
                          ) : (
                            <span>-</span>
                          )}
                        </div>

                        <div className="mt-4 text-sm text-gray-500 flex items-center">
                          <MapPinIcon className="h-4 w-4 mr-1" />
                          <span>{game.stadium}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
