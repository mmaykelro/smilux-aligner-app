import Link from 'next/link'
import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Send } from 'lucide-react'

interface PageHeaderProps {
  goBackLink: string
  title: string
  description?: string
  action?: React.ReactNode
}

const PageHeader: React.FC<PageHeaderProps> = ({ goBackLink, title, description, action }) => (
  <div className="bg-white border-b py-2">
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="flex sm:items-center sm:justify-between sm:flex-row flex-col gap-2">
        <div className="flex items-center space-x-4 ">
          <Link href={goBackLink}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
            {!!description && <p className="text-sm text-gray-500">{description}</p>}
          </div>
        </div>
        {!!action && action}
      </div>
    </div>
  </div>
)

export default PageHeader
