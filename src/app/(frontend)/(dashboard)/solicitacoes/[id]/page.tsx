import { getRequestAction } from '@/actions/requests'
import PageHeader from '@/constants/page-header'
import RequestPreview from '@/sections/requests/request-preview'
import RequestrPaymentOrderForm from '@/sections/requests/request-payment-order-form'
import RequestStatusStepper from '@/sections/requests/request-status-stepper'

type PageProps = Promise<{
  id: string
}>

export default async function SolicitacaoPage({ params }: { params: PageProps }) {
  const { id } = await params

  const request = await getRequestAction(id)

  return (
    <>
      <PageHeader
        goBackLink="/solicitacoes"
        title="Solicitação"
        description={`Paciente: ${request.patient}`}
      />

      <div className="flex-1 space-y-4  p-4 lg:p-6">
        {request.status === 'completed' && request.payment.status === 'not_paid' && (
          <RequestrPaymentOrderForm
            title="Realize o seu pagamento"
            cardUrl={request.payment.cardUrl || ''}
            pixUrl={request.payment?.pixUrl || ''}
          />
        )}

        {request.status === 'completed' && request.payment.status === 'paid' && (
          <RequestStatusStepper
            currentStatus={request.tracking.status}
            orderId={request?.orderId}
            createdAt={request?.createdAt}
            completionDate={request?.completionDate}
            trackingCode={request?.tracking?.trackingCode}
            trackingUrl={request?.tracking?.trackingUrl}
            carrier={request?.tracking?.carrier}
            sentDate={request?.tracking?.sentDate}
            estimatedArrival={request?.tracking?.estimatedArrival}
          />
        )}

        <RequestPreview
          trackingLink={request?.trackingLink || ''}
          patient={request.patient}
          requestId={request.publicId || ''}
          status={request.status}
        />
      </div>
    </>
  )
}
