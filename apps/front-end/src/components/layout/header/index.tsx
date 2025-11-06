import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'

export const Header = () => {
  const { theme = 'system', setTheme } = useTheme()

  return (
    <header className="w-full px-6 py-4">
      <Button variant="outline" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        {theme === 'light' ? <Moon /> : <Sun />}
      </Button>
    </header>
  )
}
