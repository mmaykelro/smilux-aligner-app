'use client'

import type React from 'react'
import { useState, useTransition } from 'react'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ShoppingCart, Clock, Truck, CheckCircle, Copy, ExternalLink, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatOrderId } from '@/utils/text'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { confirmRequestDeliverytAction } from '@/actions/requests'

type OrderStatus = 'not_sent' | 'preparing' | 'sent' | 'delivered'

interface Step {
  id: OrderStatus
  title: string
  description: string
  icon: React.ReactNode
}

interface OrderStatusStepperProps {
  currentStatus: OrderStatus
  orderId?: number | null
  createdAt?: string | null
  completionDate?: string | null
  trackingCode?: string | null
  trackingUrl?: string | null
  carrier?: string | null
  sentDate?: string | null
  estimatedArrival?: string | null
}
const steps: Step[] = [
  {
    id: 'not_sent',
    title: 'Pedido Iniciado',
    description: 'Seu pedido foi confirmado e está sendo processado',
    icon: <ShoppingCart className="h-5 w-5" />,
  },
  {
    id: 'preparing',
    title: 'Pedido em Preparação',
    description: 'Estamos preparando seus itens para envio',
    icon: <Clock className="h-5 w-5" />,
  },
  {
    id: 'sent',
    title: 'Pedido Enviado',
    description: 'Seu pedido foi enviado e está a caminho',
    icon: <Truck className="h-5 w-5" />,
  },
  {
    id: 'delivered',
    title: 'Pedido Recebido',
    description: 'Pedido entregue com sucesso!',
    icon: <CheckCircle className="h-5 w-5" />,
  },
]

