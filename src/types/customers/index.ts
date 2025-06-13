export interface CRO {
  number: string
  state: string
}

export interface Address {
  postalCode: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
}

export interface ClinicalPreferences {
  passiveAligners?: 'sim_adicione' | 'nao_mas_crie' | 'nenhuma'
  delayIPRStage?: 'nao_atrase' | 'estagio_1' | 'estagio_2' | 'estagio_3' | 'estagio_4' | 'estagio_5'
  maxIPR?: string
  delayAttachmentStage?:
    | 'nao_atrase'
    | 'estagio_1'
    | 'estagio_2'
    | 'estagio_3'
    | 'estagio_4'
    | 'estagio_5'
  incisalLeveling?:
    | 'nivelar_borda'
    | 'nivelar_laterais_centrais'
    | 'laterais_05mm'
    | 'margem_gengival'
  elasticChain?: 'nao' | 'sim_3_3' | 'sim_6_6'
  distalizationOptions?: 'sequencial_50' | '2by2'
  elasticPositions?: string[]
  specialInstructions?: string
}

export interface UserSessionData {
  id: number
  name: string
  phone: string
  cro: CRO
  address: Address
  clinicalPreferences: ClinicalPreferences
  isActive: boolean
  isRegisterComplete: boolean
  roles: 'CUSTOMER'[]
  createdAt: string
  updatedAt: string

  email: string
}
