'use client'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from '@/components/ui/sonner'

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SessionProvider>{children}</SessionProvider>
      <Toaster />
    </>
  )
}

export default Providers
