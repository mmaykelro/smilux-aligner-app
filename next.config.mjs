import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '300mb',
    },
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
