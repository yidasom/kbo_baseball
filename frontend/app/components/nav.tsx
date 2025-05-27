"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  HomeIcon,
  UserGroupIcon,
  TableCellsIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

// 네비게이션 링크 정의
const links = [
  { name: "대시보드", href: "/dashboard", icon: HomeIcon },
  { name: "팀 순위", href: "/teams", icon: UserGroupIcon },
  { name: "선수 통계", href: "/players", icon: TableCellsIcon },
  { name: "경기 일정", href: "/games", icon: CalendarIcon },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        className="mb-2 flex h-20 items-center justify-center rounded-md bg-blue-600 p-4 md:h-40"
        href="/"
      >
        <h1 className="text-2xl font-bold text-white">KBO 통계</h1>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        {links.map((link) => {
          const LinkIcon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={clsx(
                "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
                {
                  "bg-sky-100 text-blue-600": pathname === link.href,
                }
              )}
            >
              <LinkIcon className="w-6" />
              <p className="hidden md:block">{link.name}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
