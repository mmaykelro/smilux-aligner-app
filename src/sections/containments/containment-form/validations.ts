import { z } from 'zod'

const mediaFileSchema = z.object({
  id: z.number().or(z.string()),
})

export const formSchema = z.object({
  patient: z.string(),
  documents: z
    .array(
      z.object({
        documentName: z.string().min(1, 'Nome do documento é obrigatório'),
        documentFile: z
          .union([z.instanceof(File, { message: 'Por favor, anexe um arquivo.' }), mediaFileSchema])
          .optional(),
      }),
    )
    .optional()
    .superRefine((documents, ctx) => {
      if (!documents) {
        return
      }

      const requiredDocNames = ['Arcada Superior', 'Arcada Inferior']

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
})

export type FormDataSchema = z.infer<typeof formSchema>
