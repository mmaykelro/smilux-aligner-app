import React, { Suspense } from 'react'
import Providers from '@/providers'
import WhatsAppFloatingButton from '@/components/whatsapp-floating-button'
import './styles.css'

export const metadata = {
  description: 'Smilux Aligner | Criado por ortodontista, pensado para ortodontistas.',
  title: 'Smilux Aligner | Criado por ortodontista, pensado para ortodontistas.',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>
        <main>
          <Providers>
            <Suspense>{children}</Suspense>
            <WhatsAppFloatingButton />
          </Providers>
        </main>
      </body>
    </html>
  )
}
