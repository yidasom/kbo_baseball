import { fetchTeamStandings } from "../lib/api";
import Link from "next/link";

export default async function TeamsPage() {
  const teams = await fetchTeamStandings();

  return (
    <main>
      <h1 className="mb-6 text-xl md:text-2xl">팀 순위</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                순위
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                팀
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                경기
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                승
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                패
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                무
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                승률
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                연속
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                팀 타율
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                팀 평균자책점
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {teams?.map((team: any, index: number) => {
              const totalGames =
                (team.wins || 0) + (team.losses || 0) + (team.draws || 0);
              return (
                <tr key={team.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {team.logoUrl && (
                        <div className="flex-shrink-0 h-10 w-10 mr-4">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={team.logoUrl}
                            alt={team.name}
                          />
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          <Link
                            href={`/teams/${team.id}`}
                            className="hover:underline"
                          >
                            {team.name}
                          </Link>
                        </div>
                        <div className="text-sm text-gray-500">
                          {team.stadium}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {totalGames}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {team.wins || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {team.losses || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {team.draws || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {team.winningPercentage
                      ? team.winningPercentage.toFixed(3)
                      : ".000"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {team.consecutiveWins
                      ? `${team.consecutiveWins}연승`
                      : team.consecutiveLosses
                      ? `${team.consecutiveLosses}연패`
                      : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {team.teamBattingAverage
                      ? team.teamBattingAverage.toFixed(3)
                      : ".000"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {team.teamEra ? team.teamEra.toFixed(2) : "0.00"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
