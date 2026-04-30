import OrderStatusStepper from '@/components/order-status-stepper'
import { confirmContainmentDeliverytAction } from '@/actions/containments'

type OrderStatus = 'not_sent' | 'preparing' | 'sent' | 'delivered'

interface Props {
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

export default function ContainmentOrderStatusStepper({
  currentStatus,
  orderId,
  createdAt,
  completionDate,
  trackingCode,
  trackingUrl,
  carrier,
  sentDate,
  estimatedArrival,
}: Props) {
  return (
    <OrderStatusStepper
      onConfirmDelivery={confirmContainmentDeliverytAction}
      currentStatus={currentStatus}
      orderId={orderId}
      createdAt={createdAt}
      completionDate={completionDate}
      trackingCode={trackingCode}
      trackingUrl={trackingUrl}
      carrier={carrier}
      sentDate={sentDate}
      estimatedArrival={estimatedArrival}
      orderNumberPrefix="CC"
    />
  )
}
