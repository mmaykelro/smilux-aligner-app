import PageHeader from '@/components/page-header'
import PaymentOrderForm from '@/components/payment-order-form'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import AdditionalAlignerOrderStatusStepper from '@/sections/additional-aligners/additional-aligner-order-status-stepper'
import { getAdditionalAlignerAction } from '@/actions/additional-aligners'

type PageProps = Promise<{
  id: string
}>

export default async function AlinhadorAdicionalPage({ params }: { params: PageProps }) {
  const { id } = await params

  const additionalAligner = await getAdditionalAlignerAction(id)

  const mapType = {
    upper: 'Superior',
    lower: 'Inferior',
  }

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
        goBackLink="/alinhadores-adicionais"
        title="Alinhador Adidional"
        description={`Paciente: ${additionalAligner?.patient}`}
      />

      <div className="flex-1 space-y-4  p-4 lg:py-6 lg:px-20">
        {additionalAligner.status !== 'created' &&
          additionalAligner.payment.status === 'not_paid' && (
            <PaymentOrderForm
              title="Realize o seu pagamento"
              cardUrl={additionalAligner.payment.cardUrl || ''}
              pixUrl={additionalAligner.payment?.pixUrl || ''}
            />
          )}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Informações do Alinhador Adicional</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base">
              <div>
                <span className="font-medium">Paciente:</span>
                <span className="ml-2">{additionalAligner?.patient}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base">
              <div>
                <span className="font-medium">Tipo de arcada:</span>
                <span className="ml-2">{mapType[additionalAligner?.alignerType]}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base">
              <div>
                <span className="font-medium">Número do alinhador:</span>
                <span className="ml-2">{additionalAligner?.alignerNumber}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base">
              <div>
                <span className="font-medium">Status do pedido:</span>
                <Badge variant="secondary" className={statusColors[additionalAligner?.status]}>
                  {statusLabels[additionalAligner?.status]}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* <div className="bg-gray-50 rounded-lg p-4">
         
        </div> */}

        {additionalAligner.status === 'completed' &&
          additionalAligner.payment.status === 'paid' && (
            <AdditionalAlignerOrderStatusStepper
              currentStatus={additionalAligner.tracking.status}
              orderId={additionalAligner?.orderId}
              createdAt={additionalAligner?.createdAt}
              completionDate={additionalAligner?.completionDate}
              trackingCode={additionalAligner?.tracking?.trackingCode}
              trackingUrl={additionalAligner?.tracking?.trackingUrl}
              carrier={additionalAligner?.tracking?.carrier}
              sentDate={additionalAligner?.tracking?.sentDate}
              estimatedArrival={additionalAligner?.tracking?.estimatedArrival}
            />
          )}
      </div>
    </>
  )
}
