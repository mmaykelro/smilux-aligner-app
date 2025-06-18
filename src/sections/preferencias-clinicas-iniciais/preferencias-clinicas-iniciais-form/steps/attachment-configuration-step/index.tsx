'use client'
import SelectInput from '@/components/select-input'

export const AttachmentConfigurationStep: React.FC = () => {
  return (
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
  )
}
