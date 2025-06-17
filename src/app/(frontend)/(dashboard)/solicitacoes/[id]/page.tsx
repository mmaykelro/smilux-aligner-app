import { getRequestAction } from '@/actions/requests'
import PageHeader from '@/constants/page-header'
import RequestPreview from '@/sections/requests/request-preview'

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
