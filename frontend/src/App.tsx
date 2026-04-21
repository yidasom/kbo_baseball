import { useMemo, useState } from 'react'
import type { ComponentType } from 'react'
import { CalendarDays, House, Trophy } from 'lucide-react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Header, StatusBar } from './components/layout/Header'
import { HomePage, type MvpView } from './pages/HomePage'
import { cn } from './lib/utils'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: true,
    },
  },
})

const navigationItems: Array<{
  label: string
  path: string
  view: MvpView
  icon: ComponentType<{ className?: string }>
}> = [
  { label: '홈', path: '/', view: 'home', icon: House },
  { label: '순위', path: '/standings', view: 'standings', icon: Trophy },
  { label: '경기', path: '/games', view: 'games', icon: CalendarDays },
]

function App() {
  const [currentPath, setCurrentPath] = useState('/')
  const lastUpdate = useMemo(() => new Date(), [])
  const currentItem = navigationItems.find((item) => item.path === currentPath) ?? navigationItems[0]!

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background text-foreground">
        <Header currentPath={currentPath} />
        <StatusBar lastUpdate={lastUpdate} />

        <main className="mx-auto w-full max-w-md px-4 pb-24 pt-4">
          <HomePage view={currentItem.view} onNavigate={setCurrentPath} />
        </main>

        <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 px-4 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 backdrop-blur">
          <div className="mx-auto grid max-w-md grid-cols-3 gap-2">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = currentPath === item.path

              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => setCurrentPath(item.path)}
                  className={cn(
                    'flex h-14 flex-col items-center justify-center gap-1 rounded-md text-xs font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>
        </nav>
      </div>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
