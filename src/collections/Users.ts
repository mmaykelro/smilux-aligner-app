import type { CollectionConfig } from 'payload'
import { ADMIN_USERS_GROUP } from '@/constants/payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    ...ADMIN_USERS_GROUP,
    description: 'Gerencie os usuários que poderão acessar o painel administrativo',
    useAsTitle: 'email',
  },
  labels: {
    singular: {
      pt: 'Usuário administrador',
    },
    plural: {
      pt: 'Usuários administradores',
    },
  },
  auth: true,

  hooks: {},

  access: {
    read: ({ req: { user } }) => {
      return !!user?.roles?.includes('ADMIN' as 'CUSTOMER')
    },
    create: ({ req: { user } }) => {
      return !!user?.roles?.includes('ADMIN' as 'CUSTOMER')
    },
    update: ({ req: { user } }) => {
      return !!user?.roles?.includes('ADMIN' as 'CUSTOMER')
    },
    delete: ({ req: { user } }) => {
      return !!user?.roles?.includes('ADMIN' as 'CUSTOMER')
    },
  },
  fields: [
    {
      name: 'roles',
      type: 'select',
      required: true,
      hasMany: true,
      saveToJWT: true,
      label: {
        pt: 'Funções',
      },
      options: [
        { label: 'Administrador', value: 'ADMIN' },
        { label: 'Cliente', value: 'CUSTOMER' },
      ],
      admin: {
        description: 'Selecione as funções do usuário',
      },
    },
  ],
}
