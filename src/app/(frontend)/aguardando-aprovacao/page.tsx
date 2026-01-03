import Image from 'next/image'
import Link from 'next/link'
import { LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getCustomerAction } from '@/actions/customer'

const AguardandoAprovacaoPage: React.FC = async () => {
  const user = await getCustomerAction()

  const name = user?.name || ''

  function getWhatsappMessage(name = '', extraText = '') {
    const now = new Date()
    const hour = now.getHours()
    let greeting = 'Bom dia'

    if (hour >= 12 && hour < 18) {
      greeting = 'Boa tarde'
    } else if (hour >= 18 || hour < 5) {
      greeting = 'Boa noite'
    }

    let message = `${greeting},`
    if (name && name.trim() !== '') {
      message += ` me chamo ${name.trim()}.`
    }
    if (extraText && extraText.trim() !== '') {
      message += ` ${extraText.trim()}`
    }

    const mensagemEncoded = encodeURIComponent(message)
    const link = `https://wa.me/556198395485?text=${mensagemEncoded}`
    return link
  }

  const whatsappMessage = getWhatsappMessage(
    name,
    'Acabei de fazer o cadastro na plataforma e gostaria de saber como posso liberar o meu acesso?',
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 flex items-center justify-center">
      <main className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
          <div className="mb-6 flex justify-center">
            <Image src="/images/logo.png" alt="Smilux Logo" width={200} height={60} priority />
          </div>
          <h1 className="mb-4 text-3xl font-bold text-gray-800">Conta Criada com Sucesso!</h1>
          <p className="mb-6 text-gray-600">
            Sua conta foi criada e está aguardando aprovação. Para liberar seu acesso, por favor,
            entre em contato com o nosso suporte.
          </p>
          <Button className="w-full" asChild>
            <Link href={whatsappMessage} target="_blank">
              Entrar em Contato com o Suporte
            </Link>
          </Button>

          <Link href="/login" passHref>
            <Button
              variant="outline"
              className="mt-3 w-full flex items-center justify-center gap-2"
            >
              <LogIn className="h-4 w-4" />
              Voltar para o Login
            </Button>
          </Link>
          <p className="mt-4 text-sm text-gray-500">Agradecemos a sua paciência.</p>
        </div>
      </main>
    </div>
  )
}

export default AguardandoAprovacaoPage
