'use client'
import React from 'react'
import { useField } from '@payloadcms/ui'

export const MaskedPhoneInput: React.FC<any> = (props) => {
  const { path, field, readOnly } = props
  const { label, required } = field
  const { value, setValue, showError, errorMessage } = useField<string>({ path })

  const formatPhoneNumber = (value: string): string => {
    const cleaned = value.replace(/\D/g, '')
    const limited = cleaned.substring(0, 11)
    let result = limited
    if (limited.length > 2) {
      result = `(${limited.substring(0, 2)}) ${limited.substring(2)}`
    }
    if (limited.length > 7) {
      result = `(${limited.substring(0, 2)}) ${limited.substring(2, 7)}-${limited.substring(7, 11)}`
    }
    return result
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhoneNumber(e.target.value)
    setValue(formattedValue)
  }

  return (
    <div className="field-type text">
      <label className="field-label" htmlFor={path}>
        {label}
        {required && <span className="required">*</span>}
      </label>

      <input
        disabled={readOnly}
        maxLength={15}
        value={value || ''}
        onChange={handleChange}
        className="input"
      />

      {showError && (
        <div
          style={{
            color: 'rgb(182, 54, 54)',
          }}
          className="error-message"
        >
          {errorMessage}
        </div>
      )}
    </div>
  )
}
