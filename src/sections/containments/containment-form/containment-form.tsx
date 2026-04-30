'use client'
import { Containment } from '@/payload-types'
import { useRouter } from 'next/navigation'
import { useTransition, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import LoadingScreen from '@/components/loading-screen'
import { Send, Trash2 } from 'lucide-react'
import { getPatientsAction } from '@/actions/patients'
import { createContainmentAction, updateContainmentAction } from '@/actions/containments'
import { formSchema, FormDataSchema } from './validations'

export default function ContainmentForm({ containment }: { containment?: Containment }) {
  const CREATE_NEW_VALUE = '__create_new__'
  const REMOVE_PATIENT_VALUE = '__remove_patient__'

  const { push } = useRouter()

  const [isCreatingPatient, setIsCreatingPatient] = useState(false)
  const [isLoading, startTransition] = useTransition()

  const { data: patients } = useQuery({
    queryKey: ['patients'],
    queryFn: getPatientsAction,
    initialData: [],
  })

  const form = useForm<FormDataSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patient: containment?.patient || '',
      documents: (containment?.documents as []) || [
        {
          documentName: 'Arcada Superior',
        },
        {
          documentName: 'Arcada Inferior',
        },
      ],
    },
  })

  const {
    watch,
    handleSubmit,
    formState: { errors },
  } = form

  function handleRemoveDocument({ field, document }: any) {
    const newDocuments = field.value?.map((item: any) => {
      if (item.documentName === document.documentName) {
        return {
          ...item,
          documentFile: null,
        }
      }

      return item
    })

    field.onChange(newDocuments)
  }

  function onSubmit(data: FormDataSchema) {
    startTransition(async () => {
      try {
        const formData = new FormData()
        const documentsWithFiles = data.documents || []

        const filesToUpload = documentsWithFiles
          .filter((doc) => {
            return doc.documentFile instanceof File
          })
          .map((document) => document.documentFile)

        const documentsForJson = documentsWithFiles.map((doc) => {
          if (doc.documentFile instanceof File) {
            return { documentName: doc.documentName, documentFile: { name: doc.documentFile.name } }
          }
          return doc
        })

        const jsonData = {
          ...containment,
          ...data,
          documents: documentsForJson,
        }

        formData.append('jsonData', JSON.stringify(jsonData))
        filesToUpload.forEach((file) => {
          //@ts-ignore
          formData.append('files', file)
        })

        if (!!containment) {
          await updateContainmentAction(formData, containment.id)
          toast.success('Solicitação de contenção atualizada com sucesso!')
        } else {
          await createContainmentAction(formData)
          toast.success('Solicitação de contenção realizada com sucesso!')
        }

        push('/contencoes')
      } catch {
        toast.error(
          'Houve um erro ao tentar realizar a sua solicitação! Por favor tente novamente.',
        )
      }
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 lg:py-6 lg:px-20">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Paciente</CardTitle>
                <CardDescription>
                  Selecione ou crie um novo paciente (Campo não obrigatório)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="patient"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Selecione o paciente</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          if (value === CREATE_NEW_VALUE) {
                            setIsCreatingPatient(true)
                            field.onChange('')

                            return
                          }

                          if (value === REMOVE_PATIENT_VALUE) {
                            setIsCreatingPatient(false)
                            field.onChange('')
                            return
                          }

                          setIsCreatingPatient(false)
                          field.onChange(value)
                        }}
                        value={isCreatingPatient ? CREATE_NEW_VALUE : field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {patients.map(({ id, patient }) => (
                            <SelectItem key={id} value={patient}>
                              {patient}
                            </SelectItem>
                          ))}
                          <SelectItem value={REMOVE_PATIENT_VALUE}>
                            <Button variant="destructive">Remover paciente</Button>
                          </SelectItem>

                          <SelectItem value={CREATE_NEW_VALUE}>
                            <Button size="sm" variant="success">
                              Criar novo paciente
                            </Button>
                          </SelectItem>
                        </SelectContent>
                      </Select>

                      {/* INPUT CONDICIONAL */}
                      {isCreatingPatient && (
                        <div className="mt-4">
                          <FormLabel>Nome do novo paciente</FormLabel>
                          <Input
                            placeholder="Digite o nome do paciente"
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Documentos Anexados</CardTitle>
                <CardDescription>Anexe documentos relevantes para o tratamento</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="documents"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Documentos</FormLabel>
                      <div className="space-y-4">
                        {field.value?.map((document: any, index) => (
                          <div key={index} className="border rounded-lg p-4 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label className="mt-6 text-base font-medium">
                                  {document.documentName}
                                </Label>
                                <Input
                                  disabled
                                  className="hidden"
                                  id={`document-name-${index}`}
                                  name={`documents.${index}.documentName`}
                                  placeholder="Ex: Radiografia panorâmica"
                                  value={document.documentName || ''}
                                  onChange={(e) => {
                                    const newDocuments = [...(field.value || [])]
                                    newDocuments[index] = {
                                      ...newDocuments[index],
                                      documentName: e.target.value,
                                    }
                                    field.onChange(newDocuments)
                                  }}
                                  errors={errors}
                                />
                              </div>

                              <div>
                                <Input
                                  label={
                                    <div className="flex flex-row justify-between">
                                      <span>{`Arquivo - ${document.documentName}`}</span>

                                      {!!watch(`documents.${index}.documentFile`) &&
                                        !containment && (
                                          <Tooltip>
                                            <TooltipTrigger>
                                              <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                disabled={!!containment}
                                                onClick={() =>
                                                  handleRemoveDocument({
                                                    field,
                                                    document,
                                                  })
                                                }
                                              >
                                                <Trash2 className="h-4 w-4" />
                                              </Button>
                                            </TooltipTrigger>

                                            <TooltipContent>
                                              Remover arquivo: {document.documentName}
                                            </TooltipContent>
                                          </Tooltip>
                                        )}
                                    </div>
                                  }
                                  id={`document-file-${index}`}
                                  name={`documents.${index}.documentFile`}
                                  type="file"
                                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                  errors={errors}
                                  onClick={(event: React.MouseEvent<HTMLInputElement>) => {
                                    ;(event.target as HTMLInputElement).value = ''
                                  }}
                                  onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) {
                                      const newDocuments = [...(field.value || [])]
                                      newDocuments[index] = {
                                        ...newDocuments[index],
                                        documentFile: file,
                                      }
                                      field.onChange(newDocuments)
                                    }
                                  }}
                                  disabled={!!containment}
                                />
                                {document.documentFile && (
                                  <p className="text-sm text-gray-500 mt-1">
                                    Arquivo:
                                    {
                                      //@ts-ignore
                                      document.documentFile.name ||
                                        //@ts-ignore
                                        document.documentFile.filename ||
                                        'Arquivo anexado'
                                    }
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-4">
              <Button
                className="w-full md:w-fit"
                disabled={isLoading || containment?.status === 'completed'}
                type="submit"
              >
                <Send className="h-4 w-4 mr-2" />
                {!!containment
                  ? 'Editar e reenviar solicitação de contenção'
                  : 'Enviar solicitação de contenção'}
              </Button>
            </div>
          </form>
        </Form>
      </div>

      {isLoading && <LoadingScreen isVisible={isLoading} />}
    </div>
  )
}
