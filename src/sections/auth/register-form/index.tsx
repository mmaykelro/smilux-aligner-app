'use client'
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { REQUIRED_FIELD, INVALID_EMAIL, PASSWORD_NOT_MATCH } from '@/constants/errors'

const schema = z
  .object({
    name: z.string().min(1, REQUIRED_FIELD),
    email: z.string().email(INVALID_EMAIL).min(1, REQUIRED_FIELD),
    password: z.string().min(1, REQUIRED_FIELD),
    passwordConfirmation: z.string().min(1, REQUIRED_FIELD),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: PASSWORD_NOT_MATCH,
    path: ['passwordConfirmation'],
  })

type SchemaFormData = z.infer<typeof schema>

const RegisterForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SchemaFormData>({
    resolver: zodResolver(schema),
  })

  function onSubmit(values: SchemaFormData) {
    console.log(values)
  }

  return (
    <form className="flex flex-col gap-4">
      <Input
        {...register('name')}
        errors={errors}
        label="Nome"
        placeholder="Digite seu nome completo"
      />
      <Input
        {...register('email')}
        errors={errors}
        label="E-mail"
        placeholder="Digite seu endereço de e-mail"
      />
      <Input
        {...register('password')}
        errors={errors}
        label="Senha"
        type="password"
        placeholder="Digite sua senha"
      />
      <Input
        {...register('passwordConfirmation')}
        errors={errors}
        label="Confirmar senha"
        type="password"
        placeholder="Confirme sua senha"
      />
      <Button
        onClick={handleSubmit(onSubmit)}
        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
      >
        Criar Conta
      </Button>
    </form>
  )
}

export default RegisterForm
