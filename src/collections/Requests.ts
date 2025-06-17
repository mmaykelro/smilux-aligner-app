import type { CollectionConfig } from 'payload'
import { v4 as uuidv4 } from 'uuid'
import { ADMIN_REQUESTS_GROUP } from '@/constants/payload'
import { relalidatePaths } from '@/utils/payload'
import { validateUrl } from '@/utils/url'
import { statusOptions } from '@/constants/requests'

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
      async ({ data, req, operation }) => {
        if (operation === 'create') {
          data.publicId = uuidv4()
        }

        await relalidatePaths({
          req,
          paths: ['/', '/solicitaões'],
        })

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
            {
              name: 'sendWhatsappLink',
              label: 'Enviar link no whatsapp para visualização do planejamento virtual?',
              type: 'radio',
              required: true,
              options: [
                { label: 'Sim', value: 'yes' },
                { label: 'Não', value: 'no' },
              ],
            },
            {
              name: 'whatsappNumber',
              label: 'Qual o seu whatsapp com DDD?',
              type: 'text',
              //@ts-ignore
              validate: (value, { data }) => {
                if (data.sendWhatsappLink === 'yes' && !value) {
                  return 'Campo obrigatório'
                }
                return true
              },
              admin: {
                condition: (data) => data.sendWhatsappLink === 'yes',
              },
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
  ],
}
