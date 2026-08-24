import { Outlet } from 'react-router-dom'
import BottomNav from './BottomNav'

export default function Layout() {
  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col md:flex-row">
      <BottomNav />
      <main className="flex-1 pb-16 md:pb-0">
        <Outlet />
      </main>
    </div>
  )
}
