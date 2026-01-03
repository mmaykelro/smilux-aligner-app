import { z } from 'zod'

export const validations = z.object({
  passiveAligners: z.string().min(1, 'Selecione uma opção para alinhadores passivos'),
  delayIPRStage: z.string().min(1, 'Selecione uma opção para atraso do IPR'),
  delayAttachmentStage: z.string().min(1, 'Selecione uma opção para atraso do attachment'),
  maxIPR: z.string().optional(),
  incisalLeveling: z.string().min(1, 'Selecione uma opção para nivelamento dos incisivos'),
  elasticChain: z.string().min(1, 'Selecione uma opção para cadeia elástica'),
  distalizationOptions: z.string().min(1, 'Selecione uma opção de distalização'),
  elasticPositions: z.array(z.string()).optional(),
  specialInstructions: z.string().optional(),
})

export type FormSchema = z.infer<typeof validations>
