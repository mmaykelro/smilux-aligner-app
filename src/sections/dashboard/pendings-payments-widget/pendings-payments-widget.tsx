import Link from 'next/link'
import { DollarSign, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Props = {
  amount: number
}

export default function PendingsPayentsWidget({ amount }: Props) {
  if (amount <= 0) return null

  return (
    <div className="bg-emerald-50 rounded-xl border border-emerald-100 p-5 md:p-6 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start gap-4 w-full">
        <div className="bg-white p-3 rounded-full text-emerald-600 shadow-sm border border-emerald-100 shrink-0">
          <DollarSign size={28} />
        </div>
        <div className="flex-1">
          <h3 className="text-emerald-950 font-bold text-lg flex flex-wrap items-center gap-2">
            Pagamentos Pendentes
            <span className="bg-emerald-200 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
              {amount} {amount > 1 ? 'casos' : 'caso'}
            </span>
          </h3>
          <p className="text-emerald-700/80 text-sm mt-1 max-w-2xl leading-relaxed">
            Você possui {amount} {amount > 1 ? 'casos' : 'caso'} aguardando confirmação de pagamento
            para {amount > 1 ? 'entrarem' : 'entrar'} em produção.
          </p>
        </div>
      </div>

      <div className="w-full md:w-auto shrink-0">
        <Link href="/pagamentos-pendentes">
          <Button variant="success" className="w-full items-center md:w-auto justify-center">
            <span>Realizar Pagamento{amount > 1 && 's'}</span>
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
