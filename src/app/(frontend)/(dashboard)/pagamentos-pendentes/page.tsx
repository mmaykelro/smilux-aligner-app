import PageHeader from '@/components/page-header'
import PendingPaymentsRequestsTable from '@/sections/requests/pending-payments-request-table'
import { getRequestsAction } from '@/actions/requests'

type SearchParams = Promise<{ [key: string]: string }>

export default async function PagamentosPendentesPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const { pagina = 1, limite = 10, paciente, status, data_inicial, data_final } = await searchParams

  const requests = await getRequestsAction({
    pagination: {
      limit: +limite,
      page: +pagina,
    },
    filters: {
      status: 'completed',
      payment: {
        status: 'not_paid',
      },
    },
  })

  return (
    <>
      <PageHeader
        goBackLink="/"
        title="Pagamentos Pendentes"
        description="Gerencie seus pagamentos pendentes"
      />
      <div className="flex gap-4 flex-col p-4 lg:p-6">
        <PendingPaymentsRequestsTable
          requests={requests?.docs as []}
          totalPages={requests?.totalPages}
        />
      </div>
    </>
  )
}
