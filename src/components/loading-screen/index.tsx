'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface LoadingScreenProps {
  isVisible?: boolean
  onComplete?: () => void
  duration?: number
}

export default function LoadingScreen({
  isVisible = true,
  onComplete,
  duration = 3000,
}: LoadingScreenProps) {
  const [isAnimating, setIsAnimating] = useState(true)

  useEffect(() => {
    if (!isVisible) return

    const timer = setTimeout(() => {
      setIsAnimating(false)
      onComplete?.()
    }, duration)

    return () => clearTimeout(timer)
  }, [isVisible, duration, onComplete])

  if (!isVisible && !isAnimating) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        background: 'rgba(255, 255, 255, 0.007)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
    >
      <div className="flex flex-col items-center space-y-8">
        {/* Logo com animações */}
        <div className="relative">
          {/* Anel externo pulsante */}
          <div className="absolute inset-0 animate-ping">
            <div className="w-32 h-32 bg-blue-500/20 rounded-full"></div>
          </div>

          {/* Anel médio rotativo */}
          <div className="absolute inset-2 animate-spin">
            <div className="w-28 h-28 border-4 border-blue-300/30 border-t-blue-500/60 rounded-full"></div>
          </div>

          {/* Logo central com animação de escala */}
          <div className="relative animate-logo-pulse">
            <Image
              src="/images/logo-icon.png"
              alt="Logo"
              width={128}
              height={128}
              className="w-32 h-32 drop-shadow-xl"
              priority
            />
          </div>
        </div>

        {/* Texto de carregamento */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold text-gray-800 animate-pulse">Carregando...</h2>
          <p className="text-gray-600 text-sm">Aguarde um momento</p>
        </div>

        {/* Pontos animados */}
        <div className="flex space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1s',
              }}
            />
          ))}
        </div>
      </div>

      {/* Efeito de partículas flutuantes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
