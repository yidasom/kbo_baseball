import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Header, StatusBar } from './components/layout/Header'
import { HomePage } from './pages/HomePage'

// React Query 클라이언트 설정
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5분
      gcTime: 10 * 60 * 1000, // 10분 (이전 cacheTime)
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  const [currentPath, setCurrentPath] = useState('/')
  const [lastUpdate] = useState(new Date())

  const handleNavigate = (path: string) => {
    setCurrentPath(path)
  }

  const renderCurrentPage = () => {
    switch (currentPath) {
      case '/':
        return <HomePage />
      case '/teams':
        return (
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold">팀 순위</h1>
              <p className="text-muted-foreground mt-2">팀별 상세 통계 페이지 (개발 예정)</p>
            </div>
          </div>
        )
      case '/players':
        return (
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold">선수 통계</h1>
              <p className="text-muted-foreground mt-2">선수별 상세 통계 페이지 (개발 예정)</p>
            </div>
          </div>
        )
      case '/games':
        return (
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold">경기 일정</h1>
              <p className="text-muted-foreground mt-2">경기 일정 및 결과 페이지 (개발 예정)</p>
            </div>
          </div>
        )
      case '/compare':
        return (
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold">비교 분석</h1>
              <p className="text-muted-foreground mt-2">선수/팀 비교 분석 페이지 (개발 예정)</p>
            </div>
          </div>
        )
      default:
        return <HomePage />
    }
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background font-sans antialiased">
        <Header onNavigate={handleNavigate} currentPath={currentPath} />
        <StatusBar lastUpdate={lastUpdate} />
        
        <main className="pb-8">
          {renderCurrentPage()}
        </main>

        {/* 푸터 */}
        <footer className="border-t bg-muted/30 py-8 mt-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold mb-4">Baseball Insight</h3>
                <p className="text-sm text-muted-foreground">
                  데이터 기반 야구 경기 분석 플랫폼으로 KBO 리그의 상세한 통계와 인사이트를 제공합니다.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-4">주요 기능</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• 실시간 경기 데이터</li>
                  <li>• 선수별 상세 통계</li>
                  <li>• 팀 순위 및 분석</li>
                  <li>• 비교 분석 도구</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">데이터 소스</h3>
                <p className="text-sm text-muted-foreground">
                  KBO 공식 데이터를 기반으로 하며, 실시간으로 업데이트됩니다.
                </p>
                <p className="text-xs text-muted-foreground mt-4">
                  © 2024 Baseball Insight. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
      
      {/* React Query Devtools - 개발 환경에서만 표시 */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
