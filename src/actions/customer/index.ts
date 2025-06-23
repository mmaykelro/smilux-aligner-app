'use server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/libs/nextAuth'
import { UserSessionData } from '@/types/customers'
import { fileToBuffer } from '@/utils/files'
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

    if (data?.profileImage instanceof File) {
      const buffer = await fileToBuffer(data.profileImage)

      const image = await payload.create({
        collection: 'media',
        data: {
          alt: `Imagem de perfil de ${user.name}`,
        },
        //@ts-ignore
        file: {
          data: buffer,
          name: data.profileImage.name,
          mimetype: data.profileImage.type,
        },
      })

      data.profileImage = image.id
    }

    if (!data.profileImage) {
      data.profileImage = null
    }

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

  const payload = await getPayload({
    config: configPromise,
  })

  const user = await payload.findByID({
    collection: 'customers',
    //@ts-ignore
    id: session?.user?.id,
    depth: 2,
    user: session?.user,
  })

  return user as UserSessionData
}
