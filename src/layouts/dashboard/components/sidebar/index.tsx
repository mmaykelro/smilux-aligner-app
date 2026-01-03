'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Home, ChevronLeft, LogOut, X, ClipboardList, Hospital } from 'lucide-react'
import { logout } from '@/services/auth'

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultCollapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
  mobileOpen?: boolean
  onMobileOpenChange?: (open: boolean) => void
}

interface SidebarItemProps {
  icon: React.ElementType
  title: string
  href: string
  isActive?: boolean
  isCollapsed: boolean
  badge?: number
  onClick?: () => void
}

const sideBaritems = [
  {
    icon: Home,
    title: 'Início',
    href: '/',
  },
  {
    icon: ClipboardList,
    title: 'Solicitações',
    href: '/solicitacoes',
  },
  {
    icon: Hospital,
    title: 'Preferências Clínicas',
    href: '/preferencias-clinicas',
  },
]

export function Sidebar({
  className,
  defaultCollapsed = false,
  onCollapsedChange,
  mobileOpen = false,
  onMobileOpenChange,
  ...props
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      if (mobile) {
        setCollapsed(false)
      }
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)

    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const handleCollapsedChange = (newCollapsed: boolean) => {
    if (!isMobile) {
      setCollapsed(newCollapsed)
      onCollapsedChange?.(newCollapsed)
    }
  }

  const closeMobile = () => {
    onMobileOpenChange?.(false)
  }

  if (isMobile) {
    return (
      <>
        {mobileOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={closeMobile} />
          </div>
        )}
        <div
          className={cn(
            'fixed inset-y-0 left-0 z-50 w-64 transform bg-white border-r transition-transform duration-300 ease-in-out lg:hidden',
            mobileOpen ? 'translate-x-0' : '-translate-x-full',
            className,
          )}
          {...props}
        >
          <div className="flex h-full flex-col">
            <div className="flex h-16 items-center justify-between border-b px-4">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/images/logo.png"
                  alt="Smilux Aligner"
                  width={120}
                  height={40}
                  priority
                />
              </Link>
              <Button variant="ghost" size="icon" onClick={closeMobile}>
                <X className="h-5 w-5" />
                <span className="sr-only">Fechar menu</span>
              </Button>
            </div>
            <ScrollArea className="flex-1 py-2">
              <nav className="grid gap-1 px-2">
                {sideBaritems.map((item) => (
                  <SidebarItem
                    key={item.title}
                    icon={item.icon}
                    title={item.title}
                    href={item.href}
                    isCollapsed={collapsed}
                    onClick={closeMobile}
                  />
                ))}
              </nav>
            </ScrollArea>
            <div className="mt-auto border-t p-2">
              <Button onClick={logout} variant="ghost" className="w-full justify-start gap-3">
                <LogOut className="h-5 w-5" />
                <span>Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <div className="relative">
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-20 flex flex-col border-r bg-white transition-all duration-300 hidden lg:flex',
          collapsed ? 'w-16' : 'w-64',
          className,
        )}
        {...props}
      >
        <div
          className={cn(
            'flex h-16 items-center border-b px-4',
            collapsed ? 'justify-center' : 'justify-between',
          )}
        >
          {!collapsed && (
            <Link href="/" className="flex items-center gap-2">
              <Image src="/images/logo.png" alt="Smilux Aligner" width={120} height={40} priority />
            </Link>
          )}
          {collapsed && (
            <div className="flex items-center justify-center">
              <Image
                src="/images/logo-icon.png"
                alt="Smilux Aligner"
                width={50}
                height={50}
                priority
              />
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'absolute -right-4 top-6 h-8 w-8 rounded-full border bg-white shadow-md hover:shadow-lg',
              collapsed ? 'rotate-180' : '',
            )}
            onClick={() => handleCollapsedChange(!collapsed)}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">{collapsed ? 'Expandir' : 'Recolher'}</span>
          </Button>
        </div>
        <ScrollArea className="flex-1 py-2">
          <nav className="grid gap-1 px-2">
            {sideBaritems.map((item) => (
              <SidebarItem
                key={item.title}
                icon={item.icon}
                title={item.title}
                href={item.href}
                isCollapsed={collapsed}
              />
            ))}
          </nav>
        </ScrollArea>
        <div className="mt-auto border-t p-2">
          <Button
            variant="ghost"
            className={cn('w-full justify-start gap-3', collapsed && 'justify-center px-0')}
            onClick={logout}
          >
            <LogOut className="h-5 w-5" />
            {!collapsed && <span>Sair</span>}
          </Button>
        </div>
      </div>
    </div>
  )
}

function SidebarItem({ icon: Icon, title, href, isCollapsed, badge, onClick }: SidebarItemProps) {
  const currentPath = usePathname()

  const isActive = (href: string) =>
    href !== '/' ? currentPath.includes(href) : currentPath === href

  return (
    <Button
      variant="ghost"
      className={`justify-start ${isActive(href) && 'bg-accent text-primary'}`}
      asChild
    >
      <Link
        href={href}
        onClick={onClick}
        className={cn(
          'flex items-center gap-3 rounded-lg  py-2 text-sm font-medium transition-all',

          isCollapsed && 'justify-center px-0',
        )}
      >
        <div className="relative">
          <Icon className="h-5 w-5" />
          {badge && !isCollapsed && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-medium text-white">
              {badge}
            </span>
          )}
        </div>
        {!isCollapsed && <span>{title}</span>}
      </Link>
    </Button>
  )
}

export function useSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)

    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  return { collapsed, setCollapsed, isMobile }
}
