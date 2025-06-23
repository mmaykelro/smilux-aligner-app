import type { GlobalConfig } from 'payload'
import { FixedToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import {
  YoutubeFeature,
  TextColorFeature,
  HighlightColorFeature,
  BgColorFeature,
} from 'payloadcms-lexical-ext'
import { relalidatePaths } from '@/utils/payload'
import { ADMIN_SITE_GROUP } from '@/constants/payload'

export const TermsConditions: GlobalConfig = {
  slug: 'terms-conditions',
  admin: {
    ...ADMIN_SITE_GROUP,
    description: 'Termo de prestação de serviços',
  },
  hooks: {
    afterChange: [
      async ({ req }) => {
        await relalidatePaths({
          req,
          paths: ['/login'],
        })
      },
    ],
  },
  label: 'Termo de prestação de serviços',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'showTerms',
      label: 'Exibir Termos de Serviço na página de cadastro do ususáro',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description:
          'Marque para exibir os termos de serviço na página de login ou em outros locais do site.',
      },
    },
    {
      name: 'content',
      label: {
        pt: 'Texto do termo de prestação de serviços',
      },
      type: 'richText',
      required: true,
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          YoutubeFeature(),
          TextColorFeature(),
          HighlightColorFeature(),
          BgColorFeature(),
          ...defaultFeatures,
          FixedToolbarFeature(),
        ],
      }),
    },
  ],
}
