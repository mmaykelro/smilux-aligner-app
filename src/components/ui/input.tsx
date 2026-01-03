'use client'
import * as React from 'react'
import { FieldErrors } from 'react-hook-form'
import { useMask, type InputMaskProps } from '@react-input/mask'

import { cn } from '@/lib/utils'
import { getNestedValue } from '@/utils/input'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  errors?: FieldErrors
  label?: string | React.ReactNode
  mask?: InputMaskProps['mask'] // Tipagem mais precisa
  maskReplacement?: InputMaskProps['replacement']
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      errors,
      label,
      mask,
      maskReplacement = { _: /\d/ }, // Valor padrão
      ...props
    },
    ref,
  ) => {
    const error = getNestedValue(errors, props?.name || '') as { message: string }

    const inputRef = useMask({ mask, replacement: maskReplacement })

    const setRefs = React.useCallback(
      (node: HTMLInputElement) => {
        if (typeof ref === 'function') {
          ref(node)
        } else if (ref) {
          ref.current = node
        }
        // Atribui o mesmo nó à ref do useMask
        if (typeof inputRef === 'function') {
          //@ts-ignore
          inputRef(node)
        } else if (inputRef) {
          inputRef.current = node
        }
      },
      [ref, inputRef],
    )

    // Se não houver máscara, usa a ref normal. Se houver, usa a combinada.
    const refToUse = mask ? setRefs : ref

    return (
      <div>
        {label && (
          <label className="block mb-2 text-base font-medium text-[#1f2937]" htmlFor={props.name}>
            {label}
          </label>
        )}

        <input
          type={type}
          data-name={props?.name}
          data-slot="input"
          className={cn(
            'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
            'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
            className,
          )}
          ref={refToUse}
          {...props}
        />

        {error?.message && <p className="text-red-500 text-xs italic mt-1">{error.message}</p>}
      </div>
    )
  },
)

Input.displayName = 'Input'

export { Input }
