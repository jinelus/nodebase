import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { SidebarTrigger } from '@/components/ui/sidebar'

export const Header = () => {
  const { theme = 'system', setTheme } = useTheme()

  return (
    <header className="flex w-full items-center justify-between px-6 py-4">
      <SidebarTrigger />
      <Button variant="outline" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        {theme === 'light' ? <Moon /> : <Sun />}
      </Button>
    </header>
  )
}
