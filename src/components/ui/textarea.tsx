import * as React from 'react'
import { FieldErrors } from 'react-hook-form'
import { cn } from '@/lib/utils'
import { getNestedValue } from '@/utils/input'

export interface TextareaProps extends React.ComponentProps<'textarea'> {
  errors?: FieldErrors
  label?: string
}

const Textarea = React.forwardRef<HTMLInputElement, TextareaProps>(
  ({ className, label, errors, ...props }, ref: any) => {
    const error = getNestedValue(errors, props?.name || '') as { message: string }

    return (
      <div>
        {label && (
          <label className="block mb-2 text-base font-medium text-[#1f2937]" htmlFor={props.name}>
            {label}
          </label>
        )}

        <textarea
          data-slot="textarea"
          className={cn(
            'border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            className,
          )}
          {...props}
          ref={ref}
        />

        {error?.message && <p className="text-red-500 text-xs italic mt-1">{error.message}</p>}
      </div>
    )
  },
)

Textarea.displayName = 'Textarea'

export { Textarea }