const RequestStatusStepper: React.FC<OrderStatusStepperProps> = ({
  currentStatus,
  orderId,
  createdAt,
  completionDate,
  trackingCode,
  trackingUrl,
  carrier,
  sentDate,
  estimatedArrival,
}) => {
  const [copied, setCopied] = useState(false)
  const [isOpenConfirmDelivery, setIsOpenConfirmDelivery] = useState(false)

  const params = useParams()

  const id = params?.id
  const [isLoading, startTransition] = useTransition()

  const getCurrentStepIndex = () => {
    return steps.findIndex((step) => step.id === currentStatus)
  }

  const isStepCompleted = (stepIndex: number) => {
    return stepIndex <= getCurrentStepIndex()
  }

  const isStepActive = (stepIndex: number) => {
    return stepIndex === getCurrentStepIndex()
  }

  const copyTrackingCode = async () => {
    try {
      await navigator.clipboard.writeText(trackingCode || '')
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Falha ao copiar:', err)
    }
  }

  const openTrackingPage = () => {
    window.open(`${trackingUrl}?codigo=${trackingCode}`, '_blank', 'noopener,noreferrer')
  }

  function handleOpenConfirmDelivery() {
    setIsOpenConfirmDelivery(true)
  }

  function handleConfirmDelivery() {
    startTransition(async () => {
      try {
        await confirmRequestDeliverytAction(id as string)
        setIsOpenConfirmDelivery(false)
        toast.success('Confirmação de pedido recebido com sucesso!')
      } catch {
        toast.error('Houve um erro na confirmação de recebimento do pedido!')
      }
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center">Status do Pedido</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div className="relative">
            {steps.map((step, index) => (
              <div key={step.id} className="relative flex items-start pb-8 last:pb-0">
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      'absolute left-6 top-12 w-0.5 h-16 -ml-px',
                      isStepCompleted(index) ? 'bg-green-500' : 'bg-gray-200',
                    )}
                  />
                )}

                <div className="relative flex items-center justify-center">
                  <div
                    className={cn(
                      'flex items-center justify-center w-12 h-12 rounded-full border-2 transition-colors',
                      isStepCompleted(index)
                        ? 'bg-green-500 border-green-500 text-white'
                        : isStepActive(index)
                          ? 'bg-blue-500 border-blue-500 text-white'
                          : 'bg-gray-100 border-gray-300 text-gray-400',
                    )}
                  >
                    {isStepCompleted(index) && !isStepActive(index) ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      step.icon
                    )}
                  </div>
                </div>

                <div className="ml-6 flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3
                      className={cn(
                        'text-lg font-semibold',
                        isStepCompleted(index)
                          ? 'text-green-700'
                          : isStepActive(index)
                            ? 'text-blue-700'
                            : 'text-gray-500',
                      )}
                    >
                      {step.title}
                    </h3>
                    {isStepActive(index) && (
                      <Badge variant="default" className="bg-blue-500">
                        Atual
                      </Badge>
                    )}
                    {isStepCompleted(index) && !isStepActive(index) && (
                      <Badge variant="default" className="bg-green-500">
                        Concluído
                      </Badge>
                    )}
                  </div>
                  <p
                    className={cn(
                      'text-sm mb-4',
                      isStepCompleted(index) ? 'text-gray-700' : 'text-gray-500',
                    )}
                  >
                    {step.description}
                  </p>

                  {step.id === 'sent' && isStepActive(index) && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-4">
                      <h4 className="font-semibold text-blue-900">Informações de Rastreamento</h4>

                      <div className="space-y-3">
                        <label className="text-sm font-medium text-blue-800">
                          Código de Rastreamento:
                        </label>
                        <div className="flex gap-2">
                          <Input
                            value={trackingCode || ''}
                            readOnly
                            className="font-mono bg-white"
                          />
                          <Button
                            variant="outline"
                            onClick={copyTrackingCode}
                            className="flex items-center gap-2 min-w-fit"
                          >
                            {copied ? (
                              <>
                                <Check className="h-4 w-4" />
                                Copiado!
                              </>
                            ) : (
                              <>
                                <Copy className="h-4 w-4" />
                                Copiar
                              </>
                            )}
                          </Button>
                        </div>
                        {!!trackingUrl && (
                          <Button
                            onClick={openTrackingPage}
                            className="w-full sm:w-fit flex items-center gap-2"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Rastrear Pedido
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Informações adicionais */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Informações do Pedido</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Número do pedido:</span>
                <span className="ml-2">{orderId ? formatOrderId(orderId) : '-'}</span>
              </div>
              <div>
                <span className="font-medium">Data da criação do pedido:</span>
                <span className="ml-2">
                  {createdAt ? format(createdAt || '', 'dd-MM-yyyy', { locale: ptBR }) : '-'}
                </span>
              </div>
              <div>
                <span className="font-medium">Data da finalização do pedido:</span>
                <span className="ml-2">
                  {completionDate
                    ? format(completionDate || '', 'dd-MM-yyyy', { locale: ptBR })
                    : '-'}
                </span>
              </div>
              <div>
                <span className="font-medium">Transportadora:</span>
                <span className="ml-2">{carrier || '-'}</span>
              </div>
              <div>
                <span className="font-medium">Data do envio:</span>
                <span className="ml-2">
                  {sentDate ? format(sentDate || '', 'dd-MM-yyyy', { locale: ptBR }) : '-'}
                </span>
              </div>
              <div>
                <span className="font-medium">Previsão de entrega:</span>
                <span className="ml-2">
                  {estimatedArrival
                    ? format(estimatedArrival || '', 'dd-MM-yyyy', { locale: ptBR })
                    : '-'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex w-full justify-end">
            <Button
              onClick={handleOpenConfirmDelivery}
              disabled={currentStatus === 'delivered'}
              className="w-full sm:w-fit flex items-center gap-2 bg-green-600 hover:bg-green-500"
            >
              <CheckCircle className="h-4 w-4" />
              Marcar como entregue
            </Button>
          </div>
          <Dialog open={isOpenConfirmDelivery} onOpenChange={setIsOpenConfirmDelivery}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Confirmar recebimento</DialogTitle>
                <DialogDescription>Confirmo que recebi o meu pedido</DialogDescription>
              </DialogHeader>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancelar</Button>
                </DialogClose>
                <Button
                  className="bg-green-600 hover:bg-green-500"
                  disabled={isLoading}
                  onClick={handleConfirmDelivery}
                >
                  Confirmar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  )
}

export default RequestStatusStepper
