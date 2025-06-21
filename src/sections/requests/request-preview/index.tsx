'use client'
import Link from 'next/link'
import { useTransition } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Edit, ExternalLink, AlertCircle } from 'lucide-react'
import { approveRequestAction } from '@/actions/requests'
import LoadingScreen from '@/components/loading-screen'

type RequestPreviewProps = {
  trackingLink?: string
  patient?: string
  requestId?: string
  status?: string
}

const RequestPreview: React.FC<RequestPreviewProps> = ({
  trackingLink,
  patient,
  requestId,
  status,
}) => {
  const [isLoading, startTransition] = useTransition()

  const handleOpenInNewTab = () => {
    if (trackingLink) {
      window.open(trackingLink, '_blank')
    }
  }

  function approveRequest() {
    startTransition(async () => {
      try {
        await approveRequestAction(requestId as string)

        toast.success('Solicitação aprovada com sucesso!')
      } catch {
        toast.error('Ocorreu um erro ao tentar aprovar sua solicitação!')
      }
    })
  }

  if (!trackingLink)
    return (
      <Card>
        <CardContent className="py-16">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Preview Indisponível</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Em breve o preview da solicitação estará disponível. Você será notificado quando o
              planejamento 3D estiver pronto para visualização.
            </p>
            <Badge variant="outline" className="mb-8">
              Processamento em andamento...
            </Badge>
          </div>
        </CardContent>
      </Card>
    )

  return (
    <div className="flex flex-col gap-6">
      <Card className="pb-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Preview 3D do Tratamento</CardTitle>
            <Button variant="outline" size="sm" onClick={handleOpenInNewTab}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Tela Cheia
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative w-full" style={{ height: '500px' }}>
            <iframe
              src={trackingLink}
              className="w-full h-full border-0 rounded-b-lg"
              title={`Preview do tratamento - ${patient}`}
              allow="fullscreen"
              loading="lazy"
            />
          </div>
        </CardContent>
      </Card>

      {status !== 'completed' && (
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center ">
          <Button
            onClick={approveRequest}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 min-w-32 w-full sm:w-fit"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Aprovar
          </Button>
          <Link href={`/solicitacoes/editar/${requestId}`} className="w-full sm:w-fit">
            <Button variant="outline" className="w-full sm:w-fit min-w-32">
              <Edit className="h-4 w-4 mr-2" />
              Solicitar Alterações
            </Button>
          </Link>
        </div>
      )}

      {isLoading && <LoadingScreen isVisible={isLoading} />}
    </div>
  )
}

export default RequestPreview
