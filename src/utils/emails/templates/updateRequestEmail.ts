import { formatOrderId } from '@/utils/text'

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

interface PopulatedRequest {
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

/**
 * Gera o corpo do e-mail em HTML para uma nova solicitação.
 * @param {object} doc - O documento completo da coleção 'requests'.
 * @returns {string} Uma string contendo o HTML do e-mail.
 */
export const updateRequestEmailHTML = (doc: PopulatedRequest) => {
  const clinicalPrefLabels = {
    passiveAligners: {
      sim_adicione: 'Sim, adicione',
      nao_adicione: 'Não adicione',
    },
    delayStage: {
      estagio_1: 'A partir do estágio 1',
      estagio_2: 'A partir do estágio 2',
      estagio_3: 'A partir do estágio 3',
      estagio_4: 'A partir do estágio 4',
    },
    incisalLeveling: {
      nivelar_borda: 'Sim, nivelar borda incisal',
      nao_nivelar: 'Não nivelar borda incisal',
    },
    elasticChain: {
      sim: 'Sim',
      nao: 'Não',
    },
    distalizationOptions: {
      sequencial_50: 'Sequencial (50% do movimento)',
      em_bloco_ate_2mm: 'Em bloco (até 2mm)',
    },
  }

  const statusLabels = {
    documentation_check: 'Verificando documentação',
    in_progress: 'Em andamento',
    completed: 'Caso finalizado',
  }

  const archLabels = {
    none: 'Nenhum',
    both: 'Ambos',
    upper: 'Superior',
    lower: 'Inferior',
  }

  const apRelationLabels = {
    improve_canine: 'Melhorar relação de canino',
    improve_canine_and_molar: 'Melhorar relação de canino e molar',
    improve_molar: 'Melhorar relação de molar',
    none: 'Nenhuma',
  }

  const elasticCutoutLabels = {
    right: 'Direito',
    left: 'Esquerdo',
    both: 'Ambos',
    none: 'Nenhum',
  }

  const paymentStatusLabels = {
    not_paid: 'Não Pago',
    paid: 'Pagamento Realizado',
  }

  const trackingStatusLabels = {
    not_sent: 'Não Enviado',
    preparing: 'Em Preparação',
    sent: 'Enviado',
    delivered: 'Recebido',
  }

  // --- Funções Auxiliares para Clareza ---
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatArray = (arr: []) => {
    if (!arr || arr.length === 0) return 'Nenhum'
    return arr.join(', ')
  }

  const prefs = doc.customer?.clinicalPreferences

  // --- Estilos CSS Inline para máxima compatibilidade ---
  const styles = {
    body: `font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; background-color: #f4f4f7; margin: 0; padding: 20px;`,
    container: `max-width: 700px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;`,
    header: `background-color: #0d1117; color: #ffffff; padding: 20px; text-align: center;`,
    headerTitle: `margin: 0; font-size: 24px;`,
    content: `padding: 25px 30px;`,
    sectionTitle: `font-size: 20px; color: #1a1a1a; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px; margin-top: 30px; margin-bottom: 20px;`,
    fieldGroup: `margin-bottom: 15px;`,
    label: `font-weight: bold; color: #555555; display: block; margin-bottom: 5px;`,
    value: `color: #333333; word-wrap: break-word;`,
    link: `color: #007bff; text-decoration: none;`,
    table: `width: 100%; border-collapse: collapse; margin-top: 10px;`,
    th: `border: 1px solid #dddddd; text-align: left; padding: 8px; background-color: #f9f9f9; font-weight: bold;`,
    td: `border: 1px solid #dddddd; text-align: left; padding: 8px;`,
    footer: `text-align: center; padding: 20px; font-size: 12px; color: #888888;`,
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Atualização na  Solicitação de Tratamento</title>
    </head>
    <body style="${styles.body}">
      <div style="${styles.container}">
        <div style="${styles.header}">
          <h1 style="${styles.headerTitle}">Nova Solicitação de Tratamento</h1>
        </div>
        <div style="${styles.content}">
          <h2 style="${styles.sectionTitle}">Informações Gerais</h2>
          
          <div style="${styles.fieldGroup}">
            <span style="${styles.label}">Paciente:</span>
            <span style="${styles.value}">${doc.patient || 'N/A'}</span>
          </div>
          <div style="${styles.fieldGroup}">
            <span style="${styles.label}">Doutor(a):</span>
            <span style="${styles.value}">${doc.customer?.name || 'N/A'}</span>
          </div>

           <div style="${styles.fieldGroup}">
            <span style="${styles.label}">Email do Doutor(a):</span>
            <span style="${styles.value}">${doc.customer?.email || 'N/A'}</span>
          </div>

          <div style="${styles.fieldGroup}">
            <span style="${styles.label}">Telefone do Doutor(a):</span>
            <span style="${styles.value}">${doc.customer?.phone || 'N/A'}</span>
          </div>

          <div style="${styles.fieldGroup}">
            <span style="${styles.label}">ID do Pedido:</span>
            <span style="${styles.value}">${doc.orderId ? formatOrderId(doc.orderId) : '-'}</span>
          </div>
          <div style="${styles.fieldGroup}">
            <span style="${styles.label}">Status da Prescrição:</span>
            <span style="${styles.value}">${statusLabels[doc.status] || doc.status}</span>
          </div>
           <div style="${styles.fieldGroup}">
            <span style="${styles.label}">Data de Conclusão:</span>
            <span style="${styles.value}">${formatDate(doc.completionDate || '')}</span>
          </div>
           <div style="${styles.fieldGroup}">
            <span style="${styles.label}">Informações Adicionais:</span>
            <p style="${styles.value}">${doc.additionalInfo || 'Nenhuma'}</p>
          </div>
          <div style="${styles.fieldGroup}">
            <span style="${styles.label}">Link de Acompanhamento (Planejamento Virtual):</span>
            ${doc.trackingLink ? `<a href="${doc.trackingLink}" style="${styles.link}" target="_blank">${doc.trackingLink}</a>` : '<span style="${styles.value}">Nenhum</span>'}
          </div>

           <h2 style="${styles.sectionTitle}">Preferências Clínicas do Doutor(a)</h2>
            <div style="${styles.fieldGroup}">
              <span style="${styles.label}">Adicionar alinhadores passivos:</span>
              <span style="${styles.value}">${clinicalPrefLabels.passiveAligners[prefs?.passiveAligners as 'sim_adicione'] || 'Não definido'}</span>
            </div>
            <div style="${styles.fieldGroup}">
              <span style="${styles.label}">Atrasar início do IPR para:</span>
              <span style="${styles.value}">${clinicalPrefLabels.delayStage[prefs?.delayIPRStage as 'estagio_1'] || 'Não definido'}</span>
            </div>
            <div style="${styles.fieldGroup}">
              <span style="${styles.label}">IPR máximo por face:</span>
              <span style="${styles.value}">${prefs?.maxIPR ? `${prefs.maxIPR} mm` : 'Não definido'}</span>
            </div>
            <div style="${styles.fieldGroup}">
              <span style="${styles.label}">Atrasar início dos Attachments para:</span>
              <span style="${styles.value}">${clinicalPrefLabels.delayStage[prefs?.delayAttachmentStage as 'estagio_1'] || 'Não definido'}</span>
            </div>
            <div style="${styles.fieldGroup}">
              <span style="${styles.label}">Nivelamento de borda incisal:</span>
              <span style="${styles.value}">${clinicalPrefLabels.incisalLeveling[prefs?.incisalLeveling as 'nivelar_borda'] || 'Não definido'}</span>
            </div>
            <div style="${styles.fieldGroup}">
              <span style="${styles.label}">Usar cadeia elástica virtual (power chain):</span>
              <span style="${styles.value}">${clinicalPrefLabels.elasticChain[prefs?.elasticChain as 'sim'] || 'Não definido'}</span>
            </div>
            <div style="${styles.fieldGroup}">
              <span style="${styles.label}">Opções de distalização:</span>
              <span style="${styles.value}">${clinicalPrefLabels.distalizationOptions[prefs?.distalizationOptions as 'sequencial_50'] || 'Não definido'}</span>
            </div>
            <div style="${styles.fieldGroup}">
              <span style="${styles.label}">Posições para recortes de elásticos (botões):</span>
              <span style="${styles.value}">${formatArray(prefs?.elasticPositions as [])}</span>
            </div>
            <div style="${styles.fieldGroup}">
              <span style="${styles.label}">Instruções especiais de preferência:</span>
              <p style="${styles.value}">${prefs?.specialInstructions || 'Nenhuma'}</p>
            </div>
         

          <!-- Definições do Tratamento -->
          <h2 style="${styles.sectionTitle}">Definições do Tratamento</h2>
          <div style="${styles.fieldGroup}">
            <span style="${styles.label}">Tratar arcada:</span>
            <span style="${styles.value}">${archLabels[doc.archToTreat] || doc.archToTreat}</span>
          </div>
          <div style="${styles.fieldGroup}">
            <span style="${styles.label}">Restrição de movimento SUPERIOR (Não movimentar):</span>
            <span style="${styles.value}">${formatArray(doc?.upperJawMovementRestriction as [])}</span>
          </div>
          <div style="${styles.fieldGroup}">
            <span style="${styles.label}">Restrição de movimento INFERIOR (Não movimentar):</span>
            <span style="${styles.value}">${formatArray(doc?.lowerJawMovementRestriction as [])}</span>
          </div>

          <!-- Relação A-P e Elásticos -->
          <h2 style="${styles.sectionTitle}">Relação A-P e Elásticos</h2>
          <div style="${styles.fieldGroup}">
            <span style="${styles.label}">Relação A-P - Arcada Superior:</span>
            <span style="${styles.value}">${apRelationLabels[doc.apRelationUpper as 'improve_canine'] || doc.apRelationUpper}</span>
          </div>
          <div style="${styles.fieldGroup}">
            <span style="${styles.label}">Relação A-P - Arcada Inferior:</span>
            <span style="${styles.value}">${apRelationLabels[doc.apRelationLower as 'improve_canine'] || doc.apRelationLower}</span>
          </div>
          <div style="${styles.fieldGroup}">
            <span style="${styles.label}">Orientações de distalização:</span>
            <p style="${styles.value}">${doc.distalizationInstructions || 'Nenhuma'}</p>
          </div>
          <div style="${styles.fieldGroup}">
            <span style="${styles.label}">Recortes para elástico ou botões:</span>
            <ul style="margin:0; padding-left: 20px;">
              <li>CUT para ELÁSTICO no canino: <strong>${elasticCutoutLabels[doc.elasticCutouts?.canineElastic as 'right']}</strong></li>
              <li>CUT para BOTÃO no canino: <strong>${elasticCutoutLabels[doc.elasticCutouts?.canineButton as 'right']}</strong></li>
              <li>CUT para ELÁSTICO no molar: <strong>${elasticCutoutLabels[doc.elasticCutouts?.molarElastic as 'right']}</strong></li>
              <li>CUT para BOTÃO no molar: <strong>${elasticCutoutLabels[doc.elasticCutouts?.molarButton as 'right']}</strong></li>
            </ul>
          </div>
          <div style="${styles.fieldGroup}">
            <span style="${styles.label}">Orientações específicas dos recortes:</span>
            <p style="${styles.value}">${doc.elasticCutoutInstructions || 'Nenhuma'}</p>
          </div>

          <!-- Attachments e IPR -->
          <h2 style="${styles.sectionTitle}">Attachments e IPR</h2>
          <div style="${styles.fieldGroup}">
            <span style="${styles.label}">Usar Attachments:</span>
            <span style="${styles.value}">${doc.useAttachments === 'yes' ? 'Sim, conforme necessário' : 'Não'}</span>
          </div>
          ${
            doc.useAttachments === 'yes'
              ? `
            <div style="${styles.fieldGroup}">
              <span style="${styles.label}">NÃO colocar attachments nos dentes superiores:</span>
              <span style="${styles.value}">${formatArray(doc.upperJawNoAttachments as [])}</span>
            </div>
            <div style="${styles.fieldGroup}">
              <span style="${styles.label}">NÃO colocar attachments nos dentes inferiores:</span>
              <span style="${styles.value}">${formatArray(doc.lowerJawNoAttachments as [])}</span>
            </div>
          `
              : ''
          }
          <div style="${styles.fieldGroup}">
            <span style="${styles.label}">Fazer IPR?</span>
            <span style="${styles.value}">${doc.performIPR === 'yes' ? 'Sim, conforme necessário (limite de 0,5mm)' : doc.performIPR === 'no' ? 'Não' : 'Detalhar IPR'}</span>
          </div>
          ${
            doc.performIPR === 'detail_below'
              ? `
            <div style="${styles.fieldGroup}">
              <span style="${styles.label}">Detalhes do IPR:</span>
              <p style="${styles.value}">${doc.iprDetails || 'Nenhum detalhe fornecido.'}</p>
            </div>
          `
              : ''
          }

          <!-- Instruções Finais -->
          <h2 style="${styles.sectionTitle}">Instruções Finais</h2>
          <div style="${styles.fieldGroup}">
            <span style="${styles.label}">Instruções para Diastemas:</span>
            <p style="${styles.value}">${doc.diastemaInstructions || 'Nenhuma'}</p>
          </div>
          <div style="${styles.fieldGroup}">
            <span style="${styles.label}">Orientações gerais de tratamento:</span>
            <p style="${styles.value}">${doc.generalInstructions || 'Nenhuma'}</p>
          </div>
          <div style="${styles.fieldGroup}">
            <span style="${styles.label}">Enviar link do planejamento por WhatsApp?</span>
            <span style="${styles.value}">${doc.sendWhatsappLink === 'yes' ? `Sim, para o número: ${doc.whatsappNumber}` : 'Não'}</span>
          </div>

          <!-- Pagamento e Envio -->
          <h2 style="${styles.sectionTitle}">Status de Pagamento e Envio</h2>
          <div style="${styles.fieldGroup}">
            <span style="${styles.label}">Status do Pagamento:</span>
            <span style="${styles.value}">${paymentStatusLabels[doc.payment?.status as 'paid'] || 'N/A'}</span>
          </div>
          <div style="${styles.fieldGroup}">
            <span style="${styles.label}">Status do Envio:</span>
            <span style="${styles.value}">${trackingStatusLabels[doc.tracking?.status as 'sent'] || 'N/A'}</span>
          </div>
        </div>
        <div style="${styles.footer}">
          <p>Este é um e-mail gerado automaticamente. Por favor, não responda.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

/**
 * Cria um assunto (subject) dinâmico e tipado para o e-mail de notificação.
 * @param {PopulatedRequest} doc - O documento populado da coleção 'requests'.
 * @returns {string} O assunto do e-mail.
 */
export const updateEmailSubject = (doc: PopulatedRequest): string => {
  // A tipagem garante que 'doc.customer' é um objeto com a propriedade 'name'
  const customerName = doc.customer?.name || 'Doutor(a) não especificado(a)'
  const patientName = doc.patient || 'Paciente não especificado'

  return `Atualização na Solicitação de Tratamento: ${patientName} (Dr(a). ${customerName})`
}
