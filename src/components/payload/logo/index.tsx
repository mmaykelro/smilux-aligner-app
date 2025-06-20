import React from 'react'
import Image from 'next/image'

export const Logo = () => {
  return (
    <Image
      style={{
        width: 200,
      }}
      className="logo"
      alt="logo"
      src={'/images/logo.png'}
      width={1000}
      height={1000}
    />
  )
}
