'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { QrCode, CreditCard, ExternalLink, AlertTriangle } from 'lucide-react'

type Props = {
  title?: string
  pixUrl: string
  cardUrl: string
  onClose?: () => void
}

export default function RequestrPaymentOrderForm({ title, pixUrl, cardUrl, onClose }: Props) {
  const [activeTab, setActiveTab] = useState('pix')
  const [pixError, setPixError] = useState(false)
  const [cardError, setCardError] = useState(false)

  const handleOpenInNewTab = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
    if (onClose) {
      onClose()
    }
  }

  const handleIframeError = (type: 'pix' | 'card') => {
    if (type === 'pix') {
      setPixError(true)
    } else {
      setCardError(true)
    }
  }

  useEffect(() => {
    const pixTimer = setTimeout(() => {
      const pixIframe = document.getElementById('pix-iframe') as HTMLIFrameElement
      if (pixIframe) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          pixIframe.contentWindow?.location.href
        } catch (error) {
          setPixError(true)
        }
      }
    }, 500)

    const cardTimer = setTimeout(() => {
      const cardIframe = document.getElementById('card-iframe') as HTMLIFrameElement
      if (cardIframe) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          cardIframe.contentWindow?.location.href
        } catch (error) {
          setCardError(true)
        }
      }
    }, 500)

    return () => {
      clearTimeout(pixTimer)
      clearTimeout(cardTimer)
    }
  }, [])

  return (
    <div className="w-full mx-auto">
      <Card>
        {!!title && (
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">{title}</CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="pix" className="flex items-center gap-2">
                <QrCode className="h-4 w-4" />
                PIX
              </TabsTrigger>
              <TabsTrigger value="card" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Cartão de Crédito
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pix" className="mt-6">
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Pagamento via PIX</h3>
                  <p className="text-sm text-muted-foreground">
                    Escaneie o QR Code ou copie o código PIX para finalizar seu pagamento
                  </p>
                </div>

                {!pixUrl && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="flex flex-col gap-3">
                      <span>Tipo de pagamento ainda não disponibilizado.</span>
                    </AlertDescription>
                  </Alert>
                )}

                {!!pixUrl && !pixError && (
                  <>
                    <div className="flex justify-center mb-4">
                      <Button
                        variant="outline"
                        onClick={() => handleOpenInNewTab(pixUrl)}
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Abrir em Nova Aba (Recomendado)
                      </Button>
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                      <iframe
                        id="pix-iframe"
                        src={pixUrl}
                        width="100%"
                        height="600"
                        frameBorder="0"
                        title="Pagamento PIX"
                        className="w-full"
                        onError={() => handleIframeError('pix')}
                        onLoad={(e) => {
                          const iframe = e.target as HTMLIFrameElement
                          try {
                            if (iframe.contentWindow?.location.href === 'about:blank') {
                              setPixError(true)
                            }
                          } catch (error) {
                            setPixError(true)
                          }
                        }}
                      />
                    </div>
                  </>
                )}

                {!!pixError && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="flex flex-col gap-3">
                      <span>
                        Não foi possível carregar o formulário de pagamento PIX diretamente na
                        página. Isso acontece por questões de segurança do provedor de pagamento.
                      </span>
                      <Button onClick={() => handleOpenInNewTab(pixUrl)} className="w-fit mx-auto">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Abrir Pagamento PIX em Nova Aba
                      </Button>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </TabsContent>

            <TabsContent value="card" className="mt-6">
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Pagamento com Cartão</h3>
                  <p className="text-sm text-muted-foreground">
                    Preencha os dados do seu cartão de crédito para finalizar a compra
                  </p>
                </div>

                {!cardUrl && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="flex flex-col gap-3">
                      <span>Tipo de pagamento ainda não disponibilizado.</span>
                    </AlertDescription>
                  </Alert>
                )}

                {!!cardUrl && !cardError && (
                  <>
                    <div className="flex justify-center mb-4">
                      <Button
                        variant="outline"
                        onClick={() => handleOpenInNewTab(cardUrl)}
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Abrir em Nova Aba (Recomendado)
                      </Button>
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                      <iframe
                        id="card-iframe"
                        src={cardUrl}
                        width="100%"
                        height="600"
                        frameBorder="0"
                        title="Pagamento Cartão de Crédito"
                        className="w-full"
                        onError={() => handleIframeError('card')}
                        onLoad={(e) => {
                          const iframe = e.target as HTMLIFrameElement
                          try {
                            if (iframe.contentWindow?.location.href === 'about:blank') {
                              setCardError(true)
                            }
                          } catch (error) {
                            setCardError(true)
                          }
                        }}
                      />
                    </div>
                  </>
                )}

                {!!cardError && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="flex flex-col gap-3">
                      <span>
                        Não foi possível carregar o formulário de pagamento com cartão diretamente
                        na página. Isso acontece por questões de segurança do provedor de pagamento.
                      </span>
                      <Button
                        onClick={() => handleOpenInNewTab(cardUrl)}
                        className="w-full sm:w-fit mx-auto"
                      >
                        <ExternalLink className="h-4 w-4 mr-2 " />
                        Abrir Pagamento com Cartão em Nova Aba
                      </Button>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
