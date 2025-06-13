import type { CollectionConfig } from 'payload'
import { ADMIN_USERS_GROUP } from '@/constants/payload'
import { BrazilianStates } from '@/constants/address'

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

  hooks: {},

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
      name: 'phone',
      type: 'text',
      required: true,
      label: 'Telefone',
      //@ts-ignore
      validate: (value) => {
        if (!value?.length) return 'Campo obrigatório'
        const phoneRegex = /^\([1-9]{2}\)\s?9?\d{4}-\d{4}$/
        return phoneRegex.test(value) || 'Telefone inválido. Use o formato (11) 91234-5678'
      },
      admin: {
        components: {
          Field: {
            path: '/components/payload/masked-phone-input/index.tsx#MaskedPhoneInput',
          },
        },
      },
    },

    {
      name: 'cro',
      type: 'group',
      label: 'CRO',
      fields: [
        {
          name: 'number',
          type: 'text',
          required: true,
          label: { pt: 'Número do CRO' },
        },
        {
          name: 'state',
          type: 'select',
          required: true,
          label: { pt: 'Estado do CRO' },
          options: BrazilianStates,
        },
      ],
    },

    {
      name: 'address',
      type: 'group',
      label: 'Endereço',
      fields: [
        {
          name: 'postalCode',
          type: 'text',
          required: true,
          label: { pt: 'CEP' },
          //@ts-ignore
          validate: (value) => {
            if (!value) return true
            const postalCodeRegex = /^\d{5}-\d{3}$/

            return postalCodeRegex.test(value) || 'Formato de CEP inválido. Use 12345-678.'
          },
          admin: {
            width: '30%',
          },
        },
        {
          name: 'street',
          type: 'text',
          required: true,
          label: { pt: 'Rua' },
          admin: { width: '70%' },
        },
        {
          name: 'number',
          type: 'text',
          required: true,
          label: { pt: 'Número' },
          admin: { width: '30%' },
        },
        {
          name: 'complement',
          type: 'text',
          label: { pt: 'Complemento' },
          admin: { width: '70%' },
        },
        {
          name: 'neighborhood',
          type: 'text',
          required: true,
          label: { pt: 'Bairro' },
        },
        {
          name: 'city',
          type: 'text',
          required: true,
          label: { pt: 'Cidade' },
        },
        {
          name: 'state',
          type: 'select',
          required: true,
          label: { pt: 'Estado' },
          options: BrazilianStates,
        },
      ],
    },

    {
      name: 'clinicalPreferences',
      label: { pt: 'Preferências Clínicas' },
      type: 'group',
      admin: {
        description: 'Preferências clínicas globais aplicadas aos tratamentos do cliente.',
      },
      fields: [
        {
          name: 'passiveAligners',
          label: { pt: 'Alinhadores Passivos' },
          type: 'radio',
          options: [
            {
              label: 'Sim, adicione alinhadores passivos para combinar com arco com mais etapas',
              value: 'sim_adicione',
            },
            {
              label: 'Não, mas crie um número igual de alinhadores ativos em ambos os arcos',
              value: 'nao_mas_crie',
            },
            {
              label: 'Nenhuma das opções acima',
              value: 'nenhuma',
            },
          ],
        },
        {
          name: 'delayIPRStage',
          label: { pt: 'Atrasar o estágio para iniciar o IPR' },
          type: 'select',
          options: [
            { label: 'Não atrase', value: 'nao_atrase' },
            { label: 'Atrase para o estágio 1', value: 'estagio_1' },
            { label: 'Atrase para o estágio 2', value: 'estagio_2' },
            { label: 'Atrase para o estágio 3', value: 'estagio_3' },
            { label: 'Atrase para o estágio 4', value: 'estagio_4' },
            { label: 'Atrase para o estágio 5', value: 'estagio_5' },
          ],
        },
        {
          name: 'maxIPR',
          label: { pt: 'Máximo de IPR' },
          type: 'text',
          admin: {
            description: 'Especifique o valor máximo de IPR permitido (ex: 0.5mm)',
          },
        },
        {
          name: 'delayAttachmentStage',
          label: { pt: 'Atrasar a colocação do attachment' },
          type: 'select',
          options: [
            { label: 'Não atrase', value: 'nao_atrase' },
            { label: 'Atrase para o estágio 1', value: 'estagio_1' },
            { label: 'Atrase para o estágio 2', value: 'estagio_2' },
            { label: 'Atrase para o estágio 3', value: 'estagio_3' },
            { label: 'Atrase para o estágio 4', value: 'estagio_4' },
            { label: 'Atrase para o estágio 5', value: 'estagio_5' },
          ],
        },
        {
          name: 'incisalLeveling',
          label: { pt: 'Nivelamento dos incisivos superiores' },
          type: 'radio',
          options: [
            {
              label: 'Nivelar borda incisal',
              value: 'nivelar_borda',
            },
            {
              label: 'Nivelar borda incisal - Nivelar laterais com centrais',
              value: 'nivelar_laterais_centrais',
            },
            {
              label: 'Nivelar borda incisal - Laterais 0,5mm mais curtos que centrais',
              value: 'laterais_05mm',
            },
            {
              label: 'Nivelar margem gengival',
              value: 'margem_gengival',
            },
          ],
        },
        {
          name: 'elasticChain',
          label: { pt: 'Aplicar cadeia elástica virtual para fechamento de espaços' },
          type: 'radio',
          options: [
            { label: 'Não', value: 'nao' },
            { label: 'Sim, 3-3', value: 'sim_3_3' },
            { label: 'Sim, 6-6', value: 'sim_6_6' },
          ],
        },
        {
          name: 'distalizationOptions',
          label: { pt: 'Opções de distalização sequencial' },
          type: 'radio',
          options: [
            {
              label: 'Distalização sequencial 50%',
              value: 'sequencial_50',
            },
            {
              label: 'Distalização 2 by 2',
              value: '2by2',
            },
          ],
        },
        {
          name: 'elasticPositions',
          label: { pt: 'Preferência de posição de elástico' },
          type: 'select',
          hasMany: true,
          options: [
            '18',
            '17',
            '16',
            '15',
            '14',
            '13',
            '12',
            '11',
            '21',
            '22',
            '23',
            '24',
            '25',
            '26',
            '27',
            '28',
            '48',
            '47',
            '46',
            '45',
            '44',
            '43',
            '42',
            '41',
            '31',
            '32',
            '33',
            '34',
            '35',
            '36',
            '37',
            '38',
          ],
        },
        {
          name: 'specialInstructions',
          label: { pt: 'Instruções Especiais' },
          type: 'textarea',
        },
      ],
    },

    {
      name: 'isActive',
      type: 'checkbox',
      label: {
        pt: 'Cliente ativo',
      },
      defaultValue: false,
      admin: {
        description: 'Marque esta opção para definir se o cliente está ativo ou inativo.',
      },
      saveToJWT: true,
    },
    {
      name: 'isRegisterComplete',
      label: 'Cadastro Completo',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        hidden: true,
      },
      saveToJWT: true,
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
