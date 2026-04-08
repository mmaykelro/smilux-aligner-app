import type { GlobalConfig } from 'payload'
import { ADMIN_REQUESTS_GROUP } from '@/constants/payload'

export const PrePaymentRequestsSettings: GlobalConfig = {
  slug: 'pre-payment-requests-settings',
  admin: {
    ...ADMIN_REQUESTS_GROUP,
    description: 'Configurações de pré-pagamento para as solicitações dos clientes',
  },
  label: {
    pt: 'Configuração do pré-pagamento das solititações',
  },

  access: {
    read: () => true,
    update: () => true,
  },

  fields: [
    {
      name: 'amount',
      type: 'number',
      required: true,
      label: 'Valor do pré-pagamento',
    },
    {
      name: 'pixQrCode',
      type: 'text',
      required: true,
      label: 'Link ou código do QR Code PIX',
      admin: {
        description: 'Pode ser uma URL do QR Code ou o código copia e cola do PIX.',
      },
    },
  ],
}
