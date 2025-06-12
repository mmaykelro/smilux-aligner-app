import type { CollectionConfig } from 'payload'
import { APIError } from 'payload'
import { ADMIN_USERS_GROUP } from '@/constants/payload'

export const Customers: CollectionConfig = {
  slug: 'customers',
  admin: {
    ...ADMIN_USERS_GROUP,
    useAsTitle: 'name',
    description: 'Clientes cadastrados na plataforma.',
  },
  labels: {
    singular: {
      pt: 'Cliente',
    },
    plural: {
      pt: 'Clientes',
    },
  },

  auth: true,

  hooks: {
    // beforeLogin: [
    //   async ({ user }) => {
    //     if (user.roles?.includes('CUSTOMER')) {
    //       throw new APIError(
    //         'Clientes não têm permissão para acessar o painel administrativo.',
    //         403,
    //       )
    //     }
    //   },
    // ],
  },

  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: {
        pt: 'Nome',
      },
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      saveToJWT: true,
      defaultValue: ['CUSTOMER'],
      access: {
        create: () => false,
        update: () => false,
      },
      admin: {
        hidden: true,
      },
      options: [
        {
          label: 'Cliente',
          value: 'CUSTOMER',
        },
      ],
    },
  ],
}
