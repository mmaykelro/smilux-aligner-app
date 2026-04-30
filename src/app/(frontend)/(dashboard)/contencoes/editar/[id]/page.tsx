import PageHeader from '@/components/page-header'
import ContainmentForm from '@/sections/containments/containment-form'
import { getContainmentAction } from '@/actions/containments'

type PageProps = Promise<{
  id: string
}>

export default async function EditarAlinhadorAdicionalPage({ params }: { params: PageProps }) {
  const { id } = await params

  const containment = await getContainmentAction(id)

  return (
    <>
      <PageHeader
        goBackLink="/contencoes"
        title="Editar solicitação de contenção"
        description="Formulário de solicitação de contenção"
      />

      <ContainmentForm containment={containment} />
    </>
  )
}
