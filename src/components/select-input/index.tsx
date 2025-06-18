'use client'
import { useFormContext } from 'react-hook-form'
import { FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type Option = {
  label: string
  value: string
}

type SelectInputProps = {
  label?: string
  name: string
  options: Option[]
}

const SelectInput: React.FC<SelectInputProps> = ({ label, name, options }) => {
  const { control, clearErrors } = useFormContext()
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          {!!label && <Label className="text-base font-medium">{label}</Label>}
          <Select
            value={field.value}
            onValueChange={(value) => {
              clearErrors(name)
              field.onChange(value)
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma opção" />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default SelectInput
