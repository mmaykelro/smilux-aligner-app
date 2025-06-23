'use client'
import RadioInput from '@/components/radio-input'

export const IncisorsLevelingStep: React.FC = () => {
  return (
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
  )
}
