import PageHeader from '@/components/page-header'
import AdditionalAlignersForm from '@/sections/additional-aligners/additional-alligner-form'

export default function NovoAlinhadorAdicionalPage() {
  return (
    <>
      <PageHeader
        goBackLink="/alinhadores-adicionais"
        title="Novo alinhador adicional"
        description="Formulário de solicitação de alinhadores adicionais para um tratamento já existente"
      />

      <AdditionalAlignersForm />
    </>
  )
}
