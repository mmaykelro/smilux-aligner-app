import NewRequestButton from '@/sections/requests/new-request-button'
import RequestsTableFilters from '@/sections/requests/requests-table-filters'
import RequestTable from '@/sections/requests/request-table'
import PageHeader from '@/components/page-header'
import { getRequestsAction, getRequestsStatusAction } from '@/actions/requests'
import { getCustomerAction } from '@/actions/customer'

type SearchParams = Promise<{ [key: string]: string }>

async function SolicitacoesPage({ searchParams }: { searchParams: SearchParams }) {
  const { pagina = 1, limite = 10, paciente, status, data_inicial, data_final } = await searchParams

  const user = await getCustomerAction()

  const mapStatus: Record<string, string> = {
    todos: '',
    verificando_documentacao: 'documentation_check',
    em_andamento: 'in_progress',
    finalizado: 'completed',
  }

  const requests = await getRequestsAction({
    pagination: {
      limit: +limite,
      page: +pagina,
    },
    filters: {
      patient: paciente,
      status: mapStatus[status],
      from: data_inicial,
      to: data_final,
    },
  })

  const requestsStatus = await getRequestsStatusAction()

  return (
    <>
      <PageHeader
        goBackLink="/"
        title="Solicitações"
        description="Gerencie suas prescrições de tratamento"
        action={
          <NewRequestButton
            prePaymentEnabled={
              //@ts-ignore
              user.prePaymentEnabled
            }
          />
        }
      />

      <div className="flex gap-4 flex-col p-4 lg:py-6 lg:px-20">
        <div className=" grid grid-cols-1 md:grid-cols-4 gap-4 ">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {requestsStatus?.documentation_check}
            </div>
            <div className="text-sm text-blue-600">Verificando documentação</div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{requestsStatus?.in_progress}</div>
            <div className="text-sm text-yellow-600">Em Andamento</div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{requestsStatus?.completed}</div>
            <div className="text-sm text-green-600">Finalizadas</div>
          </div>
        </div>

        <RequestsTableFilters />

        <RequestTable requests={requests.docs as []} totalPages={requests.totalPages} />
      </div>
    </>
  )
}

export default SolicitacoesPage
