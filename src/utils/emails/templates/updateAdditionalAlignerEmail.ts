import { AdditionalAligner, Customer } from '@/payload-types'

type Request = AdditionalAligner & { customer: Customer }

/**
 * Cria um assunto (subject) dinâmico e tipado para o e-mail de notificação.
 * @param {PopulatedRequest} doc - O documento populado da coleção 'requests'.
 * @returns {string} O assunto do e-mail.
 */
export const updateAdditionalAlignerEmailSubject = (doc: Request): string => {
  // A tipagem garante que 'doc.customer' é um objeto com a propriedade 'name'
  const customerName = doc.customer?.name || 'Doutor(a) não especificado(a)'
  const patientName = doc.patient || 'Paciente não especificado'

  return `Atualização na Solicitação de Alinhador Adicional: ${patientName} (Dr(a). ${customerName})`
}

export const updateAdditionalAlignerEmailHTML = (doc: AdditionalAligner) => {
  const mapAlignerType: Record<string, string> = {
    upper: 'Superior',
    lower: 'Inferior',
  }

  const statusLabels: Record<string, string> = {
    created: 'Pedido Feito',
    in_progress: 'Em Andamento',
    completed_not_paid: 'Em Andamento',
    completed: 'Finalizadas',
  }

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
      <title>Atualização na Solicitação de Alinhador Adicional</title>
    </head>
    <body style="${styles.body}">
      <div style="${styles.container}">
        <div style="${styles.header}">
          <h1 style="${styles.headerTitle}">Atualização na Solicitação de Alinhador Adicional</h1>
        </div>
        <div style="${styles.content}">
          <h2 style="${styles.sectionTitle}">Informações Gerais</h2>
          
          <div style="${styles.fieldGroup}">
            <span style="${styles.label}">Paciente:</span>
            <span style="${styles.value}">${doc.patient || 'N/A'}</span>
          </div>
          <div style="${styles.fieldGroup}">
            <span style="${styles.label}">Doutor(a):</span>
            <span style="${styles.value}">${
              //@ts-ignore
              doc.customer?.name || 'N/A'
            }</span>
          </div>

           <div style="${styles.fieldGroup}">
            <span style="${styles.label}">Email do Doutor(a):</span>
            <span style="${styles.value}">${
              //@ts-ignore
              doc.customer?.email || 'N/A'
            }</span>
          </div>

           <div style="${styles.fieldGroup}">
            <span style="${styles.label}">Telefone do Doutor(a):</span>
            <span style="${styles.value}">${
              //@ts-ignore
              doc.customer?.phone || 'N/A'
            }</span>
          </div>

          <div style="${styles.fieldGroup}">
            <span style="${styles.label}">ID do Pedido:</span>
            <span style="${styles.value}">${doc.orderId || 'Aguardando finalização'}</span>
          </div>
          <div style="${styles.fieldGroup}">
            <span style="${styles.label}">Status da Prescrição:</span>
            <span style="${styles.value}">${statusLabels[doc.status] || doc.status}</span>
          </div>

           <h2 style="${styles.sectionTitle}">Dados do Pedido:</h2>
            <div style="${styles.fieldGroup}">
              <span style="${styles.label}">Tipo de arcada:</span>
              <span style="${styles.value}">${mapAlignerType[doc.alignerType]}</span>
            </div>

             <div style="${styles.fieldGroup}">
              <span style="${styles.label}">Número do alinhador:</span>
              <span style="${styles.value}">${doc.alignerNumber}</span>
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
