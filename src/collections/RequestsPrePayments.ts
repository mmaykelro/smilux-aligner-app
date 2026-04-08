import type { CollectionConfig } from 'payload'
import { ADMIN_REQUESTS_GROUP } from '@/constants/payload'

export const RequestsPrePayments: CollectionConfig = {
  slug: 'requests-pre-payments',

  admin: {
    useAsTitle: 'id',
    ...ADMIN_REQUESTS_GROUP,
    description: 'Registros de pré-pagamento das solicitações.',
  },

  labels: {
    singular: {
      pt: 'Pré-pagamento da solicitação',
    },
    plural: {
      pt: 'Pré-pagamentos das solicitações',
    },
  },
  fields: [
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      required: true,
      label: 'Cliente',
    },
    {
      name: 'request',
      type: 'relationship',
      relationTo: 'requests',
      required: false,
      label: 'Solicitação',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'created',
      label: 'Status do pagamento',
      options: [
        {
          label: 'Criado',
          value: 'created',
        },
        {
          label: 'Pago',
          value: 'paid',
        },
      ],
    },
  ],
}
