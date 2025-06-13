import React from 'react'
import Providers from '@/providers'
import './styles.css'

export const metadata = {
  description: 'Smilux Aligner | Sua jornada para o sorriso perfeito começa aqui',
  title: 'Smilux Aligner | Sua jornada para o sorriso perfeito começa aqui',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>
        <main>
          <Providers>{children}</Providers>
        </main>
      </body>
    </html>
  )
}
