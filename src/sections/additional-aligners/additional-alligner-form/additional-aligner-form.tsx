'use client'
import { AdditionalAligner } from '@/payload-types'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import RadioInput from '@/components/radio-input'
import LoadingScreen from '@/components/loading-screen'
import { Send } from 'lucide-react'
import { toast } from 'sonner'
import { getPatientsAction } from '@/actions/patients'
import { alignerNumbers } from '@/sections/additional-aligners/additional-alligner-form/constants'
import {
  formSchema,
  FormData,
} from '@/sections/additional-aligners/additional-alligner-form/validations'
import {
  createAdditionalAlignerAction,
  updateAdditionalAlignerAction,
} from '@/actions/additional-aligners'

type Props = {
  additionalAligner?: AdditionalAligner
}

export default function AdditionalAlignersForm({ additionalAligner }: Props) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patient: additionalAligner?.patient || '',
      alignerType: additionalAligner?.alignerType,
      alignerNumber: additionalAligner?.alignerNumber || '',
    },
  })

  const { handleSubmit, watch } = form
  const { push } = useRouter()

  const { data: patients } = useQuery({
    queryKey: ['patients'],
    queryFn: getPatientsAction,
    initialData: [],
  })

  const { mutate, isPending } = useMutation({
    mutationFn: additionalAligner ? updateAdditionalAlignerAction : createAdditionalAlignerAction,
    onMutate() {
      toast.success(
        `Solicitação de alinhador adicional ${additionalAligner ? 'atualizada' : 'realizada'} com sucesso!`,
      )

      push('/alinhadores-adicionais')
    },
    onError() {
      toast.error(
        `Houve um erro ao tentar ${additionalAligner ? 'atualizadar' : 'realizar'} a sua solicitação! Por favor tente novamente.`,
      )
    },
  })

  function onSubmit(data: FormData) {
    const values = additionalAligner
      ? {
          ...additionalAligner,
          ...data,
        }
      : data

    mutate(values as AdditionalAligner)
  }

  const alignerType = watch('alignerType')

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 lg:py-6 lg:px-20">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
                <CardDescription>Dados do pedido</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="patient"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Selecione o paciente</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {patients.map(({ id, patient }) => (
                            <SelectItem key={id} value={patient}>
                              {patient}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <RadioInput
                  name="alignerType"
                  label="Selecione o tipo de arcada do alinhador"
                  options={[
                    {
                      label: 'Superior',
                      value: 'upper',
                    },
                    {
                      label: 'Inferior',
                      value: 'lower',
                    },
                  ]}
                />

                {!!alignerType && (
                  <RadioInput
                    name="alignerNumber"
                    label="Selecione o número do alinhador"
                    isRow
                    options={alignerNumbers.map((number) => ({
                      label: number,
                      value: number,
                    }))}
                  />
                )}
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-4">
              <Button
                className="w-full md:w-fit"
                disabled={
                  isPending ||
                  (additionalAligner?.status && additionalAligner?.status !== 'created')
                }
                type="submit"
              >
                <Send className="h-4 w-4 mr-2" />
                {!!additionalAligner ? 'Editar e reenviar solicitação' : 'Enviar solicitação'}
              </Button>
            </div>
          </form>
        </Form>
      </div>

      {isPending && <LoadingScreen isVisible={isPending} />}
    </div>
  )
}
