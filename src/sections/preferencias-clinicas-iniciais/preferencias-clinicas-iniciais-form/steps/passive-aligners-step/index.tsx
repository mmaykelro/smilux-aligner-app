'use client'
import RadioInput from '@/components/radio-input'
export function PassiveAlignersStep() {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>Preferências clínicas globais:</strong> As preferências clínicas mostradas abaixo
          são aplicadas para todos os seus tratamentos de forma padronizada.
        </p>
      </div>
      <RadioInput
        name="passiveAligners"
        label="Alinhadores Passivos"
        options={[
          {
            label: 'Sim, adicione alinhadores passivos para combinar com arco com mais etapas',
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
  )
}
