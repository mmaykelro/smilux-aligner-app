'use client'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { Form } from '@/components/ui/form'
import RadioInput from '@/components/radio-input'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import SelectInput from '@/components/select-input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Check } from 'lucide-react'
import { toast } from 'sonner'
import { updateCustomerAction } from '@/actions/customer'
import CardInputForm from '@/sections/clinical-preferences/clinical-preferences-form/card-input-form'
import { ClinicalPreferences } from '@/types/customers'
import { smoothFocus } from '@/utils/input'
import { validations, FormSchema } from './validations'

const upperTeeth = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28]
const lowerTeeth = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38]

type Props = {
  defaultValues: ClinicalPreferences
}

export default function ClinicalPreferencesForm({ defaultValues }: Props) {
  const [isLoading, setTransition] = useTransition()

  const form = useForm<FormSchema>({
    resolver: zodResolver(validations),
    defaultValues: {
      passiveAligners: defaultValues?.passiveAligners ?? '',
      delayIPRStage: defaultValues?.delayIPRStage ?? '',
      delayAttachmentStage: defaultValues?.delayAttachmentStage ?? '',
      maxIPR: defaultValues?.maxIPR ?? '',
      incisalLeveling: defaultValues?.incisalLeveling ?? '',
      elasticChain: defaultValues?.elasticChain ?? '',
      distalizationOptions: defaultValues?.distalizationOptions ?? '',
      elasticPositions: defaultValues?.elasticPositions ?? [],
      specialInstructions: defaultValues?.specialInstructions ?? '',
    },
    shouldFocusError: false,
  })
  const {
    handleSubmit,
    register,
    watch,
    getValues,
    setValue,
    setFocus,
    formState: { errors },
  } = form

  const handleElasticPositionChange = (tooth: string, checked: boolean) => {
    const currentPositions = getValues('elasticPositions') || []
    if (checked) {
      setValue('elasticPositions', [...currentPositions, tooth], { shouldValidate: true })
    } else {
      setValue(
        'elasticPositions',
        currentPositions.filter((t: string) => t !== tooth),
        { shouldValidate: true },
      )
    }
  }

  const elasticPositions = watch('elasticPositions')

  const onError = (errors: any) => {
    const firstErrorField = Object.keys(errors)[0]
    const element = document.querySelector(
      `[name="${firstErrorField}"], [data-name="${firstErrorField}"]`,
    ) as HTMLElement | null

    if (element) {
      smoothFocus(element)
    }
  }

  const onSubmit = async (values: FormSchema) => {
    setTransition(async () => {
      try {
        await updateCustomerAction({
          clinicalPreferences: values,
          isRegisterComplete: true,
        })

        toast.success('Preferências clínicas salvas com sucesso!')
      } catch (error) {
        toast.error(
          'Ocorreu um erro ao tentar salvar as suas preferências clínicas, favor tentar mais tarde.',
        )
      }
    })
  }

  return (
    <Form {...form}>
      <div className="flex flex-col gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Preferências clínicas globais:</strong> As preferências clínicas mostradas
            abaixo são aplicadas para todos os seus tratamentos de forma padronizada.
          </p>
        </div>
        <CardInputForm
          title="Alinhadores Passivos"
          description="Configurações para alinhadores passivos"
        >
          <div className="space-y-6">
            <RadioInput
              name="passiveAligners"
              label="Alinhadores Passivos"
              options={[
                {
                  label:
                    'Sim, adicione alinhadores passivos para combinar com arco com mais etapas',
                  value: 'sim_adicione',
                },
                {
                  label: 'Não, mas crie um número igual de alinhadores ativos em ambos os arcos',
                  value: 'nao_mas_crie',
                },
                {
                  label: 'Nenhuma das opções acima',
                  value: 'nenhuma',
                },
              ]}
            />
          </div>
        </CardInputForm>

        <CardInputForm title="Configurações de IPR" description="Atraso de estágio e máximo de IPR">
          <div className="space-y-6">
            <SelectInput
              name="delayIPRStage"
              label="Atrase o estágio para iniciar o IPR"
              options={[
                {
                  label: 'Não atrase',
                  value: 'nao_atrase',
                },
                {
                  label: 'Atrase para o estágio 1',
                  value: 'estagio_1',
                },
                {
                  label: 'Atrase para o estágio 2',
                  value: 'estagio_2',
                },
                {
                  label: 'Atrase para o estágio 3',
                  value: 'estagio_3',
                },
                {
                  label: 'Atrase para o estágio 4',
                  value: 'estagio_4',
                },
                {
                  label: 'Atrase para o estágio 5',
                  value: 'estagio_5',
                },
              ]}
            />

            <div className="space-y-1">
              <Input
                label="Qual o máximo de IPR?"
                {...register('maxIPR')}
                errors={errors}
                placeholder="Digite o valor máximo (ex: 0.5mm)"
                type="text"
              />
              <p className="text-xs text-muted-foreground">
                Especifique o valor máximo de IPR (Interproximal Reduction) permitido
              </p>
            </div>
          </div>
        </CardInputForm>

        <CardInputForm
          title="Configurações de Attachment"
          description="Atraso para colocação de attachment"
        >
          <div className="space-y-1">
            <SelectInput
              name="delayAttachmentStage"
              label="Atrase a colocação do attachment"
              options={[
                {
                  label: 'Não atrase',
                  value: 'nao_atrase',
                },
                {
                  label: 'Atrase para o estágio 1',
                  value: 'estagio_1',
                },
                {
                  label: 'Atrase para o estágio 2',
                  value: 'estagio_2',
                },
                {
                  label: 'Atrase para o estágio 3',
                  value: 'estagio_3',
                },
                {
                  label: 'Atrase para o estágio 4',
                  value: 'estagio_4',
                },
                {
                  label: 'Atrase para o estágio 5',
                  value: 'estagio_5',
                },
              ]}
            />
            <p className="text-xs text-muted-foreground">
              Defina quando os attachments devem ser colocados durante o tratamento
            </p>
          </div>
        </CardInputForm>

        <CardInputForm
          title="Nivelamento dos Incisivos"
          description="Preferências para incisivos superiores"
        >
          <div className="space-y-1">
            <RadioInput
              name="incisalLeveling"
              label="Nivelamento dos incisivos superiores"
              options={[
                {
                  label: 'Nenhum',
                  value: 'none',
                },
                {
                  label: 'Nivelar borda incisal',
                  value: 'nivelar_borda',
                },

                {
                  label: 'Nivelar borda incisal - Laterais 0,5mm mais curtos que centrais',
                  value: 'laterais_05mm',
                },
                {
                  label: 'Nivelar margem gengival',
                  value: 'margem_gengival',
                },
              ]}
            />

            <p className="text-sm text-muted-foreground">
              (Esta preferência é suportada somente para dentes permanentes)
            </p>
          </div>
        </CardInputForm>

        <CardInputForm
          title="Cadeia Elástica Virtual"
          description="Configurações para fechamento de espaços"
        >
          <div className="space-y-1">
            <RadioInput
              name="elasticChain"
              label="Para tratamentos de fechamento de espaços, aplicar cadeia elástica virtual"
              options={[
                {
                  label: 'Não',
                  value: 'nao',
                },
                {
                  label: 'Sim, 3-3',
                  value: 'sim_3_3',
                },
                {
                  label: 'Sim, 6-6',
                  value: 'sim_6_6',
                },
              ]}
            />
            <p className="text-sm text-muted-foreground">
              (Sobrecorreção para tratamentos de fechamento de espaço)
            </p>
          </div>
        </CardInputForm>

        <CardInputForm
          title="Distalização Sequencial"
          description="Opções de distalização sequencial"
        >
          <RadioInput
            name="distalizationOptions"
            label="Opções de distalização sequencial"
            options={[
              {
                label:
                  'Distalização sequencial 50% (somente após um dente distalizar 50% da distância total que outro dente começa a distalizar)',
                value: 'sequencial_50',
              },
              {
                label:
                  'Distalização 2 by 2 - 2 dentes distalizam ao mesmo tempo 100% da distância total antes dos próximos 2 dentes',
                value: '2by2',
              },
            ]}
          />
        </CardInputForm>

        <CardInputForm title="Posição de Elástico" description="Preferência de posição de elástico">
          <div className="space-y-6">
            <div className="space-y-4">
              <Label className="text-base font-medium">Preferência de posição de elástico</Label>
              <p className="text-sm text-muted-foreground">
                Selecione os dentes onde deseja aplicar elásticos
              </p>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Dentes Superiores
                  </Label>
                  <div className="grid grid-cols-8 gap-2 p-4 bg-gray-50 rounded-lg">
                    {upperTeeth.map((tooth) => (
                      <div key={tooth} className="flex flex-col items-center space-y-1">
                        <Checkbox
                          id={`upper_${tooth}`}
                          checked={elasticPositions?.includes(tooth.toString())}
                          onCheckedChange={(checked) =>
                            handleElasticPositionChange(tooth.toString(), !!checked)
                          }
                        />
                        <Label htmlFor={`upper_${tooth}`} className="text-xs font-mono">
                          {tooth}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Dentes Inferiores
                  </Label>
                  <div className="grid grid-cols-8 gap-2 p-4 bg-gray-50 rounded-lg">
                    {lowerTeeth.map((tooth) => (
                      <div key={tooth} className="flex flex-col items-center space-y-1">
                        <Checkbox
                          id={`lower_${tooth}`}
                          checked={elasticPositions?.includes(tooth.toString())}
                          onCheckedChange={(checked) =>
                            handleElasticPositionChange(tooth.toString(), !!checked)
                          }
                        />
                        <Label htmlFor={`lower_${tooth}`} className="text-xs font-mono">
                          {tooth}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardInputForm>

        <CardInputForm
          title="Instruções Especiais"
          description="Observações e instruções adicionais"
        >
          <div className="space-y-1">
            <Textarea
              label="Instruções Especiais"
              placeholder="Digite suas instruções especiais aqui..."
              {...register('specialInstructions')}
              errors={errors}
              rows={8}
              className="resize-none"
            />
            <p className="text-sm text-muted-foreground">
              Adicione qualquer instrução especial ou observação relevante para o tratamento
            </p>
          </div>
        </CardInputForm>
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit(onSubmit, onError)}
            disabled={isLoading}
            className="bg-cyan-600 hover:bg-cyan-700 text-white flex items-center gap-2 w-full md:w-fit"
          >
            <Check className="w-4 h-4" />
            Salvar Preferências
          </Button>
        </div>
      </div>
    </Form>
  )
}
