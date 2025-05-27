import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "KBO 야구 통계 시각화",
  description: "KBO 야구 통계 시각화 프로젝트",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <div className="flex h-screen flex-col md:flex-row">{children}</div>
      </body>
    </html>
  );
}
