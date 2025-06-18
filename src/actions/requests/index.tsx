'use server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { getCustomerAction } from '@/actions/customer'
import { statusOptions } from '@/constants/requests'
import { Pagination } from '@/types'

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
  }
}

export async function getRequestsAction({ pagination }: RequestsActions) {
  const page = pagination?.page || 1
  const limit = pagination?.limit || 10

  const payload = await getPayload({
    config: configPromise,
  })

  const user = await getCustomerAction()

  return payload.find({
    collection: 'requests',
    where: {
      customer: {
        equals: user?.id,
      },
    },
    select: {
      publicId: true,
      patient: true,
      status: true,
      createdAt: true,
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

  await payload.update({
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
}
