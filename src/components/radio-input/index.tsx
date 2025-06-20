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
            className="flex flex-col space-y-2"
          >
            {options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={option.value} />
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
