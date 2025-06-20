'use client'
import { useRouter } from 'next/navigation'
import { useTransition, useEffect } from 'react'
import { useForm, FieldErrors } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Send } from 'lucide-react'
import { createRequestAction, updateRequestAction } from '@/actions/requests'
import { REQUIRED_FIELD } from '@/constants/errors'

const upperTeeth = [
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '21',
  '22',
  '23',
  '24',
  '25',
  '26',
  '27',
]

const lowerTeeth = [
  '31',
  '32',
  '33',
  '34',
  '35',
  '36',
  '37',
  '38',
  '41',
  '42',
  '43',
  '44',
  '45',
  '46',
  '47',
]

const phoneRegex = /^\([1-9]{2}\)\s?9?\d{4}-\d{4}$/

const mediaFileSchema = z.object({
  id: z.number().or(z.string()),
  alt: z.string(),
  updatedAt: z.string().datetime(),
  createdAt: z.string().datetime(),
  url: z.string(),
  thumbnailURL: z.string().nullable(),
  filename: z.string(),
  mimeType: z.string().nullable(),
  filesize: z.number().nullable(),
  width: z.number().nullable(),
  height: z.number().nullable(),
  focalX: z.number().optional(),
  focalY: z.number().optional(),
})

const formSchema = z
  .object({
    patient: z.string().min(1, 'Nome do paciente é obrigatório'),
    documents: z
      .array(
        z.object({
          documentName: z.string().min(1, 'Nome do documento é obrigatório'),
          documentFile: z
            .union([
              z.instanceof(File, { message: 'Por favor, anexe um arquivo.' }),
              mediaFileSchema,
            ])
            .optional(),
        }),
      )
      .optional()
      .superRefine((documents, ctx) => {
        if (!documents) {
          return
        }

        const requiredDocNames = [
          'Radiografia panorâmica',
          'Telerradiografia',
          'Arquivo STL da arcada superior',
          'Arquivo STL da arcada inferior',
        ]

        documents.forEach((doc, index) => {
          const isRequired = requiredDocNames.includes(doc.documentName)

          if (isRequired && !doc.documentFile) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `O arquivo para "${doc.documentName}" é obrigatório.`,
              path: [index, 'documentFile'],
            })
          }
        })
      }),
    archToTreat: z.enum(['both', 'upper', 'lower', 'none'], {
      required_error: 'Selecione qual arcada tratar',
    }),
    upperJawMovementRestriction: z.array(z.string()).optional(),
    lowerJawMovementRestriction: z.array(z.string()).optional(),
    apRelationUpper: z
      .enum(['improve_canine', 'improve_canine_and_molar', 'improve_molar', 'none'])
      .optional(),
    apRelationLower: z
      .enum(['improve_canine', 'improve_canine_and_molar', 'improve_molar', 'none'])
      .optional(),
    distalizationInstructions: z.string().optional(),
    elasticCutouts: z.object({
      canineElastic: z.enum(['right', 'left', 'both', 'none']),
      canineButton: z.enum(['right', 'left', 'both', 'none']),
      molarElastic: z.enum(['right', 'left', 'both', 'none']),
      molarButton: z.enum(['right', 'left', 'both', 'none']),
    }),
    elasticCutoutInstructions: z.string().optional(),
    useAttachments: z.enum(['yes', 'no'], {
      required_error: 'Selecione se deseja usar attachments',
    }),
    upperJawNoAttachments: z.array(z.string()).optional(),
    lowerJawNoAttachments: z.array(z.string()).optional(),
    performIPR: z.enum(['yes', 'no', 'detail_below'], {
      required_error: 'Selecione se deseja fazer IPR',
    }),
    iprDetails: z.string().optional(),
    additionalInfo: z.string().optional(),
    diastemaInstructions: z.string().optional(),
    generalInstructions: z.string().min(1, REQUIRED_FIELD),
    sendWhatsappLink: z.enum(['yes', 'no'], {
      required_error: 'Selecione se deseja receber link no WhatsApp',
    }),
    whatsappNumber: z
      .string()
      .optional()
      .refine((val) => !val || phoneRegex.test(val), {
        message: 'Número do WhatsApp deve estar no formato (99) 99999-9999',
      }),
  })
  .refine(
    (data) => {
      if (data.performIPR === 'detail_below') {
        return !!data.iprDetails?.length
      }

      return true
    },
    {
      message: 'Os detalhes do IPR são obrigatórios quando esta opção é selecionada.',
      path: ['iprDetails'],
    },
  )
  .refine(
    (data) => {
      if (data.sendWhatsappLink === 'yes' && !data.whatsappNumber) {
        return false
      }
      return true
    },
    {
      message: "Número do WhatsApp é obrigatório quando selecionado 'Sim'",
      path: ['whatsappNumber'],
    },
  )
  .refine((data) => {
    if (data.archToTreat === 'none') {
      return true
    }
  })
  .refine(
    (data) => {
      if (
        (data.archToTreat === 'upper' || data.archToTreat === 'both') &&
        (!data.upperJawMovementRestriction || data.upperJawMovementRestriction.length === 0)
      ) {
        return false
      }
      return true
    },
    {
      message:
        "Selecione pelo menos um dente para restrição de movimento na arcada superior ou marque 'Nenhum'",
      path: ['upperJawMovementRestriction'],
    },
  )
  .refine(
    (data) => {
      if (
        (data.archToTreat === 'lower' || data.archToTreat === 'both') &&
        (!data.lowerJawMovementRestriction || data.lowerJawMovementRestriction.length === 0)
      ) {
        return false
      }
      return true
    },
    {
      message:
        "Selecione pelo menos um dente para restrição de movimento na arcada inferior ou marque 'Nenhum'",
      path: ['lowerJawMovementRestriction'],
    },
  )

