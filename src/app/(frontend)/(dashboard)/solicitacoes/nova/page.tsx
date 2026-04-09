import React from 'react'
import PageHeader from '@/components/page-header'
import RequestForm from '@/sections/requests/request-form'
import { getCustomerAction } from '@/actions/customer'
import { getPrePaymentRequestAction } from '@/actions/pre-requests'
import { redirect } from 'next/navigation'

const NovaSolicitacaoPage: React.FC = async () => {
  const requestPrePayment = await getPrePaymentRequestAction()
  const user = await getCustomerAction()

  if (
    //@ts-ignore
    user.prePaymentEnabled
  ) {
    if (
      !requestPrePayment ||
      requestPrePayment?.status !== 'paid' ||
      !!requestPrePayment?.request
    ) {
      redirect('/')
    }
  }

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
