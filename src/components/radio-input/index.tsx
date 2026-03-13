import React from 'react'
import { useFormContext } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { FormField, FormItem, FormMessage } from '@/components/ui/form'

type Option = {
  label: string
  value: string
}

type RadioInputProps = {
  label?: string
  name: string
  options: Option[]
  disabled?: boolean
  isRow?: boolean
}

const RadioInput: React.FC<RadioInputProps> = ({ label, name, disabled, options, isRow }) => {
  const { control, clearErrors } = useFormContext()
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          {!!label && <Label className="text-base font-medium">{label}</Label>}
          <RadioGroup
            data-name={name}
            onValueChange={(value) => {
              clearErrors(name)
              field.onChange(value)
            }}
            value={field.value}
            className={`flex ${isRow ? 'grid grid-cols-11 gap-4' : 'flex-col space-y-2'}`}
            disabled={disabled}
          >
            {options.map((option, index) => (
              <div key={option.value} className="flex  items-center space-x-2">
                <RadioGroupItem
                  ref={index === 0 ? field.ref : undefined}
                  value={option.value}
                  id={option.value}
                />
                <Label htmlFor={option.value}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default RadioInput
