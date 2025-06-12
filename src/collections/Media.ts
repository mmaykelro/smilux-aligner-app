import type { CollectionConfig } from 'payload'
import { ADMIN_MEDIA_GROUP } from '@/constants/payload'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    ...ADMIN_MEDIA_GROUP,
    description: 'Gerencie os arquivos de mídia do site',
  },
  labels: {
    singular: {
      pt: 'Arquivo',
    },
    plural: {
      pt: 'Arquivos',
    },
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: true,
}
