import PageHeader from '@/components/page-header'
import RefinementPreview from '@/sections/refinements/refinement-preview'
import PaymentOrderForm from '@/components/payment-order-form'
import RefinementOrderStatusStepper from '@/sections/refinements/refinement-order-status-stepper'
import { getRefinementAction } from '@/actions/refinements'

type PageProps = Promise<{
  id: string
}>

export default async function RefinamentoPage({ params }: { params: PageProps }) {
  const { id } = await params

  const refinement = await getRefinementAction(id)

  return (
    <>
      <PageHeader
        goBackLink="/refinamentos"
        title="Refinamento"
        description={`Paciente: ${refinement.patient}`}
      />

      <div className="flex-1 space-y-4  p-4 lg:py-6 lg:px-20">
        {refinement.status === 'completed' && refinement.payment.status === 'not_paid' && (
          <PaymentOrderForm
            title="Realize o seu pagamento"
            cardUrl={refinement.payment.cardUrl || ''}
            pixUrl={refinement.payment?.pixUrl || ''}
          />
        )}

        {refinement.status === 'completed' && refinement.payment.status === 'paid' && (
          <RefinementOrderStatusStepper
            currentStatus={refinement.tracking.status}
            orderId={refinement?.orderId}
            createdAt={refinement?.createdAt}
            completionDate={refinement?.completionDate}
            trackingCode={refinement?.tracking?.trackingCode}
            trackingUrl={refinement?.tracking?.trackingUrl}
            carrier={refinement?.tracking?.carrier}
            sentDate={refinement?.tracking?.sentDate}
            estimatedArrival={refinement?.tracking?.estimatedArrival}
          />
        )}

        <RefinementPreview
          trackingLink={refinement?.trackingLink || ''}
          patient={refinement.patient}
          refinementId={refinement.publicId || ''}
          status={refinement.status}
        />
      </div>
    </>
  )
}
