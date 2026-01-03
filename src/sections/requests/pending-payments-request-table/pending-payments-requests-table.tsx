'use client'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import Pagination from '@/components/pagination'
import { DollarSign } from 'lucide-react'
import { formatDate } from '@/utils/date'
import RequestPaymentOrderForm from '@/sections/requests/request-payment-order-form'

type Request = {
  publicId: string
  patient: string
  status: string
  createdAt: string
  payment: {
    pixUrl?: string
    cardUrl?: string
    status?: string
  }
  tracking: {
    trackingCode?: string
    status?: string
  }
}

type Props = {
  totalPages: number
  requests: Request[]
}

export default function PendingPaymentsRequestsTable({ requests, totalPages }: Props) {
  const [sortField, setSortField] = useState<keyof Request>('createdAt')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [payment, setPayment] = useState<Request['payment'] | null>()

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

  function handleOpenPaymentModal(isOpen: boolean, payment: Request['payment']) {
    setIsPaymentModalOpen(isOpen)
    setPayment(payment)
  }

  function handleClosePaymentModal() {
    setIsPaymentModalOpen(false)
    setPayment(null)
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

  return (
    <div className="sm:w-full w-[calc(100vw-30px)]">
      <div className="rounded-md border sm:overflow-auto overflow-x-scroll">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('patient')}
              >
                Paciente {sortField === 'patient' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableHead>

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
                  Nenhum pagamento pendente encontrado
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedRequests.map((item) => (
                <TableRow key={item.publicId}>
                  <TableCell>{item.patient}</TableCell>

                  <TableCell>{formatDate(item.createdAt)}</TableCell>
                  <TableCell className="flex justify-end">
                    {item?.status === 'completed' &&
                      (!!item?.payment?.pixUrl?.length || !!item?.payment?.cardUrl?.length) &&
                      item.payment?.status === 'not_paid' && (
                        <Dialog
                          open={isPaymentModalOpen}
                          onOpenChange={(isOpen) => {
                            handleOpenPaymentModal(isOpen, item?.payment)
                          }}
                        >
                          <DialogTrigger>
                            <Button variant="success" className="flex items-center">
                              <DollarSign className="h-4 w-4 mr-2" />
                              Realizar pagamento
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Efetuar pagamento</DialogTitle>
                              <DialogDescription>
                                Escolha o melhor método abaixo para realizar o pagamento
                              </DialogDescription>
                            </DialogHeader>

                            <RequestPaymentOrderForm
                              pixUrl={payment?.pixUrl || ''}
                              cardUrl={payment?.cardUrl || ''}
                              onClose={handleClosePaymentModal}
                            />
                          </DialogContent>
                        </Dialog>
                      )}
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
