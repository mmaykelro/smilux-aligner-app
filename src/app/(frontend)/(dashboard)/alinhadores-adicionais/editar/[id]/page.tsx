import PageHeader from '@/components/page-header'
import AdditionalAlignersForm from '@/sections/additional-aligners/additional-alligner-form'
import { getAdditionalAlignerAction } from '@/actions/additional-aligners'

type PageProps = Promise<{
  id: string
}>

export default async function EditarAlinhadorAdicionalPage({ params }: { params: PageProps }) {
  const { id } = await params

  const additionalAligner = await getAdditionalAlignerAction(id)

  return (
    <>
      <PageHeader
        goBackLink="/alinhadores-adicionais"
        title="Editar solicitação de alinhador adicional"
        description="Formulário de solicitação de alinhadores adicionais para um tratamento já existente"
      />

      <AdditionalAlignersForm additionalAligner={additionalAligner} />
    </>
  )
}
