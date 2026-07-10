'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQueries, useMutation } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  getPrePaymentRequestAction,
  getPrePaymentRequestSettingsAction,
  createPrePaymentRequestAction,
} from '@/actions/pre-requests'
import { getEligibleRequestsForRefinementAction } from '@/actions/refinements'
import PreRequestPaymentModal from '@/sections/pre-requests/pre-request-payment-modal'

type Props = {
  prePaymentEnabled?: boolean
}

export default function NewRefinementButton({ prePaymentEnabled }: Props) {
  const [isOpenPaymentModal, setIsOpenPaymentModal] = useState(false)

  const [
    { data: requestPrePayment, isLoading: isLoadingRequestPrePayment },
    { data: requestPrePaymentSettings, isLoading: isLoadingRequestPrePaymentSettings },
    { data: eligibleRequests, isLoading: isLoadingEligibleRequests },
  ] = useQueries({
    queries: [
      {
        queryKey: ['request-pre-payment'],
        queryFn: getPrePaymentRequestAction,
      },
      {
        queryKey: ['request-pre-payment-settings'],
        queryFn: getPrePaymentRequestSettingsAction,
      },
      {
        queryKey: ['eligible-requests-for-refinement'],
        queryFn: getEligibleRequestsForRefinementAction,
        initialData: [],
      },
    ],
  })

  const {
    mutateAsync: mutateCreatePrePaymentRequest,
    isPending: isPendingCreatePrePaymentRequest,
  } = useMutation({
    mutationFn: createPrePaymentRequestAction,
    onSuccess() {
      setIsOpenPaymentModal(true)
    },
  })

  const { push } = useRouter()

  const hasEligibleRequests = !!eligibleRequests?.length

  function handleNewRefinement() {
    if (!hasEligibleRequests) {
      return
    }

    if (prePaymentEnabled) {
      if (
        !requestPrePayment ||
        requestPrePayment?.status !== 'paid' ||
        !!requestPrePayment?.request ||
        !!requestPrePayment?.refinement
      ) {
        mutateCreatePrePaymentRequest()
        return
      }
    }

    push('/refinamentos/novo')
  }

  const isLoading =
    isLoadingRequestPrePayment ||
    isLoadingRequestPrePaymentSettings ||
    isLoadingEligibleRequests ||
    isPendingCreatePrePaymentRequest

  const button = (
    <Button
      disabled={isLoading || !hasEligibleRequests}
      onClick={handleNewRefinement}
      className="w-full sm:w-auto"
    >
      <Plus className="mr-2 h-4 w-4" />
      Novo Refinamento
    </Button>
  )

  return (
    <>
      {!isLoading && !hasEligibleRequests ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="w-full sm:w-auto">{button}</span>
          </TooltipTrigger>
          <TooltipContent>
            Nenhuma solicitação finalizada disponível para refinamento.
          </TooltipContent>
        </Tooltip>
      ) : (
        button
      )}

      <PreRequestPaymentModal
        open={isOpenPaymentModal}
        onOpenChange={setIsOpenPaymentModal}
        settings={requestPrePaymentSettings}
      />
    </>
  )
}
