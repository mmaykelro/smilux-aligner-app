'use server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/libs/nextAuth'
import { UserSessionData } from '@/types/customers'
import {
  createUserNotificationSubject,
  createUserNotificationHTML,
} from '@/utils/emails/templates/createUserEmail'

export async function createCustomerAction(data: any) {
  try {
    const payload = await getPayload({
      config: configPromise,
    })

    const user = await payload.create({
      collection: 'customers',
      data,
    })

    const subject = createUserNotificationSubject(data)
    const html = createUserNotificationHTML({ ...data, ...user }, process.env.ADMIN_URL || '')

    await payload.email.sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject,
      html,
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
