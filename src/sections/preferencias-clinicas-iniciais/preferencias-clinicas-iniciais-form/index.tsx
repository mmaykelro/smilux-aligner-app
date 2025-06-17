'use client'
import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { updateCustomerAction } from '@/actions/customer'

interface FormData {
  passiveAligners: string | null
  delayIPRStage: string | null
  delayAttachmentStage: string | null
  maxIPR: string | null
  incisalLeveling: string | null
  elasticChain: string | null
  distalizationOptions: string | null
  elasticPositions: string[]
  specialInstructions: string | null
}

const steps = [
  {
    id: 1,
    title: 'Alinhadores Passivos',
    description: 'Configurações para alinhadores passivos',
  },
  {
    id: 2,
    title: 'Configurações de IPR',
    description: 'Atraso de estágio e máximo de IPR',
  },
  {
    id: 3,
    title: 'Configurações de Attachment',
    description: 'Atraso para colocação de attachment',
  },
  {
    id: 4,
    title: 'Nivelamento dos Incisivos',
    description: 'Preferências para incisivos superiores',
  },
  {
    id: 5,
    title: 'Cadeia Elástica Virtual',
    description: 'Configurações para fechamento de espaços',
  },
  {
    id: 6,
    title: 'Distalização Sequencial',
    description: 'Opções de distalização sequencial',
  },
  {
    id: 7,
    title: 'Posição de Elástico',
    description: 'Preferência de posição de elástico',
  },
  {
    id: 8,
    title: 'Instruções Especiais',
    description: 'Observações e instruções adicionais',
  },
]

const upperTeeth = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28]
const lowerTeeth = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38]

const PreferenciasClinicasIniciaisForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    passiveAligners: null,
    delayIPRStage: null,
    delayAttachmentStage: null,
    maxIPR: null,
    incisalLeveling: null,
    elasticChain: null,
    distalizationOptions: null,
    elasticPositions: [],
    specialInstructions: null,
  })

  const [isLoading, setTransition] = useTransition()

  const { push } = useRouter()

  const progress = (currentStep / steps.length) * 100

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleElasticPositionChange = (tooth: string, checked: boolean) => {
    const currentPositions = formData.elasticPositions
    if (checked) {
      updateFormData('elasticPositions', [...currentPositions, tooth])
    } else {
      updateFormData(
        'elasticPositions',
        currentPositions.filter((t) => t !== tooth),
      )
    }
  }

  const handleSubmit = async () => {
    setTransition(async () => {
      try {
        await updateCustomerAction({
          clinicalPreferences: formData,
          isRegisterComplete: true,
        })

        push('/aguardando-aprovacao')
      } catch (error) {}
    })
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Preferências clínicas globais:</strong> As preferências clínicas mostradas
                abaixo são aplicadas para todos os seus tratamentos de forma padronizada.
              </p>
            </div>
            <div className="space-y-4">
              <Label className="text-base font-medium">Alinhadores Passivos</Label>
              <RadioGroup
                value={formData.passiveAligners}
                onValueChange={(value) => updateFormData('passiveAligners', value)}
                className="space-y-3"
              >
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value="sim_adicione" id="sim_adicione" className="mt-1" />
                  <Label htmlFor="sim_adicione" className="text-sm leading-relaxed">
                    Sim, adicione alinhadores passivos para combinar com arco com mais etapas
                  </Label>
                </div>
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value="nao_mas_crie" id="nao_mas_crie" className="mt-1" />
                  <Label htmlFor="nao_mas_crie" className="text-sm leading-relaxed">
                    Não, mas crie um número igual de alinhadores ativos em ambos os arcos
                  </Label>
                </div>
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value="nenhuma" id="nenhuma" className="mt-1" />
                  <Label htmlFor="nenhuma" className="text-sm leading-relaxed">
                    Nenhuma das opções acima
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label className="text-base font-medium">Atrase o estágio para iniciar o IPR</Label>
              <Select
                value={formData.delayIPRStage as string}
                onValueChange={(value) => updateFormData('delayIPRStage', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma opção" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nao_atrase">Não atrase</SelectItem>
                  <SelectItem value="estagio_1">Atrase para o estágio 1</SelectItem>
                  <SelectItem value="estagio_2">Atrase para o estágio 2</SelectItem>
                  <SelectItem value="estagio_3">Atrase para o estágio 3</SelectItem>
                  <SelectItem value="estagio_4">Atrase para o estágio 4</SelectItem>
                  <SelectItem value="estagio_5">Atrase para o estágio 5</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-4">
              <Label htmlFor="maxIPR" className="text-base font-medium">
                Qual o máximo de IPR?
              </Label>
              <Input
                id="maxIPR"
                value={formData.maxIPR as string}
                onChange={(e) => updateFormData('maxIPR', e.target.value)}
                placeholder="Digite o valor máximo (ex: 0.5mm)"
                type="text"
              />
              <p className="text-xs text-muted-foreground">
                Especifique o valor máximo de IPR (Interproximal Reduction) permitido
              </p>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label className="text-base font-medium">Atrase a colocação do attachment</Label>
              <Select
                value={formData.delayAttachmentStage as string}
                onValueChange={(value) => updateFormData('delayAttachmentStage', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma opção" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nao_atrase">Não atrase</SelectItem>
                  <SelectItem value="estagio_1">Atrase para o estágio 1</SelectItem>
                  <SelectItem value="estagio_2">Atrase para o estágio 2</SelectItem>
                  <SelectItem value="estagio_3">Atrase para o estágio 3</SelectItem>
                  <SelectItem value="estagio_4">Atrase para o estágio 4</SelectItem>
                  <SelectItem value="estagio_5">Atrase para o estágio 5</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Defina quando os attachments devem ser colocados durante o tratamento
              </p>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label className="text-base font-medium">Nivelamento dos incisivos superiores</Label>
              <p className="text-sm text-muted-foreground">
                (Esta preferência é suportada somente para dentes permanentes)
              </p>
              <RadioGroup
                value={formData.incisalLeveling}
                onValueChange={(value) => updateFormData('incisalLeveling', value)}
                className="space-y-3"
              >
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="nivelar_borda" id="nivelar_borda" />
                  <Label htmlFor="nivelar_borda" className="text-sm">
                    Nivelar borda incisal
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem
                    value="nivelar_laterais_centrais"
                    id="nivelar_laterais_centrais"
                  />
                  <Label htmlFor="nivelar_laterais_centrais" className="text-sm">
                    Nivelar borda incisal - Nivelar laterais com centrais
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="laterais_05mm" id="laterais_05mm" />
                  <Label htmlFor="laterais_05mm" className="text-sm">
                    Nivelar borda incisal - Laterais 0,5mm mais curtos que centrais
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="margem_gengival" id="margem_gengival" />
                  <Label htmlFor="margem_gengival" className="text-sm">
                    Nivelar margem gengival
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label className="text-base font-medium">
                Para tratamentos de fechamento de espaços, aplicar cadeia elástica virtual
              </Label>
              <p className="text-sm text-muted-foreground">
                (Sobrecorreção para tratamentos de fechamento de espaço)
              </p>
              <RadioGroup
                value={formData.elasticChain}
                onValueChange={(value) => updateFormData('elasticChain', value)}
                className="space-y-3"
              >
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="nao" id="nao" />
                  <Label htmlFor="nao" className="text-sm">
                    Não
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="sim_3_3" id="sim_3_3" />
                  <Label htmlFor="sim_3_3" className="text-sm">
                    Sim, 3-3
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="sim_6_6" id="sim_6_6" />
                  <Label htmlFor="sim_6_6" className="text-sm">
                    Sim, 6-6
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label className="text-base font-medium">Opções de distalização sequencial</Label>
              <RadioGroup
                value={formData.distalizationOptions}
                onValueChange={(value) => updateFormData('distalizationOptions', value)}
                className="space-y-3"
              >
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value="sequencial_50" id="sequencial_50" className="mt-1" />
                  <Label htmlFor="sequencial_50" className="text-sm leading-relaxed">
                    Distalização sequencial 50% (somente após um dente distalizar 50% da distância
                    total que outro dente começa a distalizar)
                  </Label>
                </div>
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value="2by2" id="2by2" className="mt-1" />
                  <Label htmlFor="2by2" className="text-sm leading-relaxed">
                    Distalização 2 by 2 - 2 dentes distalizam ao mesmo tempo 100% da distância total
                    antes dos próximos 2 dentes
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        )

      case 7:
        return (
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
                          checked={formData.elasticPositions.includes(tooth.toString())}
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
                          checked={formData.elasticPositions.includes(tooth.toString())}
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
        )

      case 8:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label htmlFor="specialInstructions" className="text-base font-medium">
                Instruções Especiais
              </Label>
              <p className="text-sm text-muted-foreground">
                Adicione qualquer instrução especial ou observação relevante para o tratamento
              </p>
              <Textarea
                id="specialInstructions"
                value={formData.specialInstructions as string}
                onChange={(e) => updateFormData('specialInstructions', e.target.value)}
                placeholder="Digite suas instruções especiais aqui..."
                rows={8}
                className="resize-none"
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Image
            src="/images/logo.png"
            alt="Smilux Aligner"
            width={200}
            height={80}
            className="mx-auto mb-6"
            priority
          />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Preferências Clínicas</h1>
          <p className="text-gray-600">Smilux Alinhadores - Configurações de Tratamento</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Etapa {currentStep} de {steps.length}
            </span>
            <span className="text-sm text-gray-500">{Math.round(progress)}% concluído</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Steps Indicator */}
        <div className="flex justify-center mb-8 overflow-x-auto">
          <div className="flex space-x-2 min-w-max px-4">
            {steps.map((step) => (
              <div
                key={step.id}
                className={cn(
                  'flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors',
                  step.id < currentStep
                    ? 'bg-green-500 text-white'
                    : step.id === currentStep
                      ? 'bg-cyan-600 text-white'
                      : 'bg-gray-200 text-gray-600',
                )}
              >
                {step.id < currentStep ? <Check className="w-4 h-4" /> : step.id}
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-gray-900">{steps[currentStep - 1].title}</CardTitle>
            <CardDescription className="text-gray-600">
              {steps[currentStep - 1].description}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">{renderStepContent()}</CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </Button>

          {currentStep === steps.length ? (
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-cyan-600 hover:bg-cyan-700 text-white flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Salvar Preferências
            </Button>
          ) : (
            <Button
              onClick={nextStep}
              className="bg-cyan-600 hover:bg-cyan-700 text-white flex items-center gap-2"
            >
              Próximo
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Smilux Aligner. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  )
}

export default PreferenciasClinicasIniciaisForm