export type RequestFormData = z.infer<typeof formSchema>

const RequestForm: React.FC<{ request?: RequestFormData & { status: string; id: number } }> = ({
  request,
}) => {
  const form = useForm<RequestFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      archToTreat: undefined,
      apRelationUpper: request?.apRelationLower || 'none',
      apRelationLower: request?.apRelationLower || 'none',
      elasticCutouts: {
        canineElastic: request?.elasticCutouts?.canineElastic || 'none',
        canineButton: request?.elasticCutouts?.canineButton || 'none',
        molarElastic: request?.elasticCutouts?.molarElastic || 'none',
        molarButton: request?.elasticCutouts?.molarButton || 'none',
      },
      upperJawMovementRestriction: [],
      lowerJawMovementRestriction: [],
      upperJawNoAttachments: [],
      lowerJawNoAttachments: [],
      distalizationInstructions: request?.distalizationInstructions || '',
      elasticCutoutInstructions: request?.elasticCutoutInstructions || '',
      diastemaInstructions: request?.diastemaInstructions || '',
      iprDetails: request?.iprDetails || '',
      generalInstructions: request?.generalInstructions || '',
      additionalInfo: request?.additionalInfo || '',
      sendWhatsappLink: request?.sendWhatsappLink,
      whatsappNumber: request?.whatsappNumber || '',
      documents: request?.documents || [
        {
          documentName: 'Radiografia panorâmica',
        },
        {
          documentName: 'Telerradiografia',
        },
        {
          documentName: 'Arquivo STL da arcada superior',
        },
        {
          documentName: 'Arquivo STL da arcada inferior',
        },
        {
          documentName: 'Outros',
        },
      ],
    },
  })

  const {
    watch,
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = form

  const onFormError = (formErrors: FieldErrors<RequestFormData>) => {
    const firstErrorField = Object.keys(formErrors)[0]

    if (firstErrorField) {
      const element = document.querySelector(`[name="${firstErrorField}"]`) as HTMLElement

      if (firstErrorField === 'documents' && formErrors.documents?.message) {
      } else if (firstErrorField === 'documents') {
        const errorIndex = (formErrors.documents as any).findIndex((err: any) => !!err)
        const errorFieldInArray = Object.keys((formErrors.documents as any)[errorIndex])[0]
        const elementName = `documents.${errorIndex}.${errorFieldInArray}`
        const elementInArray = document.querySelector(`[name="${elementName}"]`) as HTMLElement
        if (elementInArray) {
          elementInArray.focus({ preventScroll: true })
          elementInArray.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      } else if (element) {
        element.focus({ preventScroll: true })
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }

  const watchedValues = watch()

  const { push } = useRouter()

  const [isLoading, startTransition] = useTransition()

  const onSubmit = (data: RequestFormData) => {
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
          ...request,
          ...data,
          documents: documentsForJson,
        }

        formData.append('jsonData', JSON.stringify(jsonData))
        filesToUpload.forEach((file) => {
          //@ts-ignore
          formData.append('files', file)
        })

        if (!!request) {
          await updateRequestAction(formData, request.id)
        } else {
          await createRequestAction(formData)
        }

        push('/solicitacoes')
      } catch {}
    })
  }

  const shouldShowUpperFields =
    watchedValues.archToTreat === 'upper' || watchedValues.archToTreat === 'both'
  const shouldShowLowerFields =
    watchedValues.archToTreat === 'lower' || watchedValues.archToTreat === 'both'

  useEffect(() => {
    if (request) {
      form.reset(request)

      const element = document?.querySelector(`[name="additionalInfo"]`) as HTMLElement

      element.focus({ preventScroll: true })
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [request])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Form Content */}
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit, onFormError)} className="space-y-8">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
                <CardDescription>Dados do paciente</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Input
                  label="Paciente"
                  placeholder="Digite o nome completo do paciente"
                  {...register('patient')}
                  errors={errors}
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
                        {field.value?.map((document, index) => (
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
                                  label={`Arquivo - ${document.documentName}`}
                                  id={`document-file-${index}`}
                                  name={`documents.${index}.documentFile`}
                                  type="file"
                                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                  errors={errors}
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

            {/* Treatment Definitions */}
            <Card>
              <CardHeader>
                <CardTitle>Definições do Tratamento</CardTitle>
                <CardDescription>Configure as arcadas e restrições de movimento</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={control}
                  name="archToTreat"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Tratar arcada</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex flex-col space-y-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="none" id="none" />
                            <Label htmlFor="none">Nenhum</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="both" id="both" />
                            <Label htmlFor="both">Ambos</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="upper" id="upper" />
                            <Label htmlFor="upper">Superior</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="lower" id="lower" />
                            <Label htmlFor="lower">Inferior</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {shouldShowUpperFields && (
                  <FormField
                    control={control}
                    name="upperJawMovementRestriction"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Restrição de movimento ortodôntico SUPERIOR</FormLabel>
                        <FormDescription>
                          Selecione algum dente que NÃO deseje movimentar na arcada SUPERIOR
                          (implante, anquilose, prótese, etc).
                        </FormDescription>
                        <div className="grid grid-cols-6 gap-2">
                          {upperTeeth.map((tooth) => (
                            <div key={tooth} className="flex items-center space-x-2">
                              <Checkbox
                                id={`upper-${tooth}`}
                                checked={field.value?.includes(tooth)}
                                onCheckedChange={(checked) => {
                                  const current = field.value || []
                                  if (checked) {
                                    field.onChange([...current, tooth])
                                  } else {
                                    field.onChange(current.filter((t) => t !== tooth))
                                  }
                                }}
                              />
                              <Label htmlFor={`upper-${tooth}`} className="text-sm">
                                {tooth}
                              </Label>
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {shouldShowLowerFields && (
                  <FormField
                    control={control}
                    name="lowerJawMovementRestriction"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Restrição de movimento ortodôntico INFERIOR</FormLabel>
                        <FormDescription>
                          Selecione algum dente que NÃO deseje movimentar na arcada INFERIOR
                          (implante, anquilose, prótese, etc).
                        </FormDescription>
                        <div className="grid grid-cols-6 gap-2">
                          {lowerTeeth.map((tooth) => (
                            <div key={tooth} className="flex items-center space-x-2">
                              <Checkbox
                                id={`lower-${tooth}`}
                                checked={field.value?.includes(tooth)}
                                onCheckedChange={(checked) => {
                                  const current = field.value || []
                                  if (checked) {
                                    field.onChange([...current, tooth])
                                  } else {
                                    field.onChange(current.filter((t) => t !== tooth))
                                  }
                                }}
                              />
                              <Label htmlFor={`lower-${tooth}`} className="text-sm">
                                {tooth}
                              </Label>
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </CardContent>
            </Card>

            {/* A-P Relations and Elastics */}
            <Card>
              <CardHeader>
                <CardTitle>Relação A-P e Elásticos</CardTitle>
                <CardDescription>
                  Configure as relações ântero-posteriores e recortes para elásticos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {shouldShowUpperFields && (
                  <FormField
                    control={form.control}
                    name="apRelationUpper"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Relação ântero-posterior (A-P) - Arcada Superior</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="flex flex-col space-y-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="improve_canine" id="improve_canine_upper" />
                              <Label htmlFor="improve_canine_upper">
                                Melhorar relação de canino
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="improve_canine_and_molar"
                                id="improve_canine_and_molar_upper"
                              />
                              <Label htmlFor="improve_canine_and_molar_upper">
                                Melhorar relação de canino e molar
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="improve_molar" id="improve_molar_upper" />
                              <Label htmlFor="improve_molar_upper">Melhorar relação de molar</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="none" id="none_upper" />
                              <Label htmlFor="none_upper">Nenhuma</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {shouldShowLowerFields && (
                  <FormField
                    control={form.control}
                    name="apRelationLower"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Relação ântero-posterior (A-P) - Arcada Inferior</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="flex flex-col space-y-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="improve_canine" id="improve_canine_lower" />
                              <Label htmlFor="improve_canine_lower">
                                Melhorar relação de canino
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="improve_canine_and_molar"
                                id="improve_canine_and_molar_lower"
                              />
                              <Label htmlFor="improve_canine_and_molar_lower">
                                Melhorar relação de canino e molar
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="improve_molar" id="improve_molar_lower" />
                              <Label htmlFor="improve_molar_lower">Melhorar relação de molar</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="none" id="none_lower" />
                              <Label htmlFor="none_lower">Nenhuma</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="distalizationInstructions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Orientações específicas de distalização</FormLabel>
                      <FormDescription>
                        Detalhes sobre a distalização &quot;2 by 2&quot; ou em bloco de no máximo
                        2mm.
                      </FormDescription>
                      <FormControl>
                        <Textarea placeholder="Descreva as orientações específicas..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <h4 className="font-medium">Recortes para elástico ou colagem de botões</h4>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="elasticCutouts.canineElastic"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CUT para ELÁSTICO no canino</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="right">Direito</SelectItem>
                              <SelectItem value="left">Esquerdo</SelectItem>
                              <SelectItem value="both">Ambos</SelectItem>
                              <SelectItem value="none">Nenhum</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="elasticCutouts.canineButton"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CUT para BOTÃO no canino</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="right">Direito</SelectItem>
                              <SelectItem value="left">Esquerdo</SelectItem>
                              <SelectItem value="both">Ambos</SelectItem>
                              <SelectItem value="none">Nenhum</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="elasticCutouts.molarElastic"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CUT para ELÁSTICO no molar</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="right">Direito</SelectItem>
                              <SelectItem value="left">Esquerdo</SelectItem>
                              <SelectItem value="both">Ambos</SelectItem>
                              <SelectItem value="none">Nenhum</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="elasticCutouts.molarButton"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CUT para BOTÃO no molar</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="right">Direito</SelectItem>
                              <SelectItem value="left">Esquerdo</SelectItem>
                              <SelectItem value="both">Ambos</SelectItem>
                              <SelectItem value="none">Nenhum</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="elasticCutoutInstructions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Orientações específicas dos recortes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descreva as orientações específicas dos recortes..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Attachments and IPR */}
            <Card>
              <CardHeader>
                <CardTitle>Attachments e IPR</CardTitle>
                <CardDescription>Configure attachments e redução interproximal</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="useAttachments"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Attachments</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex flex-col space-y-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="attachments_yes" />
                            <Label htmlFor="attachments_yes">Sim. Conforme necessário.</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="attachments_no" />
                            <Label htmlFor="attachments_no">Não</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {watchedValues.useAttachments === 'yes' && shouldShowUpperFields && (
                  <FormField
                    control={form.control}
                    name="upperJawNoAttachments"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          NÃO colocar attachments nos seguintes dentes superiores
                        </FormLabel>
                        <div className="grid grid-cols-6 gap-2">
                          {upperTeeth.map((tooth) => (
                            <div key={tooth} className="flex items-center space-x-2">
                              <Checkbox
                                id={`no-attach-upper-${tooth}`}
                                checked={field.value?.includes(tooth)}
                                onCheckedChange={(checked) => {
                                  const current = field.value || []
                                  if (checked) {
                                    field.onChange([...current, tooth])
                                  } else {
                                    field.onChange(current.filter((t) => t !== tooth))
                                  }
                                }}
                              />
                              <Label htmlFor={`no-attach-upper-${tooth}`} className="text-sm">
                                {tooth}
                              </Label>
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {watchedValues.useAttachments === 'yes' && shouldShowLowerFields && (
                  <FormField
                    control={form.control}
                    name="lowerJawNoAttachments"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          NÃO colocar attachments nos seguintes dentes inferiores
                        </FormLabel>
                        <div className="grid grid-cols-6 gap-2">
                          {lowerTeeth.map((tooth) => (
                            <div key={tooth} className="flex items-center space-x-2">
                              <Checkbox
                                id={`no-attach-lower-${tooth}`}
                                checked={field.value?.includes(tooth)}
                                onCheckedChange={(checked) => {
                                  const current = field.value || []
                                  if (checked) {
                                    field.onChange([...current, tooth])
                                  } else {
                                    field.onChange(current.filter((t) => t !== tooth))
                                  }
                                }}
                              />
                              <Label htmlFor={`no-attach-lower-${tooth}`} className="text-sm">
                                {tooth}
                              </Label>
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="performIPR"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Fazer redução interproximal (IPR)?</FormLabel>
                      <FormDescription>Limite padrão de 0,5mm entre as faces.</FormDescription>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex flex-col space-y-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="ipr_yes" />
                            <Label htmlFor="ipr_yes">
                              Sim. Conforme necessário (Limite de 0,5mm).
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="ipr_no" />
                            <Label htmlFor="ipr_no">Não</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="detail_below" id="ipr_detail" />
                            <Label htmlFor="ipr_detail">Detalhar IPR abaixo</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {watchedValues.performIPR === 'detail_below' && (
                  <>
                    <FormLabel>Detalhes do IPR</FormLabel>
                    <FormDescription>
                      Caso deseje, detalhe a região exata de onde fazer (IPR). Por exemplo: fazer
                      IPR de 0,3mm entre os dentes 44 e 45.
                    </FormDescription>
                    <Textarea
                      {...register('iprDetails')}
                      errors={errors}
                      placeholder="Descreva os detalhes do IPR..."
                    />

                    <FormMessage />
                  </>
                )}
              </CardContent>
            </Card>

            {/* Final Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>Instruções Finais</CardTitle>
                <CardDescription>Orientações gerais e configurações de comunicação</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="diastemaInstructions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instruções para Diastemas</FormLabel>
                      <FormDescription>
                        No caso de presença de DIASTEMAS não visualizados no escaneamento, por favor
                        descrever exatamente a região a ser movimentada. Por exemplo: fechar
                        diastema de 0,2mm entre os dentes 16 e 17.
                      </FormDescription>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva as instruções para diastemas..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="generalInstructions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Orientações gerais de tratamento</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Descreva as orientações gerais..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sendWhatsappLink"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>
                        Enviar link no whatsapp para visualização do planejamento virtual?
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex flex-col space-y-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="whatsapp_yes" />
                            <Label htmlFor="whatsapp_yes">Sim</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="whatsapp_no" />
                            <Label htmlFor="whatsapp_no">Não</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {watchedValues.sendWhatsappLink === 'yes' && (
                  <Input
                    {...register('whatsappNumber')}
                    errors={errors}
                    label="Qual o seu whatsapp com DDD?"
                    placeholder="Digite seu número do whatsapp"
                    mask="(__) _____-____"
                    defaultValue=""
                  />
                )}

                {!!request && (
                  <Textarea
                    label="Informações adicionais"
                    placeholder="Descreva o que mais precisa ser alterado..."
                    {...register('additionalInfo')}
                  />
                )}
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Button
                disabled={isLoading || request?.status === 'completed'}
                type="submit"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="h-4 w-4 mr-2" />
                {!!request ? 'Editar e reenviar solicitação' : 'Enviar solicitação'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default RequestForm
