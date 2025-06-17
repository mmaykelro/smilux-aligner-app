'use server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/libs/nextAuth'
import { UserSessionData } from '@/types/customers'

export async function createCustomerAction(data: any) {
  try {
    const payload = await getPayload({
      config: configPromise,
    })

    await payload.create({
      collection: 'customers',
      data,
    })
  } catch (error) {
    throw error
  }
}

export async function updateCustomerAction(data: any) {
  try {
    const user = await getCustomerAction()

    const payload = await getPayload({
      config: configPromise,
    })

    await payload.update({
      collection: 'customers',
      id: user.id,
      data: data,
      user: user,
    })

    return user
  } catch (error) {
    throw error
  }
}

export async function getCustomerAction() {
  const session = await getServerSession(authOptions)

  return session?.user as UserSessionData
}
