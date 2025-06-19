'use client'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import Pagination from '@/components/pagination'
import { Eye, Edit } from 'lucide-react'
import { formatDate } from '@/utils/date'

type Request = {
  publicId: string
  patient: string
  status: string
  createdAt: string
}

type RequestTableProps = {
  totalPages: number
  requests: Request[]
}

const RequestTable: React.FC<RequestTableProps> = ({ totalPages, requests }) => {
  const [sortField, setSortField] = useState<keyof Request>('createdAt')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const searchParams = useSearchParams()

  const pagina = searchParams.get('pagina') || '1'
  const limite = searchParams.get('limite') || '5'

  const handleSort = (field: keyof Request) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const filteredAndSortedRequests = requests?.sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]

    if (sortDirection === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
    }
  })

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      documentation_check: 'Verificando documentação',
      in_progress: 'Em Andamento',
      completed: 'Finalizadas',
    }
    return statusMap[status] || status
  }

  const getStatusVariant = (status: string) => {
    const variantMap: Record<string, string> = {
      documentation_check: 'bg-blue-50 text-blue-600',
      in_progress: 'bg-yellow-50 text-yellow-600',
      completed: 'bg-green-50 text-green-600',
    }
    return variantMap[status] || ''
  }

  return (
    <div className="w-[calc(100vw-30px)]">
      <div className="rounded-md border overflow-x-scroll">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('patient')}
              >
                Paciente {sortField === 'patient' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableHead>

              <TableHead>Status</TableHead>
              <TableHead
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('createdAt')}
              >
                Data de Criação {sortField === 'createdAt' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableHead>

              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!filteredAndSortedRequests?.length ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                  Nenhuma solicitação encontrada
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedRequests.map((item) => (
                <TableRow key={item.publicId}>
                  <TableCell>{item.patient}</TableCell>
                  <TableCell>
                    <Badge className={getStatusVariant(item.status)}>
                      {getStatusLabel(item.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(item.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end space-x-2">
                      <Tooltip>
                        <TooltipTrigger>
                          <Link href={`/solicitacoes/${item.publicId}`}>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Visualizar solicitação</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger>
                          <Link href={`/solicitacoes/editar/${item.publicId}`}>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Editar solicitação</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <Pagination
          data={filteredAndSortedRequests}
          title="solicitações"
          page={+pagina}
          limit={+limite}
          totalPages={totalPages}
        />
      </div>
    </div>
  )
}

export default RequestTable
