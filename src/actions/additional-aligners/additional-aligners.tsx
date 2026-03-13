'use server'
import { AdditionalAligner, Customer } from '@/payload-types'
import configPromise from '@payload-config'
import { getPayload, Where } from 'payload'
import { getCustomerAction } from '@/actions/customer'
import { Pagination } from '@/types'
import { parseDateForQuery, getNextDay } from '@/utils/date'
import { revalidatePath } from 'next/cache'
import {
  createAdditionalAlignerEmailSubject,
  createAdditionalAlignerEmailHTML,
} from '@/utils/emails/templates/createAdditionalAlignerEmail'
import {
  updateAdditionalAlignerEmailSubject,
  updateAdditionalAlignerEmailHTML,
} from '@/utils/emails/templates/updateAdditionalAlignerEmail'
import {
  additionalAlignerStatusUpdateEmailSubject,
  additionalAlignerStatusUpdateEmailHTML,
} from '@/utils/emails/templates/additionalAlignerStatusUpdateEmail'

const statusOptions = [
  { label: 'Pedido criado', value: 'created' },
  { label: 'Em andamento', value: 'in_progress' },
  { label: 'Caso finalizado', value: 'completed' },
  { label: 'Caso finalizado com Pagamento Pendente', value: 'completed_not_paid' },
]

type StatusValue = (typeof statusOptions)[number]['value']

type StatusCounts = Record<StatusValue, number>

type getAdditionalAlignersActionActionRequest = {
  pagination?: Pagination
  filters?: {
    patient?: string
    status?: string
    payment?: {
      status: 'paid' | 'not_paid'
    }
    from?: string
    to?: string
  }
}

export async function getAdditionalAlignersAction({
  pagination,
  filters,
}: getAdditionalAlignersActionActionRequest) {
  const page = pagination?.page || 1
  const limit = pagination?.limit || 10

  const payload = await getPayload({
    config: configPromise,
  })

  const user = await getCustomerAction()

  if (!user) {
    return {
      docs: [],
      totalDocs: 0,
      page: 1,
      limit,
      totalPages: 0,
      hasNextPage: false,
      hasPrevPage: false,
    }
  }

  const where: Where = {
    customer: {
      equals: user.id,
    },
  }

  if (filters) {
    if (filters.status && filters.status !== 'todos') {
      where.status = {
        equals: filters.status,
      }
    }

    if (filters?.patient) {
      where.patient = {
        like: filters.patient,
      }
    }

    if (filters?.payment?.status) {
      where['payment.status'] = {
        equals: filters.payment.status,
      }
    }

    const dateConditions: { greater_than_or_equal?: string; less_than?: string } = {}

    if (filters?.from) {
      const startDate = parseDateForQuery(filters.from)
      if (startDate) {
        dateConditions.greater_than_or_equal = startDate
      }
    }

    if (filters?.to) {
      const endDate = parseDateForQuery(filters.to)
      if (endDate) {
        dateConditions.less_than = getNextDay(endDate)
      }
    }

    if (Object.keys(dateConditions).length > 0) {
      //@ts-ignore
      where.createdAt = dateConditions
    }
  }

  return payload.find({
    collection: 'additional-aligners',
    where,
    select: {
      publicId: true,
      patient: true,
      alignerType: true,
      alignerNumber: true,
      status: true,
      createdAt: true,
      payment: {
        pixUrl: true,
        cardUrl: true,
        status: true,
      },
      tracking: {
        trackingCode: true,
        status: true,
      },
    },
    pagination: true,
    page,
    limit,
  })
}

export async function getAdditionalAlignersActionStatusAction() {
  const payload = await getPayload({
    config: configPromise,
  })

  const user = await getCustomerAction()

  const docs = await payload
    .find({
      collection: 'additional-aligners',
      where: {
        customer: {
          equals: user?.id,
        },
      },
      select: {
        status: true,
        payment: {
          status: true,
        },
      },
      pagination: false,
    })
    .then((data) => data.docs)

  const initialCounts = statusOptions.reduce<StatusCounts>((acc, option) => {
    acc[option.value] = 0
    return acc
  }, {})

  const finalCounts: StatusCounts = docs.reduce((accumulator, currentItem) => {
    accumulator[currentItem.status]++

    if (currentItem.payment.status === 'not_paid' && currentItem.status === 'completed') {
      accumulator['completed_not_paid']++
    }

    return accumulator
  }, initialCounts)

  return finalCounts as StatusCounts
}

export async function getAdditionalAlignerAction(publicId: string) {
  const payload = await getPayload({
    config: configPromise,
  })

  const user = await getCustomerAction()

  return payload
    .find({
      collection: 'additional-aligners',
      where: {
        publicId: {
          equals: publicId,
        },
        customer: {
          equals: user.id,
        },
      },

      limit: 1,
    })
    .then((result) => result?.docs?.[0])
}

export async function createAdditionalAlignerAction(data: AdditionalAligner) {
  const payload = await getPayload({
    config: configPromise,
  })

  const user = await getCustomerAction()

  await payload.create({
    collection: 'additional-aligners',
    data: {
      ...data,
      customer: user.id,
      status: 'created',
    },
  })

  const emailData = {
    ...data,
    customer: user,
  } as AdditionalAligner & { customer: Customer }

  const subject = createAdditionalAlignerEmailSubject(emailData)
  const html = createAdditionalAlignerEmailHTML(emailData)

  await payload.email.sendEmail({
    to: process.env.ADMIN_EMAIL,
    subject,
    html,
  })

  revalidatePath('alinhadores-adicionais')
}

export async function updateAdditionalAlignerAction(data: AdditionalAligner) {
  const payload = await getPayload({
    config: configPromise,
  })

  const user = await getCustomerAction()

  await payload.update({
    collection: 'additional-aligners',
    where: {
      id: {
        equals: data.id,
      },
      customer: {
        equals: user?.id,
      },
    },
    data,
  })

  const emailData = {
    ...data,
    customer: user,
  } as AdditionalAligner & { customer: Customer }

  const subject = updateAdditionalAlignerEmailSubject(emailData)
  const html = updateAdditionalAlignerEmailHTML(emailData)

  await payload.email.sendEmail({
    to: process.env.ADMIN_EMAIL,
    subject,
    html,
  })

  revalidatePath('alinhadores-adicionais')
}

export async function confirmAdditionalAlignerDeliverytAction(publicId: string) {
  const payload = await getPayload({
    config: configPromise,
  })

  const user = await getCustomerAction()

  const result = await payload.update({
    collection: 'additional-aligners',
    where: {
      publicId: {
        equals: publicId,
      },
      customer: {
        equals: user?.id,
      },
    },
    data: {
      tracking: {
        status: 'delivered',
      },
    },
  })

  const additionalAligner = result?.docs?.[0]

  const emailSubject = additionalAlignerStatusUpdateEmailSubject(additionalAligner)
  const emailHtml = additionalAlignerStatusUpdateEmailHTML(additionalAligner)

  await payload.email.sendEmail({
    //@ts-ignore
    to: process.env.ADMIN_EMAIL,
    subject: emailSubject,
    html: emailHtml,
  })

  revalidatePath(`/alinhadores-adicionais/${publicId}`)
}
