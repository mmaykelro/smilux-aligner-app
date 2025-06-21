// storage-adapter-import-placeholder
import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { pt } from '@payloadcms/translations/languages/pt'
import { resendAdapter } from '@payloadcms/email-resend'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Customers } from './collections/Customers'
import { Requests } from './collections/Requests'
import { Media } from './collections/Media'

import { TermsConditions } from './globals/TermsConditions'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      title: 'Painel Administrativo',
      titleSuffix: '- Smilux Aligner',
      icons: [
        {
          rel: 'icon',
          url: '/app/favicon.ico',
          type: 'image/x-icon',
        },
      ],
    },
    components: {
      graphics: {
        Logo: {
          path: '/components/payload/logo/index.tsx#Logo',
        },
        Icon: {
          path: '/components/payload/icon/index.tsx#Icon',
        },
      },
    },
  },
  i18n: {
    supportedLanguages: { pt },
  },
  collections: [Users, Customers, Requests, Media],
  globals: [TermsConditions],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: vercelPostgresAdapter({
    pool: {
      connectionString: process.env.POSTGRES_URL || '',
    },
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    vercelBlobStorage({
      enabled: true,
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
  email: resendAdapter({
    defaultFromAddress: process.env.ADMIN_RESEND_EMAIL || '',
    defaultFromName: process.env.ADMIN_EMAIL_NAME || '',
    apiKey: process.env.RESEND_API_KEY || '',
  }),
})
