import React from 'react'
import PageHeader from '@/components/page-header'
import RefinementForm from '@/sections/refinements/refinement-form'
import { getCustomerAction } from '@/actions/customer'
import { getPrePaymentRequestAction } from '@/actions/pre-requests'
import { getEligibleRequestsForRefinementAction } from '@/actions/refinements'
import { redirect } from 'next/navigation'

const NovoRefinamentoPage: React.FC = async () => {
  const requestPrePayment = await getPrePaymentRequestAction()
  const user = await getCustomerAction()

  if (
    //@ts-ignore
    user.prePaymentEnabled
  ) {
    if (
      !requestPrePayment ||
      requestPrePayment?.status !== 'paid' ||
      !!requestPrePayment?.request ||
      !!requestPrePayment?.refinement
    ) {
      redirect('/')
    }
  }

  const eligibleRequests = await getEligibleRequestsForRefinementAction()

  if (!eligibleRequests.length) {
    redirect('/refinamentos')
  }

  return (
    <>
      <PageHeader
        goBackLink="/refinamentos"
        title="Novo refinamento"
        description="Formulário de prescrição para refinamento de tratamento finalizado"
      />

      <RefinementForm eligibleRequests={eligibleRequests as any} />
    </>
  )
}

export default NovoRefinamentoPage
