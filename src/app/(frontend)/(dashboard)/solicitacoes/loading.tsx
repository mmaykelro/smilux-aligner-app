import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import RequestsTableFilters from '@/sections/requests/requests-table-filters'
import RequestTableLoading from '@/sections/requests/request-table-loading'
import { Plus } from 'lucide-react'
import PageHeader from '@/constants/page-header'
import { getRequestsStatusAction } from '@/actions/requests'

async function SolicitacoesLoadingPage() {
  const requestsStatus = await getRequestsStatusAction()

  return (
    <>
      <PageHeader
        goBackLink="/"
        title="Solicitações"
        description="Gerencie suas prescrições de tratamento"
        action={
          <Link href="/solicitacoes/nova">
            <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-fit">
              <Plus className="h-4 w-4 mr-2" />
              Nova Solicitação
            </Button>
          </Link>
        }
      />

      <div className="flex gap-4 flex-col p-4 lg:p-6">
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

        <RequestTableLoading />
      </div>
    </>
  )
}

export default SolicitacoesLoadingPage
