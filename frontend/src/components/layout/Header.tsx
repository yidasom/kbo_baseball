import { useState } from 'react'
import { Button } from '../ui/Button'
import { cn } from '../../lib/utils'
import { gameApi } from '../../lib/api'
import { Toast } from '../ui/Toast'

interface HeaderProps {
  onNavigate: (path: string) => void
  currentPath: string
}

export const Header = ({ onNavigate, currentPath }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [toast, setToast] = useState<{
    message: string
    type: 'success' | 'error' | 'info'
    isVisible: boolean
  }>({
    message: '',
    type: 'info',
    isVisible: false
  })

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({
      message,
      type,
      isVisible: true
    })
  }

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }))
  }

  const handleRealTimeUpdate = async () => {
    setIsUpdating(true)
    try {
      const result = await gameApi.updateRealTimeData()
      
      if (result.status === 'success') {
        showToast(result.message, 'success')
        
        // 2초 후에 페이지 새로고침으로 업데이트된 데이터 반영
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      } else {
        showToast(result.message, 'error')
      }
    } catch (error) {
      console.error('실시간 업데이트 오류:', error)
      showToast('실시간 업데이트 중 오류가 발생했습니다.', 'error')
    } finally {
      setIsUpdating(false)
    }
  }

  const navigationItems = [
    { label: '홈', path: '/' },
    { label: '팀 순위', path: '/teams' },
    { label: '선수 통계', path: '/players' },
    { label: '경기 일정', path: '/games' },
    { label: '비교 분석', path: '/compare' },
  ]

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* 로고 및 브랜드 */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => onNavigate('/')}
                className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
              >
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">⚾</span>
                </div>
                <div className="hidden md:block">
                  <h1 className="text-xl font-bold">Baseball Insight</h1>
                  <p className="text-xs text-muted-foreground">데이터 기반 야구 분석</p>
                </div>
              </button>
            </div>

            {/* 데스크톱 네비게이션 */}
            <nav className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <Button
                  key={item.path}
                  variant={currentPath === item.path ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onNavigate(item.path)}
                  className="text-sm"
                >
                  {item.label}
                </Button>
              ))}
            </nav>

            {/* 모바일 메뉴 버튼 */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="메뉴 열기"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                  />
                </svg>
              </Button>
            </div>

            {/* 우측 액션 버튼들 */}
            <div className="hidden md:flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleRealTimeUpdate}
                disabled={isUpdating}
                className={cn(
                  "relative",
                  isUpdating && "opacity-70"
                )}
              >
                {isUpdating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    업데이트 중...
                  </>
                ) : (
                  <>
                    <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    실시간 업데이트
                  </>
                )}
              </Button>
              <Button variant="ghost" size="sm">
                설정
              </Button>
            </div>
          </div>

          {/* 모바일 메뉴 */}
          {isMenuOpen && (
            <div className="md:hidden border-t py-4">
              <nav className="flex flex-col space-y-2">
                {navigationItems.map((item) => (
                  <Button
                    key={item.path}
                    variant={currentPath === item.path ? "default" : "ghost"}
                    size="sm"
                    onClick={() => {
                      onNavigate(item.path)
                      setIsMenuOpen(false)
                    }}
                    className="justify-start"
                  >
                    {item.label}
                  </Button>
                ))}
                <div className="pt-4 border-t space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={handleRealTimeUpdate}
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        업데이트 중...
                      </>
                    ) : (
                      '실시간 업데이트'
                    )}
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full">
                    설정
                  </Button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Toast 알림 */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
        duration={4000}
      />
    </>
  )
}

// 상태 표시 컴포넌트
export const StatusBar = ({ 
  isLoading, 
  lastUpdate, 
  errorCount = 0 
}: { 
  isLoading?: boolean
  lastUpdate?: Date
  errorCount?: number 
}) => {
  return (
    <div className="bg-muted/50 border-b px-4 py-2">
      <div className="container mx-auto">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className={cn(
                "w-2 h-2 rounded-full",
                isLoading ? "bg-yellow-500 animate-pulse" : "bg-green-500"
              )} />
              <span>
                {isLoading ? "데이터 로딩 중..." : "연결됨"}
              </span>
            </div>
            {lastUpdate && (
              <span>
                마지막 업데이트: {lastUpdate.toLocaleTimeString('ko-KR')}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {errorCount > 0 && (
              <span className="text-red-500">
                오류: {errorCount}개
              </span>
            )}
            <span>
              KBO 2025 시즌
            </span>
          </div>
        </div>
      </div>
    </div>
  )
} 