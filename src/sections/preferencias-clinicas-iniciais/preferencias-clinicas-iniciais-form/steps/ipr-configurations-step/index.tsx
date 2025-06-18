'use client'
import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import SelectInput from '@/components/select-input'

export const IprConfigurationsStep: React.FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext()
  return (
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
  )
}
