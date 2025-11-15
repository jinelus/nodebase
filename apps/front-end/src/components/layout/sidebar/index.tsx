import { Link, useLocation, useRouter } from '@tanstack/react-router'
import {
  CreditCardIcon,
  FolderOpenIcon,
  HistoryIcon,
  KeyIcon,
  LogOutIcon,
  NotebookTextIcon,
  StarIcon,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { useHasActiveSubscription } from '@/features/subscriptions/hooks/use-subscription'
import { authClient } from '@/lib/auth-client'

type MenuItem = {
  label: string
  icon: React.ReactNode
  href: string
}

const menuItems: MenuItem[] = [
  {
    label: 'Workflows',
    icon: <FolderOpenIcon />,
    href: '/workflows',
  },
  {
    label: 'Credentials',
    icon: <KeyIcon />,
    href: '/credentials',
  },
  {
    label: 'Executions',
    icon: <HistoryIcon />,
    href: '/executions',
  },
]

export const AppSidebar = () => {
  const location = useLocation()
  const router = useRouter()

  const currentPath = location.pathname

  const { hasActiveSubscription, isLoading } = useHasActiveSubscription()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenuItem>
          <SidebarMenuButton asChild className="h-10 gap-x-4 px-4">
            <Link to="/">
              <NotebookTextIcon />
              <span className="font-bold text-lg">Nodebase</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarHeader>
      <SidebarContent className="px-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                tooltip={item.label}
                asChild
                isActive={currentPath.startsWith(item.href)}
                className="h-10 items-center gap-x-4 px-4"
              >
                <Link to={item.href} preload="intent">
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        {!hasActiveSubscription && !isLoading && (
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={'Upgrade to Pro'}
              className="h-10 gap-x-4 px-4"
              onClick={() => authClient.checkout({ slug: 'pro' })}
            >
              <StarIcon />
              <span>Upgrade to Pro</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
        <SidebarMenuItem>
          <SidebarMenuButton
            tooltip={'Billing Portal'}
            className="h-10 gap-x-4 px-4"
            onClick={() => authClient.customer.portal()}
          >
            <CreditCardIcon />
            <span>Billing Portal</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton
            tooltip={'Logout'}
            className="h-10 gap-x-4 px-4"
            onClick={() =>
              authClient.signOut({
                fetchOptions: {
                  onSuccess: () => {
                    router.navigate({ to: '/login' })
                  },
                },
              })
            }
          >
            <LogOutIcon />
            <span>Logout</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarFooter>
    </Sidebar>
  )
}
