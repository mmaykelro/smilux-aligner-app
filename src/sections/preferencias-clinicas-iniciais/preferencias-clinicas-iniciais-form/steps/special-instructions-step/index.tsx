import React from 'react'
import { useFormContext } from 'react-hook-form'
import { Textarea } from '@/components/ui/textarea'

export const SpecialInstructionsStep: React.FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  return (
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
  )
}
