'use server'
import configPromise from '@payload-config'
import { getPayload, Where } from 'payload'

export async function getRTermsConditions() {
  const payload = await getPayload({
    config: configPromise,
  })

  return payload.findGlobal({
    slug: 'terms-conditions',
    select: {
      content: true,
    },
  })
}
