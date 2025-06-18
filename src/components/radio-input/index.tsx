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
}

const RadioInput: React.FC<RadioInputProps> = ({ label, name, options }) => {
  const { control, clearErrors } = useFormContext()
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          {!!label && <Label className="text-base font-medium">{label}</Label>}
          <RadioGroup
            onValueChange={(value) => {
              clearErrors(name)
              field.onChange(value)
            }}
            value={field.value}
            className="space-y-3"
          >
            {options.map((option) => (
              <div key={option.value} className="flex items-start space-x-3">
                <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                <Label htmlFor={option.value} className="text-sm leading-relaxed">
                  {option.label}
                </Label>
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
