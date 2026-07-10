'use server'
import configPromise from '@payload-config'
import { getPayload, Where } from 'payload'
import { getCustomerAction } from '@/actions/customer'
import { statusOptions } from '@/constants/refinements'
import { Pagination } from '@/types'
import { parseDateForQuery, getNextDay } from '@/utils/date'
import { revalidatePath } from 'next/cache'
import { fileToBuffer } from '@/utils/files'
import {
  createRefinementEmailSubject,
  createRefinementEmailHTML,
} from '@/utils/emails/templates/createRefinementEmail'
import {
  updateRefinementEmailSubject,
  updateRefinementEmailHTML,
} from '@/utils/emails/templates/updateRefinementEmail'
import {
  approveRefinementAdminSubject,
  approveRefinementAdminHTML,
} from '@/utils/emails/templates/approveRefinementEmail'
import {
  refinementStatusUpdateEmailSubject,
  refinementStatusUpdateEmailHTML,
} from '@/utils/emails/templates/refinementStatusUpdateEmail'

type StatusValue = (typeof statusOptions)[number]['value']

type StatusCounts = Record<StatusValue, number>

type RefinementsActions = {
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

export async function getRefinementsAction({ pagination, filters }: RefinementsActions) {
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
    collection: 'refinements',
    where,
    select: {
      publicId: true,
      patient: true,
      status: true,
      createdAt: true,
      request: true,
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

export async function getRefinementsStatusAction() {
  const payload = await getPayload({
    config: configPromise,
  })

  const user = await getCustomerAction()

  const docs = await payload
    .find({
      collection: 'refinements',
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

export async function getEligibleRequestsForRefinementAction() {
  const payload = await getPayload({
    config: configPromise,
  })

  const user = await getCustomerAction()

  if (!user) {
    return []
  }

  const openRefinements = await payload
    .find({
      collection: 'refinements',
      where: {
        customer: {
          equals: user.id,
        },
        status: {
          not_equals: 'completed',
        },
      },
      select: {
        request: true,
      },
      pagination: false,
    })
    .then((result) => result.docs)

  const occupiedRequestIds = openRefinements
    .map((refinement) =>
      typeof refinement.request === 'object' ? refinement.request?.id : refinement.request,
    )
    .filter(Boolean)

  const where: Where = {
    customer: {
      equals: user.id,
    },
    status: {
      equals: 'completed',
    },
  }

  if (occupiedRequestIds.length > 0) {
    where.id = {
      not_in: occupiedRequestIds,
    }
  }

  return payload
    .find({
      collection: 'requests',
      where,
      select: {
        publicId: true,
        orderId: true,
        patient: true,
      },
      sort: '-completionDate',
      pagination: false,
    })
    .then((result) => result.docs)
}

export async function createRefinementAction(formData: FormData) {
  const payload = await getPayload({
    config: configPromise,
  })

  const user = await getCustomerAction()

  const rawData = JSON.parse(formData.get('jsonData') as string)
  const files = formData.getAll('files') as File[]

  const originRequest = await payload
    .find({
      collection: 'requests',
      where: {
        id: {
          equals: rawData.request,
        },
        customer: {
          equals: user.id,
        },
        status: {
          equals: 'completed',
        },
      },
      limit: 1,
    })
    .then((result) => result?.docs?.[0])

  if (!originRequest) {
    throw new Error(
      'A solicitação selecionada não é elegível para refinamento (precisa estar finalizada e pertencer a você).',
    )
  }

  const openRefinementForRequest = await payload
    .find({
      collection: 'refinements',
      where: {
        request: {
          equals: originRequest.id,
        },
        status: {
          not_equals: 'completed',
        },
      },
      limit: 1,
    })
    .then((result) => result?.docs?.[0])

  if (openRefinementForRequest) {
    throw new Error('Já existe um refinamento em aberto para esta solicitação.')
  }

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

  const refinement = await payload.create({
    collection: 'refinements',
    data: {
      customer: user.id,
      ...rawData,
      request: originRequest.id,
      documents,
      status: 'documentation_check',
    },
  })

  const prePaymentRequest = await payload
    .find({
      collection: 'requests-pre-payments',
      where: {
        customer: {
          equals: user.id,
        },
        status: {
          equals: 'paid',
        },
        request: {
          exists: false,
        },
        refinement: {
          exists: false,
        },
      },
    })
    .then((result) => result?.docs?.[0])

  await payload.update({
    collection: 'requests-pre-payments',
    where: {
      id: {
        equals: prePaymentRequest?.id,
      },
    },
    data: {
      refinement: refinement.id,
    },
  })

  const emailData = {
    ...rawData,
    customer: user,
    request: originRequest,
  }

  const subject = createRefinementEmailSubject(emailData)
  const html = createRefinementEmailHTML(emailData)

  await payload.email.sendEmail({
    to: process.env.ADMIN_EMAIL,
    subject,
    html,
  })
}

export async function updateRefinementAction(formData: FormData, refinementId: number) {
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
    collection: 'refinements',
    where: {
      id: {
        equals: refinementId,
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

  const subject = updateRefinementEmailSubject(emailData)
  const html = updateRefinementEmailHTML(emailData)

  await payload.email.sendEmail({
    to: process.env.ADMIN_EMAIL,
    subject,
    html,
  })
}

export async function getRefinementAction(publicId: string) {
  const payload = await getPayload({
    config: configPromise,
  })

  const user = await getCustomerAction()

  return payload
    .find({
      collection: 'refinements',
      where: {
        publicId: {
          equals: publicId,
        },
        customer: {
          equals: user.id,
        },
      },
      depth: 1,
      limit: 1,
    })
    .then((result) => result?.docs?.[0])
}

export async function approveRefinementAction(publicId: string) {
  const payload = await getPayload({
    config: configPromise,
  })

  const user = await getCustomerAction()

  const result = await payload.update({
    collection: 'refinements',
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

  const refinement = result?.docs?.[0]

  const subject = approveRefinementAdminSubject(refinement as any)
  const html = approveRefinementAdminHTML(refinement as any)

  await payload.email.sendEmail({
    to: process.env.ADMIN_EMAIL,
    subject,
    html,
  })

  revalidatePath(`/refinamentos/${publicId}`)
}

export async function confirmRefinementDeliveryAction(publicId: string) {
  const payload = await getPayload({
    config: configPromise,
  })

  const user = await getCustomerAction()

  const result = await payload.update({
    collection: 'refinements',
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

  const refinement = result?.docs?.[0]

  const emailSubject = refinementStatusUpdateEmailSubject(refinement as any)
  const emailHtml = refinementStatusUpdateEmailHTML(refinement as any)

  await payload.email.sendEmail({
    //@ts-ignore
    to: process.env.ADMIN_EMAIL,
    subject: emailSubject,
    html: emailHtml,
  })

  revalidatePath(`/refinamentos/${publicId}`)
}
