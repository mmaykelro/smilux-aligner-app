import type { CollectionConfig } from 'payload'
import { v4 as uuidv4 } from 'uuid'
import { ADMIN_REQUESTS_GROUP } from '@/constants/payload'
import { relalidatePaths } from '@/utils/payload'
import { alignerNumbers } from '@/sections/additional-aligners/additional-alligner-form/constants'
import { validateUrl } from '@/utils/url'
import {
  additionalAlignerStatusUpdateEmailSubject,
  additionalAlignerStatusUpdateEmailHTML,
} from '@/utils/emails/templates/additionalAlignerStatusUpdateEmail'

export const AdditionalAligners: CollectionConfig = {
  slug: 'additional-aligners',
  admin: {
    ...ADMIN_REQUESTS_GROUP,
    useAsTitle: 'titleForList',
    description:
      'Formulário de solicitação de alinhadores adicionais para um tratamento já existente',
    defaultColumns: ['patient', 'customer', 'createdAt', 'updatedAt'],
  },
  labels: {
    singular: {
      pt: 'Alinhador adicional',
    },
    plural: {
      pt: 'Alinhadores adicionais',
    },
  },
  hooks: {
    beforeChange: [
      async ({ data, req, operation, originalDoc }) => {
        if (
          operation === 'update' &&
          data.status === 'completed' &&
          originalDoc.status !== 'completed' &&
          !data.orderId
        ) {
          const {
            docs: [lastRequest],
          } = await req.payload.find({
            collection: 'additional-aligners',
            sort: '-orderId',
            limit: 1,
            where: {
              orderId: {
                exists: true,
              },
            },
          })

          if (lastRequest && lastRequest.orderId) {
            data.orderId = lastRequest.orderId + 1
          } else {
            data.orderId = 200
          }

          if (!data.completionDate) {
            data.completionDate = new Date().toISOString()
          }
        }

        if (operation === 'update') {
          const trackingLinkAddedOrChanged =
            data.trackingLink && data.trackingLink !== originalDoc.trackingLink

          if (trackingLinkAddedOrChanged) {
            data.status = 'in_progress'
          }
        }

        if (operation === 'create') {
          data.publicId = uuidv4()
        }

        const statusOption = [
          { label: 'Verificando documentação', value: 'created' },
          { label: 'Em andamento', value: 'in_progress' },
          { label: 'Caso finalizado', value: 'completed' },
        ].find((option) => option.value === data.status)

        const statusLabel = statusOption ? statusOption.label : 'Status não definido'

        data.titleForList = `${data.patient} - [${statusLabel}]`
        return data
      },
    ],
    afterChange: [
      async ({ doc, req, previousDoc, operation }) => {
        await relalidatePaths({
          req,
          paths: ['/', '/alinhadores-adicionais', `/alinhadores-adicionais/${doc.slug}`],
        })

        if (operation !== 'update') {
          return
        }

        const statusChanged = doc.status !== previousDoc.status
        const paymentStatusChanged = doc.payment?.status !== previousDoc.payment?.status
        const trackingStatusChanged = doc.tracking?.status !== previousDoc.tracking?.status
        const trackingLinkChanged =
          doc?.trackingLink && doc.trackingLink !== previousDoc.trackingLink

        if (doc.status === 'completed') return

        if (statusChanged || paymentStatusChanged || trackingStatusChanged || trackingLinkChanged) {
          try {
            const populatedDoc = await req.payload.findByID({
              collection: 'additional-aligners',
              id: doc.id,
              depth: 1,
            })

            //@ts-ignore
            if (!populatedDoc.customer || !populatedDoc.customer.email) {
              req.payload.logger.warn(
                `Solicitação ID ${doc.id} atualizada, mas não foi possível notificar o cliente (sem e-mail).`,
              )
              return
            }

            const emailSubject = additionalAlignerStatusUpdateEmailSubject(populatedDoc)
            const emailHtml = additionalAlignerStatusUpdateEmailHTML(populatedDoc)

            await req.payload.sendEmail({
              //@ts-ignore
              to: populatedDoc.customer.email,
              subject: emailSubject,
              html: emailHtml,
            })
          } catch (error) {
            req.payload.logger.error(
              `Falha ao enviar e-mail de atualização para solicitação ID ${doc.id}: ${error}`,
            )
          }
        }
      },
    ],
  },
  fields: [
    {
      name: 'publicId',
      label: 'ID Público (UUID)',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        hidden: true,
      },
    },
    {
      name: 'titleForList',
      type: 'text',
      label: 'Título para Listagem',
      admin: {
        hidden: true,
        readOnly: true,
      },
      hooks: {
        beforeValidate: [
          (args) => {
            if (args.operation === 'create' || args.operation === 'update') {
              //@ts-ignore
              args.data.titleForList = 'temp'
            }
          },
        ],
      },
    },
    {
      name: 'customer',
      label: 'Doutor(a)',
      type: 'relationship',
      relationTo: 'customers',
      required: true,
      hasMany: false,
    },
    {
      name: 'patient',
      type: 'text',
      required: true,
      label: 'Nome do(a) paciente',
    },
    {
      name: 'alignerType',
      label: 'Tipo de arcada do alinhador',
      type: 'radio',
      required: true,
      options: [
        { label: 'Superior', value: 'upper' },
        { label: 'Inferior', value: 'lower' },
      ],
    },
    {
      name: 'alignerNumber',
      label: 'Número do alinhador',
      type: 'select',
      hasMany: false,
      options: alignerNumbers,
      admin: {
        description: 'Selecione o número do alinhador',
        condition: (data) => data.alignerType === 'upper' || data.alignerType === 'lower',
      },
    },
    {
      name: 'orderId',
      label: 'ID do Pedido',
      type: 'number',
      unique: true,
      index: true,
      min: 200,
      admin: {
        readOnly: true,
        position: 'sidebar',
        description:
          'ID sequencial único gerado automaticamente quando a solicitação é finalizada.',
      },
    },
    {
      name: 'completionDate',
      label: 'Data de Conclusão',
      type: 'date',
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Data em que a solicitação foi marcada como concluída.',
        date: {
          pickerAppearance: 'dayAndTime',
          displayFormat: 'dd/MM/yyyy HH:mm',
        },
      },
    },
    {
      name: 'status',
      label: 'Status da Prescrição',
      type: 'select',
      required: true,
      options: [
        { label: 'Pedido feito', value: 'created' },
        { label: 'Em andamento', value: 'in_progress' },
        { label: 'Caso finalizado', value: 'completed' },
      ],
      defaultValue: 'created',
      admin: {
        position: 'sidebar',
        description:
          'Este é o status atual do tratamento. Este campo pode ser alterado a qualquer momento.',
      },
    },
    {
      name: 'payment',
      label: 'Detalhes do Pagamento',
      type: 'group',
      admin: {
        position: 'sidebar',
      },
      fields: [
        {
          name: 'status',
          label: 'Status do Pagamento',
          type: 'select',
          required: true,
          options: [
            { label: 'Não Pago', value: 'not_paid' },
            { label: 'Pagamento Realizado', value: 'paid' },
          ],
          defaultValue: 'not_paid',
        },
        {
          name: 'pixUrl',
          label: 'Link do Pagamento via Pix',
          type: 'textarea',
          //@ts-ignore
          validate: validateUrl,
          admin: {
            description: 'Insira o link de pagamento via Pix.',
          },
        },
        {
          name: 'cardUrl',
          label: 'Link do Pagamento via Cartão de Crédito',
          type: 'textarea',
          //@ts-ignore
          validate: validateUrl,
          admin: {
            description: 'Insira o link de pagamento via Cartão de Crédito.',
          },
        },
      ],
    },
    {
      name: 'tracking',
      label: 'Envio',
      type: 'group',
      admin: {
        position: 'sidebar',
      },
      fields: [
        {
          name: 'status',
          label: 'Status do Envio',
          type: 'select',
          required: true,
          options: [
            { label: 'Não Enviado', value: 'not_sent' },
            { label: 'Em Preparação', value: 'preparing' },
            { label: 'Enviado', value: 'sent' },
            { label: 'Recebido', value: 'delivered' },
          ],
          defaultValue: 'not_sent',
        },
        {
          name: 'carrier',
          label: 'Transportadora',
          type: 'text',
          admin: {
            condition: (data, siblingData) =>
              siblingData.status === 'sent' || siblingData.status === 'delivered',
          },
        },
        {
          name: 'trackingCode',
          label: 'Código de Rastreio',
          type: 'text',
          admin: {
            description: 'Código de rastreio dos Correios ou transportadora.',
            condition: (data, siblingData) =>
              siblingData.status === 'sent' || siblingData.status === 'delivered',
          },
        },
        {
          name: 'trackingUrl',
          label: 'Link de Rastreio',
          type: 'textarea',
          //@ts-ignore
          validate: validateUrl,
          admin: {
            description: 'Link direto para a página de rastreio.',
            condition: (data, siblingData) =>
              siblingData.status === 'sent' || siblingData.status === 'delivered',
          },
        },
        {
          name: 'sentDate',
          label: 'Data do Envio',
          type: 'date',
          admin: {
            description: 'A data em que o pedido foi efetivamente enviado.',
            date: {
              pickerAppearance: 'dayOnly',
              displayFormat: 'dd/MM/yyyy',
            },
            condition: (data, siblingData) =>
              siblingData.status === 'sent' || siblingData.status === 'delivered',
          },
        },
        {
          name: 'estimatedArrival',
          label: 'Previsão de Chegada',
          type: 'date',
          admin: {
            description: 'A data estimada para a entrega do pedido.',
            date: {
              pickerAppearance: 'dayOnly',
              displayFormat: 'dd/MM/yyyy',
            },
            condition: (data, siblingData) =>
              siblingData.status === 'sent' || siblingData.status === 'delivered',
          },
        },
      ],
    },
  ],
}
