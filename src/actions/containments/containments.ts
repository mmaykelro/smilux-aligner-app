'use server'
import { revalidatePath } from 'next/cache'
import configPromise from '@payload-config'
import { getPayload, Where } from 'payload'
import { Containment, Customer } from '@/payload-types'
import { Pagination } from '@/types'
import { fileToBuffer } from '@/utils/files'
import { parseDateForQuery, getNextDay } from '@/utils/date'
import { getCustomerAction } from '@/actions/customer'
import {
  createContainmentEmailSubject,
  createContainmentEmailHTML,
} from '@/utils/emails/templates/createContainmentEmail'
import {
  containmentStatusUpdateEmailSubject,
  containmentStatusUpdateEmailHTML,
} from '@/utils/emails/templates/containmentStatusUpdateEmail'
import {
  updateContainmentEmailSubject,
  updateContainmentEmailHTML,
} from '@/utils/emails/templates/updateContainmentEmail'

type GetContainmentsActionRequest = {
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

export async function getContainmentsAction({ pagination, filters }: GetContainmentsActionRequest) {
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
    collection: 'containments',
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

export async function getContainmentAction(publicId: string) {
  const payload = await getPayload({
    config: configPromise,
  })

  const user = await getCustomerAction()

  return payload
    .find({
      collection: 'containments',
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

export async function createContainmentAction(formData: FormData) {
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
    collection: 'containments',
    data: {
      customer: user.id,
      ...rawData,
      documents,
      status: 'created',
    },
  })

  const emailData = {
    ...rawData,
    customer: user,
  } as Containment & { customer: Customer }

  const subject = createContainmentEmailSubject(emailData)
  const html = createContainmentEmailHTML(emailData)

  await payload.email.sendEmail({
    to: process.env.ADMIN_EMAIL,
    subject,
    html,
  })

  revalidatePath('contencoes')
}

export async function updateContainmentAction(formData: FormData, containmentId: number) {
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
    collection: 'containments',
    where: {
      id: {
        equals: containmentId,
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

  const subject = updateContainmentEmailSubject(emailData)
  const html = updateContainmentEmailHTML(emailData)

  await payload.email.sendEmail({
    to: process.env.ADMIN_EMAIL,
    subject,
    html,
  })
}

const statusOptions = [
  { label: 'Pedido criado', value: 'created' },
  { label: 'Em andamento', value: 'in_progress' },
  { label: 'Caso finalizado', value: 'completed' },
  { label: 'Caso finalizado com Pagamento Pendente', value: 'completed_not_paid' },
]

type StatusValue = (typeof statusOptions)[number]['value']

type StatusCounts = Record<StatusValue, number>

export async function getContainmentsStatusAction() {
  const payload = await getPayload({
    config: configPromise,
  })

  const user = await getCustomerAction()

  const docs = await payload
    .find({
      collection: 'containments',
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

export async function confirmContainmentDeliverytAction(publicId: string) {
  const payload = await getPayload({
    config: configPromise,
  })

  const user = await getCustomerAction()

  const result = await payload.update({
    collection: 'containments',
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

  const emailSubject = containmentStatusUpdateEmailSubject(additionalAligner)
  const emailHtml = containmentStatusUpdateEmailHTML(additionalAligner)

  await payload.email.sendEmail({
    //@ts-ignore
    to: process.env.ADMIN_EMAIL,
    subject: emailSubject,
    html: emailHtml,
  })

  revalidatePath(`/contencoes/${publicId}`)
}
