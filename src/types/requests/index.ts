interface Media {
  id: string
  url?: string
  filename?: string
  mimeType?: string
  filesize?: number
  width?: number
  height?: number
}

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  clinicalPreferences?: {
    passiveAligners?: 'sim_adicione' | 'nao_adicione'
    delayIPRStage?: 'estagio_1' | 'estagio_2' | 'estagio_3' | 'estagio_4'
    maxIPR?: string
    delayAttachmentStage?: 'estagio_1' | 'estagio_2' | 'estagio_3' | 'estagio_4'
    incisalLeveling?: 'nivelar_borda' | 'nao_nivelar'
    elasticChain?: 'sim' | 'nao'
    distalizationOptions?: 'sequencial_50' | 'em_bloco_ate_2mm'
    elasticPositions?: string[]
    specialInstructions?: string
  }
}

export interface Request {
  id: string
  publicId?: string
  orderId?: number
  completionDate?: string
  customer: Customer
  patient: string
  additionalInfo?: string
  documents?: {
    id?: string
    documentName: string
    documentFile: Media
  }[]
  archToTreat: 'none' | 'both' | 'upper' | 'lower'
  upperJawMovementRestriction?: string[]
  lowerJawMovementRestriction?: string[]
  apRelationUpper?: 'improve_canine' | 'improve_canine_and_molar' | 'improve_molar' | 'none'
  apRelationLower?: 'improve_canine' | 'improve_canine_and_molar' | 'improve_molar' | 'none'
  distalizationInstructions?: string
  elasticCutouts?: {
    canineElastic?: 'right' | 'left' | 'both' | 'none'
    canineButton?: 'right' | 'left' | 'both' | 'none'
    molarElastic?: 'right' | 'left' | 'both' | 'none'
    molarButton?: 'right' | 'left' | 'both' | 'none'
  }
  elasticCutoutInstructions?: string
  useAttachments: 'yes' | 'no'
  upperJawNoAttachments?: string[]
  lowerJawNoAttachments?: string[]
  performIPR: 'yes' | 'no' | 'detail_below'
  iprDetails?: string
  diastemaInstructions?: string
  generalInstructions?: string
  sendWhatsappLink: 'yes' | 'no'
  whatsappNumber?: string
  status: 'documentation_check' | 'in_progress' | 'completed'
  trackingLink?: string
  payment?: {
    status: 'not_paid' | 'paid'
    pixUrl?: string
    cardUrl?: string
  }
  tracking?: {
    status: 'not_sent' | 'preparing' | 'sent' | 'delivered'
    carrier?: string
    trackingCode?: string
    trackingUrl?: string
    sentDate?: string
    estimatedArrival?: string
  }
  createdAt: string
  updatedAt: string
}
