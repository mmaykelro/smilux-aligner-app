'use server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { getCustomerAction } from '@/actions/customer'

export async function getPatientsAction() {
  const payload = await getPayload({
    config: configPromise,
  })

  const user = await getCustomerAction()

  const patients = await payload.find({
    collection: 'requests',
    where: {
      customer: {
        equals: user?.id,
      },
    },
    select: {
      patient: true,
    },
    pagination: false,
  })

  return patients.docs
}
