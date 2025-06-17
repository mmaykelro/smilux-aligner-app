import { getRequestAction } from '@/actions/requests'
import PageHeader from '@/constants/page-header'
import RequestForm from '@/sections/requests/request-form'

type PageProps = Promise<{
  id: string
}>

export default async function EditarSolicitacaoPage({ params }: { params: PageProps }) {
  const { id } = await params

  const request = await getRequestAction(id)

  return (
    <>
      <PageHeader
        goBackLink="/solicitacoes"
        title="Editar solicitação"
        description="Formulário de prescrição para tratamento com alinhadores"
      />

      <RequestForm request={request as any} />
    </>
  )
}
