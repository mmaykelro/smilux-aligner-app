'use server'
import configPromise from '@payload-config'
import { getPayload, Where } from 'payload'
import { getCustomerAction } from '@/actions/customer'
import { statusOptions } from '@/constants/requests'
import { Pagination } from '@/types'
import { parseDateForQuery, getNextDay } from '@/utils/date'
import { revalidatePath } from 'next/cache'
import {
  createEmailSubject,
  createRequestEmailHTML,
} from '@/utils/emails/templates/createRequestEmail'
import {
  updateEmailSubject,
  updateRequestEmailHTML,
} from '@/utils/emails/templates/updateRequestEmail'
import {
  approveRequestAdminSubject,
  approveRequestAdminHTML,
} from '@/utils/emails/templates/approveRequestEmail'
import {
  statusUpdateEmailSubject,
  statusUpdateEmailHTML,
} from '@/utils/emails/templates/requestStatusUpdateEmail'

type StatusValue = (typeof statusOptions)[number]['value']

type StatusCounts = Record<StatusValue, number>

async function fileToBuffer(file: File): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

type RequestsActions = {
  pagination?: Pagination
  filters?: {
    patient?: string
    status?: string
    from?: string
    to?: string
  }
}

export async function getRequestsAction({ pagination, filters }: RequestsActions) {
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
    collection: 'requests',
    where,
    select: {
      publicId: true,
      patient: true,
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

export async function getRequestsStatusAction() {
  const payload = await getPayload({
    config: configPromise,
  })

  const user = await getCustomerAction()

  const docs = await payload
    .find({
      collection: 'requests',
      where: {
        customer: {
          equals: user?.id,
        },
      },
      select: {
        status: true,
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

    return accumulator
  }, initialCounts)

  return finalCounts as StatusCounts
}

export async function createRequestAction(formData: FormData) {
  const payload = await getPayload({
    config: configPromise,
  })

  const user = await getCustomerAction()

  const rawData = JSON.parse(formData.get('jsonData') as string)
  const files = formData.getAll('files') as File[]

  const documents = []

  for (const file of files) {
    const documentMeta = rawData.documents.find((doc: any) => doc.documentFile?.name === file.name)

    const buffer = await fileToBuffer(file)

    const result = await payload.create({
      collection: 'media',
      data: {
        alt: file.name,
      },
      //@ts-ignore
      file: {
        data: buffer,
        name: file.name,
        mimetype: file.type,
      },
    })

    const uploadedDocument = {
      documentName: documentMeta?.documentName,
      documentFile: result?.id,
    }

    documents.push(uploadedDocument)
  }

  await payload.create({
    collection: 'requests',
    data: {
      customer: user.id,
      ...rawData,
      documents,
      status: 'documentation_check',
    },
  })

  const emailData = {
    ...rawData,
    customer: user,
  }

  const subject = createEmailSubject(emailData)
  const html = createRequestEmailHTML(emailData)

  await payload.email.sendEmail({
    to: process.env.ADMIN_EMAIL,
    subject,
    html,
  })
}

export async function updateRequestAction(formData: FormData, requestId: number) {
  const payload = await getPayload({
    config: configPromise,
  })

  const user = await getCustomerAction()

  const rawData = JSON.parse(formData.get('jsonData') as string)
  const files = formData.getAll('files') as File[]

  const documents = []

  for (const document of rawData.documents) {
    if (document.documentFile?.id) {
      const uploadedDocument = {
        documentName: document?.documentName,
        documentFile: document.documentFile?.id,
      }

      documents.push(uploadedDocument)
    }

    const file = files.find((item) => item.name === document.documentFile?.name) as File

    if (file) {
      const buffer = await fileToBuffer(file as File)

      const result = await payload.create({
        collection: 'media',
        data: {
          alt: file.name,
        },
        //@ts-ignore
        file: {
          data: buffer,
          name: file.name,
          mimetype: file.type,
        },
      })

      const uploadedDocument = {
        documentName: document?.documentName,
        documentFile: result?.id,
      }

      documents.push(uploadedDocument)
    }
  }

  await payload.update({
    collection: 'requests',
    where: {
      id: {
        equals: requestId,
      },
      customer: {
        equals: user?.id,
      },
    },
    data: {
      ...rawData,
      documents,
    },
  })

  const emailData = {
    ...rawData,
    customer: user,
  }

  const subject = updateEmailSubject(emailData)
  const html = updateRequestEmailHTML(emailData)

  await payload.email.sendEmail({
    to: process.env.ADMIN_EMAIL,
    subject,
    html,
  })
}

export async function getRequestAction(publicId: string) {
  const payload = await getPayload({
    config: configPromise,
  })

  const user = await getCustomerAction()

  return payload
    .find({
      collection: 'requests',
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

export async function approveRequestAction(publicId: string) {
  const payload = await getPayload({
    config: configPromise,
  })

  const user = await getCustomerAction()

  const result = await payload.update({
    collection: 'requests',
    where: {
      publicId: {
        equals: publicId,
      },
      customer: {
        equals: user?.id,
      },
    },
    data: {
      status: 'completed',
    },
  })

  const request = result?.docs?.[0]

  const subject = approveRequestAdminSubject(request as any)
  const html = approveRequestAdminHTML(request as any)

  await payload.email.sendEmail({
    to: process.env.ADMIN_EMAIL,
    subject,
    html,
  })

  revalidatePath(`/solicitacoes/${publicId}`)
}

export async function confirmRequestDeliverytAction(publicId: string) {
  const payload = await getPayload({
    config: configPromise,
  })

  const user = await getCustomerAction()

  const result = await payload.update({
    collection: 'requests',
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

  const request = result?.docs?.[0]

  const emailSubject = statusUpdateEmailSubject(request)
  const emailHtml = statusUpdateEmailHTML(request)

  await payload.email.sendEmail({
    //@ts-ignore
    to: process.env.ADMIN_EMAIL,
    subject: emailSubject,
    html: emailHtml,
  })

  revalidatePath(`/solicitacoes/${publicId}`)
}
