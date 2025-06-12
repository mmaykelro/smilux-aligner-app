'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Home,
  Users,
  Calendar,
  FileText,
  BarChart3,
  Settings,
  HelpCircle,
  Smile,
  CreditCard,
  ChevronLeft,
  LogOut,
  X,
} from 'lucide-react'

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
        setCollapsed(false) // Always expanded on mobile when open
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

  // Mobile overlay
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
                <SidebarItem
                  icon={Home}
                  title="Dashboard"
                  href="#"
                  isActive={true}
                  isCollapsed={false}
                  onClick={closeMobile}
                />
                <SidebarItem
                  icon={Users}
                  title="Pacientes"
                  href="#"
                  isCollapsed={false}
                  badge={12}
                  onClick={closeMobile}
                />
                <SidebarItem
                  icon={Calendar}
                  title="Agendamentos"
                  href="#"
                  isCollapsed={false}
                  badge={5}
                  onClick={closeMobile}
                />
                <SidebarItem
                  icon={Smile}
                  title="Tratamentos"
                  href="#"
                  isCollapsed={false}
                  onClick={closeMobile}
                />
                <SidebarItem
                  icon={BarChart3}
                  title="Relatórios"
                  href="#"
                  isCollapsed={false}
                  onClick={closeMobile}
                />
                <SidebarItem
                  icon={FileText}
                  title="Documentos"
                  href="#"
                  isCollapsed={false}
                  onClick={closeMobile}
                />
                <SidebarItem
                  icon={CreditCard}
                  title="Financeiro"
                  href="#"
                  isCollapsed={false}
                  onClick={closeMobile}
                />
              </nav>
              <div className="mt-2 px-2">
                <div className="pt-2">
                  <div className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Configurações
                  </div>
                  <nav className="grid gap-1">
                    <SidebarItem
                      icon={Settings}
                      title="Configurações"
                      href="#"
                      isCollapsed={false}
                      onClick={closeMobile}
                    />
                    <SidebarItem
                      icon={HelpCircle}
                      title="Ajuda"
                      href="#"
                      isCollapsed={false}
                      onClick={closeMobile}
                    />
                  </nav>
                </div>
              </div>
            </ScrollArea>
            <div className="mt-auto border-t p-2">
              <Button variant="ghost" className="w-full justify-start gap-3" onClick={closeMobile}>
                <LogOut className="h-5 w-5" />
                <span>Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </>
    )
  }

  // Desktop sidebar
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
              <div className="rounded-full bg-cyan-100 p-1.5">
                <Smile className="h-6 w-6 text-cyan-600" />
              </div>
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
            <SidebarItem
              icon={Home}
              title="Dashboard"
              href="#"
              isActive={true}
              isCollapsed={collapsed}
            />
            <SidebarItem
              icon={Users}
              title="Pacientes"
              href="#"
              isCollapsed={collapsed}
              badge={12}
            />
            <SidebarItem
              icon={Calendar}
              title="Agendamentos"
              href="#"
              isCollapsed={collapsed}
              badge={5}
            />
            <SidebarItem icon={Smile} title="Tratamentos" href="#" isCollapsed={collapsed} />
            <SidebarItem icon={BarChart3} title="Relatórios" href="#" isCollapsed={collapsed} />
            <SidebarItem icon={FileText} title="Documentos" href="#" isCollapsed={collapsed} />
            <SidebarItem icon={CreditCard} title="Financeiro" href="#" isCollapsed={collapsed} />
          </nav>
          <div className="mt-2 px-2">
            <div className="pt-2">
              <div
                className={cn(
                  'mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground',
                  collapsed && 'sr-only',
                )}
              >
                Configurações
              </div>
              <nav className="grid gap-1">
                <SidebarItem
                  icon={Settings}
                  title="Configurações"
                  href="#"
                  isCollapsed={collapsed}
                />
                <SidebarItem icon={HelpCircle} title="Ajuda" href="#" isCollapsed={collapsed} />
              </nav>
            </div>
          </div>
        </ScrollArea>
        <div className="mt-auto border-t p-2">
          <Button
            variant="ghost"
            className={cn('w-full justify-start gap-3', collapsed && 'justify-center px-0')}
          >
            <LogOut className="h-5 w-5" />
            {!collapsed && <span>Sair</span>}
          </Button>
        </div>
      </div>
    </div>
  )
}

function SidebarItem({
  icon: Icon,
  title,
  href,
  isActive,
  isCollapsed,
  badge,
  onClick,
}: SidebarItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent',
        isActive ? 'bg-cyan-50 text-cyan-600 hover:bg-cyan-100' : 'text-muted-foreground',
        isCollapsed && 'justify-center px-0',
      )}
    >
      <div className="relative">
        <Icon className={cn('h-5 w-5', isActive && 'text-cyan-600')} />
        {badge && !isCollapsed && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-medium text-white">
            {badge}
          </span>
        )}
      </div>
      {!isCollapsed && <span>{title}</span>}
    </Link>
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
