import React from 'react'
import DashboardLayout from '@/layouts/dashboard'

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>
}
