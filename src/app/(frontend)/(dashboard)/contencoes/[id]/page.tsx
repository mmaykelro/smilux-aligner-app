import PageHeader from '@/components/page-header'
import PaymentOrderForm from '@/components/payment-order-form'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ContainmentOrderStatusStepper from '@/sections/containments/containments-order-status-stepper'
import { getContainmentAction } from '@/actions/containments'

type PageProps = Promise<{
  id: string
}>

export default async function ContainmentPage({ params }: { params: PageProps }) {
  const { id } = await params

  const containment = await getContainmentAction(id)

  const statusLabels: Record<string, string> = {
    created: 'Pedido Feito',
    in_progress: 'Em Andamento',
    completed: 'Finalizadas',
  }

  const statusColors: Record<string, string> = {
    created: 'bg-blue-50 text-blue-600',
    in_progress: 'bg-yellow-50 text-yellow-600',
    completed: 'bg-green-50 text-green-600',
  }

  return (
    <>
      <PageHeader
        goBackLink="/contencoes"
        title="Pedido de Contenção"
        description={`Paciente: ${containment?.patient}`}
      />

      <div className="flex-1 space-y-4  p-4 lg:py-6 lg:px-20">
        {containment.status !== 'created' && containment.payment.status === 'not_paid' && (
          <PaymentOrderForm
            title="Realize o seu pagamento"
            cardUrl={containment.payment.cardUrl || ''}
            pixUrl={containment.payment?.pixUrl || ''}
          />
        )}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Informações do Pedido de Contenção</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base">
              <div>
                <span className="font-medium">Paciente:</span>
                <span className="ml-2">{containment?.patient}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base">
              <div>
                <span className="font-medium">Status do pedido:</span>
                <Badge variant="secondary" className={statusColors[containment?.status]}>
                  {statusLabels[containment?.status]}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {containment.status === 'completed' && containment.payment.status === 'paid' && (
          <ContainmentOrderStatusStepper
            currentStatus={containment.tracking.status}
            orderId={containment?.orderId}
            createdAt={containment?.createdAt}
            completionDate={containment?.completionDate}
            trackingCode={containment?.tracking?.trackingCode}
            trackingUrl={containment?.tracking?.trackingUrl}
            carrier={containment?.tracking?.carrier}
            sentDate={containment?.tracking?.sentDate}
            estimatedArrival={containment?.tracking?.estimatedArrival}
          />
        )}
      </div>
    </>
  )
}
