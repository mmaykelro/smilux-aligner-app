'use client'
import { destroyCookie } from 'nookies'
import { signOut, signIn } from 'next-auth/react'
import { COOKIE_TOKEN } from '@/constants/auth'
import { redirect } from 'next/navigation'

export function logout() {
  destroyCookie(undefined, COOKIE_TOKEN)
  signOut({
    redirect: false,
  })
  redirect('/login')
}

export async function login(values: any) {
  try {
    const result = await signIn('credentials', { ...values, redirect: false })

    if (!result?.ok) {
      throw new Error(result?.error || 'Erro ao fazer login')
    }
  } catch (error) {
    throw error
  }
}
