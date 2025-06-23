'use client'
import type React from 'react'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Camera, Save, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import LoadingScreen from '@/components/loading-screen'
import { updateCustomerAction } from '@/actions/customer'

export const profileSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(50, 'Nome deve ter no máximo 50 caracteres'),
  email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
  profileImage: z.any().optional(),
})

export type ProfileFormData = z.infer<typeof profileSchema>

interface ProfileFormProps {
  initialData?: {
    name: string
    email: string
    profileImage?: {
      url: string
      alt?: string
      id?: number
    }
  }
}

export default function ProfileForm({ initialData }: ProfileFormProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(
    initialData?.profileImage?.url || null,
  )
  const [isLoading, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: initialData?.name || '',
      email: initialData?.email || '',
    },
  })

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
      setValue('profileImage', file)
    }
  }

  const removeImage = () => {
    setPreviewImage(null)
    setValue('profileImage', undefined)
    //@ts-ignore
    document.getElementById('profileImage').value = ''
  }

  const onSubmit = async (data: ProfileFormData) => {
    const values = {
      ...initialData,
      ...data,
    }

    startTransition(async () => {
      try {
        await updateCustomerAction(values)

        toast.success('Perfil atualizado com sucesso!')
      } catch {
        toast.error('Erro ao atualizar perfil. Tente novamente mais tarde.')
      }
    })
  }

  const watchedName = watch('name')

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-800">Atualizar Perfil</CardTitle>
        <p className="text-gray-600">Atualize suas informações pessoais e foto de perfil.</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Foto do Perfil */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="w-32 h-32">
                <AvatarImage src={previewImage || undefined} />
                <AvatarFallback className="text-2xl">
                  {watchedName ? watchedName.charAt(0).toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
              {previewImage && (
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Label htmlFor="profileImage" className="cursor-pointer">
                <div className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                  <Camera className="w-4 h-4" />
                  <span>Alterar Foto</span>
                </div>
              </Label>
              <Input
                id="profileImage"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          </div>

          {/* Nome */}
          <Input
            label="Nome Completo"
            id="name"
            {...register('name')}
            placeholder="Digite seu nome completo"
            errors={errors}
          />

          {/* Email */}
          <Input
            label="Email"
            id="email"
            type="email"
            {...register('email')}
            placeholder="Digite seu email"
            errors={errors}
          />

          {/* Botões */}
          <div className="flex space-x-4 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-500 hover:bg-blue-600"
            >
              <div className="flex items-center space-x-2">
                <Save className="w-4 h-4" />
                <span>Salvar Alterações</span>
              </div>
            </Button>
          </div>
        </form>
      </CardContent>

      {isLoading && <LoadingScreen isVisible={isLoading} />}
    </Card>
  )
}
