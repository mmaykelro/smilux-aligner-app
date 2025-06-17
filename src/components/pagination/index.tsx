'use client'
import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface PaginationProps {
  data?: any[]
  title: string
  page: number
  limit: number
  totalPages: number
}

const Pagination: React.FC<PaginationProps> = ({ data = [], title, page, limit, totalPages }) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const onChangeParam = (e: any) => {
    const { name, value } = e.target
    const params = new URLSearchParams(searchParams.toString())
    params.set(name, value.toString())
    router.push(`?${params.toString()}`)
  }

  const goToPreviousPage = () => {
    if (+page > 1) {
      onChangeParam({ target: { name: 'pagina', value: +page - 1 } })
    }
  }

  const goToNextPage = () => {
    if (+page < totalPages) {
      onChangeParam({ target: { name: 'pagina', value: +page + 1 } })
    }
  }

  if (!data?.length) return null

  return (
    <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 p-2">
      <div className="text-sm text-gray-400">
        Mostrando {data.length > 0 ? (+page - 1) * +limit + 1 : 0} a{' '}
        {Math.min(+page * +limit, data?.length)} de {data?.length} {title}
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={goToPreviousPage}
          disabled={+page === 1}
          className={`px-2 py-1 rounded-md text-sm font-medium transition-colors ${
            +page === 1
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-500'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Anterior
        </button>

        <div className="flex space-x-1">
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            let pageNum
            if (totalPages <= 5) {
              pageNum = i + 1
            } else {
              if (+page <= 3) {
                pageNum = i + 1
              } else if (+page >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = +page - 2 + i
              }
            }

            return (
              <button
                key={pageNum}
                onClick={() => onChangeParam({ target: { name: 'pagina', value: pageNum } })}
                className={`w-6 h-6 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${
                  +page === pageNum
                    ? 'bg-gray-300 text-gray-900 dark:bg-gray-700 dark:text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {pageNum}
              </button>
            )
          })}
        </div>

        <button
          onClick={goToNextPage}
          disabled={+page === totalPages}
          className={`px-2 py-1 rounded-md text-sm font-medium transition-colors ${
            +page === totalPages
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-500'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Próxima
        </button>
      </div>
    </div>
  )
}

export default Pagination
