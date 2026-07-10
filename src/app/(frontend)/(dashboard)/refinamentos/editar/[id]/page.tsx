import { getRefinementAction } from '@/actions/refinements'
import PageHeader from '@/components/page-header'
import RefinementForm from '@/sections/refinements/refinement-form'

type PageProps = Promise<{
  id: string
}>

export default async function EditarRefinamentoPage({ params }: { params: PageProps }) {
  const { id } = await params

  const refinement = await getRefinementAction(id)

  return (
    <>
      <PageHeader
        goBackLink="/refinamentos"
        title="Editar refinamento"
        description="Formulário de prescrição para refinamento de tratamento finalizado"
      />

      <RefinementForm refinement={refinement as any} />
    </>
  )
}
