'use client'
import React, { ReactNode, useState } from 'react'
// import { Plus } from 'lucide-react'
// import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { MobileHeader, Sidebar, UserNav } from './components'

type DashboardLayoutProps = {
  children: ReactNode
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        onCollapsedChange={setSidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        onMobileOpenChange={setMobileMenuOpen}
      />
      <div
        className={cn(
          'flex-1 transition-all duration-300',
          'lg:ml-16',
          !sidebarCollapsed && 'lg:ml-64',
          'ml-0',
        )}
      >
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-white px-4 lg:px-6">
          <MobileHeader onMenuClick={toggleMobileMenu} />
          <div className="flex flex-1 items-center gap-4">{/* <SearchBox /> */}</div>
          <div className="flex items-center gap-2">
            <UserNav />
          </div>
        </header>
        <main className="flex-1 space-y-4 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}

export default DashboardLayout
