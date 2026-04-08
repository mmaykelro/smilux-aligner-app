'use server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { getCustomerAction } from '@/actions/customer'

export async function getPrePaymentRequestAction() {
  const user = await getCustomerAction()

  const payload = await getPayload({
    config: configPromise,
  })

  return payload
    .find({
      collection: 'requests-pre-payments',
      where: {
        customer: {
          equals: user.id,
        },
      },
      sort: '-createdAt', // 👈 mais recente primeiro
      limit: 1,
    })
    .then((result) => result?.docs?.[0])
}

export async function getPrePaymentRequestSettingsAction() {
  const payload = await getPayload({
    config: configPromise,
  })

  return payload.findGlobal({
    slug: 'pre-payment-requests-settings',
  })
}

export async function createPrePaymentRequestAction() {
  const user = await getCustomerAction()

  const payload = await getPayload({
    config: configPromise,
  })

  const hasPrepaymentCreated = await payload.find({
    collection: 'requests-pre-payments',
    where: {
      customer: {
        equals: user.id,
      },
      status: {
        equals: 'created',
      },
    },
  })

  if (!hasPrepaymentCreated?.docs?.length) {
    await payload.create({
      collection: 'requests-pre-payments',
      data: {
        customer: user.id,
        status: 'created',
      },
    })
  }

  return 'ok'
}
