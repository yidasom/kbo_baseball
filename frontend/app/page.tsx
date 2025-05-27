import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm">
        <h1 className="text-6xl font-bold text-center mb-8">
          KBO 야구 통계 시각화
        </h1>
        <p className="text-2xl text-center mb-12">
          한국 프로야구(KBO) 리그 팀, 선수, 경기 통계 데이터를 시각화하여
          제공합니다.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          <Link
            href="/dashboard"
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 flex flex-col items-center"
          >
            <h2 className="text-2xl font-semibold mb-3">대시보드</h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-50 text-center">
              KBO 리그 주요 통계 현황을 한눈에 볼 수 있는 대시보드
            </p>
            <ArrowRightIcon className="w-6 h-6 mt-4" />
          </Link>

          <Link
            href="/teams"
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 flex flex-col items-center"
          >
            <h2 className="text-2xl font-semibold mb-3">팀 순위</h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-50 text-center">
              KBO 리그 팀 순위 및 세부 팀 통계 정보
            </p>
            <ArrowRightIcon className="w-6 h-6 mt-4" />
          </Link>

          <Link
            href="/players"
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 flex flex-col items-center"
          >
            <h2 className="text-2xl font-semibold mb-3">선수 통계</h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-50 text-center">
              투수, 타자 등 포지션별 선수 통계 및 순위
            </p>
            <ArrowRightIcon className="w-6 h-6 mt-4" />
          </Link>

          <Link
            href="/games"
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 flex flex-col items-center"
          >
            <h2 className="text-2xl font-semibold mb-3">경기 일정</h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-50 text-center">
              KBO 리그 경기 일정 및 결과
            </p>
            <ArrowRightIcon className="w-6 h-6 mt-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
