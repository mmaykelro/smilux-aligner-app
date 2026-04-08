'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQueries, useMutation } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  getPrePaymentRequestAction,
  getPrePaymentRequestSettingsAction,
  createPrePaymentRequestAction,
} from '@/actions/pre-requests'
import PreRequestPaymentModal from '@/sections/pre-requests/pre-request-payment-modal'

type Props = {
  prePaymentEnabled?: boolean
}

export default function NewRequestButton({ prePaymentEnabled }: Props) {
  const [isOpenPaymentModal, setIsOpenPaymentModal] = useState(false)

  const [
    { data: requestPrePayment, isLoading: isLoadingRequestPrePayment },
    { data: requestPrePaymentSettings, isLoading: isLoadingRequestPrePaymentSettings },
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

  function handleNewRequest() {
    if (prePaymentEnabled) {
      if (
        !requestPrePayment ||
        requestPrePayment?.status !== 'paid' ||
        !!requestPrePayment?.request
      ) {
        mutateCreatePrePaymentRequest()
        return
      }
    }

    push('/solicitacoes/nova')
  }

  return (
    <>
      <Button
        disabled={
          isLoadingRequestPrePayment ||
          isLoadingRequestPrePaymentSettings ||
          isPendingCreatePrePaymentRequest
        }
        onClick={handleNewRequest}
        className="w-full sm:w-auto"
      >
        <Plus className="mr-2 h-4 w-4" />
        Nova Solicitação
      </Button>

      <PreRequestPaymentModal
        open={isOpenPaymentModal}
        onOpenChange={setIsOpenPaymentModal}
        settings={requestPrePaymentSettings}
      />
    </>
  )
}
