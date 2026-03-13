'use client'
import React, { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, CalendarIcon } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { getPatientsAction } from '@/actions/patients'

const statusLabels = {
  pedido_criado: 'Pedido Feito',
  em_andamento: 'Em Andamento',
  finalizado: 'Finalizadas',
}

const statusColors = {
  pedido_criado: 'bg-blue-50 text-blue-600',
  em_andamento: 'bg-yellow-50 text-yellow-600',
  finalizado: 'bg-green-50 text-green-600',
}

const RequestsTableFilters: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>()
  const [endDate, setEndDate] = useState<Date | null>()

  const searchParams = useSearchParams()
  const router = useRouter()

  const patient = searchParams.get('paciente')
  const status = searchParams.get('status')
  const data_inicial = searchParams.get('data_inicial')
  const data_final = searchParams.get('data_final')

  const { data: patients } = useQuery({
    queryKey: ['patients'],
    queryFn: getPatientsAction,
    initialData: [],
  })

  const onChangeParam = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const params = new URLSearchParams(searchParams.toString())
    params.set(name, value.toString())
    router.push(`?${params.toString()}`)
  }

  function clearFilters() {
    router.push('/alinhadores-adicionais')

    setStartDate(null)
    setEndDate(null)
  }

  return (
    <Card className="w-full mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Filtros
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Campo de pesquisa por paciente */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Paciente</label>
            <div className="relative">
              <Select
                onValueChange={(value) =>
                  onChangeParam({
                    target: { name: 'paciente', value },
                  } as React.ChangeEvent<HTMLInputElement>)
                }
                value={patient || ''}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o paciente" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="todos">Todos os pacientes</SelectItem>
                  {patients.map(({ id, patient }) => (
                    <SelectItem key={id} value={patient}>
                      {patient}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Select de status com badges */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select
              value={status || ''}
              onValueChange={(value) =>
                onChangeParam({
                  target: { name: 'status', value },
                } as React.ChangeEvent<HTMLInputElement>)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">
                  <Badge variant="outline">Todos os status</Badge>
                </SelectItem>
                {Object.entries(statusLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    <Badge
                      variant="secondary"
                      className={statusColors[key as keyof typeof statusColors]}
                    >
                      {label}
                    </Badge>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Data From */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Data Inicial</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {data_inicial || 'Selecionar data'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate || undefined}
                  onSelect={(date) => {
                    setStartDate(date)
                    onChangeParam({
                      target: {
                        name: 'data_inicial',
                        value: format(date || '', 'dd-MM-yyyy', { locale: ptBR }),
                      },
                    } as any)
                  }}
                  initialFocus
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Data To */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Data Final</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {data_final || 'Selecionar data'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate || undefined}
                  onSelect={(date) => {
                    setEndDate(date)
                    onChangeParam({
                      target: {
                        name: 'data_final',
                        value: format(date || '', 'dd-MM-yyyy', { locale: ptBR }),
                      },
                    } as any)
                  }}
                  initialFocus
                  disabled={(date) => {
                    if (startDate) {
                      return date < startDate
                    }
                    return false
                  }}
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Botão para limpar filtros */}
        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={clearFilters}>
            Limpar Filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default RequestsTableFilters
