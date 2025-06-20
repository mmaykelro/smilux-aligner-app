'use client'
import React, { useTransition, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import RichText from '@/components/rich-text'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import InputGroup from '@/components/input-group'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { FileText, CheckCircle, AlertTriangle } from 'lucide-react'
import {
  REQUIRED_FIELD,
  INVALID_EMAIL,
  PASSWORD_NOT_MATCH,
  INVALID_PHONE,
  INVALID_POSTAL_CODE,
  INVALID_CPF,
  EMAIL_ALREADY_IN_USE,
} from '@/constants/errors'
import { BrazilianStates } from '@/constants/address'
import { validateCPF } from '@/utils/documents'
import { getAddressByCEP } from '@/services/address'
import { login } from '@/services/auth'
import { createCustomerAction } from '@/actions/customer'

const phoneRegex = /^\([1-9]{2}\)\s?9?\d{4}-\d{4}$/

const schema = z
  .object({
    name: z.string().min(1, REQUIRED_FIELD),
    cpf: z.string().min(1, REQUIRED_FIELD).refine(validateCPF, {
      message: INVALID_CPF,
    }),
    email: z.string().email(INVALID_EMAIL).min(1, REQUIRED_FIELD),
    phone: z
      .string({
        required_error: REQUIRED_FIELD,
      })
      .refine((value) => phoneRegex.test(value), {
        message: INVALID_PHONE,
      }),

    cro: z.object({
      number: z.string().min(1, REQUIRED_FIELD),
      state: z.string({
        required_error: REQUIRED_FIELD,
      }),
    }),
    address: z.object({
      postalCode: z.string().min(1, REQUIRED_FIELD),

      street: z.string().min(1, REQUIRED_FIELD),
      number: z.string().min(1, REQUIRED_FIELD),
      complement: z.string().optional(),
      neighborhood: z.string().min(1, REQUIRED_FIELD),
      city: z.string().min(1, REQUIRED_FIELD),
      state: z.string({
        required_error: REQUIRED_FIELD,
      }),
    }),

    password: z.string().min(1, REQUIRED_FIELD),
    passwordConfirmation: z.string().min(1, REQUIRED_FIELD),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: PASSWORD_NOT_MATCH,
    path: ['passwordConfirmation'],
  })

export type SchemaFormData = z.infer<typeof schema>

type Props = {
  termsConditions: object
}

const RegisterForm: React.FC<Props> = ({ termsConditions }) => {
  const [uf, setUf] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [termsRead, setTermsRead] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [isLoading, setTransition] = useTransition()
  const [isLoadingSubmit, setSubmitTransaction] = useTransition()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
    setError,
  } = useForm<SchemaFormData>({
    resolver: zodResolver(schema),
  })

  const { push } = useRouter()

  function handleChangeCroState(value: string) {
    clearErrors('cro.state')
    setValue('cro.state', value)
  }

  function handleChangeState(value: string) {
    clearErrors('address.state')
    setValue('address.state', value)
    setUf(value)
  }

  async function handleBlurCep(e: React.FocusEvent<HTMLInputElement>) {
    setTransition(async () => {
      try {
        const address = await getAddressByCEP(e.target.value)

        clearErrors('address.postalCode')

        clearErrors('address.street')
        clearErrors('address.neighborhood')
        clearErrors('address.state')
        clearErrors('address.city')

        setValue('address.street', address?.logradouro)
        setValue('address.neighborhood', address.bairro)
        setUf(address.uf)
        setValue('address.state', address.uf)
        setValue('address.city', address.localidade)
      } catch (error) {
        setError('address.postalCode', { message: INVALID_POSTAL_CODE })
      }
    })
  }

  const handleTermsModalClose = () => {
    setIsModalOpen(false)
    setTermsRead(true)
  }

  async function onSubmit(values: SchemaFormData) {
    setSubmitTransaction(async () => {
      try {
        const { email, password } = values

        await createCustomerAction(values)
        await login({ email, password })
        push('/preferencias-clinicas-iniciais')
      } catch (error: any) {
        if (error?.message?.includes('email')) {
          setError('email', { message: EMAIL_ALREADY_IN_USE })
        }
        toast.error('Ocorreu um erro inesperado ao tentar cadastrar o cliente.')
      }
    })
  }

  return (
    <form className="flex flex-col gap-4">
      <InputGroup title="Dados pessoais">
        <Input
          {...register('name')}
          errors={errors}
          label="Nome"
          placeholder="Digite seu nome completo"
        />

        <Input
          {...register('cpf')}
          errors={errors}
          label="CPF"
          placeholder="Digite seu número de seu CPF"
          mask="___.___.___-__"
        />

        <Input
          {...register('phone')}
          errors={errors}
          label="Telefone"
          placeholder="Digite seu número de telefone"
          mask="(__) _____-____"
        />
      </InputGroup>

      <InputGroup title="Dados do CRO">
        <Input
          {...register('cro.number')}
          errors={errors}
          label="Número"
          placeholder="Digite o número do seu CRO"
        />

        <Select
          label="Estado"
          {...register('cro.state')}
          errors={errors}
          onValueChange={handleChangeCroState}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma opção" />
          </SelectTrigger>
          <SelectContent>
            {BrazilianStates.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </InputGroup>

      <InputGroup title="Dados do endereço">
        <Input
          {...register('address.postalCode')}
          errors={errors}
          onBlur={handleBlurCep}
          label="CEP"
          placeholder="Digite seu cep"
          disabled={isLoading}
          mask="_____-____"
        />

        <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
          <div className="md:col-span-4">
            <Input
              {...register('address.street')}
              errors={errors}
              label="Rua"
              placeholder="Digite a rua do seu endereço"
              disabled={isLoading}
            />
          </div>
          <Input
            {...register('address.number')}
            errors={errors}
            label="Número"
            placeholder="Digite a número do seu endereço"
            disabled={isLoading}
          />
        </div>

        <Input
          {...register('address.neighborhood')}
          errors={errors}
          label="Bairro"
          placeholder="Digite o seu bairro"
          disabled={isLoading}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="md:col-span-1">
            <Select
              label="Estado"
              {...register('address.state')}
              errors={errors}
              value={uf}
              onValueChange={handleChangeState}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma opção" />
              </SelectTrigger>
              <SelectContent>
                {BrazilianStates.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Input
            {...register('address.city')}
            errors={errors}
            label="Cidade"
            placeholder="Digite sua cidade"
            disabled={isLoading}
            className="md:col-span-"
          />
        </div>

        <Input
          {...register('address.complement')}
          errors={errors}
          label="Complemento"
          placeholder="Digite o complemento do seu endereço caso tiver"
          disabled={isLoading}
        />
      </InputGroup>

      <InputGroup title="Dados de acesso">
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
      </InputGroup>

      <div className="space-y-4">
        <div className="flex items-start space-x-2">
          <Checkbox
            id="terms"
            checked={termsAccepted}
            onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
            disabled={!termsRead}
          />
          <div className="grid gap-1.5 leading-none">
            <Label
              htmlFor="terms"
              className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                !termsRead ? 'text-gray-400' : ''
              }`}
            >
              Aceito os{' '}
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="link" className="p-0 h-auto text-blue-600 underline">
                    Termos de Prestação de Serviços
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-full max-h-[80vh]">
                  <DialogHeader>
                    <DialogTitle className="flex text-center items-center gap-2 text-primary">
                      <FileText className="h-5 w-5" />
                      TERMO DE PRESTAÇÃO DE SERVIÇOS SMILUX ALINHADORES®
                    </DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="h-96 w-full rounded-md border p-4">
                    <RichText data={termsConditions} />
                  </ScrollArea>
                  <div className="flex justify-end gap-2">
                    <Button onClick={handleTermsModalClose}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Li e Compreendi
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </Label>
            {!termsRead && (
              <p className="text-xs text-gray-500">Você deve ler os termos antes de aceitar</p>
            )}
          </div>
        </div>

        {!termsAccepted && termsRead && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Você deve aceitar os termos para continuar com o cadastro.
            </AlertDescription>
          </Alert>
        )}
      </div>

      <Button
        disabled={isLoadingSubmit || !termsAccepted}
        onClick={handleSubmit(onSubmit)}
        className="w-full "
      >
        Criar Conta
      </Button>
    </form>
  )
}

export default RegisterForm
