import { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { cookies } from 'next/headers'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { COOKIE_TOKEN } from '@/constants/auth'

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {},
      async authorize(credentials: any) {
        try {
          const payload = await getPayload({
            config: configPromise,
          })

          const { email, password } = credentials

          const login = await payload.login({
            collection: 'customers',
            data: {
              email,
              password,
            },
          })
          console.log(login)
          const { token, user } = login

          const cookieStore = await cookies()
          cookieStore.set(COOKIE_TOKEN, token || '')

          return user as any
        } catch (error) {
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      return {
        ...token,
        ...user,
      }
    },
    session({ session, token }: any) {
      session.user = token
      return session
    },
  },
  secret: process.env.SECRET,
  pages: {
    signIn: '/login',
  },
}
