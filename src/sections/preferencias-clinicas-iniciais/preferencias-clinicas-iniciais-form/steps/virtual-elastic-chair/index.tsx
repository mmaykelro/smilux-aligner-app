import RadioInput from '@/components/radio-input'

export const VirtualElasticChairStep: React.FC = () => {
  return (
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
  )
}
