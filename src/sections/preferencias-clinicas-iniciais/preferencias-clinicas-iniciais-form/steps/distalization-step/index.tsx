import RadioInput from '@/components/radio-input'

export const DistalizationStep: React.FC = () => {
  return (
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
  )
}
