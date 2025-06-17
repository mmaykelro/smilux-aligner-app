import React from 'react'
import PageHeader from '@/constants/page-header'
import RequestForm from '@/sections/requests/request-form'

const NovaSolicitacaoPage: React.FC = () => {
  return (
    <>
      <PageHeader
        goBackLink="/solicitacoes"
        title="Nova solicitação"
        description="Formulário de prescrição para tratamento com alinhadores"
      />

      <RequestForm />
    </>
  )
}

export default NovaSolicitacaoPage
