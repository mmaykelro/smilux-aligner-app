import React from 'react'

interface InputGroupProps {
  title: string
  children: React.ReactNode
}

const InputGroup: React.FC<InputGroupProps> = ({ title, children }) => (
  <div className="grid gap-2">
    <h2 className="text-base/7 font-semibold text-gray-900">{title}</h2>
    <hr />
    <div className="flex flex-col gap-2">{children}</div>
  </div>
)

export default InputGroup
