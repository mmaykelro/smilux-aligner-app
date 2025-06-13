import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import RequestCard from '@/components/request-card'
import { getCustomerAction } from '@/actions/customer'

export default async function HomePage() {
  const user = await getCustomerAction()

  return (
    <div className="flex-1 space-y-4">
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
        <RequestCard title="Verificando documentação" icon="documents-loading" />
        <RequestCard title="Em andamento" icon="loading" />
        <RequestCard title="Casos finalizados" icon="ok" />
      </div>
    </div>
  )
}
