'use client'
import { useFormContext } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

const upperTeeth = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28]
const lowerTeeth = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38]

export const ElasticPositionStep: React.FC = () => {
  const { watch, getValues, setValue } = useFormContext()
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
                    checked={elasticPositions.includes(tooth.toString())}
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
                    checked={elasticPositions.includes(tooth.toString())}
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
}
