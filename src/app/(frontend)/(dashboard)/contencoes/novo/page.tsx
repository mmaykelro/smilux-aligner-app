import PageHeader from '@/components/page-header'
import ContainmentForm from '@/sections/containments/containment-form'

export default function NovoAlinhadorAdicionalPage() {
  return (
    <>
      <PageHeader
        goBackLink="/contencoes"
        title="Novo pedido de contenção"
        description="Formulário de solicitação de um novo pedido de contenção"
      />

      <ContainmentForm />
    </>
  )
}
