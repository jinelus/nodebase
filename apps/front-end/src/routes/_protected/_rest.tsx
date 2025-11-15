import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'

export const Route = createFileRoute('/_protected/_rest')({
  component: () => <Layout />,
})

const Layout = () => {
  return (
    <main>
      <Header />
      <Outlet />
    </main>
  )
}
