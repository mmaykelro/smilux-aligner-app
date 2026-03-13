import Link from 'next/link'
import { Button } from '@/components/ui/button'
import AdditionalAlignersTableFilters from '@/sections/additional-aligners/additional-aligners-table-filters'
import AdditionalAlignersTable from '@/sections/additional-aligners/additional-aligners-table'
import { Plus } from 'lucide-react'
import PageHeader from '@/components/page-header'
import {
  getAdditionalAlignersAction,
  getAdditionalAlignersActionStatusAction,
} from '@/actions/additional-aligners'

type SearchParams = Promise<{ [key: string]: string }>

export default async function AlinhadoresAdicionaisPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const { pagina = 1, limite = 10, paciente, status, data_inicial, data_final } = await searchParams

  const mapStatus: Record<string, string> = {
    todos: '',
    pedido_criado: 'created',
    em_andamento: 'in_progress',
    finalizado: 'completed',
  }

  const additionalAligners = await getAdditionalAlignersAction({
    pagination: {
      limit: +limite,
      page: +pagina,
    },
    filters: {
      patient: paciente === 'todos' ? '' : paciente,
      status: mapStatus[status],
      from: data_inicial,
      to: data_final,
    },
  })

  const additionalAlignersStatus = await getAdditionalAlignersActionStatusAction()

  return (
    <>
      <PageHeader
        goBackLink="/"
        title="Alinhadores Adicionais"
        description="Gerencie seus alinhadores adicionais de cada paciente"
        action={
          <Link href="/alinhadores-adicionais/novo">
            <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-fit">
              <Plus className="h-4 w-4 mr-2" />
              Novo Alinhador
            </Button>
          </Link>
        }
      />

      <div className="flex gap-4 flex-col p-4 lg:py-6 lg:px-20">
        <div className=" grid grid-cols-1 md:grid-cols-4 gap-4 ">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {additionalAlignersStatus?.created}
            </div>
            <div className="text-sm text-blue-600">Pedidos feitos</div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {additionalAlignersStatus?.in_progress}
            </div>
            <div className="text-sm text-yellow-600">Em Andamento</div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {additionalAlignersStatus?.completed}
            </div>
            <div className="text-sm text-green-600">Finalizados</div>
          </div>
        </div>

        <AdditionalAlignersTableFilters />

        <AdditionalAlignersTable
          additionalAligners={additionalAligners?.docs as []}
          totalPages={additionalAligners?.totalPages}
        />
      </div>
    </>
  )
}
