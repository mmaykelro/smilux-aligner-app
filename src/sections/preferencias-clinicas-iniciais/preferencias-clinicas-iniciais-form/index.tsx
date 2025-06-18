'use client'
import React, { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Form } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { updateCustomerAction } from '@/actions/customer'
import {
  PassiveAlignersStep,
  IprConfigurationsStep,
  AttachmentConfigurationStep,
  IncisorsLevelingStep,
  VirtualElasticChairStep,
  DistalizationStep,
  ElasticPositionStep,
  SpecialInstructionsStep,
} from './steps'
import { REQUIRED_FIELD } from '@/constants/errors'

const formSchema = z.object({
  passiveAligners: z.string().min(1, 'Selecione uma opção para alinhadores passivos'),
  delayIPRStage: z.string().min(1, 'Selecione uma opção para atraso do IPR'),
  delayAttachmentStage: z.string().min(1, 'Selecione uma opção para atraso do attachment'),
  maxIPR: z.string().optional(),
  incisalLeveling: z.string().min(1, 'Selecione uma opção para nivelamento dos incisivos'),
  elasticChain: z.string().min(1, 'Selecione uma opção para cadeia elástica'),
  distalizationOptions: z.string().min(1, 'Selecione uma opção de distalização'),
  elasticPositions: z.array(z.string()).optional(),
  specialInstructions: z.string().min(1, REQUIRED_FIELD),
})

type FormData = z.infer<typeof formSchema>

const steps = [
  {
    id: 1,
    title: 'Alinhadores Passivos',
    description: 'Configurações para alinhadores passivos',
    fields: ['passiveAligners'],
  },
  {
    id: 2,
    title: 'Configurações de IPR',
    description: 'Atraso de estágio e máximo de IPR',
    fields: ['delayIPRStage'],
  },
  {
    id: 3,
    title: 'Configurações de Attachment',
    description: 'Atraso para colocação de attachment',
    fields: ['delayAttachmentStage'],
  },
  {
    id: 4,
    title: 'Nivelamento dos Incisivos',
    description: 'Preferências para incisivos superiores',
    fields: ['incisalLeveling'],
  },
  {
    id: 5,
    title: 'Cadeia Elástica Virtual',
    description: 'Configurações para fechamento de espaços',
    fields: ['elasticChain'],
  },
  {
    id: 6,
    title: 'Distalização Sequencial',
    description: 'Opções de distalização sequencial',
    fields: ['distalizationOptions'],
  },
  {
    id: 7,
    title: 'Posição de Elástico',
    description: 'Preferência de posição de elástico',
    fields: ['elasticPositions'],
  },
  {
    id: 8,
    title: 'Instruções Especiais',
    description: 'Observações e instruções adicionais',
    fields: ['specialInstructions'],
  },
]

const PreferenciasClinicasIniciaisForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1)

  const [isLoading, setTransition] = useTransition()

  const { push } = useRouter()

  const progress = (currentStep / steps.length) * 100

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      passiveAligners: '',
      delayIPRStage: '',
      delayAttachmentStage: '',
      maxIPR: '',
      incisalLeveling: '',
      elasticChain: '',
      distalizationOptions: '',
      elasticPositions: [],
      specialInstructions: '',
    },
  })

  const {
    control,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
    setValue,
    getValues,
    reset,
  } = form

  useEffect(() => {
    reset({
      passiveAligners: '',
      delayIPRStage: '',
      delayAttachmentStage: '',
      maxIPR: '',
      incisalLeveling: '',
      elasticChain: '',
      distalizationOptions: '',
      elasticPositions: [],
      specialInstructions: '',
    })
  }, [reset])

  const validateCurrentStep = async () => {
    const currentStepFields = steps[currentStep - 1].fields as (keyof FormData)[]
    return await trigger(currentStepFields)
  }

  const nextStep = async () => {
    const isStepValid = await validateCurrentStep()

    if (isStepValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const onSubmit = async (values: FormData) => {
    setTransition(async () => {
      try {
        await updateCustomerAction({
          clinicalPreferences: values,
          isRegisterComplete: true,
        })

        push('/aguardando-aprovacao')
      } catch (error) {}
    })
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <PassiveAlignersStep />

      case 2:
        return <IprConfigurationsStep />

      case 3:
        return <AttachmentConfigurationStep />

      case 4:
        return <IncisorsLevelingStep />

      case 5:
        return <VirtualElasticChairStep />

      case 6:
        return <DistalizationStep />

      case 7:
        return <ElasticPositionStep />

      case 8:
        return <SpecialInstructionsStep />

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
          <CardContent className="p-6">
            <Form {...form}>{renderStepContent()}</Form>
          </CardContent>
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
              onClick={handleSubmit(onSubmit)}
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
