import type { CollectionConfig } from 'payload'
import { v4 as uuidv4 } from 'uuid'
import { ADMIN_REQUESTS_GROUP } from '@/constants/payload'
import { relalidatePaths } from '@/utils/payload'
import { validateUrl } from '@/utils/url'
import { statusOptions } from '@/constants/requests'
import {
  statusUpdateEmailSubject,
  statusUpdateEmailHTML,
} from '@/utils/emails/templates/requestStatusUpdateEmail'

const upperTeeth = [
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '21',
  '22',
  '23',
  '24',
  '25',
  '26',
  '27',
]
const lowerTeeth = [
  '31',
  '32',
  '33',
  '34',
  '35',
  '36',
  '37',
  '38',
  '41',
  '42',
  '43',
  '44',
  '45',
  '46',
  '47',
]

export const Requests: CollectionConfig = {
  slug: 'requests',
  admin: {
    ...ADMIN_REQUESTS_GROUP,
    useAsTitle: 'titleForList',
    description: 'Formulários de prescrição para novos tratamentos com alinhadores.',
    defaultColumns: ['patient', 'customer', 'createdAt', 'updatedAt'],
  },
  labels: {
    singular: {
      pt: 'Solicitação',
    },
    plural: {
      pt: 'Solicitações',
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
            collection: 'requests',
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
          { label: 'Verificando documentação', value: 'documentation_check' },
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
          paths: ['/', '/solicitaões', `/solicitacoes/${doc.slug}`],
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
              collection: 'requests',
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

            const emailSubject = statusUpdateEmailSubject(populatedDoc)
            const emailHtml = statusUpdateEmailHTML(populatedDoc)

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
      name: 'generatePDF',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: {
          Field: {
            path: '/components/payload/generate-pdf-report-button/index.tsx#GeneratePdfReportButton',
          },
        },
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
      name: 'customer',
      label: 'Doutor(a)',
      type: 'relationship',
      relationTo: 'customers',
      required: true,
      hasMany: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'patient',
      type: 'text',
      required: true,
      label: 'Nome do(a) paciente',
    },
    {
      name: 'additionalInfo',
      type: 'textarea',
      label: 'Informações Adicionais',
      admin: {
        description:
          'Qualquer outra informação relevante para este caso que não se encaixa nos campos acima.',
      },
    },
    {
      name: 'documents',
      label: 'Documentos Anexados',
      type: 'array',
      minRows: 0,
      labels: {
        singular: 'Documento',
        plural: 'Documentos',
      },

      fields: [
        {
          name: 'documentName',
          type: 'text',
          label: 'Nome do Documento',
          required: true,
        },
        {
          name: 'documentFile',
          type: 'upload',
          relationTo: 'media',
          label: 'Arquivo do Documento',
          required: true,
        },
        {
          name: 'downloadAction',
          type: 'ui',
          admin: {
            components: {
              Field: {
                path: '/components/payload/download-file-button/index.tsx#DownloadButton',
              },
            },
          },
        },
      ],
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Definições do Tratamento',
          fields: [
            {
              name: 'archToTreat',
              label: 'Tratar arcada',
              type: 'radio',
              required: true,
              options: [
                { label: 'Nenhum', value: 'none' },
                { label: 'Ambos', value: 'both' },
                { label: 'Superior', value: 'upper' },
                { label: 'Inferior', value: 'lower' },
              ],
            },
            {
              name: 'upperJawMovementRestriction',
              label: 'Restrição de movimento ortodôntico SUPERIOR',
              type: 'select',
              hasMany: true,
              options: upperTeeth,
              admin: {
                description:
                  'Selecione algum dente que NÃO deseje movimentar na arcada SUPERIOR (implante, anquilose, prótese, etc).',
                condition: (data) => data.archToTreat === 'upper' || data.archToTreat === 'both',
              },
            },
            {
              name: 'lowerJawMovementRestriction',
              label: 'Restrição de movimento ortodôntico INFERIOR',
              type: 'select',
              hasMany: true,
              options: lowerTeeth,
              admin: {
                description:
                  'Selecione algum dente que NÃO deseje movimentar na arcada INFERIOR (implante, anquilose, prótese, etc).',
                condition: (data) => data.archToTreat === 'lower' || data.archToTreat === 'both',
              },
            },
          ],
        },
        {
          label: 'Relação A-P e Elásticos',
          fields: [
            {
              name: 'apRelationUpper',
              label: 'Relação ântero-posterior (A-P) - Arcada Superior',
              type: 'radio',
              options: [
                { label: 'Melhorar relação de canino', value: 'improve_canine' },
                { label: 'Melhorar relação de canino e molar', value: 'improve_canine_and_molar' },
                { label: 'Melhorar relação de molar', value: 'improve_molar' },
                { label: 'Nenhuma', value: 'none' },
              ],
              defaultValue: 'none',
              admin: {
                condition: (data) => data.archToTreat === 'upper' || data.archToTreat === 'both',
              },
            },
            {
              name: 'apRelationLower',
              label: 'Relação ântero-posterior (A-P) - Arcada Inferior',
              type: 'radio',
              options: [
                { label: 'Melhorar relação de canino', value: 'improve_canine' },
                { label: 'Melhorar relação de canino e molar', value: 'improve_canine_and_molar' },
                { label: 'Melhorar relação de molar', value: 'improve_molar' },
                { label: 'Nenhuma', value: 'none' },
              ],
              defaultValue: 'none',
              admin: {
                condition: (data) => data.archToTreat === 'lower' || data.archToTreat === 'both',
              },
            },
            {
              name: 'distalizationInstructions',
              label: 'Orientações específicas de distalização',
              type: 'textarea',
              admin: {
                description: 'Detalhes sobre a distalização "2 by 2" ou em bloco de no máximo 2mm.',
              },
            },
            {
              name: 'elasticCutouts',
              label: 'Recortes para elástico ou colagem de botões',
              type: 'group',
              fields: [
                {
                  name: 'canineElastic',
                  label: 'CUT para ELÁSTICO no canino',
                  type: 'radio',
                  options: [
                    { label: 'Direito', value: 'right' },
                    { label: 'Esquerdo', value: 'left' },
                    { label: 'Ambos', value: 'both' },
                    { label: 'Nenhum', value: 'none' },
                  ],
                  defaultValue: 'none',
                },
                {
                  name: 'canineButton',
                  label: 'CUT para BOTÃO no canino',
                  type: 'radio',
                  options: [
                    { label: 'Direito', value: 'right' },
                    { label: 'Esquerdo', value: 'left' },
                    { label: 'Ambos', value: 'both' },
                    { label: 'Nenhum', value: 'none' },
                  ],
                  defaultValue: 'none',
                },
                {
                  name: 'molarElastic',
                  label: 'CUT para ELÁSTICO no molar',
                  type: 'radio',
                  options: [
                    { label: 'Direito', value: 'right' },
                    { label: 'Esquerdo', value: 'left' },
                    { label: 'Ambos', value: 'both' },
                    { label: 'Nenhum', value: 'none' },
                  ],
                  defaultValue: 'none',
                },
                {
                  name: 'molarButton',
                  label: 'CUT para BOTÃO no molar',
                  type: 'radio',
                  options: [
                    { label: 'Direito', value: 'right' },
                    { label: 'Esquerdo', value: 'left' },
                    { label: 'Ambos', value: 'both' },
                    { label: 'Nenhum', value: 'none' },
                  ],
                  defaultValue: 'none',
                },
              ],
            },
            {
              name: 'elasticCutoutInstructions',
              label: 'Orientações específicas dos recortes',
              type: 'textarea',
            },
          ],
        },
        {
          label: 'Attachments e IPR',
          fields: [
            {
              name: 'useAttachments',
              label: 'Attachments',
              type: 'radio',
              required: true,
              options: [
                { label: 'Sim. Conforme necessário.', value: 'yes' },
                { label: 'Não', value: 'no' },
              ],
            },
            {
              name: 'upperJawNoAttachments',
              label: 'NÃO colocar attachments nos seguintes dentes superiores',
              type: 'select',
              hasMany: true,
              options: upperTeeth,
              admin: {
                condition: (data) =>
                  data.useAttachments === 'yes' &&
                  (data.archToTreat === 'upper' || data.archToTreat === 'both'),
              },
            },
            {
              name: 'lowerJawNoAttachments',
              label: 'NÃO colocar attachments nos seguintes dentes inferiores',
              type: 'select',
              hasMany: true,
              options: lowerTeeth,
              admin: {
                condition: (data) =>
                  data.useAttachments === 'yes' &&
                  (data.archToTreat === 'lower' || data.archToTreat === 'both'),
              },
            },
            {
              name: 'performIPR',
              label: 'Fazer redução interproximal (IPR)?',
              type: 'radio',
              required: true,
              options: [
                { label: 'Sim. Conforme necessário (Limite de 0,5mm).', value: 'yes' },
                { label: 'Não', value: 'no' },
                { label: 'Detalhar IPR abaixo', value: 'detail_below' },
              ],
              admin: {
                description: 'Limite padrão de 0,5mm entre as faces.',
              },
            },
            {
              name: 'iprDetails',
              label: 'Detalhes do IPR',
              type: 'textarea',
              admin: {
                description:
                  'Caso deseje, detalhe a região exata de onde fazer (IPR). Por exemplo: fazer IPR de 0,3mm entre os dentes 44 e 45.',
                condition: (data) => data.performIPR === 'detail_below',
              },
            },
          ],
        },
        {
          label: 'Instruções Finais',
          fields: [
            {
              name: 'diastemaInstructions',
              label: 'Instruções para Diastemas',
              type: 'textarea',
              admin: {
                description:
                  'No caso de presença de DIASTEMAS não visualizados no escaneamento, por favor descrever exatamente a região a ser movimentada. Por exemplo: fechar diastema de 0,2mm entre os dentes 16 e 17.',
              },
            },
            {
              name: 'generalInstructions',
              label: 'Orientações gerais de tratamento',
              type: 'textarea',
            },
          ],
        },
      ],
    },

    {
      name: 'status',
      label: 'Status da Prescrição',
      type: 'select',
      required: true,
      options: statusOptions,
      defaultValue: 'documentation_check',
      admin: {
        position: 'sidebar',
        description:
          'Este é o status atual do tratamento. Este campo pode ser alterado a qualquer momento.',
      },
    },
    {
      name: 'trackingLink',
      label: 'Link de acompanhamento',
      type: 'textarea',
      //@ts-ignore
      validate: validateUrl,
      admin: {
        position: 'sidebar',
        description: 'Link externo para o planejamento virtual ou acompanhamento do caso.',
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
