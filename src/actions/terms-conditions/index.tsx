'use server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function getTermsConditions() {
  const payload = await getPayload({
    config: configPromise,
  })

  return payload.findGlobal({
    slug: 'terms-conditions',
    select: {
      content: true,
      showTerms: true,
    },
  })
}
