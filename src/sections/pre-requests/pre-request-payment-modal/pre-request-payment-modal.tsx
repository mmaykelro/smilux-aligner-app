import { useState } from 'react'
import { PrePaymentRequestsSetting } from '@/payload-types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { formatCurrency } from '@/utils/currency'

type Props = {
  open: boolean
  onOpenChange: (isOpen: boolean) => void
  settings?: PrePaymentRequestsSetting
}

export default function PreRequestPaymentModal({ open, onOpenChange, settings }: Props) {
  const [copied, setCopied] = useState(false)

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(settings?.pixQrCode || '')}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(settings?.pixQrCode || '')
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Erro ao copiar', err)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pré-pagamento necessário</DialogTitle>
          <DialogDescription>Finalize seu pagamento para continua</DialogDescription>
        </DialogHeader>

        <p className="text-sm text-gray-700">
          O planejamento virtual é essencial para garantir previsibilidade e qualidade no
          tratamento, sendo realizado mediante a taxa{' '}
          <strong>{formatCurrency(settings?.amount || 0)}</strong>, valor totalmente abatido na
          contratação de um plano de alinhadores.
        </p>

        <p className="text-sm text-gray-700">
          Realize o pagamento via PIX utilizando o QR Code abaixo:
        </p>

        <div className="flex justify-center my-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qrUrl} alt="QR Code PIX" className="w-[200px] h-[200px]" />
        </div>

        <div className="flex flex-col items-center gap-2 mb-4">
          <button
            onClick={handleCopy}
            className="cursor-pointer px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 hover:bg-gray-200 transition text-sm font-medium"
          >
            {copied ? 'Copiado!' : 'Copiar código PIX'}
          </button>
        </div>

        <p className="text-sm text-gray-700">
          Após o pagamento, entre em contato com nossa equipe para liberação da sua solicitação.
        </p>
      </DialogContent>
    </Dialog>
  )
}
