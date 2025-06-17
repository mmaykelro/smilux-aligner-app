'use client'
import React, { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { REQUIRED_FIELD, INVALID_EMAIL } from '@/constants/errors'
import { login } from '@/services/auth'
import { getCustomerAction } from '@/actions/customer'

const schema = z.object({
  email: z.string().email(INVALID_EMAIL).min(1, REQUIRED_FIELD),
  password: z.string().min(1, REQUIRED_FIELD),
})

type SchemaFormData = z.infer<typeof schema>

const LoginForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SchemaFormData>({
    resolver: zodResolver(schema),
  })

  const [isPenging, startTransition] = useTransition()

  const { push } = useRouter()

  async function onSubmit(values: SchemaFormData) {
    startTransition(async () => {
      try {
        await login(values)

        const user = await getCustomerAction()

        if (user?.isActive) {
          if (!user?.isRegisterComplete) {
            push('/preferencias-clinicas-iniciais')

            return
          }

          push('/')

          return
        }

        if (!user?.isRegisterComplete) {
          push('/preferencias-clinicas-iniciais')

          return
        }

        push('/aguardando-aprovacao')
      } catch (error) {
        toast.error('E-mail ou senha inválidos')
      }
    })
  }

  return (
    <form className="flex flex-col gap-4">
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
      <Button onClick={handleSubmit(onSubmit)} className="w-full  " disabled={isPenging}>
        Entrar
      </Button>
    </form>
  )
}

export default LoginForm
