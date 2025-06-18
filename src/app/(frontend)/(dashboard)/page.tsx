import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import RequestCard from '@/components/request-card'
import { getCustomerAction } from '@/actions/customer'
import { getRequestsStatusAction } from '@/actions/requests'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  const user = await getCustomerAction()
  const requests = await getRequestsStatusAction()

  if (!user?.isActive) redirect('/login')

  return (
    <div className="flex-1 space-y-4  p-4 lg:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-muted-foreground">
            Bem-vindo de volta, Dr. {user?.name}! Aqui está um resumo das suas atividades.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild className="w-full sm:w-auto">
            <Link href="/solicitacoes/nova">
              <Plus className="mr-2 h-4 w-4" />
              Nova Solicitação
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <RequestCard
          title="Verificando documentação"
          icon="documents-loading"
          amount={requests?.documentation_check}
        />
        <RequestCard title="Em andamento" icon="loading" amount={requests?.in_progress} />
        <RequestCard title="Casos finalizados" icon="ok" amount={requests?.completed} />
      </div>
    </div>
  )
}
