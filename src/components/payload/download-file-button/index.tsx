'use client'
import React, { useState, useEffect } from 'react'
import { useField, Button } from '@payloadcms/ui'

export const DownloadButton: React.FC<{ path: string }> = ({ path }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [fileUrl, setFileUrl] = useState<any>(null)
  const [filename, setFilename] = useState<string | null>(null)

  const documentFileFieldPath = path.replace('downloadAction', 'documentFile')

  const { value: documentId } = useField<any>({ path: documentFileFieldPath })

  useEffect(() => {
    const fetchFileUrl = async () => {
      setIsLoading(true)
      const query = `where[id][equals]=${documentId}`

      const media = await fetch(`/api/media?${query}`).then(async (result) => result.json())

      const [data] = media?.docs

      const url = `${origin}/api/media/file/${data?.filename}`

      setFilename(data?.filename)

      setFileUrl(url)

      setIsLoading(false)
    }

    fetchFileUrl()
  }, [documentId])

  if (!documentId || !documentId) {
    return null
  }
  const origin = typeof window !== 'undefined' ? window.location.origin : ''

  const handleDownload = () => {
    setIsLoading(true)
    const link = document.createElement('a')
    link.href = fileUrl
    link.download = filename || 'downloaded-file'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setIsLoading(false)
  }

  return (
    <div style={{ marginTop: '24px' }}>
      <Button onClick={handleDownload} disabled={isLoading || !fileUrl}>
        {isLoading ? 'Preparando download...' : 'Baixar arquivo'}
      </Button>
    </div>
  )
}
