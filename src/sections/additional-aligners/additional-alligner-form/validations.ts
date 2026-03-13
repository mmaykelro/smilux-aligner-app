import { z } from 'zod'
import { REQUIRED_FIELD } from '@/constants/errors'
import { alignerNumbers } from '@/sections/additional-aligners/additional-alligner-form/constants'

export const formSchema = z.object({
  patient: z.string().min(1, REQUIRED_FIELD),
  alignerType: z.enum(['upper', 'lower'], { required_error: REQUIRED_FIELD }),
  alignerNumber: z.enum(alignerNumbers as [string, ...string[]], {
    required_error: REQUIRED_FIELD,
  }),
})

export type FormData = z.infer<typeof formSchema>
